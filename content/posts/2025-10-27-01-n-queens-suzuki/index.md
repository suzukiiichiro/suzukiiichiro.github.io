---
title: "Ｎクイーン問題（８５）Python/Codonで爆速プログラミング ブルートフォース"
date: 2025-10-27T13:24:19+09:00
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

## Python / Codon Ｎクイーン ブルートフォース版

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
GPU/CUDA 実装 **`10Bit_CUDA/01CUDA_Bit_Symmetry.cu`** と同等の速度で動作します。

---

### GPU/CUDA 実行例

```bash
$ nvcc -O3 -arch=sm_61 -m64 -ptx -prec-div=false 04CUDA_Symmetry_BitBoard.cu && POCL_DEBUG=all ./a.out -n
対称解除法 GPUビットボード
20:      39029188884       4878666808     000:00:02:02.52
21:     314666222712      39333324973     000:00:18:46.52
22:    2691008701644     336376244042     000:03:00:22.54
23:   24233937684440    3029242658210     001:06:03:49.29
```

---

### Codon 実行例（AWS m4.16xlarge × 1）

```bash
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

#### Codon（ビルドせず実行）

```bash
$ codon run <filename.py>
```

#### Codon（ビルドしてネイティブ高速実行）

```bash
$ codon build -release <filename.py> && ./<filename>
```

---

### 概要

* **クラス1:** `NQueens01_MinimalFix` … 学習用の総当り（N^N）版。
  N-Queens の「解」にはなりませんが、再帰・全列挙の流れを掴むための最小例。
  ※ 重要なバグ（`is` 比較）を `==` に修正済み。

* **クラス2:** `NQueens01_ProperBF` … 本来の N-Queens（列・斜めの衝突を回避）を
  素朴なバックトラックで列挙。

---

### 設計のポイント

#### MinimalFix（総当り）

「停止条件 → 出力 → 戻る」の基本構造を学ぶ目的。
典型パターン:

```python
if row == self.size:
    self.printout(); return
for i in range(self.size):
    self.aboard[row] = i
    self.nqueens(row + 1)
```

#### ProperBF（正解列挙）

行ごとに安全な列だけを試すことで大幅に枝刈り。
典型パターン:

```python
for col in range(self.size):
    if self.is_safe(row, col):
        self.aboard[row] = col
        self.solve(row + 1)
```

---

### 使い方

```bash
$ python3 this.py N [raw]
```

* 第2引数が `"raw"` のとき **MinimalFix（総当り）** を実行
* 省略時は **ProperBF（正解版）** を実行

---

### 注意／計測上のヒント

* `printout()` は I/O 負荷が高く、ベンチマークには不向き。
  大きな N ではカウントのみ集計する実装に差し替えるとよい。
* 次の発展:

  * ビットボード化
  * 対称性（左右ミラー／回転）
  * 中央列特別処理 など。

---

### ライセンス

MIT（必要に応じて変更）

**著者:** suzuki / nqdev

---

## レビュー／ポイント／特徴（ソース引用つき）

### 学習用の二段構え

総当りのミニマム版 `NQueens01_MinimalFix` は「N^N 通り」列挙（N-Queensの正解にはならない）。
正しいバックトラック版 `NQueens01_ProperBF` は `is_safe()` で列・斜めをチェックして解を列挙。
→ `main()` で `raw` / `proper` を切替（`python this.py N [raw]`）。

---

### バグ修正点が明確

> **BUG FIX:** `is → ==`（値比較に修正）

```python
if row == self.size:
    self.printout()
```

`is` では偶発的にバグとなる箇所を修正。値比較で停止条件を正しく判定。

---

### 素朴なバックトラックの定石

```python
for col in range(self.size):
    if self.is_safe(row, col):
        self.aboard[row] = col
        self.solve(row + 1)
