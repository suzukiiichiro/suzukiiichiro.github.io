---
title: "プライバシーポリシーページを設置する"
date: 2021-12-22T17:40:27+09:00
draft: false
categories:
  - web
tags:
  - github pages 
  - google adsense
image: privacy.jpg
---
github pagesでもgoogle adsenseの審査に通過したい！  

ということで色々先人の方達のサイトをみさせていただいたところ  

google adsenseを通過するためにはプライバシーポリシーが必要ということで準備しました。  

## 内容はとりあえずコピペで行こう
まずはコピペOKの親切な方のサイトを探します。  

内容については以下のサイトを参考にさせていただきました。  
http://liberty-life-blog.com/wordpress/privacy-policy/  


## 設定
以下のコマンドでhugoでページを作成します。  

```
hugo new page/privacy.md
```

コンテンツの構成を以下のように管理しているのでpage以下に保存しました。
content/posts   -- 記事
       /page    -- about usページなど
       /assetes -- 画像など

```
vim content/page/privacy.md
``` 
```
---
title: "Privacy"
date: 2021-12-22T17:16:15+09:00
draft: false                                                              
---
```

ページの内容を２個目の---以下に貼り付けます
draft: true に変更します

```
hugo
``` 
ビルドします

## フッターにリンクを置こう  
フッターの内容を修正してプライバシーポリシーのリンクを設置します。  
themes以下にあるファイルを直接書き換えるのではなく   
layoutsフォルダ以下に同名のファイルを作成することで上書きすることができるみたいです。   

layouts/partial/footer/footer.html<--優先順位高い  
themes/テーマ名/layouts/partial/footer/footer.html   


layouts/partial/footer/footer.html を新規に作成して 
以下の内容を入力 

```
<footer class="site-footer">
<a href="{{ .Site.BaseURL }}privacy/">プライバシーポリシー</a>
    <section class="copyright">
        &copy;
        {{ if and (.Site.Params.footer.since) (ne .Site.Params.footer.since (int (now.Format "2006"))) }}
            {{ .Site.Params.footer.since }} -
        {{ end }}
        {{ now.Format "2006" }} {{ .Site.Title }}
    </section>
</footer>
```
リンクの書き方が  
{{ .Site.BaseURL }}privacy/  
のは注意  
