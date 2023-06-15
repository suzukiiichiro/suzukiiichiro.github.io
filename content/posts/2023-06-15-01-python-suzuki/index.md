---
title: "Python入門 配列（リスト）をコピーしたいのですが？"
date: 2023-06-15T10:13:59+09:00
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

## 配列（リスト）をコピーしたいのですが？
できます。

が、しかしコピーには２種類あります。

```
コピー先 = コピー元
```

こういった形でコピーしたいとします。
この場合のコピーは「参照」となります。

具体的に言うと、コピー先で値を変更すると、コピー元もその変更が反映され、その逆もしかりです。

コピー元のエイリアスが「コピー先」という理解で良いと思います。

C言語では、アドレスとポインタと同じです。

そこで、コピー元とは別に新規に複写してコピー先を作りたい場合、Pythonでは`copy()`を使います。

```python
コピー先　コピー元
B_value = A_value.copy()
```

こうすることによって、コピー元とはまったく別に複写したコピー先の配列（リスト）が生成されます。

コピー先の配列データを変更しても、元の配列データには一切影響はありません。

こうしたコピーと参照をうまく使い分けてプログラミングができるとレベルが上がるというものです。

##　とはなりません。
とはならないのです。そんな簡単な話ではありません。

`A_value=B_value` は参照

`A_value=B_value.copy()`は正確には「浅いコピー」となり、とうぜん「深いコピー」が存在します。

・浅いコピー `shallow copy`
・深いコピー `deep copy`

違いをわかりやすくします。

```python
import copy

l = [0, 1, [2, 3]]
l_assign = l                   # assignment
l_copy = l.copy()              # shallow copy
l_deepcopy = copy.deepcopy(l)  # deep copy

l[1] = 100
l[2][0] = 200
print(l)
# [0, 100, [200, 3]]

print(l_assign)
# [0, 100, [200, 3]]

print(l_copy)
# [0, 1, [200, 3]]

print(l_deepcopy)
# [0, 1, [2, 3]]
```

普通は、「浅いコピー」で問題ないと思います。
通常、浅いコピーが一般的です。が、配列の中にオブジェクトがある場合は、`copy()`しても配列の中のオブジェクトは、「参照」を`copy()`します（ここが大問題）

ですので、配列の中にオブジェクトがない場合は普通に`copy()`で大丈夫なのです。
逆に、参照関係で、一方で値を変更したら、その変更が反映されたい。
という場合は、`A_value=B_value`で良いですね。




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










