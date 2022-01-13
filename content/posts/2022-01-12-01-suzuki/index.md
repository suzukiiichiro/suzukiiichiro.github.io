---
title: "ざっくりわかる「シェルスクリプト２」"
description: "ここではbashプログラミングの基本的な考え方２として、bashスクリプトの一般的な操作を、ざっくりと説明します。"
date: 2022-01-12T12:30:57+09:00
draft: false
image: 2021-12-23-bash.jpg
categories:
  - プログラミング
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

# はじめに
Bashスクリプトは、シェルコマンドの実行、複数のコマンドの同時実行、管理タスクのカスタマイズ、タスクの自動化の実行など、さまざまな目的に使用できます。したがって、bashプログラミングの基本に関する知識はすべてのLinuxユーザーにとって重要です。この記事は、bashプログラミングの基本的な考え方を理解するのに役立ちます。ここでは、bashスクリプトの一般的な操作のほとんどを、非常に簡単な例で説明します。

この記事では、bashプログラミングの次のトピックについて説明します。


関連記事
[ざっくりわかるシェルスクリプト１」](https://suzukiiichiro.github.io/posts/2022-01-07-01-suzuki/)
[ざっくりわかるシェルスクリプト２」](https://suzukiiichiro.github.io/posts/2022-01-12-01-suzuki/)
[ざっくりわかるシェルスクリプト３」](https://suzukiiichiro.github.io/posts/2022-01-13-01-suzuki/)


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
<font color=red>Bash は += 演算子を用いて文字列を連結することもできます。単純に a+=b とすると、a=a+b と理解することができます。</font>

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

## 関数を作成する
<font color=orange><b>関数の作成：</b></font>
簡単な関数を作成して関数を呼び出す方法を次のスクリプトに示します。'function_example.sh'という名前のファイルを作成し、次のコードを追加します。bashスクリプトで角かっこを使用せずに、名前でのみ関数を呼び出すことができます。

``` bash:function_example.sh
#!/bin/bash

function F1(){
  echo 'わたしはbashプログラミングが大好きです。';
}

F1;
```
bashコマンドでファイルを実行します。

```
$ bash function_example.sh
わたしはbashプログラミングが大好きです。
$
```

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

# 関連記事
[ざっくりわかるシェルスクリプト１」](https://suzukiiichiro.github.io/posts/2022-01-07-01-suzuki/)
[ざっくりわかるシェルスクリプト２」](https://suzukiiichiro.github.io/posts/2022-01-12-01-suzuki/)
[ざっくりわかるシェルスクリプト３」](https://suzukiiichiro.github.io/posts/2022-01-13-01-suzuki/)


# 書籍の紹介
{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/product/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

summary=`定番の1冊『シェルスクリプト基本リファレンス』の改訂第3版。
シェルスクリプトの知識は、プログラマにとって長く役立つ知識です。
本書では、複数のプラットフォームに対応できる移植性の高いシェルスクリプト作成に主眼を置き、
基本から丁寧に解説。
第3版では最新のLinux/FreeBSD/Solarisに加え、組み込み分野等で注目度の高いBusyBoxもサポート。
合わせて、全収録スクリプトに関してWindowsおよびmacOS環境でのbashの動作確認も行い、さらなる移植性の高さを追求。
ますますパワーアップした改訂版をお届けします。`
imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4774186945&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}

{{% amazon

title="UNIXシェルスクリプト マスターピース132"

url="https://www.amazon.co.jp/gp/product/B00QJINS1A/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B00QJINS1A&linkCode=as2&tag=nlpqueens-22&linkId=36dff1cf8fa7d4852b5a4a3cf874304b"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B00QJINS1A&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=nlpqueens-22"
%}}



