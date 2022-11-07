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
  - コマンド活用
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

## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/prosedct/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/prosedct/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/prosedct/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/prosedct/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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










