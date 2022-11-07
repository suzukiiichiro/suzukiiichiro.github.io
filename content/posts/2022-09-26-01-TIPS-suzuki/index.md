---
title: "【TIPS】ざっくりわかるシェルスクリプト"

date: 2022-09-26T14:19:38+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - TIPS
  - ざっくりわかるシリーズ
  - シェルスクリプト
  - Bash
  - 鈴木維一郎

---

ここではシェルスクリプトのBashについてのTIPSを紹介します。C言語やJavaといった高級言語にあってbashにはない部分について補完できる様々な手法をご紹介します。

Bashで普通に動くスクリプトを記述することはできるけど、C言語やJavaなどで記述したり構築したりするにはどうすればよいのか？ということについて、様々なアイディアも含めて、同等の表現方法がいくつかあるので、参考にしてください。

## シェルオプション

`set`コマンドで便利にプログラミングする手法を紹介します。古来から伝わる便利な一行です。

``` bash
#! /usr/bin/bash

set -ueo pipefail
```

`set -u` : 未定義の変数を使用した箇所でスクリプトが正常終了します。変数名が異なる場合も実行できてしまうなどのありがちがバグを未然に防ぐことができます。

`set -e` : スクリプトの実行中にエラーが発生した場合、エラーの箇所でスクリプトの処理が終了します。通常は、エラーが発生しても実行は中断されず、エラー箇所を特定するのはとても大変ですが、`set -e` オプションを付けておくとエラー箇所の特定が比較的カンタンになります。

`set -o pipefail` : コマンド同士の連結にパイプ「｜」を使いますが、パイプ箇所でエラーが発生した場合に、パイプで連結したどのコマンドでエラーが発生したのかを特定することができます。

上記３つのオプションを結合すると `set -ueo pipefail`をなります。通常、行頭のシェバン「#!/usr/bin/bash 」の下に一行空行を置き、その下に `set -ueo pipefail`を書くと良いです。


## 変数の型を指定する

シェルスクリプトでは変数の型を指定する必要はありませんが、指定しておくことで、間違った値を代入することがなくなり、しいてはバグが減ります。

変数を数値として宣言する
iオプションを使用します。

``` bash
declare -i num=1+2
str=1+2

echo $num # => 3
echo $str # => 1+2
```


変数を配列として宣言する
aオプションを使用します。

``` bash
declare -a array=( Java Ruby Python )

echo ${array[0]} # => Java

echo ${#array[*]} #=> 3(配列の要素数)

for e in ${array[*]}
do
  echo $e # => Java, Ruby, Pythonの順に出力
done

for i in ${!array{*}}
do
  echo ${array[i]} # => Java, Ruby, Pythonの順位出力
done
```

変数を定数（読み取り専用）とし、初期化時に値を代入する
-r オプションを使います。

``` bash
#!/usr/bin/bash

set -ueo pipefail

declare -r num=5;

str=$((num+2));
echo $num # => 5
echo $str # => 7
```

## ローカル変数を定義する
シェルスクリプトはどこで宣言しようとすべてグローバル変数として扱われますが、`local`をつけることによって、明示的にもローカル変数を定義することができます。

``` bash
function fn() {
  # 問題のある例:
  local hoge=$(false)
  # $? で直前に実行したコマンドの終了ステータスを参照できる
  echo $? # => エラーが握りつぶされ 0 が返る！
 
  # 問題のない例:
  local hoge2
  hoge2=$(false)
  echo $? # => 正しく 1 が返る
}
```

## インクリメント

インクリメントなどは以下のように書くことができます。

一般的な書き方
``` bash
#!/usr/bin/bash

set -ueo pipefail 

value=0;
value=`echo "$value+1" | bc`;
echo "valueの値は " $value;
```

スッキリとした書き方
``` bash
#!/usr/bin/bash

set -uo pipefail  # eをつけると動きません

declare -i value=0;
((value++));
echo "valueの値は" $value;
```

## if C言語やJavaのような条件式で記述する

メリットは以下のとおりです。
・半角空白を配置する必要がない
・一般的に短い行で記述できるようになる
・条件式の変数に「$」を付ける必要がない
・-gt は >、 -lt は <、-leは<=、で普通に記述できる

一般的な記述
``` bash
#!/usr/bin/bash

set -ueo pipefail

x=4;
if [ "$x" -gt 2 ] && [ "$x" -le 5 ]; then
  echo "$x は 2 より大きいかつ 5 以下です";
fi
```

拡張した記述
``` bash
#!/usr/bin/bash

set -ueo pipefail

x=4;
if ((x>2 && x<=5)); then
  echo "$x は 2 より大きいかつ 5 以下です";
fi
```


## while C言語やJavaのような条件式で記述する

スッキリとした書き方
``` bash
#!/usr/bin/bash

set -ueo pipefail

declare -i i=0;
while((i++<10));do
  echo $i;
done
```

