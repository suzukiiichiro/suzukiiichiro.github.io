---
title: "【set -x】bash/シェルスクリプトマニアックコマンドあれこれ１２"
date: 2022-11-10T10:28:21+09:00
draft: false
authors: suzuki
image: bash.jpg
categories:
  - programming
tags:
  - マニアックコマンド
  - シェルスクリプト
  - コマンド活用
  - Bash
  - 鈴木維一郎
---

## スクリプトのデバッグ

Bashは広範なデバッグ機能を提供しています。

デバッグの方法は３種類あります

１．ターミナルの実行時に -x オプションを付与する

```
$ bash -x helloScript.sh
```

２．ソースコードの冒頭のシェバンに -x オプションを付与する

``` bash:debug.sh
#!/bin/bash -x
:
:
```


３．デバッグの開始点と終了点を決めてデバッグ
デバッグの開始点にコマンド 'set -x'終了点には 'set +x' と書きます。


``` bash:debug2.sh
#!/bin/bash 

set -x
echo "置き換えたいファイル名を入寮して下さい。"
read fileName
set +x

if [[ -f "$fileName" ]]; then
  sed -e "s/Linux/Unix/g" "$fileName";
else
  echo "$fileName はありません。";
fi
```

```
$ bash test
+ echo 置き換えたいファイル名を入寮して下さい。
置き換えたいファイル名を入寮して下さい。
+ read fileName
grepfile.txt
+ set +x
This is Unix
This is Windows
This is MAC
This is Unix
This is Windows
This is MAC
This is Unix
This is Windows
This is MAC
This is Unix
This is Windows
This is MAC
$
```


``` bash:debug3.sh
#!/bin/bash

# デバッグ開始
set -x

var1=`date +%M`

# デバッグ終了
set +x

var2=`ls -1 | wc -l`
var3="DEBUG TEST"

exit 0
```

```
$ bash debug3.sh
++ date +%M
+ var1=56
+ set +x
$
```


{{% tips-list tips %}}
ヒント
: 色々と便利なbashですが、これからも便利な書き方があれば更新してきます。
{{% /tips-list %}}
