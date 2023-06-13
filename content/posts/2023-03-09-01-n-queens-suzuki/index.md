---
title: "Ｎクイーン問題（８）第一章　まとめ"
date: 2023-03-09T14:45:39+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - シェルスクリプト
  - Bash
  - アルゴリズム
  - 鈴木維一郎
---

![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)



## ここまでのあらすじ
ここまでのおさらいと整理・まとめをしておきたいと思います。

（１）ではエイトクイーンについてを説明しました。先人の方々の努力や現在までの経緯などをリンクも交えて紹介しました。
N-Queens問題：Ｎクイーン問題（１）について
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/

（２）では解は出しはしませんでしたが「ブルートフォース」について説明しました。
ブルートフォースは、すべてのステップを出しつつ、解を求める方法で、Ｎ５の場合は５＊５＊５＊５＊５＝３１２５ステップも必要となります。これを　５＾５　または　Ｎ＾Ｎと表記することも説明してきました。
N-Queens問題：Ｎクイーン問題（２）ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/

（３）ではバックトラックの前準備として縦だけではなく横の制約もいれて「縦方向と横方向の効き」を活かした方法を紹介しました。
ステップは　５＊４＊３＊２＊１＝１２０ステップですみます。これを　５！　または　Ｎ！　と表記することも説明してきました。
こちらの方法はバックトラックと言われる「縦と横と斜め」の効きについての一歩手前の処理と言えます。
（３）の段階では、バックトラックといえども、まだ斜めの効きはまだ考慮されていませんが、ブルートフォースと異なり、処理をする中で、「可能性がなければ前のトラックに戻って処理をすすめる」という効率的なアプローチとなります。
N-Queens問題：Ｎクイーン問題（３）バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/

（４）では、「縦横斜めの効き」を考慮した「バックトラック」をご紹介しました。Ｎ５の解は１０と出ました。 これまでのアプローチと比べてとても高速でした。
N-Queens問題：Ｎクイーン問題（４）バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
実は、この（４）の手法は、（５）の「配置フラグ」を使っています。
第二章で厳格な違いをご説明し、ソースも添付します。
現段階では、曖昧に「バックトラック」と「配置フラグ」が「ある」ということだけ覚えておいてください。

（５）では、今後、処理が複雑なり、同時に処理が高速化するに連れ、Ｎを増やして見たくなることを想定して、進捗表示テーブルを作成しました。
これにより、Ｎは４，５，６，７，８・・・と連続して処理をすることができます。
N-Queens問題：Ｎクイーン問題（６）配置フラグ
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/

（６）では、制約テスト「配置フラグ」を導入しました。ソースの可読性が高まるだけではなく、今後ご紹介する「ビットマップ」への橋渡しとして、必要なステップです。こちらは先にご説明したとおり、正しい配置フラグの説明ではありません。
きちんと「バックトラック」と「配置フラグ」の違いを第二章で明確に説明します。
N-Queens問題：Ｎクイーン問題（５）進捗表示テーブルの作成
https://suzukiiichiro.github.io/posts/2023-03-06-01-n-queens-suzuki/

（７）では、一番初めに紹介しておきながら、クイーンの位置を列挙することにとどめて、解を出すことのなかった「ブルートフォース」を改造して解を出しました。

N-Queens問題：Ｎクイーン問題（７）ブルートフォース再び
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/

なぜ、「ブルートフォース」の完成形の紹介がこれほどまでに遅くなったのか？

それは、ブルートフォースですべての可能性を列挙することは（２）で紹介したとおりですが、そこから解を導き出すための処理は（６）までのスキルが必要だからです。という説明をしました。


今回の（８）では、これまでやってきた処理を整理して一枚のソースのまとめ、シェルスクリプトでメニュー画面を作り、これまでやってきた各ステップの実行を簡単に切り替えて比較したりして動作させることができるようになります。



