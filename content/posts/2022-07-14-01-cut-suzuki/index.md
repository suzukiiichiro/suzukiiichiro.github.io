---
title: "（１６）【cut】シェルスクリプトコマンド活用紹介"
description: "行から固定長またはフィールド単位で切り出す"
date: 2022-07-14T11:19:55+09:00
draft: false

authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - コマンド活用
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## cutコマンド
- 文字数を指定して切り出す
- フィールドを指定して切り出す
- 出力の区切り文字を変更する

## cutコマンド概要
　「cut」は、ファイルを読み込んで、それぞれの行から指定した部分だけを切り出すコマンドです。例えば、「3文字目から10文字目」や、タブなどで区切られたファイルから「1番目のフィールドと3番目のフィールド」のように選んで取り出すことができます。


## cutコマンドの書式
cut オプション [ファイル]


## cutコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-c            |切り出す位置のリストを文字数で指定する|
|-f 1,3または1-3|切り出す位置のリストをタブ区切りのフィールドで指定する（区切り文字は「-d」オプションで変更可能）|
|-d '文字'     |フィールドの区切り文字として、タブの代わりに使用する文字を指定する（1文字のみ）|


## cutコマンド詳細説明

### 文字数を指定して切り出す

cutコマンドで頭から4文字を切り出す
```
$ STR="Hello World"
$ echo $string | cut -c 1-4 
Hell
```


bashの文字列変数で頭から4文字を切す
```
$ STR="Hello World"
$ echo ${STR:0:4}
Hell
```


sedコマンドで先頭から4文字切り出す
```
$ STR="Hello World"
$ echo "${STR}" | sed 's/^\(.\{4\}\).*$/\1/'
Hell
```


### フィールドを指定して切り出す
フィールドの区切り文字は、デフォルトで ,(カンマ）とTAB(タブ）です。
特に指定しなければ、cutコマンドが考えて区切り文字として認識してくれます。
ただカンマとTABが混在している場合は不安ですね。
次の項で、区切り文字（デリミタ）を指定する方法を説明します。


区切り文字のデフォルトがカンマとタブだから
/etc/passwdのようにデリミタを指定しないときちんと区切られない。
```
$ sudo cat /etc/passwd | cut -f 1,7 | tail
_findmydevice:*:254:254:Find My Device Daemon:/var/db/findmydevice:/usr/bin/false
_datadetectors:*:257:257:DataDetectors:/var/db/datadetectors:/usr/bin/false
_captiveagent:*:258:258:captiveagent:/var/empty:/usr/bin/false
_ctkd:*:259:259:ctkd Account:/var/empty:/usr/bin/false
_applepay:*:260:260:applepay Account:/var/db/applepay:/usr/bin/false
_hidd:*:261:261:HID Service User:/var/db/hidd:/usr/bin/false
_cmiodalassistants:*:262:262:CoreMedia IO Assistants User:/var/db/cmiodalassistants:/usr/bin/false
_analyticsd:*:263:263:Analytics Daemon:/var/db/analyticsd:/usr/bin/false
_fpsd:*:265:265:FPS Daemon:/var/db/fpsd:/usr/bin/false
_timed:*:266:266:Time Sync Daemon:/var/db/timed:/usr/bin/false
```


デリミタを指定した場合はきちんと１番目、７番目のフィールドが切り取られました
まずはcutコマンドで実現します。
```
$ sudo cat /etc/passwd | cut -f 1,7 -d ':' | tail
_findmydevice:/usr/bin/false
_datadetectors:/usr/bin/false
_captiveagent:/usr/bin/false
_ctkd:/usr/bin/false
_applepay:/usr/bin/false
_hidd:/usr/bin/false
_cmiodalassistants:/usr/bin/false
_analyticsd:/usr/bin/false
_fpsd:/usr/bin/false
_timed:/usr/bin/false
$
```

同じことをawkコマンドでやってみます。デリミタの区切り指定は -F です。
```
$ sudo cat /etc/passwd | awk -F ':' '{ print $1":"$7;}' | tail
_findmydevice:/usr/bin/false
_datadetectors:/usr/bin/false
_captiveagent:/usr/bin/false
_ctkd:/usr/bin/false
_applepay:/usr/bin/false
_hidd:/usr/bin/false
_cmiodalassistants:/usr/bin/false
_analyticsd:/usr/bin/false
_fpsd:/usr/bin/false
_timed:/usr/bin/false
$
```

{{% tips-list tips %}}
ヒント
: 文字を切り出す方法にもいくつかありますし、フィールドの切り出しにもいろいろな方法があります。用途に合わせて使い分けてください。最初のうちは、一つの方法を覚えておけばよいです。
{{% /tips-list %}}

## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/procutct/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/procutct/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/procutct/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/procutct/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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









