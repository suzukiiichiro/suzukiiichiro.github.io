---
title: "【アルゴリズム ２次元配列編】ざっくりわかるシェルスクリプト８"
date: 2022-10-03T15:11:13+09:00
draft: false

authors: suzuki
image: algorithm.jpg
categories:
  - programming
tags:
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## はじめに

さて。
前回の章では、アルゴリズムを勉強していくためのもととなるテンプレートとして、配列に値を入れる仕組みと、配列の中身を表示する仕組みを実装した01Array.shを作成しました。

とても淡白な配列実装
[01Array.sh](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)

今回の章では、前章で作成したテンプレートを２次元配列で実装を修正し、今後の高度なアルゴズムの実装に備えたいと思います。

Bashでは不可能とされてきた２次元配列を擬似的に振る舞う実装
[01Eval_Array.sh](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)


## メインからの比較

２次元配列自体がよくわからない人もいると思います。
まず、配列の添字は０から数えます。（そういうものだと覚えるしかありません）

２次元配列のarray配列の１番目の人で、０に名前、１に住所を格納します。
array[0][0]=名前
array[0][1]=住所

２次元配列のarray配列の２番目の人で、０に名前、１に住所を格納します。
array[1][0]=名前
array[1][1]=住所

２次元配列のarray配列の３番目の人で、０に名前、１に住所を格納します。
array[2][0]=名前
array[2][1]=住所

:
:
＜以下同文＞

こうした一つの配列の要素に、複数の値を格納できることを２次元配列といいます。
当然、以下の様な３次元配列や

```
array[0][0]=名前
array[0][1]=住所
array[0][2]=電話番号
```

以下のような４次元配列もあります。

```
array[0][0]=名前
array[0][1]=住所
array[0][2]=電話番号
array[0][3]=メールアドレス
```

C言語やJavaでは当たり前のように使われる多次元配列が、Bashではサポートされていません。

```
array[0]
```

は、可能なのですが、

```
array[0][0]
```

ができないのです。
不便ですね。他の言語では、

```
array[0].getName() 
```

と、すると名前を取り出せたり、

```
array[0].getAddress()
```

とすると、住所が取り出せたり、さらには

```
array[0].setName() 
```

とすると、名前をセットしたりすることもできたりします。
そんな直感的なコーディングがBashではできなかったりします。

事実、アルゴリズムの勉強を進めていくと、ひとつの配列に、IDと値をそれぞれセットしたり、参照したり、置き換えたりしたくなるものです。

この章では、そうした「ふるまい」をBashで擬似的に実現してみようというチャレンジになります。

## シェバン、そしてメインへ

前章で作成した配列版は以下のとおりです。
```bash:01Array.sh
#!/usr/bin/bash

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

今回の２次元配列版は以下のとおりです。
```bash:01Eval_Array.sh
#!/usr/bin/bash


##
# <>execArray()
# メインルーチン
function execArray(){
  local N=$1;           #要素数
  setArray $N           #配列にセット
  display;              #表示
}
##
# 実行
#
time execArray 10;
exit;
```

ほぼ同じですね。
今回の２次元配列版では、前章の配列版よりもきちんと記述されています。（しています）

`local`は、関数内のスコープ内でのみ有効な変数という定義です。 `function execArray()`に渡された $1パラメータは、関数冒頭で、Nという変数に代入されています。これにより、ソースの中で「$1」はなんだっけ？ということにならなくなります。

{{% tips-list tips %}}
ポイント
: 関数内でのみ使う変数は`local`をつける
: 関数パラメータ $1,$2などといった変数は、関数冒頭できちんと命名規則に則った変数に代入して見渡しの良いソースを書くことを心がける
{{% /tips-list %}}


## 配列をセットする

では、早速配列をセットしてみます。

前章で作成した配列版は以下のとおりです。
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

今回の２次元配列版は以下のとおりです。
```bash:01Eval_Array.sh
##
# <> set Array
# 配列を作成
function setArray(){
  local N=$1;           #すべての要素数
  local ID=100;         #100からの連番
  local value;          #配列に代入される要素の値
  for((i=0;i<N;i++)){
    value=$( echo $RANDOM );
    insert $((ID++)) $value;
  }
}
```

`function setArray()`もほぼ変化はありません。
関数パラメータで受け取った $1 を `local`変数 Nに代入しています。さらに、関数内で使われる２つの変数「ID」と「value」を同じく`local`変数で定義しています。

$RANDOMで取得したランダムな数字を`insert()`関数に渡すわけですが、きちんと変数「value」に代入した上で、`insert()`関数に渡しています。

`$((ID++))`は新しく出現した変数ですね。
今回の章では、値だけでは一般的な配列で実装できてしまうので、あえて「ID」といった要素を追加しています。「ID」は１００からの連番として`insert()を呼び出すたびにインクリメントされます。

```
let ID + 1;
```

という書き方よりも、他のプログラム言語でも使われる書式

```
(( ID++ ));
```

