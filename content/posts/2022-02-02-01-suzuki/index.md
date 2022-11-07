---
authors: suzuki
title: "【grep/sed/awkも】ざっくりわかるシェルスクリプト５」"
description: "この記事はシェルスクリプトを４５分でざっくりマスターできるチュートリアルです。bashスクリプト「Hello, World」から、ifステートメントなどの条件分岐、while, for, untilループをはじめ、シェルスクリプトの効率的なデバッグ手法の紹介など、シェルスクリプトを網羅的かつ短時間で学習することができます。"
date: 2022-02-02T15:55:47+09:00
draft: false
image: shellscript.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - プログラミング
  - シェルスクリプト
  - Bash
  - grep
  - sed 
  - awk
  - 鈴木維一郎
---


この記事はシェルスクリプトを４５分でざっくりマスターできるチュートリアルです。bashスクリプト「Hello, World」から、ifステートメントなどの条件分岐、while, for, untilループをはじめ、シェルスクリプトの効率的なデバッグ手法の紹介など、シェルスクリプトを網羅的かつ短時間で学習することができます。
過去、bashの経験があり、久しぶりにbashを書く必要に迫られた人、他の言語でプログラム経験があり、bash独自の書き方をざっくりと思い出したい人は、このトピックを長め読むだけで、充分 bashを思い出せるはずです。
このトピックをざっくり読み流すとおよそ４５分でbashの構文を網羅的に理解することができます。

では次のトピックについて説明します。


## はじめてのシェルスクリプト

このトピックでは、catコマンドでシェルの場所を確認後、スクリプトファイルの作成、echoコマンドを使用して「Hello,shellscript.」記述し、スクリプトファイルを実行可能にします。

ではまず、ターミナルに次のコマンドを入力します。


```
$ cat  /etc/shells
```

実行するとおおよそ次の出力となります。


$ cat /etc/shells
/bin/sh
/bin/bash
/sbin/nologin
/usr/bin/sh
/usr/bin/bash
/usr/sbin/nologin
$ 


このコマンドは、システムで利用可能なすべてのシェルを表示し、それらのいずれかを使用できます。
このタスクでシステムにbashシェルがあるかどうかを確認できました。bashのパスを知るには、ターミナルで「$ which bash」を実行します。


```
$ which bash
/usr/bin/bash
$
```

{{% tips-list tips %}}
ヒント
: このパスをシェバンといいます。シェルスクリプトを実行する「bash」のPATHは「/usr/bin/bash」であることがわかりました。このシェバンを、すべてのシェルスクリプトのページ先頭に書き込む必要があります。
{{% /tips-list %}}


シェバンをソースファイルの先頭行に書きます。

``` bash:helloScript.sh
#!/usr/bin/bash

```

ではさっそく「helloScript.sh」ファイルに「Hello,shellscript.」を記述しましょう。内容は以下の通りです。


``` bash:helloScript.sh
#!/bin/bash

echo "Hello,shellscript.";

```

ファイルを保存し、ターミナルに戻り、「ls」コマンドを実行してファイルの存在を確認します。「ls -la」を使用してファイルの詳細を取得することもできます。
その結果は、次のようになります。


```
$ ls
helloScript.sh
$
```

```
$ ls -la
-rw-rw-r--   1 suzuki suzuki    44  2月  2 18:30 helloScript.sh
$
```

'rw-rw-r' は、ファイルの所有者が、ファイへの読み取り、および書き込み権限を持っていることを示します。


読むことができる (Readable)		r	4
書くことができる (Writable)		w	2
実行することができる (eXecutable)	x	1
なにもできない				-	0


３つのブロックにわかれているのは、グループを示しています。

自分 グループ	他人
 xrw    xrw     xrw

現在のhelloScript.shは -rw ですから、読むことと、書くことはできるものの、実行する権限がないようです。
このスクリプトを実行可能にするには、ターミナルで次のコマンドを実行する必要があります。

```
$ chmod +x helloScript.sh
```

次に、「ls -la」コマンドを使用して「helloScript.sh」ファイルのアクセス許可を確認し、次の出力が得られます。


```
$ ls -la
-rwxrwxr-x   1 suzuki suzuki    44  2月  2 18:30 helloScript.sh
$
```

実行権限が付きました。
次に、ターミナルのコマンド「$ bash /helloScript.sh」を使用してファイルを実行します。


```
$ ./helloScript.sh
Hello, shell script.
$
```



{{% tips-list tips %}}
ヒント
: ファイルの実行方法はざっくりと２種類あります。
: $ chmod +x <ファイル名> 
: で、実行権限を与えたうえで、
: $ ./<ファイル名>
: とする方法。

: ファイルに実行権限を与えずに
: $ bash <ファイル名> 
: と、する方法です。

: セキュリティ的には後者が望ましいです。
: 理由は、悪意を持つ第三者、または誤操作によってスクリプトファイルが簡単に実行できてしまう環境を作るべきではないからです。
: 何のファイルかわかりもせずに　
: $ ./<ファイル名> 
: で実行できてしまうのは恐怖です。
: 実行する場合、ソースの中身を確認するのはもちろんですが、実行権限を軽率に与えることは控えましょう。
{{% /tips-list %}}





## ファイルへの出力

このトピックでは、シェルスクリプトの実行結果を、別のファイルに出力する方法を紹介します。「helloScript.sh」の echo 行の末尾に少し追記するだけです。


``` bash:helloScript.sh
#!/bin/bash

echo "Hello, shell script." > hello.txt;
```

ファイルを保存し、「$ bash helloScript.sh」でスクリプトを実行します。
次の出力が表示されます。「ls -la」を押して、新しいファイルが存在することを確認してください。


```
$ ls -la 
helloScript.sh      hello.txt
$
```


{{% tips-list tips %}}
ヒント
: 「>」をリダイレクトと言います。
{{% /tips-list %}}


ファイルの出力は２種類あります。
リダイレクト出力は、新規に空のファイルを作成したうえで文字を出力します。
もう一つの出力方法は「アペンド >> 」です。
アペンドは、既に存在するファイルに追記します。
追記方法は簡単で、>> を使うだけです。

``` bash:helloScript.sh
#!/bin/bash

echo "Hello, shell script." > hello.txt;
echo "and bash." >> hello.txt; # ここで追記
```


{{% tips-list tips %}}
ヒント
: 「>>」をアペンドと言います。
: アペンドするときの注意点は、アペンドする場合は、既にファイルが存在している必要があります。「touch」コマンドでファイルを生成したうえでアペンドするか、あらかじめ「> リダイレクト」でファイルを生成し、文字列を追記したうえで、「>> アペンド」します。
{{% /tips-list %}}




## コメント

コメントはスクリプトの実行時に無視されます。スクリプトでは、コメントは何もしません。コメントには３つの種類があります。

1行のコメント
複数行のコメント
HereDoc Delimeter

1行のコメントの場合、コメントステートメントの前に「#」記号を半角で書きます。


``` bash:lineComment.sh
#!/bin/bash 

# this is a 1st comment
echo "Hello,shellscript." > file.txt;
```

コメントを複数行にわたって書きたいことがあります。行頭に「# 」を書けばよいのですが、改行の度に行頭に「# 」を挿入する必要があり、とっても面倒です。
C 言語やJava、HTMLですらも複数行コメントがあるのに。。。
シェルスクリプトにもあります。あるんです。みんな知らないだけです。
最初のコメントの先頭の前に「: '」を置き、最後のコメントの後に「'」と書くことだけです。理解を深めるために、次のスクリプトを調べることができます。

{{% tips-list tips %}}
ヒント
: 「:」と「'」の間は半角スペースを入れます。
{{% /tips-list %}}

``` bash:multiComment.sh
#!/bin/bash

: '
This is the segment of multi-line comments
Through this script, you will learn
How to do multi-line commenting
'

# this is a 1st comment
echo "Hello,shellscript." > file.txt
```


