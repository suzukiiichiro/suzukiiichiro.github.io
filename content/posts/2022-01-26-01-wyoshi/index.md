---
title: "HUGOでxmlやファイルを複数出力する方法"
date: 2022-01-26T14:37:51+09:00
draft: false

description: "Hugoで複数のファイルを出力する方法は？この方法の出力やファイル形式を変えることで、RSSやJSON、AMPなどの形式も出力可能になります。
"

authors: wYoshi
image: catch.jpg

categories:
  - web
tags:
  - プログラム
  - デザイナー
  - 開発
  - web
  - wyoshi
  - HTML
  - CSS
  - Webデザイナー
  - フロントエンジニア
  - コーダー
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
{{% amazon title=" Markdownライティング入門　プレーンテキストで気楽に書こう！ (技術の泉シリーズ（NextPublishing）) " url="https://www.amazon.co.jp/Markdownライティング入門-プレーンテキストで気楽に書こう！-技術の泉シリーズ（NextPublishing）-藤原-惟/dp/4844398369/?tag=nlpqueens-22" summary=` 【プレーンテキストでらくらくライティング! Markdownを使いこなそう! 】 本書は、文章を書く=ライティングを「気楽に」行うための道具としての「Markdown」形式を紹介し、その使い方を詳しく解説しています。Wordなどのワープロソフトに限定されることなく、テキストエディタやMarkdown専用エディタ、ポメラなどの文書入力専用機、さらにはスマートホン上でも「見出し」や「強調」といった文章執筆に必要な情報を共有するための書式であるMarkdownの書き方やその定義や起源を、初心者でもわかりやすく紹介しています。 〈本書の対象読者〉 執筆のストレスを減らして集中したい人 PCが古くて軽いアプリで執筆したい人 いろいろなアプリで原稿を使いまわしたい人 思いついた時にスマホでメモ書きして原稿にまとめたい人 続きを読む 。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/514KHlwilvL.jpg" %}}
