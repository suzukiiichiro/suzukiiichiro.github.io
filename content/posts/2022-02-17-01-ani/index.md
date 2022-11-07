---
title: "第9回 pythonでNQueen（エイトクイーン）対象解除法（2）"
description: "pythonを勉強しながらNQueen（エイトクイーン）問題を解いていきます。今回は第9回目。対象解除法が正しいことの検証をしてみたいと思います。プログラムを改造してクイーンの配置を出力するようにします。" 
date: 2022-02-17T17:25:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - N-Queen 
  - プログラム
---
## 対象解除法が正しいか検証してみよう 
今回は対象解除法が正しいかどうかを検証するためプログラムを改造してクイーンを設置した場所を出力するようにしてみましょう。 

プログラムソースは以下のURLにあります。    
https://github.com/suzukiiichiro/N-Queens/blob/master/03Python/py04_nqueen.py    

## printoutメソッドを利用しよう 
クイーンの設置場所を出力するメソッドを作って321行目と322行目の間に設置しましょう。  
ABOARDに各行のクイーンの設置場所を記憶しているのでこれを利用しましょう。  
py01,py02で使っていたprintoutメソッドを修正して利用しましょう。  
printoutメソッドを見てみましょう。  

```
def printout():
  """printout()"""
  global COUNT                # pylint: disable=W0603
  COUNT += 1                  #インクリメントはこのように書きます
  print(COUNT, end=": ")      #改行したくないときは, を行末にいれます
  for i in range(SIZE):
    print(ABOARD[i], end="")
  print("")
```
どこを修正すれば良いでしょうか  

stotalの値を出力したいのでメソッドの引数に追加しましょう。  
引数はメソッドを宣言している()の中に書きます。  
クイーンの設置場所を出力するのでメソッド名はprintboardにしましょう。  
また、py01,py02とは違いpy03以降はSIZEは可変になったため無くなっています。  
グローバル変数にはないためnqueenメソッドから引数でsizeを渡してあげましょう  

```
def  printboard(stotal,size):
```
冒頭でCOUNTとstotalの値を出力するようにしましょう  
改行しても良いので end=": "はいらないです  
py03以降COUNTは使わなくなっているので宣言を追加する必要がありあます。  
グローバル変数宣言の一番下にCOUNT = 0 を追加しましょう  
```
  print(COUNT,":",stotal)
```
ABOARDには各行のクイーンの設置場所が記憶されています。  
ABOARD[2]=4 だったら3行目の右から5番目にクイーンが置かれています。  
ちなみにメソッド内でABOARDをglobal宣言していませんが、参照するだけだったらglobal宣言いらないみたいです。  
各行がクイーンが置かれている場所「o」置かれていない場所が「-」になるようにしてみましょう。  
printoutは各行ごとにfor文を回していましたが各セルごとに出力するためfor文を追加しましょう。  
iで行、jで行の中の各セルごとにみていってクイーンが置かれている場所の時だけ「o」を出力しましょう。  
そして行の終わりに print("")で改行を入れましょう。  
```
  for i in range(size):
    for j in range(size):
      if ABOARD[i]==j:
        print("o", end="")
      else:
        print("-", end="")
    print("")
```
ボードの出力が終わったら見やすいようにセパレータを入れてみましょう  
```
COUNT = 0
#BOARD出力
def  printboard(stotal,size):
  global COUNT 
  COUNT += 1
  print(COUNT,":",stotal)
  for i in range(size):
    for j in range(size):
      if ABOARD[i]==j:
        print("o", end="")
      else:
        print("-", end="")
    print("")
  print("########")

```
新しく関数を追記するときは決まりは特にないのですがグローバル変数宣言の直下(223行目あたり)に置きましょう。  

そして、331行目,332行目の間でprintboardメソッドを呼び出しましょう。  
```
    stotal = symmetryops(size)	      # 対称解除法の導入
    printboard(stotal,size)
    if stotal != 0:
```
## 出力結果を見てみよう
それでは出力を見てみましょう。  
py04はn4からn15まで実行するのでn8だけ実行してみましょう。  
214行目のMAX を9にして  
minを8にして実行してみてください  

```
python py04_nqueen.py
```

