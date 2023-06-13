---
title: "Python入門 compile関数ってどんなときに使うのですか？"
date: 2023-06-07T16:04:46+09:00
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

## compile関数ってどんなときに使うのですか？
まず、pythonはインタープリタ言語です。
インタープリタ言語はソースコードを１行ずつ実行します。
Bashなどのシェルスクリプト、ＰＨＰなどもインタプリタです。

ＣやＪａｖａはコンパイラ言語です。
コンパイラによってソースコードは最適化され、ＣＰＵネイティブなバイトコードに変換され高速に実行します。

ソースコードのロジックやアルゴリズムが同等であれば、速度はコンパイラ言語が速いです。

ロジックやアルゴリズムが稚拙なＣコードであれば、優れたインタプリタ言語のソースコードも、コンパイラ言語の速度に近づけることができができます。が、そんなに甘くはありません。

インタプリタ言語は速度は遅くとも、作る時間を短縮できる（といわれている）
コンパイラ言語は、速度は速くとも、構文難易度が高く、サクサク作ることができる人はそんなに多くない。

#### コンパイルすることのメリット
pythonのコンパイルには２種類あります。

１．ソースファイルをコンパイルする
ソースファイルを公開したくない場合、コンパイルによってバイトコードに変換したファイルを公開する。ということができます。

```
$ python -m compileall xxxxx.py
```
コンパイルを実行すると `__pycache__`ディレクトリが作成され、`.pyc`ファイルが生成されます。
このファイルは実行可能ファイルとなり、バイトコードに変換されていることにより、テキストエディタで読み理解することはできません。

２．実行が速くなる
処理速度は速くなりません。手続きが簡略化されソースの可読性は上がりますが、処理自体は未コンパイルと同じです。

３．ソースコード内に何度もできくる計算式・正規表現などをコンパイルしておき、使い回す

今回は「３」について深掘りしていきます。

### `compile()`を使わない普通のソース
```python
#!/usr/local/env python3
import re

p = "<b>(.+)</b>"              # パターン
s = "<div><b>hello</b></div>"  # 検索対象文字列
m = re.search(p, s)            # search()関数

print(m.group(1)) 
# hello;
```

### `compile()`を使った気の利いたソース
```python
#!/usr/local/env python3

import re

p = "<b>(.+)</b>"              # パターン
s = "<div><b>hello</b></div>"  # 検索対象文字 
reg = re.compile(p)            # コンパイル

m = reg.search(s)              # search()メソッド

print(m.group(1)) 
# hello;
```

同じパターンを何度も使い回す場合は、`compile()`を使ったほうがよいです。速度というよりもソースの可読性のメリットが大きいです。
これにより多少の速度の改善は見込めますが、コンパイラ言語では、コンパイラによって自動的になされることではあります。




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



