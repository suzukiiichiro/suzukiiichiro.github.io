---
title: "Ｎクイーン問題（３８）第七章　ブルートフォース Python編"
date: 2023-06-13T12:17:46+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - Python
  - アルゴリズム
  - 鈴木維一郎
---


![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)



## Ｎクイーン問題 Python版について
Ｎクイーン問題とは、ＮxＮの盤面にチェスのクイーンＮ個を、互いに効きが無い（クイーンは縦・横・斜め45度方向に効きがある）状態で配置する問題です。

配置したすべてのクイーン同士が効きに当たらない配置の１つはい以下のようなものです。
```
        column(列)
   _4___3___2___1___0_
  |---|---|-Q-|---|---|0
  +-------------------+
  |---|---|---|---|-Q-|1
  +-------------------+ 
  |---|-Q-|---|---|---|2 row(行) 
  +-------------------+ 
  |---|---|---|-Q-|---|3
  +-------------------+
  |-Q-|---|---|---|---|4
  +-------------------+
```

一般的には８×８のチェス盤を用いる８クイーン問題が有名です。
多くのエイトクイーン研究者は盤面の縦横行列を８に固定せず、 ＮxＮの盤面とし、現実的な処理時間で、Ｎが、どこまでのサイズ（Ｎ）まで解を求めることができるかを競っています。

現在、Ｎ２７の解を求めたドレスデン大学が世界一を記録しています。
詳しくは（１）を参照してください。

N-Queens問題：Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/


## ブルートフォースについて
ブルートフォース（力まかせ探索）は、全ての可能性のある解の候補を体系的に数えあげます。

解の候補が一つ生成される都度、その解の候補が解となるかをチェックします。

解の候補を生成後に「解であるか（それぞれのクイーンの効きに干渉していないか）」をチェックするので「生成検査法（generate and test）」とも呼ばれます。

ブルートフォースの手数は、各列 `row` には１個のクイーンしか置けないので、Ｎ５の場合は、５＊５＊５＊５＊５＝３１２５となり、５＾５，またはＮ＾Ｎと表記します。

したがって、アルゴリズム的に言えば、「力まかせ探索による Ｎクイーン問題の処理時間は Ｏ（Ｎ＾Ｎ）」となります。

よってＮが５の場合のＯ（ビッグオー）は、（Ｎ＾Ｎ）なので、５＊５＊５＊５＊５＝３，１２５ということになります。

簡単に言うと、すごく遅いアルゴリズムということになります。


## 効き筋のチェック
ここでは具体的な説明を割愛しますが、解の候補が生成される都度、以下の効き筋チェック関数が呼び出され、解となりうるかを判定すします。
いわゆるＮ５の場合は、以下のチェック関数が３１２５回実行されることになります。

```python
#
# ブルートフォース版効き筋チェック
def check_bluteForce(size):
  global board
  for r in range(1,size,1):
    for i in range(r):
      if board[i]>=board[r]:
        val=board[i]-board[r]
      else:
        val=board[r]-board[i]
      if board[i]==board[r] or val==(r-i):
        return 0
  return 1
```

各列`col`、行`row`と比べて、横、斜め左右４５度方向に置かれていないかをチェックし、効きがあればその時点で 「０」（false)を返します。（縦は最初から一つしか置けない仕組みになっているのでチェックはしません）

効きがまったく無い場合は 「１」（true） を返します。つまり解を発見したということになります。




## ブルートフォース
ブルートフォースのメインメソッドは以下のとおりです。

```python
#
# ブルートフォース
def bluteForce(row,size):
  col=0
  global TOTAL
  global board
  if row==size:
    if check_bluteForce(size)==1:
      TOTAL=TOTAL+1
      printRecord(size)
  else:
    for col in range(size):
      board[row]=col
      bluteForce(row+1,size)
```

for文で各行の何`row`目にクイーンを配置するかを決め、最後まで配置した場合は、`check_bluteForce()` を呼んで、クイーンの配置が「効き」であるかどうかを判定します。

効きでなければ「解を発見した」として `((TOTAL++))`で、解個数をインクリメントします。

ですので、`check_bluteForce()` 関数は、クイーンの効きを判定する関数となります。
重要なことは、クイーンの配置が終わったら

```python
  if row==size:
```
の条件式に入り、その直後で`check_bluteForce(size)`を呼び出して
```python
    if check_bluteForce(size)==1:
```
クイーンの配置に問題がないかをチェックします。
`check_bluteForce()`関数の末尾では以下のようになっています。
チェックをすべて通り抜けることができれば、効いていない（配置したクイーンは他のクイーンと干渉していない）ということになります。

```python
  return 1
```

また、受け取り側の `def bluteForce()` の以下の部分ですが、
```python
  if row==size:
    if check_bluteForce(size)==1:
      TOTAL=TOTAL+1
      printRecord(size)
    check_bluteForce "$size";
```

`check_bluteForce()`関数で、効きの判定を行い、「戻り値が `1` 」で、効きではない（他のクイーンとの干渉はない）と判定されたので、新しく解を発見したことになり、`((TOTAL++))`で合計をインクリメントします。
併せて、`printRecord()`のボードレイアウト表示関数によって、クイーンの位置を表示する、というロジックとなります。


