---
title: "（１３）【tr】シェルスクリプトコマンド活用紹介"
description: "テキストファイルの文字を置換する"
date: 2022-07-08T11:17:58+09:00
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

## trコマンド
- 文字を置換する
- 大文字／小文字を変換する
- 改行を除去する
- 固定長のデータをタブ区切りに変換する／カンマ区切りに変換する


## trコマンド概要
　「tr」は、文字を置き換えるためのコマンドです。指定した文字を別の文字に置き換えたり、指定した文字を削除したり、文字が連続している場合には1つにまとめたりすることもできます。

ですが、sedでもっと細かく制御できるので、trは「改行を除去する」ためのコマンドに成り果ててしまいました。ここでは改行を除去することだけにフォーカスしてご説明します。

## trコマンドの書式
tr [オプション] 文字セット1 [文字セット2]


## trコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-d|'文字'を削除する|



## trコマンド詳細説明

### 文字を置換する

sedを使いましょう。
```
$ tr 012 abc
```

{{% tips-list tips %}}
ヒント
: 012 という文字列を置き換えるのではなく、0をaに、1をbに、2をcに置き換えます。
{{% /tips-list %}}


### 大文字／小文字を変換する

sedを使いましょう。


大文字／小文字を変換する
```
$ tr ABC abc
```

{{% tips-list tips %}}
ヒント
: ABC という文字列を置き換えるのではなく、Aをaに、Bをbに、Cをcに置き換えます。
{{% /tips-list %}}


　また、文字を範囲で指定することも可能です。「tr A-Z a-z」で「A」は「a」に、「B」は「b」に……と対応する文字に置き換えられます。

```
$ tr A-Z a-z
```

### 改行を除去する

　「-d」オプションで、指定した文字を削除することができます。

ファイル中の改行を除去
```
$ cat sample.txt | tr -d '\n' > 出力ファイル名
```

文字列中の改行を除去
```
$ echo "$string_sample" | tr -d '\n' 
```

{{% tips-list tips %}}
ヒント
: trコマンドの唯一の利点、sedより優れているただ一つの機能、それが tr -d '\n' です。
{{% /tips-list %}}

{{% tips-list alert %}}
重要
: tr -d '\n' のくくりはシングルクォーテーションである必要があります。ダブルクォーテーションではいけません。理由は「文字列」ではなく「文字（一文字）」しか扱えないからです。
{{% /tips-list %}}


### 固定長のデータをタブ区切りに変換する／カンマ区切りに変換する

ls -la コマンドで普通に出力します。
```
$ ls -la
drwxr-xr-x  13 suzukiiichiro  staff     416  7 14 13:31 ./
drwxrwxrwx+ 48 suzukiiichiro  staff    1536  7  5 10:05 ../
drwxrwxrwx   7 suzukiiichiro  staff     224  4 10  2020 AI_Algorithm_Game_Bash/
drwxrwxrwx  18 suzukiiichiro  staff     576  4 10  2020 AI_Algorithm_Game_Chess/
drwxrwxrwx  39 suzukiiichiro  staff    1248  4 10  2020 AI_Algorithm_Game_Othello/
drwxrwxrwx  31 suzukiiichiro  staff     992  4 10  2020 AI_Algorithm_Game_RubiksCube/
drwxrwxrwx  33 suzukiiichiro  staff    1056  4 10  2020 AI_Algorithm_Game_Shogi/
drwxrwxrwx   7 suzukiiichiro  staff     224  4 10  2020 C_Othello/
```


連続した空白をタブに変換します。
```
$ ls -l | tr -s " " "\t"
total	528
drwxrwxrwx	7	suzukiiichiro	staff	224	4	10	2020	AI_Algorithm_Game_Bash/
drwxrwxrwx	18	suzukiiichiro	staff	576	4	10	2020	AI_Algorithm_Game_Chess/
drwxrwxrwx	39	suzukiiichiro	staff	1248	4	10	2020	AI_Algorithm_Game_Othello/
drwxrwxrwx	31	suzukiiichiro	staff	992	4	10	2020	AI_Algorithm_Game_RubiksCube/
drwxrwxrwx	33	suzukiiichiro	staff	1056	4	10	2020	AI_Algorithm_Game_Shogi/
drwxrwxrwx	7	suzukiiichiro	staff	224	4	10	2020	C_Othello/
```

連続した空白をカンマに変換します。
```
$ ls -l | tr -s " " ","
drwxrwxrwx,7,suzukiiichiro,staff,224,4,10,2020,AI_Algorithm_Game_Bash/
drwxrwxrwx,18,suzukiiichiro,staff,576,4,10,2020,AI_Algorithm_Game_Chess/
drwxrwxrwx,39,suzukiiichiro,staff,1248,4,10,2020,AI_Algorithm_Game_Othello/
drwxrwxrwx,31,suzukiiichiro,staff,992,4,10,2020,AI_Algorithm_Game_RubiksCube/
drwxrwxrwx,33,suzukiiichiro,staff,1056,4,10,2020,AI_Algorithm_Game_Shogi/
drwxrwxrwx,7,suzukiiichiro,staff,224,4,10,2020,C_Othello/
```



## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

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

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

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







