---
title: "Hugoで記事の投稿の仕方"
date: 2021-12-21T18:08:57+09:00
draft: false
description: "Hugoで記事を投稿する方法を説明しています"
image: 2021-12-21-1.jpg
categories:
  - Web開発
tags:
  - Hugo
  - Web
  - Web開発
# ファイル名を変える場合
# slug: "example-post"
---

```shell
$ hugo new posts/[ファイル名].md
$ vim content/posts/2021-12-21.md
```

`draft: false` にする事でドラフトを公開にすることができる


ビルドする
```shell
$ hugo
```