```python
      printRecord(size) # ボードレイアウトを出力
```

は、ボードレイアウトのクイーンの位置を配置する出力関数です。


## ボードレイアウトの出力
ボードレイアウトの出力関数は以下のとおりです。

```python
# 
# ボードレイアウト出力
def printRecord(size):
  global TOTAL
  global board
  print(TOTAL)
  sEcho=""
  for i in range(size):
    sEcho+=" " + str(board[i])
  print(sEcho)
  print ("+",end="")
  for i in range(size):
    print("-",end="")
    if i<(size-1):
      print("+",end="")
  print("+")
  for i in range(size):
    print("|",end="")
    for j in range(size):
      if i==board[j]:
        print("O",end="")
      else:
        print(" ",end="")
      if j<(size-1):
        print("|",end="")
    print("|")
    if i in range(size-1):
      print("+",end="")
      for j in range(size):
        print("-",end="")
        if j<(size-1):
          print("+",end="")
      print("+")
  print("+",end="")
  for i in range(size):
    print("-",end="")
    if i<(size-1):
      print("+",end="")
  print("+")
  print("")
```



## ブルートフォースのポイント
ブルートフォースのポイントは、
クイーンの配置が終わったら
```python
  if row==size:
    if check_bluteForce(size)==1:
      TOTAL=TOTAL+1
      printRecord(size)
```
その直後でクイーンの効きを判定する `check_bluteForce()` 関数が呼び出されることです。

```python
    if check_bluteForce(size)==1:
```

３１２５回、クイーンの配置が完了する都度、`check_bluteForce()`が３１２５回呼び出されるわけです。

ブルートフォースの遅さの原因はここにあります。


## プログラムソース
再帰版・非再帰版を含むすべてのプログラムソースは以下のとおりです。
プログラムソース最下部で、再帰と非再帰の実行をコメントアウトで切り替えて実行してください。

```python:01Python_bluteForce.py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
"""
ブルートフォース版 Ｎクイーン

詳細はこちら。
【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題

エイト・クイーンのプログラムアーカイブ
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens


# 実行 
$ python <filename.py>

# 実行結果
1
 0 2 4 1 3
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+

2
 0 3 1 4 2
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+

3
 1 3 0 2 4
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+

4
 1 4 2 0 3
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+

5
 2 0 3 1 4
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+

6
 2 4 1 3 0
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+

7
 3 0 2 4 1
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+

8
 3 1 4 2 0
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+

9
 4 1 3 0 2
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+

10
 4 2 0 3 1
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
"""

#
# グローバル変数
MAX=21  # ボードサイズ最大値
TOTAL=0 # 解
board=[0 for i in range(MAX)] # ボード配列格納用
# 
# ボードレイアウト出力
def printRecord(size):
  global TOTAL
  global board

  print(TOTAL)
  sEcho=""
  for i in range(size):
    sEcho+=" " + str(board[i])
  print(sEcho)
  print ("+",end="")
  for i in range(size):
    print("-",end="")
    if i<(size-1):
      print("+",end="")
  print("+")
  for i in range(size):
    print("|",end="")
    for j in range(size):
      if i==board[j]:
        print("O",end="")
      else:
        print(" ",end="")
      if j<(size-1):
        print("|",end="")
    print("|")
    if i in range(size-1):
      print("+",end="")
      for j in range(size):
        print("-",end="")
        if j<(size-1):
          print("+",end="")
      print("+")
  print("+",end="")
  for i in range(size):
    print("-",end="")
    if i<(size-1):
      print("+",end="")
  print("+")
  print("")
#
# ブルートフォース版効き筋チェック
def check_bluteForce(size):
  global board
  for r in range(1,size,1):
    for i in range(r):
      if board[i]>=board[r]:
        val=board[i]-board[r]
      else:
        val=board[r]-board[i]
      if board[i]==board[r] or val==(r-i):
        return 0
  return 1
#
# ブルートフォース
def bluteForce(row,size):
  col=0
  global TOTAL
  global board
  if row==size:
    if check_bluteForce(size)==1:
      TOTAL=TOTAL+1
      printRecord(size)
  else:
    for col in range(size):
      board[row]=col
      bluteForce(row+1,size)
#
# 実行
bluteForce(0,5) # ブルートフォース
#
```



## 実行結果
実行結果は以下の通りです。

```
1
 0 2 4 1 3 
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+

2
 0 3 1 4 2 
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+

3
 1 3 0 2 4 
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+

4
 1 4 2 0 3 
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+

5
 2 0 3 1 4 
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+

6
 2 4 1 3 0 
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+

7
 3 0 2 4 1 
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+

8
 3 1 4 2 0 
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+

9
 4 1 3 0 2 
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+

10
 4 2 0 3 1 
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
```

どうですか？
遅いでしょう？

ブルートフォースは遅いのです。
効きの判定関数を本体の関数から外に出して別関数としたことで、ロジックがよりわかりやすくなりました。
次のページでは、同様に効きの判定関数を別関数にして、バックトラックの再起と非再帰をご説明します。
お楽しみに！


[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens




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







