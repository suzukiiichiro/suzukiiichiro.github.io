---
title: "Python入門 回文かどうかを調べたいのですが？"
date: 2023-06-06T15:47:48+09:00
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

## 回文かどうかを調べたいのですが？
回文とは、「上から読んでも下から読んでも同じ」文、または語句のことです。
ここでは簡単に「madam」や「racecar」が回文にあたるということで調査してみます。


### 方法１．`for`ループでチェックする
```python
#!/usr/local/env python3

def is_palindrome(string):
  # 文字列を半分に分割します。余りは切り捨てます。
  # print(len(string)//2) # 3
  for i in range(len(string) // 2): 
    # 文字列の先頭 `0` から順番に文字を取り出します
    print("string[",i,"]:" ,string[i])
    # 文字列の末尾 `-i-1` から順番に文字を取り出します。
    print("string[",-i,"-1]",string[-i-1]);
    # 先頭と末尾を比較します。
    # 同じであれば、先頭を一つ進め、末尾を一つ後退させます。
    if string[i] != string[-i - 1]:
      # 違っていたら即座に `for`を抜けて`False`を返します。
      return False
    # 先頭と末尾の比較が完了したら回文なので`True`を返します。
    print("先頭",i)
  return True

print(is_palindrome("racecar"))
# True
print(is_palindrome("python"))
# False
```

```
racecar :string[ 0 ]: r
racecar :string[ 0 -1] r
racecar :先頭 0
racecar :string[ 1 ]: a
racecar :string[ -1 -1] a
racecar :先頭 1
racecar :string[ 2 ]: c
racecar :string[ -2 -1] c
racecar :先頭 2
True
python :string[ 0 ]: p
python :string[ 0 -1] n
False
```

### 方法２．reversed()を使ってチェックする
```python
def is_palindrome(string):
  return string == "".join(reversed(string))
print(is_palindrome("madam"))
print(is_palindrome("python"))
```

```
True
False
```

### 方法３．文字列スライスを使ってチェックする
```python
import re
def is_palindrome ( string ) :
    string = re.sub ( r "[^a-zA-Z0-9]" , "" , string )
    string = string. lower ( )
    return string == string [ ::- 1 ]
print ( is_palindrome ( "racecar" ) )
print ( is_palindrome ( "python" ) )
```
`sub()` メソッドは、文字列から英数字以外の文字を削除するためにユーザー定義関数内で使用されます。
`lower()` メソッドは、文字列を小文字に変換するために使用されます。

```
True
False
```

指定された文字列が回文であるかどうかを確認するには、Python では` for`、`reversed()`、`slicing` が使用されます。
`for` は文字列を最初から最後まで繰り返し、各文字を反対の文字と比較して、議論されている条件をチェックします。
また、`reversed()` と `文字列スライス` を使用して指定された文字列が回文であるかどうかを確認することもできます。

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



