---
title: "Ｎクイーン問題（７６）Python-並列処理で高速化 10Python_bit_symmetry_ProcessPool"
date: 2025-03-10T14:52:15+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - アルゴリズム
  - 鈴木維一郎
  - Python
  - codon

---

![](chess.jpg)

## ソースコード
今回の連載 python/pypy/codonのソースコードディレクトリはこちら
https://github.com/suzukiiichiro/N-Queens/tree/master/10Bit_Python

## インストールなどの構築はこちら
Ｎクイーン問題（６６） Python-codonで高速化
https://suzukiiichiro.github.io/posts/2025-03-05-01-n-queens-suzuki/

## ThreadPool　スレッドプール

まず、はじめに PythonのThreadPool/ProcessPool/concurrent.futures版ThreadPool/concurrent.futures版ProcessPoolはcodonでは動きません！

その上で、仕方がないので Python/pypyで実装します。（まぁそれでも十分に高速化できます）

pythonの並列処理には大きく２つあります。
  ThreadPool スレッドプール
  ProcessPool  プロセスプール

用途に合わせて使えばよいわけです。
  ThreadPool 複数のスレッドを並列処理したい場合
  ProcessPool 複数のプロセスを並列処理したい場合

エイトクイーンの場合は ProcessPoolのほうが若干高速でした。
マルチスレッド・マルチプロセスとも言われます。


## solve()
前回と内容は同一ですが、今回はProcessPoolについての記述となります。

concurrent.futures版 のマルチスレッドとマルチプロセス
ThreadPoolとProcessPoolの４つを簡単に着替えて実行できるように実装してあります。
resultsに何を代入するかを切り替えるロジックになっています。

以下の４つのうちのどれか一つのresults....の行頭の`#`コメントを解除すればよいです

1. concurrent.futuresのスレッドプール
    ``` python
    # 15:      2279184       285053         0:00:05.440
    #  results=executor.map(self.nqueen_threadPool,params)
    ```
2. concurrent.futuresのプロセスプール
    ``` python
    # 15:      2279184       285053         0:00:05.526
    #  results=executor.map(self.nqueen_processPool,params)
    ```
3. ThreadPoolのスレッドプール
    ``` python
    # 15:      2279184       285053         0:00:03.553
    # results:list[int]=list(pool.map(self.nqueen_threadPool,params))
    ```
4. ThreadPoolのプロセスプール
    ```
    # 15:      2279184       285053         0:00:02.378
    # results:list[int]=list(pool.map(self.nqueen_processPool,params))
    ```


nqueen_threadPool()もnqueen_processPool()も実装済みです。
興味があれば読んでみてください。

並列処理後に集計を集約する部分が良く書けています。
zip()された集計結果群を並列処理の数だけ分解してsum()で合計を出し、int型の`total_counts`に代入しています。

``` python:09Python_bit_symmetry_ThreadPool.py
  def solve(self,size:int)->list:
    with concurrent.futures.ThreadPoolExecutor() as executor:
    :
    :
    :

    # スレッドごとの結果を集計
    total_counts:int=[sum(x) for x in zip(*results)]
    total:int=self.gettotal(total_counts)
    unique:int=self.getunique(total_counts)
    return [total,unique]
```

あと、前回のThreadPoolでも今回のProcessPoolでも`def main(self):`の上にさりげなく書かれた`def finalize(self)->None:`は、Nが一つ繰り上がるたびに実行されてきたスレッドやプロセスを`kill all`して後続の処理に影響がないようにするものです。
これがないと、Ｎの進捗とともにプロセスがどんどん増えていき処理が重くなり遅くなる現象を防ぐことができます。

``` python
class NQueens09_threadPool:
  def finalize(self)->None:
    cmd="killall pypy"  # python or pypy
    p = subprocess.Popen("exec " + cmd, shell=True)
    p.kill()
  def main(self):
    nmin:int=4
```

