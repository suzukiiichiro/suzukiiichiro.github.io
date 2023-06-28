---
title: "Ｎクイーン問題（１６）第三章　対象解除法 ソース解説"
date: 2023-04-18T15:33:57+09:00
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

## 対象解除法について
では、前項のつづきから。

対象解除法のソースは４つの関数で構成されています。

１．printRecord()
  解を発見するたびにボードレイアウトを表示します。
  以降、新しい枝刈りポイントを発見するためにも使います。
  board[]を使ってＱの位置を確認するのに役立ちます。

２．symmetryOps()
  対象解除を行うロジックメソッドです。
  以下のロジックが同梱されています。
  
  １．クイーンが右上角にある場合、ユニーク解が属するグループの要素数は必ず８個(＝２×４)
  ２．クイーンが右上角以外にある場合、
```
(1) 90度回転させてオリジナルと同型になる場合、さらに90度回転(オリジナルから180
度回転)させても、さらに90度回転(オリジナルから270度回転)させてもオリジナルと同
型になる。
こちらに該当するユニーク解が属するグループの要素数は、左右反転させたパター ンを
加えて２個しかありません。
(2) 90度回転させてオリジナルと異なる場合は、270度回転させても必ずオリジナルとは
  異なる。ただし、180度回転させた場合はオリジナルと同型になることも有り得る。
こちらに該当するユニーク解が属するグループの要素数は、180度回転させて同型になる
  場合は４個(左右反転×縦横回転)
(3)180度回転させてもオリジナルと異なる場合は、８個(左右反転×縦横回転×上下反転)
```

３．backTrack()
  再帰ロジックで作られています。
  右上角にＱが配置されているかいないかで判定処理が分岐されます。
  その判定処理に従って、見合った枝刈りが行われます。

４．symmetry()
  本体メソッドです。
  こちらのメソッドでは、Ｑが角に配置されている場合、そうでない場合を分岐して３のbackTrack()に渡します。


## symmetry()メソッド
### 角にＱがある時の処理
symmetry()メソッドは、Ｑが角にあるかどうかを判定し、適切にbackTrack()に処理を渡します。

では上から順番に見ていきます。
とても大切なことなのですが、グローバル変数の初期化を行います。
```bash
  TOTAL=UNIQUE=COUNT2=COUNT4=COUNT8=0;
```

角にＱがある時のボードのイメージは以下のとおりです。

