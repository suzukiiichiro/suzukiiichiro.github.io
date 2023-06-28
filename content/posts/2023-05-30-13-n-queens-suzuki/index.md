---
title: "Ｎクイーン問題（３３）第六章 C言語移植 その１３"
description: "並列処理前準備"
date: 2023-05-30T13:24:21+09:00
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


## 並列処理前準備
今回の作業は並列処理部分として、buildChain()の一番外側のfor(w)ブロックを抜き出し、
run()としてpthreadに備える


まずは、buildChain()のスレッドを起動したい箇所を抜き出して thread_run()に移動します。
とはいえ、いきなり色々やると動かなくなっても困るので、まずはちゃんと動くようにステップを踏んで進めたいと思います。

１．buildChain()の移動したい箇所をコメントアウトします。
    buildChain()関数の末尾に以下の一行を追記します。
```c
  thread_run(&l);
```
２．thread_run()関数を作成します。
３．buildchain()でコメントアウトした箇所をthread_run()に入れます。

では、まず１からやります。

13GCC_carryChain.c
+295
```c
// チェーンのビルド
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)];

  // カウンターの初期化
  g.COUNT2=0; g.COUNT4=1; g.COUNT8=2;
  g.COUNTER[g.COUNT2]=g.COUNTER[g.COUNT4]=g.COUNTER[g.COUNT8]=0;
  // Board の初期化 nB,eB,sB,wB;
  l->B.row=l->B.down=l->B.left=l->B.right=0;
  // Board x[]の初期化
  for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }

  //
  // 以下を thread_run()へ移動
  //
  // //１ 上２行に置く
  // memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  // for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
  //   memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
  //   l->dimx=0; l->dimy=g.pres_a[l->w]; 
  //   if(!placement(&l)){ continue; } 
  //   l->dimx=1; l->dimy=g.pres_b[l->w]; 
  //   if(!placement(&l)){ continue; } 
    // //２ 左２行に置く
    // memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
    // for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
    //   memcpy(&l->B,&l->nB,sizeof(Board));     // B=nB;
    //   l->dimx=g.pres_a[l->n]; l->dimy=g.size-1; 
    //   if(!placement(&l)){ continue; } 
    //   l->dimx=g.pres_b[l->n]; l->dimy=g.size-2; 
    //   if(!placement(&l)){ continue; } 
      // // ３ 下２行に置く
      // memcpy(&l->eB,&l->B,sizeof(Board));     // eB=B;
      // for(l->e=l->w;l->e<(g.size-2)*(g.size-1)-l->w;++l->e){
      //   memcpy(&l->B,&l->eB,sizeof(Board));   // B=eB;
      //   l->dimx=g.size-1; l->dimy=g.size-1-g.pres_a[l->e]; 
      //   if(!placement(&l)){ continue; } 
      //   l->dimx=g.size-2; l->dimy=g.size-1-g.pres_b[l->e]; 
      //   if(!placement(&l)){ continue; } 
        // // ４ 右２列に置く
        // memcpy(&l->sB,&l->B,sizeof(Board));   // sB=B;
        // for(l->s=l->w;l->s<(g.size-2)*(g.size-1)-l->w;++l->s){
        //   memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
        //   l->dimx=g.size-1-g.pres_a[l->s]; l->dimy=0; 
        //   if(!placement(&l)){ continue; } 
        //   l->dimx=g.size-1-g.pres_b[l->s]; l->dimy=1; 
        //   if(!placement(&l)){ continue; } 
        //   // 対称解除法
        //   carryChain_symmetry(&l);
        // } //w
      // } //e
    // } //n
  // } //w
  thread_run(&l);
}
```

buildChain()のコメントアウトした一番下 +349 に `thread_run()`を呼び出しを追加します。

13GCC_carryChain.c
+349
```c
  thread_run(&l);
```

では２，`thread_run()`を作成します。
13GCC_carrychain.c
+244
```c
// pthread run()
void thread_run(void* args)
{
  Local *l=(Local *)args;

}
```

最後に、buildChain()でコメントアウトした部分を貼り付けます。

