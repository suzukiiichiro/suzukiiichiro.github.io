---
title: "Python入門 ファイルを読み込みたいのですが？"
date: 2023-06-07T12:01:45+09:00
draft: false
authors: suzuki
image: python.jpg
categories:
  - programming
tags:
  - python
  - 鈴木維一郎
---

![](python.jpg)

## ファイルを読み込みたいのですが？
以下のファイルを読み込みたいと思います。

```python:lang.txt
language
python
ruby
java
swift
javascript
php
```
### 方法１．`readline()`で一行ずつ読み込む
ファイルの読み込みは以下の順番で実行されます。
１．ファイルを開いて読み込む
２．内容を格納する
３．読み込んだファイルを閉じる

１の読み込むときには「モード」があります。
読み取り：r
読み取りと書き込み：w

ファイルを読み込み終わったら忘れずに`close()`します。

```python
#!/usr/local/env python3

f = open('lang.txt', 'r')
line = f.readline()
 
while line:
  print(line)
  line = f.readline() # 次の行の読み込み
f.close()
```

```
language
 
python
 
ruby
 
java
 
swift
 
javascript
 
php
```
行間が１行あるのが気になりますが、次に行きます。


### 方法２．`readlines()`で一行ずつ読みリストに格納する
```python
#!/usr/local/env python3

f = open('lang.txt', 'r')
list = f.readlines()
for line in list:
    print(line)
f.close()
```

```
language
 
python
 
ruby
 
java
 
swift
 
javascript
 
php
```

### 方法３．`read()`でファイル全文を読み込む
```python
#!/usr/local/env python3

f = open('lang.txt', 'r')
text = f.read()
print(text)
f.close()
```


```
language
python
ruby
java
swift
javascript
php
```

### 一行空いてしまうのはなんとかならないのですか？
最後に行間に一行空いてしまう問題ですが、以下のように置換すると余分な行間が削除できます。

```python
line = line.replace("\n", "")
```

具体的には以下のとおりです。
```python
#!/usr/local/env python3

f = open('lang.txt', 'r')
list = f.readlines()
for line in list:
  line=line.replace("\n","")
  print(line)
f.close()
```

```
language
python
ruby
java
swift
javascript
php
```

以下のように一行にまとめて書くこともできます。
好き好きです。

```python
#!/usr/local/env python3

f = open('lang.txt', 'r')
list = f.readlines()
for line in list:
  # line=line.replace("\n","")
  # print(line)
  print(line.replace("\n",""))
f.close()



## 書籍の紹介
{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/proteect/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/proteect/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/proteect/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/proteect/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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


```
