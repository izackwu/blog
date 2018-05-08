---
layout: post
title: "如何使部署在Github Pages上的网站采用HTTPS"
categories:
  - Programmer
tags:
  - Github Pages
  - HTTPS
  - Github
  - Let's Encrypt
excerpt: Github与Let's Encrypt合作，让事情变得简单了许多。
image: images/bryan-minear-368010-unsplash.jpg
---

对于部署在Github Pages 上的网站，如果使用默认的`*.github.io`域名，Github 会**自动且强制**地使用HTTPS，不需要任何额外操作。

但对于绑定的自定义域名，原先的Github并不支持启用HTTPS，可行的办法是通过Cloudflare的免费DNS解析服务，间接地得到HTTPS，比较麻烦，因此一开始我并没有这个打算。

然而就在前几天，无意间看到Github的官方消息，自定义域名也支持HTTPS了，而且操作简单，所以毫无疑问，肯定选择HTTPS。

<figure>
    <a href="/images/github-https-twitter.png"><img src="/images/github-https-twitter.png"></a>
    <figcaption>Github在Twitter上发布的消息</figcaption>
</figure>

根据官方的公告，如果自定义域名是用`CNAME`记录进行DNS解析，那么不需要做任何事情，就已经自动地支持了HTTPS，而我的博客正好符合此条件。为了进一步提升安全性，我还在仓库设置中开启了`Enforce HTTPS`，强制将HTTP访问转为HTTPS。

这样之后，访问博客，就可以看到地址栏最左侧那个让人舒心的小绿锁了~

然而，一个小问题出现了：博客中的图片无法正常加载，被Firefox以不安全的缘由拦截。何也？因为博客中的图片链接用的是HTTP，混杂在HTTPS中，自然存在安全风险。解决方法也很简单，只需要打开Jekyll的配置文件`_config.yml`,把`url`设置项由HTTP改为HTTPS即可，那么所有自动生成的图片链接`{{site_url}}/images/x.png`就会是HTTPS了。

可以看到，以上的过程操作十分简单，这都要归功于[Let's Encrypt](https://letsencrypt.org/)项目和Github与其的合作。不免感慨，HTTPS的推广，真的需要感谢这样的机构与公司存在。




