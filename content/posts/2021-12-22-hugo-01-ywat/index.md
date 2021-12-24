---
title: "デザイナーでもできる初めてのHugo #01"
date: 2021-12-22T13:07:49+09:00
draft: false
categories:
  - プログラミング
tags:
  - hugo
  - Mac
  - brew
  - プログラム
  - デザイナー
  - 開発
image: 2021-12-22-hugo-01.jpg
---
CMSではWordpressが有名ですが、phpやサーバの準備などに時間がかかってしまったり、ちょっと敷居が高いイメージがあります。
Wordpressのインストールのためにはサーバも必要ですし、ドメインだって必要です。
色々用意するのが手間だなと思う人にはHugo+GitHubでさっくりサイトを作るのがおすすめです。
無料で、httpsも設定できるので非常に便利です。


## Hugoのインストール
Hugoを使うためにはhugoをインストールする必要があります。
インストールは簡単です。

<small>※端末はMacで進めていきます。開発なども便利なのでMacを持っていると何かと便利ですよ。</small>


[Homebrew](https://brew.sh/index_ja "Homebrew") が必要になります。
```
brew install hugo
```

## 設定
hugoのインストールが終わったら、サイトを作成します。
```
hugo new site ＜作成するディレクトリ＞
```
色々表示されているかと思いますが、気にしないで大丈夫です。

### 設定ファイル
hugoの設定はTOMLという形式で記述します。
TOMLに慣れていない人はJSONやYAMLといった形式でも記述できます。
その場合はconfig.tomlを削除して下さい。
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
テーマによってはpostsディレクトリではなく、postであったりするので、テーマの詳細を確認して下さい。

## 下書きから公開へ
作成されたファイルはmarkdown形式で記述されています。
```
---
title: "helloworld"
date: 2021-12-22T11:23:09Z
draft: true
---
```

draft の部分が下書き状態を表しています。
trueにすることで公開となり表示されます。

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
みなさんもぜひ、hugoを試してみて下さい。