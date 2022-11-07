---
title: "（２５）【rev】シェルスクリプトコマンド活用紹介"
description: "文章を逆順に出力する"
date: 2022-07-26T11:11:28+09:00
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

## revコマンド
- ファイルの各行を反転させる
- キーボードから入力した内容を反転させる

## revコマンド概要
reverseの語源を持つ「rev」は、ファイルの各行を末尾から行頭に向かって文字列を反転させ出力します。

## revコマンドの書式
rev ファイル名


## revコマンドの主なオプション

|オプション    |意味|
|--------------|----|

オプションはありません。


## revコマンド詳細説明

### ファイルの各行を反転させる

```:data.txt
$ cat data.txt
1,小出里歩,オデリホ,女,27,85
2,吉野里紗,ヨシノリサ,女,38,894
3,本郷末治,ホンゴウスエジ,男,56,252
4,谷村千代乃,タニムラチヨノ,女,44,556
5,内野響子,ウチノキョウコ,女,44,170
6,塩谷貢,シオタニミツグ,男,34,494
7,児島愛子,コジマアイコ,女,39,675
8,白木俊史,シラキトシフミ,男,57,245
9,飯塚遥佳,イイヅカハルカ,女,20,974
10,阿久津清蔵,アクツセイゾウ,男,9,120
```

実行結果は以下のとおりです。
```
$ cat data.txt | rev
58,72,女,ホリデオ,歩里出小,1
498,83,女,サリノシヨ,紗里野吉,2
252,65,男,ジエスウゴンホ,治末郷本,3
655,44,女,ノヨチラムニタ,乃代千村谷,4
071,44,女,コウョキノチウ,子響野内,5
494,43,男,グツミニタオシ,貢谷塩,6
576,93,女,コイアマジコ,子愛島児,7
542,75,男,ミフシトキラシ,史俊木白,8
479,02,女,カルハカヅイイ,佳遥塚飯,9
021,9,男,ウゾイセツクア,蔵清津久阿,01
```

{{% tips-list tips %}}
ヒント
: どんなときに使うのでしょうね。むしろ、どう使うのかというよりも、必要になったときに思い出すと激しく便利、といったトリッキーなコマンドのようです。`tac`と`rev`はセットで覚えておきましょう。
{{% /tips-list %}}


## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/prorevct/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/prorevct/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/prorevct/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/prorevct/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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











