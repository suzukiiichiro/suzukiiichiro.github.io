---
authors: suzuki
title: "【はじめから】ざっくりわかるシェルスクリプト２"
description: "前１回目の説明に続き、ここではbashプログラミングの基本的な考え方２として、bashスクリプトの一般的な操作を、ざっくりと説明します。"
date: 2022-01-12T12:30:57+09:00
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

## はじめに
Bashスクリプトは、シェルコマンドの実行、複数のコマンドの同時実行、管理タスクのカスタマイズ、タスクの自動化の実行など、さまざまな目的に使用できます。したがって、bashプログラミングの基本に関する知識はすべてのLinuxユーザーにとって重要です。この記事は、bashプログラミングの基本的な考え方を理解するのに役立ちます。ここでは、bashスクリプトの一般的な操作のほとんどを、非常に簡単な例で説明します。

この記事では、bashプログラミングの次のトピックについて説明します。


## or 条件を if文で使う
<font color=orange><b>orロジックでifステートメントを使用する：</b></font>
'||'は、ifステートメントでorロジックを定義するために使用されます。次のコードを使用して「if_with_or.sh」という名前のファイルを作成し、ifステートメントのorロジックの使用を確認します。ここで、nの値はユーザーから取得されます。値が15または45の場合、出力は「ゲームに勝ちました」になります。それ以外の場合、出力は「ゲームに負けました」になります。

``` bash:if_with_or.sh
#!/bin/bash

echo "数値を入力して下さい。";
read n;

if [[ ("$n" -eq 15 || "$n" -eq 45) ]];then
  echo "ゲームに勝ちました";
else
  echo "ゲームに負けました";
fi
```
bashコマンドでファイルを実行します。
```
$ bash if_with_or.sh
数値を入力して下さい。
5
ゲームに負けました
$ bash if_with_or.sh
数値を入力して下さい。
45
ゲームに勝ちました
bash-5.1$
```

<table>
<tr><td>比較演算子</td><td>使用例</td><td>意味</td></tr>
<tr><td>-n</td><td>-n 文字列	</td><td>文字列の長さが0より大きければ真</td></tr>
<tr><td>-z</td><td>-z 文字列	</td><td>文字列の長さが0であれば真</td></tr>
<tr><td>=</td><td>文字列A = 文字列B	</td><td>文字列Aと文字列Bが等しければ真</td></tr>
<tr><td>!=</td><td>文字列A != 文字列B	</td><td>文字列Aと文字列Bが等しくなければ真</td></tr>
</table>

{{% tips-list tips %}}
ヒント
: シェルスクリプトの比較式には「比較演算子」の左右に空白（半角スペース）が必要です（代入とは別）。
: また、比較する変数を「ダブルクォーテーション」で囲まないと、変数が空のときに構文エラーとなってしましますので注意してください。 
{{% /tips-list %}}

## else if と else
<font color=orange><b>else ifステートメントの使用：</b></font>
else if条件の使用は、bashでは「elif」を定義します。'elseif_example.sh'という名前のファイルを作成し、次のスクリプトを追加して、bashスクリプトでelseifがどのように定義されているかを確認します。

``` bash:elseif_example.sh
#!/bin/bash

echo "あなたのラッキーナンバーを入力して下さい。";
read n;

if [ "$n" -eq 101 ];then
  echo "あなたは一等賞を獲得しました";
elif [ "$n" -eq 510 ];then
  echo "あなたは二等賞を獲得しました";
elif [ "$n" -eq 999 ];then
  echo "あなたは三等賞を獲得しました";
else
  echo "すみません、またチャレンジして下さい";
fi
```

bashコマンドでファイルを実行します。

```
bash$ bash elseif_example.sh
あなたのラッキーナンバーを入力して下さい。
101
あなたは一等賞を獲得しました
bash$ bash elseif_example.sh
あなたのラッキーナンバーを入力して下さい。
999
あなたは三等賞を獲得しました
bash$ bash elseif_example.sh
あなたのラッキーナンバーを入力して下さい。
100
すみません、またチャレンジして下さい
bash$ bash elseif_example.sh
$
```


<table>
<tr><td>比較演算子</td><td>使用例</td><td>意味</td></tr>
<tr><td>-n</td><td>-n 文字列	</td><td>文字列の長さが0より大きければ真</td></tr>
<tr><td>-z</td><td>-z 文字列	</td><td>文字列の長さが0であれば真</td></tr>
<tr><td>=</td><td>文字列A = 文字列B	</td><td>文字列Aと文字列Bが等しければ真</td></tr>
<tr><td>!=</td><td>文字列A != 文字列B	</td><td>文字列Aと文字列Bが等しくなければ真</td></tr>
</table>

