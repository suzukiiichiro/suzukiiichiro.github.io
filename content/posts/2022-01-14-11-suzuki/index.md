---
authors: suzuki
title: "【１１．else if と else】ざっくりわかる「シェルスクリプト」"
description: "else if条件の使用は、bashでは「elif」を定義します。'elseif_example.sh'という名前のファイルを作成し、次のスクリプトを追加して、bashスクリプトでelseifがどのように定義されているかを確認します。"
date: 2022-01-12T12:30:57+09:00
draft: false
image: shellscript.jpg
categories:
  - programming
tags:
  - ざっくりわかるシリーズ
  - プログラミング
  - シェルスクリプト
  - Bash
  - 鈴木維一郎
---


## else if と else
<font color=orange><b>else ifステートメントの使用：</b></font>
else if条件の使用は、bashでは「elif」を定義します。'elseif_example.sh'という名前のファイルを作成し、次のスクリプトを追加して、bashスクリプトでelseifがどのように定義されているかを確認します。

``` bash:elseif_example.sh
#!/bin/bash

echo "あなたのラッキーナンバーを入力して下さい。";
read n;

if [ "$n" -eq 101 ];then
  echo "あなたは一等賞を獲得しました";
elif [ "$n" -eq 510 ];then
  echo "あなたは二等賞を獲得しました";
elif [ "$n" -eq 999 ];then
  echo "あなたは三等賞を獲得しました";
else
  echo "すみません、またチャレンジして下さい";
fi
```

bashコマンドでファイルを実行します。

```
bash$ bash elseif_example.sh
あなたのラッキーナンバーを入力して下さい。
101
あなたは一等賞を獲得しました
bash$ bash elseif_example.sh
あなたのラッキーナンバーを入力して下さい。
999
あなたは三等賞を獲得しました
bash$ bash elseif_example.sh
あなたのラッキーナンバーを入力して下さい。
100
すみません、またチャレンジして下さい
bash$ bash elseif_example.sh
$
```


<table>
<tr><td>比較演算子</td><td>使用例</td><td>意味</td></tr>
<tr><td>-n</td><td>-n 文字列	</td><td>文字列の長さが0より大きければ真</td></tr>
<tr><td>-z</td><td>-z 文字列	</td><td>文字列の長さが0であれば真</td></tr>
<tr><td>=</td><td>文字列A = 文字列B	</td><td>文字列Aと文字列Bが等しければ真</td></tr>
<tr><td>!=</td><td>文字列A != 文字列B	</td><td>文字列Aと文字列Bが等しくなければ真</td></tr>
</table>

{{% tips-list tips %}}
ヒント
: シェルスクリプトの比較式には「比較演算子」の左右に空白（半角スペース）が必要です（代入とは別）。
: また、比較する変数を「ダブルクォーテーション」で囲まないと、変数が空のときに構文エラーとなってしましますので注意してください。 
{{% /tips-list %}}




## 書籍の紹介

{{% amazon

title="詳解 シェルスクリプト 大型本 – 2006/1/16"

url="https://www.amazon.co.jp/gp/product/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

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

url="https://www.amazon.co.jp/gp/product/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー） – 2017/1/20"

url="https://www.amazon.co.jp/gp/product/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

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

url="https://www.amazon.co.jp/gp/product/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

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


