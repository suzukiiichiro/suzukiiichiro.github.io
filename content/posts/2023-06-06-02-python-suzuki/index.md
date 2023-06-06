---
title: "Python入門 switchの構文がわかりません"
date: 2023-06-06T13:15:32+09:00
draft: true
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

## switchの構文がわかりません
pythonにはswitch構文はありません。
Python3.10で新しく導入される`match/case`を紹介します。

### 方法１．`match/case` で代用する
```python
#!/usr/local/env python3

def switch_statement_syntax_python():
	name = input("What is your name? ")
		match name:
			case "Joseph":
		print("Hello, Joseph!")
			case "Anna":
		print("Goodbye, Mary!")
			case _:
		print("Who are you?")

switch_statement_syntax_python()
```

```
$ What is your name?
$ Joseph
$ Hello, Joseph!
```

  
### 方法２．`if/else` で代用する

```python
#!/usr/local/env python3

def switch_statement_syntax_python():
	name = input("What is your name? ")
	if name == "Joseph":
		print("Hello, Joseph!")
	elif name == "Mary":
		print("Goodbye, Mary!")
	else:
		print("Who are you?")

switch_statement_syntax_python()
```


### 方法３．辞書で代用する

```python
#!/usr/local/env python3

def switch_statement_syntax_python():
    names = {
        "Joseph": "Hello, Joseph!",
        "Anna": "Goodbye Anna.",
    }
    name = input("What is your name? ")
    print(names.get(name, "Who are you?"))

switch_statement_syntax_python()
```

Python には他の言語のような switch ステートメントがありません。ただし、Python の「switch 」ステートメントは、「 match-case」メソッド、一連の「if/else」ステートメント、または「Dictionary 」を使用して実装できます。