{{% tips-list tips %}}
ヒント
: シェルスクリプトの比較式には「比較演算子」の左右に空白（半角スペース）が必要です（代入とは別）。
: また、比較する変数を「ダブルクォーテーション」で囲まないと、変数が空のときに構文エラーとなってしましますので注意してください。 
{{% /tips-list %}}


## case 文
<font color=orange><b>caseステートメントの使用：</b></font>
caseステートメントは、if-elseif-elseステートメントの代わりに使用されます。このステートメントの開始ブロックと終了ブロックは、「case」と「esac」によって定義されます。'case_example.sh'という名前の新しいファイルを作成し、次のスクリプトを追加します。次のスクリプトの出力は、例として前のelseと同じになります。

``` bash:case_example.sh
#!/bin/bash

echo "あなたのラッキーナンバーを入力して下さい。";
read n;

case "$n" in
  101)
    echo "あなたは一等賞を獲得しました" ;;
  510)
    echo "あなたは二等賞を獲得しました" ;;
  999)
    echo "あなたは三等賞を獲得しました" ;;
  *)
    echo "すみません、またチャレンジして下さい"
esac
```

bashコマンドでファイルを実行します。

```
bash$ bash case_example.sh
あなたのラッキーナンバーを入力して下さい。
101
あなたは一等賞を獲得しました
bash$ bash case_example.sh
あなたのラッキーナンバーを入力して下さい。
510
あなたは二等賞を獲得しました
bash$ bash case_example.sh
あなたのラッキーナンバーを入力して下さい。
999
あなたは三等賞を獲得しました
bash$ bash case_example.sh
あなたのラッキーナンバーを入力して下さい。
777
すみません、またチャレンジして下さい
```


{{% tips-list tips %}}
ヒント
: case文の終わりには esac を指定します。
{{% /tips-list %}}


## コマンドラインから引数を取得
<font color=orange><b>コマンドラインから引数を取得：</b></font>
Bashスクリプトは、他のプログラミング言語と同様に、コマンドライン引数から入力を読み取ることができます。たとえば、$1と$2の変数は、最初と2番目のコマンドライン引数を読み取るために使用されます。「command_line.sh」という名前のファイルを作成し、次のスクリプトを追加します。次のスクリプトによって読み取られた2つの引数値は、引数の総数と引数値を出力として出力します。

``` bash:command_line.sh
#!/bin/bash

echo "引数の数 : $#";
echo "一つ目の引数 = $1";
echo "二つ目の引数 = $2";

```

bashコマンドでファイルを実行します。

```
$ bash command_line.sh apple windows
引数の数 : 2
一つ目の引数 = apple
二つ目の引数 = windows
$
```


{{% tips-list tips %}}
ヒント
: echo の引数として変数を渡すときは、"$1" のようにダブルクォートで囲む癖をつけます。
: $1 のようにダブルクォートで囲まずに変数をそのまま記述してしまうと、値として連続するスペースが含まれていたときに1つのスペースにまとめられてしまいます。また、値が入っていない場合に、正しく処理ができなくなります。
: シェルスクリプトの変数はほとんどの場合は "$value" と囲みます。
{{% /tips-list %}}


## 名前を使用してコマンドラインから引数を取得する
<font color=orange><b>コマンドラインから名前付きの引数を取得：</b></font>
名前付きのコマンドライン引数を読み取る方法を示します。'command_line_names.sh'という名前のファイルを作成し、次のコードを追加します。ここで、XとYの2つの引数がこのスクリプトによって読み取られ、XとYの合計が出力されます。

``` bash:command_line_names.sh
#!/bin/bash

for arg in "$@";do
  index=$(echo $arg | cut -f1 -d=);
  val=$(echo $arg | cut -f2 -d=);
  case $index in
    X) x=$val;;
    Y) y=$val;;
    *)
  esac
done

((result=x+y));
echo "X+Y=$result";
```

bashコマンドで二つのコマンドライン引数を使用して、ファイルを実行します。

```
$ bash command_line_names.sh X=45 Y=30
X+Y=75
$
```

{{% tips-list tips %}}
ヒント
: case文で入力された文字列の大文字と小文字に対応する。
: または文字列に対応する場合は以下のソースを見て欲しい。
: レベルアップしたソースコードはささいな気遣いから生まれる
{{% /tips-list %}}

