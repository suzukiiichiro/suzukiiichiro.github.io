---
title: "Ｎクイーン問題（９１）Python/Codonで爆速プログラミング ビットで対象解除法"
date: 2025-10-27T13:25:27+09:00
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

## Python / Codon Ｎクイーン bit 対象解除版

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
# Python（通常）
$ python <filename.py>

# Codon（ビルドしない実行）
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

## N-Queens：ビットボード + 境界制約 + 対称性分類（COUNT2/4/8）

**ファイル:** `07Py_bitboard_symmetry_classes.py`
**作成日:** 2025-10-23

---

### 概要

* ビットボードDFSに、**上辺/下辺/両辺の境界制約**（`bound1/bound2`, `sidemask/lastmask`）を併用。
* 回転(90/180/270) + 垂直反転の**同型判定**で代表解のみを数え、**COUNT2 / COUNT4 / COUNT8** に分類。
  → **Unique = count2 + count4 + count8**
  　 **Total  = count2*2 + count4*4 + count8*8**

---

### 設計のキモ（実ソース引用）

* **可置集合**

  ```python
  bitmap = ((1<<size)-1) & ~(left | down | right)
  ```
* **LSB 抽出と消費**

  ```python
  bit = -bitmap & bitmap
  bitmap ^= bit
  ```
* **伝播**

  ```python
  left <<= 1
  right >>= 1
  down |= bit
  ```
* **角あり探索**: `backTrack1()`（先頭2行で `1` と `(1<<bound1)` を確定）
* **角なし探索**: `backTrack2()`（上辺/下辺で `sidemask/lastmask` を適用）
* **同型判定**: `symmetryops()`（`board[row]` は *row→bit* の列ベクトル）

---

### 検証の目安

* 代表的な N（例: **N=13 → Unique=9233, Total=73712**）で既知表と一致すること。

---

### 注意

* `lastmask` の漸進更新（`lastmask = (lastmask<<1) | lastmask | (lastmask>>1)`）は**両辺拘束の伝播**。
* Python は任意長 `int` だが、Codon 等の固定幅では **`size` とマスク幅の整合**を保つこと。
* I/O は計測を歪めるため、ベンチ用途では**印字最小**に。

---

## 仕上げのレビュー & 注意点（短め）

### 完成度

* **対称性分類（symmetryops）** と **境界制約（sidemask/lastmask）** の組み合わせが教科書的。
* **角あり/なしの分離**は典型的 2 系統アプローチで、**COUNT8** への直加算設計も妥当。

### 検算の指針

* 小さめの N（例: 5, 6, 7, 8, 13）で既知表と照合。特に **N=13** の
  **Unique=9233, Total=73712** が通れば、分類周りの信頼性は高いです。

---

### 実行ログ

```bash
fedora$ codon build -release 07Py_bit_symmetry_codon.py && ./07Py_bit_symmetry_codon
 N:        Total       Unique        hh:mm:ss.ms
 4:            2            1         0:00:00.000
 5:           10            2         0:00:00.000
 6:            4            1         0:00:00.000
 7:           40            6         0:00:00.000
 8:           92           12         0:00:00.000
 9:          352           46         0:00:00.000
10:          724           92         0:00:00.000
11:         2680          341         0:00:00.000
12:        14200         1787         0:00:00.003
13:        73712         9233         0:00:00.018
14:       365596        45752         0:00:00.092
15:      2279184       285053         0:00:00.411
16:     14772512      1846955         0:00:02.702
^C
fedora$
```

---