13GCC_carryChain.c
+244
```c
// pthread run()
void thread_run(void* args)
{
  Local *l=(Local *)args;

  // // カウンターの初期化
  // g.COUNT2=0; g.COUNT4=1; g.COUNT8=2;
  // g.COUNTER[g.COUNT2]=g.COUNTER[g.COUNT4]=g.COUNTER[g.COUNT8]=0;
  // // Board の初期化 nB,eB,sB,wB;
  // l->B.row=l->B.down=l->B.left=l->B.right=0;
  // // Board x[]の初期化
  // for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }
  //１ 上２行に置く
  memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
    l->dimx=0; l->dimy=g.pres_a[l->w]; 
    if(!placement(l)){ continue; } 
    l->dimx=1; l->dimy=g.pres_b[l->w]; 
    if(!placement(l)){ continue; } 
    //２ 左２行に置く
    memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
    for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
      memcpy(&l->B,&l->nB,sizeof(Board));     // B=nB;
      l->dimx=g.pres_a[l->n]; l->dimy=g.size-1; 
      if(!placement(l)){ continue; } 
      l->dimx=g.pres_b[l->n]; l->dimy=g.size-2; 
      if(!placement(l)){ continue; } 
      // ３ 下２行に置く
      memcpy(&l->eB,&l->B,sizeof(Board));     // eB=B;
      for(l->e=l->w;l->e<(g.size-2)*(g.size-1)-l->w;++l->e){
        memcpy(&l->B,&l->eB,sizeof(Board));   // B=eB;
        l->dimx=g.size-1; l->dimy=g.size-1-g.pres_a[l->e]; 
        if(!placement(l)){ continue; } 
        l->dimx=g.size-2; l->dimy=g.size-1-g.pres_b[l->e]; 
        if(!placement(l)){ continue; } 
        // ４ 右２列に置く
        memcpy(&l->sB,&l->B,sizeof(Board));   // sB=B;
        for(l->s=l->w;l->s<(g.size-2)*(g.size-1)-l->w;++l->s){
          memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
          l->dimx=g.size-1-g.pres_a[l->s]; l->dimy=0; 
          if(!placement(l)){ continue; } 
          l->dimx=g.size-1-g.pres_b[l->s]; l->dimy=1; 
          if(!placement(l)){ continue; } 
          // 対称解除法
          carryChain_symmetry(l);
        } //w
      } //e
    } //n
  } //w
}
```


