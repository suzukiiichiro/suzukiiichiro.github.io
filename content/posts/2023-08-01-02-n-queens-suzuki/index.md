---
title: "Ｎクイーン問題（６１）第七章 並列処理 ミラー ＮＶＩＤＩＡ ＣＵＤＡ編"
date: 2023-08-01T10:03:47+09:00
draft: false
authors: suzuki
image: chess.jpg
categories:
  - programming
tags:
  - N-Queens
  - エイト・クイーン
  - NVIDIA CUDA
  - Ｃ言語
  - 並列処理
  - アルゴリズム
  - 鈴木維一郎
---
![](chess.jpg)
[【参考リンク】Ｎクイーン問題 過去記事一覧はこちらから](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)

エイト・クイーンのプログラムアーカイブ 
Bash、Lua、C、Java、Python、CUDAまで！
https://github.com/suzukiiichiro/N-Queens


## CUDAセットアップ
### 手順など
今どきは少なくなったわけですが、CUDAをインストールから始めたい人はこちら

EC2 G4インスタンスのAmazon Linux 2にNVIDIA CUDAをインストールしてみた
https://dev.classmethod.jp/articles/install-nvidia-cuda-on-ec2-g4-amazon-linux-2/

今どきは、GPUインスタンスを使えば最初から`nvcc`が実行できます。

AWSのGPUインスタンスでCUDAを動かす
https://qiita.com/navitime_tech/items/0a8073347c21800f1cad

料金やインスタンスの選定、起動までが詳しく書かれているページはこちら

AWS/EC2でGPUマシンを起動してみる
https://motomura-kazushi.net/2021/08/15/aws-ec2%E3%81%A7gpu%E3%83%9E%E3%82%B7%E3%83%B3%E3%82%92%E8%B5%B7%E5%8B%95%E3%81%97%E3%81%A6%E6%B7%B1%E5%B1%A4%E5%AD%A6%E7%BF%92%E3%82%92%E5%9B%9E%E3%81%97%E3%81%A6%E3%81%BF%E3%82%8B/

### 確認方法
GPUインスタンスでCUDAが使えるようになったかな？と、確認するには以下のコマンドを実行します。

```
$ nvcc --version
```

以下の内容が表示されればCUDAは実行可能な状態にあります。

```
NQueens2$ nvcc --version
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2023 NVIDIA Corporation
Built on Tue_Jul_11_02:31:28_PDT_2023
Cuda compilation tools, release 12.2, V12.2.128
Build cuda_12.2.r12.2/compiler.33053471_0
NQueens2$
```

よくありがちな質問ですが、`top`コマンドでは、GPUインスタンスの負荷を調べることはできませんので、以下のコマンドでGPUインスタンスのCPU不可やメモリ使用状況を確認します。

```
$ watch nvidia-smi
```

## ミラー ＣＵＤＡ部分についての解説
### 実行
実行は以下の４種類です。

１．シングルスレッドで再帰
こちらは以下のメソッドを呼び出し再帰実行します。
わかりやすくするために、ロジック部分を切り出して別関数にしています。

//ミラーロジック 再帰版
void mirror_solve_R(unsigned int size,unsigned int row,unsigned int left,unsigned int down,unsigned int right)
// ミラー 再帰版
void mirror_R(unsigned int size)

```
$ nvcc 02CUDA_Mirror.cu && ./a.out -r
```

２．シングルスレッドで非再帰
こちらは以下のメソッドを呼び出し非再帰実行します
わかりやすくするために、ロジック部分を切り出して別関数にしています。

//ミラー処理部分 非再帰版
void mirror_solve_NR(unsigned int size,unsigned int row,unsigned int _left,unsigned int _down, unsigned int _right)
// ミラー 非再帰版
void mirror_NR(unsigned int size)

```
$ nvcc 02CUDA_Mirror.cu && ./a.out -c
```

３．シングルスレッドのＧＰＵ
こちらは`InitCUDA()`を通過後、以下のメソッドを呼び出します。
シングルスレッドで動作します。

// ミラー 処理部分
__host__ __device__ 
long mirror_solve_nodeLayer(int size,long left,long down,long right)
// ミラー クイーンの効きを判定して解を返す
__host__ __device__ 
long mirror_logic_nodeLayer(int size,long left,long down,long right)

```
$ nvcc 02CUDA_Mirror.cu && ./a.out -g
```
３の必要性は、４を開発している間、問題点を局所化するためです。
３の解がきちんと出力していれば、他の箇所に問題があると特定することが目的です。


４．マルチスレッドのＧＰＵ
こちらは`InitCUDA()`を通過後、以下のメソッドを呼び出します。
マルチスレッドで動作します。

```
$ nvcc 02CUDA_Mirror.cu && ./a.out -n
```

次の項では、４について具体的に説明します。

## 関数の説明
`InitCUDA()`を通過後、以下のメソッドを順次辿って実行されます。

### 関数一覧
```c 
// ミラー 処理部分
__host__ __device__ 
long mirror_solve_nodeLayer(int size,long left,long down,long right)

// ミラー クイーンの効きを判定して解を返す
__host__ __device__ 
long mirror_logic_nodeLayer(int size,long left,long down,long right)

// i 番目のメンバを i 番目の部分木の解で埋める
__global__ 
void dim_nodeLayer(int size,long* nodes, long* solutions, int numElements)

// 0以外のbitをカウント
int countBits_nodeLayer(long n)

// ノードをk番目のレイヤーのノードで埋める
long kLayer_nodeLayer(int size,std::vector<long>& nodes, int k, long left, long down, long right)

// k 番目のレイヤのすべてのノードを含むベクトルを返す。
std::vector<long> kLayer_nodeLayer(int size,int k)

// 【GPU ミラー】ノードレイヤーの作成
void mirror_build_nodeLayer(int size)

// CUDA 初期化
bool InitCUDA()
```


### CUDA 初期化
bool InitCUDA()
CUDAデバイスが搭載されているか、GPUの数などを確認します。
GPUが搭載されていない場合は、`return`します。


### 【GPU ミラー】ノードレイヤーの作成
```c
void mirror_build_nodeLayer(int size)
```

以下でレイヤーの数を指定します。
Ｎが増えればレイヤーは枯渇します。
Ｎが１６まではレイヤーは４で足りますが、以降、レイヤーは、５，６と増やす必要があり、レイヤーが増えることによって、速度は加速度的に遅くなります。
ノードレイヤーの考え方はスマートではありますが、Ｎの最大化と高速化を求める場合は限界がまもなくおとずれるロジックです。

