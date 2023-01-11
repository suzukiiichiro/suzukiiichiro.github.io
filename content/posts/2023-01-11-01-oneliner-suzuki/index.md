---
title: "【ちょいと便利な】シェルスクリプトワンライナー特集２【一行完結】"
date: 2023-01-11T10:39:50+09:00
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
一説にはプログラムソースの文字数が６５文字以下である事が必要といわれている。

【ちょいと便利な】シェルスクリプトワンライナー特集【一行完結】
https://suzukiiichiro.github.io/posts/2022-11-30-01-oneliner-suzuki/

【ちょいと便利な】シェルスクリプトワンライナー特集２【一行完結】
https://suzukiiichiro.github.io/posts/2023-01-11-01-oneliner-suzuki/



## コマンドにおける一般的な２つの実行方法

次のコマンドのほとんどは、
１．パイプ経由で使用すること
２．ファイルに対して直接使用する

のいずれも可能です。
たとえば、コマンド sed expressionは次の両方の方法で使用できます。

```:bash
... | sed expression
sed expression path/to/file
```


## ファイル間隔

ダブルスペースの扱いについて
```:bash
sed G
awk '1;{print ""}'
awk 'BEGIN{ORS="\n\n"};1'
```


既に空白行が含まれているダブルスペース。
出力では、テキストの行間に空白行を1行以上含めません。
```:bash
sed '/^$/d;G'
awk 'NF{print $0 "\n"}'
```


トリプルスペースの扱いについて
```:bash
sed 'G;G'
awk '1;{print "\n"}'
```


ダブルスペースを元に戻します (偶数行は常に空白であると仮定します):
```:bash
sed 'n;d'
```


一致するすべての行の上に空白行を挿入します。
```:bash
sed '/regex/{x;p;x;}'
```


regexに一致するすべての行の下に空白行を挿入します。
```:bash
sed '/regex/G'
```


正規表現に一致するすべての行の上下に空白行を挿入します。
```:bash
sed '/regex/{x;p;x;G;}'
```


末尾に改行を追加します:
```:bash
sed '$a\'
```



## 番号付けと計算
タブを使用して各行に番号を付けます (単純な左揃え)。
```:bash
sed = filename | sed 'N;s/\n/\t/'
awk '{print FNR "\t" $0}'
```


タブを使用して各行の前に行番号を付けます。
```:bash
awk '{print NR "\t" $0}' files*
```


行番号を付ける (左揃え、右揃えの番号)。
```:bash
nl
sed = filename | sed 'N; s/^/     /; s/ *\(.\{6,\}\)\n/\1  /'
awk '{printf("%5d : %s\n", NR,$0)}'
```


行が空白でない場合にのみ行番号を付ける。
```:bash
sed '/./=' filename | sed '/./N; s/\n/ /'
awk 'NF{$0=++a " :" $0};1'
awk '{print (NF? ++a " :" :"") $0}'
```


行を数える:
```:bash
wc -l
sed -n '$='
awk 'END{print NR}'
```


すべての行のすべてのフィールドの合計を出力します。
```:bash
awk '{s=0; for (i=1; i<=NF; i++) s=s+$i; print s}'
awk '{s=0; for (i=1; i<=NF; i++) s=s+$i}; END{print s}'
```


各フィールドを絶対値で置き換えた後、すべての行を出力します。
```:bash
awk '{for (i=1; i<=NF; i++) if ($i < 0) $i = -$i; print }'
awk '{for (i=1; i<=NF; i++) $i = ($i < 0) ? -$i : $i; print }'
```


すべての行のフィールド (「単語」) の総数を出力します。
```:bash
awk '{ total = total + NF }; END {print total}' file
```


「Beth」を含む行数を出力します。
```:bash
awk '/Beth/{n++}; END {print n+0}'
```


最大の最初のフィールドとそれを含む行を出力します (フィールド 1 で最も長い文字列を見つけることを目的としています)。
```:bash
awk '$1 > max {max=$1; maxline=$0}; END{ print max, maxline}'
```


