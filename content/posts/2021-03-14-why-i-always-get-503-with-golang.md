---
layout: post
title: 为什么用 Go 访问某网站始终会 503 Service Unavailable ？ 
tags:
  - Go
  - Debug
  - HTTP
  - TLS/SSL
  - 计算机网络
description: 记一次耗费了我三天精力，但是相当有趣的 Debug 经历
image: /image/network-error.png
---

## 发生了什么事？

得益于近年来网络资料的宣传普及与现代编程语言的强大标准库，编程爬取网站的内容（即写爬虫）成为了一件相当简单的事情：无非是调用各个编程语言自带的网络库，最多再手动设置一些参数以尽可能地伪装成正常用户以绕开网站的反爬限制。对于熟悉 Python 的同学，上面说的内容甚至不过只是两三行代码的事情。

### 问题描述

然而，几天前，我却遇到了一个相当棘手的爬虫问题（[Github Issue](https://github.com/miniflux/v2/issues/1047)）：[某一个神奇的网站](https://www.bundesregierung.de/breg-en)，用户可以正常访问，用 Python 等语言写的（简易）爬虫可以正常访问，甚至直接用 `curl` 也能正常访问，唯独用 Go 语言写的（简易）爬虫始终被 `503 Service Unavailable` 拒之门外，尝试多种伪装策略（如 `User-Agent`）均以失败告终。更加神奇的是，如果让 Go 发出的请求经由本机的某个代理（比如为了抓包观察），那么一切又能正常工作了（这一点是我在调试过程中发现的，一开始并不知道）。

如果你读了我的上述描述，和当时的我一样觉得不可思议：难道编程语言还有高下之分？这个网站歧视某些编程语言？同时又有些跃跃欲试的想法，不妨先停止阅读，花一点时间，参考我下面贴出的代码，尝试复现并解决这个神奇的问题。

### 复现代码

首先是始终会得到 `503 Service Unavailable` 错误的 Go 语言代码：

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	resp, err := http.Get("https://www.bundesregierung.de/breg-en")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()
	fmt.Println(resp.Status)
}

// Output:
// 503 Service Temporarily Unavailable
```

然后是普普通通而且仅有 3 行，但是可以正常工作的 Python 代码：

```python
import urllib.request
resp = urllib.request.urlopen("https://www.bundesregierung.de/breg-en")
print(resp.status)

# Output:
# 200
```

最后是简单直接的 `curl` 命令：

```bash
# -s: silent mode to hide progress meter or error messages
# -o: redirect output to file (any write to /dev/null is discarded)
# -w: display certain information on completion (http_code is a variable)
$ curl -s -o /dev/null -w "%{http_code}" "https://www.bundesregierung.de/breg-en"
200
```

## 我是如何调试的？

### HTTP Headers

在遇到这个问题时，我的第一反应是：对方网站肯定有某种反爬虫机制。然而，作为一个没写过多少爬虫代码的小白，我又实在感到有些费解：既然如此，为何用 Python 写的爬虫简陋不堪却能正常工作呢？

或许是这个网站针对性地不让 Go HTTP Client 访问？假如是这样，在大多数情况下，服务器是通过 `User-Agent` 等 HTTP Headers 来识别请求的来源，那么，我只需要手动设置 HTTP Headers 进行伪装，似乎就可以绕开这样的检测？为了验证这个猜想，我做了两个实验：

1. 把 Go HTTP Client 伪装成 `curl`：结果依旧是 `503`。（需要说明的是，由于 Go HTTP Client 会自动给 Headers 加上 `Accept-Encoding: gzip`，所以此处的 Headers 实际上不完全和 `curl` 一样，不过在此也无关紧要了，原因见后文的进一步实验。）
   
```go
package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
)

func main() {
	client := http.Client{}
	req, err := http.NewRequest("GET", "https://www.bundesregierung.de/breg-en", nil)
	req.Header.Add("User-Agent", `curl/7.68.0`)
	req.Header.Add("Accept", "*/*")
	resp, err := client.Do(req)
	requestDump, _ := httputil.DumpRequestOut(req, false)
	fmt.Println(string(requestDump))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()
	fmt.Println(resp.Status)
}