``` bash
#! /bin/bash
case "$1" in
  [Yy]|"yes")		#Y、yまたはyesという文字列
    echo "YES"
    echo "OK"
    ;;
  [Nn]|"no")		#N、nまたはnoという文字列
    echo "NO"
    ;;
  *)
    echo "undefined";;
esac
```


## 変数に2つの文字列を組み合わせる
<font color=orange><b>文字列変数を組み合わせる：</b></font>
文字列変数はbashで簡単に組み合わせることができます。「string_combine.sh」という名前のファイルを作成し、次のスクリプトを追加して、変数を一緒に配置するか、「+」演算子を使用して、bashで文字列変数を組み合わせる方法を確認します。

``` bash:string_combine.sh
#!/bin/bash

string1="Apple";
string2="Mac OS";

echo "$string1 $string2";

string3="$string1 $string2";
string3+=" は、とても優れたＯＳです。" ;

echo $string3;
```

bashコマンドでファイルを実行します。

```
$ bash string_combine.sh
Apple Mac OS
Apple Mac OS は、とても優れたＯＳです。
$
```


{{% tips-list tips %}}
ヒント
: Bash は += 演算子を用いて文字列を連結することもできます。単純に a+=b とすると、a=a+b と理解することができます。

: 変数と文字列の結合は変数を{} でくくります。以下のソースを見て下さい。 
{{% /tips-list %}}



``` bash:string_example2.sh
#!/bin/sh

str1 = "Shell script"
str = "${str1} is intersting!!"

echo $str
```

```
$ bash string_example2.sh
$ Shell script is interesting!!
$
```


## 文字列の部分文字列を取得する
<font color=orange><b>文字列の部分文字列を取得します。</b></font>
他のプログラミング言語と同様に、bashには文字列データから値を切り取る組み込み関数はありません。ただし、次のスクリプトに示すbashで、別の方法で部分文字列のタスクを実行できます。スクリプトをテストするには、次のコードを使用して「substring_example.sh」という名前のファイルを作成します。ここで、値6は部分文字列が開始する開始点を示し、5は部分文字列の長さを示します。

``` bash:substring_example.sh
#!/bin/bash

Str="Learn Bash from NLP";
subStr=${Str:6:4};

echo "$subStr";
```

bashコマンドでファイルを実行します。

```
$ bash substring_example.sh
Bash
$
```


{{% tips-list tips %}}
ヒント
: 基本パターンは以下の通り
: ${パラメータ:オフセット:長さ} 
:
: Bashでの文字列の切り出しはかなりの頻度で使います。
: 知っているのと知らないのとでは、苦労が違ってきます。
: 具体例を以下にしめします。
{{% /tips-list %}}


``` bash:部分文字列抽出
#!/bin/bash

HOGE="abcdef"

# オフセット位置から長さ分を取得
echo ${HOGE:0:2}
# -> ab

echo ${HOGE:2:2}
# -> cd

echo ${HOGE:4:2}
# -> ef

# 長さを省略した場合はオフセットから最後まで出力
echo ${HOGE:2}
# -> cdef

# 長さにマイナスを指定した場合は最後からマイナス分引いた位置までの長さになる
echo ${HOGE:0:-2}
# -> abcd

# オフセットの位置にマイナスを指定した場合は文法として別のパラメータ展開になる(デフォルト値の指定)
# 指定した変数が空文字列の場合は右に指定した文字が入る
echo ${HOGE:-2}
# -> abcdef
HOGE=
echo ${HOGE:-2}
# -> 2
```


``` bash:右端からのパターン一致除外
#!/bin/bash

HOGE=hoge.tar.bz2

echo ${HOGE}
# -> hoge.tar.bz2

# 最短除外
echo ${HOGE%.*}
# -> hoge.tar

# 最長除外
echo ${HOGE%%.*}
# -> hoge
```


``` bash:左端からのパターン一致除外
#!/bin/bash

HOGE=/home/user/hoge

echo ${HOGE}
# -> /home/user/hoge

# 最短除外
echo ${HOGE#*/}
# -> home/user/hoge

# 最長除外
echo ${HOGE##*/}
# -> hoge
```


## 変数に2つの数値を追加します
<font color=orange><b>2つの数字を追加します。</b></font>
さまざまな方法でbashの算術演算を実行できます。次のスクリプトに、二重角かっこを使用してbashに2つの整数を追加する方法を示します。次のコードを使用して、「add_numbers.sh」という名前のファイルを作成します。2つの整数値がユーザーから取得され、加算の結果が出力されます。

