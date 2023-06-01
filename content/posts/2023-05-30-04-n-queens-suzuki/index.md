---
title: "Ｎクイーン問題（２４）第六章 C言語移植 その４"
description: "carryChain()のpres_a[]とpres_b[]は並列化した際、スレッドごとに値が変化するものではないため、グローバル変数へ。さらに構造体Globalを作成し、Global構造体へpres_a[]とpres_b[]を格納、Globalはスレッドごとに変化しない、またはスレッドから公平にアクセスできる変数を格納することとします。"
date: 2023-05-30T13:22:56+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
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

## Global構造体の新設
carryChain()のpres_a[]とpres_b[]は並列化した際、スレッドごとに値が変化するものではないため、グローバル変数へ。さらに構造体Globalを作成し、Global構造体へpres_a[]とpres_b[]を格納、Globalはスレッドごとに変化しない、またはスレッドから公平にアクセスできる変数を格納することとします。


04GCC_carryChain.c
+110
```c
// 構造体
typedef struct{
  unsigned int pres_a[930]; 
  unsigned int pres_b[930];
}Global; Global g;
```

COUNT2,COUNT4,COUNT8変数は復活しました（ｗ
04GCC_carryChain.c
+104
```c
//カウンター配列
uint64_t COUNTER[3];      
unsigned int COUNT2=0;
unsigned int COUNT4=1;
unsigned int COUNT8=2;
```

ですので、以下の部分（４箇所あります）を修正します。
04GCC_carryChain.c
+266,271,275,277
```c
            process(size,2,&B); continue ;
            ↓
            process(size,COUNT8,&B); continue ;
```


集計処理を別関数にしました。
04GCC_carryChain.c
+143
```c
// 集計
void calcChain()
{
  UNIQUE=COUNTER[COUNT2]+COUNTER[COUNT4]+COUNTER[COUNT8];
  TOTAL=COUNTER[COUNT2]*2+COUNTER[COUNT4]*4+COUNTER[COUNT8]*8;
}
```

Global g 構造体に移動した pres_a,pres_bは g.pres_a,g.pres_bでアクセスすることができます。

04GCC_carryChain.c
+208
```c
  for(unsigned int a=0;a<(unsigned)size;++a){
    for(unsigned int b=0;b<(unsigned)size;++b){
      if(((a>=b)&&(a-b)<=1)||((b>a)&&(b-a)<=1)){ continue; }
      g.pres_a[idx]=a;
      g.pres_b[idx]=b;
      ++idx;
    }
  }
```

チェーンのビルド部分も同様となります。
04GCC_carryChain.c
+228
```c
    if(!placement(size,0,g.pres_a[w],&B)){ continue; } 
    if(!placement(size,1,g.pres_b[w],&B)){ continue; }
```