仰々しいマルチラインコメントもあります。
こちらのマルチラインコメントが使われない理由は、これから紹介するヒアドキュメントの記述方法に似ていてまぎらわしいからです。


``` bash:multiComment.sh
#!/bin/bash

# 仰々しいマルチラインコメント
<<COMMENT
    your comment 1
    comment 2
    blah
COMMENT


# シンプルなマルチラインコメント
: '
This is the segment of multi-line comments
Through this script, you will learn
How to do multi-line commenting
'

# this is a 1st comment
echo "Hello,shellscript." > file.txt;
```

{{% tips-list tips %}}
ヒント
: 「:」と「'」の間は半角スペースを入れます。
{{% /tips-list %}}

ヒアドキュメントはとてもべんりな出力方法です。
コメントではありませんが、上記のマルチラインコメントと似ているので、ここでご紹介します。

通常、複数の行出力は以下のように記述します。


``` bash:hereDocuments.sh
#!/bin/bash

touch file.txt;
echo "Hello,shellscript 1." >> file.txt;
echo "Hello,shellscript 2." >> file.txt;
echo "Hello,shellscript 3." >> file.txt;
```


とっても面倒ですね。
そこでヒアドキュメントの出番となります。ヒアドキュメントでは以下のように書くことができます。


``` bash:hereDocuments.sh
#!/bin/bash

cat << EOS
Hello,shellscript 1.
Hello,shellscript 2.
Hello,shellscript 3.
EOS
```

スクリプトを実行すると、次の出力が表示されます。


```
$ bash hereDocuments.sh
Hello,shellscript 1.
Hello,shellscript 2.
Hello,shellscript 3.
$
```


cat の後ろに 「 - ハイフン」を置くと、インデントが有効になります。


``` bash:hereDocuments.sh
#!/bin/bash

cat <<-EOS
	Hello,shellscript 1.
	Hello,shellscript 2.
	Hello,shellscript 3.
EOS
```


スクリプトを実行すると、次の出力が表示されます。


```
$ bash hereDocuments.sh
	Hello,shellscript 1.
	Hello,shellscript 2.
	Hello,shellscript 3.
$
```


{{% tips-list tips %}}
ヒント
: cat <<-EOS
: (-)ハイフンを置くtipsを忘れずに。
{{% /tips-list %}}




##  条件分岐

このトピックでは以下について説明します。

ifステートメント
if-elseステートメント
if-else ifステートメント
AND演算子とOR演算子



### Ifステートメント
ifセグメントに条件を書き込むには、条件の前後に「[ ]」内に余分なものを与える必要があります。その後、条件コードを述べ、次の行に移動し、「その後」と書き、条件がtrueの場合に実行するコード行を述べます。最後に、ifステートメントを閉じるには「fi」を使用します。以下は、ifステートメントの構文を理解するスクリプトコードの例です。

