---
title: "デザイナーでもできる初めてのHUGOでのサイト作成 #01"
date: 2021-12-22T13:07:49+09:00
draft: false
authors: wYoshi

description: "サーバーなどを用意するのが手間だなと思う人は、Hugo+GitHubで早く、簡単にサイトを作ってしまうのをオススメします。無料でhttps(SSL)も設定できます。"

categories:
  - programming
tags:
  - Hugo
  - Mac
  - brew
  - Designer
  - Develop
image: 2021-12-22-hugo-01.jpg
---
CMSではWordPressが有名ですが、phpやサーバの準備などに時間がかかってしまったり、ちょっと敷居が高いイメージではないでしょうか。
WordPressのインストールのためにはサーバも必要ですし、ドメインだって必要です。

色々用意するのが手間だなと思う人は、Hugo+GitHubで簡単に、早く、さっくりとサイトを作ってしまうのをオススメします。
無料で、httpsも設定できるので非常に便利です。

## HUGOとは
[HUGO](https://gohugo.io/)とはGo言語で記述され、速度や使いやすさ、設定のしやすさなどを重視して最適化された静的なHTMLやCSSのサイトジェネレーターです。コンテンツとテンプレートを分けて構築し、それらを組み合わせてHTMLをレンダリングします。

Hugoでブログを記述する際には「Markdown」と呼ばれる言語を使います。
サイトを公開、再構築する際には「hugo」というコマンドを使用します。
このコマンドはどのディレクトリからでも実行することができるので、特権アカウントを持っていない共有ホストやその他のシステムで使用することも可能です。

そして、中程度のサイズの典型的なWebサイトをほんの一瞬でレンダリングします。
経験則として、各コンテンツは約1ミリ秒でレンダリングされ、ブログやドキュメントなど、どのような種類のウェブサイトでもうまく動作するように設計されています。


### サポートされるアーキテクチャ
サポートされるアーキテクチャは2022年1月時点で、Windows、Linux、FreeBSD、NetBSD、DragonFly BSD、OpenBSD、macOS (Darwin)、 Android用にx64、i386、ARMアーキテクチャ用のHugoバイナリをビルド済みで提供しています。

HUGOは、Goコンパイラツールが実行できる場所であれば、ソースからコンパイルすることもできます。たとえば、Plan 9やSolarisを含む他のオペレーティングシステムにも対応しています。


## Hugoのインストール
HUGOをサイトジェネレーターとして使用する場合は、すごく簡単で、Hugoバイナリをインストールするだけで、バイナリには外部依存関係はありません。

### バイナリ（クロスプラットフォーム）
GitHubにある [Releases](https://github.com/gohugoio/hugo/releases) からプラットフォームに適したバージョンをダウンロードします。
ダウンロードしたバイナリはどこからでも実行可能です。
グローバルな場所にインストールする必要はなく、権限のないアカウントや共有ホストやその他のシステムでも動作します。

理想的には、 ```/usr/local/bin``` など使いやすいようにどこかにインストールする必要があります。


### Macでbrewを使う場合
macOSを使用していて、[Homebrew](https://brew.sh/index_ja "Homebrew")を使用している場合は、次のワンライナーを使用してHugoをインストールできます。
<small>※端末はMacで進めていきます。開発なども便利なのでMacを持っていると何かと便利ですよ。</small>
```bash
brew install hugo
```

### MacPortsの場合
macOSを使用していてMacPortsを使用している場合は、次のワンライナーを使用してHugoをインストールできます。
```bash
port install hugo
```

その他の端末でもコマンドを利用してダウンロード可能です。
詳しくは [Install Hugo](https://gohugo.io/getting-started/installing/) を見てみてください。

## 設定
HUGOはさまざまなコマンドラインの機能を備えていますが、コマンドラインに不慣れな場合でも簡単に使用できます。
以下は、Hugoプロジェクトの開発中に使用するもっとも一般的なコマンドの説明です。

### インストールの確認
Hugoをインストールしたら、PATHがあることを確認してください。```help```コマンドを使用して、Hugoが正しくインストールされていることをテストできます。
```bash
hugo help
```

実行すると、コンソールに表示される出力は次のようになるかと思います。
```bash
hugo is the main command, used to build your Hugo site.

Hugo is a Fast and Flexible Static Site Generator
built with love by spf13 and friends in Go.

Complete documentation is available at http://gohugo.io/.

Usage:
  hugo [flags]
  hugo [command]

Available Commands:
  check       Contains some verification checks
  completion  generate the autocompletion script for the specified shell
  config      Print the site configuration
  convert     Convert your content to different formats
  deploy      Deploy your site to a Cloud provider.
  env         Print Hugo version and environment info
  gen         A collection of several useful generators.
  help        Help about any command
  import      Import your site from others.
  list        Listing out various types of content
  mod         Various Hugo Modules helpers.
  new         Create new content for your site
  server      A high performance webserver
  version     Print the version number of Hugo

Flags:
  -b, --baseURL string             hostname (and path) to the root, e.g. http://spf13.com/
  -D, --buildDrafts                include content marked as draft
  -E, --buildExpired               include expired content
  -F, --buildFuture                include content with publishdate in the future
      --cacheDir string            filesystem path to cache directory. Defaults: $TMPDIR/hugo_cache/
      --cleanDestinationDir        remove files from destination not found in static directories
      --config string              config file (default is path/config.yaml|json|toml)
      --configDir string           config dir (default "config")
  -c, --contentDir string          filesystem path to content directory
      --debug                      debug output
  -d, --destination string         filesystem path to write files to
      --disableKinds strings       disable different kind of pages (home, RSS etc.)
      --enableGitInfo              add Git revision, date and author info to the pages
  -e, --environment string         build environment
      --forceSyncStatic            copy all files when static is changed.
      --gc                         enable to run some cleanup tasks (remove unused cache files) after the build
  -h, --help                       help for hugo
      --i18n-warnings              print missing translations
      --ignoreCache                ignores the cache directory
      --ignoreVendor               ignores any _vendor directory
      --ignoreVendorPaths string   ignores any _vendor for module paths matching the given Glob pattern
  -l, --layoutDir string           filesystem path to layout directory
      --log                        enable Logging
      --logFile string             log File path (if set, logging enabled automatically)
      --minify                     minify any supported output format (HTML, XML etc.)
      --noChmod                    don't sync permission mode of files
      --noTimes                    don't sync modification time of files
      --path-warnings              print warnings on duplicate target paths etc.
      --poll string                set this to a poll interval, e.g --poll 700ms, to use a poll based approach to watch for file system changes
      --print-mem                  print memory usage to screen at intervals
      --quiet                      build in quiet mode
      --renderToMemory             render to memory (only useful for benchmark testing)
  -s, --source string              filesystem path to read files relative from
      --templateMetrics            display metrics about template executions
      --templateMetricsHints       calculate some improvement hints when combined with --templateMetrics
  -t, --theme strings              themes to use (located in /themes/THEMENAME/)
      --themesDir string           filesystem path to themes directory
      --trace file                 write trace to file (not useful in general)
  -v, --verbose                    verbose output
      --verboseLog                 verbose logging
  -w, --watch                      watch filesystem for changes and recreate as needed

Use "hugo [command] --help" for more information about a command.
```

### hugoコマンド
一般的な使い方は、カレント・ディレクトリを入力ディレクトリとしてhugoを実行することだと思います。
デフォルトでpublic/ ディレクトリにウェブサイトを生成しますが、サイトの設定（configファイル）でpublishDirフィールドを変更することにより、出力ディレクトリをカスタマイズできます。

hugoコマンドはサイトをpublic/ディレクトリにレンダリングし、ウェブサーバにデプロイする準備ができます。

```
$ hugo
0 draft content
0 future content
99 pages created
0 paginator pages created
16 tags created
0 groups created
in 90 ms
```

## 使ってみる
hugoのインストールが終わったら、サイトを作成します。
```
hugo new site ＜作成するディレクトリ＞
```
色々表示されているかと思いますが、気にしないで大丈夫です。

### 設定ファイル
hugoの設定はTOMLという形式で記述します。
TOMLに慣れていない人はJSONやYAMLといった形式でも記述できます。
その場合はconfig.tomlを削除してください。
```
baseURL = "http://example.org/"
languageCode = "en-us"
title = "My New Hugo Site"
```
- baseURL: サイトの公開URL
- languageCode: HTMLのlang部分
- title: サイトの名前

## 記事の投稿
記事を作成するにはコマンドを打つ必要があります
```
hugo new posts/helloworld.md
```

このコマンドで、postsディレクトリ以下にhelloworld.mdといったファイルが生成されます
テーマによってはpostsディレクトリではなく、postであったりするので、テーマの詳細を確認してください。

## 下書きから公開へ
作成されたファイルはmarkdown形式で記述されています。
```
---
title: "helloworld"
date: 2021-12-22T11:23:09Z
draft: true
---
```

draftの部分が下書き状態を表しています。
falseにすることで公開となり表示されます。

### HUGOでの下書き、未来、期限切れについて
Hugoでは、コンテンツの記述時にドラフト、公開日、そして有効期限を設定できます。デフォルトでは、Hugoは公開（draft: true）しません。

また、以下の場合はコンテンツを公開しないので、注意してください
- publishdateが将来の公開日を指定したコンテンツ
- draft: trueのステータスを持つコンテンツ
- 有効期限（expirydate）を過ぎたコンテンツ

{{% tips-list tips %}}
予約投稿
: 公開日付（**publishdate**）が未来で、公開状態にある記事は予約投稿として扱われます。
{{% /tips-list %}}

{{% tips-list tips %}}
有効期限付き
: **expirydate** に日付を指定することで、記事の有効期限を設定することも可能です。
{{% /tips-list %}}

## 確認
サイトの確認を行うには
hugoをインストールしたディレクトリで
```
hugo server
```
を実行します。
この場合は公開されている記事のみを表示した状態のサーバが立ち上がります。
未公開も含めたい場合は
```
hugo server -D
```
とすることで表示できます。

## 公開
公開をするにはサイト全体を構築し直す必要があります。
```
hugo
```
このコマンドでサイト全体が自動的に生成されます。
作成されたサイトは初期状態ではpublicディレクトリに展開されます。
configの*publicDir*に任意のディレクトリを設定することも可能です
```
publicDir = 'docs'
```
この場合はdocsディレクトリに公開ファイルが展開されます。


## 終わりに
駆け足でしたが、hugoの簡単な使い方になります。
大きな設定も不要で、markdownで記述できるので初心者やデザイナーなどでもとっつきやすいのではないかと思います。
みなさんもぜひ、hugoを試してみてください。

## オススメの書籍
{{% amazon title=" Hugoで始める静的サイト構築入門　静的サイトジェネレーターで作る自作サイト (技術の泉シリーズ（NextPublishing）) " url="https://www.amazon.co.jp/Hugoで始める静的サイト構築入門-静的サイトジェネレーターで作る自作サイト-技術の泉シリーズ（NextPublishing）-meganii/dp/4844379208/?tag=nlpqueens09-22" summary=` 本書は静的サイトジェネレーターの一つであるHugoの解説書です。できるだけ低コストでサイトを運用したい、WordPressなどの各種CMSから移行したい、というケースに合わせて構築方法などを解説します。Hugoを利用してオリジナリティーのあるサイトを自分で構築、管理したい方に向けての一冊です。 ` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51DRDYXF0CL.jpg" %}}

{{% amazon title=" 【特典付き! 】Webサイト高速化のための 静的サイトジェネレーター活用入門 (Compass Booksシリーズ) " url="https://www.amazon.co.jp/【特典付き-】Webサイト高速化のための-静的サイトジェネレーター活用入門-Compass-Booksシリーズ/dp/4839973008/?tag=nlpqueens09-22" summary=` GatsbyJSで実現する、高速&実用的なサイト構築 「高速化&最適化」「メタデータ対応」「SPAやPWAへの対応」など、これからのWebサイトに求められる要素に対応するための、静的サイトジェネレーターの活用書。 本書は「GatsbyJS(Gatsby)」を使って、「ReactやJavaScript(ECMAScript)に自信が無くても、実用レベルのWebサイトを構築できるようになる」ことを目標にしています。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51vWxSWEAxL.jpg" %}}

{{% amazon title=" Markdownライティング入門　プレーンテキストで気楽に書こう！ (技術の泉シリーズ（NextPublishing）) " url="https://www.amazon.co.jp/Markdownライティング入門-プレーンテキストで気楽に書こう！-技術の泉シリーズ（NextPublishing）-藤原-惟/dp/4844398369/?tag=nlpqueens09-22" summary=`本書は、文章を書く=ライティングを「気楽に」行うための道具としての「Markdown」形式を紹介し、その使い方を詳しく解説しています。Wordなどのワープロソフトに限定されることなく、テキストエディタやMarkdown専用エディタ、ポメラなどの文書入力専用機、さらにはスマートホン上でも「見出し」や「強調」といった文章執筆に必要な情報を共有するための書式であるMarkdownの書き方やその定義や起源を、初心者でもわかりやすく紹介しています。 ` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/514KHlwilvL.jpg" %}}


