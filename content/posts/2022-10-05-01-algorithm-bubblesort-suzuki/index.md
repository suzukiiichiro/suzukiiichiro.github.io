---
title: "【アルゴリズム バブルソート】ざっくりわかるシェルスクリプト１０"
date: 2022-10-05T11:06:56+09:00
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

## バブルソート

バブルソートは単純選択方法と同様、実現は簡単です。
しかし、比較回数と交換回数は最悪の場合、O(N^2)です。
ソート中に選ばれた最大値が水の中の泡のように水面に向かって浮かび上がっていく過程から、バブルソートと呼ばれています。
データの交換を中心に行っているため、単純交換法とも言われています。

バブルソートのイメージは以下の図を見てもらえればと思います。
![バブルソート](Sorting_bubblesort_anim.gif)


## プログラムソース
この章で使っているプログラムソースは以下にあります。
[02_1BubbleSort.sh 一般的な配列のバブルソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)
[02_1Eval_BubbleSort.sh 擬似的な２次元配列で実装したバブルソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)


## バブルソートの処理手順

データは１次元配列に格納されていると仮定します。
図の赤枠で囲まれた左右の要素を比較して、
大きな要素を右に小さな要素を左に配置します。
移動した段階で左に小さな要素、右に大きな要素がある場合は、要素の交換が不要なので、赤枠は一つ場所を右に移動します。
右端まで移動しきった場合、一番右の要素には配列の中で最も大きな値を持つ要素が配置されています。
しかし、それ以外の要素はまだ並べ替えが完了していないので、交換の場所を一番左に移動し、並べ替えが完了した一番右端の一つ手前まで、上記の処理を繰り返します。

![バブルソート２](Bubble-sort-example-300px.gif)


## ２つのループ

バブルソートは２つのforループで構成されます。
外側のforループは、一番右端に最大の値を持つ要素を配置すると、次からはその一つ手前まで、さらにその次は、その一つ手前までといった具合に、配列全体の移動範囲を狭めていきます。
外側のforループではこうした理由からデクリメントされているわけです。
内側のforループは左右の要素の交換処理を行います。
配列の要素（自分自身）と、その要素の一つ右の要素を比較し、配列の要素（自分自身）が、一つ右の要素よりも値が大きければ、自分自身と右側の要素を交換し、右側の要素の値が大きくなるようにした上で、交換場所を一つ右に移動します。

```bash
##
# <>bubbleSort()
# バブルソートの１次元配列版
function bubbleSort(){
  for((i=nElems;i>0;i--));do
    for((j=0;j<i-1;j++));do
      # 自分自身と右側の要素を比較
      if (( array[j] > array[j+1] ));then
        # 交換
        tmp=${array[j]};
        array[j]=${array[j+1]};
        array[j+1]=$tmp;
        # 交換
      fi
    done
  done  
}
```

## bash/シェルスクリプトによる疑似２次元配列の実装

```bash:02_1Eval_BubbleSort.sh
#######################################
# 02_1BubbleSort.shを、少しだけオブジェクティブに
# aRray[0].getValue() で値を取得できるように改変した
# 配列にIDと値を入れるだけのbashスクリプト
#######################################
##
# グローバル変数
declare -i nElems=0;
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
##
# <>bubbleSort() 
# バブルソート
# URL:https://www.youtube.com/watch?v=xli_FI7CuzA
function bubbleSort(){
  local tmp_id;
  local tmp_value;
  for((i=nElems;i>0;i--)){
    for((j=0;j<i-1;j++)){
      if(($(aRray[$j].getValue)>$(aRray[$((j+1))].getValue)));then
        # 交換
        tmp_id=$(aRray[$j].getID);
        tmp_value=$(aRray[$j].getValue);
        setID     "$j"    $(aRray[$((j+1))].getID);      #IDをセット
        setValue  "$j"    $(aRray[$((j+1))].getValue);   #Valueをセット
        setID     $((j+1))    $tmp_id;      #IDをセット
        setValue  $((j+1))    $tmp_value;   #Valueをセット
        # 交換
      fi 
    } 
  }  
}
##
# <>execSort()
# メインルーチン
function execSort(){
  local N=$1;
  setArray $N;    #配列をセット
  echo "修正前"
  display;
  bubbleSort;     # バブルソート
  echo "修正後"
  display;
}
##
# 実行
time execSort 10;
exit;
```

## 実行結果

```
bash-5.1$ bash 02_1Eval_BubbleSort.sh
修正前
aRray[0]      ID:  100      Value: 14256
aRray[1]      ID:  101      Value: 2502
aRray[2]      ID:  102      Value: 11843
aRray[3]      ID:  103      Value: 21197
aRray[4]      ID:  104      Value: 30372
aRray[5]      ID:  105      Value: 10460
aRray[6]      ID:  106      Value: 440
aRray[7]      ID:  107      Value: 6641
aRray[8]      ID:  108      Value: 12185
aRray[9]      ID:  109      Value: 8073
修正後
aRray[0]      ID:  106      Value: 440
aRray[1]      ID:  101      Value: 2502
aRray[2]      ID:  107      Value: 6641
aRray[3]      ID:  109      Value: 8073
aRray[4]      ID:  105      Value: 10460
aRray[5]      ID:  102      Value: 11843
aRray[6]      ID:  108      Value: 12185
aRray[7]      ID:  100      Value: 14256
aRray[8]      ID:  103      Value: 21197
aRray[9]      ID:  104      Value: 30372

real    0m0.289s
user    0m0.125s
sys    0m0.162s
bash-5.1$
```
Valueの値がソートされているのが見てわかると思います。

## 処理コスト

バブルソートの処理コストは非常に高いわけですが、まずは一番最初のバブルソートの実装ができたわけです。次回からは、もう少しだけ効率的なソート手法の紹介をします。

処理コストを可視化（いずれ何がどうなのかはわかります）
![バブルソート３](Bubble_sort_animation.gif)


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




