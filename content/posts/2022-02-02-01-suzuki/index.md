---
authors: suzuki
title: "もっとざっくりわかる「シェルスクリプト」"
description: "この記事はシェルスクリプトをざっくりマスターできるチュートリアルです。過去にシェルスクリプトを習熟した経験がある人を対象としていますが、非常に内容の濃いビギナーのための教科書でもあります。bashスクリプト「Hello, World」から、ifステートメントなどの条件分岐、while, for, untilループをはじめ、シェルスクリプトの効率的なデバッグ手法の紹介など、シェルスクリプトを網羅的かつ短時間で学習することができます。"
date: 2022-02-02T15:55:47+09:00
draft: true
image: shellscript.jpg
categories:
  - プログラミング
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - grep
  - sed 
  - awk
  - 鈴木維一郎
---


この記事はシェルスクリプトをざっくりマスターできるチュートリアルです。過去にシェルスクリプトを習熟した経験がある人を対象としていますが、非常に内容の濃いビギナーのための教科書でもあります。bashスクリプト「Hello, World」から、ifステートメントなどの条件分岐、while, for, untilループをはじめ、シェルスクリプトの効率的なデバッグ手法の紹介など、シェルスクリプトを網羅的かつ短時間で学習することができます。

次のトピックについて説明します。

はじめてのバッシュスクリプト
ファイルへの出力
コメント
条件文
ループ
スクリプトへの入力
スクリプトからの出力
別のスクリプトに値を渡す
文字列処理
数値計算
declareコマンドで宣言する
配列
関数
ファイルとディレクトリ
curlコマンドでurlを扱う
プロフェッショナルメニュー
inotifyを使用してファイルシステムを待つ
grepコマンドの紹介
awkコマンドの紹介
sedコマンドの紹介
シェルスクリプトのデバッグ


## はじめてのシェルスクリプト

このトピックでは、echoコマンドを使用して「Hello, shell script.」を出力します。あわせてスクリプトファイルを作成する方法、ファイルを実行可能にする方法をも紹介します。

ターミナルに次のコマンドを入力します。


```
$ cat  /etc/shells
```

実行すると次の出力となります。


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

このパスを 実行するすべてのシェルスクリプトのページ先頭に書き込む必要があります。


``` bash:helloScript.sh
#!/usr/bin/bash

```

「helloScript.sh」ファイルの内容は以下の通りです。


``` bash:helloScript.sh
#! /bin/bash

echo "Hello, shell script.";

```

ファイルを保存し、ターミナルに戻り、「ls」コマンドを実行してファイルの存在を確認します。「ls -la」を使用してファイルの詳細を取得することもできます。

その結果、次のようになります。


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

ファイルがまだ実行可能ではないことは出力から明らかです。 
'rw-rw-r' は、ファイルの所有者が、ファイへの読み取り、および書き込み権限を持っていることを示します。
このスクリプトを実行可能にするには、ターミナルで次のコマンドを実行する必要があります。


```
$ chmod +x helloScript.sh
```

次に、「ls -la」コマンドを使用して「helloScript.sh」ファイルのアクセス許可を確認し、次の出力が得られます。


```
$ ls -la
-rwxrwxr-x   1 suzuki suzuki    44  2月  2 18:30 helloScript.sh
$


次に、ターミナルのコマンド「$ bash /helloScript.sh」を使用してファイルを実行します。


```
$ bash helloScript.sh
Hello, shell script.
$
```


## ファイルへの出力

このトピックでは、シェルスクリプトの実行結果を、別のファイルに出力する方法を紹介します。「helloScript.sh」の echo 行の末尾に少し追記するだけです。


```
echo "Hello, shell script." > hello.txt;
```

ファイルを保存し、「$ bash helloScript.sh」でスクリプトを実行します。
次の出力が表示されます。「ls -la」を押して、新しいファイルが存在することを確認してください。


```
$ ls -la 
helloScript.sh      hello.txt
$
```



## コメント

コメントにはスクリプトに値がありません。スクリプトでは、コメントを書くと何もしません。以前に書かれた現在のプログラマーにコードを説明します。このトピックでは、これら3つのことを学びます。

1行のコメント
複数行のコメント
HereDoc Delimeter

1行のコメントの場合、コメントステートメントの前に「#」記号を使用できます。次のコードは「helloScript.sh」に書くことができます。


``` bash:lineComment.sh
#! /bin/bash 

#this is a cat command
cat>> file.txt
```

プログラミング中は、複数のコード行があり、その場合、これらの1行のコメントを1行ずつ使用することはできません。これは最も時間のかかるプロセスになります。この問題を解決するには、複数行のコメントである他のコメント方法を好むことができます。これを行う必要があるのは、最初のコメントの先頭の前に「:」を置き、最後のコメントの後に「」と書くことだけです。理解を深めるために、次のスクリプトを調べることができます。


``` bash:multiComment.sh
#! /bin/bash

: ‘
This is the segment of multi-line comments
Through this script, you will learn
How to do multi-line commenting
‘
cat>>file.txt
```

したがって、これらの行には値がありません。コードをよりよく理解するために、スクリプトに存在するだけです。


次に学ぶことは、ここヒアドキュメントです。ヒアドキュメントは、シェルと対話するのに役立つ現象です。コメントとヒアドキュメントの目に見える違いは、ヒアドキュメントの下の行が端末に表示され、コメントの場合、コメントは実行後にスクリプト内にのみ存在することです。ヒアドキュメントの構文を以下に示します。


``` bash:hereDocuments.sh
#!/bin/bash

cat << hereDoc
this is a hereDocDelimeter
It is a variable
You can name it whatever you want to
hereDoc
```

スクリプトを実行すると、次の出力が表示されます。


```
$ bash hereDocuments.sh
this is a hereDocDelimeter
It is a variable
You can name it whatever you want to
$
```


##  条件分岐

このトピックでは、ifステートメント、if-elseステートメント、if-else ifステートメント、AND演算子とOR演算子を使用した条件文について説明します。


### Ifステートメント
ifセグメントに条件を書き込むには、条件の前後に「[ ]」内に余分なものを与える必要があります。その後、条件コードを述べ、次の行に移動し、「その後」と書き、条件がtrueの場合に実行するコード行を述べます。最後に、ifステートメントを閉じるには「fi」を使用します。以下は、ifステートメントの構文を理解するスクリプトコードの例です。

``` bash:if-statements.sh
#! /bin/bash

count=10
if [ $count -eq 10 ]; then 
    echo "the condition is true"
fi


まず、このスクリプトは変数「カウント」に「10」の値を割り当てます。「if」のブロックに向かってくると、「[ $count -eq 10 ]」は、count変数の値が「等しい」10であるかどうかを確認する条件です。この条件がtrueになると、実行手順は次のステートメントに移動します。 'then'条件がtrueの場合、私の後に書かれたコードブロックを実行することを指定します。最後に「fi」は、このif-statementブロックの終了を示すキーワードです。この場合、「$count」は変数カウントの値(10)を表すため、条件はtrueです。条件はtrueで、「その後」キーワードに移動し、端末に「条件は真です」を印刷します。


