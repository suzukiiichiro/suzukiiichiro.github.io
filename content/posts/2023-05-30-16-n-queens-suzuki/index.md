---
title: "Ｎクイーン問題（３６）第六章 C言語移植 その１６"
description: "pthreadの実装"
date: 2023-05-30T13:24:49+09:00
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

## pthreadの実装
THREADフラグを作成して スレッドのオン・オフで動作を確認しながら実装

スレッドオフだとちゃんと解が出る
オンだと出ない！


ここまできたら完成間近です。
このページのソースは完成直前であることから、スレッドで実行してもうまく動きません。

以下のフラグ THREAD=0 にしておけばスレッドを実行しない通常の処理となります。もちろんこの場合はちゃんと動きます。

16GCC_carryChain.c
+286
``` C:
/**
 * スレッドするか 1:する 0:しない
 */
// bool THREAD=0; 
bool THREAD=1; 
```
THREAD=1; にした場合は、以下のようなエラーとなります。

実行結果
```
 実行結果
bash-3.2$ gcc 16GCC_carryChain.c -o 16GCC && ./16GCC
Usage: ./16GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
Segmentation fault: 11
bash-3.2$
```

## pthreadの実装

pthreadの実装は、いくつかの手順を踏む必要があります。
まず、pthreadライブラリを追加して読み込みます。

16GCC_carryChain.c
+87
``` C:
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sys/time.h>
#include <pthread.h>
#define MAX 27
```

実行時に -pthreadを追加する必要があります。
```
bash-3.2$ gcc 16GCC_carryChain.c -o 16GCC -pthread && ./16GCC
```

pthreadへの実装が正しいかどうかを常に比較して実行したいので、THREADフラグをつくり、THREADが 1 であれば pthreadの処理をし、THREADが 0であれば、pthreadの処理を行わないようにすることで、pthreadに係る処理以外に問題がないことを確認できるようにします。

こうした方法は、難易度の高い処理を実装する上で、絶対に必要なことです。

16GCC_carryChain.c
+287
``` C:
/**
 * スレッドするか 1:する 0:しない
 */
// bool THREAD=0; 
bool THREAD=1; 
```

16GCC_carryChain.c
+308
``` C:
  if(THREAD){
    : //スレッド処理を行う
  }else{
    : //スレッド処理を行わない
  }
```

では、pthreadについて簡単に説明します。

16GCC_carryChain.c
+306
``` C:
  pthread_t pt[(g.size/2)*(g.size-3)+1];
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    if(THREAD){
      int iFbRet;
      iFbRet=pthread_create(&pt[l->w],NULL,&thread_run,&l[l->w]);
      if(iFbRet>0){
        printf("[mainThread] pthread_create #%d: %d\n", l[l->w].w, iFbRet);
      }
    }else{
      thread_run(&l);
    }
  } 
  /**
   * スレッド版 joinする
   */
  if(THREAD){
    for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
      pthread_join(pt[l->w],NULL);
    } 
  }else{
    //何もしない
  }
```

以下の行で pthreadのスレッドを作成します。
スレッドの数はＮの数によって変化します。
pt配列を必要な数だけ生成します。

``` C:
  pthread_t pt[(g.size/2)*(g.size-3)+1];
```

以下の行では、スレッドを生成している箇所です。
forループの w を添字にした pt配列を次々と生成します。
このときに、Local構造体を最後のパラメータで渡しています。
３番めのパラメータは、スレッドを実行する関数です。
これまでに作成した thread_run()を呼び出しています。

``` C:
      int iFbRet;
      iFbRet=pthread_create(&pt[l->w],NULL,&thread_run,&l[l->w]);
      if(iFbRet>0){
        printf("[mainThread] pthread_create #%d: %d\n", l[l->w].w, iFbRet);
```

pthreadに対応するために、大切なことがもう一点。
スレッド関数 thread_run()の関数をポインタにする必要があり、さらに、`return 0;`を返す必要があります。

16GCC_carryChain.c
+234
``` C:
// pthread run()
void* thread_run(void* args)
{
  Local *l=(Local *)args;
```