のほうが、慣れ親しんでいる人も多いかと思います。
```
(( ID++ ));
```
は、インクリメントするだけの場合の書き方となります。
インクリメントした値を取り出して使う場合は、「$」をつけます。

```
$(( ID++ ));
```


{{% tips-list tips %}}
ポイント
: 関数内でのみ使う変数は`local`をつける
: 関数パラメータ $1,$2などといった変数は、関数冒頭できちんと命名規則に則った変数に代入して見渡しの良いソースを書くことを心がける
: `echo $RANDOM`といったよく使われる動的変数は、valueといった値にきちんと格納して使う
: インクリメントは (( ID++ )); 値を取り出して使う場合は、 $(( ID++ )); 
{{% /tips-list %}}

## 配列に値をセット

ここでは、配列に値をセットしてみたいと思います。
まずは、前章と、今回の章をみくらべてみましょう。


前章で作成した配列版は以下のとおりです。
```bash:01Array.sh
##
# <> insert
#
function insert(){
  array[((nElems++))]=$1;
}
```

今回の２次元配列版は以下のとおりです。
```bash:01Eval_Array.sh
##
# <> insert
# 配列の要素に値を代入
function insert(){
  local ID=$1;          #100からの連番
  local value=$2;       #配列に代入される要素の値
  setID     "$nElems"    "$ID";      #IDをセット
  setValue  "$nElems"    "$value";   #Valueをセット
  ((nElems++));
}
```

`function insert()`に渡されたパラメータの処理はきちんと、`local`で定義し、$1,$2をソース内で乱用せずに、関数冒頭でわかりやすい変数に代入しています。

```
((nElems++));
```

こちらは、値をインクリメントしているという事がわかります。
インクリメントするだけで値を取り出す必要がないので $(( nElems++));とはなりません。

新規で追加されているのは以下の２行ですね。

```
  setID     "$nElems"    "$ID";      #IDをセット
  setValue  "$nElems"    "$value";   #Valueをセット
```

どうやら、`function setID()`と`function setValue()`といった関数が新たに追加されているようですね。
それぞれに、 $nElems と、$IDといった２つのパラメータを渡していることも見て取れます。
では次の項で`function setID()`と`function setValue()` といった「セッター」メソッドを見てみましょう。

## ２つのセッターメソッド 「謎のevalコマンド」

セッターメソッドは、前章にはなかった新しい関数です。
変数に値を入れるための関数で、IDに値を入れたい場合は`function setID()`、valueに値を入れたい場合は`function setValue()`を呼び出します。

２つの関数冒頭の`local`と$1,$2を変数に置き換える話は、これまで何度化してきたので、もう説明は不要かと思います。

```bash:01Eval_Array.sh
##
# <>setValue() 
# セッター
function setValue() {
  #今後挿入や置き換えに備えてnElemsとは別の変数を用意しておく
  local Elem="$1";      
  local value="$2";
	eval "aRray[$Elem].getValue()      { echo "$value"; }"
}
##
# <>setID()
# セッター
function setID(){
  #今後挿入や置き換えに備えてnElemsとは別の変数を用意しておく
  local Elem="$1";      
  local ID="$2";
	eval "aRray[$Elem].getID()         { echo "$ID"; }"
}
```

`eval`が新しく登場するコマンドです。
setID()の中の以下の一行に注目してみます。

```
	eval "aRray[$Elem].getID()         { echo "$ID"; }"
```


`eval`を使うことによっては文字列をコマンドとして扱うことができます。
上記の例では、

```
"aRray[$Elem].getID"
```

という文字列に

```
echo "$ID";
```

をセットしています。

```
"aRray[$Elem].getID"
```

の、変数 $Elemは展開されますので、例えば

"aRray[0].getID"

と、なりますね。"aRray[0].getID"に"aRray[0].getID"に対応するIDを代入しておいて、必要なときに「aRray[0].getID」と書けば、値を取り出せます。valueに関しても同様のロジックです。

{{% tips-list tips %}}
ポイント
: 関数内でのみ使う変数は`local`をつける
: 関数パラメータ $1,$2などといった変数は、関数冒頭できちんと命名規則に則った変数に代入して見渡しの良いソースを書くことを心がける
: `echo $RANDOM`といったよく使われる動的変数は、valueといった値にきちんと格納して使う
: インクリメントは (( ID++ )); 値を取り出して使う場合は、 $(( ID++ )); 
: `eval`コマンドを使って２次元配列を擬似的に実装することは可能
{{% /tips-list %}}


残念なことが一つ。

実はこれ、配列に見せているだけで、配列として動いてはいないのです。あくまで、getID/getValueという呼び出しによって、適宜取り出しやすくなるというメリットです。

とはいえ、配列（っぽい）変数にsetID/setValueできたりgetID/getValueできたり、はてには、２次元、３次元で要素を格納できたりできることは悲願です。

## display()出力関数の実装

ソースの冒頭に declare -i で数値を扱う変数として定義しています。bashでは変数定義は省略できますが、きちんと書いておくことにマイナス要素はありません。きちんと書きましょう。

