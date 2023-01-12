---
title: "【mapfile】bash/シェルスクリプトマニアックコマンドあれこれ１３"
date: 2023-01-12T16:00:05+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - マニアックコマンド
  - シェルスクリプト
  - コマンド活用
  - Bash
  - 鈴木維一郎
---

## mapfile（マップファイル）

bash シェルの `mapfile` コマンドは、読み取り配列としてよく知られています。
主な目的は、標準入力行を読み取り、それらをインデックス付き配列変数に格納することです。
`mapfile` は、パイプではなく置換 (<) から読み取る必要があります。
さらに、読み取りループと比較して、`mapfile` ははるかに高速で便利なソリューションです。
コマンドの実行が成功した場合は 1 を返し、失敗した場合は 0 を返します。
配列名を指定しない場合、`mapfile` 変数がデフォルトの配列変数となります。



## データテキストの準備
ここで簡単なデータテキスト用意します。

``` bash:data.txt
One
Two
Three
```

## 普通のやり方 while read パターン
このテキストを読み込んで配列にデータを格納したいと思います。
多少冗長ではありますが通常は以下のような感じになります。


``` bash:array01.sh
#!/usr/bin/bash

DATAFILE="data.txt";  # データファイル
declare -a aLine;     # 配列の宣言
declare -i COUNT=0;   # カウンターの宣言
IFS=$'\n';            # 区切り文字を改行コードに指定
 
while read line;do
  # １行ずつ読み込んだ内容 $line を配列に代入
  aLine[$COUNT]="$line";
  ((COUNT++));    # インクリメント
done<$DATAFILE    # ファイルの入力

echo "配列の内容すべてを表示"
echo ${aLine[@]}; # One Two Three
echo "添字の0を表示"
echo ${aLine[0]}; # One
echo "添字の1を表示"
echo ${aLine[1]}; # Two
echo "添字の2を表示"
echo ${aLine[2]}; # Three
```

実行結果は以下のとおりです。
```
bash-3.2$ bash array01.sh
配列の内容すべてを表示
One Two Three
添字の0を表示
One
添字の1を表示
Two
添字の2を表示
Three
bash-3.2$
```


## 普通のやり方 fileコマンドパターン

ファイルの読み込みを以下のようにすることもできますね。

``` bash:array02.sh
#!/usr/bin/bash

DATAFILE="data.txt";  # データファイル
declare -a aLine;     # 配列の宣言
declare -i COUNT=0;   # カウンターの宣言
IFS=$'\n';            # 区切り文字を改行コードに指定
 
# ファイルを配列に読み込む
file=(`cat "$DATAFILE"`)
 
# 行ごとに繰り返し処理を実行
for line in "${file[@]}"; do
  # １行ずつ読み込んだ内容 $line を配列に代入
  aLine[$COUNT]="$line";
  ((COUNT++));    # インクリメント
done


echo "配列の内容すべてを表示"
echo ${aLine[@]}; # One Two Three
echo "添字の0を表示"
echo ${aLine[0]}; # One
echo "添字の1を表示"
echo ${aLine[1]}; # Two
echo "添字の2を表示"
echo ${aLine[2]}; # Three
```

実行結果は以下のとおりです。
```
bash-3.2$ bash array02.sh
配列の内容すべてを表示
One Two Three
添字の0を表示
One
添字の1を表示
Two
添字の2を表示
Three
bash-3.2$
```

## 登場！ mapfile を使う
なんと、ファイル読み込みや配列への代入にあれこれやっていましたが、mapfileを使うと１行で住みます。
`COUNT`変数といったカウンターや IFSといった定義も不要です。


``` :data02.txt
One Two Three
Four Five Six
Seven Eight Nine
Ten
```


``` bash:array03.sh
#!/usr/bin/bash

DATAFILE="data.txt";  # データファイル
declare -a aLine;     # 配列の宣言
 
# -t は行末の改行を除去
mapfile -t aLine < "$DATAFILE";

echo "配列の内容すべてを表示"
echo ${aLine[@]}; # One Two Three
echo "添字の0を表示"
echo ${aLine[0]}; # One
echo "添字の1を表示"
echo ${aLine[1]}; # Two
echo "添字の2を表示"
echo ${aLine[2]}; # Three
```

実行結果はいずれも同じですが以下のとおりです。
```
bash-3.2$ bash array03.sh
配列の内容すべてを表示
One Two Three
添字の0を表示
One
添字の1を表示
Two
添字の2を表示
Three
bash-3.2$
```

すごいですね。
配列に入れるだけなら`mapfile`で十分です。しかも読み込み専用ということもあり、読み込み速度は通常の数十倍高速です。

## 列の代入
ここで余談ですが、これまでは行の読み込みを行い、行を単位に配列に格納してきました。
列の中で空白区切りで値が入っている場合の配列への代入はどうしましょう？


こうなります。


``` bash:col.sh
#!/usr/bin/bash

# １行に３つの値が空白区切りで並んでいます
read -a aLine <<< "One Two Three"

echo "配列の内容すべてを表示"
echo ${aLine[@]}; # One Two Three
echo "添字の0を表示"
echo ${aLine[0]}; # One
echo "添字の1を表示"
echo ${aLine[1]}; # Two
echo "添字の2を表示"
echo ${aLine[2]}; # Three
```

