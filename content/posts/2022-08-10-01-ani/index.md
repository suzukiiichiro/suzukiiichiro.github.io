---
title: "NQueen日記 2022/08/10"
description: "NQueenのロジックを研究してます。日々NQueenで試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-08-10T09:55:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 8月10日
比較して同じだった場合は反時計回りに90度回転させたもの同士を比較するようにしてみた。  
例えば 上2行と右2列が同じだった場合はそれぞれを反時計回りに90度回転させた左2列と上2行を比較してみた。  

```
    //top ==  right   left > top
    if((topSide_0==rightSide_0)&&(topSide_1==rightSide_1)){
      if((leftSide_0>topSide_0)||((leftSide_0==topSide_0)&&(leftSide_1>topSide_1))){
        return 3;
      }
    }
    //top ==  bottom  left > right
    if((topSide_0==bottomSide_0)&&(topSide_1==bottomSide_1)){
      if((leftSide_0>rightSide_0)||((leftSide_0==rightSide_0)&&(leftSide_1>rightSide_1))){
        return 3;
      }
    }
    //top ==  left    left > bottom
    if((topSide_0==leftSide_0)&&(topSide_1==leftSide_1)){
      if((leftSide_0>bottomSide_0)||((leftSide_0==bottomSide_0)&&(leftSide_1>bottomSide_1))){
        return 3;
      }
    }

    //top == mtop     left > mleft
    if((topSide_0==mtopSide_0)&&(topSide_1==mtopSide_1)){
      if((leftSide_0>mleftSide_0)||((leftSide_0==mleftSide_0)&&(leftSide_1>mleftSide_1))){
        return 3;
      }
    }
    //top == mright   left > mtop
    if((topSide_0==mrightSide_0)&&(topSide_1==mrightSide_1)){
      if((leftSide_0>mtopSide_0)||((leftSide_0==mtopSide_0)&&(leftSide_1>mtopSide_1))){
        return 3;
      }
    }
    //top == mbottom  left > mright
    if((topSide_0==mbottomSide_0)&&(topSide_1==mbottomSide_1)){
      if((leftSide_0>mrightSide_0)||((leftSide_0==mrightSide_0)&&(leftSide_1>mrightSide_1))){
        return 3;
      }
    }
    //top == mleft    left > mbottom  
    if((topSide_0==mleftSide_0)&&(topSide_1==mleftSide_1)){
      if((leftSide_0>mbottomSide_0)||((leftSide_0==mbottomSide_0)&&(leftSide_1>mbottomSide_1))){
        return 3;
      }
    }
```


N8,N9は数が合うようになった。
しかしN10以降は数がずれてる....

```
６．CPUR 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00
 5:           10               2            0.00
 6:            4               1            0.00
 7:           40               6            0.00
 8:           92              12            0.00
 9:          352              46            0.00
10:          720              92            0.01
11:         2668             341            0.04
12:        14148            1792            0.12
13:        73516            9247            0.36
14:       364508           45785            1.09
15:      2273920          285153            3.77
```
