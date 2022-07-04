---
title: "（８）【grep】シェルスクリプトコマンド活用紹介"
description: "指定した文字が含まれている行だけを抽出する"
date: 2022-07-04T13:21:13+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - kill
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## grepコマンド
- コマンドの実行結果から必要な箇所だけを抽出する
- 単語単位で検索する
- 前後の行も表示する
- 行番号付きで表示する
- 複数の文字列を指定して検索する
- 複数の文字列を指定して検索する（正規表現）
- 検索文字列をファイルから読み込む
- どちらも含む行を探したい場合
- 文字列を含まない行を対象にする

## grepコマンド概要
「grep」は、ファイルの中で「文字列（パターン）」が含まれている行を表示するコマンドです。検索対象には、複数のファイルやディレクトリを指定できます。

## grepコマンドの書式
grep [オプション] 検索パターン ファイル
コマンド | grep [オプション] 検索パターン


## grepコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-i            |大文字と小文字を区別しない|
|-v            |パターンに一致しない行を表示する|
|-n            |行番号を併せて表示する|
|-C            |一致した行の前後の行も表示する|
|-e            |検索パターンを指定する|
|-f            |ファイルに書かれているパターンを検索する|

## grepコマンド詳細説明

### コマンドの実行結果から必要な箇所だけを抽出する
　「dmesg」コマンド（起動時のシステムメッセージを再表示するコマンド）の実行結果から、grepコマンドで“video”という文字列を含む行だけを表示したい場合は「dmesg | grep video」と指定します 

```
$ dmesg | grep video
```

### 単語単位で検索する
先ほどの検索で、「video」という文字列を検索しましたが、検索結果には「video」と「vboxvideo」が表示されていました。“videoという単語のみ”を検索対象としたい場合には、「-w」オプション（--word-regexp）を使用します

```
$ dmesg | grep -w video
```

### 前後の行も表示する

　文字列を検索する際には、該当する行の前後も表示されていると分かりやすい場合があります。例えば、前後2行ずつ表示したい場合は、「-2」のように数字で指定します。これは「-C（--context=）」オプションと同じです。

```
$ dmesg | grep -w -C2 video
```

### 行番号付きで表示する

grepコマンドでの検索結果に行番号を付けて表示したい場合は、「-n」オプション（--line-number）を使用します。「行番号:」のように表示されますが、前後の行も併せて表示している場合は、前後の行は「行番号-」のように「-」記号で、該当する行は「:」記号で示されます。

```
$ dmesg | grep -w -C2 -n video
```

### 複数の文字列を指定して検索する

grepコマンドで「videoまたはnetworkを含む行を検索」のように、複数の文字列を検索したい場合には、「-e」オプションを付けて、それぞれが「検索パターン」であることを明示します。

```
$ dmesg | grep -i -e network -e video
```

### 複数の文字列を指定して検索する

複数の文字列を検索したい場合、正規表現で“または”という意味の「|」記号を使って指定することもできます。

```
$ dmesg | grep -i "network\|video"
```

### 検索文字列をファイルから読み込む

検索したい文字列が常に決まっている場合や、他のコマンドで単語をリストアップしているなどで、検索文字列のリストがあるような場合、「-f」オプションでリストのファイルを指定するとよいでしょう。

```
$ cat wordlist
network
video
$ dmesg | grep -i -f wordlist
```

### どちらも含む行を探したい場合

　「どちらの検索ワードも含む行」としたい場合は、検索結果をさらにgrepするのが簡単です。

```
$ dmesg | grep -i video
$ dmesg | grep -i network 

# どちらの検索ワードも含む行
$ dmesg | grep -i video | grep -i network
```

### 文字列を含まない行を対象にする
grepコマンドで「～を含まない行」だけを表示したい場合は「-v」オプション（「--invert-match」オプション）を使います。

```
# network を含みvideoを含まない検索結果
$ dmesg | grep -i network | grep -v video
```

{{% tips-list tips %}}
ヒント
: -v オプションはgrepコマンドのオプションの中で最も強力で利用頻度が高いです。「パターンに一致しない行を表示する」という意味合いとなります。
{{% /tips-list %}}

## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/product/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/product/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


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
imageUrl="https://m.media-amazon.com/images/I/41i956UyusL._SL250_.jpg"
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
imageUrl="https://m.media-amazon.com/images/I/41d1D6rgDiL._SL250_.jpg"
%}}