## ソースコード
``` python:10Python_bit_symmetry_ProcessPool.py
# -*- coding: utf-8 -*-
import subprocess
from datetime import datetime
#
# pypyを使うときは以下を活かしてcodon部分をコメントアウト
# pypy では ThreadPool/ProcessPoolが動きます 
#
import pypyjit
pypyjit.set_param('max_unroll_recursion=-1')
from threading import Thread
from multiprocessing import Pool as ThreadPool
import concurrent
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import ProcessPoolExecutor
#
#
# codonを使うときは以下を活かして上記をコメントアウト
# ThreadPool/ProcessPoolはcodonでは動きません
#
# from python import Pool as ThreadPool
# from python import Thread 
# from python import threading 
# from python import multiprocessing
# from python import concurrent
# from python import ThreadPoolExecutor
# from python import ProcessPoolExecutor

class NQueens09():
  def __init__(self):
    pass

  def getunique(self,counts:list)->int:
    count2:int
    count4:int
    count8:int
    count2,count4,count8=counts
    return count2+count4+count8

  def gettotal(self,counts:list)->int:
    count2:int
    count4:int
    count8:int
    count2,count4,count8=counts
    return count2*2+count4*4+count8*8

  def symmetryops(self,size:int,aboard:list,topbit:int,endbit:int,sidemask:int,lastmask:int,bound1:int,bound2:int)->list:
    count2:int
    count4:int
    count8:int
    count2=count4=count8=0
    own:int
    ptn:int
    you:int
    bit:int
    if aboard[bound2]==1:
      own,ptn=1,2
      for own in range(1,size):
        bit=1
        you=size-1
        while aboard[you]!=ptn and aboard[own]>=bit:
          bit<<=1
          you-=1
        if aboard[own]>bit:
          return [count2,count4,count8]
        if aboard[own]<bit:
          break
        ptn<<=1
      else:
        count2+=1
        return [count2,count4,count8]
    if aboard[size-1]==endbit:
      own,you=1,size-2
      for own in range(1,size):
        bit,ptn=1,topbit
        while aboard[you]!=ptn and aboard[own]>=bit:
          bit<<=1
          ptn>>=1
        if aboard[own]>bit:
          return [count2,count4,count8]
        if aboard[own]<bit:
          break
        you-=1
      else:
        count4+=1
        return [count2,count4,count8]
    if aboard[bound1]==topbit:
      ptn=topbit>>1
      for own in range(1,size):
        bit=1
        you=0
        while aboard[you]!=ptn and aboard[own]>=bit:
          bit<<=1
          you+=1
        if aboard[own]>bit:
          return [count2,count4,count8]
        if aboard[own]<bit:
          break
        ptn>>=1
    count8+=1
    return [count2,count4,count8]

  def backTrack2(self,size:int,row:int,left:int,down:int,right:int,aboard:list,topbit:int,endbit:int,sidemask:int,lastmask:int,bound1:int,bound2:int)->list:
    count2:int
    count4:int
    count8:int
    count2=count4=count8=0
    bit:int
    mask:int=(1<<size)-1
    bitmap:int=mask&~(left|down|right)
    # 最下行の場合、最適化のための条件チェック
    if row==size-1:
      if bitmap and (bitmap&lastmask)==0:
        aboard[row]=bitmap
        count2,count4,count8=self.symmetryops(size,aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      return [count2,count4,count8]
    # 上部の行であればサイドマスク適用
    if row<bound1:
      bitmap&=~sidemask
    elif row==bound2:
      # `bound2` 行の場合、
      # サイドマスクとの一致を確認し不要な分岐を排除
      if (down&sidemask)==0:
        return [count2,count4,count8]
      elif (down&sidemask)!=sidemask:
        bitmap&=sidemask
    c2:int
    c4:int
    c8:int
    while bitmap:
      bit=bitmap&-bitmap  # 最右ビットを抽出
      bitmap^=bit         # 最右ビットを消去
      aboard[row]=bit
      c2,c4,c8=self.backTrack2(size,row+1,(left|bit)<<1,down|bit,(right|bit) >> 1,aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      count2+=c2
      count4+=c4
      count8+=c8
    return [count2,count4,count8]

  def backTrack1(self,size:int,row:int,left:int,down:int,right:int,aboard:list,topbit:int,endbit:int,sidemask:int,lastmask:int,bound1:int,bound2:int)->list:
    count2:int=0
    count4:int=0
    count8:int=0
    c2:int
    c4:int
    c8:int
    bit:int
    mask:int=(1<<size)-1
    bitmap:int=mask & ~(left|down|right)
    if row==size-1: # 最下行に達した場合の処理
      if bitmap:
        aboard[row]=bitmap
        count8+=1
      return [count2,count4,count8]
    if row<bound1:  # 上部の行であればマスク適用
      bitmap &= ~2
    while bitmap:
      bit=bitmap&-bitmap    # 最右ビットを抽出
      bitmap^=bit           # 最右ビットを消去
      aboard[row]=bit
      c2,c4,c8=self.backTrack1(size,row+1,(left|bit)<<1,down|bit,(right|bit) >> 1,aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      count2+=c2
      count4+=c4
      count8+=c8
    return [count2,count4,count8]

  def nqueen_processPool(self,value:list)->list:
    thr_index,size=value
    sizeE=size-1
    aboard:list[int]=[0 for i in range(size)]
    # aboard:list[int]
    # for i in range(size):
    #   aboard[i]=0
    # aboard=[[0]*size*2]*size
    # aboard=[[i for i in range(2*size-1)]for j in range(size)]
    bit:int
    topbit:int
    endbit:int
    sidemask:int
    lastmask:int
    bound1:int
    bound2:int
    count2:int
    count4:int
    count8:int
    c2:int
    c4:int
    c8:int
    bit=topbit=endbit=sidemask=lastmask=bound1=bound2=count2=count4=count8=0
    aboard[0]=1
    topbit=1<<sizeE
    bound1=size-thr_index-1
    if 1<bound1<sizeE: 
      aboard[1]=bit=1<<bound1
      c2,c4,c8=self.backTrack1(size,2,(2|bit)<<1,(1|bit),(bit>>1),aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      count2+=c2
      count4+=c4
      count8+=c8
    endbit=topbit>>1
    sidemask=lastmask=topbit|1
    bound2=thr_index
    if 0<bound1<bound2<sizeE:
      aboard[0]=bit=(1<<bound1)
      for i in range(1,bound1):
        lastmask|=lastmask>>1|lastmask<<1
        endbit>>=1
      c2,c4,c8=self.backTrack2(size,1,bit<<1,bit,bit>>1,aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      count2+=c2
      count4+=c4
      count8+=c8
    return count2,count4,count8

  def nqueen_threadPool(self,value:list)->list:
    thr_index,size=value
    sizeE:int=size-1
    aboard:list[int]=[0 for i in range(size)]
    # aboard:list[int]
    # aboard=[[0]*size*2]*size
    # aboard:list[int]=[[0]*size*2]*size
    # for i in range(size):
    #   aboard[i]=0
    # aboard=[[i for i in range(2*size-1)]for j in range(size)]
    # aboard:list[int]
    # for i in range(size):
    #   aboard.insert(i,0)
    bit:int
    topbit:int
    endbit:int
    sidemask:int
    lastmask:int
    bound1:int
    bound2:int
    count2:int
    count4:int
    count8:int
    c2:int
    c4:int
    c8:int
    bit=topbit=endbit=sidemask=lastmask=bound1=bound2=count2=count4=count8=0
    aboard[0]=1
    topbit=1<<sizeE
    bound1=size-thr_index-1
    if 1<bound1<sizeE: 
      aboard[1]=bit=1<<bound1
      c2,c4,c8=self.backTrack1(size,2,(2|bit)<<1,(1|bit),(bit>>1),aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      count2+=c2
      count4+=c4
      count8+=c8
    endbit=topbit>>1
    sidemask=lastmask=topbit|1
    bound2=thr_index
    if 0<bound1<bound2<sizeE:
      aboard[0]=bit=(1<<bound1)
      for i in range(1,bound1):
        lastmask|=lastmask>>1|lastmask<<1
        endbit>>=1
      c2,c4,c8=self.backTrack2(size,1,bit<<1,bit,bit>>1,aboard,topbit,endbit,sidemask,lastmask,bound1,bound2)
      count2+=c2
      count4+=c4
      count8+=c8
    return [count2,count4,count8]
  def solve(self,size:int)->list:
    with concurrent.futures.ThreadPoolExecutor() as executor:
      params=[(thr_index,size) for thr_index in range(size) ]
    #
    # concurrent.futuresマルチスレッド版
    # 15:      2279184       285053         0:00:05.440
      # results=executor.map(self.nqueen_threadPool,params)
    #
    # concurrent.futuresマルチプロセス版
    # 15:      2279184       285053         0:00:05.526
      # results=executor.map(self.nqueen_processPool,params)
    #
    #
    pool = ThreadPool(size)
    params=[(thr_index,size) for thr_index in range(size) ]
    # マルチスレッド版
    # 15:      2279184       285053         0:00:03.553
    results:list[int]=list(pool.map(self.nqueen_threadPool,params))
    #
    # マルチプロセス版
    # 15:      2279184       285053         0:00:02.378
    # results:list[int]=list(pool.map(self.nqueen_processPool,params))
    #
    #
    # スレッドごとの結果を集計
    total_counts:int=[sum(x) for x in zip(*results)]
    total:int=self.gettotal(total_counts)
    unique:int=self.getunique(total_counts)
    return [total,unique]

class NQueens09_threadPool:
  def finalize(self)->None:
    cmd="killall pypy"  # python or pypy
    p = subprocess.Popen("exec " + cmd, shell=True)
    p.kill()
  def main(self):
    nmin:int=4
    nmax:int=18
    print(" N:        Total       Unique        hh:mm:ss.ms")
    for size in range(nmin, nmax):
      start_time=datetime.now()
      NQ=NQueens09()
      total,unique=NQ.solve(size)
      time_elapsed=datetime.now()-start_time
      text = str(time_elapsed)[:-3]  
      print(f"{size:2d}:{total:13d}{unique:13d}{text:>20s}")
      self.finalize()
#
# $ python <filename>
# $ pypy <fileName>
# $ codon build -release <filename>
# codon ではスレッドプールが動かなかった
# スレッドプール
# 15:      2279184       285053         0:00:04.684
if __name__ == '__main__':
  NQueens09_threadPool().main()
```

