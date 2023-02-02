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

そんな人達のために「シェルスクリプト１０００本ノック」をご紹介します。順番にじっくりやれば身につきます。
書いてあることを暗記する必要はありません。書いてあったことを覚えておけばよいです。必要であればこのページを開いて探せばよいのです。

まずは、ターミナルTIPSでキーボードショートカットを覚えましょう。すこしずつ覚えていけばよいです。

bashのTIPSも大いに参考になるはずです。覚える必要はありません。必要なときにこのページを思い出せばよいです。

grepやawk、sedコマンドでできることは無限です。
すべてを覚えてしまおうというのは無理なのです。
まずは、このページのコマンドを順番に実行する。
それだけで良いのです。

ちなみに１０００本というのは勢い余っていっているだけで、現在３３７本です。

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


### 文字列からの配列の代入


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



general
ファイルの内容を調べる
file some_image.jpg
実行時間を計測する
time ワンライナー
for 文
for(i=1;i<$1;i++)printf(" ")
#seq
順番に数値を出力する。

# 昇順
seq 5

# 降順
seq 5 1
#sed
入力データに置き換え処理を施したうえで再出力する
-nオプションをつけると、処理対象となった行のみを出力する
#置き換え(s///のパターン)
一回だけ置き換える
echo あいうえおあいうえお | sed 's/あ/か/'
# かいうえおあいうえお
何回も置き換える(g)
echo あいうえおあいうえお | sed 's/あ/か/g'
# かいうえおかいうえお
複数の置き換え条件を指定するには;で区切る
echo あいうえおあいうえお | sed 's/あ/か/g;s/い/き/g'
# かきうえおかきうえお
検索対象の文字を使う(&)
echo クロロエチルエーテル | sed 's/エチル/&&/'
# クロロエチルエチルエーテル
後方参照(\1や\2など)
-Eは拡張正規表現を有効にする
-rでも同じ意味
無駄にエスケープ文字を入れなくて済むようになる
基本正規表現だけ使えればいいなら不要
echo クロロエチルメチルエーテル | sed -E 's/(エチル)(メチル)/\2\1/g'

# 以下のようにもかける
echo クロロエチルメチルエーテル | sed -E 's/(エ..)(...)/\2\1/g'
#検索(//pのパターン)
sed -n '/正規表現/p'

# 期間抽出（正規表現1に一致する行から、正規表現2に一致する行までを出力する）
sed -n '/正規表現1/,/正規表現2/p'
#grep
デフォルトで正規表現が使える
入力は 1 行ごとでも、スペース区切りでも OK
# 0を含むもの
seq 100 | grep "0"

# 8で始まるもの
seq 100 | grep "^8"

# 8で終わるもの
seq 100 | grep "8$"

# 80台
seq 100 | grep "8."

# 1, 10, 100, ...
seq 100 | grep "^10*$"

# 偶数
seq 100 | grep "[02468]$"

