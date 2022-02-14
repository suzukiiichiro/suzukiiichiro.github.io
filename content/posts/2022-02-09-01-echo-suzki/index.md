---
title: "（１）【echo】シェルスクリプトコマンド活用紹介"
description: "「echo」はメッセージなどを表示するコマンドです。「echo メッセージ」でメッセージを表示します。「echo $変数名」で環境変数やシェル変数を表示する際にも使用います。"
date: 2022-02-09T11:32:07+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - echo
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## echoコマンド
- メッセージや環境変数を表示します。

## 概要
「echo」はメッセージなどを表示するコマンドです。

```
$echo メッセージ
```

でメッセージを表示します。

```
$ echo $変数名
```

で環境変数やシェルスクリプト内の変数を表示する際にも使用います。


## echoコマンドの書式
  echo [オプション] メッセージ

## echoの主なオプション
|オプション	|意味                  |
|:---------:|----------------------|
|-n         |最後の改行を出力しない|
|-e         |エスケープを解釈する  |
|-E	        |エスケープを解釈しない（デフォルト）|  


### echo コマンド詳細説明
<font color=orange><b> echoコマンドの使用：</b></font>
さまざまなオプションでechoコマンドを使用できます。
次の例では、いくつかの便利なオプションについて説明します。
オプションなしで「echo」コマンドを使用すると、デフォルトで改行が追加されます。
'-n'オプションは、改行なしでテキストを印刷するために使用されます。
'-e'オプションは、出力からバックスラッシュ文字を削除するために使用されます。
'echo_example.sh'という名前の新しいbashファイルを作成し、次のスクリプトを追加します。

``` bash:echo_example.sh
#!/bin/bash

echo "改行付きのテキストの印刷";
echo -n "改行なしのテキストの印刷";
echo -e "\n削除\tバックスラッシュ\t文字\n";
```


bashコマンドでファイルを実行します。


```
$ bash echo_example.sh
改行付きのテキストの印刷
改行なしのテキストの印刷
削除	バックスラッシュ	文字
$
```



### Hello World
<font color=orange><b>はじめてのbashコマンド「echo」</b></font>
ターミナルで非常に単純なbashステートメントを実行します。 コマンドの出力は「Hello, World」になります。


```:はじめてのecho
$ echo "Hello, World";
Hello, World
$
```

 はじめてのbashスクリプト「vim」

```bash:はじめてのbashスクリプト
$ vim HelloWorld.sh
＜空のvim HelloWorld.sh が開きます＞
```

vimで開いたHelloWorld.shを編集します。

```bash:HelloWorld.sh
#!/bin/bash

echo "Hello World";
```

{{% tips-list tips %}}
ヒント
: echo の後ろに続く文字列は 「""」（ダブるクォーテーション）または、「''」（シングルクォーテーション）で囲みましょう。
: 行末の「;」（セミコロン）も忘れずに。
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




