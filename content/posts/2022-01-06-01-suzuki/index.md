---
title: "シェルスクリプトをつかって、hugoで楽ちんにファイルを作成して編集できないかっていうはなし"
description: "ここでは、hugoコマンドでnewする時に指定するファイル名を、シェルスクリプトを使ってなるべく簡便にあてはめてファイル生成しようというものです。"
date: 2022-01-06T14:21:51+09:00
draft: false
image: 2021-12-23-bash.jpg
categories:
  - プログラミング
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - hugo
  - ユーティリティ
  - 鈴木維一郎
---

## はじめに
ここでは、hugoコマンドでnewする時に指定するファイル名を、シェルスクリプトを使ってなるべく簡便にあてはめてファイル生成しようというものです。

hugo コマンドでgithub.ioディレクトリに記事を投稿する場合、以下のコマンドをたたくと思います。
```bash
$ hugo new posts/＜ディレクトリ＞/index.md
```
または
```bash
$ hugo new posts/＜今日の日付＞.md
```

面倒なんですよね。。。

## ディレクトリの指定
通常、記事毎にディレクトリを分けて、アクセスされるファイルをindex.mdにした場合は、以下の通りになりますよね。
```bash
$ hugo new posts/＜今日の日付のディレクトリ＞/index.md
```

## ナンバリングの効用
ただ、同日に気分が乗ってきて、もう一つ記事を投稿しようとする場合は、日付の後ろに「-02」とか工夫する必要も出てきたりします。たとえば以下のように
```bash
$ hugo new posts/＜今日の日付のディレクトリ＞-＜ナンバリング02＞/index.md
```

## 複数メンバーの投稿を区別する
複数のコラボレーターで投稿するgithub.ioの場合は、投稿者も区別したくなります。例えば
```bash
$ hugo new posts/＜今日の日付のディレクトリ＞-＜作成者＞-＜ナンバリング02＞/index.md
```

ようするに、シェルスクリプトを使って、以下のコマンドを実行したい訳です。
```bash
$ hugo new posts/2022-01-06-01-suzuki/index.md
```

## 起動パラメータ
と、なると、パラメータは以下の三つとなりますね。
$today 今日の日付
$number 記事のナンバリング
$author 作成者

## 実行イメージ
```bash
# 作成者 suzuki の 01 番目の投稿記事
$ bash mkArticle.sh suzuki 01
$ hugo new posts/$today-$number-$author/index.md
```

## 気をつけるところは
### １．パラメータを省略したときの挙動
```bash
$ bash mkArticle.sh 
```
で、実行した場合に、「作成者が指定されていないからやりなおしてね」というのもちょっと寂しいものがあります。指定していなければ、都度、聞いてきて欲しいものです。そこで readコマンドで作成者を尋ねてくる感じにします。

```bash
  if [ -z "$author" ]; then
    echo "ユーザー名を半角で入力";
    read author; 
  fi
```

### 同日ファイルの存在を確認
２．すでに同日に一つ目の記事を投稿してある。要するに生成しようとしているファイルがすでに存在する場合の挙動です。こちらは、ファイルが存在していれば、１を応用して、別のナンバリングを指定するように尋ねてくれると良さそうです。

```bash
  while [ true ] ;do
    if [ -f "content/posts/$today-$number-$author/index.md" ]; then
      echo "$number ファイルが既に存在します。";
      echo "別のナンバリングを指定して下さい 02とか03とか";
      read number;
    else
      break;
    fi
  done

```

ですので、ナンバリングの初期値は「01」としておいて、そのファイルが既に存在する場合は、あらためてユーザーにナンバリングを尋ねてくるという手法としました。
```bash
  if [ -z "$number" ]; then
    number="01";
  fi
```

## 実行方法
```bash
$ bash mkArticle.sh suzuki 01;
```

```bash
前述のとおり作成者、ナンバリングは省略可能です。
$ bash mkArticle.sh 
```


## ソース全文

```bash
#!/bin/bash

: '使い方
一つ目のパラメーターに作成者を指定します
二つ目のパラメータにナンバリングを指定します
一つ目 01(未指定の場合は01）
二つ目 02

（例)
$ bash mkArticle.sh suzuki 01;

'
#
#作成者 無指定であれば入力を促す
author=$1;  
#今日の日付
today=$(date "+%Y-%m-%d%n");
#今日のインデクス 一つ目の投稿であれば01 二つ目の投稿であれば02
number="$2";
#
function getParam(){
  if [ -z "$number" ]; then
    number="01";
  fi
  #
  if [ -z "$author" ]; then
    echo "ユーザー名を半角で入力";
    read author; 
  fi
  #
  while [ true ] ;do
    if [ -f "content/posts/$today-$number-$author/index.md" ]; then
      echo "$number ファイルが既に存在します。";
      echo "別のナンバリングを指定して下さい 02とか03とか";
      read number;
    else
      break;
    fi
  done
}
#
function execHugo(){
  echo "";
  echo "hugoコマンドを実行します";
  echo "hugo new posts/$today-$number-$author/index.md"
  hugo new posts/$today-$number-$author/index.md

  echo "ファイルの編集は以下の通りです。"
  echo "vim content/posts/2022-01-06-01-suzuki/index.md;"
}
#
# パラメータの取得
getParam;
# hugoコマンドの実行
execHugo;
exit;
#

```
## おわりに
色々とカスタマイズして、便利に記事投稿ができるとブログも盛り上がりますね。

