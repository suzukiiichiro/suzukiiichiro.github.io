---
title: "Ｎクイーン問題（９）第二章　ブルートフォースの再帰・非再帰"
date: 2023-03-16T11:26:18+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - エイト・クイーン
  - シェルスクリプト
  - Bash
  - アルゴリズム
  - 鈴木維一郎
---


## Ｎクイーン問題について
Ｎクイーン問題とは、ＮxＮの盤面にチェスのクイーンＮ個を、互いに効きが無い（クイーンは縦・横・斜め45度方向に効きがある）状態で配置する問題。

すべてのクイーンの効きに当たらない配置の１つ
```
        column(列)
   _4___3___2___1___0_
  |---|---|-Q-|---|---|0
  +-------------------+
  |---|---|---|---|-Q-|1
  +-------------------+ 
  |---|-Q-|---|---|---|2 row(行) 
  +-------------------+ 
  |---|---|---|-Q-|---|3
  +-------------------+
  |-Q-|---|---|---|---|4
  +-------------------+
```
一般的には８×８のチェス盤を用いる８クイーン問題が有名。
多くのエイトクイーン研究者は盤面の縦横幅を８に固定せず、 ＮxＮの盤面とし、現実的な処理時間で、どのサイズ（Ｎ）までの解を求めることができるかを競っています。

現在、Ｎ２８の解を求めたドレスデン大学が世界一を記録している。詳しくは（１）を参照してください。

N-Queens問題：Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/


## ブルートフォースについて
力まかせ探索は、全ての可能性のある解の候補を体系的に数えあげます。
解の候補が一つ生成される都度、その解の候補が解となるかをチェックします。
解の候補が生成後に「解であるか」をチェックするので「生成検査法（generate and test）」とも呼ばれます。

ブルートフォースの手数は、各列 `row` には１個のクイーンしか置けないので、Ｎ５の場合は、５＊５＊５＊５＊５＝３１２５となり、５＾５，またはＮ＾Ｎと表記します。
したがって、アルゴリズム的に言えば、「力まかせ探索による Ｎクイーン問題の処理時間は Ｏ（Ｎ＾Ｎ）」となります。


## 効き筋のチェック
ここでは具体的な説明を割愛しますが、解の候補が生成される都度、以下の効き筋チェック関数が呼び出され、解となりうるかを判定すします。
いわゆるＮ５の場合は、以下のチェック関数が３１２５回実行されることになります。

``` bash
: 'ブルートフォース版効き筋をチェック';
function check_bluteForce(){
  local -i size="$1";
  local -i flag=1;
  for ((r=1;r<size;++r)){
    for ((i=0;i<r;++i)){
      #echo `$(($1-$2)) | sed -e "s/^-//g"`;
      if (( board[i]>=board[r] ));then
        val=$(( board[i]-board[r] ));
      else
        val=$(( board[r]-board[i] ));
      fi

      if (( board[i]==board[r] || val==(r-i) ));then
        flag=0; 
        return ;
      fi
    }
  }
  flag=1;
  [[ $flag -eq 0 ]]
  return $?;
}
```

各列`col`、行`row`と比べて、横、斜め左右４５度方向に置かれていないかをチェックし、効きがあればその時点で 「０」（false)を返します。（縦は最初から一つしか置けない仕組みになっているのでチェックはしません）
効きがまったく無い場合は 「１」（true） を返します。つまり解を発見したということになります。



## 再帰と非再帰について
これまでは再帰という手法でＮクイーンを解決してきました。

再帰を用いたプログラムソースは比較的シンプルに書くことができるのですが、「自分で自分を呼び出す」というロジックが馴染めない人も多いのではないかと思います。

さらに、再帰は「何が行われているのか」がわかりにくく、「ここは再帰」ということで「ここまでなんとか理解をしてきた」ことも否めません。

では、再帰で書くしかないのでしょうか。
いえ、実は再帰ではなく、非再帰で書くこともできます。

非再帰で書くと、多少プログラムソースは長くはなりますが、メリットとして「再帰よりも速い」「関数呼び出しという負荷がなくなる」「変数の値を保持しておく物理メモリの使用率を最小限に抑えることができる」、といったメリットがあります。

なにより、ＣＰＵでの計算と比べて、およそ１００倍以上高速なＧＰＵでの計算ができます。
ＧＰＵで処理するためにはＧＰＵ−ＣＵＤＡというミドルウェアを使う必要があります。
なんとこのＧＰＵ−ＣＵＤＡは「再帰」に未対応なのです（昔は対応していました）。

ということで、第二章からは「再帰」と「非再帰」を両面で理解しつつ、ＧＰＵでのエイトクイーン実装に向けて頑張って進めていきたいと思います。


## ブルートフォース再帰版
ブルートフォース再帰版のプログラムソースは以下のとおりです。
第一章のブルートフォース再帰版をより最適化したものですが、ロジックに大きな変化はありません。

