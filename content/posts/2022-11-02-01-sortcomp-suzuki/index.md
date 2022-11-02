---
title: "【アルゴリズム ソート比較】ざっくりわかるシェルスクリプト２０"
date: 2022-11-02T10:37:46+09:00
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

## ソート
これまで、バブルソート、選択ソート、挿入ソート、マージソート、シェルソート、クイックソートを学習してきました。

【バブルソート】
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-bubblesort-suzuki/
【選択ソート】
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-selectionsort-suzuki/
【挿入ソート】
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-insertionsort-suzuki/
【マージソート】
https://suzukiiichiro.github.io/2022-10-19-01-mergesort-suzuki/
【シェルソート】
https://suzukiiichiro.github.io/2022-10-27-01-shellsort-suzuki/
【クイックソート】
https://suzukiiichiro.github.io/2022-11-01-01-quicksort-suzuki/

## ソートの速度比較
![ソートまとめ](main-qimg-58dc29bc4966efe3ac20c6ae66088a12.gif)

## ソートのざっくりまとめ
### バブルソート
![バブルソート](BubbleSort_Avg_case.gif)

バブルソートは遅いソートの代名詞のように言われ、最も単純なアルゴリズムです。

棒が10本の場合
最初のパスでは9回の比較を行い、次のパスでは8回,..., そして最後のパスでは比較を1回行います。
そこで, 10項目の場合の比較回数は:

9+8+7+6+5+4+3+2+1 = 45

となります。
これを一般化すると、配列中の項目数がNとすると、 最初のパスではN1回の比較、次はN-2回,... の比較を行います。
このような数列の和を表す公式は:

(N-1)+(N-2)+(N-3)+・・・・＝N＊（N−1）/２
Nが１０のときの N＊(N−1)/２ は４５です。
そこで、バブルソートは約 N^2/2 回の比較を行います。
と、言います（−１は無視します）

入れ替えは、比較の回数よりも少なく N^2/4 となります。

バブルソートの効率
比較       N^2/2
入れ替え   N^2/4
ビッグオー O(N^2)

ビッグオーでは、分母の２や４も無視します。

バブルソートのビッグオー（効率）は
`O(N^2)`となります。 Nの２乗ということです。


### 選択ソート
![選択ソート](1_2a0cRzZpoN7e7vS0sE8_rw.gif)

選択ソート (selection sort) は、入れ替え回数が`O(N^2)`ではなく`O(N)`になるためバブルソートよりは良好です。
ただし、残念ながら比較回数はやはり`O(N^2)`です。
そのため、バブルソート同様、効率は`O(N^2)`となります。

選択ソートの効率
比較       N^2
入れ替え   N
ビッグオー O(N^2)


### 挿入ソート
![挿入ソート](1_JP-wURjwf4k23U2G3GNQDw.gif)
多くの場合に、初歩的なソートの中では挿入ソートが最良です。
実行時間 はやはり`O(N^2)`ですが、バブルソートの約2倍速く、またふつうの状況では選択ソートよ りもいくらか高速です。
ただし、バブルソートや選択ソートよりもやや込み入っています
が、それほど複雑なアルゴリズムではありません。
クイックソートのようなより高度なソートの最終段階で、挿入ソートがよく利用されます。

挿入ソートの効率は、比較は1回です。
二度目のパスでは、比較は最大で2回です···。
そして最後のパスでこのアルゴリズムは、何回の比較とコピーを必要とするのでしょうか? 
最初のパスでは比較は最大でN-1回です。
そこで、最大比較回数の計は:

1+2+3+....+ (N-1)=N＊N(-1)/2


しかし各回の平均比較回数は、最大回数の半分ですから、上を2で割って:

N(N-1)/4


コピーの回数も比較の回数とほぼ同じです。
ただし、コピーは入れ替えに比べるとそれほど時間を要しませんから、ランダムなデータに対してこのアルゴリズムはバブルソートの2倍速く、選択ソートよりも速いといえます。
いずれにしても、この章のそのほかのソートルーチンと同じく、挿入ソートのランダムなデータに対する実行時間は `O(N^2)` です。

データがすでにソートされていたり、ほとんどソートされているときには、挿入ソートの性能はぐっと良くなります。

データが最初から正順なら、`selectionSort()` の whileループの条件が真になることはなく、したがってそれは外側ループの中の1つの単純な文となり、 N-1回 実行されます。
その場合はアルゴリズムは `O(N)` の時間で動きます。

データがほとんどソートされているときは、挿入ソートはほとんど `O(N)` の時間で動きますから、わずかな乱れしかないファイルを整列する方法としては単純かつ効率的です。