こんな感じで出力されるかと思います。  
```
1 : 8
o-------
----o---
-------o
-----o--
--o-----
------o-
-o------
---o----
########
2 : 8
o-------
-----o--
-------o
--o-----
------o-
---o----
-o------
----o---
########
3 : 0
o-------
------o-
---o----
-----o--
-------o
-o------
----o---
--o-----
########

```
先頭の1はstotalが8なので90度回転して同じものがあるということです。  
実際に90度回転して同じでstotalが0のものがあるか探してみましょう。  

```
1 : 8
o-------
----o---
-------o
-----o--
--o-----
------o-
-o------
---o----
########
```
1を反時計回りに90度回転させると  
以下の形になります。  
```
--o-----
-----o--
---o----
-o------
-------o
----o---
------o-
o-------
```
この形のクイーンの配置があるか調べてみると  
```
22 : 0
--o-----
-----o--
---o----
-o------
-------o
----o---
------o-
o-------

```
22番目のクイーンの配置に同じものがありました。  
またstotalも0ですので正しそうです。  
こんな感じで検証できそうですが手動で全部調べるのはちょっと辛いですよね。。。  
次回はプログラムを使って検証する方法を試してみましょう。  

## 書籍の紹介
{{% amazon

title="UNIXという考え方―その設計思想と哲学 単行本 – 2001/2/23"
url="https://www.amazon.co.jp/UNIX%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9%25E2%2580%2595%25E3%2581%259D%25E3%2581%25AE%25E8%25A8%25AD%25E8%25A8%2588%25E6%2580%259D%25E6%2583%25B3%25E3%2581%25A8%25E5%2593%25B2%25E5%25AD%25A6-Mike-Gancarz/dp/4274064069/ref=sr_1_1?keywords=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9&amp;qid=1667786898&amp;qu=eyJxc2MiOiIxLjEwIiwicXNhIjoiMC4zOSIsInFzcCI6IjAuMzEifQ%253D%253D&amp;sprefix=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%252Caps%252C257&amp;sr=8-1&_encoding=UTF8&tag=nlpqueens09-22&linkCode=ur2&linkId=0249eb4cab50d700fb6949eb9aeafef1&camp=247&creative=1211"
imageUrl="https://m.media-amazon.com/images/I/518ME653H3L._SX330_BO1,204,203,200_.jpg"
summary=`   UNIX系のOSは世界で広く使われている。UNIX、Linux、FreeBSD、Solarisなど、商用、非商用を問わず最も普及したOSのひとつであろう。そしてこのOSは30年にわたって使用され続けているものでもある。なぜこれほど長い間使われてきたのか？ その秘密はUNIXに込められた数々の哲学や思想が握っている。
   そもそもUNIXはMulticsという巨大なOSの開発から生まれたものだ。あまりに巨大なMulticsはその複雑さゆえに開発は遅々として進まず、その反省からケン・トンプソンが作ったのがUNIXの初めとされる。その後デニス・リッチーら多数の開発者が携わり、UNIXは発展した。本書はこのUNIXに込められた「思想と哲学」を抽出し、数々のエピソードとともにUNIXの特徴を浮き彫りにしていく。

   たとえば本書で述べられているUNIXの発想のひとつとして「過度の対話式インタフェースを避ける」というものがある。UNIXのシステムは初心者には「不親切」なつくり、つまり親切な対話式のインタフェースはほとんどなく、ユーザーがコマンドを実行しようとするときはオプションをつける形をとっている。この形式はオプションをいちいち覚えねばならず、初心者に決してやさしくない。しかしこれはプログラムを小さく単純なものにし、他のプログラムとの結合性を高くする。そして結果としてUNIXのスケーラビリティと移植性の高さを支えることになっているのだ。このような形式で本書では9つの定理と10の小定理を掲げ、UNIXが何を重視し、何を犠牲にしてきたのかを明快に解説している。

   最終章にはMS-DOSなどほかのOSの思想も紹介されている。UNIXの思想が他のOSとどう違うかをはっきり知ることになるだろう。UNIXの本質を理解するうえで、UNIX信者もUNIX初心者にとっても有用な1冊だ。（斎藤牧人）`
%}}

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










