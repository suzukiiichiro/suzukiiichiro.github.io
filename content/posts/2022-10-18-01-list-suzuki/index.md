---
title: "【アルゴリズム 連結リスト】ざっくりわかるシェルスクリプト１６"
date: 2022-10-18T11:31:36+09:00
draft: false
authors: suzuki
image: algorithm.jpg
categories:
  - programming
tags:
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---

## 配列とリスト

これまで配列について説明してきました。
配列で再帰を組む方法を前回説明しました。
配列は
- 非順序配列は探索が遅い
- 順序配列は挿入が遅い
- いずれにしても削除は遅い

こうした問題の一部を解決する方法に「連結リスト」というデータ構造があります。
配列もよいけど、連結リストのほうがもっとよい、というシーンが多々あります。

配列が得意なのは、
- データ構造内の個々の項目に簡単にアクセスできること

ですよね。ではまずは連結リストを紹介します。

## 連結リスト

連結リストは、複数のデータを格納できます。
各データは、１つ前、あるいは後ろのデータへの参照情報（リンクやポインタ）を持っています。

リンクされたリストは、すべてのノートが次のノードを指すノードのチェーンとして視覚化することができます。
![連結リスト](linked_list.jpg)

- リンクされたリストは、アイテムを含む一連クリンクです。
- 各リンクには、別のリンクへの接続が含まれています。
- 連結リスト(リンクリスト）は、配列についで２番目によく使われるデータ構造です。
- 上の「HEAD」がリンクリストの先頭で、その後ろに３つのノードがあることがわかります。
- ノードには、「Data Items」として値を格納することができます。
- 「Next」は、次のノードを参照するノード名が格納されます。

重要な点は以下のとおりです。
- 連結リストには「first」というリンク要素が含まれています。
- 各リンクノードには、「Data Items」と「next」というフィールドがあります。
- 各リンクノードは、「next」を使って次のリンクノードとリンクします。
- 最後のリンクノードの「next」は、nullまたはnoneで終端とします。

## 連結リストでできること

一般的な機能
- 表示-リスト全体を表示します。
- 挿入-リストの先頭に要素を追加します。
- 削除-リストの先頭にある要素を削除します。

キーを指定して検索や削除を行う機能
- 検索-指定されたキーを使用して要素を検索します。
- 削除-指定されたキーを使用して要素を削除します。




## プログラムソース
この章で使っているプログラムソースは以下にあります。
[04_6LinkedList.sh 連結リスト](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash/04_6LinkedList.sh)
[list1 リストファイル](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash/list1)
[node1 ノードファイル](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash/node1)
[node2 ノードファイル](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash/node2)
[node3 ノードファイル](https://github.com/suzukiiichiro/Algorithms-And-Data-Structures/tree/master/Bash/node3)


## 挿入
まずは、連結リストに挿入してみます。
イメージが重要なので以下の図を見てください。

`A (LeftNode)` と`C (RightNode)`の間に`NewNode` を挿入したいと思います。
まずは、`NewNode`を`A（LeftNode）`と`C（RightNode）`の間に配置します。
![連結リスト挿入](linked_list_insertion_0-1.jpg)

次に、`NewNode` の`Next`を`C（RightNode）`へ参照します。
これにより、`NewNode`の次のノードが`C（RightNode）`となりました。
![連結リスト挿入](linked_list_insertion_1.jpg)

次に、`A（LeftNode）`の`Next`の参照を、`C(RightNode）`から`NewNode`へ切り替えます。
これで、`A(LeftNode）`の次のノードが`NewNode`となりました。
![連結リスト挿入](linked_list_insertion_2.jpg)

これにより、ノード`NewNode`が`A（LeftNoe）`とC(RightNode）２つの中間に配置されます。
新しいリストは以下の図のようになります。
![連結リスト挿入](linked_list_insertion_3.jpg)

`NewNode`をリストの先頭に挿入したい場合は、上記同様の手順を `Head`と `A（LeftNode）`との間で実行すればよいわけです。
`NewNode`をリストの最後に挿入したい場合は、リストの最後のノード`C(RightNode）`が新しいノード`NewNode`を参照し、新しいノード`（NewNode）`の`Next`は nullまたはnone を指定します。
これにより、新しい`NewNode`がリストの終端となります。


## 削除

削除は検索をすることから始まります。
削除したいノードを検索できたとします。
ここでは削除したいノードを `TargetNode` として真ん中のノードを削除対象としました。

![連結リスト削除](linked_list_deletion_0.jpg)

挿入のときと同じように、`TargetNode` の左（前の）ノードの `next` は、`TargetNode`の次（右）のノードを参照します。

![連結リスト削除](linked_list_deletion_1.jpg)

これにより、`TargetNode` を参照していたリンクが削除されます。


![連結リスト削除](linked_list_deletion_2.jpg)

これによりメモリに割り当てられていた`TargetNode`が開放され、`TargetNode`を完全に消去することができます。

![連結リスト削除](linked_list_deletion_3.jpg)

{{% tips-list tips %}}
ヒント
: 削除された`TargetNode`の`Next`の参照をわざわざ消去する必要すらありません。
: `A（LeftNode）`の`Next`がC（LeftNode）`を参照していれば、`TargetNode`は孤立し、リンクをたどることができなくなります。
{{% /tips-list %}}


## プログラムソース

まず、４つのファイルを準備します。

```:list1
node1
3
```

```:node1
node2
foo
```

```:node2
node3
bar
```

```:node3
none
!
```

上記４つのファイルを実行ファイルと同じ場所に配置してください。

今回のプログラムソースは、今後の実用性も考えて、以下の機能にに加えて、

一般的な機能
- 表示-リスト全体を表示します。
- 挿入-リストの先頭に要素を追加します。
- 削除-リストの先頭にある要素を削除します。

以下の機能も追加しています。

キーを指定して検索や削除を行う機能
- 検索-指定されたキーを使用して要素を検索します。
- 削除-指定されたキーを使用して要素を削除します。

ソースはやや長くなりましたが、じっくりと動かしてみてください。

{{% tips-list alert %}}
ヒント
: プログラムを修正しているうちに、実行ファイルが４つのファイル（list1,node1,node2,node3）の内容を書き換えてしまうことがあります。
: おかしいな？と思ったら、４つのファイルを作り直して実行してみると良いです。
{{% /tips-list %}}


``` bash:04_6LinkedList.sh
#!/bin/bash


########################################
# 連結リスト　Linked List 
# Bash シェルスクリプト版
########################################

## 準備すべき４つのファイル
## 実行ファイル（このファイル）と同じ場所に４つのファイルを配置してください。
##

: '
## list1
node1
3
##
## node1
node2
foo
##
## node2
node3
bar
##
## node3
none
!
';

##
## 
# addAtIdx()
# 指定したインデックスに要素を追加
function addAtIdx {
  local first=$1;
  local N=$2;
  local dataItems=$3;
  if [ "$N" -eq "0" ]; then
    add $first $dataItems;
  else
    let prevIdx=$N-1;
    let size=$(tail -n1 $first)+1;
    prev=$(getNode $first $prevIdx);
    if [ "$N" -eq $(tail -n1 $first) ]; then
      cur="none";
    else
      cur=$(getNode $first $N);
    fi
    printf "%s\n%s" $cur $dataItems > node$size;
    printf "%s\n%s" node$size $(tail -n1 $prev) > $prev;
    printf "%s\n%s" $(head -n1 $first) $size > $first;
  fi
}
## 
# remove()
# リストの先頭から要素を削除します。
# $1 - 追加するリストの先頭
function remove {
  local first=$1;
  local oldHead=$(head -n1 $first);
  local oldVal=$(tail -n1 $oldHead);
  let size=$(tail -n1 $first)-1;
  local newHead=$(head -n1 $oldHead);
  printf "%s\n%s" $newHead $size > $first;
  rm $oldHead;
  echo $oldVal;
}
##
# removeAtIdx()
# インデックスの要素を削除します
function removeAtIdx {
  local first=$1; 
  local N=$2;
  local prev;
  local cure;
  local Next;
  local oldVal;
  if [ "$N" -eq "0" ]; then
    remove $first;
  else
    let prevIdx=$N-1
    let size=$(tail -n1 $first)-1
    prev=$(getNode $first $prevIdx)
    cur=$(getNode $first $N)
    Next=$(head -n1 $cur)
    oldVal=$(tail -n1 $cur)
    printf "%s\n%s" $Next $(tail -n1 $prev) > $prev
    printf "%s\n%s" $(head -n1 $first) $size > $first
    rm $cur;
    echo $oldVal;
  fi
}
##
# getNode()
# N番目の要素を含むノードの名前を返します。
function getNode {
  local first=$1;
  local N=$2;
  rest=$(head -n1 $first)
  let restlen=$N-1;
  if [ "$N" -eq "0" ]; then
    echo $rest;
  else
    getNode $rest $restlen;
  fi
}
##
# get()
# リンクリストのN番目の要素を取得します。
function get {
  local currentNode=$1; 
  local N=$2;           
  local current=$(tail -n1 $currentNode);
  local rest=$(head -n1 $currentNode);
  let restlen=$N-1;
  if [ "$N" -eq "0" ]; then
    echo "$current";
  else
    get $rest $restlen; 
  fi
}
## 
# add()
# リストの先頭に要素を追加します
function add {
  # リストの先頭を参照
  local first=$1;   
  local N=$2;       
  local oldHead=$(head -n1 $first); 
  let size=$(tail -n1 $first)+1; 
  printf "%s\n%s" $oldHead $N > node$size;
  printf "%s\n%s" node$size $size > $first;
}
##
# printList()
# 連結されたリスト全体を出力
function printList {
  local current=$1; 
  local dataItems=$(tail -n1 $current); 
  local Next=$(head -n1 $current); 
  echo "データアイテム:" $dataItems "次の参照:" $Next;
  if [ "$Next" != "none" ]; then
    printList $Next;
  fi
}
##
# execLinkedList()
# 連結リストの実行
function execLinkedList(){
  printList $(head -n1 list1);
  printf "\nリストの先頭に hello を追加\n"
  add "list1" "hello";
  printList $(head -n1 list1);
  printf "\nリストの先頭に world を追加\n"
  add "list1" "world"
  printList $(head -n1 list1)
  printf "\n０から数えて１番目の要素を取得\n"
  get $(head -n1 list1) 1
  printf "\n０から数えて１番目のノード名を取得\n"
  getNode "list1" 1
  printf "\n０から数えて２番目に要素 327 を挿入\n"
  addAtIdx "list1" 2 327
  printList $(head -n1 list1)
  printf "\nリストの先頭に要素 94 を挿入\n"
  addAtIdx "list1" 0 94
  printList $(head -n1 list1)
  printf "\n０から数えて７番目に要素 1138 を挿入\n"
  addAtIdx "list1" 7 1138
  printList $(head -n1 list1)
  printf "\nリストの先頭の要素 %s を削除\n" $(remove "list1")
  printList $(head -n1 list1)
  printf "\nリストの１番目の要素 %s を削除\n" $(removeAtIdx "list1" 1)
  printList $(head -n1 list1)
  printf "\nリスト５番目の要素 %s を削除\n" $(removeAtIdx "list1" 5)
  printList $(head -n1 list1)
  printf "\nリストの先頭の要素 %s を削除\n" $(removeAtIdx "list1" 0)
  printList $(head -n1 list1)
  printf "\n%s を削除し初期状態に戻りました\n" $(remove "list1")
  printList $(head -n1 list1)
}
##
# メイン
execLinkedList
exit;

```

## 実行結果

実行結果は以下のとおりです。

```
bash-5.1$ bash 04_6LinkedList.sh
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

リストの先頭に hello を追加
データアイテム: hello 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

リストの先頭に world を追加
データアイテム: world 次の参照: node4
データアイテム: hello 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

０から数えて１番目の要素を取得
hello

０から数えて１番目のノード名を取得
node4

０から数えて２番目に要素 327 を挿入
データアイテム: world 次の参照: node4
データアイテム: hello 次の参照: node6
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

リストの先頭に要素 94 を挿入
データアイテム: 94 次の参照: node5
データアイテム: world 次の参照: node4
データアイテム: hello 次の参照: node6
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

０から数えて７番目に要素 1138 を挿入
データアイテム: 94 次の参照: node5
データアイテム: world 次の参照: node4
データアイテム: hello 次の参照: node6
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: node8
データアイテム: 1138 次の参照: none

リストの先頭の要素 94 を削除
データアイテム: world 次の参照: node4
データアイテム: hello 次の参照: node6
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: node8
データアイテム: 1138 次の参照: none

リストの１番目の要素 hello を削除
データアイテム: world 次の参照: node6
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: node8
データアイテム: 1138 次の参照: none

リスト５番目の要素 1138 を削除
データアイテム: world 次の参照: node6
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

リストの先頭の要素 world を削除
データアイテム: 327 次の参照: node1
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none

327 を削除し初期状態に戻りました
データアイテム: foo 次の参照: node2
データアイテム: bar 次の参照: node3
データアイテム: ! 次の参照: none
bash-5.1$
```



## 「ざっくり」シリーズのご紹介
【アルゴリズム リスト】ざっくりわかるシェルスクリプト１６
https://suzukiiichiro.github.io/posts/2022-10-18-01-list-suzuki/
【アルゴリズム 再帰】ざっくりわかるシェルスクリプト１５
https://suzukiiichiro.github.io/posts/2022-10-07-01-algorithm-recursion-suzuki/
【アルゴリズム キュー】ざっくりわかるシェルスクリプト１４
https://suzukiiichiro.github.io/posts/2022-10-06-01-algorithm-queue-suzuki/
【アルゴリズム スタック】ざっくりわかるシェルスクリプト１３
https://suzukiiichiro.github.io/posts/2022-10-06-01-algorithm-stack-suzuki/
【アルゴリズム 挿入ソート】ざっくりわかるシェルスクリプト１２
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-insertionsort-suzuki/
【アルゴリズム 選択ソート】ざっくりわかるシェルスクリプト１１
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-selectionsort-suzuki/
【アルゴリズム バブルソート】ざっくりわかるシェルスクリプト１０
https://suzukiiichiro.github.io/posts/2022-10-05-01-algorithm-bubblesort-suzuki/
【アルゴリズム ビッグオー】ざっくりわかるシェルスクリプト９
https://suzukiiichiro.github.io/posts/2022-10-04-01-algorithm-bigo-suzuki/
【アルゴリズム ２次元配列編】ざっくりわかるシェルスクリプト８
https://suzukiiichiro.github.io/posts/2022-10-03-01-algorithm-eval-array-suzuki/
【アルゴリズム 配列準備編】ざっくりわかるシェルスクリプト７
https://suzukiiichiro.github.io/posts/2022-10-03-01-algorithm-array-suzuki/ 
【アルゴリズム 配列編】ざっくりわかるシェルスクリプト６
https://suzukiiichiro.github.io/posts/2022-09-27-01-array-suzuki/
【grep/sed/awkも】ざっくりわかるシェルスクリプト５
https://suzukiiichiro.github.io/posts/2022-02-02-01-suzuki/
【grep特集】ざっくりわかるシェルスクリプト４
https://suzukiiichiro.github.io/posts/2022-01-24-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト３
https://suzukiiichiro.github.io/posts/2022-01-13-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト２
https://suzukiiichiro.github.io/posts/2022-01-12-01-suzuki/
【はじめから】ざっくりわかるシェルスクリプト１
https://suzukiiichiro.github.io/posts/2022-01-07-01-suzuki/

【TIPS】ざっくりわかるシェルスクリプト
https://suzukiiichiro.github.io/posts/2022-09-26-01-tips-suzuki/



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

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/proteect/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/proteect/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/proteect/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/proteect/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens-22&linkId=f514a6378c1c10e59ab16275745c2439"

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





