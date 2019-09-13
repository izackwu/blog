---
layout: post
title: "本地Git仓库关联多个远程仓库的两种方法"
categories:
  - Programmer
tags:
  - Git
excerpt: 通常情况下，一个本地Git仓库对应一个远程仓库，那么，如何使其同时关联多个远程仓库呢？
image: https://imwzk-1258985649.cos.ap-shanghai.myqcloud.com/shifaaz-shamoon-sLAk1guBG90-unsplash.jpg
---

## 背景

通常情况下，一个本地Git仓库对应一个远程仓库，每次`pull`和`push`仅涉及本地仓库和该远程仓库的同步；然而，在一些情况下，一个本地仓库需要同时关联多个远程仓库，比如：同时将一个项目发布在[Github](https://github.com/)和[Coding](https://coding.net/)上，以兼顾国内外的访客（顺便一提，本站从近期起即是如此）。

那么，如何让一个本地仓库同时关联多个远程仓库呢？

## 方法1：每次`push`、`pull`时需分开操作

首先，查看本地仓库所关联的远程仓库：(假定最初仅关联了一个远程仓库)

```bash
$ git remote -v
origin  git@github.com:keithnull/keithnull.github.io.git (fetch)
origin  git@github.com:keithnull/keithnull.github.io.git (push)
```

然后，用`git remote add <name> <url>`添加一个远程仓库，其中`name`可以任意指定（对应上面的`origin`部分），比如：

```bash
$ git remote add coding.net git@git.coding.net:KeithNull/keithnull.github.io.git
```

再次查看本地仓库所关联的远程仓库，可以发现成功关联了两个远程仓库：
```bash
$ git remote -v
coding.net      git@git.coding.net:KeithNull/keithnull.github.io.git (fetch)
coding.net      git@git.coding.net:KeithNull/keithnull.github.io.git (push)
origin  git@github.com:keithnull/keithnull.github.io.git (fetch)
origin  git@github.com:keithnull/keithnull.github.io.git (push)
```

此后，若需进行`push`操作，则需要指定目标仓库，`git push <repo> <branch>`，对这两个远程仓库分别操作：

```bash
$ git push origin master
$ git push coding.net master
```

同理，`pull`操作也需要指定从哪个远程仓库拉取，`git pull <repo> <branch>`，从这两个仓库中选择其一:

```bash
$ git pull origin master
$ git pull coding.net master
```

## 方法2：`push`和`pull`无需额外操作

在方法1中，由于我们添加了多个远程仓库，在`push`和`pull`时便面临了仓库的选择问题。诚然如此较为严谨，但是在许多情况下，我们只需要保持远程仓库完全一致，而不需要进行区分，因而这样的区分便显得有些“多余”。

同样地，先查看已有的远程仓库：(假定最初仅关联了一个远程仓库)

```bash
$ git remote -v
origin  git@github.com:keithnull/keithnull.github.io.git (fetch)
origin  git@github.com:keithnull/keithnull.github.io.git (push)
```

然后，**不额外添加远程仓库，而是给现有的远程仓库添加额外的URL**。使用`git remote set-url -add <name> <url>`，给已有的名为`name`的远程仓库添加一个远程地址，比如：

```bash
$ git remote set-url --add origin git@git.coding.net:KeithNull/keithnull.github.io.git
```

再次查看所关联的远程仓库：

```bash
$ git remote -v
origin  git@github.com:keithnull/keithnull.github.io.git (fetch)
origin  git@github.com:keithnull/keithnull.github.io.git (push)
origin  git@git.coding.net:KeithNull/keithnull.github.io.git (push)
```

可以看到，我们并没有如方法1一般增加远程仓库的数目，而是给一个远程仓库赋予了多个地址（或者准确地说，多个用于`push`的地址）。

因此，这样设置后的`push` 和`pull`操作与最初的操作完全一致，不需要进行调整。

## 总结

以上是给一个本地仓库关联多个远程仓库的两种方法，二者各有优劣，不过出于简便考虑，我最终采用了方法2。

此外，上述内容中涉及到的Git指令略去了许多不常用的参数，如需更加详细的说明，可以查阅[Git文档](https://git-scm.com/docs/git-remote)，或者直接在命令行运行`git remote --help`。

