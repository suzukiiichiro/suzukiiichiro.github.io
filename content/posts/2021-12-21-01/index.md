---
title: "Hugoで記事を投稿してみよう！Hugoでの記事投稿の仕方。"
date: 2021-12-21T18:08:57+09:00
draft: false
description: "hugoで記事を作成して、投稿するためには専用のコマンドを使ってファイルを作成するか、postsなどのディレクトリにmarkdownの.mdファイルを設置する必要があります。今回はhugoでの記事の投稿の仕方を説明いたします。"
image: 2021-12-21-1.jpg
authors: wyoshi
categories:
  - web
tags:
  - Hugo
  - Web
  - wyoshi
# ファイル名を変える場合
# slug: "example-post"
---

## 記事を投稿する
hugoで記事を作成して、投稿するためには専用のコマンドを使ってファイルを作成するか、postsなどのディレクトリにmarkdownの.mdファイルを設置する必要があります。
今回はhugoでの記事の投稿の仕方を説明いたします。

## hugo newで記事を投稿
HUGOで記事を投稿するには、専用のコマンド ```hugo new``` を使う必要があります。

このコマンドを実行すると、提供されたパスに基づいて作成するファイルの種類を推測し、新しいコンテンツファイルを作成して日付とタイトルを自動的に設定します。

```-k KIND``` で種類を指定することもできます。

テーマまたはサイトでアーキタイプが提供されている場合は、それらが使用されます。
これは、サイトのルートディレクトリ内で実行してください。

```
hugo new [path] [flags]
```

postsというディレクトリにファイルを作成する場合は以下のようになります。
```shell
$ hugo new posts/[ファイル名].md
```
このファイルを開いてみてみると、
```markdown
---
title: "Test"
date: [作成日時]
draft: true
---

```
このようなファイルが作成されているかと思います。ファイルの中身の構成は下記のようになります。

- title: 記事のタイトル
- date: 記事の作成日
- draft: 下書きかどうか

`draft: false` にする事でドラフトを公開にすることができる

上記のような作成ファイルの他に、HUGOにはさまざまな情報を **Params** として付与することが可能です
新規作成した際にできるファイルの初期値を変えたい場合はどうしたらいいでしょうか？

## hugo newをカスタマイズする
```hugo new``` した際にできるファイルの初期値を変えるには、

- archetypes/posts.md
- archetypes/default.md

などのファイルを修正してやることで可能です。

実際にファイルを見てみると初期状態では下記のようになっていました。
```markdown:archetypes/default.md
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
---


```

ではここに、画像やカテゴリのフィールドを追加してみましょう。
さきほどのを開いて、編集します。
今回はキャッチ画像とカテゴリを追加するので、imageとcategoriesを追加します。
```markdown:archetypes/default.md
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true

image: ""
categories:
  - カテゴリ名
---
```
この状態でファイルを保存して、```hugo new``` で新規作成して見ましょう。
すると、初期状態のファイルではなかったimageとcategoriesの項目が追加されているかと思います。
さらに、categoriesには「カテゴリ名」というカテゴリも反映されているかと思います。このように、初期値を調整することが可能なのです。

これを応用すると、初期状態を**下書き**ではなく、**公開**状態でファイルを新規作成することも可能です。


## 公開用ビルドする
さて、記事がかけたところで、サイトを公開しようといたしましょう。

残念なことに、hugoで作成したファイルはmarkdown形式であるために、そのままではwebページに公開できません。
作成したファイルを静的HTMLとして書き出し、ビルド（構築）する必要があるのです。
ビルドは一瞬で終わってしまうのがhugoのすごいところです。

hugoで作成したファイルをビルドするためのコマンドが以下になります。
```shell
$ hugo
```

上記のコマンドを実行することで、```public```ディレクトリにHTMファイルが生成されます。
実行した際に、サイトの情報も表示されているので、合わせて確認するとなにか新しい発見があるかもしれません。

```
Start building sites …
hugo v0.91.0+extended darwin/amd64 BuildDate=unknown
                   | JA
-------------------+------
  Pages            | 185
  Paginator pages  |  42
  Non-page files   | 205
  Static files     |   9
  Processed images | 620
  Aliases          |  56
  Sitemaps         |   1
  Cleaned          |   0

Total in 981 ms
```


さて、publicディレクトリのファイルをサーバにアップすることでサイトが公開できるということになります。


## オススメの書籍
{{% amazon title=" Markdownライティング入門　プレーンテキストで気楽に書こう！ (技術の泉シリーズ（NextPublishing）) " url="https://www.amazon.co.jp/Markdownライティング入門-プレーンテキストで気楽に書こう！-技術の泉シリーズ（NextPublishing）-藤原-惟/dp/4844398369/?tag=nlpqueens09-22" summary=` 【プレーンテキストでらくらくライティング! Markdownを使いこなそう! 】 本書は、文章を書く=ライティングを「気楽に」行うための道具としての「Markdown」形式を紹介し、その使い方を詳しく解説しています。Wordなどのワープロソフトに限定されることなく、テキストエディタやMarkdown専用エディタ、ポメラなどの文書入力専用機、さらにはスマートホン上でも「見出し」や「強調」といった文章執筆に必要な情報を共有するための書式であるMarkdownの書き方やその定義や起源を、初心者でもわかりやすく紹介しています。 〈本書の対象読者〉 執筆のストレスを減らして集中したい人 PCが古くて軽いアプリで執筆したい人 いろいろなアプリで原稿を使いまわしたい人 思いついた時にスマホでメモ書きして原稿にまとめたい人 続きを読む 。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/514KHlwilvL.jpg" %}}





