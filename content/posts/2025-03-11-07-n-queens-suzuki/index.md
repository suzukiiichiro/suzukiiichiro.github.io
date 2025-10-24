---
title: "Ｎクイーン問題（８３）Python-codon＆並列処理で高速化 Constellations"
date: 2025-03-11T15:24:22+09:00
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
https://github.com/suzukiiichiro/N-Queens/tree/master/13Bit_codon

## インストールなどの構築はこちら
Ｎクイーン問題（６６） Python-codonで高速化
https://suzukiiichiro.github.io/posts/2025-03-05-01-n-queens-suzuki/

## Constellations（コンステレーションズ）について
ロジックは今後改めて説明します。

## codon対応の何な変哲もないPythonソースコード
``` python:17Python_constellations.py
from operator import or_
# from functools import reduce
from typing import List,Set,Dict
from datetime import datetime
# pypyを使うときは以下を活かしてcodon部分をコメントアウト
# import pypyjit
# pypyjit.set_param('max_unroll_recursion=-1')
# pypy では ThreadPool/ProcessPoolが動きます
#
# from threading import Thread
# from multiprocessing import Pool as ThreadPool
# import concurrent
# from concurrent.futures import ThreadPoolExecutor
# from concurrent.futures import ProcessPoolExecutor
#
class NQueens19:
  def __init__(self):
    pass
  def SQd0B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      # next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)  # マスクを適用<<注意
      next_free:int=~(next_ld|next_rd|next_col) # オーバーフロー防止  # マスクを適用<<注意
      # if next_free:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd0BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)) #<<注意
    #     if next_free:
    #       self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)) #<<注意
      if next_free:
        self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd0BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4))
    #     if next_free:
    #       self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4))
      if next_free:
        self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd1BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # if next_free:
      #   if row+1<endmark:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row+1>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # When row reaches mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost 1-bit
    #     # bit:int=-free&free  # Extract the rightmost 1-bit
    #     free&=free-1  # Remove the processed bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       # Recursive call with updated values
    #       self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost 1-bit
      # bit:int=-free&free  # Extract the rightmost 1-bit
      free&=free-1  # Remove the processed bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        # Recursive call with updated values
        self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case when row != mark1
    while free:
      bit:int=free&-free  # Extract the rightmost 1-bit
      # bit:int=-free&free  # Extract the rightmost 1-bit
      free&=free-1  # Remove the processed bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        # Recursive call with updated values
        self.SQd1BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # When row reaches mark2
    # if row==mark2:
    #   while free:
    #     # Extract the rightmost available position
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     # Update diagonal and column occupancies
    #     # next_ld=((ld|bit)<<2)|1
    #     # next_rd=(rd|bit)>>2
    #     # next_col=col|bit
    #     next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
    #     next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
    #     # Recursive call if there are available positions
    #     # if next_free:
    #     #   if row+2<endmark:
    #     #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
    #     #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #     #   else:
    #     #     self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #     if next_free and (row+2>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
    #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      # Extract the rightmost available position
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # Update diagonal and column occupancies
      # next_ld=((ld|bit)<<2)|1
      # next_rd=(rd|bit)>>2
      # next_col=col|bit
      next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # Recursive call if there are available positions
      # if next_free:
      #   if row+2<endmark:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row+2>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case when row != mark2
    while free:
      # Extract the rightmost available position
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # Update diagonal and column occupancies
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      # Recursive call if there are available positions
      if next_free:
        self.SQd1BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3  # Precomputed value for performance
    # Special case when row==mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3))
    #     if nextfree:
    #       self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3))
      if nextfree:
        self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # Special case when row==mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if nextfree:
    #       self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if nextfree:
        self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # Special case: when row equals mark2
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     # Calculate the next free positions
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      # Calculate the next free positions
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      # Calculate the next free positions
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # 行が mark1 に達した場合の特別処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # 最下位ビットを取得
    #     # bit:int=-free&free  # 最下位ビットを取得
    #     free&=free-1  # 使用済みビットを削除
    #     # 次の free の計算
    #     nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
    #     # 再帰的に SQd2B を呼び出す
    #     if nextfree:
    #       self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の free の計算
      nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
      # 再帰的に SQd2B を呼び出す
      if nextfree:
        self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # 一般的な再帰処理
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の free の計算
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      # 再帰的に SQd2BlkB を呼び出す
      if nextfree:
        self.SQd2BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # row==mark1 の場合の処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # 最下位のビットを取得
    #     # bit:int=-free&free  # 最下位のビットを取得
    #     free&=free-1  # 使用済みのビットを削除
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return  # この分岐の処理が終わったらリターン
    while row==mark1 and free:
      bit:int=free&-free  # 最下位のビットを取得
      # bit:int=-free&free  # 最下位のビットを取得
      free&=free-1  # 使用済みのビットを削除
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
      if next_free:
        self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free  # 最下位のビットを取得
      # bit:int=-free&free  # 最下位のビットを取得
      free&=free-1  # 使用済みのビットを削除
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # `row==mark2` の場合の処理
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # 最下位ビットを取得
    #     # bit:int=-free&free  # 最下位ビットを取得
    #     free&=free-1  # 使用済みビットを削除
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return  # `if row==mark2` の処理終了後に関数を終了
    while row==mark2 and free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Get the lowest bit
    #     # bit:int=-free&free  # Get the lowest bit
    #     free&=free-1  # Remove the lowest bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # Get the lowest bit
    #     # bit:int=-free&free  # Get the lowest bit
    #     free&=free-1  # Remove the lowest bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # row==mark1 の場合を先に処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd2BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # rowがendmarkの場合の処理
    if row==endmark:
      if (free&(~1))>0:
        tempcounter[0]+=1
      return
    # 通常の処理
    while free:
      bit:int=free&-free  # 最も下位の1ビットを取得
      # bit:int=-free&free  # 最も下位の1ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の左対角線、右対角線、列の状態を計算
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      # 次の自由な位置を計算
      nextfree=~((next_ld)|(next_rd)|(next_col))
      # if nextfree:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|(next_col))>0:
      #       self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
      if nextfree and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|(next_col))>0):
        self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if nextfree:
    #       self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if nextfree:
        self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Isolate the rightmost 1 bit.
    #     # bit:int=-free&free  # Isolate the rightmost 1 bit.
    #     free&=free-1  # Remove the isolated bit from free.
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Isolate the rightmost 1 bit.
      # bit:int=-free&free  # Isolate the rightmost 1 bit.
      free&=free-1  # Remove the isolated bit from free.
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Isolate the rightmost 1 bit.
      # bit:int=-free&free  # Isolate the rightmost 1 bit.
      free&=free-1  # Remove the isolated bit from free.
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==jmark:
      free&=~1  # Clear the least significant bit (mark position 0 unavailable).
      ld|=1  # Mark left diagonal as occupied for position 0.
      while free:
        bit:int=free&-free  # Get the lowest bit (first free position).
        # bit:int=-free&free  # Get the lowest bit (first free position).
        free&=free-1  # Remove this position from the free positions.
        # Calculate next free positions and diagonal/column states.
        # next_ld=(ld|bit)<<1
        # next_rd=(rd|bit)>>1
        # next_col=col|bit
        next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
        next_free:int=~((next_ld|next_rd|next_col))
        if next_free:
          self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free  # Get the lowest bit (first free position).
      # bit:int=-free&free  # Get the lowest bit (first free position).
      free&=free-1  # Remove this position from the free positions.
      # Calculate next free positions and diagonal/column states.
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~((next_ld|next_rd|next_col))
      if next_free:
        self.SQBjrB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # if next_free:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #         self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBkBlBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBlBkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBklBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
          self.SQBjlBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBlkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  """
  回転対称性をチェックする関数
  Args:
      ijkl_list (set): 回転対称性を保持する集合
      i,j,k,l (int): 配置のインデックス
      N (int): ボードのサイズ
  Returns:
      bool: 回転対称性が見つかった場合はTrue、見つからない場合はFalse
  """
  def check_rotations(self,ijkl_list:Set[int],i:int,j:int,k:int,l:int,N:int)->bool:
    rot90=((N-1-k)<<15)+((N-1-l)<<10)+(j<<5)+i
    rot180=((N-1-j)<<15)+((N-1-i)<<10)+((N-1-l)<<5)+(N-1-k)
    rot270=(l<<15)+(k<<10)+((N-1-i)<<5)+(N-1-j)
    # 回転対称性をチェック
    # if rot90 in ijkl_list:
    #   return True
    # if rot180 in ijkl_list:
    #   return True
    # if rot270 in ijkl_list:
    #   return True
    # return False
    return any(rot in ijkl_list for rot in (rot90, rot180, rot270))
  #
  def symmetry(self,ijkl:int,N:int)->int:
    """
    if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl):
      if self.symmetry90(ijkl,N):
        return 2
      else:
        return 4
    else:
      return 8
    """
    return 2 if self.symmetry90(ijkl,N) else 4 if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl) else 8
  #
  def symmetry90(self,ijkl:int,N:int)->bool:
    return ((self.geti(ijkl)<<15)+(self.getj(ijkl)<<10)+(self.getk(ijkl)<<5)+self.getl(ijkl))==(((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl))
  #
  """
  i,j,k,l のインデックスを1つの整数に変換する関数
  Args:
      i,j,k,l (int): 各インデックス
  Returns:
      int: i,j,k,l を基にした1つの整数
  """
  def to_ijkl(self,i:int,j:int,k:int,l:int)->int:
    return (i<<15)+(j<<10)+(k<<5)+l
  #
  """
  時計回りに90度回転する。
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: 90度回転後の配置をエンコードした整数
  """
  def rot90(self,ijkl:int,N:int)->int:
    return ((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl)
  #
  """
  垂直方向のミラーリングを行う。
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: ミラーリング後の配置をエンコードした整数
  """
  def mirvert(self,ijkl:int,N:int)->int:
    return self.to_ijkl(N-1-self.geti(ijkl),N-1-self.getj(ijkl),self.getl(ijkl),self.getk(ijkl))
  #
  """2つの値のうち最小値を返す"""
  def ffmin(self,a:int,b:int)->int:
    return min(a,b)
  #
  """iを抽出"""
  def geti(self,ijkl:int)->int:
    return (ijkl>>15)&0x1F
  #
  """jを抽出"""
  def getj(self,ijkl:int)->int:
    return (ijkl>>10)&0x1F
  #
  """kを抽出"""
  def getk(self,ijkl:int)->int:
    return (ijkl>>5)&0x1F
  #
  """lを抽出"""
  def getl(self,ijkl:int)->int:
    return ijkl&0x1F
  """
  クイーンの配置を回転・ミラーリングさせて最も左上に近い標準形に変換する
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: 標準形の配置をエンコードした整数
  """
  def jasmin(self,ijkl:int,N:int)->int:
    # 最初の最小値と引数を設定
    arg=0
    min_val=self.ffmin(self.getj(ijkl),N-1-self.getj(ijkl))
    # i: 最初の行（上端） 90度回転2回
    if self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))<min_val:
      arg=2
      min_val=self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))
    # k: 最初の列（左端） 90度回転3回
    if self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))<min_val:
      arg=3
      min_val=self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))
    # l: 最後の列（右端） 90度回転1回
    if self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))<min_val:
      arg=1
      min_val=self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))
    # 90度回転を arg 回繰り返す

    # codon で動きます
    for _ in range(arg):
      ijkl=self.rot90(ijkl,N)

    # codon で動かない
    # ijkl=reduce(lambda acc,_:self.rot90(acc,N),range(arg),ijkl) 

    # 必要に応じて垂直方向のミラーリングを実行
    if self.getj(ijkl)<N-1-self.getj(ijkl):
      ijkl=self.mirvert(ijkl,N)
    return ijkl
  #
  """
  ld: 左対角線の占領状態
  rd: 右対角線の占領状態
  col: 列の占領状態
  k: 特定の行
  l: 特定の行
  row: 現在の行
  queens: 配置済みのクイーンの数
  LD: 左端の特殊な占領状態
  RD: 右端の特殊な占領状態
  counter: コンステレーションのカウント
  constellations: コンステレーションリスト
  N: ボードサイズ
  preset_queens: 必要なクイーンの数
  """
  def set_pre_queens(self,ld:int,rd:int,col:int,k:int,l:int,row:int,queens:int,LD:int,RD:int,counter:list,constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    mask=(1<<N)-1  # setPreQueensで使用
    # k行とl行はスキップ
    if row==k or row==l:
      self.set_pre_queens(ld<<1,rd>>1,col,k,l,row+1,queens,LD,RD,counter,constellations,N,preset_queens)
      return
    # クイーンの数がpreset_queensに達した場合、現在の状態を保存
    if queens==preset_queens:
      constellation= {"ld": ld,"rd": rd,"col": col,"startijkl": row<<20,"solutions":0}
      # 新しいコンステレーションをリストに追加
      constellations.append(constellation)
      counter[0]+=1
      return
    # 現在の行にクイーンを配置できる位置を計算
    free=~(ld|rd|col|(LD>>(N-1-row))|(RD<<(N-1-row)))&mask
    while free:
      bit:int=free&-free  # 最も下位の1ビットを取得
      # bit:int=-free&free  # 最も下位の1ビットを取得
      free&=free-1  # 使用済みビットを削除
      # クイーンを配置し、次の行に進む
      self.set_pre_queens((ld|bit)<<1,(rd|bit)>>1,col|bit,k,l,row+1,queens+1,LD,RD,counter,constellations,N,preset_queens)
  #
  def exec_solutions(self,constellations:List[Dict[str,int]],N:int)->None:
    # jmark=0  # ここで初期化
    # j=0
    # k=0
    # l=0
    # ijkl=0
    # ld=0
    # rd=0
    # col=0
    # start_ijkl=0
    # start=0
    # free=0
    # LD=0
    # endmark=0
    # mark1=0
    # mark2=0
    jmark=j=k=l=ijkl=ld=rd=col=start_ijkl=start=free=LD=endmark=mark1=mark2=0
    small_mask=(1<<(N-2))-1
    temp_counter=[0]
    for constellation in constellations:
      # mark1=mark1
      # mark2=mark2
      mark1,mark2=mark1,mark2
      # mark2=mark2
      start_ijkl=constellation["startijkl"]
      start=start_ijkl>>20
      ijkl=start_ijkl&((1<<20)-1)
      # j=self.getj(ijkl)
      # k=self.getk(ijkl)
      # l=self.getl(ijkl)
      j,k,l=self.getj(ijkl),self.getk(ijkl),self.getl(ijkl)
      # 左右対角線と列の占有状況を設定
      # ld=constellation["ld"]>>1
      # rd=constellation["rd"]>>1
      # col=(constellation["col"]>>1)|(~small_mask)
      ld,rd,col=constellation["ld"]>>1,constellation["rd"]>>1,(constellation["col"]>>1)|(~small_mask)
      LD=(1<<(N-1-j))|(1<<(N-1-l))
      ld|=LD>>(N-start)
      # rd=constellation["rd"]>>1
      if start>k:
        rd|=(1<<(N-1-(start-k+1)))
      if j >= 2 * N-33-start:
        rd|=(1<<(N-1-j))<<(N-2-start)
      # col=(constellation["col"]>>1)|(~small_mask)
      free=~(ld|rd|col)
      # 各ケースに応じた処理
      if j<(N-3):
        jmark,endmark=j+1,N-2
        if j>2 * N-34-start:
          if k<l:
            mark1,mark2=k-1,l-1
            if start<l:
              if start<k:
                if l!=k+1:
                  self.SQBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else: self.SQBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark1,mark2=l-1,k-1
            if start<k:
              if start<l:
                if k!=l+1:
                  self.SQBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else: self.SQBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          if k<l:
            mark1,mark2=k-1,l-1
            if l!=k+1:
              self.SQBjlBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjlBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark1,mark2=l-1,k-1
            if k != l+1:
              self.SQBjlBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjlBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      elif j==(N-3):
        endmark=N-2
        if k<l:
          mark1,mark2=k-1,l-1
          if start<l:
            if start<k:
              if l != k+1: self.SQd2BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQd2BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=l-1
              self.SQd2BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          mark1,mark2=l-1,k-1
          endmark=N-2
          if start<k:
            if start<l:
              if k != l+1:
                self.SQd2BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQd2BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=k-1
              self.SQd2BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      elif j==N-2: # クイーンjがコーナーからちょうど1列離れている場合
        if k<l:  # kが最初になることはない、lはクイーンの配置の関係で最後尾にはなれない
          endmark=N-2
          if start<l:  # 少なくともlがまだ来ていない場合
            if start<k:  # もしkもまだ来ていないなら
              mark1=k-1
              if l != k+1:  # kとlが隣り合っている場合
                mark2=l-1
                self.SQd1BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQd1BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:  # lがまだ来ていないなら
              mark2=l-1
              self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          # すでにkとlが来ている場合
          else: self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:  # l<k
          if start<k:  # 少なくともkがまだ来ていない場合
            if start<l:  # lがまだ来ていない場合
              if k<N-2:  # kが末尾にない場合
                mark1,endmark=l-1,N-2
                if k != l+1:  # lとkの間に空行がある場合
                  mark2=k-1
                  self.SQd1BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                # lとkの間に空行がない場合
                else: self.SQd1BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:  # kが末尾の場合
                if l != (N-3):  # lがkの直前でない場合
                  mark2,endmark=l-1,N-3
                  self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else:  # lがkの直前にある場合
                  endmark=N-4
                  self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:  # もしkがまだ来ていないなら
              if k != N-2:  # kが末尾にない場合
                mark2,endmark=k-1,N-2
                self.SQd1BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:  # kが末尾の場合
                endmark=N-3
                self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: # kとlはスタートの前
            endmark=N-2
            self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else:  # クイーンjがコーナーに置かれている場合
        endmark=N-2
        if start>k:
          self.SQd0B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else: # クイーンをコーナーに置いて星座を組み立てる方法と、ジャスミンを適用する方法
          mark1=k-1
          self.SQd0BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      # 各コンステレーションのソリューション数を更新
      constellation["solutions"]=temp_counter[0] * self.symmetry(ijkl,N)
      temp_counter[0]=0
  #
  def gen_constellations(self,ijkl_list:Set[int],constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    halfN=(N+1)//2  # Nの半分を切り上げ
    # コーナーにクイーンがいない場合の開始コンステレーションを計算する
    """
    for k in range(1,halfN):
      for l in range(k+1,N-1):
        for i in range(k+1,N-1):
          if i==(N-1)-l:
            continue
          for j in range(N-k-2,0,-1):
            if j==i or l==j:
              continue
            if not self.check_rotations(ijkl_list,i,j,k,l,N):
              ijkl_list.add(self.to_ijkl(i,j,k,l))
    """
    ijkl_list.update(self.to_ijkl(i,j,k,l) for k in range(1,halfN) for l in range(k+1,N-1) for i in range(k+1,N-1) if i != (N-1)-l for j in range(N-k-2,0,-1) if j!=i and j!=l if not self.check_rotations(ijkl_list,i,j,k,l,N)
    )
    # コーナーにクイーンがある場合の開始コンステレーションを計算する
    # for j in range(1,N-2):
    #   for l in range(j+1,N-1):
    #     ijkl_list.add(self.to_ijkl(0,j,0,l))
    # [ijkl_list.add(self.to_ijkl(0,j,0,l)) for j in range(1,N-2) for l in range(j+1,N-1)]
    ijkl_list.update({self.to_ijkl(0,j,0,l) for j in range(1,N-2) for l in range(j+1,N-1)})


    # Jasmin変換
    ijkl_list_jasmin=set()
    # for start_constellation in ijkl_list:
    #   ijkl_list_jasmin.add(self.jasmin(start_constellation,N))
    # [ijkl_list_jasmin.add(self.jasmin(start_constellation,N)) for start_constellation in ijkl_list]
    ijkl_list_jasmin.update(self.jasmin(start_constellation, N) for start_constellation in ijkl_list)
    # ijkl_list_jasmin.update(map(lambda sc: self.jasmin(sc, N), ijkl_list))


    ijkl_list=ijkl_list_jasmin
    L=1<<(N-1)  # Lは左端に1を立てる
    for sc in ijkl_list:
      # i=self.geti(sc)
      # j=self.getj(sc)
      # k=self.getk(sc)
      # l=self.getl(sc)
      i,j,k,l=self.geti(sc),self.getj(sc),self.getk(sc),self.getl(sc)
      # ld=(L>>(i-1))|(1<<(N-k)) # 左対角線
      # rd=(L>>(i+1))|(1<<(l-1)) # 右対角線
      # col=1|L|(L>>i)|(L>>j) # 列
      ld,rd,col=(L>>(i-1))|(1<<(N-k)),(L>>(i+1))|(1<<(l-1)),1|L|(L>>i)|(L>>j) 
      # LD=(L>>j)|(L>>l) # 左端の対角線
      # RD=(L>>j)|(1<<k) # 右端の対角線
      LD,RD=(L>>j)|(L>>l),(L>>j)|(1<<k)
      counter=[0] # サブコンステレーションを生成
      self.set_pre_queens(ld,rd,col,k,l,1,3 if j==N-1 else 4,LD,RD,counter,constellations,N,preset_queens)
      current_size=len(constellations)
      # 生成されたサブコンステレーションにスタート情報を追加
      # for a in range(counter[0]):
      #   constellations[current_size-a-1]["startijkl"]|=self.to_ijkl(i,j,k,l)
      list(map(lambda target:target.__setitem__("startijkl",target["startijkl"]|self.to_ijkl(i,j,k,l)),(constellations[current_size-a-1] for a in range(counter[0]))))

#
class NQueens19_constellations():
  def main(self)->None:
    # nmin:int=8
    # nmax:int=9
    nmin:int=5
    nmax:int=18
    preset_queens:int=4  # 必要に応じて変更
    print(" N:        Total       Unique        hh:mm:ss.ms")
    for size in range(nmin,nmax):
      start_time=datetime.now()
      ijkl_list:Set[int]=set()
      constellations:List[Dict[str,int]]=[]
      NQ=NQueens19()
      NQ.gen_constellations(ijkl_list,constellations,size,preset_queens)
      NQ.exec_solutions(constellations,size)
      total:int=sum(c['solutions'] for c in constellations if c['solutions']>0)
      time_elapsed=datetime.now()-start_time
      text=str(time_elapsed)[:-3]
      print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")
#
if __name__=="__main__":
  NQueens19_constellations().main()
```

