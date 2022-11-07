---
title: "（１２）【nkf】シェルスクリプトコマンド活用紹介"
description: "文字コードと改行コードを変換する"
date: 2022-07-08T10:22:13+09:00
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


## nkfコマンド
- 文字コードと改行コードを変換する
- 文字コードを判定する
- 文字コードを変換してファイルを書き換える
- CentOS 7にnkfをインストールするには？


## nkfコマンド概要
　「nkf」は「Network Kanji Filter」の略で、LinuxとWindowsなど、異なるOS間でテキストデータを交換する際に問題となる文字コードと改行コードを変換するためのコマンドです。


## nkfコマンドの書式
nkf [オプション] [ファイル]
nkf [オプション] --overwrite ファイル


## nkfコマンドの主なオプション

nkfにはオプションはありません。なお、オプション文字列の先頭に「:」記号を入れるかどうかによって、エラーメッセージ表示の有無を変更できます。

|オプション    |意味|
|--------------|----|
|-j(入力は J)	|JISコードを出力する|
|-e(入力は E)	|EUCコードを出力する|
|-s(入力は S)	|シフトJISコードを出力する|
|-w(入力は W) |UTF-8コードを出力する（BOMなし）|
|-Lu          |改行をLFにする（UNIX系）|
|-g	          |自動判別の結果を出力する|
|--overwrite  |ファイルを変換して上書きする|

{{% tips-list tips %}}
ヒント
: UTF-8に変換する場合は $ nkf -wLu となります。
このオプションの意味は、改行コードをUNIX系のLFに変換してUTF-8で出力、です。
{{% /tips-list %}}

{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man nkf   などで、nkfの使い方を確認してください。
{{% /tips-list %}}


## nkfコマンド詳細説明

### 文字コードと改行コードを変換する

kfは「nkf ファイル名」で指定したファイル、または標準入力から受け取った内容を変換して、標準出力に書き出します。

Linux環境で扱いやすいように、文字コードを「UTF-8」（-wオプション）、改行コードを「LF」（-Luオプション）に変換するには、リダイレクトするか、「nkf -wLu 元ファイル > 保存ファイル名」のように指定します。なお、入力側の文字コードは自動で判定されます。

改行コードはUNIX系のLFで、UTF-8で変換出力
```
$ cat sjisFile.txt | nkf -wLu > 保存ファイル名.txt
```



### 文字コードを判定する

　「-g（--guess）」オプションを付けると、使用されている文字コードと改行コードの判定結果を表示することができます。

得体のしれないファイルを調査する
```
$ cat sjisFile.txt | nkf -g
sjisFile.txt: UTF-8 (LF)
```

### 文字コードを変換してファイルを書き換える
　「--overwrite」オプションでは、指定したファイルの文字コードを変換して、直接書き換えることができます。

文字コードを変換してファイルを書き換える
```
$ cat sjisFile.txt | nkf -wLu --overwrite
```

{{% tips-list tips %}}
ヒント
: --overwrite オプションで元のファイルを上書きするのは一見便利なオプションに見えますが、別ファイルに出力して、元のファイルは極力残すようにしておくべきだと思います。僕は。
{{% /tips-list %}}



## CentOS 7にnkfをインストールするには？ 

rpmでインストール
```
$ yum localinstall http://mirror.centos.org/centos/6/os/x86_64/Packages/nkf-2.0.8b-6.2.el6.x86_64.rpm
```

ソースからインストール
```
$ wget https://osdn.jp/dl/nkf/nkf-2.1.4.tar.gz
$ tar -xzvf nkf-2.1.4.tar.gz
$ cd nkf-2.1.4/
$ make
$ sudo make install
```

{{% tips-list tips %}}
ヒント
: rpmやyumでインストールする場合と、ソースからインストールする場合、いずれも好みです。人それぞれのやり方や考え方でいいと思います。いずれ使い分けができるようになると思います。今はうまく行ったほうで頑張ってください。
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





