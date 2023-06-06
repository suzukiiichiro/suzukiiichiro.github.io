---
title: "Python入門 単一の文字列を文字列のリストに結合するにはどうすればよいですか?"
date: 2023-06-01T16:01:20+09:00
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

## 単一の文字列を文字列のリストに結合するにはどうすればよいですか?

### 方法 1: Python の「eval()」メソッドを使用して単一の文字列を文字列のリストに結合する方法

```python
#!/usr/local/env python3

def Python_Combine_Single_String_into_a_List_of_String_1():
  myStr1 = "'Hello', 'Its'"
  myStr2 = "'LinuxHint', 'World'"
  comStr = [ myStr1 , myStr2 ]
  # 普通に結合
  print( comStr )
  # ["'Hello', 'Its'", "'LinuxHint', 'World'"]

  # eval()で結合
  listStr = eval ( '+' . join ( comStr ) )
  print ( list ( listStr ) )
  # ['Hello', 'ItsLinuxHint', 'World']


Python_Combine_Single_String_into_a_List_of_String_1()
```

### 方法 2: Pythonの「ast()」メソッドを使用して単一の文字列を文字列のリストに結合する方法

```python
#!/usr/local/env python3

def Python_Combine_Single_String_into_a_List_of_String_2():
  myStr1 = "'Hello', 'Its'"
  myStr2 = "'LinuxHint', 'World'"
  comStr = [ myStr1 , myStr2 ]

  # 普通に結合
  print( comStr )
  # ["'Hello', 'Its'", "'LinuxHint', 'World'"]

  # eval()で結合
  listStr = eval ( '+' . join ( comStr ) )
  print ( list ( listStr ) )
  # ['Hello', 'ItsLinuxHint', 'World']

  # ast で結合
  import ast
  comStr=[]
  for m in (myStr1, myStr2):
    comStr.extend(ast.literal_eval(m))
  print(list(comStr))
  # ['Hello', 'Its', 'LinuxHint', 'World']

Python_Combine_Single_String_into_a_List_of_String_2()
```

`eval()` メソッドは、このプロセスに渡された指定された式全体を分析し、プログラム コード内の文字列を変換します。
これに対し、Python では文字列をリストに変換するモジュールとして`ast()` が提供されています。



