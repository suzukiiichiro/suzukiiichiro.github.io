---
title: "Ｎクイーン問題（１９）第五章 キャリーチェーン"
date: 2023-05-23T13:22:23+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - シェルスクリプト
  - Bash
  - アルゴリズム
  - 鈴木維一郎
---

![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

## キャリーチェーン
キャリーチェーンはＮ２７の解を発見したドレスデン大学の研究者が編み出したアルゴリズムです。

Jeffサマーズがミラーとビットマップの組み合わせでＮ２３を発見し、電気通信大学がサマーズのアルゴリズムを並列処理しＮ２４を発見、プロアクティブが対称解除法でＮ２５を発見し、Ｎ２７でキャリーチェーンによりドレスデン大学が世界一となりました。

対称解除法の実行結果を見てみましょう。

```
#  <> 06Bash_symmetry.sh 対象解除法
#  N:        Total       Unique        hh:mm:ss
#  4:            2            1         0:00:00
#  5:           10            2         0:00:00
#  6:            4            1         0:00:00
#  7:           40            6         0:00:00
#  8:           92           12         0:00:00
#  9:          352           46         0:00:00
# 10:          724           92         0:00:02
# 11:         2680          341         0:00:05
# 12:        14200         1787         0:00:26
# 13:        73712         9233         0:02:28
# 14:       365596        45752         0:14:18
# 15:      2279184       285053         1:23:34
```


Ｎ２５で、１時間２３分かかっています。
Bashだからこその遅さです。ＣプログラムではＮ１７までは１秒かかりません。
とはいえ、アルゴリズムやロジックを深く知るためには、プログラムのシンタックスに悩むドデカ級のプログラム言語よりも、身近なBash言語のほうが直感的でよいのです。
ＵＮＩＸを開発したＡＴ＆Ｔベル研究所では、開発者はBashでプロトタイプを作り、その後プログラマがＣに移植します。

新しい開発、革新的なロジックを研究することにBashは多くの現場で活躍してきました。ＣやJavaは、知恵を導入するまえに、構文（シンタックス）の複雑さに気を奪われ、書いた気になる、作った気になる言語と言われています。

では、Ｎ２７を叩き出したドレスデン大学のソースをBashに移植して、高速化、最適化したソースの実行結果を見てみます。

```
#  <> 07Bash_carryChain.sh
#  N:        Total       Unique        hh:mm:ss
#  4:            2            1         0:00:00
#  5:           10            2         0:00:00
#  6:            4            1         0:00:00
#  7:           40            6         0:00:01
#  8:           92           12         0:00:02
#  9:          352           46         0:00:12
# 10:          724           92         0:00:44
# 11:         2680          341         0:02:39
# 12:        14200         1788         0:08:35
# 13:        73712         9237         0:27:05
# 14:       365596        45771         1:30:40
# 15:      2279184       285095         5:59:03
```

おそい。。。。
遅すぎますね。大丈夫なのでしょうか。

実際、とてつもなく遅いのですが、キャリーチェーンとは

１．対称解除とは比較にならないほど遅い
２．対称解除とは比較にならないほどメモリ消費量が小さい
３．対称解除と比べ、Ｎが小さいときに遅いが、Ｎが大きくなるに従って対称解除のスピードに追いつき、Ｎ１７で対称解除を追い抜き安定して実行を継続する。
４．一方で対称解除は、Ｎが小さいときは快調だが、Ｎが大きくなるに従って、board配列を中心にメモリ消費量が爆発的に肥大し、Ｎ１７以降、高い確率でバースト、システムは停止する。

ということで、キャリーチェーンは、遅いけど安定的に処理し続けるアルゴリズムなのです。

さらに、次の章で紹介する並列処理に極めて高い親和性があるアルゴリズムです。

## アルゴリズム
おおまかなアルゴリズムを説明します。
ソースはおおよそ下から積み上げるようにして書きますので、
最初の実行は一番下の「function NQ()」となります。

```bash
: 'ボードレイアウトを出力 ビットマップ対応版';
function printRecordCarryChain()

: 'ボード外側２列を除く内側のクイーン配置処理';
function solve()

: 'solve()を呼び出して再帰を開始する';
function process()

: 'クイーンの効きをチェック';
function placement()

: 'キャリーチェーン対称解除法';
function carryChainSymmetry()

: 'チェーンのビルド';
function buildChain()

: 'チェーンの初期化';
function initChain()

: 'チェーンの構築';
function carryChain()

: 'Nを連続して実行';
function NQ()
```

## ロジック解説
まず、NQ()を実行するとcarryChain()を呼び出します。
carrychain()は、チェーンの初期化を行うinitChain()と、チェーンのビルドを行う buildChain()を実行します。

チェーンの初期化を行う initChain()は以下の２行のクイーンが配置できるすべてをブルートフォースで導き出します。ここではクイーンの効きは考慮しません。
１行目の配置を pres_a配列に、２行目の配列をpres_b配列に保存します。

initChain()
```
+-+-+-+-+-+-+-+
|Q|Q|Q|Q|Q|Q|Q|
+-+-+-+-+-+-+-+
|Q|Q|Q|Q|Q|Q|Q|
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
```

次にbuildChain()は、上２行に配置します。
buildChain()では配置のたびに placement()を呼び出し、クイーンの効きに問題がないかをチェックします。
ざっくりいうと上１行目のクイーンはミラーのロジックにより、Ｎの半分しか配置しません。上２行目はＮすべてを配置候補とします。

buildChain()
```
+-+-+-+-+-+-+-+
| | | | | | |Q|  ←
+-+-+-+-+-+-+-+
| | | | |Q|x|x|  ←
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
| | | | | | | |
+-+-+-+-+-+-+-+
```

上２行に配置できたら、左２列を作成します。
```
 ↓↓
+-+-+-+-+-+-+-+
|x|x| | | | |Q| 
+-+-+-+-+-+-+-+
|x|x|x|x|Q|x|x| 
+-+-+-+-+-+-+-+
|Q|x|x|x|x|x|x|
+-+-+-+-+-+-+-+
|x|x|x|x|x| |x|
+-+-+-+-+-+-+-+
|x|x|x|x|x|x|x|
+-+-+-+-+-+-+-+
|x|Q|x|x|x|x|x|
+-+-+-+-+-+-+-+
|x|x|x|Q|x|x|x|
+-+-+-+-+-+-+-+
```

左２列が完成したら、下２行を作成します。
クイーンの配置の都度、placement()が呼び出され、クイーンの効きをチェックします。

```
+-+-+-+-+-+-+-+
|x|x|x|x|x|x|Q| 
+-+-+-+-+-+-+-+
|x|x| | |Q|x|x|
+-+-+-+-+-+-+-+
|Q|x| |x|x| |x|
+-+-+-+-+-+-+-+
|x|x|x|x|x| |x|
+-+-+-+-+-+-+-+
|x|x|x|x|x|x|x|
+-+-+-+-+-+-+-+
|x|Q|x|x|x|x|x| ←
+-+-+-+-+-+-+-+
|x|x|x|Q|x|x|x| ←
+-+-+-+-+-+-+-+
```

すでに配置されている場合はそれを許可し、配置したことにします。
下２行を作成したら、右２列を作成します。

```
+-+-+-+-+-+-+-+
|x|x|x|x|x|x|Q| 
+-+-+-+-+-+-+-+
|x|x| |x|Q|x|x|
+-+-+-+-+-+-+-+
|Q|x| |x|x|x|x|
+-+-+-+-+-+-+-+
|x|x|x|x|x|Q|x|
+-+-+-+-+-+-+-+
|x|x|x|x|x|x|x|
+-+-+-+-+-+-+-+
|x|Q|x|x|x|x|x|
+-+-+-+-+-+-+-+
|x|x|x|Q|x|x|x|
+-+-+-+-+-+-+-+
           ↑↑
```

配置が終わりました。
配置が終わったら、carryChainSymmetry()を呼び出して、対称解除法を実行します。


これまでのsymmetry.shでは１行目のクイーンが角にあるか、ないかで分岐し、クイーンの配置がすべて完了したら対称解除を行ってきました。ようするに処理の最終局面で対称解除を行ってきたわけです。

ですので、ボード情報をboard配列に入れて９０度回転を繰り返してきました。この処理はbit処理でなかった（僕がどうやってよいか分からなかった）ため、負荷も高くなってしまいました。

盤面のクイーンの配置すべてを格納したboard配列をまるっと９０度回転、さらに９０度回転、さらにさらに９０度回転と繰り返して、COUNT2,COUNT4,COUNT8のユニーク解を導き出していました。

キャリーチェーンは、盤面の外枠２行２列のみにクイーンを配置します。理由は「対称解除は２行２列に配置されていれば可能」だからです。

![](1.png)

まず、２行２列を配置し、対称解除を行い、COUNT2,COUNT4,COUNT8のいずれかである場合にかぎって、内側にクイーンの配置処理に入ります。

![](2.png)

すごいですね！ 新しいです。
最初に対称解除を行うことができるから、最初からbit処理可能です。そして最後までbit処理で完結できます。

これまでやってきた枝刈りのロジックは、ドレスデン大学のソースにはありませんでしたが、追記しておきました。期待大！ですね。

ですが、激しく遅いのです。残念です。

とはいえ世界一となったこのロジックはただものではありません。極めて優れたロジックで、パッと見だめでもじつはイケてるプログラムなのです。





## キャリーチェーン　プログラムソース
キャリーチェーンのプログラムソースは以下のとおりです。
ソースの末尾で、ボードレイアウト表示をするかをフラグで指定してください。

```bash
#DISPLAY=0; # ボードレイアウト表示しない
DISPLAY=1; # ボードレイアウト表示する
```


```bash:07Bash_carryChain.sh
#!/usr/bin/bash

# :'
#  ## bash版
#  <> 07Bash_carryChain.sh
#  N:        Total       Unique        hh:mm:ss
#  4:            2            1         0:00:00
#  5:           10            2         0:00:00
#  6:            4            1         0:00:00
#  7:           40            6         0:00:01
#  8:           92           12         0:00:02
#  9:          352           46         0:00:12
# 10:          724           92         0:00:44
# 11:         2680          341         0:02:39
# 12:        14200         1788         0:08:35
# 13:        73712         9237         0:27:05
# 14:       365596        45771         1:30:40
# 15:      2279184       285095         5:59:03
# 
#  <> 06Bash_symmetry.sh 対象解除
#  N:        Total       Unique        hh:mm:ss
#  4:            2            1         0:00:00
#  5:           10            2         0:00:00
#  6:            4            1         0:00:00
#  7:           40            6         0:00:00
#  8:           92           12         0:00:00
#  9:          352           46         0:00:00
# 10:          724           92         0:00:02
# 11:         2680          341         0:00:05
# 12:        14200         1787         0:00:26
# 13:        73712         9233         0:02:28
# 14:       365596        45752         0:14:18
# 15:      2279184       285053         1:23:34
# ';
# 

declare -i TOTAL=0;
declare -i UNIQUE=0;
declare -a pres_a;        # チェーン
declare -a pres_b;        # チェーン
declare -i COUNTER[3];    # カウンター 0:COUNT2 1:COUNT4 2:COUNT8
: 'B=(row     0:
      left    1:
      down    2:
      right   3:
      X[@]    4: 
      )';
declare -a B; 
declare -i DISPLAY=0;
#
#
: 'ボードレイアウトを出力 ビットマップ対応版';
function printRecordCarryChain()
{
  local -a board=(${B[4]}); # 同じ場所の配置を許す
  ((TOTAL++));
  size="$1";
  flag="$2"; # bitmap版は1 それ以外は 0
  echo "$TOTAL";
  sEcho=" ";  
  : 'ビットマップ版
     ビットマップ版からは、左から数えます
     上下反転左右対称なので、これまでの上から数える手法と
     rowを下にたどって左から数える方法と解の数に変わりはありません。
     0 2 4 1 3 
    +-+-+-+-+-+
    |O| | | | | 0
    +-+-+-+-+-+
    | | |O| | | 2
    +-+-+-+-+-+
    | | | | |O| 4
    +-+-+-+-+-+
    | |O| | | | 1
    +-+-+-+-+-+
    | | | |O| | 3
    +-+-+-+-+-+
  ';
  if ((flag));then
    local -i i=0;
    local -i j=0;
    for ((i=0;i<size;i++));do
      for ((j=0;j<size;j++));do
       if (( board[i]&1<<j ));then
          sEcho="${sEcho}$((j)) ";
       fi 
      done
    done
  else 
  : 'ビットマップ版以外
     (ブルートフォース、バックトラック、配置フラグ)
     上から数えます
     0 2 4 1 3 
    +-+-+-+-+-+
    |O| | | | |
    +-+-+-+-+-+
    | | | |O| |
    +-+-+-+-+-+
    | |O| | | |
    +-+-+-+-+-+
    | | | | |O|
    +-+-+-+-+-+
    | | |O| | |
    +-+-+-+-+-+
     ';
    local -i i=0;
    for((i=0;i<size;i++)){
      sEcho="${sEcho}${board[i]} ";
    }
  fi
  echo "$sEcho";
  echo -n "+";
  local -i i=0;
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }
  echo "+";
  local -i i=0;
  local -i j=0;
  for((i=0;i<size;i++)){
    echo -n "|";
    for((j=0;j<size;j++)){
      if ((flag));then
        if(( board[i]!=-1));then
          if (( board[i]&1<<j ));then
            echo -n "Q";
          else
            echo -n " ";
          fi
        else
          echo -n " ";
        fi
      else
        if((i==board[j]));then
          echo -n "Q";
        else
          echo -n " ";
        fi
      fi
      if((j<(size-1)));then
        echo -n "|";
      fi
    }
  echo "|";
  if((i<(size-1)));then
    echo -n "+";
    local -i j=0;
    for((j=0;j<size;j++)){
      echo -n "-";
      if((j<(size-1)));then
        echo -n "+";
      fi
    }
  echo "+";
  fi
  }
  echo -n "+";
  local -i i=0;
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }  
  echo "+";
  echo "";
}
#
: 'ボード外側２列を除く内側のクイーン配置処理';
function solve()
{
  local -i row="$1";
  local -i left="$2";
  local -i down="$3";
  local -i right="$4";
  # if (( !(down+1) ));then return 1; fi
  ((down+1))||return 1; # ↑を高速化
  while(( row&1 ));do
    # ((row>>=1));
    # ((left<<=1));
    # ((right>>=1));
    (( row>>=1,left<<=1,right>>=1 )); # 上記３行をまとめて書けます
  done
  (( row>>=1 ));      # １行下に移動する
  #
  local -i bitmap;  # 再帰に必要な変数は必ず定義する必要があります。
  local -i total=0; 
  #
  # 以下のwhileを一行のforにまとめると高速化が期待できます。
  # local -i bitmap=~(left|down|right);
  # while ((bitmap!=0));do
  # :
  # (( bitmap^=bit ))
  # done
  for (( bitmap=~(left|down|right);bitmap!=0;bitmap^=bit));do
    local -i bit=$(( -bitmap&bitmap ));

    # ret=$( solve "$row" "$(( (left|bit)<<1 ))" "$(( (down|bit) ))" "$(( (right|bit)>>1 ))")  ; 
    #  ret=$?;
    # [[ $ret -gt 0 ]] && { 
    # ((total+=$ret));
    # }  # solve()で実行したreturnの値は $? に入ります。
    # 上記はやや冗長なので以下の２行にまとめて書くことができます。
  solve "$row" "$(( (left|bit)<<1 ))" "$(( (down|bit) ))" "$(( (right|bit)>>1 ))"; 
    ((total+=$?));  # solve()で実行したreturnの値は $? に入ります。
  done
  return $total;  # 合計を戻り値にします
}
#
: 'solve()を呼び出して再帰を開始する';
function process()
{
  local -i size="$1";
  local -i sym="$2"; # COUNT2 COUNT4 COUNT8
  # B[0]:row B[1]:left B[2]:down B[3]:right
  solve "$(( B[0]>>2 ))" \
        "$(( B[1]>>4 ))" \
        "$(( (((B[2]>>2 | ~0<<size-4)+1)<<size-5)-1 ))" \
        "$(( B[3]>>4<<size-5 ))";
  (( COUNTER[$sym]+=$? ));
}
#
: 'クイーンの効きをチェック';
function placement()
{
  local -i size="$1";
  local -i dimx="$2";     # dimxは行 dimyは列
  local -i dimy="$3";
  local -a t_x=(${B[4]}); # 同じ場所の配置を許す
  # if (( t_x[dimx]==dimy ));then
  #   return 1;
  # fi
  # 上記を以下のように書くことができます
  (( t_x[dimx]==dimy ))&& return 1;
  : '
  #
  #
  # 【枝刈り】Qが角にある場合の枝刈り
  #  ２．２列めにクイーンは置かない
  #  （１はcarryChainSymmetry()内にあります）
  #
  #  Qが角にある場合は、
  #  2行目のクイーンの位置 t_x[1]が BOUND1
  #  BOUND1行目までは2列目にクイーンを置けない
  # 
  #    +-+-+-+-+-+  
  #    | | | |X|Q| 
  #    +-+-+-+-+-+  
  #    | |Q| |X| | 
  #    +-+-+-+-+-+  
  #    | | | |X| |       
  #    +-+-+-+-+-+             
  #    | | | |Q| | 
  #    +-+-+-+-+-+ 
  #    | | | | | |      
  #    +-+-+-+-+-+  
  #';
  if (( t_x[0] ));then
  : '
  #
  # 【枝刈り】Qが角にない場合
  #
  #  +-+-+-+-+-+  
  #  |X|X|Q|X|X| 
  #  +-+-+-+-+-+  
  #  |X| | | |X| 
  #  +-+-+-+-+-+  
  #  | | | | | |
  #  +-+-+-+-+-+
  #  |X| | | |X|
  #  +-+-+-+-+-+
  #  |X|X| |X|X|
  #  +-+-+-+-+-+
  #
  #   １．上部サイド枝刈り
  #  if ((row<BOUND1));then        
  #    bitmap=$(( bitmap|SIDEMASK ));
  #    bitmap=$(( bitmap^=SIDEMASK ));
  #
  #  | | | | | |       
  #  +-+-+-+-+-+  
  #  BOUND1はt_x[0]
  #
  #  ２．下部サイド枝刈り
  #  if ((row==BOUND2));then     
  #    if (( !(down&SIDEMASK) ));then
  #      return ;
  #    fi
  #    if (( (down&SIDEMASK)!=SIDEMASK ));then
  #      bitmap=$(( bitmap&SIDEMASK ));
  #    fi
  #  fi
  #
  #  ２．最下段枝刈り
  #  LSATMASKの意味は最終行でBOUND1以下または
  #  BOUND2以上にクイーンは置けないということ
  #  BOUND2はsize-t_x[0]
  #  if(row==sizeE){
  #    //if(!bitmap){
  #    if(bitmap){
  #      if((bitmap&LASTMASK)==0){
  ';
    #if (( t_x[0]!=-1));then
    # 上記は if コマンドすら不要です
    [[ t_x[0] -ne -1 ]]&&{    # -ne は != と同じです
      (((dimx<t_x[0]||dimx>=size-t_x[0])
        &&(dimy==0||dimy==size-1)))&&{ return 0; } 
      (((dimx==size-1)&&((dimy<=t_x[0])||
          dimy>=size-t_x[0])))&&{ return 0; } 
    }
  else
    #if (( t_x[1]!=-1));then
    # 上記は if コマンドすら不要です
    [[ t_x[1] -ne -1 ]]&&{
      # bitmap=$(( bitmap|2 )); # 枝刈り
      # bitmap=$(( bitmap^2 )); # 枝刈り
      #((bitmap&=~2)); # 上２行を一行にまとめるとこうなります
      # ちなみに上と下は同じ趣旨
      # if (( (t_x[1]>=dimx)&&(dimy==1) ));then
      #   return 0;
      # fi
      (((t_x[1]>=dimx) && (dimy==1)))&&{ return 0; }
    }
  fi
  # B[0]:row B[1]:left B[2]:down B[3]:right
  (( (B[0] & 1<<dimx)|| (B[1] & 1<<(size-1-dimx+dimy))||
     (B[2] & 1<<dimy)|| (B[3] & 1<<(dimx+dimy)) )) && return 0;
  # ((B[0]|=1<<dimx));
  # ((B[1]|=1<<(size-1-dimx+dimy)));
  # ((B[2]|=1<<dimy));
  # ((B[3]|=1<<(dimx+dimy)));
  # 上記４行を一行にまとめることができます。
  ((B[0]|=1<<dimx, B[1]|=1<<(size-1-dimx+dimy),B[2]|=1<<dimy,B[3]|=1<<(dimx+dimy) ));
  #
  # 配列の中に配列があるので仕方がないですが要検討箇所です。
  t_x[$dimx]="$dimy"; 
  B[4]=${t_x[@]}; # Bに反映  
  #
  # ボードレイアウト出力
  # if [[ DISPLAY ]];then 
  #   board[$dimx]=$((1<<dimy)); 
  # fi
  # 上記を一行にまとめることができます。
  [[ $DISPLAY ]] && board[$dimx]=$((1<<dimy));
  #
  return 1;
}
#
: 'キャリーチェーン対称解除法';
function carryChainSymmetry()
{
  local -i n="$1";
  local -i w="$2";
  local -i s="$3";
  local -i e="$4";
  # n,e,s=(N-2)*(N-1)-1-w の場合は最小値を確認する。
  local -i ww=$(( (size-2)*(size-1)-1-w ));
  local -i w2=$(( (size-2)*(size-1)-1 ));
  # 対角線上の反転が小さいかどうか確認する
  (( (s==ww)&&(n<(w2-e)) ))&& return;
  # 垂直方向の中心に対する反転が小さいかを確認
  (( (e==ww)&&(n>(w2-n)) ))&& return;
  # 斜め下方向への反転が小さいかをチェックする
  (( (n==ww)&&(e>(w2-s)) ))&& return ;
  #
  # 【枝刈り】 １行目が角の場合
  #  １．回転対称チェックせずCOUNT8にする
  local -a t_x=(${B[4]}); # 同じ場所の配置を許す
  (( t_x[0] ))||{ # || は 条件が！であることを示します
    process "$size" "2";  #COUNT8
    #
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
    read -p ""; }
    return;
  }
  # n,e,s==w の場合は最小値を確認する。
  # : '右回転で同じ場合は、
  # w=n=e=sでなければ値が小さいのでskip
  # w=n=e=sであれば90度回転で同じ可能性 ';
  ((s==w))&&{
    (( (n!=w)||(e!=w) ))&& return;
    process "$size" "0" # COUNT2
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
    read -p ""; }
    return ;
  }
  # : 'e==wは180度回転して同じ
  # 180度回転して同じ時n>=sの時はsmaller?  ';
  (( (e==w)&&(n>=s) ))&&{
    ((n>s))&& return ;
    process "$size" "1" # COUNT4
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
    read -p ""; }
    return ;
  }
  process "$size" "2" ; #COUNT8
  # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
  ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
  read -p ""; }
  return ;
}
: 'チェーンのビルド';
function buildChain()
{
  local -i size="$1";
  local -a wB=sB=eB=nB=X; 
  wB=("${B[@]}");
  #
  # １ 上の２行に配置
  #
  #for ((w=0;w<=(size/2)*(size-3);w++));do
  # i++ よりも ++i のほうが断然高速です。
  for ((w=0;w<=(size/2)*(size-3);++w));do
    B=("${wB[@]}");
    # Bの初期化 #0:row 1:left 2:down 3:right 4:dimx
    #for ((bx_i=0;bx_i<size;bx_i++));do 
    #  X[$bx_i]=-1; 
    #  board[$bx_i]=-1;
    #done
    # i++ よりも ++i のほうが断然高速です。
    for ((bx_i=0;bx_i<size;++bx_i));do 
      X[$bx_i]=-1; 
      board[$bx_i]=-1;
    done
    B=([0]=0 [1]=0 [2]=0 [3]=0 [4]=${X[@]} [5]=${board[@]});
    placement "$size" "0" "$((pres_a[w]))"; # １　０行目と１行目にクイーンを配置
    [[ $? -eq 0 ]] && continue;
    placement "$size" "1" "$((pres_b[w]))";
    [[ $? -eq 0 ]] && continue;
    #
    # ２ 90度回転
    #
    nB=("${B[@]}");
    local -i mirror=$(( (size-2)*(size-1)-w ));
    #for ((n=w;n<mirror;n++));do 
    # i++ よりも ++i のほうが断然高速です。
    for ((n=w;n<mirror;++n));do 
      B=("${nB[@]}");
      placement "$size" "$((pres_a[n]))" "$((size-1))"; 
      [[ $? -eq 0 ]] && continue;
      placement "$size" "$((pres_b[n]))" "$((size-2))";
      [[ $? -eq 0 ]] && continue;
      #
      # ３ 90度回転
      #
      eB=("${B[@]}");
      #for ((e=w;e<mirror;e++));do 
      # i++ よりも ++i のほうが断然高速です。
      for ((e=w;e<mirror;++e));do 
        B=("${eB[@]}");
        placement "$size" "$((size-1))" "$((size-1-pres_a[e]))"; 
        [[ $? -eq 0 ]] && continue;
        placement "$size" "$((size-2))" "$((size-1-pres_b[e]))"; 
        [[ $? -eq 0 ]] && continue;
        #
        # ４ 90度回転
        #
        sB=("${B[@]}");
        #for ((s=w;s<mirror;s++));do
        # i++ よりも ++i のほうが断然高速です。
        for ((s=w;s<mirror;++s));do
          B=("${sB[@]}")
          placement "$size" "$((size-1-pres_a[s]))" "0";
          [[ $? -eq 0 ]] && continue;
          placement "$size" "$((size-1-pres_b[s]))" "1"; 
          [[ $? -eq 0 ]] && continue;
          #
          #  対象解除法
          carryChainSymmetry "$n" "$w" "$s" "$e" ; 
          #
        done
      done
    done
  done
}
: 'チェーンの初期化';
function initChain()
{
  local -i size="$1";
  local -i idx=0;
  local -i a=b=0;
  for ((a=0;a<size;a++));do
    for ((b=0;b<size;b++));do
      (( ( (a>=b)&&((a-b)<=1) )||
            ( (b>a)&& ((b-a)<=1) ) )) && continue;
      pres_a[$idx]=$a;
      pres_b[$idx]=$b;
      ((idx++));
    done
  done
}
#
: 'チェーンの構築';
function carryChain()
{
  local -i size="$1";
  initChain "$size";  # チェーンの初期化
  buildChain "$size"; # チェーンのビルド
  # 集計
  UNIQUE=$(( COUNTER[0]+COUNTER[1]+COUNTER[2] ));
  TOTAL=$(( COUNTER[0]*2+COUNTER[1]*4+COUNTER[2]*8 ));
}
#
: 'Nを連続して実行';
function NQ()
{
  local selectName="$1";
  local -i min=4;
  local -i max=17;
  local -i N="$min";
  local startTime=endTime=hh=mm=ss=0; 
  echo " N:        Total       Unique        hh:mm:ss" ;
  local -i N;
  for((N=min;N<=max;N++)){
    TOTAL=UNIQUE=0;
    COUNTER[0]=COUNTER[1]=COUNTER[2]=0;    # カウンター配列
    B=0; 
    startTime=$(date +%s);# 計測開始時間
    "$selectName" "$N";
    endTime=$(date +%s); 	# 計測終了時間
    ss=$((endTime-startTime));# hh:mm:ss 形式に変換
    hh=$((ss/3600));
    ss=$((ss%3600));
    mm=$((ss/60));
    ss=$((ss%60));
    printf "%2d:%13d%13d%10d:%.2d:%.2d\n" $N $TOTAL $UNIQUE $hh $mm $ss ;
  } 
}
#
#
#DISPLAY=0; # ボードレイアウト表示しない
DISPLAY=1; # ボードレイアウト表示する
#
NQ carryChain; 
exit;
```

## まとめ版プログラムソース
ここまでやってきた
１．ブルートフォース
２．バックトラック
３．配置フラグ
４．ビットマップ
５．ミラー
６．対称解除法
７．キャリーチェーン

を、一枚のソースにまとめて、選んで実行できるまとめ版のソースは以下です。

キャリーチェーンの非再帰版は未実装です。
ボードレイアウト出力は、外側２行２列が完成し、対称解除に入ったときに出力します。
ですので、外側を除く内側にクイーンを配置して、最後まで置けなかった場合は、外側２行２列でボードレイアウト出力されていても解にはなりません。

例えば、Ｎ５の場合、ボードレイアウト出力が３つ出ますが、解は２つです。それは、外側２行２列の配置段階で３つの解の候補が導き出されはしたものの、内側を処理する段階で１つは解の候補から外れたということになります。


```bash:07Bash_carryChain_summary.sh
#!/usr/bin/bash

: '
 ## bash版
 <> 07Bash_carryChain.sh
 N:        Total       Unique        hh:mm:ss
 4:            2            1         0:00:00
 5:           10            2         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:01
 8:           92           12         0:00:02
 9:          352           46         0:00:12
10:          724           92         0:00:44
11:         2680          341         0:02:39
12:        14200         1788         0:08:35
13:        73712         9237         0:27:05
14:       365596        45771         1:30:40
15:      2279184       285095         5:59:03

 <> 06Bash_symmetry.sh 対象解除
 N:        Total       Unique        hh:mm:ss
 4:            2            1         0:00:00
 5:           10            2         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:00
 8:           92           12         0:00:00
 9:          352           46         0:00:00
10:          724           92         0:00:02
11:         2680          341         0:00:05
12:        14200         1787         0:00:26
13:        73712         9233         0:02:28
14:       365596        45752         0:14:18
15:      2279184       285053         1:23:34

 ## python版
 $ python py13_4_multiprocess_nqueen.py
１３＿４マルチプロセス版
 N:        Total       Unique        hh:mm:ss.ms
 4:            2            1         0:00:00.124
 5:           10            2         0:00:00.110
 6:            4            1         0:00:00.116
 7:           40            6         0:00:00.115
 8:           92           12         0:00:00.119
 9:          352           46         0:00:00.118
10:          724           92         0:00:00.121
11:         2680          341         0:00:00.122
12:        14200         1787         0:00:00.228
13:        73712         9233         0:00:00.641
14:       365596        45752         0:00:03.227
15:      2279184       285053         0:00:19.973

ちなみにpythonシングルプロセス版
15:      2279184       285053         0:00:54.645


 ## Lua版
 $ luajit Lua12_N-Queen.lua
 N:            Total       Unique    hh:mm:ss
 2:                0            0    00:00:00
 3:                0            0    00:00:00
 4:                2            1    00:00:00
 5:               10            2    00:00:00
 6:                4            1    00:00:00
 7:               40            6    00:00:00
 8:               92           12    00:00:00
 9:              352           46    00:00:00
10:              724           92    00:00:00
11:             2680          341    00:00:00
12:            14200         1787    00:00:00
13:            73712         9233    00:00:00
14:           365596        45752    00:00:00
15:          2279184       285053    00:00:03
16:         14772512      1846955    00:00:20
17:         95815104     11977939    00:02:13

 ## OpenCL版
$ gcc -Wall -W -O3 -std=c99 -pthread -lpthread -lm -o 07_52NQueen 07_52gpu_queens.c -framework OpenCL
52. OpenCL (07_38 *N*si*si アルゴリムは全部のせ) 
 N:    Total          Unique      dd:hh:mm:ss.ms
 4:        2                   1  00:00:00:00.43
 5:       10                   2  00:00:00:00.35
 6:        4                   1  00:00:00:00.35
 7:       40                   6  00:00:00:00.35
 8:       92                  12  00:00:00:00.35
 9:      352                  46  00:00:00:00.35
10:      724                  92  00:00:00:00.35
11:     2680                 341  00:00:00:00.35
12:    14200                1787  00:00:00:00.35
13:    73712                9233  00:00:00:00.36
14:   365596               45752  00:00:00:00.37
15:  2279184              285053  00:00:00:01.58

 ## Java版
$ javac -cp .:commons-lang3-3.4.jar Java13c_NQueen.java && java  -cp .:commons-lang3-3.4.jar: -server -Xms4G -Xmx8G -XX:-HeapDumpOnOutOfMemoryError -XX:NewSize=256m -XX:MaxNewSize=256m -XX:-UseAdaptiveSizePolicy -XX:+UseConcMarkSweepGC Java13c_NQueen  ;
１３．Java 再帰 並列処理 
 N:        Total          Unique  hh:mm:ss.SSS
 4:            2               1  00:00:00.001
 5:           10               2  00:00:00.001
 6:            4               1  00:00:00.000
 7:           40               6  00:00:00.001
 8:           92              12  00:00:00.001
 9:          352              46  00:00:00.001
10:          724              92  00:00:00.001
11:         2680             341  00:00:00.003
12:        14200            1787  00:00:00.002
13:        73712            9233  00:00:00.005
14:       365596           45752  00:00:00.021
15:      2279184          285053  00:00:00.102
16:     14772512         1846955  00:00:00.631
17:     95815104        11977939  00:00:04.253

ちなみにシングルスレッド
15:      2279184          285053  00:00:00.324
16:     14772512         1846955  00:00:02.089
17:     95815104        11977939  00:00:14.524


 ## GCC版
$ gcc -Wall -W -O3 -g -ftrapv -std=c99 -pthread GCC13.c && ./a.out [-c|-r]
１３．CPU 非再帰 並列処理 pthread
 N:        Total          Unique  dd:hh:mm:ss.ms
 4:            2               1  00:00:00:00.00
 5:           10               2  00:00:00:00.00
 6:            4               1  00:00:00:00.00
 7:           40               6  00:00:00:00.00
 8:           92              12  00:00:00:00.00
 9:          352              46  00:00:00:00.00
10:          724              92  00:00:00:00.00
11:         2680             341  00:00:00:00.00
12:        14200            1787  00:00:00:00.00
13:        73712            9233  00:00:00:00.00
14:       365596           45752  00:00:00:00.01
15:      2279184          285053  00:00:00:00.10
16:     14772512         1846955  00:00:00:00.65
17:     95815104        11977939  00:00:00:04.33

ちなみにシングルスレッド
15:      2279184          285053            0.34
16:     14772512         1846955            2.24
17:     95815104        11977939           15.72

 ## GPU/CUDA版
$ nvcc -O3 CUDA13_N-Queen.cu  && ./a.out -g
１２．GPU 非再帰 並列処理 CUDA
 N:        Total      Unique      dd:hh:mm:ss.ms
 4:            2               1  00:00:00:00.37
 5:           10               2  00:00:00:00.00
 6:            4               1  00:00:00:00.00
 7:           40               6  00:00:00:00.00
 8:           92              12  00:00:00:00.01
 9:          352              46  00:00:00:00.01
10:          724              92  00:00:00:00.01
11:         2680             341  00:00:00:00.01
12:        14200            1787  00:00:00:00.02
13:        73712            9233  00:00:00:00.03
14:       365596           45752  00:00:00:00.03
15:      2279184          285053  00:00:00:00.04
16:     14772512         1846955  00:00:00:00.08
17:     95815104        11977939  00:00:00:00.35

ちなみにシングルスレッド
15:      2279184          285053            0.34
16:     14772512         1846955            2.24
17:     95815104        11977939           15.72

 ## nq27版
$ gcc -Wall -W -O3 nq27_N-Queen.c && ./a.out -r
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.00
11:         2680             341            0.01
12:        14200            1788            0.02
13:        73712            9237            0.06
14:       365596           45771            0.25
15:      2279184          285095            1.14
16:     14772512         1847425            6.69
17:     95815104        11979381           43.82

';
declare -i size;
declare -a board;
declare -i bit;
declare -i DISPLAY=0;   # ボード出力するか
declare -i TOTAL=UNIQUE=0;
declare -i COUNT2=COUNT4=COUNT8=0;
declare -i MASK=SIDEMASK=LASTMASK=0;
declare -i TOPBIT=ENDBIT=0;
declare -i BOUND1=BOUND2=0;
declare -a pres_a;        # チェーン
declare -a pres_b;        # チェーン
declare -i COUNTER[3];    # カウンター 0:COUNT2 1:COUNT4 2:COUNT8
: 'B=(row     0:
      left    1:
      down    2:
      right   3:
      X[@]    4: 
      )';
declare -a B; 

#
: 'ボードレイアウトを出力 ビットマップ対応版';
function printRecordCarryChain()
{
  local -a board=(${B[4]}); # 同じ場所の配置を許す
  ((TOTAL++));
  size="$1";
  flag="$2"; # bitmap版は1 それ以外は 0
  echo "$TOTAL";
  sEcho=" ";  
  : 'ビットマップ版
     ビットマップ版からは、左から数えます
     上下反転左右対称なので、これまでの上から数える手法と
     rowを下にたどって左から数える方法と解の数に変わりはありません。
     0 2 4 1 3 
    +-+-+-+-+-+
    |O| | | | | 0
    +-+-+-+-+-+
    | | |O| | | 2
    +-+-+-+-+-+
    | | | | |O| 4
    +-+-+-+-+-+
    | |O| | | | 1
    +-+-+-+-+-+
    | | | |O| | 3
    +-+-+-+-+-+
  ';
  if ((flag));then
    local -i i=0;
    local -i j=0;
    for ((i=0;i<size;i++));do
      for ((j=0;j<size;j++));do
       if (( board[i]&1<<j ));then
          sEcho="${sEcho}$((j)) ";
       fi 
      done
    done
  else 
  : 'ビットマップ版以外
     (ブルートフォース、バックトラック、配置フラグ)
     上から数えます
     0 2 4 1 3 
    +-+-+-+-+-+
    |O| | | | |
    +-+-+-+-+-+
    | | | |O| |
    +-+-+-+-+-+
    | |O| | | |
    +-+-+-+-+-+
    | | | | |O|
    +-+-+-+-+-+
    | | |O| | |
    +-+-+-+-+-+
     ';
    local -i i=0;
    for((i=0;i<size;i++)){
      sEcho="${sEcho}${board[i]} ";
    }
  fi
  echo "$sEcho";
  echo -n "+";
  local -i i=0;
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }
  echo "+";
  local -i i=0;
  local -i j=0;
  for((i=0;i<size;i++)){
    echo -n "|";
    for((j=0;j<size;j++)){
      if ((flag));then
        if(( board[i]!=-1));then
          if (( board[i]&1<<j ));then
            echo -n "Q";
          else
            echo -n " ";
          fi
        else
          echo -n " ";
        fi
      else
        if((i==board[j]));then
          echo -n "Q";
        else
          echo -n " ";
        fi
      fi
      if((j<(size-1)));then
        echo -n "|";
      fi
    }
  echo "|";
  if((i<(size-1)));then
    echo -n "+";
    local -i j=0;
    for((j=0;j<size;j++)){
      echo -n "-";
      if((j<(size-1)));then
        echo -n "+";
      fi
    }
  echo "+";
  fi
  }
  echo -n "+";
  local -i i=0;
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }  
  echo "+";
  echo "";
}
#
: 'ボードレイアウトを出力 ビットマップ対応版';
function printRecord()
{
  ((TOTAL++));
  size="$1";
  flag="$2"; # bitmap版は1 それ以外は 0
  echo "$TOTAL";
  sEcho=" ";  
  : 'ビットマップ版
     ビットマップ版からは、左から数えます
     上下反転左右対称なので、これまでの上から数える手法と
     rowを下にたどって左から数える方法と解の数に変わりはありません。
     0 2 4 1 3 
    +-+-+-+-+-+
    |O| | | | | 0
    +-+-+-+-+-+
    | | |O| | | 2
    +-+-+-+-+-+
    | | | | |O| 4
    +-+-+-+-+-+
    | |O| | | | 1
    +-+-+-+-+-+
    | | | |O| | 3
    +-+-+-+-+-+
  ';
  if ((flag));then
    local -i i=0;
    local -i j=0;
    for ((i=0;i<size;i++));do
      for ((j=0;j<size;j++));do
       if (( board[i]&1<<j ));then
          sEcho="${sEcho}$((j)) ";
       fi 
      done
    done
  else 
  : 'ビットマップ版以外
     (ブルートフォース、バックトラック、配置フラグ)
     上から数えます
     0 2 4 1 3 
    +-+-+-+-+-+
    |O| | | | |
    +-+-+-+-+-+
    | | | |O| |
    +-+-+-+-+-+
    | |O| | | |
    +-+-+-+-+-+
    | | | | |O|
    +-+-+-+-+-+
    | | |O| | |
    +-+-+-+-+-+

     ';
    local -i i=0;
    for((i=0;i<size;i++)){
      sEcho="${sEcho}${board[i]} ";
    }
  fi
  echo "$sEcho";
  echo -n "+";
  local -i i=0;
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }
  echo "+";
  local -i i=0;
  local -i j=0;
  for((i=0;i<size;i++)){
    echo -n "|";
    for((j=0;j<size;j++)){
      if ((flag));then
        if (( board[i]&1<<j ));then
          echo -n "O";
        else
          echo -n " ";
        fi
      else
        if((i==board[j]));then
          echo -n "O";
        else
          echo -n " ";
        fi
      fi
      if((j<(size-1)));then
        echo -n "|";
      fi
    }
  echo "|";
  if((i<(size-1)));then
    echo -n "+";
    local -i j=0;
    for((j=0;j<size;j++)){
      echo -n "-";
      if((j<(size-1)));then
        echo -n "+";
      fi
    }
  echo "+";
  fi
  }
  echo -n "+";
  local -i i=0;
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }  
  echo "+";
  echo "";
}
#
: 'ボード外側２列を除く内側のクイーン配置処理';
function solve()
{
  local -i row="$1";
  local -i left="$2";
  local -i down="$3";
  local -i right="$4";
  # if (( !(down+1) ));then return 1; fi
  ((down+1))||return 1; # ↑を高速化
  while(( row&1 ));do
    # ((row>>=1));
    # ((left<<=1));
    # ((right>>=1));
    (( row>>=1,left<<=1,right>>=1 )); # 上記３行をまとめて書けます
  done
  (( row>>=1 ));      # １行下に移動する
  #
  local -i bitmap;  # 再帰に必要な変数は必ず定義する必要があります。
  local -i total=0; 
  #
  # 以下のwhileを一行のforにまとめると高速化が期待できます。
  # local -i bitmap=~(left|down|right);
  # while ((bitmap!=0));do
  # :
  # (( bitmap^=bit ))
  # done
  for (( bitmap=~(left|down|right);bitmap!=0;bitmap^=bit));do
    local -i bit=$(( -bitmap&bitmap ));

    # ret=$( solve "$row" "$(( (left|bit)<<1 ))" "$(( (down|bit) ))" "$(( (right|bit)>>1 ))")  ; 
    #  ret=$?;
    # [[ $ret -gt 0 ]] && { 
    # ((total+=$ret));
    # }  # solve()で実行したreturnの値は $? に入ります。
    # 上記はやや冗長なので以下の２行にまとめて書くことができます。
  solve "$row" "$(( (left|bit)<<1 ))" "$(( (down|bit) ))" "$(( (right|bit)>>1 ))"; 
    ((total+=$?));  # solve()で実行したreturnの値は $? に入ります。
  done
  return $total;  # 合計を戻り値にします
}
#
: 'solve()を呼び出して再帰を開始する';
function process()
{
  local -i size="$1";
  local -i sym="$2"; # COUNT2 COUNT4 COUNT8
  # B[0]:row B[1]:left B[2]:down B[3]:right
  solve "$(( B[0]>>2 ))" \
        "$(( B[1]>>4 ))" \
        "$(( (((B[2]>>2 | ~0<<size-4)+1)<<size-5)-1 ))" \
        "$(( B[3]>>4<<size-5 ))";
  (( COUNTER[$sym]+=$? ));
}
#
: 'クイーンの効きをチェック';
function placement()
{
  local -i size="$1";
  local -i dimx="$2";     # dimxは行 dimyは列
  local -i dimy="$3";
  local -a t_x=(${B[4]}); # 同じ場所の配置を許す
  # if (( t_x[dimx]==dimy ));then
  #   return 1;
  # fi
  # 上記を以下のように書くことができます
  (( t_x[dimx]==dimy ))&& return 1;
  : '
  #
  #
  # 【枝刈り】Qが角にある場合の枝刈り
  #  ２．２列めにクイーンは置かない
  #  （１はcarryChainSymmetry()内にあります）
  #
  #  Qが角にある場合は、
  #  2行目のクイーンの位置 t_x[1]が BOUND1
  #  BOUND1行目までは2列目にクイーンを置けない
  # 
  #    +-+-+-+-+-+  
  #    | | | |X|Q| 
  #    +-+-+-+-+-+  
  #    | |Q| |X| | 
  #    +-+-+-+-+-+  
  #    | | | |X| |       
  #    +-+-+-+-+-+             
  #    | | | |Q| | 
  #    +-+-+-+-+-+ 
  #    | | | | | |      
  #    +-+-+-+-+-+  
  #';
  if (( t_x[0] ));then
  : '
  #
  # 【枝刈り】Qが角にない場合
  #
  #  +-+-+-+-+-+  
  #  |X|X|Q|X|X| 
  #  +-+-+-+-+-+  
  #  |X| | | |X| 
  #  +-+-+-+-+-+  
  #  | | | | | |
  #  +-+-+-+-+-+
  #  |X| | | |X|
  #  +-+-+-+-+-+
  #  |X|X| |X|X|
  #  +-+-+-+-+-+
  #
  #   １．上部サイド枝刈り
  #  if ((row<BOUND1));then        
  #    bitmap=$(( bitmap|SIDEMASK ));
  #    bitmap=$(( bitmap^=SIDEMASK ));
  #
  #  | | | | | |       
  #  +-+-+-+-+-+  
  #  BOUND1はt_x[0]
  #
  #  ２．下部サイド枝刈り
  #  if ((row==BOUND2));then     
  #    if (( !(down&SIDEMASK) ));then
  #      return ;
  #    fi
  #    if (( (down&SIDEMASK)!=SIDEMASK ));then
  #      bitmap=$(( bitmap&SIDEMASK ));
  #    fi
  #  fi
  #
  #  ２．最下段枝刈り
  #  LSATMASKの意味は最終行でBOUND1以下または
  #  BOUND2以上にクイーンは置けないということ
  #  BOUND2はsize-t_x[0]
  #  if(row==sizeE){
  #    //if(!bitmap){
  #    if(bitmap){
  #      if((bitmap&LASTMASK)==0){
  ';
    #if (( t_x[0]!=-1));then
    # 上記は if コマンドすら不要です
    [[ t_x[0] -ne -1 ]]&&{    # -ne は != と同じです
      (((dimx<t_x[0]||dimx>=size-t_x[0])
        &&(dimy==0||dimy==size-1)))&&{ return 0; } 
      (((dimx==size-1)&&((dimy<=t_x[0])||
          dimy>=size-t_x[0])))&&{ return 0; } 
    }
  else
    #if (( t_x[1]!=-1));then
    # 上記は if コマンドすら不要です
    [[ t_x[1] -ne -1 ]]&&{
      # bitmap=$(( bitmap|2 )); # 枝刈り
      # bitmap=$(( bitmap^2 )); # 枝刈り
      #((bitmap&=~2)); # 上２行を一行にまとめるとこうなります
      # ちなみに上と下は同じ趣旨
      # if (( (t_x[1]>=dimx)&&(dimy==1) ));then
      #   return 0;
      # fi
      (((t_x[1]>=dimx) && (dimy==1)))&&{ return 0; }
    }
  fi
  # B[0]:row B[1]:left B[2]:down B[3]:right
  (( (B[0] & 1<<dimx)|| (B[1] & 1<<(size-1-dimx+dimy))||
     (B[2] & 1<<dimy)|| (B[3] & 1<<(dimx+dimy)) )) && return 0;
  # ((B[0]|=1<<dimx));
  # ((B[1]|=1<<(size-1-dimx+dimy)));
  # ((B[2]|=1<<dimy));
  # ((B[3]|=1<<(dimx+dimy)));
  # 上記４行を一行にまとめることができます。
  ((B[0]|=1<<dimx, B[1]|=1<<(size-1-dimx+dimy),B[2]|=1<<dimy,B[3]|=1<<(dimx+dimy) ));
  #
  # 配列の中に配列があるので仕方がないですが要検討箇所です。
  t_x[$dimx]="$dimy"; 
  B[4]=${t_x[@]}; # Bに反映  
  #
  # ボードレイアウト出力
  # if [[ DISPLAY ]];then 
  #   board[$dimx]=$((1<<dimy)); 
  # fi
  # 上記を一行にまとめることができます。
  [[ $DISPLAY ]] && board[$dimx]=$((1<<dimy));
  #
  return 1;
}
#
: 'キャリーチェーン対象解除法';
function carryChainSymmetry()
{
  local -i n="$1";
  local -i w="$2";
  local -i s="$3";
  local -i e="$4";
  # n,e,s=(N-2)*(N-1)-1-w の場合は最小値を確認する。
  local -i ww=$(( (size-2)*(size-1)-1-w ));
  local -i w2=$(( (size-2)*(size-1)-1 ));
  # 対角線上の反転が小さいかどうか確認する
  (( (s==ww)&&(n<(w2-e)) ))&& return;
  # 垂直方向の中心に対する反転が小さいかを確認
  (( (e==ww)&&(n>(w2-n)) ))&& return;
  # 斜め下方向への反転が小さいかをチェックする
  (( (n==ww)&&(e>(w2-s)) ))&& return ;
  #
  # 【枝刈り】 １行目が角の場合
  #  １．回転対称チェックせずCOUNT8にする
  local -a t_x=(${B[4]}); # 同じ場所の配置を許す
  (( t_x[0] ))||{ # || は 条件が！であることを示します
    process "$size" "2";  #COUNT8
    #
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
    read -p ""; }
    return;
  }
  # n,e,s==w の場合は最小値を確認する。
  # : '右回転で同じ場合は、
  # w=n=e=sでなければ値が小さいのでskip
  # w=n=e=sであれば90度回転で同じ可能性 ';
  ((s==w))&&{
    (( (n!=w)||(e!=w) ))&& return;
    process "$size" "0" # COUNT2
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
    read -p ""; }
    return ;
  }
  # : 'e==wは180度回転して同じ
  # 180度回転して同じ時n>=sの時はsmaller?  ';
  (( (e==w)&&(n>=s) ))&&{
    ((n>s))&& return ;
    process "$size" "1" # COUNT4
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
    read -p ""; }
    return ;
  }
  process "$size" "2" ; #COUNT8
  # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
  ((DISPLAY==1))&& { printRecordCarryChain "$size" "0";
  read -p ""; }
  return ;
}
#
: 'チェーンのビルド';
function buildChain()
{
  local -i size="$1";
  local -a wB=sB=eB=nB=X; 
  wB=("${B[@]}");
  #
  # １ 上の２行に配置
  #
  #for ((w=0;w<=(size/2)*(size-3);w++));do
  # i++ よりも ++i のほうが断然高速です。
  for ((w=0;w<=(size/2)*(size-3);++w));do
    B=("${wB[@]}");
    # Bの初期化 #0:row 1:left 2:down 3:right 4:dimx
    #for ((bx_i=0;bx_i<size;bx_i++));do 
    #  X[$bx_i]=-1; 
    #  board[$bx_i]=-1;
    #done
    # i++ よりも ++i のほうが断然高速です。
    for ((bx_i=0;bx_i<size;++bx_i));do 
      X[$bx_i]=-1; 
      board[$bx_i]=-1;
    done
    B=([0]=0 [1]=0 [2]=0 [3]=0 [4]=${X[@]} [5]=${board[@]});
    placement "$size" "0" "$((pres_a[w]))"; # １　０行目と１行目にクイーンを配置
    [[ $? -eq 0 ]] && continue;
    placement "$size" "1" "$((pres_b[w]))";
    [[ $? -eq 0 ]] && continue;
    #
    # ２ 90度回転
    #
    nB=("${B[@]}");
    local -i mirror=$(( (size-2)*(size-1)-w ));
    #for ((n=w;n<mirror;n++));do 
    # i++ よりも ++i のほうが断然高速です。
    for ((n=w;n<mirror;++n));do 
      B=("${nB[@]}");
      placement "$size" "$((pres_a[n]))" "$((size-1))"; 
      [[ $? -eq 0 ]] && continue;
      placement "$size" "$((pres_b[n]))" "$((size-2))";
      [[ $? -eq 0 ]] && continue;
      #
      # ３ 90度回転
      #
      eB=("${B[@]}");
      #for ((e=w;e<mirror;e++));do 
      # i++ よりも ++i のほうが断然高速です。
      for ((e=w;e<mirror;++e));do 
        B=("${eB[@]}");
        placement "$size" "$((size-1))" "$((size-1-pres_a[e]))"; 
        [[ $? -eq 0 ]] && continue;
        placement "$size" "$((size-2))" "$((size-1-pres_b[e]))"; 
        [[ $? -eq 0 ]] && continue;
        #
        # ４ 90度回転
        #
        sB=("${B[@]}");
        #for ((s=w;s<mirror;s++));do
        # i++ よりも ++i のほうが断然高速です。
        for ((s=w;s<mirror;++s));do
          B=("${sB[@]}")
          placement "$size" "$((size-1-pres_a[s]))" "0";
          [[ $? -eq 0 ]] && continue;
          placement "$size" "$((size-1-pres_b[s]))" "1"; 
          [[ $? -eq 0 ]] && continue;
          #
          #  対象解除法
          carryChainSymmetry "$n" "$w" "$s" "$e" ; 
          #
        done
      done
    done
  done
}
#
: 'チェーンの初期化';
function initChain()
{
  local -i size="$1";
  local -i idx=0;
  local -i a=b=0;
  for ((a=0;a<size;a++));do
    for ((b=0;b<size;b++));do
      (( ( (a>=b)&&((a-b)<=1) )||
            ( (b>a)&& ((b-a)<=1) ) )) && continue;
      pres_a[$idx]=$a;
      pres_b[$idx]=$b;
      ((idx++));
    done
  done
}
#
: 'チェーンの構築';
function carryChain()
{
  local -i size="$1";
  initChain "$size";  # チェーンの初期化
  buildChain "$size"; # チェーンのビルド
  # 集計
  UNIQUE=$(( COUNTER[0]+COUNTER[1]+COUNTER[2] ));
  TOTAL=$(( COUNTER[0]*2+COUNTER[1]*4+COUNTER[2]*8 ));
}
#
: '再帰・非再帰版 対象解除法';
function symmetryOps()
{
  : '
  ２．クイーンが右上角以外にある場合、
  (1) 90度回転させてオリジナルと同型になる場合、さらに90度回転(オリジナルか
  ら180度回転)させても、さらに90度回転(オリジナルから270度回転)させてもオリ
  ジナルと同型になる。
  こちらに該当するユニーク解が属するグループの要素数は、左右反転させたパター
  ンを加えて２個しかありません。
  ';
  ((board[BOUND2]==1))&&{
    for((ptn=2,own=1;own<=size-1;own++,ptn<<=1)){
      for((bit=1,you=size-1;(board[you]!=ptn)&&(board[own]>=bit);you--)){
        ((bit<<=1));
      }
      ((board[own]>bit))&& return ;
      ((board[own]<bit))&& break ;
    }
    #90度回転して同型なら180度回転も270度回転も同型である
    ((own>size-1))&&{
      ((COUNT2++)); 
      if ((DISPLAY==1));then
        # 出力 1:bitmap版 0:それ以外
        printRecord "$size" "1";          
      fi
      return; 
    }
  }
  : '
  ２．クイーンが右上角以外にある場合、
    (2) 90度回転させてオリジナルと異なる場合は、270度回転させても必ずオリジナル
    とは異なる。ただし、180度回転させた場合はオリジナルと同型になることも有り得
    る。こちらに該当するユニーク解が属するグループの要素数は、180度回転させて同
    型になる場合は４個(左右反転×縦横回転)
  ';
  #180度回転
  ((board[size-1]==ENDBIT))&&{ 
    for ((you=size-1-1,own=1;own<=size-1;own++,you--)){
      for ((bit=1,ptn=TOPBIT;(ptn!=board[you])&&(board[own]>=bit);ptn>>=1)){
          ((bit<<=1)) ;
        }
      ((board[own]>bit))&& return ;
      ((board[own]<bit))&& break ;
    }
    #90度回転が同型でなくても180度回転が同型であることもある
    ((own>size-1))&&{ 
      ((COUNT4++)); 
      if ((DISPLAY==1));then
        # 出力 1:bitmap版 0:それ以外
        printRecord "$size" "1";          
      fi
      return; 
    }
  }
  : '
  ２．クイーンが右上角以外にある場合、
    (3)180度回転させてもオリジナルと異なる場合は、８個(左右反転×縦横回転×上下反転)
  ';
  #270度回転
  ((board[BOUND1]==TOPBIT))&&{ 
    for((ptn=TOPBIT>>1,own=1;own<=size-1;own++,ptn>>=1)){
      for((bit=1,you=0;(board[you]!=ptn)&&(board[own]>=bit);you++)){
          ((bit<<=1)) ;
        }
      ((board[own]>bit))&& return ;
      ((board[own]<bit))&& break ;
    }
  }
  ((COUNT8++));
  if ((DISPLAY==1));then
    # 出力 1:bitmap版 0:それ以外
    printRecord "$size" "1";          
  fi
}
#
: '非再帰版 角にQがない時の対象解除バックトラック';
function symmetry_backTrack_NR()
{
  local -i MASK="$(( (1<<size)-1 ))";
  local -i row="$1";
  local -a left[$size];
  left[$row]="$2";
  local -a down[$size];
  down[$row]="$3";
  local -a right[$size];
  right[$row]="$4";
  local -a bitmap[$size];
  bitmap[$row]=$(( MASK&~(left[row]|down[row]|right[row]) ));
  while ((row>0));do
    if (( bitmap[row]>0 ));then
      if ((row<BOUND1));then    #上部サイド枝刈り
        (( bitmap[row]|=SIDEMASK ));
        (( bitmap[row]^=SIDEMASK ));
      elif ((row==BOUND2));then #下部サイド枝刈り
        if (( (down[row]&SIDEMASK)==0));then
          ((row--));
        fi
        if (((down[row]&SIDEMASK)!=SIDEMASK));then
          (( bitmap[row]&=SIDEMASK ));
        fi
      fi
      local -i save_bitmap=${bitmap[row]}
      local -i bit=$(( -bitmap[row]&bitmap[row] ));  
      (( bitmap[row]^=bit ));  
      board[$row]="$bit";            # Qを配置
      if(((bit&MASK)!=0));then
        if (( row==(size-1) ));then
          if(((save_bitmap&LASTMASK)==0));then
            symmetryOps ;
          fi
          ((row--));
        else
          local -i n=$((row++));
          left[$row]=$(((left[n]|bit)<<1));
          down[$row]=$(((down[n]|bit)));
          right[$row]=$(((right[n]|bit)>>1));
          bitmap[$row]=$(( MASK&~(left[row]|down[row]|right[row]) ));
        fi
      else
        ((row--));
      fi
    else
      ((row--));
    fi
  done
}
#
: '非再帰版 角にQがある時の対象解除バックトラック';
function symmetry_backTrack_corner_NR()
{
  local -i row="$1";
  local -a bitmap[$size];
  local -a left[$size];
  left[$row]="$2";
  local -a down[$size];
  down[$row]="$3";
  local -a right[$size];
  right[$row]="$4";
  local -i MASK="$(( (1<<size)-1 ))";
  bitmap[$row]=$(( MASK&~(left[row]|down[row]|right[row]) ));
  while ((row>=2));do
    if ((row<BOUND1));then
      # bitmap[$row]=$(( bitmap[row]|2 ));
      # bitmap[$row]=$(( bitmap[row]^2 ));
      ((bitmap[row]&=~2));
    fi
    if (( bitmap[row]>0 ));then
      local -i bit=$(( -bitmap[row]&bitmap[row] ));
      (( bitmap[row]^=bit ));
      board[$row]="$bit";
      if (( row==(size-1) ));then
        ((COUNT8++)) ;
        if ((DISPLAY==1));then # 出力 1:bitmap版 0:それ以外
          printRecord "$size" "1";          
        fi
        ((row--));
      else
        local -i n=$((row++));
        left[$row]=$(((left[n]|bit)<<1));
        down[$row]=$(((down[n]|bit)));
        right[$row]=$(((right[n]|bit)>>1));
        board[$row]="$bit";                # Qを配置
        # クイーンが配置可能な位置を表す
        bitmap[$row]=$(( MASK&~(left[row]|down[row]|right[row]) ));
      fi
    else
      ((row--));
    fi
  done
}
#
: '非再帰版 対象解除';
function symmetry_NR()
{
  size="$1";
  TOTAL=UNIQUE=COUNT2=COUNT4=COUNT8=0;
  MASK=$(( (1<<size)-1 ));
  TOPBIT=$(( 1<<(size-1) )); 
  ENDBIT=LASTMASK=SIDEMASK=0;
  BOUND1=2; BOUND2=0;
  board[0]=1;
  while (( BOUND1>1 && BOUND1<size-1 ));do
    if (( BOUND1<size-1 ));then
      bit=$(( 1<<BOUND1 ));
      board[1]="$bit";          # ２行目にQを配置
      # 角にQがある時のバックトラック
      symmetry_backTrack_corner_NR "2" "$(( (2|bit)<<1 ))" "$(( 1|bit ))" "$(( (2|bit)>>1 ))";
    fi
    (( BOUND1++ ));
  done
  TOPBIT=$(( 1<<(size-1) )); 
  ENDBIT=$(( TOPBIT>>1 ));
  SIDEMASK=$(( TOPBIT|1 ));
  LASTMASK=$(( TOPBIT|1 )); 
  BOUND1=1; 
  BOUND2=$size-2;
  while (( BOUND1>0 && BOUND2<size-1 && BOUND1<BOUND2 ));do
    if (( BOUND1<BOUND2 ));then
      bit=$(( 1<<BOUND1 ));
      board[0]="$bit";          # Qを配置
      # 角にQがない時のバックトラック
      symmetry_backTrack_NR "1" "$(( bit<<1 ))" "$bit" "$(( bit>>1 ))";
    fi 
    (( BOUND1++,BOUND2-- ));
    ENDBIT=$(( ENDBIT>>1 ));
    LASTMASK=$(( LASTMASK<<1 | LASTMASK | LASTMASK>>1 )) ;
  done
  UNIQUE=$(( COUNT8+COUNT4+COUNT2 )) ;
  TOTAL=$(( COUNT8*8+COUNT4*4+COUNT2*2 ));
}
#
: '再帰版 角にQがない時の対象解除バックトラック';
function symmetry_backTrack()
{
  local row=$1;
  local left=$2;
  local down=$3;
  local right=$4; 
  local bitmap=$(( MASK&~(left|down|right) ));
  if ((row==(size-1) ));then
    if ((bitmap));then
      if (( !(bitmap&LASTMASK) ));then
        board[row]="$bitmap";     # Qを配置
        symmetryOps ;             # 対象解除
      fi
    fi
  else
    if ((row<BOUND1));then        # 上部サイド枝刈り
      bitmap=$(( bitmap|SIDEMASK ));
      bitmap=$(( bitmap^=SIDEMASK ));
    else 
      if ((row==BOUND2));then     # 下部サイド枝刈り
        if (( !(down&SIDEMASK) ));then
          return ;
        fi
        if (( (down&SIDEMASK)!=SIDEMASK ));then
          bitmap=$(( bitmap&SIDEMASK ));
        fi
      fi
    fi
    while((bitmap));do
      bit=$(( -bitmap & bitmap )) ;
      bitmap=$(( bitmap^bit));
      board[row]="$bit"             # Qを配置
      symmetry_backTrack $((row+1)) $(((left|bit)<<1))  $((down|bit)) $(((right|bit)>>1));
    done
  fi
}
#
: '再帰版 角にQがある時の対象解除バックトラック';
function symmetry_backTrack_corner()
{
  local row=$1;
  local left=$2;
  local down=$3;
  local right=$4; 
  local bitmap=$(( MASK&~(left|down|right) ));
  if ((row==(size-1) ));then
    if ((bitmap));then
      board[$row]="$bitmap";
      if ((DISPLAY==1));then
        printRecord "$size" 1 ;
      fi
      ((COUNT8++)) ;              
    fi
  else
    if ((row<BOUND1));then        # 枝刈り
      bitmap=$(( bitmap|2 ));
      bitmap=$(( bitmap^2 ));
    fi
    while((bitmap));do
      bit=$(( -bitmap & bitmap )) ;
      bitmap=$(( bitmap^bit));
      board[row]="$bit"           # Qを配置
      symmetry_backTrack_corner $((row+1)) $(((left|bit)<<1))  $((down|bit)) $(((right|bit)>>1));
    done
  fi
}
#
: '再帰版 対象解除';
function symmetry()
{
  size="$1";
  TOTAL=UNIQUE=COUNT2=COUNT4=COUNT8=0;
  MASK=$(( (1<<size)-1 ));
  TOPBIT=$(( 1<<(size-1) )); 
  ENDBIT=LASTMASK=SIDEMASK=0;
  BOUND1=2; BOUND2=0;
  board[0]=1;
  while (( BOUND1>1 && BOUND1<size-1 ));do
    if (( BOUND1<size-1 ));then
      bit=$(( 1<<BOUND1 ));
      board[1]="$bit";          # ２行目にQを配置
      # 角にQがある時のバックトラック
      symmetry_backTrack_corner "2" "$(( (2|bit)<<1 ))" "$(( 1|bit ))" "$(( (2|bit)>>1 ))";
    fi
    (( BOUND1++ ));
  done
  TOPBIT=$(( 1<<(size-1) )); 
  ENDBIT=$(( TOPBIT>>1 ));
  SIDEMASK=$(( TOPBIT|1 ));
  LASTMASK=$(( TOPBIT|1 )); 
  BOUND1=1; 
  BOUND2=size-2;
  while (( BOUND1>0 && BOUND2<size-1 && BOUND1<BOUND2 ));do
    if (( BOUND1<BOUND2 ));then
      bit=$(( 1<<BOUND1 ));
      board[0]="$bit";          # Qを配置
      # 角にQがない時のバックトラック
      symmetry_backTrack "1" "$(( bit<<1 ))" "$bit" "$(( bit>>1 ))";
    fi 
    (( BOUND1++,BOUND2-- ));
    ENDBIT=$(( ENDBIT>>1 ));
    LASTMASK=$(( LASTMASK<<1 | LASTMASK | LASTMASK>>1 )) ;
  done
  UNIQUE=$(( COUNT8+COUNT4+COUNT2 )) ;
  TOTAL=$(( COUNT8*8+COUNT4*4+COUNT2*2 ));
}
#
: '非再帰版ミラーロジック';
function mirror_solve_NR()
{
  local -i size="$1";
  local -i row="$2";
  local -i mask="$(( (1<<size)-1 ))";
  local -a bitmap[$size];
  local -a left[$size];
  local -a down[$size];
  local -a right[$size];
  local -i bit=0;
  left[$row]="$3";
  down[$row]="$4";
  right[$row]="$5";
  bitmap[$row]=$(( mask&~(left[row]|down[row]|right[row]) ));
  while ((row>-1));do
    if (( bitmap[row]>0 ));then
      bit=$(( -bitmap[row]&bitmap[row] ));  # 一番右のビットを取り出す
      bitmap[$row]=$(( bitmap[row]^bit ));  # 配置可能なパターンが一つずつ取り出される
      board[$row]="$bit";                   # Qを配置
      if (( row==(size-1) ));then
        ((COUNT2++));
        if ((DISPLAY==1));then
          printRecord "$size" "1";            # 出力 1:bitmap版 0:それ以外
        fi
        ((row--));
      else
        local -i n=$((row++));
        left[$row]=$(((left[n]|bit)<<1));
        down[$row]=$(((down[n]|bit)));
        right[$row]=$(((right[n]|bit)>>1));
        board[$row]="$bit";                 # Qを配置
        # クイーンが配置可能な位置を表す
        bitmap[$row]=$(( mask&~(left[row]|down[row]|right[row]) ));
      fi
    else
      ((row--));
    fi
  done
}
#
: '非再帰版ミラー';
function mirror_NR()
{
  local -i size="$1";
  local -i mask="$(( (1<<size)-1 ))";
  local -i bit=0; 
  : '
    if ((size%2));then                #  以下のif文と等価です
      limit="$((size/2-1))";
    else
      limit="$((size/2))";
    fi
  ';
  local -i limit="$(( size%2 ? size/2-1 : size/2 ))";
  for ((i=0;i<size/2;i++));do         # 奇数でも偶数でも通過
    bit="$(( 1<<i ))";
    board[0]="$bit";                  # １行目にQを置く
    mirror_solve_NR "$size" "1" "$((bit<<1))" "$bit" "$((bit>>1))";
  done
  if ((size%2));then                  # 奇数で通過
    bit=$(( 1<<(size-1)/2 ));
    board[0]=$(( 1<<((size-1)/2) ));  # １行目の中央にQを配置
    local -i left=$(( bit<<1 ));
    local -i down=$(( bit ));
    local -i right=$(( bit>>1 ));
    for ((i=0;i<limit;i++));do
      bit="$(( 1<<i ))";
      mirror_solve_NR "$size" "2" "$(( (left|bit)<<1 ))" "$(( down|bit ))" "$(( (right|bit)>>1))";
    done
  fi
  TOTAL="$(( COUNT2<<1 ))";     # 倍にする

}
#
: '再帰版ミラーロジック';
function mirror_solve_R()
{
  local -i size="$1";
  local -i row="$2";
  local -i left="$3";
  local -i down="$4";
  local -i right="$5";
  local -i mask="$(( (1<<size)-1 ))";
  local -i bit;
  local -i bitmap;
  if (( row==size ));then
    ((COUNT2++));
    if ((DISPLAY));then
      printRecord "$size" "1";       # 出力 1:bitmap版 0:それ以外
    fi
  else
    # Qが配置可能な位置を表す
    bitmap="$(( mask&~(left|down|right) ))";
    while ((bitmap));do
      bit="$(( -bitmap&bitmap ))"; # 一番右のビットを取り出す
      bitmap="$(( bitmap^bit ))";  # 配置可能なパターンが一つずつ取り出される
      board["$row"]="$bit";        # Qを配置
      mirror_solve_R "$size" "$((row+1))" "$(( (left|bit)<<1 ))" "$((down|bit))" "$(( (right|bit)>>1 ))";
    done
  fi
}
#
: '再帰版ミラー';
function mirror_R()
{
  local -i size="$1";
  local -i mask="$(( (1<<size)-1 ))";
  local -i bit=0; 
  : '
    if ((size%2));then                #  以下のif文と等価です
      limit="$((size/2-1))";
    else
      limit="$((size/2))";
    fi
  ';
  local -i limit="$(( size%2 ? size/2-1 : size/2 ))";
  for ((i=0;i<size/2;i++));do         # 奇数でも偶数でも通過
    bit="$(( 1<<i ))";
    board[0]="$bit";                  # １行目にQを置く
    mirror_solve_R "$size" "1" "$((bit<<1))" "$bit" "$((bit>>1))";
  done
  if ((size%2));then                  # 奇数で通過
    bit=$(( 1<<(size-1)/2 ));
    board[0]=$(( 1<<((size-1)/2) ));  # １行目の中央にQを配置
    local -i left=$(( bit<<1 ));
    local -i down=$(( bit ));
    local -i right=$(( bit>>1 ));
    for ((i=0;i<limit;i++));do
      bit="$(( 1<<i ))";
      mirror_solve_R "$size" "2" "$(( (left|bit)<<1 ))" "$(( down|bit ))" "$(( (right|bit)>>1))";
    done
  fi
  TOTAL="$(( COUNT2<<1 ))";     # 倍にする
}
#
: '非再帰版ビットマップ';
function bitmap_NR()
{ 
  local -i size="$1";
  local -i row="$2";
  local -i mask=$(( (1<<size)-1 ));
  local -a left[$size];
  local -a down[$size];
  local -a right[$size];
  local -a bitmap[$size]
  local -i bitmap[$row]=mask;
  local -i bit=0;
  bitmap[$row]=$(( mask&~(left[row]|down[row]|right[row]) ));
  while ((row>-1));do
    if (( bitmap[row]>0 ));then
      bit=$(( -bitmap[row]&bitmap[row] ));  # 一番右のビットを取り出す
      bitmap[$row]=$(( bitmap[row]^bit ));  # 配置可能なパターンが一つずつ取り出される
      board[$row]="$bit";                   # Qを配置
      if (( row==(size-1) ));then
        ((TOTAL++));
        if ((DISPLAY==1));then
          printRecord "$size" "1";            # 出力 1:bitmap版 0:それ以外
        fi
        ((row--));
      else
        local -i n=$((row++));
        left[$row]=$(((left[n]|bit)<<1));
        down[$row]=$(((down[n]|bit)));
        right[$row]=$(((right[n]|bit)>>1));
        board[$row]="$bit";                 # Qを配置
        # クイーンが配置可能な位置を表す
        bitmap[$row]=$(( mask&~(left[row]|down[row]|right[row]) ));
      fi
    else
      ((row--));
    fi
  done 

}
#
: '再帰版ビットマップ';
function bitmap_R()
{
  local -i size="$1"; 
  local -i row="$2";
  local -i mask="$3";
  local -i left="$4"; 
  local -i down="$5"; 
  local -i right="$6";
  local -i bitmap=;
  local -i bit=;
  local -i col=0;                     # 再帰に必要
  if (( row==size ));then
    ((TOTAL++));
    if ((DISPLAY==1));then
      printRecord "$size" "1";         # 出力 1:bitmap版 0:それ以外
    fi
  else
    bitmap=$(( mask&~(left|down|right) )); # クイーンが配置可能な位置を表す
    while (( bitmap ));do
      bit=$((-bitmap&bitmap)) ;       # 一番右のビットを取り出す
      bitmap=$((bitmap&~bit)) ;       # 配置可能なパターンが一つずつ取り出される
      board[$row]="$bit";             # Qを配置
      bitmap_R "$size" "$((row+1))" "$mask" "$(( (left|bit)<<1 ))" "$((down|bit))" "$(( (right|bit)>>1 ))";
    done
  fi
}
#
: '非再帰版配置フラグ(right/down/left flag)';
function postFlag_NR()
{
  local -i size="$1";
  local -i row="$2"
  local -i matched=0;
  for ((i=0;i<size;i++)){ board[$i]=-1; }
  while ((row>-1));do
    matched=0;
    for ((col=board[row]+1;col<size;col++)){
      if (( !down[col]
        &&  !right[col-row+size-1]
        &&  !left[col+row] ));then
        dix=$col;
        rix=$((row-col+(size-1)));
        lix=$((row+col));
        if ((board[row]!=-1));then
          down[${board[$row]}]=0;
          right[${board[$row]}-$row+($size-1)]=0;
          left[${board[$row]}+$row]=0;
        fi       
        board[$row]=$col;   # Qを配置
        down[$col]=1;
        right[$col-$row+($size-1)]=1;
        left[$col+$row]=1;  # 効き筋とする
        matched=1;          # 配置した
        break;
      fi
    }
    if ((matched));then     # 配置済み
      ((row++));            #次のrowへ
      if ((row==size));then
        ((TOTAL++));
        if ((DISPLAY==1));then
          printRecord "$size";# 出力
        fi
        ((row--));
      fi
    else
      if ((board[row]!=-1));then
        down[${board[$row]}]=0;
        right[${board[$row]}-$row+($size-1)]=0;
        left[${board[$row]}+$row]=0;
        board[$row]=-1;
      fi
      ((row--));            # バックトラック
    fi
  done
}
#
: '再帰版配置フラグ';
function postFlag_R()
{
  local -i size="$1";
  local -i row="$2";
  local -i col=0;       # 再帰に必要
  if (( row==size ));then
     ((TOTAL++));
    if (( DISPLAY==1 ));then
      printRecord "$size";# 出力
    fi
  else
    for(( col=0;col<size;col++ )){
      board[$row]="$col";
      if (( down[col]==0 
        && right[row-col+size-1]==0
        && left[row+col]==0));then
        down[$col]=1;
        right[$row-$col+($size-1)]=1;
        left[$row+$col]=1;
        postFlag_R "$size" "$((row+1))";
        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
    }
  fi
}
#
: 'バックトラック版効き筋をチェック';
function check_backTracking()
{
  local -i row="$1";
  local -i flag=1;
  for ((i=0;i<row;++i)){
    if (( board[i]>=board[row] ));then
      val=$(( board[i]-board[row] ));
    else
      val=$(( board[row]-board[i] ));
    fi
    if (( board[i]==board[row] || val==(row-i) ));then
      flag=0;
    fi
  }
  [[ $flag -eq 0 ]]
  return $?;
}
#
: '非再帰版バックトラック';
function backTracking_NR()
{
  local -i size="$1";
  local -i row="$2";
  for ((i=0;i<size;i++)){ board[$i]=-1; }
  while ((row>-1));do
    local -i matched=0;
    local -i col=0;  
    for((col=board[row]+1;col<size;col++)){
      board[$row]=$col;
      check_backTracking "$row";  # 効きをチェック
      if (($?==1));then # 直前のreturnを利用
        matched=1;
        break;
      fi
    }
    if ((matched));then
      ((row++));
      if ((row==size));then  # 最下部まで到達
        ((row--));
        ((TOTAL++));
        if (( DISPLAY==1 ));then
          printRecord "$size";# 出力
        fi
      fi
    else
      if ((board[row]!=-1));then
        board[$row]=-1;
      fi
      ((row--));
    fi
 done  
}
#
: '再帰版バックトラック';
function backTracking_R()
{
  local -i size="$1";
  local -i row="$2";
  local -i col=0;
  if ((row==size));then
    ((TOTAL++));
    if (( DISPLAY==1 ));then
      printRecord "$size";# 出力
    fi
  else
    for(( col=0;col<size;col++ )){
      board["$row"]="$col";
      check_backTracking "$row";
      if (($?==1));then 
        backTracking_R  $size $((row+1));
      fi
    }
  fi
}
#
: 'ブルートフォース版効き筋をチェック';
function check_bluteForce()
{
  local -i size="$1";
  local -i flag=1;
  for ((r=1;r<size;++r)){
    for ((i=0;i<r;++i)){
      if (( board[i]>=board[r] ));then
        val=$(( board[i]-board[r] ));
      else
        val=$(( board[r]-board[i] ));
      fi

      if (( board[i]==board[r] || val==(r-i) ));then
        flag=0; 
      fi
    }
  }
  [[ $flag -eq 0 ]]
  return $?;
}
#
: '非再帰版ブルートフォース';
function bluteForce_NR()
{
  local -i size="$1";
  local -i row="$2";
  for ((i=0;i<size;i++)){ board[$i]=-1; }
  while ((row>-1));do
    local -i matched=0;
    local -i col=0;  
    for((col=board[row]+1;col<size;col++)){
      board[$row]=$col;
      matched=1;
      break;
    }
    if ((matched));then
      ((row++));
      if ((row==size));then  # 最下部まで到達
        ((row--));
        check_bluteForce "$size";  # 効きをチェック
        if (($?==1));then # 直前のreturnを利用
          ((TOTAL++));
          if (( DISPLAY==1 ));then
            printRecord "$size";# 出力
          fi
        fi
      fi
    else
      if ((board[row]!=-1));then
        board[$row]=-1;
      fi
      ((row--));
    fi
 done  
}
#
: '再帰版ブルートフォース';
function bluteForce_R()
{
  local -i size="$1";
  local -i row="$2";
  local -i col=;
  if ((row==size));then
    check_bluteForce "$size";
    if (( $?==1 ));then 
      ((TOTAL++));
      if (( DISPLAY==1 ));then
        printRecord "$size";# 出力
      fi
    fi
  else
    for(( col=0;col<size;col++ )){
      board["$row"]="$col";
      bluteForce_R  $size $((row+1));
    }
  fi
}
#
function NQ()
{
  local selectName="$1";
  local -i min=4;
  local -i max=17;
  local -i N="$min";
  local -i mask=0;
  local -i bit=0
  local -i row=0;
  local startTime=0;
  local endTime=0;
  local hh=mm=ss=0; 
  echo " N:        Total       Unique        hh:mm:ss" ;
  local -i N;
  for((N=min;N<=max;N++)){
    row=0;
    TOTAL=UNIQUE=0;
    COUNT2=COUNT4=COUNT8=0;
    MASK=SIDEMASK=LASTMASK=0;
    TOPBIT=ENDBIT=BOUND1=BOUND2=0;
    COUNTER[0]=COUNTER[1]=COUNTER[2]=0;    # カウンター配列
    mask=$(( (1<<N)-1 ));
    startTime=$(date +%s);# 計測開始時間

    "$selectName" "$N" "$row" "$mask" 0 0 0;

    endTime=$(date +%s); 	# 計測終了時間
    ss=$((endTime-startTime));# hh:mm:ss 形式に変換
    hh=$((ss/3600));
    ss=$((ss%3600));
    mm=$((ss/60));
    ss=$((ss%60));
    printf "%2d:%13d%13d%10d:%.2d:%.2d\n" $N $TOTAL $UNIQUE $hh $mm $ss ;
  } 
}

while :
do
read -n1 -p "
エイト・クイーン メニュー
実行したい番号を選択
7) キャリーチェーン
6) 対象解除法
5) ミラー
4) ビットマップ
3) 配置フラグ 
2) バックトラック 
1) ブルートフォース 

echo "行頭の番号を入力してください";

" selectNo;
echo 
case "$selectNo" in
  7)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない
      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰(未実装)
      " select;
      echo; 
      case "$select" in
        y|Y) NQ carryChain; break; ;;
        #n|N) NQ carryChain_NR; break; ;;
        n|N) NQ carryChain; break; ;;
      esac
    done
    ;;
  6)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない
      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰
      " select;
      echo; 
      case "$select" in
        y|Y) NQ symmetry; break; ;;
        n|N) NQ symmetry_NR; break; ;;
      esac
    done
    ;;
  5)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない
      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰
      " select;
      echo; 
      case "$select" in
        y|Y) NQ mirror_R; break; ;;
        n|N) NQ mirror_NR; break; ;;
      esac
    done
    ;;
  4)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない
      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰
      " select;
      echo; 
      case "$select" in
        y|Y) NQ bitmap_R; break; ;;
        n|N) NQ bitmap_NR; break; ;;
      esac
    done
    ;;
  3)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない
      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰
      " select;
      echo; 
      case "$select" in
        y|Y) NQ postFlag_R; break; ;;
        n|N) NQ postFlag_NR; break; ;;
      esac
    done
    ;;
  2)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない

      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰

      " select;
      echo; 
      case "$select" in
    
        y|Y) NQ backTracking_R; break; ;;
        n|N) NQ backTracking_NR; break; ;;
      esac
    done
    ;;
  1)
    while :
    do 
      read -n1 -p "
      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない

      " select;
      echo; 
      case "$select" in
        y|Y) DISPLAY=1; break; ;;
        n|N) DISPLAY=0; break; ;;
      esac
    done
    while :
    do 
      read -n1 -p "
      y|Y) 再帰
      n|N) 非再帰

      " select;
      echo; 
      case "$select" in
        y|Y) NQ bluteForce_R; break; ;;
        n|N) NQ bluteForce_NR;break; ;;
      esac
    done
    ;;
  *)
    ;; 
esac
done
exit;
```

次はいよいよ並列処理です。
もっともっと速くなります。お楽しみに！



## 参考リンク
以下の詳細説明を参考にしてください。
[【参考リンク】Ｎクイーン問題 過去記事一覧](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)
[【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！](https://github.com/suzukiiichiro/N-Queens)

Ｎクイーン問題（５０）第七章 マルチプロセス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-04-n-queens-suzuki/
Ｎクイーン問題（４９）第七章 マルチスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-03-n-queens-suzuki/
Ｎクイーン問題（４８）第七章 シングルスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-02-n-queens-suzuki/
Ｎクイーン問題（４７）第七章 クラス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-01-n-queens-suzuki/
Ｎクイーン問題（４６）第七章 ステップＮの実装 Python編
https://suzukiiichiro.github.io/posts/2023-06-16-02-n-queens-suzuki/
Ｎクイーン問題（４５）第七章 キャリーチェーン Python編
https://suzukiiichiro.github.io/posts/2023-06-16-01-n-queens-suzuki/
Ｎクイーン問題（４４）第七章　対象解除法 Python編
https://suzukiiichiro.github.io/posts/2023-06-14-02-n-queens-suzuki/
Ｎクイーン問題（４３）第七章　ミラー Python編
https://suzukiiichiro.github.io/posts/2023-06-14-01-n-queens-suzuki/
Ｎクイーン問題（４２）第七章　ビットマップ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-05-n-queens-suzuki/
Ｎクイーン問題（４１）第七章　配置フラグ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-04-n-queens-suzuki/
Ｎクイーン問題（４０）第七章　バックトラック Python編
https://suzukiiichiro.github.io/posts/2023-06-13-03-n-queens-suzuki/
Ｎクイーン問題（３９）第七章　バックトラック準備編 Python編
https://suzukiiichiro.github.io/posts/2023-06-13-02-n-queens-suzuki/
Ｎクイーン問題（３８）第七章　ブルートフォース Python編
https://suzukiiichiro.github.io/posts/2023-06-13-01-n-queens-suzuki/
Ｎクイーン問題（３７）第六章 C言語移植 その１７ pthread並列処理完成
https://suzukiiichiro.github.io/posts/2023-05-30-17-n-queens-suzuki/
Ｎクイーン問題（３６）第六章 C言語移植 その１６ pthreadの実装
https://suzukiiichiro.github.io/posts/2023-05-30-16-n-queens-suzuki/
Ｎクイーン問題（３５）第六章 C言語移植 その１５ pthread実装直前版完成
https://suzukiiichiro.github.io/posts/2023-05-30-15-n-queens-suzuki/
Ｎクイーン問題（３４）第六章 C言語移植 その１４
https://suzukiiichiro.github.io/posts/2023-05-30-14-n-queens-suzuki/
Ｎクイーン問題（３３）第六章 C言語移植 その１３
https://suzukiiichiro.github.io/posts/2023-05-30-13-n-queens-suzuki/
Ｎクイーン問題（３２）第六章 C言語移植 その１２
https://suzukiiichiro.github.io/posts/2023-05-30-12-n-queens-suzuki/
Ｎクイーン問題（３１）第六章 C言語移植 その１１
https://suzukiiichiro.github.io/posts/2023-05-30-11-n-queens-suzuki/
Ｎクイーン問題（３０）第六章 C言語移植 その１０
https://suzukiiichiro.github.io/posts/2023-05-30-10-n-queens-suzuki/
Ｎクイーン問題（２９）第六章 C言語移植 その９
https://suzukiiichiro.github.io/posts/2023-05-30-09-n-queens-suzuki/
Ｎクイーン問題（２８）第六章 C言語移植 その８
https://suzukiiichiro.github.io/posts/2023-05-30-08-n-queens-suzuki/
Ｎクイーン問題（２７）第六章 C言語移植 その７
https://suzukiiichiro.github.io/posts/2023-05-30-07-n-queens-suzuki/
Ｎクイーン問題（２６）第六章 C言語移植 その６
https://suzukiiichiro.github.io/posts/2023-05-30-06-n-queens-suzuki/
Ｎクイーン問題（２５）第六章 C言語移植 その５
https://suzukiiichiro.github.io/posts/2023-05-30-05-n-queens-suzuki/
Ｎクイーン問題（２４）第六章 C言語移植 その４
https://suzukiiichiro.github.io/posts/2023-05-30-04-n-queens-suzuki/
Ｎクイーン問題（２３）第六章 C言語移植 その３
https://suzukiiichiro.github.io/posts/2023-05-30-03-n-queens-suzuki/
Ｎクイーン問題（２２）第六章 C言語移植 その２
https://suzukiiichiro.github.io/posts/2023-05-30-02-n-queens-suzuki/
Ｎクイーン問題（２１）第六章 C言語移植 その１
N-Queens問://suzukiiichiro.github.io/posts/2023-05-30-01-n-queens-suzuki/
Ｎクイーン問題（２０）第五章 並列処理
https://suzukiiichiro.github.io/posts/2023-05-23-02-n-queens-suzuki/
Ｎクイーン問題（１９）第五章 キャリーチェーン
https://suzukiiichiro.github.io/posts/2023-05-23-01-n-queens-suzuki/
Ｎクイーン問題（１８）第四章 エイト・クイーンノスタルジー
https://suzukiiichiro.github.io/posts/2023-04-25-01-n-queens-suzuki/
Ｎクイーン問題（１７）第四章　偉人のソースを読む「Ｎ２４を発見 Ｊｅｆｆ Ｓｏｍｅｒｓ」
https://suzukiiichiro.github.io/posts/2023-04-21-01-n-queens-suzuki/
Ｎクイーン問題（１６）第三章　対象解除法 ソース解説
https://suzukiiichiro.github.io/posts/2023-04-18-01-n-queens-suzuki/
Ｎクイーン問題（１５）第三章　対象解除法 ロジック解説
https://suzukiiichiro.github.io/posts/2023-04-13-02-nqueens-suzuki/
Ｎクイーン問題（１４）第三章　ミラー
https://suzukiiichiro.github.io/posts/2023-04-13-01-nqueens-suzuki/
Ｎクイーン問題（１３）第三章　ビットマップ
https://suzukiiichiro.github.io/posts/2023-04-05-01-nqueens-suzuki/
Ｎクイーン問題（１２）第二章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-17-02-n-queens-suzuki/
Ｎクイーン問題（１１）第二章　配置フラグの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-17-01-n-queens-suzuki/
Ｎクイーン問題（１０）第二章　バックトラックの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-16-01-n-queens-suzuki/
Ｎクイーン問題（９）第二章　ブルートフォースの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-14-01-n-queens-suzuki/
Ｎクイーン問題（８）第一章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-09-01-n-queens-suzuki/
Ｎクイーン問題（７）第一章　ブルートフォース再び
https://suzukiiichiro.github.io/posts/2023-03-08-01-n-queens-suzuki/
Ｎクイーン問題（６）第一章　配置フラグ
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/
Ｎクイーン問題（５）第一章　進捗表示テーブルの作成
https://suzukiiichiro.github.io/posts/2023-03-06-01-n-queens-suzuki/
Ｎクイーン問題（４）第一章　バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
Ｎクイーン問題（３）第一章　バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
Ｎクイーン問題（２）第一章　ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/




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
