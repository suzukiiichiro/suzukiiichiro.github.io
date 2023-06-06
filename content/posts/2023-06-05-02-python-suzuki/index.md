---
title: "Python入門 文字列を置換したいのですが？"
date: 2023-06-05T15:24:57+09:00
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

## 文字列を置換したいのですが？
### 方法１．replace()を使う
```python
#!/usr/local/env python3

def Python_Replace_Characters_in_a_String():
  # 方法１
  old_value = "Python"
  new_value = "Java"
  print (old_value.replace ("Python",new_value)) 
  # Java

Python_Replace_Characters_in_a_String()
```

３つ目のパラメータで置換の回数を指定することもできます。
```python
#!/usr/local/env python3

def Python_Replace_Characters_in_a_String():
  # 方法１
  old_value = "Python"
  new_value = "Java"
  print (old_value.replace ("Python",new_value)) 
  # Java

  old_value = "ML を使用した Python または AI を使用した Python"
  new_value = "Java"
  print (old_value.replace ("Python",new_value,1))
  # ML を使用した Java または AI を使用した Python

Python_Replace_Characters_in_a_String()

```

３つ目のパラメータを`-1`に指定することですべての対象を置換することができます。

```python
#!/usr/local/env python3

def Python_Replace_Characters_in_a_String():
  # 方法１
  old_value = "Python"
  new_value = "Java"
  print (old_value.replace ("Python",new_value)) 
  # Java

  old_value = "ML を使用した Python または AI を使用した Python"
  new_value = "Java"
  print (old_value.replace ("Python",new_value,1))
  # ML を使用した Java または AI を使用した Python

  print (old_value.replace("Python",new_value,-1))
  # ML を使用した Java または AI を使用した Java

Python_Replace_Characters_in_a_String()
```

### 方法．re.sub()を使う
```python
#!/usr/local/env python3

def Python_Replace_Characters_in_a_String():
  # 方法１
  old_value = "Python"
  new_value = "Java"
  print ( old_value.replace ( "Python" , new_value ) ) 
  # Java

  old_value = "ML を使用した Python または AI を使用した Python"
  new_value = "Java"
  print ( old_value.replace ( "Python" , new_value, 1))
  # ML を使用した Java または AI を使用した Python

  print ( old_value.replace ( "Python" , new_value, -1))
  # ML を使用した Java または AI を使用した Java


  # 方法２
  import re
  print ( re.sub ( "Python","Java",old_value))
  # ML を使用した Java または AI を使用した Java

Python_Replace_Characters_in_a_String()
```


