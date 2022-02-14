---
title: "Javascriptで画面ロックが発生する場合は、Workerを使ってみよう。"
date: 2022-02-01T14:19:43+09:00
draft: false

authors: wyoshi
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
  - Webデザイナー
  - フロントエンジニア
  - コーダー
  - Javascript

---
Javascript で重い処理を書く際や for や while などのループを記述する際に気をつけないといけないのがUIロックです。

特に重い処理を行うと、js の処理に力を使ってしまって画面が固まってUIなどの操作性が格段に落ちてしまい、ブラウザなどからは応答に時間がかかっておりますといったアラートが表示される原因になります。

そういったときは **Worker** を使って重い処理を別タスクとして実行することで、画面上の処理と、重い処理を分けることができ、その結果画面をロックすることなく表示させることが可能になります。

今回はその方法を説明していきます。

## UIをロックしてしまうループ処理
まずは画面をロックしてしまうような記述です。
下記のような HTML があったとしましょう。
```html:index.html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #animation:before {
      content: "";
      width: 5em;
      height: 5em;
      display: block;
      border: 2px solid black;
      margin: 50px auto;
    }
    @keyframes rotation {
      0%{ transform: rotate(0);}
      100%{ transform: rotate(360deg); }
    }
    .run #animation:before {
      animation: 2s linear infinite rotation;
    }
    .run button {
      background-color: red;
    }
  </style>
</head>
<body>
  <div id="animation"></div>
  <button type="button" onClick="run()">Run</button>
  <h1 id="counter"></h1>
  <h2 id="time"></h2>
</body>
</html>
```

この HTML は counter 部分 に文字を出力できるようにしてあります。
そして、実行時間を time 部分に出力できるようにしてあります。

それでは、ここに for 文を使って、文字を追加していってみます。

```javascript:for01.js
const run = () => {
  document.body.classList.add('run');
  const start = Date.now();
  const elem = document.querySelector("#counter");
  for(let i = 0; i < 100000; i++) {
   elem.textContent = i;
  }
  document.querySelector("#time").textContent = Date.now() - start;
  document.body.classList.remove('run');
};
```
上のようなfor文で記述したスクリプトを作ってみました。
iの値をcounterに反映していくだけのものです。
まずはiの最大値を 100000 くらいで実行してみましょう。

実行したところ、999999 と表示され、time部分の処理は 569 ミリ秒ということになります。

{{< video autoplay="false" src="img01.mp4" >}}

ここで注目してほしいのが、counter の文字を変化させているにも関わらず、その文字が反映されていないという点です。
Chrome の Developper tool で確認しても、変化しているようではありますが、画面上では反映されていません。

重い処理を行う場合をフロントで行うと、 UX の低下につながってしまいます。
そこで使うのが、 Worker 処理ということになります。

## Workerとは
Worker とはバックグランド、つまり、裏の方で処理を行ってその結果をフロントに返却するということができる仕組みになります。

フロントで処理を行わないので、画面ロックを発生させることなく重い処理を実行できます。
Worker を使用するには実行したいファイル名を指定して呼びします。

そして、対象のワーカーに値などを **postMessage** で値を渡します。
postMessage 部分は配列や連想配列のデータでも構いません。

そして、対象のWorker側でpostされたデータを受信するように設定します。
受信の際はフロントであれば ```worker.addEventListener('message', (e) => {})``` を、Workerであれば ```self.addEventListener('message', (e) => {})``` を使用します。
処理内容を返却する際は、先ほどと同じように postMessage を使います。

```javascript:main.js
const worker = new Worker(this.fileName);
const run = () => {
  worker.postMessage("run");
};
worker.addEventListener('message', (e) => {
  console.log(e.data);
}, false);
```

```javascript:worker.js
self.addEventListener('message', (e) => {
  //処理内容

  //処理結果を送信
  self.postMessage(e.data);
}, false);
```

## UIをロックしないで行えるループ
それでは、先ほどロックしてしまったjsをworkerにしてみましょう。
```javascript:worker_main.js
const worker = new Worker("worker.js");
const run = () => {
  document.body.classList.add('run');
  const start = Date.now();
  const elem = document.querySelector("#counter");
  worker.postMessage("run");
  worker.addEventListener('message', (e) => {
    if(e.data.mode === 'end') {
      document.querySelector("#time").textContent = Date.now() - start;
      document.body.classList.remove('run');
    } else {
      document.querySelector("#counter").textContent = e.data.value;
    }
    console.log();
  }, false);
};
```

