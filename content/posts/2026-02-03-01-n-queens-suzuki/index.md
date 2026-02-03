---
title: "Ｎクイーン問題（１０２）Python/CodonでNの計測値がC/GPU-CUDAに追いついてしまった話"
date: 2026-02-03T13:24:30+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - アルゴリズム
  - 鈴木維一郎
  - Python
  - codon
---

![](chess.jpg)

![](codon.png)

# ソースコード
今回の連載 python/codonのソースコードディレクトリはこちら
https://github.com/suzukiiichiro/N-Queens/tree/master/13Bit_codon

## Ｎクイーン問題 過去記事アーカイブ
【過去記事アーカイブ】Ｎクイーン問題 過去記事一覧
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens



``` bash
Python/codon Ｎクイーン コンステレーション版 CUDA 高速ソルバ

   ,     #_
   ~\_  ####_        N-Queens
  ~~  \_#####\       https://suzukiiichiro.github.io/
  ~~     \###|       N-Queens for github
  ~~       \#/ ___   https://github.com/suzukiiichiro/N-Queens
   ~~       V~' '->
    ~~~         /
      ~~._.   _/
         _/ _/
       _/m/'

```

## 概要:
  コンステレーション（部分盤面の型）を事前生成し、各 constellation を独立タスクとして
  CPU（@par）または GPU（@gpu.kernel）で DFS 集計する高速 N-Queens ソルバーです。
  盤面衝突判定はビットボード（ld/rd/col）で O(1) にし、左右ミラー/回転の対称性を
  重み w_arr（2/4/8）として掛けて Total を復元します。

## 設計レビュー（この実装の要点）:
  - 「探索の分割」: constellation を生成してタスク化し、SoA（Structure of Arrays）へ展開して
    連続メモリで処理します（GPU/CPU 共通の前処理）。
  - 「非再帰 DFS」: 再帰を避け、固定長スタックで push/pop します。
      GPU: __array__[int](MAXD) + sp
      CPU: stack: List[Tuple[int,int,int,int,int,int]]
  - 「分岐モード」: functionid と meta_next / bitmask により、mark/jmark/base の挙動を切替えます。
  - 「ホットパスの 1bit 展開」:
      bit = a & -a
      avail[sp] = a ^ bit       # GPU
      avail &= avail-1          # CPU
  - 「次状態」:
      nld = (ld|bit)<<1
      nrd = (rd|bit)>>1
      nf  = board_mask & ~(nld|nrd|ncol)

## 注意（Codon/LLVM・GPU）:
  - GPU カーネル内では list/tuple 参照が重いので、Static[int] のビットマスクに焼き込み、
    (MASK >> f) & 1 で分岐判定します。
  - スタック深さ MAXD を超える場合は安全弁として早期 return します（誤動作より部分結果優先）。


## 計測結果

2026年  2月 2日 木曜日
Python/Codon amazon AWS m4.16xlarge x 1
suzuki@cudacodon$ codon build -release 18Py_constellations_cuda_codon.py
suzuki@cudacodon$ ./18Py_constellations_cuda_codon -c
CPU mode selected
 N:             Total         Unique        hh:mm:ss.ms
18:         666090624              0         0:00:02.127    ok
19:        4968057848              0         0:00:15.227    ok
20:       39029188884              0         0:02:00.875    ok

2026年  2月 2日 木曜日
Python/Codon amazon AWS m4.16xlarge x 1
suzuki@cudacodon$ codon build -release 18Py_constellations_cuda_codon.py
suzuki@cudacodon$ ./18Py_constellations_cuda_codon -g
GPU mode selected
 N:             Total         Unique        hh:mm:ss.ms
18:         666090624              0         0:00:12.056    ok
19:        4968057848              0         0:01:39.231    ok
20:       39029188884              0         0:12:54.135    ok


2023/11/22 現在の最高速実装（CUDA GPU 使用、Codon コンパイラ最適化版）
C/CUDA NVIDIA(GPU)
$ nvcc -O3 -arch=sm_61 -m64 -ptx -prec-div=false 04CUDA_Symmetry_BitBoard.cu && POCL_DEBUG=all ./a.out -n ;
対称解除法 GPUビットボード
18:         666090624        83263591    000:00:00:01.65
19:        4968057848       621012754    000:00:00:13.80
20:       39029188884      4878666808    000:00:02:02.52
21:      314666222712     39333324973    000:00:18:46.52
22:     2691008701644    336376244042    000:03:00:22.54
23:    24233937684440   3029242658210    001:06:03:49.29
24:   227514171973736  28439272956934    012:23:38:21.02
25:  2207893435808352 275986683743434    140:07:39:29.96"""


## 📚 ソースコード
``` python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

"""

   ,     #_
   ~\_  ####_        N-Queens
  ~~  \_#####\       https://suzukiiichiro.github.io/
  ~~     \###|       N-Queens for github
  ~~       \#/ ___   https://github.com/suzukiiichiro/N-Queens
   ~~       V~' '->
    ~~~         /
      ~~._.   _/
         _/ _/
       _/m/'

       
Python/codon Ｎクイーン コンステレーション版 CUDA 高速ソルバ


概要:
  コンステレーション（部分盤面の型）を事前生成し、各 constellation を独立タスクとして
  CPU（@par）または GPU（@gpu.kernel）で DFS 集計する高速 N-Queens ソルバーです。
  盤面衝突判定はビットボード（ld/rd/col）で O(1) にし、左右ミラー/回転の対称性を
  重み w_arr（2/4/8）として掛けて Total を復元します。

設計レビュー（この実装の要点）:
  - 「探索の分割」: constellation を生成してタスク化し、SoA（Structure of Arrays）へ展開して
    連続メモリで処理します（GPU/CPU 共通の前処理）。
  - 「非再帰 DFS」: 再帰を避け、固定長スタックで push/pop します。
      GPU: __array__[int](MAXD) + sp
      CPU: stack: List[Tuple[int,int,int,int,int,int]]
  - 「分岐モード」: functionid と meta_next / bitmask により、mark/jmark/base の挙動を切替えます。
  - 「ホットパスの 1bit 展開」:
      bit = a & -a
      avail[sp] = a ^ bit       # GPU
      avail &= avail-1          # CPU
  - 「次状態」:
      nld = (ld|bit)<<1
      nrd = (rd|bit)>>1
      nf  = board_mask & ~(nld|nrd|ncol)

注意（Codon/LLVM・GPU）:
  - GPU カーネル内では list/tuple 参照が重いので、Static[int] のビットマスクに焼き込み、
    (MASK >> f) & 1 で分岐判定します。
  - スタック深さ MAXD を超える場合は安全弁として早期 return します（誤動作より部分結果優先）。


2026年  2月 2日 木曜日
Python/Codon amazon AWS m4.16xlarge x 1
suzuki@cudacodon$ codon build -release 18Py_constellations_cuda_codon.py
suzuki@cudacodon$ ./18Py_constellations_cuda_codon -c
CPU mode selected
 N:             Total         Unique        hh:mm:ss.ms
18:         666090624              0         0:00:02.127    ok
19:        4968057848              0         0:00:15.227    ok
20:       39029188884              0         0:02:00.875    ok


2026年  2月 2日 木曜日
Python/Codon amazon AWS m4.16xlarge x 1
suzuki@cudacodon$ codon build -release 18Py_constellations_cuda_codon.py
suzuki@cudacodon$ ./18Py_constellations_cuda_codon -g
GPU mode selected
 N:             Total         Unique        hh:mm:ss.ms
18:         666090624              0         0:00:12.056    ok
19:        4968057848              0         0:01:39.231    ok
20:       39029188884              0         0:12:54.135    ok


