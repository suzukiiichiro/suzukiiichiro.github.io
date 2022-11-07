---
title: "知識ゼロからのe-Statマイニング"
date: 2021-12-24T18:12:54+09:00
draft: false 
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
image: anal.jpg
---
知識ゼロからのe-Statマイニング  
日頃から大量のデータを使ってデータマイニングしてみたいなと思って暇なときにサイトを巡回していたらe-Statという日本の統計が閲覧できる政府統計ポータルサイトを発見しました。  
アイスの売り上げから子供の平均身長まで大量の統計資料が公開されており、しかもAPIまであるすごいサイトです。 このe-Statをマイニングしてみようと思います。
まずはAPIを叩くところまでやってみます。  

## まずはアプリケーションIDを取得しよう

APIを叩くにはアプリケーションIDが必要です。 
まずはアプリケーションIDを取得しましょう。  
アプリケーションIDを取得するにはユーザー登録が必要です。以下のURLから手順に従ってユーザー登録してください。  

https://www.e-stat.go.jp/mypage/user/preregister

アプリケーションIDはログイン後マイページ内のAPI機能(アプリケーションID発行)で取得できます。  

https://www.e-stat.go.jp/mypage/view/api

入力項目は名称、URL、概要の３つです。  
名称、概要は適当で大丈夫です。  
URLは、http://localhostだと私はダメだったのでこのサイトのURLを設定しました。  

発行ボタンを押すとappIdにアプリケーションIDが払い出されます。  

## APIを叩いてみよう
APIの仕様は以下のURLに記載されています。  

https://www.e-stat.go.jp/api/api-info/e-stat-manual3-0

難しいです。  
なんとなく、「統計表情報取得」でリストを取得して、「メタ情報取得」「統計データ取得」で個別のデータを取得する感じでしょうか？  
まずは叩いてみます。

## 統計表情報取得

```
curl "http://api.e-stat.go.jp/rest/1.0/app/getStatsList?appId=xxxxxxxxx&lang=J&searchKind=&searchWord="

<LIST_INF id="0003384123">
            <STAT_NAME code="00100409">国民経済計算</STAT_NAME>
            <GOV_ORG code="00100">内閣府</GOV_ORG>
            <STATISTICS_NAME>四半期別ＧＤＰ速報 過去の値 1次速報値</STATISTICS_NAME>
            <TITLE>形態別国内家計最終消費支出 年度デフレータ—　前年度比（1981年～）（2000暦年＝100）</TITLE>
            <CYCLE>四半期</CYCLE>
            <SURVEY_DATE>201007-201009</SURVEY_DATE>
            <OPEN_DATE>2020-04-01</OPEN_DATE>
            <SMALL_AREA>0</SMALL_AREA>
        </LIST_INF>


```
LIST_INF idの「0003384123」」が個別データのidみたいです。これを使ってメタ情報取得、統計情報取得を呼び出します。  

##メタ情報取得  
```
curl "http://api.e-stat.go.jp/rest/1.0/app/getMetaInfo?appId=xxxxxxxx&lang=J&statsDataId=0003384123"

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<GET_META_INFO xsi:noNamespaceSchemaLocation="https://api.e-stat.go.jp/rest/1.0/schema/GetMetaInfo.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <RESULT>
        <STATUS>0</STATUS>
        <ERROR_MSG>正常に終了しました。</ERROR_MSG>
        <DATE>2021-12-24T18:35:07.926+09:00</DATE>
    </RESULT>
    <PARAMETER>
        <LANG>J</LANG>
        <STATS_DATA_ID>0003384123</STATS_DATA_ID>
    </PARAMETER>
    <METADATA_INF>
        <TABLE_INF id="0003384123">
            <STAT_NAME code="00100409">国民経済計算</STAT_NAME>
            <GOV_ORG code="00100">内閣府</GOV_ORG>
            <STATISTICS_NAME>四半期別ＧＤＰ速報 過去の値 1次速報値</STATISTICS_NAME>
            <TITLE>形態別国内家計最終消費支出 年度デフレータ—　前年度比（1981年～）（2000暦年＝100）</TITLE>
            <SURVEY_DATE>201007-201009</SURVEY_DATE>
        </TABLE_INF>
        <CLASS_INF>
            <CLASS_OBJ id="tab" name="表章項目" description="Excelの書式設定で統計表の数値を&quot;-0.0&quot;としている場合、データベース上&quot;0.0&quot;として収録されているため、Excel統計表の数値とは必ずしも一致しない。">
                <CLASS code="17" name="前年度比" level="" unit="％"/>
            </CLASS_OBJ>
            <CLASS_OBJ id="cat01" name="形態別国内家計最終消費支出">
                <CLASS code="11" name="家計最終消費支出（再掲）" level="1"/>
                <CLASS code="12" name="家計最終消費支出（再掲）_居住者家計の海外での直接購入" level="2"/>
                <CLASS code="13" name="家計最終消費支出（再掲）_（控除）非居住者家計の国内での直接購入" level="2"/>
                <CLASS code="14" name="家計最終消費支出（再掲）_国内家計最終消費支出" level="2"/>
                <CLASS code="15" name="家計最終消費支出（再掲）_国内家計最終消費支出_耐久財" level="3"/>
                <CLASS code="16" name="家計最終消費支出（再掲）_国内家計最終消費支出_半耐久財" level="3"/>
                <CLASS code="17" name="家計最終消費支出（再掲）_国内家計最終消費支出_非耐久財" level="3"/>
                <CLASS code="18" name="家計最終消費支出（再掲）_国内家計最終消費支出_サービス" level="3"/>
            </CLASS_OBJ>
            <CLASS_OBJ id="time" name="時間軸（年度）">
                <CLASS code="1981100000" name="1981年度" level="1"/>
                <CLASS code="1982100000" name="1982年度" level="1"/>
                <CLASS code="1983100000" name="1983年度" level="1"/>
                <CLASS code="1984100000" name="1984年度" level="1"/>
                <CLASS code="1985100000" name="1985年度" level="1"/>
                <CLASS code="1986100000" name="1986年度" level="1"/>
                <CLASS code="1987100000" name="1987年度" level="1"/>
                <CLASS code="1988100000" name="1988年度" level="1"/>
                <CLASS code="1989100000" name="1989年度" level="1"/>

```
上の方がデータ内容の説明なのか？よくわかりません。  

