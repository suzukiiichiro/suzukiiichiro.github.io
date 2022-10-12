---
title: "【アルゴリズム キュー】ざっくりわかるシェルスクリプト１４"
date: 2022-10-06T13:43:07+09:00
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

## キュー

キューはデータ構造の一つです。
キューは待ち行列とも呼ばれ、その名の通り行列に並ぶ事を考えるとイメージしやすいです。
行列においては、先に並んだ人ほど優先されます。 
キューにデータを追加する場合、データは一番最後に追加されます。
キューにデータを追加する操作をenqueue（エンキュー）と呼びます。
キューからデータを取り出す場合、最も古くに追加されたデータから取り出されます。
キューからデータを取り出す操作をdequeue（デキュー）と呼びます。
このような、先に入れたものを先に出す先入れ先出しの仕組みを
「First In First Out」を略してFIFOと呼びます。

以下の図からもわかるとおり、最初に追加した色の箱から取り出されているのがわかると思います。配列の要素の一番古い要素の添字を指し示すのがpeekです。
配列から要素を取り出すときには、peekを添え字にして取り出すことで、配列全体の中から一番古い要素を取り出すことができます。

![キュー](Queue.gif)


## プログラムソース
この章で使っているプログラムソースは以下にあります。
[03_1Stack.sh 一般的な配列のキュー](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)
[03_2Eval_Stack.sh 擬似的な２次元配列で実装したキュー](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)



## キューの処理ロジック「リア」と「フロント」

処理は複雑ではありません。むしろシンプルです。
rear（リア）と、front（フロント）の動きをもう一度見てください。
リア（最後尾）、フロント（最前面）はどこか。
追加されるときはリア（最後尾）に。
出すときはフロント（最前面）から。

この図がわかりやすいです。
![キュー](enqueue.png)

## Bash/シェルスクリプトの配列で実装したキュー

```bash:03_2Queue.sh
##
# <>queueDisplay()
# 表示
function queueDisplay(){
  for((i=front;i<rear;i++));do
      echo "$i" "${queue[i]}";
  done
  echo "------";
}
##
# <>dequeue()
# デキュー
function dequeue(){
  ((front++));
}
##
# <>enqueue()
# エンキュー
function enqueue(){
  queue[rear++]=$1;
}
##
# <>peek()
# ピーク
function peek(){
  echo "peek :"$front : ${queue[front]};
}
##
# <>execQueue()
# キューの実行
function execQueue(){
  rear=0;   #後ろ端（enqueueされるほう）
  front=0;  #前端（peek/dequeueされるほう)
  enqueue 10;
  enqueue 20;
  enqueue 30;
  enqueue 40;
  echo "データを4つenqueue";
  peek;
  queueDisplay;
  #----
  dequeue;
  dequeue;
  echo "データを2つdequeue";
  peek;
  queueDisplay;
  #----
  enqueue 50;
  echo "データを1つenqueue";
  peek;
  queueDisplay;
  #----
}
##
# メイン
execQueue;
exit;
```


## bash/シェルスクリプトによる疑似２次元配列の実装

