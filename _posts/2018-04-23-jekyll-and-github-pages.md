---
layout: post
title: 用Jekyll和Github Pages搭建博客之记录
categories:
  - Programmer
tags:
  - Jekyll
  - Github
  - Github Pages
  - 博客
excerpt:
    我是如何用Jekyll搭建博客并部署到Github Pages上的。
image:
    https://pic.imwzk.com/alex-stuart-567895-unsplash.jpg
---

## 起因

曾经用过WordPress建博客，虽然搭建过程很简单，甚至可以一键操作，而且功能全面，但是需要租用提供PHP和MySQL环境的服务器，需要一定的费用，而且对于一个简单的个人博客，不免显得有些过于笨重了。

也考虑过在诸如CSDN、掘金之类的博客平台直接创一个账户，简单省事，但是，这些网站的界面设计总觉得缺少美感而且不够自由发挥，便也作罢。

更重要的是，正如前一篇文章中写的，有些话想说又不想被听见，所以倾向于不使用这些公众平台。

最后，发现了Jekyll和Github Pages的组合，够轻量级，够自由定制，够私人，尽管稍显复杂，但对于程序员而言，复杂从来不是问题，只要优雅就好。

## 总体流程

不同于WordPress需要连接数据库进行操作，Jekyll仅仅是一个生成静态网页的工具，一次生成，只要不改变源代码，就可一直使用下去。因此，只需准备好博客的源码，上传到Github仓库，由Github Pages执行一次生成，便产生了我的博客网站直到下一次commit后重新生成。

那么，我需要做的**大体上**只有两件事：准备Jekyll的网站源码，部署到Github Pages。

## Jekyll部分

考虑到自己日益增长的审美需要和落后的前端水平的矛盾，我选择在现成的Jekyll主题基础上进行修改。

Github Pages上提供了少数可选的Jekyll主题，但[Jekyll Themes](http://jekyllthemes.org/)提供了更多而且更精美的主题。一番筛选后，最后选中了现在的主题，[Halve](https://github.com/TaylanTatli/Halve),
很漂亮，同时也很简约。

<figure>
    <a href="https://pic.imwzk.com/halve-home-image.png"><img src="https://pic.imwzk.com/halve-home-image.png"></a>
    <figcaption><a href="https://github.com/TaylanTatli/Halve">Jekyll Theme: Halve</a></figcaption>
</figure>


按照主题的说明，修改`_config.yml`进行基本的配置，并修改`index.md`, `_posts/`, `_data/`, `_images/`等内容，便完成了大部分工作。

但在此基础上，我又做了一些其他的工作，更加深入一些。

### 更改页面左右比例

Havle主题默认是左侧图片和右侧内容各占50%，给人一种类似书本平摊的感觉，诚然美观，但一定程度上影响了实用性。对于小屏幕设备（如Surface），仅用50%空间显示内容不免有些奢侈。 于是，我决定调整一下这个比例。

在哪里调整呢？在`_config.yml`里面没有这个选项，分析一下，这种事情应该是由CSS实现的，那么便去`assets/css/`文件夹里面寻找，只有一个引用了其他文件的`main.css`，溯源而上，找到了`assets/css/_sass/_site.scss`，对应内容如下：

```scss
.block-left {
  float: left;
  .content {
    z-index: 1;
    position: relative;
  }
}

.block-right {
  float: right;
  overflow-y: auto;
}

.block-left,
.block-right {
  width: 50%;
  height: 100%;
  position: relative;
  display: table;
  > div {
    display: table-cell;
    vertical-align: middle;
  }
  .content {
    height: 100%;
  }
}
```
那么调整就很简单了，改为左侧35%，右侧65%：
```scss
.block-left {
  width:35%;
  float: left;
  .content {
    z-index: 1;
    position: relative;
  }
}

.block-right {
  width:65%;
  float: right;
  overflow-y: auto;
}

.block-left,
.block-right {
  height: 100%;
  position: relative;
  display: table;
  > div {
    display: table-cell;
    vertical-align: middle;
  }
  .content {
    height: 100%;
  }
}
```

### 更改字体大小

由于Halve主题原本面向的是英文用户，其字体的选用和大小都针对英文而设计，所以一开始我担心对于中文会显示效果不佳。不过经过测试，中文会采用默认的微软雅黑字体，差强人意，但尺寸上面，显得有些太大了，特别是在更改过页面比例后，长标题甚至会溢出左侧区域。

因此，需要把字体调小一些。

和调整页面比例类似，同样在`assets/css/_sass/_site.scss`内找到对应内容如下：

```scss
.section-title {
  font-size: 100px;
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: rgba($white, 0.6);
  -ms-word-wrap: break-word;
  word-wrap: break-word;
  em {
    font-style: italic;
  }
  span {
    font-size: 20px;
  }
}

//lines omitted here

.post-title-section {
  position: absolute;
  bottom: 50px;
  left: 50px;
  right: 50px;
  .section-title {
    position: relative;
    left: auto;
    bottom: auto;
    font-size: 80px;
}
````
改为：
```scss
.section-title {
  font-size: 50px;
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: rgba($white, 0.6);
  -ms-word-wrap: break-word;
  word-wrap: break-word;
  em {
    font-style: italic;
  }
  span {
    font-size: 20px;
  }
}

//lines omitted here

.post-title-section {
  position: absolute;
  bottom: 50px;
  left: 50px;
  right: 50px;
  .section-title {
    position: relative;
    left: auto;
    bottom: auto;
    font-size: 50px;
}
````

### 采用圆形头像

主题默认头像是方形的，而且是透明背景的，显示出来效果十分优雅，但换上我自定义的头像后，美感全无...尝试给图片去底，不是很成功，于是想着换成圆形。

在CSS中，让图片以圆形显示其实是设置为50%的圆角矩形，故在`assets/css/_sass/_site.scss`的.logo中增加如下内容：
```scss
img {
  height: auto;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
}
```

这样子之后，效果相对可以接受了。

<figure>
    <a href="https://pic.imwzk.com/Screenshot-2018-4-24 Keith Null.png"><img src="https://pic.imwzk.com/Screenshot-2018-4-24 Keith Null.png"></a>
    <figcaption>最终效果</figcaption>
</figure>

## Github Pages

为了方便省事，直接fork了Halve的仓库，改名为keithnull.github.io后，clone到本地完成上述修改之后再commit上传。

只要代码无误，Github Pages便会在commit后生成网页，通过https://keithnull.github.io即可访问。到这里，已经完成了博客的搭建。

不过，额外的工作是自定义域名，毕竟keithnull.github.io是一个二级域名。

## 自定义域名

申请域名、实名认证的步骤略过不提，在域名的DNS解析页面，需要做的是增加DNS解析如下：

|记录类型|主机记录|记录值|
|:-:|:-:|:-:|
|CNAME|@|keithnull.github.io|
|CNAME|www|keithnull.github.io|

同时，在Jekyll文件夹内增加一个名为`CNAME`的文件，内容是自定义的域名。

然后，等待。

直到解析生效。

## 最后

到这里，这个博客就已经完全搭建好了，正如现在它的样子。

关于Jekyll，其实还有许多可以定制的地方，留待之后用时了解吧。

> 远在远方的风比远方更远。 --海子







