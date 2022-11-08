---
title: "【jot】Bash/シェルスクリプトマニアックコマンドあれこれ３"
description: "乱数や連番を作成する"
date: 2022-11-08T10:40:40+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - マニアックコマンド
  - コマンド活用
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## jotコマンド
- 連番を生成する
- 文字列と組み合わせた連番を作成する
- printf のフォーマットで出力する
- 連番の範囲を指定して出力する
- 乱数を出力する

## jotコマンド概要
jotコマンドは、連番数字はもちろん、連番付きのアルファベットを生成したり、ランダムな数字を生成したりできます。似たコマンドに `seq`や`$RANDOM` コマンドがあります。


## jotコマンドの書式
jot [オプション] 


## jotコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-w [文字列]|文字列を指定する|
|-r|乱数を出力する|


## jotコマンド詳細説明

### 連番を作る
「jot ファイル名」で、ファイルの中身を並べ替えます。

さっそく連番を出力してみます。
まずは10個の連番を出力します。

```
$ jot 10 
1
2
3
4
5
6
7
8
9
10
```

seqコマンドではこうなります
```
$ seq 10
1
2
3
4
5
6
7
8
9
10
```

### 文字列と組み合わせた連番を作成する

文字列 abc に続けて10個の連番を作成します。
```
$ jot -w abc 10
abc1
abc2
abc3
abc4
abc5
abc6
abc7
abc8
abc9
abc10
```

次の項でも説明しますが、seqコマンドでも同様のことができます。
```
$ seq -f "%04g" 3
0001
0002
0003
```

seqコマンドでもprintfフォーマットで出力できますので、文字列と連結した連番の生成もできます。
```
$ seq -f "IMG%04g.jpg" 3
IMG0001.jpg
IMG0002.jpg
IMG0003.jpg
```

では、次の項では`jot`コマンドで`printf`のフォーマットで出力する方法を具体的に説明します。


### printf のフォーマットで出力する

```
$ jot -w 'name%03d' 10
name001
name002
name003
name004
name005
name006
name007
name008
name009
name010
```

### 連番の範囲を指定して出力する

5からの連番を３つ出力します。
```
$ jot   -w 'name%03d' 3 5
name005
name006
name007
```

10からの連番を５つ出力します。
```
$ jot -w 'name%03d' 5 10
name010
name011
name012
name013
name014
bash-5.1$
```

### 乱数を出力する

1から10までの乱数を５つ出力します。
-r 5 は乱数を５つ出力することを示します。
1 10 は、１から１０までの範囲でといういみとなります。

1から100までの範囲で乱数を５つ出力すると以下の通りになります。
```
jot -r 5 1 100
1
6
17
91
46
```

print文フォーマットで、1から100までの範囲で乱数を５つ出力してみます。
```
$ jot -w 'name%03d' -r 5 1 10
name008
name006
name007
name001
name006
```


{{% tips-list tips %}}
ヒント
: 連番を作成する場合は`seq`、乱数を扱う場合は `$RANDOM`を使う場合が多いと思いますが、jotコマンドは、`seq`,`$RANDOM`を足し合わせて、同等それ以上の実行が可能です。
{{% /tips-list %}}


## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/projotct/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/projotct/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/projotct/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/projotct/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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












