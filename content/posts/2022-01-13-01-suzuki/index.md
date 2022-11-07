---
authors: suzuki
title: "【はじめから】ざっくりわかるシェルスクリプト３"
description: "前２回目の説明に続き、bashプログラミングの基本的な考え方３として最終章を説明します。bashスクリプトの一般的な操作を、ざっくりと説明します。"
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

## はじめに
Bashスクリプトは、シェルコマンドの実行、複数のコマンドの同時実行、管理タスクのカスタマイズ、タスクの自動化の実行など、さまざまな目的に使用できます。したがって、bashプログラミングの基本に関する知識はすべてのLinuxユーザーにとって重要です。この記事は、bashプログラミングの基本的な考え方を理解するのに役立ちます。ここでは、bashスクリプトの一般的な操作のほとんどを、非常に簡単な例で説明します。

この記事では、bashプログラミングの次のトピックについて説明します。


## 関数からの戻り値の受け渡し
<font color=orange><b>関数からの戻り値の受け渡し：</b></font>
Bash関数は、数値と文字列値の両方を渡すことができます。関数から文字列値を渡す方法を次の例に示します。'function_return.sh'という名前のファイルを作成し、次のコードを追加します。関数greeting（）は、文字列値を変数valに返します。この変数は、処理の最後に他の文字列と組み合わせて出力します。

``` bash:function_return.sh
#!/bin/bash

function greeting(){
  str="こんにちは、$name";
  echo "$str";
}

echo "あなたの名前を入力して下さい";
read name;

val=$(greeting);
echo "関数からの戻り値は「${val}」です。";
```

bashコマンドでファイルを実行します。

```
$ bash function_return.sh
あなたの名前を入力して下さい
suzuki
関数からの戻り値は「こんにちは、suzuki」です。
$
```

{{% tips-list tips %}}
戻り値について
: bashシェルスクリプトには「戻り値」というものは基本的に存在しない。

: 解決策として関数やコマンドの「実行結果を直接変数に代入する」という手段をとることになる。
: 「return」コマンドは存在するが、あくまで終了ステータスを返しているだけで、関数の戻り値を返す機能ではないので注意しよう。
{{% /tips-list %}}


## ディレクトリを作成する
<font color=orange><b>ディレクトリを作成する：</b></font>
Bashは「mkdir」コマンドを使用して新しいディレクトリを作成します。'make_directory.sh'という名前のファイルを作成し、次のコードを追加して、ユーザーから新しいディレクトリ名を取得します。ディレクトリ名が現在の場所に存在しない場合は、ディレクトリが作成されます。

``` bash:make_directory.sh
#!/bin/bash

echo "ディレクトリ名を入力して下さい。"
read newdir

`mkdir "$newdir"`
```

bashコマンドでファイルを実行します。

```
$ bash make_directory.sh
ディレクトリ名を入力して下さい。
suzuki
$ ls
suzuki/
```

{{% tips-list tips %}}
ヒント
: よく記述していたのは以下のようなコードでした。
: 事前にディレクトリの存在チェックを行い、見つからなかった場合のみディレクトリを作成します。
{{% /tips-list %}}

``` bash:mkdir_example1.sh
#!/bin/bash

if [ -d "/tmp/of/work" ];then
  : # 何もしない
else
  mkdir -p "/tmp/work";
fi  

cd "/tmp/of/work";
```



## 存在を確認してディレクトリを作成する
<font color=orange><b>存在を確認してディレクトリを作成します。</b></font>
'mkdir'コマンドを実行する前に、現在の場所にディレクトリが存在することを確認する事ができます。mkdir コマンドの' -d 'オプションは、特定のディレクトリが存在するかどうかをテストするためのオプションです。'directory_exist.sh'という名前のファイルを作成し、次のコードを追加してください。ディレクトリの存在を確認してディレクトリを作成します。

``` bash:directory_exist.sh
#!/bin/bash

echo "ディレクトリ名を入力して下さい。";
read ndir;
if [ -d "$ndir" ];then
  echo "ディレクトリが存在します。";
else
  `mkdir $ndir`;
  echo "ディレクトリを作成しました。";
fi
```

bashコマンドでファイルを実行します。

```
$ bash directory_exist.sh
ディレクトリ名を入力して下さい。
suzuki
ディレクトリを作成しました。
$ ls
suzuki/
$ bash directory_exist.sh
ディレクトリ名を入力して下さい。
suzuki
ディレクトリが存在します。
$
```


{{% tips-list tips %}}
ヒント
: 実はディレクトリの存在チェックを行わなくても先のスクリプトは問題なく動作します。
: mkdir -p コマンドは以下のような挙動をします。 

: 作成対象ディレクトリの親ディレクトリが存在しない場合 はすべての親ディレクトリを作成する
: 作成対象ディレクトリがすでに存在している場合 は何も行わず、エラーもはかない
{{% /tips-list %}}

