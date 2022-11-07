---
title: "e-Stat でGoogle Custom Search APIを使おう（１）"
description: "2022年1月時点でのGoogle Custom Search APIの設定方法を説明します。APIキーの作成、検索エンジンIDの取得が中心です。"
date: 2022-01-19T00:31:13+09:00
draft: false
image: anal.jpg
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## 統計名でgoogle検索して関心度の高いキーワードを抽出しよう
e-Statの解析の目標として、膨大な統計データの中から一般の人に関心度の高いものを抽出してデータを要約したいと考えています。  
google検索で上位にくるものは関心度が高いと言えるでしょうから統計名でgoogle検索して関心度の高いキーワードを抽出したいと思います。  
google検索を自動でするためにGoogle Custom Search APIを使います。  
Google Custom Search API は１日１００回までは無料で、それ以上だと１０００回につき５ドル課金されるみたいです。  
https://developers.google.com/custom-search/v1/overview#pricing  
１日に発表される統計は10個いかないくらいなので無料の範囲で使えそうです。  
Google Custom Search APIを使ってみましょう。  

## Google Custom Search API を使えるように設定する（2022年1月時点)
以下の手順で設定します。  
・googleアカウントを取得する  
gmailのメールアドレスです。  
・Google Cloud Platformでクレジットカード情報を登録する  
https://console.cloud.google.com/billing/create?hl=ja  
・プロジェクトを作成する  
https://console.cloud.google.com/projectcreate  
・認証情報を作成する  
https://console.cloud.google.com/apis/credentials  
「+認証情報を作成」をクリックして「APIキー」を選択すると  
APIキーが作成されますのでコピーしておきましょう  
・APIキーの利用制限  
キーの制限をクリックしてAPIキーの利用を制限しておきましょう  
接続元が固定のIPアドレスを持っているなら「アプリケーションの制限」でIPアドレスを設定しましょう。  
APIの制限もとりあえすCustom Search API １個にしときます。  
保存ボタンをクリックします  
・Custom Search API を有効にする  

```
https://console.cloud.google.com/apis/library/customsearch.googleapis.com  
```

「有効にする」ボタンをクリックします。  
・検索エンジンIDの取得  
https://cse.google.com/create/new  
検索するサイトは「www.google.co.jp（後で削除するので適当で良いです）」  
言語は「日本語」  
検索エンジンの名前は適当で良いです。  
左側の設定ボタンを押すと画面中央中段に「検索エンジンID」があるのでコピーします。  
検索するサイトをで「www.google.co.jp」を「削除」します  
「ウェブ全体を検索」を「オン」にします  

## CurlでGoogle Custom Search API検索する
試しに検索してみましょう。  
curlを利用します。  
curlでAPIキー、検索エンジンID、キーワードを指定して検索します。  

```
$ curl 'https://www.googleapis.com/customsearch/v1?key=google apiキー&cx=検索エンジン  ID&q=検索キーワード'  
```

「木材流通統計調査」で検索してみました。  

```
$ curl 'https://www.googleapis.com/customsearch/v1?key=google apiキー&cx=検索エンジンID&q=木材流通統計調査'  
```

結果はjsonで返ってきます。  
見た感じ、ブラウザのgoogle検索の結果と同じ感じなので良さそうですね。  

```
 "items": [
    {
      "kind": "customsearch#result",
      "title": "木材流通統計調査：農林水産省",
      "htmlTitle": "\u003cb\u003e木材流通統計調査\u003c/b\u003e：農林水産省",
      "link": "https://www.maff.go.jp/j/tokei/kouhyou/mokuryu/",
      "displayLink": "www.maff.go.jp",
      "snippet": "木材流通構造調査, 木材の販売金額、素材及び材料の入荷先別入荷量、製材品、合板及び集成材の出荷先別出荷量、製材用、合単板及び木材チップ製造用機械の所有状況、 ...",
      "htmlSnippet": "\u003cb\u003e木材流通\u003c/b\u003e構造\u003cb\u003e調査\u003c/b\u003e, \u003cb\u003e木材\u003c/b\u003eの販売金額、素材及び材料の入荷先別入荷量、製材品、合板及び集成材の出荷先別出荷量、製材用、合単板及び\u003cb\u003e木材\u003c/b\u003eチップ製造用機械の所有状況、&nbsp;...",
      "cacheId": "cMExMff56bgJ",
      "formattedUrl": "https://www.maff.go.jp/j/tokei/kouhyou/mokuryu/",
      "htmlFormattedUrl": "https://www.maff.go.jp/j/tokei/kouhyou/mokuryu/",
      "pagemap": {
        "cse_thumbnail": [
          {
            "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSmlCF9ltcQbjL9DAnpZfJIotIT2ej4cd_YfBfs5ew-v2FR_NxjLAGdFTTI",
            "width": "200",
            "height": "200"
          }
        ],
        "metatags": [
          {
            "viewport": "width=device-width, initial-scale=1",
            "format-detection": "telephone=no"
          }
        ],
        "cse_image": [
          {
            "src": "https://www.maff.go.jp/j/shared_new/shared/images/icon_pnavi@2x.png"
          }
        ]
      }
    },
```
    
 ![検索結果](search.png "検索結果")


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