# 奇数
seq 100 | grep "[^02468]$"
-o
マッチした部分のみが出力される
複数行で出力される
-A 10や-B 10
後 10 行、前 10 行を表示する
# 山田と上田
echo 中村 山田 田代 上田 | grep -o '[^ ]田'
-lオプション - 一致した部分ではなくファイル名を出力する
-Rオプション - ディレクトリ内のファイルを再帰的に読み込む
grep some_pattern ./* - 特定のディレクトリ内のファイル内容を検索
#awk
grep にプログラム機能を加えたもの
awk '/正規表現/'の書き方にすれば正規表現が使える
$0は「すべての列（行全体）」を表す
$1は「１列目の文字列 or 数値」を表す
データの n 列目を「第 n フィールド」と呼ぶ
printは自動的に間のスペースと行末の改行を入れてくれる。awk ではよく使う。
構成要素
Pattern
抽出条件のこと
正規表現 or 計算式
e.g. $1%2==0, /[a..b]/
Action
処理のこと
{}で囲まれている
e.g. {print(...)}
デフォルトは print
Rule
パターンとアクションの組み合わせのこと
パターンだけ、アクションだけでも実行可能
# 正規表現で抜き出す
seq 5 | awk '/[24]/'

# 計算で抜き出す
seq 5 | awk '$1%2==2'

# マッチした行に処理を加える(以下の２つは等価）
seq 5 | awk '$1%2==0{printf("%s 偶数\n", $1)}'
seq 5 | awk '$1%2==0{print($1,"偶数")}'

# 2つ以上のルールを使う
seq 5 | awk '$1%2==0{print($1,"偶数")}$1%2==1{print($1,"奇数")}'

# 三項演算子を使う
seq 5 | awk '{print($1%2==0 ? "奇数" : "偶数")}'
期間抽出
正規表現 1 に一致する行から、正規表現 2 に一致する行までを出力する
awk '/正規表現1/,/正規表現2/'
列の結合（と比較）
awk '$1$2=="abcd"'
#`$1" "$2`は$1と$2をスペースでつなげたものになる
awk '$1" "$2=="abcd"'
-Fオプション
区切り文字を明示的に指定する
awk -F: だとコロンが区切りになる
デフォルトはスペース
組み込み変数
NF - 総フィールド数
NR - 行番号
#Pattern, Action のどちらでも利用可能なもの
比較
$1<"20191001
Regex
$2~/REGEX_PATTERN/
or は||
#Pattern
BEGIN パターンは最初の行の処理前に実行される
無名のパターンは全ての行で実行される
END パターンは最終行の処理後に実行される
awk 'BEGIN{a=0}{a+=1}END{print a}'
#Action
三項演算子で条件分岐
awk '{print ($1<12?"午前":"午後")}'
三項演算子で条件分岐(列を追加する)
awk '{tax=($1<"20191001")?1.08:1.1;print $0,tax}'
一つのアクション内で２つのコマンドを実行したいときは;で区切る。
awk '{printf("a");printf("b")}'
列の値で計算する
awk '{print int($3*$4)}'
#xargs
入力を横に並べて、出力する
デフォルトではechoが指定されたものとみなされる
入力を横に並べて、コマンドに 引数(入力ではない) として渡したうえ実行してもらう
本来の使い方
seq 4 | xargs mkdir # => `mkdir 1 2 3 4`になる
seq 4 | xargs rmdir # => `rmdir 1 2 3 4`になる
決まった数ずつコマンドに渡していく
seq 4 | xargs -n2 mv
# `mv 1 2`と`mv 3 4`になる
下記のように数個ずつ画面出力するのにも使える。
この際空行は削除される
セキュリティには注意すること
seq 10 | xargs -n5
入力を改変してコマンドに渡す(@マークは別の文字に変えても OK)
seq 4 | xargs -I@ mkdir dir_@
並列実行する
xargs -P4 SOME_COMMAND
#bc
計算をするために使う。

echo '1+1' | bc
#sort, uniq
データの中に何がいくつあるのか数えるときは、「sort で並び替えて uniq で数える」のが鉄板
ただし、sort -uで同じことを一発で実現できる
なぜ sort が必要なのか？
uniq に与えられるデータはソートされていることが前提のため（一つのことだけやる。プログラムを簡素にする。UNIX 的な思想。）
seq 5 | awk '{print($1%2==0 ? "奇数" : "偶数")}' | sort | uniq -c
# 2列目から2列目を使って辞書順でソート(10 then 1)
sort -k2,2

# 2列目から2列目を使って数値順でソート(1 then 10)
sort -k2,2n
#パイプ
|
左の結果を右に渡す
異なるプロセス間でのデータの受け渡し方法（プロセス間通信）の一つ
#標準入出力
しっかりしたコマンドは
別のコマンドに渡すべきデータを標準出力から出す
別のコマンドに渡すべきでないデータを標準エラー出力から出す
デフォルトでは
標準出力と標準エラー出力は端末画面につながっている
標準入力はキーボードにつながっている
ファイル記述子（ファイルディスクリプタ）
0 - 標準入力
1 - 標準出力
2 - 標準エラー出力
標準出力のリダイレクト

test.sh > file.txt
test.sh 1> file.txt
標準エラー出力のリダイレクト

test.sh 2> file.txt

# stderrの出力先を、いまstdoutがつながっている先に振り向ける（マージされる）
test.sh 2>&1

# パイプを使った方法（stdoutのみならずstderrも渡される）
test.sh |& cat
標準入力のリダイレクト

cat < file.txt
cat 0< file.txt

# 番外編）catとpipeを組み合わせる方法
cat a.txt | wc -l

# 番外編）引数にファイル名を指定
wc -l a.txt
#read
標準入力を読み込んで変数にセットする

echo 123 | read v ; echo "$v" #=> 123
#変数
値のセット

スペースを入れてはだめ(コマンドとして解釈されるから)
a=ほげほげ
値の利用

コマンドが実行される前に変数が文字列に入れ替わる
$a
${a} # この書き方が必要になることもある。変数名のあとに文字を続けたい場合など。
文字列操作

${a//}や${a::}などは Parameter Expansion(変数展開)と呼ぶ
a=あいうえお
b=かきくけこ

# 結合
echo $a$b # あいうえおかきくけこ

# 追加（破壊的）
$a+=$b ; echo $a # あいうえおかきくけこ

# 開始位置と長さ
echo ${a:1:3} # いうえ

# 置き換え
echo ${a/えお/けこ} # あいうけこ
計算

算術式展開$(())を使う
括弧内で変数を使うとき、頭の$は不要
扱えるのは整数のみ
a=6
b=2
echo $((a+b)) # 8
クォート

シングルクォート
変数($1など)をシェルで解釈せずに、そのままコマンドに渡す
空白の入った引数をひとまとめにして引き渡す
e.g. awk の'{print 1+1}'など
ダブルクオート
変数がシェルで解釈される
シェルスクリプトでは変数はダブルクォートの中に配置するのが無難
変数の中身が空文字だと、なかったものとして扱われるため
re=""

grep "$re" /etc/passwd # ok
grep $re /etc/passwd # grep /etc/passwd と解釈されるため不正
#配列、連想配列
配列

a=("$SHELL" "$LANG" "$USER")

# 取り出し(zshでは1スタート)
echo ${a[1]}

# 取り出し(全て)
echo ${a[*]}
echo ${a[@]}

# 要素数のカウントは#
echo ${#a[@]}
連想配列

declare -A b
b["SHELL"]="$SHELL"
b["LANG"]="$LANG"
b["USER"]="$USER"

# 取り出し
echo ${b["SHELL"]}

# 取り出し(全て)
echo ${b[*]}
echo ${b[@]}

# 取り出し(key, valueなど)
echo ${(k)b}
echo ${(v)b}
echo ${(kv)b}

# 要素数のカウントは#
echo ${#b[@]}
{}は必須。
これがないと文字列の結合になってしまう
@と*はクォートした時の動作が異なる。
*をクオートした時には、IFS(デフォルトではスペース)で連結された文字列になる
#位置パラメータ
主にシェルスクリプト内において、与えられた引数を取得する時に使われる
$1 1 番目の引数
${22} 22 番目の引数 (二桁以上なら{}が必須)
$@ 1 つ目以降の全ての引数
$* 1 つ目以降の全ての引数 (ダブルクオートしたときに IFS で連結された文字列になる)
位置パラメータを手動でセットにはsetコマンドを使う
set aa bb cc
echo $2 #=> bb
for 文における位置パラメータの利用

for x in "$1" "$2" "$3" ; do echo $x ; done
# or
for x in "$@" ; do echo $x ; done
#終了ステータス
以下で確認できる
$? - 最後のコマンドの終了ステータス
$pipestatus[@] or $PIPESTATUS[@] - パイプライン全ての終了ステータス
ステータスの意味は各コマンドのmanで調べられる
128 以上の終了ステータスについては、128 を引くことで異常終了の原因となったシグナルを特定できる
#ヒアストリング
パイプの別の書き方。以下の二つは等価。

echo $a | grep '[02468]$'
grep '[02468]$' <<< "$a"
#while 文
終了ステータスが正常である限り実行が続く
以下の例ではreadが成功する限り
seq 3 | while read x ; do printf "%s " $x ; done
#if 文
if 文の後に実行したコマンドみスとして得ることができる。

# 数値比較
a=0
[0

# 文字列比較
b="hola"
[ "$a" = "hello" ]

# ファイ¼ディレクトリやリンクを除く）
[ -f some.txt ]
#は実行されない
command1 || command2
#コマンド置き換え
$(コマンド)
該当部分がコマンドの実行結果に差し替えられる
a=きたうらわ
echo ${a}を逆さのごとに、別の bash を立ち上げて実行する

( (command2 && echo "hello2")

# 一時的にcdしたい時なã¨ exec
fork
プロセスの分身を作る
変数等は全ã·ェルはこの仕組みで動く
exec
自プロセスを刨呼ばれる
#プロセス
プロセス
OS がコマンドやられる（プロセス番号、プロセス ID、PID）
ps - 一覧
#コマンドの種類
外部コマンド
実体のフã¼タを印字出力するなど
今はエミュレータ
#ど¡込んだ 1 行分の命令
#1.2.b コマンドの止め方
mefile
rmdir tmp/
#1.2.f ファイルのパーミッショãomefileで実行できる
シェルスクリプトをコマの抽出の例：

# 王道
cat ./qdata/1/files.txt | grep 的に出力しない
# - `/正規表現/p`でマッチす xargs -P2 touch

ls | awk '{printf("%d %04d ",$1,$1)}' | xargs -n2 mv
#Q4 特定の内容のファイルを探す
grep -l --)printf(" ");printf("x\n")}'
#Q7 消費税
20190901 ゼロã7:02:17:16 +0900]
66.YYY.79.XXX - - [07/Nov/2017:14:42:48 +0900]
::1 - - [07/Nov/2017:13:37:54 +0900]
133.YY.23.XX - - [07/Nov/2017:09:41:48 +0900]
cat qdata/8/access.log | \
awk -F: '{print $(NF-2)}' | \
awk '{print ($1<12?"午前":"午後")}' | \ªければファイル作成
[ -f some.txt ] || touch some.txt14 羊を数える
# 共通部分
do
  echo "羊が${n}匹"
  n=$((n+1))
  sleep 1
done

# while+変数
n=1
while [ $n -le 10  100)

# シーケンス式
for n in {1..100}








<!--
{{% tips-list alert %}}
注意
: 「>>」も同様に `tee -a`の場合は、予めファイルを作成しておき、そのファイルに対して「>>」や`tee -a`を行います。追記する最初の処理段階でファイルが存在していることを明示的に書いておくことが重要です。
: 以下のまとめのように、追記する前に上書きする処理をしておく場合は、あらかじめファイルの生成をする必要はありませんが、明示的に「 $ :> filename 」のようにファイルを生成しておくと、ソースがわかりやすくなります。
{{% /tips-list %}}
-->



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

---
title: "【ターミナルTIPS】ターミナルで知っておくとちょっとだけ便利なコマンド"
date: 2022-11-28T11:49:20+09:00
draft: false
authors: suzuki
image: linux.jpg
categories:
  - programming
tags:
  - ターミナル
  - TIPS
  - マニアックコマンド
  - シェルスクリプト
  - Bash
  - コマンド活用
  - 鈴木維一郎
---



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



