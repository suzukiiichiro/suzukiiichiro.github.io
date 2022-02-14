---
title: "e-Stat でGoogle Custom Search APIを使おう（２）"
description: "Google Custom Search APIで10件目以降の取得方法、newsなど検索対象の絞り込み方法について説明します。検索エンジンの設定にあるschema.orgを使用します。"
date: 2022-01-19T18:31:13+09:00
draft: false
image: anal.jpg
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## Google Custom Search API 10件目以降の取得方法について

「木材流通統計調査」をgoogleで検索してみると最初の方は、政府関係の木材流通統計調査の概要説明などが上位に並んでいる感じです。
そういったものからは木材流通統計調査の社会的関心がある項目を抽出することは難しそうです。
２０件目超えたあたりに以下の記事が来ました。

ビジネス特集 木材が消えた？身近に迫る “ウッドショック”
2021/06/01 — 【NHK】世界的に木材の価格が高騰している。 ... 農林水産省の「木材流通統計調査」によると、4月の「杉の丸太」の価格は去年の同じ月と比べて10％ ...
22/01/19 にこのページにアクセスしました。

ここから「丸太の価格」などの高騰が「ウッドショック」と呼ばれる社会的現象を起こしていることがわかります。

Google Custom Search APIは10件までしか結果を取得しないので、10件目以降の結果を取得する必要がありそうです。
眺めてみると50件くらい取得すれば良さそうです。

Google Custom Search APIの10件目以降を取得する方法はクエリのパラメータ startに開始位置を設定すれば良さそうです。
最大100件目まで取得できるみたいです（10件ずつなのでstartの値を変えて10回叩く必要がありますね）。

https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list

The index of the first result to return. The default number of results per page is 10, so &start=11 would start at the top of the second page of results. Note: The JSON API will never return more than 100 results, even if more than 100 documents match the query, so setting the sum of start + num to a number greater than 100 will produce an error. Also note that the maximum value for num is 10.

curlで叩くと以下の方法になります。

```
curl 'https://www.googleapis.com/customsearch/v1?key=xxxxxxxxxxxxxxxx&cx=xxxxxxxxxxxxxxxxx&q=木材流通統計調査&start=11'
```

## Google Custom Search API 検索対象をnewsだけに絞り込めないか

しかし、よくよく考えてみると社会的関心の高い項目を抽出しようと思ったらニュースなどに検索結果を絞り込んだほうが良い気がして来ました。
google検索結果のニュースタブをクリックして出て来た結果の方が使えそうです。

![ニュース](news.png "ニュース")

ニュースだと「ビジネス特集 木材が消えた？身近に迫る “ウッドショック”」が上位に来ていますし、以下のような興味深い記事もすぐ出て来ます。

ウッドショックはいつ収まるのか？ 住宅価格への影響は？ 木材価格高騰の直接原因と根本原因～時事解説

輸入材不足の余波で国産材の価格は春先から上昇を続けてきた。農林水産省の木材流通統計調査によると、9月の丸太価格は杉が前年同月比2.4倍、檜は2.9倍の水準だ。木材の使用量で差はあるが、住宅1棟につき少なくとも数十万円以上のコスト増が主に中小工務店らの経営に重くのしかかる。

Google Custom Search API でnewsだけに検索結果を絞り込む方法を調べてみました。
昔は、クエリにsearchType=image imgType=news をいれれば絞り込めていたみたですが試したところエラーになって現在は使用できなそうです。

googleの仕様書を見てもimgTypeに現在はnewsは指定できないみたいです。
https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list

## schema.org で絞り込む
現在は、検索エンジンの設定画面にある「schema.org」を使用して絞り込むみたいです。

https://cse.google.com/cse/

schema.orgで設定できる項目は非常に沢山あって何を設定するか迷います。

https://schema.org/docs/full.html

10個まで設定できるとのことで、とりあえずArticle,review,newsを文言に含むものにしてみました。

curlで叩く方法パラメータは今までと全く同じです。

```
curl 'https://www.googleapis.com/customsearch/v1?key=xxxxxxxxxxxxxxxx&cx=xxxxxxxxxxxxxxxxx&q=木材流通統計調査'
```

ウッドショック 林野庁・農林水産省作成資料 - 一般社団法人 宮城県
木質バイオマス発電のFITは両刃の剣だ（2ページ目） | コラム | 環境
【ウッドショック】木材価格の高騰は私たちにどう影響？ 住宅の
など取得したいコンテンツの絞り込みができました。