``` bash
: '再帰版ブルートフォース';
function bluteForce_R(){
  local -i row="$1";
  local -i size="$2";
  local -i col=;
  if ((row==size));then
    check_bluteForce "$size";
    if (( $?==1 ));then 
      ((TOTAL++));
      printRecord "$size";   # 出力しないならコメント
    fi
  else
    for(( col=0;col<size;col++ )){
      board["$row"]="$col";
      bluteForce_R $((row+1)) $size ;
    }
  fi
}
```

for文で各行の何`row`目にクイーンを配置するかを決め、最後まで配置した場合は、`check_bluteForce()` を呼んで、クイーンの配置が「効き」であるかどうかを判定します。
効きでなければ「解を発見した」として `((TOTAL++))`で、解個数をインクリメントします。

ですので、`check_bluteForce()` 関数は、クイーンの効きを判定する関数となります。
重要なことは、クイーンの配置が終わったら

```
  if ((row==size));then
```
の条件式に入り、その直後で
```
    check_bluteForce "$size";
```
を呼び出して、クイーンの配置に問題がないかをチェックします。
`check_bluteForce()`関数の末尾では以下のようになっています。

```
  [[ $flag -eq 0 ]]
  return $?;
```

これは、`$flag` が `0` だったら、直前の `$flag` の値を `return` するという記述です。
また、受け取り側の `function bluteForce_R()` の以下の部分ですが、
```
    check_bluteForce "$size";
    if (( $?==1 ));then 
      ((TOTAL++));
      printRecord "$size";   # 出力しないならコメント
    fi
```

`check_bluteForce()`関数で、効きの判定を行い、「戻り値が `$?==1` 」で、効きではないのと判定されたので、解を発見したことになり、`((TOTAL++))`で合計をインクリメントして、`printRecord()`のボードレイアウト表示関数によって、クイーンの位置を表示する、というロジックとなります。


ここで `bash`の豆知識ですが、

```
    if (( $?==1 ));then 
```

となっているのは、`check_bluteForce "$size";` で実行した `return` の変数の値を `$?` で参照し、「１」であれば、
```
      ((TOTAL++));
      printRecord "$size";   # 出力しないならコメント
```
を実行するという処理となっています。


`bash` では、`return` よって値を「戻り値」として扱うことができない、と多くの書籍やＷｅｂページで言われていますが、こうした使い方によって、「関数の戻り値を利用することができる」ということを覚えておくと良いでしょう。

```
      printRecord "$size";   # 出力しないならコメント
```

は、ボードレイアウトのクイーンの位置を配置する出力関数です。


## ボードレイアウトの出力
ボードレイアウトの出力関数は以下のとおりです。

``` bash
: 'ボードレイアウトを出力';
function printRecord(){
  size="$1";
	echo "$TOTAL";
  sEcho=" ";  
  for((i=0;i<size;i++)){
    sEcho="${sEcho}${board[i]} ";
  }
  echo "$sEcho";
  echo -n "+";
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }
  echo "+";
  for((i=0;i<size;i++)){
    echo -n "|";
    for((j=0;j<size;j++)){
      if((i==board[j]));then
        echo -n "O";
      else
        echo -n " ";
      fi
      if((j<(size-1)));then
        echo -n "|";
      fi
    }
  echo "|";
  if((i<(size-1)));then
    echo -n "+";
    for((j=0;j<size;j++)){
      echo -n "-";
      if((j<(size-1)));then
        echo -n "+";
      fi
    }
  echo "+";
  fi
  }
  echo -n "+";
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }  
  echo "+";
  echo "";
}

```



## ブルートフォース非再帰版
ブルートフォース非再帰版のプログラムソースは以下のとおりです。

``` bash
: '非再帰版ブルートフォース';
function bluteForce_NR(){
	local -i row="$1";
	local -i size="$2";
	for ((i=0;i<size;i++)){ board[$i]=-1; }
  while ((row>-1));do
    local -i matched=0;
    local -i col=0;	
    for((col=board[row]+1;col<size;col++)){
      board[$row]=$col;
      matched=1;
      break;
    }
    if ((matched));then
      ((row++));
      if ((row==size));then	# 最下部まで到達
        ((row--));
        check_bluteForce "$size";  # 効きをチェック
        if (($?==1));then # 直前のreturnを利用
          ((TOTAL++));
          printRecord "$size"; # 出力
        fi
      fi
    else
      if ((board[row]!=-1));then
        board[$row]=-1;
      fi
      ((row--));
    fi
 done	
}
```

## ブルートフォースのポイント
ブルートフォースのポイントは、
クイーンの配置が終わったら
```
  if ((row==size));then
    check_bluteForce "$size";
    if (( $?==1 ));then 
      ((TOTAL++));
      printRecord "$size";   # 出力しないならコメント
    fi
  else
```
その直後でクイーンの効きを判定する `check_bluteForce()` 関数が呼び出されることです。

```
    check_bluteForce "$size";
```

３１２５回、クイーンの配置が完了する都度、`check_bluteForce()`が３１２５回呼び出されるわけです。



## プログラムソース
再帰版・非再帰版を含むすべてのプログラムソースは以下のとおりです。
プログラムソース最下部で、再帰と非再帰の実行をコメントアウトで切り替えて実行してください。

