---
title: "【アルゴリズム 配列準備編】ざっくりわかるシェルスクリプト７"
date: 2022-10-03T11:36:10+09:00
draft: false
authors: suzuki
image: algorithm.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - アルゴリズムとデータ構造
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## Bashスクリプトで配列の準備

この章では、Bashスクリプトでいくつかのソートアルゴリズムを実行するための、元となるテンプレートを配列で作成します。
他の言語への移植も視野に入れて、言語に特化したライブラリや構文はあまり使わずに、基本的な構文で記述し、アルゴリズムにフォーカスして表現します。
ですので、「もっと速く」「もっと短くコンパクトなソースで」というよりも、「冗長でもわかりやすく」を理念に書いていきます。
この章で使うプログラムソースは以下のディレクトリの01Array.sh を参照してください。

[Bashプログラミングによるアルゴリズム 01Array.sh](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)


## ファイルの作成

まずは、ファイルを作成します。

```
$ :> 01Array.sh
```

## シェバンの指定

ファイルを開いてファイルの冒頭一行目にshe-ban（シェバン）を入力します。
この行は、$ which bash で得られる bash コマンドのPATHを入力します。
２行目は空行としておき、３行目からプログラムを書き始めます。


```bash:01Array.sh
#!/usr/bin/bash 

```

## 関数の呼び出し

ではさっそく関数名を決めて入力します。
ここでは execArray という関数名とします。
`time`コマンドは、実行したプログラムの処理時間を計測するコマンドです。
`exit`コマンドは、プログラムの終了を意味します。
「＃」で始まる行はコメント行です。「＃」以降は無視されますので、プログラムの説明などを書くと良いでしょう。
「１０」という数字は、１０個の配列を作成するという意味となります。
半角数字で入力してください。
ちまたではどのくらい楽になるのかは不明ですが、行末のセミコロンを省略する人も多いようです。複数行を縮めて表示したいときなどに、適宜、一行にまとめて書く場合のために、行末にはセミコロンを入れます。
どのプログラミング言語にも言えることですが、プログラムはソースの下から上へ向かって積み上げるように追記していきます。

ここでは、`time`コマンドを使って処理速度を計測しつつ、execArray関数を、１０という数字をパラメータで渡して呼び出しています。
呼び出しているだけで、execArray()関数はまだ書いていませんね笑


```bash:01Array.sh
#!/usr/bin/bash

##
#
time execArray 10;
exit;

```

実行結果は以下のとおりです。
`bash`コマンドの後ろに半角スペースを入れて実行ファイル名を入力します。

```
bash-5.1$ bash 01Array.sh
test: 行 5: execArray: コマンドが見つかりません

real	0m0.002s
user	0m0.001s
sys	0m0.001s
bash-5.1$
```

エラーが表示されていますが、ソースに間違いがあるわけではありません。
計測数値が表示されていますね。

|項目|意味|
|:---:|:---|
|real	|プログラムの呼び出しから終了までにかかった実時間（秒）|
|user	|プログラム自体の処理時間（秒）（ユーザCPU時間）|
|sys	|プログラムを処理するために、OSが処理をした時間（秒）（システム時間）|

execArray関数をまだ書いていませんから、呼び出した関数が見つからないというエラーとなります。
では、エラーが出ないように、execArray関数を書いていきましょう。


## execArray()関数の記述

```bash:01Array.sh
##
# <>execArray()
#
function execArray(){
  setArray $1;
  display;
}
##
#
time execArray 10;
exit;
```

関数名は`function`を関数名の前に記入します。
これにより、execArray関数が関数であることが明示的にわかります。
`function`を記入することすらも省略可能ではありますが、きちんと記入することで間違いを防ぐことができます。
関数名の後ろには 「()」が付きます。
関数は「中括弧｛｝」でくくられます。
関数の内容は「中括弧｛｝」の中に書きます。

execArray()の中身は２つの関数を呼び出しています。
さきほども説明したとおり、execArrayを呼び出したときにパラメータで渡された「１０」が $1に入っています。

そして、もうひとつの呼び出し関数は display です。
この関数は、配列の中身を表示する関数で、こちらもまだ記述していません。

```bash:01Array.sh
  setArray $1;
  display;
```

setArray関数を呼び出すと同時に、$1という値も渡していることがわかります。




## 配列を作成

ソースの末尾にあるexit;の一つ前の行の、setArray $1; は、execArray関数同様に、呼び出し関数です。
呼び出し関数は関数名のうしろに「（）」や「中括弧｛｝」がありません。

