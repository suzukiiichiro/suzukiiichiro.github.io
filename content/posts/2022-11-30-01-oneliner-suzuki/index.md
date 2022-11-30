---
title: "【ちょいと便利な】シェルスクリプトワンライナー特集【一行完結】"
date: 2022-11-30T11:23:02+09:00
draft: false
authors: suzuki
image: shellscript.jpg
categories:
  - programming
tags:
  - ワンライナー
  - Bash
  - シェルスクリプト
  - ターミナル
  - TIPS
  - マニアックコマンド
  - コマンド活用
  - 鈴木維一郎
---

## ワンライナー
ワンライナー（英：one liner）とは
華麗な職人技によって処理を1行に全部詰め込んだ「1行ですべてが完結しているプログラムソース」のこと。

## find
### 現在のディレクトリ内のすべてのサブディレクトリ/ファイルを一覧表示する
``` bash
find .
```

### 現在のディレクトリの下にあるすべてのファイルを一覧表示する
``` bash
find . -type f
```

### 現在のディレクトリの下にあるすべてのディレクトリを一覧表示する
``` bash
find . -type d
``` 

### 現在のディレクトリの下にあるすべてのファイルを編集します (たとえば、'www' を 'ww' に置き換えます)。
``` bash
find . -name '*.php' -exec sed -i 's/www/w/g' {} \;
```

### ファイル名のみを検索して出力 (例: "mso")
``` bash
find mso*/ -name M* -printf "%f\n"
```

### システム内の大きなファイルを見つける (例: >4G)
``` bash
find / -type f -size +4G
```

### サイズが 74 バイト未満のファイルを見つけて削除する
``` bash
find . -name "*.mso" -size -74c -delete
```

### 空の (0 バイト) ファイルを見つける
``` bash
find . -type f -empty
```
### ディレクトリ内のすべてのファイルを再帰的にカウントする
``` bash
find . -type f | wc -l
```

## sort
### 列ごとにファイルを並べ替え、元の順序を維持する
``` bash
sort -k3,3 -s
```

## fold 
### 指定された幅に収まるように各入力行を折り返す (例: 1 行あたり 4 つの整数)
``` bash
echo "00110010101110001101" | fold -w4
# 0011
# 0010
# 1011
# 1000
# 1101
```

## expand
### タブをスペースに変換
``` bash
expand filename
```
### スペースをタブに変換
``` bash
unexpand filename
```

## wget
### ページから全てをダウンロード
``` bash
wget -r -l1 -H -t1 -nd -N -np -A mp3 -e robots=off http://example.com
```

### ファイル名を指定してダウンロード(長い名前の場合)
``` bash
wget -O filename "http://example.com"
```

### wget ファイルをフォルダーに
``` bash
wget -P /path/to/directory "http://example.com"
```

## tr
### 末尾の改行をエコーしない
``` bash
username=`echo -n "bashoneliner"`
```

### ファイルを複数のファイルにコピー (例: fileA をファイル (BD) にコピー)
``` bash
tee <fileA fileB fileC fileD >/dev/null
```

### すべての非印刷文字を削除する
``` bash
tr -dc '[:print:]' < filename
```

### 改行を削除
``` bash
tr --delete '\n' <input.txt >output.txt
```
または

``` bash
tr -d '\n' <input.txt >output.txt
```

### 改行を置換
``` bash
tr '\n' ' ' <filename
```

### 大文字/小文字へ
``` bash
tr /a-z/ /A-Z/
```

## join
### 2 つのファイルをフィールドごとにタブで結合します (デフォルトでは両方のファイルの最初の列で結合し、デフォルトのセパレータはスペースです)
``` bash
join -t '\t' fileA fileB
```

### 指定したフィールドを使用して結合します（例：fileAの３列目とfileBの５列目を結合）
``` bash
join -1 3 -2 5 fileA fileB
```

## paste
### 2 つ以上のファイルを列に結合/貼り付けます (例: fileA、fileB、fileC)
``` bash
paste fileA fileB fileC
```

## rev 
### 逆文字列
``` bash
echo 12345| rev
```

### ファイルの最後の列を切り取って取得する
``` bash
cat file|rev | cut -d/ -f1 | rev
```

### 最後の列を切り取る
``` bash
cat filename|rev|cut -f1|rev
```

## rename
### すべてのファイルの名前を変更します (たとえば、すべての .gz ファイルから ABC を削除します)。
``` bash
rename 's/ABC//' *.gz
```

### すべてのファイルにファイル拡張子を追加します (例: .txt を追加)
``` bash
rename s/$/.txt/ *
```

## od
### ファイルを 8 進数で表示します ( od を使用して 16 進数、10 進数などを表示することもできます)
``` bash
od filename
```

