---
layout: post
title: "初学前端，制作一个 Gatsby 静态博客"
tags:
  - 前端
  - 博客
  - Gatsby
  - React
description: 几乎没有任何前端基础的我，如何在一个月内入门「现代化」前端，并使用 Gatsby 制作一个静态博客？
image: https://pic.imwzk.com/gatsby-banner.webp
---

## 背景

大约一个月之前，作为一个几乎没有任何前端基础的小白（仅仅手写过简单的 HTML + CSS 页面），在一直从事的后端开发领域之外，突然对「现代化」前端产生了浓烈的好奇与兴趣：毕竟，我学计算机的初衷是创造美好的事物，总是和命令行打交道，不由得觉得有所欠缺。

另一方面，虽然靠着魔改现有的 Jekyll 主题，这几年我陆陆续续给我的博客进行了多次改造，但其实我一直有股彻底重写、制作一个完全符合自己审美的博客的冲动。伴着 Ruby 的式微，Jekyll 虽然背靠 Github，但在近年迭出的静态博客框架（如 Hugo、Hexo、Gatsby 等）中，也不免有些陈旧过时，这更是让我萌生了用新的框架制作博客的想法。

![一个月前的推文](https://pic.imwzk.com/frontend-flag.webp)

而在近一个月的知识学习与代码编写之后，我成功用上了全新的个人博客，也对现代化前端有了一定的认识，所以写这篇文章，作为记录。

## 前端入门

在开始制作博客之前，不论选用何种框架与技术，首先需要学习基本的前端知识。

在请教了一些前端开发者之后，结合我的实际需求，我大致的学习路径如下：

1. HTML 与 CSS
2. 布局与设计
3. React
4. 其他现代化前端概念

其中多数内容的学习是在 [freeCodeCamp](https://www.freecodecamp.org/) 完成。该网站上的课程免费开放，且每一小节均带有在线的交互式练习，学习过程中具有明确的即时反馈，在此我强烈推荐给想要学习前端的同学。

### HTML 与 CSS

由于在之前的项目中，我写过一些简单的传统前端，这一部分对我来说没有太大的困难。

跟随着 freeCodeCamp 的课程，我快速地过了一遍常用的 HTML 标签与一些新的语义化标签，并对 accessibility 有了一定的认知。（不要写出无脑嵌套 `div` 的网页！）

而关于 CSS，最大的困难在于如何给网页布局，这曾经是让我感到无比困扰的难题，所幸随着前端的发展，有了灵活好用的 `flex` 和 `grid` 布局，学习这些新的 CSS 布局方式，让我有一种如释重负的感觉。

### 布局与设计

其实，这一点更多是审美和艺术，而非前端技术。

作为一个未曾学习过 UI 设计的开发者，我对如何设计出优雅美观的页面尚无太多想法，只有一些朦胧的感受：比如色彩要协调、排版要对齐、风格要统一等。此外，在上面提到的 freeCodeCamp 课程中，对此有一些简单的论述，提到了一些基本的设计原则。

作为一个快速的解决方案，我选择向优秀的设计学习。在这一个月，我刻意观察了一些美观舒适的页面，既留心他们的配色、排版等设计，也研究他们的布局实现方式。而在我最终完成的博客中，也一定程度借鉴了其他人的设计。

### React

前端框架之争，我入门之前就有所耳闻。在此我选择了 React 而非 Vue，原因主要在于我的项目没有历史包袱，完全是从零实现，加上 Gatsby 静态博客的绑定。

React 很复杂，但是我的任务并不复杂：静态博客几乎不涉及状态管理，所以我只学习了十分基础的 React，便足以完成开发。

### 其他现代化前端概念

比起传统的 HTML，CSS，JavaScript 三件套，现代化前端有层出不穷的新奇框架与工具，作为一个初学者，其中有一些我觉得十分有趣且实用：

- SCSS/Sass：对 CSS 做出了许多有用且符合直觉的拓展，譬如嵌套的样式定义。我并没有特地去学习，而是在掌握基本的 CSS 之后，凭借直觉和搜索引擎开始编写 SCSS，其间没有遇到太大的障碍。

- Styled Components：比起传统的全局样式，在 React 中，直接编写组件级别的样式更为简单快捷，同时也能减少不同组件之间的样式干扰。

- Node.js 与 NPM：通过 NPM，前端项目也具有了包管理，能够方便地添加和移除依赖，让后端开发的我感到十分舒适。

- ……

## 博客编写

### 为什么是 Gatsby

回到最初的静态博客框架技术选型。经过调研，目前比较流行的 [静态网站生成器（static site generator）](https://github.com/topics/static-site-generator) （按照其 Github 项目的 star 数排序）有：

1. Next.js：功能强大且用途丰富的 React 框架，但并非专门的静态网站生成器，故排除
2. Gatsby：基于 React，具有完备的插件生态系统，被 [React 官网](https://reactjs.org/) 所使用
3. Hugo：Go 语言编写，高性能，适用于大型静态网站，使用广泛，如 [Kubernetes 官网](https://kubernetes.io/)
4. Jekyll：Ruby 语言编写，Github Page 对其有着很好的支持，但是近年来流行度有所下降
5. Hexo：Node.js 语言编写，比较流行
6. Vuepress：基于 Vue，流行程度不如上述框架，故排除

如果从实用角度出发，我想我的选择是 Hugo，足够强大，足够流行，并且我对 Go 语言足够熟悉，能够快速地上手；然而 Hugo 的缺点在于「不够前端」，整体设计上看，比较偏向使用传统的前端写法（HTML 模板加上全局 CSS），没有用到现代化前端的强大功能。

因此，考虑到除了完成开发之外，我还希望能够学习现代化的前端开发，最终的选择便是 Gatsby：根植于前端生态（仿照 cloud native 的说法，或许是 modern frontend native？），流行而强大。

另一方面，根据 [Wappalyzer 的数据](https://www.wappalyzer.com/technologies/static-site-generator/)，Gatsby 确实是近年来最为流行的选择：

![Static site generator market share](https://pic.imwzk.com/static-site-generator-market-share-wappalyzer.webp)

### 如何写一个 Gatsby 项目

在此，我无意复述那些 Gatsby 文档中已有的内容，而是仅列出我所用到的一些有用资源。

如果想要从零开始学习了解 Gatsby，我自己采用并推荐的方式是快速过一遍 [Gatsby.js Tutorials](https://www.gatsbyjs.com/tutorial/)，便能基本了解 Gatsby 项目的结构与原理（一点都不复杂）；如果有比较好的前端基础，也可以直接浏览其官方的 [Blog Starter](https://github.com/gatsbyjs/gatsby-starter-blog) 代码，获得直观的认识。

然后再对照某个实际的 Gatsby 项目，比如 [Gatsby Starter Lumen](https://github.com/alxshelepenok/gatsby-starter-lumen)，学习许多实用的细节与技巧；当然，这一步也可以按需进行，比如在不太确定某个做法的最佳实践时，参考这些成熟项目的做法（我正是这么做的）。

除此之外，Gatsby 最为人称道之处在于其完善的 [插件系统](https://www.gatsbyjs.com/plugins/)：当你需要实现某个功能时，大概率已经有某个（甚至多个）插件能够帮你做到这件事，那么最好不要自己重复造轮子。事实上，一个 Gatsby 项目的 `gatsby-config.js` 往往会导入许多有用的插件，比如 RSS Feed、sitemap、SEO 插件等等，既节省了编写代码的负担，也保持了很好的模块化与可配置性。不过值得一提的是，并不是所有插件都有较高的质量，特别是同一个功能有多个插件时，最好还是认真仔细地对比并试用一下，比如 webfont 相关插件。

### 我的 Gatsby 博客

回到博客本身。

在开始实现之前，我列出了我所期望具有的功能与设计特点。而这些功能基本上最终都得到了实现：

![Trello 看板](https://pic.imwzk.com/blog-rebuild-trello.webp)

如前所述，在编写我的 Gatsby 博客时，我借鉴了许多优秀博客的设计，样式上有所参照。不过由于其他博客的实现是传统的 HTML 模板 + 全局 CSS，而我使用 Gatsby + SCSS + Styled Components，我重新写了大部分代码，以遵循 Gatsby 的最佳实践。大致的源码结构如下：

```bash
$ tree src -d -L 3
src
├── components
│   ├── gitalk
│   ├── layout
│   │   └── seo
│   ├── main
│   ├── page
│   ├── pagination
│   ├── post
│   ├── postlist
│   ├── sidebar
│   │   ├── copyright
│   │   ├── menu
│   │   ├── sitemeta
│   │   ├── social-links
│   │   └── toc
│   └── tags
├── pages
├── scss
│   └── base
└── templates
```

而在具体的编码实现过程中，也曾遇到过许多细枝末节的问题，不过并无太多展开叙述的意义，在此不表。

如有兴趣，完整的代码可见 [keithnull/gatsby-starter-breeze](https://github.com/keithnull/gatsby-starter-breeze)，以及 [在线 Demo](https://gatsby-starter-breeze.netlify.app/)。

## 最后

当你看到这篇文章时，我的博客已经换上了刚完成的 Gatsby 博客主题，焕然一新。

而于我而言，通过给自己的博客从头写一个新的 Gatsby 主题，我入门了现代化的前端开发，期间感觉充实而快乐。

如果你也有一定的空闲时间与精力，那么我推荐你也试着开始探索前端的世界，并创造出自己喜欢的东西。不一定要深入探究前端的高深技术，仅仅用前端的皮毛自娱自乐，就能收获足够多的乐趣。
