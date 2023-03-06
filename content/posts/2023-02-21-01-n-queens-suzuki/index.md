---
title: "Ｎクイーン問題（４）バックトラック"
date: 2023-02-21T18:13:01+09:00
draft: false
authors: suzuki
image: shellscript.jpg
categories:
  - programming
tags:
  - エイト・クイーン
  - シェルスクリプト
  - Bash
  - アルゴリズム
  - 鈴木維一郎
---

この記事
N-Queens問題：Ｎクイーン問題（４）バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/

過去記事
N-Queens問題：Ｎクイーン問題（３）バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（２）ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（１）について
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/

エイト・クイーンのソース置き場 BashもJavaもPythonも！
https://github.com/suzukiiichiro/N-Queens


## ブルートフォース
ブルートフォースは日本語で「ちからまかせ探索」という意味になります。
すべての可能性を探索するなかで条件に見合った場合にカウントします。

N-Queens問題：Ｎクイーン問題（２）ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/

上記ブルートフォースで説明した「縦に一つのクイーンの配置」という条件の場合は、
解は数えませんでしたが、完全なブルートフォースです。
解を数える気にもならなかったということです。

ブルートフォースは、すべての可能性を列挙した上で、危機であるかどうかを判定し、効きであるばあいはループを抜けて、効きでなければクイーンを配置するという動きになります。



おさらいですが、
ブルートフォースのソースは以下の通りです。
``` bash:N-Queens01.sh
#!/usr/bin/bash

declare -i COUNT=0;     # カウンター

function N-Queen01(){
  local -i row="$1";
  local -i size="$2";
  local -i col=0;         # 再帰に必要
  if (( row==size ));then
    ((COUNT++));
    echo -n "$COUNT:"
    for(( i=0;i<size;i++ )){
      echo -n "${aBoard[i]} "
    }
    echo "";
  else
    for(( col=0;col<size;col++ )){
      aBoard[$row]="$col";
      N-Queen01 "$((row+1))" "$size" ;
    }
  fi
}
#
N-Queen01 0 5;   # 縦に一つだけのクイーンを許す
```

実行結果は以下のとおりです。
```
1:0 0 0 0 0 
2:0 0 0 0 1 
3:0 0 0 0 2 
4:0 0 0 0 3 
5:0 0 0 0 4 
6:0 0 0 1 0 
7:0 0 0 1 1 
8:0 0 0 1 2 
9:0 0 0 1 3 
10:0 0 0 1 4 
11:0 0 0 2 0 
12:0 0 0 2 1 
13:0 0 0 2 2 
14:0 0 0 2 3 
15:0 0 0 2 4 
16:0 0 0 3 0 
17:0 0 0 3 1 
18:0 0 0 3 2 
19:0 0 0 3 3 
20:0 0 0 3 4 
21:0 0 0 4 0 
22:0 0 0 4 1 
23:0 0 0 4 2 
:
:
:
3100:4 4 3 4 4 
3101:4 4 4 0 0 
3102:4 4 4 0 1 
3103:4 4 4 0 2 
3104:4 4 4 0 3 
3105:4 4 4 0 4 
3106:4 4 4 1 0 
3107:4 4 4 1 1 
3108:4 4 4 1 2 
3109:4 4 4 1 3 
3110:4 4 4 1 4 
3111:4 4 4 2 0 
3112:4 4 4 2 1 
3113:4 4 4 2 2 
3114:4 4 4 2 3 
3115:4 4 4 2 4 
3116:4 4 4 3 0 
3117:4 4 4 3 1 
3118:4 4 4 3 2 
3119:4 4 4 3 3 
3120:4 4 4 3 4 
3121:4 4 4 4 0 
3122:4 4 4 4 1 
3123:4 4 4 4 2 
3124:4 4 4 4 3 
3125:4 4 4 4 4 
```

３１２５ステップというのは、
５＊５＊５＊５＊５＝３１２５
という計算方式で求められることも説明しました。


## バックトラック準備編
N-Queens問題：Ｎクイーン問題（３）バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/

前回のバックトラック準備編で「縦と横それぞれに一つだけのクイーンの配置」という条件は、縦と横の効きを有効にすることを意味します。上記のforに以下の条件を加えるだけでした。

``` bash
    if (( down[col]==0 ));then
```

再帰部分で、downに１を代入して、第きが終了したら０に戻すという処理が独特です。
ここはいずれ分かるようになります。

```
        down[$col]=1;
        N-Queen02 "$((row+1))" "$size" ;
        down[$col]=0;
```

