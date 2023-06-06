---
title: "Python入門 ASCII判定したいのですが？"
date: 2023-06-06T10:35:23+09:00
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

## ASCII判定したいのですが？
### 構文
```python
string.isascii ()
```

### 事例
```python
mystr="Python"
print('アルファベットの文字列はASCIIです:',mystr.isascii())

mystr="189456"
print('\n数字の文字列はASCIIです:',mystr.isascii())

mystr="!@#$%"
print('\nシンボルの文字列はASCIIです:',mystr.isascii())

mystr=""
print('\n空の文字列はASCIIです:',mystr.isascii())

mystr="❶"
print('\n非ASCII文字の文字列はASCIIです:',mystr.isascii())
```

実行結果は以下のとおりです。
```
bash-3.2$ python test.py
アルファベットの文字列はASCIIです: True

数字の文字列はASCIIです: True

シンボルの文字列はASCIIです: True

空の文字列はASCIIです: True

非ASCII文字の文字列はASCIIです: False
bash-3.2$
```

### isascii()を使ってif/elseで条件分岐する
```python
#!/usr/local/env/python3

str='Python Guide'
if str.isascii():
	print('"%s" is ASCII string.' %(str))
else:
	print('"%s" is not an ASCII string.' %(str))
```

```
bash-3.2$ python test.py
"Python Guide" is ASCII string.
bash-3.2$
```