2023/11/22 現在の最高速実装（CUDA GPU 使用、Codon コンパイラ最適化版）
C/CUDA NVIDIA(GPU)
$ nvcc -O3 -arch=sm_61 -m64 -ptx -prec-div=false 04CUDA_Symmetry_BitBoard.cu && POCL_DEBUG=all ./a.out -n ;
対称解除法 GPUビットボード
18:         666090624        83263591    000:00:00:01.65
19:        4968057848       621012754    000:00:00:13.80
20:       39029188884      4878666808    000:00:02:02.52
21:      314666222712     39333324973    000:00:18:46.52
22:     2691008701644    336376244042    000:03:00:22.54
23:    24233937684440   3029242658210    001:06:03:49.29
24:   227514171973736  28439272956934    012:23:38:21.02
25:  2207893435808352 275986683743434    140:07:39:29.96"""

import gpu
import sys
from typing import List,Set,Dict,Tuple
from datetime import datetime

MAXD:Static[int] = 32

"""  構造体配列 (SoA) タスク管理クラス """
class TaskSoA:
  """ コンストラクタ """
  def __init__(self, m: int):
    self.ld_arr: List[int] = [0]*m
    self.rd_arr: List[int] = [0]*m
    self.col_arr: List[int] = [0]*m
    self.row_arr: List[int] = [0]*m
    self.free_arr: List[int] = [0]*m
    self.jmark_arr: List[int] = [0]*m
    self.end_arr: List[int] = [0]*m
    self.mark1_arr: List[int] = [0]*m
    self.mark2_arr: List[int] = [0]*m
    self.funcid_arr: List[int] = [0]*m
    self.ijkl_arr: List[int] = [0]*m

""" CUDA GPU 用 DFS カーネル関数  """
@gpu.kernel
def kernel_dfs_iter_gpu(
    ld_arr, rd_arr, col_arr, row_arr, free_arr,
    jmark_arr, end_arr, mark1_arr, mark2_arr,
    funcid_arr, w_arr,
    meta_next:Ptr[u8],
    results,
    m: int, board_mask: int,
    n3:int,n4:int,
):
    """
    機能:
      GPU 上で「1 constellation = 1 thread」の DFS を非再帰で実行し、
      この constellation が担当する部分探索の解数を数えて results[i] に格納します。
      最終的に results[i] には（解数 * 対称性重み）を保存します。

    引数（抜粋）:
      ld_arr/rd_arr/col_arr/row_arr/free_arr:
        constellation ごとの開始状態（ビットボード）。
      funcid_arr:
        分岐モードID（functionid）。
      w_arr:
        対称性の重み（2/4/8）。results へ書く直前に掛けます。
      meta_next:
        functionid -> next functionid の遷移表（u8 配列）。
      board_mask:
        (1<<N)-1。ビットボードを常にこの範囲へ正規化します。
      m:
        タスク数（i >= m は処理しない）。

    前提/不変条件:
      - ld/rd/col/free は board_mask 内に収まる（念のため kernel 側でも &mask します）。
      - スタック深さ sp は 0..MAXD-1。超えた場合は安全弁で早期 return します。

    ホットパス（ソース引用）:
      bit = a & -a
      avail[sp] = a ^ bit
    """
    # NOTE: GPU では list/tuple 参照が遅くなりがちなので、
    #       分岐テーブルを Static[int] のビットマスクとして焼き込み、
    #       (MASK >> f) & 1 の O(1) 判定に寄せる。
    META_AVAIL_MASK:Static[int] = 69226252
    IS_BASE_MASK:Static[int]    = 69222408
    IS_JMARK_MASK:Static[int]   = 4
    IS_MARK_MASK:Static[int]    = 199213043
    SEL2_MASK:Static[int] = (1<<1) | (1<<6) | (1<<13) | (1<<17) | (1<<20) | (1<<25)
    STP3_MASK:Static[int] = (1<<4) | (1<<7) | (1<<15) | (1<<18) | (1<<22) | (1<<24)
    MASK_K_N3: Static[int] = 185471169
    MASK_K_N4: Static[int] = 4227088
    MASK_L_1: Static[int] = 12689458
    MASK_L_2: Static[int] = 17039488

    # u32 ビットボード系  int x12 xMAXD
    ld     = __array__[int](MAXD)
    rd     = __array__[int](MAXD)
    col    = __array__[int](MAXD)
    avail  = __array__[int](MAXD)
    row    = __array__[int](MAXD)
    step   = __array__[int](MAXD)
    add1   = __array__[int](MAXD)
    inited = __array__[u8](MAXD)
    ub     = __array__[u8](MAXD)
    # 消せる候補
    fid    = __array__[int](MAXD)
    # 消せる候補
    nextf  = __array__[int](MAXD)
    # 消せる候補
    fc     = __array__[u8](MAXD)
    bK=0
    bL=0
    inited[0] = u8(0)

    i = (gpu.block.x * gpu.block.dim.x) + gpu.thread.x
    if i >= m: return

    jmark = jmark_arr[i]
    endm  = end_arr[i]
    mark1 = mark1_arr[i]
    mark2 = mark2_arr[i]
    sp = 0
    fid[0]    = funcid_arr[i]
    ld[0]     = ld_arr[i]
    rd[0]     = rd_arr[i]
    col[0]    = col_arr[i]
    row[0]    = row_arr[i]

    free0 = free_arr[i] & board_mask
    if free0 == 0:
      results[i] = u64(0)
      return
    avail[0]  = free0
    total:u64 = u64(0)
    while sp >= 0:
      a = avail[sp]
      if a == 0:
        sp -= 1
        continue
      if inited[sp] == u8(0):
        inited[sp] = u8(1)
        f = fid[sp]
        nfid = meta_next[f]
        #######################################
        # 基底 is_base
        isb   = (IS_BASE_MASK    >> f) & 1
        #######################################
        if isb == 1 and row[sp] == endm:
          if f == 14: # SQd2B 特例
            total += u64(1) if (a >> 1) else u64(0)
          else:
            total += u64(1)
          sp -= 1
          continue
        #######################################
        # 通常状態設定
        aflag = (META_AVAIL_MASK >> f) & 1
        #######################################
        step[sp]  = 1
        add1[sp]  = 0
        use_blocks = 0
        use_future = 1 if (aflag == 1) else 0
        bK=0
        bL=0
        nextf[sp] = f
        #######################################
        # is_mark step=2/3 + block
        ism   = (IS_MARK_MASK    >> f) & 1
        #######################################
        # if is_mark[f] == 1:
        # if IS_MARK[f] == 1:
        # if t_ism[f] == 1:
        if ism == 1:
          at_mark = 0
          ###################
          # sel
          sel = 2 if ((SEL2_MASK >> f) & 1) else 1
          ###################
          if sel == 1:
            if row[sp] == mark1:
              at_mark = 1
          if sel == 2:
            if row[sp] == mark2:
              at_mark = 1
          ###################
          # mark
          ###################
          if at_mark and a:
            use_blocks = 1
            use_future = 0
            ###################
            # step
            step[sp] = 3 if ((STP3_MASK >> f) & 1) else 2
            ###################
            # add
            add1[sp] = 1 if f == 20 else 0
            ###################
            nextf[sp] = int(nfid)
        #######################################
        # is_jmark
        isj   = (IS_JMARK_MASK   >> f) & 1
        #######################################
        if isj == 1:
          if row[sp] == jmark:
            a &= ~1
            avail[sp] = a
            if a == 0:
              sp -= 1
              continue
            ld[sp] |= 1
            nextf[sp] = int(nfid)
        
        ub[sp] = u8(1) if use_blocks else u8(0)
        fc[sp] = u8(0)
        if use_future == 1 and (row[sp]+step[sp]) < endm:
          fc[sp] = u8(1)
      #----------------
      # 1bit 展開
      #----------------
      a = avail[sp]
      bit = a & -a
      avail[sp] = a ^ bit
      #----------------
      # 次状態計算（2値選択はそのまま）
      #----------------
      if ub[sp] == u8(1):
        f = fid[sp]
        bK = n3 * ((MASK_K_N3 >> f) & 1) + n4 * ((MASK_K_N4 >> f) & 1)
        bL = ((MASK_L_1 >> f) & 1) | (((MASK_L_2 >> f) & 1) << 1)  # + でもOKだが | が素直
        nld = ((ld[sp] | bit) << step[sp]) | add1[sp] | bL
        nrd = ((rd[sp] | bit) >> step[sp]) | bK
      else:
        nld = (ld[sp] | bit) << 1
        nrd = (rd[sp] | bit) >> 1
      ncol = col[sp] | bit
      nf = board_mask & ~(nld | nrd | ncol)
      if nf == 0:
        continue
      if fc[sp] == u8(1):
        if (board_mask & ~((nld << 1) | (nrd >> 1) | ncol)) == 0:
          continue
      #----------------
      # push
      #----------------
      parent = sp            # sp を増やす前のフレームを保持
      next_row = row[parent] + step[parent]
      sp += 1
      if sp >= MAXD:
        results[i] = total * w_arr[i]
        return
      inited[sp] = u8(0)
      fid[sp]    = nextf[sp-1]
      ld[sp]     = nld
      rd[sp]     = nrd
      col[sp]    = ncol
      row[sp]    = next_row
      avail[sp]  = nf

    results[i] = total * w_arr[i]

"""dfs()の非再帰版"""
def dfs_iter(
  meta, blockK, blockL, board_mask,
  functionid:int, ld:int, rd:int, col:int, row:int, free:int,
  jmark:int, endmark:int, mark1:int, mark2:int
)->u64:
  """
  機能:
    CPU 上で DFS を「非再帰（明示スタック）」で実行し、部分盤面（constellation）
    が持つ探索領域の解数（ユニーク側）を返す。

  引数:
    meta:
      functionid -> (next_funcid, funcptn, avail_flag) のテーブル。
      - funcptn: 段の種類（mark系 / jmark系 / base系）を表す。
      - avail_flag: “先読み枝刈りを使うか”のフラグ（+1 の先読みで枝を落とす）。
    blockK/blockL:
      mark 行で適用する追加ブロック値（bitboard へ OR する補正）。
      - step=2/3 で複数行をまとめて進める段で使用。
    board_mask:
      (1<<N)-1。ビットボード正規化に使用。
    functionid, ld, rd, col, row, free:
      現在状態（分岐モードID + ビットボード）。
    jmark/endmark/mark1/mark2:
      分岐トリガとなる行番号。

  返り値:
    u64: この constellation の解数（※対称性の重みは呼び出し側で掛ける）

  実装上のコツ（ソース引用）:
    bit = avail & -avail
    avail &= avail - 1

  注意:
    - Python 再帰を避け、push/pop を使ってホットパスのオーバーヘッドを抑える。
    - meta/blockK/blockL は exec_solutions() 側で整合するように与えること。
  """

  total:u64 = u64(0)

  # スタック要素: (functionid, ld, rd, col, row, free)
  # NOTE: 再帰呼び出しを使わずに pop → 展開 → push を回す
  stack: List[Tuple[int,int,int,int,int,int]] = [(functionid, ld, rd, col, row, free)]

  while stack:
    functionid, ld, rd, col, row, free = stack.pop()

    # 候補が無いなら終了（この枝は詰み）
    if not free:
      continue

    # functionid から「この段の振る舞い」を取得
    next_funcid, funcptn, avail_flag = meta[functionid]
    avail:int = free

    # ---- 基底: endmark 到達時の解カウント ----
    # funcptn==5 が “base” の段（実装側の割り当て）
    if funcptn == 5 and row == endmark:
      # functionid==14 は SQd2B の特例（右シフトで条件付き）
      if functionid == 14:
        total += u64(1) if (avail >> 1) else u64(0)
      else:
        total += u64(1)
      continue

    # ---- 既定設定（通常 step=1 で次の行へ）----
    step:int = 1
    add1:int = 0
    row_step:int = row + 1

    # mark 段で blockK/blockL を使うか
    use_blocks:bool = False

    # avail_flag==1 のとき「先読み枝刈り」を使う（+1 の先をチェック）
    use_future:bool = (avail_flag == 1)

    # 既定では functionid は維持（mark/jmark で遷移する場合のみ変更）
    local_next_funcid:int = functionid

    # ----------------------------------------------------------------------
    # 段の種類分岐（funcptn）
    #   - mark系: step=2/3 でまとめて進める（blockK/blockL を適用）
    #   - jmark系: 入口で列0禁止 + ld の LSB を立てる
    #   - base系 : 上で処理済み
    # ----------------------------------------------------------------------

    # ---- mark 行: step=2/3 + block ----
    if funcptn in (0, 1, 2):
      # funcptn により mark1 / mark2 を使い分ける（元実装の意図を保持）
      at_mark:bool = (row == mark1) if funcptn in (0, 2) else (row == mark2)

      # mark 行に一致し、かつ候補があるなら mark モードへ
      if at_mark and avail:
        # step=2: 2 行進める、step=3: 3 行進める
        step = 2 if funcptn in (0, 1) else 3

        # 一部 functionid（例: 20）で add1 を使う特例（既存ロジック踏襲）
        add1 = 1 if (funcptn == 1 and functionid == 20) else 0

        row_step = row + step

        # block テーブルの取得（functionid 毎に異なる）
        _blockK = blockK[functionid]
        _blockL = blockL[functionid]

        use_blocks = True

        # mark 段では “先読み”は使わない方針（既存実装）
        use_future = False

        # mark 段では functionid を next_funcid に遷移
        local_next_funcid = next_funcid

    # ---- jmark 特殊 ----
    elif funcptn == 3 and row == jmark:
      # 列0禁止（LSB を落とす）
      avail &= ~1

      # ld の LSB を立てる（実装意図: 特殊な禁止線/調整）
      ld |= 1

      local_next_funcid = next_funcid

      # 候補が消えたら終了
      if not avail:
        continue

    # ======================================================================
    # 以降は「候補を 1bit ずつ取り出して次状態を push」する本体
    # ======================================================================

    # ---- ループ１：mark 段（block 適用）----
    if use_blocks:
      while avail:
        # 最下位 1bit を取り出す
        bit:int = avail & -avail
        avail &= avail - 1

        # step=2/3 を反映した次状態（block を OR）
        nld:int  = ((ld | bit) << step) | add1 | _blockL
        nrd:int  = ((rd | bit) >> step) | _blockK
        ncol:int = col | bit

        # 次の空き（free）
        nf:int = board_mask & ~(nld | nrd | ncol)

        if nf:
          stack.append((local_next_funcid, nld, nrd, ncol, row_step, nf))
      continue

    # ---- ループ２：通常 +1（先読みなし）----
    if not use_future:
      while avail:
        bit:int = avail & -avail
        avail &= avail - 1

        nld:int  = (ld | bit) << 1
        nrd:int  = (rd | bit) >> 1
        ncol:int = col | bit
        nf:int   = board_mask & ~(nld | nrd | ncol)

        if nf:
          stack.append((local_next_funcid, nld, nrd, ncol, row_step, nf))
      continue

    # ---- ループ３：通常 +1（先読みあり）----
    # 終端付近は先読みしても得しないので短絡（既存実装の意図を尊重）
    if row_step >= endmark:
      while avail:
        bit:int = avail & -avail
        avail &= avail - 1
        nld:int  = (ld | bit) << 1
        nrd:int  = (rd | bit) >> 1
        ncol:int = col | bit
        nf:int   = board_mask & ~(nld | nrd | ncol)
        if nf:
          stack.append((local_next_funcid, nld, nrd, ncol, row_step, nf))
      continue

    # ---- ループ３B：先読み本体（次の次が 0 なら枝刈り）----
    while avail:
      bit:int = avail & -avail
      avail &= avail - 1

      nld:int  = (ld | bit) << 1
      nrd:int  = (rd | bit) >> 1
      ncol:int = col | bit
      nf:int   = board_mask & ~(nld | nrd | ncol)
      if not nf:
        continue

      # “次の次”の free が 0 なら、この枝は詰みなので push しない
      if board_mask & ~((nld << 1) | (nrd >> 1) | ncol):
        stack.append((local_next_funcid, nld, nrd, ncol, row_step, nf))

  return total

"""汎用 DFS カーネル。古い SQ???? 関数群を 1 本化し、func_meta の記述に従って(1) mark 行での step=2/3 + 追加ブロック、(2) jmark 特殊、(3) ゴール判定、(4) +1 先読み を切り替える。"""
def dfs(N:int,functionid:int,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int)->int:
  nq=nq_get(N)
  """汎用 DFS カーネル。古い SQ???? 関数群を 1 本化し、func_meta の記述に従って
  (1) mark 行での step=2/3 + 追加ブロック、(2) jmark 特殊、(3) ゴール判定、(4) +1 先読み
  を切り替える。引数:
  functionid: 現在の分岐モード ID（次の ID, パターン, 先読み有無は func_meta で決定）
  ld/rd/col:   斜線/列の占有
  row/free:    現在行と空きビット
  jmark/endmark/mark1/mark2: 特殊行/探索終端
  board_mask:  盤面全域のビットマスク
  blockK_by_funcid/blockL_by_funcid: 関数 ID に紐づく追加ブロック
  func_meta:   (next_id, funcptn, availptn) のメタ情報配列
  """
  # ---- ローカル束縛（属性アクセス最小化）----
  board_mask:int=nq._board_mask
  # N1:int=N-1
  # NJ:int=1<<N1
  next_funcid,funcptn,avail_flag=nq._meta[functionid]
  avail:int=free
  if not avail:return 0
  total=0
  # ---- N10:47 P6: 早期終了（基底）----
  if funcptn==5 and row==endmark:
    if functionid==14:# SQd2B 特例（列0以外が残っていれば1）
      return 1 if (avail>>1) else 0
    return 1
  # ---- P5: N1-jmark 行の入口（据え置き分岐）----
  # 既定（+1）
  step:int=1
  add1:int=0
  row_step:int=row+1
  use_blocks:bool=False  # blockK/blockL を噛ませるか
  use_future:bool=(avail_flag==1)  # _should_go_plus1 を使うか
  blockK:int=0
  blockL:int=0
  local_next_funcid:int=functionid
  # N10:538 P1/P2/P3: mark 行での step=2/3 ＋ block 適用を共通ループへ設定
  if funcptn in (0,1,2):
    at_mark:bool=(row==mark1) if funcptn in (0,2) else (row==mark2)
    if at_mark and avail:
      step=2 if funcptn in (0,1) else 3
      add1=1 if (funcptn==1 and functionid==20) else 0  # SQd1BlB のときだけ +1
      row_step=row+step
      blockK=nq._blockK[functionid]
      blockL=nq._blockL[functionid]
      use_blocks=True
      use_future=False
      local_next_funcid=next_funcid
  # ---- N10:3 P4: jmark 特殊（入口一回だけ）----
  elif funcptn==3 and row==jmark:
    avail&=~1     # 列0禁止
    ld|=1         # 左斜線LSBを立てる
    local_next_funcid=next_funcid
    if not avail:return 0
  # ==== N10:267 ループ１：block 適用（step=2/3 系のホットパス）====
  if use_blocks:
    while avail:
      bit:int=avail&-avail
      avail&=avail-1
      nld:int=((ld|bit)<<step)|add1|blockL
      nrd:int=((rd|bit)>>step)|blockK
      ncol:int=col|bit
      nf:int=board_mask&~(nld|nrd|ncol)
      if nf:
        total+=nq.dfs(N,local_next_funcid,nld,nrd,ncol,row_step,nf,jmark,endmark,mark1,mark2)
    return total
  # ==== N10:271 ループ２：+1 素朴（先読みなし）====
  elif not use_future:
    while avail:
      bit:int=avail&-avail
      avail&=avail-1
      nld:int=(ld|bit)<<1
      nrd:int=(rd|bit)>>1
      ncol:int=col|bit
      nf:int=board_mask&~(nld|nrd|ncol)
      if nf:
        # total += _dfs(local_next_funcid, nld, nrd, ncol, row_step, nf, jmark, endmark, mark1, mark2)
        total+=nq.dfs(N,local_next_funcid,nld,nrd,ncol,row_step,nf,jmark,endmark,mark1,mark2)
    return total
  # ==== N10:92 ループ３：+1 先読み（row_step >= endmark は基底で十分）====
  elif row_step>=endmark:
    #print("a_endmark")
    # もう1手置いたらゴール層に達する → 普通の分岐で十分
    while avail:
      bit:int=avail&-avail
      avail&=avail-1
      nld:int=((ld|bit)<<1)
      nrd:int=((rd|bit)>>1)
      ncol:int=col|bit
      nf:int=board_mask&~(nld|nrd|ncol)
      if nf:
        total+=nq.dfs(N,local_next_funcid,nld,nrd,ncol,row_step,nf,jmark,endmark,mark1,mark2)
    return total
  # ==== N10:402 ループ３B：+1 先読み本体（1手先の空きがゼロなら枝刈り）====
  while avail:
    #print("a_common")
    bit:int=avail&-avail
    avail&=avail-1
    nld:int=(ld|bit)<<1
    nrd:int=(rd|bit)>>1
    ncol:int=col|bit
    nf:int=board_mask&~(nld|nrd|ncol)
    if not nf:
      continue
    if board_mask&~((nld<<1)|(nrd>>1)|ncol):
      total+=nq.dfs(N,local_next_funcid,nld,nrd,ncol,row_step,nf,jmark,endmark,mark1,mark2)
  return total

""" constellations の一部を TaskSoA 形式に変換して返すユーティリティ """
def build_soa_for_range(
    N,
    constellations: List[Dict[str, int]],
    off: int,
    m: int,
    soa: TaskSoA,
    w_arr: List[u64]
) -> Tuple[TaskSoA, List[u64]]:
    """
    機能:
      constellations[off:off+m] を SoA（Structure of Arrays）へ展開し、
      DFS（CPU/GPU）の入力として必要な配列群を “同一 index” に揃えて埋める。
      さらに、対称性の重み（2/4/8）を w_arr に計算して格納する。

    目的（なぜ SoA か）:
      - dict 参照（ハッシュ）を探索ループから追い出し、前処理で配列へ変換する。
      - CPU(@par) / GPU(kernel) どちらでも「t 番のタスク状態」を連続配列から取り出せる。
      - GPU では AoS より SoA の方がメモリアクセス効率が良くなりやすい。

    引数:
      N:
        盤サイズ。
      constellations:
        タスク dict の配列。少なくとも "ld","rd","col","startijkl" を持つ。
      off, m:
        対象レンジ。t=0..m-1 に constellations[off+t] を詰める。
      soa:
        出力先の SoA（ld_arr/rd_arr/col_arr/... の配列群を保持）。
      w_arr:
        出力先の重み配列。w_arr[t] = symmetry(soa.ijkl_arr[t], N)。

    返り値:
      (soa, w_arr)

    前提/不変条件:
      - constellation["ld"], ["rd"], ["col"] はビットボード（board_mask 内が望ましい）。
      - constellation["startijkl"] は
          start = start_ijkl >> 20   （開始 row）
          ijkl  = start_ijkl & ((1<<20)-1) （開始星座 pack）
        という構造でパックされていること。
      - exec_solutions() 側の meta / blockK / blockL と、ここで選ぶ target(functionid) は整合必須。

    実装上のコツ（この関数の要点）:
      - startijkl から start(row) と ijkl(i,j,k,l pack) を復元し、
        そこから「探索開始時点の ld/rd/col/free」を再構築する。
      - その状態の特徴（j,k,l,start など）から、最適な分岐 target(functionid) と
        mark/jmark/endmark を決め、SoA へ格納する。
    """

    # ----------------------------------------
    # ビットマスク類（盤面幅の正規化に使う）
    # ----------------------------------------
    board_mask: int = (1 << N) - 1

    # small_mask は「N-2 幅」のマスク（N が小さいときは 0 幅を許容）
    # col を組み立てる際に ~small_mask を混ぜる設計（既存実装の意図を保持）
    small_mask: int = (1 << max(0, N - 2)) - 1

    # よく使う定数
    N1: int = N - 1
    N2: int = N - 2

    # 出力（soa は外から渡される前提。必要なら TaskSoA(m) を呼び出し側で確保）
    # soa = TaskSoA(m)
    # ----------------------------------------
    # レンジ分のタスクを SoA に詰める
    # ----------------------------------------
    for t in range(m):
        constellation = constellations[off + t]

        # 特殊行（後段 DFS で使う）
        #   - jmark: funcptn==3 のときに "row==jmark" で特別処理に入る
        #   - mark1/mark2: funcptn in (0,1,2) のときに "row==mark1/mark2" で mark段(step=2/3)に入る
        jmark = 0
        mark1 = 0
        mark2 = 0

        # startijkl: 上位に start(row)、下位20bitに ijkl pack を持つ
        #   start = start_ijkl >> 20  （探索開始行）
        #   ijkl  = start_ijkl & ((1<<20)-1) （開始星座(i,j,k,l)パック）
        start_ijkl = constellation["startijkl"]
        start = start_ijkl >> 20
        ijkl = start_ijkl & ((1 << 20) - 1)

        # ijkl から j,k,l を取り出し（i はここでは不要なので取っていない）
        j, k, l = getj(ijkl), getk(ijkl), getl(ijkl)

        # ----------------------------------------
        # 開始状態（ld/rd/col）の再構築
        #   - constellation 側の ld/rd/col は “ある基準”で作られているので、
        #     ここで start(row) に合わせて正規化・補正して探索入口に合わせる。
        # ----------------------------------------

        # ld/rd/col は 1bit シフトして “内部表現”を合わせている（既存設計）
        #   ※ dfs 側は「次段生成で <<1/>>1」するので、入口の位置合わせが重要
        ld = constellation["ld"] >> 1
        rd = constellation["rd"] >> 1

        # col: (col>>1) に ~small_mask を混ぜ、board_mask で正規化して盤面外ビットを落とす
        col = (constellation["col"] >> 1) | (~small_mask)

        # col を盤面幅へ正規化（上位ゴミビット除去）
        col &= board_mask

        # LD: j と l の列ビット（MSB側基準）を作る
        # 例: (1 << (N-1-j)) は列 j に相当
        LD = (1 << (N1 - j)) | (1 << (N1 - l))

        # ld は start 行に合わせて LD を右にずらして混ぜる（既存式のまま）
        ld |= LD >> (N - start)

        # rd 側の補正（start と k の関係で入れるビットが変わる）
        if start > k:
            rd |= (1 << (N1 - (start - k + 1)))

        # j がゲート条件を満たすとき rd へ追加補正
        if j >= 2 * N - 33 - start:
            rd |= (1 << (N1 - j)) << (N2 - start)

        # ----------------------------------------
        # free: 現在行(start)で置ける候補列
        # ----------------------------------------
        free = board_mask & ~(ld | rd | col)

        # ----------------------------------------
        # 分岐（現行の exec_solutions と同一）
        #   target(functionid) と mark/jmark/endmark を決める
        #
        # target (=functionid) は FID/SQラベルと 1:1 対応
        #   func_meta[functionid] = (next_funcid, funcptn, availptn)
        #     - funcptn: 段パターン
        #         0/1/2: mark系（row==mark1/mark2 で step=2/3 + block）
        #         3    : jmark系（row==jmark で列0禁止 + ld LSB）
        #         5    : base系（row==endmark で解カウント）
        #         4    : “通常”扱いに落ちる（dfs の else 経路に入る）
        #     - availptn: 1なら先読み枝刈りを有効化（dfs の use_future）
        # ----------------------------------------
        endmark = 0
        target = 0

        # 条件を事前に bool 化（枝の可読性/分岐コスト低減）
        j_lt_N3 = (j < N - 3)
        j_eq_N3 = (j == N - 3)
        j_eq_N2 = (j == N - 2)

        k_lt_l = (k < l)
        start_lt_k = (start < k)
        start_lt_l = (start < l)

        l_eq_kp1 = (l == k + 1)
        k_eq_lp1 = (k == l + 1)

        # j_gate: ある境界より j が大きいと “ゲートON” 扱い（既存設計）
        j_gate = (j > 2 * N - 34 - start)

        # --------------------------
        # case 1) j < N-3
        #   - “一般ケース”の大半
        #   - jmark = j+1, endmark = N-2
        #   - gate ON/OFF でターゲット（=functionid）を切り替える
        # --------------------------
        if j_lt_N3:
            # jmark: j+1 行で jmark 特殊を入れる設計
            jmark = j + 1

            # endmark: ここでは N-2 を終端とする
            endmark = N2

            if j_gate:
                # ---- ゲートON 側（より特殊な分岐）----
                if k_lt_l:
                    # mark 行は (k-1, l-1)（k<l のとき）
                    mark1, mark2 = k - 1, l - 1

                    if start_lt_l:
                        if start_lt_k:
                            # l==k+1 の特例で target を変える
                            target = 0 if (not l_eq_kp1) else 4
                            #  0: SQBkBlBjrB  meta=(1,0,0) -> P1, future=off, next=1
                            #  4: SQBklBjrB   meta=(2,2,0) -> P3, future=off, next=2
                        else:
                            target = 1
                            #  1: SQBlBjrB    meta=(2,1,0) -> P2, future=off, next=2
                    else:
                        target = 2
                        #  2: SQBjrB      meta=(3,3,1) -> P4(jmark系), future=on, next=3
                else:
                    # k>=l のときは mark を入れ替える
                    mark1, mark2 = l - 1, k - 1

                    if start_lt_k:
                        if start_lt_l:
                            # k==l+1 の特例で target を変える
                            target = 5 if (not k_eq_lp1) else 7
                            #  5: SQBlBkBjrB  meta=(6,0,0) -> P1, future=off, next=6
                            #  7: SQBlkBjrB   meta=(2,2,0) -> P3, future=off, next=2
                        else:
                            target = 6
                            #  6: SQBkBjrB    meta=(2,1,0) -> P2, future=off, next=2
                    else:
                        target = 2
                        #  2: SQBjrB      meta=(3,3,1) -> P4(jmark系), future=on, next=3
            else:
                # ---- ゲートOFF 側（比較的単純な分岐）----
                if k_lt_l:
                    mark1, mark2 = k - 1, l - 1
                    target = 8 if (not l_eq_kp1) else 9
                    #  8: SQBjlBkBlBjrB meta=(0,4,1) -> P5, future=on, next=0
                    #  9: SQBjlBklBjrB  meta=(4,4,1) -> P5, future=on, next=4
                else:
                    mark1, mark2 = l - 1, k - 1
                    target = 10 if (not k_eq_lp1) else 11
                    # 10: SQBjlBlBkBjrB meta=(5,4,1) -> P5, future=on, next=5
                    # 11: SQBjlBlkBjrB  meta=(7,4,1) -> P5, future=on, next=7

        # --------------------------
        # case 2) j == N-3
        #   - 境界ケース（N-3 列を含む開始星座）
        #   - endmark = N-2
        # --------------------------
        elif j_eq_N3:
            endmark = N2

            if k_lt_l:
                mark1, mark2 = k - 1, l - 1

                if start_lt_l:
                    if start_lt_k:
                        target = 12 if (not l_eq_kp1) else 15
                        # 12: SQd2BkBlB  meta=(13,0,0) -> P1, future=off, next=13
                        # 15: SQd2BklB   meta=(14,2,0) -> P3, future=off, next=14
                    else:
                        # ここでは mark2 のみを設定（意図: 特殊パターン）
                        mark2 = l - 1
                        target = 13
                        # 13: SQd2BlB    meta=(14,1,0) -> P2, future=off, next=14
                else:
                    target = 14
                    # 14: SQd2B      meta=(14,5,1) -> P6(base系), future=on, next=14
                    #     ※dfs_iter: functionid==14 の特例（SQd2B は endmark 到達時の数え方が違う）
            else:
                mark1, mark2 = l - 1, k - 1

                if start_lt_k:
                    if start_lt_l:
                        target = 16 if (not k_eq_lp1) else 18
                        # 16: SQd2BlBkB  meta=(17,0,0) -> P1, future=off, next=17
                        # 18: SQd2BlkB   meta=(14,2,0) -> P3, future=off, next=14
                    else:
                        mark2 = k - 1
                        target = 17
                        # 17: SQd2BkB    meta=(14,1,0) -> P2, future=off, next=14
                else:
                    target = 14
                    # 14: SQd2B      meta=(14,5,1) -> P6(base系), future=on, next=14（dfs 特例あり）

        # --------------------------
        # case 3) j == N-2
        #   - さらに境界（N-2 列）
        # --------------------------
        elif j_eq_N2:
            if k_lt_l:
                endmark = N2
                if start_lt_l:
                    if start_lt_k:
                        mark1 = k - 1
                        if not l_eq_kp1:
                            mark2 = l - 1
                            target = 19
                            # 19: SQd1BkBlB  meta=(20,0,0) -> P1, future=off, next=20
                        else:
                            target = 22
                            # 22: SQd1BklB   meta=(21,2,0) -> P3, future=off, next=21
                    else:
                        mark2 = l - 1
                        target = 20
                        # 20: SQd1BlB    meta=(21,1,0) -> P2, future=off, next=21
                        #     ※dfs_iter: functionid==20 のとき add1=1 特例（コメントの通り）
                else:
                    target = 21
                    # 21: SQd1B      meta=(21,5,1) -> P6(base系), future=on, next=21
            else:
                if start_lt_k:
                    if start_lt_l:
                        if k < N2:
                            mark1, endmark = l - 1, N2
                            if not k_eq_lp1:
                                mark2 = k - 1
                                target = 23
                                # 23: SQd1BlBkB  meta=(25,0,0) -> P1, future=off, next=25
                            else:
                                target = 24
                                # 24: SQd1BlkB   meta=(21,2,0) -> P3, future=off, next=21
                        else:
                            if l != (N - 3):
                                mark2, endmark = l - 1, N - 3
                                target = 20
                                # 20: SQd1BlB    meta=(21,1,0) -> P2, future=off, next=21（add1 特例）
                            else:
                                endmark = N - 4
                                target = 21
                                # 21: SQd1B      meta=(21,5,1) -> P6(base系), future=on, next=21
                    else:
                        if k != N2:
                            mark2, endmark = k - 1, N2
                            target = 25
                            # 25: SQd1BkB    meta=(21,1,0) -> P2, future=off, next=21
                        else:
                            endmark = N - 3
                            target = 21
                            # 21: SQd1B      meta=(21,5,1) -> P6(base系), future=on, next=21
                else:
                    endmark = N2
                    target = 21
                    # 21: SQd1B      meta=(21,5,1) -> P6(base系), future=on, next=21

        # --------------------------
        # case 4) それ以外（j がさらに大きい等）
        #   - SQd0 系へ落ちる
        # --------------------------
        else:
            endmark = N2
            if start > k:
                target = 26
                # 26: SQd0B     meta=(26,5,1) -> P6(base系), future=on, next=26
            else:
                mark1 = k - 1
                target = 27
                # 27: SQd0BkB   meta=(26,0,0) -> P1, future=off, next=26

        # ----------------------------------------
        # SoA へ格納（t番目）
        #   row_arr[t] は start（探索開始行）
        #   ijkl_arr[t] は “開始星座 pack（下位20bit）”
        # ----------------------------------------
        soa.ld_arr[t] = ld
        soa.rd_arr[t] = rd
        soa.col_arr[t] = col
        soa.row_arr[t] = start
        soa.free_arr[t] = free
        soa.jmark_arr[t] = jmark
        soa.end_arr[t] = endmark
        soa.mark1_arr[t] = mark1
        soa.mark2_arr[t] = mark2
        soa.funcid_arr[t] = target
        soa.ijkl_arr[t] = ijkl

    # ----------------------------------------
    # w_arr（対称性重み 2/4/8）
    #   - この重みは「ユニーク解数 → トータル解数」への復元係数
    #   - 後段で results[t] *= w_arr[t] の形で使う
    # ----------------------------------------
    @par
    for t in range(m):
        w_arr[t] = symmetry(soa.ijkl_arr[t], N)

    return soa, w_arr

"""各 Constellation（部分盤面）ごとに最適分岐（functionid）を選び、`dfs()` で解数を取得。 結果は `solutions` に書き込み、最後に `symmetry()` の重みで補正する。前段で SoA 展開し 並列化区間のループ体を軽量化。"""
def exec_solutions(N:int,constellations:List[Dict[str,int]],use_gpu:bool)->None:
  """
  機能:
    すべての constellation について DFS を実行し、各 constellation["solutions"] に
    「その constellation が代表する解数（対称性重み込み）」を格納します。

  処理の流れ:
    1) functionid のカテゴリ分けや meta テーブルを構築（分岐モードの定義）
    2) SoA を構築して（CPU なら @par、GPU なら kernel）で解数を列挙
    3) results / out を constellation 側へ書き戻す

  引数:
    N: 盤サイズ
    constellations: タスク（dict）のリスト
    use_gpu: True なら GPU 実行、False なら CPU 実行

  注意:
    - GPU は STEPS 件ずつ処理するため、投入回数と転送コストのトレードオフがあります。
    - CPU はホットパスを dfs_iter() に集約し、並列は @par に寄せています。
  """
  N1:int = N - 1
  N2:int = N - 2
  board_mask:int = (1 << N) - 1
  FUNC_CATEGORY={
    # N-3
    "SQBkBlBjrB":3,"SQBlkBjrB":3,"SQBkBjrB":3,
    "SQd2BkBlB":3,"SQd2BkB":3,"SQd2BlkB":3,
    "SQd1BkBlB":3,"SQd1BlkB":3,"SQd1BkB":3,"SQd0BkB":3,
    # N-4
    "SQBklBjrB":4,"SQd2BklB":4,"SQd1BklB":4,
    # 0（上記以外）
    "SQBlBjrB":0,"SQBjrB":0,"SQB":0,"SQBlBkBjrB":0,
    "SQBjlBkBlBjrB":0,"SQBjlBklBjrB":0,"SQBjlBlBkBjrB":0,"SQBjlBlkBjrB":0,
    "SQd2BlB":0,"SQd2B":0,"SQd2BlBkB":0,
    "SQd1BlB":0,"SQd1B":0,"SQd1BlBkB":0,"SQd0B":0
  }
  FID={
    "SQBkBlBjrB":0,"SQBlBjrB":1,"SQBjrB":2,"SQB":3,
    "SQBklBjrB":4,"SQBlBkBjrB":5,"SQBkBjrB":6,"SQBlkBjrB":7,
    "SQBjlBkBlBjrB":8,"SQBjlBklBjrB":9,"SQBjlBlBkBjrB":10,"SQBjlBlkBjrB":11,
    "SQd2BkBlB":12,"SQd2BlB":13,"SQd2B":14,"SQd2BklB":15,"SQd2BlBkB":16,
    "SQd2BkB":17,"SQd2BlkB":18,"SQd1BkBlB":19,"SQd1BlB":20,"SQd1B":21,
    "SQd1BklB":22,"SQd1BlBkB":23,"SQd1BlkB":24,"SQd1BkB":25,"SQd0B":26,"SQd0BkB":27
  }

  # next_funcid, funcptn, availptn の3つだけ持つ
  func_meta=[
    (1,0,0),#  0 SQBkBlBjrB   -> P1, 先読みなし
    (2,1,0),#  1 SQBlBjrB     -> P2, 先読みなし
    (3,3,1),#  2 SQBjrB       -> P4, 先読みあり
    (3,5,1),#  3 SQB          -> P6, 先読みあり
    (2,2,0),#  4 SQBklBjrB    -> P3, 先読みなし
    (6,0,0),#  5 SQBlBkBjrB   -> P1, 先読みなし
    (2,1,0),#  6 SQBkBjrB     -> P2, 先読みなし
    (2,2,0),#  7 SQBlkBjrB    -> P3, 先読みなし
    (0,4,1),#  8 SQBjlBkBlBjrB-> P5, 先読みあり
    (4,4,1),#  9 SQBjlBklBjrB -> P5, 先読みあり
    (5,4,1),# 10 SQBjlBlBkBjrB-> P5, 先読みあり
    (7,4,1),# 11 SQBjlBlkBjrB -> P5, 先読みあり
    (13,0,0),# 12 SQd2BkBlB    -> P1, 先読みなし
    (14,1,0),# 13 SQd2BlB      -> P2, 先読みなし
    (14,5,1),# 14 SQd2B        -> P6, 先読みあり（avail 特例）
    (14,2,0),# 15 SQd2BklB     -> P3, 先読みなし
    (17,0,0),# 16 SQd2BlBkB    -> P1, 先読みなし
    (14,1,0),# 17 SQd2BkB      -> P2, 先読みなし
    (14,2,0),# 18 SQd2BlkB     -> P3, 先読みなし
    (20,0,0),# 19 SQd1BkBlB    -> P1, 先読みなし
    (21,1,0),# 20 SQd1BlB      -> P2, 先読みなし（add1=1 は dfs 内で特別扱い）
    (21,5,1),# 21 SQd1B        -> P6, 先読みあり
    (21,2,0),# 22 SQd1BklB     -> P3, 先読みなし
    (25,0,0),# 23 SQd1BlBkB    -> P1, 先読みなし
    (21,2,0),# 24 SQd1BlkB     -> P3, 先読みなし
    (21,1,0),# 25 SQd1BkB      -> P2, 先読みなし
    (26,5,1),# 26 SQd0B        -> P6, 先読みあり
    (26,0,0),# 27 SQd0BkB      -> P1, 先読みなし
  ]
  F = len(func_meta)
  is_base  = [0]*F   # ptn==5
  is_jmark = [0]*F   # ptn==3
  is_mark  = [0]*F   # ptn in {0,1,2}

  mark_sel  = [0]*F  # 0:none 1:mark1 2:mark2
  mark_step = [1]*F  # 1 or 2 or 3
  mark_add1 = [0]*F  # 0/1
  for f,(nxt,ptn,aflag) in enumerate(func_meta):
      if ptn == 5:
          is_base[f] = 1
      elif ptn == 3:
          is_jmark[f] = 1
      elif ptn == 0 or ptn == 1 or ptn == 2:
          is_mark[f] = 1
          if ptn == 1:
              mark_sel[f]  = 2
              mark_step[f] = 2
              if f == 20:
                  mark_add1[f] = 1
          else:
              mark_sel[f]  = 1
              mark_step[f] = 2 if ptn == 0 else 3

  n3=1<<max(0,N-3)   # 念のため負シフト防止
  n4=1<<max(0,N-4)   # N3,N4とは違います
  # ===== 前処理ステージ（単一スレッド） =====
  m=len(constellations)
  # ===== GPU分割設定 =====
  BLOCK = 256 # C版の既定 24576 に寄せる/あるいは 16384, 32768 などを試す
  # ★ 1回の kernel 起動で使う最大ブロック数（=「GPU同時実行数」的な上限）
  #   ここを小さくすると 1回の投入量が減り、呼び出し回数が増えます
  MAX_BLOCKS = 32 
  STEPS = BLOCK * MAX_BLOCKS
  # STEPS = 24576 if use_gpu else m_all
  # STEPS=24576
  m_all = len(constellations)

  # w_pre: List[u64] = [u64(0)] * m_all
  # for i in range(m_all):
  #     w_pre[i] = u64(symmetry(constellations[i]["startijkl"], N))




  ##########
  # GPU
  ##########
  if use_gpu:
    soa:TaskSoA = TaskSoA(STEPS)
    results: List[u64] = [u64(0)] * STEPS
    # results_allはm_all
    results_all: List[u64] = [u64(0)] * m_all
    w_arr: List[u64] = [u64(0)] * STEPS

    meta_next: List[u8] = [ u8(1),u8(2),u8(3),u8(3),u8(2),u8(6),u8(2),u8(2), u8(0),u8(4),u8(5),u8(7),u8(13),u8(14),u8(14),u8(14), u8(17),u8(14),u8(14),u8(20),u8(21),u8(21),u8(21),u8(25), u8(21),u8(21),u8(26),u8(26) ]
    # ===== STEPS件ずつ処理 =====
    off = 0
    # u8 の 28要素デバイス配列を用意
    # meta_next = ( [1,2,3,3,2,6,2,2,0,4,5,7,13,14,14,14,17,14,14,20,21,21,21,25,21,21,26,26])
    n3 = 1 << (N - 3)
    n4 = 1 << (N - 4)
    while off < m_all:
      m = min(STEPS, m_all - off)
      # 戻り値を使わないので破棄
      build_soa_for_range(N,constellations, off, m,soa,w_arr)
      GRID = (m + BLOCK - 1) // BLOCK
      kernel_dfs_iter_gpu(
        gpu.raw(soa.ld_arr), gpu.raw(soa.rd_arr), gpu.raw(soa.col_arr),
        gpu.raw(soa.row_arr), gpu.raw(soa.free_arr),
        gpu.raw(soa.jmark_arr), gpu.raw(soa.end_arr),
        gpu.raw(soa.mark1_arr), gpu.raw(soa.mark2_arr),
        gpu.raw(soa.funcid_arr), gpu.raw(w_arr),
        gpu.raw(meta_next),
        gpu.raw(results),
        m, board_mask,
        n3, n4,
        grid=GRID, block=BLOCK
      )
      @par
      for i in range(m):
        results_all[off + i] = results[i]
      off += m
  ##########
  # CPU 
  ##########
  else:
    soa:TaskSoA = TaskSoA(m_all)
    results: List[u64] = [u64(0)] * m_all
    results_all: List[u64] = [u64(0)] * m_all
    w_arr: List[u64] = [u64(0)] * m_all

    size=max(FID.values())+1
    blockK_by_funcid=[0]*size
    blockL_by_funcid=[0,1,0,0,1,1,0,2,0,0,0,0,0,1,0,1,1,0,2,0,0,0,1,1,2,0,0,0]
    for fn,cat in FUNC_CATEGORY.items():# FUNC_CATEGORY: {関数名: 3 or 4 or 0}
      fid=FID[fn]
      blockK_by_funcid[fid]=n3 if cat==3 else (n4 if cat==4 else 0)

    m_all = len(constellations) # CPUは全件を1回で SoA + w_arr を作る（これがないと壊れる）
    if m_all == 0:
      return
    soa, w_arr = build_soa_for_range(N,constellations, 0, m_all, soa, w_arr)
    results:List[u64] = [u64(0)] * m_all
    @par
    for i in range(m_all):
      cnt:u64 = dfs_iter(func_meta,blockK_by_funcid,blockL_by_funcid,board_mask,soa.funcid_arr[i],
            soa.ld_arr[i], soa.rd_arr[i], soa.col_arr[i], soa.row_arr[i],
            soa.free_arr[i], soa.jmark_arr[i], soa.end_arr[i],
            soa.mark1_arr[i], soa.mark2_arr[i])
      results[i]=cnt*w_arr[i]
  ##########
  # 集計   
  ##########
  if use_gpu:
    out = results_all
  else:
    out = results
  for i, constellation in enumerate(constellations):
    constellation["solutions"] = int(out[i])

####################################################
#
# utility
#
####################################################

""" splitmix64 ミキサ最終段 """
def mix64(x:u64)->u64:
  x=(x^(x>>u64(30)))*u64(0xBF58476D1CE4E5B9)
  x=(x^(x>>u64(27)))*u64(0x94D049BB133111EB)
  x^=(x>>u64(31))
  return x

""" Zobrist テーブル用乱数リスト生成 """
def gen_list(cnt:int,seed:u64)->List[u64]:
  out:List[u64]=[]
  s:u64=seed
  # _mix64=self.mix64
  for _ in range(cnt):
    s=s+u64(0x9E3779B97F4A7C15)
    out.append(mix64(s))
  return out

""" Zobrist テーブル初期化 """
# def init_zobrist(N:int)->None:
def init_zobrist(N:int,zobrist_hash_tables: Dict[int, Dict[str, List[u64]]])->Dict[str,List[u64]]:
  if N in zobrist_hash_tables:
    return zobrist_hash_tables[N]
  base_seed:u64=(u64(0xC0D0_0000_0000_0000)^(u64(N)<<u64(32)))
  tbl:Dict[str,List[u64]]={
    'ld':gen_list(N,base_seed^u64(0x01)),
    'rd':gen_list(N,base_seed^u64(0x02)),
    'col':gen_list(N,base_seed^u64(0x03)),
    'LD':gen_list(N,base_seed^u64(0x04)),
    'RD':gen_list(N,base_seed^u64(0x05)),
    'row':gen_list(N,base_seed^u64(0x06)),
    'queens':gen_list(N,base_seed^u64(0x07)),
    'k':gen_list(N,base_seed^u64(0x08)),
    'l':gen_list(N,base_seed^u64(0x09)),
  }
  """ キャッシュ保存 """
  zobrist_hash_tables[N]=tbl
  return tbl

""" Zobrist Hash を用いた盤面の 64bit ハッシュ値生成  """
def zobrist_hash(N:int, ld: int, rd: int, col: int, row: int, queens: int, k: int, l: int, LD: int, RD: int,zobrist_hash_tables:Dict[int, Dict[str, List[u64]]]) -> u64:
  tbl: Dict[str, List[u64]] = init_zobrist(N,zobrist_hash_tables)

  # ここでテーブルが u64 で作られている前提（init_zobrist側も u64 に）
  ld_tbl  = tbl["ld"]    # List[u64]
  rd_tbl  = tbl["rd"]    # List[u64]
  col_tbl = tbl["col"]   # List[u64]
  LD_tbl  = tbl["LD"]    # List[u64]
  RD_tbl  = tbl["RD"]    # List[u64]
  row_tbl = tbl["row"]   # List[u64]
  q_tbl   = tbl["queens"]# List[u64]
  k_tbl   = tbl["k"]     # List[u64]
  l_tbl   = tbl["l"]     # List[u64]

  # mask は u64 で作る（1<<N が int のままだと型が揺れやすい）
  mask: u64 = (u64(1) << u64(N)) - u64(1)

  # 入力ビット集合を u64 に揃えてマスク
  ld64: u64  = u64(ld)  & mask
  rd64: u64  = u64(rd)  & mask
  col64: u64 = u64(col) & mask
  LD64: u64  = u64(LD)  & mask
  RD64: u64  = u64(RD)  & mask

  h: u64 = u64(0)

  m: u64 = ld64
  i: int = 0
  while i < N:
    if (m & u64(1)) != u64(0):
      h ^= u64(ld_tbl[i])
    m >>= u64(1)
    i += 1

  m = rd64; i = 0
  while i < N:
    if (m & u64(1)) != u64(0):
      h ^= u64(rd_tbl[i])
    m >>= u64(1)
    i += 1

  m = col64; i = 0
  while i < N:
    if (m & u64(1)) != u64(0):
      h ^= u64(col_tbl[i])
    m >>= u64(1)
    i += 1

  m = LD64; i = 0
  while i < N:
    if (m & u64(1)) != u64(0):
      h ^= u64(LD_tbl[i])
    m >>= u64(1)
    i += 1

  m = RD64; i = 0
  while i < N:
    if (m & u64(1)) != u64(0):
      h ^= u64(RD_tbl[i])
    m >>= u64(1)
    i += 1

  if 0 <= row < N:
    h ^= u64(row_tbl[row])
  if 0 <= queens < N:
    h ^= u64(q_tbl[queens])
  if 0 <= k < N:
    h ^= u64(k_tbl[k])
  if 0 <= l < N:
    h ^= u64(l_tbl[l])

  return h

"""(i,j,k,l) を 5bit×4=20bit にパック/アンパックするユーティリティ。 mirvert は上下ミラー（行: N-1-?）＋ (k,l) の入れ替えで左右ミラー相当を実現。"""
def to_ijkl(i:int,j:int,k:int,l:int)->int:return (i<<15)+(j<<10)+(k<<5)+l
def mirvert(ijkl:int,N:int)->int:return to_ijkl(N-1-geti(ijkl),N-1-getj(ijkl),getl(ijkl),getk(ijkl))
def ffmin(a:int,b:int)->int:return min(a,b)
def geti(ijkl:int)->int:return (ijkl>>15)&0x1F
def getj(ijkl:int)->int:return (ijkl>>10)&0x1F
def getk(ijkl:int)->int:return (ijkl>>5)&0x1F
def getl(ijkl:int)->int:return ijkl&0x1F

"""(i,j,k,l) パック値に対して盤面 90°/180° 回転を適用した新しいパック値を返す。 回転の定義: (r,c) -> (c, N-1-r)。対称性チェック・正規化に利用。"""
def rot90(ijkl:int,N:int)->int:return ((N-1-getk(ijkl))<<15)+((N-1-getl(ijkl))<<10)+(getj(ijkl)<<5)+geti(ijkl)
def rot180(ijkl:int,N:int)->int:return ((N-1-getj(ijkl))<<15)+((N-1-geti(ijkl))<<10)+((N-1-getl(ijkl))<<5)+(N-1-getk(ijkl))
def symmetry(ijkl:int,N:int)->u64:return u64(2) if symmetry90(ijkl,N) else u64(4) if geti(ijkl)==N-1-getj(ijkl) and getk(ijkl)==N-1-getl(ijkl) else u64(8)
def symmetry90(ijkl:int,N:int)->bool:return ((geti(ijkl)<<15)+(getj(ijkl)<<10)+(getk(ijkl)<<5)+getl(ijkl))==(((N-1-getk(ijkl))<<15)+((N-1-getl(ijkl))<<10)+(getj(ijkl)<<5)+geti(ijkl))

"""与えた (i,j,k,l) の 90/180/270° 回転形が既出集合 ijkl_list に含まれるかを判定する。"""
def check_rotations(ijkl_list:Set[int],i:int,j:int,k:int,l:int,N:int)->bool:
  return any(rot in ijkl_list for rot in [((N-1-k)<<15)+((N-1-l)<<10)+(j<<5)+i,((N-1-j)<<15)+((N-1-i)<<10)+((N-1-l)<<5)+(N-1-k),(l<<15)+(k<<10)+((N-1-i)<<5)+(N-1-j)])

""" キャッシュ付き Jasmin 正規化ラッパー """
def get_jasmin(N:int,c:int)->int:
  """ Jasmin 正規化のキャッシュ付ラッパ。盤面パック値 c を回転/ミラーで規約化した代表値を返す。
  ※ キャッシュは self.jasmin_cache[(c,N)] に保持。
  [Opt-08] キャッシュ付き jasmin() のラッパー """
  jasmin_cache:Dict[Tuple[int,int],int]={}
  # self.jasmin_cache:Dict[Tuple[int,int],int]={}
  key=(c,N)
  if key in jasmin_cache:
    return jasmin_cache[key]
  result=jasmin(c,N)
  jasmin_cache[key]=result
  return result

""" Jasmin 正規化。盤面パック値 ijkl を回転/ミラーで規約化した代表値を返す。"""
def jasmin(ijkl:int,N:int)->int:
  # 最初の最小値と引数を設定
  arg=0
  min_val=ffmin(getj(ijkl),N-1-getj(ijkl))
  # i: 最初の行（上端） 90度回転2回
  if ffmin(geti(ijkl),N-1-geti(ijkl))<min_val:
    arg=2
    min_val=ffmin(geti(ijkl),N-1-geti(ijkl))
  # k: 最初の列（左端） 90度回転3回
  if ffmin(getk(ijkl),N-1-getk(ijkl))<min_val:
    arg=3
    min_val=ffmin(getk(ijkl),N-1-getk(ijkl))
  # l: 最後の列（右端） 90度回転1回
  if ffmin(getl(ijkl),N-1-getl(ijkl))<min_val:
    arg=1
    min_val=ffmin(getl(ijkl),N-1-getl(ijkl))
  # 90度回転を arg 回繰り返す
  _rot90=rot90
  for _ in range(arg):
    # ijkl=rot90(ijkl,N)
    ijkl=_rot90(ijkl,N)
  # 必要に応じて垂直方向のミラーリングを実行
  if getj(ijkl)<N-1-getj(ijkl):
    ijkl=mirvert(ijkl,N)
  return ijkl

####################################################
#
# cache
#
####################################################

"""サブコンステレーション生成のキャッシュ付ラッパ。StateKey で一意化し、 同一状態での重複再帰を回避して生成量を抑制する。"""
def set_pre_queens_cached(
  N:int,
  ijkl_list:Set[int],
  subconst_cache:set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],
  ld:int, rd:int, col:int,
  k:int, l:int,
  row:int, queens:int,
  LD:int, RD:int,
  counter:List[int],
  constellations:List[Dict[str,int]],
  preset_queens:int,
  visited:Set[int],
  constellation_signatures:Set[Tuple[int,int,int,int,int,int]],
  zobrist_hash_tables: Dict[int, Dict[str, List[u64]]]
)->Tuple[Set[int], Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]], List[Dict[str,int]], int]:
  """
  機能:
    `set_pre_queens()` の“入口”にキャッシュを付け、
    同じ (ld,rd,col,k,l,row,queens,LD,RD,N,preset_queens) の状態からの
    サブコンステレーション生成を重複実行しないようにする。

  引数:
    N / preset_queens:
      キャッシュキーに含める（同じ ld/rd/col でも N や preset が違えば別問題）。
    ijkl_list:
      生成過程で参照・更新される開始星座集合（必要なら追加されうる）。
    subconst_cache:
      “この実行内”での重複抑止集合。key が存在する場合は何もせず戻る。
    ld,rd,col,k,l,row,queens,LD,RD:
      set_pre_queens に渡す状態。
    counter/constellations:
      set_pre_queens が constellation を append するための出力先。
    visited/constellation_signatures/zobrist_hash_tables:
      set_pre_queens 内部の枝刈り・重複排除用。

  返り値:
    (ijkl_list, subconst_cache, constellations, preset_queens)
    ※現行の上位呼び出し側の受けを崩さないためにこの形に揃える。

  実装上のコツ:
    - “キャッシュ登録してから本体呼び出し”にすることで、
      並行再入（同一状態からの重複突入）も抑止できる設計。
  """

  # ---- キャッシュキー（状態を丸ごと）----
  # NOTE: queens や row も含めるので「途中段の重複」も止められる。
  key:Tuple[int,int,int,int,int,int,int,int,int,int,int] = (
    ld, rd, col, k, l, row, queens, LD, RD, N, preset_queens
  )

  # ---- 既にこの状態から展開済みなら何もしない ----
  if key in subconst_cache:
    return ijkl_list, subconst_cache, constellations, preset_queens

  # ---- 先に登録（再入・並列時の二重実行も抑止）----
  subconst_cache.add(key)

  # ---- 新規実行：本体へ ----
  ijkl_list, subconst_cache, constellations, preset_queens = set_pre_queens(
    N, ijkl_list, subconst_cache,
    ld, rd, col,
    k, l,
    row, queens,
    LD, RD,
    counter, constellations, preset_queens,
    visited, constellation_signatures,
    zobrist_hash_tables
  )
  return ijkl_list, subconst_cache, constellations, preset_queens

"""事前に置く行 (k,l) を強制しつつ、queens==preset_queens に到達するまで再帰列挙。 `visited` には軽量な `state_hash` を入れて枝刈り。到達時は {ld,rd,col,startijkl} を constellation に追加。"""
def set_pre_queens(N:int,ijkl_list:Set[int],subconst_cache:Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],ld:int,rd:int,col:int,k:int,l:int,row:int,queens:int,LD:int,RD:int,counter:list,constellations:List[Dict[str,int]],preset_queens:int,visited:Set[int],constellation_signatures:Set[Tuple[int,int,int,int,int,int]],zobrist_hash_tables: Dict[int, Dict[str, List[u64]]])->Tuple[Set[int], Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]], List[Dict[str,int]], int]:
  # mask = nq_get(N)._board_mask
  board_mask= (1<<N)-1
  # ---------------------------------------------------------------------
  # 状態ハッシュによる探索枝の枝刈り バックトラック系の冒頭に追加　やりすぎると解が合わない
  #
  # <>zobrist_hash
  # 各ビットを見てテーブルから XOR するため O(N)（ld/rd/col/LD/RDそれぞれで最大 N 回）。
  # とはいえ N≤17 なのでコストは小さめ。衝突耐性は高い。
  # マスク漏れや負数の扱いを誤ると不一致が起きる点に注意（先ほどの & ((1<<N)-1) 修正で解決）。
  # zobrist_tables: Dict[int, Dict[str, List[int]]] = {}
  h: int = int(zobrist_hash(N,ld & board_mask, rd & board_mask, col & board_mask, row, queens, k, l, LD & board_mask, RD & board_mask,zobrist_hash_tables))
  #
  # <>state_hash
  # その場で数個の ^ と << を混ぜるだけの O(1) 計算。
  # 生成されるキーも 単一の int なので、set/dict の操作が最速＆省メモリ。
  # ただし理論上は衝突し得ます（実際はN≤17の範囲なら実害が出にくい設計にしていればOK）。
  # [Opt-09] Zobrist Hash（Opt-09）の導入とその用途
  # ビットボード設計でも、「盤面のハッシュ」→「探索済みフラグ」で枝刈りは可能です。
  # 1意になるように領域を分けて詰める（衝突ゼロ）
  # 5*N ビット分で ld/rd/col/LD/RD を入れ、以降に小さい値を詰める
  # h:int=(ld<<3)^(rd<<2)^(col<<1)^row^(queens<<7)^(k<<12)^(l<<17)^(LD<<22)^(RD<<27)^(N<<1)
  #
  # ldm = ld & mask
  # rdm = rd & mask
  # colm = col & mask
  # LDm = LD & mask
  # RDm = RD & mask
  # base = 5 * N
  # h:int = (
  #     ldm
  #   | (rdm  << (1 * N))
  #   | (colm << (2 * N))
  #   | (LDm  << (3 * N))
  #   | (RDm  << (4 * N))
  #   | (row  << (base + 0))
  #   | (queens << (base + 6))
  #   | (k     << (base + 12))
  #   | (l     << (base + 18))
  #   | (N     << (base + 24))
  # )
  #
  # <>StateKey（タプル）
  # 11個の整数オブジェクトを束ねるため、オブジェクト生成・GC負荷・ハッシュ合成が最も重い。
  # set の比較・保持も重く、メモリも一番食います。
  # 衝突はほぼ心配ないものの、速度とメモリ効率は最下位。
  # h: StateKey = (ld, rd, col, row, queens, k, l, LD, RD, N)
  #
  # dynamicKのときFalse
  # use_visited_prune = False  
  # if use_visited_prune:
  if h in visited:
    return ijkl_list, subconst_cache, constellations, preset_queens
  visited.add(h)

  #
  # ---------------------------------------------------------------------
  # k行とl行はスキップ
  if row==k or row==l:
    ijkl_list, subconst_cache, constellations, preset_queens = set_pre_queens_cached(N,ijkl_list,subconst_cache,ld<<1,rd>>1,col,k,l,row+1,queens,LD,RD,counter,constellations,preset_queens,visited,constellation_signatures,zobrist_hash_tables)
    return ijkl_list, subconst_cache, constellations, preset_queens
  # クイーンの数がpreset_queensに達した場合、現在の状態を保存
  if queens == preset_queens:
    if preset_queens <= 5:
      sig = (ld, rd, col, k, l, row)    # これが signature (tuple)
      if sig in constellation_signatures:
        return ijkl_list, subconst_cache, constellations, preset_queens
      constellation_signatures.add(sig)
    constellation={"ld":ld,"rd":rd,"col":col,"startijkl":row<<20,"solutions":0}
    constellations.append(constellation) #星座データ追加
    counter[0]+=1
    return ijkl_list, subconst_cache, constellations, preset_queens
  # 現在の行にクイーンを配置できる位置を計算
  free=~(ld|rd|col|(LD>>(N-1-row))|(RD<<(N-1-row)))&board_mask
  # _set_pre_queens_cached=self.set_pre_queens_cached
  while free:
    bit:int=free&-free
    free&=free-1
    ijkl_list, subconst_cache, constellations, preset_queens = set_pre_queens_cached(N,ijkl_list,subconst_cache,(ld|bit)<<1,(rd|bit)>>1,col|bit,k,l,row+1,queens+1,LD,RD,counter,constellations,preset_queens,visited,constellation_signatures,zobrist_hash_tables)

  return ijkl_list, subconst_cache, constellations, preset_queens

####################################################
#
# constellation / solution cached
#
####################################################

"""開始コンステレーション（代表部分盤面）の列挙。中央列（奇数 N）特例、回転重複排除 （`check_rotations`）、Jasmin 正規化（`get_jasmin`）を経て、各 sc から `set_pre_queens_cached` でサブ構成を作る。"""
def gen_constellations(
  N:int,
  ijkl_list:Set[int],
  subconst_cache:Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],
  constellations:List[Dict[str,int]],
  preset_queens:int
)->Tuple[
  Set[int],
  Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],
  List[Dict[str,int]],
  int
]:
  """
  機能:
    N-Queens の探索を分割するための「開始コンステレーション（部分盤面）」を列挙し、
    各開始コンステレーションから `set_pre_queens_cached()` を使って
    preset_queens 行までの“サブコンステレーション”を生成して `constellations` に追加する。

  引数:
    N:
      盤サイズ。
    ijkl_list:
      開始コンステレーション候補のパック値集合（to_ijkl の結果）。
      - 本関数内で update / Jasmin 変換を行い更新される。
    subconst_cache:
      サブコンステレーション生成の重複防止キャッシュ（key は (ld,rd,col,k,l,row,queens,LD,RD,N,preset_queens)）。
      - 実行ごとに clear() して「今回実行内」の重複排除に限定する（安全側）。
    constellations:
      出力のタスク配列。各要素は dict で、少なくとも "ld","rd","col","startijkl" を持つ。
      - `set_pre_queens_cached()` が append する。
    preset_queens:
      事前に置く行数（“星座の深さ”のようなもの）。
      - この値に到達した時点の状態を constellation タスクとして採用する。

  返り値:
    (ijkl_list, subconst_cache, constellations, 追加した constellation 数)

  前提/不変条件:
    - to_ijkl / geti/getj/getk/getl / get_jasmin / check_rotations が定義済み。
    - set_pre_queens_cached() が constellation を append する実装になっている。

  設計のポイント（ソース内の意図）:
    - 開始星座（i,j,k,l）は回転重複を check_rotations() で排除。
    - その後 Jasmin 変換で正規形へ寄せる（同型の統一）。
    - 各開始星座 sc から (ld,rd,col,LD,RD,…) を作り、preset_queens まで展開してタスク化。

  注意:
    - 本関数は「開始星座の列挙」と「サブ星座生成の入口」を担当。
      実際にどの状態を constellation として採用するかは set_pre_queens 系の方針に依存する。
  """

  # ---- 定数・補助値 ----
  halfN = (N + 1) // 2        # N の半分（切り上げ）。開始星座生成の範囲を絞るために使う
  N1:int = N - 1              # 最終列 index
  N2:int = N - 2

  # ---- 実行ごとにメモ化（重複抑止）をリセット ----
  # N や preset_queens が変わると key も変わるが、
  # “長寿命プロセス”で繰り返し呼ばれる可能性を考えると毎回クリアが安全。
  subconst_cache.clear()

  # constellation_signatures は「同一開始 sc 内」での重複排除（サブ生成の内部で使う想定）
  constellation_signatures: Set[Tuple[int,int,int,int,int,int]] = set()

  # ---- 奇数 N の中央列特例（center を固定した開始星座を追加）----
  if N % 2 == 1:
    center = N // 2
    # center を k に固定した開始星座を列挙
    ijkl_list.update(
      to_ijkl(i, j, center, l)
      for l in range(center + 1, N1)
      for i in range(center + 1, N1)
      if i != (N1) - l
      for j in range(N - center - 2, 0, -1)
      if j != i and j != l
      # 回転重複の排除（既に登録済みなら skip）
      if not check_rotations(ijkl_list, i, j, center, l, N)
    )

  # ---- (A) コーナーにクイーンがない開始星座 ----
  # ここが一番大きい候補生成。回転重複排除 check_rotations が効く前提。
  ijkl_list.update(
    to_ijkl(i, j, k, l)
    for k in range(1, halfN)
    for l in range(k + 1, N1)
    for i in range(k + 1, N1)
    if i != (N1) - l
    for j in range(N - k - 2, 0, -1)
    if j != i and j != l
    if not check_rotations(ijkl_list, i, j, k, l, N)
  )

  # ---- (B) コーナーにクイーンがある開始星座 ----
  # (0,j,0,l) 型を追加（“角あり”のクラス）
  ijkl_list.update({to_ijkl(0, j, 0, l) for j in range(1, N2) for l in range(j + 1, N1)})

  # ---- Jasmin 変換：開始星座を正規形に寄せる ----
  ijkl_list = {get_jasmin(N, c) for c in ijkl_list}

  # 左端列のビット（MSB 側）を 1 にするための基準
  # ※この実装では「左端 = 1<<(N-1)」としている
  L = 1 << (N1)

  # 追加した constellation 数を返すために counter を使う（set_pre_queens 側が増やす）
  # （List にして参照渡し＝ミュータブルにしている）
  # ※既存実装の方針に合わせる
  # counter[0] が “今回 sc から追加した constellation 数” になる
  for sc in ijkl_list:
    # sc ごとに重複抑止セットを初期化（＝この sc の内部だけで重複排除）
    constellation_signatures = set()

    # sc から (i,j,k,l) を復元
    i, j, k, l = geti(sc), getj(sc), getk(sc), getl(sc)

    # i/j/l の列ビット（L を右シフトして作る）
    Lj = L >> j
    Li = L >> i
    Ll = L >> l

    # ---- 開始状態（ld, rd, col, …）の構築 ----
    # ld/rd は「斜め攻撃線」、col は「縦列占有」。
    # ここは開始星座の“型”に依存する初期化で、探索の入口を作る。
    ld = (((L >> (i - 1)) if i > 0 else 0) | (1 << (N - k)))
    rd = ((L >> (i + 1)) | (1 << (l - 1)))
    col = (1 | L | Li | Lj)

    # mark 行などで使う補助ブロック（実装の意図に沿って保持）
    LD = (Lj | Ll)
    RD = (Lj | (1 << k))

    # ---- サブコンステレーション生成準備 ----
    counter: List[int] = [0]     # set_pre_queens 側が増やす
    visited: Set[int] = set()    # 枝刈り用 visited（hash を入れる設計）

    # Opt-04: preset_queens 行を事前に置く
    # Zobrist テーブルは “必要になった時に初期化” する設計（既存実装に合わせる）
    zobrist_hash_tables: Dict[int, Dict[str, List[u64]]] = {}

    # ---- サブ生成（キャッシュ付き）----
    # row=1、queens は (j==N1) かどうかで 3/4 を切り替えている（既存ロジック）
    ijkl_list, subconst_cache, constellations, preset_queens = set_pre_queens_cached(
      N, ijkl_list, subconst_cache,
      ld, rd, col,
      k, l,
      1,
      3 if j == N1 else 4,
      LD, RD,
      counter, constellations, preset_queens,
      visited, constellation_signatures,
      zobrist_hash_tables
    )

    # ---- startijkl に “開始星座 base” を追記 ----
    # set_pre_queens 側で作った constellation["startijkl"] は「途中状態の pack」なので、
    # ここで base=(i,j,k,l) を OR して “起点” を埋める。
    base = to_ijkl(i, j, k, l)

    # 直近に追加された counter[0] 件へ OR をかける（末尾から辿る）
    for a in range(counter[0]):
      constellations[-1 - a]["startijkl"] |= base

  # 返す 4 つ目は “最後に作った sc の counter” ではなく、
  # 元実装どおり「最後の counter[0]」を返す（上位で使っている想定）
  return ijkl_list, subconst_cache, constellations, counter[0]

""" コンステレーションリストの妥当性確認ヘルパ。各要素に 'ld','rd','col','startijkl' キーが存在するかをチェック。"""
def validate_constellation_list(constellations:List[Dict[str,int]])->bool: 
  return all(all(k in c for k in ("ld","rd","col","startijkl")) for c in constellations)

"""32bit little-endian の相互変換ヘルパ。Codon/CPython の差異に注意。"""
def read_uint32_le(b:str)->int: 
  return (ord(b[0])&0xFF)|((ord(b[1])&0xFF)<<8)|((ord(b[2])&0xFF)<<16)|((ord(b[3])&0xFF)<<24)

"""32bit little-endian バイト列への変換ヘルパ。"""
def int_to_le_bytes(x:int)->List[int]: 
  return [(x>>(8*i))&0xFF for i in range(4)]

"""ファイル存在チェック（読み取り open の可否で判定）。"""
def file_exists(fname:str)->bool:
  try:
    with open(fname,"rb"):
      return True
  except:
    return False

"""bin キャッシュのサイズ妥当性確認（1 レコード 16 バイトの整数倍か）。"""
def validate_bin_file(fname:str)->bool:
  try:
    with open(fname,"rb") as f:
      f.seek(0,2)  # ファイル末尾に移動
      size=f.tell()
    return size%16==0
  except:
    return False

"""バイナリ形式での解exec_solutions()のキャッシュ入出力""" 
def u64_to_le_bytes(x: u64) -> List[int]:
  v:int = int(x)
  return [(v >> (8*i)) & 0xFF for i in range(8)]

""" バイト列を little-endian u64 に変換 """
def read_uint64_le( raw: str) -> u64:
  v:int = 0
  for i in range(8):
    v |= (ord(raw[i]) & 0xFF) << (8*i)
  return u64(v)

""" テキスト形式での解exec_solutions()のキャッシュ保存"""
def save_solutions_txt(fname:str,constellations:List[Dict[str,int]]) -> None:
  f = open(fname, "w")
  f.write("startijkl,solutions\n")
  for d in constellations:
    f.write(str(d["startijkl"]))
    f.write(",")
    f.write(str(int(d["solutions"])))
    f.write("\n")
  f.close()

"""バイナリ形式での解exec_solutions()のキャッシュ保存v2"""
def save_solutions_bin_v2(fname:str,constellations:List[Dict[str,int]]) -> None:
  b8 = u64_to_le_bytes
  f = open(fname, "wb")
  for d in constellations:
    # u64 で揃える（40 bytes/record）
    for x in (
      u64(d["startijkl"]),
      u64(d["ld"]),
      u64(d["rd"]),
      u64(d["col"]),
      u64(d["solutions"]),
    ):
      bb = b8(x)
      f.write("".join(chr(c) for c in bb))
  f.close()

"""テキスト形式での解exec_solutions()のキャッシュ入出力"""
def load_solutions_txt_into(fname:str,constellations:List[Dict[str,int]]) -> bool:
  try:
    f = open(fname, "r")
  except:
    return False
  text = f.read()
  f.close()
  if text is None:
    return False
  lines = text.split("\n")
  if len(lines) < 2:
    return False
  if lines[0].strip() != "startijkl,solutions":
    return False

  # startijkl -> solutions
  mp: Dict[int, int] = {}
  for idx in range(1, len(lines)):
    line = lines[idx].strip()
    if line == "":
      continue
    parts = line.split(",")
    if len(parts) != 2:
      return False
    k = int(parts[0])
    v = int(parts[1])
    mp[k] = v
  # 全 constellations に埋める（欠けがあれば失敗）
  for d in constellations:
    s = d["startijkl"]
    if s not in mp:
      # print("[cache miss] startijkl=", int(s[0])," ld=", int(s[1]), " rd=", int(s[2]), " col=", int(s[3]))
      return False
    d["solutions"] = mp[s]

  return True

""" バイナリ形式での解exec_solutions()のキャッシュ読み込みv2"""
def load_solutions_bin_into_v2(fname:str,constellations:List[Dict[str,int]])->bool:
  try:
    f = open(fname, "rb")
  except:
    return False
  data = f.read()
  f.close()
  if data is None:
    return False
  rec:int = 40
  n:int = len(data)
  if n == 0 or (n % rec) != 0:
    return False
  nrec:int = n // rec
  r8 = read_uint64_le
  mp: Dict[Tuple[u64,u64,u64,u64], u64] = {}
  p:int = 0
  for _ in range(nrec):
    s  = r8(data[p:p+8]);   p += 8
    ld = r8(data[p:p+8]);   p += 8
    rd = r8(data[p:p+8]);   p += 8
    col= r8(data[p:p+8]);   p += 8
    sol= r8(data[p:p+8]);   p += 8
    mp[(s, ld, rd, col)] = sol
  for d in constellations:
    key = (u64(d["startijkl"]), u64(d["ld"]), u64(d["rd"]), u64(d["col"]))
    if key not in mp:
      print("[cache miss] startijkl=", int(key[0])," ld=", int(key[1]), " rd=", int(key[2]), " col=", int(key[3]))
      return False
    d["solutions"] = int(mp[key])

  return True

"""テキスト形式での解exec_solutions()のキャッシュ入出力ラッパー"""
def load_or_build_solutions_txt(N:int,constellations:List[Dict[str,int]],preset_queens:int,use_gpu:bool,cache_tag:str = "") -> None:

  tag = "_" + cache_tag if cache_tag != "" else ""
  fname = "solutions_N" + str(N) + "_" + str(preset_queens) + tag + ".txt"

  if file_exists(fname):
    if load_solutions_txt_into(fname, constellations):
      return
    else:
      print("[警告] solutions txt キャッシュ不一致: " + fname + " を再生成します")

  # なければ計算して保存
  exec_solutions(N,constellations,use_gpu)
  save_solutions_txt(fname, constellations)

"""バイナリ形式での解exec_solutions()のキャッシュ入出力ラッパー"""
def load_or_build_solutions_bin(N:int,constellations:List[Dict[str,int]],preset_queens:int,use_gpu:bool,cache_tag:str = "") -> None:

  tag = f"_{cache_tag}" if cache_tag != "" else ""
  fname = f"solutions_N{N}_{preset_queens}{tag}.bin"

  if file_exists(fname):
    if load_solutions_bin_into_v2(fname, constellations):
      return
    else:
      print(f"[警告] solutions キャッシュ不一致/破損: {fname} を再生成します")

  # なければ計算して保存
  exec_solutions(N,constellations, use_gpu)
  save_solutions_bin_v2(fname, constellations)

"""テキスト形式で constellations を保存/復元する（1 行 5 数値: ld rd col startijkl solutions）。"""
def save_constellations_txt(path:str,constellations:List[Dict[str,int]])->None:
  with open(path,"w") as f:
    for c in constellations:
      ld=c["ld"]
      rd=c["rd"]
      col=c["col"]
      startijkl=c["startijkl"]
      solutions=c.get("solutions",0)
      f.write(f"{ld} {rd} {col} {startijkl} {solutions}\n")

"""テキスト形式で constellations を保存/復元する（1 行 5 数値: ld rd col startijkl solutions）。"""
def load_constellations_txt(path:str,constellations:List[Dict[str,int]])->List[Dict[str,int]]:
  # out:List[Dict[str,int]]=[]
  with open(path,"r") as f:
    for line in f:
      parts=line.strip().split()
      if len(parts)!=5:
        continue
      ld=int(parts[0]);rd=int(parts[1]);col=int(parts[2])
      startijkl=int(parts[3]);solutions=int(parts[4])
      # out.append({"ld":ld,"rd":rd,"col":col,"startijkl":startijkl,"solutions": solutions})
      constellations.append({"ld":ld,"rd":rd,"col":col,"startijkl":startijkl,"solutions": solutions})
  # return out
  return constellations

"""テキストキャッシュを読み込み。壊れていれば `gen_constellations()` で再生成して保存する。"""
def load_or_build_constellations_txt(N:int,ijkl_list:Set[int],subconst_cache:Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],constellations:List[Dict[str,int]],preset_queens:int)->Tuple[Set[int],Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],List[Dict[str,int]],int]:

  # N と preset_queens に基づいて一意のファイル名を構成
  fname=f"constellations_N{N}_{preset_queens}.txt"
  # ファイルが存在すれば読み込むが、破損チェックも行う
  if file_exists(fname):
    try:
      constellations=load_constellations_txt(fname,constellations)
      if validate_constellation_list(constellations):
        return ijkl_list,subconst_cache,constellations,preset_queens
      else:
        print(f"[警告] 不正なキャッシュ形式: {fname} を再生成します")
    except Exception as e:
      print(f"[警告] キャッシュ読み込み失敗: {fname}, 理由: {e}")
  # ファイルがなければ生成・保存
  # constellations:List[Dict[str,int]]=[]
  ijkl_list,subconst_cache,constellations,preset_queens=gen_constellations(N,ijkl_list,subconst_cache,constellations,preset_queens)
  save_constellations_txt(fname,constellations)
  return ijkl_list,subconst_cache,constellations,preset_queens

"""bin 形式で constellations を保存/復元。Codon では str をバイト列として扱う前提のため、CPython では bytes で書き込むよう分岐/注意が必要。"""
def save_constellations_bin(N:int,fname:str,constellations:List[Dict[str,int]])->None:
  # _int_to_le_bytes=int_to_le_bytes
  with open(fname,"wb") as f:
    for d in constellations:
      for key in ["ld","rd","col","startijkl"]:
        b=int_to_le_bytes(d[key])
        # int_to_le_bytes(d[key])
        f.write("".join(chr(c) for c in b))  # Codonでは str がバイト文字列扱い

"""bin 形式で constellations を保存/復元。Codon では str をバイト列として扱う前提のため、CPython では bytes で書き込むよう分岐/注意が必要。"""
def load_constellations_bin(N:int,fname:str,constellations:List[Dict[str,int]],)->List[Dict[str,int]]:
  # constellations:List[Dict[str,int]]=[]
  _read_uint32_le=read_uint32_le
  with open(fname,"rb") as f:
    while True:
      raw=f.read(16)
      if len(raw)<16:
        break
      ld=read_uint32_le(raw[0:4])
      rd=read_uint32_le(raw[4:8])
      col=read_uint32_le(raw[8:12])
      startijkl=_read_uint32_le(raw[12:16])
      constellations.append({ "ld":ld,"rd":rd,"col":col,"startijkl":startijkl,"solutions":0 })
  return constellations

"""bin キャッシュを読み込み。検証に失敗した場合は再生成して保存し、その結果を返す。"""
def load_or_build_constellations_bin(N:int,ijkl_list:Set[int],subconst_cache:Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],constellations:List[Dict[str,int]],preset_queens:int)->Tuple[Set[int],Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],List[Dict[str,int]],int]:

  # N と preset_queens に基づいて一意のファイル名を構成
  fname=f"constellations_N{N}_{preset_queens}.bin"
  if file_exists(fname):
    # ファイルが存在すれば読み込むが、破損チェックも行う
    try:
      constellations=load_constellations_bin(N,fname,constellations)
      if validate_bin_file(fname) and validate_constellation_list(constellations):
        return ijkl_list,subconst_cache,constellations,preset_queens
      else:
        print(f"[警告] 不正なキャッシュ形式: {fname} を再生成します")
    except Exception as e:
      print(f"[警告] キャッシュ読み込み失敗: {fname}, 理由: {e}")
  # ファイルがなければ生成・保存
  # constellations:List[Dict[str,int]]=[]
  ijkl_list,subconst_cache,constellations,preset_queens=gen_constellations(N,ijkl_list,subconst_cache,constellations,preset_queens)
  save_constellations_bin(N,fname,constellations)
  return ijkl_list,subconst_cache,constellations,preset_queens


"""プリセットクイーン数を調整 preset_queensとconstellationsを返却"""
def build_constellations_dynamicK(N: int, ijkl_list:Set[int],subconst_cache:Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],constellations:List[Dict[str,int]],use_gpu: bool,preset_queens:int)->Tuple[Set[int],Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]],List[Dict[str,int]],int]:

  use_bin=True
  if use_bin:
    # bin
    ijkl_list,subconst_cache,constellations,preset_queens=load_or_build_constellations_bin(N,ijkl_list,subconst_cache, constellations, preset_queens)
    #
  else:
    # txt
    ijkl_list,subconst_cache,constellations,preset_queens=load_or_build_constellations_txt(N,ijkl_list,subconst_cache, constellations, preset_queens)

  return  ijkl_list,subconst_cache,constellations,preset_queens

"""小さな N 用の素朴な全列挙（対称重みなし）。ビットボードで列/斜線の占有を管理して再帰的に合計を返す。検算/フォールバック用。"""
def _bit_total(N:int)->int:
  mask:int=(1<<N)-1
  """ 小さなNは正攻法で数える（対称重みなし・全列挙） """
  def bt(row:int,left:int,down:int,right:int):
    if row==N:
      return 1
    total:int=0
    bitmap:int=mask&~(left|down|right)
    while bitmap:
      bit:int=-bitmap&bitmap
      bitmap^=bit
      total+=bt(row+1,(left|bit)<<1,down|bit,(right|bit)>>1)
    return total
  return bt(0,0,0,0)

"""N=5..17 の合計解を計測。N<=5 は `_bit_total()` のフォールバック、それ以外は星座キャッシュ（.bin/.txt）→ `exec_solutions()` → 合計→既知解 `expected` と照合。"""
def main()->None:
  
  expected:List[int]=[0,0,0,0,0,10,4,40,92,352,724,2680,14200,73712,365596,2279184,14772512,95815104,666090624,4968057848,39029188884,314666222712,2691008701644,24233937684440,227514171973736,2207893435808352,22317699616364044,234907967154122528]     
  nmin:int=5
  nmax:int=28
  use_gpu:bool=False
  argc:int=len(sys.argv)

  if argc == 1:
    print("CPU mode selected")
    pass
  elif argc == 2:
    arg = sys.argv[1]
    if arg == "-c":
      use_gpu = False
      print("CPU mode selected")
    elif arg == "-g":
      use_gpu = True
      print("GPU mode selected")
    else:
      print(f"Unknown option: {arg}")
      print("Usage: nqueens [-c | -g]")
      return
  else:
    print("Too many arguments")
    print("Usage: nqueens [-c | -g]")
    return

  print(" N:             Total         Unique        hh:mm:ss.ms")
  for N in range(nmin,nmax):
    start_time=datetime.now()
    if N<=5:

      """ 小さなNは正攻法で数える（対称重みなし・全列挙） """
      total=_bit_total(N)

      dt=datetime.now()-start_time
      text=str(dt)[:-3]
      print(f"{N:2d}:{total:18d}{0:15d}{text:>20s}")
      continue

    ijkl_list:Set[int]=set()
    constellations:List[Dict[str,int]]=[]
    subconst_cache:Set[Tuple[int,int,int,int,int,int,int,int,int,int,int]]=set()

    """ constellasions()でキャッシュを使う """
    use_constellation_cache:bool = True
    preset_queens:int = 5 # preset_queens CPUが担当する深さ

    if use_constellation_cache:
      ijkl_list,subconst_cache,constellations,preset_queens= build_constellations_dynamicK(N,ijkl_list,subconst_cache,constellations, use_gpu,preset_queens)
    else:
      ijkl_list,subconst_cache,constellations,preset_queens=gen_constellations(N,ijkl_list,subconst_cache,constellations,preset_queens)
    
    
    """ solutions()でキャッシュを使って実行 """
    use_solution_cache = False
    if use_solution_cache:
        #
        # text
        # load_or_build_solutions_txt(N,constellations, preset_queens, use_gpu, cache_tag="v2")
        # 
        # bin
        load_or_build_solutions_bin(N,constellations, preset_queens, use_gpu, cache_tag="v2")
        # 
    else:
        exec_solutions(N,constellations,use_gpu)
    
    """ 合計 """
    total:int=sum(c['solutions'] for c in constellations if c['solutions']>0)
    time_elapsed=datetime.now()-start_time
    text=str(time_elapsed)[:-3]
    status:str="ok" if expected[N]==total else f"ng({total}!={expected[N]})"
    print(f"{N:2d}:{total:18d}{0:15d}{text:>20s}    {status}")

""" エントリポイント """
if __name__=="__main__":
  main()

```

---

## 📚 関連リンク

* [Codon GitHub (Exaloop)](https://github.com/exaloop/codon)
* [N-Queens Project Archive](https://github.com/suzukiiichiro/N-Queens)
* [公式 LLVM Documentation](https://llvm.org/docs/)
* [Codon Language Docs](https://docs.exaloop.io)

---

## Ｎクイーン問題 過去記事アーカイブ
【過去記事アーカイブ】Ｎクイーン問題 過去記事一覧
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens


Ｎクイーン問題（１０２）Python/CodonでNの計測値がC/GPU-CUDAに追いついてしまった話
https://suzukiiichiro.github.io/posts/2026-02-03-01-n-queens-suzuki/
Ｎクイーン問題（１０１）Python/Codonで爆速プログラミング コンステレーション＋インテグレート
https://suzukiiichiro.github.io/posts/2025-10-27-17-n-queens-suzuki/
Ｎクイーン問題（１００）Python/Codonで爆速プログラミング コンステレーション＋マージ
https://suzukiiichiro.github.io/posts/2025-10-27-16-n-queens-suzuki/
Ｎクイーン問題（９９）Python/Codonで爆速プログラミング コンステレーション＋最適化
https://suzukiiichiro.github.io/posts/2025-10-27-15-n-queens-suzuki/
Ｎクイーン問題（９８）Python/Codonで爆速プログラミング コンステレーション＋並列処理
https://suzukiiichiro.github.io/posts/2025-10-27-14-n-queens-suzuki/
Ｎクイーン問題（９７）Python/Codonで爆速プログラミング コンステレーション
https://suzukiiichiro.github.io/posts/2025-10-27-13-n-queens-suzuki/
Ｎクイーン問題（９６）Python/Codonで爆速プログラミング キャリーチェーン
https://suzukiiichiro.github.io/posts/2025-10-27-12-n-queens-suzuki/
Ｎクイーン問題（９５）Python/Codonで爆速プログラミング ノードレイヤー＋対象解除法
https://suzukiiichiro.github.io/posts/2025-10-27-11-n-queens-suzuki/
Ｎクイーン問題（９４）Python/Codonで爆速プログラミング ノードレイヤー＋ミラー
https://suzukiiichiro.github.io/posts/2025-10-27-10-n-queens-suzuki/
Ｎクイーン問題（９３）Python/Codonで爆速プログラミング ノードレイヤー
https://suzukiiichiro.github.io/posts/2025-10-27-09-n-queens-suzuki/
Ｎクイーン問題（９２）Python/Codonで爆速プログラミング ビットでミラー＋対象解除法
https://suzukiiichiro.github.io/posts/2025-10-27-08-n-queens-suzuki/
Ｎクイーン問題（９１）Python/Codonで爆速プログラミング ビットで対象解除法
https://suzukiiichiro.github.io/posts/2025-10-27-07-n-queens-suzuki/
Ｎクイーン問題（９０）Python/Codonで爆速プログラミング ビットでミラー
https://suzukiiichiro.github.io/posts/2025-10-27-06-n-queens-suzuki/
Ｎクイーン問題（８９）Python/Codonで爆速プログラミング ビットでバックトラック
https://suzukiiichiro.github.io/posts/2025-10-27-05-n-queens-suzuki/
Ｎクイーン問題（８８）Python/Codonで爆速プログラミング 対象解除法
https://suzukiiichiro.github.io/posts/2025-10-27-04-n-queens-suzuki/
Ｎクイーン問題（８７）Python/Codonで爆速プログラミング バックトラック
https://suzukiiichiro.github.io/posts/2025-10-27-03-n-queens-suzuki/
Ｎクイーン問題（８６）Python/Codonで爆速プログラミング ポストフラグ
https://suzukiiichiro.github.io/posts/2025-10-27-02-n-queens-suzuki/
Ｎクイーン問題（８５）Python/Codonで爆速プログラミング ブルートフォース
https://suzukiiichiro.github.io/posts/2025-10-27-01-n-queens-suzuki/
Ｎクイーン問題（８４）Python/Codonで爆速プログラミング
https://suzukiiichiro.github.io/posts/2025-10-24-01-n-queens-suzuki/
Ｎクイーン問題（８３）Python-codon＆並列処理で高速化 Constellations
https://suzukiiichiro.github.io/posts/2025-03-11-07-n-queens-suzuki/
Ｎクイーン問題（８２）Python-並列処理で高速化 16Python_carryChain_ProcessPool
https://suzukiiichiro.github.io/posts/2025-03-11-06-n-queens-suzuki/
Ｎクイーン問題（８１）Python-codonで高速化 15Python_carryChain
https://suzukiiichiro.github.io/posts/2025-03-11-05-n-queens-suzuki/
Ｎクイーン問題（８０）Python-並列処理で高速化 14Python_NodeLayer_symmetry_ProcessPool
https://suzukiiichiro.github.io/posts/2025-03-11-04-n-queens-suzuki/
Ｎクイーン問題（７９）Python-codonで高速化 13Python_NodeLayer_symmetry
https://suzukiiichiro.github.io/posts/2025-03-11-03-n-queens-suzuki/
Ｎクイーン問題（７８）Python-codonで高速化 12Python_NodeLayer_mirror
https://suzukiiichiro.github.io/posts/2025-03-11-02-n-queens-suzuki/
Ｎクイーン問題（７７）Python-codonで高速化 11Python_NodeLayer
https://suzukiiichiro.github.io/posts/2025-03-11-01-n-queens-suzuki/
Ｎクイーン問題（７６）Python-並列処理で高速化 10Python_bit_symmetry_ProcessPool
https://suzukiiichiro.github.io/posts/2025-03-10-05-n-queens-suzuki/
Ｎクイーン問題（７５）Python-並列処理で高速化 09Python_bit_symmetry_ThreadPool
https://suzukiiichiro.github.io/posts/2025-03-10-04-n-queens-suzuki/
Ｎクイーン問題（７４）Python-codonで高速化 08Python_bit_symmetry
https://suzukiiichiro.github.io/posts/2025-03-10-03-n-queens-suzuki/
Ｎクイーン問題（７３）Python-codonで高速化 07Python_bit_mirror
https://suzukiiichiro.github.io/posts/2025-03-10-02-n-queens-suzuki/
Ｎクイーン問題（７２）Python-codonで高速化 06Python_bit_backTrack
https://suzukiiichiro.github.io/posts/2025-03-10-01-n-queens-suzuki/
Ｎクイーン問題（７１）Python-codonで高速化 05Python_optimize
https://suzukiiichiro.github.io/posts/2025-03-07-01-n-queens-suzuki/
Ｎクイーン問題（７０）Python-codonで高速化 04Python_symmetry
https://suzukiiichiro.github.io/posts/2025-03-06-02-n-queens-suzuki/
Ｎクイーン問題（６９）Python-codonで高速化 03Python_backTracking
https://suzukiiichiro.github.io/posts/2025-03-06-01-n-queens-suzuki/
Ｎクイーン問題（６８）Python-codonで高速化 02Python_postFlag
https://suzukiiichiro.github.io/posts/2025-03-05-03-n-queens-suzuki/
Ｎクイーン問題（６７）Python-codonで高速化 01Python_bluteForce
https://suzukiiichiro.github.io/posts/2025-03-05-02-n-queens-suzuki/
Ｎクイーン問題（６６）Python-codonで高速化
https://suzukiiichiro.github.io/posts/2025-03-05-01-n-queens-suzuki/
Ｎクイーン問題（６５） Ｎ２５を解決！事実上の日本一に
https://suzukiiichiro.github.io/posts/2024-04-25-01-n-queens-suzuki/
Ｎクイーン問題（６４）第七章 並列処理 キャリーチェーン ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-05-n-queens-suzuki/
Ｎクイーン問題（６３）第七章 並列処理 キャリーチェーン ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-05-n-queens-suzuki/
Ｎクイーン問題（６２）第七章 並列処理 対称解除法 ビットボード ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-04-n-queens-suzuki/
Ｎクイーン問題（６１）第七章 並列処理 対称解除法 ノードレイヤー ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-03-n-queens-suzuki/
Ｎクイーン問題（６０）第七章 並列処理 ミラー ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-02-n-queens-suzuki/
Ｎクイーン問題（５９）第七章 並列処理 ビットマップ ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-01-n-queens-suzuki/
Ｎクイーン問題（５８）第六章 並列処理 pthread C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-09-n-queens-suzuki/
Ｎクイーン問題（５７）第八章 キャリーチェーン C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-08-n-queens-suzuki/
Ｎクイーン問題（５６）第八章 ミラー C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-06-n-queens-suzuki/
Ｎクイーン問題（５５）第八章 ビットマップ C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-05-n-queens-suzuki/
Ｎクイーン問題（５４）第八章 ビットマップ C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-04-n-queens-suzuki/
Ｎクイーン問題（５３）第八章 配置フラグ C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-03-n-queens-suzuki/
Ｎクイーン問題（５２）第八章 バックトラック C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-02-n-queens-suzuki/
Ｎクイーン問題（５１）第八章 ブルートフォース C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-01-n-queens-suzuki/
Ｎクイーン問題（５０）第七章 マルチプロセス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-04-n-queens-suzuki/
Ｎクイーン問題（４９）第七章 マルチスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-03-n-queens-suzuki/
Ｎクイーン問題（４８）第七章 シングルスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-02-n-queens-suzuki/
Ｎクイーン問題（４７）第七章 クラス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-01-n-queens-suzuki/
Ｎクイーン問題（４６）第七章 ステップＮの実装 Python編
https://suzukiiichiro.github.io/posts/2023-06-16-02-n-queens-suzuki/
Ｎクイーン問題（４５）第七章 キャリーチェーン Python編
https://suzukiiichiro.github.io/posts/2023-06-16-01-n-queens-suzuki/
Ｎクイーン問題（４４）第七章　対象解除法 Python編
https://suzukiiichiro.github.io/posts/2023-06-14-02-n-queens-suzuki/
Ｎクイーン問題（４３）第七章　ミラー Python編
https://suzukiiichiro.github.io/posts/2023-06-14-01-n-queens-suzuki/
Ｎクイーン問題（４２）第七章　ビットマップ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-05-n-queens-suzuki/
Ｎクイーン問題（４１）第七章　配置フラグ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-04-n-queens-suzuki/
Ｎクイーン問題（４０）第七章　バックトラック Python編
https://suzukiiichiro.github.io/posts/2023-06-13-03-n-queens-suzuki/
Ｎクイーン問題（３９）第七章　バックトラック準備編 Python編
https://suzukiiichiro.github.io/posts/2023-06-13-02-n-queens-suzuki/
Ｎクイーン問題（３８）第七章　ブルートフォース Python編
https://suzukiiichiro.github.io/posts/2023-06-13-01-n-queens-suzuki/
Ｎクイーン問題（３７）第六章 C言語移植 その１７ pthread並列処理完成
https://suzukiiichiro.github.io/posts/2023-05-30-17-n-queens-suzuki/
Ｎクイーン問題（３６）第六章 C言語移植 その１６ pthreadの実装
https://suzukiiichiro.github.io/posts/2023-05-30-16-n-queens-suzuki/
Ｎクイーン問題（３５）第六章 C言語移植 その１５ pthread実装直前版完成
https://suzukiiichiro.github.io/posts/2023-05-30-15-n-queens-suzuki/
Ｎクイーン問題（３４）第六章 C言語移植 その１４
https://suzukiiichiro.github.io/posts/2023-05-30-14-n-queens-suzuki/
Ｎクイーン問題（３３）第六章 C言語移植 その１３
https://suzukiiichiro.github.io/posts/2023-05-30-13-n-queens-suzuki/
Ｎクイーン問題（３２）第六章 C言語移植 その１２
https://suzukiiichiro.github.io/posts/2023-05-30-12-n-queens-suzuki/
Ｎクイーン問題（３１）第六章 C言語移植 その１１
https://suzukiiichiro.github.io/posts/2023-05-30-11-n-queens-suzuki/
Ｎクイーン問題（３０）第六章 C言語移植 その１０
https://suzukiiichiro.github.io/posts/2023-05-30-10-n-queens-suzuki/
Ｎクイーン問題（２９）第六章 C言語移植 その９
https://suzukiiichiro.github.io/posts/2023-05-30-09-n-queens-suzuki/
Ｎクイーン問題（２８）第六章 C言語移植 その８
https://suzukiiichiro.github.io/posts/2023-05-30-08-n-queens-suzuki/
Ｎクイーン問題（２７）第六章 C言語移植 その７
https://suzukiiichiro.github.io/posts/2023-05-30-07-n-queens-suzuki/
Ｎクイーン問題（２６）第六章 C言語移植 その６
https://suzukiiichiro.github.io/posts/2023-05-30-06-n-queens-suzuki/
Ｎクイーン問題（２５）第六章 C言語移植 その５
https://suzukiiichiro.github.io/posts/2023-05-30-05-n-queens-suzuki/
Ｎクイーン問題（２４）第六章 C言語移植 その４
https://suzukiiichiro.github.io/posts/2023-05-30-04-n-queens-suzuki/
Ｎクイーン問題（２３）第六章 C言語移植 その３
https://suzukiiichiro.github.io/posts/2023-05-30-03-n-queens-suzuki/
Ｎクイーン問題（２２）第六章 C言語移植 その２
https://suzukiiichiro.github.io/posts/2023-05-30-02-n-queens-suzuki/
Ｎクイーン問題（２１）第六章 C言語移植 その１
N-Queens問://suzukiiichiro.github.io/posts/2023-05-30-01-n-queens-suzuki/
Ｎクイーン問題（２０）第五章 並列処理
https://suzukiiichiro.github.io/posts/2023-05-23-02-n-queens-suzuki/
Ｎクイーン問題（１９）第五章 キャリーチェーン
https://suzukiiichiro.github.io/posts/2023-05-23-01-n-queens-suzuki/
Ｎクイーン問題（１８）第四章 エイト・クイーンノスタルジー
https://suzukiiichiro.github.io/posts/2023-04-25-01-n-queens-suzuki/
Ｎクイーン問題（１７）第四章　偉人のソースを読む「Ｎ２４を発見 Ｊｅｆｆ Ｓｏｍｅｒｓ」
https://suzukiiichiro.github.io/posts/2023-04-21-01-n-queens-suzuki/
Ｎクイーン問題（１６）第三章　対象解除法 ソース解説
https://suzukiiichiro.github.io/posts/2023-04-18-01-n-queens-suzuki/
Ｎクイーン問題（１５）第三章　対象解除法 ロジック解説
https://suzukiiichiro.github.io/posts/2023-04-13-02-nqueens-suzuki/
Ｎクイーン問題（１４）第三章　ミラー
https://suzukiiichiro.github.io/posts/2023-04-13-01-nqueens-suzuki/
Ｎクイーン問題（１３）第三章　ビットマップ
https://suzukiiichiro.github.io/posts/2023-04-05-01-nqueens-suzuki/
Ｎクイーン問題（１２）第二章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-17-02-n-queens-suzuki/
Ｎクイーン問題（１１）第二章　配置フラグの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-17-01-n-queens-suzuki/
Ｎクイーン問題（１０）第二章　バックトラックの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-16-01-n-queens-suzuki/
Ｎクイーン問題（９）第二章　ブルートフォースの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-14-01-n-queens-suzuki/
Ｎクイーン問題（８）第一章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-09-01-n-queens-suzuki/
Ｎクイーン問題（７）第一章　ブルートフォース再び
https://suzukiiichiro.github.io/posts/2023-03-08-01-n-queens-suzuki/
Ｎクイーン問題（６）第一章　配置フラグ
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/
Ｎクイーン問題（５）第一章　進捗表示テーブルの作成
https://suzukiiichiro.github.io/posts/2023-03-06-01-n-queens-suzuki/
Ｎクイーン問題（４）第一章　バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
Ｎクイーン問題（３）第一章　バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
Ｎクイーン問題（２）第一章　ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/




## 書籍の紹介
{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/proteect/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

summary=`Unixのプログラムは「ツール」と呼ばれます。
Unixは、処理を実現するために複数の道具(ツール)を組み合わせる「ソフトウェアツール」という思想の下に設計されているためです。
そしてこれらツールを「組み合わせる」ということこそがUnixの真髄です。
また、シェルスクリプトの作成には言語自体だけでなくそれぞれのツールに対する理解も求められます。
つまり、あるツールが何のためのものであり、それを単体あるいは他のプログラムと組み合わせて利用するにはどのようにすればよいかということを理解しなければなりません。
本書は、Unixシステムへの理解を深めながら、シェルスクリプトの基礎から応用までを幅広く解説します。
標準化されたシェルを通じてUnix(LinuxやFreeBSD、Mac OS XなどあらゆるUnix互換OSを含む)の各種ツールを組み合わせ、
目的の処理を実現するための方法を詳しく学ぶことができます。
`
imageUrl="https://m.media-amazon.com/images/I/51EAPCH56ML._SL250_.jpg"
%}}

{{% amazon

title="UNIXシェルスクリプト マスターピース132"

url="https://www.amazon.co.jp/gp/proteect/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/proteect/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

summary=`定番の1冊『シェルスクリプト基本リファレンス』の改訂第3版。
シェルスクリプトの知識は、プログラマにとって長く役立つ知識です。
本書では、複数のプラットフォームに対応できる移植性の高いシェルスクリプト作成に主眼を置き、
基本から丁寧に解説。
第3版では最新のLinux/FreeBSD/Solarisに加え、組み込み分野等で注目度の高いBusyBoxもサポート。
合わせて、全収録スクリプトに関してWindowsおよびmacOS環境でのbashの動作確認も行い、さらなる移植性の高さを追求。
ますますパワーアップした改訂版をお届けします。`
imageUrl="https://m.media-amazon.com/images/I/41i956UyusL._SL250_.jpg"
%}}

{{% amazon

title="新しいシェルプログラミングの教科書 単行本"

url="https://www.amazon.co.jp/gp/proteect/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

summary=`エキスパートを目指せ!!

システム管理やソフトウェア開発など、
実際の業務では欠かせないシェルスクリプトの知識を徹底解説

ほとんどのディストリビューションでデフォルトとなっているbashに特化することで、
類書と差別化を図るとともに、より実践的なプログラミングを紹介します。
またプログラミング手法の理解に欠かせないLinuxの仕組みについてもできるかぎり解説しました。
イマドキのエンジニア必携の一冊。

▼目次
CHAPTER01 シェルってなんだろう
CHAPTER02 シェルスクリプトとは何か
CHAPTER03 シェルスクリプトの基本
CHAPTER04 変数
CHAPTER05 クォーティング
CHAPTER06 制御構造
CHAPTER07 リダイレクトとパイプ
CHAPTER08 関数
CHAPTER09 組み込みコマンド
CHAPTER10 正規表現と文字列
CHAPTER11 シェルスクリプトの実行方法
CHAPTER12 シェルスクリプトのサンプルで学ぼう
CHAPTER13 シェルスクリプトの実用例
CHAPTER14 テストとデバッグ
CHAPTER15 読みやすいシェルスクリプト
`
imageUrl="https://m.media-amazon.com/images/I/41d1D6rgDiL._SL250_.jpg"
%}}