```bash:01Eval_Array.sh
#
# グローバル変数
declare -i nElems=0;
##
# <>display()  
# 配列を表示
function display(){
  for((i=0;i<nElems;i++)){
    echo -n "aRray[$i]  \
    ID: " $( aRray[$i].getID ) " \
    Value:" $( aRray[$i].getValue ) ; 
    echo "";
  }
}
```

さて、`function desplay()`ですが、forの書き方がC/Java風ですね。

中括弧｛｝で関数内容を囲むことができます。
小括弧（）で条件式を囲むことができます。
小括弧の２重化で(())、条件式の変数前の＄が不要となります。
当然、do/doneは不要です。

`echo -n`は、行末の改行がないことを示します。よって次の行が続けて出力されます。
`echo ""`は、空行の挿入です。

```bash
    ID: " $( aRray[$i].getID ) " \
    Value:" $( aRray[$i].getValue ) ; 
```

ここは、文字列のなかで値をはめ込みたいから $(....)で囲んでいます。値だけを出力したい場合は、以下を実行すれば値だけが出力されます。

```
  aRray[$i].getID;
  aRray[$i].getValue;
```

{{% tips-list tips %}}
ポイント
: 関数内でのみ使う変数は`local`をつける
: 関数パラメータ $1,$2などといった変数は、関数冒頭できちんと命名規則に則った変数に代入して見渡しの良いソースを書くことを心がける
: `echo $RANDOM`といったよく使われる動的変数は、valueといった値にきちんと格納して使う
: インクリメントは (( ID++ )); 値を取り出して使う場合は、 $(( ID++ )); 
: `eval`コマンドを使って２次元配列を擬似的に実装することは可能
: グローバルスコープでの変数定義は declare -i で数値、declare -a で配列
{{% /tips-list %}}



## 実行結果

実行結果は以下のとおりです。

```
bash-5.1$ bash 01Eval_Array.sh
aRray[0]      ID:  100      Value: 31091
aRray[1]      ID:  101      Value: 8361
aRray[2]      ID:  102      Value: 21900
aRray[3]      ID:  103      Value: 7788
aRray[4]      ID:  104      Value: 26435
aRray[5]      ID:  105      Value: 18735
aRray[6]      ID:  106      Value: 19322
aRray[7]      ID:  107      Value: 7051
aRray[8]      ID:  108      Value: 2967
aRray[9]      ID:  109      Value: 30591

real	0m0.037s
user	0m0.016s
sys	0m0.020s
bash-5.1$
```

この章のソース全文は以下のとおりです。

```bash:01Eval_Array.sh
#######################################
# 01Array.shを、少しだけオブジェクティブに
# aRray[0].getValue() で値を取得できるように改変した
# 配列にIDと値を入れるだけのbashスクリプト
#######################################
#
# グローバル変数
declare -i nElems=0;
##
# <>display()  
# 配列を表示
function display(){
  for((i=0;i<nElems;i++)){
    echo -n "aRray[$i]  \
    ID: " $( aRray[$i].getID ) " \
    Value:" $( aRray[$i].getValue ) ; 
    echo "";
  }
}
##
# <>setValue() 
# セッター
function setValue() {
  #今後挿入や置き換えに備えてnElemsとは別の変数を用意しておく
  local Elem="$1";      
  local value="$2";
	eval "aRray[$Elem].getValue()      { echo "$value"; }"
}
##
# <>setID()
# セッター
function setID(){
  #今後挿入や置き換えに備えてnElemsとは別の変数を用意しておく
  local Elem="$1";      
  local ID="$2";
	eval "aRray[$Elem].getID()         { echo "$ID"; }"
}
##
# <> insert
# 配列の要素に値を代入
function insert(){
  local ID=$1;          #100からの連番
  local value=$2;       #配列に代入される要素の値
  setID     "$nElems"    "$ID";      #IDをセット
  setValue  "$nElems"    "$value";   #Valueをセット
  ((nElems++));
}
##
# <> set Array
# 配列を作成
function setArray(){
  local N=$1;           #すべての要素数
  local ID=100;         #100からの連番
  local value;          #配列に代入される要素の値
  for((i=0;i<N;i++)){
    value=$( echo $RANDOM );
    insert $((ID++)) $value;
  }
}
##
# <>execArray()
# メインルーチン
function execArray(){
  local N=$1;           #要素数
  setArray $N           #配列にセット
  display;              #表示
}
##
# 実行
#
time execArray 10;
exit;
```

{{% tips-list tips %}}
ヒント
: Bash/シェルスクリプトによる、擬似的な２次元配列の実現が叶いました。つぎからはバブルソートの実装に入りたいと負いもいます。お楽しみに！
{{% /tips-list %}}





## 「ざっくり」シリーズのご紹介
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

url="https://www.amazon.co.jp/gp/proteect/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/proteect/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/proteect/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/proteect/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens-22&linkId=f514a6378c1c10e59ab16275745c2439"

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