```
  角にQがある時の処理
    +-+-+-+-+-+  
    | | | | |Q| 
    +-+-+-+-+-+  
    | | | | | | 
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

MASKについてですが、こちらはrow全体にビットを立てて配置済みとするフィルタのことです。

Ｎ５の場合、 １０進数では３１、２進数では 11111 となります。

```bash
MASK=$(( (1<<size)-1 ));
    +-+-+-+-+-+  
    |M|M|M|M|M|  MASK=$(( (1<<size)-1 )) 
    +-+-+-+-+-+  $(( (1<<5)-1 )):31
    | | | | | |  $(( 2#11111 )) 
    +-+-+-+-+-+  $ 31
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
  ```

bashでは以下のようにすると２進数を１０進数に変換して表示することができます。
```bash
$ echo $(( 2#11111 ))
$ 31
```

TOPBITは左上角にビットを立てたものです。
```bash
  TOPBIT=$(( 1<<(size-1) )); 
    +-+-+-+-+-+  
    |T| | | | |  TOPBIT=$(( 1<<(size-1) ))
    +-+-+-+-+-+  $(( (1<<(5-1) )):16 
    | | | | | |  $(( 2#10000 )) 
    +-+-+-+-+-+  $ 16 
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

ENDBITはTOPBITの１つ右にビットを立てたものです。現在はまだ初期値０のままです。
後述しますがENDBITは、
```bash
ENDBIT=$(( TOPBIT>>1 ));
```
となります。

```bash
  ENDBIT=LASTMASK=SIDEMASK=0;
    ０は何も置かない（なにもはじまってない）
    +-+-+-+-+-+  
    |T|E| | | |  0#01000
    +-+-+-+-+-+  
    | | | | | | 
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

配列BOUND1とBOUND2を初期化して
Ｑを右上角に配置します。
```bash
  BOUND1=2; BOUND2=0;
```

```
    +-+-+-+-+-+  右角から１つ左から開始
    | | | |B| |  BOUND1は右から左へシフト
    +-+-+-+-+-+   
    | | | | | | 
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```
```
    +-+-+-+-+-+  左角から１つ右から開始
    | |B| | | |  BOUND2は左から右へシフトします。
    +-+-+-+-+-+  
    | | | | | | 
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

ここはすごく重要で、row[0]の１というのは右上の角のことを意味します。ですので、「Ｑを右上角に配置した」ということになります。
```bash
  board[0]=1;       # Qを右上角に配置
```

ここで、rowは２行目の処理に入ります。
というのも、１行目は右上角にＱを配置したので次に進んだわけです。

その後、以下の行は「２行目の真ん中にＱを配置する」という意味となります。
```bash
      bit=$(( 1<<BOUND1 ));
```

イメージでは以下のとおりです。
```bash
       Ｎ５の場合、BOUND1は２と３になる
        (( 1<<BOUND1 )) ２行目は真ん中に置く
        +-+-+-+-+-+  
        | | | | |Q|  1#00001
        +-+-+-+-+-+  
        | | |B| | |  BOUND1=2 4#00100
        +-+-+-+-+-+  $(( 1<<2 ))
        | | | | | |  $ 4
        +-+-+-+-+-+  1->2->4               
        | | | | | | 
        +-+-+-+-+-+ 
        | | | | | |      
        +-+-+-+-+-+  
```

さらに、処理の中でBOUND1は左に１つシフトします。
```bash
        (( 1<<BOUND1 )) ２行目は真ん中の次に置く
        +-+-+-+-+-+  
        | | | | |Q|  1#00001
        +-+-+-+-+-+  
        | |B| | | |  BOUND1=3 8#01000
        +-+-+-+-+-+  $(( 1<<3 ))
        | | | | | |  $ 8
        +-+-+-+-+-+  1->2->4->8             
        | | | | | | 
        +-+-+-+-+-+ 
        | | | | | |      
        +-+-+-+-+-+  
```

### 角にＱがない時の処理
TOPBITは先程も書いたとおり、左上角にビットを立てた状態を示します。
```bash
  TOPBIT=$(( 1<<(size-1) )); 
    +-+-+-+-+-+  
    |T| | | | | TOPBIT=$(( 1<<(size-1) ))
    +-+-+-+-+-+ $(( 2#10000 )) 
    | | | | | | $ 16 
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

ENDBITは、TOPBITの１つ右にビットを立てた状態です。
```bash
  ENDBIT=$(( TOPBIT>>1 ));
    +-+-+-+-+-+  
    |T|E| | | | ENDBIT=$(( TOPBIT>>1 ))
    +-+-+-+-+-+ $(( 2#01000 )) 
    | | | | | | $ 8
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

SIDEMASKは行の両サイドの角にビットを立てた状態を示します。
```bash
  SIDEMASK=$(( TOPBIT|1 ));
    +-+-+-+-+-+  
    |S| | | |S| SIDEMASK=$(( TOPBIT|1 ))
    +-+-+-+-+-+ $(( 2#10001 )) 
    | | | | | | $ 17
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

LASTMASKもSIDEMASK同様左右の角のビットを立てた状態を示します。ただ使いみちとしては、上記の状態でも使えるわけですが、
```bash
  LASTMASK=$(( TOPBIT|1 )); 
    +-+-+-+-+-+  
    |L| | | |L| LASTMASK=$(( TOPBIT|1 ))
    +-+-+-+-+-+ $(( 2#10001 )) 
    | | | | | | $ 17
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

こういうシチュエーションで使います。
```bash
  LASTMASK=$(( TOPBIT|1 )); 
    +-+-+-+-+-+  
    | | | | | | LASTMASK=$(( TOPBIT|1 ))
    +-+-+-+-+-+ $(( 2#10001 )) 
    | | | | | | $ 17
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    |L| | | |L|      
    +-+-+-+-+-+  
```

ENDBITは左角の１つ手前から右へシフトするビットです。
```bash
    ENDBIT=$(( ENDBIT>>1 ));
      +-+-+-+-+-+  
      |T|E| | | | ENDBIT=$(( TOPBIT>>1 ))
      +-+-+-+-+-+ $(( 2#01000 )) 
      | | | | | | $ 8
      +-+-+-+-+-+  
      | | | | | |       
      +-+-+-+-+-+             
      | | | | | | 
      +-+-+-+-+-+ 
      | | | | | |      
      +-+-+-+-+-+  
           ↓
      +-+-+-+-+-+  
      |T| |E| | | ENDBIT=$(( ENDBIT>>1 ))
      +-+-+-+-+-+ $(( 2#00100 )) 
      | | | | | | $ 4
      +-+-+-+-+-+  
      | | | | | |       
      +-+-+-+-+-+             
      | | | | | | 
      +-+-+-+-+-+ 
      | | | | | |      
      +-+-+-+-+-+  
```

LASTMASKに代入されるビットは以下のイメージとなります。使いみちはLASTMASKと似ていますが、
```bash
    +-+-+-+-+-+  
    |L|L| |L|L| LASTMASK=$(( LASTMASK<<1 | LASTMASK | LASTMASK>>1 ))
    +-+-+-+-+-+ $(( 2#11011 )) 
    | | | | | | $ 27
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    | | | | | |      
    +-+-+-+-+-+  
```

こういったシチュエーションにも使います。
```bash
    +-+-+-+-+-+  
    | | | | | | LASTMASK=$(( LASTMASK<<1 | LASTMASK | LASTMASK>>1 ))
    +-+-+-+-+-+ $(( 2#11011 )) 
    | | | | | | $ 27
    +-+-+-+-+-+  
    | | | | | |       
    +-+-+-+-+-+             
    | | | | | | 
    +-+-+-+-+-+ 
    |L|L| |L|L|      
    +-+-+-+-+-+  
```


##  backTrack()メソッド
### 角にＱがある時の処理
このメソッドでは、角にＱがある場合の処理、ない場合の処理の分岐があり、その分岐の中で、`((COUNT8++))`であったり、`symmetryOps`といった対象解除の処理へ進んだり、はたまた「枝刈り」をしたりと、濃厚なメソッドです。

では、順番に見ていきます。

ここは、Ｑが角にある場合の処理で、rowが最終行までたどり着いた（配置できた）場合の処理となります。グループの要素数は必ず８あるわけですので、あとから８倍する`COUNT8`をインクリメントします。
```bash
        １．クイーンが右上角にある場合、ユニーク解が属する
        グループの要素数は必ず８個(＝２×４)
        ';
        board[$row]="$bitmap";
        if ((DISPLAY==1));then
          printRecord "$size" 1 ;
        fi
        ((COUNT8++)) ;              # 角にある場合は８倍するカウンター
```

次は、Ｑが角にある場合の処理で、
        上から２行目のクイーンの位置が左から何番目にあるかと、
        右から２列目のクイーンの位置が上から何番目にあるかを、
        比較するだけで判定します。
        具体的には、２行目と２列目の位置を数値とみなし、
        ２行目＜２列目という条件を課せばよい
という枝仮ルールを実現している処理となります。
```bash
    if (( corner ));then            # Qが角にある
      if ((row<BOUND1));then        # 枝刈り
         bitmap=$(( bitmap|2 ));
         bitmap=$(( bitmap^2 ));
        : '
        上から２行目のクイーンの位置が左から何番目にあるかと、
        右から２列目のクイーンの位置が上から何番目にあるかを、
        比較するだけで判定します。
        具体的には、２行目と２列目の位置を数値とみなし、
        ２行目＜２列目という条件を課せばよい
        結論： 以下の図では、１，２，４を枝刈りを入れる
          
          +-+-+-+-+-+  
          | | | |X|Q| 
          +-+-+-+-+-+  
          | |Q| |X| |  8（左から数えて１，２，４，８）
          +-+-+-+-+-+  
          | | | |X| |       
          +-+-+-+-+-+             
          | | | |Q| |  8（上から数えて１，２，４，８） 
          +-+-+-+-+-+ 
          | | | | | |      
          +-+-+-+-+-+  
        ';
      fi

```

たったこれだけの２行ですごいですね。
```bash
         bitmap=$(( bitmap|2 ));
         bitmap=$(( bitmap^2 ));
```

### 角にＱがない時の処理
ここは少しわかりにくいですね。丁寧に説明文を入れましたので、じっくりと理解してみてください。
```bash
    else                            # Qが角にない
      : '
      オリジナルがユニーク解であるためには先ず、
      前提：symmetryOpsは回転・鏡像変換により得られる状態の
      ユニーク値を比較し最小のものだけがユニーク解となるようにしている。
      Qができるだけ右に置かれている方がユニーク値は小さい。
      例えば1行目の2列目にQが置かれている方が3列目に置かれているより
      ユニーク値は小さくユニーク解に近い。
      1行目のクイーンの位置が同じなら2行目のクイーンの位置がより右の
      列におかれているものがユニーク値は小さくユニーク解に近い。

      下図の X への配置は禁止されます。
      Qの位置より右位置の８対象位置（X）にクイーンを置くことはできない。
      置いた場合回転・鏡像変換したユニーク値が最小にならなくなり、symmetryOps
      で負けるので枝刈りをする


      1行目のクイーンが3列目に置かれている場合
      +-+-+-+-+-+-+-+-+  
      |X|X| | | |Q|X|X| 
      +-+-+-+-+-+-+-+-+  
      |X| | | | | | |X| 
      +-+-+-+-+-+-+-+-+  
      | | | | | | | | |       
      +-+-+-+-+-+-+-+-+             
      | | | | | | | | | 
      +-+-+-+-+-+-+-+-+ 
      | | | | | | | | |      
      +-+-+-+-+-+-+-+-+  
      | | | | | | | | |
      +-+-+-+-+-+-+-+-+
      |X| | | | | | |X|
      +-+-+-+-+-+-+-+-+
      |X|X| | | | |X|X|
      +-+-+-+-+-+-+-+-+

      1行目のクイーンが4列目に置かれている場合
      +-+-+-+-+-+-+-+-+  
      |X|X|X| |Q|X|X|X| 
      +-+-+-+-+-+-+-+-+  
      |X| | | | | | |X| 
      +-+-+-+-+-+-+-+-+  
      |X| | | | | | |X|       
      +-+-+-+-+-+-+-+-+             
      | | | | | | | | | 
      +-+-+-+-+-+-+-+-+ 
      | | | | | | | | |      
      +-+-+-+-+-+-+-+-+  
      |X| | | | | | |X|
      +-+-+-+-+-+-+-+-+
      |X| | | | | | |X|
      +-+-+-+-+-+-+-+-+
      |X|X|X| | |X|X|X|
      +-+-+-+-+-+-+-+-+

      プログラムではこの枝刈を上部サイド枝刈り、下部サイド枝刈り、最下段枝刈り
      の3か所で行っている
      それぞれ、1,2,3の数字で表すと以下の通り

      1行目のクイーンが3列目に置かれている場合
      +-+-+-+-+-+-+-+-+  
      |X|X| | | |Q|X|X| 
      +-+-+-+-+-+-+-+-+  
      |1| | | | | | |1| 
      +-+-+-+-+-+-+-+-+  
      | | | | | | | | |       
      +-+-+-+-+-+-+-+-+             
      | | | | | | | | | 
      +-+-+-+-+-+-+-+-+ 
      | | | | | | | | |      
      +-+-+-+-+-+-+-+-+  
      | | | | | | | | |
      +-+-+-+-+-+-+-+-+
      |2| | | | | | |2|
      +-+-+-+-+-+-+-+-+
      |2|3| | | | |3|2|
      +-+-+-+-+-+-+-+-+
      1行目にXが残っているが当然Qの効き筋なので枝刈する必要はない
      ';
      if ((row<BOUND1));then        # 上部サイド枝刈り
        bitmap=$(( bitmap|SIDEMASK ));
        bitmap=$(( bitmap^=SIDEMASK ));
      fi
      if ((row==BOUND2));then       # 下部サイド枝刈り
        if (( !(down&SIDEMASK) ));then
          return ;
        fi
        if (( (down&SIDEMASK)!=SIDEMASK ));then
          bitmap=$(( bitmap&SIDEMASK ));
        fi
      fi
    fi
```

## symmetryOps()メソッド
ここもロジックを理解するところから初めて見ると良いと思います。
あまり細かいことを考えるよりも、大枠でどんなときにこのメソッドが呼ばれ、カウンターがいつインクリメントするのか、などを掴んだほうが良いと思います。

symmetryOps()では以下を実現しています。

  ２．クイーンが右上角以外にある場合、
  (1) 90度回転させてオリジナルと同型になる場合、さらに90度回転(オリジナルか
  ら180度回転)させても、さらに90度回転(オリジナルから270度回転)させてもオリ
  ジナルと同型になる。
  こちらに該当するユニーク解が属するグループの要素数は、左右反転させたパター
  ンを加えて２個しかありません。
  ２．クイーンが右上角以外にある場合、
    (2) 90度回転させてオリジナルと異なる場合は、270度回転させても必ずオリジナル
    とは異なる。ただし、180度回転させた場合はオリジナルと同型になることも有り得
    る。こちらに該当するユニーク解が属するグループの要素数は、180度回転させて同
    型になる場合は４個(左右反転×縦横回転)
  ２．クイーンが右上角以外にある場合、
    (3)180度回転させてもオリジナルと異なる場合は、８個(左右反転×縦横回転×上下反転)

  クイーンの利き筋を辿っていくと、オリジナルがユニーク解ではない可能性があり、
  それは下図の A,B,C の位置のどこかにクイーンがある場合に限られます。
  symmetryOpsは、以下の図のＡ，Ｂ，ＣにＱが置かれた場合にユニーク解かを判定します。
  原型と、90,180,270回転させたもののユニーク値を比較します。

```
     0 1 2 3 4 
    +-+-+-+-+-+  
    | | | | |Q|    4
    +-+-+-+-+-+  
    | | |Q| | |    2 
    +-+-+-+-+-+  
    |Q| | | | |    0  ----> 4 2 0 3 1 （ユニーク判定値）
    +-+-+-+-+-+             数が大きい方をユニークとみなす 
    | | | |Q| |    3
    +-+-+-+-+-+  
    | |Q| | | |    1 
    +-+-+-+-+-+  

     0 1 2 3 4     左右反転！
    +-+-+-+-+-+  
    |Q| | | | |    0
    +-+-+-+-+-+  
    | | |Q| | |    2 
    +-+-+-+-+-+  
    | | | | |Q|    4  ----> 0 2 4 1 3 
    +-+-+-+-+-+            数が小さいのでユニーク解とはしません 
    | |Q| | | |    1
    +-+-+-+-+-+  
    | | | |Q| |    3 
    +-+-+-+-+-+  
```

  Qができるだけ右に置かれている方がユニーク値は大きくなります。
  例えば1行目の2列目にQが置かれている方が、
  3列目に置かれているよりユニーク値は大きくユニーク解に近い。
  1行目のクイーンの位置が同じなら2行目のクイーンの位置がより右の列におかれてい
  るものがユニーク値は大きくユニーク解に近くなります。
  それ以外はユニーク解なのでCOUNT8にする

```
   +-+-+-+-+-+-+-+-+  
   |X|X| | | |Q|X|X| 
   +-+-+-+-+-+-+-+-+  
   |X| | | |x|x|x|X| 
   +-+-+-+-+-+-+-+-+  
   |C| | |x| |x| |x|       
   +-+-+-+-+-+-+-+-+             
   | | |x| | |x| | | 
   +-+-+-+-+-+-+-+-+ 
   | |x| | | |x| | |      
   +-+-+-+-+-+-+-+-+  
   |x| | | | |x| |A|
   +-+-+-+-+-+-+-+-+
   |X| | | | |x| |X|
   +-+-+-+-+-+-+-+-+
   |X|X|B| | |x|X|X|
   +-+-+-+-+-+-+-+-+
```

   Aの場合 右90度回転   board[BOUND2]==1
   Bの場合 右180度回転  board[size-1]==ENDBIT
   Cの場合 右270度回転  board[BOUND1]==TOPBIT






## symmetry.sh プログラムソース
対象解除法を実装したソースは以下のとおりです。

```bash:symmetry.sh
#!/usr/bin/bash
# グローバル変数
declare -i size;
declare -a board;
declare -i bit;
declare -i DISPLAY=0;   # ボード出力するか
declare -i TOTAL=UNIQUE=0;
declare -i COUNT2=COUNT4=COUNT8=0;
declare -i MASK=SIDEMASK=LASTMASK=0;
declare -i TOPBIT=ENDBIT=0;
declare -i BOUND1=BOUND2=0;
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
          echo -n "Q";
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
        board[$row]="$bitmap";     # Qを配置
        symmetryOps ;             # 対象解除
      fi
    fi
  else
    if ((row<BOUND1));then        # 上部サイド枝刈り
      bitmap=$(( bitmap|SIDEMASK ));
      bitmap=$(( bitmap^SIDEMASK ));
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
      board[$row]="$bit"             # Qを配置
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
      board[$row]="$bit"           # Qを配置
      symmetry_backTrack_corner $((row+1)) $(((left|bit)<<1))  $((down|bit)) $(((right|bit)>>1));
    done
  fi
}
#
: '再帰版 対象解除';
function symmetry()
{
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
  BOUND2=$size-2;
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
# 実行 
DISPLAY=0; # DISPLAY表示をしない
#DISPLAY=1;# DISPLAY表示をする

# size=5;
# #symmetry ;   # 再帰
# symmetry_NR ; # 非再帰
# echo "SIZE:$size TOTAL:$TOTAL UNIQUE:$UNIQUE";
# echo "COUNT2:$COUNT2 COUNT4:$COUNT4 COUNT8:$COUNT8";

size=9;
#symmetry ;   # 再帰
symmetry_NR ; # 非再帰
echo "SIZE:$size TOTAL:$TOTAL UNIQUE:$UNIQUE";
echo "COUNT2:$COUNT2 COUNT4:$COUNT4 COUNT8:$COUNT8";
exit;
```

## 実行結果
```
bash-3.2$ bash symmetry.sh
SIZE:5 TOTAL:10 UNIQUE:2
COUNT2:1 COUNT4:0 COUNT8:1
SIZE:8 TOTAL:92 UNIQUE:12
COUNT2:0 COUNT4:1 COUNT8:11
bash-3.2$
```



## まとめ版ソース
ブルートフォース、バックトラック、配置フラグ、ビットマップ、ミラー、対象解除それぞれの再帰と非再帰、さらにはボードレイアウト出力を指定して実行できるすぐれものです。

```bash:matome5.sh
#!/usr/bin/bash

declare -i size;
declare -a board;
declare -i bit;
declare -i DISPLAY=0;   # ボード出力するか
declare -i TOTAL=UNIQUE=0;
declare -i COUNT2=COUNT4=COUNT8=0;
declare -i MASK=SIDEMASK=LASTMASK=0;
declare -i TOPBIT=ENDBIT=0;
declare -i BOUND1=BOUND2=0;

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
  local -i max=17;
  local -i min=4;
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
    TOTAL=0; UNIQUE=0; COUNT2=0; row=0;
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


## 実行結果
```
bash-3.2$ bash 

エイト・クイーン メニュー
実行したい番号を選択
6) 対象解除法
5) ミラー
4) ビットマップ
3) 配置フラグ
2) バックトラック
1) ブルートフォース

echo 行頭の番号を入力してください;

6

      y|Y) ボード画面表示をする
      n|N) ボード画面表示をしない
      n

      y|Y) 再帰
      n|N) 非再帰
      y
 N:        Total       Unique        hh:mm:ss
 4:            2            1         0:00:00
 5:           10            2         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:00
 8:           92           12         0:00:00
 9:          352           46         0:00:01
10:          724           92         0:00:01
11:         2680          341         0:00:09
12:        14200         1787         0:00:42
bash-3.2$
```



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










