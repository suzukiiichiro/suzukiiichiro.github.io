---
title: "Ｎクイーン問題（６）第一章　配置フラグ"
date: 2023-03-07T16:10:45+09:00
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

![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)



## 配置フラグ
各列、対角線上にクイーンがあるかどうかのフラグを用意して高速化を図ります。
これまでもやっていたわけですが、そこの部分を「配置フラグ」と呼ぶことを覚えておいてください。

前回までは以下のように表記していました。
```bash
    for(( col=0;col<size;col++ )){
      aBoard[$row]="$col";
      if (( down[col]==0 && right[row-col+size-1]==0 && left[row+col]==0));then
        down[$col]=1;
        right[$row-$col+($size-1)]=1;
        left[$row+$col]=1;
        N-Queens05 "$((row+1))" "$size" ;
        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
    }
```
`down[]` `right[]` `down[]`変数の添字の中で毎回計算をしていますね。
ソースも見にくくなっていました。

今回は、`if`の手前で down,right,leftの添字の値をそれぞれ保存しておいて、`if`の中では計算せずに計算された値が格納されている変数を参照するだけにます。
これでもわずかばかりですが高速化が見込めます。

なにより、以降で進む「ビットマップ」への足がかりとして必要なステップなのです。
```bash
    for(( col=0;col<size;col++ )){
      aBoard[$row]="$col";
      dx=$col;
      rx=$((row-col+size-1));
      lx=$((row+col));
      if (( !down[dx] && !right[rx] && !left[lx]));then
        down[$dx]=1; right[$rx]=1; left[$lx]=1;
        N-Queens06 "$((row+1))" "$size" "$((dx))" "$((rx))" "$((lx))";
        down[$dx]=0; right[$rx]=0; left[$lx]=0;
      fi
    }
```

また、

```bash
        N-Queens06 "$((row+1))" "$size" "$((dx))" "$((rx))" "$((lx))";
```
ここで、`N-Queens06`にわたすパラメータが３つ増えていることに気が付きましたか？
まだ、さほど効果は期待できませんが、再帰で今ある値を次の再帰に渡す。というテクニックです。
いずれ、ここらへんもしっかり身につけていきましょう。
今は、深く考える必要はありません。

```bash
      if (( !down[dx] && !right[rx] && !left[lx]));then
```
Ｃ言語に慣れ親しんでいる人は数値の「０」はFalse、「１」はTrueという理解だと思います。
NOの０（ゼロ）とおぼえましょう。

で、変数は１がTrueなので、

```bash
if (( down ));then

fi
```

これは、
```bash
#  (( down )) と同じ
if (( down==1 ));then

fi
```
と同じことなのです。
ですので、
```bash
if (( !down ));then

fi
```
これは、
```bash
#  ((!down )) と同じ
if (( down==0 ));then

fi
```
と同じです。
ですので、以下の`if`文は丁寧に `==0` としていますが、ソースを簡略して書くことができます。
```bash
      if (( down[dx]==0 && right[rx]==0 && left[lx]==0));then
```
は、
```bash
      if (( !down[dx] && !right[rx] && !left[lx]));then
```

と、同じなのです、ここまでを以下のソースにまとめました
ソース全体は以下のとおりです。
```bash:N-Queens06.sh
#!/usr/bin/bash

declare -i TOTAL=0;     # カウンター
declare -i UNIQUE=0;    # ユニークユーザー
: '
エイトクイーン 配置フラグ
';
function N-Queens06(){
  local -i row="$1";
  local -i size="$2";
  local -i col=0;       # 再帰に必要
  local -i dx="$3";
  local -i rx="$4";
  local -i lx="$5";
  if (( row==size ));then
    ((TOTAL++));
    # echo -n "$COUNT:"
    # for(( i=0;i<size;i++ )){
    #   echo -n "${aBoard[i]} "
    # }
    # echo "";
  else
    for(( col=0;col<size;col++ )){
      aBoard[$row]="$col";
      dx=$col;
      rx=$((row-col+size-1));
      lx=$((row+col));
      if (( !down[dx] && !right[rx] && !left[lx]));then
        down[$dx]=1; right[$rx]=1; left[$lx]=1;
        N-Queens06 "$((row+1))" "$size" "$((dx))" "$((rx))" "$((lx))";
        down[$dx]=0; right[$rx]=0; left[$lx]=0;
      fi
    }
  fi
}
#
function NQ(){
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
    N-Queens06 0 "$N";
    endTime=$(date +%s); 	# 計測終了時間
    ss=$((endTime-startTime));# hh:mm:ss 形式に変換
    hh=$((ss/3600));
    ss=$((ss%3600));
    mm=$((ss/60));
    ss=$((ss%60));
    printf "%2d:%13d%13d%10d:%.2d:%.2d\n" $N $TOTAL $UNIQUE $hh $mm $ss ;
  } 
}
#
NQ;
```

```
bash-3.2$ bash N-Queens06.sh
 N:        Total       Unique        hh:mm:ss
 4:            2            0         0:00:00
 5:           10            0         0:00:00
 6:            4            0         0:00:00
 7:           40            0         0:00:00
 8:           92            0         0:00:01
 9:          352            0         0:00:03
10:          724            0         0:00:16
11:         2680            0         0:01:22
bash-3.2$
```



だんだん、それっぽくなってきましたね。
次もお楽しみに！

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