各行のフィールド数を出力し、その後に次の行を出力します。
```:bash
awk '{ print NF ":" $0 } '
```


各行の最後のフィールドを出力します。
```:bash
awk '{ print $NF }'
```


最初のフィールドを除くすべてを出力します。
```:bash
awk '{ $1 = ""; print substr($0, 2) }'
```


最後の行の最後のフィールドを出力します。
```:bash
awk '{ field = $NF }; END{ print field }'
```


4 つ以上のフィールドを含むすべての行を出力します。
```:bash
awk 'NF > 4'
```


最後のフィールドの値が > 4 であるすべての行を出力します
```:bash
awk '$NF > 4'
```


各行に最初と最後の列を追加します。
```:bash
perl -lane 'print $F[0] + $F[-1]'
```


すべての数値を 1 ずつ増やします。
```:bash
perl -pe 's/(\d+)/ 1 + $1 /ge'
```


列を要約します。
```:bash
awk '{ sum+=$1 } END { print sum }'
```


##変換と置換
改行をスペースに変換します。
```:bash
tr '\n' ' '
perl -pe 's/\n/ /'
sed ':a;N;$!ba;s/\n/ /g'          # will not convert last newline!
```


CRLF を LF 形式に変換します。
```:bash
sed 's/.$//'                      # assumes that all lines end with CRLF
sed 's/^M$//'                     # in bash/tcsh, press Ctrl-V then Ctrl-M
sed 's/\x0D$//'                   # works on ssed, gsed 3.02.80 or higher
tr -d \r                          # GNU tr version 1.22 or higher
awk '{sub(/\r$/,"")};1'           # assumes EACH line ends with Ctrl-M
perl -p -i -e 's/\012?\015/\n/g'
```


各行の先頭から先頭の空白 (スペース、タブ) を削除し、すべてのテキストを揃えて左揃えにします。
```:bash
sed 's/^[ \t]*//'
awk '{sub(/^[ \t]+/, "")};1'
```


各行の終わりから末尾の空白 (スペース、タブ) を削除します。
```:bash
sed 's/[ \t]*$//'
awk '{sub(/[ \t]+$/, "")};1'
```


各行から先頭と末尾の両方の空白を削除します。
```:bash
sed 's/^[ \t]*//;s/[ \t]*$//'
awk '{gsub(/^[ \t]+|[ \t]+$/,"")};1'
awk '{$1=$1};1'                       # also removes extra space between fields
```


各行の先頭に 5 つの空白を挿入します (ページ オフセットを作成します)。
```:bash
sed 's/^/     /'
awk '{sub(/^/, "     ")};1'
```


すべてのテキストを揃えて、79 列の幅で右揃えにします。
```:bash
sed -e :a -e 's/^.\{1,78\}$/ &/;ta'
awk '{printf "%79s\n", $0}'
```


すべてのテキストを 79 列幅の中央に配置します。方法 1 では、行頭のスペースが重要であり、後続のスペースは行末に追加されます。方法 2 では、行の先頭にあるスペースは行の中央揃えで破棄され、行末に末尾のスペースは表示されません。
```:bash
sed  -e :a -e 's/^.\{1,77\}$/ & /;ta'                         # method 1
sed  -e :a -e 's/^.\{1,77\}$/ &/;ta' -e 's/\( *\)\1/\1/'      # method 2
awk '{l=length();s=int((79-l)/2); printf "%"(s+l)"s\n",$0}'
```


各行で次のように置換 (検索および置換)します。
```:bash
sed 's/foo/bar/'                      # replaces only 1st instance in a line
awk '{sub(/foo/,"bar")}; 1'           # replaces only 1st instance in a line
sed 's/foo/bar/4'                     # replaces only 4th instance in a line
gawk '{$0=gensub(/foo/,"bar",4)}; 1'  # replaces only 4th instance in a line
sed 's/foo/bar/g'                     # replaces ALL instances in a line
awk '{gsub(/foo/,"bar")}; 1'          # replaces ALL instances in a line
sed 's/\(.*\)foo\(.*foo\)/\1bar\2/'   # replaces the next-to-last case
sed 's/\(.*\)foo/\1bar/'              # replaces only the last case
perl -p -i.bak -e 's/foo/bar/g' *.c   # also keeps backups
```