``` bash:mkdir_example2.sh
#!/bin/bash

# 一旦ディレクトリを作成
mkdir -p /tmp/work

ls -l -d /tmp/work/
# 出力
# drwxr-xr-x 2 root root 64 Aug 22 08:26 /tmp/work/

# オプション無しですでに存在しているディレクトリを作成
mkdir /tmp/work
# 出力
# mkdir: /tmp/work: File exists

echo $?
# 1

# -pオプション有りだとエラーを吐かない
mkdir -p /tmp/work

echo $?
# 0
```

```
$ bash mkdir_example2.sh
drwxr-xr-x  2 suzukiiichiro  wheel  64  1 21 13:13 /tmp/work/
mkdir: /tmp/work: File exists
1
0
$
```



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



## ファイルを削除する
<font color=orange><b>ファイルを削除します：</b></font>
'rm'コマンドは、ファイルまたはディレクトリを削除するためのコマンドです。次のコードを使用して「delete_file.sh」という名前のファイルを作成し、ユーザーからファイル名を取得して削除します。ここで、「-i」オプションは、ファイルを削除する前にユーザーに削除確認をに使用されます。

``` bash:delete_file.sh
#!/bin/bash

echo "削除するファイルまたはディレクトリ名を入力して下さい。"
read fn
rm -i $fn
```

bashコマンドでファイルを実行します。

```
$ ls
suzuki/  book.txt
bash delete_file.sh
削除するファイルまたはディレクトリ名を入力して下さい。
suzuki
rm: suzuki: is a directory
bash delete_file.sh
削除するファイルまたはディレクトリ名を入力して下さい。
book.txt
$ ls
suzuki/
$
```


{{% tips-list tips %}}
ヒント
: 基本的に、ファイルもディレクトリも削除するコマンドは同じです。ディレクトリには再帰的に（フォルダの階層も含めて）削除するオプション(-r リカーション)があります。

: rm
: -f :確認をせずに削除
: -r ：再帰的に削除

: フォルダを削除
: rm -rf <target directory> 
{{% /tips-list %}}


{{% tips-list tips %}}
高度なヒント
: シェルスクリプトで自動化処理を作成する場合、cp や rm で、確認をせずに実行したいことが多々あります。
: この場合は、

: /bin/cp 

: または
: /bin/rm 

: を使うと、確認なしで実行することができます。
{{% /tips-list %}}


## ファイルに追加
<font color=orange><b>ファイルに追加：</b></font>
bashで「>>」演算子を使用すると、既存のファイルに新しいデータを追加できます。'append_file.sh 'という名前のファイルを作成し、次のコードを追加して、ファイルの最後に新しいコンテンツを追加します。ここで、「Learning Level 5」は、スクリプトの実行後に「book.txt」ファイルのに追加されます。

```:book.txt
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
```

``` bash_append_file.sh
#!/bin/bash

echo "追加する前のファイル";
cat book.txt;

echo "5. Bash Programming" >> book.txt
echo "追加した後のファイル"
cat book.txt;
```

bashコマンドでファイルを実行します。

```
$ bash append_file.sh
追加する前のファイル
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
追加した後のファイル
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
5. Bash Programming
$
```


{{% tips-list tips %}}
ヒント
: 「>」はファイルを新しく作成して追記します。
: 「>>」は既に存在するファイルに追記します。ですので、ファイルが存在しないにもかかわらず、「>>」を行うと、ついするファイルがないため、エラーとなります。
: ファイルの存在を確認するための方法を次の章で説明します。
{{% /tips-list %}}



## ファイルが存在するかどうかを確認
<font color=orange><b>ファイルが存在するかどうかをテストします。</b></font>
'-e'または'-f'オプションを使用して、ファイルの存在を確認できます。次のコードの 'if [ ]'では、ファイルの存在をテストするために「-f」オプションが使用されています。' file_exist.sh 'という名前のファイルを作成し、次のコードを追加します。ここで、ファイル名はコマンドラインから渡されます。

``` bash:file_exist.sh
#!/bin/bash

filename=$1;
if [ -f "$filename" ];then
  echo "ファイルが存在します。";
else
  echo "ファイルは存在しません。";
fi
```

bashコマンドでファイルを実行します。

```
$ ls
book.txt    level.txt
bash file_exist.sh level2.txt
ファイルは存在しません。
bash file_exist.sh level.txt
ファイルが存在します。
```

{{% tips-list tips %}}
ヒント
: 「>>」（アペンド）を行う場合の注意点は、必ずアペンドするファイルが存在している必要があるところです。
: ファイルが存在していればアペンド（追記）する。
: ファイルが存在しなければファイルを作成して追記する。
: といった処理が必要で、この処理を行わない場合、ファイルが存在しないにもかかわらず、値をファイルに追記しようとした際にエラーとなります。サンプルを以下に示します。
{{% /tips-list %}}


