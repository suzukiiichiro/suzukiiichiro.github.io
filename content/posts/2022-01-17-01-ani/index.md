---
title: "s-Stat 時系列データで異常値を検知しよう（２）"
date: 2022-01-17T10:51:13+09:00
draft: false
image: anal.jpg
categories:
  - プログラミング
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## hampel フィルタとは
時系列データの異常値検知で良いのないかなあと探しました。  
最近は機械学習で時系列データの異常値検知をやっているものが結構ある感じでしたが、  
e-Statの統計データですが年次や月次だったりするのでデータ数がそんなに多くないので機械学習はどうだろうと思い今回は機械学習以外の方法を探しました。  
標準偏差などを利用して異常値を検出するアルゴリズムとしてHampelフィルターというものがありました。  
pythonでhampelというライブラリーで簡単に利用できそうなのでまずこれを試してみます。  

## python hampel ライブラリを利用   
hampelはpip で簡単にインストールできます  

```
pip install hampel
```

```
import matplotlib.pyplot as plt
import pandas as pd
from hampel import hampel

input=pd.Series([3, 2, 1 , 3 , 1, 2, 9, 2, 1, 22, 1, 1, 8])
rst = hampel(input, window_size=5, n=3)
print("rst: ", rst)

bash-3.2$ python p.py
rst:  [6, 9, 12]
```

時系列データをpandasのSeriesに１次元で食わせて  
hampelメソッドを呼び出すだけで簡単に異常値が検出できます。  
異常値が検出された配列の番号が返却されます。  
この例だと7個目の9,10個目の22,13個目の8です。  
windon_size などは経験的にパラメータ調整するみたいです。  

次回は前回読み込んだcsvを使って異常値を検出するところまで行きたいと思います。
