---
title: "ざっくりわかる「シェルスクリプト【１】」"
date: 2022-01-07T10:03:12+09:00
description: "ここではbashプログラミングの基本的な考え方、bashスクリプトの一般的な操作を、ざっくりと説明します。"
draft: false
image: 2021-12-23-bash.jpg
categories:
  - プログラミング
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

# はじめに
Bashスクリプトは、シェルコマンドの実行、複数のコマンドの同時実行、管理タスクのカスタマイズ、タスクの自動化の実行など、さまざまな目的に使用できます。したがって、bashプログラミングの基本に関する知識はすべてのLinuxユーザーにとって重要です。この記事は、bashプログラミングの基本的な考え方を理解するのに役立ちます。ここでは、bashスクリプトの一般的な操作のほとんどを、非常に簡単な例で説明します。

この記事では、bashプログラミングの次のトピックについて説明します。


## １．Hello World
### はじめてのbashコマンド「echo」
ターミナルで非常に単純なbashステートメントを実行します。 コマンドの出力は「Hello, World」になります。


```:はじめてのecho
$ echo "Hello, World"
Hello, World
$
```

### はじめてのbashスクリプト「vim」
```bash:はじめてのbashスクリプト
$ vim HelloWorld.sh
＜空のvim HelloWorld.sh が開きます＞
```

vimで開いたHelloWorld.shを編集します。

```bash:HelloWorld.sh
#!/bin/bash
echo "Hello World";
exit;
```
### はじめての実行権限「chmod」
bashファイルは2つの方法で実行できます。
１．bashコマンドを使用する方法、
２．bashファイルに実行権限を設定し、ファイルを実行する方法

一つ目の方法「bashコマンドを使用する」
```
$ bash HelloWorld.sh
```

もう一つの方法「chmodで実行権限を付与する」
```
# +x で実行権限を付与
$ chmod +x HelloWorld.sh
# ドット　スラッシュをつけて実行
$ ./HelloWorld.sh
```

考え方ですが、bashコマンドで実行する場合のメリットは、ファイルに闇雲に実行権限を与える必要がないことです。実行権限を与える方法は、一般的ではありますが注意も必要です。

chmod の実行権限には +x で実行権限を付与する方法の他、0755 などの数字で付与する場合もあります。
これらを<font color=red>パーミッション</font>と言います。

### パーミッションの確認
ターミナルのコマンドでカレントディレクトリ内のファイルやディレクトリの情報を確認します。

```
$ls -l
```
上記のコマンドを実行すると、以下のような一覧が表示されるかと思います。

```
-rw-r--r--  1 user group      9  1月 1 00:00 hoge.txt
drwxr-xr-x  6 user group  20480  1月 1 00:00 ダウンロード
```

### パーミッションの読み方
「-rw-r--r--」や「drwxr-xr-x」の先頭の謎の10文字についてですが、
最初の１文字目はファイル種別を表しています。
-rw-r--r--

<table>
<tr><th>種別</th><th>意味</th></tr>
<tr><td>-</td><td>ファイル</td></tr>
<tr><td>d</td><td>ディレクトリ</td></tr>
<tr><td>l</td><td>シンボリックリンク</td></tr>
</table>

2文字目から4文字目はファイルの所有者に対する権限を表し、
5文字目から7文字目はファイルの所有グループに対する権限を表し、
8文字目から10文字目はその他に対する権限を表しています

上記から-rw-r--r--は、
「ファイル種別」が「ファイル」であり、
「所有者」に「読み取り」と「書き込み」の権限があり、
「所有グループ」に「読み取り」の権限があり、
「その他」に「読み取り」の権限があることを示しています。

drwxr-xr-xは、
「ファイル種別」が「ディレクトリ」であり、
「所有者」に「読み取り」と「書き込み」と「実行」の権限があり、
「所有グループ」に「読み取り」と「実行」の権限があり、
「その他」に「読み取り」と「実行」の権限があることを示しています。

### アクセス権限の変更
アクセス権限を変更する方法について記載します。

パーミッションの変更には<font color=red><b> chmodコマンド</b></font>を使用します。

数値で指定する
```
$ ls -l　
-rw-r--r--  1 user group      9  1月 1 00:00 hoge.txt
$ chmod 764 hoge.txt
$ ls -l
-rwxrw-r--  1 user group      9  1月 1 00:00 hoge.txt
```
上記のコマンドはhoge.txtに対してパーミッションの確認→変更→確認を行っています。
```
$ chmod 764 hoge.txt
```
に関して説明していきます。
ファイルのパーミッションの変更は以下の通りコマンドを実行すれば可能です。
```
chmod モード 対象ファイル名
```
### モードの数字について
<table>
<tr><th>モード(数字)</th><th>モード(アルファベット)</th><th>権限</th></tr>
<tr><td>4</td><td>r</td><td>読み取り</td></tr>
<tr><td>2</td><td>w</td><td>書き込み</td></tr>
<tr><td>1</td><td>x</td><td>実行</td></tr>
</table>
上記の合計値を「所有者」「所有グループ」「その他」の順で入力することでパーミッションを変更することができます。
要するに上記の「764」は
「所有者」に対して「読み取り」「書き込み」「実行」を、
「所有グループ」に対して「読み取り」「書き込み」を、
「その他」に「読み取り」を付与しています。

詳しくはこちら
https://qiita.com/shisama/items/5f4c4fa768642aad9e06

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

title="UNIXシェルスクリプト マスターピース132"

url="https://www.amazon.co.jp/gp/product/B00QJINS1A/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B00QJINS1A&linkCode=as2&tag=nlpqueens-22&linkId=36dff1cf8fa7d4852b5a4a3cf874304b"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B00QJINS1A&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}


<!--
## ２．Echo コマンド
### 
## ３．コメント
### 
## ４．マルチラインコメント
### 
## ５．While ループ
### 
## ６．For ループ
### 
## ７．Get User Input
### 
## ８．If 文
### 
## ９．And 条件を if 文で使う
### 
## １０．Or 条件を if文で使う
### 
## １１．Else if と else
### 
## １２．Case 文
### 
## １３．コマンドラインから引数を取得
### 
## １４．名前を使用してコマンドラインから引数を取得する
### 
## １５．変数に2つの文字列を組み合わせる
### 
## １６．文字列の部分文字列を取得する
### 
## １７．変数に2つの数値を追加します
### 
## １８．関数を作成する
### 
## １９．関数パラメーターを使用する
### 
## ２０．スクリプトからの戻り値を渡す
### 
## ２１．ディレクトリを作成する
### 
## ２２．存在を確認してディレクトリを作成する
### 
## ２３．ファイルを読む
### 
## ２４．ファイルを削除する
### 
## ２５．ファイルに追加
### 
## ２６．ファイルが存在するかどうかを確認
### 
## ２７．mailコマンド
### 
## ２８．dateコマンド
### 
## ２９．waitコマンド
### 
## ３０．sleepコマンド
-->
