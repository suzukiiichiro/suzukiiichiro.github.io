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




## CarryChainの外側でCUDAを起動する場合の ソースコード
ソースコードは以下のとおりです。
``` c :05CUDA_CarryChain_outside.cu
/**
 *
 * bash版キャリーチェーンのC言語版のGPU/CUDA移植版
 * CUDAの実行をfor文の一番外側（上2行にクイーンを置いた後）
 * 
 * ・処理の流れ
 * 1,carryChain_build_nodeLayer()
 *   listChain() CPU,GPU共通  
 *     2行2列に配置するクイーンのパターンを作成する
 *   cuda_kernel()
 *     listChainで作成した、2行分クイーンを置くパターン数 size/2*(size-3)でCUDAを呼び出す
 * 2,cuda_kernel() GPUのみ  
 *   左2列、下2行、右2列にクイーンを置く  
 *   placement() CPU,GPU共通
 *     下左右2行2列でクイーンを置く処理、置けない場合は抜ける
 *   carryChain_symmetry()　CPU,GPU共通
 *     上下左右2行2列にクイーンを置けたものを対象解除してCOUNT2,COUT4,COUNT8,スキップを判定する
 * 3,carryChain_symmetry()　CPU,GPU共通
 *   対象解除判定
 *   solve() CPU,GPU共通
 *     バックトラックでクイーンを置いていく
 * 4,solve()
 *   バックトラック

・carryChain  CPU デフォルト
 7:           40           0      00:00:00:00.00
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.00
11:         2680           0      00:00:00:00.02
12:        14200           0      00:00:00:00.07
13:        73712           0      00:00:00:00.24
14:       365596           0      00:00:00:00.78

・carryChain GPU outside
一番外側の forでGPUを起動
 7:           40           0      00:00:00:00.41
 8:           92           0      00:00:00:00.96
 9:          352           0      00:00:00:04.15
10:          724           0      00:00:00:14.54
11:         2680           0      00:00:00:41.31
12:        14200           0      00:00:01:46.98
13:        73712           0      00:00:04:35.11
14:       365596           0      00:00:13:57.61

アーキテクチャの指定（なくても問題なし、あれば高速）
-arch=sm_13 or -arch=sm_61

CPUの再帰での実行
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain_outside.cu && ./a.out -r

CPUの非再帰での実行
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain_outside.cu && ./a.out -c

GPUのシングルスレッド
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain_outside.cu && ./a.out -g

  GPUのマルチスレッド
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain_outside.cu && ./a.out -n
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
#define steps 960
// システムによって以下のマクロが必要であればコメントを外してください。
//#define UINT64_C(c) c ## ULL
//
// グローバル変数
unsigned long TOTAL=0; 
unsigned long UNIQUE=0;
// キャリーチェーン 非再帰版
// 構造体
typedef  struct
{
  unsigned int size;
  unsigned int pres_a[steps]; 
  unsigned int pres_b[steps];
}Global; Global g;
// 構造体
typedef struct
{
  uint64_t row;
  uint64_t down;
  uint64_t left;
  uint64_t right;
  long long x[MAX];
}Board ;
typedef struct
{
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
  //カウンター配列
  unsigned int COUNT2;
  unsigned int COUNT4;
  unsigned int COUNT8;
}Local;
/**
  CPU/CPUR 再帰・非再帰共通
  */
// チェーンのリストを作成
//CPU GPU共通
//2行2列分のクイーンの設置場所を作る
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
// クイーンの効きをチェック
//CPU GPU共通
__device__ __host__
bool placement(void* args,int size)
{
  Local *l=(Local *)args;
  if(l->B.x[l->dimx]==l->dimy){ return true;  }  
  if (l->B.x[0]==0){
    if (l->B.x[1]!=(uint64_t)-1){
      if((l->B.x[1]>=l->dimx)&&(l->dimy==1)){ return false; }
    }
  }else{
    if( (l->B.x[0]!=(uint64_t)-1) ){
      if(( (l->dimx<l->B.x[0]||l->dimx>=size-l->B.x[0])
        && (l->dimy==0 || l->dimy==size-1)
      )){ return 0; } 
      if ((  (l->dimx==size-1)&&((l->dimy<=l->B.x[0])||
          l->dimy>=size-l->B.x[0]))){
        return 0;
      } 
    }
  }
  l->B.x[l->dimx]=l->dimy;                    //xは行 yは列
  uint64_t row=UINT64_C(1)<<l->dimx;
  uint64_t down=UINT64_C(1)<<l->dimy;
  uint64_t left=UINT64_C(1)<<(size-1-l->dimx+l->dimy); //右上から左下
  uint64_t right=UINT64_C(1)<<(l->dimx+l->dimy);       // 左上から右下
  if((l->B.row&row)||(l->B.down&down)||(l->B.left&left)||(l->B.right&right)){ return false; }     
  l->B.row|=row; l->B.down|=down; l->B.left|=left; l->B.right|=right;
  return true;
}
//バックトラック
//CPU,GPU共通
__device__ __host__
uint64_t solve(int size,int current,uint64_t row,uint64_t left,uint64_t down,uint64_t right)
{
  //printf("solve\n");
  printf("current:%d\n",current);//今はここをprintfしないと数が合わない
  uint64_t row_a[MAX];
  uint64_t right_a[MAX];
  uint64_t left_a[MAX];
  uint64_t down_a[MAX];
  uint64_t bitmap_a[MAX];
  for (int i=0;i<size;i++){
    row_a[i]=0;
    left_a[i]=0;
    down_a[i]=0;
    right_a[i]=0;
    bitmap_a[i]=0;
  }
  row_a[current]=row;
  left_a[current]=left;
  down_a[current]=down;
  right_a[current]=right;
  uint64_t bitmap=bitmap_a[current]=~(left_a[current]|down_a[current]|right_a[current]);
  uint64_t total=0;
  uint64_t bit;
  while(current>-1){
    if((bitmap!=0||row&1)&&current<size){
      if(!(down+1)){
        total++;
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
  return total;
}
//対称解除法
//CPU,GPU共通
__device__ __host__
void carryChain_symmetry(void* args,int size)
{
  //printf("symmetry\n");
  Local *l=(Local *)args;
  // 対称解除法
  unsigned const int ww=(size-2)*(size-1)-1-l->w;
  unsigned const int w2=(size-2)*(size-1)-1;
  // # 対角線上の反転が小さいかどうか確認する
  if((l->s==ww)&&(l->n<(w2-l->e))){ return ; }
  // # 垂直方向の中心に対する反転が小さいかを確認
  if((l->e==ww)&&(l->n>(w2-l->n))){ return; }
  // # 斜め下方向への反転が小さいかをチェックする
  if((l->n==ww)&&(l->e>(w2-l->s))){ return; }
  // 枝刈り １行目が角の場合回転対称チェックせずCOUNT8にする
  if(l->B.x[0]==0){
    l->COUNTER[l->COUNT8]+=solve(size,0,l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(size-4)))+1)<<(size-5))-1,(l->B.right>>4)<<(size-5));
    return ;
  }
  // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
  // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
  if(l->s==l->w){ if((l->n!=l->w)||(l->e!=l->w)){ return; }
    l->COUNTER[l->COUNT2]+=solve(size,0,l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(size-4)))+1)<<(size-5))-1,(l->B.right>>4)<<(size-5));
    return;
  }
  // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
  if((l->e==l->w)&&(l->n>=l->s)){ if(l->n>l->s){ return; }
    l->COUNTER[l->COUNT4]+=solve(size,0,l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(size-4)))+1)<<(size-5))-1,(l->B.right>>4)<<(size-5));
    return;
  }
  l->COUNTER[l->COUNT8]+=solve(size,0,l->B.row>>2,
  l->B.left>>4,((((l->B.down>>2)|(~0<<(size-4)))+1)<<(size-5))-1,(l->B.right>>4)<<(size-5));
  return;
}
//左、下、右２行２列にクイーンを置く
//CPU限定 
void cpu_kernel(
  unsigned int* pres_a,unsigned int* pres_b,unsigned int* results,int totalCond,int idx,int size){
  if(idx<totalCond){
    //printf("test\n"); 
    Local l[1];
    l->w=idx;
    // カウンターの初期化
    l->COUNT2=0; l->COUNT4=1; l->COUNT8=2;
    l->COUNTER[l->COUNT2]=l->COUNTER[l->COUNT4]=l->COUNTER[l->COUNT8]=0;
    // Board の初期化 nB,eB,sB,wB;
    l->B.row=l->B.down=l->B.left=l->B.right=0;
    // Board x[]の初期化
    for(unsigned int i=0;i<size;++i){ l->B.x[i]=-1; }
    //１ 上２行に置く
    // memcpy(&l.wB,&l.B,sizeof(Board));         // wB=B;
    l->wB=l->B;
    // memcpy(&l.B,&l.wB,sizeof(Board));       // B=wB;
    //l.B=l.wB;
    l->dimx=0; 
    l->dimy=pres_a[l->w];
    //if(!placement(l)){ continue; }
    if(!placement(l,size)){ 
      //printf("p1\n");
      results[idx]=0;
      goto end; 
    }
    l->dimx=1; l->dimy=pres_b[l->w];
    // if(!placement(l)){ continue; }
    if(!placement(l,size)){ 
      //printf("p2\n");
      results[idx]=0;
      goto end; 
    }
    //２ 左２行に置く
    // memcpy(&l.nB,&l.B,sizeof(Board));       // nB=B;
    l->nB=l->B;
    for(l->n=l->w;l->n<(size-2)*(size-1)-l->w;++l->n){
      // memcpy(&l.B,&l.nB,sizeof(Board));     // B=nB;
      l->B=l->nB;
      l->dimx=pres_a[l->n]; l->dimy=size-1;
      if(!placement(l,size)){ 
        continue; 
      }
      l->dimx=pres_b[l->n]; l->dimy=size-2;
      if(!placement(l,size)){ 
        continue; 
      }
      // ３ 下２行に置く
      // memcpy(&l.eB,&l.B,sizeof(Board));     // eB=B;
      l->eB=l->B;
      for(l->e=l->w;l->e<(size-2)*(size-1)-l->w;++l->e){
        // memcpy(&l.B,&l.eB,sizeof(Board));   // B=eB;
        l->B=l->eB;
        l->dimx=size-1; l->dimy=size-1-pres_a[l->e];
        if(!placement(l,size)){ 
          continue; 
        }
        l->dimx=size-2; l->dimy=size-1-pres_b[l->e];
        if(!placement(l,size)){ 
          continue; 
        }
        // ４ 右２列に置く
        // memcpy(&l.sB,&l.B,sizeof(Board));   // sB=B;
        l->sB=l->B;
        for(l->s=l->w;l->s<(size-2)*(size-1)-l->w;++l->s){
          // memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
          l->B=l->sB;
          l->dimx=size-1-pres_a[l->s]; l->dimy=0;
          if(!placement(l,size)){ 
            continue; 
          }
          l->dimx=size-1-pres_b[l->s]; l->dimy=1;
          if(!placement(l,size)){ 
            continue; 
          }
          // 対称解除法
          carryChain_symmetry(l,size);
        } //w
      } //e
    } //n
    results[idx]=l->COUNTER[l->COUNT2]*2+l->COUNTER[l->COUNT4]*4+l->COUNTER[l->COUNT8]*8;
  }else{
    results[idx]=0;
  }
  end:
  
} 
//キャリーチェーン 
//CPU限定
//
void carryChain(int){
  
  listChain();  //チェーンのリストを作成
  int totalCond=g.size/2*(g.size-3);
  unsigned int* results=new unsigned int[totalCond];
  for(int i=0;i<totalCond;i++){
    cpu_kernel(g.pres_a,g.pres_b,results,totalCond,i,g.size);
  }
  for(int col=0;col<totalCond;col++){
    TOTAL+=results[col];
  }	
}
/**
  */
//再帰 ボード外側２列を除く内側のクイーン配置処理
/**
  GPU 
 */
// CUDA 初期化
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
__global__ void cuda_kernel(
  unsigned int* pres_a,unsigned int* pres_b,unsigned int* results,int totalCond,int size){
  const int tid=threadIdx.x;
  const int bid=blockIdx.x;
  const int idx=bid*blockDim.x+tid;
  __shared__ unsigned int sum[THREAD_NUM];
  if(idx<totalCond){
    //printf("test\n"); 
    Local l[1];
    l->w=idx;
    // カウンターの初期化
    l->COUNT2=0; l->COUNT4=1; l->COUNT8=2;
    l->COUNTER[l->COUNT2]=l->COUNTER[l->COUNT4]=l->COUNTER[l->COUNT8]=0;
    // Board の初期化 nB,eB,sB,wB;
    l->B.row=l->B.down=l->B.left=l->B.right=0;
    // Board x[]の初期化
    for(unsigned int i=0;i<size;++i){ l->B.x[i]=-1; }
    //１ 上２行に置く
    // memcpy(&l.wB,&l.B,sizeof(Board));         // wB=B;
    l->wB=l->B;
    // memcpy(&l.B,&l.wB,sizeof(Board));       // B=wB;
    //l.B=l.wB;
    l->dimx=0; 
    l->dimy=pres_a[l->w];
    //if(!placement(l)){ continue; }
    if(!placement(l,size)){ 
      //printf("p1\n");
      sum[tid]=0;
      goto end; 
    }
    l->dimx=1; l->dimy=pres_b[l->w];
    // if(!placement(l)){ continue; }
    if(!placement(l,size)){ 
      //printf("p2\n");
      sum[tid]=0;
      goto end; 
    }
    //２ 左２行に置く
    // memcpy(&l.nB,&l.B,sizeof(Board));       // nB=B;
    l->nB=l->B;
    for(l->n=l->w;l->n<(size-2)*(size-1)-l->w;++l->n){
      // memcpy(&l.B,&l.nB,sizeof(Board));     // B=nB;
      l->B=l->nB;
      l->dimx=pres_a[l->n]; l->dimy=size-1;
      if(!placement(l,size)){ 
        continue; 
      }
      l->dimx=pres_b[l->n]; l->dimy=size-2;
      if(!placement(l,size)){ 
        continue; 
      }
      // ３ 下２行に置く
      // memcpy(&l.eB,&l.B,sizeof(Board));     // eB=B;
      l->eB=l->B;
      for(l->e=l->w;l->e<(size-2)*(size-1)-l->w;++l->e){
        // memcpy(&l.B,&l.eB,sizeof(Board));   // B=eB;
        l->B=l->eB;
        l->dimx=size-1; l->dimy=size-1-pres_a[l->e];
        if(!placement(l,size)){ 
          continue; 
        }
        l->dimx=size-2; l->dimy=size-1-pres_b[l->e];
        if(!placement(l,size)){ 
          continue; 
        }
        // ４ 右２列に置く
        // memcpy(&l.sB,&l.B,sizeof(Board));   // sB=B;
        l->sB=l->B;
        for(l->s=l->w;l->s<(size-2)*(size-1)-l->w;++l->s){
          // memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
          l->B=l->sB;
          l->dimx=size-1-pres_a[l->s]; l->dimy=0;
          if(!placement(l,size)){ 
            continue; 
          }
          l->dimx=size-1-pres_b[l->s]; l->dimy=1;
          if(!placement(l,size)){ 
            continue; 
          }
          // 対称解除法
          carryChain_symmetry(l,size);
        } //w
      } //e
    } //n
    sum[tid]=l->COUNTER[l->COUNT2]*2+l->COUNTER[l->COUNT4]*4+l->COUNTER[l->COUNT8]*8;
  }else{
    sum[tid]=0;
  }
  end:
  __syncthreads();if(tid<64&&tid+64<THREAD_NUM){sum[tid]+=sum[tid+64];} 
  __syncthreads();if(tid<32){sum[tid]+=sum[tid+32];} 
  __syncthreads();if(tid<16){sum[tid]+=sum[tid+16];} 
  __syncthreads();if(tid<8){sum[tid]+=sum[tid+8];} 
  __syncthreads();if(tid<4){sum[tid]+=sum[tid+4];} 
  __syncthreads();if(tid<2){sum[tid]+=sum[tid+2];} 
  __syncthreads();if(tid<1){sum[tid]+=sum[tid+1];} 
  __syncthreads();if(tid==0){results[bid]=sum[0];}
} 
void carryChain_build_nodeLayer(int){
  unsigned int* pres_a_Cuda;
  unsigned int* pres_b_Cuda;
  unsigned int* resultsCuda;  
  listChain();  //チェーンのリストを作成
  cudaMalloc((void**) &pres_a_Cuda,sizeof(int)*steps);
  cudaMalloc((void**) &pres_b_Cuda,sizeof(int)*steps);
  cudaMalloc((void**) &resultsCuda,sizeof(int)*steps/THREAD_NUM);
  int totalCond=g.size/2*(g.size-3);
  printf("totalCond:%d\n",totalCond);
  cudaMemcpy(pres_a_Cuda,g.pres_a,
      sizeof(int)*steps,cudaMemcpyHostToDevice);
  cudaMemcpy(pres_b_Cuda,g.pres_b,
      sizeof(int)*steps,cudaMemcpyHostToDevice);
  unsigned int* results=new unsigned int[steps];
  cuda_kernel<<<steps/THREAD_NUM,THREAD_NUM
    >>>(pres_a_Cuda,pres_b_Cuda,resultsCuda,totalCond,g.size);
  cudaMemcpy(results,resultsCuda,
      sizeof(int)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
  for(int col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}	
}
//メイン
int main(int argc,char** argv)
{
  bool cpu=false,cpur=false,gpu=false,gpuNodeLayer=false;
  int argstart=2;
  if(argc>=2&&argv[1][0]=='-'){
    if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='r'||argv[1][1]=='R'){cpur=true;}
    else if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='g'||argv[1][1]=='G'){gpu=true;}
    else if(argv[1][1]=='n'||argv[1][1]=='N'){gpuNodeLayer=true;}
    else{ gpuNodeLayer=true; } //デフォルトをgpuとする
    argstart=2;
  }
  if(argc<argstart){
    printf("Usage: %s [-c|-g|-r|-s] n steps\n",argv[0]);
    printf("  -r: CPU 再帰\n");
    printf("  -c: CPU 非再帰\n");
    printf("  -g: GPU 再帰\n");
    printf("  -n: GPU キャリーチェーン\n");
  }
  if(cpur){ printf("\n\nCPU キャリーチェーン 再帰 \n"); }
  else if(cpu){ printf("\n\nCPU キャリーチェーン 非再帰 \n"); }
  else if(gpu){ printf("\n\nGPU キャリーチェーン シングルスレッド\n"); }
  else if(gpuNodeLayer){ printf("\n\nGPU キャリーチェーン マルチスレッド\n"); }
  if(cpu||cpur)
  {
    int min=4; 
    int targetN=15;
    struct timeval t0;
    struct timeval t1;
    printf("%s\n"," N:        Total      Unique      dd:hh:mm:ss.ms");
    for(int size=min;size<=targetN;size++){
      TOTAL=UNIQUE=0;
      gettimeofday(&t0, NULL);//計測開始
      if(cpur){ //再帰
        g.size=size;
        carryChain(size);
       // carryChainR();
      }
      if(cpu){ //非再帰
        g.size=size;
        carryChain(size);
      }
      //
      gettimeofday(&t1, NULL);//計測終了
      int ss;int ms;int dd;
      if(t1.tv_usec<t0.tv_usec) {
        dd=(t1.tv_sec-t0.tv_sec-1)/86400;
        ss=(t1.tv_sec-t0.tv_sec-1)%86400;
        ms=(1000000+t1.tv_usec-t0.tv_usec+500)/10000;
      }else {
        dd=(t1.tv_sec-t0.tv_sec)/86400;
        ss=(t1.tv_sec-t0.tv_sec)%86400;
        ms=(t1.tv_usec-t0.tv_usec+500)/10000;
      }//end if
      int hh=ss/3600;
      int mm=(ss-hh*3600)/60;
      ss%=60;
      printf("%2d:%13ld%12ld%8.2d:%02d:%02d:%02d.%02d\n",size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
    } //end for
  }//end if
  if(gpu||gpuNodeLayer)
  {
    if(!InitCUDA()){return 0;}
    /* int steps=24576; */
    int min=7;
    int targetN=14;
    min=7;
    targetN=14;
    struct timeval t0;
    struct timeval t1;
    printf("%s\n"," N:        Total      Unique      dd:hh:mm:ss.ms");
    for(int size=min;size<=targetN;size++){
      gettimeofday(&t0,NULL);   // 計測開始
      if(gpu){
        TOTAL=UNIQUE=0;
        g.size=size;
        carryChain_build_nodeLayer(size); // キャリーチェーン
        //TOTAL=carryChain_solve_nodeLayer(size,0,0,0); //キャリーチェーン
      }else if(gpuNodeLayer){
        TOTAL=UNIQUE=0;
        g.size=size;
        carryChain_build_nodeLayer(size); // キャリーチェーン
      }
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
      printf("%2d:%13ld%12ld%8.2d:%02d:%02d:%02d.%02d\n",size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
    }//end for
  }//end if
  return 0;
}
```