## for C言語やJavaのような条件式で記述する

スッキリとした書き方
```
#!/usr/bin/bash

set -ueo pipefail

for((i=1;i<=10;i++));do
  echo $i;
done
```

doやdoneを使わないもっとスッキリとした書き方
```
#!/usr/bin/bash

set -ueo pipefail

for((i=1;i<=10;i++)){
  echo $i;
}
```

## grepで該当文字列があったら反応する

``` bash
# 一般的には以下のようにします。
if cat hoge.txt | grep "Apple" >/dev/null; then
  echo "hoge.txtにはAppleが含まれた行がある"
fi

# --quiet は標準出力に何も書き出さないオプション
if cat hoge.txt | grep --quiet "Apple"; then
  echo "hoge.txtにはAppleが含まれた行がある"
fi
 
# 条件の反転は ! をつける
if ! cat hoge.txt | grep --quiet "Apple"; then
  echo "hoge.txtにはAppleが含まれた行がない"
fi
```

## 長い行の改行について

長い行の改行はバックスラッシュを末尾につける

```
aws --region ap-northeast-1 cloudformation deploy \
  --template-file ./packaged-template.yaml \
  --stack-name example-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    Environment=development \
    EnableDebugLog=true
```

驚いたことに（僕も驚きました）パイプラインでの改行はエスケープがいらない！

``` bash
cat access.log |
  # IPアドレスのカラムを取得する
  awk '{print $5}' |
  # 100行目以降のみを集計対象とする
  tail +100 |
  # IPアドレスごとのアクセス数のランキングを集計する
  sort | uniq -c | sort -nr
```

## 関数パラメータは変数に格納する

関数に渡された値は $1,$2...というふうにアクセスできます。
とはいえ、関数の中で $1,$2を使うとなにがなんだかわかりにくくなります。
ですので、関数冒頭で変数に格納しましょう。
もちろん忘れずに変数には`local` 変数をつけましょう。
変数の型がわかっているのであれば（わかっているでしょう）、declare -i などで明示的に変数の型を指定するのが望ましいのです。

``` bash
function do_something() {
  # まず最初に引数を意味のある命名の変数に取り出す
  local target_dir;
  local action

  target_dir=$1;
  action=$2;
}
```


## スクリプトのデバッグ

Bashは広範なデバッグ機能を提供しています。

デバッグの方法は３種類あります

１．ターミナルの実行時に -x オプションを付与する

```
$ bash -x helloScript.sh
```

２．ソースコードの冒頭のシェバンに -x オプションを付与する

``` bash:debug.sh
#!/bin/bash -x
:
:
```


３．デバッグの開始点と終了点を決めてデバッグ
デバッグの開始点にコマンド 'set -x'終了点には 'set +x' と書きます。


``` bash:debug2.sh
#!/bin/bash 

set -x
echo "置き換えたいファイル名を入寮して下さい。"
read fileName
set +x

if [[ -f "$fileName" ]]; then
  sed -e "s/Linux/Unix/g" "$fileName";
else
  echo "$fileName はありません。";
fi
```

```
$ bash test
+ echo 置き換えたいファイル名を入寮して下さい。
置き換えたいファイル名を入寮して下さい。
+ read fileName
grepfile.txt
+ set +x
This is Unix
This is Windows
This is MAC
This is Unix
This is Windows
This is MAC
This is Unix
This is Windows
This is MAC
This is Unix
This is Windows
This is MAC
$
```


``` bash:debug3.sh
#!/bin/bash

# デバッグ開始
set -x

var1=`date +%M`

# デバッグ終了
set +x

var2=`ls -1 | wc -l`
var3="DEBUG TEST"

exit 0
```

```
$ bash debug3.sh
++ date +%M
+ var1=56
+ set +x
$
```


{{% tips-list tips %}}
ヒント
: 色々と便利なbashですが、これからも便利な書き方があれば更新してきます。
{{% /tips-list %}}

## マルチラインコメント
<font color=orange><b> 複数行コメントの使用</b></font>
bashではさまざまな方法で複数行コメントを使用できます。
次の例に簡単な方法を示します。
'multiline-comment.sh'という名前の新しいbashを作成し、次のスクリプトを追加します。
ここでは、「:」と「'」でbashで複数行コメントを実現しています。
次のスクリプトは、5の2乗を計算します。

{{% tips-list tips %}}
ヒント
: 「:」と「'」の間は半角スペースを入れます。
{{% /tips-list %}}


``` bash:multiline-comment.sh
#!/bin/bash

: '
次のスクリプトは、
数値の2乗値5を計算します。
'
((area=5*5));
echo "$area";
```
bashコマンドでファイルを実行します。

```
$ bash multiline-comment.sh
25
$
```