呼び出し関数
```
  setArray $1;
```


関数の実体（関数そのもの）
```
function setArray(){  

}
```

setArrayやdisplayといって呼び出しはしたものの、２つの関数ともに、関数の実体をまだ書いていません。
ですので、ファイルを実行してもエラーとなります。
今は気にしないでおきます。

ちなみに、execArray()関数の、setArray $1 ; の「＄１」は、setArray()関数に渡された１番目のパラメータとなります。

execArrayを呼び出したときに指定された「１０」という数字が渡されることとなります。

```
time execArray 10;
```
execArray関数に「１０」を渡しているわけです。
execArray関数の実体に渡された１つ目のパラメータ「１０」は、execArray関数の中で「$1」として受け取っているわけです。

display関数も、呼び出してはいるものの、関数の実体をまだ書いていないので、これから書くことにします。


## 配列にランダムな数値を代入

では、以下の関数setArray関数をexecArray()関数の上に追記します。

```bash:01Array.sh
##
# <> set Array
#
function setArray(){
  nElems=0;
  for((i=0;i<$1;i++));do
      insert `echo "$RANDOM"`;
  done
}
```

追記するとソースコードは以下のとおりとなります。

```bash:01Array.sh
#!/usr/bin/bash

##
# <> set Array
#
function setArray(){
  nElems=0;
  for((i=0;i<$1;i++));do
      insert `echo "$RANDOM"`;
  done
}
##
# <>execArray()
#
function execArray(){
  setArray $1;
  display;
}
##
#
time execArray 10;
exit;
```

なんとなくソースコードらしくなってきました。
execArray()内で呼び出した setArray $1; は、`function setArray()`を呼び出すと同時に、$1を渡します。
ここの$1は `time execArray 10;で渡した「１０」です。

time execArray 10; で、execArray関数に１０を渡す。
↓
function execArray() で ＄１として１０を受け取る。
↓
setArray $1; で setArray関数に＄１（１０）を渡す。
↓
setArray()で＄１として１０を受け取る。


setArray()に渡された「１０」はforループの中の条件 「iが$1よりも小さい間にループを回す」というところで登場していますね。
要するに渡された＄１を使ってループを１０回すということになります。

forでループしながら`insert`という関数を呼び出しています。
insert の後ろに `echo "$RANDOM"` がパラメータで渡されています。
これは、ランダムに数値を生成して insert関数にパラメータとして値を渡しています。


## 配列の要素を挿入（作成）する関数の作成

では、以下の関数を setArray()関数の上に追記します。

```bash:01Array.sh
##
# <> insert
#
function insert(){
  array[((nElems++))]=$1;
}
```

`insert()`関数では、`insert`関数に渡されたパラメータ「＄１」をarray[]配列に代入しています。
代入される段階で０で初期化されたnElemsという値がインクリメントされます。
挿入されるたびに配列arrayの添字がひとつずつ増えていくわけです。
では、追記したソースは以下の通りとなります。

```bash:01Array.sh
#!/usr/bin/bash

##
# <> insert
#
function insert(){
  array[((nElems++))]=$1;
}
##
# <> set Array
#
function setArray(){
  nElems=0;
  for((i=0;i<$1;i++));do
      insert `echo "$RANDOM"`;
  done
}
##
# <>execArray()
#
function execArray(){
  setArray $1;
  display;
}
##
#
time execArray 10;
exit;

```

## 表示のための関数を作成

最後に、ソースの一番下で、execArray 10; と呼び出している下の display 関数を追記します。
display関数は、作成した配列の中身を表示する関数です。

```bash:01Array.sh
################
##
# <>display 
#
function display(){
  for((i=0;i<nElems;i++));do
      echo "$i" "${array[i]}";
  done
  echo "------";
}
```

`insert`関数で挿入されるたびにインクリメントされたnElemsの値の数だけループ処理されます。
１０の配列を準備するわけですから、nElemsの値は、０から始まって最後は９となります。これで１０回分ループします。

念の為に、ソース全体は以下の通りとなります。

```bash:01Array.sh
#!/usr/bin/bash

