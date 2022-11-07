---
title: "e-Stat でGoogle Custom Search APIを使おう（４）"
description: "Google Custom Search APIの検索結果とe-Statの統計データをマッチングして社会的に関心のある項目を抽出してみます"
date: 2022-01-21T13:50:13+09:00
draft: false
image: anal.jpg
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## Google Custom Search APIの検索結果と統計名の列名をマッチンングさせる

今回は、前回取得したGoogle Custom Search APIの検索結果と統計名の列名をマッチンングさせて社会的に関心の高い列名を取得してみたいと思います。  

今回は「人権侵犯事件統計」 を取り扱ってみたいと思います。  
人権侵犯事件統は、法務省の人権擁護機関で取り扱った人権侵犯事件及び人権相談に関する統計報告を集計したものとのことです。  

## e-Stat から統計データを取得する
まずはe-StatのAPIにアクセスして統計データを取得します。  
将来的には新着の統計データを日時で取得して処理するようにしますが、今回は「人権侵犯事件統計」だけ取得します。  

```
curl -s "http://api.e-stat.go.jp/rest/3.0/app/getSimpleStatsData?appId=xxxxxxxxxxxxxxxxxx&lang=J&statsDataId=0003286680&metaGetFlg=Y&cntGetFlg=N&explanationGetFlg=Y&annotationGetFlg=Y&sectionHeaderFlg=1&replaceSpChars=0" -o "$STCSV"
```


## 統計データの中身を見てみる

```
"RESULT"
"STATUS","0"
"ERROR_MSG","正常に終了しました。"
"DATE","2022-01-21T09:58:51.856+09:00"
"RESULT_INF"
"TOTAL_NUMBER","403425"
"FROM_NUMBER","1"
"TO_NUMBER","100000"
"NEXT_KEY","100001"
"TABLE_INF","0003286680"
"STAT_NAME","00250010","人権侵犯事件統計"
"GOV_ORG","00250","法務省"
"STATISTICS_NAME","人権侵犯事件統計"
"TITLE","","人権侵犯事件 種類別　人権侵犯事件の受理及び
処理件数　（月次）"
"CYCLE","月次"
"SURVEY_DATE","201801"
"OPEN_DATE","2022-01-20"
"SMALL_AREA","0"
"COLLECT_AREA","該当なし"
"MAIN_CATEGORY","14","司法・安全・環境"
"SUB_CATEGORY","01","司法"
"OVERALL_TOTAL_NUMBER","0"
"UPDATED_DATE","2022-01-20"
"STATISTICS_NAME_SPEC","人権侵犯事件統計","","","","",""
"TITLE_SPEC","人権侵犯事件","種類別　人権侵犯事件の受理
及び処理件数　（月次）","処理の合計件数と，その内訳であ
る措置，措置猶予，侵犯事実不存在，侵犯事実不明確，打切>り，中止，移送及び啓発の各件数の合計とが一致しない場合>があるのは，１つの事件につき複数の措置を採る場合がある>こと等による。","","",""
"VALUE"
"tab_code","表章項目","cat01_code","人権侵犯事件の受理>・処理別","cat02_code","人権侵犯事件の種類別","time_code","時間軸(月次)","unit","value","annotation"
"100","件数","100","総数","100","総数","2021001111","2021年11月","件","1430",""
"100","件数","100","総数","100","総数","2021001010","2021年10月","件","1329",""
```


データの中身を見てみると"VALUE"から上がヘッダー的な項目で、データは"VALUE"以下にありそうです。  
VALUE より上の行を削除しましょう。  
sed でマッチした行より上を削除する方法ががあると良いのですがわからないのでgrepと組み合わせます。  

grep -n でマッチした行数を取得できます。  

sed -e "1,26d" で1行目から26行目までを削除できます  

```
"tab_code","表章項目","cat01_code","人権侵犯事件の受理・処理別","cat02_code","人権侵犯事件の種類別","time_code","時間軸(月次)","unit","value","annotation"
"100","件数","100","総数","100","総数","2007000101","2007年1月","件","2170",""
.
.
"100","件数","100","総数","130","私人等に関するもの","2021001111","2021年11月","件","1230",""
```

VALUE以下の内容を見てみると「_code」はコードが入るだけなので無視して良さそうです。  
表章項目も「件数」しかないので無視して良さそうです。  
時間軸、unite、value、annotationもいらなそうです。  
「人権侵犯事件の受理・処理別」は  
```
"旧受"
"総数"
"新受_計"
"新受_申告_委員受"
"新受_申告_職員受"
"新受_人権擁護委員の通報"
"新受_関係行政機関の通報"
"人権侵犯事件の受理・処理別"
```

これは一旦は総数だけ使えば良さそうです  

「人権侵犯事件の種類別」は  
```
"総数"
"私人等に関するもの"
"私人等に関するもの_売春"
"私人等に関するもの_その他"
"私人等に関するもの_村八分"
"私人等に関するもの_交通事故"
"私人等に関するもの_人身売買"
.
.
.
```