今の段階では、レイヤー４で進めていきます。

```c
  // ツリーの3番目のレイヤーにあるノード
  //（それぞれ連続する3つの数字でエンコードされる）のベクトル。
  // レイヤー2以降はノードの数が均等なので、対称性を利用できる。
  // レイヤ4には十分なノードがある（N16の場合、9844）。
  std::vector<long> nodes = kLayer_nodeLayer(size,4); 
```

以下は、nodeSizeを算出し、hostNodes,deviceNodes配列を宣言、メモリを確保します。
併せて、hostNodes配列の先頭に空の値を格納し、`cudaMemcpy()`でデバイス側に配列をコピー（転送）します。

```c
  // デバイスにはクラスがないので、
  // 最初の要素を指定してからデバイスにコピーする。
  size_t nodeSize = nodes.size() * sizeof(long);
  long* hostNodes = (long*)malloc(nodeSize);
  hostNodes = &nodes[0];
  long* deviceNodes = NULL;
  cudaMalloc((void**)&deviceNodes, nodeSize);
  cudaMemcpy(deviceNodes, hostNodes, nodeSize, cudaMemcpyHostToDevice);
```

以下は、解を格納する deviceSolutions を宣言します。
ミラーでは、必要なノードは半分で済みます。
３の整数というのは、一つのノードに`left` `down` `right` が格納されるからです。

```c
  // デバイス出力の割り当て
  long* deviceSolutions = NULL;
  /** ミラーでは/6 を /3に変更する */
  // 必要なのはノードの半分だけ
  // 各ノードは3つの整数で符号化される。
  //int numSolutions = nodes.size() / 6; 
  int numSolutions = nodes.size() / 3; 
  size_t solutionSize = numSolutions * sizeof(long);
  cudaMalloc((void**)&deviceSolutions, solutionSize);
```

以下でCUDAカーネルを起動します。
起動は
```
起動したい関数 <<< 並列処理の数 >>>( 関数に渡すパラメータ)
```

となります。

```c
  // CUDAカーネルを起動する。
  int threadsPerBlock = 256;
  int blocksPerGrid = (numSolutions + threadsPerBlock - 1) / threadsPerBlock;
  dim_nodeLayer <<<blocksPerGrid, threadsPerBlock >>> (size,deviceNodes, deviceSolutions, numSolutions);
```

デバイス側で処理した結果がdeviceSolusionsに格納され、その配列を `cudaMemcpy()`でホスト側にコピー(転送)します。

```c
  // 結果をホストにコピー
  long* hostSolutions = (long*)malloc(solutionSize);
  cudaMemcpy(hostSolutions, deviceSolutions, solutionSize, cudaMemcpyDeviceToHost);
```

デバイスからホストへ転送する場合は
```
cudaMemcpyDeviceToHost
```

ホストからデバイスへ転送する場合は
```
cudaMemcpyHostToDevice
```
となります。


以下は、スレッドごとに格納された解を`for`で回して集計します。
```c
  // 部分解を加算し、結果を表示する。
  long solutions = 0;
  for (long i = 0; i < numSolutions; i++) {
      solutions += 2*hostSolutions[i]; // Symmetry
  }
  // 出力
  TOTAL=solutions;
```

### k 番目のレイヤのすべてのノードを含むベクトルを返す。

```c
std::vector<long> kLayer_nodeLayer(int size,int k)
```

こちらの関数は、`kLayer_nodeLayer()`を使って、必要なノードを埋める処理をします。ようするに、Ｎクイーンの当たり判定をすべて行いノードを作成するということになります。

ノードレイヤーが遅い理由は、Ｎクイーンの処理を、当たり判定と本番確定の２回行っていることです。

メモ
GPUで並列実行するためのleft,right,downを作成する

kLayer_nodeLayer(size,4)
第2引数の4は4行目までnqueenを実行し、それまでのleft,down,rightをnodes配列に格納する

nodesはベクター配列で構造体でもなんでも格納できる
push_backで追加。

nodes配列は3個で１セットleft,dwon,rightの情報を同じ配列に格納する
[0]left[1]down[2]right


### ノードをk番目のレイヤーのノードで埋める
```c
long kLayer_nodeLayer(int size,std::vector<long>& nodes, int k, long left, long down, long right)
```

ここでは、解を導き出すために、ノードにより、クイーンの移動の候補を列挙する処理を行います。
ノードレイヤーは、解を導き出すための処理に加えて、クイーンの移動候補を列挙するための処理を行うため、事実上、２回映とクイーンを行っていることが、速度低下の最大のボトルネックと言えます。


### 0以外のbitをカウント
```c
int countBits_nodeLayer(long n)
```

ここでは、ビットで表現されたボード情報の右端にあるゼロ以外の数字を削除する処理を行います。


### i 番目のメンバを i 番目の部分木の解で埋める
```c
__global__ 
void dim_nodeLayer(int size,long* nodes, long* solutions, int numElements)
```

肝のところはここです。
```
ミラーのGPUスレッド(-n)の場合は、予めCPU側で奇数と偶数で分岐させるので、奇数と偶数を条件分岐するmirror_logic_nodeLayer()を通過させる必要がない
```

いわゆる、ミラーになってノードの半分しか精査しない処理になったことにより、関数が一つ減ったわけです。


### ミラー クイーンの効きを判定して解を返す
```c
__host__ __device__ 
long mirror_logic_nodeLayer(int size,long left,long down,long right)
```

ということで、この関数は不要となりました。


### ミラー 処理部分
```c
__host__ __device__ 
long mirror_solve_nodeLayer(int size,long left,long down,long right)
```

ここでは、再帰処理を行います。
もっとも負荷の高い処理です。
01CUDA_Bitmap.cuと同様に再帰処理を普通にしています。
加算を続けたcounter変数は最後に`return`で値を返します。




## ミラー
ここからは、GPUに限定せず、ミラーのロジックについて説明します。


ミラー（鏡像）を用いてどのように改善できるのか
Ｎ５＝１０、Ｎ８＝９２といった、N-Queensの解が成立している場合、その鏡像（ミラー）も当然成立していることになります。

左右対称の鏡像の場合 この場合は、解がそれぞれ一つずつある。