16GCC_carryChain.c
+281
``` C:
      } //w
    } //e
  } //n
  return 0;
}
```

そして、スレッドがたくさん生成される一つ一つのスレッドの処理が終了した場合、勝手に何処かに行ってしまわないように、各スレッドの終了を待機させ、すべてのスレッドの終了をじっと待つようにします。
この処理を `join()` するといいます。

16GCC_carryChain.c
+318
``` C:
  /**
   * スレッド版 joinする
   */
  if(THREAD){
    for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
      pthread_join(pt[l->w],NULL);
    } 
  }else{
    //何もしない
  }
```

すべてのスレッドの終了を待ち、すべてのスレッドの処理が完了したらいよいよ解の集計を行います。

16GCC_carryChain.c
+328
``` C:
  /**
   * 集計
   */
  if(THREAD){
    // スレッド版の集計
    for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
      // 集計
    } 
  }else{
    UNIQUE= l->COUNTER[l->COUNT2]+
            l->COUNTER[l->COUNT4]+
            l->COUNTER[l->COUNT8];
    TOTAL=  l->COUNTER[l->COUNT2]*2+
            l->COUNTER[l->COUNT4]*4+
            l->COUNTER[l->COUNT8]*8;
  }
```

今回のソースでは、 THREAD=0;（スレッドなし）ではきちんと解が出ますが、THREAD=1;（スレッドあり）では解が出ずエラーで終了します。

次回は、このエラーを修正し、pthread並列処理が完了します。
お楽しみに！




## ソースコード
``` C:16GCC_carryChain.c
/**
 *
 * bash版キャリーチェーンのC言語版
 * 最終的に 08Bash_carryChain_parallel.sh のように
 * 並列処理 pthread版の作成が目的
 *
 * 今回のテーマ
 * pthreadの実装
 * THREADフラグを作成して スレッドのオン・オフで動作を確認しながら実装
 * 
 * スレッドオフだとちゃんと解が出る
 * オンだと出ない！
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
 *
 実行結果
bash-3.2$ gcc 16GCC_carryChain.c -o 16GCC && ./16GCC
Usage: ./16GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
Segmentation fault: 11
bash-3.2$
 *
 * 簡単な実行
 * bash-3.2$ /usr/local/bin/gcc-10 15GCC_carryChain.c -pthread && ./a.out -r
 *  
 * 高速な実行 
 * $ /usr/local/bin/gcc-10 -Wall -W -O3 -g -ftrapv -std=c99 -mtune=native -march=native 15GCC_carryChain.c -o nq27 && ./nq27 -r
 *

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
  return 0;
}
// チェーンのビルド
/**
 * スレッドするか 1:する 0:しない
 */
// bool THREAD=0; 
bool THREAD=1; 
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)+1];

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
  pthread_t pt[(g.size/2)*(g.size-3)+1];
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    if(THREAD){
      int iFbRet;
      iFbRet=pthread_create(&pt[l->w],NULL,&thread_run,&l[l->w]);
      if(iFbRet>0){
        printf("[mainThread] pthread_create #%d: %d\n", l[l->w].w, iFbRet);
      }
    }else{
      thread_run(&l);
    }
  } 
  /**
   * スレッド版 joinする
   */
  if(THREAD){
    for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
      pthread_join(pt[l->w],NULL);
    } 
  }else{
    //何もしない
  }
  /**
   * 集計
   */
  if(THREAD){
    // スレッド版の集計
    for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
      // 集計
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
+289行目、+290行目にTHREADフラグがあります。
この場合は、pthreadで実行します（今は動きません）
```
// bool THREAD=0; 
bool THREAD=1; 
```

以下の場合は、これまで通りスレッド無しでの実行となります。
```
bool THREAD=0; 
// bool THREAD=1; 
```

```
bash-3.2$ gcc 16GCC_carryChain.c -o 16GCC && ./16GCC
Usage: ./16GCC [-c|-g]
  -c: CPU Without recursion
  -r: CPUR Recursion


７．キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
Segmentation fault: 11
bash-3.2$
```


さて、いよいよ次は完成です。お楽しみに！


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