bazを含む行のfooをbarに置き換えます。
```:bash
sed '/baz/s/foo/bar/g'
awk '/baz/{gsub(/foo/, "bar")}; 1'
```


bazを除く行のfooをbarに置き換えます。
```:bash
sed '/baz/!s/foo/bar/g'
awk '!/baz/{gsub(/foo/, "bar")}; 1'
```



scarletまたはrubyまたはpuceをredに変更します。
```:bash
sed 's/scarlet/red/g;s/ruby/red/g;s/puce/red/g'   # most seds
gsed 's/scarlet\|ruby\|puce/red/g'                # GNU sed only
awk '{gsub(/scarlet|ruby|puce/, "red")}; 1'
```


行の逆順:
```:bash
tac
sed '1!G;h;$!d'
sed -n '1!G;h;$p'
awk '{a[i++]=$0} END {for (j=i-1; j>=0;) print a[j--] }'
perl -e 'print reverse <>'
```


段落を反転します:
```:bash
perl -00 -e 'print reverse <>'
```


行の各文字を反転します。
```:bash
rev
sed '/\n/!G;s/\(.\)\(.*\n\)/&\2\1/;//D;s/.//'
perl -nle 'print scalar reverse $_'
```


行のペアを並べて結合します。
```:bash
paste
sed '$!N;s/\n/ /'
```


行がバックスラッシュで終わっている場合は、次の行を追加します。
```:bash
sed -e :a -e '/\\$/N; s/\\\n//; ta'
```


行が等号で始まる場合は前の行に追加し、「=」を 単一のスペースに置き換えます。
```:bash
sed -e :a -e '$!N;s/\n=/ /;ta' -e 'P;D'
```


数値文字列にコンマを追加し「1234567」を「1,234,567」に変更します。
```:bash
gsed ':a;s/\B[0-9]\{3\}\>/,&/;ta'                     # GNU sed
sed -e :a -e 's/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/;ta'  # other seds
```


小数点とマイナス記号を含む数値にコンマを追加します。
```:bash
gsed -r ':a;s/(^|[^0-9.])([0-9]+)([0-9]{3})/\1\2,\3/g;ta'
```


5 行ごとに空白行を追加します (5、10、15、20 行などの後):
```:bash
gsed '0~5G'                  # GNU sed only
sed 'n;n;n;n;G;'             # other seds
```


すべてのユーザーのログイン名を出力して並べ替えます。
```:bash
awk -F ":" '{print $1 | "sort" }' /etc/passwd
```


各行の最初の 2 つのフィールドを逆の順序で出力します。
```:bash
awk '{print $2, $1}'
```


すべての行の最初の 2 つのフィールドを切り替えます。
```:bash
awk '{temp = $1; $1 = $2; $2 = temp}'
```


その行の最初のフィールドを削除して、すべての行を印刷します。
```:bash
cut -d' ' -f2-
awk '{ $1 = ""; print }'
```


その行の 2 番目のフィールドを削除して、すべての行を出力します。
```:bash
awk '{ $2 = ""; print }'
```


すべての行のフィールドを逆順に出力します。
```:bash
awk '{for (i=NF; i>0; i--) printf("%s ",$i);print ""}'
```


フィールド間にコンマ区切りを使用して、5 行ごとに入力を連結します。
```:bash
awk 'ORS=NR%5?",":"\n"'
```


各ファイル名の文字列の名前の部分aaaをbbbに変更します。
```:bash
ls | perl -ne 'chomp; next unless -e; $o = $_; s/aaa/bbb/; next if -e; rename $o, $_';
```


## 選択出力
最初の 10 行を出力します。
```:bash
head
sed 10q
awk 'NR < 11'
```


最初の行を印刷:
```bash
head -1
sed q
awk 'NR>1{exit};1'
```


最後の 10 行を出力します。
```:bash
tail
sed -e :a -e '$q;N;11,$D;ba'
```


