---
title: "s-Stat 時系列データで異常値を検知しよう（１）"
date: 2022-01-14T13:40:13+09:00
draft: false
image: anal.jpg
categories:
  - プログラミング
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## s-Stat 時系列データで異常値を検知しよう  

たくさんあるデータの中から関心の高そうな項目を抽出して表示しようというテーマでe-Statデータを取り扱っています。  
関心の高そうな項目としては、キーワードが重要というのもあります。これは前回で取り扱ったテーマでgoogle検索などを利用してピックアップしてこうかなと考えております。  
そのほか、値が急上昇、急下降したような場合も関心が高い項目と言えそうです。  
今回は、データの中から値が急上昇、急下降した場合を抽出する方法を考えて行きたいと思います。  

webで検索した感じだと今回やりたいことは、時系列データの異常値を検知するというものみたいです。  
方法を色々調べてみたのですがpython のhampel を使うのが簡単そうです。  

e-Statのapiを取得したcsvを利用しますので、まずpythonでcsvを取り扱う方法から調べる必要があります。  

## python でcsvを取り扱う
今回は、pandasを利用することになるのでpandasでcsvを読み込むことにします。  

課題としては、商品の小売価格の変動が分かりやすいので「小売物価統計調査 小売物価統計調査（動向編） 」から札幌市のコシヒカリの値段を抜粋してcsvを作成したいと思います。  

```
wget "http://api.e-stat.go.jp/rest/3.0/app/getSimpleStatsData?appId=xxxxxxxxx&lang=J&statsDataId=0003421913&metaGetFlg=Y&cntGetFlg=N&explanationGetFlg=Y&annotationGetFlg=Y&sectionHeaderFlg=1&replaceSpChars=0" -O kouri.csv

cat kouri.csv |grep "札幌市"|grep "1001 うるち米(単一原料米,「コシヒカリ」)"|awk -F, '{print $10","$13;}'|sed -e "s|\"||g"|sort -n >kome.csv
```

```
2002000101,2483
2002000202,2483
2002000303,2480
2002000404,2520
2002000505,2573
2002000606,2520
2002000707,2431
2002000808,2404
```

こんな感じで年月と値段の２列のcsvになりました。  
pythonのソースコードは以下の通り  

```
import matplotlib.pyplot as plt
import pandas as pd
from hampel import hampel


df = pd.read_csv('./kome.csv')
print(df)

     2002000101  2483
0    2002000202  2483
1    2002000303  2480
2    2002000404  2520
3    2002000505  2573
4    2002000606  2520
..          ...   ...
233  2021000707  2470
234  2021000808  2443
```

デリミタが「,」の時はdelimiter=";"みたく第２引数で指定する必要はないみたいです。  
csvの読み込み方はいろんなサイトに書かれているのですが、読み込んだcsvを操作する方法についてはすぐ出てこなかったので次回はpandasで読み込んだcsvを操作する方法を取り扱いと思います。  

