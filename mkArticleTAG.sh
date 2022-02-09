#!/bin/bash

: '使い方
一つ目のパラメーターに作成者を指定します
二つ目のパラメータにナンバリングを指定します
一つ目 01(未指定の場合は01）
二つ目 02
三つ目のパラメータにはタグを指定します

（例)
$ bash mkArticle.sh suzuki 01 echo ;

'
#
#作成者 無指定であれば入力を促す
author=$1;  
#今日の日付
today=$(date "+%Y-%m-%d%n");
#今日のインデクス 一つ目の投稿であれば01 二つ目の投稿であれば02
number="$2";
#タグ 必要であれば
tag="$3";
#
function getParam(){
  if [ -z "$number" ]; then
    number="01";
  fi
  #
  if [ -z "$author" ]; then
    echo "ユーザー名を半角で入力";
    read author; 
  fi
  if [ -z "$tag" ]; then
    echo "タグがあれば半角で入力（空白でも結構)";
    read tag; 
  fi
  #
  while [ true ] ;do
    if [ -f "content/posts/$today-$number-$tag-$author/index.md" ]; then
      echo "$number ファイルが既に存在します。";
      echo "別のナンバリングを指定して下さい 02とか03とか";
      read number;
    else
      break;
    fi
  done
}
#
function execHugo(){
  echo "";
  echo "hugoコマンドを実行します";
  echo "hugo new posts/$today-$number-$tag-$author/index.md"
  hugo new posts/$today-$number-$tag-$author/index.md

  # 処理終了
  echo "ファイルの編集は以下の通りです。"
  echo "vim content/posts/$today-$number-$tag-$author/index.md;"
}
#
# パラメータの取得
getParam;
# hugoコマンドの実行
execHugo;
exit;
#
