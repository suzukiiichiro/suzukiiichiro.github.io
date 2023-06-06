---
title: "Python入門 文字列内の最後の出現箇所を検索するにはどうすればよいですか？"
date: 2023-06-01T15:43:37+09:00
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
## 文字列内の最後の出現箇所を検索するにはどうすればよいですか？
Python 文字列内で最後に出現した文字のインデックスを取得する方法を説明します。

### 方法 1: 「rfind()」メソッドを適用して文字列内の最後の出現箇所を検索する

```python
#!/usr/local/env python3

def Python_Find_Last_Occurrence_in_String():
  # rfine()
  string_value = "Welcome to Python Guide"
  print(string_value.rfind('e')) 
  ## 22

Python_Find_Last_Occurrence_in_String()

```


### 方法 2: 「rindex()」メソッドを適用して文字列内の最後の出現箇所を検索する
```python
#!/usr/local/env python3

def Python_Find_Last_Occurrence_in_String():
  # rfine()
  string_value = "Welcome to Python Guide"
  print(string_value.rfind('e')) 
  # 22
  print(string_value.rindex('e'))
  # 22
Python_Find_Last_Occurrence_in_String()

```
### 方法 3: 「str.rpartition()」メソッドを適用して文字列内の最後の出現箇所を検索する
```python
#!/usr/local/env python3

def Python_Find_Last_Occurrence_in_String():
  #
  # rfine()
  string_value = "Welcome to Python Guide"
  print(string_value.rfind('e')) 
  # 22
  #
  # rindex()
  print(string_value.rindex('e'))
  # 22
  #
  # rpartition()
  print(string_value.rpartition('e'))
  #('Welcome to Python Guid', 'e', '')
  """
  最初の要素は、入力文字が最後に出現する前の文字列の一部です。
  2 番目の要素は、入力部分文字列/文字の最後の出現です。
  3 番目の要素は、定義された文字が最後に出現した後の文字列部分です。
  """

Python_Find_Last_Occurrence_in_String()

```

### 方法 4: 「for」ループを適用して最後の文字列を検索/取得する

```python
#!/usr/local/env python3

def Python_Find_Last_Occurrence_in_String():
  #
  # rfine()
  string_value = "Welcome to Python Guide"
  print(string_value.rfind('e')) 
  # 22
  #
  # rindex()
  print(string_value.rindex('e'))
  # 22
  #
  # rpartition()
  print(string_value.rpartition('e'))
  #('Welcome to Python Guid', 'e', '')
  """
  最初の要素は、入力文字が最後に出現する前の文字列の一部です。
  2 番目の要素は、入力部分文字列/文字の最後の出現です。
  3 番目の要素は、定義された文字が最後に出現した後の文字列部分です。
  """
  #
  # for
  for i in range(len(string_value) - 1, -1, -1):
      if string_value[i] == 'e':
          print(i)
          break
  ## 22

Python_Find_Last_Occurrence_in_String()

```

Pythonでは、文字列内の最後の出現箇所を検索するには、`rfind()`メソッド、`rindex()`メソッド、`str.rpartition()` メソッド、または `for `ループなどの検索方法があります。



