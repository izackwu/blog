---
layout: post
title: "Checkio 探险日志->Home->The Most Wanted Letter"
tags:
  - Checkio
  - Python
description: 本文是 CheckiO 探险日志系列第一篇
redirect_from:
  - /checkio-home-the-most-wanted-letter/
  - /checkio-home-the-most-wanted-letter
---

> 本文是 CheckiO 探险日志系列第一篇

## 系列前言

近日，在知乎上看到一个回答，推荐 [CheckiO](https://checkio.org/) 作为练习 Python 的绝佳网站。

**好奇心让我点进去，而其魅力让我流连。**

在 CheckiO，我可以完成 Python 的练习题，在线测试解法的正确性，并且更棒的是，**可以查看全球各地的程序员们所想出的各种奇妙解法**。

如其自述，“Online game for Python and JavaScript coders”，CheckiO 实在是很有趣，因此，从现在起，我开始了我的探险历程。

而这一系列的探险日志，就从这里开始吧。

---

## Home->The Most Wanted Letter

**题目描述**：编写一个函数，返回字符串中出现次数最多的字符。（详见 [The Most Wanted Letter](https://py.checkio.org/mission/most-wanted-letter/)）

**解题思路**：统计每个字符的出现次数，然后找到其中次数最多者。

---

### 0. 我的解法

```python
def checkio(text):
    counter=[0,]*26
    for c in text:
        if c.isalpha()==True:
            counter[ord(c.lower())-ord("a")]+=1
    maxn=0
    for i in range(0,26):
        if counter[i]>counter[maxn]:
            maxn=i
    return chr(maxn+ord("a"))
```

其实可以看出，我的这种写法带有很浓的 C 语言的风格，就像在操作 C 语言中的数组一样。

然而，这样的写法非常的原始，仅仅利用了 Python 中最低级的一些语法，没有发挥出** Python 的优雅特性**，不够“Pythonic”。

那么，怎样写才是优雅的呢？不妨参见 CheckiO 上其他人的写法：

---

### 1. [使用 max 函数](https://py.checkio.org/mission/most-wanted-letter/publications/bryukh/python-3/max-count/?ordering=most_voted&filtering=choice)

```python
import string
def checkio(text):
    text = text.lower()
    return max(string.ascii_lowercase, key=text.count)
```

首先，关注一下 ascii_lowercase，一个位于 string 模块中的常量。该模块中其他的常量一并罗列如下：

|       字符串常量       |                                                                              描述                                                                               |
| :--------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  string.ascii_letters  |                   The concatenation of the ascii_lowercase and ascii_uppercase constants described below. This value is not locale-dependent.                   |
| string.ascii_lowercase |                           The lowercase letters 'abcdefghijklmnopqrstuvwxyz'. This value is not locale-dependent and will not change.                           |
| string.ascii_uppercase |                           The uppercase letters 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'. This value is not locale-dependent and will not change.                           |
|     string.digits      |                                                                    The string '0123456789'.                                                                     |
|    string.hexdigits    |                                                              The string '0123456789abcdefABCDEF'.                                                               |
|    string.octdigits    |                                                                     The string '01234567'.                                                                      |
|   string.punctuatio    |                                     String of ASCII characters which are considered punctuation characters in the C locale.                                     |
|    string.printable    |             String of ASCII characters which are considered printable. This is a combination of digits, ascii_letters, punctuation, and whitespace.             |
|   string.whitespace    | A string containing all ASCII characters that are considered whitespace. This includes the characters space, tab, linefeed, return, formfeed, and vertical tab. |

其次，关注 max() 函数。在 Python 中，max() 是一个非常强大的内建函数，其官方文档如下：

> max(iterable, \*[, key, default])
>
> max(arg1, arg2, \*args[, key])
>
> Return the largest item **in an iterable or the largest of two or more arguments**.
>
> **If one positional argument is provided**, it should be an iterable. The largest item in the iterable is returned. **If two or more positional arguments are provided**, the largest of the positional arguments is returned.
>
> There are **two optional keyword-only arguments**. The key argument specifies **a one-argument ordering function** like that used for list.sort(). The default argument specifies **an object to return if the provided iterable is empty**. If the iterable is empty and default is not provided, a ValueError is raised.
>
> If multiple items are maximal, the function **returns the first one encountered**. This is consistent with other sort-stability preserving tools such as sorted(iterable, key=keyfunc, reverse=True)[0] and heapq.nlargest(1, iterable, key=keyfunc).

可以看出，max() 完美地解决了我们的问题。

### 2. [使用 lambda 匿名函数](https://py.checkio.org/mission/most-wanted-letter/publications/veky/python-3/key/?ordering=most_voted&filtering=choice)

```python
from string import ascii_lowercase as letters
checkio = lambda text: max(letters, key=text.lower().count)
```

lambda 匿名函数是函数式编程中一个极其重要的组成，有了它，我们可以大幅缩短缩写函数的代码量，并保持较高的可读性。

正如这种解法，原理与解法 1 完全一致，但利用 lambda 函数可以让代码更加简洁。

**也更加优雅。**

### 3. [使用 Counter 对象](https://py.checkio.org/mission/most-wanted-letter/publications/ForeverYoung/python-3/first/?ordering=most_voted&filtering=choice)

```python
from collections import Counter
def checkio(text):
    count = Counter([x for x in text.lower() if x.isalpha()])
    m = max(count.values())
    return sorted([x for (x, y) in count.items() if y == m])[0]
```

其实这种解法，是解法 1 的复杂化，用 Counter 对象替代字符串的 count() 函数，我个人并不认可。

不过，关于 Counter，还是有很多值得我们关注的。详细的描述可以参见 Python 的 [官方文档](https://docs.python.org/3/library/collections.html?highlight=counter#collections.Counter) 或者 [这篇文章](https://www.cnblogs.com/nisen/p/6052895.html)。

在此，摘录并整理部分来自上述两处的内容。

#### 创建：

> class collections.Counter(**[iterable-or-mapping]**)
>
> A Counter is **a dict subclass** for counting hashable objects. It is an **unordered** collection where elements are stored as dictionary keys and their counts are stored as dictionary values. Counts are allowed to be any integer value including zero or negative counts. The Counter class is similar to bags or multisets in other languages.
>
> Elements are counted from an iterable or initialized from another mapping (or counter).

举例如下：

```python
c = Counter()                           # 创建一个新的空 counter
c = Counter('abcasdf')                  # 一个迭代对象生成的 counter
c = Counter({'red': 4, 'yellow': 2})      # 一个映射生成的 counter
c = Counter(cats=2, dogs=5)             # 关键字参数生成的 counter
```

#### 使用：

> - Counter objects have a dictionary interface except that they **return a zero count for missing items** instead of raising a KeyError.
>
> - Counter objects support three methods beyond those available for all dictionaries:
>
> 1.  elements()
>
>     Return an iterator over elements repeating each as many times as its count. Elements are returned **in arbitrary order**. If an element’s count is less than one, elements() will ignore it.
>
> 2.  most_common([n])
>
>     Return **a list of the n most common elements and their counts from the most common to the least**. If n is omitted or None, most_common() returns all elements in the counter. Elements with equal counts are ordered arbitrarily.
>
> 3.  subtract([iterable-or-mapping])
>
>     Elements are subtracted from an iterable or from another mapping (or counter). Like dict.update() but subtracts counts instead of replacing them. Both inputs and outputs may be zero or negative.
>
> - The usual dictionary methods are available for Counter objects except for two which work differently for counters.
>
> 1.  fromkeys(iterable)
>
>     This class method is not implemented for Counter objects.
>
> 2.  update([iterable-or-mapping])
>
>     Elements are counted from an iterable or added-in from another mapping (or counter). Like dict.update() but **adds counts instead of replacing them**. Also, the iterable is expected to be a sequence of elements, not a sequence of (key, value) pairs.

可以看出，Counter 对象对于计数方面有着非常方便的使用，同时也可以基本上按照普通 dict 对象的方法来处理。

需要注意的是，Counter 对象还支持**直接用运算符来操作**，官方文档中的示例如下：

```python
>>> c = Counter(a=3, b=1)
>>> d = Counter(a=1, b=2)
>>> c + d                       # add two counters together:  c[x] + d[x]
Counter({'a': 4, 'b': 3})
>>> c - d                       # subtract (keeping only positive counts)
Counter({'a': 2})
>>> c & d                       # intersection:  min(c[x], d[x])
Counter({'a': 1, 'b': 1})
>>> c | d                       # union:  max(c[x], d[x])
Counter({'a': 3, 'b': 2})
>>> e = Counter(a=2, b=-4)
>>> +e                          # equal to Counter() + e
Counter({'a': 2})
>>> -e
Counter({'b': 4})               # equal to Counter() - e
```

### 4. [使用正则表达式](https://py.checkio.org/mission/most-wanted-letter/publications/ale1ster/python-3/counter/?ordering=most_voted&filtering=choice)

```python
from collections import Counter
import re
def checkio(text):
    return sorted(list(Counter(re.sub('[^a-z]', '', text.lower())).items()),
                 key = lambda v: (-v[1], v[0]))[0][0]
```

这种解法。.. 一言难尽。初看给人一种眼花缭乱的炫技感，仔细分析之后，只剩下膜拜。

篇幅所限，不引申关于 re 的知识，仅仅分析这段程序的原理。

首先，先看看函数的返回值是什么。`sorted(...)`返回排序之后的一个**列表**，而我们取这个列表的 [0][0] 位置的内容作为返回值。

那么，这个列表是什么？初步感觉，应该相当于 C 语言中的一个二维数组，才能取其 [0][0]。回到`sorted()`函数，我们知道，它的第一个参数应该是排序前的列表：`list(Counter(re.sub('[^a-z]', '', text.lower())).items())`。

不妨从内向外，解读一下这个列表：

- `re.sub('[^a-z]', '', text.lower())`是一个用`""`取代`text.lower()`中所有非小写字母的字符后的字符串，相当于只保留小写字母的`text.lower`。
- `Counter(re.sub('[^a-z]', '', text.lower()))` 是一个 Counter() 对象（同时也是一个 dict 对象）。
- `list(Counter(re.sub('[^a-z]', '', text.lower())).items())`是一个形如`[("a",1),("b",2)]`的列表。

再关注`sorted()`的第二个参数，`key = lambda v: (-v[1], v[0])`。

不得不说，这是一个很巧妙的设计。

其返回值是`(-v[1], v[0])`，形如`(-1,"a")`，这使得在排序时首先根据字符出现次数降序排序，其次根据字符的 ASCII 升序排序。恰如题目所要求。

至此，不难理解这段程序的原理了。

### 5. [一行代码的解法](https://py.checkio.org/mission/most-wanted-letter/publications/veky/python-3/shortest/?ordering=most_voted&filtering=choice)

> 一行代码可以解决的问题，何必用两行？——鲁迅

```python
checkio=lambda t:max(map(chr,range(97,123)),key=t.lower().count)
```

这种解法其实和解法 2 十分相似，唯一的不同在于用`map(chr,range(97,123))`取代了`string.ascii_lowercase`，从而减少了额外的`import`和代码量。

关于** map 函数**，其文档如下：

> map(func, \*iterables) --> map object
>
> Make an iterator that computes the function using arguments from each of the iterables. Stops when the shortest iterable is exhausted.

所以`map(chr,range(97,123))`得到了一个相当于`string.ascii_lowercase`的** map 对象**，由于它同样** Iterable**，所以 max 函数可以以它为参数。

---

以上，便是** CheckiO 探险日志->Home->The Most Wanted Letter **的全部内容。