## 実行結果
```
CentOS$ pypy 10Python_bit_symmetry_ProcessPool.py
 N:        Total       Unique        hh:mm:ss.ms
 4:            2            1         0:00:00.025
 5:           10            2         0:00:00.018
 6:            4            1         0:00:00.023
 7:           40            6         0:00:00.026
 8:           92           12         0:00:00.028
 9:          352           46         0:00:00.039
10:          724           92         0:00:00.069
11:         2680          341         0:00:00.084
12:        14200         1787         0:00:00.150
13:        73712         9233         0:00:00.233
14:       365596        45752         0:00:00.648
15:      2279184       285053         0:00:02.981
16:     14772512      1846955         0:00:16.342
17:     95815104     11977939         0:01:51.347
```

次の章では、ビット版NodeLayerを具体的にご説明していきます。
（注意)ThreadPoolとProcessPoolはPython/Pypyで動作しcodon では動作しません

## ソースコード
今回の連載 python/pypy/codonのソースコードディレクトリはこちら
https://github.com/suzukiiichiro/N-Queens/tree/master/10Bit_Python

## Ｎクイーン問題 過去記事アーカイブ
【過去記事アーカイブ】Ｎクイーン問題 過去記事一覧
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens


Ｎクイーン問題（７６）Python-並列処理で高速化 10Python_bit_symmetry_ProcessPool
https://suzukiiichiro.github.io/posts/2025-03-10-05-n-queens-suzuki/
Ｎクイーン問題（７５）Python-並列処理で高速化 09Python_bit_symmetry_ThreadPool
https://suzukiiichiro.github.io/posts/2025-03-10-04-n-queens-suzuki/
Ｎクイーン問題（７４）Python-codonで高速化 08Python_bit_symmetry
https://suzukiiichiro.github.io/posts/2025-03-10-03-n-queens-suzuki/
Ｎクイーン問題（７３）Python-codonで高速化 07Python_bit_mirror
https://suzukiiichiro.github.io/posts/2025-03-10-02-n-queens-suzuki/
Ｎクイーン問題（７２）Python-codonで高速化 06Python_bit_backTrack
https://suzukiiichiro.github.io/posts/2025-03-10-01-n-queens-suzuki/
Ｎクイーン問題（７１）Python-codonで高速化 05Python_optimize
https://suzukiiichiro.github.io/posts/2025-03-07-01-n-queens-suzuki/
Ｎクイーン問題（７０）Python-codonで高速化 04Python_symmetry
https://suzukiiichiro.github.io/posts/2025-03-06-02-n-queens-suzuki/
Ｎクイーン問題（６９）Python-codonで高速化 03Python_backTracking
https://suzukiiichiro.github.io/posts/2025-03-06-01-n-queens-suzuki/
Ｎクイーン問題（６８）Python-codonで高速化 02Python_postFlag
https://suzukiiichiro.github.io/posts/2025-03-05-03-n-queens-suzuki/
Ｎクイーン問題（６７）Python-codonで高速化 01Python_bluteForce
https://suzukiiichiro.github.io/posts/2025-03-05-02-n-queens-suzuki/
Ｎクイーン問題（６６）Python-codonで高速化
https://suzukiiichiro.github.io/posts/2025-03-05-01-n-queens-suzuki/
Ｎクイーン問題（６５） Ｎ２５を解決！事実上の日本一に
https://suzukiiichiro.github.io/posts/2024-04-25-01-n-queens-suzuki/
Ｎクイーン問題（６４）第七章 並列処理 キャリーチェーン ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-05-n-queens-suzuki/
Ｎクイーン問題（６３）第七章 並列処理 キャリーチェーン ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-05-n-queens-suzuki/
Ｎクイーン問題（６２）第七章 並列処理 対称解除法 ビットボード ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-04-n-queens-suzuki/
Ｎクイーン問題（６１）第七章 並列処理 対称解除法 ノードレイヤー ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-03-n-queens-suzuki/
Ｎクイーン問題（６０）第七章 並列処理 ミラー ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-02-n-queens-suzuki/
Ｎクイーン問題（５９）第七章 並列処理 ビットマップ ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2023-08-01-01-n-queens-suzuki/
Ｎクイーン問題（５８）第六章 並列処理 pthread C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-09-n-queens-suzuki/
Ｎクイーン問題（５７）第八章 キャリーチェーン C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-08-n-queens-suzuki/
Ｎクイーン問題（５６）第八章 ミラー C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-06-n-queens-suzuki/
Ｎクイーン問題（５５）第八章 ビットマップ C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-05-n-queens-suzuki/
Ｎクイーン問題（５４）第八章 ビットマップ C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-04-n-queens-suzuki/
Ｎクイーン問題（５３）第八章 配置フラグ C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-03-n-queens-suzuki/
Ｎクイーン問題（５２）第八章 バックトラック C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-02-n-queens-suzuki/
Ｎクイーン問題（５１）第八章 ブルートフォース C言語編
https://suzukiiichiro.github.io/posts/2023-06-28-01-n-queens-suzuki/
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














