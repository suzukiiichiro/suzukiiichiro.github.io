---
title: "（6）【kill】シェルスクリプトコマンド活用紹介"
description: "プロセスを強制終了させます。killは実行中のプロセスを終了させる場合に使うコマンドです。"
date: 2022-02-14T11:39:03+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - プログラミング
tags:
  - kill
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## killコマンド
- killコマンドでプロセスIDを指定してプロセスを終了させる
- killallコマンドで名前を指定してプロセスを終了させる

## killコマンド概要
プロセスを強制終了させます。
killは実行中のプロセスを終了させる場合に使うコマンドです。

killコマンドでプロセスを終了させるには、

```
$ kill ＜プロセスID＞
```

で指定します。
例えば、100番のプロセスならば

```
$ kill 100
```

と指定します。
プロセスIDは「ps」コマンドで調べることができます。

## killコマンドの書式
kill [オプション] プロセスID

## killコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-s シグナル   |プロセスに送るシグナル名または番号。-シグナル名、-番号でも指定可能|
|-l            |シグナル名のリストを表示する|

## killコマンド詳細説明

### プロセスＩＤでプロセスを終了させる
「kill プロセスID」で、指定したプロセスを終了させることができます。プロセスIDは「ps」コマンドで確認できます。

```
$ kill ＜プロセスＩＤ＞
```

### killallコマンドで名前を指定してプロセスを終了させる
「killall 名前」で、“名前”に指定したプロセスを終了させることができます。

```
$ killall ＜プロセス名＞
```

### さまざまなプロセスの調べ方と終了方法

ps aux を使う方法

```
bash-5.1$ ps axu | grep hugo | grep -v grep
suzukiiichiro    17498   0.0  3.4  5607088 567104 s003  S+   水11AM   2:58.60 hugo -D server
suzukiiichiro    20710   0.0  1.7  5328588 286744 s005  S+   11:38AM   0:13.50 hugo server
bash-5.1$
```
最後の grep -v grep は、grep コマンドでプロセス名を検索したプロセスを除くという意味になります。

さらにawkコマンドでプロセスＩＤを抽出します。

```
bash-5.1$ ps axu | grep hugo | grep -v grep | awk '{ print $2; }'
17498
20710
bash-5.1$
```

pgrep を使う方法
pgrep は、指定したプロセスのプロセスＩＤを抽出する方法です。

```
bash-5.1$ pgrep hugo
17498
20710
bash-5.1$
```


プロセスＩＤが解ったところでプロセスを終了します。

|表記    |数値    |意味|
|:------:|:------:|----|
|KILL    |9       |プロセスの強制終了命令|

```
$ kill -9 17498
$ kill -9 20710
```

面倒ですね。プロセスがたくさんある場合はとても煩雑です。
xargsコマンドを使うと一片にプロセスを終了させることができます。

```
bash-5.1$ ps axu | grep hugo | grep -v grep | awk '{ print $2; }' | xargs kill -9
```

終了したいプロセス名が解っている場合は以下のコマンドで一発で全ての同名プロセスを終了させることができます。

```
$ killall hugo
```


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


<!-- EOF -->
