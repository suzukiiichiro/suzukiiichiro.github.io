---
title: "（１０）【chmod】シェルスクリプトコマンド活用紹介"
description: "ファイル・ディレクトリのパーミッションを変更する"
date: 2022-07-06T10:12:50+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - コマンド活用
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## chmodコマンド
- パーミッションを表すアルファベットと数値の意味
- パーミッションを変更する
- パーミッションの変更内容を確認するには？


## chmodコマンド概要
ファイルやディレクトリにアクセスできるかどうかは、ファイルの「パーミッション（許可属性）」によって決まります。このパーミッションを変更するコマンドが「chmod」です。


## chmodコマンドの書式
chmod [オプション] モード ファイル1 ファイル2 ファイル3……


## chmodコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-R	|ファイルとディレクトリを再帰的に変更する|
|-v	|処理した内容を出力する|
|-c	|変更が行われた場合のみ処理内容を出力する|
|-f	|ほとんどのエラーメッセージを出力しない|


{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man chmod   などで、chmodの使い方を確認してください。
{{% /tips-list %}}


## chmodコマンド詳細説明

### パーミッションを表すアルファベットと数値の意味


|記号|数字    |意味|
|----|--------|----|
|r   |4       |読み|
|w   |2       |書き|
|x   |1       |実行|
|-   |0       |拒否|


具体的に以下のように表示される場合、「所有者」「所有グループ」「それ以外」の３桁で表されます。

rw-rw-r--   664
rwxr-xr-x   755

すくなくとも自分自身はおおむね「所有者」となりますので、

rw-rw-r--   664
の場合は、所有者（自分自身）は、rw- 6 ですので、
読み・書きはできるものの実行はできない（実行の必要がない）ファイル・ディレクトリということになります。

rwxr-xr-x   755
の場合は、所有者（自分自身）は、rwx 7 ですので、
読み・書き・実行が可能なファイル・ディレクトリであるということになります。


### パーミッションを変更する

いろいろな方法があります。
一般的には（なにが一般的かもわかりませんが）以下の通りとなります。

sample.txtのパーミッションを664に変更する
```
$ chmod 664 sample.txt
```

sample.txtのパーミッションを755に変更する
```
$ chmod 755 sample.txt
```

### パーミッションの変更内容を確認するには？

　chmodコマンドで「-v」オプションを指定すると、コマンドの実行内容が分かるようになります。パーミッションが変更されなかった場合も、現状がどのようになっているかが分かるように表示されます。

```
$ chmod -v 755 sample.txt
'sample.txt' のモードを 0664 (rw-rw-r--)から 0775 (rwxrwxr-x)へ変更しました
```

{{% tips-list tips %}}
ヒント
: $ chmod コマンドはとても重要、かつセキュリティ上注意が必要なコマンドです。なんでもかんでも777にしておくという大馬鹿ものが後を絶ちませんが、やめましょう。
{{% /tips-list %}}

{{% tips-list tips %}}
ヒント
: -v オプションは常につけて実行しましょう。何を実行したのかを履歴に残しておくことで振り返って確認することができます。
{{% /tips-list %}}


## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

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

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

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




