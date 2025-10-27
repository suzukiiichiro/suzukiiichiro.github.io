---
title: "Ｎクイーン問題（９７）Python/Codonで爆速プログラミング コンステレーション"
date: 2025-10-27T13:26:22+09:00
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

---

## Python / Codon Ｎクイーン コンステレーション版

```
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

---

### 概要

結論から言えば **codon for python `17Py_`** は **GPU/CUDA `10Bit_CUDA/01CUDA_Bit_Symmetry.cu`** と同等の速度で動作します。

---

### GPU 実行例

```bash
$ nvcc -O3 -arch=sm_61 -m64 -ptx -prec-div=false 04CUDA_Symmetry_BitBoard.cu && POCL_DEBUG=all ./a.out -n ;
対称解除法 GPUビットボード
20:      39029188884       4878666808     000:00:02:02.52
21:     314666222712      39333324973     000:00:18:46.52
22:    2691008701644     336376244042     000:03:00:22.54
23:   24233937684440    3029242658210     001:06:03:49.29
```

---

### Codon 実行例（AWS m4.16xlarge × 1）

```bash
amazon AWS m4.16xlarge x 1
$ codon build -release 15Py_constellations_optimize_codon.py && ./15Py_constellations_optimize_codon
20:      39029188884                0          0:02:52.430
21:     314666222712                0          0:24:25.554
22:    2691008701644                0          3:29:33.971
23:   24233937684440                0   1 day, 8:12:58.977
```

---

### 実行方法

```bash
# Python（通常実行）
$ python <filename.py>

# Codon（ビルドせず実行）
$ codon run <filename.py>

# Codon（ビルドしてネイティブ高速実行）
$ codon build -release < filename.py> && ./<filename>
```

---

### 参考リンク

* Ｎクイーン問題 過去記事一覧はこちらから
  [https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)
* エイト・クイーンのプログラムアーカイブ（Bash、Lua、C、Java、Python、CUDAまで！）
  [https://github.com/suzukiiichiro/N-Queens](https://github.com/suzukiiichiro/N-Queens)

---

## N-Queens：星座(Constellations) 前計算＋規約化＋多分岐ビットDFS（Total/Unique基盤）

**ファイル:** `13Py_constellations_bitdfs.py`
**作成日:** 2025-10-23

---

### 概要

* 外周4点 `(i, j, k, l)` を「**星座**」として列挙 → **回転/ミラー同型を除去（規約化）** → 各星座ごとに事前固定マスクを作成して**内部をビットDFS**で畳み込む構成。
* 規約化は `jasmin()`（最小端の辺基準で 90° 回転 → 必要なら垂直ミラー）、同型検査は `check_rotations()`（90/180/270）で実施。
* 内部探索は `SQ*` 群（例: `SQd0B`, `SQd1B`, `SQd2B`, `SQB...` など）で、「**free集合 → LSB抽出 → 遷移**」の定石で深掘り（引用: `bit = free & -free`, `free &= free-1`）。
* マスクは**必ず N ビットに制限**（引用: `free = self._maskN(free, N)`）。

---

### 実装上の要点（引用）

* **可置集合:** `free = mask & ~(ld | rd | col)` あるいは分岐専用の `next_free = self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)), N)`
* **LSB抽出:** `bit = free & -free`、**消費:** `free &= free-1`
* **先読み:** `lookahead = self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)), N)`
* **星座保存:** `startijkl = (row<<20) | ijkl` で「開始行＋(i,j,k,l)」を一括パック

---

### 検証の目安

* 小 N（例: **N=5, 8, 13**）で既知 Total（**N=8 → 92**, **N=13 → 73712**）と一致するかをまず確認。

---

### 注意

* 多数の `SQ*` は枝刈り条件（`mark1/mark2/jmark/endmark`）が異なるだけで**核心は共通**。
* すべての `next_free` / `free` を **`self._maskN(..., N)` で N ビットに抑制**する前提。
* 本ファイル単体では **Unique を直接カウントしない**（`symmetry()` は係数 2/4/8 を返す基盤）。

---

## 仕上げのレビュー（ごく短く）

### 強み

* **星座の規約化（jasmin）＋回転除去**で入力を最小代表に圧縮。
* `set_pre_queens` で固定マスクを前段で織り込み、`exec_solutions` で**分岐最適化済み `SQ*` 群へ直結**。
* すべての `free/next_free` を `self._maskN` で N ビット化しており、**境界不具合を防止**。

### 改善余地

* ドメイン毎の**テーブル化**（`mark1/mark2/jmark` の事前表）で分岐削減。
* `exec_solutions` の巨大 if-else を**ディスパッチテーブル化**。
* **並列化**は星座単位が自然（constellations の分割）。
* 回帰テストに **N=8,10,12,13** の既知 Total を含めると安心。

---

### 実行ログ

```bash
fedora$ codon build -release 13Py_constellations_codon.py && ./13Py_constellations_codon
 N:        Total       Unique        hh:mm:ss.ms
 5:           18            0         0:00:00.000
 6:            4            0         0:00:00.000
 7:           40            0         0:00:00.000
 8:           92            0         0:00:00.000
 9:          352            0         0:00:00.000
