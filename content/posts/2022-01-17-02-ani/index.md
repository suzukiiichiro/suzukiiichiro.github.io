---
title: "s-Stat 時系列データで異常値を検知しよう（３）"
description: "ここではpythonのPandasでcsvを読み込んだDataFrameオブジェクトの使い方、DataFrameオブジェクトからSeriesオブジェクトへの変換方法を説明します。"
date: 2022-01-17T17:46:13+09:00
draft: false
image: anal.jpg
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## Pandas DataFrameオブジェクト  
Pandasでcsvをread_csvするとDataFrameオブジェクトとして読み込まれます。  
DataFramオブジェクトは２次元配列な感じです。  
１次元目が列、２次元目が行のイメージみたいです。  

例えば以下のcsvだと  
```
date,value
2019,2845
2020,3246
2021,3633
```
read_csvしたDataFrameオブジェクトの変数名をdfとすると  
それぞれのデータには以下の方法でアクセスします。  
```
df['date'][0]->2019
df['date'][1]->2020
df['date'][2]->2021
df['value'][0]->2845
df['value][1]->3246
df['value'][2]->3633
```
read_csvするとデフォルトだと１行目を列名とみなすみたいです。  
アクセスの方法も列名が反映され連想配列っぽくなります。  

## Pandas Seriesオブジェクト

hampelの第１引数はPandasのSeriesオブジェクトです。  
Seriesオブジェクトは１次元の配列みたいです。  
DataFrameオブジェクトからSeriesオブジェクトに変換する方法ですが  
以下の方法でできます。  
```
input=pd.Series(df['value'])
```

## csvを読み込んでhampelメソッドを使い異常値を検出する 。
プログラムは以下の流れになります。  
csvをread_csvでDataFrameオブジェクトとして読み込む。  
DataFrameオブジェクトからSeriesオブジェクトを生成する。  
Seriesオブジェクトを使ってhampelメソッドを呼び出して異常値を検出する。  

ソースコードは以下の通り  

```
import matplotlib.pyplot as plt
import pandas as pd
from hampel import hampel

# データ取得
df = pd.read_csv('./kome.csv')
print(df.columns)
print(df['value'])
input = pd.Series(df['value'])
rsts = hampel(input, window_size=5, n=3)
for rst in rsts:
  print('%d:date:%s value:%d' % (rst,df['date'][rst],df['value'][rst]))


```