################
##
# <>display 
#
function display(){
  for((i=0;i<nElems;i++));do
      echo "$i" "${array[i]}";
  done
  echo "------";
}
##
# <> insert
#
function insert(){
  array[((nElems++))]=$1;
}
##
# <> set Array
#
function setArray(){
  nElems=0;
  for((i=0;i<$1;i++));do
      insert `echo "$RANDOM"`;
  done
}
##
# <>execArray()
#
function execArray(){
  setArray $1;
  display;
}
##
#
time execArray 10;
exit;
```

## 作成したプログラムの実行

作成した実行ファイルに間違いがなければ、以下の通り出力されるはずです。

```
bash-5.1$ bash 01Array.sh
0 1572
1 21316
2 22127
3 23889
4 6243
5 18211
6 24203
7 30049
8 10593
9 4716
------

real	0m0.011s
user	0m0.004s
sys	0m0.006s
bash-5.1$
```

おお、なにやら表示されました。
１０個の配列にランダムに生成された値がひとつひとつ代入されていますね。
ランダムな数値ですから、実行するたびに、代入された値が変化するのがわかると思います。（ランダムだから）
この章では、値を配列に格納できれば完成です。


## bashスクリプトで２次元配列は可能か？

array[0]配列には一つの値を入力できます。
array[1]にも、array[2]にも一つの値しか入力できません。

C言語やJavaは２次元配列といって、配列に複数の値を格納することができます。

array[0]　名前　住所
array[1]　名前　住所
array[2]　名前　住所

といった感じです。
Bashスクリプトは２次元配列をサポートしていないので、

array[0]　名前

ということしかできません。

とはいえ、頭の良い人がいるもので、bashスクリプトでも、２次元配列に似た事が実現可能です。
恐ろしいことに、３次元でも４次元でも可能です。

具体的には`eval`コマンドを使って実現します。

次の章では、格納した配列の値を比較して、並べ替えたいところですが、ちょっとだけ寄り道をして、

「この章の内容を`eval`コマンドを使った２次元配列で実現」

します。
これにより、ソートから続く高度なアルゴリズム、ツリー、グラフの構築がBashスクリプトで可能となります。


{{% tips-list tips %}}
ヒント
: この章で配列が実現できました。次の章ではこの章で作成したソースを`eval`コマンドを使って２次元配列の実現に挑戦します。 
{{% /tips-list %}}



## 「ざっくり」シリーズのご紹介
【アルゴリズム 再帰】ざっくりわかるシェルスクリプト１５
https://suzukiiichiro.github.io/posts/2022-10-07-01-algorithm-recursion-suzuki/
【アルゴリズム キュー】ざっくりわかるシェルスクリプト１４
https://suzukiiichiro.github.io/posts/2022-10-06-01-algorithm-queue-suzuki/
【アルゴリズム スタック】ざっくりわかるシェルスクリプト１３
https://suzukiiichiro.github.io/posts/2022-10-06-01-algorithm-stack-suzuki/
【アルゴリズム 挿入ソート】ざっくりわかるシェルスクリプト１２
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-insertionsort-suzuki/
【アルゴリズム 選択ソート】ざっくりわかるシェルスクリプト１１
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-selectionsort-suzuki/
【アルゴリズム バブルソート】ざっくりわかるシェルスクリプト１０
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-bubblesort-suzuki/
【アルゴリズム ビッグオー】ざっくりわかるシェルスクリプト９
https://suzukiiichiro.github.io/posts/2022-10-04-01-algorithm-bigo-suzuki/
【アルゴリズム ２次元配列編】ざっくりわかるシェルスクリプト８
https://suzukiiichiro.github.io/posts/2022-10-03-01-algorithm-eval-array-suzuki/
【アルゴリズム 配列準備編】ざっくりわかるシェルスクリプト７
https://suzukiiichiro.github.io/posts/2022-10-03-01-algorithm-array-suzuki/ 
【アルゴリズム 配列編】ざっくりわかるシェルスクリプト６
https://suzukiiichiro.github.io/posts/2022-09-27-01-array-suzuki/
【grep/sed/awkも】ざっくりわかるシェルスクリプト５
https://suzukiiichiro.github.io/posts/2022-02-02-01-suzuki/
【grep特集】ざっくりわかるシェルスクリプト４
https://suzukiiichiro.github.io/posts/2022-01-24-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト３
https://suzukiiichiro.github.io/posts/2022-01-13-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト２
https://suzukiiichiro.github.io/posts/2022-01-12-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト１
https://suzukiiichiro.github.io/posts/2022-01-07-01-suzuki/

【TIPS】ざっくりわかるシェルスクリプト
https://suzukiiichiro.github.io/posts/2022-09-26-01-tips-suzuki/




<!--
{{% tips-list tips %}}
ヒント
{{% /tips-list %}}

{{% tips-list alert %}}
注意
{{% /tips-list %}}
-->


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




