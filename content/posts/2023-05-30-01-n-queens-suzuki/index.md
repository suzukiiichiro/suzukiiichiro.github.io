---
title: "Ｎクイーン問題（２１）第六章 C言語移植 その１"
description: "変数や関数の構造など極力同等に移植"
date: 2023-05-30T13:16:40+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - Ｃ言語
  - 並列処理
  - シェルスクリプト
  - Bash
  - アルゴリズム
  - 鈴木維一郎
---

![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

エイト・クイーンのプログラムアーカイブ 
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens


## BashからC言語への移植、そして並列処理へ
先の説明では、BashでＮクイーンのアルゴリズムを中心に説明してきました。
複雑で緻密な言語でプログラムを構築するよりも、直感的に理解しやすい言語で、作り、実行しながら見て学ぶ方法をご紹介してきました。
Bashはそこそこ実行速度の遅い言語ではありますが、その分、どこで何が行われているのかを、修正しながら、目で終える実行速度で確認するメリットがあります。

ただ、Bashによる並列処理ではどうしても速度に限界があるのはそのとおりです。
Bashに限定することなく、Bashで得た経験を他のプログラム言語に置き換えて、さらに学ぶことも重要です。

そこで、今回から１７回に渡って「C言語への移植と並列処理」のシリーズを開始します。
Bashでの並列処理にたどり着くまで８ステップかかりました。

８ステップと行っても、ブルートフォース、バックトラック、配置フラグ、ビットマップ、ミラー、対称解除、キャリーチェーンといった過去の偉人が発見した優れたアルゴリズムを実装してきたそのものを理解するのは容易なことではありません。

なんどでも読み返してほしいと思いますし、またわからなくなったら01Bash....shに戻ってより深く理解することをおすすめします。僕もそうやって何度となくスタート地点に戻って繰り返し実装してきました。

今回からご紹介するC言語のソースは、Bashのソースの構造や関数名、変数名、序列、アルゴリズムなど、極力同等に書いてあります。

また、BashやC言語のソースには、極力言語独自の関数や処理ライブラリ、外部コマンドを使わずに、基本的なプログラミング知識のみで、アルゴリズムに特化して理解できるようにしてあります。



## C言語への移植
まずは、移植のもととなるBashのソースを以下に貼ります。
Bashのキャリーチェーンを並列処理したソースです。

```bash:08Bash_carryChain_parallel.sh
#!/usr/bin/bash

: '
  ## bash版
 <> 08Bash_carryChain_parallel.sh 並列処理
 N:        Total       Unique        hh:mm:ss
 4:            0            0         0:00:00
 5:            8            1         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:00
 8:           92           12         0:00:01
 9:          352           46         0:00:03
10:          724           92         0:00:15
11:         2680          341         0:00:52
12:        14200         1788         0:02:49
13:        73712         9237         0:09:18
14:       365596        45771         0:28:48
15:      2279184       285095         1:49:12

 <> 07Bash_carryChain.sh キャリーチェーン
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

 <> 06Bash_symmetry.sh 対称解除法
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
';

declare -i TOTAL=0;
declare -i UNIQUE=0;
declare -a pres_a;        # チェーン
declare -a pres_b;        # チェーン
# declare -i COUNTER[3];    # カウンター 0:COUNT2 1:COUNT4 2:COUNT8
: 'B=(row     0:
      left    1:
      down    2:
      right   3:
      X[@]    4: 
      )';
declare -a B; 
# declare -i DISPLAY=0;
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
function solve_parallel()
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
    # 上記３行をまとめて書けます
    (( row>>=1,left<<=1,right>>=1 )); 
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
    # ret=$( solve_parallel "$row" "$(( (left|bit)<<1 ))" "$(( (down|bit) ))" "$(( (right|bit)>>1 ))")  ; 
    #  ret=$?;
    # [[ $ret -gt 0 ]] && { 
    # ((total+=$ret));
    # }  # solve_parallel()で実行したreturnの値は$?に入ります。
    # 上記はやや冗長なので以下２行にまとめることができます。
    solve_parallel "$row" "$(( (left|bit)<<1 ))" "$(( (down|bit) ))" "$(( (right|bit)>>1 ))"; 
    # solve_parallel()で実行したreturnの値は $? に入ります。
    ((total+=$?));  
  done
  return $total;  # 合計を戻り値にします
}
#
: 'solve_parallel()を呼び出して再帰を開始する';
function process_parallel()
{
  local -i size="$1";
  local -i sym="$2"; # COUNT2 COUNT4 COUNT8
  # B[0]:row B[1]:left B[2]:down B[3]:right
  solve_parallel "$(( B[0]>>2 ))" \
        "$(( B[1]>>4 ))" \
        "$(( (((B[2]>>2 | ~0<<size-4)+1)<<size-5)-1 ))" \
        "$(( B[3]>>4<<size-5 ))";
  local -i ret="$?";
  #(( COUNTER[$sym]+=$? ));
  echo "$ret" "$(( ret * sym ))";
}
#
: 'クイーンの効きをチェック';
function placement_parallel()
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
  #  （１はcarryChainSymmetry_parallel()内にあります）
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
  # [[ $DISPLAY ]] && board[$dimx]=$((1<<dimy));
  #
  return 1;
}
#
: 'キャリーチェーン対称解除法';
function carryChainSymmetry_parallel()
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
    process_parallel "$size" "8";  #COUNT8
    #
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    # ((DISPLAY==1))&& printRecordCarryChain "$size" "1";
    return;
  }
  # n,e,s==w の場合は最小値を確認する。
  # : '右回転で同じ場合は、
  # w=n=e=sでなければ値が小さいのでskip
  # w=n=e=sであれば90度回転で同じ可能性 ';
  ((s==w))&&{
    (( (n!=w)||(e!=w) ))&& return;
    process_parallel "$size" "2" # COUNT2
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    # ((DISPLAY==1))&& printRecordCarryChain "$size" "1";
    return ;
  }
  # : 'e==wは180度回転して同じ
  # 180度回転して同じ時n>=sの時はsmaller?  ';
  (( (e==w)&&(n>=s) ))&&{
    ((n>s))&& return ;
    process_parallel "$size" "4" # COUNT4
    # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
    # ((DISPLAY==1))&& printRecordCarryChain "$size" "1";
    return ;
  }
  process_parallel "$size" "8" ; #COUNT8
  # ボードレイアウト出力 # 出力 1:bitmap版 0:それ以外
  # ((DISPLAY==1))&& printRecordCarryChain "$size" "1";
  return ;
  #
}
function execChain_parallel()
{
  local -i size="$1";
  local -i w="$2";
  #
  # 元プロセスの配列変数をexportから子プロセスにコピー
  #
  pres_a=($_pres_a);
  pres_b=($_pres_b);
  B=($_B);
  #
  #
  local -a wB=sB=eB=nB=X; 
  B=("${wB[@]}");
  #
  # Bの初期化 #0:row 1:left 2:down 3:right 4:dimx
  #
  for ((bx_i=0;bx_i<size;++bx_i));do X[$bx_i]=-1; done
  B=([0]=0 [1]=0 [2]=0 [3]=0 [4]=${X[@]});
  #
  #
  # １　０行目と１行目にクイーンを配置
  placement_parallel "$size" "0" "$((pres_a[w]))"; 
  [[ $? -eq 0 ]] && return;
  placement_parallel "$size" "1" "$((pres_b[w]))";
  [[ $? -eq 0 ]] && return;
  #
  # ２ 90度回転
  #
  nB=("${B[@]}");
  local -i mirror=$(( (size-2)*(size-1)-w ));
  for ((n=w;n<mirror;++n));do 
    B=("${nB[@]}");
    placement_parallel "$size" "$((pres_a[n]))" "$((size-1))"; 
    [[ $? -eq 0 ]] && continue;
    placement_parallel "$size" "$((pres_b[n]))" "$((size-2))";
    [[ $? -eq 0 ]] && continue;
    #
    # ３ 90度回転
    #
    eB=("${B[@]}");
    for ((e=w;e<mirror;++e));do 
      B=("${eB[@]}");
      placement_parallel "$size" "$((size-1))" "$((size-1-pres_a[e]))"; 
      [[ $? -eq 0 ]] && continue;
      placement_parallel "$size" "$((size-2))" "$((size-1-pres_b[e]))"; 
      [[ $? -eq 0 ]] && continue;
      #
      # ４ 90度回転
      #
      sB=("${B[@]}");
      for ((s=w;s<mirror;++s));do
        B=("${sB[@]}")
        placement_parallel "$size" "$((size-1-pres_a[s]))" "0";
        [[ $? -eq 0 ]] && continue;
        placement_parallel "$size" "$((size-1-pres_b[s]))" "1"; 
        [[ $? -eq 0 ]] && continue;
        #
        #  対象解除法
        carryChainSymmetry_parallel "$n" "$w" "$s" "$e" ; 
        #
      done
    done
  done
}
: 'チェーンのビルド';
function buildChain_parallel()
{
  local -i size="$1";
  # local -a wB=sB=eB=nB=X; 
  wB=("${B[@]}");
  #
  # 並列処理に必要な export など
  #
  export -f printRecordCarryChain;
  export -f solve_parallel;
  export -f process_parallel;
  export -f placement_parallel;
  export -f carryChainSymmetry_parallel;
  export -f execChain_parallel;
  export size;
  export _pres_a=$(echo "${pres_a[@]}")
  export _pres_b=$(echo "${pres_b[@]}")
  export _B=$(echo "${B[@]}");
  local -i wMinus=$(( (size/2)*(size-3)));
  #
  # １ 上の２行に配置
  #
  # for ((w=0;w<=(size/2)*(size-3);++w));do
    #
    # 並列処理
    #
    GT=( $(echo "$(seq 0 $((wMinus-1)) )" | 
    xargs -I% -P$wMinus bash -c 'execChain_parallel $size %'|
    awk '{ 
      unique+=$1;
      total +=$2;
    }END{ 
      print unique " " total;
    }'))&& wait; 
    #
    # 集計
    UNIQUE=${GT[0]};
    TOTAL=${GT[1]};
  #
  # done
}
: 'チェーンの初期化';
function initChain_parallel()
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
function carryChain_parallel()
{
  local -i size="$1";
  initChain_parallel "$size";  # チェーンの初期化
  buildChain_parallel "$size"; # チェーンのビルド
}
#
: 'Nを連続して実行';
function NQ()
{
  local selectName="$1";
  local -i min=4;
  local -i max=15;
  local -i N="$min";
  local startTime=endTime=hh=mm=ss=0; 
  echo " N:        Total       Unique        hh:mm:ss" ;
  local -i N;
  for((N=min;N<=max;N++)){
    TOTAL=UNIQUE=0;
    # COUNTER[0]=COUNTER[1]=COUNTER[2]=0;    # カウンター配列
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
DISPLAY=0; # ボードレイアウト表示しない
#DISPLAY=1; # ボードレイアウト表示する
#
NQ carryChain_parallel; 
exit;
```

## 08Bash_carryChain_parallel.shの実行結果
08Bash_carryChain_parallel.shの実行結果は以下のとおりです。
Ｎが１５で１分４９秒かかりました。
対称解除の方が速度は早いのですが、Ｎが大きくなるに連れて肥大するメモリ使用量や、効率を考えると、かならずしも速度だけで判断はできず、長時間の稼動に耐えるためのさまざまな工夫がキャリーチェーンには埋め込まれています。

なんといっても、現段階で世界一となったＮ２７を叩き出したドイツ・ドレスデン大学のアルゴリズムです。
今回のBash版のキャリーチェーンは、上記大学が公開しているソースを極力ロジックや構造を変えることなく移植し、鈴木が独自の枝刈や最適化を施しチューニングしたものです。
自身を持って、Ｃ言語に移植して、さらなる高みを一緒に目指していきましょう。

```
  ## bash版
 <> 08Bash_carryChain_parallel.sh 並列処理
 N:        Total       Unique        hh:mm:ss
 4:            0            0         0:00:00
 5:            8            1         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:00
 8:           92           12         0:00:01
 9:          352           46         0:00:03
10:          724           92         0:00:15
11:         2680          341         0:00:52
12:        14200         1788         0:02:49
13:        73712         9237         0:09:18
14:       365596        45771         0:28:48
15:      2279184       285095         1:49:12
```

## Ｃ言語による移植第１号

```c:01GCC_carryChain.c
/**
 *
 * bash版キャリーチェーンのC言語版
 * 最終的に 08Bash_carryChain_parallel.sh のように
 * 並列処理 pthread版の作成が目的
 *
 * 今回のテーマ
 * 変数や関数の構造など極力同等に移植


 困ったときには以下のＵＲＬがとても参考になります。

 C++ 値渡し、ポインタ渡し、参照渡しを使い分けよう
 https://qiita.com/agate-pris/items/05948b7d33f3e88b8967
 値渡しとポインタ渡し
 https://tmytokai.github.io/open-ed/activity/c-pointer/text06/page01.html
 C言語 値渡しとアドレス渡し
 https://skpme.com/199/
 アドレスとポインタ
 https://yu-nix.com/archives/c-struct-pointer/


実行方法

bash-3.2$ gcc 01GCC_carryChain.c -o 01GCC && ./01GCC
Usage: ./01GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.00
11:         2680             341            0.01
12:        14200            1788            0.04
13:        73712            9237            0.12
14:       365596           45771            0.44
15:      2279184          285095            1.96
bash-3.2$


 
最適化オプション含め以下を参考に
bash$ gcc -Wall -W -O3 -mtune=native -march=native 07GCC_carryChain.c -o nq27 && ./nq27 -r
７．キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.00
11:         2680             341            0.00
12:        14200            1788            0.01
13:        73712            9237            0.05
14:       365596           45771            0.19
15:      2279184          285095            1.01
16:     14772512         1847425            6.10
17:     95815104        11979381           40.53


 bash-3.2$ gcc -Wall -W -O3 GCC12.c && ./a.out -r
１２．CPUR 再帰 対称解除法の最適化
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.00
11:         2680             341            0.00
12:        14200            1787            0.00
13:        73712            9233            0.01
14:       365596           45752            0.07
15:      2279184          285053            0.41
16:     14772512         1846955            2.66
17:     95815104        11977939           18.41
18:    666090624        83263591         2:14.44
19:   4968057848       621012754        17:06.46
*/
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sys/time.h>
#define MAX 27
// グローバル変数
typedef unsigned long long uint64_t;
uint64_t TOTAL=0; 
uint64_t UNIQUE=0;
uint64_t COUNTER[3];      //カウンター配列
unsigned int COUNT2=0;
unsigned int COUNT4=1;
unsigned int COUNT8=2;
typedef struct{
  uint64_t row;
  uint64_t down;
  uint64_t left;
  uint64_t right;
  uint64_t x[MAX];
}Board ;
//
//hh:mm:ss.ms形式に処理時間を出力
void TimeFormat(clock_t utime,char* form)
{
  int dd,hh,mm;
  float ftime,ss;
  ftime=(float)utime/CLOCKS_PER_SEC;
  mm=(int)ftime/60;
  ss=ftime-(int)(mm*60);
  dd=mm/(24*60);
  mm=mm%(24*60);
  hh=mm/60;
  mm=mm%60;
  if(dd)
    sprintf(form,"%4d %02d:%02d:%05.2f",dd,hh,mm,ss);
  else if(hh)
    sprintf(form,"     %2d:%02d:%05.2f",hh,mm,ss);
  else if(mm)
    sprintf(form,"        %2d:%05.2f",mm,ss);
  else
    sprintf(form,"           %5.2f",ss);
}
// ボード外側２列を除く内側のクイーン配置処理
uint64_t solve(uint64_t row,uint64_t left,uint64_t down,uint64_t right)
{
  if(down+1==0){ return  1; }
  while((row&1)!=0) { 
    row>>=1;
    left<<=1;
    right>>=1;
  }
  row>>=1;
  uint64_t total=0;
  for(uint64_t bitmap=~(left|down|right);bitmap!=0;){
    uint64_t const bit=bitmap&-bitmap;
    total+=solve(row,(left|bit)<<1,down|bit,(right|bit)>>1);
    bitmap^=bit;
  }
  return total;
} 
void process(unsigned const int size,unsigned const int sym,Board* B)
{
  COUNTER[sym]+=solve(B->row>>2,
  B->left>>4,((((B->down>>2)|(~0<<(size-4)))+1)<<(size-5))-1,(B->right>>4)<<(size-5));
}
// クイーンの効きをチェック
bool placement(unsigned const int size,uint64_t dimx,uint64_t dimy,Board* B)
{
  if(B->x[dimx]==dimy){ return true;  }  
  if (B->x[0]==0){
    if (B->x[1]!=(uint64_t)-1){
      if((B->x[1]>=dimx)&&(dimy==1)){ return false; }
    }
  }else{
    if( (B->x[0]!=(uint64_t)-1) ){
      if(( (dimx<B->x[0]||dimx>=size-B->x[0])
        && (dimy==0 || dimy==size-1)
      )){ return 0; } 
      if ((  (dimx==size-1)&&((dimy<=B->x[0])||
          dimy>=size-B->x[0]))){
        return 0;
      } 
    }
  }
  B->x[dimx]=dimy;                    //xは行 yは列
  uint64_t row=UINT64_C(1)<<dimx;
  uint64_t down=UINT64_C(1)<<dimy;
  uint64_t left=UINT64_C(1)<<(size-1-dimx+dimy); //右上から左下
  uint64_t right=UINT64_C(1)<<(dimx+dimy);       // 左上から右下
  if((B->row&row)||(B->down&down)||(B->left&left)||(B->right&right)){ return false; }     
  B->row|=row; B->down|=down; B->left|=left; B->right|=right;
  return true;
}
//チェーンの対称解除
void carryChain_symmetry(unsigned const int size,unsigned const int n,unsigned const int w,unsigned const int s,unsigned const int e,Board* B)
{
  unsigned const int ww=(size-2)*(size-1)-1-w;
  unsigned const int w2=(size-2)*(size-1)-1;
  // # 対角線上の反転が小さいかどうか確認する
  if((s==ww)&&(n<(w2-e))){ return ; }
  // # 垂直方向の中心に対する反転が小さいかを確認
  if((e==ww)&&(n>(w2-n))){ return; }
  // # 斜め下方向への反転が小さいかをチェックする
  if((n==ww)&&(e>(w2-s))){ return; }
  // 枝刈り １行目が角の場合回転対称チェックせずCOUNT8にする
  if(B->x[0]==0){ 
    process(size,COUNT8,B); return ;
  }
  // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
  // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
  if(s==w){ if((n!=w)||(e!=w)){ return; } 
    process(size,COUNT2,B); return;
  }
  // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
  if((e==w)&&(n>=s)){ if(n>s){ return; } 
    process(size,COUNT4,B); return;
  }
  process(size,COUNT8,B); return;
}
//チェーンのビルド
void buildChain(unsigned const int size,unsigned const int* pres_a,unsigned const int* pres_b)
{
  // Boardの構築
  Board B;
  // Board の初期化 nB,eB,sB,wB;
  B.row=0; B.down=0; B.left=0; B.right=0;
  // Board x[]の初期化
  for(unsigned int i=0;i<size;++i){ B.x[i]=-1; }
  // wB=B;//１ 上２行に置く
  Board wB;
  memcpy(&wB,&B,sizeof(Board));
  for(unsigned w=0;w<=(unsigned)(size/2)*(size-3);++w){
    // B=wB;
    memcpy(&B,&wB,sizeof(Board));
    if(!placement(size,0,pres_a[w],&B)){ continue; } 
    if(!placement(size,1,pres_b[w],&B)){ continue; }
    // nB=B;//２ 左２行に置く
    Board nB;
    memcpy(&nB,&B,sizeof(Board));
    for(unsigned n=w;n<(size-2)*(size-1)-w;++n){
      // B=nB;
      memcpy(&B,&nB,sizeof(Board));
      if(!placement(size,pres_a[n],size-1,&B)){ continue; }
      if(!placement(size,pres_b[n],size-2,&B)){ continue; }
      // eB=B;// ３ 下２行に置く
      Board eB;
      memcpy(&eB,&B,sizeof(Board));
      for(unsigned e=w;e<(size-2)*(size-1)-w;++e){
        // B=eB;
        memcpy(&B,&eB,sizeof(Board));
        if(!placement(size,size-1,size-1-pres_a[e],&B)){ continue; }
        if(!placement(size,size-2,size-1-pres_b[e],&B)){ continue; }
        // sB=B;// ４ 右２列に置く
        Board sB;
        memcpy(&sB,&B,sizeof(Board));
        for(unsigned s=w;s<(size-2)*(size-1)-w;++s){
          // B=sB;
          memcpy(&B,&sB,sizeof(Board));
          if(!placement(size,size-1-pres_a[s],0,&B)){ continue; }
          if(!placement(size,size-1-pres_b[s],1,&B)){ continue; }
          //
          carryChain_symmetry(size,n,w,s,e,&B);// 対称解除法 
          //
        }
      }    
    }
  }
}
//
void initChain(unsigned const int size,unsigned int* pres_a,unsigned int* pres_b)
{
  // チェーンの初期化
  unsigned int idx=0;
  for(unsigned int a=0;a<(unsigned)size;++a){
    for(unsigned int b=0;b<(unsigned)size;++b){
      if(((a>=b)&&(a-b)<=1)||((b>a)&&(b-a)<=1)){ continue; }
      pres_a[idx]=a;
      pres_b[idx]=b;
      ++idx;
    }
  }
}
// キャリーチェーン
void carryChain(unsigned const int size)
{
  unsigned int pres_a[930]; //チェーン
  unsigned int pres_b[930];
  // チェーンの初期化
  initChain(size,pres_a,pres_b);
  // カウンターの初期化
  COUNTER[COUNT2]=COUNTER[COUNT4]=COUNTER[COUNT8]=0;
  // チェーンのビルド
  buildChain(size,pres_a,pres_b);  
  // 集計
  UNIQUE=COUNTER[COUNT2]+COUNTER[COUNT4]+COUNTER[COUNT8];
  TOTAL=COUNTER[COUNT2]*2+COUNTER[COUNT4]*4+COUNTER[COUNT8]*8;
}
//メインメソッド
int main(int argc,char** argv)
{
  bool cpu=false,cpur=false;
  int argstart=2;
  if(argc>=2&&argv[1][0]=='-'){
    if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='r'||argv[1][1]=='R'){cpur=true;}
    else{ cpur=true;}
  }
  if(argc<argstart){
    printf("Usage: %s [-c|-g]\n",argv[0]);
    printf("  -c: CPU Without recursion\n");
    printf("  -r: CPUR Recursion\n");
  }
  printf("\n\n７．キャリーチェーン\n");
  printf("%s\n"," N:        Total       Unique        hh:mm:ss.ms");
  clock_t st;           //速度計測用
  char t[20];           //hh:mm:ss.msを格納
  unsigned int min=4;
  unsigned int targetN=21;
  // sizeはグローバル
  for(unsigned int size=min;size<=targetN;++size){
    TOTAL=UNIQUE; 
    st=clock();
    if(cpu){
      carryChain(size);
    }else{
      carryChain(size);
    }
    TimeFormat(clock()-st,t);
    printf("%2d:%13lld%16lld%s\n",size,TOTAL,UNIQUE,t);
  }
  return 0;
}
```

## 実行方法などの説明
実行方法は以下のとおりです。

```
bash-3.2$ gcc 01GCC_carryChain.c -o 01GCC && ./01GCC
Usage: ./01GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.00
11:         2680             341            0.01
12:        14200            1788            0.04
13:        73712            9237            0.12
14:       365596           45771            0.44
15:      2279184          285095            1.96
bash-3.2$
```
Bashでの実行は
```
15:      2279184          285095         1:49:12
```
Ｃでの実行は
```
15:      2279184          285095               1.96
```

Bashだと１分４９秒かかっていたのに対して、Ｃ言語に置き換えただけで、１秒になりました。
すごいですね。でももっともっと速くなります。

## Ｃ言語に移植するにあたって
Ｃ言語に移植するに当たって「Ｃはよくわからないから」と思うのは無理もありません。
でも大丈夫です。
難しいことはこちらでやります。安心してください。

いくつか知っておいたほうが良いことをピックアップしてご説明します。

### 実行
```
bash-3.2$ gcc 01GCC_carryChain.c -o 01GCC && ./01GCC
```

まず、`gcc`は、コマンドです。
GNUという組織が管理しているCのコンパイラという意味の略文字です。
`gcc`のバージョンが知りたければ
```
$ gcc --version
```
とすればよいです。
`gcc`コマンドの次にファイル名を指定します。
ここでは `01GCC_carryChain.c`を指定しています。
`-o`オプションは、実行ファイルの出力ファイル名を指定しています。
ここでは `01GCC`を指定しています。

`&&` は、そこまでの実行に問題がなければ、右側を実行という意味で、ここでは、`./01GCC`を実行します。
```
./01GCC -r 
```
または
```
./01GCC -c
```
を指定するUsage（使い方）が表示されていますが、現段階では、指定せずに実行しましょう。
いずれ、必要となるときにわかります。


### include インクルード
include は実行に必要なライブラリを指定して読み込みます。
不要なライブラリは読み込む必要がないので、列挙する必要はありませんが、書いてあってもコンパイラが考えて不要であれば除去した上で実行ファイルを生成します。

```c
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sys/time.h>
```

### グローバル変数
Bashは、全てグローバル変数です。
関数内で `local`をつけた場合に限って、関数内でのみ活きる変数として宣言されます。
Ｃは、関数の中で宣言された変数は「ローカル変数」、関数の外で宣言された変数は「グローバル変数」として扱われます。
以下は、グローバル変数となります。

```c
typedef unsigned long long uint64_t;
uint64_t TOTAL=0; 
uint64_t UNIQUE=0;
uint64_t COUNTER[3];      //カウンター配列
unsigned int COUNT2=0;
unsigned int COUNT4=1;
unsigned int COUNT8=2;
```

typedef の行は、`uint64_t`という型は`unsingned long long`です。という意味となります。
`unsigned` というのは、負の値がないという意味です。数値を扱うint でマイナスを扱わないのであれば、`unsigned int`とすればよいです。
`long` は`int` よりも桁数が大きな変数となります。
`long long`は`long`よりもさらに桁数が大きな型です。

Ｎクイーンは、桁数が猛烈に大きな計算処理を行うので、`long long`であり、マイナスを扱うことがないものは`unsigned`をつけてあるということになります。

### 構造体
Ｃ言語では構造体をよく使います。
Ｃ＋＋やＪａｖａではクラスが似ています。
変数のグループを一つにまとめて管理できるので便利です。
いずれわかることなので、あらためて勉強する必要はありません。

動かしながら自然と身に着けていくことこそが、長く続けられる秘訣です。
楽しみながらやりましょう。

### 関数
関数名の前に `void`とかついてますね。Bashにはありませんでしたが、「return で値を返すときの型」を書きます。なにも値を返す必要のない関数であれば「void」にして、関数の末尾で`return`する必要もありません。

関数のパラメーターには、呼び出し元から渡される変数が列挙されます。
Bashでは、`$1`,`$2`という扱いでしたが、Ｃ言語では、逐一列挙して明示する必要があります。

ここでは、`int`の変数を渡した場合、関数のパラメータで受け取る場合は、方が同じである必要があります。
先に説明した通り、マイナスの要素がない場合は、メモリを省力化できるので、`unsigned`をつけます。

さらに、パラメータの変数を関数内で参照するだけであれば、言い換えれば、関数内でパラメータの変数を参照するだけではなく、変更をしないのであれば、`const`をつけます。

こうした「制限」をつけることによって自助努力でバグを少なくしていくことに繋がります。

## アドレスとポインタ
あまりここでは深く理解する必要はありません。

 困ったときには以下のＵＲＬがとても参考になります。

 C++ 値渡し、ポインタ渡し、参照渡しを使い分けよう
 https://qiita.com/agate-pris/items/05948b7d33f3e88b8967
 値渡しとポインタ渡し
 https://tmytokai.github.io/open-ed/activity/c-pointer/text06/page01.html
 C言語 値渡しとアドレス渡し
 https://skpme.com/199/
 アドレスとポインタ
 https://yu-nix.com/archives/c-struct-pointer/


 まずは、実行して結果を見てください。
 それだけでよいのです。ではまた次をお楽しみに。


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