```

`is_safe()` は「同列」と「斜め（行差＝列差）」のみで十分。

---

### ベンチマーク時の注意

`printout()` が毎解呼ばれるため、Nが大きくなると I/O 負荷が劇的に増大します。
計測時は「カウントのみを集計」する設計が望ましい。

---

### 発展余地（次ステップ）

列挙をビットボード化すれば O(1) 判定。
奇数Nの中央列特別処理や左右ミラーで探索半減など、
次の高性能版（Codon対応）へのスムーズな接続が可能。

---

### CLI 実行例

```bash
$ codon build -release 01Py_bluteForce_codon_reviewed.py -o nqueen01
$ ./nqueen01 5        # ProperBF を呼ぶ（デフォルト）
$ ./nqueen01 5 raw    # MinimalFix を呼ぶ（“生”の総当り）
```

---

### 実行ログ例（raw モード）

``` bash
fedora$ codon build -release 01Py_bluteForce_codon.py
fedora$ ./01Py_bluteForce_codon 5 raw
:
:
3115: 44424
3116: 44430
3117: 44431
3118: 44432
3119: 44433
3120: 44434
3121: 44440
3122: 44441
3123: 44442
3124: 44443
3125: 44444

Mode: raw
N: 5
Total: 3125
Elapsed: 0.026s
bash-3.2$ exit
exit
```

---

### 実行ログ例（proper モード）

```bash
fedora$ codon build -release 01Py_bluteForce_codon.py
fedora$ ./01Py_bluteForce_codon 5
:
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
fedora$
```

---




## ソースコード
``` python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Python/codon Ｎクイーン ブルートフォース版

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
N-Queens 学習用ミニマム実装（総当り/正解版の二段構え）
====================================================
ファイル: nqueens_minimal_and_proper.py
作成日: 2025-10-23

概要:
  - クラス1: NQueens01_MinimalFix … 学習用の総当り（N^N）版。
    N-Queens の「解」にはなりませんが、再帰・全列挙の流れを掴むための最小例。
    ※ 重要なバグ（`is` 比較）を `==` に修正済み。
  - クラス2: NQueens01_ProperBF … 本来の N-Queens（列・斜めの衝突を回避）を
    素朴なバックトラックで列挙。

設計のポイント:
  - MinimalFix: 「停止条件 → 出力 → 戻る」の基本構造を学ぶ目的。
    典型パターン:
      if row == self.size:
          self.printout(); return
      for i in range(self.size):
          self.aboard[row] = i
          self.nqueens(row + 1)
  - ProperBF: 行ごとに安全な列だけを試すことで大幅に枝刈り。
    典型パターン:
      for col in range(self.size):
          if self.is_safe(row, col):
              self.aboard[row] = col
              self.solve(row + 1)

使い方:
  $ python3 this.py N [raw]
    - 第2引数が "raw" のとき MinimalFix（総当り）を実行
    - 省略時は ProperBF を実行

注意/計測上のヒント:
  - printout() は I/O 負荷が高く、ベンチマークには不向き。
    大きな N ではカウントのみ集計する実装に差し替えるとよい。
  - 次の発展: ビットボード化・対称性（左右ミラー/回転）・中央列特別処理など。

ライセンス: MIT（必要に応じて変更）
著者: suzuki/nqdev



レビュー／ポイント／特徴（ソース引用つき）

学習用の二段構え
総当りのミニマム版 NQueens01_MinimalFix は「N^N 通り」列挙（N-Queensの正解にはならない）。
正しいバックトラック版 NQueens01_ProperBF は is_safe() で列・斜めをチェックして解を列挙。
→ main() で raw / proper を切替（python this.py N [raw]）。

バグ修正点が明確
# BUG FIX: is → ==（値比較に修正） の通り、

if row==self.size:
    self.printout()
の値比較で停止条件を正しく判定（is だと偶発バグ）。

素朴なバックトラックの定石
solve() は

for col in range(self.size):
    if self.is_safe(row, col):
        self.aboard[row] = col
        self.solve(row+1)

の典型形。is_safe() は「同列」と「斜め（行差＝列差）」のみで十分。

ベンチ時の注意
printout() が毎解呼ばれるため、Nが大きくなると I/O で劇的に遅くなります（計測時はカウントのみを推奨）。
発展余地（次ステップ）
列挙をビットボード化すれば O(1) 判定、奇数Nの中央列特別処理や左右ミラーで探索半減など、次の高性能版にスムーズに接続できます。

