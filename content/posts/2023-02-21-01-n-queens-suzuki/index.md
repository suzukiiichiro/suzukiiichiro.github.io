---
title: "Ｎクイーン問題（４）第一章　バックトラック"
date: 2023-02-21T18:13:01+09:00
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


## これまでのあらすじ
ブルートフォースは日本語で「ちからまかせ探索」という意味になります。
すべての可能性を探索するなかで条件に見合った場合にカウントします。

以前の記事
N-Queens問題：Ｎクイーン問題（２）第一章　ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/

上記ブルートフォースで説明した「縦に一つのクイーンの配置」という条件の場合は、
解は数えませんでしたが、完全なブルートフォースです。
解を数える気にもならなかったということです。

ブルートフォースは、すべての可能性を列挙した上で、効きであるかどうかを判定し、効きであるばあいはループを抜けて、効きでなければクイーンを配置するという動きになります。


おさらいですが、以前紹介したブルートフォースのソースは以下の通りです。
```bash:N-Queens02.sh
#!/usr/bin/bash

declare -i COUNT=0;     # カウンター
: '
ブルートフォース 力まかせ探索
';
function N-Queens02(){
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
      N-Queens02 "$((row+1))" "$size" ;
    }
  fi
}
#
echo "<>１．ブルートフォース（力まかせ探索） N-Queens02()";
N-Queens02 0 5;   # 縦に一つだけのクイーンを許す
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
N-Queens問題：Ｎクイーン問題（３）第一章　バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/

前回の「バックトラック準備編」で、「縦と横それぞれに一つだけのクイーンの配置」という条件は、縦と横の効きを有効にすることを意味します。

上記のforに以下の条件を加え

```bash
    if (( down[col]==0 ));then
```

再帰部分で、downに１を代入して、再帰が終了したら０に戻すという処理を追加しました。
ここはいずれ分かるようになります。

```bash
        down[$col]=1;
        N-Queen02 "$((row+1))" "$size" ;
        down[$col]=0;
```

ソースは以下のとおりです。
```bash:N-Queens03.sh
#!/usr/bin/bash

declare -i COUNT=0;     # カウンター
: '
バックトラック準備編
';
function N-Queens03(){
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
        N-Queens03 "$((row+1))" "$size" ;
        down[$col]=0;
      fi
    }
  fi
}
#
echo "<>２．バックトラック準備編 N-Queens03()";
N-Queens03 0 5;    # 縦と横に一つだけのクイーンを許す
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

１２０ステップというのは、
５＊４＊３＊２＊１＝１２０
という計算方式で求められます。
上記を「５！」と表記します。
いわゆる　Ｎ！ですね。


## バックトラック
ブルートフォースは、すべてのパターンを出力してから、解となりうるかを判定します。
具体的に言うと、解の候補となるリストから、解となりうるかをチェックします。

`N-Queens02.sh`がブルートフォースにあたります。

Ｎが５の場合、
５＊５＊５＊５＊５＝３１２５
５＾５
いわゆる　Ｎ＾Ｎですね。

（実際に解の数は数えませんでしたが）

前回記事では、ブルートフォースよりも少しマシな方法として
縦と横の効きを考慮した手法を紹介しました。

前回の`N-Queens03.sh`で行った 
５＊４＊３＊２＊１＝１２０
は、５！
いわゆる　Ｎ！ですね。


バックトラックは Ｎ！です。

バックトラックは日本語では「総当り法」と言われています
（しつこいようですが、解の数までは数えませんでした）
`N-Queens03.sh` はバックトラックの手前、いわゆる準備編だと考えてください。

バックトラックは、パターンを生成し終わってからチェックを行うのではなく、途中で制約を満たさないことが明らかな場合は、 それ以降のパターン生成を行わない方法です。

今回ご紹介する、`N-Queens04.sh` はまさに「バックトラック」です。
さらにこれまでと違って「解」がでています。

完全なブルートフォースである `N-Queens02.sh` はステップ数が３１２５でした。
また、縦と横の効きを考慮した `N-Queens03.sh` はステップ数が１２０でした。
ステップ数が小さければそれだけ処理が高速であることを示します。

前回の、縦と横の効きに対応した処理部分は以下の通りです。
downを使って縦と横を判定しています。
```bash
      if (( down[col]==0 ));then
        down[$col]=1;
        N-Queen02 "$((row+1))" "$size" ;
        down[$col]=0;
      fi
```

