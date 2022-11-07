---
authors: suzuki
date: 2022-01-14T10:16:57+09:00
title: "【１．Hello World】ざっくりわかる「シェルスクリプト」"
date: 2022-01-07T10:03:12+09:00
description: "ターミナルで非常に単純なbashステートメントを実行します。 コマンドの出力は「Hello, World」になります。"
draft: false
image: shellscript.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## Hello World
<font color=orange><b>はじめてのbashコマンド「echo」</b></font>
ターミナルで非常に単純なbashステートメントを実行します。 コマンドの出力は「Hello, World」になります。


```:はじめてのecho
$ echo "Hello, World"
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

 はじめての実行権限「chmod」
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
{{% tips-list tips %}}
ヒント
: $ ./ でファイルを実行する場合、ソースファイルの先頭行に記載されている

: #!/bin/bash

: という記述をつかって実行されます。
 
: $ ./<ファイル名> 
 
: で実行した場合は、bashコマンド（/bin/bash )を使って実行することを、ソースファイルの先頭で宣言している。という事になります。
: このソースファイルの1行目の記述を「シェバン」と言います。

: /usr/local/bin/awk

: にあるコマンドを使ってソースファイルを実行( ./<ファイル名>）したい場合は、ソースファイルの先頭行に

: #!/usr/local/bin/awk

: と、記述します。
{{% /tips-list %}}


chmod の実行権限には +x で実行権限を付与する方法の他、0755 などの数字で付与する場合もあります。
これらを<font color=red>パーミッション</font>と言います。

{{% tips-list tips %}}
ヒント
: 考え方ですが、bashコマンドでファイルを実行する場合のメリットは、ファイルに実行権限をやみくもに与える必要がないことです。
: 同時に、第三者が簡単にファイルを実行できる事を防ぐ、自分自身が誤ってファイルを実行してしまうというケアレスミスを防ぐことができます。
: 実行権限を与える方法は、一般的ではありますが、注意も必要です。
{{% /tips-list %}}


 パーミッションの確認
ターミナルのコマンドでカレントディレクトリ内のファイルやディレクトリの情報を確認します。

```
$ls -l
```
上記のコマンドを実行すると、以下のような一覧が表示されるかと思います。

```
-rw-r--r--  1 user group      9  1月 1 00:00 hoge.txt
drwxr-xr-x  6 user group  20480  1月 1 00:00 ダウンロード
```

 パーミッションの読み方
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

 アクセス権限の変更
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
 モードの数字について
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

{{% tips-list tips %}}
ヒント
: 実行したい場合は $ chmod 755 <ファイル名>
: 読み取りのみを許可し、実行しない場合は $ chmod 644 <ファイル名>
: 自分だけの読み取りを許可する場合は $ chmod 600 <ファイル名>
: 通常は上記３種類しか使いません。
: CGI などを使う場合は $ chown や $chgrp を組み合わせて使うことが多いです。
: $ chmod 777 <ファイル名> というパーミッションを軽率に与えず、上手にコマンドを使いこなすことがセキュリティにつながります。
{{% /tips-list %}}

詳しくはこちら
https://qiita.com/shisama/items/5f4c4fa768642aad9e06




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


