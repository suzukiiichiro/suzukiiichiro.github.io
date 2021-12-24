---
title: "知識ゼロからのe-Statマイニング"
date: 2021-12-24T18:12:54+09:00
draft: true
categories:
  - プログラミング
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
            <TITLE>形態別国内家計最終消費支出 年度デフレータ―　前年度比（1981年～）（2000暦年＝100）</TITLE>
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
            <TITLE>形態別国内家計最終消費支出 年度デフレータ―　前年度比（1981年～）（2000暦年＝100）</TITLE>
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
            <TITLE>形態別国内家計最終消費支出 年度デフレータ―　前年度比（1981年～）（2000暦年＝100）</TITLE>
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
