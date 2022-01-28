---
title: "iPadに開発環境を構築してみるテスト"
date: 2022-01-28T14:02:55+09:00
draft: false
authors: suzuki
image: linux.jpg
categories:
  - サーバー構築
tags:
  - Linux
  - Bash
  - 鈴木維一郎
---

# 必要なもの
 - iPad
 - Termiusというアプリ
  [Termius: Terminal & SSH client](https://apps.apple.com/jp/app/termius-ssh-client/id549039908)
 - AWSのサーバーインスタンス
  [AWS EC2 インスタンスの作成](https://qiita.com/kanegoon/items/4bcdf5184cf1752eb44f)
 - AWSインスタンスにログインするために必要なpemファイル（キーチェイン）
 [AWS EC2にSSHでアクセスする方法](https://qiita.com/takuma-jpn/items/b2c04b7a271a4472a900)

# AWSインスタンスへの接続
pemファイルをスマホに送る
インスタンスを作るときにpemファイルをダウンロードしたと思います
（してなかったら、pemファイルは一回しかダウンロードさせてくれないのでインスタンスを作り直しましょう）
このpemファイルをＰＣのエディターで開き、内容をテキストファイルにペーストします。
このファイルをＬＩＮＥなりメールなりGoogleドライブなりでスマホに送ります。

pemファイルをTermiusで読み込みます
 - ＰＣ上で鍵ファイル(.pem)をテキスト化してiPadで内容をコピーして貼り付けられるようにしておくことが重要です。
[iPad Proでsshクライアント「Termius」を使ってみた
](https://tomikyblog.com/termiusを使ってみた)
[iPadからAWSのEC2インスタンス(LINUX)にSSH接続する方法](https://pkunallnet.com/pcinfo/apple/ipad-aws-linuxconnection/)


# アカウントの作成
rootでの作業でも良いのですが、一般論としてここではアカウントの作成から説明します。

まずは、サーバーに接続します。

```
centos$ 
```

いわゆるrootでログインした訳です。
ここでユーザー名 suzuki を追加します。

```
centos$ useradd suzuki
```

さらに suzuki のパスワードも設定します。

``` 
centos$ passwd suzuki
```

パスワードは２回同じ入力を求められます
では rootからsuzukiにアカウントを切り換えます。
ユーザーの切り替えは su コマンドを使います。

```
centos$ su suzuki
パスワード：
suzuki$ 
```

suzukiに切り替わりました。
自分自身がどこにいるのかを確認します。
カレントディレクトリの確認は pwd コマンドを使います。
ディレクトリの移動は cd コマンド
ホームディレクトリは ~ で表します。
ホームディレクトリへの移動は cd ~ となります。

```
centos$ pwd
/home/centos
$ cd ~ 
$ pwd 
$ /home/suzuki
$
```


