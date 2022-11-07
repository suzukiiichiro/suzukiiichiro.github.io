---
title: "CSSでもできる！知っておくべき重要なヒントとコツ 8選 8選"
date: 2022-01-19T08:08:44+09:00
draft: false

image: "catch.jpg"
authors: wyoshi

description: "わずか数行のコードでCSSで洗練されたデザインを作成可能。jsで実装していたことがCSSでも！？そんな効率的に開発するためのテクニックを紹介しています"

categories:
  - web
tags:
  - Program
  - Designer
  - Develop
  - web
  - HTML
  - CSS
  - Web designer
  - Front engineer
  - Web Technic
  - Trends
---

**出典元**：[8 Essential CSS Tips and Tricks Every Developer Should Know](https://www.makeuseof.com/css-tips-and-tricks-you-must-know/)

CSSは、HTMLスケルトンを設定した後、Webページにスタイルを追加するために使用されます。さらに、わずか数行のコードでCSSで洗練されたデザインを作成できます。
すべての開発者は、プロジェクトを迅速かつ効率的に開発するために、これらのCSSのトリックを知っている必要があります。あなたの生産性を次のレベルに確実に向上させます。
それでは始めてみましょう。

## hover効果
```：hover```セレクターを使用して、HTML要素にホバー効果を追加できます。

次の例ではボタン要素にホバー効果を追加します。
```html
<button>Hover Over Me</button>
```
```css
button:hover {
  color: #0062FF;
  border: #0062FF solid 1px;
  background: #FFFF99;
}
```

このコードをいじって、フェードイン、拡縮、変形などのエフェクトを追加できます。

### CSSホバーへのフェードイン効果
```css
button{
  opacity: 0.5
}
button:hover{
  opacity: 1;
}
```
### CSSホバーへの拡縮効果
```css
button:hover{
  -webkit-transform: scale(1.2);
  -ms-transform: scale(1.2);
  transform: scale(1.2);
}
```

## divコンテナに合うように画像のサイズを変更します
height、width、およびobject-fitプロパティを使用して、divコンテナに合うように画像のサイズを変更できます。
```html
  <img class="random-image" src="画像ファイル" />
```
```css
.random-image {
  eight: 100%;
  width: 100%;
  object-fit: contain;
}
```

## すべてのスタイルをオーバーライドする

```!important``` を使用して、属性の他のすべてのスタイル宣言（インラインスタイルを含む）をオーバーライドできます。
```html
<p class="className" id="idName" style="background-color: orange;"> Hello World! </p>
```
```css
p {
  background-color: yellow;
}
.className {
  background-color: blue !important;
}
#idName {
  background-color: green;
}
```

この例では、```!important```ルールが他のすべての背景色宣言をオーバーライドし、背景色が緑ではなく青に設定されるようにします。

ただし、```!important``` は便利ではありますが、使いすぎると上書きできないといった不具合にもつながるので、できるだけ階層を持ったCSSの記述を心がけてください。

## 三点リーダー
```text-overflow``` のCSSプロパティを使用して、オーバーフローしたテキストを省略記号（...）で切り捨てることができます。
```html
<p class="text"> Lorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod tempor. </p>
```
```css
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
}
```

## 文字の変形
```text-transform``` CSSプロパティを使用して、テキストを強制的に大文字、小文字、または大文字にすることができます。

### 指定文字を大文字にする（Uppercase）
```text-transform: uppercase;```のCSSを使用すると、クラスなどで指定した範囲をすべて大文字表示にできます。
```html
<p class="uppercase"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
```
```css
.uppercase {
  text-transform: uppercase;
}
```
### 指定文字を小文字にする（Lowercase）
```text-transform: lowercase;```のCSSを使用することで、クラスなどで指定した範囲をすべて小文字表示にできます。
```html
<p class="lowercase"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
```
```css
.lowercase {
  text-transform: lowercase;
}
```
### 先頭を大文字に（Capitalize）
先頭文字のみを大文字（Capitalize）したい場合は ```text-transform: capitalize;``` のCSSを使用します。
```html
<p class="capitalize"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
```
```
.capitalize { text-transform: capitalize; }
```

## 単一行プロパティ宣言の使用
CSSの省略形のプロパティを使用して、コードを簡潔で読みやすくすることができます。
たとえば、CSS backgroundは、background-color、background-image、background-repeat、およびbackground-positionの値を定義できる省略形のプロパティです。
同様に、フォント、境界線、マージン、およびパディングのプロパティを定義できます。

### 単一行のbackgroundプロパティ宣言
```css
background-color: black;
background-image: url(images/xyz.png);
background-repeat: no-repeat;
background-position: left top;
```
上記の宣言を1行に簡略化できます。
```css
background: black url(images/xyz.png) no-repeat left top;
```

省略形のプロパティは非常に使いやすいですが、ブラウザ依存などもあるので、使用する際には、 [tricky edgecases](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#tricky_edge_cases) （MDN Web Docsで概説されている）を考慮する必要があります。


## ツールチップ
ツールチップは、ユーザーがマウスポインターを要素上に移動したときに、要素に関する詳細情報を表示する方法です。

### 右方向のツールチップ
```html
<div class="tooltip_div">
  Right Tooltip
  <span class="tooltip">This is the Tooltip text</span>
</div>
```
```css
body {
  text-align: center;
}
.tooltip_div {
  position: relative;
  display: inline-block;
}
.tooltip_div .tooltip {
  visibility: hidden;
  width: 170px;
  background-color: blue;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Positioning the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 105%;
}
.tooltip_div:hover .tooltip {
  visibility: visible;
}
```

### 左方向のツールチップ
```html
<div class="tooltip_div">
  Left Tooltip
  <span class="tooltip">This is the Tooltip text</span>
</div>
```
```css
body {
  text-align: center;
}
.tooltip_div {
  position: relative;
  display: inline-block;
}
.tooltip_div .tooltip {
  visibility: hidden;
  width: 170px;
  background-color: blue;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Positioning the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  right: 105%;
}
.tooltip_div:hover .tooltip {
  visibility: visible;
}
```

### 上方向のツールチップ
```html
<div class="tooltip_div">
  Top Tooltip
  <span class="tooltip">This is the Tooltip text</span>
</div>
```
```css
body {
  text-align: center;
}
.tooltip_div {
  position: relative;
  display: inline-block;
}
.tooltip_div .tooltip {
  visibility: hidden;
  width: 170px;
  background-color: blue;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Positioning the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}
.tooltip_div:hover .tooltip {
  visibility: visible;
}
```

### 下方向のツールチップ
```html
<div class="tooltip_div">
  Bottom Tooltip
  <span class="tooltip">This is the Tooltip text</span>
</div>
```
```css
body {
  text-align: center;
}
.tooltip_div {
  position: relative;
  display: inline-block;
}
.tooltip_div .tooltip {
  visibility: hidden;
  width: 170px;
  background-color: blue;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Positioning the tooltip */
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -60px;
}
.tooltip_div:hover .tooltip {
  visibility: visible;
}
```

Bootstrapライブラリを使用して、カスタムの [Bootstrap tooltips](https://getbootstrap.com/docs/5.1/components/tooltips/) を作成することもできます。


## 影を追加
text-shadowおよびbox-shadowCSSプロパティをそれぞれ使用して、テキストおよび要素にCSSシャドウ効果を追加できます。


### 文字に影を追加
text-shadow CSSプロパティは、テキストに影とレイヤーを追加します。 text-shadowプロパティは、テキストに適用されるシャドウのコンマ区切りリストを受け入れます。

```css
/* text-shadowには4つのCSSプロパティがあります:offset-x, offset-y, blur-radius, and color */
/* offset-x | offset-y | blur-radius | color */
text-shadow: 2px 2px 4px red;
/* color | offset-x | offset-y | blur-radius */
text-shadow: #18fa3e 1px 2px 10px;
```


color および blur-radius 引数はオプションです。

こんなこともできます。
```css
background: #e74c3c;
color: #fff;
font-family: lato;
text-shadow: 1px 1px rgba(123, 25, 15, 0.5), 2px 2px rgba(129, 28, 18, 0.51), 3px 3px rgba(135, 31, 20, 0.52), 4px 4px rgba(140, 33, 22, 0.53), 5px 5px rgba(145, 36, 24, 0.54), 6px 6px rgba(150, 38, 26, 0.55), 7px 7px rgba(154, 40, 28, 0.56), 8px 8px rgba(158, 42, 30, 0.57), 9px 9px rgba(162, 44, 31, 0.58), 10px 10px rgba(166, 45, 33, 0.59), 11px 11px rgba(169, 47, 34, 0.6), 12px 12px rgba(173, 48, 36, 0.61), 13px 13px rgba(176, 50, 37, 0.62), 14px 14px rgba(178, 51, 38, 0.63), 15px 15px rgba(181, 52, 39, 0.64), 16px 16px rgba(184, 54, 40, 0.65), 17px 17px rgba(186, 55, 41, 0.66), 18px 18px rgba(189, 56, 42, 0.67), 19px 19px rgba(191, 57, 43, 0.68), 20px 20px rgba(193, 58, 44, 0.69), 21px 21px rgba(195, 59, 45, 0.7), 22px 22px rgba(197, 60, 46, 0.71), 23px 23px rgba(199, 61, 47, 0.72), 24px 24px rgba(201, 62, 47, 0.73), 25px 25px rgba(202, 62, 48, 0.74), 26px 26px rgba(204, 63, 49, 0.75), 27px 27px rgba(206, 64, 49, 0.76), 28px 28px rgba(207, 65, 50, 0.77), 29px 29px rgba(209, 65, 51, 0.78), 30px 30px rgba(210, 66, 51, 0.79), 31px 31px rgba(211, 67, 52, 0.8), 32px 32px rgba(213, 67, 52, 0.81), 33px 33px rgba(214, 68, 53, 0.82), 34px 34px rgba(215, 69, 53, 0.83), 35px 35px rgba(216, 69, 54, 0.84), 36px 36px rgba(218, 70, 54, 0.85), 37px 37px rgba(219, 70, 55, 0.86), 38px 38px rgba(220, 71, 55, 0.87), 39px 39px rgba(221, 71, 56, 0.88), 40px 40px rgba(222, 72, 56, 0.89), 41px 41px rgba(223, 72, 57, 0.9), 42px 42px rgba(224, 73, 57, 0.91), 43px 43px rgba(225, 73, 57, 0.92), 44px 44px rgba(225, 73, 58, 0.93), 45px 45px rgba(226, 74, 58, 0.94), 46px 46px rgba(227, 74, 58, 0.95), 47px 47px rgba(228, 75, 59, 0.96), 48px 48px rgba(229, 75, 59, 0.97), 49px 49px rgba(230, 75, 59, 0.98), 50px 50px rgba(230, 76, 60, 0.99);
```


### 要素に影をつける

box-shadowプロパティは、HTML要素に影を適用するために使用されます。

box-shadowの構文は下記になります。
```css
box-shadow: [横方向のオフセット] [縦方向のオフセット] [ぼかしの量] [影の広がり（オプション）] [色];
```

ぼかし、広がり、色のパラメーターはオプションです。
実際の記述は次のようになります。

```css
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
```

この記事で使用されている完全なソースコードを確認したい場合は、[GitHubリポジトリ](https://github.com/Yuvrajchandra/CSS-Tips-And-Tricks)をご覧ください。


WebサイトにCSSのテキストシャドウを追加することは、ユーザーの注意を引くのに最適な方法です。Webサイトにある種のエレガンスとユニークな雰囲気を与えることができます。あなたのサイトのテーマに合うようなテキストシャドウの例を、創造力を働かせて試してみてください。

## まとめ
いかがだったでしょうか。いままでJSを使ってやっていたことが実はCSSでも可能になっているケースが多いです。
javascript記述するよりも、cssのほうが軽量です。
ぜひ皆さんのサイトにも導入してUI、UXの向上につなげてみてください。


## オススメの書籍

{{% amazon title=" HTML5 & CSS3 デザインレシピ集 " url="https://www.amazon.co.jp/HTML5-CSS3-デザインレシピ集-狩野-祐東/dp/4774187801/?tag=nlpqueens09-22" summary=` 本書は、HTML5とCSS3によるWebサイト制作のための"おいしい"レシピ集です。 制作の現場で使われる定番テクニックから、プロ技まで余すところなく集めました。 テキスト/リスト/リンク/画像/ボックス/ テーブル/フォーム/ナビゲーション/ レイアウト/レスポンシブWebデザイン… テーマ別にレシピを整理しているので、引きやすくなっています。 「あのデザインはどう作るんだろう?」が、スグにわかります。 デザイナーからWebプログラマーまで、Web制作に携わるすべての方にお届けします。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51Xd7nz7WbL.jpg" %}}

{{% amazon title=" HTML5＋CSS3の新しい教科書　改訂新版　基礎から覚える、深く理解できる。 " url="https://www.amazon.co.jp/HTML5＋CSS3の新しい教科書-改訂新版-基礎から覚える、深く理解できる。-赤間-公太郎-ebook/dp/B07GPH7R3Y/?tag=nlpqueens09-22" summary=` この商品は固定レイアウトで作成されており、タブレットなど大きいディスプレイを備えた端末で読むことに適しています。また、文字列のハイライトや検索、辞書の参照、引用などの機能が使用できません。 〈電子書籍版に関する注意事項〉 本書は固定レイアウト型の電子書籍です。リフロー型と異なりビューア機能が制限されるほか、端末によって見え方が異なりますので、ご購入前にお使いの端末にて「無料サンプル」をお試しください。 【技術の進化に左右されないWebサイトの作り方がわかる！】 Web制作のプロを目指す方に向けて、HTML5+CSS3を使ったWebサイトの作り方を解説した入門書の改訂版。` imageUrl="https://m.media-amazon.com/images/I/41eG3HJF4pL.jpg" %}}

