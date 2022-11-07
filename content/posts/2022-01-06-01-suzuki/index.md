---
authors: suzuki
title: "シェルスクリプトをつかって、hugoで楽ちんにファイルを作成して編集できないかっていうはなし"
description: "ここでは、hugoコマンドでnewする時に指定するファイル名を、シェルスクリプトを使ってなるべく簡便にあてはめてファイル生成しようというものです。"
date: 2022-01-06T14:21:51+09:00
draft: false
image: 2021-12-23-bash.jpg
categories:
  - programming
tags:
  - 便利コマンド作成
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

title="詳解 シェルスクリプト 大型本 – 2006/1/16"

url="https://www.amazon.co.jp/gp/product/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/product/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー） – 2017/1/20"

url="https://www.amazon.co.jp/gp/product/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/product/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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