``` bash:bluteForce.sh
#!/usr/bin/bash

declare -i TOTAL=0;     # カウンター
#
: 'ボードレイアウトを出力';
function printRecord(){
  size="$1";
	echo "$TOTAL";
  sEcho=" ";  
  for((i=0;i<size;i++)){
    sEcho="${sEcho}${board[i]} ";
  }
  echo "$sEcho";
  echo -n "+";
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }
  echo "+";
  for((i=0;i<size;i++)){
    echo -n "|";
    for((j=0;j<size;j++)){
      if((i==board[j]));then
        echo -n "O";
      else
        echo -n " ";
      fi
      if((j<(size-1)));then
        echo -n "|";
      fi
    }
  echo "|";
  if((i<(size-1)));then
    echo -n "+";
    for((j=0;j<size;j++)){
      echo -n "-";
      if((j<(size-1)));then
        echo -n "+";
      fi
    }
  echo "+";
  fi
  }
  echo -n "+";
  for((i=0;i<size;i++)){
    echo -n "-";
    if((i<(size-1)));then
      echo -n "+";
    fi
  }  
  echo "+";
  echo "";
}
#
: 'ブルートフォース版効き筋をチェック';
function check_bluteForce(){
  local -i size="$1";
  local -i flag=1;
  for ((r=1;r<size;++r)){
    for ((i=0;i<r;++i)){
      #echo `$(($1-$2)) | sed -e "s/^-//g"`;
      if (( board[i]>=board[r] ));then
        val=$(( board[i]-board[r] ));
      else
        val=$(( board[r]-board[i] ));
      fi

      if (( board[i]==board[r] || val==(r-i) ));then
        flag=0; 
        return ;
      fi
    }
  }
  flag=1;
  [[ $flag -eq 0 ]]
  return $?;
}
#
: '非再帰版ブルートフォース';
function bluteForce_NR(){
	local -i row="$1";
	local -i size="$2";
	for ((i=0;i<size;i++)){ board[$i]=-1; }
  while ((row>-1));do
    local -i matched=0;
    local -i col=0;	
    for((col=board[row]+1;col<size;col++)){
      board[$row]=$col;
      matched=1;
      break;
    }
    if ((matched));then
      ((row++));
      if ((row==size));then	# 最下部まで到達
        ((row--));
        check_bluteForce "$size";  # 効きをチェック
        if (($?==1));then # 直前のreturnを利用
          ((TOTAL++));
          printRecord "$size"; # 出力
        fi
      fi
    else
      if ((board[row]!=-1));then
        board[$row]=-1;
      fi
      ((row--));
    fi
 done	
}
: '再帰版ブルートフォース';
function bluteForce_R(){
  local -i row="$1";
  local -i size="$2";
  local -i col=;
  if ((row==size));then
    check_bluteForce "$size";
    if (( $?==1 ));then 
      ((TOTAL++));
      printRecord "$size";   # 出力しないならコメント
    fi
  else
    for(( col=0;col<size;col++ )){
      board["$row"]="$col";
      bluteForce_R $((row+1)) $size ;
    }
  fi
}

# 非再帰版ブルートフォース
# time bluteForce_NR 0 5;
#
# 再帰版ブルートフォース
time bluteForce_R 0 5;
#
exit;
```



## 実行結果
実行結果は以下の通りです。

```
bash-3.2$ bash bluteForce.sh
1
 0 2 4 1 3 
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+

2
 0 3 1 4 2 
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+

3
 1 3 0 2 4 
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+

4
 1 4 2 0 3 
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+

5
 2 0 3 1 4 
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+

6
 2 4 1 3 0 
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+

7
 3 0 2 4 1 
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+

8
 3 1 4 2 0 
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+

9
 4 1 3 0 2 
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+

10
 4 2 0 3 1 
+-+-+-+-+-+
| | |O| | |
+-+-+-+-+-+
| | | | |O|
+-+-+-+-+-+
| |O| | | |
+-+-+-+-+-+
| | | |O| |
+-+-+-+-+-+
|O| | | | |
+-+-+-+-+-+
bash-3.2$
```

どうですか？
遅いでしょう？

ブルートフォースは遅いのです。
効きの判定関数を本体の関数から外に出して別関数としたことで、ロジックがよりわかりやすくなりました。
次のページでは、同様に効きの判定関数を別関数にして、バックトラックの再起と非再帰をご説明します。
お楽しみに！


## リンクと過去記事
N-Queens問題：Ｎクイーン問題（１２）第二章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-17-02-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（１１）第二章　配置フラグの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-17-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（１０）第二章　バックトラックの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-16-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（９）第二章　ブルートフォースの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-14-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（８）第一章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-09-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（７）第一章　ブルートフォース再び
https://suzukiiichiro.github.io/posts/2023-03-08-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（６）第一章　配置フラグ
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（５）第一章　進捗表示テーブルの作成
https://suzukiiichiro.github.io/posts/2023-03-06-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（４）第一章　バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（３）第一章　バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（２）第一章　ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/

エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens




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






