---
authors: suzuki
title: "【２３．ファイルを読む】ざっくりわかる「シェルスクリプト」"
description: "whileループでreadコマンドを使用すると、bashで任意のファイルを1行ずつ読み取ることができます。'read_file.sh'という名前のファイルを作成し、次のコードを追加してください。 別途作成する'book.txt'の内容を読み取ります。"
date: 2022-01-13T11:26:13+09:00
draft: false
image: shellscript.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## ファイルを読む
<font color=orange><b>ファイルを読む：</b></font>
whileループでreadコマンドを使用すると、bashで任意のファイルを1行ずつ読み取ることができます。'read_file.sh'という名前のファイルを作成し、次のコードを追加してください。 別途作成する'book.txt'の内容を読み取ります。

「book.txt」ファイルを作成します。

```
$ vim book.txt
```

``` :book.txt
ファイルを読む：
ループを使用すると、bashで任意のファイルを1行ずつ読み取ることができます。
'read_file.sh'という名前のファイルを作成し、次のコードを追加して、'book.txt'という名前の既存のファイルを読み取ります。
```

``` bash:read_file.sh
#!/bin/bash

file='book.txt';
if [ -f "$file" ];then
  while read line;do
    echo "$line";
  done<$file
else
  echo "$file ファイルがありません";
fi
```

bashコマンドでファイルを実行します。

```
$ bash read_file.sh
ファイルを読む：
ループを使用すると、bashで任意のファイルを1行ずつ読み取ることができます。
'read_file.sh'という名前のファイルを作成し、次のコードを追加して、'book.txt'という名前の既存のファイルを読み取ります。
```

具体的に以下のファイルを作成してファイルを読み込み、必要な部分を抜き出して表示してみます。

``` bash:instance-tag.list
i-0f6126b7aeedfabd6,hoge
i-050536efdd9dc1126,fuga
i-0869f24358fb3f698,f8k
```

cat します。

```
$ cat instance-tag.list
i-0f6126b7aeedfabd6,hoge
i-050536efdd9dc1126,fuga
i-0869f24358fb3f698,f8k
$ 
```

以下のソースファイルを作成します。

``` bash:whileread_example2.sh
#!/bin/bash

# catしてwhile read で1行ずつ読み込む
# 「cat instance-tag.list」の結果を1行ずつ「line」
# という変数に代入しています。
cat instance-tag.list | while read line;do
  # 二つの変数に値切り出して代入
  # $()は()内で指定したコマンドの実行結果を返します。 
  # 今回の場合、「echo $line | cut -d, -f 1」の実行結果が
  # 「instance_id」に定義されます。
  instance_id=$(echo $line | cut -d, -f 1)
  tag_value=$(echo $line | cut -d, -f 2)
  
  # 表示
  echo "instance_id: ${instance_id}";
  echo "tag_value: ${tag_value}";
done
```

bashコマンドでファイルを実行します。

```
$ bash whileread_example2.sh
instance_id: i-0f6126b7aeedfabd6
tag_value: hoge
instance_id: i-050536efdd9dc1126
tag_value: fuga
instance_id: i-0869f24358fb3f698
tag_value: f8k
$
```

{{% tips-list tips %}}
ヒント
: cutコマンドの部分は、awkコマンドを使うこともあります。
: 今回は、cutの方が処理速度が速いため、cutコマンドを使いました。

: ちなみにawkの場合は、以下のように記述します。
{{% /tips-list %}}

```
instance_id=$(echo $line | awk -F, '{print $1;}');
tag_value=$(echo $line | awk -F, '{print $2;}');
```




## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本 – 2006/1/16"

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

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー） – 2017/1/20"

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


