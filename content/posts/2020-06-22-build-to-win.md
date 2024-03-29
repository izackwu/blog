---
layout: post
title: 《构建之法》与微软实习面试
tags:
  - 实习
  - 微软
  - 面试
  - 软件工程
  - 读后感
description: 不久之前，参加了微软实习的面试，当时觉得面试经历颇为不可思议；在读过《构建之法》之后，却似乎慢慢领会其中深意。
image: /images/random-sky-YGIiQSnzXwA-unsplash.webp
redirect_from:
  - /build-to-win/
  - /build-to-win
---

## 前言

关于微软实习面试的体验，我其实在上一篇文章 ([2020 年，我寻找暑期实习的经历与经验 ](/2020-summer-internship/#微软）) 中已经有所涉及：

> 而最后一轮面试，由部门 leader 进行，形式和前两轮差别不是特别大，不过技术的比重比较低，相当大一部分内容是「谈人生」（即技术之外的价值观与理念）.

当时对此一带而过，主要出于不愿过多泄露面试细节的考虑，以及自己当时其实对这场面试尚且有些「摸不着头脑」。

而今旧事重提，完全缘于最近所阅读的 [《构建之法》](https://book.douban.com/subject/27069503/)——一本由微软亚洲研究院首席研发经理 [邹欣](https://www.linkedin.com/in/xinzou/) 所写的「软件工程」书籍。在阅读这本书之后，感触颇多，联想不久前参加的微软实习面试：当时觉得其中的面试经历颇为不可思议，如今看来，却似乎可以慢慢领会其中深意。

那么，在这篇文章中，就先**以不透露过多细节的方式**，尽量较为具体地展开我微软实习的第三轮面试，然后谈谈《构建之法》这本书和我的一些想法。

## 微软实习的第三轮面试

在微软实习的面试中，我所经历的，前两轮是较为常规的技术面试，第三轮是比较特别的部门 leader 面试。如前所述，这一轮面试技术方面的含量比较低，而技术之外的内容占据了绝大部分。

面试伊始，面试官给了一道**相当简单**的算法题目：大概只花了 10 分钟不到，我便写出了复杂度上最优的解法。而在我写出解法之后，面试官让我详细解释了每个变量存在的必要性，并反复让我优化代码的写法以提升代码可读性和精简程度。

至此，仅仅 20 分钟不到。

然而，让我没想到的是，在整场面试之后的剩余时间，足足 1 个小时有余，我经历了极为不可思议的「灵魂拷问」。围绕着一个核心问题：「这样做就够了吗？什么时候可以确定你任务完成了？」，面试官抛出了一个又一个问题，我则战战兢兢地尝试着做出一个又一个回答。比如：

- 如何为这个程序设计测试？
- 你所设计的这些测试真的足够了吗？
- 对于一个函数，你实现了它，那么怎样可以确保你的任务完成了，什么时候你可以放心地说「我可以下班了」呢？
- 测试的本质是什么呢？你测试的目的是什么呢？
- 测试的目的是确保程序的预期和实际相符吗？
- 有了完美的测试覆盖率，就能确保预期和实际相符吗？
- 写程序的目的到底是什么呢？

一切的一切，这些连环「拷问」，在面试临近结束的最后 10 分钟，终于真相大白：

- 面试官：你刚才提到了预期，那比预期的程度还要强一点的是？
- 我：要求？
- 面试官：正确，谁的要求？
- 我：客户的要求？
- 面试官：完全正确！我们微软之所以能做出比别家更好的软件，成为成功的企业，就是因为我们满足了客户的要求。在很多时候，你写了一个软件，但是并没有搞清楚客户的要求，所以会失败。在微软，其实你要花 99% 的时间去思考，然后才能动手写代码。

原话不完全如此，但大意如此。

就我个人的感受而言，当我听到「客户的要求」时，一时觉得十分难以接受，甚至产生了严重的怀疑：问了这么多问题，结果最终的答案居然是这个？这场面试的意义何在？是不是因为我之前的表现，所以这场面试只是走个过场？……

幸运的是，尽管我在这场面试中表现只能算差强人意，但最终还是成功通过了。然而，这场面试，在之后很长的一段时间困扰着我，直到最近我读了《构建之法》这本书。

## 《构建之法》与软件工程

坦白来说，软件工程是我在大学期间唯一的一门没有好好学的计算机专业课程。

一方面是学校的课程质量低下。学校的这门课开设于大二，所用的教材是 [《面对对象软件工程》](https://book.douban.com/subject/5952570/), 一本厚厚的陈旧的传统教材。而当时的授课老师，上课也不过是复述着书上的各种概念，就连举例子也生搬硬套书上给出的那些明显不符合我国社会环境的例子。一学期听下来，只觉得大而无当，云里雾里，除了让我认识了各种图表和文档，在当时看来觉得几乎毫无收获，因此便划水飘过。

另一方面是我对软件工程意义的不了解与轻视。当时的我，没有经历过大型项目的开发，也没有真正开发过有商业价值的软件系统，仅仅是写了许多玩具级别的项目，自然是意识不到软件工程的意义。更何况，即便通过学校开设的课程，所做的课程项目，除了应付交差，也完全用不上所学的各种繁复的图表与文档，更是给我留下了对软件工程的不佳印象。

那么，为什么最近我会主动去阅读《构建之法》来学习软件工程呢？其实很简单，上述两个方面的困顿随着我的学习与成长而渐渐消散了，所以学习软件工程是一件很自然的事情。在实习过程中接触了业界真正创造商业价值的软件系统，在 Github 上参与了较为大型的开源项目，以及学校后续课程项目与他人**真正地协作开发**（而不是「抱大腿式的小组项目」）的经历，均使得我渐渐意识到：不应该用「手工作坊式」的方法进行开发，而需要学习成熟的开发流程。而《构建之法》这本书，其实在学习软件工程课程时，身边的同学便已经向我推荐过。

那么，《构建之法》这本书讲了些什么？又好在哪里呢？

其实一言以概之，《构建之法》这本书以**符合实际**（包括业界开发的实际和大学软件工程教学的实际）的方式，**有侧重**地讲解了真正有意义的软件工程实践，而对于传统教材着墨颇多的图表和文档点到辄止，让人能够愉快且带着兴趣地读下去并有所收获。顺便一提，这本书的英文名是 _Build to win_，也很好地概括了书的内容。

在这里我无意摘抄书中的章句，只是简单谈谈我阅读后的收获与体会。

### 三个公式

书中让我印象最为深刻的，是三个简单的公式：

1. 程序 = 算法 + 数据结构
2. 软件 = 程序 + 软件工程
3. 软件企业 = 软件 + 商业模式

在刚接触计算机时，许多人往往沉醉于第一个公式，学习各种精巧的算法与数据结构，能够用很巧妙的方式写出程序。其实我很佩服这样的人，尤其是在高中阶段便接触 OI 竞赛学习算法的同学，他们的程序设计能力远远超过我。

而在学习了许多基础概念之后，我便开始了在各种玩具项目中编写代码，这一阶段并不能意识到软件工程的重要性，反而会觉得软件工程碍手碍脚（我都能一个晚上开发出来，还需要写文档设计架构做什么呢？），正如我学习软件工程这门课的时候。而通过接触大型的、商业的软件项目，与越来越多的人协作开发，便会很自然地意识到第二个公式的意义。

至于第三个公式，却往往被过分强调以贬低第二个公式。作者在书中时不时的提及我国新兴的互联网企业：他们 996 高负荷工作却缺乏成熟的软件工程能力，也能依靠创新的商业模式取得了巨大的成功。（当然，书中也不是全然贬低这些互联网企业，关于敏捷开发，这些企业应当是相当优秀的。）

回想微软实习的第三轮面试，最终的答案是「客户的需求」，当时或许觉得有些难以理解，现在对照这三个公式，不也合情合理吗？从商业公司（比如微软）的角度去看待，程序设计的终极目的是满足客户的需求，那么对于开发人员，什么时候才能确定自己任务完成呢？自然是客户的需求被满足之后。虽然在面试中这个问题或许不甚妥当（毕竟答案过于唯一且出乎意料），但确实对我有很大的启发，让我开始从不同的角度去审视自己的技能与职业发展，思考实际中工作的意义与价值。

于我而言，目前的层次是努力接近第二个公式，因而学习软件工程。

### 现代软件工程

学校授课所选定的教材，其陈腐的一角，体现在对现代软件工程的敏捷开发毫无介绍，而是采用了传统的瀑布流和文档式开发。而这本书，则介绍了较为符合当下业界实际的各种开发流程。

作者作为微软（或许在不少人眼中已然陈旧落伍的企业）的员工，其写的内容是对二者的平衡：既保留了传统软件工程的优秀实践，也引进了现代软件工程的敏捷与效率。比如持续集成（CI）与持续交付（CD），现在已经被广泛应用，就连我的 Github 玩具项目也开始使用，而陈腐的教材对此避而不谈；又比如测试驱动开发（TDD）、结对编程等各种开发模式，也是对于软件开发流程的颠覆与创新，赋予了不同开发场景下的多种实践方式。

事实上，现代软件工程的实践繁多，但这种繁多不同于陈腐教材中文档与图表的繁多。前者是有价值的字典般的繁多，可以根据自身的实际情况合理选择以达到精简干练；后者往往是流程的繁多，为了追求某种「绝对的仪式感」而削足适履创造出的冗杂（当然，需要澄清的是，在特定场合下，这样的繁复流程还是有价值的）。

书中介绍了许多或时髦或传统的开发模式。模式虽多，我在阅读时大体却只是快速浏览，仅仅关注于那些我已经遇到过对应场景的开发模式，读起来颇有种得心应手的舒畅与事后总结般的灵光一现。

### 测试之道

什么是测试呢？在传统的软件工程教材中，给出了测试所需的一系列文档和图表，以及分门别类的各种测试类型；而在本书中，作者也给出了多种测试，并且提出了测试的一些要求和规范（不是以文档的形式！）。

不过有趣的是，书中强调测试人员的重要性，甚至举了某公司裁撤测试人员作为反面例子，然而微软却在前些年大刀阔斧地砍掉了测试团队，让开发人员负责测试。

那么话说回来，测试到底是为了什么呢？在面试中，我和面试官就此达成了共识：测试是为了确保程序的实际和预期相符，包括功能性和非功能性。而为了达到这个目的，我们有各种各样的测试手段，比如单元测试、集成测试等等。但还是回到终极答案上，我们的终极目的是什么呢？是满足客户的需求，测试不过是满足「我们假想出来的客户需求」。

## 总结

在即将开始微软的暑期实习之前，飞快地读完《构建之法》之后，回想几个月前的微软面试经历，胡思乱想了很多，所以写了这篇文章。

其实，作为一个大三学生，我对软件工程的理解还是相当肤浅的：虽然有了一定的开发经历，但不过是浅尝辄止。有没有什么方法可以学习软件工程呢？或许阅读《构建之法》是一个不错的方法，但纸上得来终觉浅，我所缺乏的，是更多的实际开发经历。

然而不论如何，这一切都只是思考的起点与探索的开始，写出来和大家分享。
