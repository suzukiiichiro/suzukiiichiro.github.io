---
title: "ざっくりわかる「シェルスクリプト３」"
description: "ここではbashプログラミングの基本的な考え方２として、bashスクリプトの一般的な操作を、ざっくりと説明します。"
date: 2022-01-13T11:26:13+09:00
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


## 関数からの戻り値の受け渡し
<font color=orange><b>関数からの戻り値の受け渡し：</b></font>
Bash関数は、数値と文字列値の両方を渡すことができます。関数から文字列値を渡す方法を次の例に示します。'function_return.sh'という名前のファイルを作成し、次のコードを追加します。関数greeting（）は、文字列値を変数valに返します。この変数は、後で他の文字列と組み合わせて出力します。

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


## 存在を確認してディレクトリを作成する
<font color=orange><b>存在を確認してディレクトリを作成します。</b></font>
'mkdir'コマンドを実行する前に、現在の場所にディレクトリが存在することを確認する場合は、次のコードを使用できます。'-d 'オプションは、特定のディレクトリが存在するかどうかをテストするために使用されます。'directory_exist.sh'という名前のファイルを作成し、次のコードを追加して、存在を確認してディレクトリを作成します。

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


## ファイルを読む
<font color=orange><b>ファイルを読む：</b></font>
whileループでreadコマンドを使用すると、bashで任意のファイルを1行ずつ読み取ることができます。'read_file.sh'という名前のファイルを作成し、次のコードを追加して、 'book.txt'という名前の既存のファイルを読み取ります。

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


## ファイルを削除する
<font color=orange><b>ファイルを削除します：</b></font>
'rm'コマンドは、ファイルを削除するためにbashで使用されます。次のコードを使用して「delete_file.sh」という名前のファイルを作成し、ユーザーからファイル名を取得して削除します。ここで、「-i」オプションは、ファイルを削除する前にユーザーから許可を取得するために使用されます。

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


## ファイルに追加
<font color=orange><b>ファイルに追加：</b></font>
bashで「>>」演算子を使用すると、既存のファイルに新しいデータを追加できます。'append_file.sh 'という名前のファイルを作成し、次のコードを追加して、ファイルの最後に新しいコンテンツを追加します。ここで、「Learning Level 5」は、スクリプトの実行後に「level.txt」ファイルのに追加されます。

```:level.txt
1. Pro AngularJS
2. Learning JQuery
3. PHP Programming
4. Code Igniter
```

``` bash_append_file.sh
#!/bin/bash

echo "追加する前のファイル";
cat book.txt;

echo "5. Bash Programming" >> level.txt
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
<font color=red>「>」はファイルを新しく作成して追記します。
「>>」は既に存在するファイルに追記します。ですので、ファイルが存在しないにもかかわらず、「>>」を行うと、ついするファイルがないため、エラーとなります。ファイルの存在を確認するための方法を次の章で説明します。</font>


## ファイルが存在するかどうかを確認
<font color=orange><b>ファイルが存在するかどうかをテストします。</b></bont>
'-e'または'-f'オプションを使用して、bash内のファイルの存在を確認できます。次のスクリプトでは、ファイルの存在をテストするために「-f」オプションが使用されています。' file_exist.sh 'という名前のファイルを作成し、次のコードを追加します。ここで、ファイル名はコマンドラインから渡されます。

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


## mailコマンド
<font color=orange><b>メールを送る：</b></font>
' mail 'または ' sendmail 'コマンドを使用して電子メールを送信できます。これらのコマンドを使用する前に、必要なすべてのパッケージをインストールする必要があります。' mail_example.sh 'という名前のファイルを作成し、次のコードを追加して電子メールを送信します。
admin@sample.com の部分を自分のメールアドレスに置き換えて実行して下さい。

``` bash:mail_example.sh
#!/bin/bash

Recipient=”admin@sample.com”
Subject=”Greeting”
Message=”Welcome to our site”
`mail -s $Subject $Recipient <<< $Message`
```

bashコマンドでファイルを実行します。

```
$ bash mail_example.sh
```


## dateコマンド
<font color=orange><b>現在の日付を解析する：</b></font>
あなたは`使用して、現在のシステムの日付と時刻の値を取得することができ、日付`コマンドを。日付と時刻の値のすべての部分は、「Y」、「m」、「d」、「H」、「M」、および「S」を使用して解析できます。'date_parse.sh'という名前の新しいファイルを作成し、次のコードを追加して、日、月、年、時、分、秒の値を区切ります。

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


## waitコマンド
<font color=orange><b>waitコマンド：</b></font>
wait  は、実行中のプロセスの完了を待機するLinuxの組み込みコマンドです。 wait コマンドは、特定のプロセスIDまたはジョブIDで使用されます。waitコマンドでプロセスIDまたはジョブIDが指定されていない場合、現在のすべての子プロセスが完了するのを待機し、終了ステータスを返します。' wait_example.sh'という名前のファイルを作成し、次のスクリプトを追加します。

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