## ソースコード
``` python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
"""
Python/codon Ｎクイーン bit 対象解除版

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
N-Queens：ビットボード + 境界制約 + 対称性分類（COUNT2/4/8）
============================================================
ファイル: 07Py_bitboard_symmetry_classes.py
作成日: 2025-10-23

概要:
  - ビットボードDFSに、上辺/下辺/両辺の境界制約（bound1/bound2, sidemask/lastmask）を併用。
  - 回転(90/180/270) + 垂直反転の同型判定で代表解のみを数え、COUNT2/COUNT4/COUNT8 に分類。
    → Unique = count2 + count4 + count8
       Total  = count2*2 + count4*4 + count8*8

設計のキモ（実ソース引用）:
  - 可置集合: `bitmap = ((1<<size)-1) & ~(left | down | right)`
  - LSB抽出:  `bit = -bitmap & bitmap`; 消費: `bitmap ^= bit`
  - 伝播:      `left<<=1`, `right>>=1`, `down|=bit`
  - 角あり探索:  `backTrack1()`（先頭2行で 1 と (1<<bound1) を確定）
  - 角なし探索:  `backTrack2()`（上辺/下辺で sidemask/lastmask を適用）
  - 同型判定:   `symmetryops()`（`board[row]` は row→bit の列ベクトル）

検証の目安:
  - 代表的な N（例: N=13 → Unique=9233, Total=73712）で既知表と一致すること。

注意:
  - `lastmask` の漸進更新（`lastmask = (lastmask<<1) | lastmask | (lastmask>>1)`）は両辺拘束の伝播。
  - Python は任意長 int だが、Codon等の固定幅では `size` とマスク幅の整合を保つこと。
  - I/O は計測を歪めるため、ベンチ用途では印字を最小に。

仕上げのレビュー & 注意点（短め）

完成度
対称性分類（symmetryops）と境界制約（sidemask/lastmask）の組み合わせが教科書的。
角あり/なしの分離は、典型的な 2 系統アプローチで、COUNT8 への直加算設計も妥当。

検算の指針
小さめの N（例: 5, 6, 7, 8, 13）で既知表と照合。特に N=13 の
Unique=9233, Total=73712 が通れば、分類周りの信頼性は高いです。


fedora$ codon build -release 07Py_bit_symmetry_codon.py && ./07Py_bit_symmetry_codon
 N:        Total       Unique        hh:mm:ss.ms
 4:            2            1         0:00:00.000
 5:           10            2         0:00:00.000
 6:            4            1         0:00:00.000
 7:           40            6         0:00:00.000
 8:           92           12         0:00:00.000
 9:          352           46         0:00:00.000
10:          724           92         0:00:00.000
11:         2680          341         0:00:00.000
12:        14200         1787         0:00:00.003
13:        73712         9233         0:00:00.018
14:       365596        45752         0:00:00.092
15:      2279184       285053         0:00:00.411
16:     14772512      1846955         0:00:02.702
^C
fedora$

"""
from datetime import datetime
from typing import List

# pypy を使う場合はコメントを解除（Codon では無効）
# import pypyjit
# pypyjit.set_param('max_unroll_recursion=-1')

class NQueens07:
  """
  ビットボードDFSに境界制約と対称性分類（COUNT2/4/8）を組み合わせ、
  Unique/Total を同時計数する完成版。

  メンバー（要点）:
    board    : row→bit の列配置（例: 0b00010000）
    bound1/2 : 上辺/下辺の分岐境界（角あり/なし探索の分岐に使用）
    topbit   : 最上位ビット (1<<(N-1))
    endbit   : 下辺側の終端ビット（角なしの回転対称チェック用）
    sidemask : 左右端の制約 (topbit | 1)
    lastmask : 両辺制約の伝播マスク
    count2/4/8 : 同型分類での代表解カウント
  """

  # --- 結果/状態（Codon向けに事前宣言） ---
  total:int
  unique:int
  board:List[int]
  size:int
  bound1:int
  bound2:int
  topbit:int
  endbit:int
  sidemask:int
  lastmask:int
  count2:int
  count4:int
  count8:int

  def __init__(self)->None:
    # 実体は init(size) で与える
    pass

  def init(self,size:int)->None:
    """
    役割:
      盤サイズに応じて状態・カウンタを初期化する（マスクは都度式で算出）。
    初期化（引用）:
      `self.board = [0 for _ in range(size)]`
      `self.topbit = 0; self.endbit = 0; self.sidemask = 0; self.lastmask = 0`
      `self.count2 = self.count4 = self.count8 = 0`
    """

    self.total=0
    self.unique=0
    self.board=[0 for _ in range(size)]
    self.size=size
    self.bound1=0
    self.bound2=0
    self.topbit=0
    self.endbit=0
    self.sidemask=0
    self.lastmask=0
    self.count2=0
    self.count4=0
    self.count8=0

  def symmetryops(self,size:int)->None:
    """
    役割:
      現在の `board`（row→bit）に対して、回転(90/180/270)と垂直反転（およびその回転）
      で辞書順最小判定を行い、COUNT2/4/8 のいずれかに分類して対応カウントを増やす。

    判定手順（実装要点の引用）:
      - 90° 判定の入口条件:
          `if self.board[self.bound2] == 1: ...`
        行インデックス (own/you) とパターン (ptn/bit) を進めて比較。
        → すべて一致なら `self.count2 += 1; return`
      - 180° 判定:
          `if self.board[size-1] == self.endbit: ...`
        → 一致なら `self.count4 += 1; return`
      - 270° 判定:
          `if self.board[self.bound1] == self.topbit: ...`
        → ここまで一致しなければ `self.count8 += 1`

    注意:
      - 途中で「self.board[own] > bit」判定が出たら、現配置は代表でないため return。
      - `board` は row→bit の形式で保持し、比較は常にこの形式で実施する。
    """

    """対象解除: 90/180/270回転 + 垂直反転 で代表性を判定して count2/4/8 を増やす。"""
    # --- 90度回転 ---
    if self.board[self.bound2]==1:
      own:int=1
      ptn:int=2
      while own<=size-1:
        bit:int=1
        you:int=size-1
        # board[you] を ptn に合わせつつ、board[own] と bit を進める
        while self.board[you]!=ptn and self.board[own]>=bit:
          bit<<=1
          you-=1
        if self.board[own]>bit:
          return
        if self.board[own]<bit:
          break
        own+=1
        ptn<<=1
      # 90度回転が同型
      if own>size-1:
        self.count2+=1
        return
    # --- 180度回転 ---
    if self.board[size-1]==self.endbit:
      own=1
      you=size-2
      while own<=size-1:
        bit=1
        ptn=self.topbit
        while self.board[you]!=ptn and self.board[own]>=bit:
          bit<<=1
          ptn>>=1
        if self.board[own]>bit:
          return
        if self.board[own]<bit:
          break
        own+=1
        you-=1
      # 180度回転が同型
      if own>size-1:
        self.count4+=1
        return
    # --- 270度回転 ---
    if self.board[self.bound1]==self.topbit:
      own=1
      ptn=self.topbit>>1
      while own<=size-1:
        bit=1
        you=0
        while self.board[you]!=ptn and self.board[own]>=bit:
          bit<<=1
          you+=1
        if self.board[own]>bit:
          return
        if self.board[own]<bit:
          break
        own+=1
        ptn>>=1
    self.count8+=1

  def backTrack2(self,size:int,row:int,left:int,down:int,right:int)->None:
    """
    役割:
      角に Q が「ない」ケースのDFS。上辺/下辺の制約を段階的に適用しつつ探索する。

    コア（引用）:
      - 可置集合: `bitmap = ((1<<size)-1) & ~(left | down | right)`
      - 末行: `if row == size-1: if bitmap and (bitmap & self.lastmask) == 0: board[row]=bitmap; symmetryops(size)`
      - 上辺制約（row < bound1）:
          `bitmap = (bitmap | self.sidemask) ^ self.sidemask`  # (= bitmap & ~sidemask)
      - 下辺制約（row == bound2）:
          `if (down & self.sidemask) == 0: return`
          `if (down & self.sidemask) != self.sidemask: bitmap &= self.sidemask`
      - LSB抽出ループ:
          `bit = -bitmap & bitmap; bitmap ^= bit; board[row] = bit; ...`

    ねらい:
      - 代表形に対応しない末行ビット（`bitmap & lastmask != 0`）は棄却。
      - 端の列を使う/使わないの一貫性を `sidemask/lastmask` で担保。
    """

    mask:int=(1<<size)-1
    bitmap:int=mask&~(left|down|right)
    if row==(size-1):
      if bitmap:
        # (bitmap & lastmask) == 0 のときのみ代表性チェックへ
        if (bitmap&self.lastmask)==0:
          self.board[row]=bitmap
          self.symmetryops(size)
      return
    # 上辺・下辺・両辺の制約
    if row<self.bound1:
      # bitmap &= ~sidemask  を  (bitmap|sidemask) ^ sidemask で実装（分岐なしテク）
      bitmap=(bitmap|self.sidemask)^self.sidemask
    else:
      if row==self.bound2:
        if (down&self.sidemask)==0:
          return
        if (down&self.sidemask)!=self.sidemask:
          bitmap&=self.sidemask
    # 候補を 1 ビットずつ試す（LSB 抽出）
    while bitmap:
      bit=-bitmap&bitmap
      bitmap^=bit
      # board[row] は常に「1 ビットだけ立つ」列ベクトル
      self.board[row]=bit
      self.backTrack2(size,row+1,(left|bit)<<1,(down|bit),(right|bit)>>1)

  def backTrack1(self,size:int,row:int,left:int,down:int,right:int)->None:
    """
    役割:
      角に Q が「ある」ケースのDFS。先頭2行を固定してから探索する高速分枝。

    コア（引用）:
      - 可置集合: `bitmap = ((1<<size)-1) & ~(left | down | right)`
      - 末行: `if row == size-1: if bitmap: board[row]=bitmap; count8 += 1; return`
      - 上辺制約（row < bound1）:
          `bitmap = (bitmap | 2) ^ 2`   # (= bitmap & ~2)
      - LSB抽出: `bit = -bitmap & bitmap; bitmap ^= bit; board[row] = bit; ...`

    ねらい:
      - 角固定パターンに対し、左右端の使い方が矛盾する枝を早期に排除。
      - この分枝は 90/180/270/鏡を通じて 8倍クラスに落ちやすいため `count8` に直加算。
    """

    mask:int=(1<<size)-1
    bitmap:int=mask&~(left|down|right)
    if row==(size-1):
      if bitmap:
        self.board[row]=bitmap
        self.count8+=1
      return
    if row<self.bound1:
      # bitmap &= ~2 を (bitmap|2) ^ 2 で実装
      bitmap=(bitmap|2)^2
    while bitmap:
      bit=-bitmap&bitmap
      bitmap^=bit
      self.board[row]=bit
      self.backTrack1(size,row+1,(left|bit)<<1,(down|bit),(right|bit)>>1)

  def NQueens(self,size:int)->None:
    """
    役割:
      角あり/角なしの2系統を適切な境界条件で起動し、COUNT2/4/8 を合算して
      Unique/Total を確定する。

    手順（引用）:
      1) リセット:
         `self.count2 = self.count4 = self.count8 = 0`
         `self.topbit = 1 << (size-1)`
      2) 角あり探索:
         `self.bound1 = 2; self.board[0] = 1`
         ループ内で `bit = 1 << bound1; board[1] = bit; backTrack1(...)`
         → `bound1 += 1`
      3) 角なし探索:
         `self.endbit = self.topbit >> 1`
         `self.sidemask = self.topbit | 1`
         `self.lastmask = self.sidemask`
         `self.bound1 = 1; self.bound2 = size-2`
         while ループで `bit = 1 << bound1; board[0] = bit; backTrack2(...)`
         反復ごとに:
           `bound1 += 1; bound2 -= 1; endbit >>= 1`
           `lastmask = (lastmask << 1) | lastmask | (lastmask >> 1)`
      4) 集計:
         `self.unique = self.count2 + self.count4 + self.count8`
         `self.total  = self.count2*2 + self.count4*4 + self.count8*8`

    注意:
      - `lastmask` の漸進更新は「端を使う配置」パターンの広がりに対応させる重要箇所。
      - `topbit/endbit` は回転比較の境界値（対称性の入口条件）として機能。
    """

    self.total=0
    self.unique=0
    self.count2=self.count4=self.count8=0

    self.topbit=1<<(size-1)
    self.endbit=0
    self.lastmask=0
    self.sidemask=0

    # --- 角に Q があるケース ---
    self.bound1=2
    self.bound2=0
    self.board[0]=1
    while self.bound1>1 and self.bound1<size-1:
      if self.bound1<(size-1):
        bit=1<<self.bound1
        self.board[1]=bit
        self.backTrack1(size,2,(2|bit)<<1,(1|bit),(2|bit)>>1)
      self.bound1+=1

    # --- 角に Q がないケース ---
    self.topbit=1<<(size-1)
    self.endbit=self.topbit>>1
    self.sidemask=self.topbit|1
    self.lastmask=self.sidemask
    self.bound1=1
    self.bound2=size-2
    while self.bound1>0 and self.bound2<size-1 and self.bound1<self.bound2:
      if self.bound1<self.bound2:
        bit=1<<self.bound1
        self.board[0]=bit
        self.backTrack2(size,1,bit<<1,bit,bit>>1)
      self.bound1+=1
      self.bound2-=1
      self.endbit>>=1
      # lastmask は両端使用パターンを伝播させるための総和マスク
      self.lastmask=(self.lastmask<<1)|self.lastmask|(self.lastmask>>1)

    self.unique=self.count2+self.count4+self.count8
    self.total=self.count2*2+self.count4*4+self.count8*8

  def main(self)->None:
    """
    役割:
      N=4..18（※ここでは range(nmin, nmax) なので 18 まで）を走査し、
      Total/Unique と経過時間を表形式で出力。

    実装（引用）:
      `print(" N:        Total       Unique        hh:mm:ss.ms")`
      `print(f"{size:2d}:{self.total:13d}{self.unique:13d}{text:>20s}")`

    メモ:
      - 実測比較では端末I/Oの影響が大きいので、必要に応じて出力を抑制する。
      - nmax を含めたいときは `range(nmin, nmax+1)` に変更。
    """

    nmin:int=4
    nmax:int=19
    print(" N:        Total       Unique        hh:mm:ss.ms")
    for size in range(nmin,nmax):
      self.init(size)
      start_time=datetime.now()
      self.NQueens(size)
      dt=datetime.now()-start_time
      text=str(dt)[:-3]
      print(f"{size:2d}:{self.total:13d}{self.unique:13d}{text:>20s}")

if __name__=='__main__':
  NQueens07().main()

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






















