---
title: "Python入門 辞書内包表記ってなんですか？"
date: 2023-06-01T17:08:39+09:00
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

## 辞書内包表記ってなんですか？
要素を順番に”仮変数”に取得し、”条件”に一致するものを使って{キー: 値}を持つ辞書を作るということです。

### ２つのリストからキーと値のペアのリストを生成
ここに２つのリストがあるとします。
```python
list1 = ['M', 'A', 'R', 'I', 'A']
list2 = [55, 16, 44, 22, 94]
```

こういう形にしたいと思います。
```
 {'M': 55, 'A': 94, 'R': 44, 'I': 22}
```

キーと値のペアになっています。
キーがあってもペアがない場合は出力に含まれません。
では、早速やってみましょう。


```python
#!/usr/local/env python3

def dictionary_Comprehension_Python():
  list1 = ['M', 'A', 'R', 'I', 'A']
  list2 = [55, 16, 44, 22, 94]

  com_Dict = { k:v for (k,v) in zip(list1, list2)}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94, 'R': 44, 'I': 22}

dictionary_Comprehension_Python()

```
com_Dict = {}
の中括弧は「辞書を作ります」という意味です。
zip(list1,list2)は、「list1」と「list2」のリスト２つを一つに固めて扱うことを意味します。
for(k,v) は、zip()で一つに固めたリストを、`k`と`v`２つの変数へ順番に取り込み、`k:v`へ順次注ぎ込み、com_Dict配列へ代入します。



### 条件に見合ったリストを生成
さらに条件をつけることもできます。
例えば、値が50以上のキーと値のペアを出力する。とか。

```python
#!/usr/local/env python3

def dictionary_Comprehension_Python():
  list1 = ['M', 'A', 'R', 'I', 'A']
  list2 = [55, 16, 44, 22, 94]

  #
  # 普通にペアを出力
  com_Dict = { k:v for (k,v) in zip(list1, list2)}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94, 'R': 44, 'I': 22}

  #
  # 50以上で出力
  com_Dict = { k:v for (k,v) in zip(list1, list2) if v>50}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94}
  
dictionary_Comprehension_Python()

```

### それでも辞書内包表記を使わない場合
辞書内包表記を使わずに`for`でやる方法は以下のとおりです。

```python
#!/usr/local/env python3

def dictionary_Comprehension_Python():
  list1 = ['M', 'A', 'R', 'I', 'A']
  list2 = [55, 16, 44, 22, 94]

  #
  # 普通にペアを出力
  com_Dict = { k:v for (k,v) in zip(list1, list2)}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94, 'R': 44, 'I': 22}

  #
  # 50以上で出力
  com_Dict = { k:v for (k,v) in zip(list1, list2) if v>50}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94}

  #
  # 辞書内包表記を使わずに出力
  for k, v in zip(list1,list2):
    if v>50:
      com_Dict[k] = v
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94}
    
dictionary_Comprehension_Python()
```

## 辞書内包表記のメリット
辞書内包表記はシンプルに記載できます。
また、辞書内包表記は、辞書内包表記を使用しない記載方法よりも処理速度が速いことが大きなメリットと言えます。




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



