---
title: "（４）【tail】シェルスクリプトコマンド活用紹介"
description: "headコマンドとは逆に、ファイルの末尾だけ表示するのがtailコマンドです。"
date: 2022-02-11T14:31:57+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - プログラミング
tags:
  - tail
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## tailコマンド
headコマンドとは逆に、ファイルの末尾だけ表示するのがtailコマンドです。

 - tailコマンドでファイルの末尾部分だけを表示する
 - ログファイルを監視する
 - ファイルの特定の範囲の行を取り出す（headとtail）

## 概要
ログファイルでは、基本的にファイルの末尾に新たな記録が追加されます。「more」コマンドやテキストエディタで表示しようとすると、末尾まで進むのが面倒だし、ファイルが大きい場合は読み込むのにも時間がかかります。その点、tailコマンドならば、末尾しか見ないので手軽かつ処理も高速です。
tailコマンドも、headコマンド同様、「-n」オプションで表示する行数を指定することができます。

## tailコマンドの書式
tail [オプション] ファイル名

## tailコマンドの主なオプション
|短いオプション|長いオプション|意味|
|:------------:|--------------|----|
|-c 数字 |--bytes 数字  |末尾の指定したバイト数のみ表示する。「-c 5 b」のように単位を付加することも可能（b=512, KB=1000, K=1024, MB=1000*1000, M=1024*1024…）|
|-n 数字 |--lines 数字  |末尾の指定した行数のみ表示する|
|-q  |--quiet, --silent |ファイルごとのヘッダ表示を行わない（複数ファイル指定時に使う）|
|-v  |--verbose |常にファイルごとのヘッダ出力を行う|
|-f  |--follow  |ファイルを監視して内容が追加されるたびに末尾に表示する（ログ監視などに使用する。［Ctrl］＋［C］キーで終了）|


## tailコマンド詳細説明


### tailコマンドでファイルの末尾部分だけを表示する
ファイルの末尾を表示します。tail -n で表示行数を変更できます。
tail -n10 と デフォルトの tail は同じ出力となります。

```
$ cat filename | tail -n10
```

### ログファイルを監視する

tailコマンドの「-f」オプションを使うと、ログファイルのように、刻々と内容が追加されていくファイル監視ができるようになります。「-f」は、ファイルなどを監視する際、内容が新たに追加されるたびに末尾に表示するオプションです。ログの監視を終了するには、［Ctrl］＋［C］キーを押します。

```
$ sudo tail -f /var/log/httpd/error_log 
```


{{% tips-list tips %}}
ヒント
: tail -f コマンドはとてもよく使います。 
: tail -f を実行するtailf コマンドもあります。(Oによりますが)
{{% /tips-list %}}


### ファイルの特定の範囲の行を取り出す（headとtail）

ファイル後ろの200行目のところから、ファイル先頭に向かって100行を取り出すにはどうしたらよいか？


```
cat filename | tail -n200
```

これだとファイル末尾から200行を出力するにすぎない。
tail コマンドのみに頼ろうとすると難しいようだ。
実は、head コマンドも使えば、「後ろ200行の先頭100行」を取り出せる。

```
$ cat filename | tail -n200 | head -n 100
```

コマンドの実行結果の10001行目から10100行目までが欲しい時は以下の通り。

```
$ cat filename | head -n10100 | tail -n100
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


