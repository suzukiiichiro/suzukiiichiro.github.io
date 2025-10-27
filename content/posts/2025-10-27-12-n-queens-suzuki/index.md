---
title: "Ｎクイーン問題（９６）Python/Codonで爆速プログラミング キャリーチェーン"
date: 2025-10-27T13:26:14+09:00
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

## Python / Codon Ｎクイーン キャリーチェーン版

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

## N-Queens：キャリーチェーン法（carry-chain）による高速全解計数（Unique 未算出）

**ファイル:** `12Py_carry_chain_total_only.py`
**作成日:** 2025-10-23

---

### 概要

* 盤外周の **4 辺（W/N/E/S）** の配置を「**鎖（chain）**」として組み上げ、**内部はビットDFSで充填**。
* ビットDFSは「**キャリーチェーン表現**」を使用：`down+1 == 0` を **葉判定**（= 全行が埋まった）。
* 周辺4点の整合性を `placement()` で逐次検証し、**対称クラス係数（2/4/8）** の選択は `Symmetry()` で行う。
* 本段では **Unique は未算出（0 のまま）**。**Total（全解数）** を返す。

---

### キーポイント（実ソース引用）

* **葉判定:** `if not down+1: return 1`  （`down` が -1 なら全列使用）
* **候補抽出:** `bitmap = ~(left | down | right)`（キャリーチェーン空間）
* **LSB抽出:**  `bit = -bitmap & bitmap`
* **境界スキップ:** 先行の空行をまとめて圧縮（`while row & 1: ...`）
* **外周配置:** `placement()` が行/列/対角のビット占有を `B[0..3]` にエンコードして検証
* **対称倍率:** `Symmetry()` が状況に応じて **2/4/8** を返す（**0 は代表でない**）

---

### 用途

* 大きめ N の **Total を高速算出**
* 外周の組合せ（`pres_a/pres_b`）を束ねる「鎖」で探索を分割し、**並列化しやすい構造**

---

### 注意

* Python の `int` は任意長だが、**shift 幅は size に応じて妥当性**が必要。
* `placement()` は盤外の不変条件（四辺や対角制約）を厳密にチェックするため、**変更時は要回帰テスト**。

---

## 仕上げのレビュー（要点）

### 良い点

* `solve()` のキャリーチェーン実装（`down+1==0`、空行圧縮、`~(left|down|right)`）が**簡潔かつ高速**。
* **外周の組立て**と**内部充填**の分離で、境界条件と DFS が**綺麗にデカップル**。
* `Symmetry()` で **2/4/8** を切り分け、冗長解を抑制する設計。

### 改善の余地

* 小盤（`size <= 5`）付近の**シフト境界（size-4, size-5）**はガード推奨（テーブル分岐／早期 return）。
* `deepcopy` 多用は重い → **再利用バッファ**や「**差分適用／巻き戻し**」方式で高速化可。
* 並列化は **buildChain の 4 重ループ（w/n/e/s）** または `pres_*` の分割が自然。
* **検証セット:** `N=8 → Total=92`、`N=13 → Total=73712` の回帰確認を推奨。

---

### 実行ログ

```bash
fedora$ codon build -release 12Py_carryChain_codon.py && ./12Py_carryChain_codon
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            0         0:00:00.000
 6:            4            0         0:00:00.000
 7:           40            0         0:00:00.000
 8:           92            0         0:00:00.002
 9:          352            0         0:00:00.009
10:          724            0         0:00:00.044
11:         2680            0         0:00:00.109
12:        14200            0         0:00:00.302
13:        73712            0         0:00:00.903
14:       365596            0         0:00:01.998
15:      2279184            0         0:00:05.111
16:     14772512            0         0:00:15.222
fedora$
```

---



