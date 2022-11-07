---
title: "【アルゴリズム 選択ソート】ざっくりわかるシェルスクリプト１１"
date: 2022-10-05T14:49:14+09:00
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

## 選択ソート
選択ソートは、未整列の配列要素の中から最小を選択し、配列先頭の整列済み列の末尾に追加していく並べ替えアルゴリズムです。
バブルソートと処理コストはほぼ同等です。
意図して選択ソートで並べ替えるといったシチュエーションはまるでありません。
木構造のヒープソートを学ぶための一里塚としての位置づけとも言われています。
データ配列の要素数が小さい場合にのみごまかして使うなどの用途しかありません。

がんばれ選択ソート！

![選択ソート](Selection_sort1.gif)


## プログラムソース
この章で使っているプログラムソースは以下にあります。
[02_2SelectionSort.sh 一般的な配列の選択ソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)
[02_2Eval_SelectionSort.sh 擬似的な２次元配列で実装した選択ソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)


## 選択ソートの処理手順

１．配列の先頭から小さい順（昇順）に並べる。
２．先頭から末尾までの間で最も小さい値を見つけ、一時保管場所へ複写する。
３．配列の最後尾まで行き着いたら、一時保管場所へ複写した「最も小さい値」を、「配列中で最も小さい値」とし、配列の先頭の値と交換すし、交換した要素は完了済みとしてマークする。
４．処理の再開は、マークした右隣から始める。
５．最後尾までの間で「最も小さい値」を見つけ、２番目の値と交換し、交換した要素は完了済みとしてマークする。
６．処理の再開は、マークした右隣から始める。
７．以降も同様に、n番目から末尾までで最も小さい値をn番目と入れ替えるという操作を繰り返す。

上記を末尾の一つ前の値まで繰り返せば、先頭が最も小さく末尾が最も大きい数値の列が得られる。

がんばれ選択ソート！

![選択ソート２](Selection_sort2.gif)


## 選択ソートのアルゴリズム

バブルソートによく似たアルゴリズムです。
選択ソートは、最小値を未整列部分の先頭（整列部分の最後尾）に移動させるだけなので、ループにおける値の交換回数が1回です。
とはいえ、最小値を探すために必要な「要素の値を繰り返し比較する回数」は、バブルソートと同じです。
結果、バブルソートよりも交換回数が少しだけ少ないので選択ソートの方が高速です。

Bash/シェルスクリプトで実装した一般的な配列で実装した選択ソート。

```bash
##
# <>selectionSort
# 選択ソート
selectionSort(){
  for((i=0;i<nElems;i++));do
    # 一番小さな値を入れるための保管場所
    min=$i;
    for((j=i+1;j<nElems;j++));do
      if (( array[min] > array[j] ));then
        min=$j;
      fi
    done
    # 交換
    tmp=${array[min]};
    array[min]=${array[i]};
    array[i]=$tmp;
    # 交換
  done
}
```

## bash/シェルスクリプトによる疑似２次元配列の実装

```bash:02_2Eval_SelectionSort.sh
#######################################
# 02_2SelectionSort.shを少しだけオブジェクティブに
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
## <>selectionSort()
# 選択ソート
# URL:https://www.youtube.com/watch?v=g-PGLbMth_g
function selectionSort(){
  local tmp_id;
  local tmp_value;
  for((i=0;i<nElems;i++)){
    min=$i;
    for((j=i+1;j<nElems;j++)){
      if(($(aRray[$min].getValue)>$(aRray[$j].getValue)));then
        min=$j;
      fi
    }
    # 交換
    tmp_id=$(aRray[$min].getID);
    tmp_value=$(aRray[$min].getValue);
    setID     "$min"    $(aRray[$i].getID);      #IDをセット
    setValue  "$min"    $(aRray[$i].getValue);   #Valueをセット
    setID     $i    $tmp_id;      #IDをセット
    setValue  $i    $tmp_value;   #Valueをセット
    # 交換
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
  #bubbleSort;     #バブルソート
  selectionSort;  #選択ソート
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
bash-5.1$ bash 02_2Eval_SelectionSort.sh
修正前
aRray[0]      ID:  100      Value: 26575
aRray[1]      ID:  101      Value: 7756
aRray[2]      ID:  102      Value: 4820
aRray[3]      ID:  103      Value: 27520
aRray[4]      ID:  104      Value: 5972
aRray[5]      ID:  105      Value: 31315
aRray[6]      ID:  106      Value: 11637
aRray[7]      ID:  107      Value: 19155
aRray[8]      ID:  108      Value: 8036
aRray[9]      ID:  109      Value: 20576
修正後
aRray[0]      ID:  102      Value: 4820
aRray[1]      ID:  104      Value: 5972
aRray[2]      ID:  101      Value: 7756
aRray[3]      ID:  108      Value: 8036
aRray[4]      ID:  106      Value: 11637
aRray[5]      ID:  107      Value: 19155
aRray[6]      ID:  109      Value: 20576
aRray[7]      ID:  100      Value: 26575
aRray[8]      ID:  103      Value: 27520
aRray[9]      ID:  105      Value: 31315

real    0m0.219s
user    0m0.091s
sys    0m0.127s
bash-5.1$
```
Valueの値がソートされているのが見てわかると思います。



## 処理コスト

選択ソートの処理コストはバブルソートに負けず劣らず非常に高いわけですが、まずはバブルソートに続き、遅さＮｏ．２の選択ソートの実装ができたわけです。次回からは、さらにもう少しだけ効率的なソート手法の紹介をします。

処理コストを可視化（いずれ何がどうなのかはわかります）
![選択ソート３](Selection_sort3.gif)


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