{{% tips-list tips %}}
ヒント
: 多くの場合、マルチラインコメントの存在は知られていない。
: ほとんどの人は、行頭に「#」をならべて複数行コメントを行う。
: それは、過去のメジャーソースコードの冒頭にそうあるからだ。
: そう、UNIX/Linuxの開発者のほとんどは、マルチラインコメントを知らないのだ。

: 今後出てくるであろうファイルの生成に「touch」というコマンドがある。これ実は 「:>ファイル名」で、空のファイルを生成する事ができる。「:」は、”なにもしないことを示す。if文の中で何もしない場合は、以下のように記述する。

: if [ "$v" -eq 5 ];then
:   : # 何もしない
: fi

: touchは既にファイルがあれば、そのファイルにはさわらない。
: :> は既にファイルがあれば、そのファイルさえも空にする。
: 上記 if 文の中の : は　何もしないことを示す。
: マルチラインコメントも同じ「:」から始まり、何もしないことを示している。
 
{{% /tips-list %}}


## 文字列からの配列の代入


一般的なwhile read 文。配列の内容を別の配列にコピーしています。
```bash:month_array.sh
#!/usr/bin/bash

declare -a month_array=("jan feb mar apr");
declare -i number=0; # 変数は数値型
declare -a my_array; # 変数は配列型

while read number;do
  my_array[$number]=${month_array[$number]};
  let number++;
done< <( seq 0 4)

echo ${my_array[@]};
```

修正したスクリプト。while read がまるごと不要となっていますね。
```bash:month_array2.sh
#!/usr/bin/bash

declare -a month_array=("jan feb mar apr");
# コメントアウト
# declare -i number=0;
# 空白を区切り文字として配列に代入
declare -a my_array=(${month_array// / });

: '
コメントアウト
while read number;do
  my_array[$number]=${month_array[$number]};
  let number++;
done< <( seq 0 4)
'
echo ${my_array[@]};

```




<!--
{{% tips-list alert %}}
注意
: 「>>」も同様に `tee -a`の場合は、予めファイルを作成しておき、そのファイルに対して「>>」や`tee -a`を行います。追記する最初の処理段階でファイルが存在していることを明示的に書いておくことが重要です。
: 以下のまとめのように、追記する前に上書きする処理をしておく場合は、あらかじめファイルの生成をする必要はありませんが、明示的に「 $ :> filename 」のようにファイルを生成しておくと、ソースがわかりやすくなります。
{{% /tips-list %}}
-->


## 「ざっくり」シリーズのご紹介
【アルゴリズム 再帰】ざっくりわかるシェルスクリプト１５
https://suzukiiichiro.github.io/posts/2022-10-07-01-algorithm-recursion-suzuki/
【アルゴリズム キュー】ざっくりわかるシェルスクリプト１４
https://suzukiiichiro.github.io/posts/2022-10-06-01-algorithm-queue-suzuki/
【アルゴリズム スタック】ざっくりわかるシェルスクリプト１３
https://suzukiiichiro.github.io/posts/2022-10-06-01-algorithm-stack-suzuki/
【アルゴリズム 挿入ソート】ざっくりわかるシェルスクリプト１２
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-insertionsort-suzuki/
【アルゴリズム 選択ソート】ざっくりわかるシェルスクリプト１１
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-selectionsort-suzuki/
【アルゴリズム バブルソート】ざっくりわかるシェルスクリプト１０
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-bubblesort-suzuki/
【アルゴリズム ビッグオー】ざっくりわかるシェルスクリプト９
https://suzukiiichiro.github.io/posts/2022-10-04-01-algorithm-bigo-suzuki/
【アルゴリズム ２次元配列編】ざっくりわかるシェルスクリプト８
https://suzukiiichiro.github.io/posts/2022-10-03-01-algorithm-eval-array-suzuki/
【アルゴリズム 配列準備編】ざっくりわかるシェルスクリプト７
https://suzukiiichiro.github.io/posts/2022-10-03-01-algorithm-array-suzuki/ 
【アルゴリズム 配列編】ざっくりわかるシェルスクリプト６
https://suzukiiichiro.github.io/posts/2022-09-27-01-array-suzuki/
【grep/sed/awkも】ざっくりわかるシェルスクリプト５
https://suzukiiichiro.github.io/posts/2022-02-02-01-suzuki/
【grep特集】ざっくりわかるシェルスクリプト４
https://suzukiiichiro.github.io/posts/2022-01-24-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト３
https://suzukiiichiro.github.io/posts/2022-01-13-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト２
https://suzukiiichiro.github.io/posts/2022-01-12-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト１
https://suzukiiichiro.github.io/posts/2022-01-07-01-suzuki/

【TIPS】ざっくりわかるシェルスクリプト
https://suzukiiichiro.github.io/posts/2022-09-26-01-tips-suzuki/

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