10:          724            0         0:00:00.000
11:         2680            0         0:00:00.001
12:        14200            0         0:00:00.002
13:        73712            0         0:00:00.012
14:       365596            0         0:00:00.056
15:      2279184            0         0:00:00.268
16:     14772512            0         0:00:01.665
17:     95815104            0         0:00:11.649
fedora$
```

---



## ソースコード
``` python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

"""
Python/codon Ｎクイーン コンステレーション版

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

結論から言えば codon for python 17Py_ は GPU/CUDA 10Bit_CUDA/01CUDA_Bit_Symmetry.cu と同等の速度で動作します。

 $ nvcc -O3 -arch=sm_61 -m64 -ptx -prec-div=false 04CUDA_Symmetry_BitBoard.cu && POCL_DEBUG=all ./a.out -n ;
対称解除法 GPUビットボード
20:      39029188884       4878666808     000:00:02:02.52
21:     314666222712      39333324973     000:00:18:46.52
22:    2691008701644     336376244042     000:03:00:22.54
23:   24233937684440    3029242658210     001:06:03:49.29

amazon AWS m4.16xlarge x 1
$ codon build -release 15Py_constellations_optimize_codon.py && ./15Py_constellations_optimize_codon
20:      39029188884                0          0:02:52.430
21:     314666222712                0          0:24:25.554
22:    2691008701644                0          3:29:33.971
23:   24233937684440                0   1 day, 8:12:58.977

python 15py_ 以降の並列処理を除けば python でも動作します
$ python <filename.py>

codon for python ビルドしない実行方法
$ codon run <filename.py>

codon build for python ビルドすればC/C++ネイティブに変換し高速に実行します
$ codon build -release < filename.py> && ./<filename>


詳細はこちら。
【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題

エイト・クイーンのプログラムアーカイブ
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens
"""

