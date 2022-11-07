---
title: "（１１）【getopts】シェルスクリプトコマンド活用紹介"
description: "シェルスクリプトでオプションを処理したい"
date: 2022-07-07T11:27:03+09:00
draft: false

authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - コマンド活用
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## getoptsコマンド
- オプションを解析する
- エラーメッセージを表示しない
- 引数付きのオプションを使用する


## getoptsコマンド概要
「getopts」は、bashのシェルスクリプト内でオプションを解析する際に役立つコマンドです。自作のシェルスクリプトで「-a」のような「ハイフン＋アルファベット1文字」のオプションを扱う際に便利です。「-f ファイル名」のように引数を取るオプションも解析できます。

例えばこういうのです
```
$ head -n10
```

文字列を渡すこともできます
```
$ grep -f wordlist.txt
```

ということで、自作のスクリプトでこういう事ができるわけです。
```
$ myScript.sh -n10 -f addressList.txt
```

{{% tips-list tips %}}
ヒント
: getoptsとよく似た名前で用途も同じ「getopt」コマンド（/usr/bin/getopt）があります。getoptコマンドはgetoptsとは異なり、「--」から始まるロングオプションも扱うことができます。 
{{% /tips-list %}}



## getoptsコマンドの書式
getopts オプション文字列 変数名


## getoptsコマンドの主なオプション

getoptsにはオプションはありません。なお、オプション文字列の先頭に「:」記号を入れるかどうかによって、エラーメッセージ表示の有無を変更できます。

|オプション    |意味|
|--------------|----|
|:	|エラーメッセージの表示の有無|


{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man getopts   などで、getoptsの使い方を確認してください。
{{% /tips-list %}}


## getoptsコマンド詳細説明

### オプションを解析する 

オプション「-a」「-b」「-c」を使用し、それぞれのオプションに応じてメッセージを表示します。

```Shell:getopts01.sh
#!/bin/bash

while getopts abc OPT; do
  case $OPT in
     a) echo "[-a] が指定された";;
     b) echo "[-b] が指定された";;
     c) echo "[-c] が指定された";;
     *) echo "該当なし OPT=$OPT ";;
  esac
done
```

while getopts abc OPT; do 
の abc は、オプションの種類が a,b,cの３種類あることを明示的に指定しています。
OPTは $OPT変数で、 a,b,cがそれぞれ順に代入されます。

```
$ bash getopts.sh -a
[-a] が指定された
$ bash getopts.sh -ab
[-a] が指定された
[-b] が指定された
$ bash getopts.sh -a -b
[-a] が指定された
[-b] が指定された
$ bash getopts.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
$ bash getopts.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
getopts.sh: 不正なオプションです -- d
該当なし OPT=?
```

以下のオプションは用意されていないことからエラー表示となります。

```
$ bash getopts.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
getopts.sh: 不正なオプションです -- d
該当なし OPT=?
```


### エラーメッセージを表示しない

　getoptsに指定していないオプションを使用すると、画面1のように「不正なオプションです -- d」、あるいは「illegal option -- d」のようなメッセージを表示します。

　このようなgetoptsのエラーメッセージを表示したくない場合は、「getopts :abc OPT」のように、オプション文字列の先頭に「:」記号を入れます。

```Shell:getopts02.sh
#!/bin/bash

while getopts :abc OPT; do
  case $OPT in
     a) echo "[-a] が指定された";;
     b) echo "[-b] が指定された";;
     c) echo "[-c] が指定された";;
     *) echo "該当なし OPT=$OPT ";;
  esac
done
```


エラーが表示される getopts01.sh
```
$ bash getopts01.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
getopts01: 不正なオプションです -- d
該当なし OPT=?
```

エラーが表示されない getopts02.sh
```
$ bash getopts02.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
該当なし OPT=?
```


### 引数付きのオプションを使用する

「-f ファイル名」のように、引数を取るオプションを解析したい場合は、オプション文字の後に「:」記号を付けます。オプションの引数は、組み込み変数「OPTARG」で参照できます。

```Shell
#!/bin/bash

while getopts :a:bc: OPT; do
  case $OPT in
     a) echo "[-a] が指定された(引数=$OPTARG)";;
     b) echo "[-b] が指定された";;
     c) echo "[-c] が指定された(引数=$OPTARG)";;
     :) echo "$OPTARGに引数が指定されていません";;
     ?) echo "$OPTARGは定義されていません";;
  esac
done
```

実行結果
```
$ bash getopts03.sh -a filename -b -c 100
[-a] が指定された 引数=filename
[-b] が指定された
[-c] が指定された 引数=100
$

```
解説
:a:bc:　について
```
:a   エラー表示をしないというオプションとなります。
a:    -a が指定された場合は引数に数値または文字列を受け取ります。
c:    -c が指定された場合は引数に数値または文字列を受け取ります。
```

{{% tips-list tips %}}
ヒント
: アホか。というくらいまぎらわしくてわかりにくい設計で笑えます。一体どこの誰がこんなわかりにくい仕様にしたのでしょう。
{{% /tips-list %}}


{{% tips-list tips %}}
ヒント
: とにかくシェルクスクリプトで起動パラメータを設定することができました。便利なツールをたくさん作ってください。では
{{% /tips-list %}}


## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/product/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/product/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/product/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/product/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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




