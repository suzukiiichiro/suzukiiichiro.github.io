---
authors: suzuki
title: "iPadに開発環境を構築してみるテスト"
date: 2022-01-28T14:02:55+09:00
draft: false
image: linux.jpg
categories:
  - サーバー構築
tags:
  - Linux
  - Bash
  - 鈴木維一郎
---

## はじめに
  + まずはこちらをやりましょう。
[パソコンは不要。iPhoneやiPadなどのスマホ、タブレットでできるブログ投稿](https://suzukiiichiro.github.io/posts/2022-01-28-01-wyoshi/)



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


## screen のインストール

screen はターミナル内で複数の仮想ターミナルを起動して使うことができる画面管理ソフトです。
メリットは、

- ターミナルウインドウのタブを複数作成し、ここのタブでサーバーにログインする必要がないので、不要なセッションを作らなくてすむ。
- 開いていた端末の状態を保持しておける。
- 回線が切れる、スタンバイなどのセッション切れでもレジュームされる。
- 一つの画面をさらに分割できるので、複数端末でログ監視したいときなどに超便利。


まずはscreen がインストールされているのかの確認します。

```
$ screen -v
Screen version 4.08.00 (GNU) 05-Feb-20
$
```

インストールされていれば以下の作業はする必要がありません。
インストールされていなければ、yum コマンドでインストールして下さい。

```
$ sudo  ＜sudo で rootになります＞
#       ＜rootになると # になります>
# yum -y install screen
読み込んだプラグイン:fastestmirror
base                                                                                                                           | 3.6 kB  00:00:00
extras                                                                                                                         | 3.4 kB  00:00:00
updates                                                                                                                        | 3.4 kB  00:00:00
(1/2): extras/7/x86_64/primary_db                                                                                              | 115 kB  00:00:00
(2/2): updates/7/x86_64/primary_db                                                                                             | 2.2 MB  00:00:00
Loading mirror speeds from cached hostfile
 * base: ftp.iij.ad.jp
 * extras: ftp.iij.ad.jp
 * updates: www.ftp.ne.jp
依存性の解決をしています
--> トランザクションの確認を実行しています。
---> パッケージ screen.x86_64 0:4.1.0-0.23.20120314git3c2946.el7_2 を インストール
--> 依存性解決を終了しました。

依存性を解決しました

======================================================================================================================================================
 Package                      アーキテクチャー             バージョン                                                リポジトリー                容量
======================================================================================================================================================
インストール中:
 screen                       x86_64                       4.1.0-0.23.20120314git3c2946.el7_2                        base                       552 k

トランザクションの要約
======================================================================================================================================================
インストール  1 パッケージ

総ダウンロード容量: 552 k
インストール容量: 914 k
Downloading packages:
screen-4.1.0-0.23.20120314git3c2946.el7_2.x86_64.rpm                                                                           | 552 kB  00:00:00
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  インストール中          : screen-4.1.0-0.23.20120314git3c2946.el7_2.x86_64                                                                      1/1
  検証中                  : screen-4.1.0-0.23.20120314git3c2946.el7_2.x86_64                                                                      1/1

インストール:
  screen.x86_64 0:4.1.0-0.23.20120314git3c2946.el7_2

完了しました!
$
# rootからsuzukiにアカウントを切り換えます
$ su suzuki
# screenコマンドがどこにインストールされているのかを確認します。
$ which screen
/usr/bin/screen
$
```

## screenrc の修正
screenコマンドをさらに便利にするために screenrc ファイルを修正します。

```
# ユーザーをroot から suzuki に変えます。
$ su suzuki
$
```

以下を ~/.screenrc として作成して保存します。


``` bash:~/.screenrc

# Ctrl + z で screenの操作モードへの切り換え
escape ^Zz
# スクロールバッファを大きくする
defscrollback 10000
# ステータスバーをカスタマイズ
hardstatus on
hardstatus alwayslastline '%{= kw}%02c:%s %{= .y}%H %L=%{= .b}%-w%46>%{= .r}%n %t*%{= .b}%+w%-16=%{= .y}[%l]'
# スタートメッセージを表示させない
startup_message off
# ビープを鳴らさない
vbell off
#termの設定
term ansi
bind r
bind ^r
#

```

上記 ~/.bashrc の修正で、screenコマンドの呼び出しを s にしています。

``` bash:~/.bashrc の抜粋

# screen
alias s='screen -RR' ;

```

ですので、ターミナルからは s だけで screen -RR コマンドを実行したことと同じになります。

```
# screenの起動
$ screen 
# screenの終了
$ exit
$
# screenの起動
$ s
# screenの終了
$ exit
```

~/.bashrc にエイリアスを作成していなければ screen で起動しますし、~/.bashrcにエイリアスを作成していれば（ここでは「s」） $ s で一発起動します。screenを抜けるときは「exit」です。

## screen を使ってみます

  + screen の起動(screen)
まず screen を起動しなくては始まりません。 ログインしたターミナルで「screen」と打てば screen が起動します。 screen から抜けるには普通にログアウトするように 「exit」 や [Ctrl+d]で抜けられます。

  + 新しいウィンドウを開始する([Ctrl+c])
「[Ctrl+c]」で新しいウィンドウを開始できます。 幾つでも作れます。 不要になったウィンドウは 「exit」 や [Ctrl+d] で消せます。

  + 次のウィンドウに移動する([Ctrl+n])
開いている隣のウインドウに移動します。カスタマイズした~/.screenrcを使っている人はステータスバーで確認できて便利です。

  + 詳しくはこちら
  [Linux screenコマンド使い方](https://qiita.com/hnishi/items/3190f2901f88e2594a5f)


{{% tips-list tips %}}
ヒント
: screen は王者のコマンドです。プログラマーの多くはローカルのターミナルでタブを作成します。screen はサーバー上で仮想端末を作成します。screenはvim同様、プログラマーを選びます。Linuxを語るなら vim と screen そして bash の習熟が必須なのです。
{{% /tips-list %}}


## sudoユーザーを追加する方法
sudoユーザーに追加していないユーザーでsudoコマンドを実行すると、

```
$ sudo less /etc/passwd
[sudo] password for suzuki: 
suzuki is not in the sudoers file.  This incident will be reported.
```

こんな事を言われます。
ということで、ここでは特定のユーザー（ここでは「suzuki」）がsudoコマンドを実行できるようにします。

/etc/sudoers ファイルにユーザーを追加します。

まずはrootユーザーになります。

ユーザーsuzuki をぬけてrootになります。

```
$ exit
```

現在のグループを確認します。

```
# sudo vim /etc/sudoers
```

以下の記述があれば wheelグループに suzukiを追加すればよいです。

``` bash:/etc/sudoersの抜粋

## Allow members of group sudo to execute any command
%wheel   ALL=(ALL:ALL) ALL
```

ではまず現状を確認します。

```
# cat /etc/group | grep suzuki
```

sudoのグループ（centosなら wheel) に suzuki を追加します。

```
# sudo usermod -G wheel suzuki
```

確認します。

```
# cat /etc/group | grep suzuki
wheel:x:10:suzuki
suzuki:x:1001:
#
```

これで、ローカルアカウント suzuki で、必要に応じて sudoコマンドをつかって安全に作業することができるようになりました。

{{% tips-list tips %}}
ヒント
: 当たり前の話ではありますが、root で作業するのはやめましょう。必要に応じて $ su すればよいのです。Linux/Unixとはそういうものなのです。
{{% /tips-list %}}



## おすすめの書籍
{{% amazon title=" iPad完全マニュアル2022(全機種対応/基本操作から活用技まで詳細解説) " url="https://www.amazon.co.jp/iPad完全マニュアル2022-全機種対応-基本操作から活用技まで詳細解説-standards/dp/4866365285/?tag=nlpqueens-22" summary=` iPadをしっかり使いこなすための決定版ガイドブック。 iPadOS 15に対応した最新版です。 2021年発売の最新モデルはもちろん、すべてのiPad Pro、iPad Air、iPad、iPad miniの全モデル ホームボタン搭載/非搭載含めすべての機種に対応します。 ` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51Vmx-LPwGL.jpg" %}}

{{% amazon title=" AWSではじめるインフラ構築入門 安全で堅牢な本番環境のつくり方 " url="https://www.amazon.co.jp/AWSではじめるインフラ構築入門-安全で堅牢な本番環境のつくり方-中垣-健志/dp/4798163430/?tag=nlpqueens-22" summary=` AWSのネイティブ機能を組み合わせて 安全かつ堅牢なインフラを構築・運用 本書は、AWS(Amazon Web Services)を利用して、 インフラを構築/運用する方法を解説する入門書です。 クラウドでネットワーク&サーバー構築を行うために必要な基礎知識や、 AWSのネイティブ機能を組み合わせて安全かつ堅牢なインフラを構築/運用 するための設定方法やノウハウを解説します。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/511vlSp5gZL.jpg" %}}


<!-- EOL -->
