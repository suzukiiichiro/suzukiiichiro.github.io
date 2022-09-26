---
title: "NQueen日記 2022/09/09"
description: "NQueenのロジックを研究してます。日々NQueenで試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-09-09T09:55:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 9月9日

数が合わない点はsymmetryOps内での単純なコードの間違えだったため修正して数が合った。 
ただ、速度が過去のロジックより２０％遅い。 
そこで、symmetryOpsを突破した数を調査してみた。 

KOHO2,KOHO4,KOHO8がそれぞれsymmetryOps を突破してCOUNT２,COUNT4,COUNT8の候補となったもの。 
数を出したところ、今のロジックは過去のロジックよりKOHO8の数が倍くらい多い。 

```
今のロジック
６．CPUR 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00:STEP:6:KOHO2:1:KOHO4:0:KOHO8:0
 5:           10               2            0.00:STEP:16:KOHO2:1:KOHO4:0:KOHO8:1
 6:            4               1            0.00:STEP:55:KOHO2:1:KOHO4:1:KOHO8:3
 7:           40               6            0.00:STEP:285:KOHO2:1:KOHO4:2:KOHO8:46
 8:           92              12            0.00:STEP:1651:KOHO2:1:KOHO4:8:KOHO8:381
 9:          352              46            0.00:STEP:7022:KOHO2:1:KOHO4:11:KOHO8:1889
10:          724              92            0.00:STEP:24935:KOHO2:5:KOHO4:38:KOHO8:6750
11:         2680             341            0.01:STEP:79391:KOHO2:5:KOHO4:47:KOHO8:22318
12:        14200            1788            0.03:STEP:237005:KOHO2:13:KOHO4:170:KOHO8:68576
13:        73712            9237            0.11:STEP:644806:KOHO2:13:KOHO4:191:KOHO8:198982
14:       365596           45771            0.51:STEP:1635763:KOHO2:25:KOHO4:574:KOHO8:539368
15:      2279184          285095            2.62:STEP:3843863:KOHO2:25:KOHO4:615:KOHO8:1373396
16:     14772512         1847425           15.11:STEP:8488361:KOHO2:41:KOHO4:1514:KOHO8:3265841
17:     95815104        11979381         1:38.70:STEP:17643021:KOHO2:41:KOHO4:1583:KOHO8:7307235
```

```
今までのロジック
６．nq27 再帰 バックトラック＋ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               1            0.00:STEP:31:KOHO2:1:KOHO4:0:KOHO8:0
 5:           10               2            0.00:STEP:153:KOHO2:1:KOHO4:0:KOHO8:2
 6:            4               1            0.00:STEP:592:KOHO2:1:KOHO4:1:KOHO8:6
 7:           40               6            0.00:STEP:2629:KOHO2:1:KOHO4:2:KOHO8:29
 8:           92              12            0.00:STEP:12195:KOHO2:1:KOHO4:8:KOHO8:170
 9:          352              46            0.00:STEP:52319:KOHO2:1:KOHO4:11:KOHO8:849
10:          724              92            0.00:STEP:199807:KOHO2:5:KOHO4:38:KOHO8:3696
11:         2680             341            0.01:STEP:675495:KOHO2:5:KOHO4:47:KOHO8:14614
12:        14200            1788            0.04:STEP:2010177:KOHO2:13:KOHO4:170:KOHO8:51301
13:        73712            9237            0.12:STEP:5362062:KOHO2:13:KOHO4:191:KOHO8:163839
14:       365596           45771            0.43:STEP:12987395:KOHO2:25:KOHO4:574:KOHO8:473312
15:      2279184          285095            1.93:STEP:29011301:KOHO2:25:KOHO4:615:KOHO8:1257054
16:     14772512         1847425           10.75:STEP:60470849:KOHO2:41:KOHO4:1514:KOHO8:3071660
17:     95815104        11979381         1:09.18:STEP:118819519:KOHO2:41:KOHO4:1583:KOHO8:6997422
```

調査したところ 
backtrack1のところでsymmetryOpsをせずにKOHO8としてそのままnqueenに移行していたのが原因だった。 

上下左右2行２列全てにクイーン置けてないもの（例えば上下左は2行置けたが右は1行しか置けてないとか）を弾くようにしたらKOHO8の数も同じになった。 

上下左右2行２列にクイーンを置けないものは到達する可能性がないということが明らかになった。 