最後の 2 行を出力します。
```:bash
tail -2
sed '$!N;$!D'
awk '{y=x "\n" $0; x=$0};END{print y}'
```


最後の行を出力
```:bash 
tail -1
sed '$!d'
sed -n '$p'
awk 'END{print}'
```


最終行の次の行を出力します。
```:bash
sed -e '$!{h;d;}' -e x              # for 1-line, print blank line
sed -e '1{$q;}' -e '$!{h;d;}' -e x  # for 1-line, print the line
sed -e '1{$d;}' -e '$!{h;d;}' -e x  # for 1-line, print nothing
```


正規表現に一致する行のみを出力します。
```:bash
grep 'regex'
sed -n '/regex/p'           # method 1
sed '/regex/!d'             # method 2
awk '/regex/'
```


正規表現に一致しない行のみを出力:
```:bash
grep -v regex
sed -n '/regex/!p'          # method 1, corresponds to above
sed '/regex/d'              # method 2, simpler syntax
awk '!/regex/'
```


正規表現の直前の行を出力しますが、正規表現を含む行は出力しません:
```:bash
sed -n '/regex/{g;1!p;};h'
awk '/regex/{print x};{x=$0}'
awk '/regex/{print (NR==1 ? "match on line 1" : x)};{x=$0}'
```


正規表現の直後の行を出力しますが、それを含む行は出力しません:
```:bash
sed -n '/regex/{n;p;}'
awk '/regex/{getline;print}'
```


正規表現の前後に 1 行のコンテキストを行番号付きで出力します。
```:bash
grep -A1 -B1 -n regex
sed -n -e '/regex/{=;x;1!p;g;$!N;p;D;}' -e h
```


AAA と BBB と CCC を検索します (任意の順序で):
```:bash
sed '/AAA/!d; /BBB/!d; /CCC/!d'
awk '/AAA/ && /BBB/ && /CCC/'
```


AAA、BBB、CCC(この順序で)を含む行を検索します。
```:bash
sed '/AAA.*BBB.*CCC/!d'
awk '/AAA.*BBB.*CCC/'
```


AAA、BBBまたはCCCを検索します。
```:bash
egrep "AAA|BBB|CCC"
grep -E "AAA|BBB|CCC"
sed -e '/AAA/b' -e '/BBB/b' -e '/CCC/b' -e d    # most seds
gsed '/AAA\|BBB\|CCC/!d'                        # GNU sed only
```


AAAが含まれている段落を出力します(空白行で段落を区切ります):
```:bash
sed -e '/./{H;$!d;}' -e 'x;/AAA/!d;'
```


段落AAAに BBBとCCC(任意の順序で)が含まれている段落を出力します。
```:bash
sed -e '/./{H;$!d;}' -e 'x;/AAA/!d;/BBB/!d;/CCC/!d'
```


AAA、BBBまたはCCCが含まれている段落を出力します。
```:bash
sed -e '/./{H;$!d;}' -e 'x;/AAA/b' -e '/BBB/b' -e '/CCC/b' -e d
gsed '/./{H;$!d;};x;/AAA\|BBB\|CCC/b;d'         # GNU sed only
```


65 文字以上の行を出力します。
```:bash
sed -n '/^.\{65\}/p'
awk 'length > 64'
```


65 文字未満の行のみを出力します。
```:bash
sed -n '/^.\{65\}/!p'        # method 1, corresponds to above
sed '/^.\{65\}/d'            # method 2, simpler syntax
awk 'length < 65'
```


正規表現から最後までのセクションを出力します。
```:bash
sed -n '/regex/,$p'
awk '/regex/,0'
awk '/regex/,EOF'
```


行番号に基づいてセクションを出力します (8 行目から 12 行目まで):
```:bash
sed -n '8,12p'
sed '8,12!d'
awk 'NR==8,NR==12'
perl -ne 'print if 8 .. 12'
perl -pe 'exit if 8<$. && $.<12'
```