## メニュー画面
メニュー画面は以下のイメージで作ります。
実行するとメインメニューが表示され、行頭の番号を入力すると項目が実行されます。

```
bash-3.2$ bash N-Queens08.sh

エイト・クイーン メニュー
実行したい番号を選択
7) ブルートフォース   （７）
6) 配置フラグ         （６）
4) バックトラック     （４）
3) 縦と横の制約       （３）
2) 縦のみの制約       （２）

echo 行頭の番号を入力してください;
```

行末の全角数字は、エイトクイーンのシリーズ番号です。
プログラムは、多少手を入れましたが、これまで紹介したソースの構造をおおよそ踏襲しています。

一枚のソースで動きます。
以下のソースをファイルに保存して実行してください。
ファイル名はシリーズ番号に揃えて `N-Queens08.sh`としました。


## ソース
ソースは以下のとおりです。
```bash:N-Queens08.sh
#!/usr/bin/bash

declare -i COUNT=0;
declare -i TOTAL=0;     # カウンター
declare -i UNIQUE=0;    # ユニークユーザー
#
: 'ブルートフォース用レコードを出力';
function printRecordBF(){
  echo "$TOTAL:";
  sEcho=" ";  
  for((i=0;i<size;i++)){
    sEcho="${sEcho}${col[i]} ";
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
      #if((j==col[i]));then
      if((i==col[j]));then
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
: 'abs関数をbashで実装';
function abs_diff {
  echo $(($1 >= $2 ? $1 - $2 : $2 - $1))
}
#
: 'ブルートフォースで解を出す';
function check(){
  local -i size="$1";
  for(( i=(size-1);i>=0;i-- )){
    col[$i]=${board[i]};
    for(( j=i+1;j<size;j++ )){
      if(( col[i]<=col[j] ));then
        (( col[j]++ ));
      fi
    }
  }
  for(( i=0;i<size;i++ )){
    for(( j=i+1;j<size;j++ )){
      tmp=`abs_diff "${col[$i]}" "${col[$j]}"`;
      tm2=`abs_diff "$j" "$i"`;
      if(( tmp==tm2 ));then
        return 0;
      fi
    }
  }
  (( TOTAL++ ));
  printRecordBF;
}
#
: 'ブルートフォースで解を出す';
function N-Queens06(){
 local -i row="$1";
 local -i size="$2";
 local -i col=;
 if(( row==size ));then
   check "$size";
 else
   for(( col=0;col<(size-row);col++ )){
     board["$row"]="$col";
     N-Queens06 $((row+1)) $size ;
   }
 fi
}
#
: 'レコードを出力';
printRecord(){
  sEcho="$COUNT: ";  
  for((i=0;i<size;i++)){
  sEcho="${sEcho}${aBoard[i]} ";
  }
  echo "$sEcho";
}
#
: '配置フラグ';
function N-Queens05(){
  local -i row="$1";
  local -i size="$2";
  local -i col=;        # 再帰に必要
  local sEcho="";
  local dx="$3";        # 再帰に必要
  local rx="$4";        # 再帰に必要            
  local lx="$5";        # 再帰に必要
  for((col=0;col<size;col++)){
    dx=$col;
    rx=$((row+col));
    lx=$((row-col+(size-1)));
    if((!down[dx] 
      && !right[rx] 
      && !left[lx]));then
    aBoard[$row]="$col";
    if((row==(size-1)));then
      ((TOTAL++));
    else
      down[$dx]=1; 
      right[$rx]=1; 
      left[$lx]=1;
      N-Queens05 "$((row+1))" "$size";
      down[$dx]=0; 
      right[$rx]=0; 
      left[$lx]=0;
    fi
   fi
  }
}
#
: 'バックトラック';
function N-Queens04(){
  local -i row="$1";
  local -i size="$2";
  local -i col=;      # 再帰に必要
  local sEcho="";
  for((col=0;col<size;col++)){
    if((!down[col] 
      && !right[row+col] 
      && !left[row-col+(size-1)]));then
    aBoard[$row]="$col";
    if((row==(size-1)));then
      ((COUNT++));
      printRecord;
    else
      down[$col]=1;
      right[$row+$col]=1;
      left[$row-$col+($size-1)]=1;
      N-Queens04 "$((row+1))" "$size";
      down[$col]=0;
      right[$row+$col]=0;
      left[$row-$col+($size-1)]=0;
    fi
   fi
  }
}
#
: '横の制約を追加';
function N-Queens03(){
  local -i row="$1";
  local -i size="$2";
  local -i col=;      # 再帰に必要
  local sEcho="";
  for((col=0;col<size;col++)){
   if((!down[col]));then
    aBoard[$row]="$col";
    if((row==(size-1)));then
      ((COUNT++));
      printRecord;
    else
      down[$col]=1;
      N-Queens03 "$((row+1))" "$size";
      down[$col]=0;
    fi
   fi
  }
}
#
: '縦のみの制約';
function N-Queens02(){
  local -i row="$1";
  local -i size="$2";
  local -i col=;      # 再帰に必要
  local sEcho="";
  for((col=0;col<size;col++)){
    aBoard[$row]="$col";
    if((row==(size-1)));then
      ((COUNT++));
      printRecord;
    else
      N-Queens02 "$((row+1))" "$size";
    fi
  }
}
#
function NQ(){
  local selectName="$1";
  local -i max=15;
  local -i min=4;
  local -i N="$min";
  local startTime=0;
	local endTime=0;
	local hh=mm=ss=0; 
  echo " N:        Total       Unique        hh:mm:ss" ;
  for((N=min;N<=max;N++)){
    TOTAL=0;
    UNIQUE=0;
    startTime=$(date +%s);# 計測開始時間

    "$selectName" 0 "$N";

    endTime=$(date +%s); 	# 計測終了時間
    ss=$((endTime-startTime));# hh:mm:ss 形式に変換
    hh=$((ss/3600));
    ss=$((ss%3600));
    mm=$((ss/60));
    ss=$((ss%60));
    printf "%2d:%13d%13d%10d:%.2d:%.2d\n" $N $TOTAL $UNIQUE $hh $mm $ss ;
  } 
}

while :
do
read -n1 -p "
エイト・クイーン メニュー
実行したい番号を選択
7) ブルートフォース   （７）
6) 配置フラグ         （６）
4) バックトラック     （４）
3) 縦と横の制約       （３）
2) 縦のみの制約       （２）

echo "行頭の番号を入力してください";

" selectNo;
echo 
case "$selectNo" in
  7)
    N-Queens06 0 5;  # ブルートフォース
    break;
    ;;
  6)
    NQ "N-Queens05"; # 配置フラグ
    break;
    ;;
  4)
    N-Queens04 0 5;  # バックトラック
    break;
    ;;
  3)
    N-Queens03 0 5;  # 縦と横の制約
    break;
    ;;
  2)
    N-Queens02 0 5;  # 縦のみの制約
    break;
    ;;
  *)
    ;; 
esac
done
exit;
```

## 実行結果
実行結果は以下のとおりです。

``` 
bash-3.2$ bash N-Queens08.sh

エイト・クイーン メニュー
実行したい番号を選択
7) ブルートフォース   （７）
6) 配置フラグ         （６）
4) バックトラック     （４）
3) 縦と横の制約       （３）
2) 縦のみの制約       （２）

echo 行頭の番号を入力してください;

7
1:
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

2:
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

3:
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

4:
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

5:
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

6:
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

7:
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

8:
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

9:
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

10:
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

だんだんとソースが長くなってきましたが、プログラムらしくなってきました。この調子で少しずつ続けていっていただければと思います。

次は「第二章」となります。これまでの説明をもう少しだけ掘り下げて具体的にご説明します。
そのためにも、再帰、非再帰を併記してご説明する必要が出てきました。
お楽しみに。


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





