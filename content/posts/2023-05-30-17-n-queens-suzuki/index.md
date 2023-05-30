---
title: "Ｎクイーン問題（３７）第六章 C言語移植 その１７"
description: "pthread並列処理完成"
date: 2023-05-30T13:24:57+09:00
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


## pthread実装の完成
THREADフラグを作成して スレッドのオン・オフで動作を確認しながら実装
構造体初期化メソッドの実装

    誤
    for(unsigned int w=0;w<=(unsigned)(g.size/2)*(g.size-3);++w){
    正
    for(unsigned int w=0;w<(unsigned)(g.size/2)*(g.size-3)+1;++w){

 これにより以下の部分の末尾に１を加える必要がある

   ```
  Local l[(g.size/2)*(g.size-3)+1];
  pthread_t pt[(g.size/2)*(g.size-3)+1];
  ```

 pthreadはマルチプロセスで動くため、これまでの計測方法では、プロセスの合計で計測される。
 実行段階から実行終了までの計測は、 gettimeofday(&t1, NULL);を使う必要がある。


## ソースコード
``` C:17GCC_carryChain.c
/**
 *
 * bash版キャリーチェーンのC言語版
 * Ｃ言語版キャリーチェーン並列処理完成版
 *
 * 簡単な実行
 * bash-3.2$ /usr/local/bin/gcc-10 15GCC_carryChain.c -pthread && ./a.out -r
 *  
 * 高速な実行 
 * $ /usr/local/bin/gcc-10 -Wall -W -O3 -g -ftrapv -std=c99 -mtune=native -march=native 15GCC_carryChain.c -o nq27 && ./nq27 -r
 *
 *
 *
 * 今回のテーマ
 * pthreadの実装 
 * THREADフラグを作成して スレッドのオン・オフで動作を確認しながら実装
 * 
 * 構造体初期化メソッドの実装
 *
 *
    誤
    for(unsigned int w=0;w<=(unsigned)(g.size/2)*(g.size-3);++w){
    正
    for(unsigned int w=0;w<(unsigned)(g.size/2)*(g.size-3)+1;++w){
 *
 * これにより以下の部分の末尾に１を加える必要がある

  Local l[(g.size/2)*(g.size-3)+1];
  pthread_t pt[(g.size/2)*(g.size-3)+1];
 *
 * pthreadはマルチプロセスで動くため、これまでの計測方法では、プロセスの合計で計測される。
 * 実行段階から実行終了までの計測は、 gettimeofday(&t1, NULL);を使う必要がある。
 *
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

普通の実行オプション
bash-3.2$ gcc 17GCC_carryChain.c -o 17GCC && ./17GCC
Usage: ./17GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        dd:hh:mm:ss.ms
 4:            2            1        00:00:00:00.00
 5:           10            2        00:00:00:00.00
 6:            4            1        00:00:00:00.00
 7:           40            6        00:00:00:00.00
 8:           92           12        00:00:00:00.00
 9:          352           46        00:00:00:00.00
10:          724           92        00:00:00:00.00
11:         2680          341        00:00:00:00.00
12:        14200         1788        00:00:00:00.01
13:        73712         9237        00:00:00:00.03
14:       365596        45771        00:00:00:00.11
15:      2279184       285095        00:00:00:00.41
16:     14772512      1847425        00:00:00:02.29
17:     95815104     11979381        00:00:00:18.08
bash-3.2$


より最適で高速なコンパイルオプション
bash-3.2$ gcc -Wshift-negative-value -Wall -W -O3 -g -ftrapv -std=c99 -mtune=native -march=native 17GCC_carryChain.c -o nq27 && ./nq27
Usage: ./nq27 [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        dd:hh:mm:ss.ms
 4:            2            1        00:00:00:00.00
 5:           10            2        00:00:00:00.00
 6:            4            1        00:00:00:00.00
 7:           40            6        00:00:00:00.00
 8:           92           12        00:00:00:00.00
 9:          352           46        00:00:00:00.00
10:          724           92        00:00:00:00.00
11:         2680          341        00:00:00:00.00
12:        14200         1788        00:00:00:00.00
13:        73712         9237        00:00:00:00.02
14:       365596        45771        00:00:00:00.05
15:      2279184       285095        00:00:00:00.23
16:     14772512      1847425        00:00:00:01.34
17:     95815104     11979381        00:00:00:10.22
bash-3.2$


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


１３．05GCC/GCC13.c pthread 再帰 並列処理
 N:           Total           Unique          dd:hh:mm:ss.ms
 4:               2                1          00:00:00:00.00
 5:              10                2          00:00:00:00.00
 6:               4                1          00:00:00:00.00
 7:              40                6          00:00:00:00.00
 8:              92               12          00:00:00:00.00
 9:             352               46          00:00:00:00.00
10:             724               92          00:00:00:00.00
11:            2680              341          00:00:00:00.00
12:           14200             1787          00:00:00:00.00
13:           73712             9233          00:00:00:00.00
14:          365596            45752          00:00:00:00.02
15:         2279184           285053          00:00:00:00.10
16:        14772512          1846955          00:00:00:00.63
17:        95815104         11977939          00:00:00:04.33

*/
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sys/time.h>
#include <pthread.h>
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
  uint64_t COUNTER[3];      
  uint64_t COUNT2;
  uint64_t COUNT4;
  uint64_t COUNT8;
}Local;
//
/**
 * pthreadの実行
 */
// bool THREAD=0; // スレッドしない
bool THREAD=1;  // スレッドする
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
    l->COUNTER[l->COUNT8]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return ;
  }
  // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
  // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
  if(l->s==l->w){ if((l->n!=l->w)||(l->e!=l->w)){ return; } 
    l->COUNTER[l->COUNT2]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
  if((l->e==l->w)&&(l->n>=l->s)){ if(l->n>l->s){ return; } 
    l->COUNTER[l->COUNT4]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  l->COUNTER[l->COUNT8]+=solve(l->B.row>>2,
  l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
  return;
}
// pthread run()
void* thread_run(void* args)
{
  Local *l=(Local *)args;

  // memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
  l->B=l->wB;
  l->dimx=0; l->dimy=g.pres_a[l->w]; 
  if (!l) { printf("+228 l is NULL\n"); }
  //if(!placement(l)){ continue; } 
  // if(!placement(l)){ return; } 
  if(!placement(l)){ return 0; } 
  l->dimx=1; l->dimy=g.pres_b[l->w]; 
  // if(!placement(l)){ continue; } 
  // if(!placement(l)){ return; } 
  if(!placement(l)){ return 0; } 
  //２ 左２行に置く
  // memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
  l->nB=l->B;
  for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
  if (!l) { printf("+241 l is NULL\n"); }
    // memcpy(&l->B,&l->nB,sizeof(Board));     // B=nB;
    l->B=l->nB;
    l->dimx=g.pres_a[l->n]; l->dimy=g.size-1; 
    if(!placement(l)){ continue; } 
    l->dimx=g.pres_b[l->n]; l->dimy=g.size-2; 
    if(!placement(l)){ continue; } 
    // ３ 下２行に置く
    // memcpy(&l->eB,&l->B,sizeof(Board));     // eB=B;
    l->eB=l->B;
    for(l->e=l->w;l->e<(g.size-2)*(g.size-1)-l->w;++l->e){
      if (!l) { printf("+251 l is NULL\n"); }
      // memcpy(&l->B,&l->eB,sizeof(Board));   // B=eB;
      l->B=l->eB;
      l->dimx=g.size-1; l->dimy=g.size-1-g.pres_a[l->e]; 
      if(!placement(l)){ continue; } 
      l->dimx=g.size-2; l->dimy=g.size-1-g.pres_b[l->e]; 
      if(!placement(l)){ continue; } 
      // ４ 右２列に置く
      // memcpy(&l->sB,&l->B,sizeof(Board));   // sB=B;
      l->sB=l->B;
      for(l->s=l->w;l->s<(g.size-2)*(g.size-1)-l->w;++l->s){
        if (!l) { printf("+262 l is NULL\n"); }
        // memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
        l->B=l->sB;
        l->dimx=g.size-1-g.pres_a[l->s]; l->dimy=0; 
        if(!placement(l)){ continue; } 
        l->dimx=g.size-1-g.pres_b[l->s]; l->dimy=1; 
        if(!placement(l)){ continue; } 
        // 対称解除法
        carryChain_symmetry(l);
      } //w
    } //e
  } //n
  return 0;
}
// 構造体の初期化
void initLocal(void* args)
{
  Local *l=(Local *)args;
  l->n=l->e=l->s=l->w=0;
  l->dimx=l->dimy=0;
  l->COUNT2=0; 
  l->COUNT4=1; 
  l->COUNT8=2;
  l->COUNTER[l->COUNT2]=
  l->COUNTER[l->COUNT4]=
  l->COUNTER[l->COUNT8]=0;
  l->B.row=
  l->B.down=
  l->B.left=
  l->B.right=0;
  for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }
}
// チェーンのビルド
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)+1];
  pthread_t pt[(g.size/2)*(g.size-3)+1];
  if(THREAD){
    for(unsigned int w=0;w<(unsigned)(g.size/2)*(g.size-3)+1;++w){
      initLocal(&l[w]); //初期化
      l[w].wB=l[w].B; // memcpy(&l->wB,&l->B,sizeof(Board));  // wB=B;
    }
  }else{
    initLocal(&l); //初期化
    l->wB=l->B; // memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  }
  //１ 上２行に置く
  for(unsigned int w=0;w<(unsigned)(g.size/2)*(g.size-3)+1;++w){
    if(THREAD){ // pthreadのスレッドの生成
      l[w].w=w;
      int iFbRet;
      iFbRet=pthread_create(&pt[w],NULL,&thread_run,&l[w]);
      if(iFbRet>0){
        printf("[mainThread] pthread_create #%d: %d\n", l[w].w, iFbRet);
      }
    }else{ 
      l->w=w;
      thread_run(&l);
    }
  } 
  /**
   * スレッド版 joinする
   */
  if(THREAD){
    for(unsigned int w=0;w<(unsigned)(g.size/2)*(g.size-3)+1;++w){
      pthread_join(pt[w],NULL);
    } 
  }
  /**
   * 集計
   */
  if(THREAD){
    for(unsigned int w=0;w<(unsigned)(g.size/2)*(g.size-3)+1;++w){
      UNIQUE+= l[w].COUNTER[l[w].COUNT2]+
              l[w].COUNTER[l[w].COUNT4]+
              l[w].COUNTER[l[w].COUNT8];
      TOTAL+=  l[w].COUNTER[l[w].COUNT2]*2+
              l[w].COUNTER[l[w].COUNT4]*4+
              l[w].COUNTER[l[w].COUNT8]*8;
    } 
  }else{
    UNIQUE= l->COUNTER[l->COUNT2]+
            l->COUNTER[l->COUNT4]+
            l->COUNTER[l->COUNT8];
    TOTAL=  l->COUNTER[l->COUNT2]*2+
            l->COUNTER[l->COUNT4]*4+
            l->COUNTER[l->COUNT8]*8;
  }
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
  // calcChain(&l);  // 集計
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
  printf("%s\n"," N:        Total       Unique        dd:hh:mm:ss.ms");
  // clock_t st;           //速度計測用
  // char t[20];           //hh:mm:ss.msを格納
  unsigned int min=4;
  unsigned int targetN=21;
  // pthread用計測
  struct timeval t0;
  struct timeval t1;
  // sizeはグローバル
  for(unsigned int size=min;size<=targetN;++size){
    TOTAL=UNIQUE=0; 
    g.size=size;
    // pthread用計測
    // st=clock();
    gettimeofday(&t0, NULL);
    if(cpu){ carryChain(); }
    else{ carryChain(); }
    // pthread用計測
    // TimeFormat(clock()-st,t);
    gettimeofday(&t1, NULL);
    // printf("%2d:%13lld%16lld%s\n",size,TOTAL,UNIQUE,t);
    int ss;int ms;int dd;
    if(t1.tv_usec<t0.tv_usec) {
      dd=(t1.tv_sec-t0.tv_sec-1)/86400;
      ss=(t1.tv_sec-t0.tv_sec-1)%86400;
      ms=(1000000+t1.tv_usec-t0.tv_usec+500)/10000;
    }else {
      dd=(t1.tv_sec-t0.tv_sec)/86400;
      ss=(t1.tv_sec-t0.tv_sec)%86400;
      ms=(t1.tv_usec-t0.tv_usec+500)/10000;
    }
    int hh=ss/3600;
    int mm=(ss-hh*3600)/60;
    ss%=60;
    printf("%2d:%13lld%13lld%10.2d:%02d:%02d:%02d.%02d\n",size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
  }
  return 0;
}

```

## 実行結果

普通の実行オプション
```
bash-3.2$ gcc 17GCC_carryChain.c -o 17GCC && ./17GCC
Usage: ./17GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        dd:hh:mm:ss.ms
 4:            2            1        00:00:00:00.00
 5:           10            2        00:00:00:00.00
 6:            4            1        00:00:00:00.00
 7:           40            6        00:00:00:00.00
 8:           92           12        00:00:00:00.00
 9:          352           46        00:00:00:00.00
10:          724           92        00:00:00:00.00
11:         2680          341        00:00:00:00.00
12:        14200         1788        00:00:00:00.01
13:        73712         9237        00:00:00:00.03
14:       365596        45771        00:00:00:00.11
15:      2279184       285095        00:00:00:00.41
16:     14772512      1847425        00:00:00:02.29
17:     95815104     11979381        00:00:00:18.08
bash-3.2$
```

より最適で高速なコンパイルオプション
```
bash-3.2$ gcc -Wshift-negative-value -Wall -W -O3 -g -ftrapv -std=c99 -mtune=native -march=native 17GCC_carryChain.c -o nq27 && ./nq27 -r
７．キャリーチェーン 17GCC_carryChain.c pthread
 N:        Total       Unique     dd:hh:mm:ss.ms
 4:            2            1     00:00:00:00.00
 5:           10            2     00:00:00:00.00
 6:            4            1     00:00:00:00.00
 7:           40            6     00:00:00:00.00
 8:           92           12     00:00:00:00.00
 9:          352           46     00:00:00:00.00
10:          724           92     00:00:00:00.00
11:         2680          341     00:00:00:00.00
12:        14200         1788     00:00:00:00.00
13:        73712         9237     00:00:00:00.02
14:       365596        45771     00:00:00:00.06
15:      2279184       285095     00:00:00:00.24
16:     14772512      1847425     00:00:00:01.31
17:     95815104     11979381     00:00:00:10.14
```


世界一のドイツ・ドレスデン大学はＮ２７を解決しました。
行けそうな気がしてきませんか？



## リンクと過去記事
Ｎクイーン問題（３７）第六章　C言語移植 その１７ pthread並列処理完成
https://suzukiiichiro.github.io/posts/2023-05-30-17-n-queens-suzuki/
Ｎクイーン問題（３６）第六章　C言語移植 その１６ pthread並列処理
https://suzukiiichiro.github.io/posts/2023-05-30-16-n-queens-suzuki/
Ｎクイーン問題（３５）第六章　C言語移植 その１５
https://suzukiiichiro.github.io/posts/2023-05-30-15-n-queens-suzuki/
Ｎクイーン問題（３４）第六章　C言語移植 その１４
https://suzukiiichiro.github.io/posts/2023-05-30-14-n-queens-suzuki/
Ｎクイーン問題（３３）第六章　C言語移植 その１３
https://suzukiiichiro.github.io/posts/2023-05-30-13-n-queens-suzuki/
Ｎクイーン問題（３２）第六章　C言語移植 その１２
https://suzukiiichiro.github.io/posts/2023-05-30-12-n-queens-suzuki/
Ｎクイーン問題（３１）第六章　C言語移植 その１１
https://suzukiiichiro.github.io/posts/2023-05-30-11-n-queens-suzuki/
Ｎクイーン問題（３０）第六章　C言語移植 その１０
https://suzukiiichiro.github.io/posts/2023-05-30-10-n-queens-suzuki/
Ｎクイーン問題（２９）第六章　C言語移植 その９
https://suzukiiichiro.github.io/posts/2023-05-30-09-n-queens-suzuki/
Ｎクイーン問題（２８）第六章　C言語移植 その８
https://suzukiiichiro.github.io/posts/2023-05-30-08-n-queens-suzuki/
Ｎクイーン問題（２７）第六章　C言語移植 その７
https://suzukiiichiro.github.io/posts/2023-05-30-07-n-queens-suzuki/
Ｎクイーン問題（２６）第六章　C言語移植 その６
https://suzukiiichiro.github.io/posts/2023-05-30-06-n-queens-suzuki/
Ｎクイーン問題（２５）第六章　C言語移植 その５
https://suzukiiichiro.github.io/posts/2023-05-30-05-n-queens-suzuki/
Ｎクイーン問題（２４）第六章　C言語移植 その４
https://suzukiiichiro.github.io/posts/2023-05-30-04-n-queens-suzuki/
Ｎクイーン問題（２３）第六章　C言語移植 その３
https://suzukiiichiro.github.io/posts/2023-05-30-03-n-queens-suzuki/
Ｎクイーン問題（２２）第六章　C言語移植 その２
https://suzukiiichiro.github.io/posts/2023-05-30-02-n-queens-suzuki/
Ｎクイーン問題（２１）第六章　C言語移植 その１
https://suzukiiichiro.github.io/posts/2023-05-30-01-n-queens-suzuki/
Ｎクイーン問題（２０）第五章　並列処理
https://suzukiiichiro.github.io/posts/2023-05-23-02-n-queens-suzuki/
Ｎクイーン問題（１９）第五章　キャリーチェーン
https://suzukiiichiro.github.io/posts/2023-05-23-01-n-queens-suzuki/
Ｎクイーン問題（１８）第四章　偉人のソースを読む「エイト・クイーンノスタルジー」
https://suzukiiichiro.github.io/posts/2023-04-18-01-n-queens-suzuki/
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

エイト・クイーンのソース置き場 BashもJavaもPythonも！
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