行番号 52 を出力します。
```:bash
sed -n '52p'
sed '52!d'
sed '52q;d'                  # efficient on large files
awk 'NR==52'
awk 'NR==52 {print;exit}'    # more efficient on large files
```


3 行目から 7 行ごとに出力します。
```:bash
gsed -n '3~7p'
sed -n '3,${p;n;n;n;n;n;n;}'
```


2 つの正規表現の間のセクションを出力します (包括的):
```:bash
sed -n '/START/,/END/p'
awk '/START/,/END/'
perl -ne 'print if /START/ .. /END/'
perl -ne 'print if m{START} .. m{END}'
```


2 つの正規表現の間のセクションを除くすべてを出力します。
```:bash
sed '/START/,/END/d'
perl -i.old -ne 'print unless /START/ .. /END/'
```


フィールドを正規表現と照合します。
```:bash
awk '$7  ~ /^[a-f]/'    # print line if field #7 matches regex
awk '$7 !~ /^[a-f]/'    # print line if field #7 does NOT match regex
```


フィールド 5 が に等しい任意の行を出力しますabc123。
```:bash
awk '$5 == "abc123"'
```


フィールド 5 が等しくない行のみを出力しabc123ます (フィールドが 5 未満の行も出力します)。
```:bash
awk '$5 != "abc123"'
awk '!($5 == "abc123")'
```


回文を出力します。
```:bash
perl -lne 'print if $_ eq reverse'
```


重複した単語を一行に出力する：
```:bash
perl -0777 -ne 'print "$.: doubled $_\n" while /\b(\w+)\b\s+\b\1\b/gi'
```


パターンからの抜粋:
```:bash
awk 'match($0, /(.+)/, a) { print a[1] }'
grep -oP "queue name='\K.+?(?=')"
```


コンテキストでフィルタリングし、コンテキストからフィールドを出力します。
```:bash
grep -A1 'to filter' /etc/multipath.conf | awk 'BEGIN { RS="--" } ; { print $2, $4 }'
```


クリップボードから出力します。
```:bash
awk 'match($0, /h_vmem=([0-9]+[kKmMgGtT])/, a) { print a[1] }'
```



## 選択的削除
重複する連続した行を削除します。
一連の重複行の最初の行は保持され、残りは削除されます。
```:bash
uniq
sed '$!N; /^\(.*\)\n\1$/!P; D'
awk 'a !~ $0; {a=$0}'
```


重複が連続していない行を削除します。
```:bash
sed -n 'G; s/\n/&&/; /^\([ -~]*\n\).*\n\1/d; s/\n//; h; P'
awk '!a[$0]++'                     # most concise script
awk '!($0 in a){a[$0];print}'      # most efficient script
```


重複する行を除くすべての行を削除します。
```:bash
uniq -d
sed '$!N; s/^\(.*\)\n\1$/\1/; t; D'
```


最初の行を削除します。
```:bash
tail -n +2
awk 'NR > 1'
```


最初の 10 行を削除します。
```:bash
sed '1,10d'
awk 'NR > 10'
perl -ne 'print unless 1 .. 10'
```


5 行目を削除します。
```:bash
awk 'NR != 5'
sed '5d'
```


5 ～ 10 などの範囲の行を削除します。
```:bash
awk 'NR < 5 || NR > 10'
sed '5,10d'
```


最後の行を削除します。
```:bash
sed '$d'
```


最後の 2 行を削除します。
```:bash
sed 'N;$!P;$!D;$d'
```


最後の 10 行を削除します。
```:bash
sed -e :a -e '$d;N;2,10ba' -e 'P;D'   # method 1
sed -n -e :a -e '1,10!{P;N;D;};N;ba'  # method 2
```


8 行ごとに削除します。
```:bash
gsed '0~8d'                           # GNU sed only
sed 'n;n;n;n;n;n;n;d;'                # other seds
```


パターンに一致する行を削除:
```:bash
sed '/pattern/d'
```


空行をすべて削除します。
```:bash
grep '.'
sed '/^$/d'                           # method 1
sed '/./!d'                           # method 2
awk NF
awk '/./'
```