ifステートメントには「[   ]」内に条件を書きます。
「if」と 「[」の間には半角スペースが必要です。
また、「[」と条件文、条件文と「]」の間にも半角スペースが必要です。
ifの終わりには、「fi」で閉じる必要があります。



``` bash:if-statements.sh
#!/bin/bash

count=10;
if [ "$count" -eq 10 ]; then 
    echo "the condition is true";
fi
```


このスクリプトは変数「カウント」に「10」の値を割り当てます。
「if」の条件「[ "$count" -eq 10 ]」は、count変数の値が10と「等しい」かどうかを確認する条件文です。
この条件がtrueで成立すると、処理は次のステートメントに移動します。
最後の「fi」は、このif-statementブロックの終了を示すキーワードです。


条件が成立しない場合、このプログラムには「else」ブロックがないため、何もしません。

次のプログラムは条件が成立しない場合の処理となります。


``` bash:ifelse-statements.sh
#!/bin/bash

count=11; # COUNT は 11とする
if [ "$count" -eq 10 ]; then 
    echo "the condition is true";
else
    echo "the condition is false. count: $count";
fi
```

このプログラムでは、「$count」変数は11の値で割り当てています。
この場合、ifブロックの条件が成立しないため、「if」セクション全体を無視して「else」ブロックに移動します。
端末は、条件がfalseであるというステートメントと$countを表示します。


条件を書くための別の形式もあります。
「[ ]」を「(( ))」括弧に置き換え、それらの間に条件を書き込むだけです。
C言語、Javaに慣れている人は、この記述方法のほうが直観的かもしれません。
この形式の例を次に示します。


``` bash:bracketIfelse-statements.sh
#!/bin/bash

count=11; # COUNT は 11とする
if ((count==10)); then 
    echo "the condition is true";
 else
    echo "the condition is false count: $count";
fi
```



### if-else ifステートメント
スクリプトでif-else ifをステートメントのブロックとして使用すると、プログラムは条件を再チェックします。同様に、以下のサンプルコードを「helloScript.sh」に記述すると、プログラムは最初に「if」条件をチェックすることがわかります。「カウント」変数には「10」の値が割り当てられます。最初の「if」条件では、プログラムは「カウント」が9より大きい値を持っていることを確認します。その後、「if」ブロックに書かれたステートメントが実行され、そこから出てきます。たとえば、「elif」で書かれた条件がtrueの場合、プログラムは「elif」ブロックで書かれたステートメントのみを実行し、ステートメントの「if」および「else」ブロックを無視します。


``` bash:ifelseif-statements.sh
#!/bin/bash

count=8;
if ((count>9)); then 
    echo "the first condition is true";
elif ((count<=9)); then
    echo "then second condition is true";
else
    echo "the condition is false";
fi
```


### AND演算子
条件で「AND」演算子を使用するには、条件間で記号「&&」を使用します。
たとえば、「[ "$age" -gt 18 ] と [ "$age" -lt 40 ]をチェックし、年齢が18より大きく、年齢が40未満の場合、これはfalseであることがわかります。プログラムは「その後」の後に書かれたステートメントを無視し、端末に「年齢は正しくない」と印刷して「else」ブロックに向かって移動します


``` bash:andOperator.sh
#!/bin/bash

age=10
if [ "$age" -gt 18 ] && [ "$age" -lt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```

条件を次の形式で書くこともできます。

``` bash:andOperator2.sh
#!/bin/bash

age=30
if [[ "$age" -gt 18 && "$age" -lt 40 ]]
then
    echo "age is correct"
else
    echo "age is not correct"
fi
```

「&&」の代わりに「-a」を使用して、プログラムの条件でAND演算子を使用することもできます。それは同じように動作します。


``` bash:andOperator3.sh
#!/bin/bash

age=30
if [ "$age" -gt 18 -a "$age" -lt 40 ]
then
    echo "age is correct"
else
    echo "age is not correct"
fi
```

このコードを「helloScript.sh」スクリプトに保存し、ターミナルから実行します


### OR演算子
2つの条件があり、それらのいずれかまたは両方がtrueの場合、前述のステートメントを実行する場合、OR演算子が使用されます。 「-o」はOR演算子を表すために使用されます。「||」記号を使用することもできます。
次のサンプルコードを「helloScript.sh」に書き、ターミナルから実行して動作を確認します。

``` bash:orOperator.sh
#!/bin/bash

age=30
if [ "$age" -gt 18 -o "$age" -lt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```
OR演算子をよりよく理解するために、さまざまな条件を試すこともできます。以下に４つのサンプルを記します。


``` bash:orOperator1.sh
#!/bin/bash

age=30
if [ "$age" -lt 18 -o "$age" -lt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```


``` bash:orOperator2.sh
#!/bin/bash

age=30
if [ "$age" -lt 18 -o "$age" -gt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```


``` bash:orOperator3.sh
#!/bin/bash

age=30
if [[ "$age" -lt 18 || "$age" -gt 40 ]]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```


``` bash:orOperator4.sh
#!/bin/bash

age=30
if [ "$age" -lt 18 ] || [ "$age" -gt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```



## ループ

このトピックでは、以下の説明をします。

whileループ
until ループ
for ループ
break と continue


### whileループ:
ループは条件がtrueの場合にコードブロック(do...doneで囲まれています)を実行し、条件がfalseになるまでそれを実行し続けます。

条件がfalseになると、whileループは終了します。
whileループは、キーワード「while」から始まり、そのうしろに条件文を書きます。
条件文を閉じたらキーワード「do」を使用し、プログラムの条件がtrueの場合に実行する処理ステートメントの束を書きます。
処理ステートメントの終了後、キーワード「done」を書いてwhileループを閉じます。

以下、スクリプトを「helloScript.sh」として保存します。



``` bash:whileLoop.sh
#!/bin/bash

number=1;
while [ $number -lt 10 ]; do
  echo "$number";
  number=$(( number+1 ));
done
```


ターミナルで「$ ./whileLoop.sh」コマンドを使用してスクリプトを実行ます。

```
$ bash whileLoop.sh
1
2
3
4
5
6
7
8
9
$
```


Whileループでは、まず、条件が真かどうかをチェックします。
条件がfalseの場合、ループから出てプログラムを終了します。

条件が true の場合、実行シーケンスはキーワード 'do' の後に書かれたステートメントに移動します。
上記サンプルのは、「echo」により１から９までが出力されます。


{{% tips-list tips %}}
ヒント
: ループ自体をループさせるincrementステートメントについて
: $(( )) は、括弧内で計算された値が引き出されます。
: (( )) 内は、変数の冒頭に $ は必要ありません。
: (( )) 内は、四則演算が可能です。スペースを空ける必要もありません。
{{% /tips-list %}}




### until ループ:
loopが条件がfalseのときにコードブロック(do...doneで囲まれている)を実行し、条件がtrueになるまで実行し続けるまでループし続け、条件が true になると、until ループは終了します。
untilループの構文はwhileループの構文と同じで、「while」の代わりに「until」という言葉を使用します。


ターミナルで「$ ./untilLoop.sh」コマンドを使用してスクリプトを実行ます。


``` bash:untilLoop.sh
#!/bin/bash

number=1;
until [ $number -ge 10 ]; do
  echo "$number";
  number=$(( number+1 ));
done
```

上記のコードを「untilLoop.sh」ファイルに保存します。コマンドを使って実行する


```
$ bash untilLoop.sh
1
2
3
4
5
6
7
8
9
$
```

{{% tips-list tips %}}
ヒント
: whileループは、条件が true の時に( do ...done) ブロックを実行し、条件が false になるとループを終了します。
: untilループは、条件が false の時に( do ...done) ブロックを実行し、条件が true になるとループを終了します。
{{% /tips-list %}}



### for ループ:
forループは、繰り返し実行される条件を指定するループのタイプです。
forループには、いくつかの記述方法があります。
最初の方法として、反復用の数字を書きます。
以下に示すコードでは、反復用の数字反復を制御する変数 'i' にさせます。
以下のfor ループは 5 回実行されます。
スクリプトファイル「helloScript.sh」にコードを保存します。



``` bash:forLoop.sh
#!/bin/bash

for i in 1 2 3 4 5 ; do 
  echo $i;
done
```

ターミナルで次のコマンドを入力して、「forLoop.sh」ファイルを実行します。


```
$ bash forLoop.sh
1
2
3
4
5
$
```

この方法はシンプルに見えますが、1000回実行したい場合は、実行したい数値を列挙する必要があるため大変です。
実は、1から1000までの反復回数を書く必要はなく、ループに他の書き方を使用します。
以下のサンプルコード「for i in {0..10}」のように、反復の開始点と終了点を宣言します。
この書き方によってforループは10回実行されます。 '0' は開始点として定義され、'10' は反復の終了点として定義されます。


``` bash:forLoop2.sh
#!/bin/bash

for i in {0..10}; do
  echo $i;
done
```

ファイル「forLoop2.sh」にコードを保存します。ファイルを実行すると、次の出力が表示されます。


```
$ bash forLoop2.sh
0
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
$
```

ループを制御する変数の増分値を定義することもできます。
たとえば、「for i in {0..10..2}」では、'0' をループの開始点、'10' は終点、'2' はループは 'i' 2の増分で、echo $i ステートメントを実行します。
したがって、以下に示す例では、プログラムはループの最初の実行で0を出力し、その後、「i」の値を２つずつインクリメントします。
このコードは、「i」の値を0,2,4,6,8,10として出力します。


``` bash forLoop3.sh
#!/bin/bash

for i in {0..10..2}; do
  echo $i;
done
```


```
$ bash forLoop3.sh
0
2
4
6
8
10
$
```

多くのプログラミング言語でおなじみ「for loop」書式の記述も可能です。
以下のサンプルコードは、このメソッドを使用して「forループ」を書いています。
'for (( i=0; i<5; i++ ))’ では、'i’ はループ全体を制御する変数です。
まず、値 'i' は 値 '0' で初期化され、次にループ 'i<5' の制御ステートメント、'i++' はループのたびに１つずつインクリメントする事をあわらします。


``` bash:increments.sh
#!/bin/bash

for (( i=0; i<5; i++ )); do
  echo $i;
done
```

'i'は0で初期化され、'i'の値が5未満の条件をチェックします。
最初条件の結果は 'true' です。
処理ステートメントに進み、、echo コマンドにより端末に「i」の値を「0」として出力します。
処理が進むにつれ、値「i」が一つずつ増加します。
プログラムは処理の中で、「i」の値が5未満であるかどうかを再度確認し、再び「i」の値('1」を出力します。
    この実行フローは、「i」の値が「5」の値に達するまで続き、「５」に達した段階ではforループをぬけてプログラムは終了します。


```
$ bash increments.sh
0
1
2
3
4
$
```


### breakとcontinue
breakステートメントは、指定された条件でループを終了するために使用されます。
以下に示すコードでは、for loopは if ステートメントの条件により、「i」の値が '5' になるまで通常の実行を行い、「i」が '5以上' ループを停止します。


``` bash:break.sh
#!/bin/bash

for (( i=0; i<=10; i++ )); do
  if [ $i -gt 5 ]; then
    break;
  fi
  echo $i;
done
```

スクリプトを保存し、ファイルを実行します。次の出力が得られます。


```
$ bash break.sh
0
1
2
3
4
5
$
```


Continueステートメントは、breakステートメントとは対照的に機能します。
条件が真である場合は反復をスキップ( continue )し、次の反復に向かって処理を進めます。
以下のループは、'3' と '7' を除いて、'0' から '20' までの端末に 'i' 変数の値を出力します。
ifステートメント 'if [ $i -eq 3 ] || [ $i -eq 7 ]' は、'i' の値が 3 または 7 に等しいときは反復をスキップし、echoせずにforループの処理を進めます。

この概念をよりよく理解するために、次のコードを実行します。


``` bash:continue.sh
#!/bin/bash

for (( i=0; i<=10; i++ )); do
  if [ $i -eq 3 ] || [  $i -eq 7 ]; then
    continue;
  fi
  echo $i;
done
```


```
$ bash continue.sh
0
1
2
4
5
6
8
9
10
$
```

以下のように書くこともできます。こちらの記述のほうがすっきりしていて、Ｃ言語やＪａｖａに慣れ親しんでいる人は、直感的に理解できるかもしれません。

``` bash continue2.sh
for (( i=0; i<=10; i++ )); do
	if (( i==3 || i==7 ));then
    continue;
  fi
  echo $i;
done
```


{{% tips-list tips %}}
ヒント
: (( )) で囲む記述で書いていく方が良いかもしれません。
: 他の言語で慣れ親しんでいる書き方を踏襲することで、bash独特の書き方に振り回される事がないからです。
: なにより、(( )) 内は、変数の冒頭に '$' が不要になるだけでも、コードが見やすくなります。
{{% /tips-list %}}





## スクリプトへの値渡し「実行パラメータ」

このトピックの最初の例は、スクリプトを実行する際に、スクリプトへの入力として値を与えるための説明をします。


``` bash:input.sh
#!/bin/bash

echo $1 $2 $3;
```


このコードは、端末に3つの値を出力します。
上記のコードをスクリプト「input.sh」に保存します。実行時に実行ファイル名に続き、三つの値を指定して、スクリプトに値を渡します。


```
$ bash input.sh BMW MERCEDES TOYOTA
$ BMW MERCEDES TOYOTA
$ 
```


スクリプト実行時に渡した３つの値はそれぞれコードの中で、「BMW」は「$1」、「MERCEDES」は「$2」、「TOYOTA」は「$3」に値は入力されます。


echoステートメントに「$0」を指定すると、スクリプト名も出力されます。


``` bash:input2.sh
#!/bin/bash

echo $0 $1 $2 $3;
```


```
$ bash input2.sh BMW MERCEDES TOYOTA
$ input2.sh BMW MERCEDES TOYOTA
$ 
```

この目的のために配列を使用することもできます。
配列を宣言するには、コード 'args=("$@")' を使用します。
このコード 'args' は配列の名前であり、'@' は無限の数の値を持つ可能性があることを表します。
このタイプの配列宣言は、入力のサイズがわからない場合に便利です。



``` bash:args.sh
#!/bin/bash

args=("$@");
echo ${args[0]} ${args[1]} ${args[2]};
```

BMW'は${args[0]}、「MERCEDES」は${args[1]}、「HONDA」は${args[2]}を表します。


```
$ bash args.sh BMW MERCEDES TOYOTA
$ BMW MERCEDES TOYOTA
$ 
```


以下に示すコードは、無限の数の値を持つ配列の値を出力できます。
前の例では、使用されるコマンド 'echo ${args[0]} ${args[1]} ${args[2]}は配列の最初の3つの値のみを出力しますが、今回のコードは、出力を指定することなく、渡された値の全てを出力します。


``` bash:args2.sh
#!/bin/bash

args=("$@") ;
echo $@;
```


```
$ bash args2.sh BMW MERCEDES TOYOTA
BMW MERCEDES TOYOTA
$ bash args2.sh BMW MERCEDES TOYOTA HONDA
BMW MERCEDES TOYOTA HONDA
$
```


'echo $#' と書いて配列サイズを出力することもできます。


``` bash:args3.sh
#!/bin/bash

args=("$@");
echo $@;
echo $#;  
```


```
$ bash args3.sh BMW MERCEDES TOYOTA
BMW MERCEDES TOYOTA
3
$ bash args3.sh BMW MERCEDES TOYOTA HONDA
BMW MERCEDES TOYOTA HONDA
4
$
```

## 文字列処理

### 文字列の比較
このトピックでは、文字列の比較を紹介します。
プログラムは、ユーザーから2つの文字列入力を受け取ります。
プログラムはそれぞれの値を読みこみ、２つの異なる変数 'st1' 'st2' に格納します。
両方の変数の値を比較するには、「if」ステートメントを使用し、条件文に「==」演算子で、二つの文字列が等価であるかを判定します。
「else」ステートメントは、「文字列が一致しない」場合の処理を記述し、'if' ステートメントを閉じます。

以下は、この手順全体のスクリプトコードです。


``` bash:string.sh
#!/bin/bash

echo "enter Ist string";
read st1;

echo "enter 2nd string";
read st2;

if [ "$st1" == "$st2" ]; then
  echo "strings match";
else
  echo "strings don't match";
fi
```

スクリプトを「string.sh」に保存します。ターミナルからファイルを実行し、比較のために2つの文字列を与えます。異なる入力を使用してコードをテストすることもできます。


```
$ bash string.sh
enter Ist string
BMW
enter 2nd string
BMW
strings match
$
$ bash string.sh
enter Ist string
BMW
enter 2nd string
HONDA
strings don't match
$
```

{{% tips-list tips %}}
ヒント
: 文字列の比較は == です。
: 数値の比較は -eq -gt -lt -ge です。
: -eq は[ == ] equals
: -gt は[ > ]greater than
: -lt は[ < ] less than
: -ge は[ >= ] greater equals です。
{{% /tips-list %}}



### 連結
2つの文字列を連結することもできます。
プルグラムはユーザーへ入力を促し、２つの変数を 'st1' 'st2' 変数に格納します。


``` bash:connect.sh
#!/bin/bash

echo "enter 1st string";
read st1;
echo "enter 2nd string";
read st2;

st3="$st1 $st2";
echo $st3;
```

このコードを「connect.sh」に保存し、端末を使用してファイルを実行し、結果を確認します。


```
$ bash connect.sh
enter 1st string
BMW
enter 2nd string
HONDA
BMW HONDA
$
```

{{% tips-list tips %}}
ヒント
: 文字列の結合時にそれぞれの変数の間に空白を起きたい場合は、以下のように二つの変数を「" "」ダブるクォーテーションで囲みます。
: st3="$st1 $st2";

: 文字列を扱う場合、日頃から変数はダブルクォーテーションで囲む癖をつけておくべきです。
: 変数への代入が「空（くうはく）」だった場合に、プログラムがバグにより停止します。

: これは、文字列を扱う変数に限らず、次章で紹介する数値を格納する変数でも同じです。
: 変数はつねに " " ダブルクオーテーションで囲みましょう。
{{% /tips-list %}}




## 数値計算処理

このトピックでは、スクリプトを使用してさまざまな数値演算を実行する方法を学習します。
最初の方法では、２つの変数を値で定義し、echoステートメントと「+」演算子を使用してこれらの変数の合計を出力します。


``` bash:numberCalc.sh
#!/bin/bash

n1=4;
n2=20;
echo $(( n1 + n2 ));
```

```
$ bash numberCalc.sh
24
$
```

### 四則演算
加算、減算、乗算、除算などの複数の操作を実行するための単一のスクリプトを書くこともできます。


``` bash:numberCalc2.sh
#!/bin/bash

n1=20;
n2=4;

echo $(( n1 + n2 )); 
echo $(( n1 - n2 )); 
echo $(( n1 * n2 )); 
echo $(( n1 / n2 )); 
echo $(( n1 % n2 ));
```


```
$ bash numberCalc2.sh
24
16
80
5
0
$
```


### 算術演算 exprコマンド

算術演算を実行する他の方法は、「expr」コマンドを使用することです。
この「expr」は、これらのn1とn2を他の変数とみなし、操作を実行することです。


``` bash:numberCalc3.sh
#!/bin/bash

n1=20;
n2=4;

echo $(expr $n1 + $n2 );
```


```
$ bash numberCalc3.sh
24
$
```


「expr」を使用して四則演算を処理してみます。


``` bash:numberCalc4.sh
#!/bin/bash

n1=20;
n2=4;

echo $(expr $n1 + $n2 );
echo $(expr $n1 - $n2 );
echo $(expr $n1 \* $n2 );
echo $(expr $n1 / $n2 );
echo $(expr $n1 % $n2 );
```

```
$ bash numberCalc4.sh
24
16
80
5
0
$
```

### 小数点の扱い bcコマンド
exprコマンドなどは小数演算できません。
echoコマンドで数式を作成し、それをbcコマンドに渡して計算します。

``` bc:bc.sh
#!/bin/bash

RESULT=`echo "scale=5; 10.0 / 3.0" | bc`;
echo "$RESULT";
```


```
$ bash bc.sh
3.33333
$
```

## bcコマンドでの小数点以下の指定桁数出力
演算の精度を保つため、上記のように計算は小数点以下5桁で行うけれど、表示は小数点以下2桁とかにしたい場合（桁数を指定したい場合）


``` bash:bc_f.sh
#!/bin/bash

RESULT=`echo "scale=5; 10.0 / 3.0" | bc`
printf "%.2f" $RESULT
```

```
$ bash bc_f.sh
3.33
$
```

printf で桁数を指定します。
実は、bcコマンドでも桁数を指定できます。

``` bash:bc_f.sh
#!/bin/bash

# 先に紹介した方法
RESULT=`echo "scale=5; 10.0 / 3.0" | bc`;
echo "$RESULT";

# printfコマンドで２桁にする
RESULT=`echo "scale=5; 10.0 / 3.0" | bc`;
printf "%.2f\n" "$RESULT";

# bcコマンドで２桁にする
RESULT=`echo "scale=2; 10.0 / 3.0" | bc`;
echo "$RESULT";
```


```
$ bash bc_f.sh
3.33333
3.33
3.33
$
```


{{% tips-list tips %}}
ヒント
: bcコマンドで小数点以下の桁数を指定するためには、scale= で指定します。
: ';'セミコロンを忘れずに。
{{% /tips-list %}}



## declareコマンド

bashには変数の型(int char stringなど）がないため、bashで変数の型を制限することはできません。
ただし、型のような動作を許可することができます。

```
declare [オプション] [変数名]=[値]
```

### グローバル変数とローカル変数
関数内で declare コマンドを使用すると、オプションがなければローカル変数として定義されます。-g オプションを使用すればスクリプト内のグローバルに変数を定義されます。スコープを明示しないと狭いスコープとなります。

``` bash:declare.sh
#!/bin/bash

function set_my_value() {
  declare -x my_env_value='ENV';
  declare -g my_global_value='GLOBAL';
  declare my_local_value='LOCAL';
  my_value='XXX';
}

set_my_value;
echo $my_env_value;
echo $my_global_value;
echo $my_local_value;
echo $my_value;
```

結果は以下の通りです。

```
$ bash declare.sh

GLOBAL

XXX
$
```


### 整数として変数定義する
-i を付ければ整数として変数を定義できます。


``` bash:declare_i.sh
#!/bin/bash

# -i で整数として変数を定義
$ declare -i num=001
$ echo $num
```

```
$ bash declare_i.sh
1
$
```

``` bash:declare_no_i.sh
# -i がないと文字列となるのでそのまま
$ declare str=001
$ decho $str
$ echo $str
```

```
$ bash declare_no_i.sh
001
$
```


{{% tips-list tips %}}
オプションまとめ
: delcare -a: 配列を定義
: delcare -i: 整数として定義
: delcare -r: 読み取り専用変数として定義
: delcare -g: 関数内で使用時、グローバル変数として定義
{{% /tips-list %}}




## 配列

配列を宣言し、その中に値を格納する方法を学びます。
好きなだけ値を保存できます。
配列の名前を書き、その値を「( )」括弧で定義します。


``` bash:array.sh
#!/bin/bash

car=('BMW' 'TOYOTA' 'HONDA');
echo "${car[@]}";
```

```
$ bash array.sh
BMW TOYOTA HONDA
$
```


「BMW」が「0」番目のインデックスに格納され、「TOYOTA」が「1」番目のインデックスに格納され、「HONDA」が「2」番目のインデックスに格納されます。
「BMW」を出力する場合は、${car[0]}と書きます。


``` bash:array2.sh
#!/bin/bash

car=('BMW' 'TOYOTA' 'HONDA');
echo "${car[@]}";

#printing value by using index
echo "printing value using index";
echo "${car[0]}";
echo "${car[1]}";
echo "${car[2]}";
```


```
$ bash array2.sh
BMW TOYOTA HONDA
printing value using index
BMW
TOYOTA
HONDA
$
```


配列のインデックスを印刷することもできます。


``` bash:array3.sh
#!/bin/bash

car=('BMW' 'TOYOTA' 'HONDA');
echo "${car[@]}";
echo "printing the indexes";
echo "${!car[@]}";
```

```
$ bash array3.sh
BMW TOYOTA HONDA
printing the indexes
0 1 2
$
```
配列内の値の合計数を印刷する場合は、ここに「${#car[@]}」と書くだけで、要素の総数を表します。


``` bash:array4.sh
#!/bin/bash

car=('BMW' 'TOYOTA' 'HONDA' 'ROVER');
echo "${car[@]}";
echo "printing  the indexes";
echo "${!car[@]}";
echo "printing number of values";
echo "${#car[@]}";
```


```
$ bash array4.sh
BMW TOYOTA HONDA ROVER
printing  the indexes
0 1 2 3
printing number of values
4
$
```


配列内にある任意の要素を削除したいとします。
要素を削除するには、配列名と削除する要素のインデックスを含む「unset」コマンドを使用します。
「car」配列の2番目のインデックスに格納されている値を削除する場合は、スクリプトに「unset car[2]」と書くだけです。


``` bash:array4.sh
#!/bin/bash

car=('BMW' 'TOYOTA' 'HONDA' 'ROVER')
unset car[2]
echo "${car[@]}"
echo "printing  the indexes"
echo "${!car[@]}"
echo "printing number of values"
echo "${#car[@]}"
```

次のコードを「helloScript.sh」に保存します。「./helloScript.sh」を使用してファイルを実行します。

配列要素を削除することはわかりました。
では「MERCEDES」などの他の値をインデックス2に格納する場合はどうしましょう。
unsetコマンドを使用した後、次の行に「car[2]='MERCEDES」と書きます。


``` bash:array5.sh
#!/bin/bash

car=('BMW' 'TOYOTA' 'HONDA' 'ROVER')
# 2のHONDAを削除
unset car[2]
# 2に値をセット
car[2]='MERCEDES'

echo "${car[@]}"
echo "printing  the indexes"
echo "${!car[@]}"
echo "printing number of values"
echo "${#car[@]}"
```

```
$ bash array5.sh
BMW TOYOTA MERCEDES ROVER
printing  the indexes
0 1 2 3
printing number of values
4
$
```


## 関数

関数は基本的に再利用可能なコード行です。何度も呼び出すことができます。
特定の操作を何度も実行する場合、または特定の処理を何度も実行する場合、関数は、何度も何度も同じコードを書くための時間と労力を軽減します。

以下は関数の構文を示す例です。
覚えておくべき最も重要なことの1つは、関数を呼び出す前にコーディングのどこかで最初に関数を定義または宣言する必要があることです。

コードで関数を定義するには、３つのステップが必要です。
ステップ1は、指定する関数名の前に「function」コマンドを書き関数名を宣言し、後ろに「()」を書きます。
ステップ2は、処理ブロックは「{」ではじまり、「 }」で閉じられた内側ににコードを書くことです。
ステップ3は、function 関数名() で宣言した下の行で実行したい関数名を使用して関数を呼び出すことです。


``` bash:method.sh
#!/bin/bash

# 関数の宣言
function funcName(){
  echo "this is new function";
}

# 関数呼び出し
funcName;
```


```
$ bash method.sh
this is new function
$
```

関数にパラメータを与えることもできます。
たとえば、関数呼び出し時に与えられる任意の単語を引数として指定します。
関数呼び出しの関数名の後ろに、文字列を指定して関数に渡します。
渡された関数は、一つ目のパラメータを $1 として処理を続ける事ができます。


``` bash:method2.sh
#!/bin/bash

function funcPrint(){
  echo "$1";
}

funcPrint "BashScript";
```


```
$ bash method2.sh
BashScript
$
```


複数のパラメータを扱う場合、$1, $2などの変数名は区別がつきにくく、コードが混乱する場合が多いので、変数に代入すると、扱いやすくなります。


``` bash:method2.sh
#!/bin/bash

function funcPrint(){
  name="$1";
  age="$2";

  echo "$name is $age years old.";
}

funcPrint "BashScript" 24 ;
```


```
$ bash method2.sh
BashScript is 24 years old.
$


関数内で宣言される変数はローカル変数です。
というのは一般的なプログラム言語ですが、シェルスクリプトBashはグローバル変数しかありません。関数の中で宣言しても、関数の外で宣言しても、いずれもグローバル変数です。
先に紹介した declare -g を使うことにより、グローバル変数とローカル変数を明確に区別することができます。

例えば、以下のソースでは、関数実行前に「I love Mac」を変数に格納し、出力します。
その後、関数を呼び出し、同変数に「I love Linux」を変数に代入すると、Ｃ言語やＪａｖａなどは、ローカル変数に格納した値は、グローバル変数に影響しない訳ですが、シェルスクリプトBashは、もろに影響します。理由は全てグローバル扱いだからです。

``` bash:global_local.sh
#!/bin/bash

function funcCheck(){
  returningValue="I love Linux";
}
returningValue="I love MAC";
echo $returningValue;
#> I love Mac

funcCheck;

echo $returningValue;
#> I love Linux
```

```
$ bash global_local.sh
I love MAC
I love Linux
$
```


## ファイルとディレクトリ

このトピックでは、
１．ファイルとディレクトリを作成する方法、
２．スクリプトを使用してこれらのファイルとディレクトリの存在を確認する方法、
３．ファイルからテキストを1行ずつ読み取る方法、
４．ファイルにテキストを追加する方法、
５．ファイルを削除する方法、

を紹介します。

### ディレクトリ操作
最初のスクリプトは、「Directory2」という名前のディレクトリを作成します。
'mkdir' コマンドでディレクトリを作成します。
すでに同じディレクトリに「Directory2」フォルダーがある場合はエラーとなります。
エラーに対処するためには、'-p' オプションを使います。
'-p' オプションは、作成しようとするその場所に、作成したいディレクトリ名が既に存在している場合は、なにもしません。ディレクトリが存在しない場合のみ、新しいディレクトリを作成します。


``` bash:mkdir.sh
#!/bin/bash

mkdir -p Directory2
```

現在の場所にディレクトリが存在するかどうかをif文で確認することもできます。
「if」ステートメントでディレクトリが存在するかどうかをチェックするためにはif文の条件式で「-d」フラグを使用します。


``` bash:mkdir-p.sh
#!/bin/bash

echo "enter directory name to check";
read direct;

if [ -d "$direct" ]; then
  echo "$direct exists"
else
  echo "$direct doesn't exist"
fi
```

### ファイル操作
ファイルの作成には「touch」コマンドを使います。

{{% tips-list tips %}}
ヒント
: ディレクトリの作成には 'mkdir' コマンド、
: ファイルの作成には 'touch' コマンドを使います。
{{% /tips-list %}}



``` bash:touch.sh
#!/bin/bash

echo "enter file name to create";
read fileName;

touch $fileName;
```

touchコマンドはmkdirコマンド同様、ファイルを作成しようとするその場所に、既に作成しようとするファイル明度同名のファイルが存在した場合、何もしません。

mkdir は、ディレクトリを作成する。同名のディレクトリがあればエラーとなります。

```
ls 
directory2/
$ mkdir directory2
mkdir: directory2: File exists
$
```

そこで、mkdir -p コマンドは、同名のディレクトリが既にあればエラーを返さず何もしない。なければディレクトリを作成。
touchコマンドも同様で、同名のファイルが既にあればエラーを返さず何もせず、なければファイルを作成します。

{{% tips-list tips %}}
ヒント
: touchコマンドは既に同名のファイルがあれば、エラーを返さない代わりに何もしませんが、「:>」コマンドでファイルを作成した場合、既に作成しようとするその場所に同名のファイルがあった場合、空の新規ファイルで上書きします。（ですので、ファイルは強制的に作成されますが、データ内容は消滅します。
{{% /tips-list %}}


if文で -d フラグでディレクトリの存在を確認する事ができました。
ファイルも同様に -f フラグでファイルの存在を確認する事ができます。


``` bash:checkFile.sh
#!/bin/bash

echo "enter file name to check";
read fileName;

if [ -f "$fileName" ]; then;
    echo "$fileName exists";
else
    echo "$fileName doesn't exist";
fi
```

### テキストへのファイル出力
ファイルにテキストを追加するには、「>」リダイレクト、または「>>」アペンドを使います。
「>」リダイレクトは、ファイルを新規に作成し直してから出力します。
「>>」アペンドは、既にファイルが存在しているときに限定して出力します。

{{% tips-list tips %}}
ヒント
: 「>」リダイレクトは、既にファイルが存在している場合も、ファイルを新規作成します。ですので、元々あったファイルの内容は空になります。からになってもらっては困ると言う場合は、「touch」コマンドを使います。

: また、「>>」アペンドは、追記する場合に、ファイルがない場合はエラーとなります。こうした事にならないように、次の例文で、ファイルの存在を確認して処理を進めます。
{{% /tips-list %}}



``` bash:appendFile.sh
#!/bin/bash

echo "入力ファイル名を指定して下さい";
read fileName;
echo "ファイルに追記したい文字列を入力して下さい";
read fileText;

# ファイルがあれば
if [ -f "$fileName" ]; then
    # アペンド
    echo "アペンドします";
    echo "$fileText" >> $fileName
else
    # リダイレクト
    echo "リダイレクトします";
    echo "$fileText" > $fileName
fi
```


### ファイルの読み込み
スクリプトを使用して任意のファイルを読み取ることもできます。上記の方法に従ってファイルを見つけます。その後、while条件を使用して「read -r line」を使用してファイルを読み取る。ファイルを読み取るので、このシンボル「<」を使用します。


``` bash:whileRead.sh
echo "読み込みたいファイル名を指定して下さい";
read fileName;

# ファイルがあれば
if [ -f "$fileName" ]; then
  # 読み込む
  while read line; do
    echo "$line";
  done<$fileName
else
  echo "$fileName は存在しません";
fi
```



ファイルを削除するには、まずファイルが存在するかどうかを調べることです。


``` bash:rm.sh
#!/bin/bash

echo "enter file name from which you want to delete";
read fileName;

if [ -f "$fileName" ]; then
    rm $fileName;
else
    echo "$fileName doesn't exist";
fi
```

{{% tips-list tips %}}
ヒント
: rmコマンドは非常に危険なコマンドです。
: ファイルの削除の都度確認を促す -i オプションをつけるなどをするとよいでしょう。
: rmコマンドは、ファイルだけではなくディレクトリも削除できます。
: 再帰的に行いたい場合は、-r オプションをつけると良いです。
{{% /tips-list %}}




## curlコマンド

カールは、URL構文を持つデータファイルを取得、または送信するためのコマンドです。
まず最初にしなければならないことはcurlをインストールすることです。

```
# 確認
which curl
/usr/bin/curl
$
```

ない場合、

```
# macの場合
$ sudo brew install curl
```

```
# linuxの場合
$ yum install curl
```

curlをインストールした後、URLを使ってファイルをダウンロードするためのコードを記述します。
curlを使用してデータファイルをダウンロードするには２つのステップが必要です。

１つ目は、そのファイルの完全なリンクアドレスを持つことです。
２つ目は、そのアドレスをスクリプトの「url」変数に保存し、そのURLでcurlコマンドを使用してダウンロードすることです。ここで「-O」は、ダウンロードするファイル名は、実在のファイル名を継承すると言う意味となります。


``` bash:curl.sh
#!/bin/bash

url="http://www.ovh.net/files/1Mb.dat";
curl ${url} -O;
```

ダウンロードしたファイルに新しい名前を与えるには、「-o」オプションでファイル名を指定します。


``` bash:curl2.sh
#!/bin/bash

url="http://www.ovh.net/files/1Mb.dat";
curl ${url} -o NewFileDownload;
```

数百ギガバイトのサイズのファイルをダウンロードしたい場合はどうでしょう。
適切なファイルをダウンロードしているかどうかを確認するためにヘッダーファイルをダウンロードすることができます。
ファイルのURLの前に「-I」と書くだけです。


``` bash:curl3.sh
#!/bin/bash

url="http://www.ovh.net/files/1Mb.dat";
curl -I ${url};
```


## selectコマンド

selectコマンドは、列挙したリストを表示させ、ユーザーに入力を促します。

``` bash:select.sh
#!/bin/bash

select car in BMW MERCEDES TESLA ROVER TOYOTA; do
  echo "you have selected $car";
done
```

```
$ bash select.sh
1) BMW	     3) TESLA	  5) TOYOTA
2) MERCEDES  4) ROVER
#? 3
you have selected TESLA
#? 4
you have selected ROVER
#?
```

この場合、選択した車のオプションが表示されますが、オプション以外の番号を入力すると何もしません。
以下の例では、swich-caseを使用して、ユーザーが他の車のオプションを入力した場合、「1から5の間で選択してください」というエラーメッセージが表示されます。


``` bash:select.sh
#!/bin/bash

