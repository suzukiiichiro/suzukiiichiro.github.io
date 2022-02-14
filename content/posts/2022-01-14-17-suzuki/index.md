---
authors: suzuki
title: "【１７．変数に2つの数値を追加します】ざっくりわかる「シェルスクリプト」"
description: "さまざまな方法でbashの算術演算を実行できます。次のスクリプトに、二重角かっこを使用してbashに2つの整数を追加する方法を示します。次のコードを使用して、「add_numbers.sh」という名前のファイルを作成します。2つの整数値がユーザーから取得され、加算の結果が出力されます。"
date: 2022-01-12T12:30:57+09:00
draft: false
image: shellscript.jpg
categories:
  - programming
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---



# 変数に2つの数値を追加します
<font color=orange><b>2つの数字を追加します。</b></font>
さまざまな方法でbashの算術演算を実行できます。次のスクリプトに、二重角かっこを使用してbashに2つの整数を追加する方法を示します。次のコードを使用して、「add_numbers.sh」という名前のファイルを作成します。2つの整数値がユーザーから取得され、加算の結果が出力されます。

``` bash:add_numbers.sh
#!/bin/bash

echo "最初の数値を入力";
read x;
echo "2番目の数値を入力";
read y;

((sum=x+y));

echo "加算の結果=$sum";
```

bashコマンドでファイルを実行します。

```
$ bash add_numbers.sh
最初の数値を入力
25
2番目の数値を入力
56
加算の結果=81
$
```


{{% tips-list tips %}}
ヒント
: ((sum=x+y));
: 昔の書籍でシェルスクリプトを勉強している人は、驚くかもしれない。だが、今の時代、Bashでは上記のように書く。昔は

: $ echo \`expr 1 + 1\`

: こんな書き方をした。現在のBashでは算術演算子が使える。
: 以下ににまとめてみた。2重括弧でくくればいい。2重括弧の中に変数を使うことも可能だ。さらに変数は見にくい「$」をつける必要すらない。
{{% /tips-list %}}

```bash:算術演算子 
$ echo `expr 1+1` # 昔のやり方
$ echo $((5+5))   # 今のやり方
$ echo $((5-5))
$ echo $((5*5))
$ echo $((5/5))
$ echo $((5%5))

# なんと比較演算子もいける！
$ echo $((0==1))  # 等号、結果: 0
$ echo $((0!=1))  # 否定等号、結果: 1
$ echo $((0<1))   # 未満、結果: 1
$ echo $((0<=1))  # 以下、結果: 1
$ echo $((0>1))   # 大なり、結果: 0
$ echo $((0>=1))  # 以上、結果: 0
```

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



<!-- EOL -->