## ソースコード
```c:13GCC_carryChain.c
/**
 *
 * bash版キャリーチェーンのC言語版
 * 最終的に 08Bash_carryChain_parallel.sh のように
 * 並列処理 pthread版の作成が目的
 *
 * 今回のテーマ
 *
 * 今回の作業は並列処理部分として、buildChain()の一番外側のfor(w)ブロックを抜き出し、
 * run()としてpthreadに備える
 *

 困ったときには以下のＵＲＬがとても参考になります。

 C++ 値渡し、ポインタ渡し、参照渡しを使い分けよう
 https://qiita.com/agate-pris/items/05948b7d33f3e88b8967
 値渡しとポインタ渡し
 https://tmytokai.github.io/open-ed/activity/c-pointer/text06/page01.html
 C言語 値渡しとアドレス渡し
 https://skpme.com/199/
 アドレスとポインタ
 https://yu-nix.com/archives/c-struct-pointer/

実行結果
bash-3.2$ gcc 13GCC_carryChain.c -o 13GCC && ./13GCC
Usage: ./13GCC [-c|-g]
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
12:        14200            1788            0.05
13:        73712            9237            0.14
14:       365596           45771            0.48
15:      2279184          285095            2.09
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
// 構造体
typedef struct{
  unsigned int size;
  unsigned int pres_a[930]; 
  unsigned int pres_b[930];
  uint64_t COUNTER[3];      
  //カウンター配列
  unsigned int COUNT2;
  unsigned int COUNT4;
  unsigned int COUNT8;
}Global; Global g;
// 構造体
typedef struct{
  uint64_t row;
  uint64_t down;
  uint64_t left;
  uint64_t right;
  uint64_t x[MAX];
}Board ;
typedef struct{
  Board B;
  Board nB;
  Board eB;
  Board sB;
  Board wB;
  unsigned n;
  unsigned e;
  unsigned s;
  unsigned w;
  uint64_t dimx;
  uint64_t dimy;
}Local;
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
  UNIQUE= g.COUNTER[g.COUNT2]+
          g.COUNTER[g.COUNT4]+
          g.COUNTER[g.COUNT8];
  TOTAL=  g.COUNTER[g.COUNT2]*2+
          g.COUNTER[g.COUNT4]*4+
          g.COUNTER[g.COUNT8]*8;
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
// クイーンの効きをチェック
bool placement(void* args)
{
  Local *l=(Local *)args;
  if(l->B.x[l->dimx]==l->dimy){ return true;  }  
  if (l->B.x[0]==0){
    if (l->B.x[1]!=(uint64_t)-1){
      if((l->B.x[1]>=l->dimx)&&(l->dimy==1)){ return false; }
    }
  }else{
    if( (l->B.x[0]!=(uint64_t)-1) ){
      if(( (l->dimx<l->B.x[0]||l->dimx>=g.size-l->B.x[0])
        && (l->dimy==0 || l->dimy==g.size-1)
      )){ return 0; } 
      if ((  (l->dimx==g.size-1)&&((l->dimy<=l->B.x[0])||
          l->dimy>=g.size-l->B.x[0]))){
        return 0;
      } 
    }
  }
  l->B.x[l->dimx]=l->dimy;                    //xは行 yは列
  uint64_t row=UINT64_C(1)<<l->dimx;
  uint64_t down=UINT64_C(1)<<l->dimy;
  uint64_t left=UINT64_C(1)<<(g.size-1-l->dimx+l->dimy); //右上から左下
  uint64_t right=UINT64_C(1)<<(l->dimx+l->dimy);       // 左上から右下
  if((l->B.row&row)||(l->B.down&down)||(l->B.left&left)||(l->B.right&right)){ return false; }     
  l->B.row|=row; l->B.down|=down; l->B.left|=left; l->B.right|=right;
  return true;
}
//対称解除法
void carryChain_symmetry(void* args)
{
  Local *l=(Local *)args;
  // 対称解除法 
  unsigned const int ww=(g.size-2)*(g.size-1)-1-l->w;
  unsigned const int w2=(g.size-2)*(g.size-1)-1;
  // # 対角線上の反転が小さいかどうか確認する
  if((l->s==ww)&&(l->n<(w2-l->e))){ return ; }
  // # 垂直方向の中心に対する反転が小さいかを確認
  if((l->e==ww)&&(l->n>(w2-l->n))){ return; }
  // # 斜め下方向への反転が小さいかをチェックする
  if((l->n==ww)&&(l->e>(w2-l->s))){ return; }
  // 枝刈り １行目が角の場合回転対称チェックせずCOUNT8にする
  if(l->B.x[0]==0){ 
    g.COUNTER[g.COUNT8]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return ;
  }
  // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
  // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
  if(l->s==l->w){ if((l->n!=l->w)||(l->e!=l->w)){ return; } 
    g.COUNTER[g.COUNT2]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
  if((l->e==l->w)&&(l->n>=l->s)){ if(l->n>l->s){ return; } 
    g.COUNTER[g.COUNT4]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  g.COUNTER[g.COUNT8]+=solve(l->B.row>>2,
  l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
  return;
}
// pthread run()
void thread_run(void* args)
{
  Local *l=(Local *)args;

  // // カウンターの初期化
  // g.COUNT2=0; g.COUNT4=1; g.COUNT8=2;
  // g.COUNTER[g.COUNT2]=g.COUNTER[g.COUNT4]=g.COUNTER[g.COUNT8]=0;
  // // Board の初期化 nB,eB,sB,wB;
  // l->B.row=l->B.down=l->B.left=l->B.right=0;
  // // Board x[]の初期化
  // for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }
  //１ 上２行に置く
  memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
    l->dimx=0; l->dimy=g.pres_a[l->w]; 
    if(!placement(l)){ continue; } 
    l->dimx=1; l->dimy=g.pres_b[l->w]; 
    if(!placement(l)){ continue; } 
    //２ 左２行に置く
    memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
    for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
      memcpy(&l->B,&l->nB,sizeof(Board));     // B=nB;
      l->dimx=g.pres_a[l->n]; l->dimy=g.size-1; 
      if(!placement(l)){ continue; } 
      l->dimx=g.pres_b[l->n]; l->dimy=g.size-2; 
      if(!placement(l)){ continue; } 
      // ３ 下２行に置く
      memcpy(&l->eB,&l->B,sizeof(Board));     // eB=B;
      for(l->e=l->w;l->e<(g.size-2)*(g.size-1)-l->w;++l->e){
        memcpy(&l->B,&l->eB,sizeof(Board));   // B=eB;
        l->dimx=g.size-1; l->dimy=g.size-1-g.pres_a[l->e]; 
        if(!placement(l)){ continue; } 
        l->dimx=g.size-2; l->dimy=g.size-1-g.pres_b[l->e]; 
        if(!placement(l)){ continue; } 
        // ４ 右２列に置く
        memcpy(&l->sB,&l->B,sizeof(Board));   // sB=B;
        for(l->s=l->w;l->s<(g.size-2)*(g.size-1)-l->w;++l->s){
          memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
          l->dimx=g.size-1-g.pres_a[l->s]; l->dimy=0; 
          if(!placement(l)){ continue; } 
          l->dimx=g.size-1-g.pres_b[l->s]; l->dimy=1; 
          if(!placement(l)){ continue; } 
          // 対称解除法
          carryChain_symmetry(l);
        } //w
      } //e
    } //n
  } //w
}
// チェーンのビルド
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)];

  // カウンターの初期化
  g.COUNT2=0; g.COUNT4=1; g.COUNT8=2;
  g.COUNTER[g.COUNT2]=g.COUNTER[g.COUNT4]=g.COUNTER[g.COUNT8]=0;
  // Board の初期化 nB,eB,sB,wB;
  l->B.row=l->B.down=l->B.left=l->B.right=0;
  // Board x[]の初期化
  for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }

  //
  // 以下を thread_run()へ移動
  //
  // //１ 上２行に置く
  // memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  // for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
  //   memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
  //   l->dimx=0; l->dimy=g.pres_a[l->w]; 
  //   if(!placement(&l)){ continue; } 
  //   l->dimx=1; l->dimy=g.pres_b[l->w]; 
  //   if(!placement(&l)){ continue; } 
    // //２ 左２行に置く
    // memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
    // for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
    //   memcpy(&l->B,&l->nB,sizeof(Board));     // B=nB;
    //   l->dimx=g.pres_a[l->n]; l->dimy=g.size-1; 
    //   if(!placement(&l)){ continue; } 
    //   l->dimx=g.pres_b[l->n]; l->dimy=g.size-2; 
    //   if(!placement(&l)){ continue; } 
      // // ３ 下２行に置く
      // memcpy(&l->eB,&l->B,sizeof(Board));     // eB=B;
      // for(l->e=l->w;l->e<(g.size-2)*(g.size-1)-l->w;++l->e){
      //   memcpy(&l->B,&l->eB,sizeof(Board));   // B=eB;
      //   l->dimx=g.size-1; l->dimy=g.size-1-g.pres_a[l->e]; 
      //   if(!placement(&l)){ continue; } 
      //   l->dimx=g.size-2; l->dimy=g.size-1-g.pres_b[l->e]; 
      //   if(!placement(&l)){ continue; } 
        // // ４ 右２列に置く
        // memcpy(&l->sB,&l->B,sizeof(Board));   // sB=B;
        // for(l->s=l->w;l->s<(g.size-2)*(g.size-1)-l->w;++l->s){
        //   memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
        //   l->dimx=g.size-1-g.pres_a[l->s]; l->dimy=0; 
        //   if(!placement(&l)){ continue; } 
        //   l->dimx=g.size-1-g.pres_b[l->s]; l->dimy=1; 
        //   if(!placement(&l)){ continue; } 
        //   // 対称解除法
        //   carryChain_symmetry(&l);
        // } //w
      // } //e
    // } //n
  // } //w
  thread_run(&l);
}
// チェーンのリストを作成
void listChain()
{
  unsigned int idx=0;
  for(unsigned int a=0;a<(unsigned)g.size;++a){
    for(unsigned int b=0;b<(unsigned)g.size;++b){
      if(((a>=b)&&(a-b)<=1)||((b>a)&&(b-a)<=1)){ continue; }
      g.pres_a[idx]=a;
      g.pres_b[idx]=b;
      ++idx;
    }
  }
}
// キャリーチェーン
void carryChain()
{
  listChain();  //チェーンのリストを作成
  buildChain(); // チェーンのビルド
  calcChain();  // 集計
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
    TOTAL=UNIQUE=0; 
    g.size=size;
    st=clock();
    if(cpu){
      carryChain();
    }else{
      carryChain();
    }
    TimeFormat(clock()-st,t);
    printf("%2d:%13lld%16lld%s\n",size,TOTAL,UNIQUE,t);
  }
  return 0;
}
```

## 実行結果
```
bash-3.2$ gcc 13GCC_carryChain.c -o 13GCC && ./13GCC
Usage: ./13GCC [-c|-g]
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
12:        14200            1788            0.05
13:        73712            9237            0.14
14:       365596           45771            0.48
15:      2279184          285095            2.09
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