select car in BMW MERCEDES TESLA ROVER TOYOTA; do
  case $car in
    BMW)
      echo "BMW SELECTED";;
    MERCEDES)
      echo "MERCEDES SELECTED";;
    TESLA)
      echo "TESLA SELECTED";;
    ROVER)
      echo "ROVER SELECTED";;
    TOYOTA)
      echo "TOYOTA SELECTED";;
    *)
      echo "ERROR! Please select between 1 to 5";;
  esac
done
```

プロのメニューでは、プログラムはユーザーの入力を待つ必要があります。
このスクリプトでは、ユーザーに「続行するには任意のキーを押して」ように依頼し、「read -t 3 -n 1」コマンドを使用して3秒ごとにユーザーに「キーSirを押すのを待っています」というリマインダーを送信します。


``` bash:select.sh
#!/bin/bash

echo "press any key to continue";
while [ true ]; do
  # ３秒ごとに入力を促す
  read -t 3 -n 1;
  if [ $? = 0 ]; then
    echo "you have terminated the script";
    exit;
  else
    echo "waiting for you to press the key Sir"
  fi
done
```


## inotifyコマンド ファイルの変更を監視する

inotifyを使用してファイルを変更を監視するする方法を説明します。
inotifyの正式名称は「inode notify」です。
inotifyは、ファイルシステムの変更を監視し、、変更をアプリケーションに報告するLinuxカーネルサブシステムです。inotifyを操作するには、まずターミナルからinotifyをインストールする必要があります。

Linuxの場合
```
$ yum install inotify-tools
```


inotifyがどのように反応するかを確認します。

``` bash:inotify.sh
#!/bin/bash