人権侵犯事件の種類が並べられています。この部分から社会的関心の高いものを抽出できると良さそうですね。  

抽出対象の列をどこにするのかも将来的に自動化したいのですが今回は固定で「人権侵犯事件の種類別」の列を抽出対象にしたいと思います。  

## mecabを使ってマッチングキーワードを最適化する

```
  cat "$STCSV"|$SED -e "1,$((vnum+1))d"|$AWK -F, '{print $6;}'|sed -e "s|\"||g"|sort|uniq;
```
  
```
"私人等に関するもの_売春"
"私人等に関するもの_その他"
"私人等に関するもの_村八分"
"私人等に関するもの_交通事故"
"私人等に関するもの_人身売買"
"私人等に関するもの_医療関係"
"私人等に関するもの_私的制裁"
"私人等に関するもの_差別待遇_女性"
"私人等に関するもの_差別待遇_その他"
"私人等に関するもの_差別待遇_外国人"
"私人等に関するもの_差別待遇_性自認"
```

「私人等に関するもの_交通事故」という文字列はニュースなどではそのまま使われないでしょうからそのままgoogle custom search  の検索結果にマッチングをかけてもダメそうです。  
mecab   を使って文字列を分解してマッチングをかけたいと思います。  

mecabはオープンソースの形態素解析エンジンです入力した文字列を構文解析してくれます。  

```
echo "私人等に関するもの_差別待遇_女性"|mecab
```

```
私人	名詞,一般,*,*,*,*,私人,シジン,シジン
等	名詞,接尾,一般,*,*,*,等,トウ,トー
に関する	助詞,格助詞,連語,*,*,*,に関する,ニカンスル,ニカンスル
も	助詞,係助詞,*,*,*,*,も,モ,モ
の	助詞,連体化,*,*,*,*,の,ノ,ノ
_	名詞,サ変接続,*,*,*,*,*
差別	名詞,サ変接続,*,*,*,*,差別,サベツ,サベツ
待遇	名詞,サ変接続,*,*,*,*,待遇,タイグウ,タイグー
_	名詞,サ変接続,*,*,*,*,*
女性	名詞,一般,*,*,*,*,女性,ジョセイ,ジョセイ
EOS
```

取り出すのは名詞だけで良さそうですし、名詞でも1文字だけのものは除外したほうが良さそうですね  

```
echo "私人等に関するもの_差別待遇_女性"|mecab|grep "名詞"|awk '{print $1;}'|grep -v ^.$
```

```
私人
差別
待遇
女性
```

## マッチングしてみる

このキーワードでgoogle custom search  の検索結果にマッチングをかけカウント数を取得して見ましょう。  

```
11,私人等に関するもの_強制・強要_家族間のもの_親の子に対するもの
11,私人等に関するもの_社会福祉施設関係_施設職員によるもの
14,私人等に関するもの_差別待遇_同和問題（うち公務員によるもの）
18,私人等に関するもの_社会福祉施設関係_施設職員によるもの（うち公営の施設に従事する職員によるもの）
19,私人等に関するもの_プライバシー関係_インターネット（うち同和問題に関する侵犯）
```

インターネットがマッチしたのは良いのですが「同和問題」の中の「問題」の部分でカウント数を稼いでしまって思うような感じにはなりません。  
「もの」とかもカウント数を稼いでいるので汎用的なキーワードを除外する処理を入れる必要がありそうです。  

自動化の道のりは遠いですね。  

## プログラム
```
function getStatistics(){
  :
  #curl -s "http://api.e-stat.go.jp/rest/3.0/app/getSimpleStatsData?appId=$ESID&lang=J&statsDataId=0003286680&metaGetFlg=Y&cntGetFlg=N&explanationGetFlg=Y&annotationGetFlg=Y&sectionHeaderFlg=1&replaceSpChars=0" -o "$STCSV"
}
function matchGcs(){
  #VALUEより上の行を削除する 
  vnum=$(cat "$STCSV"|grep -n "VALUE"|$AWK -F: '{print $1;}')
  echo "$vnum"
  cat "$STCSV"|$SED -e "1,$((vnum+1))d"|$AWK -F, '{print $6;}'|$SED -e "s|\"||g"|sort|uniq|while read line;do
    local mcnt=$(echo "$line"|mecab|grep "名詞"|awk '{print $1;}'|grep -v -e ^.$|while read word;do
      cat "$GCSCSV"|grep "$word"|wc -l      

    done| awk '{sum+=$0} END{print sum;}');
    echo "$mcnt,$line"

  done|sort|uniq|sort -n  

}
function main(){
  #統計名でgoogle cloud searchを検索する
  getGcs;<---前回作成したもの
  #統計データを取得する
  getStatistics;
  #統計データの列情報とgoogle cloud searchの検索結果をマッチングする
  matchGcs;

}

main;
exit;
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