```
+-+-+-+-+     +-+-+-+-+  
| | |Q| |     | |Q| | |
+-+-+-+-+     +-+-+-+-+
|Q| | | |     | | | |Q|
+-+-+-+-+     +-+-+-+-+
| | | |Q|     |Q| | | |
+-+-+-+-+     +-+-+-+-+
| |Q| | |     | | |Q| |
+-+-+-+-+     +-+-+-+-+
```


右の盤面は、左の盤面を左右対称にひっくり返しただけなのに、左盤面の解とは別の解として探索されカウントされます。

左のパターンが発見され１カウントできたら同時に、左右反転させて１カウントすればわざわざ探す必要がなくなります。


左右対称（鏡像）をつかって探索を効率的に進めるにはどうしましょう。


## 奇数と偶数
Ｎが偶数の場合は、最初の行の右半分、または左半分を除外（無視）すればよいのです。

`row0` いわゆる最初の行の左半分には置かない、
言い換えれば、一行目の右半分だけを使って解を探索する。一行目だけですからね！
```
+-+-+-+-+
|x|x| | |  左側を使わない
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```
```
+-+-+-+-+
|x|x| |Q|  右半分を使う
+-+-+-+-+  解があればカウントし、最後にカウントを倍にする。
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```
または
```
+-+-+-+-+
|x|x|Q| |  右半分を使う
+-+-+-+-+  解があればカウントし、最後にカウントを倍にする。 
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
| | | | |
+-+-+-+-+
```

Ｎが奇数の場合は、row0（最初の行）の奇数マスを2で割ることができないので、row0（最初の行）のクイーンが真ん中のマスにいない解はすべて、その半分を見つけて2をかければよいのです。

```
+-+-+-+-+-+        +-+-+-+-+-+  
|x|x| | |Q|        |x|x| |Q| | 中央を除く右側を使う。
+-+-+-+-+-+        +-+-+-+-+-+ 解があればカウントし、最後にカウントを倍にする
| | | | | |        | | | | | |
+-+-+-+-+-+        +-+-+-+-+-+
| | | | | |        | | | | | |
+-+-+-+-+-+        +-+-+-+-+-+
| | | | | |        | | | | | |
+-+-+-+-+-+        +-+-+-+-+-+
| | | | | |        | | | | | |
+-+-+-+-+-+        +-+-+-+-+-+
```


row0（最初の行）の真ん中のマスにクイーンがあるときも同じことができることが判明しました。
```
+-+-+-+-+-+
| | |Q| | |  
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```
row0（最初の行）の真ん中のマスにクイーンがある場合、row1（２行目）の真ん中のマスにクイーンがあることはありえません。
```
+-+-+-+-+-+
| | |Q| | |  
+-+-+-+-+-+
| | |Q| | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```


これで、row1（２行目）のマスのうち、まだ空いているマスは偶数個になりました！
ですので、row1（２行目）の残りのマスの半分を除外すればよいのです。
```
+-+-+-+-+-+
| | |Q| | |  
+-+-+-+-+-+
|x|x|x| | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
| | | | | |
+-+-+-+-+-+
```

これで最初のクイーンが真ん中にある解のちょうど半分を見つけることができます。
これを、最初のクイーンが真ん中にない解の半分と足すと、全解のちょうど半分になり、これを2倍すると、出来上がりです！



## 図解すると
盤面が偶数の場合は、row0（最初の行）の半分だけを使って、解を倍にする。簡単！
盤面が奇数の場合は、以下を再確認。


row0（１行目）の左半分を除外
奇数Nの場合、これは真ん中のマスまでという意味であり、真ん中のマスは含まれない。このフィルターにより、今回のような解を見つけることができなくなります：

![](5-Queen-excluded-solution.png)

でも大丈夫、その鏡像を求めて、カウントを2倍するのですから：

![](5-Queen-excluded-Mirror.png)

しかし、これでは、１行目のクイーンが中央のマスにある解をダブルカウントしてしまうことになります。
次の解とその鏡像の解の両方がカウントされることになりますね。
また、1列目の真ん中のマスを除外してしまうと、どちらもカウントされません。
どちらか一方だけをカウントするようにしたいですね。

![](5-Queen-Middle-Solution.png)
![](5-Queen-Middle-Mirror.png)

そこで、２行目の左半分を除外する条件付きフィルタを追加し、このフィルタは１行目のクイーンが真ん中のマスにいるときだけ適用されるようにします。
２行目の真ん中のマスは、最初のクイーンと競合しているので、配置されることを気にする必要はありません。i
最初の行の真ん中にクイーンがある場合は、２行目の中央を除く右半分を使って解の探索し、解があれば２倍すればよいのです。

![](5-Queen-Exclude-2nd-row.png)


## 奇数・偶数共通通過ブロック解説

以下の部分は奇数・偶数に関わらず、いつでも通過するブロックです。
ですので、forの条件は size/2 ということで、盤の半分だけを探索対象とします。
```c
  for(unsigned int i=0;i<size/2;++i){ //奇数でも偶数でも通過
    bit=1<<i;
    board[0]=bit;             //１行目にQを置く
    mirror_solve_NR(size,1,bit<<1,bit,bit>>1);
  }
```

## 奇数ブロック解説

```c
  if(size%2){                 //奇数で通過
    bit=1<<(size-1)/2;
    board[0]=1<<(size-1)/2;   //１行目の中央にQを配置
    unsigned int left=bit<<1;
    unsigned int down=bit;
    unsigned int right=bit>>1;
    for(unsigned int i=0;i<limit;++i){
      bit=1<<i;
      mirror_solve_NR(size,2,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
```

これは、、、なんでしょう。
```bash
  unsigned int limit=size%2 ? size/2-1 : size/2;
```

普通のif文に直すと以下のようになります。
```bash
    if(size%2){
      limit=size/2-1;
    }else{
      limit=size/2;
    }
```
`size%2` は？

```bash
bash $ echo $(( 5 % 2 )) 
     $ 1
```
```bash
bash $ echo $(( 6 % 2 )) 
     $ 0
```

１はtrueで０はfalseなので、奇数であるかどうか？ということになりますね。
ですので、

奇数だったら　limitに size/2-1 を代入
そうでなかったら limitに size/2 を代入　ということになります。


お、ここはなんでしょう。そうです。倍にしているところです。
`<<<1` というところがなんだかよくわかりませんが、coolですね。
数を倍にしたいときは、まよわず `<<1`を使って、難読化していきましょう。

```bash
  TOTAL=TOTAL<<1;    //倍にする

```


## CUDA ミラー