```bash:03_2Eval_Queue.sh
#######################################
# 03_2Queue.shを、少しだけオブジェクティブに
# aRray[0].getValue() で値を取得できるように改変した
# 配列にIDと値を入れるだけのbashスクリプト
#######################################
##
# グローバル変数
declare -i nElems=0;
declare -i rear=0;
#
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
# <>queueDisplay()
# 表示
function queueDisplay(){
  for((i=front;i<rear;i++));do
      echo "$i" "$(aRray[$i].getValue)";
  done
  echo "------";
}
##
# <>dequeue()
# デキュー
function dequeue(){
  ((front++));
}
##
# <>enqueue()
# エンキュー
function enqueue(){
  ID=$1;
  value=$2;
  setID     "$rear"    "$ID";      #IDをセット
  setValue  "$rear"    "$value";   #Valueをセット
  ((rear++));
}
##
# <>peek()
# ピーク
function peek(){
  echo "peek :"$front : $(aRray[$front].getValue);
}
##
# <>execQueue()
# キューの実行
function execQueue(){
  rear=0;   #後ろ端（enqueueされるほう）
  front=0;  #前端（peek/dequeueされるほう)
  ID=100;
  enqueue $((ID++)) 10;
  enqueue $((ID++)) 20;
  enqueue $((ID++)) 30;
  enqueue $((ID++)) 40;
  echo "データを4つenqueue";
  peek;
  queueDisplay;
  #----
  dequeue;
  dequeue;
  echo "データを2つdequeue";
  peek;
  queueDisplay;
  #----
  enqueue $((ID++)) 50;
  echo "データを1つenqueue";
  peek;
  queueDisplay;
  #----
}
##
# メイン
execQueue;
exit;
```


## 実行結果

```
bash-5.1$ bash 03_2Eval_Queue.sh
データを4つenqueue
peek :0 : 10
0 10
1 20
2 30
3 40
------
データを2つdequeue
peek :2 : 30
2 30
3 40
------
データを1つenqueue
peek :2 : 30
2 30
3 40
4 50
------
bash-5.1$
```


## 循環キュー

映画館の待ち行列なら、先頭の一人が列を去ったら、列全体が前に進みます。
キューでは削除のたびに全ての項目を前に詰めて移動しますが、その時間が無駄です。
むしろ項目はそのままにしておいて、キューのフロント(前端)やリア（後端）が動いた方が簡単なのです。
しかしその場合の問題は、キューの後端がすぐに配列の終端に達してしまいます。
まだ満杯ではないのに新たなデータを挿入できないというこの問題を解決するために、循環キューでは、frontとrearの矢印は配列の先頭へラップアラウンド（最初に戻る）します。
その結果として循環キューというものができあがります。リングバッファとも呼ばれます。
キューと循環キューの本質的な違いは、キューは循環キューよりも多くのスペースを消費するのに対し、循環キューはキューのメモリ浪費を制限するように考案されたということです。
![キュー](CircularQueues.gif)



## Bash/シェルスクリプトの配列で実装したキュー
```bash:03_3CircularQueue.sh
##
#
function display(){
  for((n=0;n<nElems;n++));do
    echo "$n" "${array[n]}";
  done
  echo "------";
}
##
#
function insert(){
  array[nElems++]="$1";
}
##
#
function setArray(){
  nElems=0;
  for((i=0;i<$1;i++));do
    insert $(echo "$RANDOM");
  done
}
##
#
function CircularQDisplay(){
  for((i=0;i<maxSize;i++));do
      echo "$i" "${queue[i]}";
  done
  echo "------";
}
##
#
function CircularQDequeue(){
  ((front++));
  ((front==maxSize))&&{ front=0; }
}
##
#
function CircularQEnqueue(){
  (( rear==(maxSize-1) ))&&{ rear=-1; }
  queue[++rear]=$1;
}
##
#
function CircularQPeek(){
  echo "peek :front :$front  rear : $rear  peek : $front ${queue[front]} ";
}
##
#
function execCircularQ(){
  rear=-1; #後ろ端（enqueueされるほう）
  front=0; #前端（peek/dequeueされるほう)

  maxSize=5 #キューの項目数

  CircularQEnqueue 10;
  CircularQEnqueue 20;
  CircularQEnqueue 30;
  CircularQEnqueue 40;
  echo "データを4つenqueue";
  CircularQPeek;
  CircularQDisplay;
#exit;
  #----
  CircularQDequeue;
  CircularQDequeue;
  echo "データを2つdequeue";
  CircularQPeek;
  CircularQDisplay;
#exit;
  #----
  CircularQEnqueue 50;
  echo "データを1つenqueue";
  CircularQPeek;
  CircularQDisplay;
#exit;
  #----
  # CircularQ
  CircularQEnqueue 60;
  CircularQEnqueue 70;
  echo "データを2つenqueue";
  CircularQPeek;
  CircularQDisplay;
#exit;
  #---
  CircularQDequeue;
  CircularQDequeue;
  CircularQDequeue;
  echo "データを3つdequeue";
  CircularQPeek;
  CircularQDisplay;
}
##
#
execCircularQ;
exit;
```

