---
title: "NQueen日記 2022/08/29"
description: "NQueenのロジックを研究してます。日々NQueenで試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-08-29T09:55:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 8月29日
ミラー処理を入れてみた。
ミラー処理は1行目については右側半分だけクイーンを置くというもの
奇数の場合は真ん中もやる。

ミラー処理を適用した結果適用前より少し速くなった。
nの数が増えるほど効果が弱まっているのはきになる。
まずは、引き続き枝刈り処理を追加していこうと思う。


```
void NQueenR(int size,long mask,int aBoard[],int bBoard[],long bmask){
  int bit;
  int colsize;
  //nが奇数の場合は真ん中もやる
  if(size%2==1){
   colsize=size/2+1;
  }else{
   colsize=size/2;
  }
  for(int col=0;col<colsize;col++){
    bBoard[0]=bit=(1<<col);
    int x=0;
    if(bit==1){
      x=0;
    }else if(bit==2){
      x=1;
    }else if(bit==4){
      x=2;
    }else if(bit==8){
      x=3;
    }else if(bit==16){
      x=4;
    }else if(bit==32){
      x=5;
    }else if(bit==64){
      x=6;
    }else if(bit==128){
      x=7;
    }else if(bit==256){
      x=8;
    }else if(bit==512){
      x=9;
    }else if(bit==1024){
      x=10;
    }else if(bit==2048){
      x=11;
    }else if(bit==4096){
      x=12;
    }else if(bit==8192){
      x=13;
    }else if(bit==16384){
      x=14;
    }else if(bit==32768){
      x=15;
    }else if(bit==65536){
      x=16;
    }else if(bit==131072){
      x=17;
    }
    aBoard[0]=x;
    solve_nqueenr(size,mask,1,bit<<1,bit,bit>>1,aBoard,1<<(size-1+x),bit,1<<(x),bBoard,bmask);
    //NQueenR(size,mask,row+1,(left|bit)<<1, (down|bit),(right|bit)>>1,aBoard,lleft|1<<(size-1-row+x),ldown|bit,lright|1<<(row+x),bBoard,bmask);
  }
  

}

```


```
ミラー適用後
６．CPUR 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.01
11:         2680             341            0.02
12:        14200            1788            0.06
13:        73712            9237            0.20
14:       365596           45771            0.63
15:      2279184          285095            2.52
16:     14772512         1847425           11.85
17:     95815104        11979381         1:10.41
```

```
ミラー適用前
６．CPUR 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          724              92            0.01
11:         2680             341            0.03
12:        14200            1788            0.11
13:        73712            9237            0.32
14:       365596           45771            1.00
15:      2279184          285095            3.37
16:     14772512         1847425           15.38
17:     95815104        11979381         1:19.15
```

