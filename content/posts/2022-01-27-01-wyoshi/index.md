---
title: "Amazon EC2でもGo言語とHugoを使えるようにする方法"
date: 2022-01-27T13:31:52+09:00
draft: false

authors: wYoshi
image: catch.jpg

categories:
  - web
tags:
  - プログラム
  - デザイナー
  - 開発
  - web
  - wyoshi
  - HTML
  - CSS
  - Webデザイナー
  - フロントエンジニア
  - コーダー
  - Hugo
  - EC2
  - AWS
---

HugoをGitHub Pagesで展開していたのですが、今回はGitHub Pagesではなく、Amazon EC2にHugoをインストールしてみたいと思います。

## GO言語をCentOS7にインストール

Hugoを利用するためにGo言語をインストールするのですが、yumでインストールすると様々ななエラーが出る場合があるので、今回はtarファイルを解凍して配置します。

brewがすでにインストールされている場合はbrewでのインストールが早いです。

### GO言語をインストール
まずは、GO言語のファイルをダウンロードして、解凍、インストールする場所に配置してやりましょう。

```
$ wget https://golang.org/dl/go1.16.linux-amd64.tar.gz
$ sudo tar zxf go1.16.linux-amd64.tar.gz -C /usr/local/
$ export PATH=$PATH:/usr/local/go/bin
```

インストールされたGoのバージョンを確認します

```
$ go version
```

インストールが成功していれば、下記のようなバージョンが表示されます。
```
go version go1.15.14 linux/amd64
```

GOROOTも確認しておきます
```
$ go env|grep GOROOT
GOROOT="/usr/local/go"
```

Hugoをインストールする上で、GOPATHが必要なので設定しましょう。
GOPATHとGOROOTが同じ場所にならないようにすることに注意してください。
同じ場所に設定してしまうと、
```
warning: GOPATH set to GOROOT (/usr/local/go) has no effect
```
といったワーニングが表示されてしまいます。
なので、GOPATHとGOROOTを別にしてやりましょう。

それではGOPATHを設定していきます。
```
vi ~/.bash_profile
```

上記のコマンドで、.bash_profileをひらいて、下記のコマンドを追加します。

```:~/.bash_profile
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$PATH:$HOME/bin
```

設定を反映させて、確認します。

```
$ source ~/.bash_profile
$ echo $GOPATH
/home/[user]/go
$ echo $PATH
/home/[user]/go/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin:/root/bin:/root/bin:/root/bin
```
無事追加できました。
以上がGo言語の設定になります。


## HugoをCentOS7にインストール
それでは、いよいよHugoをインストールしましょう。
GitHubからHugoを取得します。

```bash
mkdir $HOME/src
cd $HOME/src
git clone https://github.com/gohugoio/hugo.git
cd hugo
go install --tags extended
```
インストールできたら hugo してみましょう

## GitInfoを使っているとエラーになる場合がある
Gitのバージョンが古いと、```hugo```した際に、情報を取得できないくてエラーになってしまうようです。

```
hugo v0.93.0-DEV+extended linux/amd64 BuildDate=unknown
ERROR 2022/01/27 Failed to read Git log: Unknown option: -C
usage: git [--version] [--help] [-c name=value]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p|--paginate|--no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]
```

私の環境ではGitのバージョンが```git version 1.8.3.1``` となっていたため、これをアップデートして正しく動作するようにします。

まずはすでにインストールされているGitを削除します。
```
$ sudo yum -y remove git
```

次に、2系の配布がされているiusリポジトリを追加します。
私の環境はCentOS7だったので下記のコマンドでyumからインストールします。
```
$ sudo yum -y install https://repo.ius.io/ius-release-el7.rpm
```

iusはサードパーティのリポジトリのため、常に有効にならないように設定ファイルを確認しておきます。```enabled = 0``` となっていたら、常に有効にならない設定です。
```
[ius-debuginfo]
name = IUS for Enterprise Linux 7 - $basearch - Debug
baseurl = https://repo.ius.io/7/$basearch/debug/
enabled = 0
repo_gpgcheck = 0
gpgcheck = 1
gpgkey = file:///etc/pki/rpm-gpg/RPM-GPG-KEY-IUS-7

[ius-source]
name = IUS for Enterprise Linux 7 - Source
baseurl = https://repo.ius.io/7/src/
enabled = 0
repo_gpgcheck = 0
gpgcheck = 1
gpgkey = file:///etc/pki/rpm-gpg/RPM-GPG-KEY-IUS-7
```

それでは。インストール可能なGitを調べます。
yumでiusを使うときは、yumコマンドの際に、```--enablerepo=ius```オプションをつけます。

```
$ sudo yum list --enablerepo=ius | grep git2
…
git224.x86_64                            2.24.4-1.el7.ius             ius
…
```

インストール可能なGitがあったので、インストールをします。

```
$ sudo yum -y install --enablerepo=ius git224
```
インストールが無事完了したことを確認しましょう
```
$ git --version
git version 2.24.3
```
バージョンが表示されていたら、正常にインストールが完了してます。
これで GitInfo 使ったhugoのサーバでも```hugo```コマンドが実行できるようになりました。



## おすすめの書籍
{{% amazon title=" 改訂2版 わかばちゃんと学ぶ Git使い方入門〈GitHub、SourceTree、コマンド操作対応〉 " url="https://www.amazon.co.jp/改訂2版-わかばちゃんと学ぶ-Git使い方入門〈GitHub、SourceTree、コマンド操作対応〉-湊川-あい/dp/4863543433/?tag=nlpqueens-22" summary=` マンガと実践で学ぶGitの入門書が最新情報に対応して改訂しました! Gitの概念はもちろん、GitHubについても丁寧に解説しています。これからGitを使い始める人にオススメの1冊です。 本書ではクリック操作でGitを使えるSourceTreeを中心に解説しているので、初心者でも安心です。 せっかく学ぶなら、やっぱり楽しい方がいい 「Gitって難しそう」 「勉強しようとは思っているけど、なかなか一歩が踏み出せない」 そんな方のために、楽しくGitを理解できる本を作りました。 ・個性的なキャラクターたちが登場するマンガ ・感覚的にわかる図解 ・丁寧な実践パート 上記3つの特長で、Gitを無理なく学べます。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51ITQMzMG2L.jpg" %}}

{{% amazon title=" Markdownライティング入門　プレーンテキストで気楽に書こう！ (技術の泉シリーズ（NextPublishing）) " url="https://www.amazon.co.jp/Markdownライティング入門-プレーンテキストで気楽に書こう！-技術の泉シリーズ（NextPublishing）-藤原-惟/dp/4844398369/?tag=nlpqueens-22" summary=` 【プレーンテキストでらくらくライティング! Markdownを使いこなそう! 】 本書は、文章を書く=ライティングを「気楽に」行うための道具としての「Markdown」形式を紹介し、その使い方を詳しく解説しています。Wordなどのワープロソフトに限定されることなく、テキストエディタやMarkdown専用エディタ、ポメラなどの文書入力専用機、さらにはスマートホン上でも「見出し」や「強調」といった文章執筆に必要な情報を共有するための書式であるMarkdownの書き方やその定義や起源を、初心者でもわかりやすく紹介しています。 〈本書の対象読者〉 執筆のストレスを減らして集中したい人 PCが古くて軽いアプリで執筆したい人 いろいろなアプリで原稿を使いまわしたい人 思いついた時にスマホでメモ書きして原稿にまとめたい人 続きを読む 。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/514KHlwilvL.jpg" %}}
