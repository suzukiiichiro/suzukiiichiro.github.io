---
title: "Ｎクイーン問題（８６）Python/Codonで爆速プログラミング ポストフラグ"
title: "2025 10 27 02 N Queens Suzuki"
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

## Python / Codon Ｎクイーン ポストフラグ版

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

結論から言えば **Codon for Python `17Py_`** は
**GPU/CUDA `10Bit_CUDA/01CUDA_Bit_Symmetry.cu`** と同等の速度で動作します。

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

#### Python（通常実行）

```bash
$ python <filename.py>
```

#### Codon（ビルドなし実行）

```bash
$ codon run <filename.py>
```

#### Codon（ビルドして高速実行）

```bash
$ codon build -release <filename.py> && ./<filename>
```

---

### 参考リンク

* Ｎクイーン問題 過去記事一覧
  [https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

* エイト・クイーンのプログラムアーカイブ（Bash、Lua、C、Java、Python、CUDAまで）
  [https://github.com/suzukiiichiro/N-Queens](https://github.com/suzukiiichiro/N-Queens)

---

## N-Queens（列ユニーク版 → 対角付き正式版）

**ファイル:** `02Py_postFlag_codon_reviewed.py`
**作成日:** 2025-10-23

---

### 概要

本ファイルは「段階的な理解」を目的に 2 つの実装を収録。

1. **NQueens02_MinimalFix**

   * 列ユニークの順列列挙のみ（斜め判定なし）
   * 学習用の基礎（バックトラックの形）として有用
   * 終了条件と列使用フラグの扱いを正しく修正

2. **NQueens02_WithDiagonals**

   * 列＋2方向の対角衝突をフラグで排除する正式版
   * `ld = row - col + (N-1)`, `rd = row + col` をインデックス化

---

### 設計のポイント（実ソース引用）

#### 列ユニーク制約

```python
if self.used_col[col] == 0:
    self.used_col[col] = 1
    ...
    self.used_col[col] = 0
```

#### 対角フラグの算出

```python
ld = row - col + self.offset    # offset = N-1 → 0..(2N-2)
rd = row + col                  # 0..(2N-2)
```

使用配列の長さは `2*N-1` を確保：

```python
self.used_ld = [0 for _ in range(2*self.size-1)]
self.used_rd = [0 for _ in range(2*self.size-1)]
```

#### 停止条件（共通）

```python
if row == self.size:
    self.printout()
    return
```

---

### 使い方

```bash
$ python3 02Py_postFlag_codon_reviewed.py N [raw]
```

* 第2引数 `"raw"` → MinimalFix（列ユニーク順列）を実行
* 省略時 → WithDiagonals（正式版）を実行

---

### 計測／運用上の注意

* `printout()` の I/O はボトルネック。ベンチ時は表示を切る／カウントのみ推奨。
* 大きな N ではフラグ配列よりもビットボード（int のビット）に移行すると高速化。
  例：`cols/ld/rd` をビットで持ち、候補抽出は
  `bit = free & -free; free &= free - 1`

---

### 検証／拡張のヒント

* N=8 の正式版の解数は **92**（比較用）
* 回転／鏡の対称性削減（COUNT2/4/8）や奇数 N の中央列特別処理などは次段（03以降）で導入予定

---

### ライセンス

MIT（必要に応じて変更）
**著者:** suzuki / nqdev

---

## 短評（レビュー）と発展の提案

### 良い点

* 列ユニーク → 対角追加の二段階構成で学習曲線が明快。
* 対角のインデックス化（`row - col + offset`, `row + col`）が教科書的でわかりやすい。
* 停止条件とフラグのオン／オフ対称性が明確で、バグになりにくい。

---

### 改善の余地（次の段）

* **ビットボード化**
  `used_col / used_ld / used_rd` を整数ビットに置換し、
  `free = ~(ld | rd | col) & mask` →
  `bit = free & -free; free &= free - 1` で高速化。
* **対称性削減（COUNT2/4/8）**
* **初手左右半分制限・回転／鏡ユニーク復元** で枝数圧縮。
* **I/O 抑止／分離**
* **ベンチモード:** `printout()` を無効化し count 集計のみに。
* **入力バリデーション:** `N < 1` の扱い（`N == 1` → Total=1 が期待値）。

---

### 実行ログ（raw モード）

```bash
fedora$ codon build -release 02Py_postFlag_codon.py && ./02Py_postFlag_codon 5 raw
:
:
114: 42310
115: 43012
116: 43021
117: 43102
118: 43120
119: 43201
120: 43210

Mode: raw
N: 5
Total: 120
Elapsed: 0.001s
```

---

### 実行ログ（proper モード）

```bash
fedora$ codon build -release 02Py_postFlag_codon.py && ./02Py_postFlag_codon 5 proper
:
1: 02413
2: 03142
3: 13024
4: 14203
5: 20314
6: 24130
7: 30241
8: 31420
9: 41302
10: 42031

Mode: proper
N: 5
Total: 10
Elapsed: 0.000s
bash-3.2$
```

---

## ソースコード
``` python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
"""
Python/codon Ｎクイーン ポストフラグ版

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
N-Queens（列ユニーク版 → 対角付き正式版）
=====================================
ファイル: 02Py_postFlag_codon_reviewed.py
作成日: 2025-10-23

概要:
  本ファイルは「段階的な理解」を目的に 2 つの実装を収録。
  1) NQueens02_MinimalFix:
     ・列ユニークの順列列挙のみ（斜め判定なし）
     ・学習用の基礎（バックトラックの形）として有用
     ・終了条件と列使用フラグの扱いを正しく修正
  2) NQueens02_WithDiagonals:
     ・列＋2 方向の対角衝突をフラグで排除する正式版
     ・`ld = row - col + (N-1)`, `rd = row + col` をインデックス化

設計のポイント（実ソース引用）:
  - 列ユニーク制約:
      `if self.used_col[col]==0:`
      `self.used_col[col]=1; ...; self.used_col[col]=0`
  - 対角フラグの算出:
      `ld = row - col + self.offset    # offset = N-1 で 0..(2N-2)`
      `rd = row + col                  # 0..(2N-2)`
    → 使用配列の長さは `2*N-1` を確保:
      `self.used_ld=[0 for _ in range(2*self.size-1)]`
      `self.used_rd=[0 for _ in range(2*self.size-1)]`
  - 停止条件（どちらも同じ）:
      `if row==self.size: self.printout(); return`

使い方:
  $ python3 02Py_postFlag_codon_reviewed.py N [raw]
     - 第2引数が "raw" のとき MinimalFix（列ユニーク順列）を実行
     - 省略時は WithDiagonals（正式版）を実行

計測/運用上の注意:
  - `printout()` の I/O はボトルネック。ベンチ時は表示を切る/カウントのみ推奨。
  - 大きな N ではフラグ配列よりもビットボード（int のビット）に移行すると高速化。
    例: cols/ld/rd をビットで持ち、候補抽出は `bit = free & -free; free &= free - 1`

検証/拡張のヒント:
  - N=8 の正式版の解数は 92（比較用）。回転/鏡の対称性削減（COUNT2/4/8）や
    奇数 N の中央列特別処理などは次段（03 以降）で導入予定。

ライセンス: MIT（必要に応じて変更）
著者: suzuki/nqdev



短評（レビュー）と発展の提案

良い点
列ユニーク→対角追加の二段階構成で学習曲線が明快。
対角のインデックス化（row-col+offset, row+col）が教科書的で分かりやすい。
停止条件とフラグのオン/オフ対称性が明確で、バグになりにくい。

改善の余地（次の段）
・ビットボード化
  used_col/used_ld/used_rd を整数ビットに置換し、
  free = ~(ld|rd|col) & mask → bit = free & -free; free &= free - 1 で高速化。
・対称性削減（COUNT2/4/8）
・初手を左右半分に制限・回転/鏡でユニーク復元 → 枝数をさらに圧縮。
・I/O 抑止/分離
・ベンチ時には printout() を無効化し、count 集計のみのモードを追加。
・入力バリデーション
・N<1 の扱いを明示（0、1 の境界）。N==1 は Total=1 が期待値。


fedora$ codon build -release 02Py_postFlag_codon.py && ./02Py_postFlag_codon 5 raw
:
:
114: 42310
115: 43012
116: 43021
117: 43102
118: 43120
119: 43201
120: 43210

Mode: raw
N: 5
Total: 120
Elapsed: 0.001s


fedora$ codon build -release 02Py_postFlag_codon.py && ./02Py_postFlag_codon 5 proper
:
1: 02413
2: 03142
3: 13024
4: 14203
5: 20314
6: 24130
7: 30241
8: 31420
9: 41302
10: 42031

Mode: proper
N: 5
Total: 10
Elapsed: 0.000s
bash-3.2$

"""

from typing import List
import sys
import time

class NQueens02_MinimalFix:
  """
  学習用の最小バックトラック（列ユニークの順列列挙）。
  機能:
    - 行ごとに未使用の列を 1 つ選んで配置し、N! 通りの順列を列挙。
    - 斜め衝突は「判定しない」（元仕様を保持）。
  特徴（引用）:
    - 列使用フラグ: `self.used_col[col]==0` を満たす列のみ採用
    - 停止条件: `if row==self.size: self.printout(); return`
  注意:
    - N-Queens の正しい解のみを列挙するものではない（斜め無視）。
    - I/O が重いため、大きな N では print を抑止するのが望ましい。
  """
  size:int
  count:int
  aboard:List[int]    # row -> col
  used_col:List[int]  # 列使用フラグ（0/1）

  def __init__(self,size:int)->None:
    """
    役割:
      盤サイズと、行→列の配置配列 `aboard`、列使用フラグ `used_col` を初期化。
    引数:
      size: 盤の大きさ N
    実装（引用）:
      `self.aboard=[0 for _ in range(self.size)]`
      `self.used_col=[0 for _ in range(self.size)]`
    """
    self.size=size
    self.count=0
    self.aboard=[0 for _ in range(self.size)]
    self.used_col=[0 for _ in range(self.size)]

  def printout(self)->None:
    """
    役割:
      現在の配置 `aboard` を 1 行の数字列で出力し、`count` をインクリメント。
    出力例（引用）:
      `print(self.count, end=": "); ...; print(self.aboard[i], end="")`
    注意:
      - ベンチ用途では表示を止めて集計のみ行うと高速。
    """
    self.count+=1
    print(self.count,end=": ")
    for i in range(self.size):
      print(self.aboard[i],end="")
    print("")

  def nqueens(self,row:int)->None:
    """
    役割:
      行 `row` に未使用の列 `col` を割り当て、次行に再帰（列ユニークのみ保証）。
    流れ（引用）:
      - 停止: `if row==self.size: self.printout(); return`
      - 反復: `for col in range(self.size):`
      - 採用: `if self.used_col[col]==0: ...`
      - 更新: `self.used_col[col]=1; ...; self.used_col[col]=0`
    計算量:
      - Θ(N!)（順列列挙）
    """

    # 正しい終了条件: row==size（最後の行も既に配置済みの状態）
    if row==self.size:
      self.printout()
      return
    # 各列を試す（列ユニーク制約のみ）
    for col in range(self.size):
      if self.used_col[col]==0:
        self.aboard[row]=col
        self.used_col[col]=1
        self.nqueens(row+1)
        self.used_col[col]=0

class NQueens02_WithDiagonals:
  """
  列＋2 方向の対角フラグで N-Queens を解く正式版。
  機能:
    - 列使用・左下/右上対角（ld）・右下/左上対角（rd）の 3 種の衝突をフラグで排除。
  特徴（引用）:
    - ld インデックス: `row - col + self.offset`（`offset = N-1`）
    - rd インデックス: `row + col`
    - 使用配列長: `2*N-1`（`0..2N-2` をカバー）
  注意:
    - 配列境界を越えないよう `offset` と配列長に一貫性を持たせる。
    - I/O はベンチ時に抑止推奨。
  """

  size:int
  count:int
  aboard:List[int]
  used_col:List[int]
  used_ld:List[int]
  used_rd:List[int]
  offset:int

  def __init__(self,size:int)->None:
    """
    役割:
      列・対角フラグ配列を確保し、配置配列とカウントを初期化。
    引数:
      size: 盤の大きさ N
    実装（引用）:
      `self.used_ld=[0 for _ in range(2*self.size-1)]`
      `self.used_rd=[0 for _ in range(2*self.size-1)]`
      `self.offset=self.size-1`
    """
    self.size=size
    self.count=0
    self.aboard=[0 for _ in range(self.size)]
    self.used_col=[0 for _ in range(self.size)]
    self.used_ld=[0 for _ in range(2*self.size-1)]
    self.used_rd=[0 for _ in range(2*self.size-1)]
    self.offset=self.size-1  # (row-col) の負値を 0 始まりにずらす

  def printout(self)->None:
    """
    役割:
      正しい N-Queens 解を 1 行の数字列で出力し、`count` をインクリメント。
    注意:
      - 出力が多い場合は計測値に I/O が影響するため注意。
    """

    self.count+=1
    print(self.count,end=": ")
    for i in range(self.size):
      print(self.aboard[i],end="")
    print("")

  def nqueens(self,row:int)->None:
    """
    役割:
      行 `row` において、列/対角のいずれにも衝突しない `col` のみを配置して再帰。
    主要ロジック（引用）:
      `ld = row - col + self.offset   # 0..2N-2`
      `rd = row + col                 # 0..2N-2`
      `if (self.used_col[col] | self.used_ld[ld] | self.used_rd[rd]) == 0:`
         配置 → フラグON → 再帰 → フラグOFF
    停止条件:
      `if row==self.size: self.printout(); return`
    計算量:
      - バックトラック依存（実効は MinimalFix より大幅に小さい）
    """

    if row==self.size:
      self.printout()
      return
    for col in range(self.size):
      ld=row-col+self.offset  # 0..2N-2
      rd=row+col                # 0..2N-2
      if (self.used_col[col]|self.used_ld[ld]|self.used_rd[rd])==0:
        self.aboard[row]=col
        self.used_col[col]=1
        self.used_ld[ld]=1
        self.used_rd[rd]=1
        self.nqueens(row+1)
        self.used_col[col]=0
        self.used_ld[ld]=0
        self.used_rd[rd]=0

def main()->None:
  """
  役割:
    コマンドライン引数を解釈し、列ユニーク版（raw）または正式版（既定）を実行。
  使い方（引用）:
    `python3 02Py_postFlag_codon_reviewed.py N [raw]`
  振る舞い:
    - N の検証: `int(sys.argv[1])` を試み、失敗時にメッセージを表示。
    - 実行: mode が "raw" なら `NQueens02_MinimalFix`、それ以外は `NQueens02_WithDiagonals`。
    - 計測: `time.perf_counter()` で経過秒を計測・表示。
  注意:
    - 出力件数が多い場合は端末 I/O が支配的になり、経過時間が増大。
  """

  # 使い方:
  #   python3 02Py_postFlag_codon_reviewed.py N [raw]
  #   raw を指定すると MinimalFix（列ユニークの順列）を実行。
  #   省略時は WithDiagonals（N-Queens 正式版）を実行。
  n=8
  mode="proper"
  if len(sys.argv)>=2:
    try:
      n=int(sys.argv[1])
    except ValueError:
      print("第1引数 N は整数で指定してください。例: 8")
      return
  if len(sys.argv)>=3 and sys.argv[2].lower()=="raw":
    mode="raw"

  t0=time.perf_counter()

  # MinimalFix（列ユニークの順列）を実行。
  if mode=="raw":
    solver=NQueens02_MinimalFix(n)
    solver.nqueens(0)
    total=solver.count
  # WithDiagonals（N-Queens 正式版）を実行。
  else:
    solver=NQueens02_WithDiagonals(n)
    solver.nqueens(0)
    total=solver.count

  t1=time.perf_counter()

  print(f"\nMode: {mode}")
  print(f"N: {n}")
  print(f"Total: {total}")
  print(f"Elapsed: {t1 - t0:.3f}s")

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






















