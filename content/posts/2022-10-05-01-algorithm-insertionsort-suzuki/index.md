---
title: "【アルゴリズム 挿入ソート】ざっくりわかるシェルスクリプト１２"
date: 2022-10-05T16:36:32+09:00
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

## 挿入ソート

挿入ソートとは、未整列の要素を一つずつつまみ上げて、整列済みの列の適切な位置に挿入していくアルゴリズムです。
挿入ソートは、選択ソートと異なり、整列したいデータ列以外の一時記憶領域を用意しなくて良いという特徴があります。
対象データ列が短い場合などに効果的に利用されます。
人間に並べ替えを行わせるとまっさきに思いつく方法として親しまれていたりもします。

がんばれ挿入ソート！

![挿入ソート](Insertion_sort1.gif)


## プログラムソース
この章で使っているプログラムソースは以下にあります。
[02_3InsertionSort.sh 一般的な配列の挿入ソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)
[02_3Eval_InsertionSort.sh 擬似的な２次元配列で実装した挿入ソート](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash)


## 挿入ソートの処理手順

１．配列の先頭から小さい順に並べる。
２．先頭から2つの値を比較して小さい方を１番目に、大きい方を２番目に置く。
３．３番目の値を取り出し、１番め、２番目と順に比較し、適切な位置（左から小さい順に並ぶよう）に挿入する。
４．４番目以降も同様に、n番目の値を取り出して先頭からn-1番目まで順番に比較し、適切な位置に挿入します。
５．上記の操作を末尾の値まで繰り返すことで、先頭が最も小さく末尾が最も大きい数値の列が得られる。

n番目の値を挿入する際、
- ｎ番目の値が整列済みの列の中で最も小さければ、先頭の値との1回の比較で挿入位置が決定できます。

ところが、

- ｎ番目の値が整列済みの列の中で最も大きければ、整列済みの値の数（n-1回）だけ比較を繰り返さなければなりません（ここが挿入ソートの最大の弱点）

がんばれ挿入ソート！

![挿入ソート２](Insertion_sort2.gif)


## 挿入ソートのアルゴリズム

配列の要素が整列済みに近い状態ならば高速に整列を完了できる（最良計算時間はO(N)）
逆順に並んでいる場合はとてつもない回数の比較が必要（最悪計算時間はO(N^2)）となってしまう。
この欠点をある程度緩和したアルゴリズムとしてシェルソート（Shell sort）がある。

選択ソートのように一時的な要素の値を保管する領域を確保する必要はないことが挿入ソートのメリット。
選択ソートはヒープソートを学ぶための一里塚と言われているが、同様に挿入ソートは、シェルソートを学ぶための一里塚との位置づけとも言われている。


Bash/シェルスクリプトで実装した一般的な配列で実装した挿入ソート。
```bash
##
# <>insertionSort()
# 挿入ソート
function insertionSort(){
  for((out=1;out<nElems;out++)){
    local tmp=$((array[out]));
    for((in=out;in>0 && array[in-1]>tmp;in--)){
      array[in]=$((array[in-1]));
    }
    array[in]=$tmp;
  }
}
```

## bash/シェルスクリプトによる疑似２次元配列の実装
```bash:02_3Eval_InsertionSort.sh
#######################################
# 少しだけオブジェクティブに
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
## <>insertionSort()
# 挿入ソート
# URL:https://www.youtube.com/watch?v=DFG-XuyPYUQ
function insertionSort(){
  local tmp_id;
  local tmp_value;
  local in;
  for((out=1;out<nElems;out++)){
    tmp_id=$(aRray[$out].getID);
    tmp_value=$(aRray[$out].getValue);
    in=$out;
    while (( in>0 )) && (( $(aRray[$((in-1))].getValue)>tmp_value ));do
      setID     "$in"    $(aRray[$((in-1))].getID);      #IDをセット
      setValue  "$in"    $(aRray[$((in-1))].getValue);   #Valueをセット
      in=$((in-1));
    done 
    setID     "$in"    $tmp_id;      #IDをセット
    setValue  "$in"    $tmp_value;   #Valueをセット
  } 
}
# <>execSort()
# メインルーチン
function execSort(){
  local N=$1;
  setArray $N;    #配列をセット
  echo "修正前"
  display;
  #bubbleSort;     #バブルソート
  #selectionSort;  #選択ソート
  insertionSort;
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
bash-5.1$ bash 02_3Eval_InsertionSort.sh
修正前
aRray[0]      ID:  100      Value: 16343
aRray[1]      ID:  101      Value: 11323
aRray[2]      ID:  102      Value: 1381
aRray[3]      ID:  103      Value: 15343
aRray[4]      ID:  104      Value: 28067
aRray[5]      ID:  105      Value: 27342
aRray[6]      ID:  106      Value: 32195
aRray[7]      ID:  107      Value: 15563
aRray[8]      ID:  108      Value: 24240
aRray[9]      ID:  109      Value: 28649
修正後
aRray[0]      ID:  102      Value: 1381
aRray[1]      ID:  101      Value: 11323
aRray[2]      ID:  103      Value: 15343
aRray[3]      ID:  107      Value: 15563
aRray[4]      ID:  100      Value: 16343
aRray[5]      ID:  108      Value: 24240
aRray[6]      ID:  105      Value: 27342
aRray[7]      ID:  104      Value: 28067
aRray[8]      ID:  109      Value: 28649
aRray[9]      ID:  106      Value: 32195

real	0m0.145s
user	0m0.062s
sys	0m0.082s
bash-5.1$
```
Valueの値がソートされているのが見てわかると思います。



## 処理コスト

挿入ソートの処理コストはバブルソートや選択ソートに負けず劣らず非常に高いわけですが、まずはバブルソート、選択ソートに続き、遅さＮｏ．２を争う挿入ソートの実装ができたわけです。次回からは、さらにもう少しだけ効率的なソート手法の紹介をします。

処理コストを可視化（いずれ何がどうなのかはわかります）
![挿入ソート３](Insertion_sort3.gif)




## 「ざっくり」シリーズのご紹介
【アルゴリズム 挿入ソート】ざっくりわかるシェルスクリプト１２
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-insertionsort-suzuki/
【アルゴリズム 選択ソート】ざっくりわかるシェルスクリプト１１
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-selectionsort-suzuki/
【アルゴリズム バブルソート】ざっくりわかるシェルスクリプト１０
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-bubblesort-suzuki/
【アルゴリズム ビッグオー】ざっくりわかるシェルスクリプト９
https://suzukiiichiro.github.io/posts/2022-10-04-01-algorithm-bigO-suzuki/
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