``` bash_append_file2.sh
#!/bin/bash

if [ -f level.txt ]; then
  # ファイルが存在するならば追記する
  echo "Bash Programming" >> level.txt;
else
  # ファイルが存在しないからlevel.txtを作成してから追記
  :> level.txt;
  echo "Bash Programming" >> level.txt;
fi
  
echo "追加した後のファイル"
cat level.txt;
```

{{% tips-list tips %}}
ヒント
: touch コマンドと :> の違いを明確にしておく必要があります。
: 「:>」 は、該当ファイルがなければ作成、あっても空のファイルに置き換えます。
: 「touch」は、該当ファイルがなければ作成しますが、あれば何もしません。 
: この違いを利用するとif文はとても簡潔に書き換えることができます。
: touchコマンドを使って上記ソースを書き換えてみます。
{{% /tips-list %}}


```bash:bash_append_file3.sh
#!/bin/bash

:> level.txt # 新規にファイルを作成
echo "Shell Scripting" >> level.txt;
echo "1回目に追加したファイル"
cat level.txt;

# 既にファイルが存在するので何もしない
# 万が一、ファイルが存在しなければ作成。
touch level.txt; 

echo "Bash Programming" >> level.txt;
  
echo "2回目に追加したファイル"
cat level.txt;
```

```
$ bash bash_append_file3.sh
1回目に追加したファイル
Shell Scripting
2回目に追加したファイル
Shell Scripting
Bash Programming
$
```


## mailコマンド
<font color=orange><b>メールを送る：</b></font>
' mail 'または ' sendmail 'コマンドを使用して電子メールを送信できます。これらのコマンドを使用する前に、mailまたはsendmailに必要なパッケージをインストール・設定をする必要があります。' mail_example.sh 'という名前のファイルを作成し、次のコードを追加して電子メールを送信します。

mailコマンドインストール