続いて、Worker部分の処理になります。
worker部分ではフロントの worker_main.js から実行されたタイミングで動作を開始して、ループの値をフロントに戻すようにしてあります。
ループが終了すると、mode: end と終わったことを通知するようにしました。


```javascript:worker.js 
self.addEventListener('message', (e) => {
  //処理内容
  for(let i = 0; i < 100000; i++) {
   console.log(i);
   self.postMessage({value: i});
  }
  self.postMessage({mode: 'end'});
  //処理結果を送信
}, false);
```

それでは実行してみましょう。

{{< video autoplay="false" src="img02.mp4" >}}


実行すると、先ほどと全く違うUIになっているかと思います。
実はRunを押したタイミングで、ボタンを赤くして、上の四角が回転するようにしてありました。
Workerなしの処理ではJavascriptの処理が詰まってしまい、その部分の処理が正しく表示されていなかったということになります。



## setTimeoutでもできるけど、おすすめはしない
UIのロックを防ぐ方法として、setTimeoutを使う方法もあります。
この方法はworkerを使っていないのですが、setTimeoutを使用することで別タスクとして処理させることができます。

```javascript:timer.js
const run = () => {
  document.body.classList.add('run');
  const start = Date.now();
  const elem = document.querySelector("#counter");
  for(let i = 0; i < 100000; i++) {
    setTimeout(()=>{
      console.log(i);
      elem.textContent = i;
    }, 0);
  }
  document.querySelector("#time").textContent = Date.now() - start;
  document.body.classList.remove('run');
};
```

数字部分は変化しますが、先程のようにアニメーションは行われません。
forの処理が先に終了してしまうため、cssのアニメーションが一瞬で終了してしまうのです。

{{< video autoplay="false" src="img03.mp4" >}}

## まとめ
Javascriptを使っていると思い処理も当然行う場合があります。そうしたときに、フロントで処理をしてしまうとローディングなどのアニメーションが正しく行われなかったりする原因になってしまいます。
Worker を使って、処理を別タスクとしてやることで正しくローディングなどを表示させることが可能です。

重い処理を行う際は、Workerを使って別タスクで行ってユーザーにストレスを与えないサイトを作っていきましょう。

## おすすめの書籍
{{% amazon title=" ゲームで学ぶJavaScript入門 HTML5&CSSも身に付く! " url="https://www.amazon.co.jp/ゲームで学ぶJavaScript入門-HTML5-CSSも身に付く-田中-賢一郎/dp/4844339788/?tag=nlpqueens-22" summary=` 「JavaScriptでココまでできる!」 中学生、高校生のための、ゲームプログラミング入門書の決定版! JavaScriptを使用したWebブラウザゲームの製作ノウハウを解説する入門書です。 Webページをまったく作ったことはないが、現在主流となっているブラウザゲームに興味があり、 「自分でもゲームプログラミングに挑戦してみたい!」と考えている初心者、とくに中・高校生に最適です。 本書では「より面白く」「見栄え良く」をモットーに、13本のサンプルゲームを紹介しています。 ゲームを作りながら、JavaScriptだけでなくHTML5やCSSといったWeb技術の基本もしっかり学習できます。 最後までラクに読めて、感覚的に仕組みを理解できるように、 「楽しさ」が感じられて「飽きさせない」ことを重視した構成になっています。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51SCEJnrZGL.jpg" %}}

{{% amazon title=" 確かな力が身につくJavaScript「超」入門 第2版 " url="https://www.amazon.co.jp/確かな力が身につくJavaScript「超」入門-第2版-狩野-祐東/dp/4815601577/?tag=nlpqueens-22" summary=` ◎ 3万部突破のベストセラーが充実のアップデート! JavaScriptをこれから始める人にも、前に挫折したことのある人にも。 手を動かしてサンプルをひとつずつ作っていくことで、知識だけでなく、 現場で活きる、応用・実践につながる基礎力が「この一冊で」身につきます。 ポイント1「サンプルが楽しい。」 よくある“勉強のためのサンプル"を可能な限り排除し、「こういうの見たことある! 」「こういうのが作ってみたかった! 」というような、実際に仕事に使えそうなサンプルを集めました。なので、最初の「やるぞ! 」というモチベーションを維持したまま、最後のページまで読み進めることができます。` imageUrl="https://images-fe.ssl-images-amazon.com/images/I/51RXlVPRVuL.jpg" %}}

