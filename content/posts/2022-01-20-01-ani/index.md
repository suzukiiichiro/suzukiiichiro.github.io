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