条件が間違っている場合はどうなりますか?「このプログラムには「エルスブロック」がないため、何をすべきかわかりません。「else clock」では、条件が間違っているときに実行されるステートメントを書くことができます。以下は、「helloScript.sh」ファイルに書き込んで、プログラムでelseブロックがどのように機能するかを確認できるコードです。


``` bash:ifelse-statements.sh
#! /bin/bash

count=11
if [ $count -eq 10 ]; then 
    echo "the condition is true"
 else
    echo "the condition is false"
fi
```

このプログラムでは、「カウント」変数は11の値で割り当てられます。プログラムは「ifステートメント」をチェックします。ifブロックの条件が真ではないため、「その後」セクション全体を無視して「else」ブロックに移動します。端末は、条件がfalseであるというステートメントを表示します。


条件を書くための別の形式もあります。この方法では、「[ ]」を「(( ))」括弧に置き換え、それらの間に条件を書き込むだけです。この形式の例を次に示します。


``` bash:bracketIfelse-statements.sh
#! /bin/bash

count=10
if (( $count > 9 )); then 
    echo "the condition is true"
 else
    echo "the condition is false"
fi
```

### if-else ifステートメント
スクリプトでif-else ifをステートメントのブロックとして使用すると、プログラムは条件を再チェックします。同様に、以下のサンプルコードを「helloScript.sh」に記述すると、プログラムは最初に「if」条件をチェックすることがわかります。「カウント」変数には「10」の値が割り当てられます。最初の「if」条件では、プログラムは「カウント」が9より大きい値を持っていることを確認します。その後、「if」ブロックに書かれたステートメントが実行され、そこから出てきます。たとえば、「elif」で書かれた条件がtrueの場合、プログラムは「elif」ブロックで書かれたステートメントのみを実行し、ステートメントの「if」および「else」ブロックを無視します。


``` bash:ifelseif-statements.sh
#! /bin/bash

count=10
if (( $count > 9 )); then 
    echo "the first condition is true"
 elif (( $count <= 9 ));  then
    echo "then second condition is true"
 else
    echo "the condition is false"
fi
```

