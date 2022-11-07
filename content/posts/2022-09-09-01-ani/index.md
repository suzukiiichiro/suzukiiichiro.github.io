---
title: "NQueen日記 2022/09/09"
description: "NQueenのロジックを研究してます。日々NQueenで試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-09-09T09:55:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - N-Queen 
  - プログラム
---
## 9月9日

数が合わない点はsymmetryOps内での単純なコードの間違えだったため修正して数が合った。 
ただ、速度が過去のロジックより２０％遅い。 
そこで、symmetryOpsを突破した数を調査してみた。 

KOHO2,KOHO4,KOHO8がそれぞれsymmetryOps を突破してCOUNT２,COUNT4,COUNT8の候補となったもの。 
数を出したところ、今のロジックは過去のロジックよりKOHO8の数が倍くらい多い。 

```
今のロジック
６．CPUR 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00:STEP:6:KOHO2:1:KOHO4:0:KOHO8:0
 5:           10               2            0.00:STEP:16:KOHO2:1:KOHO4:0:KOHO8:1
 6:            4               1            0.00:STEP:55:KOHO2:1:KOHO4:1:KOHO8:3
 7:           40               6            0.00:STEP:285:KOHO2:1:KOHO4:2:KOHO8:46
 8:           92              12            0.00:STEP:1651:KOHO2:1:KOHO4:8:KOHO8:381
 9:          352              46            0.00:STEP:7022:KOHO2:1:KOHO4:11:KOHO8:1889
10:          724              92            0.00:STEP:24935:KOHO2:5:KOHO4:38:KOHO8:6750
11:         2680             341            0.01:STEP:79391:KOHO2:5:KOHO4:47:KOHO8:22318
12:        14200            1788            0.03:STEP:237005:KOHO2:13:KOHO4:170:KOHO8:68576
13:        73712            9237            0.11:STEP:644806:KOHO2:13:KOHO4:191:KOHO8:198982
14:       365596           45771            0.51:STEP:1635763:KOHO2:25:KOHO4:574:KOHO8:539368
15:      2279184          285095            2.62:STEP:3843863:KOHO2:25:KOHO4:615:KOHO8:1373396
16:     14772512         1847425           15.11:STEP:8488361:KOHO2:41:KOHO4:1514:KOHO8:3265841
17:     95815104        11979381         1:38.70:STEP:17643021:KOHO2:41:KOHO4:1583:KOHO8:7307235
```

```
今までのロジック
６．nq27 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00:STEP:31:KOHO2:1:KOHO4:0:KOHO8:0
 5:           10               2            0.00:STEP:153:KOHO2:1:KOHO4:0:KOHO8:2
 6:            4               1            0.00:STEP:592:KOHO2:1:KOHO4:1:KOHO8:6
 7:           40               6            0.00:STEP:2629:KOHO2:1:KOHO4:2:KOHO8:29
 8:           92              12            0.00:STEP:12195:KOHO2:1:KOHO4:8:KOHO8:170
 9:          352              46            0.00:STEP:52319:KOHO2:1:KOHO4:11:KOHO8:849
10:          724              92            0.00:STEP:199807:KOHO2:5:KOHO4:38:KOHO8:3696
11:         2680             341            0.01:STEP:675495:KOHO2:5:KOHO4:47:KOHO8:14614
12:        14200            1788            0.04:STEP:2010177:KOHO2:13:KOHO4:170:KOHO8:51301
13:        73712            9237            0.12:STEP:5362062:KOHO2:13:KOHO4:191:KOHO8:163839
14:       365596           45771            0.43:STEP:12987395:KOHO2:25:KOHO4:574:KOHO8:473312
15:      2279184          285095            1.93:STEP:29011301:KOHO2:25:KOHO4:615:KOHO8:1257054
16:     14772512         1847425           10.75:STEP:60470849:KOHO2:41:KOHO4:1514:KOHO8:3071660
17:     95815104        11979381         1:09.18:STEP:118819519:KOHO2:41:KOHO4:1583:KOHO8:6997422
```

調査したところ 
backtrack1のところでsymmetryOpsをせずにKOHO8としてそのままnqueenに移行していたのが原因だった。 

上下左右2行２列全てにクイーン置けてないもの（例えば上下左は2行置けたが右は1行しか置けてないとか）を弾くようにしたらKOHO8の数も同じになった。 

上下左右2行２列にクイーンを置けないものは到達する可能性がないということが明らかになった。 


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










