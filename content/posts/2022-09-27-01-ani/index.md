---
title: "アルゴリズム日記 2022/09/27"
description: "NQueenのロジックを研究してます。NQueenを別のアプローチから検証するためにアルゴリズムの勉強をはじめました。まずは基礎からで経路探索へ向かいたいと考えています。試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-09-27T09:55:55+09:00
draft: false 
image: path.png 
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 9月27日

アルゴリズムの勉強を始めました。  
まずは基礎から。  
バイナリサーチからスタートします。  
それまでのものは鈴木先生が作成している以下のgitをご参照ください。  
https://github.com/suzukiiichiro/Algorithms-And-Data-Structures  


まず、バイナリサーチの挿入のメソッドを作成したいと思います。  
ロジックは以下の通り  

バイナリサーチをするためにはソード済みであること必要なので、挿入時にrootノードの左側にrootノードより少ない値を、右側にrootノードより大きい値を置いていきます。各ノードは左右に最大２つのノードを持って枝分かれしていきます。それぞれのノードが左は自分より小さい値を右が自分より大きい値を置きます。  

・最初にルートを設定する（初回のinsertの時だけ動く）  
・ルートノードから値を比較しながら下のノードに移動していく  
・着目しているノードと目的の値を比較する。  
・目的の値 < 着目しているノード」なら左の子が、次の着目ノードとなる。  
・存在すれば、次の着目ノードに移って繰り返し。次の着目ノードが存在しなければ（現在の着目ノードが葉であれば）、一つ前の着目ノード(parent)の左(leftChild)位置にデータを挿入。  
・目的の値 > 着目しているノード」なら右の子が、次の着目ノードとなる。  
・存在すれば、次の着目ノードに移って繰り返し。次の着目ノードが存在しなければ（現在の着目ノードが葉であれば）、一つ前の着目ノード(parent)の右(rightChild)位置にデータを挿入。  


Javaのプログラムは以下の通り  

```
  public void insert(int id, double dd)
      {
      Node newNode = new Node();    // make new node
      newNode.iData = id;           // insert data
      newNode.dData = dd;
      if(root==null)                // no node in root
         root = newNode;
      else                          // root occupied
         {
         Node current = root;       // start at root
         Node parent;
         while(true)                // (exits internally)
            {
            parent = current;
            if(id < current.iData)  // go left?
               {
               current = current.leftChild;
               if(current == null)  // if end of the line,
                  {                 // insert on left
                  parent.leftChild = newNode;
                  return;
                  }
               }  // end if go left
            else                    // or go right?
               {
               current = current.rightChild;
               if(current == null)  // if end of the line
                  {                 // insert on right
                  parent.rightChild = newNode;
                  return;
                  }
               }  // end else go right
            }  // end while
         }  // end else not root
      }  // end insert()

```
これをbashに置き換えたいのですが、nodeがオブジェクトになっているのでbashでevalを使ってオブジェクトを再現したいと思います。  
setterメソッドがevalで動的にgetterメソッドを作成するという動きでオブジェクトを再現しています。  

```
#setメソッドはインスタンスのgetterメソッドを動的に生成する  
set_node_left() {
	eval "${1}.getLeftChild()  { echo "$2"; }"
}
set_node_right() {
	eval "${1}.getRightChild() { echo "$2"; }"
}
set_node_value() {
	eval "${1}.getValue()      { echo "$2"; }"
}
#インスタンスを生成する
function new_node() {
	local node_id="$1";
	local value="$2";
	local left="$3";
	local right="$4";
	eval "${node_id}set='set'";
	eval "set_node_value $node_id $value";
	eval "set_node_left $node_id $right";
	eval "set_node_right $node_id $right";
}

```
bashのプログラムは以下の通り  

```
function theTree_insert(){
  local value=$1;
  local id=$(gen_uid);
  #nodeのインスタンスを生成する。
  eval "new_node $id $value";
  #最初にルートを設定する（初回のinsertの時だけ動く）
  if [ -z "$root" ];then
    #ルートから手順を開始する。
    root=$id;
  else
    #ルートノードから値を比較しながら下のノードに移動していく 
    current=$root;
    parent="";
    while true;do
      parent=$current;
      #着目しているノードと目的の値を比較する。
      #目的の値 < 着目しているノード」なら左の子が、次の着目ノードとなる。
      if [ "$value" -lt $(${current}.getValue) ];then
        current=$(eval ${current}.getLeftChild);
        #存在すれば、次の着目ノードに移って繰り返し。
        if [ -z "$current" ];then
          #次の着目ノードが存在しなければ（現在の着目ノードが葉であれば）、一つ前の着目ノード(parent)の左(leftChild)位置にデータを挿入。
          set_node_left $parent $id;
          return;
        fi
      #「着目しているノード ≤ 目的の値」なら右の子が、次の着目ノードとなる。
      else
        current=$(eval ${current}.getRightChild);
        #存在すれば、次の着目ノードに移って繰り返し。
        if [ -z "$current" ];then
          #次の着目ノードが存在しなければ（現在の着目ノードが葉であれば）、一つ前の着目ノード(parent)の右(rightChild)位置にデータを挿入。
          set_node_right $parent $id;
          return;
        fi
      fi
    done
  fi  
}


```