## 演算子
### AND演算子
条件で「AND」演算子を使用するには、条件間で記号「&&」を使用して両方を確認する必要があります。たとえば、「helloScript.sh」に次のコードを書くと、プログラムは両方の条件「[ "$age」-gt 18 ]& [「$age」-lt 40 ]'をチェックし、年齢が18より大きく、年齢が40未満の場合、これはfalseであることがわかります。プログラムは「その後」の後に書かれたステートメントを無視し、端末に「年齢は正しくない」と印刷して「else」ブロックに向かって移動します


``` bash:andOperator.sh
#! /bin/bash

age=10
if [ "$age" -gt 18 ] && [ "$age" -lt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```

条件を次の形式で書くこともできます。

``` bash:andOperator2.sh
#! /bin/bash

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
#! /bin/bash

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
#! /bin/bash

age=30
if [ "$age" -gt 18 -o "$age" -lt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```
OR演算子をよりよく理解するために、さまざまな条件を試すこともできます。以下に４つのサンプルを記します。


``` bash:orOperator1.sh
#! /bin/bash

age=30
if [ "$age" -lt 18 -o "$age" -lt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```


``` bash:orOperator2.sh
#! /bin/bash

age=30
if [ "$age" -lt 18 -o "$age" -gt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```


``` bash:orOperator3.sh
#! /bin/bash

age=30
if [[ "$age" -lt 18 || "$age" -gt 40 ]]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```


``` bash:orOperator4.sh
#! /bin/bash

age=30
if [ "$age" -lt 18 ] || [ "$age" -gt 40 ]; then
    echo "age is correct"
else
    echo "age is not correct"
fi
```



## ループ

このトピックでは、

whileループ
until ループ
for ループ
break と continueステートメント


### Whileループ:
一方、ループは条件がtrueの場合にコードブロック(do...doneで囲まれています)を実行し、条件がfalseになるまでそれを実行し続けます。条件がfalseになると、whileループは終了します。コードを書くためにスクリプトに戻ると、その中にループがあります。キーワード「while」を使用し、その後、チェックする条件を書きます。その後、「do」キーワードを使用し、プログラムの条件がtrueの場合に実行するステートメントの束を書きます。また、ループを進むように、ここに増分ステータスを記述する必要があります。キーワード「done」を書いてwhileループを閉じます。スクリプトを「helloScript.sh」として保存します。



``` bash:whileLoop.sh
#! /bin/bash

number=1
while [ $number -lt 10 ]; do
    echo "$number"
    number=$(( number+1 ))
done
```

ターミナルで「$ ./whileLoop.sh」コマンドを使用してスクリプトを実行ます。


Whileループでは、まず、条件が真かどうかをチェックします。条件がfalseの場合、ループから出てプログラムを終了します。ただし、条件が true の場合、実行シーケンスはキーワード 'do' の後に書かれたステートメントに移動します。あなたの場合、「エコー」ステートメントを使用しているため、番号が印刷されます。次に、ループ自体をループさせるincrementステートメントに言及する必要があります。条件変数をインクリメントした後、条件を再度チェックして前進します。条件がfalseになると、ループから出てプログラムを終了します。


``` bash:whileLoop2.sh
#! /bin/bash

number=1
while [ $number -le 10 ]
do
    echo "$number"
    number=$(( number+1 ))
done
```

until ループ:
Loopが条件がfalseのときにコードブロック(do...doneで囲まれている)を実行し、条件がtrueになるまで実行し続けるまで。条件が true になると、 until ループは終了します。Untilループの構文はwhileループの構文とほぼ同じですが、「while」の代わりに「until」という言葉を使用する必要があります。以下に示す例では、「number」という名前の変数に「1」の値が割り当てられています。この例では、ループは条件をチェックし、falseの場合、前進し、端末に「数値」変数の値を出力します。次に、「数値」変数の増分に関連するステートメントがあります。値をインクリメントし、条件を再度チェックします。「数値」変数値が10になるまで、値は何度も出力されます。条件がfalseになると、プログラムは終了します。



``` bash:untilLoop.sh
#! /bin/bash

number=1
until [ $number -ge 10 ]
do
    echo "$number"
    number=$(( number+1 ))
done
```

上記のコードを「untilLoop.sh」ファイルに保存します。コマンドを使って実行する


```
$ ./untilLoop.sh
```


for ループ:
これは、ループが繰り返し実行される条件を指定するループのタイプです。コードにforループを書くには、2つの基本的な方法があります。最初の方法では、反復用の数字を書くことができます。以下に示すコードでは、これらの反復は反復を制御する変数 'i' に指定されるため、for ループは 5 回実行されます。スクリプトファイル「helloScript.sh」にコードを保存します。



``` bash:forLoop.sh
#! /bin/bash

 for i in 1 2 3 4 5 ; do 
    echo $i
 done
```

ターミナルで次のコマンドを入力して、「forLoop.sh」ファイルを実行します。


```
$ bash forLoop.sh
```

この方法はシンプルに見えますが、1000回実行したい場合はどうなりますか?1から1000までの反復回数を書く必要はなく、代わりにループに他の書き方を使用します。このメソッドでは、以下のサンプルコード「for i in {0..10}」のように、反復の開始点と終了点を宣言する必要があります。forループは10回実行されます。 '0'は開始点として定義され、「10」は反復の終了点として定義されます。このforループは、各反復で「i」の値を出力します。


``` bash:forLoop2.sh
#! /bin/bash

 for i in {0..10}
 do
    echo $i
 done
```

ファイル「forLoop.sh」にコードを保存します。ファイルを実行すると、次の出力が表示されます。

```
$ bash forLoop2.sh
$
```

ループを制御する変数の増分値を定義することもできます。たとえば、「for i in {0..10..2}」では、0はループの開始点、10は終点、ループは「i」の2の増分で「エコー$i」ステートメントを実行します。したがって、以下に示す例では、プログラムはループの最初の実行で0を出力し、その後、「i」の値をインクリメントします。これで「i」の値は2です。ターミナルに2を印刷します。このコードは、「i」の値を0,2,4,6,8,10として出力します。



``` bash forLoop3.sh
#! /bin/bash

 for i in {0..10..2}; do
 #{starting..ending..increment}
   echo $i
 done
```


すべてのプログラミング言語で従来の「for loop」を書く別の方法があります。以下のサンプルコードは、このメソッドを使用して「forループ」を表しました。ここでステートメント ‘ for (( i=0; i<5; i++ ))’ では、'i’ はループ全体を制御する変数です。まず、値 '0' で初期化され、次にループ 'i<5' の制御ステートメントがあり、値 0,1,2,3,または 4 がある場合にループが実行されることを示します。次に、ループのインクリメントステートメントである「i++」があります。


``` bash:increments.sh
#! /bin/bash

 for (( i=0; i<5; i++ )); do
    echo $i
 done
```

プログラムはforループに来ます。 'i'は0で初期化され、'i'の値が5未満の条件をチェックします。この場合、trueです。先に進み、端末に「i」の値を「0」として出力します。その値「i」が増加すると、プログラムはその値が5未満であるかどうかを再度確認するので、再び「i」の値('1」を出力します。この実行フローは、「i」が「5」の値に達するまで続き、プログラムはforループから出て、プログラムは終了します。

コードを保存します。ターミナルからファイルを実行すると、次の出力が表示されます。


### breakとcontinue
breakステートメントは、指定された条件でループを終了するために使用されます。たとえば、以下に示すコードでは、for loopは「i」の値が6になるまで通常の実行を行います。コードでこのことを指定したように、forループは自分自身を壊し、「i」が5より大きくなるとさらに反復を停止します。



```
#! /bin/bash

 for (( i=0; i<=10; i++ )); do
    if [ $i -gt 5 ]; then
        break
    fi
    echo $i
 done
```

スクリプトを保存し、ファイルを実行します。次の出力が得られます。


Continueステートメントは、breakステートメントとは対照的に機能します。条件が真であるところはどこでも反復をスキップし、次の反復に向かって移動します。たとえば、ループに示すコードは、3と7を除いて、0から20までの端末に「i」変数の値を出力します。ステートメント 'if [ $i -eq 3 ] || [ $i -eq 7 ]' として、'i' の値が 3 または 7 に等しいときはいつでも反復をスキップし、印刷せずに次の反復に移動するようにプログラムに指示します。

この概念をよりよく理解するために、次のコードを実行します。


``` bash:breakAndContinue.sh
#! /bin/bash

 for (( i=0; i<=10; i++ ))
 do
    if [ $i -eq 3 ] || [  $i -eq 7 ]
    then
    continue
    fi
    echo $i
 done
```


## 入力

このトピックの最初の例は、スクリプトを実行し、スクリプトの入力として値を与えるための単一のコマンドを与えることができるコードを指します。


``` bash:input.sh
#! /bin/bash

 echo $1 $2 $3
```


このコードは、端末に3つの値を出力します。上記のコードをスクリプト「helloScript.sh」に保存し、ターミナルに印刷される3つの値でコマンドを「./helloScript.sh」に書き込みます。この例では、


```
$ bash input.sh BMW MERCEDES TOYOTA
$ BMW MERCEDES TOYOTA
$ 

```


「BMW」は「$1」を表し、「MERCEDES」は「$2」を表し、「TOYOTA」は「$3」を表します。


echoステートメントに「$0」を指定すると、スクリプト名も出力されます。


``` bash:input2.sh
#! /bin/bash

 echo $0 $1 $2 $3
```

```
$ bash input.sh BMW MERCEDES TOYOTA
$ inpush.sh BMW MERCEDES TOYOTA
$ 
```




この目的のために配列を使用することもできます。無限の数の配列を宣言するには、コード 'args=(“$@”)' を使用します。このコード 'args' は配列の名前であり、'@' は無限の数の値を持つ可能性があることを表します。このタイプの配列宣言は、入力のサイズがわからない場合に使用できます。この配列は、入力ごとにブロックを割り当て、最後の1つに達するまでブロックを割り当て続けます。



``` bash:args.sh
#! /bin/bash

 args=("$@") #you can also specify the array size here
 echo ${args[0]} ${args[1]} ${args[2]}

```

スクリプトをファイル「args.sh」に保存します。ターミナルを開き、スクリプト内の宣言された配列の要素を表す値でコマンド「$ bash args.sh」を使用してファイルを実行します。以下で使用されるコマンドによると、BMW'は${args[0]}を表し、「MERCEDES」は${args[1]}を表し、「HONDA」は${args[2]}を表します。


以下に示すコードを使用して、無限の数の値を持つ配列を宣言し、それらの値を端末に印刷できます。これと前の例の違いは、この例では配列要素を表すすべての値を出力し、前の例で使用されるコマンド「エコー${args[0]} ${args[1]} ${args[2]}は配列の最初の3つの値のみを出力することです。



``` bash:args2.sh
#! /bin/bash

 args=("$@") 
 echo $@
```

スクリプトに「エコー$#」と書いて配列サイズを出力することもできます。スクリプトを保存します。ターミナルを使用してファイルを実行します。


``` bash:args3.sh
#! /bin/bash

 args=("$@") 
 echo $@   #prints all the array elements 
 echo $#   #print the array size
```

## stdinを使用してファイルを読み取る
「stdin」を使用してファイルを読み取ることもできます。スクリプトを使用してファイルを読み取るには、まずファイルラインを1行ずつ読み、端末に印刷するコードを書くwhileループを使用します。キーワード 'done' を使用して while ループを閉じた後、ファイルの読み取りに使用するように、'stdin' ファイル' < "${1:-/dev/stdin}" ' のパスを指定します。以下に示すスクリプトは、この概念をよりよく理解するために使用できます。


``` bash:stdin.sh
#! /bin/bash

while read line; do
    echo "$line"    
done < "${1:-/dev/stdin}"
```

スクリプトをファイル「stdin.sh」に保存します。ターミナルを開き、読みたいファイル名で「stdin.sh」を実行するコマンドを記述します。この場合、読みたいファイルは「無題のドキュメント1」という名前でデスクトップに配置されます。両方の「\」は、これが単一のファイル名であることを表すために使用されます。それ以外の場合は、「無題のドキュメント1」を書くだけで複数のファイルと見なされます。


```
$ bash helloScript.sh Untitled\ Document\ 1
$ 
```

## スクリプト出力

このトピックでは、標準出力と標準エラーについて学びます。標準出力はコマンドの結果であるデータの出力ストリームですが、標準エラーはコマンドラインからのエラーメッセージの場所です。

標準出力と標準エラーを単一または複数のファイルにリダイレクトできます。以下に示すスクリプトコードは、両方を単一のファイルにリダイレクトします。ここで「ls -la 1>file1.txt 2>file2.txt」、1は標準出力を表し、2は標準エラーを表します。標準出力は「file1.txt」にリダイレクトされ、標準エラーは「file2.txt」にリダイレクトされます。


``` bash:stdin.sh
#! /bin/bash

ls -la 1>file1.txt 2>file2.txt
```


このコードを「stdin.sh」に保存し、「$ bash stdin.sh」コマンドを使用してターミナルを介して実行します。まず、デスクトップに2つのファイルを作成し、それぞれの出力をリダイレクトします。この後、「ls」コマンドを使用して、ファイルが作成されているかどうかを確認できます。


その後、両方のファイルの内容を確認してください。

ご覧のとおり、標準出力は「file1.txt」にリダイレクトされます。



スクリプトに標準エラーが存在しないため、「file2.txt」は空です。それでは、標準エラーを作成してみましょう。そのためには、コマンドを 'ls -la' から 'ls +al'に変更する必要があります。以下に示すスクリプトを保存し、ターミナルからファイルを実行し、両方のファイルをリロードして結果を表示します。


``` bash:stdin2.sh
#! /bin/bash

ls +al 1>file1.txt 2>file2.txt
```

ターミナルでコマンド「./stdin2.sh」を使用してファイルを実行し、ファイルを確認します。


スクリプトの標準出力が存在しないため、「file1.txt」は空であり、標準エラーは以下に示すように「file2.txt」に保存されます。


この目的のために2つの別々のスクリプトを作成することもできます。この場合、最初のスクリプトは標準出力を「file1.txt」に保存し、2番目のスクリプトは標準エラーを保存します。両方のスクリプトは、それぞれの出力で以下に示されています。


``` bash:stdin3.sh
#! /bin/bash

ls -la >file1.txt
```

標準出力と標準出力を保存するために単一のファイルを使用することもできます。そのスクリプトの例を次に示します。


``` bash:stdin3.sh
#! /bin/bash

ls -la >file1.txt 2>&1
```


## あるスクリプトから別のスクリプトに出力を渡す

あるスクリプトから別のスクリプトに出力を送信するには、2つのことが不可欠です。まず、両方のスクリプトが同じ場所に存在し、両方のファイルを実行可能である必要があります。ステップ1は、2つのスクリプトを作成することです。1つは「firstScript.sh」、もう1つは「secondScript.sh」として保存します。

「firstScript.sh」ファイルを開き、以下に示すコードを書いてください。


``` bash:firstScript.sh
#! /bin/bash

MESSAGE="Hello LinuxHint Audience"
export MESSAGE
```

ターミナルで次のコマンドを入力して、「firstScript.sh」を実行可能にします。

```
$ chmod +x ./firstScript.sh
$
```


このスクリプトは、「$MESSAGE」変数に格納されている値をexportします。

このファイルを保存し、コーディングのために他のファイルに進みます。

新たに「secondScript.sh」に次のコードを書いて、firstScript.shの「$MESSAGE」をsecondScript.shが取得し、ターミナルに出力します。


``` bash:secondScript.sh
#!/bin/bash

echo "helloScriptからのメッセージは: $MESSAGE"
```


ターミナルで次のコマンドを入力して、「secondScript.sh」を実行可能にします。


```
$ chmod +x ./secondScript.sh
```

次に、「firstScript.sh」ファイルを実行して、目的の結果を取得します。



## 文字列処理

このトピックで最初に学ぶ操作は、文字列の比較です。文字列の形でユーザーから2つの入力を取ります。ターミナルからその値を読み、2つの異なる変数に格納します。「==」演算子を使用して両方の変数の値を比較するには、「if」ステートメントを使用します。ステートメントをコード化して、「文字列が一致する」が同じかどうかを表示し、「else」ステートメントに「文字列が一致しない」と書き、'if」ステートメントを閉じます。以下は、この手順全体のスクリプトコードです。


``` bash:String.sh

#! /bin/bash
echo "enter Ist string"
read st1
echo "enter 2nd string"
read st2

if [ "$st1" == "$st2" ]
then
    echo "strings match"
else
    echo "strings don't match"
fi
```

スクリプトを「string.sh」に保存します。ターミナルからファイルを実行し、比較のために2つの文字列を与えます。


異なる入力を使用してコードをテストすることもできます。


また、プログラムが実際に文字列を比較しているかどうか、または文字列の長さをチェックしているかどうかを確認することもできます。


### 文字列の確認(小さいかどうか)
文字列が小さいかどうかを確認することもできます。ユーザーから入力を取得し、端末から値を読みます。その後、最初の文字列かどうかを使用して文字列を比較します。


``` bash:stringSmaller.sh
#! /bin/bash

echo "enter Ist string"
read st1
echo "enter 2nd string"
read st2

if [ "$st1" \ "$st2" ]; then
    echo "Second string $st2 is smaller than $st1"
else
    echo "strings are equal"    
fi
```


## 連結
2つの文字列を連結することもできます。2つの変数を取り、端末から文字列を読み取って、これらの変数に格納します。次のステップは、スクリプトに「c=$st1$st2」と書いて印刷するだけで、別の変数を作成し、両方の変数を連結することです。


``` bash:connect.sh
#! /bin/bash

echo "enter Ist string"
read st1
echo "enter 2nd string"
read st2

c=$st1$st2
echo $c
```

このコードを「connect.sh」に保存し、端末を使用してファイルを実行し、結果を確認します。



### 入力を小文字と大文字に変換する
入力を小文字と大文字に変換することもできます。このためには、端末から値を読み取るスクリプトを作成し、変数名の「^」記号を使用して小文字で印刷し、「^^」を使用して大文字で印刷する必要があります。このスクリプトを保存し、ターミナルを使用してファイルを実行します。


``` bash:connect.sh
#! /bin/bash

echo "enter Ist string"
read st1
echo "enter 2nd string"
read st2

echo ${st1^} #for lowercase
echo ${st2^^} #for uppercase
```

### 最初の文字を大文字に変換
変数を「$[st1^l}」と書くだけで、文字列の最初の文字のみを変換することもできます。


``` bash:turnFirstLetterCapital.sh
#! /bin/bash

echo "enter Ist string"
read st1
echo "enter 2nd string"
read st2

echo ${st1^l} #for capitalizing the first letter
```

## 数字と算術

このトピックでは、スクリプトを使用してさまざまな算術演算を実行する方法を学習します。ここでは、そのためのさまざまな方法も表示されます。最初の方法では、ステップ1は2つの変数を値で定義し、echoステートメントと「+」演算子を使用してこれらの変数の合計を端末に印刷することです。スクリプトを保存し、実行し、結果をチェックアウトします。


``` bash:numberCalc.sh
#! /bin/bash

n1=4
n2=20
echo $((  n1 + n2 ))
```

加算、減算、乗算、除算などの複数の操作を実行するための単一のスクリプトを書くこともできます。


``` bash:numberCalc2.sh
#! /bin/bash

n1=20
n2=4

echo $(( n1 + n2 )) 
echo $(( n1 - n2 )) 
echo $(( n1 * n2 )) 
echo $(( n1 / n2 )) 
echo $(( n1 % n2 ))
```


算術演算を実行する2番目の方法は、「expr」を使用することです。この「expr」は、これらのn1とn2を他の変数とみなし、操作を実行することです。


``` bash:numberCalc3.sh
#! /bin/bash

n1=20
n2=4

echo $(expr $n1 + $n2 )
```

1つのファイルを使用して、「expr」を使用して複数の操作を実行することもできます。以下は、そのサンプルスクリプトです。


``` bash:numberCalc4.sh
#! /bin/bash

n1=20
n2=4

echo $(expr $n1 + $n2 )
echo $(expr $n1 - $n2 )
echo $(expr $n1 \* $n2 )
echo $(expr $n1 / $n2 )
echo $(expr $n1 % $n2 )
```

### 16進数を10進数に変換する
16進数を小数に変換するには、ユーザーから16進数を取るスクリプトを書いて、数字を読みます。この目的のために「bc計算機」を使用します。「obase」を10、「ibase」を16と定義します。この手順をよりよく理解するために、以下のスクリプトコードを使用できます。


``` bash:numberCalc5.sh
#! /bin/bash

echo "Enter Hex number of your choice"
read Hex
echo -n "The decimal value of $Hex is : "
echo "obase=10; ibase=16; $Hex" | bc
```



## [declare] コマンド

このコマンドの背後にある考え方は、bash自体に強力な型システムがないため、bashで変数を制限することはできません。ただし、型のような動作を許可するには、'declare' コマンドであるコマンドで設定できる属性を使用します。'declare' は、シェルの範囲内の変数に適用される属性を更新できる bash 組み込みコマンドです。変数を宣言して覗くことができます。

以下に示すコマンドを書くと、システムにすでに存在する変数のリストが表示されます。

```
$ declare -p
```

独自の変数を宣言することもできます。そのためには、変数の名前で宣言コマンドを使用する必要があります。

$はmyvariableを宣言します
その後、「$ declare -p」コマンドを使用して、リスト内の変数を確認します。


値を持つ変数を定義するには、以下に示すコマンドを使用します。

```
$ declare myvariable=11
$ declare -p
```

それでは、ファイルを制限してみましょう。「-r」を使用して、ファイルに読み取り専用制限を適用し、変数の名前をパスで書き込みます。


``` bash:declare.sh
#! /bin/bash

declare -r pwdfile=/etc/passwd
echo $pwdfile
```

それでは、ファイルにいくつかの変更を加えてみましょう。


``` bash:declare2.sh
#! /bin/bash

declare -r pwdfile=/etc/passwd
echo $pwdfile
pwdfile=/etc/abc.txt
```

「pwdfile」は読み取り専用ファイルとして制限されているためです。スクリプトの実行後にエラーメッセージが表示されるはずです。


## 配列

まず、配列を宣言し、その中に値を格納する方法を学びます。好きなだけ値を保存できます。配列の名前を書き、その値を「( )」括弧で定義します。以下のコードを検索して、その仕組みを確認することができます。


``` bash:array.sh
#! /bin/bash

car=('BMW' 'TOYOTA' 'HONDA')
echo "${car[@]}"
```


また、以下の例では「BMW」が「0」番目のインデックスに格納され、「TOYOTA」が「1」stインデックスに格納され、「HONDA」が「2」番目のインデックスに格納されるなど、配列要素のインデックスを使用して印刷することもできます。「BMW」を印刷する場合は、${car[0]}と書き、その逆も同様です。


``` bash:array2.sh
#! /bin/bash

car=('BMW' 'TOYOTA' 'HONDA')
echo "${car[@]}"
#printing value by using index
echo "printing value using index"
echo "${car[0]}"
echo "${car[1]}"
echo "${car[2]}"
```

配列のインデックスを印刷することもできます。このためには、「${!車[@]}”、ここ’!’インデックスを表すために使用され、「@」は配列全体を表します。

``` bash:array3.sh
#! /bin/bash

car=('BMW' 'TOYOTA' 'HONDA')
echo "${car[@]}"
echo "printing the indexes"
echo "${!car[@]}"
```

配列内の値の合計数を印刷する場合は、ここに「${#car[@]}」と書くだけで、要素の総数を表します。


``` bash:array3.sh
#! /bin/bash

car=('BMW' 'TOYOTA' 'HONDA' 'ROVER')
echo "${car[@]}"
echo "printing  the indexes"
echo "${!car[@]}"
echo "printing number of values"
echo "${#car[@]}"
```


配列を宣言し、任意の要素を削除したいとします。要素を削除するには、配列名と削除する要素のインデックスを含む「unset」コマンドを使用します。「car」配列の2番目のインデックスに格納されている値を削除する場合は、スクリプトに「unset car[2]」と書くだけです。Unsetコマンドは、配列からインデックスを持つ配列要素を削除します。理解を深めるために、次のコードをチェックしてください。

``` bash:array4.sh

#! /bin/bash
car=('BMW' 'TOYOTA' 'HONDA' 'ROVER')
unset car[2]
echo "${car[@]}"
echo "printing  the indexes"
echo "${!car[@]}"
echo "printing number of values"
echo "${#car[@]}"
```

次のコードを「helloScript.sh」に保存します。「./helloScript.sh」を使用してファイルを実行します。

これで配列要素を削除することがわかっていますが、「MERCEDES」などの他の値をインデックス2に格納する場合はどうなりますか。unsetコマンドを使用した後、次の行に「car[2]='MERCEDES」と書きます。それでおしまい。


``` bash:array5.sh
#! /bin/bash

car=('BMW' 'TOYOTA' 'HONDA' 'ROVER')
unset car[2]
car[2]='MERCEDES'
echo "${car[@]}"
echo "printing  the indexes"
echo "${!car[@]}"
echo "printing number of values"
echo "${#car[@]}"
```


## 関数

関数は基本的に再利用可能なコード行であり、何度も呼び出すことができます。特定の操作を何度も実行する場合、または何かを繰り返し実行する場合は、コードで関数を使用するための記号です。関数は、何度も何度もたくさんの行を書くための時間と労力を節約します。

以下は、関数の構文を示す例です。覚えておくべき最も重要なことの1つは、関数を呼び出す前にコーディングのどこかで最初に関数を定義または宣言する必要があることです。コードで関数を定義するには、ステップ1は、指定する関数名で「関数」コマンドを使用し、次に「( )」を使用することです。ステップ2は、「{ }」内に関数コードを書くことです。ステップ3は、実行したい関数名を使用して関数を呼び出すことです。


``` bash:method.sh
#! /bin/bash

function funcName()
{
    echo "this is new function"
}

funcName
```


関数にパラメータを与えることもできます。たとえば、関数呼び出し時に与えられる任意の単語を引数として指定します。このためには、上記の構文を使用して関数を作成するだけで、関数の本文に「エコー$ 1」と書き込むと、この行は関数呼び出し時に割り当てられた最初のパラメータを出力します。本文から出てきて、関数名を使用して関数を呼び出し、端末に表示したい単語を「パラメータ」として呼び出します。


``` bash:method2.sh
#! /bin/bash

function funcPrint()
{
    echo $1
}

funcPrint HI
```

プログラムに応じて複数のパラメータまたは引数を使用し、関数呼び出し時にそれらのパラメータ値に言及することができます。


``` bash:method3.sh
#! /bin/bash

function funcPrint()
{
    echo $1 $2 $3 $4 $5
}

funcPrint Hi This is Bash programming
```

また、機能が完全に機能しているかどうかを確認することもできます。


``` bash:funcCheck.sh
#! /bin/bash

function funcCheck()
{
    returningValue="using function right now"
    echo "$returningValue"
}
```

### 関数の動作確認
コードを「funcCheck.sh」に保存し、ターミナルを介して実行します。


関数内で宣言される変数はローカル変数です。たとえば、以下に示すコードでは、「returningValue」はローカル変数です。ローカル変数という用語では、その値はこの関数の範囲内で「Linuxが大好きです」であり、関数本体の外部でこの変数にアクセスすることはできません。この関数を呼び出すと、変数「returningValue」に「I love Linux」という値が割り当てられます。


``` bash:funcCheck2.sh
#! /bin/bash

function funcCheck()
{
    returningValue="I love Linux"

}
returningValue="I love MAC"
echo $returningValue
funcCheck
echo $returningValue
```

このスクリプトでは、「funcCheck()」という名前のローカル関数があります。この関数には、「I love Linux」という値を持つローカル変数「returningValue」があります。この「returningValue」はローカル変数です。関数を定義すると、「returningValue = "I love MAC」という別のステートメントがあることがわかりますが、今回は関数で定義されている変数ではなく、別の変数です。スクリプトを保存して実行すると、違いがわかります。



## ファイルとディレクトリ

このトピックでは、ファイルとディレクトリを作成する方法、スクリプトを使用してこれらのファイルとディレクトリの存在を確認する方法、ファイルからテキストを1行ずつ読み取る方法、ファイルにテキストを追加する方法、最後にファイルを削除する方法を学習します。

最初のスクリプトの例は、「Directory2」という名前のディレクトリを作成することです。ディレクトリ 'mkdir' コマンドの作成は、同じディレクトリまたはフォルダーをある場所で作成するエラーに対処するフラグ '-p' で使用されます。

この「mkdir.sh」を保存します。ターミナルを開き、ファイルを実行します。次に、「ls -la」を使用してその存在を確認します。


``` bash:mkdir.sh
#! /bin/bash

mkdir -p Directory2
```

現在の場所にディレクトリが存在するかどうかを確認することもできます。以下は、このアイデアを実行するためのサンプルスクリプトです。最初に行う必要があるのは、端末からディレクトリ名を取得することです。ターミナルラインまたはディレクトリ名を読み、任意の変数に格納します。その後、「if」ステートメントとディレクトリが存在するかどうかをチェックする「-d」フラグを使用します。


``` bash:mkdir-p.sh
#! /bin/bash

echo "enter directory name to check"
read direct

if [ -d "$direct" ]; then
    echo "$direct exists"
else
    echo "$direct doesn't exist"
fi
```


この「mkdir-p.sh」ファイルを保存します。ターミナルから実行し、検索するディレクトリ名を入力します。


ファイルの作成に進みます。ファイルの作成には「タッチ」コマンドが使用されます。名前を取得し、端末から読み取る手順全体は、ディレクトリを作成する場合と同じですが、ファイルを作成するには、「mkdir」ではなく「タッチ」コマンドを使用する必要があります。


``` bash:touch.sh
#! /bin/bash

echo "enter file name to create"
read fileName

touch $fileName
```

スクリプトを保存し、実行し、'ls -la'コマンドを使用してターミナルを介してその存在を確認します。


スクリプトに従って、スクリプトを介してディレクトリを検索することもできます。「-f」フラグがファイルを検索し、ディレクトリが「-d」を検索するため、「-d」フラグを「-f」に置き換えるだけです。

``` bash:checkFile.sh
#! /bin/bash

echo "enter file name to check"
read fileName

if [ -f "$fileName" ]; then
    echo "$fileName exists"
else
    echo "$fileName doesn't exist"
fi
```

ファイルにテキストを追加するには、同じプロセスに従う必要があります。ステップ1は、端末からファイル名を取得することです。ステップ2は、プログラムがファイルを見つけて追加するテキストの入力を求めた場合、そのファイルを検索することです。それ以外の場合は、そのファイルが端末に存在しないことを印刷します。プログラムがファイルを見つけた場合、tは次のステップに進みます。ステップ3は、そのテキストを読み、検索されたファイルにテキストを書き込むことです。ご覧のとおり、テキスト追加行を除き、これらの手順はすべてそれまたはファイル検索手順と同じです。ファイルにテキストを追加するには、「appendFile.sh」に次のコマンド「echo '$fileText」>> $fileName'を書くだけです。


``` bash:appendFile.sh
#! /bin/bash

echo "enter file name in which you want to append text"
read fileName

if [ -f "$fileName" ]; then
    echo "enter the text you want to append"
    read fileText
    echo "$fileText" >> $fileName
else
    echo "$fileName doesn't exist"
fi
```

ファイルの内容を実行時に指定したいテキストに置き換えるには、同じスクリプトで「>>」ではなくシンボル「>」を使用するだけです。


``` bash:redirect.sh
#! /bin/bash

echo "enter file name in which you want to append text"
read fileName

if [ -f "$fileName" ]; then
    echo "enter the text you want to append"
    read fileText
    echo "$fileText" > $fileName
else
    echo "$fileName doesn't exist"
fi
```

ファイルを開くと、変更が表示されます。


スクリプトを使用して任意のファイルを読み取ることもできます。上記の方法に従ってファイルを見つけます。その後、while条件を使用して「read -r line」を使用してファイルを読み取る。ファイルを読み取るので、このシンボル「<」を使用します。


``` bash:IFS.sh
#! /bin/bash

echo "enter file name from which you want to read"
read fileName

if [ -f "$fileName" ]; then
    while IFS= read -r line; do
        echo "$line"
    done < $fileName
else
    echo "$fileName doesn't exist"
fi
```

ファイルを削除するには、まずファイルが存在するかどうかを調べることです。ファイル名変数を含む「rm」コマンドを使用してファイルを検索した後、削除します。削除を確認するには、「ls -la」を使用してファイルシステムを表示します。


``` bash: rm.sh
#! /bin/bash

echo "enter file name from which you want to delete"

read fileName

if [ -f "$fileName" ]; then
    rm $fileName
else
    echo "$fileName doesn't exist"
fi



## スクリプトのカール

カールは、URL構文を持つことができるデータファイルを取得または送信するために使用されます。カールに対処するには、最初にしなければならないことは、端末を使用してカールをインストールすることです。


```
sudo brew install curl
```

curlをインストールした後、URLを使用してテストファイルをダウンロードするためのコードを記述します。curlを使用してデータファイルをダウンロードするには、2つのステップが必要です。1つ目は、そのファイルの完全なリンクアドレスを持つことです。次に、そのアドレスをスクリプトの「url」変数に保存し、そのURLでcurlコマンドを使用してダウンロードすることです。ここで「-O」は、ソースからファイル名を継承することを示しました。


``` bash:curl.sh
#! /bin/bash

url="http://www.ovh.net/files/1Mb.dat"
curl ${url} -O
```

ダウンロードしたファイルに新しい名前を与えるには、「-o」フラグを使用し、その後、以下のスクリプトに示すように新しいファイル名を書き込むだけです。


``` bash:curl2.sh
#! /bin/bash

url="http://www.ovh.net/files/1Mb.dat"
curl ${url} -o NewFileDownload
```

数百ギガバイトのサイズのファイルをダウンロードしたい場合はどうなりますか?適切なファイルをダウンロードしているかどうかを知っていれば、より簡単だと思わないで。この場合、確認のためにヘッダーファイルをダウンロードすることができます。ファイルのURLの前に「-I」と書くだけです。ファイルをダウンロードするかどうかを決定できるファイルのヘッダーを取得します。


``` bash:curl4.sh
#! /bin/bash

url="http://www.ovh.net/files/1Mb.dat"
curl -I ${url}
```


## プロフェッショナルメニュー

このトピックでは、2つの基本的なことを学びます。1つ目は選択ループに対処する方法と、もう1つは入力を待つ方法です。

最初の例では、selectループを使用してスクリプトにカーメニューを作成し、使用可能なオプションから任意のオプションを選択すると、「選択した」と入力として指定したオプションを表示して、そのオプションが出力されます。


``` bash:professionalMenu.sh
#! /bin/bash

select car in BMW MERCEDES TESLA ROVER TOYOTA; do
    echo "you have selected $car"
done
```


この場合、選択した車のオプションが表示されますが、オプションを除いて別の番号を付けると何もしません。スイッチケースを使用して、この状況を制御できます。各ケースは単一のメニューオプションに使用され、ユーザーが他の車のオプションを入力した場合、「1から5の間で選択してください」というエラーメッセージが表示されます。


``` bash:ProfessionalManu2.sh
#! /bin/bash
select car in BMW MERCEDES TESLA ROVER TOYOTA
do
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


プロのメニューでは、プログラムはユーザーの入力を待つ必要があります。そのスクリプトを書くこともできます。このスクリプトでは、ユーザーに「続行するには任意のキーを押して」ように依頼し、「read -t 3 -n 1」コマンドを使用して3秒ごとにユーザーに「キーSirを押すのを待っています」というリマインダーを送信します。他の条件では、ユーザーがキーを押したかどうかを確認します。この手順全体は、例の形で以下に示されています。この「helloScript.sh」ファイルを保存し、ターミナルを開き、ファイルを実行します。


``` bash:professionalManu3.sh
#! /bin/bash

echo "press any key to continue"
while [ true ]; do
    read -t 3 -n 1
    if [ $? = 0 ]; then
        echo "you have terminated the script"
        exit;
    else
        echo "waiting for you to press the key Sir"
    fi
done
```


## inotifyを使用してファイルシステムを待つ

このトピックでは、ファイルを待って、inotifyを使用してそのファイルを変更する方法を説明します。inotifyは基本的に「inode notify」です。inotifyは、ファイルシステムの変更に気づき、それらの変更をアプリケーションに報告するためにファイルシステムを拡張するLinuxカーネルサブシステムです。inotifyを操作するには、まずターミナルからinotifyをインストールする必要があります。


```
$ yum install inotify-tools
```

虚数ディレクトリでinotifyを試して、それがどのように反応するかを確認できます。

``` bash:inotify.sh
#! /bin/bash

mkdir -p iNotifyTest
inotifywait -m iNotifyTest
```


では、ターミナルの出力を確認します。ターミナルをもう一つ起動して上記スクリプトを実行しているターミナルと並べて開きます。


モニターとしてのinotify.shの動作を見ながら別のターミナルウィンドウを開き、「$ touch file1.txt」コマンドを使用してそのディレクトリにファイルを作成すると、inotifyが反応し、ファイルシステムで現在起こっているすべてのアクションを監視していることがわかります。


次に「file1.txt」に何かを書き、inotifyで動作するターミナルウィンドウからの応答を確認してください。



## grepの紹介

Grepは ‘global regular expression print’ の略です。このコマンドは、テキストを1行ずつ処理してファイル内のパターンを検索するために使用されます。まず、touchコマンドを使用してfilegrep.txtという名前のファイルを作成します。ターミナルに次のコードを入力します。

```
$ touch filegrep.txt
$ vim filegrep.txt
```

filegrep.txtを開き、ファイルに次のコンテンツを書き込みます。

``` bash:filegrep.txt
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

次に、現在のプログラムの要件に応じていくつかの変更を加えたファイル検索コードを再活用します。ファイル検索の基本的な方法は、「ファイルとディレクトリ」のトピックで上記で説明されています。まず、スクリプトはユーザーからファイル名を取得し、入力を読み取り、変数に保存し、検索するテキストを入力するようにユーザーに依頼します。その後、ファイル内で検索するテキストである端末からの入力を読み取ります。値を「grepvar」という名前の別の変数に格納します。次に、grep変数とファイル名を使用してgrepコマンドを使用する主なことを行う必要があります。Irは文書全体の単語を検索します。


```
#! /bin/bash

echo "enter a filename to search text from"
read fileName
if [[ -f $fileName ]]; then
    echo "enter the text to search"
    read grepvar
    grep $grepvar $fileName
else
    echo "$fileName doesn't exist"
fi
```


入力は「Linux」で、ファイル内のテキストは「Linux」と書かれているため、検索手順の後には何も表示されません。ここでは、grepコマンドに「-i」のフラグを追加するだけで、この大文字と小文字を区別する問題に対処する必要があります。


``` 
grep -i $grepvar $ファイル名
```

出力で行番号を抽出することもできます。このためには、grepコマンドに「-n」の別のフラグを追加するだけです。


```
grep -i -n $grepvar $ファイル名
```

ドキュメント内の特定の単語の発生回数を取得することもできます。grepコマンド「grep -i -c $grepvar $fileName」に「-c」フラグを追加し、スクリプトを保存し、端末を使用して実行します。


```
grep -i -n -c $grepvar $ファイル名
```


ターミナルに「man grep」と入力するだけで、さまざまなgrepコマンドをチェックすることもできます。



## awkの紹介

Awkは、データの操作やレポートの作成に使用されるスクリプト言語です。コンパイルを必要とせず、他のユーザーも変数、数値関数、文字列関数、論理演算子を使用できます。プログラマーがドキュメントの各行で検索されるテキストパターンを定義するステートメントの形で小さくても効果的なプログラムを書くことを可能にするユーティリティであり、一致が行内に見つかったときに実行されるアクションであるため、それを取ることができます。

awkはデータファイルを変換し、フォーマットされたレポートも生成するという考えです。また、算術演算と文字列演算を実行し、条件文とループを使用する機能も提供します。

まず、awkコマンドを使用してファイルを1行ずつスキャンします。この例では、必要なファイルを取得するために不可欠であるため、ファイル検索コードも表示されます。その後、print '{print}'とファイル名変数の操作で「awk」コマンドを使用します。


``` bash:arktest1.sh
#! /bin/bash

echo "enter a filename to print from awk"
read fileName
if [[ -f $fileName ]]; then
    awk '{print}' $fileName
else
    echo "$fileName doesn't exist"
fi
```

「awk」を使用して特定のパターンを検索することもできます。このためには、上記のawkコマンドをこの「awk '/Linux/ {print}' $fileName」に置き換えるだけです。このスクリプトは、ファイル内の「Linux」を検索し、それを含む行を表示します。


``` bash:awktest2.sh
#! /bin/bash

echo "enter filename to print from awk"
read fileName
if [[ -f $fileName ]]; then
    
    awk '/Linux/ {print}' $fileName
else
    echo "$fileName doesn't exist"
fi
```

次に、さらなる実験のために、「filegrep.txt」の内容を以下に示すテキストに置き換えます。

```bash filegrep.txt
This is Linux 2000
This is Windows 3000
This is MAC 4000
This is Linux 2000
This is Windows 3000
This is MAC 4000
This is Linux 2000
This is Windows 3000
This is MAC 4000
This is Linux 2000
This is Windows 3000
This is MAC 4000
```

次の例では、プログラムがターゲットワードを見つけた行からコンテンツを抽出する方法を見ていきます。 「$1」はその行の最初の単語を表し、同様に「$2」は2番目を表し、「$3」は3番目の単語を表し、「$4」はこの場合最後の単語を表します。


``` bash:awktest3.sh

#! /bin/bash

echo "enter a filename to print from awk"
read fileName
if [[ -f $fileName ]]; then
    awk '/Linux/ {print $2}' $fileName
else
    echo "$fileName doesn't exist"
fi
```

上記のスクリプトを保存し、ファイルを実行して、プログラムが「Linux」という言葉を見つけた行の2番目の単語を印刷するかどうかを確認します。
「Linux」を見つけた行の最後の単語「$4」を取得するための「awk」コマンドでスクリプトを実行します。

``` bash:awktest4.sh
#! /bin/bash

echo "enter filename to print from awk"
read fileName
if [[ -f $fileName ]]; then
    awk '/Linux/ {print $4} ' $fileName
else
    echo "$fileName doesn't exist"
fi

```


次に、「awk」/Linux/ {print $3,$4} ' $fileName' コマンドを使用して、「Linux」を含む行の2番目の最後と最後の単語を印刷するかどうかを確認します。


``` bash:awktest5.sh
#! /bin/bash

echo "enter filename to print from awk"
read fileName
if [[ -f $fileName ]]; then    
    awk '/Linux/ {print $3,$4} ' $fileName
else
    echo "$fileName doesn't exist"
fi
```



## sedの紹介

sedコマンドはストリームエディタの略で、標準入力またはファイルからのテキストの編集操作を実行します。 sedは行ごとに非インタラクティブな方法で編集します。これは、コマンドを呼び出すときにすべての編集決定を行い、sedが自動的に方向を実行することを意味します。ここでは、「sed」の非常に基本的な種類の使用を学ぶつもりです。前のタスクに使用したのと同じスクリプトを使用してください。「i」を「I」に置き換えます。そのためには、次の sed コマンド 'cat filegrep.txt | sed 's/i/I/'' と書くだけで、cat コマンドを使用してファイルの内容を取得し、パイプ '|' 記号の後に、'sed' キーワードを使用して、このケースを置き換える操作を指定します。したがって、「s」はスラッシュと置き換えられる文字でここに書かれ、再びスラッシュし、最後に置き換える文字で書かれています。


``` bash:sedtest1.txt
#! /bin/bash

echo "enter filename to substitute using sed"
read fileName
if [[ -f $fileName ]]; then
    cat filegrep.txt | sed 's/i/I/'
else
    echo "$fileName doesn't exist"
fi
```

出力から、「i」の最初のインスタンスのみが「I」に置き換えられたことがわかります。ドキュメント全体の「i」インスタンス置換では、最後の「/」スラッシュの後に「g」(グローバルを表す)のみを記述する必要があります。スクリプトを保存して実行すると、コンテンツ全体にこの変更が表示されます。


``` bash:sedtest2.txt
#! /bin/bash

echo "enter filename to substitute using sed"
read fileName
if [[ -f $fileName ]]
then
    cat filegrep.txt | sed 's/i/I/g'
    
else
    echo "$fileName doesn't exist"
fi
```


これらの変更は実行時にのみ行われます。「helloScript.sh」に次のコマンドを書くだけで、端末に表示されるファイルのコンテンツを格納するための別のファイルを作成することもできます。


```
cat filegrep.txt | sed 's/i/I/g' > newfile.txt
```

単語全体を別の単語に置き換えることもできます。たとえば、以下に示すスクリプトでは、「Linux」のすべてのインスタンスが端末に表示中に「Unix」に置き換えられます。


``` bash:sedtest3.txt
#! /bin/bash

echo "enter filename to substitute using sed"
read fileName
if [[ -f $fileName ]]; then
     sed 's/Linux/Unix/g' $fileName    
else
    echo "$fileName doesn't exist"
fi
```


22。バッシュスクリプトのデバッグ

Bashは広範なデバッグ機能を提供しています。bashスクリプトをデバッグすることができ、計画に従って何かがうまくいかない場合は、それを見ることができます。これが私たちが今行っていることです。端末で発生するエラーの種類を確認するために、意図的にエラーを作成しましょう。次のコードを「helloScript.sh」ファイルに保存します。ターミナルを使用してファイルを実行し、結果をチェックアウトします。

``` bash:debug.sh
#! /bin/bash

echo "enter filename to substitute using sed"
read fileName
if [[ -f $fileName ]]; then
     sed 's/Linux/Unix/g' $fileName    
else
    echo "$fileName doesn't exist"
fi
```
エラーから、それが4行目に存在することがわかります。しかし、何千行ものコードがあり、複数の種類のエラーに直面すると、これは識別するのがとても難しくなります。そのために、スクリプトをデバッグすることができます。最初の方法は、bashを使用したステップバイステップのデバッグです。このためには、ターミナルに次のコマンドを書くだけです。


```
$ bash -x ./helloScript.sh
```

bashパスの後、スクリプトの最初の行に「-x」フラグを入力するだけです。この方法では、スクリプトを使用してスクリプトをデバッグします。


``` bash:debug2.sh
#! /bin/bash -x

echo "enter filename to substitute using sed"
read fileName
if [[ -f $fileName ]]; then
     sed 's/Linux/Unix/g' $fileName
else
    echo "$fileName doesn't exist"
fi
```


デバッグの開始点と終了点を選択できます。デバッグの開始点にコマンド 'set -x' を書き留め、終了するには単に 'set +x' と書き、この 'helloScript.sh' を保存し、ターミナルを介して実行し、結果をチェックします。


``` bash:debug3.sh
#! /bin/bash 

set -x
echo "enter filename to substitute using sed"
read fileName
set +x

if [[ -f $fileName ]]; then
     sed 's/Linux/Unix/g' $fileName
else
    echo "$fileName doesn't exist"
fi

```


