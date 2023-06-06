---
title: "Python入門 辞書内包表記ってなんですか？"
date: 2023-06-01T17:08:39+09:00
draft: true
authors: suzuki
image: python.jpg
categories:
  - programming
tags:
  - python
  - 鈴木維一郎
---

![](python.jpg)

## 辞書内包表記ってなんですか？
要素を順番に”仮変数”に取得し、”条件”に一致するものを使って{キー: 値}を持つ辞書を作るということです。

### ２つのリストからキーと値のペアのリストを生成
ここに２つのリストがあるとします。
```python
list1 = ['M', 'A', 'R', 'I', 'A']
list2 = [55, 16, 44, 22, 94]
```

こういう形にしたいと思います。
```
 {'M': 55, 'A': 94, 'R': 44, 'I': 22}
```

キーと値のペアになっています。
キーがあってもペアがない場合は出力に含まれません。
では、早速やってみましょう。


```python
#!/usr/local/env python3

def dictionary_Comprehension_Python():
  list1 = ['M', 'A', 'R', 'I', 'A']
  list2 = [55, 16, 44, 22, 94]

  com_Dict = { k:v for (k,v) in zip(list1, list2)}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94, 'R': 44, 'I': 22}

dictionary_Comprehension_Python()

```
com_Dict = {}
の中括弧は「辞書を作ります」という意味です。
zip(list1,list2)は、「list1」と「list2」のリスト２つを一つに固めて扱うことを意味します。
for(k,v) は、zip()で一つに固めたリストを、`k`と`v`２つの変数へ順番に取り込み、`k:v`へ順次注ぎ込み、com_Dict配列へ代入します。



### 条件に見合ったリストを生成
さらに条件をつけることもできます。
例えば、値が50以上のキーと値のペアを出力する。とか。

```python
#!/usr/local/env python3

def dictionary_Comprehension_Python():
  list1 = ['M', 'A', 'R', 'I', 'A']
  list2 = [55, 16, 44, 22, 94]

  #
  # 普通にペアを出力
  com_Dict = { k:v for (k,v) in zip(list1, list2)}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94, 'R': 44, 'I': 22}

  #
  # 50以上で出力
  com_Dict = { k:v for (k,v) in zip(list1, list2) if v>50}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94}
  
dictionary_Comprehension_Python()

```

### それでも辞書内包表記を使わない場合
辞書内包表記を使わずに`for`でやる方法は以下のとおりです。

```python
#!/usr/local/env python3

def dictionary_Comprehension_Python():
  list1 = ['M', 'A', 'R', 'I', 'A']
  list2 = [55, 16, 44, 22, 94]

  #
  # 普通にペアを出力
  com_Dict = { k:v for (k,v) in zip(list1, list2)}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94, 'R': 44, 'I': 22}

  #
  # 50以上で出力
  com_Dict = { k:v for (k,v) in zip(list1, list2) if v>50}     
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94}

  #
  # 辞書内包表記を使わずに出力
  for k, v in zip(list1,list2):
    if v>50:
      com_Dict[k] = v
  print ("Comprehension_Dict: ", com_Dict)
  # Comprehension_Dict:  {'M': 55, 'A': 94}
    
dictionary_Comprehension_Python()
```

## 辞書内包表記のメリット
辞書内包表記はシンプルに記載できます。
また、辞書内包表記は、辞書内包表記を使用しない記載方法よりも処理速度が速いことが大きなメリットと言えます。





