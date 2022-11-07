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


## 書籍の紹介
{{% amazon

title="UNIXという考え方―その設計思想と哲学 単行本 – 2001/2/23"
url="https://www.amazon.co.jp/UNIX%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9%25E2%2580%2595%25E3%2581%259D%25E3%2581%25AE%25E8%25A8%25AD%25E8%25A8%2588%25E6%2580%259D%25E6%2583%25B3%25E3%2581%25A8%25E5%2593%25B2%25E5%25AD%25A6-Mike-Gancarz/dp/4274064069/ref=sr_1_1?keywords=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9&amp;qid=1667786898&amp;qu=eyJxc2MiOiIxLjEwIiwicXNhIjoiMC4zOSIsInFzcCI6IjAuMzEifQ%253D%253D&amp;sprefix=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%252Caps%252C257&amp;sr=8-1&_encoding=UTF8&tag=nlpqueens09-22&linkCode=ur2&linkId=0249eb4cab50d700fb6949eb9aeafef1&camp=247&creative=1211"
imageUrl="https://m.media-amazon.com/images/I/518ME653H3L._SX330_BO1,204,203,200_.jpg"
summary=`   UNIX系のOSは世界で広く使われている。UNIX、Linux、FreeBSD、Solarisなど、商用、非商用を問わず最も普及したOSのひとつであろう。そしてこのOSは30年にわたって使用され続けているものでもある。なぜこれほど長い間使われてきたのか？ その秘密はUNIXに込められた数々の哲学や思想が握っている。
   そもそもUNIXはMulticsという巨大なOSの開発から生まれたものだ。あまりに巨大なMulticsはその複雑さゆえに開発は遅々として進まず、その反省からケン・トンプソンが作ったのがUNIXの初めとされる。その後デニス・リッチーら多数の開発者が携わり、UNIXは発展した。本書はこのUNIXに込められた「思想と哲学」を抽出し、数々のエピソードとともにUNIXの特徴を浮き彫りにしていく。

   たとえば本書で述べられているUNIXの発想のひとつとして「過度の対話式インタフェースを避ける」というものがある。UNIXのシステムは初心者には「不親切」なつくり、つまり親切な対話式のインタフェースはほとんどなく、ユーザーがコマンドを実行しようとするときはオプションをつける形をとっている。この形式はオプションをいちいち覚えねばならず、初心者に決してやさしくない。しかしこれはプログラムを小さく単純なものにし、他のプログラムとの結合性を高くする。そして結果としてUNIXのスケーラビリティと移植性の高さを支えることになっているのだ。このような形式で本書では9つの定理と10の小定理を掲げ、UNIXが何を重視し、何を犠牲にしてきたのかを明快に解説している。

   最終章にはMS-DOSなどほかのOSの思想も紹介されている。UNIXの思想が他のOSとどう違うかをはっきり知ることになるだろう。UNIXの本質を理解するうえで、UNIX信者もUNIX初心者にとっても有用な1冊だ。（斎藤牧人）`
%}}

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