## 実行結果
```
・carryChain GPU outside
一番外側の forでGPUを起動
 7:           40           0      00:00:00:00.41
 8:           92           0      00:00:00:00.96
 9:          352           0      00:00:00:04.15
10:          724           0      00:00:00:14.54
11:         2680           0      00:00:00:41.31
12:        14200           0      00:00:01:46.98
13:        73712           0      00:00:04:35.11
14:       365596           0      00:00:13:57.61
```

## CarryChainの内側でCUDAを起動する場合の ソースコード
``` c :06CUDA_CarryChain_outside.cu
/**
 *
 * bash版キャリーチェーンのC言語版のGPU/CUDA移植版
 * CUDAの実行をfor文の一番内側、クイーンを上下左右2行2列置いたあと
 
 詳しい説明はこちらをどうぞ
 https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
 *

・carryChain  CPU デフォルト
 7:           40           0      00:00:00:00.00
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.00
11:         2680           0      00:00:00:00.02
12:        14200           0      00:00:00:00.07
13:        73712           0      00:00:00:00.24
14:       365596           0      00:00:00:00.78

・carryChain GPU outside
一番外側の forでGPUを起動
 7:           40           0      00:00:00:00.41
 8:           92           0      00:00:00:00.96
 9:          352           0      00:00:00:04.15
10:          724           0      00:00:00:14.54
11:         2680           0      00:00:00:41.31
12:        14200           0      00:00:01:46.98
13:        73712           0      00:00:04:35.11
14:       365596           0      00:00:13:57.61

・carryChain GPU inside
backTrack部分でGPUを起動
stepsに達するまで貯めた

GPU
        Total      Unique      dd:hh:mm:ss.ms
 7:           40           0      00:00:00:00.40
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.01
11:         2680           0      00:00:00:00.03
12:        14200           0      00:00:00:00.11
13:        73712           0      00:00:00:01.59
14:       365596           0      00:00:00:12.11

 
アーキテクチャの指定（なくても問題なし、あれば高速）
-arch=sm_13 or -arch=sm_61

CPUの再帰での実行
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain.cu && ./a.out -r

CPUの非再帰での実行
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain.cu && ./a.out -c

GPUのシングルスレッド
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain.cu && ./a.out -g

GPUのマルチスレッド
$ nvcc -O3 -arch=sm_61 05CUDA_CarryChain.cu && ./a.out -n
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
// システムによって以下のマクロが必要であればコメントを外してください。
//#define UINT64_C(c) c ## ULL
//
// グローバル変数
unsigned long TOTAL=0; 
unsigned long UNIQUE=0;
unsigned long totalCond=0;
// キャリーチェーン 非再帰版
// 構造体
typedef struct
{
  unsigned int size;
  unsigned int pres_a[930]; 
  unsigned int pres_b[930];
  // uint64_t COUNTER[3];      
  // //カウンター配列
  // unsigned int COUNT2;
  // unsigned int COUNT4;
  // unsigned int COUNT8;
}Global; Global g;
// 構造体
typedef struct
{
  uint64_t row;
  uint64_t down;
  uint64_t left;
  uint64_t right;
  long long x[MAX];
}Board ;
typedef struct
{
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
  //カウンター配列
  unsigned int COUNT2;
  unsigned int COUNT4;
  unsigned int COUNT8;
  unsigned int type;

}Local;


uint64_t* totalDown=new uint64_t[steps];
uint64_t* totalLeft=new uint64_t[steps];
uint64_t* totalRight=new uint64_t[steps];
uint64_t* totalRow=new uint64_t[steps];
int* totalType=new int[steps];
long* results =new long[steps];
bool matched=false;
uint64_t* rowCuda;
uint64_t* downCuda;
uint64_t* leftCuda;
uint64_t* rightCuda;
long* resultsCuda;
int* typeCuda;

/**
  CPU/CPUR 再帰・非再帰共通
  */
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
/**
  CPU 非再帰
*/
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
//非再帰
__global__ void solve(int size,int current,int* totalType,uint64_t* totalRow,uint64_t* totalDown,uint64_t* totalLeft,uint64_t* totalRight,
  long* results,int totalCond){

  const int tid=threadIdx.x;
  const int bid=blockIdx.x;
  const int idx=bid*blockDim.x+tid;
  uint64_t  row_a[MAX];
  uint64_t  down_a[MAX];
  uint64_t  left_a[MAX];
  uint64_t  right_a[MAX];
  uint64_t  bitmap_a[MAX];
  __shared__ int  sum[THREAD_NUM];
  
  uint64_t row=row_a[current]=totalRow[idx];
  uint64_t left=left_a[current]=totalLeft[idx];
  uint64_t down=down_a[current]=totalDown[idx];
  uint64_t right=right_a[current]=totalRight[idx];
  uint64_t bitmap=bitmap_a[current]=~(left_a[current]|down_a[current]|right_a[current]);
  int total=0;
  uint64_t bit;
  int ttype=totalType[idx];
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
void append(void* args){
  Local *l=(Local *)args;
  
  totalRow[totalCond]=l->B.row>>2;
  totalDown[totalCond]=((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1;
  totalLeft[totalCond]=l->B.left>>4;
  totalRight[totalCond]=(l->B.right>>4)<<(g.size-5);
  totalType[totalCond]=l->type;
  totalCond++;
  if(totalCond==steps){
    if(matched){
      cudaMemcpy(results,resultsCuda,
      sizeof(long)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
      for(int col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}
        matched=false;
      }
      cudaMemcpy(rowCuda,totalRow,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(downCuda,totalDown,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(leftCuda,totalLeft,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
      cudaMemcpy(rightCuda,totalRight,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
      
      cudaMemcpy(typeCuda,totalType,
      sizeof(int)*totalCond,cudaMemcpyHostToDevice);

      /** backTrack+bitmap*/
      //cuda_kernel<<<steps/THREAD_NUM,THREAD_NUM
      //>>>(size,size-mark,downCuda,leftCuda,rightCuda,resultsCuda,totalCond);
      solve<<<steps/THREAD_NUM,THREAD_NUM
      >>>(g.size,0,typeCuda,rowCuda,downCuda,leftCuda,rightCuda,resultsCuda,totalCond);
      
      cudaMemcpy(results,resultsCuda,
      sizeof(int)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);

      matched=true;
      totalCond=0;
  }

}
//非再帰 対称解除法
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
//非再帰  pthread run()
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
//非再帰  チェーンのビルド
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)];
  cudaMalloc((void**) &rowCuda,sizeof(uint64_t)*steps);
  cudaMalloc((void**) &downCuda,sizeof(uint64_t)*steps);
  cudaMalloc((void**) &leftCuda,sizeof(uint64_t)*steps);
  cudaMalloc((void**) &rightCuda,sizeof(uint64_t)*steps);
  cudaMalloc((void**) &typeCuda,sizeof(int)*steps);
  cudaMalloc((void**) &resultsCuda,sizeof(long)*steps/THREAD_NUM);
  // カウンターの初期化
  l->COUNT2=0; l->COUNT4=1; l->COUNT8=2;
  l->COUNTER[l->COUNT2]=l->COUNTER[l->COUNT4]=l->COUNTER[l->COUNT8]=0;
  // Board の初期化 nB,eB,sB,wB;
  l->B.row=l->B.down=l->B.left=l->B.right=0;
  // Board x[]の初期化
  for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }
  //１ 上２行に置く
  // memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  l->wB=l->B;
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    thread_run(&l);

  } //w
  
  if(matched){
    cudaMemcpy(results,resultsCuda,
        sizeof(long)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
    for(int col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}
    matched=false;
  }
  cudaMemcpy(rowCuda,totalRow,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(downCuda,totalDown,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(leftCuda,totalLeft,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(rightCuda,totalRight,
      sizeof(uint64_t)*totalCond,cudaMemcpyHostToDevice);
  cudaMemcpy(typeCuda,totalType,
      sizeof(int)*totalCond,cudaMemcpyHostToDevice);
  /** backTrack+bitmap*/
  solve<<<steps/THREAD_NUM,THREAD_NUM
      >>>(g.size,0,typeCuda,rowCuda,downCuda,leftCuda,rightCuda,resultsCuda,totalCond);
  cudaMemcpy(results,resultsCuda,
      sizeof(long)*steps/THREAD_NUM,cudaMemcpyDeviceToHost);
  for(int col=0;col<steps/THREAD_NUM;col++){TOTAL+=results[col];}	
  
  /**
   * 集計
   */
  /*
  UNIQUE= l->COUNTER[l->COUNT2]+
          l->COUNTER[l->COUNT4]+
          l->COUNTER[l->COUNT8];
  TOTAL=  l->COUNTER[l->COUNT2]*2+
          l->COUNTER[l->COUNT4]*4+
          l->COUNTER[l->COUNT8]*8;
  */        
}
//非再帰  キャリーチェーン
void carryChain()
{
  listChain();  //チェーンのリストを作成
  buildChain(); // チェーンのビルド
  // calcChain(&l);  // 集計
}

  /**
   * 集計
   */
  /*
  UNIQUE= l->COUNTER[l->COUNT2]+
          l->COUNTER[l->COUNT4]+
          l->COUNTER[l->COUNT8];
  TOTAL=  l->COUNTER[l->COUNT2]*2+
          l->COUNTER[l->COUNT4]*4+
          l->COUNTER[l->COUNT8]*8;
  */        
/**
  GPU 
 */
// CUDA 初期化
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
//メイン
int main(int argc,char** argv)
{
  bool cpu=false,cpur=false,gpu=false,gpuNodeLayer=false;
  int argstart=2;
  if(argc>=2&&argv[1][0]=='-'){
    if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='r'||argv[1][1]=='R'){cpur=true;}
    else if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='g'||argv[1][1]=='G'){gpu=true;}
    else if(argv[1][1]=='n'||argv[1][1]=='N'){gpuNodeLayer=true;}
    else{ gpuNodeLayer=true; } //デフォルトをgpuとする
    argstart=2;
  }
  if(argc<argstart){
    printf("Usage: %s [-c|-g|-r|-s] n steps\n",argv[0]);
    printf("  -r: CPU 再帰\n");
    printf("  -c: CPU 非再帰\n");
    printf("  -g: GPU 再帰\n");
    printf("  -n: GPU キャリーチェーン\n");
  }
  if(cpur){ printf("\n\nCPU キャリーチェーン 再帰 \n"); }
  else if(cpu){ printf("\n\nCPU キャリーチェーン 非再帰 \n"); }
  else if(gpu){ printf("\n\nGPU キャリーチェーン シングルスレッド\n"); }
  else if(gpuNodeLayer){ printf("\n\nGPU キャリーチェーン マルチスレッド\n"); }
  if(cpu||cpur)
  {
    int min=7; 
    int targetN=14;
    struct timeval t0;
    struct timeval t1;
    printf("%s\n"," N:        Total      Unique      dd:hh:mm:ss.ms");
    for(int size=min;size<=targetN;size++){
      TOTAL=UNIQUE=0;
      //for(int i=0;i<steps;i++){
      //  results[i]=0;
      //}  
      totalCond=0;
      gettimeofday(&t0, NULL);//計測開始
      if(cpur){ //再帰
        g.size=size;
        carryChain();
        //carryChainR();
      }
      if(cpu){ //非再帰
        g.size=size;
        carryChain();
      }
      //
      gettimeofday(&t1, NULL);//計測終了
      int ss;int ms;int dd;
      if(t1.tv_usec<t0.tv_usec) {
        dd=(t1.tv_sec-t0.tv_sec-1)/86400;
        ss=(t1.tv_sec-t0.tv_sec-1)%86400;
        ms=(1000000+t1.tv_usec-t0.tv_usec+500)/10000;
      }else {
        dd=(t1.tv_sec-t0.tv_sec)/86400;
        ss=(t1.tv_sec-t0.tv_sec)%86400;
        ms=(t1.tv_usec-t0.tv_usec+500)/10000;
      }//end if
      int hh=ss/3600;
      int mm=(ss-hh*3600)/60;
      ss%=60;
      printf("%2d:%13ld%12ld%8.2d:%02d:%02d:%02d.%02d\n",size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
    } //end for
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
  }//end if
  if(gpu||gpuNodeLayer)
  {
    if(!InitCUDA()){return 0;}
    /* int steps=24576; */
    int min=4;
    int targetN=21;
    struct timeval t0;
    struct timeval t1;
    printf("%s\n"," N:        Total      Unique      dd:hh:mm:ss.ms");
    for(int size=min;size<=targetN;size++){
      gettimeofday(&t0,NULL);   // 計測開始
      totalCond=0;
      if(gpu){
        TOTAL=UNIQUE=0;
        g.size=size;
        carryChain();
        //TOTAL=carryChain_solve_nodeLayer(size,0,0,0); //キャリーチェーン
      }else if(gpuNodeLayer){
        TOTAL=UNIQUE=0;
        g.size=size;
        carryChain();
        //carryChain_build_nodeLayer(size); // キャリーチェーン
      }
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
      //printf("%2d:%13ld%12ld%8.2d:%02d:%02d:%02d.%02d\n",size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
      printf("%2d:%13ld%12ld%8.2d:%02d:%02d:%02d.%02d\n",size,TOTAL,0,dd,hh,mm,ss,ms);
    }//end for
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
  }//end if
  return 0;
}
```

## 実行結果
```
・carryChain GPU inside
backTrack部分でGPUを起動
stepsに達するまで貯めた

GPU
        Total      Unique      dd:hh:mm:ss.ms
 7:           40           0      00:00:00:00.40
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.01
11:         2680           0      00:00:00:00.03
12:        14200           0      00:00:00:00.11
13:        73712           0      00:00:00:01.59
14:       365596           0      00:00:00:12.11
```

GPUを使わずにCPUでCarryChainを実行した場合
```
・carryChain  CPU デフォルト
 7:           40           0      00:00:00:00.00
 8:           92           0      00:00:00:00.00
 9:          352           0      00:00:00:00.00
10:          724           0      00:00:00:00.00
11:         2680           0      00:00:00:00.02
12:        14200           0      00:00:00:00.07
13:        73712           0      00:00:00:00.24
14:       365596           0      00:00:00:00.78
```


だめですね。キャリーチェーンに明日はありませんね。
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






