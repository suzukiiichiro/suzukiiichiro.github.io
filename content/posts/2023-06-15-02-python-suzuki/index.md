---
title: "Python入門 配列（リスト）を初期化したいのですが？"
date: 2023-06-15T10:50:10+09:00
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

## 配列（リスト）を初期化したいのですが？
ここでは配列（リスト）を初期化する方法をまとめる。


リスト（配列）を初期化するには、幾つかの方法があります。
・角かっこ「[]」内に、その要素をカンマ「,」で区切って並べていく
・list関数にその要素となるものを格納している反復可能オブジェクトを与える
・リスト内包表記を使用する

では順番に見ていきましょう。

## リスト（配列）の初期化：角かっこ「[]」で囲み、要素をカンマ「,」区切りで並べる
要素を持たない空のリスト（空の配列）を作成するには、角かっこに何も含めないか、後で見るlist関数に引数を指定しないで呼び出せばよいです。
```python
empty_list = []  # 空のリスト
print(empty_list)  # []
```

リストに要素を含めるには、それらをカンマで区切って並べていきます。
```python
int_list = [0, 1, 2]  # 整数リスト（整数配列）
print(int_list)  # [0, 1, 2]
```

要素には、インデックスを用いてアクセスしたり、for文で列挙したりすることで使用できます。
```python
print(int_list[0])  # 先頭要素にアクセス：1
print(str_list[-1])  # 末尾要素にアクセス：baz
for item in str_list:
  print(item)  # foo、bar、bazが順番に表示される
```

nt型の配列には整数しか格納できない、ということをよく聞きますが、Pythonのリストではそういうことはありません。
```python
mylist = [0, 'abc', 1, 'def']  # リスト（配列）には任意の型の要素を格納できる
print(mylist)  # [0, 'abc', 1, 'def']

```

## リスト（配列）の初期化：list関数を呼び出す
リスト（配列）は、list関数を使っても作成できます。
このときには、既に見たように引数を指定しなければ空のリストが作成されます。
そうでないときには、リストの要素となるものを格納している反復可能オブジェクトを引数に指定します。
```python
int_list = list()  # 空のリスト（配列）
print(int_list)  # []

```
### 反復可能オブジェクト（タプル）からリストを作成
```python
int_tuple = (0, 1, 2)
int_list = list(int_tuple)  
print(int_list)  # [0, 1, 2]
```

### タプルの要素を基にリスト（配列）が作成される
```python
int_list = list((4, 5, 6))  
print(int_list)  # [4, 5, 6]

```

### rangeオブジェクトから整数リスト（整数配列）を作成
```python
int_list = list(range(5))  
print(int_list)  # [0, 1, 2, 3, 4]

```

### 文字列の各文字を要素とするリストを作成
```python
str_list = list('python')  
print(str_list)  # ['p', 'y', 't', 'h', 'o', 'n']

```

## リスト内包表記
　Pythonではリスト内包表記という方法でもリスト（配列）を初期化できる。その基本構文は次のようになっています。

```python
[変数を使って要素の値を計算する式 for 変数 in 反復可能オブジェクト]
```

実際にはこれは、以下のfor文と同じ意味となります。

```python
結果を保存するリスト = []
for 変数 in 反復可能オブジェクト:
    結果を保存するリスト.append(変数を使って要素の値を計算する式)
```

### rangeオブジェクトからリストを作成
```python
int_list = [x for x in range(0, 10, 2)]  
print(int_list)  # [0, 2, 4, 6, 8]

```

### if節を用いる例
　リスト内包表記のfor節には続けてif節を記述できます。
これは反復可能オブジェクトから取り出した値が特定の条件に合致するときにだけ、「変数を使って要素の値を計算する式」の評価を行うために使用します。
```python
int_list = [x for x in range(10) if x % 2 == 1]  
print(int_list)  # [1, 3, 5, 7, 9]

```

### if else式を使うときにはfor節に続けずに、内包表記の先頭に記述する
変数xに取り出した値が条件に合致しないときにも、何らかの値を算出したいという場合がある。
そうしたときには、for節に続けてif節を記述するのではなく、要素の値を計算する式の中で三項演算子（if式）を記述します。
```python
str_list = [c.upper() if c.islower() else c.lower() for c in 'AbCdE']
print(str_list)  # ['a', 'B', 'c', 'D', 'e']

```

ここでは、反復可能オブジェクトとして文字列'AbCdE'を用いている。
新しく作成するリストの要素の値を計算する式は「c.upper() if c.islower() else c.lower()」です。
これは、文字列の個々の文字が小文字かどうかを調べて、小文字であればそれをupperメソッドで大文字化して、そうでなければlowerメソッドで小文字化します。
よって、元の文字列とは大文字小文字が反転したものを要素とするリストが得られるということです。


## リストのリスト（配列の配列）
最後にリストのリスト（配列の配列）、つまりリストを要素とするリストの初期化についても簡単に見ておく。といっても、難しいことはなく、角かっこの中にさらに角かっこを使って記述していくだけだ。あるいは、角かっこの中に既存のリストを置いてもよい。


### 2次元のリスト（配列）の作成
```python
mylist = [[0, 1, 2], [3, 4, 5]]  
print(mylist)  # [[0, 1, 2], [3, 4, 5]]

```

リスト内包表記でリストのリストを作成するには、リスト内包表記の内部でもう一度リスト内包表記を使用します。
```python
mul_tbl = [[x * y for x in range(1, 4)] for y in range(1, 5)]
print(mul_tbl)  # [[1, 2, 3], [2, 4, 6], [3, 6, 9], [4, 8, 12]]
```

上のコードと同等なコードをfor文で書き下すと次のようになる。
```python
mul_tbl = []
for y in range(1, 4):
    tmp = []
    for x in range(1, 5):
        tmp.append(x * y)
    mul_tbl.append(tmp)

print(mul_tbl)  # [[1, 2, 3, 4], [2, 4, 6, 8], [3, 6, 9, 12]]
```



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











