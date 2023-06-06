---
title: "Python入門 複数行の代入はできますか？"
date: 2023-06-05T15:05:31+09:00
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

## 複数行の代入はできますか？
### 方法１．三重引用符`'''`で囲む。
```python
def Python_Multiline_String():
  multiline_string = '''Hello and
  Welcome to
  Python Guide
  '''
  print(multiline_string)
  """ output
  Hello and
  Welcome to
  Python Guide
  """
Python_Multiline_String()
```

### 方法２．エスケープ`\`を使う
```python
#!/usr/local/env python3

def Python_Multiline_String():
  multiline_string = '''Hello and
  Welcome to
  Python Guide
  '''
  print(multiline_string)
  """ output
  Hello and
  Welcome to
  Python Guide
  """ 
  multiline_string = 'Hello and\nWelcome to \nPython\nGuide'
  print(multiline_string)
  """ output
  Hello and
  Welcome to
  Python Guide
  """ 
Python_Multiline_String()
```

### 方法３．リストにしてjoin()でつなぐ
```python
#!/usr/local/env python3

def Python_Multiline_String():
  # 方法１
  multiline_string = '''Hello and
  Welcome to
  Python Guide
  '''
  print(multiline_string)
  """ output
  Hello and
  Welcome to
  Python Guide
  """ 
  # 方法２
  multiline_string = 'Hello and\nWelcome to \nPython\nGuide'
  print(multiline_string)

  # 方法３
  lines = ['Hello and', 'Welcome to', 'Python Guide']
  multiline_string = '\n'.join(lines)
  print(multiline_string)
  """ output
  Hello and
  Welcome to
  Python Guide
  """ 

Python_Multiline_String()
```

Python で複数行の文字列を作成するには、「三重引用符`'''`」、「エスケープ文字`\'」、「join()」メソッドなどのさまざまな方法を使用できます。
