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

## 必要なもの
 - iPad
 - Termiusというアプリ
  [Termius: Terminal & SSH client](https://apps.apple.com/jp/app/termius-ssh-client/id549039908)
 - AWSのサーバーインスタンス
  [AWS EC2 インスタンスの作成](https://qiita.com/kanegoon/items/4bcdf5184cf1752eb44f)
 - AWSインスタンスにログインするために必要なpemファイル（キーチェイン）
 [AWS EC2にSSHでアクセスする方法](https://qiita.com/takuma-jpn/items/b2c04b7a271a4472a900)

## AWSインスタンスへの接続
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


## アカウントの作成
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

## ~/.bashrc の修正
ここでは ~/.basrcファイルを修正します。
まず、~/.basrc ファイルのバックアップをとります。
ここではファイル名先頭のピリオドを落として ls コマンドで見えるようにしておきます。

```
$ cp ~/.bashrc ~/bashrc.bak
```

では、~/.bashrc を vimで開いて編集します。

```
$ vim ~/.bashrc
```

``` bash:~/.bashrc
# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# ターミナルの表示
export PS1="bash-\v$ " ;
# 基本言語フォーマットをUTF-8へ
export LANG="ja_JP.UTF-8" ;

# User specific environment and startup programs
alias rm='rm -i' ;
alias cp='cp -i' ;
alias mv='mv -i' ;
# grepとls のカラー表示
alias grep='grep --color=auto' ;
alias ls='ls --color=auto' ;
# screen
alias s='screen -RR' ;
# Github ディレクトリへ移動
alias g='cd ~/GitHub' ;
```

編集が終わったら ~/.bashrc を再読込します。
Linux での再読込は . です

```
$ . ~/.bashrc
$ 
```

では GitHub にある様々なディレクトリを格納する Githubディレクトリを作成します。

```
$ mkdir GitHub
$ 
```

以降の github プロジェクトは今作成した GitHub ディレクトリ以下に作成します。

## ターミナルの入力で大文字と小文字を区別せずに補完する

``` bash:~/.inputrc

# 大文字小文字を区別しない
set completion-ignore-case on
# 以下日本語入力の必要がある場合に必要(なくてもよい）
set input-meta on
set output-meta on
set convert-meta off
set meta-flag on
```

編集が終わったら ~/.inputrc を再読込します。
Linux での再読込は . です

```
$ . ~/.inputrc
$ cd ~
$ pwd
/home/suzuki
$ g
$ pwd
/home/suzuki/GitHub
$
```

{{% tips-list tips %}}
ヒント
: ~/.inputrc を root ユーザーになって /etc/inputrc に追記するとすべてのユーザーが大文字小文字を区別することなくターミナルで補完することができます。
{{% /tips-list %}}