しかし、逆順にソートされているデータに対しては、最大の比較回数と移動回数が実行されてしまい、したがって挿入ソートはバブルソートと同じ遅さになってしまいます。

挿入ソートの効率
比較       N^2
入れ替え   N^2
ビッグオー O(N^2)

※データがわずかな乱れしかない場合は `O(N)`


### マージソート
![マージソート](MergeSort_Avg_case.gif)

マージソートは、これまでのソートの中で、少なくともスピードの点ではずっと効率的です。
バブルソート、挿入ソート、そして選択ソートが `O(N^2)` の時間を要するのに対し、マージソ ートは `O(N＊log(N))` です。

しかもマージソートは、実装もかなり容易です。
そのアルゴリズムは、クイックソートやシェルソートよりも分かりやすいです。

マージソートの欠点は、ソートする配列と同サイズの配列をもうひとつ必要とすることです。
元の配列がかろうじてメモリに収まるという大きさだったら、マージソートは使えません。
しかしメモリに余裕があるときには、マージソートは良い選択です。

マージソートの効率

マージソートの実行時間は `O(N＊log(N))` です。

マージソートの効率
比較       N-1
入れ替え   N＊log(N)
ビッグオー O(N＊log(N))

### シェルソート
![シェルソート](v2-6f0759fd4bd0366508a6ed4020f8ba79_b.gif)
シェルソートの「シェル」は、1959年にこのソート方法を発明したDonald L.Shell の名前です。
挿入ソートの改良版とはいえ、その独特のアイデアのお蔭で、挿入ソートに比べると格段に高速です。
シェルソートは、その実装にもよりますが、項目数が数千程度の中規模な配列をソー トするのに適しています。
クイックソートのような `O(N＊log(N)` のソートほど 速くはありませんから、非常に大きなファイルを扱うのには向いていません。
でも、選択ソートや挿入ソートのような `O(N^2)` のソートに比べるとずっと速く、実装もきわめて容易、そしてプログラムのコードは短くて単純です。

シェルソートの一般的なケースの実行効率を理論的に分析した人は、これまで一人もいません。
しかし実験に基づいて、いろんな推測値は出されています。



### クイックソート
![クイックソート](1_3lEL82yCH_-iaq46dji91w.gif)
クイックソートは、 1962年にC.A.R. Hoareが発明しました。
クイックソートは誰もが人気ナンバーワンと認めるソートアルゴリズムです。
それには 理由があります。
クイックソートは多くの場合に最も高速であり、`O(N＊log(N))` の時間で動作します。
ただしこれはあくまでも、オンメモリのソートの場合です。
ディスクファイ の上にあるデータ(しかもメモリに一度に収まりきれないほどの大量のデータ)をソートする場合には、別の方法を使う必要があります。

前に、クイックソートは `O(N＊log(N))` の時間で実行される、といいました。
さらに、マー ジソートを勉強したとき、このような対数型の実行時間は、分割統治型のアルゴリズムの共通的な特徴だといいました。
再帰メソッドが項目の範囲を次々と二分しながら、それら小部分に対して自分自身を呼び出していくというマージソートやクイックソートのようなアルゴリズムは、分割統治型アルゴリズムの典型です。この場合、 対数の基数は2ですから、実行時間は `O(N＊log(N))`に比例すると言えます。

単純なクイックソートでは、ソート済みや、逆順状態のデータに対しては、`O(N^2)` へと退化します。
「３つのメジアン法」による改良で、ソート済みデータの場合の `O(N^2)` の退化を防ぐことができます。

「３つのメジアン」による分割アルゴリズムの内側のwhileループで配列の終端をテストする必要がなくなります。

クイックソートの部分配列のソートには、「挿入ソート」が使われます。

それでは、これまで学習したすべてのソートを一枚のプログラムソースにまとめた完全版をいかに示します。



## プログラムソース

この章で使っているプログラムソースは以下にあります。
[06SortAlgorithm.sh ソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash/)