最初の空白行を除くすべての連続する空白行を削除し、先頭と末尾のすべての空白行も削除します。
```:bash
cat -s
sed '/./,/^$/!d'          # method 1, allows 0 blanks at top, 1 at EOF
sed '/^$/N;/\n$/D'        # method 2, allows 1 blank at top, 0 at EOF
```


最初の 2 行を除く連続する空白行をすべて削除します。
```:bash
sed '/^$/N;/\n$/N;//D'
```


先頭の空白行をすべて削除します。
```:bash
sed '/./,$!d'
```


末尾の空白行をすべて削除します。
```:bash
sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'  # works on all seds
sed -e :a -e '/^\n*$/N;/\n$/ba'        # dito, except for gsed 3.02.*
```


各段落の最後の行を削除します。
```:bash
sed -n '/^$/{p;h;};/./{x;/./p;}'
```



## 挿入
最初の行として挿入:
```:bash
sed '1 i foo
```


最初の行の後に (2 行目として) 挿入:
```:bash
sed '1 a foo'
```


AAA を含む行の上に BBB を含む行を挿入します。
```:bash
sed '/AAA/i BBB'
```



## 文字列の作成
特定の長さの文字列を作成します (例: 513 スペースを生成)
```:bash
awk 'BEGIN{while (a++<513) s=s " "; print s}'
```


特定の文字位置に特定の長さの文字列を挿入します (例 では、各入力行の列 6 の後に 49 個のスペースを挿入します)。
```:bash
gawk --re-interval 'BEGIN{while(a++<49)s=s " "};{sub(/^.{6}/,"&" s)};1'
```



## 引用構文: 
上記の例では、`Unix` プラットフォームでは通常 `sed` が使用されるため、編集コマンドを囲むために二重引用符 ("…") の代わりに単一引用符 ('…') を使用しています。



## SED スクリプトでの '\t' の使用: 
ドキュメントを明確にするために、スクリプトでタブ文字 (0x09) を示すために表現 `\t` を使用しました。
ただし、ほとんどのバージョンの sed は `\t` の省略形を認識しないため、コマンドラインからこれらのスクリプトを入力するときは、代わりに `TAB` キーを押す必要があります。



## SED のバージョン: 
sed のバージョンが異なる場合、多少の構文の違いが予想されます。
特に、編集コマンド内でのラベル (:name)、または分岐命令 (b,t) の使用は、コマンドの最後を除き、ほとんどサポートされていません。
sed の一般的な GNU バージョンではより簡潔な構文が許可されています。

次のようなかなり長いコマンドは、
```:bash
sed -e '/AAA/b' -e '/BBB/b' -e '/CCC/b' -e d
```


GNU sed を使用すると、次のように書くことができます。

```
sed '/AAA/b;/BBB/b;/CCC/b;d'      # or even
sed '/AAA\|BBB\|CCC/b;d'
```

sed の多くのバージョンは「/one/s/RE1/RE2/」のようなコマンドを受け入れますが、「/one/! s/RE1/RE2/」で、「s」の前にスペースが含まれています。コマンドを入力するときは、スペースを省略してください。



## 速度の最適化: 
実行速度を上げる必要がある場合 (入力ファイルが大きい、プロセッサやハードディスクが遅いなどの理由で)、「s/…/…/」を指定する前に「find」式を指定すると、置換がより迅速に実行されます。

```
sed 's/foo/bar/g' filename         # standard replace command
sed '/foo/ s/foo/bar/g' filename   # executes more quickly
sed '/foo/ s//bar/g' filename      # shorthand sed syntax
```


ファイルの最初の部分から行を出力するだけでよい行の選択または削除では、スクリプト内の「quit」コマンド (q) により、大きなファイルの処理時間が大幅に短縮されます。

```
sed -n '45,50p' filename           # print line nos. 45-50 of a file
sed -n '51q;45,50p' filename       # same, but executes much faster
```



## ワンライナーの定義
ワンライナーとして認定するには、コマンド ラインを ６５文字以下にする必要があります。




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