### 10 進数から 2 進数 (例: 2 進数の 5 を取得)
``` bash
D2B=({0..1}{0..1}{0..1}{0..1}{0..1}{0..1}{0..1}{0..1})
echo -e ${D2B[5]}
#00000101
echo -e ${D2B[255]}
#11111111
```


## grep
### 空行をカウントする

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

### 単語とマッチしない行を表示 (例: 'bbo')

``` bash
cat filename.txt | grep -v bbo
```

{{% tips-list tips %}}
ヒント
: `-v`は、「ではない（マッチしない）」という意味になります。
{{% /tips-list %}}


### 一致する行番号を返す 検索文字列は(例: 'bbo')

``` bash
cat filename.txt | grep -c bbo
```

### 特定の文字列で始まらない行を表示 (例: #)

``` bash
cat filename.txt | grep -v '^#'
```

{{% tips-list tips %}}
ヒント
: `^`は行頭という意味です。
{{% /tips-list %}}


### 大文字と小文字を区別しない grep (例: 'bbo'/'BBO'/'Bbo')

``` bash
cat filename.txt | grep -i "bbo"
```


### マッチに色を付けます (例: 'bbo')!

``` bash
cat filename.txt | grep --color bbo
```


## sed
### 特定の行を出力 (例: 123 行目)
``` bash
sed -n -e '123p'
```

### 行数を出力します (例: 10 行目から 33 行目)

``` bash
cat filename | sed -n '10,33p'
```


### n 行ごとに出力する

``` bash
cat filename | sed -n '0~3p' 
```

### 奇数行ごとに出力

``` bash
cat filename | sed -n '1~2p'
```

### 最初の行を含めて 3 行ごとに出力する

``` bash
cat filename | sed -n '1p;0~3p'
```


### 置換 (例: A を B に置き換える)

``` bash
cat filename | sed 's/A/B/g' 
```

### ファイルを編集 (編集してファイルに保存) (例: 'bbo' で行を削除してファイルに保存)

``` bash
sed -i "/bbo/d" filename
```

### 文字列を含む行を削除 (例: 'bbo')

``` bash
cat filename | sed '/bbo/d'
```

### 1行目を削除

``` bash
cat filename | sed 1d 
```

### 最初の１００行（１行目から１００行目まで）を削除

``` bash
cat filename | sed 1,100d 
```


### 文字列を含む行を削除 (例: 'bbo')

``` bash
cat filename | sed "/bbo/d"
```


### 空行の削除

``` bash
cat filename | sed '/^\s*$/d'
``` 

または

``` bash
cat filename | sed '/^$/d'
```

### 最後の行を削除

``` bash
cat filename | sed '$d'
```

### ファイルの末尾から最後の文字を削除

``` bash
cat filename | sed -i '$ s/.$//'
```

### 先頭の空白とタブを削除

``` bash
cat filename | sed -e 's/^[ \t]*//'
```

### 先頭の空白のみを削除

``` bash
cat filename | sed 's/ *//'
```

### 末尾のカンマを削除
``` bash
cat filename | sed 's/,$//g'
```

### ２行に間の改行を削除

``` :newline.txt
currentLine
nextLine
```

```
$ cat newline.xt | sed ':a;N;$!ba;s/\n//g'
$ currentLinenextLine
$ 
```

### ファイルの先頭に文字列を追加 (例: "[")

``` bash
cat filename | sed -i '1s/^/[/'
```

### 特定の行番号に文字列を追加します (例: 1 行目と 3 行目に 'something' を追加)

``` bash
cat filename | sed -e '1isomething' -e '3isomething'
```

### ファイルの末尾に文字列を追加 (例: "]")

``` bash
cat filename | sed '$s/$/]/'
```

### 最後に改行を追加

``` bash
cat filaname | sed '$a\'
```

### すべての行の先頭に文字列を追加します (例: 'bbo')

``` bash
cat filename | sed -e 's/^/bbo/'
```

### 各行の末尾に文字列を追加します (例: "}")

``` bash
cat filename | sed -e 's/$/\}\]/'
```

### n 番目の文字ごとに \n を追加します (たとえば、4 番目の文字ごと)

``` bash
cat filename | sed 's/.\{4\}/&\n/g'
```


### 最後に列を追加
``` bash
for i in $(ls);do sed -i "s/$/\t$i/" $i;done
```


## awk
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

### 行番号と各行の文字数を出力する
``` bash
awk '{print NR,length($0);}' filename
```

### 列数を出力
``` bash
awk '{print NF}'
```

### 列の順序を逆にする
``` bash
awk '{print $2, $1}'
```

### 列にコンマがあるかどうかを確認します (例: 列 $1)
``` bash
awk '$1~/,/ {print}' 
```

