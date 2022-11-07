---
authors: suzuki
title: "【grep特集】ざっくりわかるシェルスクリプト４"
description: "bashプログラミングで最も強力な「grep」コマンドの基本的な考え方、bashスクリプトでの一般的な操作例を、ざっくりと説明します。"
date: 2022-01-24T10:53:58+09:00
image: grep.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - プログラミング
  - シェルスクリプト
  - Bash
  - grep
  - 鈴木維一郎
draft: false
---

## はじめに
grep（グレップ）コマンド。UNIX/Linuxにおいてこれほど歴史あり、強力なコマンドはありません。そして多くのユーザーがこのコマンドを使いこなしています。Webサーバーのログから特定のユーザーのみを抽出するちいさなスクリプトから、膨大なシステムログからロケットの軌道修正を計算する処理プログラムなど、半世紀もの長い間、一糸乱れることなく動き続けています。

「grep」コマンドは、文字列、またはファイル内のをテキストを検索するための便利で不可欠なコマンドです。
「grep」コマンドの正式な名称は「“global regular expression print.”」です。
このコマンドの名前は、正規表現に基づいてコンテンツを検索できる「g / re / p」に由来しています。
「grep」コマンドには、ファイル内の文字列またはテキストを検索するため、複数の方法が用意されている。

以下に「grep」コマンドを使用するいくつかの構文を示します。

## カラー表示

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

##  構文
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



## 一致する文字列を検索

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


## 一致しない文字列のみを検索

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



## 大文字と小文字を区別しない一致の検索文字列
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



## 単語全体のみを検索

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



## 現在のディレクトリで複数のファイルを検索する

「grep」コマンドは、ファイル内の特定のコンテンツを検索し、検索文字列またはパターンに基づいて現在のディレクトリ内の複数のファイルを検索するために使用されます。
\* ワイルドカードを使用して現在のディレクトリ内の複数のファイルを検索する方法は、Customers.txtファイルのこの例に示されています。

次の「grep」コマンドは、「split」という単語を含む現在のディレクトリのファイルを再帰的に検索します。
'split'という単語を含む現在のディレクトリとサブディレクトリのファイルは、次の行で出力されます。

```
$ grep -w split *
$ 
```


## ディレクトリを再帰的に検索する
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


## 行番号を出力に追加します
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


## 一致する行の後に特定の行数を印刷します
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


## 一致する行の前に特定の行数を印刷します
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



## 一致する行の前後の特定の行数を印刷します
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



## ブラケットを使用して特定の数字を一致させる[]
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


## 3番目のブラケットを使用してパターンを特定の文字と一致させる[]
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



## [：alnum：]クラスを使用してアルファベットと数字を一致させる
[:alnum:]クラスは、アルファベットと数字を照合するために正規表現パターンで使用されます。
パターン[A-z0-9]に相当します。


## [：alpha：]クラスを使用してアルファベット文字を照合する
[:alpha:]クラスは、アルファベット文字のみに一致する正規表現パターンで使用されます。
パターン[A-z]に相当します。

## [：digit：]クラスを使用して数字を照合する
[:digit:]クラスは、正規表現パターンで数字のみに一致するために使用されます。
パターン[0-9]と同等です。

## [：lower：]クラスを使用して小文字を照合する
[:lower:]クラスは、すべての小文字のみに一致するように正規表現パターンで使用されます。
パターン[a-z]と同等です。

## [：space：]クラスを使用してスペース文字を一致させる
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


## 行頭からの検索
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


## 行の終わりに一致する
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



## 連結との一致
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


