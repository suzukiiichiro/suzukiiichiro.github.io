---
authors: suzuki
title: "【２５．ファイルに追加】ざっくりわかる「シェルスクリプト」"
description: "bashで「>>」演算子を使用すると、既存のファイルに新しいデータを追加できます。'append_file.sh 'という名前のファイルを作成し、次のコードを追加して、ファイルの最後に新しいコンテンツを追加します。ここで、「Learning Level 5」は、スクリプトの実行後に「level.txt」ファイルのに追加されます。 "
date: 2022-01-13T11:26:13+09:00
draft: false
image: shellscript.jpg
categories:
  - プログラミング
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---


# ファイルに追加
<font color=orange><b>ファイルに追加：</b></font>
bashで「>>」演算子を使用すると、既存のファイルに新しいデータを追加できます。'append_file.sh 'という名前のファイルを作成し、次のコードを追加して、ファイルの最後に新しいコンテンツを追加します。ここで、「Learning Level 5」は、スクリプトの実行後に「book.txt」ファイルのに追加されます。

```:book.txt
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
```

``` bash_append_file.sh
#!/bin/bash

echo "追加する前のファイル";
cat book.txt;

echo "5. Bash Programming" >> book.txt
echo "追加した後のファイル"
cat book.txt;
```

bashコマンドでファイルを実行します。

```
$ bash append_file.sh
追加する前のファイル
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
追加した後のファイル
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
5. Bash Programming
$
```
{{% tips-list tips %}}
ヒント
: 「>」はファイルを新しく作成して追記します。
: 「>>」は既に存在するファイルに追記します。ですので、ファイルが存在しないにもかかわらず、「>>」を行うと、ついするファイルがないため、エラーとなります。
: ファイルの存在を確認するための方法を次の章で説明します。
{{% /tips-list %}}


# 関連記事
[ざっくりわかる シェルスクリプト【０１．Hello World】](https://suzukiiichiro.github.io/posts/2022-01-14-01-suzuki/)
[ざっくりわかる シェルスクリプト【０２．echo コマンド】](https://suzukiiichiro.github.io/posts/2022-01-14-02-suzuki/)
[ざっくりわかる シェルスクリプト【０３．コメント】](https://suzukiiichiro.github.io/posts/2022-01-14-03-suzuki/)
[ざっくりわかる シェルスクリプト【０４．マルチラインコメント】](https://suzukiiichiro.github.io/posts/2022-01-14-04-suzuki/)
[ざっくりわかる シェルスクリプト【０５．while ループ】](https://suzukiiichiro.github.io/posts/2022-01-14-05-suzuki/)
[ざっくりわかる シェルスクリプト【０６．for ループ】](https://suzukiiichiro.github.io/posts/2022-01-14-06-suzuki/)
[ざっくりわかる シェルスクリプト【０７．対話型入力】](https://suzukiiichiro.github.io/posts/2022-01-14-07-suzuki/)
[ざっくりわかる シェルスクリプト【０８．If 文】](https://suzukiiichiro.github.io/posts/2022-01-14-08-suzuki/)
[ざっくりわかる シェルスクリプト【０９and 条件を if 文で使う】](https://suzukiiichiro.github.io/posts/2022-01-14-09-suzuki/)
[ざっくりわかる シェルスクリプト【１０．or 条件を if文で使う】](https://suzukiiichiro.github.io/posts/2022-01-14-10-suzuki/)
[ざっくりわかる シェルスクリプト【１１．else if と else】](https://suzukiiichiro.github.io/posts/2022-01-14-11-suzuki/)
[ざっくりわかる シェルスクリプト【１２．case 文】](https://suzukiiichiro.github.io/posts/2022-01-14-12-suzuki/)
[ざっくりわかる シェルスクリプト【１３．コマンドラインから引数を取得】](https://suzukiiichiro.github.io/posts/2022-01-14-13-suzuki/)
[ざっくりわかる シェルスクリプト【１４．名前を使用してコマンドラインから引数を取得する】](https://suzukiiichiro.github.io/posts/2022-01-14-14-suzuki/)
[ざっくりわかる シェルスクリプト【１５．変数に2つの文字列を組み合わせる】](https://suzukiiichiro.github.io/posts/2022-01-14-15-suzuki/)
[ざっくりわかる シェルスクリプト【１６．文字列の部分文字列を取得する】](https://suzukiiichiro.github.io/posts/2022-01-14-16-suzuki/)
[ざっくりわかる シェルスクリプト【１７．変数に2つの数値を追加します】](https://suzukiiichiro.github.io/posts/2022-01-14-17-suzuki/)
[ざっくりわかる シェルスクリプト【１８．関数を作成する】](https://suzukiiichiro.github.io/posts/2022-01-14-18-suzuki/)
[ざっくりわかる シェルスクリプト【１９．関数パラメーターを使用する】](https://suzukiiichiro.github.io/posts/2022-01-14-19-suzuki/)
[ざっくりわかる シェルスクリプト【２０．スクリプトからの戻り値を渡す】](https://suzukiiichiro.github.io/posts/2022-01-14-20-suzuki/)
[ざっくりわかる シェルスクリプト【２１．ディレクトリを作成する】](https://suzukiiichiro.github.io/posts/2022-01-14-21-suzuki/)
[ざっくりわかる シェルスクリプト【２２．存在を確認してディレクトリを作成する】](https://suzukiiichiro.github.io/posts/2022-01-14-22-suzuki/)
[ざっくりわかる シェルスクリプト【２３．ファイルを読む】](https://suzukiiichiro.github.io/posts/2022-01-14-23-suzuki/)
[ざっくりわかる シェルスクリプト【２４．ファイルを削除する】](https://suzukiiichiro.github.io/posts/2022-01-14-24-suzuki/)
[ざっくりわかる シェルスクリプト【２５．ファイルに追加】](https://suzukiiichiro.github.io/posts/2022-01-14-25-suzuki/)
[ざっくりわかる シェルスクリプト【２６．ファイルが存在するかどうかを確認】](https://suzukiiichiro.github.io/posts/2022-01-14-26-suzuki/)
[ざっくりわかる シェルスクリプト【２７．mailコマンド】](https://suzukiiichiro.github.io/posts/2022-01-14-27-suzuki/)
[ざっくりわかる シェルスクリプト【２８．dateコマンド】](https://suzukiiichiro.github.io/posts/2022-01-14-28-suzuki/)
[ざっくりわかる シェルスクリプト【２９．waitコマンド】](https://suzukiiichiro.github.io/posts/2022-01-14-29-suzuki/)
[ざっくりわかる シェルスクリプト【３０．sleepコマンド】](https://suzukiiichiro.github.io/posts/2022-01-14-30-suzuki/)



[【まとめ版】ざっくりわかるシェルスクリプト１」](https://suzukiiichiro.github.io/posts/2022-01-07-01-suzuki/)
[【まとめ版】ざっくりわかるシェルスクリプト２」](https://suzukiiichiro.github.io/posts/2022-01-12-01-suzuki/)
[【まとめ版】ざっくりわかるシェルスクリプト３」](https://suzukiiichiro.github.io/posts/2022-01-13-01-suzuki/)



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



