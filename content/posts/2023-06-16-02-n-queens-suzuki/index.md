---
title: "Ｎクイーン問題（４６）第七章 ステップＮの実装 Python編"
date: 2023-06-16T11:05:36+09:00
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


## ステップＮの実装
なんでしたっけ？それ。
あれです。以下に示します。

```
bash-3.2$ python 08Python_stepN.py
キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.001
 6:            4            1         0:00:00.004
 7:           40            6         0:00:00.023
 8:           92           12         0:00:00.112
 9:          352           46         0:00:00.514
10:          724           92         0:00:02.007
11:         2680          341         0:00:06.930
12:        14200         1788         0:00:21.436
bash-3.2$
```

シリーズのバックナンバーによく出てきました。


## ソースコード
早速ソースコードは以下のとおりです。

```python:08Python_stepN.py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
import copy
from datetime import datetime
"""
ステップＮ版 Ｎクイーン

詳細はこちら。
【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから
https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題

エイト・クイーンのプログラムアーカイブ
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens

# 実行 
$ python <filename.py>

# 実行結果
bash-3.2$ python 08Python_stepN.py
キャリーチェーン
 N:        Total       Unique        hh:mm:ss.ms
 5:           10            2         0:00:00.001
 6:            4            1         0:00:00.004
 7:           40            6         0:00:00.023
 8:           92           12         0:00:00.112
 9:          352           46         0:00:00.514
10:          724           92         0:00:02.007
11:         2680          341         0:00:06.930
12:        14200         1788         0:00:21.436
"""
#
# グローバル変数
TOTAL=0
UNIQUE=0
pres_a=[0]*930
pres_b=[0]*930
COUNTER=[0]*3
B=[]
#
# ボード外側２列を除く内側のクイーン配置処理
def solve(row,left,down,right):
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
    total+=solve(row,(left|bit)<<1,down|bit,(right|bit)>>1)
    bitmap^=bit
  return total
#
# キャリーチェーン　solve()を呼び出して再起を開始する
def process(size,sym):
  global B
  global COUNTER
  # sym 0:COUNT2 1:COUNT4 2:COUNT8
  COUNTER[sym]+=solve(
        B[0]>>2,
        B[1]>>4,
        ((((B[2]>>2)|(~0<<(size-4)))+1)<<(size-5))-1,
        (B[3]>>4)<<(size-5)
  )
#
# キャリーチェーン　対象解除
def carryChainSymmetry(size,n,w,s,e):
  global B
  # n,e,s=(N-2)*(N-1)-1-w の場合は最小値を確認する。
  ww=(size-2)*(size-1)-1-w
  w2=(size-2)*(size-1)-1
  # 対角線上の反転が小さいかどうか確認する
  if s==ww and n<(w2-e): return 
  # 垂直方向の中心に対する反転が小さいかを確認
  if e==ww and n>(w2-n): return
  # 斜め下方向への反転が小さいかをチェックする
  if n==ww and e>(w2-s): return
  # 【枝刈り】１行目が角の場合
  # １．回転対称チェックせずにCOUNT8にする
  if not B[4][0]:
    process(size,2) # COUNT8
    return
  # n,e,s==w の場合は最小値を確認する。
  # : '右回転で同じ場合は、
  # w=n=e=sでなければ値が小さいのでskip
  # w=n=e=sであれば90度回転で同じ可能性 ';
  if s==w:
    if n!=w or e!=w: return
    process(size,0) # COUNT2
    return
  # : 'e==wは180度回転して同じ
  # 180度回転して同じ時n>=sの時はsmaller?  ';
  if e==w and n>=s:
    if n>s: return
    process(size,1) # COUNT4
    return
  process(size,2)   # COUNT8
  return
#
# キャリーチェーン 効きのチェック dimxは行 dimyは列
def placement(size,dimx,dimy):
  global B
  if B[4][dimx]==dimy:
    return 1
  #
  #
  # 【枝刈り】Qが角にある場合の枝刈り
  #  ２．２列めにクイーンは置かない
  #  （１はcarryChainSymmetry()内にあります）
  #
  #  Qが角にある場合は、
  #  2行目のクイーンの位置 t_x[1]が BOUND1
  #  BOUND1行目までは2列目にクイーンを置けない
  # 
  #    +-+-+-+-+-+  
  #    | | | |X|Q| 
  #    +-+-+-+-+-+  
  #    | |Q| |X| | 
  #    +-+-+-+-+-+  
  #    | | | |X| |       
  #    +-+-+-+-+-+             
  #    | | | |Q| | 
  #    +-+-+-+-+-+ 
  #    | | | | | |      
  #    +-+-+-+-+-+  
  if B[4][0]:
    #
    # 【枝刈り】Qが角にない場合
    #
    #  +-+-+-+-+-+  
    #  |X|X|Q|X|X| 
    #  +-+-+-+-+-+  
    #  |X| | | |X| 
    #  +-+-+-+-+-+  
    #  | | | | | |
    #  +-+-+-+-+-+
    #  |X| | | |X|
    #  +-+-+-+-+-+
    #  |X|X| |X|X|
    #  +-+-+-+-+-+
    #
    #   １．上部サイド枝刈り
    #  if ((row<BOUND1));then        
    #    bitmap=$(( bitmap|SIDEMASK ));
    #    bitmap=$(( bitmap^=SIDEMASK ));
    #
    #  | | | | | |       
    #  +-+-+-+-+-+  
    #  BOUND1はt_x[0]
    #
    #  ２．下部サイド枝刈り
    #  if ((row==BOUND2));then     
    #    if (( !(down&SIDEMASK) ));then
    #      return ;
    #    fi
    #    if (( (down&SIDEMASK)!=SIDEMASK ));then
    #      bitmap=$(( bitmap&SIDEMASK ));
    #    fi
    #  fi
    #
    #  ２．最下段枝刈り
    #  LSATMASKの意味は最終行でBOUND1以下または
    #  BOUND2以上にクイーンは置けないということ
    #  BOUND2はsize-t_x[0]
    #  if(row==sizeE){
    #    //if(!bitmap){
    #    if(bitmap){
    #      if((bitmap&LASTMASK)==0){
    if B[4][0]!=-1:
      if(
        (dimx<B[4][0] or dimx>=size-B[4][0]) and 
        (dimy==0 or dimy==size-1) 
      ):
        return 0
      if(
        (dimx==size-1) and 
        (dimy<=B[4][0] or dimy>=size-B[4][0])
      ):
        return 0
  else:
    if B[4][1]!=-1:
      # bitmap=$(( bitmap|2 )); # 枝刈り
      # bitmap=$(( bitmap^2 )); # 枝刈り
      #((bitmap&=~2)); # 上２行を一行にまとめるとこうなります
      # ちなみに上と下は同じ趣旨
      # if (( (t_x[1]>=dimx)&&(dimy==1) ));then
      #   return 0;
      # fi
      if B[4][1]>=dimx and dimy==1:
        return 0
  if( (B[0] & 1<<dimx) or 
      (B[1] & 1<<(size-1-dimx+dimy)) or
      (B[2] & 1<<dimy) or
      (B[3] & 1<<(dimx+dimy)) 
  ): 
    return 0
  B[0]|=1<<dimx
  B[1]|=1<<(size-1-dimx+dimy)
  B[2]|=1<<dimy
  B[3]|=1<<(dimx+dimy)
  B[4][dimx]=dimy
  return 1
#
# チェーンのビルド
def buildChain(size):
  global B
  global pres_a
  global pres_b
  B=[0,0,0,0,[-1]*size] # Bの初期化
  wB=sB=eB=nB=[]
  wB=copy.deepcopy(B)
  for w in range( (size//2)*(size-3) +1):
    B=copy.deepcopy(wB)
    B=[0,0,0,0,[-1]*size] # Bの初期化
    # １．０行目と１行目にクイーンを配置
    if placement(size,0,pres_a[w])==0:
      continue
    if placement(size,1,pres_b[w])==0:
      continue
    # ２．９０度回転
    nB=copy.deepcopy(B)
    mirror=(size-2)*(size-1)-w
    for n in range(w,mirror,1):
      B=copy.deepcopy(nB)
      if placement(size,pres_a[n],size-1)==0:
        continue
      if placement(size,pres_b[n],size-2)==0:
        continue
      # ３．９０度回転
      eB=copy.deepcopy(B)
      for e in range(w,mirror,1):
        B=copy.deepcopy(eB)
        if placement(size,size-1,size-1-pres_a[e])==0:
          continue
        if placement(size,size-2,size-1-pres_b[e])==0:
          continue
        # ４．９０度回転
        sB=copy.deepcopy(B)
        for s in range(w,mirror,1):
          B=copy.deepcopy(sB)
          if placement(size,size-1-pres_a[s],0)==0:
            continue
          if placement(size,size-1-pres_b[s],1)==0:
            continue
          # 対象解除法
          carryChainSymmetry(size,n,w,s,e)
#
# チェーンの初期化
def initChain(size):
  global pres_a
  global pres_b
  idx=0
  for a in range(size):
    for b in range(size):
      if (a>=b and (a-b)<=1) or (b>a and (b-a<=1)):
        continue
      pres_a[idx]=a
      pres_b[idx]=b
      idx+=1
#
# キャリーチェーン
def carryChain(size):
  global B
  global TOTAL
  global UNIQUE
  global COUNTER
  TOTAL=UNIQUE=0
  COUNTER[0]=COUNTER[1]=COUNTER[2]=0
  # Bの初期化  [0, 0, 0, 0, [0, 0, 0, 0, 0]]
  B=[0]*5             # row/left/down/right/X
  B[4]=[-1]*size       # X を0でsize分を初期化
  initChain(size)     # チェーンの初期化
  buildChain(size)    # チェーンのビルド
  # 集計
  UNIQUE=COUNTER[0]+COUNTER[1]+COUNTER[2]
  TOTAL=COUNTER[0]*2 + COUNTER[1]*4 + COUNTER[2]*8
#
# メイン
def main():
  global TOTAL
  global UNIQUE
  nmin = 5
  nmax = 24
  print("キャリーチェーン")
  print(" N:        Total       Unique        hh:mm:ss.ms")
  for i in range(nmin, nmax,1):
    start_time = datetime.now()
    carryChain(i)
    time_elapsed = datetime.now() - start_time
    _text = '{}'.format(time_elapsed)
    text = _text[:-3]
    print("%2d:%13d%13d%20s" % (i, TOTAL, UNIQUE,text))  # 出力
#
main()
#
#
# 実行
# size=5
# carryChain(size)    # ７．キャリーチェーン
# print("size:",size,"TOTAL:",TOTAL,"UNIQUE:",UNIQUE)
#
```


次回からは、ここまでやってきたPythonのコードを最適化、最速化していきます。
お楽しみに！




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