mkdir -p iNotifyTest
inotifywait -m iNotifyTest
```


では、ターミナルの出力を確認します。
ターミナルをもう一つ起動して上記スクリプトを実行しているターミナルと並べて開きます。


モニターとしてのinotify.shの動作を見ながら別のターミナルウィンドウを開き、「$ touch file1.txt」でファイルを作成すると、inotifyが反応し、ファイルシステムで現在起こっているすべてのアクションを監視していることがわかります。


次に「file1.txt」に何かを書き、inotifyで動作するターミナルウィンドウからの応答を確認してください。



## grepコマンド

grepコマンドについてはここで詳しく書きました。
[【 grep 特集】「ざっくりわかるシェルスクリプト４」](https://suzukiiichiro.github.io/posts/2022-01-24-01-suzuki/)

それはそれとして、ここではざっくりと説明します。

grepは ‘global regular expression print’ の略です。
このコマンドは、テキストを1行ずつ処理してファイル内のパターンを検索するために使用されます。
まず、touchコマンドを使用してfilegrep.txtという名前のファイルを作成します。ターミナルに次のコードを入力します。

```
$ touch filegrep.txt
$ vim filegrep.txt
```

filegrep.txtを開き、ファイルに次のコンテンツを書き込みます。

``` bash:grepfile.txt
This is Linux
This is Windows
This is MAC
This is Linux
This is Windows
This is MAC
This is Linux
This is Windows
This is MAC
This is Linux
This is Windows
This is MAC
```



``` bash:grep.sh
#!/bin/bash

