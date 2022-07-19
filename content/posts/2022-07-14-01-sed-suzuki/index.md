---
title: "（１８）【sed】シェルスクリプトコマンド活用紹介"
description: "文字列を編集する"
date: 2022-07-14T15:00:57+09:00
draft: false

authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---


## sedコマンド概要
　「sed」は「Stream EDitor」の略で、「sed スクリプトコマンド ファイル名」で、指定したファイルをコマンドに従って処理し、標準出力へ出力します。ファイル名を省略した場合は、標準入力からのデータを処理します。sedコマンドでは、パイプとリダイレクトを活用するのが一般的です。


## sedコマンドの書式
sed [オプション]
sed [オプション] スクリプトコマンド 入力ファイル


## sedコマンドの主なオプション

|オプション    |意味|
|--------------|----|
|-e スクリプト|スクリプト（コマンド）を追加する|
|-f スクリプトファイル|実行するコマンドとしてスクリプトファイルの内容を追加する|

|-t 文字数	   |タブの文字数またはタブ位置のリストを指定する|


## sedのバージョンを確認する

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

## sedコマンド詳細説明

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


### 'g'オプションを使用して、ファイルの特定の行にあるテキストのすべてを置き換えます
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


### 各行で一致する2番目の値のみを置き換えます
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


### 各行で一致する最後の値のみを置き換えます
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


### ファイル内の最初の一致を新しいテキストに置き換えます
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


### ファイル内の最後の一致を新しいテキストに置き換えます
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


### ファイルのフルパスをファイル名だけに置き換えます
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

```dept.txt
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

### 文字列に他のテキストが見つからない場合のみテキストを置き換えます
次の`sed`コマンドは、テキスト「CSE」を含まない行の「Count」値を置き換えます。dept.txtファイルには、テキスト「CSE」を含まない2行が含まれています。したがって、「カウント」テキストは2行で80に置き換えられます。

```dept.txt
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


### ' \ 1 'を使用して、一致するパターンの前に文字列を追加します
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

### 一致する行を削除する
'd'オプションは、ファイルから任意の行を削除するために`sed`コマンドで使用されます。os.txtという名前のファイルを作成し、次のコンテンツを追加して、 「d」オプションの機能をテストします。

```os.txt
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


### 一致する行と一致する行の後の2行を削除します
次のコマンドは、パターン「Linux」が見つかった場合、ファイルos.txtから3行を削除します。os.txtには、2行目に「Linux 」というテキストが含まれています。したがって、この行と次の2行は削除されます。

```os.txt
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


### テキスト行の最後にあるすべてのスペースを削除します
[:blank:]クラス（といいます）を使用すると、テキストまたは任意のファイルのコンテンツからスペースとタブを削除できます。次のコマンドは、ファイルos.txt  の各行の終わりにあるスペースを削除します。

```os_blank.txt
Windows

Linux

Android

OS
```

実行結果は以下のとおりです。
```
$ cat os_blank.txt | sed '/^[[:blank:]]*$/d'
Windows
Linux
Android
OS
```

### その行で2回一致するすべての行を削除します
次の内容のinput.txtという名前のテキストファイルを作成し、検索パターンを含むファイルの行を2回削除します。

```input.txt
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


### 空白のみの行をすべて削除します
この例をテストするには、コンテンツに空の行が含まれているファイルを選択します。前の例で作成されたinput.txtファイルには、次の`sed`コマンドを使用して削除できる2つの空の行が含まれています。ここで、「^$」は、ファイルinput.txtの空の行を見つけるために使用されます。

```os_blank.txt
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


### 印刷できない文字をすべて削除する
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
: 上記のコマンドを実行すると、次の出力が表示されます。最初の`echoコマンドはTAB付きで出力し、`sed`コマンドの[^[:print:]]出力できない文字であるタブスペースを削除し出力します。
{{% /tips-list %}}


### 行に一致するものがある場合、行末に何かを追加します
次のコマンドは、 os.txtファイルのテキスト「Windows」を含む行の最後に「10」を追加します。

```os.txt
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


### 行に一致がある場合、行前に行を挿入
次の`sed`コマンドは、前に作成されたinput.txtファイルの「PHP is platform-independent」というテキストを検索します。ファイルのいずれかの行にこのテキストが含まれている場合、「PHP is an interpreted language」がその行の前に挿入されます。

```input.txt
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

### 行に一致がある場合、一致後の行に文字列を挿入
次の`sed`コマンドは、ファイルos.txt内のテキスト' Linux'を検索し、テキストがいずれかの行に存在する場合は、新しいテキスト' Ubuntu 'がその行の後に挿入されます。

```os.txt
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


### 一致するものがない場合は、行末に何かを追加します
### 一致するものがない場合は、行を削除します
### テキストの後にスペースを追加した後、一致したテキストを複製します
### 文字列のリストの1つを新しい文字列に置き換えます
### 一致した文字列を改行を含む文字列に置き換えます
### ファイルから改行を削除し、各行の最後にコンマを挿入します
### カンマを削除し、改行を追加して、テキストを複数の行に分割します
### 大文字と小文字を区別しない一致を検索し、行を削除します
### 大文字と小文字を区別しない一致を見つけて、新しいテキストに置き換えます
### 大文字と小文字を区別しない一致を見つけて、同じテキストのすべて大文字に置き換えます
### 大文字と小文字を区別しない一致を見つけて、同じテキストのすべての小文字に置き換えます
### テキスト内のすべての大文字を小文字に置き換えます
### 行の番号を検索し、番号の後に通貨記号を追加します
### 3桁を超える数値にコンマを追加する
### タブ文字を4つのスペース文字に置き換えます
### 4つの連続するスペース文字をタブ文字に置き換えます
### すべての行を最初の80文字に切り捨てます
### 文字列の正規表現を検索し、その後に標準テキストを追加します
### 文字列の正規表現と、その後に見つかった文字列の2番目のコピーを検索します
### ファイルからの複数行の`sed`スクリプトの実行
### 複数行のパターンに一致し、新しい複数行のテキストに置き換えます
### パターンに一致する2つの単語の順序を置き換えます
### コマンドラインから複数のsedコマンドを使用する
### sedを他のコマンドと組み合わせる
### ファイルに空の行を挿入します
### ファイルの各行からすべての英数字を削除します。
### 文字列と一致させるには「＆」を使用します
### 単語のペアを切り替える
### 各単語の最初の文字を大文字にします
### ファイルの行番号を印刷する



{{% tips-list tips %}}
ヒント
: タブ幅を変更する場合には、$ sed -t 10 と、覚えておけば良いと思います。
{{% /tips-list %}}







## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/prosedct/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/prosedct/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/prosedct/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/prosedct/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens-22&linkId=f514a6378c1c10e59ab16275745c2439"

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










