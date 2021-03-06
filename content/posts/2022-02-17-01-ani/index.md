---
title: "第9回 pythonでNQueen（エイトクイーン）対象解除法（2）"
description: "pythonを勉強しながらNQueen（エイトクイーン）問題を解いていきます。今回は第9回目。対象解除法が正しいことの検証をしてみたいと思います。プログラムを改造してクイーンの配置を出力するようにします。" 
date: 2022-02-17T17:25:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 対象解除法が正しいか検証してみよう 
今回は対象解除法が正しいかどうかを検証するためプログラムを改造してクイーンを設置した場所を出力するようにしてみましょう。 

プログラムソースは以下のURLにあります。    
https://github.com/suzukiiichiro/N-Queens/blob/master/03Python/py04_nqueen.py    

## printoutメソッドを利用しよう 
クイーンの設置場所を出力するメソッドを作って321行目と322行目の間に設置しましょう。  
ABOARDに各行のクイーンの設置場所を記憶しているのでこれを利用しましょう。  
py01,py02で使っていたprintoutメソッドを修正して利用しましょう。  
printoutメソッドを見てみましょう。  

```
def printout():
  """printout()"""
  global COUNT                # pylint: disable=W0603
  COUNT += 1                  #インクリメントはこのように書きます
  print(COUNT, end=": ")      #改行したくないときは, を行末にいれます
  for i in range(SIZE):
    print(ABOARD[i], end="")
  print("")
```
どこを修正すれば良いでしょうか  

stotalの値を出力したいのでメソッドの引数に追加しましょう。  
引数はメソッドを宣言している()の中に書きます。  
クイーンの設置場所を出力するのでメソッド名はprintboardにしましょう。  
また、py01,py02とは違いpy03以降はSIZEは可変になったため無くなっています。  
グローバル変数にはないためnqueenメソッドから引数でsizeを渡してあげましょう  

```
def  printboard(stotal,size):
```
冒頭でCOUNTとstotalの値を出力するようにしましょう  
改行しても良いので end=": "はいらないです  
py03以降COUNTは使わなくなっているので宣言を追加する必要がありあます。  
グローバル変数宣言の一番下にCOUNT = 0 を追加しましょう  
```
  print(COUNT,":",stotal)
```
ABOARDには各行のクイーンの設置場所が記憶されています。  
ABOARD[2]=4 だったら3行目の右から5番目にクイーンが置かれています。  
ちなみにメソッド内でABOARDをglobal宣言していませんが、参照するだけだったらglobal宣言いらないみたいです。  
各行がクイーンが置かれている場所「o」置かれていない場所が「-」になるようにしてみましょう。  
printoutは各行ごとにfor文を回していましたが各セルごとに出力するためfor文を追加しましょう。  
iで行、jで行の中の各セルごとにみていってクイーンが置かれている場所の時だけ「o」を出力しましょう。  
そして行の終わりに print("")で改行を入れましょう。  
```
  for i in range(size):
    for j in range(size):
      if ABOARD[i]==j:
        print("o", end="")
      else:
        print("-", end="")
    print("")
```
ボードの出力が終わったら見やすいようにセパレータを入れてみましょう  
```
COUNT = 0
#BOARD出力
def  printboard(stotal,size):
  global COUNT 
  COUNT += 1
  print(COUNT,":",stotal)
  for i in range(size):
    for j in range(size):
      if ABOARD[i]==j:
        print("o", end="")
      else:
        print("-", end="")
    print("")
  print("########")

```
新しく関数を追記するときは決まりは特にないのですがグローバル変数宣言の直下(223行目あたり)に置きましょう。  

そして、331行目,332行目の間でprintboardメソッドを呼び出しましょう。  
```
    stotal = symmetryops(size)	      # 対称解除法の導入
    printboard(stotal,size)
    if stotal != 0:
```
## 出力結果を見てみよう
それでは出力を見てみましょう。  
py04はn4からn15まで実行するのでn8だけ実行してみましょう。  
214行目のMAX を9にして  
minを8にして実行してみてください  

```
python py04_nqueen.py
```

こんな感じで出力されるかと思います。  
```
1 : 8
o-------
----o---
-------o
-----o--
--o-----
------o-
-o------
---o----
########
2 : 8
o-------
-----o--
-------o
--o-----
------o-
---o----
-o------
----o---
########
3 : 0
o-------
------o-
---o----
-----o--
-------o
-o------
----o---
--o-----
########

```
先頭の1はstotalが8なので90度回転して同じものがあるということです。  
実際に90度回転して同じでstotalが0のものがあるか探してみましょう。  

```
1 : 8
o-------
----o---
-------o
-----o--
--o-----
------o-
-o------
---o----
########
```
1を反時計回りに90度回転させると  
以下の形になります。  
```
--o-----
-----o--
---o----
-o------
-------o
----o---
------o-
o-------
```
この形のクイーンの配置があるか調べてみると  
```
22 : 0
--o-----
-----o--
---o----
-o------
-------o
----o---
------o-
o-------

```
22番目のクイーンの配置に同じものがありました。  
またstotalも0ですので正しそうです。  
こんな感じで検証できそうですが手動で全部調べるのはちょっと辛いですよね。。。  
次回はプログラムを使って検証する方法を試してみましょう。  