ソースは以下のとおりです。
``` bash:N-Queens02.sh
#!/usr/bin/bash

declare -i COUNT=0;     # カウンター

function N-Queen02(){
  local -i row="$1";
  local -i size="$2";
  local -i col=0;       # 再帰に必要
  if (( row==size ));then
    ((COUNT++));
    echo -n "$COUNT:"
    for(( i=0;i<size;i++ )){
      echo -n "${aBoard[i]} "
    }
    echo "";
  else
    for(( col=0;col<size;col++ )){
      aBoard[$row]="$col";
      if (( down[col]==0 ));then
        down[$col]=1;
        N-Queen02 "$((row+1))" "$size" ;
        down[$col]=0;
      fi
    }
  fi
}
#
N-Queen02 0 5;    # 縦と横に一つだけのクイーンを許す
```

実行結果は以下のとおりです。
```
1:0 1 2 3 4 
2:0 1 2 4 3 
3:0 1 3 2 4 
4:0 1 3 4 2 
5:0 1 4 2 3 
6:0 1 4 3 2 
7:0 2 1 3 4 
8:0 2 1 4 3 
9:0 2 3 1 4 
10:0 2 3 4 1 
11:0 2 4 1 3 
12:0 2 4 3 1 
13:0 3 1 2 4 
14:0 3 1 4 2 
15:0 3 2 1 4 
16:0 3 2 4 1 
17:0 3 4 1 2 
18:0 3 4 2 1 
19:0 4 1 2 3 
20:0 4 1 3 2 
21:0 4 2 1 3 
22:0 4 2 3 1 
23:0 4 3 1 2 
24:0 4 3 2 1 
25:1 0 2 3 4 
26:1 0 2 4 3 
27:1 0 3 2 4 
28:1 0 3 4 2 
29:1 0 4 2 3 
30:1 0 4 3 2 
31:1 2 0 3 4 
32:1 2 0 4 3 
33:1 2 3 0 4 
34:1 2 3 4 0 
35:1 2 4 0 3 
36:1 2 4 3 0 
37:1 3 0 2 4 
38:1 3 0 4 2 
39:1 3 2 0 4 
40:1 3 2 4 0 
41:1 3 4 0 2 
42:1 3 4 2 0 
43:1 4 0 2 3 
44:1 4 0 3 2 
45:1 4 2 0 3 
46:1 4 2 3 0 
47:1 4 3 0 2 
48:1 4 3 2 0 
49:2 0 1 3 4 
50:2 0 1 4 3 
51:2 0 3 1 4 
52:2 0 3 4 1 
53:2 0 4 1 3 
54:2 0 4 3 1 
55:2 1 0 3 4 
56:2 1 0 4 3 
57:2 1 3 0 4 
58:2 1 3 4 0 
59:2 1 4 0 3 
60:2 1 4 3 0 
61:2 3 0 1 4 
62:2 3 0 4 1 
63:2 3 1 0 4 
64:2 3 1 4 0 
65:2 3 4 0 1 
66:2 3 4 1 0 
67:2 4 0 1 3 
68:2 4 0 3 1 
69:2 4 1 0 3 
70:2 4 1 3 0 
71:2 4 3 0 1 
72:2 4 3 1 0 
73:3 0 1 2 4 
74:3 0 1 4 2 
75:3 0 2 1 4 
76:3 0 2 4 1 
77:3 0 4 1 2 
78:3 0 4 2 1 
79:3 1 0 2 4 
80:3 1 0 4 2 
81:3 1 2 0 4 
82:3 1 2 4 0 
83:3 1 4 0 2 
84:3 1 4 2 0 
85:3 2 0 1 4 
86:3 2 0 4 1 
87:3 2 1 0 4 
88:3 2 1 4 0 
89:3 2 4 0 1 
90:3 2 4 1 0 
91:3 4 0 1 2 
92:3 4 0 2 1 
93:3 4 1 0 2 
94:3 4 1 2 0 
95:3 4 2 0 1 
96:3 4 2 1 0 
97:4 0 1 2 3 
98:4 0 1 3 2 
99:4 0 2 1 3 
100:4 0 2 3 1 
101:4 0 3 1 2 
102:4 0 3 2 1 
103:4 1 0 2 3 
104:4 1 0 3 2 
105:4 1 2 0 3 
106:4 1 2 3 0 
107:4 1 3 0 2 
108:4 1 3 2 0 
109:4 2 0 1 3 
110:4 2 0 3 1 
111:4 2 1 0 3 
112:4 2 1 3 0 
113:4 2 3 0 1 
114:4 2 3 1 0 
115:4 3 0 1 2 
116:4 3 0 2 1 
117:4 3 1 0 2 
118:4 3 1 2 0 
119:4 3 2 0 1 
120:4 3 2 1 0 
```

## バックトラック

ブルートフォースは、すべてのパターンを出力してから、解となりうるかを判定します。
具体的に言うと、解の候補となるリストから、解となりうるかをチェックします。

`N-Queens01.sh`がブルートフォースにあたります。

