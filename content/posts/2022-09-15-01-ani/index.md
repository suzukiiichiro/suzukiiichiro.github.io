---
title: "NQueen日記 2022/09/15"
description: "NQueenのロジックを研究してます。日々NQueenで試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-09-15T09:55:55+09:00
draft: false 
image: chess.jpg
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 9月15日

グラフ理論を使ってエイトクイーンを解く方法があるらしい。 

NetworkXを使ってエイト・クイーンパズルを解く 
https://analytics-note.xyz/graph-theory/networkx-eight-queens-puzzle/ 

まず、すべて効き筋同士をノードをつないぐ補グラフという仕組みを使うと、 
効き筋を通らない道筋を取得できfind_cliquesメソッドを使うと一発で解がわかるものみたい。 

まず、すべて効き筋同士をノードをつないだリストを作らないと行けないので行数が多くなるとメモリが足りなくなるので全てをエイトクイーンではできなさそう。 

でも、2行だけとか２列だけとかには使えそうなので調べてみると面白いかも。 


pythonの初歩的なプログラムでちょっとつまったのでメモ 

```
answers = [
        clieque for clieque in nx.find_cliques(G_complement)
        if len(clieque) == bord_size
    ]

```
こうかくとif 文の条件に合致したものだけリストに追加されるみたい。 
リスト内包表記というらしい。


