---
title: "HUGOでxmlやjsonファイルを複数出力する方法を詳しく解説"
date: 2022-01-26T14:37:51+09:00
draft: false

description: "Hugoで複数のファイルを出力する方法は？この方法の出力やファイル形式を変えることで、RSSやJSON、AMPなどの形式も出力可能になります。
"

authors: wYoshi
image: catch.jpg

categories:
  - web
tags:
  - Designer
  - Develop
  - wyoshi
  - HTML
  - CSS
  - Web designer
  - Front engineer
  - Corder
  - Hugo
---
HUGOは非常に強力な静的HTMLジェネレーターです。
複数のXMLを設置する機会があり、どうやったら設置できるのかなと悪戦苦闘しながら実装できましたので、そのやり方を共有します。

今回は sitemap.xml を複数設置する必要があったため、その方法になります。
この方法の出力やファイル形式を変えることで、RSSやJSON、AMPなどの形式も出力できるようになると思います。

## config に設定を追加する
まずは ```config.yaml``` に出力用の設定をします。
設定の内容は下記のようになります。

私は yaml 形式の設定ファイルを使っているのですが、toml や json 形式の設定ファイルを使っている方は、[ HUGO のページ](https://gohugo.io/templates/output-formats/)を見ながらそれぞれにあった記述にしてください。

```yaml
mediaTypes:
    application/xml:
        suffixes: xml

outputFormats:
    Sitemap:
        MediaType: application/xml
        baseName: "google_sitemap"
        noUgly: true

outputs:
    home: [HTML, Sitemap, RSS]

```

上から順に説明します。


## 出力ファイルの形式
```yaml
mediaTypes:
    application/xml:
        suffixes: xml
```
ここでは出力したい形式を選択してます。今回は、xmlのタイプを選んでます。
ちなみに、この部分は記述しないでも問題がない部分です。
私の環境では出力した場合に、エラーにならずに正常にファイルが出力されました。

```suffixes```の部分では複数の形式を記述することが可能です。
例えば、rss+xmlの場合は
```yaml
mediaTypes:
    application/rss+xml:
        suffixes:
          - xml
          - rss
```
となります。

## 出力ファイルの種類
次に、outputFormats部分ですが、この部分が出力の際に重要になってきます。
今回はサイトマップ形式で出力するので、下記のようにしました。

```yaml
outputFormats:
    Sitemap:
        MediaType: application/xml
        baseName: "google_sitemap"
        noUgly: true
```

上の yaml を説明すると、
Sitemap 形式で MediaTypeはサイトマップを表す```application/xml```を使用して、```google_sitemap```というファイル名のXMLを出力します。

#### 出力の形式
出力形式のオプションは以下のようになります。

{{% tips-list info %}}
1つのページに多くの出力形式で出力可能
: 1つのページを好きなだけ多くの出力形式で出力することができ、ファイルシステム上の一意なパスに解決する限り、無限に出力形式を定義することができるのです。<br>表では、AMPとHTMLの比較が最も良い例です。AMPはHTML版を上書きしないようにPathにampという値を持っています。<br>例えば、/index.htmlと/amp/index.htmlの両方を持つことができるようになりました。
{{% /tips-list %}}

{{% tips-list info %}}
MediaTypeはは既存のもののみ
: MediaTypeは、既に定義されているメディアタイプのTypeと一致する必要があります。
{{% /tips-list %}}

{{% tips-list info %}}
再定義可能
: 新しい出力形式を定義したり、組み込みの出力形式を再定義することができます。<br>例えば、AMPページを別のパスに配置したい場合などです。
{{% /tips-list %}}

出力フォーマットを追加または変更するには、サイトの設定ファイルのoutputFormatsセクションで、すべてのサイトまたは特定の言語について定義します。


<div style="line-height: 1.1; word-break: break-word; font-size: 0.8em;">

| name | mediaType | path | baseName | rel | protocol | isPlainText | isHTML | noUgly | permalinkable |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|HTML | text/html | | index | canonical | | false | true | false | true |
|AMP | text/html | amp | index | amphtml | | false | true | false | true |
|CSS | text/css | | styles | stylesheet | | true | false | false | false |
|CSV | text/csv | | index | alternate | | true | false | false | false |
|Calendar | text/calendar | | index | alternate | webcal:// | true | false | false | false |
|JSON | application/json | | index | alternate | | true | false | false | false |
|ROBOTS | text/plain | | robots | alternate | | true | false | false | false |
|RSS | application/rss+xml | | index | alternate | | false | false | true | false |
|Sitemap | application/xml | | sitemap | sitemap | | false | false | true | false |
|WebAppManifest | application/manifest+json | | manifest | manifest | | true | false | false | false |

</div>

#### 出力形式を設定する
以下は、出力形式に関する設定オプションの全リストとそのデフォルト値になります。

name
: 出力形式の識別子です。これは、ページに必要な出力形式を定義するために使用されます。

mediaType
: 定義されたメディアタイプのTypeと一致しなければなりません。

path
: 出力ファイルを保存するサブパス。

baseName
: ファイル名です。デフォルトはindex。

rel
: リンクタグのrel値を作成するために使用します。デフォルトはalternate。

protocol
: この出力形式に対して、baseURL の "http://" または "https://" を置き換えます。

isPlainText
: テンプレートにGoのプレーンテキストテンプレートパーサーを使用します。デフォルト: false。

isHTML
: HTMLタイプのフォーマットにのみ関連する状況で使用されます; 例えば、ページのエイリアスなどです。

noUgly
: uglyURLs がサイト内で true に設定されている場合、醜い URL をオフにするために使用されます。デフォルト：false

notAlternative
: このフォーマットをPageのAlternativeOutputFormatsフォーマットのリストに含めることが意味をなさない場合（例えば、CSSなど）有効にします。<br>注意点として、必ずしも他のフォーマットを置き換えるわけではないので、ここではalternateではなくalternativeという用語を使っています。デフォルト：false

permalinkable
: .Permalink と .RelPermalink が main ではなくレンダリング出力形式を返すようにしました。これは、HTMLとAMPでデフォルトで有効になっています。デフォルト：false

weight
: 0 以外の値を設定すると、最初のソート条件として使用されます。

## 出力するページを選択
最後に出力するページに関してです。
```yaml
outputs:
    home: [HTML, Sitemap, RSS]
```
この部分はどのページで出力するかを選択できます。
今回はサイトマップを作成したいので、ドキュメントルートに当たる home (/index.html) 部分でのみの出力としてます。
HTML形式と、Sitemap、RSSを出力するようにしてます。HTMLでは index.html を出力し、RSSでは index.xml のRSS形式のフィードを出力してます。そして、今回追加したSitemapでサイトマップ形式のファイルを出力するようにしました。

各ページの初期状態での出力は下記を参考にしてください。
|page | HTML |
|---|---|
|home | HTML, RSS|
|section | HTML, RSS|
|taxonomy | HTML, RSS|
|term | HTML, RSS|


## テンプレートファイルを追加する
設定が終わったので、次はテンプレートファイルを設置します。
サイトマップ用のテンプレートを作成して、```layouts/_default```ディレクトリに配置します。
ここが一番のポイントで、配置する際のファイル名は **[page].[outputFormatsの名前].[suffixe]** となります。
つまり、今回でいうと **home.sitemap.xml** となります。

ただし、pageの場合は下記のようにmarkdownに埋め込んで出力します。
```markdown:page/search.md
---
title: "Search"
layout: "search"
outputs:
    - html
    - json
---
```
これによって、```layouts/page/search.html``` と ```layouts/page/search.json``` ファイルを使用して出力ファイルを作成します。


## おすすめの書籍
{{% amazon title=" Markdownライティング入門　プレーンテキストで気楽に書こう！ (技術の泉シリーズ（NextPublishing）) " url="https://www.amazon.co.jp/Markdownライティング入門-プレーンテキストで気楽に書こう！-技術の泉シリーズ（NextPublishing）-藤原-惟/dp/4844398369/?tag=nlpqueens09-22" summary=` 【プレーンテキストでらくらくライティング! Markdownを使いこなそう! 】 本書は、文章を書く=ライティングを「気楽に」行うための道具としての「Markdown」形式を紹介し、その使い方を詳しく解説しています。Wordなどのワープロソフトに限定されることなく、テキストエディタやMarkdown専用エディタ、ポメラなどの文書入力専用機、さらにはスマートホン上でも「見出し」や「強調」といった文章執筆に必要な情報を共有するための書式であるMarkdownの書き方やその定義や起源を、初心者でもわかりやすく紹介しています。 〈本書の対象読者〉 執筆のストレスを減らして集中したい人 PCが古くて軽いアプリで執筆したい人 いろいろなアプリで原稿を使いまわしたい人 思いついた時にスマホでメモ書きして原稿にまとめたい人 続きを読む 。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/514KHlwilvL.jpg" %}}

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