Ｎが５の場合、縦だけの効きを考慮した
N-Queens01で行った、
５＊５＊５＊５＊５＝３１２５
５＾５
いわゆる　Ｎ＾Ｎですね。

こちらは、「ブルートフォース」といいます。
（実際に解の数は数えませんでしたが）


少しマシな方法として紹介した
縦と横の効きを考慮した
N-Queens02で行った ５＊４＊３＊２＊１＝１２０
は、５！
いわゆる　Ｎ！ですね。

こちらはすこし工夫しているのでバックトラックといいます。
（が、解の数は数えませんでしたね）バックトラックの手前、いわゆる準備編だと考えてください。

バックトラックは、パターンを生成し終わってからチェックを行うのではなく、途中で制約を満たさないことが明らかな場合は、 それ以降のパターン生成を行わない方法です。

では、N-Queens03はまさに「バックトラック」です。
さらにこれまでと違って「解」がでています。

バックトラックのソースは以下のとおりです。
``` bash:N-Queens03.sh
#!/usr/bin/bash

declare -i COUNT=0;     # カウンター

function N-Queen03(){
  local -i row="$1";
  local -i size="$2";
  local -i col=0;       # 再帰に必要
  if (( row==size ));then
    ((COUNT++));
    echo -n "$COUNT:"
    for(( i=0;i<size;i++ )){
      echo -n "${aBoard[i]} "
    }
    echo "";
  else
    for(( col=0;col<size;col++ )){
      aBoard[$row]="$col";
      if (( down[col]==0 
        && right[row-col+size-1]==0
        && left[row+col]==0));then
        down[$col]=1;
        right[$row-$col+($size-1)]=1;
        left[$row+$col]=1;
        N-Queen03 "$((row+1))" "$size" ;
        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
    }
  fi
}

N-Queen03 0 5;    # 縦に一つだけのクイーンを許す
```


実行結果は以下のとおりです。

```
bash-3.2$ bash N-Queens03.sh
1:0 2 4 1 3
2:0 3 1 4 2
3:1 3 0 2 4
4:1 4 2 0 3
5:2 0 3 1 4
6:2 4 1 3 0
7:3 0 2 4 1
8:3 1 4 2 0
9:4 1 3 0 2
10:4 2 0 3 1
bash-3.2$
```

前回の、縦と横の効きに対応した処理は以下の通りでした。
downを使って縦と横を判定しています。
```
      if (( down[col]==0 ));then
        down[$col]=1;
        N-Queen02 "$((row+1))" "$size" ;
        down[$col]=0;
      fi
```

今回の斜めの効きは、rightとleftを使います。
斜めを判定するために、`row`や`col`、`size`を使っていますね。
これは、じっくり考えると分かることなのですが、いまは読み飛ばしても構いません。


``` bash
      if (( down[col]==0 && right[row-col+size-1]==0 && left[row+col]==0));then
        down[$col]=1;
        right[$row-$col+($size-1)]=1;
        left[$row+$col]=1;

        N-Queen03 "$((row+1))" "$size" ;

        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
```


## Ｎを徐々に増やしていく処理に変更

では、すこし処理に手を加えて、処理結果を見やすく修正します。
まず、ソースは以下のとおりです。


``` bash:N-Queens04.sh
#!/usr/bin/bash

declare -i TOTAL=0;     # カウンター
declare -i UNIQUE=0;    # ユニークユーザー

function N-Queen03(){
  local -i row="$1";
  local -i size="$2";
  local -i col=0;       # 再帰に必要
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
      if (( down[col]==0 
        && right[row-col+size-1]==0
        && left[row+col]==0));then
        down[$col]=1;
        right[$row-$col+($size-1)]=1;
        left[$row+$col]=1;
        N-Queen03 "$((row+1))" "$size" ;
        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
    }
  fi
}
#
function N-Queen(){
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
    N-Queen03 0 "$N";
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
N-Queen 0 5;
```

実行結果は以下のとおりです。
```
bash-3.2$ bash N-Queens04.sh
 N:        Total       Unique        hh:mm:ss
 4:            2            0         0:00:00
 5:           10            0         0:00:00
 6:            4            0         0:00:00
 7:           40            0         0:00:01
 8:           92            0         0:00:00
 9:          352            0         0:00:02
10:          724            0         0:00:11
bash-3.2$
```

おー、Ｎが増えていくと解が出力されて見やすいですね。
さらに右側には処理時間も出力しています。

次回は、「制約フラグ」について説明します。
お楽しみに。





この記事
N-Queens問題：Ｎクイーン問題（４）バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
前の記事
N-Queens問題：Ｎクイーン問題（３）バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
過去の記事
N-Queens問題：Ｎクイーン問題（２）ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
N-Queens問題：Ｎクイーン問題（１）
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