"""
N-Queens：星座(Constellations) 前計算＋規約化＋多分岐ビットDFS（Total/Unique基盤）
======================================================================
ファイル: 13Py_constellations_bitdfs.py
作成日: 2025-10-23

概要:
  - 外周4点 (i,j,k,l) を「星座」として列挙 → 回転/ミラー同型を除去（規約化）→ 各星座ごとに
    事前固定マスクを作成して内部をビットDFSで畳み込む構成。
  - 規約化は `jasmin()`（最小端の辺基準で 90° 回転→必要なら垂直ミラー）、
    同型検査は `check_rotations()`（90/180/270）で実施。
  - 内部探索は `SQ*` 群（例: `SQd0B`, `SQd1B`, `SQd2B`, `SQB...` など）で、
    「free集合→LSB抽出→遷移」の定石で深掘り（引用: `bit = free & -free`, `free &= free-1`）。
  - マスクは必ず N ビットに制限（引用: `free = self._maskN(free, N)`）。

実装上の要点（引用）:
  - 可置集合: `free = mask & ~(ld | rd | col)` あるいは分岐専用の `next_free = self._maskN(~(... ), N)`
  - LSB抽出:  `bit = free & -free`、消費: `free &= free-1`
  - 先読み:    `lookahead = self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)), N)`
  - 星座保存:  `startijkl = (row<<20) | ijkl` で「開始行＋(i,j,k,l)」を一括パック

検証の目安:
  - 小 N（例: N=5,8,13）で既知 Total（N=8→92, N=13→73712）と一致するかをまず確認。

注意:
  - 多数の `SQ*` は枝刈り条件（`mark1/mark2/jmark/endmark`）が異なるだけで核心は共通。
  - すべての `next_free` / `free` を `self._maskN(..., N)` で N ビットに抑制する前提。
  - 本ファイル単体では Unique を直接カウントしない（`symmetry()` は係数 2/4/8 を返す基盤）。



仕上げのレビュー（ごく短く）

強み
星座の規約化（jasmin）＋回転除去で入力を最小代表に圧縮。
set_pre_queens で固定マスクを前段で織り込み、exec_solutions で分岐最適化済み SQ* 群へ直結。
すべての free/next_free を self._maskN で N ビット化しており、境界不具合を防止。

改善余地
ドメイン毎のテーブル化（mark1/mark2/jmark の事前表を用意）で分岐削減。
exec_solutions の巨大 if-else をディスパッチテーブル化。
並列化は星座単位が自然（constellations の分割）。
回帰テストに N=8,10,12,13 の既知 Total を含めると安心。

fedora$ codon build -release 13Py_constellations_codon.py && ./13Py_constellations_codon
 N:        Total       Unique        hh:mm:ss.ms
 5:           18            0         0:00:00.000
 6:            4            0         0:00:00.000
 7:           40            0         0:00:00.000
 8:           92            0         0:00:00.000
 9:          352            0         0:00:00.000
10:          724            0         0:00:00.000
11:         2680            0         0:00:00.001
12:        14200            0         0:00:00.002
13:        73712            0         0:00:00.012
14:       365596            0         0:00:00.056
15:      2279184            0         0:00:00.268
16:     14772512            0         0:00:01.665
17:     95815104            0         0:00:11.649
fedora$

"""
from typing import List,Set,Dict
from datetime import datetime

# pypy を使う場合のみ有効化（Codon では無効）
# import pypyjit
# pypyjit.set_param('max_unroll_recursion=-1')


