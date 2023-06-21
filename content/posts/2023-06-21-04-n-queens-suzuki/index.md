---
title: "Ｎクイーン問題（５０）第七章 マルチプロセス Python編"
date: 2023-06-21T12:12:32+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - Python
  - アルゴリズム
  - 鈴木維一郎
---

![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

[エイト・クイーンのソース置き場 BashもJavaもPythonも！](https://github.com/suzukiiichiro/N-Queens)


## マルチプロセス
まずはBashの並列処理の実行結果を見てください。

```
 ## bash版
 <> 08Bash_carryChain_parallel.sh 並列処理
 N:        Total       Unique        hh:mm:ss
 4:            0            0         0:00:00
 5:            8            1         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:00
 8:           92           12         0:00:01
 9:          352           46         0:00:03
10:          724           92         0:00:15
11:         2680          341         0:00:52
12:        14200         1788         0:02:49
13:        73712         9237         0:09:18
14:       365596        45771         0:28:48
15:      2279184       285095         1:49:12 １時間４９分１２秒
```

遅いですね。
でも、ロジックは十分に理解できたと思います。

```
## C pthread版
bash-3.2$ gcc 17GCC_carryChain.c -o 17GCC && ./17GCC
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
18:    666090624     83274576        00:00:03:40.04
19:   4968057848    621051686        00:00:27:37.22
20:  39029188884   4878995797        00:03:39:23.79 ３時間３９分２３秒
bash-3.2$
```
速い。。。やっぱりＣは速いのです。もう言うことなしです。
で、Pythonのマルチプロセスはというと、

```
bash-3.2$ python 13Python_multiProcess.py
キャリーチェーン マルチプロセス
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.061
 6:            4            1         0:00:00.126
 7:           40            6         0:00:00.135
 8:           92           12         0:00:00.327
 9:          352           46         0:00:00.766
10:          724           92         0:00:02.327
11:         2680          341         0:00:09.042
12:        14200         1788         0:00:19.871
13:        73712         9237         0:00:53.388
14:       365596        45771         0:02:19.974
15:      2279184       285095         0:05:51.522
16:     14772512      1847425         0:17:01.656
17:     95815104     11979381         1:07:04.713
```

ま、１時間かけてBashでＮ１５まで処理できたところが、PythonだとＮ１７まで処理できました。

BashやPythonといったインタープリタの限界なのでしょうね。


## 解説とか
まずは以下を追加します。
```python
from multiprocessing import Pool as ThreadPool
```

マルチプロセスは`pool`が肝です。
`pool`で検索したその箇所に違いがあります。
ここでもシングルプロセス、マルチプロセスの切り替えフラグを作ります。
といっても、実際にフラグを作ったわけではなくて、以下のようにしました。

```python
  #
  # マルチプロセス
  def execProcess(self):
    #pool=ThreadPool(self.size)
    pool=ThreadPool((self.size//2)*(self.size-3) +1)
    #
    # シングルプロセスで実行
    #gttotal=list(pool.map(self.carryChain_single,range(1)))
    #
    # マルチプロセスで実行
    gttotal=list(pool.map(self.carryChain_multi,range( (self.size//2)*(self.size-3) +1)))

```


また、シングルプロセスとマルチプロセス時のメソッドの違いは、以下のとおりです。
```python
  #
  # シングルプロセス
  def carryChain_single(self,w):
    self.initChain()     # チェーンの初期化
    self.buildChain_singleThread(w)
    return self.getTotal(),self.getUnique()
  #
  # マルチプロセス
  def carryChain_multi(self,w):
    self.initChain()     # チェーンの初期化
    self.buildChain_multiThread(w)
    return self.getTotal(),self.getUnique()
```

以下の２つの関数は、`for`行を一行コメントアウトしてあるかいないかだけの違いです。

シングルプロセス版のビルドチェーン
```python
  #
  # シングルプロセス版 チェーンのビルド
  def buildChain_singleThread(self,w):
    wB=copy.deepcopy(self.B)
    for w in range( (self.size//2)*(self.size-3) +1):
      self.B=copy.deepcopy(wB)
      # １．０行目と１行目にクイーンを配置
```

マルチプロセス版のビルドチェーン
`for`をコメントアウトした場合は、その下の行を関数末尾まで左インデントするのをお忘れなく。
```python
  #
  # マルチプロセス版 チェーンのビルド
  def buildChain_multiThread(self,w):
    wB=copy.deepcopy(self.B)
    # for w in range( (self.size//2)*(self.size-3) +1):
    self.B=copy.deepcopy(wB)
    # １．０行目と１行目にクイーンを配置
```


で、どうやってシングルプロセスとマルチプロセスで実行を切り分けているかというと、シングルプロセスの場合は、以下のソースで、

```python
    gttotal=list(pool.map(self.carryChain_single,range(1)))
```

range(1) 
これで、プロセスは一つだけ起動します。


```python

  #
  # マルチプロセス
  def execProcess(self):
    #pool=ThreadPool(self.size)
    pool=ThreadPool((self.size//2)*(self.size-3) +1)
    #
    # シングルプロセスで実行
    #gttotal=list(pool.map(self.carryChain_single,range(1)))
    #
    # マルチプロセスで実行
    gttotal=list(pool.map(self.carryChain_multi,range( (self.size//2)*(self.size-3) +1)))

```

逆にマルチプロセスで実行したい場合は、
```python
    gttotal=list(pool.map(self.carryChain_multi,range( (self.size//2)*(self.size-3) +1)))
```

以下の行で、適宜プロセスがどどっと起動します。
```python
range( (self.size//2)*(self.size-3) +1)
```


## 集計
集計も肝のひとつです。

```python
  #
  # マルチプロセス
  def execProcess(self):
    #pool=ThreadPool(self.size)
    pool=ThreadPool((self.size//2)*(self.size-3) +1)
    #
    # シングルプロセスで実行
    #gttotal=list(pool.map(self.carryChain_single,range(1)))
    #
    # マルチプロセスで実行
    gttotal=list(pool.map(self.carryChain_multi,range( (self.size//2)*(self.size-3) +1)))
    #
    #
    # 集計処理
    total = 0 # ローカル変数
    unique = 0
    for _t, _u in gttotal:
      total+=_t
      unique+=_u
    pool.close()
    pool.join()
    return total,unique
```

実行結果を`map()`に入れて、それを`list`に入れて、`gttotal`に格納しています。その`gttotal`を `for`で繰り返し、`total`と`unique`にそれぞれ代入し（できるんです）`pool.close()`、`pool.join()`して最後に、`total`と`unique`をそれぞれ`return`します（できるんです）。

このソースは本当にトリッキーです。
その分、マルチスレッドではなかった速度で動きます。
スキルの向上にも手応えがあったと思います。


## ソースコード
```python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
import numpy as np
import copy
from datetime import datetime
import logging
import threading
from threading import Thread
from multiprocessing import Pool as ThreadPool


"""
マルチプロセス対応版 Ｎクイーン



詳細はこちら。
【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題

エイト・クイーンのプログラムアーカイブ
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens

# 実行 
$ python <filename.py>

# 実行結果
bash-3.2$ python 12Python_multiThread.py
キャリーチェーン シングルスレッド
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.002
 6:            4            1         0:00:00.010
 7:           40            6         0:00:00.046
 8:           92           12         0:00:00.205
 9:          352           46         0:00:00.910
10:          724           92         0:00:03.542
11:         2680          341         0:00:12.184
12:        14200         1788         0:00:36.986


bash-3.2$ python 12Python_multiThread.py
キャリーチェーン マルチスレッド
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.003
 6:            4            1         0:00:00.013
 7:           40            6         0:00:00.049
 8:           92           12         0:00:00.215
 9:          352           46         0:00:00.934
10:          724           92         0:00:03.690
11:         2680          341         0:00:12.708
12:        14200         1788         0:00:40.294

bash-3.2$ python 13Python_multiProcess.py
キャリーチェーン マルチプロセス
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.061
 6:            4            1         0:00:00.126
 7:           40            6         0:00:00.135
 8:           92           12         0:00:00.327
 9:          352           46         0:00:00.766
10:          724           92         0:00:02.327
11:         2680          341         0:00:09.042
12:        14200         1788         0:00:19.871
13:        73712         9237         0:00:53.388
14:       365596        45771         0:02:19.974
15:      2279184       285095         0:05:51.522
16:     14772512      1847425         0:17:01.656
17:     95815104     11979381         1:07:04.713

 ## bash版
 <> 08Bash_carryChain_parallel.sh 並列処理
 N:        Total       Unique        hh:mm:ss
 4:            0            0         0:00:00
 5:            8            1         0:00:00
 6:            4            1         0:00:00
 7:           40            6         0:00:00
 8:           92           12         0:00:01
 9:          352           46         0:00:03
10:          724           92         0:00:15
11:         2680          341         0:00:52
12:        14200         1788         0:02:49
13:        73712         9237         0:09:18
14:       365596        45771         0:28:48
15:      2279184       285095         1:49:12 １時間４９分１２秒

## C pthread版
bash-3.2$ gcc 17GCC_carryChain.c -o 17GCC && ./17GCC
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
18:    666090624     83274576        00:00:03:40.04
19:   4968057848    621051686        00:00:27:37.22
20:  39029188884   4878995797        00:03:39:23.79
bash-3.2$

"""
#
# Board ボードクラス
class Board:
  def __init__(self,size):
    self.size=size
    self.row=0
    self.left=0
    self.down=0
    self.right=0
    self.X=[-1 for i in range(size)]
#
# nQueens メインスレッドクラス
class nQueens(): # pylint:disable=RO902
  #
  # ユニーク数の集計
  def getUnique(self):
    return self.COUNTER[0]+self.COUNTER[1]+self.COUNTER[2]
  #
  # 合計解の集計
  def getTotal(self):
    return self.COUNTER[0]*2+self.COUNTER[1]*4+self.COUNTER[2]*8
  #
  # ボード外側２列を除く内側のクイーン配置処理
  def solve(self,row,left,down,right):
    total=0
    if not down+1:
      return 1
    while row&1:
      row>>=1
      left<<=1
      right>>=1
    row>>=1           # １行下に移動する
    bitmap=~(left|down|right)
    while bitmap!=0:
      bit=-bitmap&bitmap
      total+=self.solve(row,(left|bit)<<1,down|bit,(right|bit)>>1)
      bitmap^=bit
    return total
  #
  # キャリーチェーン　solve()を呼び出して再起を開始する
  def process(self,sym):
    self.COUNTER[sym]+=self.solve(self.B.row>>2,self.B.left>>4,((((self.B.down>>2)|(~0<<(self.size-4)))+1)<<(self.size-5))-1,(self.B.right>>4)<<(self.size-5))
  #
  # キャリーチェーン　対象解除
  def carryChainSymmetry(self,n,w,s,e):
    # n,e,s=(N-2)*(N-1)-1-w の場合は最小値を確認する。
    ww=(self.size-2)*(self.size-1)-1-w
    w2=(self.size-2)*(self.size-1)-1
    # 対角線上の反転が小さいかどうか確認する
    if s==ww and n<(w2-e): return 
    # 垂直方向の中心に対する反転が小さいかを確認
    if e==ww and n>(w2-n): return
    # 斜め下方向への反転が小さいかをチェックする
    if n==ww and e>(w2-s): return
    # 【枝刈り】１行目が角の場合
    # １．回転対称チェックせずにCOUNT8にする
    if not self.B.X[0]:
      self.process(2) # COUNT8
      return
    # n,e,s==w の場合は最小値を確認する。
    # : '右回転で同じ場合は、
    # w=n=e=sでなければ値が小さいのでskip
    # w=n=e=sであれば90度回転で同じ可能性 ';
    if s==w:
      if n!=w or e!=w: return
      self.process(0) # COUNT2
      return
    # : 'e==wは180度回転して同じ
    # 180度回転して同じ時n>=sの時はsmaller?  ';
    if e==w and n>=s:
      if n>s: return
      self.process(1) # COUNT4
      return
    self.process(2)   # COUNT8
    return
  #
  # キャリーチェーン 効きのチェック dimxは行 dimyは列
  def placement(self,dimx,dimy):
    if self.B.X[dimx]==dimy:
      return 1
    if self.B.X[0]:
      if self.B.X[0]!=-1:
        if((dimx<self.B.X[0] or dimx>=self.size-self.B.X[0]) and 
          (dimy==0 or dimy==self.size-1)): return 0
        if((dimx==self.size-1) and 
          (dimy<=self.B.X[0] or dimy>=self.size-self.B.X[0])):return 0
    else:
      if self.B.X[1]!=-1:
        if self.B.X[1]>=dimx and dimy==1: return 0
    if( (self.B.row & 1<<dimx) or 
        (self.B.left & 1<<(self.size-1-dimx+dimy)) or
        (self.B.down & 1<<dimy) or
        (self.B.right & 1<<(dimx+dimy))): return 0
    self.B.row|=1<<dimx
    self.B.left|=1<<(self.size-1-dimx+dimy)
    self.B.down|=1<<dimy
    self.B.right|=1<<(dimx+dimy)
    self.B.X[dimx]=dimy
    return 1
  # シングルプロセス版 チェーンのビルド
  def buildChain_singleThread(self,w):
    wB=copy.deepcopy(self.B)
    for w in range( (self.size//2)*(self.size-3) +1):
      self.B=copy.deepcopy(wB)
      # １．０行目と１行目にクイーンを配置
      if self.placement(0,self.pres_a[w])==0:
        continue
      if self.placement(1,self.pres_b[w])==0:
        continue
      # ２．９０度回転
      nB=copy.deepcopy(self.B)
      mirror=(self.size-2)*(self.size-1)-w
      for n in range(w,mirror,1):
        self.B=copy.deepcopy(nB)
        if self.placement(self.pres_a[n],self.size-1)==0:
          continue
        if self.placement(self.pres_b[n],self.size-2)==0:
          continue
        # ３．９０度回転
        eB=copy.deepcopy(self.B)
        for e in range(w,mirror,1):
          self.B=copy.deepcopy(eB)
          if self.placement(self.size-1,self.size-1-self.pres_a[e])==0:
            continue
          if self.placement(self.size-2,self.size-1-self.pres_b[e])==0:
            continue
          # ４．９０度回転
          sB=copy.deepcopy(self.B)
          for s in range(w,mirror,1):
            self.B=copy.deepcopy(sB)
            if self.placement(self.size-1-self.pres_a[s],0)==0:
              continue
            if self.placement(self.size-1-self.pres_b[s],1)==0:
              continue
            # 対象解除法
            self.carryChainSymmetry(n,w,s,e)
  #
  # マルチプロセス版 チェーンのビルド
  def buildChain_multiThread(self,w):
    wB=copy.deepcopy(self.B)
    # for w in range( (self.size//2)*(self.size-3) +1):
    self.B=copy.deepcopy(wB)
    # １．０行目と１行目にクイーンを配置
    if self.placement(0,self.pres_a[w])==0:
      # continue
      return 
    if self.placement(1,self.pres_b[w])==0:
      # continue
      return 
    # ２．９０度回転
    nB=copy.deepcopy(self.B)
    mirror=(self.size-2)*(self.size-1)-w
    for n in range(w,mirror,1):
      self.B=copy.deepcopy(nB)
      if self.placement(self.pres_a[n],self.size-1)==0:
        continue
      if self.placement(self.pres_b[n],self.size-2)==0:
        continue
      # ３．９０度回転
      eB=copy.deepcopy(self.B)
      for e in range(w,mirror,1):
        self.B=copy.deepcopy(eB)
        if self.placement(self.size-1,self.size-1-self.pres_a[e])==0:
          continue
        if self.placement(self.size-2,self.size-1-self.pres_b[e])==0:
          continue
        # ４．９０度回転
        sB=copy.deepcopy(self.B)
        for s in range(w,mirror,1):
          self.B=copy.deepcopy(sB)
          if self.placement(self.size-1-self.pres_a[s],0)==0:
            continue
          if self.placement(self.size-1-self.pres_b[s],1)==0:
            continue
          # 対象解除法
          self.carryChainSymmetry(n,w,s,e)
  #
  # チェーンの初期化
  def initChain(self):
    idx=0
    for a in range(self.size):
      for b in range(self.size):
        if (a>=b and (a-b)<=1) or (b>a and (b-a<=1)):
          continue
        self.pres_a[idx]=a
        self.pres_b[idx]=b
        idx+=1
  #
  # シングルプロセス
  def carryChain_single(self,w):
    self.initChain()     # チェーンの初期化
    self.buildChain_singleThread(w)
    return self.getTotal(),self.getUnique()
  #
  # マルチプロセス
  def carryChain_multi(self,w):
    self.initChain()     # チェーンの初期化
    self.buildChain_multiThread(w)
    return self.getTotal(),self.getUnique()
  #
  # マルチプロセス
  def execProcess(self):
    #pool=ThreadPool(self.size)
    pool=ThreadPool((self.size//2)*(self.size-3) +1)
    #
    # シングルプロセスで実行
    #gttotal=list(pool.map(self.carryChain_single,range(1)))
    #
    # マルチプロセスで実行
    gttotal=list(pool.map(self.carryChain_multi,range( (self.size//2)*(self.size-3) +1)))
    #
    #
    # 集計処理
    total = 0 # ローカル変数
    unique = 0
    for _t, _u in gttotal:
      total+=_t
      unique+=_u
    pool.close()
    pool.join()
    return total,unique
  #
  # 初期化
  def __init__(self,size): # pylint:disable=R0913
    self.size=size
    self.COUNTER=[0]*3
    self.pres_a=[0]*930
    self.pres_b=[0]*930
    self.B=Board(size)
#
# メイン
if __name__ == '__main__':
  nmin = 5
  nmax = 21
  print("キャリーチェーン マルチプロセス")
  print(" N:        Total       Unique        hh:mm:ss.ms")
  for size in range(nmin, nmax,1):
    start_time = datetime.now()
    nq=nQueens(size)
    TOTAL,UNIQUE=nq.execProcess()
    time_elapsed = datetime.now() - start_time
    _text = '{}'.format(time_elapsed)
    text = _text[:-3]
    print("%2d:%13d%13d%20s" % (size,TOTAL,UNIQUE,text))  # 出力
```

## 実行結果
```
bash-3.2$ python 13Python_multiProcess.py
キャリーチェーン マルチプロセス
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.061
 6:            4            1         0:00:00.126
 7:           40            6         0:00:00.135
 8:           92           12         0:00:00.327
 9:          352           46         0:00:00.766
10:          724           92         0:00:02.327
11:         2680          341         0:00:09.042
12:        14200         1788         0:00:19.871
13:        73712         9237         0:00:53.388
14:       365596        45771         0:02:19.974
15:      2279184       285095         0:05:51.522
16:     14772512      1847425         0:17:01.656
17:     95815104     11979381         1:07:04.713
```


さ、これで退路が絶たれたわけです。
もうGPU/CUDAしかやりようがなくなりました。
次回からはGPU/CUDAをやっていきましょう。



[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

[エイト・クイーンのソース置き場 BashもJavaもPythonも！](https://github.com/suzukiiichiro/N-Queens)



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