## bash/シェルスクリプトによる疑似２次元配列の実装

```bash:03_3Eval_CircularQueue.sh
#######################################
# 03_3CircularQueue.shを、少しだけオブジェクティブに
# aRray[0].getValue() で値を取得できるように改変した
# 配列にIDと値を入れるだけのbashスクリプト
#######################################
##
# グローバル変数
declare -i nElems=0;
declare -i rear=0;
#
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
# <> init Array
# 配列を作成
function initArray(){
  local N=$1;           #すべての要素数
  local ID=100;         #100からの連番
  local value=null;          #配列に代入される要素の値
  for((i=0;i<N;i++)){
    insert $((ID++)) $value;
  }
}
##
function CircularQDisplay(){
  for((i=0;i<maxSize;i++));do
      echo "$i" $(aRray[$i].getValue);
  done
  echo "------";
}
##
#
function CircularQDequeue(){
  ((front++));
  ((front==maxSize))&&{ front=0; }
}
##
#
function CircularQEnqueue(){
  ID=$1;
  value=$2;
  if(( rear==(maxSize-1) ));then 
    rear=-1; 
  fi
  ((rear++));
  setID     "$rear"    "$ID";      #IDをセット
  setValue  "$rear"    "$value";   #Valueをセット
}
##
#
function CircularQPeek(){
  echo "peek :front :$front  rear : $rear  peek : $front $(aRray[$front].getValue) ";
}
##
#
function execCircularQ(){
  rear=-1; #後ろ端（enqueueされるほう）
  front=0; #前端（peek/dequeueされるほう)
  ID=100;

  maxSize=5 #キューの項目数
  initArray $maxSize;

  CircularQEnqueue $((ID++)) 10;
  CircularQEnqueue $((ID++)) 20;
  CircularQEnqueue $((ID++)) 30;
  CircularQEnqueue $((ID++)) 40;
  echo "データを4つenqueue";
  CircularQPeek;
  CircularQDisplay;
  #----
  CircularQDequeue;
  CircularQDequeue;
  echo "データを2つdequeue";
  CircularQPeek;
  CircularQDisplay;
  #----
  CircularQEnqueue $((ID++)) 50;
  echo "データを1つenqueue";
  CircularQPeek;
  CircularQDisplay;
  #----
  # CircularQ
  CircularQEnqueue $((ID++)) 60;
  CircularQEnqueue $((ID++)) 70;
  echo "データを2つenqueue";
  CircularQPeek;
  CircularQDisplay;
  #---
  CircularQDequeue;
  CircularQDequeue;
  CircularQDequeue;
  echo "データを3つdequeue";
  CircularQPeek;
  CircularQDisplay;
}
##
#
# 実行
execCircularQ;
exit;
```

## 実行結果

```
データを4つenqueue
peek :front :0  rear : 3  peek : 0 10 
0 10
1 20
2 30
3 40
4 null
------
データを2つdequeue
peek :front :2  rear : 3  peek : 2 30 
0 10
1 20
2 30
3 40
4 null
------
データを1つenqueue
peek :front :2  rear : 4  peek : 2 30 
0 10
1 20
2 30
3 40
4 50
------
データを2つenqueue
peek :front :2  rear : 1  peek : 2 30 
0 60
1 70
2 30
3 40
4 50
------
データを3つdequeue
peek :front :0  rear : 1  peek : 0 60 
0 60
1 70
2 30
3 40
4 50
------
```


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