``` bash:add_numbers.sh
#!/bin/bash

echo "最初の数値を入力";
read x;
echo "2番目の数値を入力";
read y;

((sum=x+y));

echo "加算の結果=$sum";
```

bashコマンドでファイルを実行します。

```
$ bash add_numbers.sh
最初の数値を入力
25
2番目の数値を入力
56
加算の結果=81
$
```


{{% tips-list tips %}}
ヒント
: ((sum=x+y));
: 昔の書籍でシェルスクリプトを勉強している人は、驚くかもしれない。だが、今の時代、Bashでは上記のように書く。昔は

: $ echo \`expr 1 + 1\`

: こんな書き方をした。現在のBashでは算術演算子が使える。
: 以下ににまとめてみた。2重括弧でくくればいい。2重括弧の中に変数を使うことも可能だ。さらに変数は見にくい「$」をつける必要すらない。
{{% /tips-list %}}

```bash:算術演算子 
$ echo `expr 1+1` # 昔のやり方
$ echo $((5+5))   # 今のやり方
$ echo $((5-5))
$ echo $((5*5))
$ echo $((5/5))
$ echo $((5%5))

# なんと比較演算子もいける！
$ echo $((0==1))  # 等号、結果: 0
$ echo $((0!=1))  # 否定等号、結果: 1
$ echo $((0<1))   # 未満、結果: 1
$ echo $((0<=1))  # 以下、結果: 1
$ echo $((0>1))   # 大なり、結果: 0
$ echo $((0>=1))  # 以上、結果: 0
```


## 関数を作成する
<font color=orange><b>関数の作成：</b></font>
簡単な関数を作成して関数を呼び出す方法を次のスクリプトに示します。'function_example.sh'という名前のファイルを作成し、次のコードを追加します。bashスクリプトで角かっこを使用せずに、名前でのみ関数を呼び出すことができます。


``` bash
#!/bin/bash

function 関数の名前(){
  処理
}
```

このとき、functionは省略可能です。

``` bash
#!/bin/bash

関数の名前(){
  処理
}
```

関数の呼び出しは、関数を定義した後に関数の名前を書くだけです。
```
関数の名前 引数
```

``` bash
#!/bin/bash

# 関数の定義
function say_hello(){
  echo "Hello, world!";
}
#
# 関数の呼び出し
say_hello;
```

{{% tips-list tips %}}
ヒント
: このとき、関数の名前に続けて、引数を書くことができます。関数内では、通常のシェルスクリプトの引数を処理するのと同じように$1、$2、...という形でアクセスできます。
{{% /tips-list %}}


## 関数パラメーターを使用する
<font color=orange><b>パラメータを使用して関数を作成します。</b></font>
Bashは、関数宣言時に関数パラメーターまたは引数を宣言できません。ただし、他の変数を使用して、関数内でパラメーターを使用できます。関数の呼び出し時に2つの値が渡された場合、値の読み取りには$1と$2の変数が使用されます。'function_parameter.sh'という名前のファイルを作成し、次のコードを追加します。ここで、関数 'Rectangle_Area'は、パラメーター値に基づいて長方形の面積を計算します。

``` bash:function_parameter.sh
#!/bin/bash

Rectangle_Area(){
  area=$(($1*$2));
  echo "面積は : $area";
}

Rectangle_Area 10 20;
```

bashコマンドでファイルを実行します。

```
bash-5.1$ bash tmp
面積は : 200
bash-5.1$
```


{{% tips-list tips %}}
戻り値について
: bashシェルスクリプトには「戻り値」というものは基本的に存在しない。

: 解決策として関数やコマンドの「実行結果を直接変数に代入する」という手段をとることになる。
: 「return」コマンドは存在するが、あくまで終了ステータスを返しているだけで、関数の戻り値を返す機能ではないので注意しよう。
{{% /tips-list %}}


<!--
## ２０．スクリプトからの戻り値を渡す
## ２１．ディレクトリを作成する
## ２２．存在を確認してディレクトリを作成する
## ２３．ファイルを読む
## ２４．ファイルを削除する
## ２５．ファイルに追加
## ２６．ファイルが存在するかどうかを確認
## ２７．mailコマンド
## ２８．dateコマンド
## ２９．waitコマンド
## ３０．sleepコマンド
-->




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