実行結果
```
CentOS-5.1$ pypy 19Python_constellations.py
 N:        Total       Unique        hh:mm:ss.ms
 5:           18            0         0:00:00.000
 6:            4            0         0:00:00.000
 7:           40            0         0:00:00.001
 8:           92            0         0:00:00.003
 9:          352            0         0:00:00.008
10:          724            0         0:00:00.031
11:         2680            0         0:00:00.092
12:        14200            0         0:00:00.267
13:        73712            0         0:00:00.309
14:       365596            0         0:00:00.494
15:      2279184            0         0:00:02.304
16:     14772512            0         0:00:14.783
17:     95815104            0         0:01:39.169

```

## codonではマルチプロセスが動かないので、pypyでPython ProcessPoolマルチプロセス対応したpythonソースコード
``` python:18Python_constellations_ProcessPool.py
# のこったプロセスをkillallするために必要
import subprocess

from operator import or_
# from functools import reduce
from typing import List,Set,Dict
from datetime import datetime
# pypyを使うときは以下を活かしてcodon部分をコメントアウト
import pypyjit
pypyjit.set_param('max_unroll_recursion=-1')
# pypy では ThreadPool/ProcessPoolが動きます
#
from threading import Thread
from multiprocessing import Pool as ThreadPool
import concurrent
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import ProcessPoolExecutor
#
class NQueens20:
  def __init__(self):
    pass
  def SQd0B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      # next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)  # マスクを適用<<注意
      next_free:int=~(next_ld|next_rd|next_col) # オーバーフロー防止  # マスクを適用<<注意
      # if next_free:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd0BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)) #<<注意
    #     if next_free:
    #       self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)) #<<注意
      if next_free:
        self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd0BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4))
    #     if next_free:
    #       self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4))
      if next_free:
        self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd1BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # if next_free:
      #   if row+1<endmark:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row+1>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # When row reaches mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost 1-bit
    #     # bit:int=-free&free  # Extract the rightmost 1-bit
    #     free&=free-1  # Remove the processed bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       # Recursive call with updated values
    #       self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost 1-bit
      # bit:int=-free&free  # Extract the rightmost 1-bit
      free&=free-1  # Remove the processed bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        # Recursive call with updated values
        self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case when row != mark1
    while free:
      bit:int=free&-free  # Extract the rightmost 1-bit
      # bit:int=-free&free  # Extract the rightmost 1-bit
      free&=free-1  # Remove the processed bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        # Recursive call with updated values
        self.SQd1BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # When row reaches mark2
    # if row==mark2:
    #   while free:
    #     # Extract the rightmost available position
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     # Update diagonal and column occupancies
    #     # next_ld=((ld|bit)<<2)|1
    #     # next_rd=(rd|bit)>>2
    #     # next_col=col|bit
    #     next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
    #     next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
    #     # Recursive call if there are available positions
    #     # if next_free:
    #     #   if row+2<endmark:
    #     #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
    #     #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #     #   else:
    #     #     self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #     if next_free and (row+2>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
    #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      # Extract the rightmost available position
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # Update diagonal and column occupancies
      # next_ld=((ld|bit)<<2)|1
      # next_rd=(rd|bit)>>2
      # next_col=col|bit
      next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # Recursive call if there are available positions
      # if next_free:
      #   if row+2<endmark:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row+2>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case when row != mark2
    while free:
      # Extract the rightmost available position
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # Update diagonal and column occupancies
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      # Recursive call if there are available positions
      if next_free:
        self.SQd1BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3  # Precomputed value for performance
    # Special case when row==mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3))
    #     if nextfree:
    #       self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3))
      if nextfree:
        self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # Special case when row==mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if nextfree:
    #       self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if nextfree:
        self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # Special case: when row equals mark2
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     # Calculate the next free positions
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      # Calculate the next free positions
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      # Calculate the next free positions
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # 行が mark1 に達した場合の特別処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # 最下位ビットを取得
    #     # bit:int=-free&free  # 最下位ビットを取得
    #     free&=free-1  # 使用済みビットを削除
    #     # 次の free の計算
    #     nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
    #     # 再帰的に SQd2B を呼び出す
    #     if nextfree:
    #       self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の free の計算
      nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
      # 再帰的に SQd2B を呼び出す
      if nextfree:
        self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # 一般的な再帰処理
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の free の計算
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      # 再帰的に SQd2BlkB を呼び出す
      if nextfree:
        self.SQd2BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # row==mark1 の場合の処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # 最下位のビットを取得
    #     # bit:int=-free&free  # 最下位のビットを取得
    #     free&=free-1  # 使用済みのビットを削除
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return  # この分岐の処理が終わったらリターン
    while row==mark1 and free:
      bit:int=free&-free  # 最下位のビットを取得
      # bit:int=-free&free  # 最下位のビットを取得
      free&=free-1  # 使用済みのビットを削除
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
      if next_free:
        self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free  # 最下位のビットを取得
      # bit:int=-free&free  # 最下位のビットを取得
      free&=free-1  # 使用済みのビットを削除
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # `row==mark2` の場合の処理
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # 最下位ビットを取得
    #     # bit:int=-free&free  # 最下位ビットを取得
    #     free&=free-1  # 使用済みビットを削除
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return  # `if row==mark2` の処理終了後に関数を終了
    while row==mark2 and free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Get the lowest bit
    #     # bit:int=-free&free  # Get the lowest bit
    #     free&=free-1  # Remove the lowest bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # Get the lowest bit
    #     # bit:int=-free&free  # Get the lowest bit
    #     free&=free-1  # Remove the lowest bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # row==mark1 の場合を先に処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd2BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # rowがendmarkの場合の処理
    if row==endmark:
      if (free&(~1))>0:
        tempcounter[0]+=1
      return
    # 通常の処理
    while free:
      bit:int=free&-free  # 最も下位の1ビットを取得
      # bit:int=-free&free  # 最も下位の1ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の左対角線、右対角線、列の状態を計算
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      # 次の自由な位置を計算
      nextfree=~((next_ld)|(next_rd)|(next_col))
      # if nextfree:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|(next_col))>0:
      #       self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
      if nextfree and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|(next_col))>0):
        self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if nextfree:
    #       self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if nextfree:
        self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Isolate the rightmost 1 bit.
    #     # bit:int=-free&free  # Isolate the rightmost 1 bit.
    #     free&=free-1  # Remove the isolated bit from free.
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Isolate the rightmost 1 bit.
      # bit:int=-free&free  # Isolate the rightmost 1 bit.
      free&=free-1  # Remove the isolated bit from free.
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Isolate the rightmost 1 bit.
      # bit:int=-free&free  # Isolate the rightmost 1 bit.
      free&=free-1  # Remove the isolated bit from free.
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==jmark:
      free&=~1  # Clear the least significant bit (mark position 0 unavailable).
      ld|=1  # Mark left diagonal as occupied for position 0.
      while free:
        bit:int=free&-free  # Get the lowest bit (first free position).
        # bit:int=-free&free  # Get the lowest bit (first free position).
        free&=free-1  # Remove this position from the free positions.
        # Calculate next free positions and diagonal/column states.
        # next_ld=(ld|bit)<<1
        # next_rd=(rd|bit)>>1
        # next_col=col|bit
        next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
        next_free:int=~((next_ld|next_rd|next_col))
        if next_free:
          self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free  # Get the lowest bit (first free position).
      # bit:int=-free&free  # Get the lowest bit (first free position).
      free&=free-1  # Remove this position from the free positions.
      # Calculate next free positions and diagonal/column states.
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~((next_ld|next_rd|next_col))
      if next_free:
        self.SQBjrB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # if next_free:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #         self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBkBlBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBlBkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBklBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
          self.SQBjlBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBlkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  """
  回転対称性をチェックする関数
  Args:
      ijkl_list (set): 回転対称性を保持する集合
      i,j,k,l (int): 配置のインデックス
      N (int): ボードのサイズ
  Returns:
      bool: 回転対称性が見つかった場合はTrue、見つからない場合はFalse
  """
  def check_rotations(self,ijkl_list:Set[int],i:int,j:int,k:int,l:int,N:int)->bool:
    rot90=((N-1-k)<<15)+((N-1-l)<<10)+(j<<5)+i
    rot180=((N-1-j)<<15)+((N-1-i)<<10)+((N-1-l)<<5)+(N-1-k)
    rot270=(l<<15)+(k<<10)+((N-1-i)<<5)+(N-1-j)
    # 回転対称性をチェック
    # if rot90 in ijkl_list:
    #   return True
    # if rot180 in ijkl_list:
    #   return True
    # if rot270 in ijkl_list:
    #   return True
    # return False
    return any(rot in ijkl_list for rot in (rot90, rot180, rot270))
  #
  def symmetry(self,ijkl:int,N:int)->int:
    """
    if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl):
      if self.symmetry90(ijkl,N):
        return 2
      else:
        return 4
    else:
      return 8
    """
    return 2 if self.symmetry90(ijkl,N) else 4 if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl) else 8
  #
  def symmetry90(self,ijkl:int,N:int)->bool:
    return ((self.geti(ijkl)<<15)+(self.getj(ijkl)<<10)+(self.getk(ijkl)<<5)+self.getl(ijkl))==(((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl))
  #
  """
  i,j,k,l のインデックスを1つの整数に変換する関数
  Args:
      i,j,k,l (int): 各インデックス
  Returns:
      int: i,j,k,l を基にした1つの整数
  """
  def to_ijkl(self,i:int,j:int,k:int,l:int)->int:
    return (i<<15)+(j<<10)+(k<<5)+l
  #
  """
  時計回りに90度回転する。
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: 90度回転後の配置をエンコードした整数
  """
  def rot90(self,ijkl:int,N:int)->int:
    return ((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl)
  #
  """
  垂直方向のミラーリングを行う。
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: ミラーリング後の配置をエンコードした整数
  """
  def mirvert(self,ijkl:int,N:int)->int:
    return self.to_ijkl(N-1-self.geti(ijkl),N-1-self.getj(ijkl),self.getl(ijkl),self.getk(ijkl))
  #
  """2つの値のうち最小値を返す"""
  def ffmin(self,a:int,b:int)->int:
    return min(a,b)
  #
  """iを抽出"""
  def geti(self,ijkl:int)->int:
    return (ijkl>>15)&0x1F
  #
  """jを抽出"""
  def getj(self,ijkl:int)->int:
    return (ijkl>>10)&0x1F
  #
  """kを抽出"""
  def getk(self,ijkl:int)->int:
    return (ijkl>>5)&0x1F
  #
  """lを抽出"""
  def getl(self,ijkl:int)->int:
    return ijkl&0x1F
  """
  クイーンの配置を回転・ミラーリングさせて最も左上に近い標準形に変換する
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: 標準形の配置をエンコードした整数
  """
  def jasmin(self,ijkl:int,N:int)->int:
    # 最初の最小値と引数を設定
    arg=0
    min_val=self.ffmin(self.getj(ijkl),N-1-self.getj(ijkl))
    # i: 最初の行（上端） 90度回転2回
    if self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))<min_val:
      arg=2
      min_val=self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))
    # k: 最初の列（左端） 90度回転3回
    if self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))<min_val:
      arg=3
      min_val=self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))
    # l: 最後の列（右端） 90度回転1回
    if self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))<min_val:
      arg=1
      min_val=self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))
    # 90度回転を arg 回繰り返す

    # codon で動きます
    for _ in range(arg):
      ijkl=self.rot90(ijkl,N)

    # codon で動かない
    # ijkl=reduce(lambda acc,_:self.rot90(acc,N),range(arg),ijkl) 

    # 必要に応じて垂直方向のミラーリングを実行
    if self.getj(ijkl)<N-1-self.getj(ijkl):
      ijkl=self.mirvert(ijkl,N)
    return ijkl
  #
  """
  ld: 左対角線の占領状態
  rd: 右対角線の占領状態
  col: 列の占領状態
  k: 特定の行
  l: 特定の行
  row: 現在の行
  queens: 配置済みのクイーンの数
  LD: 左端の特殊な占領状態
  RD: 右端の特殊な占領状態
  counter: コンステレーションのカウント
  constellations: コンステレーションリスト
  N: ボードサイズ
  preset_queens: 必要なクイーンの数
  """
  def set_pre_queens(self,ld:int,rd:int,col:int,k:int,l:int,row:int,queens:int,LD:int,RD:int,counter:list,constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    mask=(1<<N)-1  # setPreQueensで使用
    # k行とl行はスキップ
    if row==k or row==l:
      self.set_pre_queens(ld<<1,rd>>1,col,k,l,row+1,queens,LD,RD,counter,constellations,N,preset_queens)
      return
    # クイーンの数がpreset_queensに達した場合、現在の状態を保存
    if queens==preset_queens:
      constellation= {"ld": ld,"rd": rd,"col": col,"startijkl": row<<20,"solutions":0}
      # 新しいコンステレーションをリストに追加
      constellations.append(constellation)
      counter[0]+=1
      return
    # 現在の行にクイーンを配置できる位置を計算
    free=~(ld|rd|col|(LD>>(N-1-row))|(RD<<(N-1-row)))&mask
    while free:
      bit:int=free&-free  # 最も下位の1ビットを取得
      # bit:int=-free&free  # 最も下位の1ビットを取得
      free&=free-1  # 使用済みビットを削除
      # クイーンを配置し、次の行に進む
      self.set_pre_queens((ld|bit)<<1,(rd|bit)>>1,col|bit,k,l,row+1,queens+1,LD,RD,counter,constellations,N,preset_queens)
  #
  def exec_solutions(self,value:list)->int:
    N,constellation=value  
  #def exec_solutions(self,constellations:List[Dict[str,int]],N:int)->None:
    # jmark=0  # ここで初期化
    # j=0
    # k=0
    # l=0
    # ijkl=0
    # ld=0
    # rd=0
    # col=0
    # start_ijkl=0
    # start=0
    # free=0
    # LD=0
    # endmark=0
    # mark1=0
    # mark2=0
    jmark=j=k=l=ijkl=ld=rd=col=start_ijkl=start=free=LD=endmark=mark1=mark2=0
    small_mask=(1<<(N-2))-1
    temp_counter=[0]
    #for constellation in constellations:
    # mark1=mark1
    # mark2=mark2
    mark1,mark2=mark1,mark2
    # mark2=mark2
    start_ijkl=constellation["startijkl"]
    start=start_ijkl>>20
    ijkl=start_ijkl&((1<<20)-1)
    # j=self.getj(ijkl)
    # k=self.getk(ijkl)
    # l=self.getl(ijkl)
    j,k,l=self.getj(ijkl),self.getk(ijkl),self.getl(ijkl)
    # 左右対角線と列の占有状況を設定
    # ld=constellation["ld"]>>1
    # rd=constellation["rd"]>>1
    # col=(constellation["col"]>>1)|(~small_mask)
    ld,rd,col=constellation["ld"]>>1,constellation["rd"]>>1,(constellation["col"]>>1)|(~small_mask)
    LD=(1<<(N-1-j))|(1<<(N-1-l))
    ld|=LD>>(N-start)
    # rd=constellation["rd"]>>1
    if start>k:
      rd|=(1<<(N-1-(start-k+1)))
    if j >= 2 * N-33-start:
      rd|=(1<<(N-1-j))<<(N-2-start)
    # col=(constellation["col"]>>1)|(~small_mask)
    free=~(ld|rd|col)
    # 各ケースに応じた処理
    if j<(N-3):
      jmark,endmark=j+1,N-2
      if j>2 * N-34-start:
        if k<l:
          mark1,mark2=k-1,l-1
          if start<l:
            if start<k:
              if l!=k+1:
                self.SQBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          mark1,mark2=l-1,k-1
          if start<k:
            if start<l:
              if k!=l+1:
                self.SQBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else:
        if k<l:
          mark1,mark2=k-1,l-1
          if l!=k+1:
            self.SQBjlBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQBjlBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          mark1,mark2=l-1,k-1
          if k != l+1:
            self.SQBjlBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQBjlBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
    elif j==(N-3):
      endmark=N-2
      if k<l:
        mark1,mark2=k-1,l-1
        if start<l:
          if start<k:
            if l != k+1: self.SQd2BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQd2BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark2=l-1
            self.SQd2BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else: self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else:
        mark1,mark2=l-1,k-1
        endmark=N-2
        if start<k:
          if start<l:
            if k != l+1:
              self.SQd2BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQd2BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark2=k-1
            self.SQd2BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else: self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
    elif j==N-2: # クイーンjがコーナーからちょうど1列離れている場合
      if k<l:  # kが最初になることはない、lはクイーンの配置の関係で最後尾にはなれない
        endmark=N-2
        if start<l:  # 少なくともlがまだ来ていない場合
          if start<k:  # もしkもまだ来ていないなら
            mark1=k-1
            if l != k+1:  # kとlが隣り合っている場合
              mark2=l-1
              self.SQd1BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQd1BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:  # lがまだ来ていないなら
            mark2=l-1
            self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          # すでにkとlが来ている場合
        else: self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else:  # l<k
        if start<k:  # 少なくともkがまだ来ていない場合
          if start<l:  # lがまだ来ていない場合
            if k<N-2:  # kが末尾にない場合
              mark1,endmark=l-1,N-2
              if k != l+1:  # lとkの間に空行がある場合
                mark2=k-1
                self.SQd1BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                # lとkの間に空行がない場合
              else: self.SQd1BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:  # kが末尾の場合
              if l != (N-3):  # lがkの直前でない場合
                mark2,endmark=l-1,N-3
                self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:  # lがkの直前にある場合
                endmark=N-4
                self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:  # もしkがまだ来ていないなら
            if k != N-2:  # kが末尾にない場合
              mark2,endmark=k-1,N-2
              self.SQd1BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:  # kが末尾の場合
              endmark=N-3
              self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else: # kとlはスタートの前
          endmark=N-2
          self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
    else:  # クイーンjがコーナーに置かれている場合
      endmark=N-2
      if start>k:
        self.SQd0B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else: # クイーンをコーナーに置いて星座を組み立てる方法と、ジャスミンを適用する方法
        mark1=k-1
        self.SQd0BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      # 各コンステレーションのソリューション数を更新
    #constellation["solutions"]=temp_counter[0] * self.symmetry(ijkl,N)
    return temp_counter[0] * self.symmetry(ijkl,N)
    print(constellation)
    temp_counter[0]=0
  #
  def gen_constellations(self,ijkl_list:Set[int],constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    halfN=(N+1)//2  # Nの半分を切り上げ
    # コーナーにクイーンがいない場合の開始コンステレーションを計算する
    """
    for k in range(1,halfN):
      for l in range(k+1,N-1):
        for i in range(k+1,N-1):
          if i==(N-1)-l:
            continue
          for j in range(N-k-2,0,-1):
            if j==i or l==j:
              continue
            if not self.check_rotations(ijkl_list,i,j,k,l,N):
              ijkl_list.add(self.to_ijkl(i,j,k,l))
    """
    ijkl_list.update(self.to_ijkl(i,j,k,l) for k in range(1,halfN) for l in range(k+1,N-1) for i in range(k+1,N-1) if i != (N-1)-l for j in range(N-k-2,0,-1) if j!=i and j!=l if not self.check_rotations(ijkl_list,i,j,k,l,N)
    )
    # コーナーにクイーンがある場合の開始コンステレーションを計算する
    # for j in range(1,N-2):
    #   for l in range(j+1,N-1):
    #     ijkl_list.add(self.to_ijkl(0,j,0,l))
    # [ijkl_list.add(self.to_ijkl(0,j,0,l)) for j in range(1,N-2) for l in range(j+1,N-1)]
    ijkl_list.update({self.to_ijkl(0,j,0,l) for j in range(1,N-2) for l in range(j+1,N-1)})


    # Jasmin変換
    ijkl_list_jasmin=set()
    # for start_constellation in ijkl_list:
    #   ijkl_list_jasmin.add(self.jasmin(start_constellation,N))
    # [ijkl_list_jasmin.add(self.jasmin(start_constellation,N)) for start_constellation in ijkl_list]
    ijkl_list_jasmin.update(self.jasmin(start_constellation, N) for start_constellation in ijkl_list)
    # ijkl_list_jasmin.update(map(lambda sc: self.jasmin(sc, N), ijkl_list))


    ijkl_list=ijkl_list_jasmin
    L=1<<(N-1)  # Lは左端に1を立てる
    for sc in ijkl_list:
      # i=self.geti(sc)
      # j=self.getj(sc)
      # k=self.getk(sc)
      # l=self.getl(sc)
      i,j,k,l=self.geti(sc),self.getj(sc),self.getk(sc),self.getl(sc)
      # ld=(L>>(i-1))|(1<<(N-k)) # 左対角線
      # rd=(L>>(i+1))|(1<<(l-1)) # 右対角線
      # col=1|L|(L>>i)|(L>>j) # 列
      ld,rd,col=(L>>(i-1))|(1<<(N-k)),(L>>(i+1))|(1<<(l-1)),1|L|(L>>i)|(L>>j) 
      # LD=(L>>j)|(L>>l) # 左端の対角線
      # RD=(L>>j)|(1<<k) # 右端の対角線
      LD,RD=(L>>j)|(L>>l),(L>>j)|(1<<k)
      counter=[0] # サブコンステレーションを生成
      self.set_pre_queens(ld,rd,col,k,l,1,3 if j==N-1 else 4,LD,RD,counter,constellations,N,preset_queens)
      current_size=len(constellations)
      # 生成されたサブコンステレーションにスタート情報を追加
      # for a in range(counter[0]):
      #   constellations[current_size-a-1]["startijkl"]|=self.to_ijkl(i,j,k,l)
      list(map(lambda target:target.__setitem__("startijkl",target["startijkl"]|self.to_ijkl(i,j,k,l)),(constellations[current_size-a-1] for a in range(counter[0]))))

#
class NQueens20_constellations_ProcessPool():
  def finalize(self)->None:
    cmd="killall pypy"  # python or pypy
    p = subprocess.Popen("exec " + cmd, shell=True)
    p.kill()
  def main(self)->None:
    # nmin:int=8
    # nmax:int=9
    nmin:int=5
    nmax:int=19
    preset_queens:int=4  # 必要に応じて変更
    print(" N:        Total       Unique        hh:mm:ss.ms")
    for size in range(nmin,nmax):
      start_time=datetime.now()
      ijkl_list:Set[int]=set()
      constellations:List[Dict[str,int]]=[]
      NQ=NQueens20()
      NQ.gen_constellations(ijkl_list,constellations,size,preset_queens)
      pool=ThreadPool(size)
      params=[(size,constellations[i])for i in range(len(constellations))]
      pool.map(NQ.exec_solutions,params)
      total:int=sum(list(pool.map(NQ.exec_solutions,params)))
      time_elapsed=datetime.now()-start_time
      text=str(time_elapsed)[:-3]
      print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")
      self.finalize()
#
if __name__=="__main__":
  NQueens20_constellations_ProcessPool().main()
```