``` bash:06SortAlgorithm.sh
#!/bin/bash

##########################################
# Bash(シェルスクリプト)で学ぶ
# アルゴリズムとデータ構造  
#          一般社団法人共同通信社情報技術局
#   鈴木維一郎(suzuki.iichiro@kyodonews.jp)
#
#
# ステップバイステップでアルゴリズムを学ぶ
# 
# 目次
#   ソートアルゴリズム
#   バブルソート
#   選択ソート
#   挿入ソート
#   マージソート
#   シェルソート
#   クイックソート
#
##########################################
##
# display()
# 共通部分
function display(){
  for((i=0;i<nElems;i++)){
    echo "$i" "${array[i]}";
  }
  echo "-----";
}
##
# insert()
# 配列を作成
function insert(){
  array[nElems++]="$1";
}
##
# setArray()
# 配列をセット
function setArray(){
  nElems=0;
  for((i=0;i<$1;i++)){
    insert $(echo "$RANDOM");
  }
}
#
#############################################
# 1. バブルソート 13404mm
# https://ja.wikipedia.org/wiki/バブルソート
# https://www.youtube.com/watch?v=8Kp-8OGwphY
#   平均計算時間が O(N^2)
#   安定ソート
#   比較回数は「  n(n-1)/2  」
#   交換回数は「  n^2/2  」
#   派生系としてシェーカーソートやコムソート
##
function bubbleSort(){
  local i j t;# t:temp
  for((i=nElems;i>0;i--)){
    for((j=0;j<i-1;j++)){
      ((array[j]>array[j+1]))&&{
        t="${array[j]}";
        array[j]="${array[j+1]}";
        array[j+1]="$t";
      }
    }
  }
}
#
##########################################
# 選択ソート 3294mm
# https://ja.wikipedia.org/wiki/選択ソート
# https://www.youtube.com/watch?v=f8hXR_Hvybo
#   平均計算時間が O(N^2)
#   安定ソートではない
#   比較回数は「  n(n-1)/2  」
#   交換回数は「  n-1  」
##
# selectionSort()
# 選択ソート
function selectionSort(){
  local i j t m;# t:temp m:min
  for((i=0;i<nElems;i++)){
    m="$i";
    for((j=i+1;j<nElems;j++)){
      ((array[m]>array[j]))&& m="$j";
    }
    ((m==i))&& continue;
    t="${array[m]}";
    array[m]="${array[i]}";
    array[i]="$t";
  }
}
#
##########################################
# 挿入ソート 3511mm
# https://ja.wikipedia.org/wiki/挿入ソート
# https://www.youtube.com/watch?v=DFG-XuyPYUQ
#   平均計算時間が O(N^2)
#   安定ソート
#   比較回数は「  n(n-1)/2以下  」
#   交換回数は「  約n^2/2以下  」
## 
# insertionSort()
# 挿入ソート
function insertionSort(){
  local o i t;# o:out i:in t:temp
  for((o=1;o<nElems;o++)){
    t="${array[o]}";
    for((i=o;i>0&&array[i-1]>t;i--)){
      array[i]="${array[i-1]}";
    }
    array[i]="$t";
  }
}
#
#############################################
# マージソート 1085mm
# https://ja.wikipedia.org/wiki/マージソート
# https://www.youtube.com/watch?v=EeQ8pwjQxTM
#   平均計算時間が O(N(Log N))
#   安定ソート
#   50以下は挿入ソート、5万以下はマージソート、
#   あとはクイックソートがおすすめ。
#   バブルソート、挿入ソート、選択ソートがO(N^2)の
#   時間を要するのに対し、マージ
#   ソートはO(N*logN)です。
#   例えば、N(ソートする項目の数）が10,000ですと、
#   N^2は100,000,000ですが、
#   n*logNは40,000です。
#   別の言い方をすると、マージソートで４０秒を
#   要するソートは、挿入ソートでは約２８時間かかります。
#   マージソートの欠点は、ソートする配列と同サイズ
#   の配列をもう一つ必要とする事です。
#   元の配列がかろうじてメモリに治まるという大きさ
#   だったら、マージソートは使えません。
##
# mergeSortLogic()
# 
function mergeSortLogic(){
  local f=$1 m=$2 l=$3;# f:first m:mid l:last w:workArray
  local n i j n1;
  ((n=l-f+1));
  for((i=f,j=0;i<=l;)){
    w[j++]="${array[i++]}";
  }
  ((m>l))&&((m=(f+l)/2));
  ((n1=m-f+1));
  for((i=f,j=0,k=n1;i<=l;i++)){
    {
      ((j<n1))&&{
        ((k==n))||{ 
          ((${w[j]}<${w[k]}))
        }
      }
    }&&{ 
      array[i]="${w[j++]}";
    }||{
      array[i]="${w[k++]}";
    }
  }
}
##
# mergeSort()
# マージソート
function mergeSort(){
    local f="$1" l="$2" m=;# f:first l:last m:mid
    ((l>f))||return 0;
    m=$(((f+l)/2));
    mergeSort "$f" "$m";
    mergeSort "$((m+1))" "$l"
    mergeSortLogic "$f" "$m" "$l";
}
#
###############################################
# シェルソート 1052mm
# https://ja.wikipedia.org/wiki/シェルソート
# https://www.youtube.com/watch?v=M9YCh-ZeC7Y
#   平均計算時間が O(N((log N)/(log log N))^2)
#   安定ソートではない
#   挿入ソート改造版
#   ３倍して１を足すという処理を要素を越えるまで行う
##
# shellSort()
# シェルソート
function shellSort(){
  local s=1 in t;#s:shell in:inner t:temp
  while((s<nElems/3));do
      s=$((s*3+1));
  done
  while((s>0));do
    for((i=s;i<nElems;i++)){
      t="${array[i]}";
      in="$i";
      while((in>s-1&&array[in-s]>=t));do
        array[in]="${array[in-s]}";
        in=$((in-s));
      done
      array[in]="$t";
    }
    s=$(((s-1)/3));
  done
}
#
###############################################
# クイックソート 1131mm
# https://ja.wikipedia.org/wiki/クイックソート
# https://www.youtube.com/watch?v=aQiWF4E8flQ
#   平均計算時間が O(n Log n)
#   安定ソートではない
#   最大計算時間が O(n^2)
# データ数が 50 以下なら挿入ソート (Insertion Sort)
# データ数が 5 万以下ならマージソート (Merge Sort)
# データ数がそれより多いならクイックソート (Quick Sort)
##
# quickSort()
# クイックソート
function quickSort(){
  local -i l r m p t i j k;#r:right l:left m:middle p:part t:temp 
  ((l=i=$1,r=j=$2,m=(l+r)/2));
  p="${array[m]}";
  while((j>i));do
    while [[ 1 ]];do
      ((array[i]<p))&&((i++))||break;
    done
    while [[ 1 ]];do
      ((array[j]>p))&&((j--))||break;
    done
    ((i<=j))&&{
      t="${array[i]}";
      array[i]="${array[j]}";
      array[j]="$t";
      ((i++,j--));
    }
  done
  ((l<j)) && quickSort $l $j;
  ((r>i)) && quickSort $i $r;
}
##
# 実行メソッド
##
function SortCase(){
  setArray $1;
#  display;
  case "$2" in
    bubbleSort) 
      bubbleSort;;
    selectionSort) 
      selectionSort;;
    insertionSort) 
      insertionSort;;
    mergeSort) 
      mergeSort 0 $((nElems-1));;
    shellSort) 
      shellSort;;
    quickSort) 
      quickSort 0 $((nElems-1));;
  esac
#  display;
}
##
# ソート各種
# 必要であればコメントアウトなどしてください。
function Sort(){
  echo -n "bubbleSort";
  time SortCase 1000 "bubbleSort";
  echo "";
  echo -n "selectionSort";
  time SortCase 1000 "selectionSort";
  echo "";
  echo -n "insertionSort";
  time SortCase 1000 "insertionSort";
  echo "";
  echo -n "mergeSort";
  time SortCase 1000 "mergeSort";
  echo "";
  echo -n "shellSort";
  time SortCase 1000 "shellSort";
  echo "";
  echo -n "quickSort";
  time SortCase 1000 "quickSort";
  echo "";
}
##
# メイン
Sort;
exit;
```