echo "検索したいファイル名を指定して下さい。"

# 入力を grepfile.txt
read fileName

if [[ -f "$fileName" ]]; then
  echo "検索したい語句を入力して下さい。";
  read grepvar;
  grep "$grepvar" "$fileName";
else
  echo "$fileName はありません。"
fi
```

```
$ bash test
検索したいファイル名を指定して下さい。
grepfile.txt
検索したい語句を入力して下さい。
linux
$
```

入力は「linux」（小文字のエル）ですが、ファイル内のテキストは「Linux」（大文字のエル）で書かれているため、検索結果には何も表示されません。ここでは、grepコマンドに「-i」のフラグを追加するだけで、この大文字と小文字を区別する問題に対処する必要があります。

``` bash:grep2.sh
#!/bin/bash

echo "検索したいファイル名を指定して下さい。"

# 入力を grepfile.txt
read fileName

if [[ -f "$fileName" ]]; then
  echo "検索したい語句を入力して下さい。";
  read grepvar;
  # 大文字小文字の区別をしないオプション -i
  grep -i "$grepvar" "$fileName";
else
  echo "$fileName はありません。"
fi
```

```
$ bash grep2.sh
検索したいファイル名を指定して下さい。
grepfile.txt
検索したい語句を入力して下さい。
linux
This is Linux
This is Linux
This is Linux
This is Linux
$
```

出力で行番号を抽出することもできます。このためには、grepコマンドに「-n」の別のフラグを追加するだけです。

``` bash:grep3.sh
#!/bin/bash

