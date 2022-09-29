---
title: "アルゴリズム日記 2022/09/29"
description: "NQueenのロジックを研究してます。NQueenを別のアプローチから検証するためにアルゴリズムの勉強をはじめました。まずは基礎からで経路探索へ向かいたいと考えています。試行錯誤したことを備忘録として日記に追加することにしました。" 
date: 2022-09-29T09:55:55+09:00
draft: false 
image: path.png 
categories:
  - programming 
tags:
  - nQueen 
  - プログラム
---
## 9月29日

今日はバイナリサーチでツリーの中身を表示するメソッドを作成します。  
こんな感じでルートノードから下に向かってツリーの中身を出力します。  


```
......................................................
                                50                                                              
                25                              75                              
        12              37              --              87              
    --      --      30      43      --      --      --      93      
  --  --  --  --  --  33  --  --  --  --  --  --  --  --  --  97  
......................................................
```
javaのプログラムは以下の通り  
Stackを利用しています。  
bashにはStackがないのでメソッドを自作する必要がありそう  
Stackも配列の操作なのでbashの配列操作を使ってメソッドを作成します。  
配列操作の基本については鈴木維一郎先生が作成したページを参考にしてください。  
https://suzukiiichiro.github.io/posts/2022-09-27-01-array-suzuki/  


```
   public void displayTree()
      {
      Stack globalStack = new Stack();
      globalStack.push(root);
      int nBlanks = 32;
      boolean isRowEmpty = false;
      System.out.println(
      "......................................................");
      while(isRowEmpty==false)
         {
         Stack localStack = new Stack();
         isRowEmpty = true;

         for(int j=0; j<nBlanks; j++)
            System.out.print(' ');

         while(globalStack.isEmpty()==false)
            {
            Node temp = (Node)globalStack.pop();
            if(temp != null)
               {
               System.out.print(temp.iData);
               localStack.push(temp.leftChild);
               localStack.push(temp.rightChild);

               if(temp.leftChild != null ||
                                   temp.rightChild != null)
                  isRowEmpty = false;
               }
            else
               {
               System.out.print("--");
               localStack.push(null);
               localStack.push(null);
               }
            for(int j=0; j<nBlanks*2-2; j++)
               System.out.print(' ');
            }  // end while globalStack not empty
         System.out.println();
         nBlanks /= 2;
         while(localStack.isEmpty()==false)
            globalStack.push( localStack.pop() );
         }  // end while isRowEmpty is false
      System.out.println(
      "......................................................");
      }  // end displayTree()
// -------------------------------------------------------------
   }  // end class Tree

```
スタックは後入れ先出しです。  
pushで配列の後ろに要素を追加し、popで配列の一番後ろに入れた要素を取り出します。  
isEmptyという配列が空になったかを判定するメソッドも必要です。  
popで最後の配列要素をechoし、unsetで最後の配列要素を削除しようとしたのですが、  
current=$(localStack.pop)という形で呼び出すと、サブシェルで呼び出すのでechoで最後の要素の内容は受け取れるのですが、unsetの結果が反映されませんでした。  
しょうがないので最後の配列要素をechoするpeekメソッドを作り、popは、unsetだけする動作に変更しました。  


```
function Stack_global.push() {
    Stack_global+=($1)
}

function Stack_global.pop() {
    if [ ${#Stack_global[*]} == 0 ];then
      echo "null";
      return;
    fi
    local el=${Stack_global[${#Stack_global[*]}-1]}
    po=$((${#Stack_global[*]}-1))
    unset Stack_global[$po]
}
function Stack_global.peek() {
    if [ ${#Stack_global[*]} == 0 ];then
      echo "null";
      return;
    fi
    local el=${Stack_global[${#Stack_global[*]}-1]}
    po=$((${#Stack_global[*]}-1))
    echo $el
}
function Stack_global.isEmpty() {
  if [ ${#Stack_global[*]} == 0 ];then
    echo "true";
  else
    echo "false"
  fi
}


```

bashのプログラムは以下の形になります。  
```

   public void displayTree()
      {
      Stack globalStack = new Stack();
      globalStack.push(root);
      int nBlanks = 32;
      boolean isRowEmpty = false;
      System.out.println(
      "......................................................");
      while(isRowEmpty==false)
         {
         Stack localStack = new Stack();
         isRowEmpty = true;

         for(int j=0; j<nBlanks; j++)
            System.out.print(' ');

         while(globalStack.isEmpty()==false)
            {
            Node temp = (Node)globalStack.pop();
            if(temp != null)
               {
               System.out.print(temp.iData);
               localStack.push(temp.leftChild);
               localStack.push(temp.rightChild);

               if(temp.leftChild != null ||
                                   temp.rightChild != null)
                  isRowEmpty = false;
               }
            else
               {
               System.out.print("--");
               localStack.push(null);
               localStack.push(null);
               }
            for(int j=0; j<nBlanks*2-2; j++)
               System.out.print(' ');
            }  // end while globalStack not empty
         System.out.println();
         nBlanks /= 2;
         while(localStack.isEmpty()==false)
            globalStack.push( localStack.pop() );
         }  // end while isRowEmpty is false
      System.out.println(
      "......................................................");
      }  // end displayTree()
// -------------------------------------------------------------
   }  // end class Tree
```
Stackをglobal,localの２つを使っています。    
push,pop,isEmpty,peekのメソッドをそれぞれ個別に作成しましたが、evalで１つにまとめた方が良いかもしれません。    