・std::vector<long> kLayer_nodeLayer(int size,int k)
ここでミラー処理をしている。

  for(unsigned int i=0;i<size/2;++i){
  は偶数、奇数かかわらず半分だけ実行する
  n4なら0,1 n5なら 0,1  n6なら 0,1,2 n7なら 0,1,2

  if(size%2){                 
  は奇数の場合だけ実行する
  n5なら 2  n7 なら 3
  この場合2行目は、半分だけ実行する

・void mirror_build_nodeLayer(int size)
  int numSolutions = nodes.size() / 3; 
  left,down,rightで1セットなので/3 kLayer_nodeLayerで半分だけ実行しているのでここは/3のまま
 

  ```c
  for (long i = 0; i < numSolutions; i++) {
      solutions += 2*hostSolutions[i]; // Symmetry
  }
  ```
  で最後にGPUの結果を2倍にする


## CUDA ソースコード
ソースコードは以下のとおりです。
```c :02CUDA_Mirror.cu
/**
 *
 * bash版ミラーのC言語版のGPU/CUDA移植版
 *
 詳しい説明はこちらをどうぞ
 https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題
 *
アーキテクチャの指定（なくても問題なし、あれば高速）
-arch=sm_13 or -arch=sm_61

CPUの再帰での実行
$ nvcc -O3 -arch=sm_61 02CUDA_Mirror.cu && ./a.out -r

CPUの非再帰での実行
$ nvcc -O3 -arch=sm_61 02CUDA_Mirror.cu && ./a.out -c

GPUのシングルスレッド
$ nvcc -O3 -arch=sm_61 02CUDA_Mirror.cu && ./a.out -g

GPUのマルチスレッド
ミラー GPUノードレイヤー
$ nvcc -O3 -arch=sm_61 02CUDA_Mirror.cu && ./a.out -n
 N:        Total      Unique      dd:hh:mm:ss.ms
 4:            2               0  00:00:00:00.13
 5:           10               0  00:00:00:00.00
 6:            4               0  00:00:00:00.00
 7:           40               0  00:00:00:00.00
 8:           92               0  00:00:00:00.00
 9:          352               0  00:00:00:00.00
10:          724               0  00:00:00:00.00
11:         2680               0  00:00:00:00.00
12:        14200               0  00:00:00:00.00
13:        73712               0  00:00:00:00.00
14:       365596               0  00:00:00:00.03
15:      2279184               0  00:00:00:00.19
16:     14772512               0  00:00:00:01.60
17:     95815104               0  00:00:00:15.10
18:    666090624               0  00:00:02:40.78


・std::vector<long> kLayer_nodeLayer(int size,int k)
ここでミラー処理をしている。

  for(unsigned int i=0;i<size/2;++i){
  は偶数、奇数かかわらず半分だけ実行する
  n4なら0,1 n5なら 0,1  n6なら 0,1,2 n7なら 0,1,2

  if(size%2){                 
  は奇数の場合だけ実行する
  n5なら 2  n7 なら 3
  この場合2行目は、半分だけ実行する

・void mirror_build_nodeLayer(int size)
  int numSolutions = nodes.size() / 3; 
  left,down,rightで1セットなので/3 kLayer_nodeLayerで半分だけ実行しているのでここは/3のまま

  for (long i = 0; i < numSolutions; i++) {
      solutions += 2*hostSolutions[i]; // Symmetry
  }
  で最後にGPUの結果を2倍にする
*/
#include <iostream>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <cuda.h>
#include <cuda_runtime.h>
#include <device_launch_parameters.h>
#define THREAD_NUM		96
#define MAX 27
// システムによって以下のマクロが必要であればコメントを外してください。
//#define UINT64_C(c) c ## ULL
//
// グローバル変数
unsigned long TOTAL=0; 
unsigned long UNIQUE=0;
//ミラー処理部分 非再帰版
void mirror_solve_NR(unsigned int size,unsigned int row,unsigned int _left,unsigned int _down, unsigned int _right)
{
  unsigned int mask=(1<<size)-1;
  unsigned int bit=0;
  unsigned int down[MAX];   //ポストフラグ/ビットマップ/ミラー
  unsigned int left[MAX];   //ポストフラグ/ビットマップ/ミラー
  unsigned int right[MAX];  //ポストフラグ/ビットマップ/ミラー
  unsigned int bitmap[MAX]; //ミラー
  left[row]=_left;
  down[row]=_down;
  right[row]=_right;
  bitmap[row]=mask&~(left[row]|down[row]|right[row]);
  while(row>0){
    if(bitmap[row]>0){
      bit=-bitmap[row]&bitmap[row];
      bitmap[row]=bitmap[row]^bit;
      if(row==(size-1)){
        TOTAL++;
        row--;
      }else{
        unsigned int n=row++;
        left[row]=(left[n]|bit)<<1;
        down[row]=(down[n]|bit);
        right[row]=(right[n]|bit)>>1;
        //クイーンが配置可能な位置を表す
        bitmap[row]=mask&~(left[row]|down[row]|right[row]);
      }
    }else{
      row--;
    }
  }
}
// ミラー 非再帰版
void mirror_NR(unsigned int size)
{
  unsigned int bit=0;
  unsigned int limit=size%2 ? size/2-1 : size/2;
  for(unsigned int i=0;i<size/2;++i){ //奇数でも偶数でも通過
    bit=1<<i;
    mirror_solve_NR(size,1,bit<<1,bit,bit>>1);
  }
  if(size%2){                 //奇数で通過
    bit=1<<(size-1)/2;
    unsigned int left=bit<<1;
    unsigned int down=bit;
    unsigned int right=bit>>1;
    for(unsigned int i=0;i<limit;++i){
      bit=1<<i;
      mirror_solve_NR(size,2,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
  TOTAL=TOTAL<<1;    //倍にする
}
// ミラー処理部分 再帰版
void mirror_solve_R(unsigned int size,unsigned int row,unsigned int left,unsigned int down,unsigned int right)
{
  unsigned int mask=(1<<size)-1;
  unsigned int bit=0;
  if(row==size){
    TOTAL++;
  }else{
    for(unsigned int bitmap=mask&~(left|down|right);bitmap;bitmap=bitmap&~bit){
      bit=-bitmap&bitmap;
      mirror_solve_R(size,row+1,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
}
// ミラー 再帰版
void mirror_R(unsigned int size)
{
  unsigned int bit=0;
  unsigned int limit=size%2 ? size/2-1 : size/2;
  for(unsigned int i=0;i<size/2;++i){
    bit=1<<i;
    mirror_solve_R(size,1,bit<<1,bit,bit>>1);
  }
  if(size%2){               //奇数で通過
    bit=1<<(size-1)/2;
    unsigned int left=bit<<1;
    unsigned int down=bit;
    unsigned int right=bit>>1;
    for(unsigned int i=0;i<limit;++i){
      bit=1<<i;
      mirror_solve_R(size,2,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
  TOTAL=TOTAL<<1;    //倍にする
}
// ミラー 処理部分
__host__ __device__ 
long mirror_solve_nodeLayer(int size,long left,long down,long right)
{
  unsigned int mask=(1<<size)-1;
  unsigned int bit=0;
  unsigned long counter=0;
  if(down==mask){
    return 1;
  }else{
    for(unsigned int bitmap=mask&~(left|down|right);bitmap;bitmap=bitmap&~bit){
      bit=-bitmap&bitmap;
      counter+=mirror_solve_nodeLayer(size,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
  return counter;
}
// ミラー クイーンの効きを判定して解を返す
__host__ __device__ 
long mirror_logic_nodeLayer(int size,long left,long down,long right)
{
  unsigned long counter = 0;
  unsigned int bit=0;
  unsigned int limit=size%2 ? size/2-1 : size/2;
  for(unsigned int i=0;i<size/2;++i){
    bit=1<<i;
    counter+=mirror_solve_nodeLayer(size,bit<<1,bit,bit>>1);
  }
  if(size%2){               //奇数で通過
    bit=1<<(size-1)/2;
    unsigned int left=bit<<1;
    unsigned int down=bit;
    unsigned int right=bit>>1;
    for(unsigned int i=0;i<limit;++i){
      bit=1<<i;
      counter+=mirror_solve_nodeLayer(size,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
  return counter<<1; // 倍にする
}
// i 番目のメンバを i 番目の部分木の解で埋める
__global__ 
void dim_nodeLayer(int size,long* nodes, long* solutions, int numElements)
{
  int i=blockDim.x * blockIdx.x + threadIdx.x;
  if(i<numElements){
    /**
      ミラーのGPUスレッド(-n)の場合は、予めCPU側で奇数と偶数で分岐させるので、
      奇数と偶数を条件分岐するmirror_logic_nodeLayer()を通過させる必要がない
      */
    solutions[i]=mirror_solve_nodeLayer(size,nodes[3 * i],nodes[3 * i + 1],nodes[3 * i + 2]);
  }
}
// 0以外のbitをカウント
int countBits_nodeLayer(long n)
{
  int counter = 0;
  while (n){
    n &= (n - 1); // 右端のゼロ以外の数字を削除
    counter++;
  }
  return counter;
}
// ノードをk番目のレイヤーのノードで埋める
long kLayer_nodeLayer(int size,std::vector<long>& nodes, int k, long left, long down, long right)
{
  long counter=0;
  long mask=(1<<size)-1;
  // すべてのdownが埋まったら、解決策を見つけたことになる。
  if (countBits_nodeLayer(down) == k) {
    nodes.push_back(left);
    nodes.push_back(down);
    nodes.push_back(right);
    return 1;
  }
  long bit=0;
  for(long bitmap=mask&~(left|down|right);bitmap;bitmap^=bit){
    bit=-bitmap&bitmap;
    // 解を加えて対角線をずらす
    //counter+=kLayer_nodeLayer(size,nodes,k,(left|bit)>>1,(down|bit),(right|bit)<<1); 
    counter+=kLayer_nodeLayer(size,nodes,k,(left|bit)<<1,(down|bit),(right|bit)>>1); 
  }
  return counter;
}
// k 番目のレイヤのすべてのノードを含むベクトルを返す。
std::vector<long> kLayer_nodeLayer(int size,int k)
{
  std::vector<long> nodes{};
  /**
    CPU側で奇数と偶数で条件分岐する
    */
  //kLayer_nodeLayer(size,nodes, k, 0, 0, 0);
  unsigned int bit=0;
  unsigned int limit=size%2 ? size/2-1 : size/2;
  for(unsigned int i=0;i<size/2;++i){
    bit=1<<i;
    kLayer_nodeLayer(size,nodes,k,bit<<1,bit,bit>>1);
  }
  if(size%2){               //奇数で通過
    bit=1<<(size-1)/2;
    unsigned int left=bit<<1;
    unsigned int down=bit;
    unsigned int right=bit>>1;
    for(unsigned int i=0;i<limit;++i){
      bit=1<<i;
      kLayer_nodeLayer(size,nodes,k,(left|bit)<<1,down|bit,(right|bit)>>1);
    }
  }
  return nodes;
}
// 【GPU ミラー】ノードレイヤーの作成
void mirror_build_nodeLayer(int size)
{
  // ツリーの3番目のレイヤーにあるノード
  //（それぞれ連続する3つの数字でエンコードされる）のベクトル。
  // レイヤー2以降はノードの数が均等なので、対称性を利用できる。
  // レイヤ4には十分なノードがある（N16の場合、9844）。
  std::vector<long> nodes = kLayer_nodeLayer(size,4); 

  // デバイスにはクラスがないので、
  // 最初の要素を指定してからデバイスにコピーする。
  size_t nodeSize = nodes.size() * sizeof(long);
  long* hostNodes = (long*)malloc(nodeSize);
  hostNodes = &nodes[0];
  long* deviceNodes = NULL;
  cudaMalloc((void**)&deviceNodes, nodeSize);
  cudaMemcpy(deviceNodes, hostNodes, nodeSize, cudaMemcpyHostToDevice);

  // デバイス出力の割り当て
  long* deviceSolutions = NULL;
  /** ミラーでは/6 を /3に変更する */
  // 必要なのはノードの半分だけで
  // 各ノードは3つの整数で符号化される。
  //int numSolutions = nodes.size() / 6; 
  int numSolutions = nodes.size() / 3; 
  size_t solutionSize = numSolutions * sizeof(long);
  cudaMalloc((void**)&deviceSolutions, solutionSize);

  // CUDAカーネルを起動する。
  int threadsPerBlock = 256;
  int blocksPerGrid = (numSolutions + threadsPerBlock - 1) / threadsPerBlock;
  dim_nodeLayer <<<blocksPerGrid, threadsPerBlock >>> (size,deviceNodes, deviceSolutions, numSolutions);

  // 結果をホストにコピー
  long* hostSolutions = (long*)malloc(solutionSize);
  cudaMemcpy(hostSolutions, deviceSolutions, solutionSize, cudaMemcpyDeviceToHost);

  // 部分解を加算し、結果を表示する。
  long solutions = 0;
  for (long i = 0; i < numSolutions; i++) {
      solutions += 2*hostSolutions[i]; // Symmetry
  }
  // 出力
  TOTAL=solutions;
}
// CUDA 初期化
bool InitCUDA()
{
  int count;
  cudaGetDeviceCount(&count);
  if(count==0){fprintf(stderr,"There is no device.\n");return false;}
  int i;
  for(i=0;i<count;i++){
    struct cudaDeviceProp prop;
    if(cudaGetDeviceProperties(&prop,i)==cudaSuccess){if(prop.major>=1){break;} }
  }
  if(i==count){fprintf(stderr,"There is no device supporting CUDA 1.x.\n");return false;}
  cudaSetDevice(i);
  return true;
}
//メイン
int main(int argc,char** argv)
{
  bool cpu=false,cpur=false,gpu=false,gpuNodeLayer=false;
  int argstart=2;
  if(argc>=2&&argv[1][0]=='-'){
    if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='r'||argv[1][1]=='R'){cpur=true;}
    else if(argv[1][1]=='c'||argv[1][1]=='C'){cpu=true;}
    else if(argv[1][1]=='g'||argv[1][1]=='G'){gpu=true;}
    else if(argv[1][1]=='n'||argv[1][1]=='N'){gpuNodeLayer=true;}
    else{ gpuNodeLayer=true; } //デフォルトをgpuとする
    argstart=2;
  }
  if(argc<argstart){
    printf("Usage: %s [-c|-g|-r|-s] n steps\n",argv[0]);
    printf("  -r: CPU 再帰\n");
    printf("  -c: CPU 非再帰\n");
    printf("  -g: GPU 再帰\n");
    printf("  -n: GPU ノードレイヤー\n");
  }
  if(cpur){ printf("\n\nミラー 再帰 \n"); }
  else if(cpu){ printf("\n\nミラー 非再帰 \n"); }
  else if(gpu){ printf("\n\nミラー GPU\n"); }
  else if(gpuNodeLayer){ printf("\n\nミラー GPUノードレイヤー \n"); }
  if(cpu||cpur)
  {
    int min=4; 
    int targetN=17;
    struct timeval t0;
    struct timeval t1;
    printf("%s\n"," N:           Total           Unique          dd:hh:mm:ss.ms");
    for(int size=min;size<=targetN;size++){
      TOTAL=UNIQUE=0;
      gettimeofday(&t0, NULL);//計測開始
      if(cpur){ //再帰
        mirror_R(size);
      }
      if(cpu){ //非再帰
        mirror_NR(size);
      }
      //
      gettimeofday(&t1, NULL);//計測終了
      int ss;int ms;int dd;
      if(t1.tv_usec<t0.tv_usec) {
        dd=(t1.tv_sec-t0.tv_sec-1)/86400;
        ss=(t1.tv_sec-t0.tv_sec-1)%86400;
        ms=(1000000+t1.tv_usec-t0.tv_usec+500)/10000;
      }else {
        dd=(t1.tv_sec-t0.tv_sec)/86400;
        ss=(t1.tv_sec-t0.tv_sec)%86400;
        ms=(t1.tv_usec-t0.tv_usec+500)/10000;
      }//end if
      int hh=ss/3600;
      int mm=(ss-hh*3600)/60;
      ss%=60;
      printf("%2d:%16ld%17ld%12.2d:%02d:%02d:%02d.%02d\n",
          size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
    } //end for
  }//end if
  if(gpu||gpuNodeLayer)
  {
    if(!InitCUDA()){return 0;}
    /* int steps=24576; */
    int min=4;
    int targetN=21;
    struct timeval t0;
    struct timeval t1;
    printf("%s\n"," N:        Total      Unique      dd:hh:mm:ss.ms");
    for(int size=min;size<=targetN;size++){
      gettimeofday(&t0,NULL);   // 計測開始
      if(gpu){
        TOTAL=UNIQUE=0;
        // GPUは起動するがノードレイヤーは行わない
        TOTAL=mirror_logic_nodeLayer(size,0,0,0); //ミラー
      }else if(gpuNodeLayer){
        TOTAL=UNIQUE=0;
        // GPUを起動し、ノードレイヤーも行う
        mirror_build_nodeLayer(size); // ミラー
      }
      gettimeofday(&t1,NULL);   // 計測終了
      int ss;int ms;int dd;
      if (t1.tv_usec<t0.tv_usec) {
        dd=(int)(t1.tv_sec-t0.tv_sec-1)/86400;
        ss=(t1.tv_sec-t0.tv_sec-1)%86400;
        ms=(1000000+t1.tv_usec-t0.tv_usec+500)/10000;
      } else {
        dd=(int)(t1.tv_sec-t0.tv_sec)/86400;
        ss=(t1.tv_sec-t0.tv_sec)%86400;
        ms=(t1.tv_usec-t0.tv_usec+500)/10000;
      }//end if
      int hh=ss/3600;
      int mm=(ss-hh*3600)/60;
      ss%=60;
      printf("%2d:%13ld%16ld%4.2d:%02d:%02d:%02d.%02d\n",
          size,TOTAL,UNIQUE,dd,hh,mm,ss,ms);
    }//end for
  }//end if
  return 0;
}

```

## CUDA 実行結果
```
GPUのマルチスレッド
ミラー GPUノードレイヤー
$ nvcc -O3 -arch=sm_61 02CUDA_Mirror.cu && ./a.out -n
 N:        Total      Unique      dd:hh:mm:ss.ms
 4:            2               0  00:00:00:00.13
 5:           10               0  00:00:00:00.00
 6:            4               0  00:00:00:00.00
 7:           40               0  00:00:00:00.00
 8:           92               0  00:00:00:00.00
 9:          352               0  00:00:00:00.00
10:          724               0  00:00:00:00.00
11:         2680               0  00:00:00:00.00
12:        14200               0  00:00:00:00.00
13:        73712               0  00:00:00:00.00
14:       365596               0  00:00:00:00.03
15:      2279184               0  00:00:00:00.19
16:     14772512               0  00:00:00:01.60
17:     95815104               0  00:00:00:15.10
18:    666090624               0  00:00:02:40.78
```

次回はノードレイヤーに行きます！



## 参考リンク
以下の詳細説明を参考にしてください。
[【参考リンク】Ｎクイーン問題 過去記事一覧](https://suzukiiichiro.github.io/search/?keyword=Ｎクイーン問題)
[【Github】エイト・クイーンのソース置き場 BashもJavaもPythonも！](https://github.com/suzukiiichiro/N-Queens)

Ｎクイーン問題（５０）第七章 マルチプロセス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-04-n-queens-suzuki/
Ｎクイーン問題（４９）第七章 マルチスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-03-n-queens-suzuki/
Ｎクイーン問題（４８）第七章 シングルスレッド Python編
https://suzukiiichiro.github.io/posts/2023-06-21-02-n-queens-suzuki/
Ｎクイーン問題（４７）第七章 クラス Python編
https://suzukiiichiro.github.io/posts/2023-06-21-01-n-queens-suzuki/
Ｎクイーン問題（４６）第七章 ステップＮの実装 Python編
https://suzukiiichiro.github.io/posts/2023-06-16-02-n-queens-suzuki/
Ｎクイーン問題（４５）第七章 キャリーチェーン Python編
https://suzukiiichiro.github.io/posts/2023-06-16-01-n-queens-suzuki/
Ｎクイーン問題（４４）第七章　対象解除法 Python編
https://suzukiiichiro.github.io/posts/2023-06-14-02-n-queens-suzuki/
Ｎクイーン問題（４３）第七章　ミラー Python編
https://suzukiiichiro.github.io/posts/2023-06-14-01-n-queens-suzuki/
Ｎクイーン問題（４２）第七章　ビットマップ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-05-n-queens-suzuki/
Ｎクイーン問題（４１）第七章　配置フラグ Python編
https://suzukiiichiro.github.io/posts/2023-06-13-04-n-queens-suzuki/
Ｎクイーン問題（４０）第七章　バックトラック Python編
https://suzukiiichiro.github.io/posts/2023-06-13-03-n-queens-suzuki/
Ｎクイーン問題（３９）第七章　バックトラック準備編 Python編
https://suzukiiichiro.github.io/posts/2023-06-13-02-n-queens-suzuki/
Ｎクイーン問題（３８）第七章　ブルートフォース Python編
https://suzukiiichiro.github.io/posts/2023-06-13-01-n-queens-suzuki/
Ｎクイーン問題（３７）第六章 C言語移植 その１７ pthread並列処理完成
https://suzukiiichiro.github.io/posts/2023-05-30-17-n-queens-suzuki/
Ｎクイーン問題（３６）第六章 C言語移植 その１６ pthreadの実装
https://suzukiiichiro.github.io/posts/2023-05-30-16-n-queens-suzuki/
Ｎクイーン問題（３５）第六章 C言語移植 その１５ pthread実装直前版完成
https://suzukiiichiro.github.io/posts/2023-05-30-15-n-queens-suzuki/
Ｎクイーン問題（３４）第六章 C言語移植 その１４
https://suzukiiichiro.github.io/posts/2023-05-30-14-n-queens-suzuki/
Ｎクイーン問題（３３）第六章 C言語移植 その１３
https://suzukiiichiro.github.io/posts/2023-05-30-13-n-queens-suzuki/
Ｎクイーン問題（３２）第六章 C言語移植 その１２
https://suzukiiichiro.github.io/posts/2023-05-30-12-n-queens-suzuki/
Ｎクイーン問題（３１）第六章 C言語移植 その１１
https://suzukiiichiro.github.io/posts/2023-05-30-11-n-queens-suzuki/
Ｎクイーン問題（３０）第六章 C言語移植 その１０
https://suzukiiichiro.github.io/posts/2023-05-30-10-n-queens-suzuki/
Ｎクイーン問題（２９）第六章 C言語移植 その９
https://suzukiiichiro.github.io/posts/2023-05-30-09-n-queens-suzuki/
Ｎクイーン問題（２８）第六章 C言語移植 その８
https://suzukiiichiro.github.io/posts/2023-05-30-08-n-queens-suzuki/
Ｎクイーン問題（２７）第六章 C言語移植 その７
https://suzukiiichiro.github.io/posts/2023-05-30-07-n-queens-suzuki/
Ｎクイーン問題（２６）第六章 C言語移植 その６
https://suzukiiichiro.github.io/posts/2023-05-30-06-n-queens-suzuki/
Ｎクイーン問題（２５）第六章 C言語移植 その５
https://suzukiiichiro.github.io/posts/2023-05-30-05-n-queens-suzuki/
Ｎクイーン問題（２４）第六章 C言語移植 その４
https://suzukiiichiro.github.io/posts/2023-05-30-04-n-queens-suzuki/
Ｎクイーン問題（２３）第六章 C言語移植 その３
https://suzukiiichiro.github.io/posts/2023-05-30-03-n-queens-suzuki/
Ｎクイーン問題（２２）第六章 C言語移植 その２
https://suzukiiichiro.github.io/posts/2023-05-30-02-n-queens-suzuki/
Ｎクイーン問題（２１）第六章 C言語移植 その１
N-Queens問://suzukiiichiro.github.io/posts/2023-05-30-01-n-queens-suzuki/
Ｎクイーン問題（２０）第五章 並列処理
https://suzukiiichiro.github.io/posts/2023-05-23-02-n-queens-suzuki/
Ｎクイーン問題（１９）第五章 キャリーチェーン
https://suzukiiichiro.github.io/posts/2023-05-23-01-n-queens-suzuki/
Ｎクイーン問題（１８）第四章 エイト・クイーンノスタルジー
https://suzukiiichiro.github.io/posts/2023-04-25-01-n-queens-suzuki/
Ｎクイーン問題（１７）第四章　偉人のソースを読む「Ｎ２４を発見 Ｊｅｆｆ Ｓｏｍｅｒｓ」
https://suzukiiichiro.github.io/posts/2023-04-21-01-n-queens-suzuki/
Ｎクイーン問題（１６）第三章　対象解除法 ソース解説
https://suzukiiichiro.github.io/posts/2023-04-18-01-n-queens-suzuki/
Ｎクイーン問題（１５）第三章　対象解除法 ロジック解説
https://suzukiiichiro.github.io/posts/2023-04-13-02-nqueens-suzuki/
Ｎクイーン問題（１４）第三章　ミラー
https://suzukiiichiro.github.io/posts/2023-04-13-01-nqueens-suzuki/
Ｎクイーン問題（１３）第三章　ビットマップ
https://suzukiiichiro.github.io/posts/2023-04-05-01-nqueens-suzuki/
Ｎクイーン問題（１２）第二章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-17-02-n-queens-suzuki/
Ｎクイーン問題（１１）第二章　配置フラグの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-17-01-n-queens-suzuki/
Ｎクイーン問題（１０）第二章　バックトラックの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-16-01-n-queens-suzuki/
Ｎクイーン問題（９）第二章　ブルートフォースの再帰・非再帰
https://suzukiiichiro.github.io/posts/2023-03-14-01-n-queens-suzuki/
Ｎクイーン問題（８）第一章　まとめ
https://suzukiiichiro.github.io/posts/2023-03-09-01-n-queens-suzuki/
Ｎクイーン問題（７）第一章　ブルートフォース再び
https://suzukiiichiro.github.io/posts/2023-03-08-01-n-queens-suzuki/
Ｎクイーン問題（６）第一章　配置フラグ
https://suzukiiichiro.github.io/posts/2023-03-07-01-n-queens-suzuki/
Ｎクイーン問題（５）第一章　進捗表示テーブルの作成
https://suzukiiichiro.github.io/posts/2023-03-06-01-n-queens-suzuki/
Ｎクイーン問題（４）第一章　バックトラック
https://suzukiiichiro.github.io/posts/2023-02-21-01-n-queens-suzuki/
Ｎクイーン問題（３）第一章　バックトラック準備編
https://suzukiiichiro.github.io/posts/2023-02-14-03-n-queens-suzuki/
Ｎクイーン問題（２）第一章　ブルートフォース
https://suzukiiichiro.github.io/posts/2023-02-14-02-n-queens-suzuki/
Ｎクイーン問題（１）第一章　エイトクイーンについて
https://suzukiiichiro.github.io/posts/2023-02-14-01-n-queens-suzuki/




## 書籍の紹介
{{% amazon

title="詳解 シェルスクリプト 大型本  2006/1/16"

url="https://www.amazon.co.jp/gp/proteect/4873112672/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873112672&linkCode=as2&tag=nlpqueens09-22&linkId=ef087fd92d3628bb94e1eb10cb202d43"

summary=`Unixのプログラムは「ツール」と呼ばれます。
Unixは、処理を実現するために複数の道具(ツール)を組み合わせる「ソフトウェアツール」という思想の下に設計されているためです。
そしてこれらツールを「組み合わせる」ということこそがUnixの真髄です。
また、シェルスクリプトの作成には言語自体だけでなくそれぞれのツールに対する理解も求められます。
つまり、あるツールが何のためのものであり、それを単体あるいは他のプログラムと組み合わせて利用するにはどのようにすればよいかということを理解しなければなりません。
本書は、Unixシステムへの理解を深めながら、シェルスクリプトの基礎から応用までを幅広く解説します。
標準化されたシェルを通じてUnix(LinuxやFreeBSD、Mac OS XなどあらゆるUnix互換OSを含む)の各種ツールを組み合わせ、
目的の処理を実現するための方法を詳しく学ぶことができます。
`
imageUrl="https://m.media-amazon.com/images/I/51EAPCH56ML._SL250_.jpg"
%}}

{{% amazon

title="UNIXシェルスクリプト マスターピース132"

url="https://www.amazon.co.jp/gp/proteect/4797377623/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797377623&linkCode=as2&tag=nlpqueens09-22&linkId=3c8d4566263ae99374221c4f8f469154"

summary=`すべてのUNIXエンジニア必携!!

サーバー管理、ネットワーク管理など、現場で使えるテクニックを豊富にちりばめたシェルスクリプトサンプル集の決定版。
知りたいことがきっと見つかる秘密の道具箱。Linux、FreeBSD、MacOS対応。
`
imageUrl="https://m.media-amazon.com/images/I/51R5SZKrEAL._SL250_.jpg"
%}}


{{% amazon

title="[改訂第3版]シェルスクリプト基本リファレンス ──#!/bin/shで、ここまでできる (WEB+DB PRESS plus) 単行本（ソフトカバー）  2017/1/20"

url="https://www.amazon.co.jp/gp/proteect/4774186945/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774186945&linkCode=as2&tag=nlpqueens09-22&linkId=8ef3ff961c569212e910cf3d6e37dcb6"

summary=`定番の1冊『シェルスクリプト基本リファレンス』の改訂第3版。
シェルスクリプトの知識は、プログラマにとって長く役立つ知識です。
本書では、複数のプラットフォームに対応できる移植性の高いシェルスクリプト作成に主眼を置き、
基本から丁寧に解説。
第3版では最新のLinux/FreeBSD/Solarisに加え、組み込み分野等で注目度の高いBusyBoxもサポート。
合わせて、全収録スクリプトに関してWindowsおよびmacOS環境でのbashの動作確認も行い、さらなる移植性の高さを追求。
ますますパワーアップした改訂版をお届けします。`
imageUrl="https://m.media-amazon.com/images/I/41i956UyusL._SL250_.jpg"
%}}

{{% amazon

title="新しいシェルプログラミングの教科書 単行本"

url="https://www.amazon.co.jp/gp/proteect/4797393106/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797393106&linkCode=as2&tag=nlpqueens09-22&linkId=f514a6378c1c10e59ab16275745c2439"

summary=`エキスパートを目指せ!!

システム管理やソフトウェア開発など、
実際の業務では欠かせないシェルスクリプトの知識を徹底解説

ほとんどのディストリビューションでデフォルトとなっているbashに特化することで、
類書と差別化を図るとともに、より実践的なプログラミングを紹介します。
またプログラミング手法の理解に欠かせないLinuxの仕組みについてもできるかぎり解説しました。
イマドキのエンジニア必携の一冊。

▼目次
CHAPTER01 シェルってなんだろう
CHAPTER02 シェルスクリプトとは何か
CHAPTER03 シェルスクリプトの基本
CHAPTER04 変数
CHAPTER05 クォーティング
CHAPTER06 制御構造
CHAPTER07 リダイレクトとパイプ
CHAPTER08 関数
CHAPTER09 組み込みコマンド
CHAPTER10 正規表現と文字列
CHAPTER11 シェルスクリプトの実行方法
CHAPTER12 シェルスクリプトのサンプルで学ぼう
CHAPTER13 シェルスクリプトの実用例
CHAPTER14 テストとデバッグ
CHAPTER15 読みやすいシェルスクリプト
`
imageUrl="https://m.media-amazon.com/images/I/41d1D6rgDiL._SL250_.jpg"
%}}