echo "検索したいファイル名を指定して下さい。"

# 入力を grepfile.txt
read fileName

if [[ -f "$fileName" ]]; then
  echo "検索したい語句を入力して下さい。";
  read grepvar;
  # 大文字小文字の区別をしないオプション -i
  grep -in "$grepvar" "$fileName";
else
  echo "$fileName はありません。"
fi
```

```
$ bash grep3.sh
検索したいファイル名を指定して下さい。
grepfile.txt
検索したい語句を入力して下さい。
linux
1:This is Linux
4:This is Linux
7:This is Linux
10:This is Linux
$
```

ドキュメント内の特定の単語の発生回数を取得することもできます。grepコマンド「grep -i -c $grepvar $fileName」に「-c」フラグを追加し、スクリプトを保存し、端末を使用して実行します。


``` bash:grep4.sh
#!/bin/bash

echo "検索したいファイル名を指定して下さい。"

# 入力を grepfile.txt
read fileName

if [[ -f "$fileName" ]]; then
  echo "検索したい語句を入力して下さい。";
  read grepvar;
  # 大文字小文字の区別をしないオプション -i
  grep -inc "$grepvar" "$fileName";
else
  echo "$fileName はありません。"
fi
```

```
$ bash test
検索したいファイル名を指定して下さい。
grepfile.txt
検索したい語句を入力して下さい。
linux
4
$
```



## awkコマンド

awkは、データの操作やレポートの作成に使用されるスクリプト言語です。
コンパイルを必要とせず、変数、数値関数、文字列関数、論理演算子が使用できます。
何より処理が高速です。bashよりも高速である場合が多いです。
このトピックでは、シェルスクリプトで多く多用されるawkコマンドの一例を紹介します。

``` 
$ cat grepfile.txt | awk '{ print; }';
This is Linux
This is Windows
This is MAC
This is Linux
This is Windows
This is MAC
This is Linux
This is Windows
This is MAC
This is Linux
This is Windows
This is MAC
$
```


「awk」を使用して特定のパターンを検索することもできます。


```
$ cat grepfile.txt | awk '/Linux/ { print; }';
This is Linux
This is Linux
This is Linux
This is Linux
$
```

次の例では、プログラムがターゲットワードを見つけた行からコンテンツを抽出する方法を見ていきます。 「$1」はその行の最初の単語を表し、同様に「$2」は2番目を表し、「$3」は3番目の単語を表し、「$4」はこの場合最後の単語を表します。


```
$ cat grepfile.txt | awk '/Linux/ { print $3; }';
Linux
Linux
Linux
Linux
$
```

{{% tips-list tips %}}
ヒント
: awkはとても優れたプログラミング言語で、シェル薬婦とを学ぶことと同じほどのボリュームのある言語です。ただ、シェルスクリプトで使われる多くのbashコマンドを使いこなすことで、awkでないとできないことは限られます。まずはこのトピックで使われるawkコマンドの利用例を身につければオッケーです。すこしずつ覚えていくことを増やしていけばよいのです。
{{% /tips-list %}}




## sedコマンド

sedコマンドはストリームエディタの略で、標準入力またはファイルからのテキストの編集操作を実行します。
このトピックでは「i」を「I」に置き換えます。
そのためには、次の sed コマンド 'cat grepfile.txt | sed -e 's/i/I/' と書くだけで、cat コマンドを使用してファイルの内容を取得し、パイプ '|' 記号の後に、'sed' キーワードを使用して、このケースを置き換える操作を指定します。
「s」はスラッシュと置き換えると言う意味です。
「-e」はsed コマンドを連続してフィルタリングすることを可能とするオプションです。
/置き換え前/置き換え後/
となります。

```
$ cat grepfile.txt | sed -e "s/i/I/"
ThIs is Linux
ThIs is Windows
ThIs is MAC
ThIs is Linux
ThIs is Windows
ThIs is MAC
ThIs is Linux
ThIs is Windows
ThIs is MAC
ThIs is Linux
ThIs is Windows
ThIs is MAC
$
```

最初に出てくる 'This is Linux' が 'ThIs is Linux' となったことが解ります。
-g オプションを末尾につけることで、複数回の処理で置き換えます。


``` 
$ cat grepfile.txt | sed -e "s/i/I/g"
ThIs Is LInux
ThIs Is WIndows
ThIs Is MAC
ThIs Is LInux
ThIs Is WIndows
ThIs Is MAC
ThIs Is LInux
ThIs Is WIndows
ThIs Is MAC
ThIs Is LInux
ThIs Is WIndows
ThIs Is MAC
$
```

以下のコマンドで、処理結果を簡単にファイルに出力して、エディターなどで開いて確認する事ができます。

```
cat filegrep.txt | sed -e 's/i/I/g' > newfile.txt
```

単語全体を別の単語に置き換えることもできます。たとえば、以下に示すスクリプトでは、「Linux」のすべてのインスタンスが端末に表示中に「Unix」に置き換えられます。

```
$ cat grepfile.txt | sed -e "s/Linux/Unix/g"
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