実行結果
```
CentOS-5.1$ pypy 20Python_constellations_ProcessPool.py
 N:        Total       Unique        hh:mm:ss.ms
 5:           18            0         0:00:00.048
 6:            4            0         0:00:00.059
 7:           40            0         0:00:00.100
 8:           92            0         0:00:00.196
 9:          352            0         0:00:00.193
10:          724            0         0:00:00.326
11:         2680            0         0:00:00.254
12:        14200            0         0:00:00.375
13:        73712            0         0:00:00.922
14:       365596            0         0:00:04.169
15:      2279184            0         0:00:04.351
16:     14772512            0         0:00:17.743
17:     95815104            0         0:01:36.792
```


## codonではマルチプロセスが動かないので、ソースの最適化・高速化を徹底的に施したConstellationsのシングルスレッド最終形
``` python:19Python_constellations_codon.py
from operator import or_
# from functools import reduce
from typing import List,Set,Dict
from datetime import datetime
# pypyを使うときは以下を活かしてcodon部分をコメントアウト
# import pypyjit
# pypyjit.set_param('max_unroll_recursion=-1')
# pypy では ThreadPool/ProcessPoolが動きます
#
# from threading import Thread
# from multiprocessing import Pool as ThreadPool
# import concurrent
# from concurrent.futures import ThreadPoolExecutor
# from concurrent.futures import ProcessPoolExecutor
#
class NQueens19:
  def __init__(self):
    pass
  def SQd0B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      # next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)  # マスクを適用<<注意
      next_free:int=~(next_ld|next_rd|next_col) # オーバーフロー防止  # マスクを適用<<注意
      # if next_free:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd0B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd0BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)) #<<注意
    #     if next_free:
    #       self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3)) #<<注意
      if next_free:
        self.SQd0B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd0BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4))
    #     if next_free:
    #       self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|1|(1<<N4))
      if next_free:
        self.SQd1B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd1BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # if next_free:
      #   if row+1<endmark:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row+1>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd1B(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # When row reaches mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost 1-bit
    #     # bit:int=-free&free  # Extract the rightmost 1-bit
    #     free&=free-1  # Remove the processed bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       # Recursive call with updated values
    #       self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost 1-bit
      # bit:int=-free&free  # Extract the rightmost 1-bit
      free&=free-1  # Remove the processed bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        # Recursive call with updated values
        self.SQd1BlB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case when row != mark1
    while free:
      bit:int=free&-free  # Extract the rightmost 1-bit
      # bit:int=-free&free  # Extract the rightmost 1-bit
      free&=free-1  # Remove the processed bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        # Recursive call with updated values
        self.SQd1BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # When row reaches mark2
    # if row==mark2:
    #   while free:
    #     # Extract the rightmost available position
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     # Update diagonal and column occupancies
    #     # next_ld=((ld|bit)<<2)|1
    #     # next_rd=(rd|bit)>>2
    #     # next_col=col|bit
    #     next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
    #     next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
    #     # Recursive call if there are available positions
    #     # if next_free:
    #     #   if row+2<endmark:
    #     #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
    #     #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #     #   else:
    #     #     self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #     if next_free and (row+2>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
    #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      # Extract the rightmost available position
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # Update diagonal and column occupancies
      # next_ld=((ld|bit)<<2)|1
      # next_rd=(rd|bit)>>2
      # next_col=col|bit
      next_ld,next_rd,next_col=((ld|bit)<<2)|1,(rd|bit)>>2,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # Recursive call if there are available positions
      # if next_free:
      #   if row+2<endmark:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #       self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row+2>=endmark or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQd1B(next_ld,next_rd,next_col,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case when row != mark2
    while free:
      # Extract the rightmost available position
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # Update diagonal and column occupancies
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      # Recursive call if there are available positions
      if next_free:
        self.SQd1BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3  # Precomputed value for performance
    # Special case when row==mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3))
    #     if nextfree:
    #       self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|2|(1<<N3))
      if nextfree:
        self.SQd1B(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # Special case when row==mark1
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if nextfree:
    #       self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if nextfree:
        self.SQd1BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd1BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # Special case: when row equals mark2
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # Extract the rightmost available position
    #     # bit:int=-free&free  # Extract the rightmost available position
    #     free&=free-1
    #     # Calculate the next free positions
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      # Calculate the next free positions
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQd1B((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # General case
    while free:
      bit:int=free&-free  # Extract the rightmost available position
      # bit:int=-free&free  # Extract the rightmost available position
      free&=free-1
      # Calculate the next free positions
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd1BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # 行が mark1 に達した場合の特別処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # 最下位ビットを取得
    #     # bit:int=-free&free  # 最下位ビットを取得
    #     free&=free-1  # 使用済みビットを削除
    #     # 次の free の計算
    #     nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
    #     # 再帰的に SQd2B を呼び出す
    #     if nextfree:
    #       self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の free の計算
      nextfree=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
      # 再帰的に SQd2B を呼び出す
      if nextfree:
        self.SQd2B((ld|bit)<<3|2,(rd|bit)>>3|(1<<N3),col|bit,row+3,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # 一般的な再帰処理
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の free の計算
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      # 再帰的に SQd2BlkB を呼び出す
      if nextfree:
        self.SQd2BlkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BklB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # row==mark1 の場合の処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # 最下位のビットを取得
    #     # bit:int=-free&free  # 最下位のビットを取得
    #     free&=free-1  # 使用済みのビットを削除
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return  # この分岐の処理が終わったらリターン
    while row==mark1 and free:
      bit:int=free&-free  # 最下位のビットを取得
      # bit:int=-free&free  # 最下位のビットを取得
      free&=free-1  # 使用済みのビットを削除
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
      if next_free:
        self.SQd2B(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free  # 最下位のビットを取得
      # bit:int=-free&free  # 最下位のビットを取得
      free&=free-1  # 使用済みのビットを削除
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BklB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # `row==mark2` の場合の処理
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # 最下位ビットを取得
    #     # bit:int=-free&free  # 最下位ビットを取得
    #     free&=free-1  # 使用済みビットを削除
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return  # `if row==mark2` の処理終了後に関数を終了
    while row==mark2 and free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        self.SQd2B(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free  # 最下位ビットを取得
      # bit:int=-free&free  # 最下位ビットを取得
      free&=free-1  # 使用済みビットを削除
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlBkB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Get the lowest bit
    #     # bit:int=-free&free  # Get the lowest bit
    #     free&=free-1  # Remove the lowest bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQd2BkB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BlBkB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free  # Get the lowest bit
    #     # bit:int=-free&free  # Get the lowest bit
    #     free&=free-1  # Remove the lowest bit
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQd2B(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Get the lowest bit
      # bit:int=-free&free  # Get the lowest bit
      free&=free-1  # Remove the lowest bit
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQd2BlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2BkBlB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # row==mark1 の場合を先に処理
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQd2BlB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    # 通常の処理
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQd2BkBlB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQd2B(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # rowがendmarkの場合の処理
    if row==endmark:
      if (free&(~1))>0:
        tempcounter[0]+=1
      return
    # 通常の処理
    while free:
      bit:int=free&-free  # 最も下位の1ビットを取得
      # bit:int=-free&free  # 最も下位の1ビットを取得
      free&=free-1  # 使用済みビットを削除
      # 次の左対角線、右対角線、列の状態を計算
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      # 次の自由な位置を計算
      nextfree=~((next_ld)|(next_rd)|(next_col))
      # if nextfree:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|(next_col))>0:
      #       self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
      if nextfree and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|(next_col))>0):
        self.SQd2B(next_ld,next_rd,next_col,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if nextfree:
    #       self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if nextfree:
        self.SQBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free  # Isolate the rightmost 1 bit.
    #     # bit:int=-free&free  # Isolate the rightmost 1 bit.
    #     free&=free-1  # Remove the isolated bit from free.
    #     nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if nextfree:
    #       self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free  # Isolate the rightmost 1 bit.
      # bit:int=-free&free  # Isolate the rightmost 1 bit.
      free&=free-1  # Remove the isolated bit from free.
      nextfree=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if nextfree:
        self.SQBlBjrB((ld|bit)<<2,((rd|bit)>>2)|(1<<N3),col|bit,row+2,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free  # Isolate the rightmost 1 bit.
      # bit:int=-free&free  # Isolate the rightmost 1 bit.
      free&=free-1  # Remove the isolated bit from free.
      nextfree=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if nextfree:
        self.SQBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,nextfree,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==jmark:
      free&=~1  # Clear the least significant bit (mark position 0 unavailable).
      ld|=1  # Mark left diagonal as occupied for position 0.
      while free:
        bit:int=free&-free  # Get the lowest bit (first free position).
        # bit:int=-free&free  # Get the lowest bit (first free position).
        free&=free-1  # Remove this position from the free positions.
        # Calculate next free positions and diagonal/column states.
        # next_ld=(ld|bit)<<1
        # next_rd=(rd|bit)>>1
        # next_col=col|bit
        next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
        next_free:int=~((next_ld|next_rd|next_col))
        if next_free:
          self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free  # Get the lowest bit (first free position).
      # bit:int=-free&free  # Get the lowest bit (first free position).
      free&=free-1  # Remove this position from the free positions.
      # Calculate next free positions and diagonal/column states.
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~((next_ld|next_rd|next_col))
      if next_free:
        self.SQBjrB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    if row==endmark:
      tempcounter[0]+=1
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      # next_ld=(ld|bit)<<1
      # next_rd=(rd|bit)>>1
      # next_col=col|bit
      next_ld,next_rd,next_col=(ld|bit)<<1,(rd|bit)>>1,col|bit
      next_free:int=~(next_ld|next_rd|next_col)&((1<<N)-1)
      # if next_free:
      #   if row<endmark-1:
      #     if ~((next_ld<<1)|(next_rd>>1)|next_col)>0:
      #         self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      #   else:
      #     self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
      if next_free and (row>=endmark-1 or ~((next_ld<<1)|(next_rd>>1)|next_col)>0):
        self.SQB(next_ld,next_rd,next_col,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
    #     if next_free:
    #       self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|1)
      if next_free:
        self.SQBkBjrB(((ld|bit)<<2)|1,(rd|bit)>>2,col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark2:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark2 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<2)|((rd|bit)>>2)|(col|bit)|(1<<N3))
      if next_free:
        self.SQBjrB(((ld|bit)<<2),((rd|bit)>>2)|(1<<N3),col|bit,row+2,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N4:int=N-4
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N4)|1)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|1,((rd|bit)>>3)|(1<<N4),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N3:int=N-3
    # if row==mark1:
    #   while free:
    #     bit:int=free&-free
    #     # bit:int=-free&free
    #     free&=free-1
    #     next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
    #     if next_free:
    #       self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    #   return
    while row==mark1 and free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<3)|((rd|bit)>>3)|(col|bit)|(1<<N3)|2)
      if next_free:
        self.SQBjrB(((ld|bit)<<3)|2,((rd|bit)>>3)|(1<<N3),col|bit,row+3,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBkBlBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBkBlBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBkBlBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBlBkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBlBkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBlBkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBklBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBklBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
          self.SQBjlBklBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  def SQBjlBlkBjrB(self,ld:int,rd:int,col:int,row:int,free:int,jmark:int,endmark:int,mark1:int,mark2:int,tempcounter:list[int],N:int)->None:
    N1:int=N-1
    if row==N1-jmark:
      rd|=1<<N1
      free&=~(1<<N1)
      # if next_free:
      self.SQBlkBjrB(ld,rd,col,row,free,jmark,endmark,mark1,mark2,tempcounter,N)
      return
    while free:
      bit:int=free&-free
      # bit:int=-free&free
      free&=free-1
      next_free:int=~(((ld|bit)<<1)|((rd|bit)>>1)|(col|bit))
      if next_free:
        self.SQBjlBlkBjrB((ld|bit)<<1,(rd|bit)>>1,col|bit,row+1,next_free,jmark,endmark,mark1,mark2,tempcounter,N)
  #
  """
  回転対称性をチェックする関数
  Args:
      ijkl_list (set): 回転対称性を保持する集合
      i,j,k,l (int): 配置のインデックス
      N (int): ボードのサイズ
  Returns:
      bool: 回転対称性が見つかった場合はTrue、見つからない場合はFalse
  """
  def check_rotations(self,ijkl_list:Set[int],i:int,j:int,k:int,l:int,N:int)->bool:
    rot90=((N-1-k)<<15)+((N-1-l)<<10)+(j<<5)+i
    rot180=((N-1-j)<<15)+((N-1-i)<<10)+((N-1-l)<<5)+(N-1-k)
    rot270=(l<<15)+(k<<10)+((N-1-i)<<5)+(N-1-j)
    # 回転対称性をチェック
    # if rot90 in ijkl_list:
    #   return True
    # if rot180 in ijkl_list:
    #   return True
    # if rot270 in ijkl_list:
    #   return True
    # return False
    return any(rot in ijkl_list for rot in (rot90, rot180, rot270))
  #
  def symmetry(self,ijkl:int,N:int)->int:
    """
    if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl):
      if self.symmetry90(ijkl,N):
        return 2
      else:
        return 4
    else:
      return 8
    """
    return 2 if self.symmetry90(ijkl,N) else 4 if self.geti(ijkl)==N-1-self.getj(ijkl) and self.getk(ijkl)==N-1-self.getl(ijkl) else 8
  #
  def symmetry90(self,ijkl:int,N:int)->bool:
    return ((self.geti(ijkl)<<15)+(self.getj(ijkl)<<10)+(self.getk(ijkl)<<5)+self.getl(ijkl))==(((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl))
  #
  """
  i,j,k,l のインデックスを1つの整数に変換する関数
  Args:
      i,j,k,l (int): 各インデックス
  Returns:
      int: i,j,k,l を基にした1つの整数
  """
  def to_ijkl(self,i:int,j:int,k:int,l:int)->int:
    return (i<<15)+(j<<10)+(k<<5)+l
  #
  """
  時計回りに90度回転する。
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: 90度回転後の配置をエンコードした整数
  """
  def rot90(self,ijkl:int,N:int)->int:
    return ((N-1-self.getk(ijkl))<<15)+((N-1-self.getl(ijkl))<<10)+(self.getj(ijkl)<<5)+self.geti(ijkl)
  #
  """
  垂直方向のミラーリングを行う。
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: ミラーリング後の配置をエンコードした整数
  """
  def mirvert(self,ijkl:int,N:int)->int:
    return self.to_ijkl(N-1-self.geti(ijkl),N-1-self.getj(ijkl),self.getl(ijkl),self.getk(ijkl))
  #
  """2つの値のうち最小値を返す"""
  def ffmin(self,a:int,b:int)->int:
    return min(a,b)
  #
  """iを抽出"""
  def geti(self,ijkl:int)->int:
    return (ijkl>>15)&0x1F
  #
  """jを抽出"""
  def getj(self,ijkl:int)->int:
    return (ijkl>>10)&0x1F
  #
  """kを抽出"""
  def getk(self,ijkl:int)->int:
    return (ijkl>>5)&0x1F
  #
  """lを抽出"""
  def getl(self,ijkl:int)->int:
    return ijkl&0x1F
  """
  クイーンの配置を回転・ミラーリングさせて最も左上に近い標準形に変換する
  Args:
      ijkl (int): 配置のエンコードされた整数
      N (int): ボードサイズ
  Returns:
      int: 標準形の配置をエンコードした整数
  """
  def jasmin(self,ijkl:int,N:int)->int:
    # 最初の最小値と引数を設定
    arg=0
    min_val=self.ffmin(self.getj(ijkl),N-1-self.getj(ijkl))
    # i: 最初の行（上端） 90度回転2回
    if self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))<min_val:
      arg=2
      min_val=self.ffmin(self.geti(ijkl),N-1-self.geti(ijkl))
    # k: 最初の列（左端） 90度回転3回
    if self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))<min_val:
      arg=3
      min_val=self.ffmin(self.getk(ijkl),N-1-self.getk(ijkl))
    # l: 最後の列（右端） 90度回転1回
    if self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))<min_val:
      arg=1
      min_val=self.ffmin(self.getl(ijkl),N-1-self.getl(ijkl))
    # 90度回転を arg 回繰り返す

    # codon で動きます
    for _ in range(arg):
      ijkl=self.rot90(ijkl,N)

    # codon で動かない
    # ijkl=reduce(lambda acc,_:self.rot90(acc,N),range(arg),ijkl) 

    # 必要に応じて垂直方向のミラーリングを実行
    if self.getj(ijkl)<N-1-self.getj(ijkl):
      ijkl=self.mirvert(ijkl,N)
    return ijkl
  #
  """
  ld: 左対角線の占領状態
  rd: 右対角線の占領状態
  col: 列の占領状態
  k: 特定の行
  l: 特定の行
  row: 現在の行
  queens: 配置済みのクイーンの数
  LD: 左端の特殊な占領状態
  RD: 右端の特殊な占領状態
  counter: コンステレーションのカウント
  constellations: コンステレーションリスト
  N: ボードサイズ
  preset_queens: 必要なクイーンの数
  """
  def set_pre_queens(self,ld:int,rd:int,col:int,k:int,l:int,row:int,queens:int,LD:int,RD:int,counter:list,constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    mask=(1<<N)-1  # setPreQueensで使用
    # k行とl行はスキップ
    if row==k or row==l:
      self.set_pre_queens(ld<<1,rd>>1,col,k,l,row+1,queens,LD,RD,counter,constellations,N,preset_queens)
      return
    # クイーンの数がpreset_queensに達した場合、現在の状態を保存
    if queens==preset_queens:
      constellation= {"ld": ld,"rd": rd,"col": col,"startijkl": row<<20,"solutions":0}
      # 新しいコンステレーションをリストに追加
      constellations.append(constellation)
      counter[0]+=1
      return
    # 現在の行にクイーンを配置できる位置を計算
    free=~(ld|rd|col|(LD>>(N-1-row))|(RD<<(N-1-row)))&mask
    while free:
      bit:int=free&-free  # 最も下位の1ビットを取得
      # bit:int=-free&free  # 最も下位の1ビットを取得
      free&=free-1  # 使用済みビットを削除
      # クイーンを配置し、次の行に進む
      self.set_pre_queens((ld|bit)<<1,(rd|bit)>>1,col|bit,k,l,row+1,queens+1,LD,RD,counter,constellations,N,preset_queens)
  #
  def exec_solutions(self,constellations:List[Dict[str,int]],N:int)->None:
    # jmark=0  # ここで初期化
    # j=0
    # k=0
    # l=0
    # ijkl=0
    # ld=0
    # rd=0
    # col=0
    # start_ijkl=0
    # start=0
    # free=0
    # LD=0
    # endmark=0
    # mark1=0
    # mark2=0
    jmark=j=k=l=ijkl=ld=rd=col=start_ijkl=start=free=LD=endmark=mark1=mark2=0
    small_mask=(1<<(N-2))-1
    temp_counter=[0]
    for constellation in constellations:
      # mark1=mark1
      # mark2=mark2
      mark1,mark2=mark1,mark2
      # mark2=mark2
      start_ijkl=constellation["startijkl"]
      start=start_ijkl>>20
      ijkl=start_ijkl&((1<<20)-1)
      # j=self.getj(ijkl)
      # k=self.getk(ijkl)
      # l=self.getl(ijkl)
      j,k,l=self.getj(ijkl),self.getk(ijkl),self.getl(ijkl)
      # 左右対角線と列の占有状況を設定
      # ld=constellation["ld"]>>1
      # rd=constellation["rd"]>>1
      # col=(constellation["col"]>>1)|(~small_mask)
      ld,rd,col=constellation["ld"]>>1,constellation["rd"]>>1,(constellation["col"]>>1)|(~small_mask)
      LD=(1<<(N-1-j))|(1<<(N-1-l))
      ld|=LD>>(N-start)
      # rd=constellation["rd"]>>1
      if start>k:
        rd|=(1<<(N-1-(start-k+1)))
      if j >= 2 * N-33-start:
        rd|=(1<<(N-1-j))<<(N-2-start)
      # col=(constellation["col"]>>1)|(~small_mask)
      free=~(ld|rd|col)
      # 各ケースに応じた処理
      if j<(N-3):
        jmark,endmark=j+1,N-2
        if j>2 * N-34-start:
          if k<l:
            mark1,mark2=k-1,l-1
            if start<l:
              if start<k:
                if l!=k+1:
                  self.SQBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else: self.SQBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark1,mark2=l-1,k-1
            if start<k:
              if start<l:
                if k!=l+1:
                  self.SQBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else: self.SQBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          if k<l:
            mark1,mark2=k-1,l-1
            if l!=k+1:
              self.SQBjlBkBlBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjlBklBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else:
            mark1,mark2=l-1,k-1
            if k != l+1:
              self.SQBjlBlBkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else: self.SQBjlBlkBjrB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      elif j==(N-3):
        endmark=N-2
        if k<l:
          mark1,mark2=k-1,l-1
          if start<l:
            if start<k:
              if l != k+1: self.SQd2BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQd2BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=l-1
              self.SQd2BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:
          mark1,mark2=l-1,k-1
          endmark=N-2
          if start<k:
            if start<l:
              if k != l+1:
                self.SQd2BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQd2BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:
              mark2=k-1
              self.SQd2BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: self.SQd2B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      elif j==N-2: # クイーンjがコーナーからちょうど1列離れている場合
        if k<l:  # kが最初になることはない、lはクイーンの配置の関係で最後尾にはなれない
          endmark=N-2
          if start<l:  # 少なくともlがまだ来ていない場合
            if start<k:  # もしkもまだ来ていないなら
              mark1=k-1
              if l != k+1:  # kとlが隣り合っている場合
                mark2=l-1
                self.SQd1BkBlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else: self.SQd1BklB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:  # lがまだ来ていないなら
              mark2=l-1
              self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          # すでにkとlが来ている場合
          else: self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else:  # l<k
          if start<k:  # 少なくともkがまだ来ていない場合
            if start<l:  # lがまだ来ていない場合
              if k<N-2:  # kが末尾にない場合
                mark1,endmark=l-1,N-2
                if k != l+1:  # lとkの間に空行がある場合
                  mark2=k-1
                  self.SQd1BlBkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                # lとkの間に空行がない場合
                else: self.SQd1BlkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:  # kが末尾の場合
                if l != (N-3):  # lがkの直前でない場合
                  mark2,endmark=l-1,N-3
                  self.SQd1BlB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
                else:  # lがkの直前にある場合
                  endmark=N-4
                  self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
            else:  # もしkがまだ来ていないなら
              if k != N-2:  # kが末尾にない場合
                mark2,endmark=k-1,N-2
                self.SQd1BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
              else:  # kが末尾の場合
                endmark=N-3
                self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
          else: # kとlはスタートの前
            endmark=N-2
            self.SQd1B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      else:  # クイーンjがコーナーに置かれている場合
        endmark=N-2
        if start>k:
          self.SQd0B(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
        else: # クイーンをコーナーに置いて星座を組み立てる方法と、ジャスミンを適用する方法
          mark1=k-1
          self.SQd0BkB(ld,rd,col,start,free,jmark,endmark,mark1,mark2,temp_counter,N)
      # 各コンステレーションのソリューション数を更新
      constellation["solutions"]=temp_counter[0] * self.symmetry(ijkl,N)
      temp_counter[0]=0
  #
  def gen_constellations(self,ijkl_list:Set[int],constellations:List[Dict[str,int]],N:int,preset_queens:int)->None:
    halfN=(N+1)//2  # Nの半分を切り上げ
    # コーナーにクイーンがいない場合の開始コンステレーションを計算する
    """
    for k in range(1,halfN):
      for l in range(k+1,N-1):
        for i in range(k+1,N-1):
          if i==(N-1)-l:
            continue
          for j in range(N-k-2,0,-1):
            if j==i or l==j:
              continue
            if not self.check_rotations(ijkl_list,i,j,k,l,N):
              ijkl_list.add(self.to_ijkl(i,j,k,l))
    """
    ijkl_list.update(self.to_ijkl(i,j,k,l) for k in range(1,halfN) for l in range(k+1,N-1) for i in range(k+1,N-1) if i != (N-1)-l for j in range(N-k-2,0,-1) if j!=i and j!=l if not self.check_rotations(ijkl_list,i,j,k,l,N)
    )
    # コーナーにクイーンがある場合の開始コンステレーションを計算する
    # for j in range(1,N-2):
    #   for l in range(j+1,N-1):
    #     ijkl_list.add(self.to_ijkl(0,j,0,l))
    # [ijkl_list.add(self.to_ijkl(0,j,0,l)) for j in range(1,N-2) for l in range(j+1,N-1)]
    ijkl_list.update({self.to_ijkl(0,j,0,l) for j in range(1,N-2) for l in range(j+1,N-1)})


    # Jasmin変換
    ijkl_list_jasmin=set()
    # for start_constellation in ijkl_list:
    #   ijkl_list_jasmin.add(self.jasmin(start_constellation,N))
    # [ijkl_list_jasmin.add(self.jasmin(start_constellation,N)) for start_constellation in ijkl_list]
    ijkl_list_jasmin.update(self.jasmin(start_constellation, N) for start_constellation in ijkl_list)
    # ijkl_list_jasmin.update(map(lambda sc: self.jasmin(sc, N), ijkl_list))


    ijkl_list=ijkl_list_jasmin
    L=1<<(N-1)  # Lは左端に1を立てる
    for sc in ijkl_list:
      # i=self.geti(sc)
      # j=self.getj(sc)
      # k=self.getk(sc)
      # l=self.getl(sc)
      i,j,k,l=self.geti(sc),self.getj(sc),self.getk(sc),self.getl(sc)
      # ld=(L>>(i-1))|(1<<(N-k)) # 左対角線
      # rd=(L>>(i+1))|(1<<(l-1)) # 右対角線
      # col=1|L|(L>>i)|(L>>j) # 列
      ld,rd,col=(L>>(i-1))|(1<<(N-k)),(L>>(i+1))|(1<<(l-1)),1|L|(L>>i)|(L>>j) 
      # LD=(L>>j)|(L>>l) # 左端の対角線
      # RD=(L>>j)|(1<<k) # 右端の対角線
      LD,RD=(L>>j)|(L>>l),(L>>j)|(1<<k)
      counter=[0] # サブコンステレーションを生成
      self.set_pre_queens(ld,rd,col,k,l,1,3 if j==N-1 else 4,LD,RD,counter,constellations,N,preset_queens)
      current_size=len(constellations)
      # 生成されたサブコンステレーションにスタート情報を追加
      # for a in range(counter[0]):
      #   constellations[current_size-a-1]["startijkl"]|=self.to_ijkl(i,j,k,l)
      list(map(lambda target:target.__setitem__("startijkl",target["startijkl"]|self.to_ijkl(i,j,k,l)),(constellations[current_size-a-1] for a in range(counter[0]))))

#
class NQueens19_constellations():
  def main(self)->None:
    # nmin:int=8
    # nmax:int=9
    nmin:int=5
    nmax:int=19
    preset_queens:int=4  # 必要に応じて変更
    print(" N:        Total       Unique        hh:mm:ss.ms")
    for size in range(nmin,nmax):
      start_time=datetime.now()
      ijkl_list:Set[int]=set()
      constellations:List[Dict[str,int]]=[]
      NQ=NQueens19()
      NQ.gen_constellations(ijkl_list,constellations,size,preset_queens)
      NQ.exec_solutions(constellations,size)
      total:int=sum(c['solutions'] for c in constellations if c['solutions']>0)
      time_elapsed=datetime.now()-start_time
      text=str(time_elapsed)[:-3]
      print(f"{size:2d}:{total:13d}{0:13d}{text:>20s}")
#
if __name__=="__main__":
  NQueens19_constellations().main()
```