CLI 実行例：
  $ codon build -release 01Py_bluteForce_codon_reviewed.py -o nqueen01
  $ ./nqueen01 5    # ProperBF を呼ぶ（デフォルト）
  $ ./nqueen01 5 raw  # MinimalFix を呼ぶ（“生”の総当り）


fedora$ codon build -release 01Py_bluteForce_codon.py
fedora$ ./01Py_bluteForce_codon 5 raw
:
:
3115: 44424
3116: 44430
3117: 44431
3118: 44432
3119: 44433
3120: 44434
3121: 44440
3122: 44441
3123: 44442
3124: 44443
3125: 44444

Mode: raw
N: 5
Total: 3125
Elapsed: 0.026s
bash-3.2$ exit
exit

fedora$ codon build -release 01Py_bluteForce_codon.py
fedora$ ./01Py_bluteForce_codon 5
:
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
fedora$
"""


from typing import List,Tuple
import sys
import time

class NQueens01_MinimalFix:
  """
  学習用の最小総当り版（N^N 列挙）。
  目的:
    - 再帰の構造（停止条件・ループ・再帰呼び出し）の理解を優先。
    - N-Queens の「解」判定は行わない（安全性チェックなし）。
  特徴（引用）:
    停止条件: `if row==self.size: self.printout(); return`
    列挙本体: `for i in range(self.size): self.aboard[row]=i; self.nqueens(row+1)`
  注意:
    - 出力が膨大になるため、大きな N の実行は非推奨。
    - `is` → `==` の修正により、停止条件が値比較で正しく働く。
  """
  size:int
  aboard:List[int]
  count:int

  def __init__(self,size:int)->None:
    """
    役割:
      盤サイズと作業配列 `aboard`（row→col の一時配置）を初期化し、カウントを0に設定。
    引数:
      size: 盤の大きさ N
    効能:
      - `self.aboard = [0 for _ in range(self.size)]` で固定長の列格納配列を確保。
    """
    # 目的：サイズを保持し、各行の暫定列を保持する配列 aboard を初期化
    self.size=size
    self.aboard=[0 for _ in range(self.size)]
    self.count=0

  def printout(self)->None:
    """
    役割:
      現在の `aboard` を 1 行の数字列として表示し、解カウント `count` をインクリメント。
    出力形式（引用）:
      `print(self.count, end=": "); for i in range(self.size): print(self.aboard[i], end="")`
    注意:
      - ベンチ/大きな N では I/O ボトルネックになるため計測には不向き。
    """
    # 目的：現在の aboard を 1 行の数字列で表示（ベンチマークには非推奨）
    self.count+=1
    # 例："3115: 44424" のように出力
    print(self.count,end=": ")
    for i in range(self.size):
      print(self.aboard[i],end="")
    print("")

  def nqueens(self,row:int)->None:
    """
    役割:
      行 `row` に 0..N-1 のいずれかの列を**無条件**で割り当て、全探索を行う。
    処理の流れ（引用）:
      - 停止条件: `if row==self.size: self.printout(); return`
      - 列挙: `for i in range(self.size): self.aboard[row]=i; self.nqueens(row+1)`
    注意:
      - 安全性チェックは一切しないため、N-Queens の意味での「解」ではない。
    計算量:
      - Θ(N^N)（出力自体も N^N 件）
    """
    # 目的：各行に 0..size-1 を“無条件”に置いていく総当り
    # 注意：N-Queens の安全判定なし／膨大な出力
    # BUG FIX: `is` → `==`（値比較に修正）
    if row==self.size:
      # NOTE: 実運用の計測では I/O を止めて count のみ更新にすると高速になります。
      self.printout()
      return
    for i in range(self.size):
      self.aboard[row]=i
      self.nqueens(row+1)

class NQueens01_ProperBF:
  """
  本来の N-Queens を素朴なバックトラックで解く実装。
  目的:
    - 行ごとに「安全な列」だけを再帰的に試し、全解数を列挙。
  特徴（引用）:
    - 配置: `self.aboard[row] = col`
    - 停止: `if row==self.size: self.printout(); return`
    - 判定: `abs(row-r) == abs(col-c)` で斜め衝突を検出
  注意:
    - I/O を伴う `printout()` は大きな N の計測ではオフ（集計のみ）推奨。
  """
  size:int
  aboard:List[int]
  count:int

  def __init__(self,size:int)->None:
    """
    役割:
      盤サイズ `size` と、行→列の配置を格納する `aboard` を初期化し、カウントを0に。
    引数:
      size: 盤の大きさ N
    実装（引用）:
      `self.aboard=[0 for _ in range(self.size)]`
    """
    # 目的：サイズと作業配列の初期化
    self.size=size
    self.aboard=[0 for _ in range(self.size)]  # row→col を格納
    self.count=0

  def is_safe(self,row:int,col:int)->bool:
    """目的：既に置いた 0..row-1 のクイーンと衝突しないかを判定。
    - 列衝突：同じ列に既にある
    - 斜め衝突：|row - r| == |col - c|
    """
    for r in range(row):
      c=self.aboard[r]
      if c==col:
        return False
      if abs(row-r)==abs(col-c):
        return False
    return True

  def printout(self)->None:
    """
    役割:
      見つけた「正しい解」を 1 行の数字列で表示し、`count` をインクリメント。
    出力形式（引用）:
      `print(self.count, end=": "); ... print(self.aboard[i], end="")`
    注意:
      - ベンチ用途では非表示にし、`count` のみ集計するのが望ましい。
    """
    # 目的：見つけた“正しい”解を表示
    self.count+=1
    print(self.count,end=": ")
    for i in range(self.size):
      print(self.aboard[i],end="")
    print("")

  def solve(self,row:int)->None:
    """
    役割:
      行 `row` において安全な列 `col` だけを選んで配置し、次行へ再帰。
    処理の流れ（引用）:
      - 停止条件: `if row==self.size: self.printout(); return`
      - 反復: `for col in range(self.size):`
      - 判定: `if self.is_safe(row, col): self.aboard[row]=col; self.solve(row+1)`
    実装メモ:
      - 戻し代入は不要（次の col で上書き）だが、可読性のため 0 を入れても良い。
    """
    # 目的：行ごとのバックトラックで安全な列のみを再帰的に探索
    if row==self.size:
      self.printout()
      return
    for col in range(self.size):
      # TODO: ビットボード化（cols/ld/rd の3ビット列）に置き換えると O(1) 判定になります。
      if self.is_safe(row,col):
        self.aboard[row]=col
        self.solve(row+1)
        # 戻しは不要（次の col で上書き）だが、明示するなら 0 を入れてもよい

def main()->None:
  """
  役割:
    コマンドライン引数を解釈し、MinimalFix（総当り）/ ProperBF（正解版）を実行。
  使い方（引用）:
    - `python3 this.py N [raw]`
    - `raw` を付けると MinimalFix を実行、既定は ProperBF。
  フロー:
    - 引数の検証: `int(sys.argv[1])` を試み、失敗時はメッセージを出して終了。
    - 実行: mode に応じて `nqueens(0)` または `solve(0)` を起動。
    - 計測: `time.perf_counter()` で所要時間を測定し、`Total` を表示。
  注意:
    - 出力件数が多い場合、端末 I/O が支配的になるため計測差が出やすい。
  """
  # 使い方：
  #   python3 this.py N [raw]
  #   raw を付けると MinimalFix（総当り）を実行。
  #   省略時は ProperBF（本来の N-Queens）を実行。
  n=5
  mode="proper"  # default

  if len(sys.argv)>=2:
    try:
      n=int(sys.argv[1])
    except ValueError:
      print("第1引数 N は整数で指定してください。例: 8")
      return
  if len(sys.argv)>=3:
    if sys.argv[2].lower() in ("raw","proper"):
      mode=sys.argv[2].lower()

  t0=time.perf_counter()

  #  MinimalFix（総当り）を実行。
  if mode=="raw":
    solver=NQueens01_MinimalFix(n)
    solver.nqueens(0)
    total=solver.count
  #  ProperBF（本来の N-Queens）を実行。
  else:
    solver=NQueens01_ProperBF(n)
    solver.solve(0)
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






