## sortコマンド
テキストファイルを行単位で並べ替える
sort 並べ替える
sort -n 数値扱いで並べ替える
sort -r 逆順で出力

まずは以下の読み込み用サンプルファイルを準備します。

``` bash:sample.txt
name:ヤムチャ   skill:狼牙風風拳
name:孫悟空  skill:かめはめ波
name:ピッコロ   skill:魔貫光殺砲
name:ヤムチャ   skill:繰気弾
name:孫悟空  skill:元気玉
name:クリリン   skill:気円斬
name:ヤムチャ   skill:かめはめ波
name:クリリン   skill:かめはめ波
name:孫悟空  skill:ジャン拳
name:ヤムチャ   skill:新狼牙風風拳
```



```
$ cat sample.txt | grep -o "name:\S*" | sort
name:孫悟空
name:孫悟空
name:孫悟空
name:クリリン
name:クリリン
name:ピッコロ
name:ヤムチャ
name:ヤムチャ
name:ヤムチャ
name:ヤムチャ
```

解説
grep -E
検索に「拡張正規表現」を使えるようにする。
^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3} でIPアドレスに一致させる。

grep -o
通常の grep では一致した行全体が表示されるが、-o を指定することにより一致した文字のみを表示させることができる。

sort
次の uniq で重複行のカウントを行うため、並び替える。


## uniqコマンド
uniq -c
重複行のカウントを表示する。

```
$ cat sample.txt | grep -o "name:\S*" | sort | uniq -c
   3 name:孫悟空
   2 name:クリリン
   1 name:ピッコロ
   4 name:ヤムチャ
$
```

## sort -r 逆順
sort -r
カウントの降順で並べ替える。

```
$ cat sample.txt | grep -o "name:\S*" | sort | uniq -c | sort -r
 4 name:ヤムチャ
 3 name:孫悟空
 2 name:クリリン
 1 name:ピッコロ
```

## cutコマンド
cut:タブ区切りでフィールドを選択して出力する
cut -d:デリミタを指定。いわゆる区切り文字
cut -f:抽出するフィールドの番号を指定する。上記コマンドで1を指定した場合は二つ目の"name"が抽出される。


```
$ cat sample.txt | grep -o "name:\S*" | sort | uniq -c | sort -r |  cut -d ":" -f2
ヤムチャ
孫悟空
クリリン
ピッコロ
$
```

## headコマンド
長いメッセージやテキストファイルの先頭だけ／末尾だけを表示する

head -n
n: 出力する行数を指定する。


```
$ cat sample.txt | grep -o "name:\S*" | sort | uniq -c | sort -r |  cut -d ":" -f2 | head -n2
ヤムチャ
孫悟空
$
```

## trコマンド
テキストファイルの文字を置換する／削除する

「-d」オプションで、指定した文字を削除することができます。例えば、Windows環境で作成したテキストファイルの改行コードを、Linux環境向けに置き換えるといった用途に使用できます。

```
$ cat sample.txt
name:ヤムチャ   skill:狼牙風風拳
name:孫悟空  skill:かめはめ波
name:ピッコロ   skill:魔貫光殺砲
name:ヤムチャ   skill:繰気弾
name:孫悟空  skill:元気玉
name:クリリン   skill:気円斬
name:ヤムチャ   skill:かめはめ波
name:クリリン   skill:かめはめ波
name:孫悟空  skill:ジャン拳
name:ヤムチャ   skill:新狼牙風風拳
$ cat sample.txt | tr -d '\n'
name:ヤムチャ   skill:狼牙風風拳name:孫悟空  skill:かめはめ波name:ピッコロ   skill:魔貫光殺砲name:ヤムチャ   skill:繰気弾name:孫悟空  skill:元気玉name:クリリン   skill:気円斬name:ヤムチャ   skill:かめはめ波name:クリリン   skill:かめはめ波name:孫悟空  skill:ジャン拳name:ヤムチャ   skill:新狼牙風風拳 $
```

Windows環境では、改行を「CR」（16進数0D）と「LF」（16進数0A）の2バイトで表しますが、Linux環境では「LF」のみです。trコマンドでは「CR」を「\r」で表すことができるので、「tr -d \r」としてテキストファイルから「CR」を除去することで、Linux環境用の改行コードに変換できます。

「-s」オプションでは、指定した文字が連続している場合には1つにまとめることができます。例えば、「tr -s "\r"」では、連続した改行を1つにします。catコマンドの「-s」オプションと同じ働きになります。



{{% tips-list tips %}}
ヒント
: trコマンドの '\n' はシングルクォーテーションで囲む必要があります。
{{% /tips-list %}}


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
: だいたい解ってきたのではないかと思います。
: 要するにシェルスクリプトは「｜パイプ」で繋いで連続する処理をフィルタリングして、目的の結果に近づけていくというものです。
: 関数を使って、より長く複雑なことも実行可能です。
: Linux(CUI)でできることはすべてシェルスクリプトでできます。
{{% /tips-list %}}



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


