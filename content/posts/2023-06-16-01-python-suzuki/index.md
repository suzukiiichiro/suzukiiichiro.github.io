---
title: "Python入門 Pyhonには「変数の型」はあるのですか？"
date: 2023-06-16T16:25:41+09:00
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

## Pythonには「変数の型」はあるのですか？
あります。

色々なプログラミング言語を扱っていると、変数の型を宣言する必要がある言語、ない言語があることに気が付きます。

CやJavaといったコンパイラ言語の多くは変数の型を宣言する必要があります。
BashやPythonといったインタプリタ言語の多くは変数の型を宣言する必要がありません。

コンパイラ言語は、コンパイルすることでソースコードをＣＰＵネイティブなバイナリに変換する際に、変数の型をチェックします。
インタプリタ言語は、１行ずつ読み取り実行しながら、変数の型を調べます。

重要なのは、プログラマにとって、「この変数は`int`だよね」とか、「定数だから代入はできないんだよね」と、理解していることです。

Pythonの場合は、関数の閉じタグや`if` や `for`の閉じタグさえも省略してきたわけで、それによる可読性は上がったでしょ？だから、プログラマがわかっていることは改めて記述する必要はないよね。

という、事になっています。
ただ、わかっていることとはいえ、忘れてしまうことも多いので、プログラマにとって、「ルールで制限をもたせることはバグを少なくできる一つの方法だ」と考える人が多いのも事実です。

プログラマは、コードを書いているうちに、どういったデータを扱っているのかを見失いがちです。
同じような関数を２つ書いてみたり、同一のデータを持つ変数をむやみに量産してしまうのもそういった「制限」に甘えてしまうことが原因なのです。

## そもそもPythonにはどんな方があるのか
たくさんありますが、以下の型が一般的です。

|組み込み型|説明|
|-|-|
|str|文字列|
|int|整数|
|float|浮動小数点数|
|bool|真偽値|
|list|リスト（配列）|
|tuple|タプル（配列）|
|dict|連想配列|
|set|集合型|

## 変数の型を宣言できるのか？
できます。
こういったことを「変数の型をアノテーション」する。と言います。

```python
ash-3.2$ python
Python 3.9.1 (default, Jan 31 2021, 19:51:51)
[Clang 10.0.0 (clang-1000.11.45.5)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> a : int = 0
>>> print(a)
0
>>>
```
なんか逆のような気が・・・。
直感的にCやJavaと逆ではないでしょうか？

Cだと以下のとおりですから。
```c
int a=0;
```

## 適用すべき場所は？
グローバル変数、ローカル変数で宣言するとき
関数の引数と戻り値

```python
#!/usr/local/env python3

# グローバル変数として宣言するときに変数の型を指定
size:int=0
AGE:int=20

# 関数の引数を受け取るときに変数の型を指定
# 戻り値の型は 引数の後ろで指定する
def size_increment(size:int)->int:
  global AGE
  size+=1
  print("AGE: " + str(AGE))
  return size

print("size: " + str(size_increment(size)))
```

```
bash-3.2$ python test.py
AGE: 20
size: 1
bash-3.2$
```

まず簡単なのは、変数を宣言するときです。
```python
# グローバル変数として宣言するときに変数の型を指定
size:int=0
AGE :int=20
```

関数に関して、引数は変数の宣言と形式と同じです。
```python
# 関数の引数を受け取るときに変数の型を指定
def size_increment(size:int)->int:
```

関数の戻り値`return`の型は `->int:`といった書き方となります。
```python
def size_increment(size:int)->int:
```

## ただ問題が
問題は、「型に合わないものは処理しない」わけではないのです。
ひょえー。

でもいいんです。
プログラマが自分で書いたソースをみて間違いに気がつくことも多いです。
ちょっとした気遣いがあとあと楽になることも多いです。

アノテーション、ばんばん書きましょう。



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











