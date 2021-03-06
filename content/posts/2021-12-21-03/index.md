---
title: "hugoで[failed to unmarshal YAML]エラーが出た場合の対処法"
date: 2021-12-22T21:22:23+09:00
draft: false
categories:
  - programming
tags:
  - error 
  - hugo
  - プログラム
image: error.jpg
---
## エラーの内容  
記事投稿時にfailed to unmarshal YAM エラーが起こった時の原因について  
hugo new ファイル名 で投稿用のエントリーを作成し、いざhugo コマンドで記事をアップしようとした時に以下のエラーが出ました。  

Start building sites … 
Total in 10 ms
Error: Error building site: "/xxxx/xxxx/xxxx.github.io/content/posts/2021-12-21-03.md:2:1": failed to unmarshal YAML: yaml: control characters are not allowed

## 原因  
このようなエラーが出る場合原因として考えられるのがファイルの文字コードがUTF-8になってないことです。  
vim でファイル名を開くと右下に文字コードが表示されますが「iso-2022-jp-3」のようになってませんでしょうか？  

## 対応  
この場合ファイルの文字コードをUTF8に変更してみましょう。  

```
nkf -wLu ファイル名 >一時保存ファイル名;
mv 一時保存ファイル名 ファイル名
```
一時保存した後にmvで戻したり面倒ですよね。

hugo new した時に日本語が含まれていたら文字コードutf8になると思われるので設定で回避できないか次回調べてみたいと思います。  
