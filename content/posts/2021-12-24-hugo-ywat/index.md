---
title: "SCSS/CSSを含んだファイルがGitHub Actionsでビルドできない"
date: 2021-12-24T09:43:41+09:00
draft: false

categories:
  - programming
tags:
  - Hugo
  - エラー
  - GitHub
  - GitHub Actions
  - css
image: af7ef3c0-44c1-4f2f-aad8-1a0664724558.jpg
---
hugoでscssやsassを含んだファイルををGitHubに公開、Git Actionで自動ビルドしようとした際に、見慣れないエラーが表示された

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

はて？なにか悪いことでもしたのだろうか。
それとも変な記述をしてしまったのだろうか。

## エラーの内容
こういうときは、落ち着いてエラーを見てみよう。
大抵のことはちゃんと教えてくれているはずだ。

```
Check your Hugo installation; you need the extended version
```
なるほど、extended を使えと行っている。
extended とはなんだろう。

## エラーの対応
さらに落ち着いて設定ファイルを確認することをおすすめする。
.github/workflow/gh-pages.yml

```yaml
- name: Setup
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: '0.87.0'
    #extended: true
```
設定の extended が思いっきりコメントアウトされていました

コメントを外して、再度Gitにpushしたところ、正常にビルドされて公開できました。

## まとめ
scssやsassを含んだファイルをhugoをgitに公開しようとした際に、ビルドできない場合は設定を確認することをおすすめする。