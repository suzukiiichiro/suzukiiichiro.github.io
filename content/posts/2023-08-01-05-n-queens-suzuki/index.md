---
title: "Ｎクイーン問題（６４）第七章 並列処理 キャリーチェーン ＮＶＩＤＩＡ ＣＵＤＡ編"
date: 2023-08-01T10:18:28+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - NVIDIA CUDA
  - Ｃ言語
  - 並列処理
  - アルゴリズム
  - 鈴木維一郎
---
![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

エイト・クイーンのプログラムアーカイブ 
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens


## CUDA キャリーチェーン
###キャリーチェーンとは
キャリーチェーンとは、先に上下左右２行２列にクイーンを置いて、symmetryOpsでcount2,4,8に分類してからバックトラックを実行するロジックです。
既存のロジックだとsymmetryOpsを実行するのはバックトラック完了後でしたが、これだと、バックトラックをGPUで実行する場合、symmetryOpsもGPUで実行する形になります。




## CarryChainの内側でCUDAを起動する場合の ソースコード
``` c :003CUDA_carryChain.cu
/**
 *
 * bash版キャリーチェーンのC言語版のGPU/CUDA移植版
 * CUDAの実行をfor文の一番内側、クイーンを上下左右2行2列置いたあと
 
 詳しい説明はこちらをどうぞ
 https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
 *
・carryChain GPU inside backTrack部分でGPUを起動 stepsに達するまで貯めた

NQueens_suzuki$ nvcc -O3 -arch=sm_61  -Xcompiler -mcmodel=medium  003CUDA_CarryChain.cu && ./a.out -n
 N:            Total          Unique      dd:hh:mm:ss.ms
 4:            2           0      00:00:00:00.13
 5:           10           0      00:00:00:00.00
 6:            4           0      00:00:00:00.00
 7:           40           0      00:00:00:00.00
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.00
11:         2680           0      00:00:00:00.00
12:        14200           0      00:00:00:00.01
13:        73712           0      00:00:00:00.04
14:       365596           0      00:00:00:00.12
15:      2279184           0      00:00:00:00.43
16:     14772512           0      00:00:00:02.10
17:     95815104           0      00:00:00:13.29
18:    666090624           0      00:00:01:36.21
19:   4968057848           0      00:00:12:16.30
*/

#include <iostream>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <cuda.h>
#include <cuda_runtime.h>
#include <device_launch_parameters.h>
#define THREAD_NUM		96
#define MAX 27
#define steps 24576
/**
  * システムによって以下のマクロが必要であればコメントを外してください。
  */
//#define UINT64_C(c) c ## ULL

typedef unsigned int uint;
typedef unsigned long ulong;

ulong TOTAL=0; 
ulong UNIQUE=0;
ulong totalCond=0;
typedef struct
{
  uint size;
  uint pres_a[930]; 
  uint pres_b[930];
}Global; Global g;
typedef struct
{
  ulong row;
  ulong down;
  ulong left;
  ulong right;
  long long x[MAX];
}Board ;
typedef struct
{
  Board B;
  Board nB;
  Board eB;
  Board sB;
  Board wB;
  uint n;
  uint e;
  uint s;
  uint w;
  ulong dimx;
  ulong dimy;
  ulong COUNTER[3];      
  uint COUNT2;
  uint COUNT4;
  uint COUNT8;
  uint type;
}Local;


ulong* totalDown=new ulong[steps];
ulong* totalLeft=new ulong[steps];
ulong* totalRight=new ulong[steps];
ulong* totalRow=new ulong[steps];
uint* totalType=new uint[steps];
ulong* results =new ulong[steps];
bool matched=false;
ulong* rowCuda;
ulong* downCuda;
ulong* leftCuda;
ulong* rightCuda;
ulong* resultsCuda;
uint* typeCuda;

/**
  *
  */
__global__ void solve(uint size,int current,uint* totalType,ulong* totalRow,ulong* totalDown,ulong* totalLeft,ulong* totalRight,ulong* results,uint totalCond)
{
  const uint tid=threadIdx.x;
  const uint bid=blockIdx.x;
  const uint idx=bid*blockDim.x+tid;
  ulong  row_a[MAX];
  ulong  down_a[MAX];
  ulong  left_a[MAX];
  ulong  right_a[MAX];
  ulong  bitmap_a[MAX];
  __shared__ int  sum[THREAD_NUM];
  ulong row=row_a[current]=totalRow[idx];
  ulong left=left_a[current]=totalLeft[idx];
  ulong down=down_a[current]=totalDown[idx];
  ulong right=right_a[current]=totalRight[idx];
  ulong bitmap=bitmap_a[current]=~(left_a[current]|down_a[current]|right_a[current]);
  uint total=0;
  ulong bit;
  uint ttype=totalType[idx];
  if(idx<totalCond){
  while(current>-1){
    if((bitmap!=0||row&1)&&current<size){
      if(!(down+1)){

        total+=ttype;
        current--;
        row=row_a[current];
        left=left_a[current];
        right=right_a[current];
        down=down_a[current];
        bitmap=bitmap_a[current];
        continue;
      }else if(row&1){
        while( row&1 ){
          row>>=1;
          left<<=1;
          right>>=1;
        }
        bitmap=~(left|down|right);  //再帰に必要な変数は必ず定義する必要があります。
        continue;
      }else{
        bit=-bitmap&bitmap;
        bitmap=bitmap^bit;
        if(current<size){
          row_a[current]=row;
          left_a[current]=left;
          down_a[current]=down;
          right_a[current]=right;
          bitmap_a[current]=bitmap;
          current++;
        }
        row>>=1;      //１行下に移動する
        left=(left|bit)<<1;
        down=down|bit;
        right=(right|bit)>>1;
        bitmap=~(left|down|right);  //再帰に必要な変数は必ず定義する必要があります。
      }
    }else{
      current--;
      row=row_a[current];
      left=left_a[current];
      right=right_a[current];
      down=down_a[current];
      bitmap=bitmap_a[current];
    }
  }
  sum[tid]=total;
  }else{
    sum[tid]=0;
  }
  __syncthreads();if(tid<64&&tid+64<THREAD_NUM){sum[tid]+=sum[tid+64];} 
  __syncthreads();if(tid<32){sum[tid]+=sum[tid+32];} 
  __syncthreads();if(tid<16){sum[tid]+=sum[tid+16];} 
  __syncthreads();if(tid<8){sum[tid]+=sum[tid+8];} 
  __syncthreads();if(tid<4){sum[tid]+=sum[tid+4];} 
  __syncthreads();if(tid<2){sum[tid]+=sum[tid+2];} 
  __syncthreads();if(tid<1){sum[tid]+=sum[tid+1];} 
  __syncthreads();if(tid==0){results[bid]=sum[0];}
}
/**
  *
  */
void append(void* args)
{
  Local *l=(Local *)args;
  totalRow[totalCond]=l->B.row>>2;
  totalDown[totalCond]=((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1;
  totalLeft[totalCond]=l->B.left>>4;
  totalRight[totalCond]=(l->B.right>>4)<<(g.size-5);
  totalType[totalCond]=l->type;
  totalCond++;
  if(totalCond==steps){
    if(matched){
      cudaMemcpy(results,resultsCuda,sizeof(long)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
      for(uint col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}
        matched=false;
      }
      cudaMemcpy(rowCuda,totalRow,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(downCuda,totalDown,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(leftCuda,totalLeft,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(rightCuda,totalRight,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(typeCuda,totalType,sizeof(uint)*totalCond,cudaMemcpyHostToDevice);
      solve<<<steps/THREAD_NUM,THREAD_NUM>>>(g.size,0,typeCuda,rowCuda,downCuda,leftCuda,rightCuda,resultsCuda,totalCond);
      cudaMemcpy(results,resultsCuda,
      sizeof(uint)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
      matched=true;
      totalCond=0;
  }
}
/**
  * 非再帰 対称解除法
  */
void carryChain_symmetry(void* args)
{
  Local *l=(Local *)args;
  // 対称解除法
  const uint ww=(g.size-2)*(g.size-1)-1-l->w;
  const uint w2=(g.size-2)*(g.size-1)-1;
  // # 対角線上の反転が小さいかどうか確認する
  if((l->s==ww)&&(l->n<(w2-l->e))){ return ; }
  // # 垂直方向の中心に対する反転が小さいかを確認
  if((l->e==ww)&&(l->n>(w2-l->n))){ return; }
  // # 斜め下方向への反転が小さいかをチェックする
  if((l->n==ww)&&(l->e>(w2-l->s))){ return; }
  // 枝刈り １行目が角の場合回転対称チェックせずCOUNT8にする
  if(l->B.x[0]==0){
    l->type=8;
    append(l);
    //l->COUNTER[l->COUNT8]+=solve(g.size,0,l->B.row>>2,
    //l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return ;
  }
  // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
  // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
  if(l->s==l->w){ if((l->n!=l->w)||(l->e!=l->w)){ return; }
    l->type=2;
    append(l);
    //l->COUNTER[l->COUNT2]+=solve(g.size,0,l->B.row>>2,
    //l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
  if((l->e==l->w)&&(l->n>=l->s)){ if(l->n>l->s){ return; }
    l->type=4;
    append(l);
    //l->COUNTER[l->COUNT4]+=solve(g.size,0,l->B.row>>2,
    //l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  l->type=8;
  append(l);
  //l->COUNTER[l->COUNT8]+=solve(g.size,0,l->B.row>>2,
  //l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
  return;
}
/**
  * クイーンの効きをチェック
  */
bool placement(void* args)
{
  Local *l=(Local *)args;
  if(l->B.x[l->dimx]==l->dimy){ return true;  }  
  if (l->B.x[0]==0){
    if (l->B.x[1]!=(ulong)-1){
      if((l->B.x[1]>=l->dimx)&&(l->dimy==1)){ return false; }
    }
  }else{
    if( (l->B.x[0]!=(ulong)-1) ){
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
  ulong row=UINT64_C(1)<<l->dimx;
  ulong down=UINT64_C(1)<<l->dimy;
  ulong left=UINT64_C(1)<<(g.size-1-l->dimx+l->dimy); //右上から左下
  ulong right=UINT64_C(1)<<(l->dimx+l->dimy);       // 左上から右下
  if((l->B.row&row)||(l->B.down&down)||(l->B.left&left)||(l->B.right&right)){ return false; }     
  l->B.row|=row; l->B.down|=down; l->B.left|=left; l->B.right|=right;
  return true;
}
/**
  * 
  */
void thread_run(void* args)
{
  Local *l=(Local *)args;
  // memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
  l->B=l->wB;
  l->dimx=0; l->dimy=g.pres_a[l->w];
  //if(!placement(l)){ continue; }
  if(!placement(l)){ return; }
  l->dimx=1; l->dimy=g.pres_b[l->w];
  // if(!placement(l)){ continue; }
  if(!placement(l)){ return; }
  //２ 左２行に置く
  // memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
  l->nB=l->B;
  for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
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
}
/**
  * 非再帰  チェーンのビルド
  */
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)];
  cudaMalloc((void**) &rowCuda,sizeof(ulong)*steps);
  cudaMalloc((void**) &downCuda,sizeof(ulong)*steps);
  cudaMalloc((void**) &leftCuda,sizeof(ulong)*steps);
  cudaMalloc((void**) &rightCuda,sizeof(ulong)*steps);
  cudaMalloc((void**) &typeCuda,sizeof(uint)*steps);
  cudaMalloc((void**) &resultsCuda,sizeof(ulong)*steps/THREAD_NUM);
  // カウンターの初期化
  l->COUNT2=0; l->COUNT4=1; l->COUNT8=2;
  l->COUNTER[l->COUNT2]=l->COUNTER[l->COUNT4]=l->COUNTER[l->COUNT8]=0;
  // Board の初期化 nB,eB,sB,wB;
  l->B.row=l->B.down=l->B.left=l->B.right=0;
  // Board x[]の初期化
  for(uint i=0;i<g.size;++i){ l->B.x[i]=-1; }
  //１ 上２行に置く
  // memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  l->wB=l->B;
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    thread_run(&l);
  }
  if(matched){
    cudaMemcpy(results,resultsCuda,sizeof(long)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
    for(uint col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}
    matched=false;
  }
  cudaMemcpy(rowCuda,totalRow,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(downCuda,totalDown,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(leftCuda,totalLeft,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(rightCuda,totalRight,sizeof(ulong)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(typeCuda,totalType,sizeof(uint)*totalCond,cudaMemcpyHostToDevice);
  solve<<<steps/THREAD_NUM,THREAD_NUM>>>(g.size,0,typeCuda,rowCuda,downCuda,leftCuda,rightCuda,resultsCuda,totalCond);
  cudaMemcpy(results,resultsCuda,sizeof(long)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
  for(uint col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}	
}
/**
  * チェーンのリストを作成
  */
void listChain()
{
  uint idx=0;
  for(uint a=0;a<(unsigned)g.size;++a){
    for(uint b=0;b<(unsigned)g.size;++b){
      if(((a>=b)&&(a-b)<=1)||((b>a)&&(b-a)<=1)){ continue; }
      g.pres_a[idx]=a;
      g.pres_b[idx]=b;
      ++idx;
    }
  }
}
/**
  * キャリーチェーン
  */
void carryChain()
{
  listChain();  //チェーンのリストを作成
  buildChain(); // チェーンのビルド
}
/**
  * CUDA 初期化
  */
bool InitCUDA()
{
  int count;
  cudaGetDeviceCount(&count);
  if(count==0){fprintf(stderr,"There is no device.\n");return false;}
  int i;
  for(i=0;i<count;i++){
    struct cudaDeviceProp prop;
    if(cudaGetDeviceProperties(&prop,i)==cudaSuccess){if(prop.major>=1){break;} }
  }
  if(i==count){fprintf(stderr,"There is no device supporting CUDA 1.x.\n");return false;}
  cudaSetDevice(i);
  return true;
}
/**
  * メイン
  */
int main(int argc,char** argv)
{
  if(!InitCUDA()){return 0;}
  /* int steps=24576; */
  int min=4;
  int targetN=19;
  struct timeval t0;
  struct timeval t1;
  printf("%s\n"," N:            Total          Unique      dd:hh:mm:ss.ms");
  for(int size=min;size<=targetN;size++){
    gettimeofday(&t0,NULL);   // 計測開始
    totalCond=0;
    TOTAL=UNIQUE=0;
    g.size=size;
    carryChain();
    gettimeofday(&t1,NULL);   // 計測終了
    int ss;int ms;int dd;
    if (t1.tv_usec<t0.tv_usec) {
      dd=(int)(t1.tv_sec-t0.tv_sec-1)/86400;
      ss=(t1.tv_sec-t0.tv_sec-1)%86400;
      ms=(1000000+t1.tv_usec-t0.tv_usec+500)/10000;
    } else {
      dd=(int)(t1.tv_sec-t0.tv_sec)/86400;
      ss=(t1.tv_sec-t0.tv_sec)%86400;
      ms=(t1.tv_usec-t0.tv_usec+500)/10000;
    }//end if
    int hh=ss/3600;
    int mm=(ss-hh*3600)/60;
    ss%=60;
    printf("%2d:%17ld%16ld%8.3d:%02d:%02d:%02d.%02d\n",size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
  }
  cudaFree(rowCuda);
  cudaFree(downCuda);
  cudaFree(leftCuda);
  cudaFree(rightCuda);
  cudaFree(typeCuda);
  cudaFree(resultsCuda);
  delete[] totalRow;
  delete[] totalDown;
  delete[] totalLeft;
  delete[] totalRight;
  delete[] totalType;
  delete[] results;
  return 0;
}
```

## 実行結果
```
NQueens_suzuki$ nvcc -O3 -arch=sm_61  -Xcompiler -mcmodel=medium  003CUDA_CarryChain.cu && ./a.out -n
 N:            Total          Unique      dd:hh:mm:ss.ms
 4:            2           0      00:00:00:00.13
 5:           10           0      00:00:00:00.00
 6:            4           0      00:00:00:00.00
 7:           40           0      00:00:00:00.00
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.00
11:         2680           0      00:00:00:00.00
12:        14200           0      00:00:00:00.01
13:        73712           0      00:00:00:00.04
14:       365596           0      00:00:00:00.12
15:      2279184           0      00:00:00:00.43
16:     14772512           0      00:00:00:02.10
17:     95815104           0      00:00:00:13.29
18:    666090624           0      00:00:01:36.21
19:   4968057848           0      00:00:12:16.30
```

ビットボードのほうが１０倍以上高速です。
キャリーチェーンのコンセプトは面白いのですが。
キャリーチェーンは冒頭で外枠２列を埋めたのちに対象解除を行い、可能性のあるボードのみについてバックトラックでさらなる可能性を追求する仕組みです。

残念ながらキャリーチェーンはこれ以上高速にはなりません。
冒頭で対象解除を行った結果をＤＢに保存して大量のサーバーを使って並列処理を行うことを前提に開発したロジックであると言えます。

でもこのコンセプトを拡張したConstellations（コンステレーションズ）がこれまでの最速モデルSymmetryを凌駕する結果を叩き出します
お楽しみに


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