## 実行結果

```
bash-5.1$ bash 06SortAlgorithm.sh

bubbleSort
real	0m12.639s
user	0m11.889s
sys	0m0.657s

selectionSort
real	0m8.200s
user	0m7.484s
sys	0m0.664s

insertionSort
real	0m5.286s
user	0m4.604s
sys	0m0.657s

mergeSort
real	0m1.644s
user	0m1.025s
sys	0m0.618s

shellSort
real	0m1.476s
user	0m0.819s
sys	0m0.655s

quickSort
real	0m1.438s
user	0m0.790s
sys	0m0.648s
bash-5.1$
```


## 「ざっくり」シリーズのご紹介
【アルゴリズム ソート比較】ざっくりわかるシェルスクリプト２０
https://suzukiiichiro.github.io/2022-11-02-01-sortcomp-suzuki/
【アルゴリズム クイックソート】ざっくりわかるシェルスクリプト１９
https://suzukiiichiro.github.io/2022-11-01-01-quicksort-suzuki/
【アルゴリズム シェルソート】ざっくりわかるシェルスクリプト１８
https://suzukiiichiro.github.io/2022-10-27-01-shellsort-suzuki/
【アルゴリズム マージソート】ざっくりわかるシェルスクリプト１７
https://suzukiiichiro.github.io/2022-10-19-01-mergesort-suzuki/
【アルゴリズム 連結リスト】ざっくりわかるシェルスクリプト１６
https://suzukiiichiro.github.io/posts/2022-10-18-01-list-suzuki/
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