## ソースコード
``` python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
"""
Python/codon Ｎクイーン キャリーチェーン版

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
N-Queens：キャリーチェーン法（carry-chain）による高速全解計数（Unique 未算出）
======================================================================
ファイル: 12Py_carry_chain_total_only.py
作成日: 2025-10-23

概要:
  - 盤外周の 4 辺（W/N/E/S）の配置を「鎖（chain）」として組み上げ、内部はビットDFSで充填。
  - ビットDFSは「キャリーチェーン表現」を使用：`down+1 == 0` を葉判定（= 全行が埋まった）。
  - 周辺4点の整合性を `placement()` で逐次検証し、対称クラス係数（2/4/8）の選択は `Symmetry()` で行う。
  - 本段では Unique は未算出（0 のまま）。Total（全解数）を返す。

キーポイント（実ソース引用）:
  - 葉判定: `if not down+1: return 1`  （`down` が -1 なら全列使用）
  - 候補抽出: `bitmap = ~(left | down | right)`（キャリーチェーン空間）
  - LSB抽出:  `bit = -bitmap & bitmap`
  - 境界スキップ: 先行の空行をまとめて圧縮（`while row & 1: ...`）
  - 外周配置: `placement()` が行/列/対角のビット占有を B[0..3] にエンコードして検証
  - 対称倍率: `Symmetry()` が状況に応じて 2/4/8 を返す（0 は代表でない）

用途:
  - 大きめ N の Total を高速算出
  - 外周の組合せ（pres_a/pres_b）を束ねる「鎖」で探索を分割し、並列化しやすい構造

注意:
  - Python の int は任意長だが、shift 幅は size に応じて妥当性が必要。
  - `placement()` は盤外の不変条件（四辺や対角制約）を厳密にチェックするため、変更時は要回帰テスト。



仕上げのレビュー（要点）

良い点
solve() のキャリーチェーン実装（down+1==0、空行圧縮、~(left|down|right)）が簡潔かつ高速。
外周の組立てと内部充填の分離により、境界条件とDFSが綺麗にデカップル。
Symmetry() で 2/4/8 を切り分け、冗長解を抑制する設計。

改善の余地
size <= 5 付近のシフト境界（size-4, size-5）はガード推奨（テーブルで分岐/早期 return）。
deepcopy 多用は重いので、再利用バッファや「差分適用/巻き戻し」方式で高速化可。
並列化は buildChain の 4 重ループ（w/n/e/s）または pres_* の分割が自然。
検証セット：N=8→Total=92、N=13→Total=73712 の回帰確認を推奨。

fedora$ codon build -release 12Py_carryChain_codon.py && ./12Py_carryChain_codon
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            0         0:00:00.000
 6:            4            0         0:00:00.000
 7:           40            0         0:00:00.000
 8:           92            0         0:00:00.002
 9:          352            0         0:00:00.009
10:          724            0         0:00:00.044
11:         2680            0         0:00:00.109
12:        14200            0         0:00:00.302
13:        73712            0         0:00:00.903
14:       365596            0         0:00:01.998
15:      2279184            0         0:00:05.111
16:     14772512            0         0:00:15.222
fedora$
"""
from datetime import datetime
from typing import List


class NQueens12:
  """
  キャリーチェーン法で N-Queens の Total を計数する実装（Unique 未算出）。
  構成:
    - 外周(W/N/E/S)の候補列を pres_a/pres_b に前計算（initChain）
    - 外周の4点を鎖状に接続しながら配置検証（buildChain/placement）
    - 対称クラス係数（2/4/8）は Symmetry で決定、内部は solve() でビットDFS
  注意:
    - 本実装は Total のみ。Unique は 0 として出力。
  """

  size:int

  def __init__(self)->None:
    pass

  # ------------------------------------------------------------
  # 部分状態からの再帰（キャリーチェーン）
  #  down+1 == 0（≒ down が -1）で葉（1 解）
  # ------------------------------------------------------------
  def solve(self,row:int,left:int,down:int,right:int)->int:
    """
    役割:
      キャリーチェーン空間でのビットDFS。`down+1 == 0` を葉判定として全解数を返す。
    コア（引用）:
      - 葉判定: `if not down+1: return 1`  # down が -1（全列埋まった）なら 1 解
      - 空行圧縮: `while row & 1: row >>= 1; left <<= 1; right >>= 1`
      - 候補集合: `bitmap = ~(left | down | right)`
      - LSB抽出:  `bit = -bitmap & bitmap`
      - 再帰:      `self.solve(row, (left|bit)<<1, (down|bit), (right|bit)>>1)`
    注意:
      - ここでの `row/left/down/right` は通常の N ビット盤ではなく、
        「キャリーチェーン」用の圧縮・シフトを伴う内部表現。
    """

    total:int=0
    if not down+1:
      return 1
    while row&1:
      row>>=1
      left<<=1
      right>>=1
    row>>=1
    bitmap:int=~(left|down|right)
    while bitmap!=0:
      bit=-bitmap&bitmap
      total+=self.solve(row,(left|bit)<<1,(down|bit),(right|bit)>>1)
      bitmap^=bit
    return total

  def process(self,size:int,sym:int,B:List[int])->int:
    """
    役割:
      `B[0..3]`（列/斜線の占有ビット列）からキャリーチェーン初期状態を生成し、
      `sym * solve(...)` を返す。
    生成式（引用）:
      - `start_row  = B[0] >> 2`
      - `start_left = B[1] >> 4`
      - `start_down = (((B[2] >> 2) | (~0 << (size-4))) + 1) << (size-5); start_down -= 1`
      - `start_right= (B[3] >> 4) << (size-5)`
    注意:
      - シフト量（`size-4`, `size-5`）は size に依存。小さな N では境界に注意。
    """

    start_row=B[0]>>2
    start_left=B[1]>>4
    start_down=(((B[2]>>2)|(~0<<(size-4)))+1)<<(size-5)
    start_down-=1
    start_right=(B[3]>>4)<<(size-5)
    return sym*self.solve(start_row,start_left,start_down,start_right)

  def Symmetry(self,size:int,n:int,w:int,s:int,e:int,B:List[int],B4:List[int])->int:
    """
    役割:
      外周 4 点（W/N/E/S）の相対関係から代表性を判定し、対称クラス係数（2/4/8）を返す。
      代表でない場合は 0 を返却。
    ロジック（引用）:
      - 早期棄却（辞書順/境界条件）:
          `ww = (size-2)*(size-1)-1-w`
          `if s == ww and n < (w2 - e): return 0`  など
      - 係数決定:
          `if not B4[0]: return process(size, 8, B)`
          `if s == w: ... return process(size, 2, B)`
          `if e == w and n >= s: ... return process(size, 4, B)`
          それ以外は `process(size, 8, B)`
    注意:
      - B4 は「各列の配置（行インデックス）」の一時表現で、0/±1 判定を含む。
      - 条件は carry-chain の既知則に基づくため、並び替え時はテスト必須。
    """

    ww=(size-2)*(size-1)-1-w
    w2=(size-2)*(size-1)-1
    if s==ww and n<(w2-e):
      return 0
    if e==ww and n>(w2-n):
      return 0
    if n==ww and e>(w2-s):
      return 0
    if not B4[0]:
      return self.process(size,8,B)
    if s==w:
      if n!=w or e!=w:
        return 0
      return self.process(size,2,B)
    if e==w and n>=s:
      if n>s:
        return 0
      return self.process(size,4,B)
    return self.process(size,8,B)

  def placement(self,size:int,dimx:int,dimy:int,B:List[int],B4:List[int])->int:
    """
    役割:
      外周座標 (dimx, dimy) にクイーンを仮配置し、矛盾がなければ B/B4 を更新して 1 を返す。
      矛盾があれば 0 を返す（= その鎖は不成立）。
    判定（引用）:
      - 列/対角の占有（ビット）と衝突チェック:
          `(B[0] & (1<<dimx))`（列）, `B[1]`（↗︎↙︎）, `B[2]`（行）, `B[3]`（↖︎↘︎）
      - B の更新:
          `B[0] |= 1<<dimx; B[1] |= 1<<(size-1-dimx+dimy); ...`
      - B4 の更新:
          `B4[dimx] = dimy`
    追加の境界チェック（引用）:
      - 角付近・辺沿いの配置制限（`B4[0]` などの sentinel を参照）
    """

    if B4[dimx]==dimy:
      return 1
    if B4[0]:
      if ((B4[0]!=-1) and ((dimx<B4[0] or dimx>=size-B4[0]) and (dimy==0 or dimy==size-1))) or ((dimx==size-1) and (dimy<=B4[0] or dimy>=size-B4[0])
      ):
        return 0
    elif (B4[1] != -1) and (B4[1] >= dimx and dimy == 1):
      return 0
    if ((B[0] & (1 << dimx)) or (B[1] & (1 << (size - 1 - dimx + dimy))) or (B[2] & (1 << dimy)) or (B[3] & (1 << (dimx + dimy)))):
      return 0
    B[0] |= 1 << dimx
    B[1] |= 1 << (size - 1 - dimx + dimy)
    B[2] |= 1 << dimy
    B[3] |= 1 << (dimx + dimy)
    B4[dimx] = dimy
    return 1

  def buildChain(self, size: int, pres_a: List[int], pres_b: List[int], valid_count: int) -> int:
    """
    役割:
      あらかじめ生成した外周候補（pres_a/pres_b）から鎖を構築し、
      4 つの辺 W/N/E/S を順に確定しながら、代表性チェック→内部 solve を呼び出して合算。
    流れ（引用）:
      - B/B4 を都度 deepcopy（`board` 状態を枝ごとに独立化）
      - W: `placement(size, 0, pres_a[w])` と `placement(size, 1, pres_b[w])`
      - N: `placement(size, pres_a[n], size-1)` と `... size-2`
      - E: `placement(size, size-1, size-1-pres_a[e])` と `... size-2-pres_b[e]`
      - S: `placement(size, size-1-pres_a[s], 0)` と `... , 1`
      - 最後に `total += Symmetry(size, n, w, s, e, sB, sB4)`
    注意:
      - deepcopy は安全だがコストあり。Codon 等なら構造体のコピー最適化が有効。
    """

    def deepcopy(lst: List[int]) -> List[int]:
      return [deepcopy(item) if isinstance(item, list) else item for item in lst]

    total: int = 0
    B: List[int] = [0, 0, 0, 0]
    B4: List[int] = [-1] * size
    sizeE: int = size - 1
    sizeEE: int = size - 2

    for w in range(valid_count):
      wB, wB4 = deepcopy(B), deepcopy(B4)
      if not self.placement(size, 0, pres_a[w], wB, wB4):
        continue
      if not self.placement(size, 1, pres_b[w], wB, wB4):
        continue
      # ここからの n/e/s は pres_* に実際に入っているインデックスだけを使う
      for n in range(w, valid_count):
        nB, nB4 = deepcopy(wB), deepcopy(wB4)
        if not self.placement(size, pres_a[n], sizeE, nB, nB4):
          continue
        if not self.placement(size, pres_b[n], sizeEE, nB, nB4):
          continue
        for e in range(w, valid_count):
          eB, eB4 = deepcopy(nB), deepcopy(nB4)
          if not self.placement(size, sizeE, sizeE - pres_a[e], eB, eB4):
            continue
          if not self.placement(size, sizeEE, sizeE - pres_b[e], eB, eB4):
            continue
          for s in range(w, valid_count):
            sB, sB4 = deepcopy(eB), deepcopy(eB4)
            if not self.placement(size, sizeE - pres_a[s], 0, sB, sB4):
              continue
            if not self.placement(size, sizeE - pres_b[s], 1, sB, sB4):
              continue
            total += self.Symmetry(size, n, w, s, e, sB, sB4)
    return total

  def initChain(self, size: int, pres_a: List[int], pres_b: List[int]) -> int:
    """
    役割:
      外周に置く候補 (a,b) のペアを列挙。隣接（|a-b|<=1）を除外して pres_* に格納。
    実装（引用）:
      `for a in range(size):`
        `for b in range(size):`
          `if abs(a-b) <= 1: continue`
          `pres_a[idx], pres_b[idx] = a, b; idx += 1`
    戻り値:
      実際に埋めたエントリ数（valid_count）
    """

    idx: int = 0
    for a in range(size):
      for b in range(size):
        if abs(a - b) <= 1:
          continue
        pres_a[idx], pres_b[idx] = a, b
        idx += 1
    return idx  # 実際に埋めた有効エントリ数を返す

  def carryChain(self, size: int) -> int:
    """
    役割:
      pres_a/pres_b を用意して valid_count を受け取り、buildChain() を呼ぶ高位API。
    実装（引用）:
      `pres_a = [0] * 930; pres_b = [0] * 930`
      `valid = self.initChain(size, pres_a, pres_b)`
      `return self.buildChain(size, pres_a, pres_b, valid)`
    注意:
      - バッファ長 930 は上限想定。サイズ拡張時は念のため assert/境界チェック推奨。
    """

    pres_a: List[int] = [0] * 930
    pres_b: List[int] = [0] * 930
    valid = self.initChain(size, pres_a, pres_b)
    return self.buildChain(size, pres_a, pres_b, valid)

class NQueens12_carryChain:
  def main(self) -> None:
    """
    役割:
      N=5..17 を走査し、Total/Unique(=0)/経過時間を表形式で出力。
    出力（引用）:
      `print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")`
    注意:
      - range の上限は含まれない（18 を含めたい場合は nmax=19）。
      - I/O は計測に影響大。必要に応じて出力を抑制。
    """

    nmin: int = 5
    nmax: int = 18
    print(" N:        Total       Unique        hh:mm:ss.ms")
    for size in range(nmin, nmax):
      start_time = datetime.now()
      nq = NQueens12()
      total = nq.carryChain(size)
      dt = datetime.now() - start_time
      text = str(dt)[:-3]
      print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")

if __name__ == "__main__":
  NQueens12_carryChain().main()

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






















