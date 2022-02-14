---
title: "（6）【less】シェルスクリプトコマンド活用紹介"
description: "メッセージやテキストファイルを1画面ずつ表示する"
date: 2022-02-13T16:35:49+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - less
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## lessコマンド
- テキストを1画面ずつ表示する
- キー操作のヘルプを表示する
- 長い行を折り返さずに表示する
- ファイルの末尾まで表示したらすぐに終了する

## 概要
「less」コマンドは、テキストファイルを1画面ずつ表示するコマンドです。

```
$ cat ＜ファイル名＞ | less
```

「less ファイル名」で実行する他、「コマンド | less」のように、別のコマンドの実行結果を1画面ずつ表示する場合にも使われます。

```
$ dmesg | less 
```


{{% tips-list tips %}}
ヒント
: ［Enter］キーで1行、スペースキーで1画面先に進める他、上下矢印キーによるスクロールも可能です。表示を終了するには［Q］または［q］キーを入力します。
{{% /tips-list %}}


　同じ用途のコマンドに「more」があります。lessコマンドはmoreコマンドよりも機能が多く、画面内で検索したり、上にスクロールしたりすることが可能です。


## lessコマンドの書式
less [オプション] ファイル名
コマンド | less [オプション]

## lessコマンドの主なオプション

|短いオプション |長いオプション |意味|
|:-------------:|---------------|----|
|+行数,-行数    |               |指定した行から表示する|
|+/文字列       |               |指定文字列を検索し、見つけた行から表示する（正規表現によるパターン指定が可能）|
|-p文字列       |--pattern=文字列|指定文字列を検索し、見つけた行から表示する（正規表現によるパターン指定が可能）|
|-oファイル     |--log-file=ファイル| パイプ（｜）などで標準入力から入力した内容を表示する際、指定したファイルにコピーを保存する。既存ファイルを指定した場合は、上書きするか、追加するかを確認するメッセージが表示される|
|-Oファイル     |--LOG-FILE=ファイル| 「-o」と同じだが、既存ファイルを指定した場合は、確認せずに上書きする|
|-kファイル名   |--lesskey-file=ファイル名| lesskeyファイル（キー定義ファイル、「lesskey」コマンドで生成）を指定する|
|-L             |--no-lessopen  | 環境変数LESSOPEN（lessコマンド用のオプションを定義した環境変数）を無視する|



## lessコマンド詳細説明

### テキストを1画面ずつ表示する

```
$ less ＜ファイル名＞
```

で、指定したファイルを1画面ずつ表示します。
次の画面へ進みたい場合はスペースキー、1行ずつ進めたい場合は［Enter］キーを押します。
上下の矢印キーや、［y］または［e］キー、［j］または［k］キーで上下にスクロールすることも可能です。
［q］キーを押すと終了します。


以下のような使い方もできます。
```
$ cat <filename> | less
```

### キー操作のヘルプを表示する

lessコマンドで画面を表示中に［h］キーを押すと、キー操作のヘルプが表示されます。
ヘルプの表示中でもlessコマンドと同様に、上下のスクロールや検索などの操作が可能です。

［q］キーを押すとヘルプの表示を終了し、元の画面に戻ります 


### 長い行を折り返さずに表示する

lessコマンドでは、画面の横幅より長い行は折り返して表示されます。
折り返さずに表示したい場合は、「-S」オプションを使用します。

左右の矢印キーまたは、［ESC］キーに続いて［(］および［)］キーを押すと、左右に半画面分スクロールします。
横スクロールの幅は「-#」オプションで指定できます。　

```
$ cat filename | less -S
```

{{% tips-list tips %}}
ヒント
: ［q］キーを押すとヘルプの表示を終了し、元の画面に戻ります。
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