まずはここを参考に
[Macでコマンドからメールを送る Gmail](https://qiita.com/TanukiTam/items/abff82573c0f544b3b27)

linuxの場合は
```
$ yum install mailx
```

実際にメールを送ってみます。

```
$ echo "本文" | mail -s "タイトル" -r from@example.com -c cc1@example.com -c cc2@example.com to1@example.com to2@example.com
```

恐ろしいほどに簡単ですね。
おかしな事をかんがえるのはやめましょう。


シェルスクリプトでサンプルを作る
admin@sample.com の部分を自分のメールアドレスに置き換えて実行して下さい。

``` bash:mail_example.sh
#!/bin/bash

Recipient="admin@sample.com"
Subject="Greeting”
Message="Welcome to our site"
`mail -s $Subject $Recipient <<< $Message`
```

bashコマンドでファイルを実行します。

```
$ bash mail_example.sh
$ 
```

{{% tips-list tips %}}
ヒント
: くれぐれもおかしな事をかんがえるのはやめましょう。
{{% /tips-list %}}


## dateコマンド
<font color=orange><b>現在の日付を解析する：</b></font>
dateコマンドを使用して、現在のシステムの日付と時刻の値を取得することができます。日付と時刻は、「Y」、「m」、「d」、「H」、「M」、および「S」を使用します。'date_parse.sh'という名前の新しいファイルを作成し、次のコードを追加して、日、月、年、時、分、秒の値を表示します。

``` bash:date_parse.sh
#!/bin/bash

Year=`date +%Y`;
Month=`date +%m`;
Day=`date +%d`;
Hour=`date +%H`;
Minute=`date +%M`;
Second=`date +%S`;
echo `date`;
echo "Current Date is: $Day-$Month-$Year";
echo "Current Time is: $Hour:$Minute:$Second";
```

bashコマンドでファイルを実行します。

```
$ bash date_parse.sh
2022年 1月13日 木曜日 12時19分06秒 JST
Current Date is: 13-01-2022
Current Time is: 12:19:06
$
```


{{% tips-list tips %}}
ヒント
: dateコマンドは覚えるのではなく、manコマンドで都度、探しましょう。きりがないです。できる事を覚えておけばオッケーです。以下にありきたりなパターンを列挙しておきます。
{{% /tips-list %}}

```
$ date '+%Y/%m/%d'
2005/09/11

$ date '+%Y/%m/%d(%a)'
2005/09/11(Sun)

$ date '+%y/%m/%d'
05/09/11

$ date '+%F'
2005-09-11

$ date '+%D'
09/11/05

$ date '+%R'
01:18

$ date '+%T'
01:18:01

$ date '+%r'
01:18:06 AM

$ date '+%Y/%m/%d%n%r'
2005/09/11
01:18:27 AM
#↑%n を使用することで、出力に改行を含めることができる。

# 1日後
$ date -d '1 day'

# 2日後
$ date -d '2 days

# 1日前
$ date -d '1 day ago'

# 1ヶ月前
$ date -d '1 month ago'

# 1年前
$ date -d '1 year ago'

# 1時間前
$ date -d '1 hour ago'

# 1分前
$ date -d '1 minute ago'

# 1秒前
$ date -d '1 second ago'
```

```:直近5分以内にあるerrorログを表示
$ IFSBK=${IFS} ; IFS=$'\n' ; for record in $(cat /var/log/messages ) ; do if [ $(( $(date +"%s") - 300 )) -lt $(echo ${record} | cut -d" " -f 1,2,3 | date --date="$(cat -)" +"%s") ] ; then echo ${record} ; fi ; done | grep error ; IFS=${IFSBK}
```

## waitコマンド
<font color=orange><b>waitコマンド：</b></font>
waitコマンドは、実行中のプロセスの完了を待機するLinuxの組み込みコマンドです。 waitコマンドは、特定のプロセスIDまたはジョブIDで使用されます。waitコマンドでプロセスIDまたはジョブIDが指定されていない場合、現在のすべての子プロセスが完了するのを待機し、終了ステータスを返します。' wait_example.sh'という名前のファイルを作成し、次のスクリプトを追加します。

``` bash:wait_example.sh
#!/bin/bash

echo "Wait command" &
process_id=$!
wait $process_id
echo "Exited with status $?"
```

bashコマンドでファイルを実行します。

```
$ bash wait_example.sh
Wait command
Exited with status 0
$
```

わかりにくいですね。
もう少しわかりやすく説明します。
waitコマンドは、他のプロセスの終了まで待機することができるコマンドです。
例えば、以下三つのファイルを実行します。
末尾に & がついているのは、それぞれの実行ファイルをバックグラウンドで並列で実行させることを意味しています。

``` bash
#!/bin/bash

bash a.sh &;
bash b.sh &;
bash c.sh &;
``` 

では、三つの実行ファイルが全て完了したらコメントを出力するソースに書き直してみます。

``` bash:間違ったソース
#!/bin/bash

bash a.sh &;
bash b.sh &;
bash c.sh &;

echo "終了しました";
``` 
上記のソースは、実行の終了を待たずに「終了しました」が出力されます。要するに、コメントの出力は全ての実行を待っていない訳です。正しいソースに書き直してみます。

``` bash:正しいソース
#!/bin/bash

bash a.sh &;
bash b.sh &;
bash c.sh &;
wait;
echo "終了しました";
``` 

上記のようにwaitコマンドを挟むことで、a.sh, b.sh, c.sh の実行が終了してから完了メッセージを表示させることが出来ました。

前の処理終了を待ってから、次の処理を実行する方法は以下の通りです。

``` bash:処理の終了を待って次の処理へ
#!/bin/bash

command1 &
command2 &
wait
command3
```

上記の様にすると、command1とcommand2が終了してからcommand3が実行される様にできます。command1と2がバックグラウンドで実行され、waitコマンドで処理終了まで待機し、command3が実行されるといった流れです。


{{% tips-list tips %}}
ヒント
: waitコマンドと似ているsleepコマンドについて、次の章で説明します。またsleepコマンドとwaitコマンドを組み合わせて並列処理を行うサンプルも次の章で示します。
{{% /tips-list %}}

## sleepコマンド
<font color=orange><b>sleepコマンド：</b></font>
コマンドの実行を特定の期間一時停止する場合は、sleepコマンドを使用できます。遅延量は、 秒（s）、分（m）、時間（h）、および日（d）で設定できます。'sleep_example.sh' という名前のファイルを作成し、次のスクリプトを追加します。このスクリプトは、実行後5秒間待機します。

``` bash:sleep_example.sh
#!/bin/bash

echo “Wait for 5 seconds”
sleep 5
echo “Completed”
```

bashコマンドでファイルを実行します。

```
$ bash sleep_example.sh
“Wait for 5 seconds”
“Completed”
$
```

わかりにくいですね。
少し高度だけど、わかりやすいサンプルも書いておきます。

## wait コマンドのサンプル
sleep コマンドをバックグラウンドで実行させ、前の章で使ったwait コマンドで同期をとります。。バックグランドで実行したコマンドのプロセス ID は $! で取得できます。

``` bash:wait_example.sh
#!/bin/bash

for((i=0;i<3;i++));do
  sleep 5 &;
  array[i]=$!;
  echo "Sleeping: ${i} : ${array[i]}";
done

wait ${array[@]};
echo "Finish!!";
```

{{% tips-list tips %}}
ヒント
: 二つのコマンドの違いは以下の通りです。
: sleepは指定した時間だけ処理を遅延
: waitはプロセスやジョブの終了を待つ
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


