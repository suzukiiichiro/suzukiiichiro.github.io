---
title: "Python入門 リストが空かどうかを確認するにはどうすればよいですか?"
date: 2023-06-01T14:09:34+09:00
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
## リストが空かどうかを確認するにはどうすればよいですか?

### 方法 1: Python で「not」演算子を使用して入力リストが空かどうかを確認する方法

```python
#!/usr/bin/env python3

def How_to_Check_If_a_List_Is_Empty_in_Python_1():
myList = []
  if not myList:
    print("The list is empty")
  else:
    print("The list is not empty")

How_to_Check_If_a_List_Is_Empty_in_Python_1()
```

### 方法 2: Python の「bool()」関数を使用して入力リストが空かどうかを確認する方法 

```python
#!/usr/bin/env python3

def How_to_Check_If_a_List_Is_Empty_in_Python_2():
myList2 = [ ]
  if not bool(myList2):
    print("The list is empty")
  else:
    print("The list is not empty")

How_to_Check_If_a_List_Is_Empty_in_Python_2()
```

### 方法 3: Python の「len()」関数を使用して入力リストが空かどうかを確認する方法

```python
#!/usr/bin/env python3

def How_to_Check_If_a_List_Is_Empty_in_Python_3():
  myList2 = [ ]
  if len(myList2) == 0:
    print("The list is empty")
  else:
    print("The list is not empty")

How_to_Check_If_a_List_Is_Empty_in_Python_3()
```

リストが空かどうかを確認するために、Python では複数の関数/演算子を使用できます。

１. `if`に組み込まれる`not`演算子、
２. オブジェクトのブール値を返す`bool()`関数、 
３. `true` `false` などオブジェクト内の項目の数を返す`len()`関数。

３つの方法でリストが空かどうかを確認する事ができます。