実行結果
```
CentOS-5.1$ ./19Python_constellations_codon
 N:        Total       Unique        hh:mm:ss.ms
 5:           18            0         0:00:00.000
 6:            4            0         0:00:00.000
 7:           40            0         0:00:00.000
 8:           92            0         0:00:00.000
 9:          352            0         0:00:00.000
10:          724            0         0:00:00.000
11:         2680            0         0:00:00.001
12:        14200            0         0:00:00.003
13:        73712            0         0:00:00.008
14:       365596            0         0:00:00.043
15:      2279184            0         0:00:00.249
16:     14772512            0         0:00:01.468
17:     95815104            0         0:00:10.120
```


## 結論
どう頑張ってもPythonやPypyはマルチプロセスを伴ったとしてもcodonには敵わない。codonでマルチプロセス、GPU/CUDA 対応できたら多分無敵です。っと思っていたら先日対応できたかも。というまことしやかな噂が。

気になります。




## ソースコード
今回の連載 python/pypy/codonのソースコードディレクトリはこちら
https://github.com/suzukiiichiro/N-Queens/tree/master/10Bit_Python

## Ｎクイーン問題 過去記事アーカイブ
【過去記事アーカイブ】Ｎクイーン問題 過去記事一覧
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens


Ｎクイーン問題（８６）第七章並列処理 Constellations_warp ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2025-04-01-03-n-queens-suzuki/
Ｎクイーン問題（８５）第七章並列処理 Constellations_with_Trash ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2025-04-01-02-n-queens-suzuki/
Ｎクイーン問題（８４）第七章並列処理 Constellations ＮＶＩＤＩＡ ＣＵＤＡ編
https://suzukiiichiro.github.io/posts/2025-04-01-01-n-queens-suzuki/
Ｎクイーン問題（８３）Python-codon＆並列処理で高速化 Constellations
https://suzukiiichiro.github.io/posts/2025-03-11-07-n-queens-suzuki/
Ｎクイーン問題（８２）Python-並列処理で高速化 16Python_carryChain_ProcessPool
https://suzukiiichiro.github.io/posts/2025-03-11-06-n-queens-suzuki/
Ｎクイーン問題（８１）Python-codonで高速化 15Python_carryChain
https://suzukiiichiro.github.io/posts/2025-03-11-05-n-queens-suzuki/
Ｎクイーン問題（８０）Python-並列処理で高速化 14Python_NodeLayer_symmetry_ProcessPool
https://suzukiiichiro.github.io/posts/2025-03-11-04-n-queens-suzuki/
Ｎクイーン問題（７９）Python-codonで高速化 13Python_NodeLayer_symmetry
https://suzukiiichiro.github.io/posts/2025-03-11-03-n-queens-suzuki/
Ｎクイーン問題（７８）Python-codonで高速化 12Python_NodeLayer_mirror
https://suzukiiichiro.github.io/posts/2025-03-11-02-n-queens-suzuki/
Ｎクイーン問題（７７）Python-codonで高速化 11Python_NodeLayer
https://suzukiiichiro.github.io/posts/2025-03-11-01-n-queens-suzuki/
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





















