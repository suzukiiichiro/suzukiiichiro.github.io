---
title: "【unComp】Bashで便利なコマンドを作ってみようって話" 
description: "今回は、シェルスクリプトとbashの解凍コマンドを使って、日常よく使う圧縮ファイルの解凍作業を簡単にしてみようって話です"
date: 2021-12-23T13:11:13+09:00
draft: false
image: 2021-12-23-bash.jpg
tags:
  - プログラミング
  - シェルスクリプト
  - Bash
  - ユーティリティ
  - 鈴木維一郎
categories:
  - プログラミング
  - シェルスクリプト
  - Bash
  - ユーティリティ
  - 鈴木維一郎
---

## 関連記事
- [【wLu】Bashで便利なコマンドを作ってみようって話](https://suzukiiichiro.github.io/posts/2021-12-23-suzuki/)
- [【unComp】Bashで便利なコマンドを作ってみようって話](https://suzukiiichiro.github.io/posts/2021-12-23-02-suzuki/)
- [【プログレスバー】Bashでプログレスバーを作ってみようって話](https://suzukiiichiro.github.io/posts/2021-12-23-03-suzuki/)

## できること
圧縮されているファイルを、ファイルの拡張子にあわせて解凍すると言う作業は、日常的に多いものです。今回は、圧縮ファイルの拡張子を判断して自動的に解凍するシェルスクリプトを作成してみます。

## 圧縮ファイルと実行コマンド、パラメータ一覧

```
  拡張子           パラメータ
  tgz | tar.gz     tar zxvf  
  tar.Z            gunzip 
  tar.bz2          tar xvfj 
  tar              tar xvfz 
  gz               gunzip 
  Z                gunzip 
  bz2              bunzip2 
  zip              unzip 
```
こうしたコマンドやパラメータを覚えておくことは大切ですが、頭の経年劣化とともに、つい思い出すことができず、Googleで検索して調べると言ったことは、往々にしてあることです。


## 実行例
```
# 圧縮ファイルを解凍する便利な unCompコマンド
$ unComp comp.tar.gz2
```

## 作成
まずファイルを作ります。ファイル名は unComp とします
```
# unComp というファイルを作成
$ :> unComp 

# vim で unComp を開く
$ vim unComp
```

unCompファイルに以下の内容を貼り付ける

```
#!/bin/bash
#
#圧縮されているファイルを解凍する
# unComp を /usr/local/bin/にコピーすると
# 通常のコマンドとして本実行ファイルを利用する事が出来ます。
#
# cp unComp /usr/local/bin/unComp
#
# 実行例
# $ unComp filename(圧縮ファイル)
#
if [ $# -ne 1 ]; then
  echo ""
  exit ;
fi
#
case $1 in
  *.tgz | *.tar.gz)   tar zxvf $1 ;;
  *.tar.Z)            gunzip $1
                      tar xvf $( echo "$1" | sed 's/\.Z$//')
                      ;;
  *.tar.bz2)          tar xvfj $1;;
  *.tar)              tar xvfz $1;;
  *.gz)               gunzip $1;;
  *.Z)                gunzip $1;;
  *.bz2)              bunzip2 $1;;
  *.zip)              unzip $1;;
  *)                  echo "ファイルの拡張子が対応していません:$1"
esac
exit ;
```

作成したファイルには日本語が含まれているため、unCompファイルを UTF-8に変換しておきます。
[wLu](https://suzukiiichiro.github.io/posts/2021-12-23-suzuki/ "wLu")をつかってUTF-8に変換するとさらに便利です。

```
# unComp ファイルをnkf -wLu でUTF-8に変換
$ nkf -wLu unComp > unComp.txt

# unComp.txtをunCompにリネームします
$ mv unComp.txt unComp

# 作成したunCompコマンドファイルを/usr/local/bin にコピーします
$ sudo unComp /usr/local/bin/

# コマンドが配置されたかを確認
$ which unComp
$ /usr/local/bin/unComp
```

### 使い方

```
# 圧縮ファイルの拡張子を気にせずをコマンド一発で解凍する
# 実行
$ unComp sample.zip
```

圧縮ファイルの拡張子に併せたコマンドを思い出したり、さらにはコマンドのパラメータをGoogleで調べたりする必要が減ります。必要に応じて、ソースにコマンドやパラメータを追加すれば、さらに拡張できます。
便利ですね。

