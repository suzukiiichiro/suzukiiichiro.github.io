---
title: "Ｎクイーン問題（５６）第八章 ビットマップ C言語編"
date: 2023-06-28T13:12:58+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - Ｃ言語
  - アルゴリズム
  - 鈴木維一郎
---

![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)
[エイト・クイーンのソース置き場 BashもJavaもPythonも！](https://github.com/suzukiiichiro/N-Queens)


## ビットマップ
Ｎ×ＮのチェスボードのＮ個のクイーンの配置を、bitwise(ビット)で表したものが`bitmap`(ビットマップ)です。

## ビットマップの特徴
斜め方向にクイーンを配置したかどうかを、`left` `down` `right` といった `bit` フラグで表します。

大きなメリットは、
１．ビットマップであれば、シフト(`<<1` ,`>>1`)により高速にデータを移動できる。
２．配置フラグといったフラグ配列では、データの移動に O(N) の時間がかかるが、ビットマップであれば O(1)ですむ。
３．フラグ配列のように斜め方向に `2*N-1` の要素を用意する必要はなく `Nビット`で充分たりる。
４．ビットは初期値が０なので扱いやすい

デメリットとしては
２進数と１０進数により難読化が極まっている。

## ビットマップを言葉で説明すると・・・
４ｘ４のチェス盤を使ってみましょう。
チェス盤の各行は1つの2進数で表されますが、これは単なるビットの並びです。
ある行の一番左のマスにクイーンが置かれた場合、その行は8という数字で表されます。

```
+-+-+-+-+
|Q| | | |   1000
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```

この列の一番左には1があるので、2進数では1000となります。
左から3番目のマスにクイーンが置かれた場合、その列は2、つまり0010で表されます。

```
+-+-+-+-+
| | |Q| |   0010
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```

```
1: 0001
+-+-+-+-+
| | | |Q| 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+

2: 0010
+-+-+-+-+
| | |Q| | 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+

4: 0100
+-+-+-+-+
| |Q| | | 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+

8: 1000
+-+-+-+-+
|Q| | | | 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```

1、2、4、8以外の数字は、
```
9→1001
+-+-+-+-+
|Q| | |Q| 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```

```
15→1111
+-+-+-+-+
|Q|Q|Q|Q| 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```

のように、2つ以上のマスの占有を表すのに使うことができます。

コンフリクトの列が5(0101)の場合、左から1番目と3番目のマスが、他のクイーンとぶつからない唯一の空きマスであることを示し、この2マスに次のクイーンを配置することになります。

```
5→0101
+-+-+-+-+
| |Q| |Q| 
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```


## 実践、ビットマップ！
Ｎ５のボードレイアウト
```
 4 2 0 3 1  ↓ bitmapで表現
+-+-+-+-+-+
| | | | |O| 00001
+-+-+-+-+-+
| | |O| | | 00100
+-+-+-+-+-+
|O| | | | | 10000
+-+-+-+-+-+
| | | |O| | 00010
+-+-+-+-+-+
| |O| | | | 01000
+-+-+-+-+-+
```

各行(row)の状態をbitwise（ビットワイズ）で表現します。
クイーンが置いてある位置の`bit`（ビット）をON（１）にします。

バックトラッキングは行(row=0)から下に向かって順に、クイーンが配置できた場所の`bit`をON（１）にして、その後rowが一つインクリメントします。

```
 4         ↓ bitmapで表現
+-+-+-+-+-+
| | | | |O| 00001
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
```


```
 4 2       ↓ bitmapで表現
+-+-+-+-+-+
| | | | |O| 00001
+-+-+-+-+-+
| | |O| | | 00100
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
```

```
 4 2 0     ↓ bitmapで表現
+-+-+-+-+-+
| | | | |O| 00001
+-+-+-+-+-+
| | |O| | | 00100
+-+-+-+-+-+
|O| | | | | 10000
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
```

```
 4 2 0 3   ↓ bitmapで表現
+-+-+-+-+-+
| | | | |O| 00001
+-+-+-+-+-+
| | |O| | | 00100
+-+-+-+-+-+
|O| | | | | 10000
+-+-+-+-+-+
| | | |O| | 00010
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
```

```
 4 2 0 3 1  ↓ bitmapで表現
+-+-+-+-+-+
| | | | |O| 00001
+-+-+-+-+-+
| | |O| | | 00100
+-+-+-+-+-+
|O| | | | | 10000
+-+-+-+-+-+
| | | |O| | 00010
+-+-+-+-+-+
| |O| | | | 01000
+-+-+-+-+-+
```



## 効き筋
次に、効き筋をチェックするためにさらに３つのビットフィールドを用意します。

```
left
+-+-+-+-+-+
| | | |Q| |
+-+-+-+-+-+
| | |L| | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```

```
down
+-+-+-+-+-+
| | | |Q| |
+-+-+-+-+-+
| | | |D| |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```

```
right
+-+-+-+-+-+
| | | |Q| |
+-+-+-+-+-+
| | | | |R|
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```

左下に効き筋が進む(left)、真下に効き筋が進む(down)、右下に効き筋が進む(right)３つです。
その３つのビットフィールドをそれぞれ、left, down, right と呼ぶことにします。

まずは `row0` にクイーンを配置します。

```
Qの配置
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```

次に、`row0` のビットフィールドから `row+1` 番目のビットフィールド、ようするにひとつ下の `row1` に探索を進め、

```
Qの配置
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
| | | | | | ←ここ
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```

`row0`のビットフィールドでクイーンが配置されている `bit` と、
```
Qの配置
+-+-+-+-+-+
| | | |Q| | 00010 = bit
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```



３つのビット `left` `down` `right` を使って、効き筋をチェックします。

効き筋は「ＯＲ演算」を使います。

ビット演算に関しては以下のリンクがおすすめです。
[ビット演算入門](https://qiita.com/Ingward/items/43acda931c8a62c70d2f)



leftはひとつ左に
```
left
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
| | |L| | | 00100
+-+-+-+-+-+
```

downはそのまま下に、
```
down
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
| | | |D| | 00010
+-+-+-+-+-+
```

rightはひとつ右へ
```
right
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
| | | | |R| 00001
+-+-+-+-+-+
```

こういったロジックで `row+1` 番目の効き筋をチェックします。



## bit（ビット）
クイーンの位置は「Q」です。
Qを配置した場合、そのposition（場所）は`bit`で表します。
`bit`（ビット）には、クイーンが配置されるとその位置が格納されるわけです。

以下の場合、`bit`は `00010` となります。

`row0`にQが配置された
```
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
```

ここで`bit`の操作が複雑となる原因のひとつ、
「00010」というクイーンの位置情報は、そのまま`bit`に格納されるのではありません。

`bit`には`00010` という場所の情報が格納されるわけですが、

「00001」の場合は「 1」
「00010」の場合は「 2」
「00100」の場合は「 4」
「01000」の場合は「 8」
「10000」の場合は「16」

が格納されることになります。

「はぁ？」

まず、
「00001」という並びは０と１でなりたつ表現方法で「２進数」といいます。
また、１０で桁上りをする表現方法はおなじみの「１０進数」といいます。

```
00010   　２進数
    2   １０進数 (00010を１０進数にすると 2 になる）
```



２進数を１０進数に置き換える早見表
```
10進数  128  64  32  16   8   4   2   1
 2進数    0   0   0   0   0   0   0   0
```

２進数 `00010` を１０進数に置き換えた値が知りたいは、早見表を使うと１０進数では `4` となります。

```
２進数を１０進数に置き換える早見表
10進数  16   8   4   2   1
 2進数   0   0   1   0   0
```

ということで、クイーンの位置が `00100` の場合は、`4` が `bit`に格納されます。

bashでは２進数を１０進数に変換して出力する方法が用意されています。
```
bash-3.2$ echo $(( 2#00001 ))
1
bash-3.2$ echo $(( 2#00010 ))
2
bash-3.2$ echo $(( 2#00100 ))
4
bash-3.2$ echo $(( 2#01000 ))
8
bash-3.2$ echo $(( 2#10000 ))
16
bash-3.2$
```

＃（シャープ）の前の数字は２進数であることを示しています。
２進数 `00100` の１０進数の値が知りたければ、次のようにします。
```
bash-3.2$ echo $(( 2#00100 ))
4
```


余談ですが（余談ということでもないのですが）、
Ｎが８の場合で、`00010000` というクイーン配置の場合
```
10進数  128  64  32  16   8   4   2   1
 2進数    0   0   0   1   0   0   0   0
```

早見表の通り、１０進数では「16」となります。
当然、bashでも求めることができます。
```
bash-3.2$ echo $(( 2#00010000 ))
16
```

さらに余談ですが（これは本当に余談）、ビットフィールドに複数の`bit`がON（１）である場合、例えば「00101010」のような場合は、以下のように計算します。
（（一行にクイーンが３つもある！！）

```
00101010 
10進数  128  64  32  16   8   4   2   1
 2進数    0   0   1   0   1   0   1   0
```

この場合は、`bit`が立っている（と言います）10進数の値をを足し合わせることで表現できます。

ビットが立っている（１となっている）のは、３２と８と２ですから、
```
32 + 8 + 2 = 42
```
となります。

bashでも確認してみます。
```
bash-3.2$ echo $(( 2#00101010 ))
42
```

おお、いい感じですね。着いてきていますか？



## Qの位置を確認
では、まずはQのposition（位置）を確認します。

```
Q
+-+-+-+-+-+
| | | |Q| | 00010=bit といいます。
+-+-+-+-+-+
| | | | | | 
+-+-+-+-+-+
```

Qのpositionは `00010` です。
１０進数では以下の早見表で見つけると良いです。

Qが置かれている`bit`の値は「00010」です
```
10進数  16   8   4   2   1
 2進数   0   0   0   1   0
```

10進数では「2」ですね。

まず、Qのpositionがわかりました。
Qのpositionを`bit`と言います。
通常、`bit`は変数名も`bit`とします。
```
bit = Q = 2#00010 = 2
```


## row + 1 のleftの効き筋をチェック）してみます

```
left
+-+-+-+-+-+
| | | |Q| | 00010 (`bit`)
+-+-+-+-+-+
| | |L| | | ←ここ
+-+-+-+-+-+
```

「L」は「Q」の真下（`row+1`）を左に一つずらした位置となります。
ビット演算では以下のようになります。Lはleftを表しています。
```
( left | bit)<<1
```

`( left | bit)` といった表現を「ＯＲ演算」と言います。

`left` にはこの段階では値が何も入っていませんので「0」となります。
要するに初期値「０」のまま計算します。

前項で求めたとおり、Qである`bit`は以下の通りでした。
```
bit = Q = 2#00010 = 2
```

`left`は、初期値「０」な訳ですから、
```
( left | bit )
(   0  |  2  )
```

という計算式になります。
bashで計算してみましょう。
```
bash-3.2$ echo $(( (2|0) ))
2
bash-3.2$
```

「２」とでました。
さらに左に一つシフト（<<1）してみます。
こうなりますね。
```
( left | bit )<<1
(   0  |  2  )<<1
```

bashで計算してみます。
```
bash-3.2$ echo $(( (2|0)<<1 ))
4
bash-3.2$
```

「４」とでました。
「４」の２進数はなんでしょう？
さっそく早見表で確認しましょう。
```
10進数  16   8   4   2   1
 2進数   0   0   1   0   0
```

`00100` という事ですね。

Qが置かれている場所が「00010」で、
Lは「00100」となったわけです。
図で表すと以下のとおりです。

```
left
+-+-+-+-+-+
| | | |Q| | 00010 (bit)
+-+-+-+-+-+
| | |L| | | 00100 (left|bit)<<1
+-+-+-+-+-+
```

ということで、Qの位置から左に一つずれているのがわかります。
Qを配置して`left`を使って左下の効きを簡単に求めることができました。
```
left  = ( left |  bit  )<<1
00100 = (  0   | 00010 )<<1
  4   = (  0   |   2   )<<1
```

`row0`にある Q の位置「00010」の、ひとつ下の `row1` の`left`の効き筋は `(left|bit)<<1` という計算式を用いて、「00100」となりました。
言い換えると、Qの位置を`bit`にして、`(left|bit)<<1`とすることで、ビットの位置を一つ左にシフトして、Qの`left`の効き筋を求めることができたということになります。


## row + 1 のdownの効き筋をチェック）してみます
leftの場合は、( left | bit )<<1 ということをしてQの位置から左に一つずらした位置を求めました。

downはleftのように左に一つずらしたりする必要はありません。
Qの位置からましたに下ろすだけですから値は同じなのです。
```
down
+-+-+-+-+-+
| | | |Q| | 00010
+-+-+-+-+-+
| | | |D| | 00010 (down|bit)
+-+-+-+-+-+
```

```
down  = ( down |  bit  )
00010 = (  0   | 00010 )
  2   = (  0   |   2   )
```

bashでも確認してみます。
``` 
bash-3.2$ echo $(( (0|2) ))
2
bash-3.2$
```

down は 2#00010 ですので 2 です。


ここまでをまとめると以下のとおりです。
```
bit = Q = 2#00010 = 2
10進数  16   8   4   2   1
 2進数   0   0   0   1   0

left = (left|bit)<<1 = 2#00100 = 4
10進数  16   8   4   2   1
 2進数   0   0   1   0   0

down = (down|bit)    = 2#00010 = 2
10進数  16   8   4   2   1
 2進数   0   0   0   1   0
```

## row + 1 のrightの効き筋をチェック
rightはleft同様にシフトするわけですが、今度は右へシフトします。

```
right
+-+-+-+-+-+
| | | |Q| | 00010 (bit)
+-+-+-+-+-+
| | | | |R| 00001 (R)  (right|bit)>>1
+-+-+-+-+-+
```

```
right = ( right |  bit  )>>1
00010 = (   0   | 00010 )>>1
  1   = (   0   |   2   )>>1
```

bashでも確認してみます。
```
bash-3.2$ echo $(( (0|2)>>1 ))
1
bash-3.2$
```

ここまでをまとめると以下のとおりです。
```
bit = Q = 2#00010 = 2
10進数  16   8   4   2   1
 2進数   0   0   0   1   0

left = (left|bit)<<1 = 2#00100 = 4
10進数  16   8   4   2   1
 2進数   0   0   1   0   0

down = (down|bit)    = 2#00010 = 2
10進数  16   8   4   2   1
 2進数   0   0   0   1   0

right =(right|bit)>>1= 2#00001 = 1
10進数  16   8   4   2   1
 2進数   0   0   0   0   1
```



## マスクビット
ビットの使い方として最も多いものの 1 つがマスクビットです。なじみの深いもので言えば、IPアドレスのマスクビットや割り込み制御のマスクビットなどが挙げられます。多種多様な場面で使用されるマスクビットですが、基本的なアイディアは共通で、

・複数のフラグをまとめて立てる
・複数のフラグをまとめて消す
・必要な情報だけを取り出すために、マスクした部分の情報のみを取り出す
  といったものを効率良く実現するものです。
  現在のフラグ状態を表すビットを bit として、マスクビットを mask としたとき

|概要|実装|
|:-|:-|
|mask で表された部分のフラグをまとめて立てる|	bit ｜= mask |
|mask で表された部分のフラグをまとめて消す|	bit &= ~mask |
|mask で表された部分の情報のみを取り出したもの|	bit & mask|
|mask で表された部分のどれかのフラグが立っているかどうか|	if (bit & mask)|
|mask で表された部分のすべてのフラグが立っているかどうか|	if ((bit & mask) == mask)|



## mask（マスク） 
ここまでで３つのフラグを用いてQの効き筋を求めてきました。
```
left+down+right
+-+-+-+-+-+
| | | |Q| | 00010 (bit)
+-+-+-+-+-+
| | |L|D|R| 00111 (left|down|right)
+-+-+-+-+-+
```

３箇所の効き筋を演算子を使うと
```
(left|down|right) 
```
となり、こうした表現を「ＯＲ演算」と言います。



さて、`row + 1` 番目のビットフィールドを探索して、`left` `down` `right` の３つのbitフラグを「ＯＲ演算」したビットフィールドを作りました。

ＯＮ（１）になっている位置は効き筋に当たるので置くことができません。

`row`にQを配置して、
```
+-+-+-+-+-+  row
| | | |Q| |   0  今、自分はここにいて
+-+-+-+-+-+
| | | | | |   1
+-+-+-+-+-+
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

自分がいる `row` の一つしたの「row+1」のビットフィールドを探索するために、

```
+-+-+-+-+-+  row
| | | |Q| |   0  
+-+-+-+-+-+
|*|*|*|*|*|   1  この行(row)を順番に探索する
+-+-+-+-+-+
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

`left` `down` `right` の３つのフラグを使って、効きををチェックします。

`left` `down` `right` のいずれかがＯＮ（１）になっていたら効き筋に当たるから、その場所にはクイーンは配置できませんね。
という意味になります。

```
+-+-+-+-+-+  row
| | | |Q| |   0  bit  =      Q        = 2#00010 = 2
+-+-+-+-+-+      left = (left|bit)<<1 = 2#00100 = 4
|*|*|L|D|R|   1  down = (down|bit)    = 2#00010 = 2
+-+-+-+-+-+      right= (right|bit)>>1= 2#00001 = 1
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

そこで、上記の図の２箇所（アスタリスク＊の場所）がクイーンを配置することがが可能です。
この２箇所のアスタリスクは場所を簡単に得ることができます。

以下の通り、`left` は4 `down` は2 `right` は1 です。
```
bit  =      Q        = 2#00010 = 2

left = (left|bit)<<1 = 2#00100 = 4
down = (down|bit)    = 2#00010 = 2
right= (right|bit)>>1= 2#00001 = 1
```

効き筋 `(left|down|right)` は、次のように求めることができます。
``` 
(4|2|1)
```

と、なります。
bashで確認すると以下のとおりです。
```
bash-3.2$ echo $(( (4|2|1) ))
7
bash-3.2$
```

「７」となりました。これを２進数で表すと
```
bash-3.2$ bc <<<"ibase10;obase=2;7"
111
bash-3.2$
```

「１１１」ですから５ビットにすると
`2#00111` となります。

そこで、以下のアスタリスクの部分を求めるには「反転」という演算をおこないます。
```
+-+-+-+-+-+  row
| | | |Q| |   0  bit  =      Q        = 2#00010 = 2
+-+-+-+-+-+      left = (left|bit)<<1 = 2#00100 = 4
|*|*|L|D|R|   1  down = (down|bit)    = 2#00010 = 2
+-+-+-+-+-+      right= (right|bit)>>1= 2#00001 = 1
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

ここで、`2#11000`を求めることができれば、それがクイーンを配置することができる場所ということになります。

`2#11000` をbashで求めると`24`になります。
```
bash-3.2$ echo $(( 2#11000 ))
24
bash-3.2$
```

演算で求める場合は、「反転」という演算を使います。
(L|D|R) の 反転はチルダ「〜」を使います。
```c
~(L|D|R)
```

では、先に求めた「２４」になるかを確認してみましょう。

```
bash-3.2$ echo $(( (4|2|1) ))
7
bash-3.2$ echo $(( ~(4|2|1) ))
-8
bash-3.2$ 
```
なりませんね。。。

ここでmask(マスク）を使います。
maskとは、ビットフィールドのビットをすべて立てたものです。

```
+-+-+-+-+-+  row
| | | |Q| |   0  
+-+-+-+-+-+      
|M|M|M|M|M|   1  mask=2#11111
+-+-+-+-+-+      
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

このmaskは簡単に求めることができます。

```c
mask=(1<<size)-1;
```

Ｎ５の場合、２進数で求めると「３１」になります。
```
bash-3.2$ echo $(( 2#11111 ))
31
```

`mask`は、size=5 `( 1<<size )-1` という計算式で求めることができます。
```
bash-3.2$ echo $(( (1<<5)-1 ))
31
```

このmaskを使って
１．`left` `down` `right`の３つのビットを使って効きの場所を特定
```
(left|down|right)

+-+-+-+-+-+  row
| | | |Q| |   0  
+-+-+-+-+-+      
| | |L|D|R|   1  2#00111
+-+-+-+-+-+      
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

２．反転させる 
```
# 2#00111
~(left|down|right) = -8
# 2#11000
```

２．maskですべての配置箇所のビットをＯＮ（１）にする
```
maskを使ってすべてのビットを立てる

size=5;
mask=$(( (1<<size)-1 ));
+-+-+-+-+-+  row
| | | |Q| |   0  
+-+-+-+-+-+      
|M|M|M|M|M|   1  2#11111 = 31
+-+-+-+-+-+      
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+
```

３．maskから~(left|down|right)を間引いた値を`bitmap`に格納
```
# クイーンが配置可能な位置を表す
bitmap=$(( mask&~(left|down|right) ))
+-+-+-+-+-+  row
| | | |Q| |   0  
+-+-+-+-+-+      
|1|1|0|0|0|   1  2#11000 = 24
+-+-+-+-+-+      
| | | | | |   2
+-+-+-+-+-+
| | | | | |   3
+-+-+-+-+-+
| | | | | |   4
+-+-+-+-+-+

 (left|down|right)  2#00111
~(left|down|right)  2#11000
mask                2#11111
----------------------------
AND                 2#11000  24 bitmap
```

おおお、２４になりました。
`bitmap`には２４が格納されるわけです。

これで効きのない場所を特定することができました。

１がクイーンを配置できる場所、いわゆる効き筋に当たらない場所ということになります。

あとは、効き筋に当たらない場所を順番にQを置いて行けばよいということになります。

順番にひとつひとつつまみ出して行く方法は後述します。


ここまでの処理をbashで書くと以下の通りになります。
```bash:masktest.sh
#!/usr/bin/bash

mask=31; # 2#11111
left=4;  # 2#00100
down=2;  # 2#00010
right=1; # 2#00001

# (left|down|right)を反転させてmaskで間引く
# クイーンが配置可能な位置を表す
bitmap=$(( mask&~(left|down|right) ))
echo "$bitmap"  # 24

# 間引いた１０進数を２進数にして確認
bc<<<"ibase=10;obase=2;$bitmap"
# 11000
```

実行結果は以下のとおりです。
```
bash-3.2$ bash masktest.sh
11000
```


## ビットマップで肝となるところを重点的に

```c
// クイーンが配置可能な位置を表す
bitmap=mask&~(left|down|right);

// 一番右のビットを取り出す
bit=bitmap&-bitmap;

// 配置可能なパターンが一つずつ取り出される
bitmap=bitmap&~bit;       

// Qを配置
board[row]=bit;

// 再帰
bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);
```

普通に書くとこうなります。
```c
  mask=(1<<size)-1;
  bitmap=mask&~(left|down|right);
  while(bitmap){
    bit=bitmap&-bitmap;// 一番右のビットを取り出す
    bitmap=bitmap&~bit;// 配置可能なパターンが一つずつ取り出される
    board[row]=bit;// Qを配置
    bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);// 再帰
  }
```

forで一行にまとめることができます。これは非常にトリッキーです。
```c
  for(unsigned int bitmap=mask&~(left|down|right);bitmap;bitmap=bitmap&~bit){
    bit=bitmap&-bitmap;
    board[row]=bit;
    bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);
  }
```


### bitmap=mask&~(left|down|right)
クイーンが配置可能な位置を表す


### bit=-bitmap & -bitmap
while中の各繰り返しで、`bit` に、配置できる可能性と配置できない可能性をAND演算した結果を`bit`にセットしています。この結果、`bit` は、`bitmap` の最下位ビットを除いて、すべて`0`に設定し、Qを配置します。
もう少し噛み砕いて説明すると、単に最初の非ゼロビット（つまり最初に利用できる場所である１）を `bit` という変数に格納するだけです。
その `bit` （ビットが0010なら3列目）は、次のクイーンを置く場所となります。
つまり、bitmapの列を0にすることで、現在の位置が「取られた」ことを示すだけです。
こうすることで、whileループ中で、「取られた」場所を再度試す必要がなくなるということになります。


### bitmap=bitmap&~bit
配置可能なパターンが一つずつ取り出され、`bitmap` の最下位ビットを開放、次のループに備え、新しい最下位ビットを探索、再帰的な呼び出しを行い、次の行のビットフィールドである`bitmap` を更新します。
`bit` には、Qの場所を表す`1` が1つだけ入ったビットフィールが格納されています。
渡された競合情報と`OR演算` することで、再帰呼び出しの競合候補として追加されます。


### board[row]=bit
要するにQを配置するわけです。


### bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);
ソースの中も最も混乱する行だと思います。
演算子 `>>1` と `1<<` は、ビットフィールド列すべてのビットをそれぞれ右、または左に1桁移動させるだけです。

つまり、`(left|bit)<<1` を呼ぶと、「leftとbitをOR演算で結合し、結果のすべてを1桁左に移動させる」という意味になります。

具体的には、`left` が `0001` （現在の行の4列目を通る右上から左下までの対角線が占有されていることを意味する）、`bit` が `0100`（現在の行の2列目にクイーンを置く予定であることを意味する）の場合、`(left|bit)` の結果は `0101` （現在の行の2列目にクイーンを置いた後、右上から左下までの対角線2本目と4本目が占有されることになります）。

ここで、`<<` 演算子を加えると、`(left|bit)<<1` となり、前の箇条書きで計算した `0101` を、すべて左に1つずつ移動させます。したがって、結果は `1010` となります。

さて、ここからが本当に難しいところなのですが、`bitmap_R` を再度呼び出す前に、なぜ1桁ずつ移動させるのでしょうか。

`row` が一番上の行から始まり、下に移動する場合、新しい行に移動するたびに、「占有対角線」のトラッキング変数である `left` と `right` を最新に保つ必要があります。

そこで、下のボートレイアウトを例にとると、
```
+-+-+-+-+  row
| | |Q| |   0  
+-+-+-+-+      
|Q| | | |   1  
+-+-+-+-+      
| | | |Q|   2
+-+-+-+-+
| |Q| | |   3
+-+-+-+-+
```
最上段3列目にクイーンを置くと、その瞬間の `left` `down` `right` はそれぞれ0010、0010、0010となる。

しかし、再び`bitmap_R`を呼び出して次の行に進むと、2行目では、2列目、3列目、4列目のすべてが、これまでに配置した1つのクイーンによって「攻撃されている」ことがわかります。
具体的には、3列目が占領され（`down`は0010）、2行目の4列目を通る左上から右下の対角線が占領され（だから`right`は0001）、2行目の2列目を通る右上から左下の対角線が占領されています（だから`left`は0100）。

```
+-+-+-+-+  row
| | |Q| |   0  
+-+-+-+-+      
| |x|x|x|   1  
+-+-+-+-+      
| | | | |   2
+-+-+-+-+
| | | | |   3
+-+-+-+-+
```
そのため、「行を下る」たびに対角線を移動させる必要があります。
そうしないと、どの対角線が「占有」されているかという知識が、現在の行に対して正しくなくなるからです。

上記の例からわかるように、`$(( ~(left|down|right ))` を計算すると`2#1000` となり、2行目の安全な場所は1列目のみであることがわかります。




## 斜めの効き筋
ビットマッププログラムのポイントは、斜めの利き筋のチェックをビット演算で行うことです。

```
    0 1 2 3 4
  *-------------
  | . . . . . .
  | . . . -3. .  0x02
  | . . -2. . .  0x04
  | . -1. . . .  0x08 (1 bit 右シフト)
  | Q . . . . .  0x10 (Q の位置は 4)
  | . +1. . . .  0x20 (1 bit 左シフト)  
  | . . +2. . .  0x40
  | . . . +3. .  0x80
  *-------------
```


この演算式の意味を理解するには、負の値がコンピュータにおける２進法ではどのように表現されているのかを知る必要があります。

負の値を２進数で表すと次のようになります。
```
 00000011   3
 00000010   2
 00000001   1
 00000000   0
 11111111  -1
 11111110  -2
 11111101  -3
```

正の値を負の値（補数と言います）にするときは、Ｒをビット反転してから＋１します。
```

 00000001   1
 11111110   反転
 11111111   -1 （1を加える）

 00000010   2
 11111101  反転
 11111110  -2  （１を加える）
```

加えるところがわかりにくいですね。
```
 00000001   1
```
 に１を加えると
```
 00000010   2
```
さらに１を加えると
```
00000011   3
```

と、なります。
１０進数の足し算と２進数のインクリメントは異なるところに注意が必要です。

ここで、 正の値２２と−２２をＡＮＤ演算すると以下のようになります。
```
     00010110   22
 AND 11101010  -22
------------------
     00000010
```

Ｎを２進法で表したときの一番下位のＯＮビットがひとつだけ抽出される結果が得られ、極めて簡単な演算によって１ビット抽出を実現させていることが重要です。

余談ですが、
bashで２進数を１０進数に変換するには以下のようにしました。
```
bash-3.2$ echo $(( 2#01000 ));
8
```

bashで１０進数を２進数に変換するには以下のようにします。
```
bash-3.2$ bc <<<"ibase=10;obase=10;8"
1000
```
余談終わり。


そこで下のようなwhile文を書けば、ループが bitmap のONビットの数の回数だけループすることになり、配置可能なパターンをひとつずつ全く無駄がループがなく生成されることになります。

```c
mask=(1<<size)-1;
bitmap=mask&~(left|down|right);
while(bitmap){
  bit=bitmap&-bitmap;// 一番右のビットを取り出す
  bitmap=bitmap&~bit;// 配置可能なパターンが一つずつ取り出される
  board[row]=bit;// Qを配置
  bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);// 再帰
}
```


forで一行にまとめることができます。これは非常にトリッキーです。
```c
  for(unsigned int bitmap=mask&~(left|down|right);bitmap;bitmap=bitmap&~bit){
    bit=bitmap&-bitmap;
    board[row]=bit;
    bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);
  }
```



`left` `down` `right` は、Qが配置されるたびに、その効き筋を足し合わせ、すべてのrowの効き筋に対応します。

再帰では、こうしたことをプログラマが意識することなく実現できるわけですが、非再帰の場合は、`left` `down` `right` を配列などで効き筋を覚えておく必要が出てきます。

それはどうとして猛烈にわかりやすい図がありました。
<img src=bitmap.jpg width=80%>



## ソースコード
Ｃ言語で実装した配置フラグのプログラムソースは以下のとおりです。
解もきちんとでます。
```c
/**
 *
 * bash版ビットマップのC言語版
 *
 詳しい説明はこちらをどうぞ
 https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
 *
bash-3.2$ gcc 04GCC_Bitmap.c && ./a.out -r
４．ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               0            0.00
 5:           10               0            0.00
 6:            4               0            0.00
 7:           40               0            0.00
 8:           92               0            0.00
 9:          352               0            0.00
10:          724               0            0.00
11:         2680               0            0.00
12:        14200               0            0.01
13:        73712               0            0.07
14:       365596               0            0.39
15:      2279184               0            2.44

bash-3.2$ gcc 04GCC_Bitmap.c && ./a.out -c
４．ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               0            0.00
 5:           10               0            0.00
 6:            4               0            0.00
 7:           40               0            0.00
 8:           92               0            0.00
 9:          352               0            0.00
10:          724               0            0.00
11:         2680               0            0.00
12:        14200               0            0.01
13:        73712               0            0.08
14:       365596               0            0.46
15:      2279184               0            2.84
bash-3.2$
*/
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sys/time.h>
#define MAX 27
// システムによって以下のマクロが必要であればコメントを外してください。
//#define UINT64_C(c) c ## ULL
//
// グローバル変数
typedef unsigned long long uint64_t;
uint64_t TOTAL=0; 
uint64_t UNIQUE=0;
// 構造体
typedef struct{
  unsigned int size;
  unsigned int pres_a[930]; 
  unsigned int pres_b[930];
  // uint64_t COUNTER[3];      
  // //カウンター配列
  // unsigned int COUNT2;
  // unsigned int COUNT4;
  // unsigned int COUNT8;
}Global; Global g;
// 構造体
typedef struct{
  uint64_t row;
  uint64_t down;
  uint64_t left;
  uint64_t right;
  uint64_t x[MAX];
}Board ;
typedef struct{
  Board B;
  Board nB;
  Board eB;
  Board sB;
  Board wB;
  unsigned n;
  unsigned e;
  unsigned s;
  unsigned w;
  uint64_t dimx;
  uint64_t dimy;
  uint64_t COUNTER[3];      
  //カウンター配列
  unsigned int COUNT2;
  unsigned int COUNT4;
  unsigned int COUNT8;
}Local;
//
//hh:mm:ss.ms形式に処理時間を出力
void TimeFormat(clock_t utime,char* form)
{
  int dd,hh,mm;
  float ftime,ss;
  ftime=(float)utime/CLOCKS_PER_SEC;
  mm=(int)ftime/60;
  ss=ftime-(int)(mm*60);
  dd=mm/(24*60);
  mm=mm%(24*60);
  hh=mm/60;
  mm=mm%60;
  if(dd)
    sprintf(form,"%4d %02d:%02d:%05.2f",dd,hh,mm,ss);
  else if(hh)
    sprintf(form,"     %2d:%02d:%05.2f",hh,mm,ss);
  else if(mm)
    sprintf(form,"        %2d:%05.2f",mm,ss);
  else
    sprintf(form,"           %5.2f",ss);
}
//
// ボード外側２列を除く内側のクイーン配置処理
uint64_t solve(uint64_t row,uint64_t left,uint64_t down,uint64_t right)
{
  if(down+1==0){ return  1; }
  while((row&1)!=0) { 
    row>>=1;
    left<<=1;
    right>>=1;
  }
  row>>=1;
  uint64_t total=0;
  for(uint64_t bitmap=~(left|down|right);bitmap!=0;){
    uint64_t const bit=bitmap&-bitmap;
    total+=solve(row,(left|bit)<<1,down|bit,(right|bit)>>1);
    bitmap^=bit;
  }
  return total;
} 
// クイーンの効きをチェック
bool placement(void* args)
{
  Local *l=(Local *)args;
  if(l->B.x[l->dimx]==l->dimy){ return true;  }  
  if (l->B.x[0]==0){
    if (l->B.x[1]!=(uint64_t)-1){
      if((l->B.x[1]>=l->dimx)&&(l->dimy==1)){ return false; }
    }
  }else{
    if( (l->B.x[0]!=(uint64_t)-1) ){
      if(( (l->dimx<l->B.x[0]||l->dimx>=g.size-l->B.x[0])
        && (l->dimy==0 || l->dimy==g.size-1)
      )){ return 0; } 
      if ((  (l->dimx==g.size-1)&&((l->dimy<=l->B.x[0])||
          l->dimy>=g.size-l->B.x[0]))){
        return 0;
      } 
    }
  }
  l->B.x[l->dimx]=l->dimy;                    //xは行 yは列
  uint64_t row=UINT64_C(1)<<l->dimx;
  uint64_t down=UINT64_C(1)<<l->dimy;
  uint64_t left=UINT64_C(1)<<(g.size-1-l->dimx+l->dimy); //右上から左下
  uint64_t right=UINT64_C(1)<<(l->dimx+l->dimy);       // 左上から右下
  if((l->B.row&row)||(l->B.down&down)||(l->B.left&left)||(l->B.right&right)){ return false; }     
  l->B.row|=row; l->B.down|=down; l->B.left|=left; l->B.right|=right;
  return true;
}
//対称解除法
void carryChain_symmetry(void* args)
{
  Local *l=(Local *)args;
  // 対称解除法 
  unsigned const int ww=(g.size-2)*(g.size-1)-1-l->w;
  unsigned const int w2=(g.size-2)*(g.size-1)-1;
  // # 対角線上の反転が小さいかどうか確認する
  if((l->s==ww)&&(l->n<(w2-l->e))){ return ; }
  // # 垂直方向の中心に対する反転が小さいかを確認
  if((l->e==ww)&&(l->n>(w2-l->n))){ return; }
  // # 斜め下方向への反転が小さいかをチェックする
  if((l->n==ww)&&(l->e>(w2-l->s))){ return; }
  // 枝刈り １行目が角の場合回転対称チェックせずCOUNT8にする
  if(l->B.x[0]==0){ 
    l->COUNTER[l->COUNT8]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return ;
  }
  // n,e,s==w の場合は最小値を確認する。右回転で同じ場合は、
  // w=n=e=sでなければ値が小さいのでskip  w=n=e=sであれば90度回転で同じ可能性
  if(l->s==l->w){ if((l->n!=l->w)||(l->e!=l->w)){ return; } 
    l->COUNTER[l->COUNT2]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  // e==wは180度回転して同じ 180度回転して同じ時n>=sの時はsmaller?
  if((l->e==l->w)&&(l->n>=l->s)){ if(l->n>l->s){ return; } 
    l->COUNTER[l->COUNT4]+=solve(l->B.row>>2,
    l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
    return;
  }
  l->COUNTER[l->COUNT8]+=solve(l->B.row>>2,
  l->B.left>>4,((((l->B.down>>2)|(~0<<(g.size-4)))+1)<<(g.size-5))-1,(l->B.right>>4)<<(g.size-5));
  return;
}
// pthread run()
void thread_run(void* args)
{
  Local *l=(Local *)args;

  // memcpy(&l->B,&l->wB,sizeof(Board));       // B=wB;
  l->B=l->wB;
  l->dimx=0; l->dimy=g.pres_a[l->w]; 
  //if(!placement(l)){ continue; } 
  if(!placement(l)){ return; } 
  l->dimx=1; l->dimy=g.pres_b[l->w]; 
  // if(!placement(l)){ continue; } 
  if(!placement(l)){ return; } 
  //２ 左２行に置く
  // memcpy(&l->nB,&l->B,sizeof(Board));       // nB=B;
  l->nB=l->B;
  for(l->n=l->w;l->n<(g.size-2)*(g.size-1)-l->w;++l->n){
    // memcpy(&l->B,&l->nB,sizeof(Board));     // B=nB;
    l->B=l->nB;
    l->dimx=g.pres_a[l->n]; l->dimy=g.size-1; 
    if(!placement(l)){ continue; } 
    l->dimx=g.pres_b[l->n]; l->dimy=g.size-2; 
    if(!placement(l)){ continue; } 
    // ３ 下２行に置く
    // memcpy(&l->eB,&l->B,sizeof(Board));     // eB=B;
    l->eB=l->B;
    for(l->e=l->w;l->e<(g.size-2)*(g.size-1)-l->w;++l->e){
      // memcpy(&l->B,&l->eB,sizeof(Board));   // B=eB;
      l->B=l->eB;
      l->dimx=g.size-1; l->dimy=g.size-1-g.pres_a[l->e]; 
      if(!placement(l)){ continue; } 
      l->dimx=g.size-2; l->dimy=g.size-1-g.pres_b[l->e]; 
      if(!placement(l)){ continue; } 
      // ４ 右２列に置く
      // memcpy(&l->sB,&l->B,sizeof(Board));   // sB=B;
      l->sB=l->B;
      for(l->s=l->w;l->s<(g.size-2)*(g.size-1)-l->w;++l->s){
        // memcpy(&l->B,&l->sB,sizeof(Board)); // B=sB;
        l->B=l->sB;
        l->dimx=g.size-1-g.pres_a[l->s]; l->dimy=0; 
        if(!placement(l)){ continue; } 
        l->dimx=g.size-1-g.pres_b[l->s]; l->dimy=1; 
        if(!placement(l)){ continue; } 
        // 対称解除法
        carryChain_symmetry(l);
      } //w
    } //e
  } //n
}
// チェーンのビルド
void buildChain()
{
  Local l[(g.size/2)*(g.size-3)];

  // カウンターの初期化
  l->COUNT2=0; l->COUNT4=1; l->COUNT8=2;
  l->COUNTER[l->COUNT2]=l->COUNTER[l->COUNT4]=l->COUNTER[l->COUNT8]=0;
  // Board の初期化 nB,eB,sB,wB;
  l->B.row=l->B.down=l->B.left=l->B.right=0;
  // Board x[]の初期化
  for(unsigned int i=0;i<g.size;++i){ l->B.x[i]=-1; }
  //１ 上２行に置く
  // memcpy(&l->wB,&l->B,sizeof(Board));         // wB=B;
  l->wB=l->B;
  for(l->w=0;l->w<=(unsigned)(g.size/2)*(g.size-3);++l->w){
    thread_run(&l);
  } //w
  /**
   * 集計
   */
  UNIQUE= l->COUNTER[l->COUNT2]+
          l->COUNTER[l->COUNT4]+
          l->COUNTER[l->COUNT8];
  TOTAL=  l->COUNTER[l->COUNT2]*2+
          l->COUNTER[l->COUNT4]*4+
          l->COUNTER[l->COUNT8]*8;
}
// チェーンのリストを作成
void listChain()
{
  unsigned int idx=0;
  for(unsigned int a=0;a<(unsigned)g.size;++a){
    for(unsigned int b=0;b<(unsigned)g.size;++b){
      if(((a>=b)&&(a-b)<=1)||((b>a)&&(b-a)<=1)){ continue; }
      g.pres_a[idx]=a;
      g.pres_b[idx]=b;
      ++idx;
    }
  }
}
// キャリーチェーン
void carryChain()
{
  listChain();  //チェーンのリストを作成
  buildChain(); // チェーンのビルド
  // calcChain(&l);  // 集計
}
unsigned int board[MAX];  //ボード配列
unsigned int down[MAX];   //ポストフラグ/ビットマップ
unsigned int left[MAX];   //ポストフラグ/ビットマップ
unsigned int right[MAX];  //ポストフラグ/ビットマップ
// ビットマップ 非再帰版
void bitmap_NR(unsigned int size,int row)
{
  unsigned int mask=(1<<size)-1;
  unsigned int bitmap[size];
  unsigned int bit=0;
  bitmap[row]=mask;
  while(row>-1){
    if(bitmap[row]>0){
      bit=-bitmap[row]&bitmap[row];//一番右のビットを取り出す
      bitmap[row]=bitmap[row]^bit;//配置可能なパターンが一つずつ取り出される
      board[row]=bit;
      if(row==(size-1)){
        TOTAL++;
        row--;
      }else{
        unsigned int n=row++;
        left[row]=(left[n]|bit)<<1;
        down[row]=down[n]|bit;
        right[row]=(right[n]|bit)>>1;
        board[row]=bit;
        //クイーンが配置可能な位置を表す
        bitmap[row]=mask&~(left[row]|down[row]|right[row]);
      }
    }else{
      row--;
    }
  }//end while
}
// ビットマップ 再帰版
void bitmap_R(unsigned int size,unsigned int row,unsigned int left,unsigned int down, unsigned int right)
{
  unsigned int mask=(1<<size)-1;
  unsigned int bit=0;
  if(row==size){
    TOTAL++;
  }else{
    // クイーンが配置可能な位置を表す
    for(unsigned int bitmap=mask&~(left|down|right);bitmap;bitmap=bitmap&~bit){
      bit=bitmap&-bitmap;
      board[row]=bit;
      bitmap_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
}
// ポストフラグ 非再帰版
void postFlag_NR(unsigned int size,int row)
{
  // １．非再帰は初期化が必要
  for(unsigned int i=0;i<size;++i){
    board[i]=-1;
  }
  // ２．再帰で呼び出される関数内を回す処理
  while(row>-1){
    unsigned int matched=0; //クイーンを配置したか
    // ３．再帰処理のループ部分
    // 非再帰では過去の譜石を記憶するためにboard配列を使う
    for(unsigned int col=board[row]+1;col<size;++col){
      if(!down[col]
          && !right[col-row+size-1]
          && !left[col+row]){
        // unsigned int dix=col;
        // unsigned int rix=row-col+(size-1);
        // unsigned int lix=row+col;
        /** バックトラックではここで効きをチェックしていた
        check_backTracking "$row";  # 効きをチェック
        */
        // 効きとしてフラグをfalseにする
        if(board[row]!=-1){
          down[board[row]]=0;
          right[board[row]-row+(size-1)]=0;
          left[board[row]+row]=0;
        }
        board[row]=col; //クイーンを配置
        // 効きを開放（trueに）する
        down[col]=1;
        right[col-row+(size-1)]=1;
        left[col+row]=1;
        matched=1;
        break;
      } //end if
    }//end for
    // ４．配置したら実行したい処理
    if(matched){
      row++;
      // ５．最下部まで到達したときの処理
      if(row==size){
        row--;
        /** ブルートフォースではここで効きをチェックしていた
        // check_bluteForce "$size";   # 効きをチェック
        */
        TOTAL++;
      }
    // ６．配置できなくてバックトラックしたい時の処理
    }else{
      if(board[row]!=-1){
        down[board[row]]=0;
        right[board[row]-row+(size-1)]=0;
        left[board[row]+row]=0;
        board[row]=-1;
      }
      row--;
    }
  }//end while
}
// ポストフラグ 再帰版
void postFlag_R(unsigned int size,unsigned int row)
{
  if(row==size){
    TOTAL++;
  }else{
    for(unsigned int col=0;col<size;++col){
      board[row]=col;
      if(down[col]==0
          && right[row-col+size-1]==0
          && left[row+col]==0){
        down[col]=1;
        right[row-col+(size-1)]=1;
        left[row+col]=1;
        postFlag_R(size,row+1);
        down[col]=0;
        right[row-col+(size-1)]=0;
        left[row+col]=0;
      }//end if
    }//end for
  }//end if
}
// バックトラック　効き筋をチェック
int check_backTracking(unsigned int row)
{
  for(unsigned int i=0;i<row;++i){
    unsigned int val=0;
    if(board[i]>=board[row]){
      val=board[i]-board[row];
    }else{
      val=board[row]-board[i];
    }
    if(board[i]==board[row]||val==(row-i)){
      return 0;
    }
  }
  return 1;
}
// バックトラック 非再帰版
void backTracking_NR(unsigned int size,int row)
{
  // １．非再帰は初期化が必要
  for(unsigned int i=0;i<size;++i){
    board[i]=-1;
  }
  // ２．再帰で呼び出される関数内を回す処理
  while(row>-1){
    unsigned int matched=0;   //クイーンを配置したか
    // ３．再帰処理のループ部分
    for(unsigned int col=board[row]+1;col<size;++col){
      board[row]=col;   // クイーンを配置
      // 効きをチェック
      if(check_backTracking(row)==1){
        matched=1;
        break;
      } // end if
    } // end for
    // ４．配置したら実行したい処理
    if(matched){
      row++;
      // ５．最下部まで到達したときの処理
      if(row==size){
        row--;
        TOTAL++;
      }
    // ６．配置できなくてバックトラックしたい時の処理
    }else{
      if(board[row]!=-1){
        board[row]=-1;
      }
      row--;
    }
  } //end while
}
// バックトラック 再帰版
void backTracking_R(unsigned int size,unsigned int row)
{
  if(row==size){
    TOTAL++;
  }else{
    for(unsigned int col=0;col<size;++col){
      board[row]=col;
      if(check_backTracking(row)==1){
        backTracking_R(size,row+1);
      }
    }// end for
  }//end if
}
// ブルートフォース 効き筋をチェック
int check_bluteForce()
{
  unsigned int size=g.size; 
  for(unsigned int r=1;r<size;++r){
    unsigned int val=0;
    for(unsigned int i=0;i<r;++i){
      if(board[i]>=board[r]){
        val=board[i]-board[r];
      }else{
        val=board[r]-board[i];
      }
      if(board[i]==board[r]||val==(r-i)){
        return 0;
      }
    }
  }
  return 1;
}
//ブルートフォース 非再帰版
void bluteForce_NR(unsigned int size,int row)
{
  // １．非再帰は初期化が必要
  for(unsigned int i=0;i<size;++i){
    board[i]=-1;
  }
  // ２．再帰で呼び出される関数内を回す処理
  while(row>-1){
    unsigned int matched=0;   //クイーンを配置したか
    // ３．再帰処理のループ部分
    // 非再帰では過去の譜石を記憶するためにboard配列を使う
    for(unsigned int col=board[row]+1;col<size;++col){
      board[row]=col;
      matched=1;
      break;
    }
    // ４．配置したら実行したい処理
    if(matched){
      row++;
      // ５．最下部まで到達したときの処理';
      if(row==size){
        row--;
        // 効きをチェック
        if(check_bluteForce()==1){
          TOTAL++;
        }
      }
      // ６．配置できなくてバックトラックしたい処理
    }else{
      if(board[row]!=-1){
        board[row]=-1;
      }
      row--;
    } // end if
  }//end while
}
//ブルートフォース 再帰版
void bluteForce_R(unsigned int size,int row)
{
  if(row==size){
    if(check_bluteForce()==1){
      TOTAL++; // グローバル変数
    }
  }else{
    for(int col=0;col<size;++col){
      board[row]=col;
      bluteForce_R(size,row+1);
    }
  }
}
//メインメソッド
int main(int argc,char** argv)
{
  bool cpu=false,cpur=false;
  int argstart=2;
  if(argc>=2&&argv[1][0]=='-'){
    if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='r'||argv[1][1]=='R'){cpur=true;}
    else{ cpur=true;}
  }
  if(argc<argstart){
    printf("Usage: %s [-c|-r|-g]\n",argv[0]);
    printf("  -c: CPU Without recursion\n");
    printf("  -r: CPUR Recursion\n");
    printf("  -g: GPU Without Recursion\n");
  }
  printf("４．ビットマップ\n");
  printf("%s\n"," N:        Total       Unique        hh:mm:ss.ms");
  clock_t st;           //速度計測用
  char t[20];           //hh:mm:ss.msを格納
  unsigned int min=4;
  unsigned int targetN=21;
  // sizeはグローバル
  for(unsigned int size=min;size<=targetN;++size){
    TOTAL=UNIQUE=0; 
    st=clock();
    g.size=size;
    if(cpu){  // 非再帰
      bitmap_NR(size,0);      //４．ビットマップ
      // postFlag_NR(size,0);    //３．ポストフラグ
      // backTracking_NR(size,0);//２．バックトラック
      // bluteForce_NR(size,0);  //１．ブルートフォース
      // carryChain();
    }else{    // 再帰
      bitmap_R(size,0,0,0,0); //４．ビットマップ
      // postFlag_R(size,0);     //３．ポストフラグ
      // backTracking_R(size,0); //２．バックトラック
      // bluteForce_R(size,0);   //１．ブルートフォース
      // carryChain();
    }
    TimeFormat(clock()-st,t);
    printf("%2d:%13lld%16lld%s\n",size,TOTAL,UNIQUE,t);
  }
  return 0;
}
```


## 実行結果
実行結果は以下のとおりです。
```
bash-3.2$ gcc 04GCC_Bitmap.c && ./a.out -r
４．ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               0            0.00
 5:           10               0            0.00
 6:            4               0            0.00
 7:           40               0            0.00
 8:           92               0            0.00
 9:          352               0            0.00
10:          724               0            0.00
11:         2680               0            0.00
12:        14200               0            0.01
13:        73712               0            0.07
14:       365596               0            0.39
15:      2279184               0            2.44

bash-3.2$ gcc 04GCC_Bitmap.c && ./a.out -c
４．ビットマップ
 N:        Total       Unique        hh:mm:ss.ms
 4:            2               0            0.00
 5:           10               0            0.00
 6:            4               0            0.00
 7:           40               0            0.00
 8:           92               0            0.00
 9:          352               0            0.00
10:          724               0            0.00
11:         2680               0            0.00
12:        14200               0            0.01
13:        73712               0            0.08
14:       365596               0            0.46
15:      2279184               0            2.84
bash-3.2$
```  




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








