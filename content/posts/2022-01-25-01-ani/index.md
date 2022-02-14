---
title: "e-Stat hampelで時系列データの異常値検知"
description: "e-Statの統計データhampelを使って時系列データの異常値検知試みます。"
date: 2022-01-24T13:50:13+09:00
draft: false
image: anal.jpg
categories:
  - programming 
tags:
  - e-Stat 
  - データマイニング
  - プログラム
---
## hampelによる異常値部分を追加しよう
前回はgoogle custom search の検索結果を利用して社会的に関心の高そうな列の抽出を試みました。
今回は、以前紹介したhampelによる時系列データの異常値検知を組み込んで見たいと思います。
前回取得した「人権侵犯事件の種類別」ごとにtime_code、valueをまとめcsvにしてhampelメソッドを適用します。
time_codeは月次なのですが、月ごとの事件数はかなりムラがあって比較が難しいので年次にまとめます。

```
私人等に関するもの_暴行・虐待_家族間のもの_夫の妻に対するもの
date,value
2007,2537
2008,2645
2009,2461
2010,2250
2011,2242
2012,2031
2013,1683
2014,1477
2015,1352
2016,1297
2017,1113
2018,900
2019,782
2020,534
```

コロナの影響なのか結構急激に下がっているのに検知しませんでした。
母数が流石に少なすぎるのかちょっと見直しが必要ですね。
閾値を色々変えてみましたがだめでした。
残念です。
年次のものについては一旦前の年との増減分を比較して閾値を超えたらアラートをあげるようにしようと思います。

## プログラム
プログラムは以下の通りです。
シェルプログラムから以前作ったhampelメソッドのpython を呼び出しています。
grep -e "^$nyear" -e "^$lyear" で直近２年間に異常値があった場合のみ検知するように絞りをかけています。

```
function getHampel(){
  echo "$column"|while read line;do
    cat "$STCSV"|grep "総数"|grep ",\"$line\","|$AWK -F, '{print $7","$10;}'|$SED -e "s|\"||g" > "$TMPHCSV";
    #月次だとムラがあって比較が難しいので年次にする
    years=$(cat "$TMPHCSV"|cut -c 1-4|sort|uniq -c|grep "^  12"|$AWK '{print $2;}');
    echo "date,value" > "$TMPHYCSV"
    echo "$years"|while read year;do
      local mcnt=$(cat "$TMPHCSV"|grep "^$year"|$AWK -F, '{print $2;}'|$AWK '{sum+=$0} END{print sum;}');
      echo "$year,$mcnt" >>"$TMPHYCSV";
    done
    #0:date:2021001111 value:5230
    nyear=$(date +%Y);
    lyear=$((nyear-1));
    hampelalert=$(python gethampel.py "$TMPHYCSV"|grep -e "^$nyear" -e "^$lyear"|tr "\n" ":");
    if [ -n "$hampelalert" ];then
      echo "$line,$hampelalert";
    fi
  done
}
```