実行結果は以下のとおりです。

```
bash-3.2$ bash col.sh
配列の内容すべてを表示
One Two Three
添字の0を表示
One
添字の1を表示
Two
添字の2を表示
Three
bash-3.2$
```

## データファイルからの入力
では、データファイルの構造を少し複雑にしてみます。

``` data02.txt
One Two Three
Four Five Six
Seven Eight Nine
Ten
```

`mapfile`コマンドで行の内容を配列に入れる方法は説明しましたが、今回は、行の中で空白区切りの値が３つあります。
こうしたデータ構造を`mapfile`に加えて`read`コマンドを使って効率的に、かつ高速に読み込んでみます。


``` bash:colArray.sh
#!/usr/bin/bash

DATAFILE="data02.txt";
declare -a aLine;

# データファイルを読み込みます。
mapfile -t aLine<"$DATAFILE";

for((i=0;i<4;i++));do

  # 行の内容を読み込み、空白区切りで配列に格納します
  read -a var <<< "${aLine[$i]}";

  echo "varの中身は以下の通り";
  echo "${var[@]}";
  echo "添字の0を表示"
  echo ${var[0]}; # One
  echo "添字の1を表示"
  echo ${var[1]}; # Two
  echo "添字の2を表示"
  echo ${var[2]}; # Three
done
```

実行結果は以下のとおりです。

```
bash-3.2$ bash colArray.sh
varの中身は以下の通り
One Two Three
添字の0を表示
One
添字の1を表示
Two
添字の2を表示
Three
varの中身は以下の通り
Four Five Six
添字の0を表示
Four
添字の1を表示
Five
添字の2を表示
Six
varの中身は以下の通り
Seven Eight Nine
添字の0を表示
Seven
添字の1を表示
Eight
添字の2を表示
Nine
varの中身は以下の通り
Ten
添字の0を表示
Ten
添字の1を表示

添字の2を表示

bash-3.2$
```

最後の行は値が一つしかありません（Ten）
必要であれば値がない場合は出力しないなどの処理をすれば良さそうです。
（配列的には別に値がなくても問題はないと思いますが）


`mapfile`と`read`コマンドを上手に使って、効率的に配列に代入してください。


<!--



{{% tips-list tips %}}
ヒント
{{% /tips-list %}}

{{% tips-list alert %}}
注意
{{% /tips-list %}}
-->


## 書籍の紹介
{{% amazon

title="UNIXという考え方—その設計思想と哲学 単行本  2001/2/23"
url="https://www.amazon.co.jp/UNIX%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9%25E2%2580%2595%25E3%2581%259D%25E3%2581%25AE%25E8%25A8%25AD%25E8%25A8%2588%25E6%2580%259D%25E6%2583%25B3%25E3%2581%25A8%25E5%2593%25B2%25E5%25AD%25A6-Mike-Gancarz/dp/4274064069/ref=sr_1_1?keywords=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9&amp;qid=1667786898&amp;qu=eyJxc2MiOiIxLjEwIiwicXNhIjoiMC4zOSIsInFzcCI6IjAuMzEifQ%253D%253D&amp;sprefix=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%252Caps%252C257&amp;sr=8-1&_encoding=UTF8&tag=nlpqueens09-22&linkCode=ur2&linkId=0249eb4cab50d700fb6949eb9aeafef1&camp=247&creative=1211"
imageUrl="https://m.media-amazon.com/images/I/518ME653H3L._SX330_BO1,204,203,200_.jpg"
summary=`   UNIX系のOSは世界で広く使われている。UNIX、Linux、FreeBSD、Solarisなど、商用、非商用を問わず最も普及したOSのひとつであろう。そしてこのOSは30年にわたって使用され続けているものでもある。なぜこれほど長い間使われてきたのか？ その秘密はUNIXに込められた数々の哲学や思想が握っている。
   そもそもUNIXはMulticsという巨大なOSの開発から生まれたものだ。あまりに巨大なMulticsはその複雑さゆえに開発は遅々として進まず、その反省からケン・トンプソンが作ったのがUNIXの初めとされる。その後デニス・リッチーら多数の開発者が携わり、UNIXは発展した。本書はこのUNIXに込められた「思想と哲学」を抽出し、数々のエピソードとともにUNIXの特徴を浮き彫りにしていく。

   たとえば本書で述べられているUNIXの発想のひとつとして「過度の対話式インタフェースを避ける」というものがある。UNIXのシステムは初心者には「不親切」なつくり、つまり親切な対話式のインタフェースはほとんどなく、ユーザーがコマンドを実行しようとするときはオプションをつける形をとっている。この形式はオプションをいちいち覚えねばならず、初心者に決してやさしくない。しかしこれはプログラムを小さく単純なものにし、他のプログラムとの結合性を高くする。そして結果としてUNIXのスケーラビリティと移植性の高さを支えることになっているのだ。このような形式で本書では9つの定理と10の小定理を掲げ、UNIXが何を重視し、何を犠牲にしてきたのかを明快に解説している。

   最終章にはMS-DOSなどほかのOSの思想も紹介されている。UNIXの思想が他のOSとどう違うかをはっきり知ることになるだろう。UNIXの本質を理解するうえで、UNIX信者もUNIX初心者にとっても有用な1冊だ。（斎藤牧人）`
%}}

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

