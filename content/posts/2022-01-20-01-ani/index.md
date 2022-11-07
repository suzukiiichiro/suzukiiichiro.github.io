---
title: "e-Stat でGoogle Custom Search APIを使おう（３）"
description: "Google Custom Search APIの検索結果をjqでパースする方法を説明します。"
date: 2022-01-20T17:50:13+09:00
draft: false
image: anal.jpg
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## google Custom Searchの検索結果をcsvに整形する
統計データから列名を取得してgoogle Custom Searchの検索結果に当てに行きマッチする回数の高い列名を社会的関心の高い項目に設定したいと思います。
全開でgoogle Custom Searchの検索の絞り込みができたのでAPIを叩く回数は統計名ごとに3回にしたいと思います。

start パラメータを1から開始して10ずつインクリメントしていきます。

```
curl -s 'https://www.googleapis.com/customsearch/v1?key=xxxxxxxxxxx&cx=xxxxxx&q=人権侵犯事件統計&start=1'

curl -s 'https://www.googleapis.com/customsearch/v1?key=xxxxxxxxxxx&cx=xxxxxx&q=人権侵犯事件統計&start=11'

curl -s 'https://www.googleapis.com/customsearch/v1?key=xxxxxxxxxxx&cx=xxxxxx&q=人権侵犯事件統計&start=21'
```

3回APIを叩いた結果に対してマッチングをかけていきたいと思うのですが、google Custom Searchの検索結果を見やすくするため前準備としてcsvに整形したいと思います。
google Custom Searchの検索結果はjsonですがjsonのパースはjqを使います。

## jqのインストール

jqのインストールは簡単です。

```
brew install jq
```


## jqを使ってgoogle Custom Searchの検索結果をjsonをパースする

```
  "items": [
  ¦ {
  ¦ ¦ "kind": "customsearch#result",
  ¦ ¦ "title": "昨年の人権侵犯事件 いじめ、教員関係が半減 | 教育新聞",
  ¦ ¦ "htmlTitle": "昨年の\u003cb\u003e人権侵犯事件\u003c/b\u003e いじめ、教員関係が半減 | 教育新聞",
  ¦ ¦ "link": "https://www.kyobun.co.jp/news/20210323_03/",
  ¦ ¦ "displayLink": "www.kyobun.co.jp",
  ¦ ¦ "snippet": "2021/03/23 ... それによると、昨年1年間に、同省の人権擁護機関が新たに救済手続きを開始した人権侵犯事件は9589件で、前年よりも5831件減少。同省の担当者は「他の統計 ...",
  ¦ ¦ "htmlSnippet": "2021/03/23 \u003cb\u003e...\u003c/b\u003e それによると、昨年1年間に、同省の人権擁護機関が新たに救済手続きを開始した\u003cb\u003e人権侵犯事件\u003c/b\u003eは9589件で、前年よりも5831件減少。同省の担当者は「他の\u003cb\u003e統計\u003c/b\u003e&nbsp;...",
```

items配列の中に検索結果が保存されているみたいです。
取得する項目は、title、snippet、linkにします。

jqでカウントを取得する方法は length です。

```
jq '.items | length'
```

配列以下の要素の取り方は

```
 jq -r .items[0].title
```

です。
返却結果にダブルクォーテーションが入るのが邪魔なのでオプション -r をつけています。

## プログラムの内容、出力結果
プログラムは以下となります

```
#!/bin/bash
#グーグルカスタムサーチの結果を取得します
APKEY="xxxxxxxxxxxxxxxxxxxxxxxxx";
EGID="xxxxxxxxxxxx";
START=1;
STATISTICS="$1";
AWK=`which gawk`;
SED=`which gsed`;
TMP="gcstmp.json"
RST="gcsrst.csv";
cnt=0;

function parse(){
  items=$(cat "$TMP"|jq .items);
  length=$(echo "$items"|jq '.| length');
  pcnt=0;
  while :;do
    if [ "$pcnt" -ge "$length" ];then
       break;
    fi
    item=$(echo "$items"|jq .[$pcnt]);
    title=$(echo "$item"|jq -r .title);
    snippet=$(echo "$item"|jq -r .snippet);
    link=$(echo "$item"|jq -r .link);
    echo "$title,$snippet,$link"|tee -a "$RST";
    pcnt=$((pcnt+1));
  done
}

function main(){
 :>"$RST";
 while :;do
   if [ "$cnt" -ge 3 ];then
     break;
   fi
   st=$((cnt*10+1))
   curl "https://www.googleapis.com/customsearch/v1?key=$APKEY&cx=$EGID&q=$STATISTICS&start=$st" -o $TMP
   parse;
   cnt=$((cnt+1));
 done

}

main;
exit;
```
整形した検索結果は以下のようになります

```
昨年の人権侵犯事件 いじめ、教員関係が半減 | 教育新聞,2021/03/23 ... それによると、昨年1年間に、同省の人権擁護機関が新たに救済手続きを開始した人権侵犯事件は9589件で、前年よりも5831件減少。同省の担当者は「他の統計 ...,https://www.kyobun.co.jp/news/20210323_03/
難民とLGBT：世界における人権侵害の状況 | 難民研究フォーラム ...,2020/12/24 ... マッピング. 2019年末現在、「LGBTであること」や「同性間の性行為」などを刑法において犯罪としている国をマッピング ...,https://refugeestudies.jp/2020/12/lgbt/
人権擁護委員 - Wikipedia,全国の人権擁護委員の2011年（平成23年）中の活動実績は、次のとおりである。 人権啓発活動従事回数 - 227,683回; 人権相談事件取扱件数 - 159,157件; 人権侵犯事件関与 ...,https://ja.wikipedia.org/wiki/%E4%BA%BA%E6%A8%A9%E6%93%81%E8%AD%B7%E5%A7%94%E5%93%A1
法務省：インターネットによる人権侵害をなくしましょう – Gov base,2021/04/30 ... ※プロバイダ責任制限法等については、後述の「参考」をご覧ください。 インターネットに関する人権侵犯事件の新規救済手続開始件数. 法務省の人権擁護機関 ...,https://www.gov-base.info/2021/04/30/112474
```

## 書籍の紹介
{{% amazon

title="UNIXという考え方―その設計思想と哲学 単行本 – 2001/2/23"
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