## ソースコード
```c:04GCC_carryChain.c
/**
 *
 * bash版キャリーチェーンのC言語版
 * 最終的に 08Bash_carryChain_parallel.sh のように
 * 並列処理 pthread版の作成が目的
 *
 * 今回のテーマ
 * carryChain()に入れてあった pres_a[]とpres_b[]は並列化した際に、
 * スレッドごとに値が変化するものではないので、グローバルへ移動
 * さらに構造体Globalを作成し、Globalへ pres_a[]とpres_b[]を格納
 * Globalはスレッドごとに変化しない、またはスレッドから公平にア
 * クセスできる変数を格納する
 *
 * これにより、pthread導入時の 構造体１つしか渡せない問題に対応
 * スレッドごとに変数を参照する煩わしさ

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
bash-3.2$ gcc 04GCC_carryChain.c -o 04GCC && ./04GCC
Usage: ./04GCC [-c|-g]
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
14:       365596           45771            0.43
15:      2279184          285095            1.95
bash-3.2$


最適化オプション含め以下を参考に
bash$ gcc -Wall -W -O3 -mtune=native -march=native 07GCC_carryChain.c -o nq27 && ./nq27 -r
７．キャリーチェーン
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
//カウンター配列
uint64_t COUNTER[3];      
unsigned int COUNT2=0;
unsigned int COUNT4=1;
unsigned int COUNT8=2;
// 構造体
typedef struct{
  unsigned int pres_a[930]; 
  unsigned int pres_b[930];
}Global; Global g;
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
// 集計
void calcChain()
{
  UNIQUE=COUNTER[COUNT2]+COUNTER[COUNT4]+COUNTER[COUNT8];
  TOTAL=COUNTER[COUNT2]*2+COUNTER[COUNT4]*4+COUNTER[COUNT8]*8;
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
// solve()を呼び出して再帰を開始する
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
// キャリーチェーン
void carryChain(unsigned const int size)
{
  // カウンターの初期化
  COUNTER[COUNT2]=COUNTER[COUNT4]=COUNTER[COUNT8]=0;
  // チェーンの初期化
  unsigned int idx=0;
  for(unsigned int a=0;a<(unsigned)size;++a){
    for(unsigned int b=0;b<(unsigned)size;++b){
      if(((a>=b)&&(a-b)<=1)||((b>a)&&(b-a)<=1)){ continue; }
      g.pres_a[idx]=a;
      g.pres_b[idx]=b;
      ++idx;
    }
  }
  // チェーンのビルド
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
    if(!placement(size,0,g.pres_a[w],&B)){ continue; } 
    if(!placement(size,1,g.pres_b[w],&B)){ continue; }
    // nB=B;//２ 左２行に置く
    Board nB;
    memcpy(&nB,&B,sizeof(Board));
    for(unsigned n=w;n<(size-2)*(size-1)-w;++n){
      // B=nB;
      memcpy(&B,&nB,sizeof(Board));
      if(!placement(size,g.pres_a[n],size-1,&B)){ continue; }
      if(!placement(size,g.pres_b[n],size-2,&B)){ continue; }
      // eB=B;// ３ 下２行に置く
      Board eB;
      memcpy(&eB,&B,sizeof(Board));
      for(unsigned e=w;e<(size-2)*(size-1)-w;++e){
        // B=eB;
        memcpy(&B,&eB,sizeof(Board));
        if(!placement(size,size-1,size-1-g.pres_a[e],&B)){ continue; }
        if(!placement(size,size-2,size-1-g.pres_b[e],&B)){ continue; }
        // sB=B;// ４ 右２列に置く
        Board sB;
        memcpy(&sB,&B,sizeof(Board));
        for(unsigned s=w;s<(size-2)*(size-1)-w;++s){
          // B=sB;
          memcpy(&B,&sB,sizeof(Board));
          if(!placement(size,size-1-g.pres_a[s],0,&B)){ continue; }
          if(!placement(size,size-1-g.pres_b[s],1,&B)){ continue; }
          //
          // 対称解除法 
          unsigned const int ww=(size-2)*(size-1)-1-w;
          unsigned const int w2=(size-2)*(size-1)-1;
          // # 対角線上の反転が小さいかどうか確認する
          if((s==ww)&&(n<(w2-e))){ continue ; }
          // # 垂直方向の中心に対する反転が小さいかを確認
          if((e==ww)&&(n>(w2-n))){ continue; }
          // # 斜め下方向への反転が小さいかをチェックする
          if((n==ww)&&(e>(w2-s))){ continue; }
          // 枝刈り １行目が角の場合回転対称チェックせずCOUNT8にする
          if(B.x[0]==0){ 
            process(size,COUNT8,&B); continue ;
          }
          // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
          // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
          if(s==w){ if((n!=w)||(e!=w)){ continue; } 
            process(size,COUNT2,&B); continue;
          }
          // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
          if((e==w)&&(n>=s)){ if(n>s){ continue; } 
            process(size,COUNT4,&B); continue;
          }
          process(size,COUNT8,&B); continue;
          //
        }
      }    
    }
  }
  calcChain();// 集計
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

## 実行結果
```
bash-3.2$ gcc 04GCC_carryChain.c -o 04GCC && ./04GCC
Usage: ./04GCC [-c|-g]
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
14:       365596           45771            0.43
15:      2279184          285095            1.95
bash-3.2$
```

## リンクと過去記事
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

エイト・クイーンのプログラムアーカイブ 
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens



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