## 統計情報取得
```
curl "http://api.e-stat.go.jp/rest/1.0/app/getStatsData?limit=10000&appId=xxxxxxxxxx&lang=J&statsDataId=0003384123&metaGetFlg=N&cntGetFlg=N"

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<GET_STATS_DATA xsi:noNamespaceSchemaLocation="https://api.e-stat.go.jp/rest/1.0/schema/GetStatsData.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <RESULT>
        <STATUS>0</STATUS>
        <ERROR_MSG>正常に終了しました。</ERROR_MSG>
        <DATE>2021-12-24T18:37:22.156+09:00</DATE>
    </RESULT>
    <PARAMETER>
        <LANG>J</LANG>
        <STATS_DATA_ID>0003384123</STATS_DATA_ID>
        <DATA_FORMAT>X</DATA_FORMAT>
        <START_POSITION>1</START_POSITION>
        <LIMIT>10000</LIMIT>
        <METAGET_FLG>N</METAGET_FLG>
        <CNT_GET_FLG>N</CNT_GET_FLG>
    </PARAMETER>
    <STATISTICAL_DATA>
        <TABLE_INF id="0003384123">
            <STAT_NAME code="00100409">国民経済計算</STAT_NAME>
            <GOV_ORG code="00100">内閣府</GOV_ORG>
            <STATISTICS_NAME>四半期別ＧＤＰ速報 過去の値 1次速報値</STATISTICS_NAME>
            <TITLE>形態別国内家計最終消費支出 年度デフレータ—　前年度比（1981年～）（2000暦年＝100）</TITLE>
            <SURVEY_DATE>201007-201009</SURVEY_DATE>
            <TOTAL_NUMBER>232</TOTAL_NUMBER>
            <FROM_NUMBER>1</FROM_NUMBER>
            <TO_NUMBER>232</TO_NUMBER>
        </TABLE_INF>
        <DATA_INF>
            <NOTE char="***">数字が得られないもの</NOTE>
            <NOTE char="-">数字が得られないもの</NOTE>
            <VALUE tab="17" cat01="11" time="1981100000" unit="％">3.8</VALUE>
            <VALUE tab="17" cat01="11" time="1982100000" unit="％">2.3</VALUE>
            <VALUE tab="17" cat01="11" time="1983100000" unit="％">2</VALUE>
            <VALUE tab="17" cat01="11" time="1984100000" unit="％">2.2</VALUE>
            <VALUE tab="17" cat01="11" time="1985100000" unit="％">1.2</VALUE>
            <VALUE tab="17" cat01="11" time="1986100000" unit="％">0.1</VALUE>
            <VALUE tab="17" cat01="11" time="1987100000" unit="％">0.5</VALUE>
            <VALUE tab="17" cat01="11" time="1988100000" unit="％">0.5</VALUE>
            <VALUE tab="17" cat01="11" time="1989100000" unit="％">2.5</VALUE>

```
VALUEが値みたいですがどういう列情報になっているのでしょうか？  
とりあえずAPIはお手軽に叩けることがわかりました。  
次回以降はデータの内容を理解していこうと思います。


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