// Output:
// GET /breg-en HTTP/1.1
// Host: www.bundesregierung.de
// User-Agent: curl/7.68.0
// Accept: */*
// Accept-Encoding: gzip
// 
//
// 503 Service Temporarily Unavailable
```

2. 把 `curl` 伪装成 Go HTTP Client：可以正常工作。

```bash
$ curl -v "https://www.bundesregierung.de/breg-en" -H "User-Agent: Go-http-client/1.1" -H "Accept-Encoding: gzip"
# ...
> GET /breg-en HTTP/1.1
> Host: www.bundesregierung.de
> Accept: */*
> User-Agent: Go-http-client/1.1
> Accept-Encoding: gzip
>
< HTTP/1.1 200 OK
# ...
```

面对以上奇怪的实验结果，我起初怀疑是我有所疏漏，然而反复检查之后，我不得不承认 Go 和 `curl` 发出的请求在 HTTP 层面确实完全一致。那么，我所得出的结论只能是：请求返回 `503` 并不是因为 Go HTTP Client 所发出的 HTTP 请求具有某种特征。然而「同样」的 HTTP 请求，由 Go HTTP Client 发出会被 `503`，由 `curl` 发出就能正常得到响应，难道是 Go 本身存在问题？

### Go `net/http`

本着「大胆假设，小心求证」的原则，既然同样的请求由 Go 和 `curl` 发出会得到不同的结果，那我便大胆地怀疑是 Go 的 HTTP 标准库 `net/http` 存在问题（似乎过于大胆了……）:

![My Twitter Screenshot](/image/go-net-twitter.png)

然而，在埋头扎进 `net/http` 的源码几个小时之后，虽然我通过读代码+断点调试了解到了不少其内部实现细节，然而面对庞杂的代码库，实在有些大海捞针的无力感。另一方面，在冷静下来之后，我倾向于相信 Go 的 HTTP 标准库本身并没有与此相关的 Bug，毕竟这是一个广泛使用且成熟的标准库。另外，至少从概率上来说，问题出在其他地方的可能性会更大一些。

### Fiddler 抓包

稍加思索，对方服务器必然是通过某种特征区分源于 Go 和 `curl` 的请求。既然应用层的 HTTP 请求本身没有特征，难道是其下的传输层特征被识别？然而 TCP 栈更多是由操作系统提供，Go 和 `curl` 的 TCP 请求在此层面似乎也没有什么区别，不太可能因此被区分。至于更往下的网络层、传输层和物理层，就更加不具有现实可能性了。

一切似乎陷入了僵局？万般无奈之下，尽管没有报太大的指望，但是我想到了 [Fiddler](https://www.telerik.com/fiddler) 这款抓包工具，试图抓包研究请求的细微差异。只需要让 Go 发出的请求经由 Fiddler 提供的代理：

```go
os.Setenv("HTTPS_PROXY", "127.0.0.1:8866") // Fiddler's proxy address
```

由于对方网站采用了 HTTPS 协议，单纯地经由代理只能捕捉到 TLS 的握手请求，而无从得知 HTTPS 请求本身。好在 Fiddler 提供了相应的功能，在信任其证书之后，便可开启 Capture HTTPS trafic 功能。

![Fiddler HTTPS](/image/fiddler-https.png)

然而此时，神奇的现象出现了：原本还是 `503` 的请求，在经由 Fiddler 代理之后，居然奇迹般地返回了 `200` 正常响应！不由得让我感到十分振奋（毕竟这证明了 Go 本身发出的请求并没有问题，是可以正常被服务器处理的），同时又无比费解，为什么同样的请求经过代理转发就能正常响应呢？

为了探寻原因，我试着关闭了 Fiddler 的 Capture HTTPS trafic 功能，结果又恢复了 `503` 错误。

也就是说，如果 Fiddler 仅仅是转发 HTTPS 请求，那么 `503` 依旧；而如果作为中间人，拦截 HTTPS 请求，解码查看内容之后再重新发送，一切就能 `200` 正常工作。

所以，两者的区别在哪里？TLS。

### TLS

虽然 HTTP 请求本身一样（正如我一开始所做的实验），但是由于 Fiddler 与 Go HTTP Client 的 TLS 客户端实现上的差异，在 TLS 握手阶段，二者的请求（比如 Client Hello 请求）存在区别，因而导致了不同的响应。

为了确定我的这个猜想，我使用 [Wireshark](https://www.wireshark.org/) 捕获了两者的 Client Hello 握手请求：

- Go HTTP Client 的默认 TLS 握手 Client Hello 请求：
```text
0000   16 03 01 01 1f 01 00 01 1b 03 03 db ea 2e f0 b1   ................
0010   b1 ef 94 03 c6 03 6a 44 52 65 c3 5f 14 f4 76 89   ......jDRe._..v.
0020   7b 84 d3 05 d9 0d 31 e7 aa 55 b4 20 9e 91 91 f6   {.....1..U. ....
0030   dc eb 59 3b 34 b8 0d dd f8 8a 50 79 cd 42 38 14   ..Y;4.....Py.B8.
0040   b0 33 56 13 cd 19 db 2d 00 d9 19 0c 00 26 c0 2f   .3V....-.....&./
0050   c0 30 c0 2b c0 2c cc a8 cc a9 c0 13 c0 09 c0 14   .0.+.,..........
0060   c0 0a 00 9c 00 9d 00 2f 00 35 c0 12 00 0a 13 01   ......./.5......
0070   13 03 13 02 01 00 00 ac 00 00 00 1b 00 19 00 00   ................
0080   16 77 77 77 2e 62 75 6e 64 65 73 72 65 67 69 65   .www.bundesregie
0090   72 75 6e 67 2e 64 65 00 05 00 05 01 00 00 00 00   rung.de.........
00a0   00 0a 00 0a 00 08 00 1d 00 17 00 18 00 19 00 0b   ................
00b0   00 02 01 00 00 0d 00 1a 00 18 08 04 04 03 08 07   ................
00c0   08 05 08 06 04 01 05 01 06 01 05 03 06 03 02 01   ................
00d0   02 03 ff 01 00 01 00 00 10 00 0e 00 0c 02 68 32   ..............h2
00e0   08 68 74 74 70 2f 31 2e 31 00 12 00 00 00 2b 00   .http/1.1.....+.
00f0   09 08 03 04 03 03 03 02 03 01 00 33 00 26 00 24   ...........3.&.$
0100   00 1d 00 20 a5 ef 30 b8 03 04 8b 35 7c 43 d8 38   ... ..0....5|C.8
0110   3b 50 60 7e a6 8b a2 74 7e b6 18 ce 5d 32 af 5b   ;P`~...t~...]2.[
0120   2a ae ee 3e                                       *..>
```
- Fiddler 发出 TLS 握手 Client Hello 请求：
```text
0000   16 03 03 01 7d 01 00 01 79 03 03 60 4e 05 ed b3   ....}...y..`N...
0010   96 19 ea 68 24 d6 20 e5 6a 96 7d 1b 17 09 91 77   ...h$. .j.}....w
0020   ca c6 03 92 f7 e5 a2 8a 5d 76 10 00 00 2a c0 2c   ........]v...*.,
0030   c0 2b c0 30 c0 2f 00 9f 00 9e c0 24 c0 23 c0 28   .+.0./.....$.#.(
0040   c0 27 c0 0a c0 09 c0 14 c0 13 00 9d 00 9c 00 3d   .'.............=
0050   00 3c 00 35 00 2f 00 0a 01 00 01 26 00 00 00 1b   .<.5./.....&....
0060   00 19 00 00 16 77 77 77 2e 62 75 6e 64 65 73 72   .....www.bundesr
0070   65 67 69 65 72 75 6e 67 2e 64 65 00 0a 00 08 00   egierung.de.....
0080   06 00 1d 00 17 00 18 00 0b 00 02 01 00 00 0d 00   ................
0090   14 00 12 04 01 05 01 02 01 04 03 05 03 02 03 02   ................
00a0   02 06 01 06 03 00 23 00 d0 82 b6 de 47 77 d7 cc   ......#.....Gw..
00b0   bc c9 08 b9 50 41 ae 7d 4b 7d a8 b8 5d 3f 6e 85   ....PA.}K}..]?n.
00c0   56 25 81 39 7b f0 79 c2 4d d9 88 41 ae ed 83 30   V%.9{.y.M..A...0
00d0   15 42 be de 3b 2e 4f ae 9f 29 44 3c 22 32 e3 84   .B..;.O..)D<"2..
00e0   1a 39 79 5c 2c 7d bf 18 48 bf 86 fe 96 09 58 c1   .9y\,}..H.....X.
00f0   69 67 d4 b4 1e 4b bd 8b 33 29 0b 49 18 7f 36 e5   ig...K..3).I..6.
0100   2c fc 33 40 44 3d f2 8e 11 c8 e0 fd 91 cd 64 1b   ,.3@D=........d.
0110   95 66 b2 c8 a2 93 96 3f d3 28 4f ce bc 79 e3 37   .f.....?.(O..y.7
0120   2d c0 ab 87 35 78 97 5b 5f 37 81 c3 15 76 04 04   -...5x.[_7...v..
0130   2c 05 f2 59 be f3 c4 e7 51 bf 7a 83 56 9b 8d cc   ,..Y....Q.z.V...
0140   60 f5 d9 7b 00 a8 1b 09 35 88 44 97 c1 52 e5 4e   `..{....5.D..R.N
0150   ec e3 b8 cf e1 a3 a5 47 49 3a 2e f0 15 b7 86 f8   .......GI:......
0160   44 08 74 c1 47 44 3c 62 9e ea 30 27 28 2b 16 e5   D.t.GD<b..0'(+..
0170   0c 9b ed 35 51 fd b4 19 47 00 17 00 00 ff 01 00   ...5Q...G.......
0180   01 00                                             ..
```

很明显，二者存在差异（至少长度不一样）。如果进一步查看的话，可以发现内部的差异主要在于 Cipher Suites 和 Extensions 两部分，以前者为例（事实上，最后的实验也表明这确实是对方服务器的检测指标）：

- Go HTTP Client 
```text
Cipher Suites (19 suites)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 (0xc02b)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 (0xc02c)
    Cipher Suite: TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 (0xcca8)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 (0xcca9)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (0xc013)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA (0xc009)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (0xc014)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA (0xc00a)
    Cipher Suite: TLS_RSA_WITH_AES_128_GCM_SHA256 (0x009c)
    Cipher Suite: TLS_RSA_WITH_AES_256_GCM_SHA384 (0x009d)
    Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA (0x002f)
    Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA (0x0035)
    Cipher Suite: TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA (0xc012)
    Cipher Suite: TLS_RSA_WITH_3DES_EDE_CBC_SHA (0x000a)
    Cipher Suite: TLS_AES_128_GCM_SHA256 (0x1301)
    Cipher Suite: TLS_CHACHA20_POLY1305_SHA256 (0x1303)
    Cipher Suite: TLS_AES_256_GCM_SHA384 (0x1302)
```

- Fiddler
```text
Cipher Suites (21 suites)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 (0xc02c)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 (0xc02b)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)
    Cipher Suite: TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 (0x009f)
    Cipher Suite: TLS_DHE_RSA_WITH_AES_128_GCM_SHA256 (0x009e)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 (0xc024)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 (0xc023)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 (0xc028)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 (0xc027)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA (0xc00a)
    Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA (0xc009)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (0xc014)
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (0xc013)
    Cipher Suite: TLS_RSA_WITH_AES_256_GCM_SHA384 (0x009d)
    Cipher Suite: TLS_RSA_WITH_AES_128_GCM_SHA256 (0x009c)
    Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA256 (0x003d)
    Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA256 (0x003c)
    Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA (0x0035)
    Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA (0x002f)
    Cipher Suite: TLS_RSA_WITH_3DES_EDE_CBC_SHA (0x000a)
```

既然如此，很自然的想法便是：只需要自定义 Go HTTP Client 所采用的 Cipher Suites，而不是使用其默认值，即可绕开检测？根据上面的抓包结果，可以知道，Go 所采用的默认 Cipher Suites 有 19 个（取决于平台环境，此为我的环境下的默认值），其中 [最后 3 个为 TLS 1.3 专属，无法自定义](https://github.com/golang/go/blob/88b8a1608987d494f3f29618e7524e61712c31ba/src/crypto/tls/common.go#L626)，不过我们可以灵活调整前面的 16 个。最简单的想法是，不改变这些 Cipher Suites，但是改变它们的顺序，从而绕开简单的特征匹配：

```go
package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
)

func main() {
	defaultCipherSuites := []uint16{0xc02f, 0xc030, 0xc02b, 0xc02c, 0xcca8, 0xcca9, 0xc013, 0xc009, 
            0xc014, 0xc00a, 0x009c, 0x009d, 0x002f, 0x0035, 0xc012, 0x000a}
	client := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				CipherSuites: append(defaultCipherSuites[8:], defaultCipherSuites[:8]...),
			},
		},
	}
	req, err := http.NewRequest("GET", "https://www.bundesregierung.de/breg-en", nil)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()
	fmt.Println(resp.Status)
}

// Output:
// 200 OK
```

大功告成！

看来一切的根源确实在于 Go HTTP Client 所采用的默认 TLS Cipher Suites，由于其过于特殊，被对方服务器视作了某种检测特征，据此对请求返回 `503 Service Unavailable`，只需要人为改变 Cipher Suites，便可以轻松绕开这样的检测。

## 尾声

在耗费我三天的精力之后，我终于从根源上发掘出了问题的起源，并找到了简单的应对措施。虽然中途绕了好些弯路（比如一开始反复检查 HTTP Headers，中途扎进源代码的阅读中等），但是我觉得我的时间并没有被浪费，故写这篇文章，记录我的探索和实验经历。

最后，当我发现问题出在 Cipher Suites 之后，我猛然间想起，其实早在约一年前，我已然在别处听闻过类似的机制：[v2ray 的 TLS 流量可被简单特征码匹配精准识别（附 PoC)](https://github.com/v2ray/discussion/issues/704)。只可惜当时的我对此不过是匆匆一瞥，没有太关注其细节，否则应该会早点跳出这次的坑，而不至于在坑中反复求索。
