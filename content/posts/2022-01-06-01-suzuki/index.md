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
### パラメータを省略したときの挙動
```bash
$ bash mkArticle.sh 
```
実行した場合に、「作成者が指定されていないからやりなおしてね」というのもちょっと寂しいものがあります。指定していなければ、都度、聞いてきて欲しいものです。そこで readコマンドで作成者を尋ねてくる感じにします。

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

```bash:mkArticle.sh
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

  # 処理終了
  echo "ファイルの編集は以下の通りです。"
  echo "vim content/posts/$today-$number-$author/index.md;"
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
日頃、手間を掛けてコマンドを入力している場合は、シェルスクリプトを使って簡便にできる事に加え、さらにカスタマイズを加え、便利に記事投稿ができるとブログも気分もがぜん盛り上がりますね。

## 書籍の紹介
{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー） – 2017/1/20"

url="https://www.amazon.co.jp/gp/product/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

summary=`定番の1冊『シェルスクリプト基本リファレンス』の改訂第3版。
シェルスクリプトの知識は、プログラマにとって長く役立つ知識です。
本書では、複数のプラットフォームに対応できる移植性の高いシェルスクリプト作成に主眼を置き、
基本から丁寧に解説。
第3版では最新のLinux/FreeBSD/Solarisに加え、組み込み分野等で注目度の高いBusyBoxもサポート。
合わせて、全収録スクリプトに関してWindowsおよびmacOS環境でのbashの動作確認も行い、さらなる移植性の高さを追求。
ますますパワーアップした改訂版をお届けします。`
imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4774186945&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}

{{% amazon

title="いちばんやさしいGit&GitHubの教本 人気講師が教えるバージョン管理＆共有入門 「いちばんやさしい教本」シリーズ"

url="https://www.amazon.co.jp/gp/product/B07LBSWJNP/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B07LBSWJNP&linkCode=as2&tag=nlpqueens-22&linkId=fd3f2918d16f32f53feccf492263133a"

summary=`実際のワークフローをイメージしながら
実践的なGit/GitHubの使い方が身につく「いちばんやさしい」入門書です。
前半は、手元のパソコンでファイルを実際にバージョン管理しながら、
Gitの基本的な使い方を解説。`

imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B07LBSWJNP&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}