今回の`N-Queens04.sh`は、斜めの効きを加えるため、rightとleftを使います。
さらに斜めを判定するために、`row`や`col`、`size` の値を使っています。
`down` に加えて `right` と `left` が加わっているのが見て取れると思います。
じっくり考えると分かることなのですが、今は読み飛ばして頂いても構いません。

```bash
      if (( down[col]==0 && right[row-col+size-1]==0 && left[row+col]==0));then
        down[$col]=1;
        right[$row-$col+($size-1)]=1;
        left[$row+$col]=1;

        N-Queen04 "$((row+1))" "$size" ;

        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
```

ではソースを見てみましょう。
バックトラックのソースは以下のとおりです。
```bash:N-Queens04.sh
#!/usr/bin/bash

declare -i COUNT=0;     # カウンター
: '
エイトクイーン　バックトラック
';
function N-Queens04(){
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
        N-Queens04 "$((row+1))" "$size" ;
        down[$col]=0;
        right[$row-$col+($size-1)]=0;
        left[$row+$col]=0;
      fi
    }
  fi
}
echo "<>４．バックトラック N-Queens04()";
N-Queens04 0 5;
```


実行結果は以下のとおりです。

```
bash-3.2$ bash N-Queens04.sh
<>４．バックトラック N-Queens04()
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

次回は、Ｎ５だけでなく、Ｎが一つ一つ増えていき処理が進み進捗する経過が見える「進捗表示テーブル」の作成を紹介します。

お楽しみに！


## 参考リンク
以下の詳細説明を参考にしてください。
[【参考リンク】Ｎクイーン問題 過去記事一覧](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)
[【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！](https://github.com/suzukiiichiro/N-Queens)

Ｎクイーン問題（５０）第七章 マルチプロセス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-04-n-queens-suzuki/
Ｎクイーン問題（４９）第七章 マルチスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-03-n-queens-suzuki/
Ｎクイーン問題（４８）第七章 シングルスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-02-n-queens-suzuki/
Ｎクイーン問題（４７）第七章 クラス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-01-n-queens-suzuki/
Ｎクイーン問題（４６）第七章 ステップＮの実装 Python編
https://suzukiiichiro.github.io/posts/2023-06-16-02-n-queens-suzuki/
Ｎクイーン問題（４５）第七章 キャリーチェーン Python編
https://suzukiiichiro.github.io/posts/2023-06-16-01-n-queens-suzuki/
Ｎクイーン問題（４４）第七章　対象解除法 Python編
https://suzukiiichiro.github.io/posts/2023-06-14-02-n-queens-suzuki/
Ｎクイーン問題（４３）第七章　ミラー Python編
https://suzukiiichiro.github.io/posts/2023-06-14-01-n-queens-suzuki/
Ｎクイーン問題（４２）第七章　ビットマップ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-05-n-queens-suzuki/
Ｎクイーン問題（４１）第七章　配置フラグ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-04-n-queens-suzuki/
Ｎクイーン問題（４０）第七章　バックトラック Python編
https://suzukiiichiro.github.io/posts/2023-06-13-03-n-queens-suzuki/
Ｎクイーン問題（３９）第七章　バックトラック準備編 Python編
https://suzukiiichiro.github.io/posts/2023-06-13-02-n-queens-suzuki/
Ｎクイーン問題（３８）第七章　ブルートフォース Python編
https://suzukiiichiro.github.io/posts/2023-06-13-01-n-queens-suzuki/
Ｎクイーン問題（３７）第六章 C言語移植 その１７ pthread並列処理完成
https://suzukiiichiro.github.io/posts/2023-05-30-17-n-queens-suzuki/
Ｎクイーン問題（３６）第六章 C言語移植 その１６ pthreadの実装
https://suzukiiichiro.github.io/posts/2023-05-30-16-n-queens-suzuki/
Ｎクイーン問題（３５）第六章 C言語移植 その１５ pthread実装直前版完成
https://suzukiiichiro.github.io/posts/2023-05-30-15-n-queens-suzuki/
Ｎクイーン問題（３４）第六章 C言語移植 その１４
https://suzukiiichiro.github.io/posts/2023-05-30-14-n-queens-suzuki/
Ｎクイーン問題（３３）第六章 C言語移植 その１３
https://suzukiiichiro.github.io/posts/2023-05-30-13-n-queens-suzuki/
Ｎクイーン問題（３２）第六章 C言語移植 その１２
https://suzukiiichiro.github.io/posts/2023-05-30-12-n-queens-suzuki/
Ｎクイーン問題（３１）第六章 C言語移植 その１１
https://suzukiiichiro.github.io/posts/2023-05-30-11-n-queens-suzuki/
Ｎクイーン問題（３０）第六章 C言語移植 その１０
https://suzukiiichiro.github.io/posts/2023-05-30-10-n-queens-suzuki/
Ｎクイーン問題（２９）第六章 C言語移植 その９
https://suzukiiichiro.github.io/posts/2023-05-30-09-n-queens-suzuki/
Ｎクイーン問題（２８）第六章 C言語移植 その８
https://suzukiiichiro.github.io/posts/2023-05-30-08-n-queens-suzuki/
Ｎクイーン問題（２７）第六章 C言語移植 その７
https://suzukiiichiro.github.io/posts/2023-05-30-07-n-queens-suzuki/
Ｎクイーン問題（２６）第六章 C言語移植 その６
https://suzukiiichiro.github.io/posts/2023-05-30-06-n-queens-suzuki/
Ｎクイーン問題（２５）第六章 C言語移植 その５
https://suzukiiichiro.github.io/posts/2023-05-30-05-n-queens-suzuki/
Ｎクイーン問題（２４）第六章 C言語移植 その４
https://suzukiiichiro.github.io/posts/2023-05-30-04-n-queens-suzuki/
Ｎクイーン問題（２３）第六章 C言語移植 その３
https://suzukiiichiro.github.io/posts/2023-05-30-03-n-queens-suzuki/
Ｎクイーン問題（２２）第六章 C言語移植 その２
https://suzukiiichiro.github.io/posts/2023-05-30-02-n-queens-suzuki/
Ｎクイーン問題（２１）第六章 C言語移植 その１
N-Queens問://suzukiiichiro.github.io/posts/2023-05-30-01-n-queens-suzuki/
Ｎクイーン問題（２０）第五章 並列処理
https://suzukiiichiro.github.io/posts/2023-05-23-02-n-queens-suzuki/
Ｎクイーン問題（１９）第五章 キャリーチェーン
https://suzukiiichiro.github.io/posts/2023-05-23-01-n-queens-suzuki/
Ｎクイーン問題（１８）第四章 エイト・クイーンノスタルジー
https://suzukiiichiro.github.io/posts/2023-04-25-01-n-queens-suzuki/
Ｎクイーン問題（１７）第四章　偉人のソースを読む「Ｎ２４を発見 Ｊｅｆｆ Ｓｏｍｅｒｓ」
https://suzukiiichiro.github.io/posts/2023-04-21-01-n-queens-suzuki/
Ｎクイーン問題（１６）第三章　対象解除法 ソース解説
https://suzukiiichiro.github.io/posts/2023-04-18-01-n-queens-suzuki/
Ｎクイーン問題（１５）第三章　対象解除法 ロジック解説
https://suzukiiichiro.github.io/posts/2023-04-13-02-nqueens-suzuki/
Ｎクイーン問題（１４）第三章　ミラー
https://suzukiiichiro.github.io/posts/2023-04-13-01-nqueens-suzuki/
Ｎクイーン問題（１３）第三章　ビットマップ
https://suzukiiichiro.github.io/posts/2023-04-05-01-nqueens-suzuki/
Ｎクイーン問題（１２）第二章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-17-02-n-queens-suzuki/
Ｎクイーン問題（１１）第二章　配置フラグの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-17-01-n-queens-suzuki/
Ｎクイーン問題（１０）第二章　バックトラックの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-16-01-n-queens-suzuki/
Ｎクイーン問題（９）第二章　ブルートフォースの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-14-01-n-queens-suzuki/
Ｎクイーン問題（８）第一章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-09-01-n-queens-suzuki/
Ｎクイーン問題（７）第一章　ブルートフォース再び
https://suzukiiichiro.github.io/posts/2023-03-08-01-n-queens-suzuki/
Ｎクイーン問題（６）第一章　配置フラグ
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/
Ｎクイーン問題（５）第一章　進捗表示テーブルの作成
https://suzukiiichiro.github.io/posts/2023-03-06-01-n-queens-suzuki/
Ｎクイーン問題（４）第一章　バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
Ｎクイーン問題（３）第一章　バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
Ｎクイーン問題（２）第一章　ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/







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




