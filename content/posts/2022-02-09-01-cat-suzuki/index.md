---
title: "（２）【cat】シェルスクリプトコマンド活用紹介"
description: "「cat」は、「conCATenate（つなぐ、連結する）」のcatです。ファイルを連結するためのコマンドですが、ファイルの内容を表示する際によく使われます。"

date: 2022-02-09T12:59:39+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - プログラミング
tags:
  - cat
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## catコマンド
- ファイルの内容を表示する
- ファイルの内容を行番号付きで表示する
- 複数ファイルを連結して1つのファイルにする

## 概要
「cat」は、「conCATenate（つなぐ、連結する）」のcatです。ファイルを連結するためのコマンドですが、ファイルの内容を表示する際によく使われます。

## catコマンドの書式
cat [オプション] ファイル1 ファイル2……


## catコマンドの主なオプション
catコマンドの主なオプションは次の通りです。

|オプション|長いオプション|意味|
|:--------:|--------------|----|
|-n        |--number      |行番号を付け加える|
|-b|--number-nonblank|行番号を付け加える。ただし空白行には付けない|
|-s|--squeeze-blank|連続した空行を1行にする|

## catコマンド詳細説明
### ファイルの内容を出力
filenameの内容をターミナルに出力します。

```
$ cat filename
```

長いファイルの場合は、lessコマンドを使います。

```
$ cat filename | less
```

### ファイルの結合
複数のファイルを結合（連結）させて別ファイルへ出力します。

```
$ cat filename1 filname2 > filename3
```

追記したい場合は「>>」を使います。

```
$ cat filename1 filname2 >> filename3
```

{{% tips-list tips %}}
ヒント
: 「>」をリダイレクト、「>>」をアペンドと言います。「>」はファイルを新規作成してファイルへ出力します。「>>」は既存のファイルへ追記出力します。
: 「>」は、内容があってもファイルの内容を空にして出力することに注意しなくてはなりません。
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