### 列の先頭に文字列を追加します (たとえば、列 $3 に「chr」を追加します)。
``` bash
awk 'BEGIN{OFS="\t"}$3="chr"$3'
```

### 文字列を含む行を削除 (例: 'bbo')
``` bash
awk '!/bbo/' file
```

### 最後の列を削除
``` bash
awk 'NF{NF-=1};1' file
```

### ファイルのすべての番号を四捨五入 (例: 有効数字 2 桁)
``` bash
awk '{while (match($0, /[0-9]+\[0-9]+/)){
    \printf "%s%.2f", substr($0,0,RSTART-1),substr($0,RSTART,RLENGTH)
    \$0=substr($0, RSTART+RLENGTH)
    \}
    \print
    \}'
```

### すべての行に番号/インデックスを付ける
``` bash
awk '{printf("%s\t%s\n",NR,$0)}'
```

### ファイルの平均 (ファイルの各行には 1 つの数値のみが含まれます)
``` bash
awk '{s+=$1}END{print s/NR}'
```

### フィールドの先頭を文字列で表示 (Linux など)
``` bash
awk '$1 ~ /^Linux/'
```

### 行を並べ替える (例: 1 40 35 12 23 –> 1 12 23 35 40)
``` bash
awk ' {split( $0, a, "\t" ); asort( a ); for( i = 1; i <= length(a); i++ ) printf( "%s\t", a[i] ); printf( "\n" ); }'
```

### 前の行の値を減算します (column4 から最後の column5 を引いた値に等しい column6 を追加します)
``` bash
awk '{$6 = $4 - prev5; prev5 = $5; print;}'
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


<!--

{{% tips-list tips %}}
ヒント
{{% /tips-list %}}

{{% tips-list alert %}}
注意
{{% /tips-list %}}
-->


## 書籍の紹介
{{% amazon

title="UNIXという考え方—その設計思想と哲学 単行本  2001/2/23"
url="https://www.amazon.co.jp/UNIX%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9%25E2%2580%2595%25E3%2581%259D%25E3%2581%25AE%25E8%25A8%25AD%25E8%25A8%2588%25E6%2580%259D%25E6%2583%25B3%25E3%2581%25A8%25E5%2593%25B2%25E5%25AD%25A6-Mike-Gancarz/dp/4274064069/ref=sr_1_1?keywords=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E8%2580%2583%25E3%2581%2588%25E6%2596%25B9&amp;qid=1667786898&amp;qu=eyJxc2MiOiIxLjEwIiwicXNhIjoiMC4zOSIsInFzcCI6IjAuMzEifQ%253D%253D&amp;sprefix=unix%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%252Caps%252C257&amp;sr=8-1&_encoding=UTF8&tag=nlpqueens09-22&linkCode=ur2&linkId=0249eb4cab50d700fb6949eb9aeafef1&camp=247&creative=1211"
imageUrl="https://m.media-amazon.com/images/I/518ME653H3L._SX330_BO1,204,203,200_.jpg"
summary=`   UNIX系のOSは世界で広く使われている。UNIX、Linux、FreeBSD、Solarisなど、商用、非商用を問わず最も普及したOSのひとつであろう。そしてこのOSは30年にわたって使用され続けているものでもある。なぜこれほど長い間使われてきたのか？ その秘密はUNIXに込められた数々の哲学や思想が握っている。
   そもそもUNIXはMulticsという巨大なOSの開発から生まれたものだ。あまりに巨大なMulticsはその複雑さゆえに開発は遅々として進まず、その反省からケン・トンプソンが作ったのがUNIXの初めとされる。その後デニス・リッチーら多数の開発者が携わり、UNIXは発展した。本書はこのUNIXに込められた「思想と哲学」を抽出し、数々のエピソードとともにUNIXの特徴を浮き彫りにしていく。

   たとえば本書で述べられているUNIXの発想のひとつとして「過度の対話式インタフェースを避ける」というものがある。UNIXのシステムは初心者には「不親切」なつくり、つまり親切な対話式のインタフェースはほとんどなく、ユーザーがコマンドを実行しようとするときはオプションをつける形をとっている。この形式はオプションをいちいち覚えねばならず、初心者に決してやさしくない。しかしこれはプログラムを小さく単純なものにし、他のプログラムとの結合性を高くする。そして結果としてUNIXのスケーラビリティと移植性の高さを支えることになっているのだ。このような形式で本書では9つの定理と10の小定理を掲げ、UNIXが何を重視し、何を犠牲にしてきたのかを明快に解説している。

   最終章にはMS-DOSなどほかのOSの思想も紹介されている。UNIXの思想が他のOSとどう違うかをはっきり知ることになるだろう。UNIXの本質を理解するうえで、UNIX信者もUNIX初心者にとっても有用な1冊だ。（斎藤牧人）`
%}}

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
