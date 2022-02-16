---
title: "SCSS/CSSを含んだファイルがGitHubActionsでビルドできない"
date: 2021-12-24T09:43:41+09:00
draft: false
authors: wYoshi

description: "Hugoでscssやsassを含んだファイルをGitHubに公開し、Git Actionで自動ビルドしようとした際にエラーが出た場合の対処法を解説しています。"

categories:
  - programming
tags:
  - Hugo
  - Error
  - GitHub
  - css
image: af7ef3c0-44c1-4f2f-aad8-1a0664724558.jpg
---
scssやsassを使ってcssを記述すると、CSSを構造化できてサイトのメンテナンス性が格段に上がります。
GitHub Pagesで公開しているHugoを使ったサイトscss、sassには対応することが可能なので、sassを導入することはメリットがあります。

ところが、Hugoでscssやsassを含んだファイルをGitHubに公開して、Git Actionで自動ビルドしようとした際に見慣れないエラーが表示されました。

```
Run hugo --minify
Error: Error building site: TOCSS:
failed to transform "scss/style.scss" (text/x-scss).
Check your Hugo installation;
you need the extended version to build SCSS/SASS.
: this feature is not available in your current Hugo version,
see https://goo.gl/YMrWcn for more information
...
Total in 148 ms
Error: Process completed with exit code 255.
```

なにか悪いことでもしたのでしょうか。
それとも変な記述をしてしまったのだろうかとか思うところです。

## エラーの内容
こういうときは、落ち着いてエラーを見てみましょう。
大抵のことはちゃんと教えてくれているはずです。

今回のエラーは下記のような内容になります。
```
Check your Hugo installation; you need the extended version
```
「Hugoのインストールを確認してください。extendedバージョンが必要です。」と記述されていおります。
それではこのエラーに表示されている```extended```とは一体何なのでしょうか。

## エラーの対応
さらに落ち着いて設定ファイルを確認していくことにしましょう。
読み進めていくとどうやらworkflowの設定ファイルにヒントがありそうです。
.github/workflow/gh-pages.yml
```yaml
- name: Setup
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: '0.87.0'
    #extended: true
```
.github/workflow/の設定ファイル確認したところ、原因がわかりました。
設定の```extended```が思いっきりコメントアウトされていることが原因でした。

通常のHugoではscss/cssを使用することができません。そうした場合に、Hugo ExtendedをインストールしてHugo自体の機能を拡張してscss/cssを使えるようにするのですが、今回はscssを使っていたにもかかわらず、Hugo Extendedをインストールしていないため発生していたエラーでした。

コメントを外して、再度Gitにpushしたところ、正常にビルドされて公開できました。

## まとめ
scssやsassを含んだファイルをhugoをgitに公開しようとした際に、ビルドできない場合は設定を確認することをオススメします。
とくに、scssを使用する際は**Hugo Extended**のインストールが必要と[公式](https://gohugo.io/getting-started/installing/)にも書いているので、忘れずに設定しましょう。