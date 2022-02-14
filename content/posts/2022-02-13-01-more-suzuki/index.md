---
title: "（5）【more】シェルスクリプトコマンド活用紹介"
description: "長いメッセージやテキストファイルを1画面ずつ表示する"
date: 2022-02-13T16:35:41+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - プログラミング
tags:
  - more
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## moreコマンド
- 長いメッセージやテキストファイルを1画面ずつ表示する
- テキストを1画面ずつ止めながら表示する
- 実行結果を止めながら表示したいときにはパイプを使う
- 確認したい箇所がある場合は「+/オプション」でスキップ
- 行番号付きで表示したいときはcatコマンドと組み合わせる
- moreコマンドで使える主なサブコマンド

## moreコマンド概要

moreコマンドは、テキストファイルを1画面ずつ表示するページャコマンドです。

```
$ more <ファイル名>
```

で実行する他、

```
$ cat <ファイル名> | more
```

のように他のコマンドの実行結果を1画面ずつ表示する際によく使われます。

　また、moreコマンドにサブコマンドがあり、［Enter］キーで1行、［スペース］キーで1画面先に進み、ファイルの末尾まで表示されると終了します。ファイルを表示している途中でも［Q］キーまたは［q］キーで終了できます。

## moreコマンドの書式

more [オプション] filename
cat filename | more [オプション]

## moreコマンドの主なオプション


|オプション |意味|
|---------------|----|
|+数値  |数値で指定した行から表示する|
|+/文字列 |指定した文字列を検索して、見つけた行の2行上から表示する|
|-s |連続した空行を1行にする|
|-l |改ページを無視する|
|-u |下線の処理を行わない|
|-数値  |画面の行数を指定する|
|-f |画面での行数ではなく、データの行数を表示する|
|-d   |無効なキーが入力された場合には、ビープ音の代わりに簡単なヘルプを表示する|


## moreコマンド詳細説明
「cat」コマンドでテキストファイルの内容を表示したら、思ったよりも長くコマンドを実行した結果がどんどん上に流れてしまって、テキストファイルのの最初の方が読めない！ そんなときに便利なのが「more」コマンドです。

moreコマンドは、「more ファイル名」で指定したファイルを1画面ずつ止めながら表示します。次の画面へ進みたいときは［スペース］キーを、1行ずつ画面を進めたいときは［Enter］キーを押します。

ファイルをページャとして読みたい場合

```
$ cat <filename> | more
```

dmsgなどのシステムファイルをページャとして読みたい

```
$ dmsg | more 
```

{{% tips-list tips %}}
ヒント
: 検索を行う場合はページャ画面で「/」記号に続けて検索文字列を入力し、［Enter］キーを押すとその位置までスキップします。nで直前の検索を繰り返します。
{{% /tips-list %}}


{{% tips-list tips %}}
ヒント
: ファイルを表示している途中でも［Q］キーまたは［q］キーで終了できます。
{{% /tips-list %}}


# 書籍の紹介
{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

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

title="UNIXシェルスクリプト マスターピース132"

url="https://www.amazon.co.jp/gp/product/B00QJINS1A/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B00QJINS1A&linkCode=as2&tag=nlpqueens-22&linkId=36dff1cf8fa7d4852b5a4a3cf874304b"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B00QJINS1A&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}

{{% amazon

title="新しいシェルプログラミングの教科書 単行本"

url="https://www.amazon.co.jp/gp/product/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens-22&linkId=f514a6378c1c10e59ab16275745c2439"

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
imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4797393106&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}