class NQueens13:
  """
  星座(Consetellations) を正規化・去同型し、星座ごとに内部ビットDFS（SQ* 群）で
  Total を合成するエンジン。主な構成:
    - 低レイヤ: Nビット・ビット演算ユーティリティ（_maskN, pack/unpack, rot/mirror）
    - 規約化/同型: check_rotations, jasmin, symmetry, symmetry90
    - 前計算: set_pre_queens（星座ごとの固定クイーン配置を反映）
    - 実行: exec_solutions（SQ* 群を適切に呼び分け、solutions を星座に書き戻す）
    - 星座列挙: gen_constellations（i,j,k,l を生成→規約化→前計算エントリ化）
  注意:
    - SQ* 群は探索フェーズ別の枝刈り条件を分岐で表現。free/next_free は必ず _maskN で N ビット化。
  """

  def __init__(self)->None:
    pass

  @staticmethod
  def _maskN(x:int,N:int)->int:
    """
    役割: x の下位 N ビットだけを残すマスク（安全ガード）。
    戻り値: x & ((1<<N) - 1)
    用途: free/next_free/ld/rd/col の幅を N ビットに制限（オーバーシフト対策）。
    """
    return x&((1<<N)-1)

  def to_ijkl(self,i:int,j:int,k:int,l:int)->int:
    """
    役割: 5ビット×4（最大31）で i,j,k,l を 20ビットにパック。
    戻り値: (i<<15) + (j<<10) + (k<<5) + l
    """
    return (i<<15)+(j<<10)+(k<<5)+l

  # geti/getj/getk/getl は 5ビット抽出器
  def geti(self,ijkl:int)->int: return (ijkl>>15)&0x1F
  def getj(self,ijkl:int)->int: return (ijkl>>10)&0x1F
  def getk(self,ijkl:int)->int: return (ijkl>>5)&0x1F
  def getl(self,ijkl:int)->int: return ijkl&0x1F

  def rot90(self,ijkl:int,N:int)->int:
    """
    役割: (i,j,k,l) を盤面の 90° 回転で写像（packed 20bit のまま回す）。
    参考（引用）:
      `((N-1-k)<<15) + ((N-1-l)<<10) + (j<<5) + i`
    """
    return ((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl)

  def mirvert(self,ijkl:int,N:int)->int:
    """
    役割: 垂直ミラー（上下対称）で写像。
    参考（引用）:
      `to_ijkl(N-1-i, N-1-j, l, k)`
    """
    return self.to_ijkl(N-1-self.geti(ijkl),N-1-self.getj(ijkl),self.getl(ijkl),self.getk(ijkl))

  @staticmethod
  def ffmin(a: int, b: int) -> int:
    """単純最小値（分岐を明示して JIT/LLVM の最適化を誘発）。"""
    return a if a < b else b

  def SQd0B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    """
    役割:
      ビットボードDFSの分岐サブルーチン。free集合から LSB を1つずつ取り、
      (ld, rd, col) を更新して次行へ進める。枝刈りの境界（jmark/mark1/mark2/endmark）
      に応じて「行スキップ（+1, +2, +3）」や「固定ビット加算（例: `| (1<<N3)`）」を行う。
    入出力（共通）:
      ld/rd/col:   衝突ビット（左斜め/右斜め/列）
      row:         現在の行（または抽象化された段階）
      free:        可置集合（※ 毎回 `self._maskN(free, N)` で Nビット化）
      jmark/endmark/mark1/mark2: 境界パラメータ（星座から誘導）
      tempcounter: 1 要素リスト。葉に到達した回数を加算（例: `tempcounter[0]+=1`）
      N:           盤サイズ
    コア定石（引用）:
      - `free = self._maskN(free, N)`
      - `while free: bit = free & -free; free &= free - 1; ...`
      - `next_free = self._maskN(~( (ld'|bit)<<s1 | (rd'|bit)>>s2 | (col'|bit) | 固定ビット ), N)`
      - 先読み: `lookahead = self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)), N)`
    葉判定:
      - 例1: `if row == endmark: tempcounter[0]+=1; return`
      - 例2: `if row == endmark and self._maskN(free & ~1, N): tempcounter[0]+=1`
    備考:
      - この関数族は役割／入口条件が異なるだけで「ビットDFS＋枝刈り」の核は共通。
      - **必ず** free/next_free を `_maskN(..., N)` で N ビットに制限する。

    SQd0B: 「基本分岐。row==endmark で葉。lookahead により最終一歩手前の無駄探索を抑制。」
    SQd0BkB: 「row==mark1 で 2 行スキップ（<<2, >>2）。N-3 の固定ビット 1<<N3 を加える分岐を含む。」
    SQd1B: 「row+1 >= endmark か lookahead が立つときのみ再帰（1段先読み）。」
    SQd1BlB: 「row==mark2 の分岐で ((ld|bit)<<2)|1 を用い2行先へジャンプ。」
    SQd1BkB: 「row==mark2 分岐で N-3 固定ビットを右斜めに付与。」
    SQd2B: 「葉判定で free & ~1 を要求（末尾固定マス除外）。」
    SQBlBjrB: 「row==mark2 で |1 固定、2 行スキップして SQBjrB へ接続。」
    SQBjrB: 「row==jmark 分岐：free &= ~1; ld |= 1 で側端固定して以降 SQB へ。」
    SQB: 「ベース分岐。row==endmark で tempcounter[0]+=1。」
    ※他の SQ* も上記を参考に、分岐ごとの「固定ビットの付与」「シフト量」「行スキップ幅」だけ一行追記してください。

    """

    mask=(1<<N)-1
    if row==endmark:
      tempcounter[0]+=1
      return
    free=self._maskN(free,N)
    while free:
      bit=free&-free
      free&=free-1
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free=self._maskN(~(next_ld|next_rd|next_col),N)
      if next_free:
        lookahead=self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)),N)
        if row >= endmark-1 or lookahead:
          self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd0BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if next_free:
        self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd0BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N4=N-4
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4)),N)
      if next_free:
        self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd1BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    if row==endmark:
      tempcounter[0]+=1
      return
    free=self._maskN(free,N)
    while free:
      bit=free&-free
      free&=free-1
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free=self._maskN(~(next_ld|next_rd|next_col),N)
      if next_free:
        lookahead=self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)),N)
        if row+1 >= endmark or lookahead:
          self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if next_free:
        self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd1BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    free=self._maskN(free,N)
    while row==mark2 and free:
      bit=free&-free
      free&=free-1
      next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
      next_free=self._maskN(~(next_ld|next_rd|next_col),N)
      if next_free:
        lookahead=self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)),N)
        if row+2 >= endmark or lookahead:
          self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd1BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3)),N)
      if next_free:
        self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd1BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1),N)
      if next_free:
        self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd1BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd1BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark2 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if next_free:
        self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd1BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2),N)
      if next_free:
        self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd2BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N4=N-4
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1),N)
      if next_free:
        self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd2BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark2 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if next_free:
        self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd2BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1),N)
      if next_free:
        self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd2BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    free=self._maskN(free,N)
    while row==mark2 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1),N)
      if next_free:
        self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd2BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if next_free:
        self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQd2BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQd2B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    mask=(1<<N)-1
    if row==endmark:
      if self._maskN(free&(~1),N):
        tempcounter[0]+=1
      return
    free=self._maskN(free,N)
    while free:
      bit=free&-free
      free&=free-1
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free=self._maskN(~(next_ld|next_rd|next_col),N)
      if next_free:
        lookahead=self._maskN(~(((next_ld<<1)|(next_rd>>1)|(next_col))),N)
        if row >= endmark-1 or lookahead:
          self.SQd2B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  # 以降の SQB* 系も同様に `next_free` と `free` をマスクしつつそのまま踏襲
  def SQBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    free=self._maskN(free,N)
    while row==mark2 and free:
      bit=free&-free
      free&=free-1
      nextfree=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1),N)
      if nextfree:
        self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      nextfree=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if nextfree:
        self.SQBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      nextfree=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if nextfree:
        self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      nextfree=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if nextfree:
        self.SQBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    free=self._maskN(free,N)
    if row==jmark:
      free&=~1
      ld |= 1
      while free:
        bit=free&-free
        free&=free-1
        next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
        next_free=self._maskN(~(next_ld|next_rd|next_col),N)
        if next_free:
          self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit=free&-free
      free&=free-1
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free=self._maskN(~(next_ld|next_rd|next_col),N)
      if next_free:
        self.SQBjrB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    free=self._maskN(free,N)
    while free:
      bit=free&-free
      free&=free-1
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free=self._maskN(~(next_ld|next_rd|next_col),N)
      if next_free:
        lookahead=self._maskN(~(((next_ld<<1)|(next_rd>>1)|next_col)),N)
        if row >= endmark-1 or lookahead:
          self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1),N)
      if next_free:
        self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N3=N-3
    free=self._maskN(free,N)
    while row==mark2 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)),N)
      if next_free:
        self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N4=N-4
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1),N)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N3=N-3
    free=self._maskN(free,N)
    while row==mark1 and free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2),N)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBjlBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N1=N-1
    free=self._maskN(free,N)
    if row==N1-jmark:
      rd |= 1<<N1
      free&=~(1<<N1)
      self.SQBkBlBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBjlBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBjlBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N1=N-1
    free=self._maskN(free,N)
    if row==N1-jmark:
      rd |= 1<<N1
      free&=~(1<<N1)
      self.SQBlBkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBjlBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBjlBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N1=N-1
    free=self._maskN(free,N)
    if row==N1-jmark:
      rd |= 1<<N1
      free&=~(1<<N1)
      self.SQBklBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBjlBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def SQBjlBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:List[int],N:int)->None:
    N1=N-1
    free=self._maskN(free,N)
    if row==N1-jmark:
      rd |= 1<<N1
      free&=~(1<<N1)
      self.SQBlkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit=free&-free
      free&=free-1
      next_free=self._maskN(~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit)),N)
      if next_free:
        self.SQBjlBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)

  def check_rotations(self,ijkl_list:Set[int],i:int,j:int,k:int,l:int,N:int)->bool:
    """
    役割: 候補 (i,j,k,l) に対し、90/180/270°回転像が既に集合にあるかをチェック。
    実装（引用）: rot90/180/270 を計算して `any(rot in ijkl_list for rot in (...))`
    戻り値: 重複が見つかれば True（= スキップ推奨）
    """
    rot90=((N-1-k)<<15)+((N-1-l)<<10)+(j<<5)+i
    rot180=((N-1-j)<<15)+((N-1-i)<<10)+((N-1-l)<<5)+(N-1-k)
    rot270=(l<<15)+(k<<10)+((N-1-i)<<5)+(N-1-j)
    return any(rot in ijkl_list for rot in (rot90,rot180,rot270))

  def symmetry90(self,ijkl:int,N:int)->bool:
    """
    役割: 90°回転で自己一致するかを判定。
    実装（引用）: 左辺 (i,j,k,l) と右辺 rot90(i,j,k,l) を packed のまま比較。
    戻り値: True（90°自己同型）/ False
    """
    return (
      (self.geti(ijkl)<<15)+(self.getj(ijkl)<<10)+(self.getk(ijkl)<<5)+self.getl(ijkl)
    )==(
      ((N-1-self.getk(ijkl))<<15)
     +((N-1-self.getl(ijkl))<<10)
     +(self.getj(ijkl)<<5)
     +self.geti(ijkl)
    )

  def symmetry(self,ijkl:int,N:int)->int:
    """
    役割: 星座の同型クラス係数を返す。90°自己同型→2、180°自己同型→4、一般→8。
    判定（引用）:
      - `if self.symmetry90(...): return 2`
      - `if i==N-1-j and k==N-1-l: return 4`
      - else 8
    """
    if self.symmetry90(ijkl,N):
      return 2
    if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl):
      return 4
    return 8

  def jasmin(self,ijkl:int,N:int)->int:
    """
    役割: 最小端に近い辺を基準に 90°回転を規約化し、必要があれば垂直ミラーする
          「Jasmin」規約実装。星座を代表形に寄せる。
    実装（引用）:
      - `arg` 回だけ `rot90` を適用（min-arg 辺へ回す）
      - `if j < N-1-j: ijkl = mirvert(ijkl, N)`
    戻り値: 規約化後の packed 星座
    """
    # 最小端に近い辺を基準に 90° 回転を規約化し、必要なら垂直ミラー
    arg=0
    min_val=self.ffmin(self.getj(ijkl),N-1-self.getj(ijkl))
    if self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl)) < min_val:
      arg=2
      min_val=self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))
    if self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl)) < min_val:
      arg=3
      min_val=self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))
    if self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl)) < min_val:
      arg=1
      min_val=self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))
    for _ in range(arg):
      ijkl=self.rot90(ijkl,N)
    if self.getj(ijkl) < N-1-self.getj(ijkl):
      ijkl=self.mirvert(ijkl,N)
    return ijkl

  def set_pre_queens(self,ld:int,rd:int,col:int,k:int,l:int,row:int,queens:int,LD:int,RD:int,counter:List[int],constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    """
    役割:
      星座で決まる外周条件 (i,j,k,l) をビットマスク (LD/RD/col) に反映しつつ、
      盤の上側から `preset_queens` 個の固定クイーンを前配置して「起点状態」を列挙。
    コア（引用）:
      - 行スキップ: `if row==k or row==l: ...`（外周で既に塞がる行を飛ばす）
      - 可置集合: `free = self._maskN(~(ld|rd|col|(LD>>(N-1-row))|(RD<<(N-1-row))), N)`
      - LSB抽出:  `bit = free & -free; free &= free-1`
      - 保存:      `constellations.append({"ld": ld, "rd": rd, "col": col, "startijkl": row<<20, "solutions": 0})`
      - カウンタ:  `counter[0] += 1`（星座あたりの起点の個数）
    注意:
      - ここで保存する `startijkl` の上位 12bit は開始行（`row<<20`）として使用。
    """
    mask=(1<<N)-1
    if row==k or row==l:
      self.set_pre_queens(ld<<1,rd>>1,col,k,l,row+1,queens,LD,RD,counter,constellations,N,preset_queens)
      return
    if queens==preset_queens:
      constellations.append({"ld":ld,"rd":rd,"col":col,"startijkl":row<<20,"solutions":0})
      counter[0]+=1
      return
    free=self._maskN(~(ld|rd|col|(LD>>(N-1-row))|(RD<<(N-1-row))),N)
    while free:
      bit=free&-free
      free&=free-1
      self.set_pre_queens((ld|bit)<<1,(rd|bit)>>1,col|bit,k,l,row+1,queens+1,LD,RD,counter,constellations,N,preset_queens)

  def exec_solutions(self,constellations:List[Dict[str,int]],N:int)->None:
    """
    役割:
      各星座エントリについて、起点行・(i,j,k,l) を復元し、境界（jmark/mark1/mark2/endmark）に
      応じて適切な `SQ*` サブルーチンへディスパッチ。返ってきた部分解を `symmetry()` の
      係数（2/4/8）で重み付けして `solutions` に格納。
    コア（引用）:
      - 復元: `start = start_ijkl >> 20; ijkl = start_ijkl & ((1<<20)-1)`
      - 入口マスク: `ld=(ld>>1); rd=(rd>>1); col=(col>>1)|(~((1<<(N-2))-1))`
      - 先頭 free: `free = self._maskN(~(ld|rd|col), N)`
      - 分岐例: `if j < (N-3): ... elif j == (N-3): ... elif j == N-2: ... else: ...`
      - 呼出例: `self.SQBjrB(...)`, `self.SQd2B(...)`, `self.SQd1BlB(...)`, など
      - 合成: `constellation["solutions"] = temp_counter[0] * self.symmetry(ijkl, N)`
    """
    small_mask=(1<<(N-2))-1
    temp_counter=[0]
    for constellation in constellations:
      start_ijkl=constellation["startijkl"]
      start=start_ijkl>>20
      ijkl=start_ijkl&((1<<20)-1)
      j,k,l=self.getj(ijkl),self.getk(ijkl),self.getl(ijkl)
      jmark=j+1      # 既定は j+1（多くの分岐でこの値を使う）
      mark1=0        # 未使用分岐でも未定義参照にならないよう初期化
      mark2=0
      ld=(constellation["ld"]>>1)
      rd=(constellation["rd"]>>1)
      col=(constellation["col"]>>1)|(~small_mask)
      LD=(1<<(N-1-j))|(1<<(N-1-l))
      ld |= LD>>(N-start)
      if start > k:
        rd |= (1<<(N-1-(start-k+1)))
      if j >= 2*N-33-start:
        rd |= (1<<(N-1-j))<<(N-2-start)
      # free の初期化は必ず N ビットでマスク
      free=self._maskN(~(ld|rd|col),N)
      if j < (N-3):
        jmark,endmark=j+1,N-2
        if j > 2*N-34-start:
          if k < l:
            mark1,mark2=k-1,l-1
            if start < l:
              if start < k:
                if l!=k+1:
                  self.SQBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else:
                  self.SQBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                self.SQBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark1,mark2=l-1,k-1
            if start < k:
              if start < l:
                if k!=l+1:
                  self.SQBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else:
                  self.SQBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                self.SQBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          if k < l:
            mark1,mark2=k-1,l-1
            if l!=k+1:
              self.SQBjlBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              self.SQBjlBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark1,mark2=l-1,k-1
            if k!=l+1:
              self.SQBjlBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              self.SQBjlBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      elif j==(N-3):
        endmark=N-2
        if k < l:
          mark1,mark2=k-1,l-1
          if start < l:
            if start < k:
              if l!=k+1:
                self.SQd2BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                self.SQd2BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=l-1
              self.SQd2BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          mark1,mark2=l-1,k-1
          endmark=N-2
          if start < k:
            if start < l:
              if k!=l+1:
                self.SQd2BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                self.SQd2BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=k-1
              self.SQd2BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      elif j==N-2:
        if k < l:
          endmark=N-2
          if start < l:
            if start < k:
              mark1=k-1
              if l!=k+1:
                mark2=l-1
                self.SQd1BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                self.SQd1BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=l-1
              self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          if start < k:
            if start < l:
              if k < N-2:
                mark1,endmark=l-1,N-2
                if k!=l+1:
                  mark2=k-1
                  self.SQd1BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else:
                  self.SQd1BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                if l!=(N-3):
                  mark2,endmark=l-1,N-3
                  self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else:
                  endmark=N-4
                  self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              if k!=N-2:
                mark2,endmark=k-1,N-2
                self.SQd1BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:
                endmark=N-3
                self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            endmark=N-2
            self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else:
        endmark=N-2
        if start > k:
          self.SQd0B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          mark1=k-1
          self.SQd0BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      constellation["solutions"]=temp_counter[0]*self.symmetry(ijkl,N)
      temp_counter[0]=0

  def gen_constellations(self,ijkl_list:Set[int],constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    """
    役割:
      星座候補 (i,j,k,l) を列挙→回転重複を `check_rotations()` で排除→
      角あり星座を追加→`jasmin()` で規約形へ→
      その後 `set_pre_queens()` を呼んで星座ごとの「起点状態」を蓄積する。
    コア（引用）:
      - 角なし星座: `for k in range(1, halfN) ... if not self.check_rotations(...): add`
      - 角あり星座: `{to_ijkl(0, j, 0, l) ...}`
      - 規約化:      `ijkl_list = { self.jasmin(c, N) for c in ijkl_list }`
      - 事前反映:    `LD, RD = (L>>j)|(L>>l), (L>>j)|(1<<k)` など個別マスクを組み立てて
                     `set_pre_queens(...)` を実行
      - `startijkl` の後詰め: `...["startijkl"] |= to_ijkl(i,j,k,l)`
    """

    halfN=(N+1) // 2
    # 角に Q がない開始星座
    ijkl_list.update(
      self.to_ijkl(i,j,k,l)
      for k in range(1,halfN)
      for l in range(k+1,N-1)
      for i in range(k+1,N-1)
      if i!=(N-1)-l
      for j in range(N-k-2,0,-1)
      if j!=i and j!=l
      if not self.check_rotations(ijkl_list,i,j,k,l,N)
    )
    # 角に Q がある開始星座
    ijkl_list.update({self.to_ijkl(0,j,0,l) for j in range(1,N-2) for l in range(j+1,N-1)})
    # Jasmin 規約化
    ijkl_list={self.jasmin(c,N) for c in ijkl_list}

    L=1<<(N-1)
    for sc in ijkl_list:
      i,j,k,l=self.geti(sc),self.getj(sc),self.getk(sc),self.getl(sc)
      ld=(L>>(i-1))|(1<<(N-k))
      rd=(L>>(i+1))|(1<<(l-1))
      col=1|L|(L>>i)|(L>>j)
      LD,RD=(L>>j)|(L>>l),(L>>j)|(1<<k)
      counter=[0]
      self.set_pre_queens(ld,rd,col,k,l,1,3 if j==N-1 else 4,LD,RD,counter,constellations,N,preset_queens)
      current_size=len(constellations)
      for a in range(counter[0]):
        constellations[current_size-a-1]["startijkl"] |= self.to_ijkl(i,j,k,l)


class NQueens13_constellations:
  """
  ドライバ/CLI。小 N はフォールバック（_bit_total）、
  N>=6 は NQueens13 の星座前計算 → 実行で Total を表示（Unique は 0）。
  """

  def _bit_total(self,size:int)->int:
    """
    役割: 小 N（例: <=5）の検算用に、素朴なビットDFSで Total を算出。
    コア（引用）: `bitmap = mask & ~(left | down | right)`, `bit = -bitmap & bitmap`
    """

    # 小さなNは正攻法で数える（対称重みなし・全列挙）
    mask=(1<<size)-1
    total=0
    def bt(row:int,left:int,down:int,right:int):
      nonlocal total
      if row==size:
        total+=1
        return
      bitmap=mask&~(left|down|right)
      while bitmap:
        bit=-bitmap&bitmap
        bitmap^=bit
        bt(row+1,(left|bit)<<1,down|bit,(right|bit)>>1)
    bt(0,0,0,0)
    return total

  def main(self)->None:
    """
    役割: N=5..17 を走査。N<=5は `_bit_total`、それ以外は
          `NQueens13().gen_constellations(...) → exec_solutions(...) → 合算`。
    出力（引用）:
      `print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")`
    注意:
      - range の上限は含まれない（18 を含めるなら nmax=19）。
      - I/O は計測に影響。ベンチ時は出力抑制を検討。
    """

    nmin:int=5
    nmax:int=18
    preset_queens:int=4
    print(" N:        Total       Unique         hh:mm:ss.ms")
    for size in range(nmin,nmax):
      start_time=datetime.now()
      if size <= 5:
        # ← フォールバック：N=5はここで正しい10を得る
        total=self._bit_total(size)
        dt=datetime.now()-start_time
        text=str(dt)[:-3]
        print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")
        continue
      ijkl_list:Set[int]=set()
      constellations:List[Dict[str,int]]=[]
      nq=NQueens13()
      nq.gen_constellations(ijkl_list,constellations,size,preset_queens)
      nq.exec_solutions(constellations,size)
      total=sum(c["solutions"] for c in constellations if c["solutions"] > 0)
      dt=datetime.now()-start_time
      text=str(dt)[:-3]
      print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")

if __name__=="__main__":
  NQueens13_constellations().main()

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






















