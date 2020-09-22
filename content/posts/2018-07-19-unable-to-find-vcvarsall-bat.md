---
layout: post
title: Unable to find vcvarsall.bat?
tags:
  - Python
  - Windows
  - Error
  - Compile
  - C Extension
description: Windows 平台下 Python 编译 C 拓展出错：Unable to find vcvarsall.bat 的解决过程。
redirect_from:
  - /unable-to-find-vcvarsall-bat/
  - /unable-to-find-vcvarsall-bat
---

## 问题背景

近日在学习一门计算机视觉的课程：CS231n, 在做 Assignment2 的时候，由于我自己实现的卷积和池化层效率很低（含有大量未优化的循环操作）,
作业要求我编译其提供的高效率版本 (C 拓展的形式）, 然后才能进行下一步的组装卷积神经网络。

作业给的方法很简单，只需在`cs231n/`文件夹内运行如下代码：

```bash
python setup.py build_ext --inplace
```

但是当我这么做的时候，并没有成功，而是显示出错信息：

```
error: Unable to find vcvarsall.bat
```

花费许久时间，尝试了不同方法，最后终于解决了这个问题，故写此文记录。

## 解决过程

遇到这个问题，我的第一感觉：编译出错肯定是 Windows 系统的原因，要么少了什么，要么错了什么。毕竟，不同于 Linux, 编译这个操作并不是 Windows
的强项。用出错信息在网上搜索了一下，大多数人表示这是由于系统中没有安装对 C++的支持导致的，而解决方法是安装 Visual Studio.

但问题是，我的电脑上已经安装了最新的 VS2017, 且在安装时勾选了 C++和 Python 组件。更进一步，`vcvarsall.bat`这个文件也是存在的，
就在 VS 安装目录下的某个文件夹内。

那么，会不会是 Python 没法正确地找到电脑中的`vcvarsall.bat`呢？

继续搜索，有人表示查找这个文件的 Python 代码位于
`%Python%\Lib\distutils\msvc9compiler.py`文件的`find_vcvarsall(version)`函数中，代码如下：

```python
def find_vcvarsall(version):
    """Find the vcvarsall.bat file
    At first it tries to find the productdir of VS 2008 in the registry. If
    that fails it falls back to the VS90COMNTOOLS env var.
    """
    vsbase = VS_BASE % version
    try:
        productdir = Reg.get_value(r"%s\Setup\VC" % vsbase,
                                   "productdir")
    except KeyError:
        log.debug("Unable to find productdir in registry")
        productdir = None

    if not productdir or not os.path.isdir(productdir):
        toolskey = "VS%0.f0COMNTOOLS" % version
        toolsdir = os.environ.get(toolskey, None)

        if toolsdir and os.path.isdir(toolsdir):
            productdir = os.path.join(toolsdir, os.pardir, os.pardir, "VC")
            productdir = os.path.abspath(productdir)
            if not os.path.isdir(productdir):
                log.debug("%s is not a valid directory" % productdir)
                return None
        else:
            log.debug("Env var %s is not set or invalid" % toolskey)
    if not productdir:
        log.debug("No productdir found")
        return None
    vcvarsall = os.path.join(productdir, "vcvarsall.bat")
    if os.path.isfile(vcvarsall):
        return vcvarsall
    log.debug("Unable to find vcvarsall.bat")
    return None
```

代码看上去很复杂，但所做的无非是返回`vcvarsall.bat`文件的路径，那么，暂且不管为什么它找不到我电脑中的`vcvarsall.bat`,
如果我修改这段代码，让它直接返回硬编码的文件路径，或许就可以解决问题？因此，我做了如下修改：

```python
def find_vcvarsall(version):
    correct_vcvarsall= "....../vcvarsall.bat" #the correct path of vcvarsall.bat
    return correct_vcvarsall
```

方法简单粗暴，但是很不幸，修改之后重新尝试编译，依旧是同样的错误。

这就有些难以理解了：我已经让它返回正确的文件路径了，按理说已经可以找到`vcvarsall.bat`了，为什么还是不行呢？继续分析，两种可能性：

1. 这段代码并不是真正起作用的代码
2. 已有的`vcvarsall.bat`存在问题

由于我并不了解 Python 编译 C 拓展的具体过程，对于猜想 1 暂时无法验证，所以只能从猜想 2 入手。

如果`vcvarsall.bat`有问题，那么解决这个问题的最简单方案就是重新安装 VS. 于是我彻底卸载了旧有的 VS2017, 但在准备重新下载安装时，
无意中发现了 [MSDN 上的一篇文章](https://blogs.msdn.microsoft.com/pythonengineering/2016/04/11/unable-to-find-vcvarsall-bat/).
其作者简单解释了出错的原因并给出了解决方案：

<figure>
    <a href="https://pic.imwzk.com/unable-to-find-vcvarsall-bat-msdn.png"><img src="https://pic.imwzk.com/unable-to-find-vcvarsall-bat-msdn.png"></a>
    <figcaption>MSDN: Solutions</figcaption>
</figure>

对于 Windows 上的问题，MSDN 上的解决方案自然是最可能成功的，于是，按照其指引，我下载了
[Visual C++ Build Tools 2015](http://go.microsoft.com/fwlink/?LinkId=691126) 并安装（不安装整个 VS 是因为它太庞大了）.

然后，见证奇迹的时候到了，再次尝试编译：

```
running build_ext
building 'im2col_cython' extension
creating build
creating build\temp.win-amd64-3.7
creating build\temp.win-amd64-3.7\Release
C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\x86_amd64\cl.exe /c /nologo /Ox /W3 /GL /DNDEBUG /MD "-IC:\Program Files\Python37\lib\site-packages\numpy\core\include" "-IC:\Program Files\Python37\include" "-IC:\Program Files\Python37\include" "-IC:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\INCLUDE" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\ucrt" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\shared" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\um" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\winrt" /Tcim2col_cython.c /Fobuild\temp.win-amd64-3.7\Release\im2col_cython.obj
im2col_cython.c
c:\program files\python37\lib\site-packages\numpy\core\include\numpy\npy_1_7_deprecated_api.h(12) : Warning Msg: Using deprecated NumPy API, disable it by #defining NPY_NO_DEPRECATED_API NPY_1_7_API_VERSION
im2col_cython.c(2955): warning C4244: '=': conversion from 'long' to 'char', possible loss of data
im2col_cython.c(3333): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3342): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3351): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3360): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3817): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3826): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3835): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3844): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(4850): warning C4244: '=': conversion from 'long' to 'char', possible loss of data
im2col_cython.c(7107): warning C4244: '=': conversion from 'long' to 'char', possible loss of data
im2col_cython.c(30077): warning C4244: 'initializing': conversion from 'double' to 'float', possible loss of data
im2col_cython.c(30083): warning C4244: 'initializing': conversion from 'double' to 'float', possible loss of data
C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\x86_amd64\link.exe /nologo /INCREMENTAL:NO /LTCG /DLL /MANIFEST:EMBED,ID=2 /MANIFESTUAC:NO "/LIBPATH:C:\Program Files\Python37\libs" "/LIBPATH:C:\Program Files\Python37\PCbuild\amd64" "/LIBPATH:C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\LIB\amd64" "/LIBPATH:C:\Program Files (x86)\Windows Kits\10\lib\10.0.17134.0\ucrt\x64" "/LIBPATH:C:\Program Files (x86)\Windows Kits\10\lib\10.0.17134.0\um\x64" /EXPORT:PyInit_im2col_cython build\temp.win-amd64-3.7\Release\im2col_cython.obj /OUT:C:\MyCode\Learning-CS231n\assignment2\cs231n\im2col_cython.cp37-win_amd64.pyd /IMPLIB:build\temp.win-amd64-3.7\Release\im2col_cython.cp37-win_amd64.lib
im2col_cython.obj : warning LNK4197: export 'PyInit_im2col_cython' specified multiple times; using first specification
   Creating library build\temp.win-amd64-3.7\Release\im2col_cython.cp37-win_amd64.lib and object build\temp.win-amd64-3.7\Release\im2col_cython.cp37-win_amd64.exp
Generating code
Finished generating code
LINK : fatal error LNK1158: cannot run 'rc.exe'
error: command 'C:\\Program Files (x86)\\Microsoft Visual Studio 14.0\\VC\\BIN\\x86_amd64\\link.exe' failed with exit status 1158
```

嗯。.. 不同于之前找不到`vcvarsall.bat`的错误，现在有了很大的进展，但可惜的是，最后还是出错了。

注意到出错消息的最后给了一个错误代码：`exit status 1158`, 以此搜索，非常顺利地，在 StackOverflow 上找到了一个
[相同的问题](https://stackoverflow.com/questions/43858836/python-installing-clarifai-vs14-0-link-exe-failed-with-exit-status-1158)
, 给出的答案看上去非常靠谱：

<figure>
    <a href="https://pic.imwzk.com/stackoverflow-exit-status-1158.png"><img src="https://pic.imwzk.com/stackoverflow-exit-status-1158.png"></a>
    <figcaption>StackOverflow: Solutions</figcaption>
</figure>

执行所述操作，然后再次见证奇迹：

```
running build_ext
building 'im2col_cython' extension
C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\x86_amd64\cl.exe /c /nologo /Ox /W3 /GL /DNDEBUG /MD "-IC:\Program Files\Python37\lib\site-packages\numpy\core\include" "-IC:\Program Files\Python37\include" "-IC:\Program Files\Python37\include" "-IC:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\INCLUDE" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\ucrt" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\shared" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\um" "-IC:\Program Files (x86)\Windows Kits\10\include\10.0.17134.0\winrt" /Tcim2col_cython.c /Fobuild\temp.win-amd64-3.7\Release\im2col_cython.obj
im2col_cython.c
c:\program files\python37\lib\site-packages\numpy\core\include\numpy\npy_1_7_deprecated_api.h(12) : Warning Msg: Using deprecated NumPy API, disable it by #defining NPY_NO_DEPRECATED_API NPY_1_7_API_VERSION
im2col_cython.c(2955): warning C4244: '=': conversion from 'long' to 'char', possible loss of data
im2col_cython.c(3333): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3342): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3351): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3360): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3817): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3826): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3835): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(3844): warning C4244: '=': conversion from 'npy_intp' to 'int', possible loss of data
im2col_cython.c(4850): warning C4244: '=': conversion from 'long' to 'char', possible loss of data
im2col_cython.c(7107): warning C4244: '=': conversion from 'long' to 'char', possible loss of data
im2col_cython.c(30077): warning C4244: 'initializing': conversion from 'double' to 'float', possible loss of data
im2col_cython.c(30083): warning C4244: 'initializing': conversion from 'double' to 'float', possible loss of data
C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\BIN\x86_amd64\link.exe /nologo /INCREMENTAL:NO /LTCG /DLL /MANIFEST:EMBED,ID=2 /MANIFESTUAC:NO "/LIBPATH:C:\Program Files\Python37\libs" "/LIBPATH:C:\Program Files\Python37\PCbuild\amd64" "/LIBPATH:C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\LIB\amd64" "/LIBPATH:C:\Program Files (x86)\Windows Kits\10\lib\10.0.17134.0\ucrt\x64" "/LIBPATH:C:\Program Files (x86)\Windows Kits\10\lib\10.0.17134.0\um\x64" /EXPORT:PyInit_im2col_cython build\temp.win-amd64-3.7\Release\im2col_cython.obj /OUT:C:\MyCode\Learning-CS231n\assignment2\cs231n\im2col_cython.cp37-win_amd64.pyd /IMPLIB:build\temp.win-amd64-3.7\Release\im2col_cython.cp37-win_amd64.lib
im2col_cython.obj : warning LNK4197: export 'PyInit_im2col_cython' specified multiple times; using first specification
   Creating library build\temp.win-amd64-3.7\Release\im2col_cython.cp37-win_amd64.lib and object build\temp.win-amd64-3.7\Release\im2col_cython.cp37-win_amd64.exp
Generating code
Finished generating code
```

成功。

## 总结

编译这么一件小事，按理说一行命令就能解决的事，在 Windows 下变得如此麻烦，尽管我最终解决了问题，但实在耗费了不少精力。

如果有得选，我选择 Linux, 就不会有这些麻烦了。..
