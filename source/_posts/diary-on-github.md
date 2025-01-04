---
title: 怎样用Github写日记
tags:
  - 中文
  - essay
  - promotion
date: 2025-01-03 23:15:41
---



众所周知，写博客或日记有两种方式，一种是使用Web2.0时代的[UGC](https://zh.wikipedia.org/wiki/用户生成内容)平台网站（如豆瓣、新浪博客等），另一种是自己搭建个人网站。
第一种选择门槛低，可以立即开始写作，但缺点是无法控制所有细节，对富文本格式（尤其是程序员喜欢的[Markdown](https://markdown.com.cn/intro.html#markdown-%E6%98%AF%E4%BB%80%E4%B9%88)）支持有限。
第二种选择，如[Hexo](https://hexo.io/zh-cn/)，则需要折腾一些代码，配置大量细节选项，写博客如同开发一个小型项目。如果只是作为个人备忘性质的日志，就过于繁琐了。

本文提供了一种新的折衷思路，即直接把Github当作UGC平台，兼取两者优点，可谓懒人良方。

<figure>
	<picture>
		<img src="/images/github-diary-demo.png" />
	</picture>
	<figcaption>
		Github作为一个极佳的写作网站
		<a href="https://github.com/k-l-lambda/diary-one" target="_blank">diary-one</a>
	</figcaption>
</figure>

<!-- more -->

看到这里你可能已经猜到了，无非就是建一个叫做“我的日记”的GitHub仓库，然后每天以日期作文件名，新建一个Markdown文件，记录当天事项，最后整个仓库变成一个文档合集。
然而想把这群文档维护得好用，还是可以下点功夫的。

首先，可以给日记建个日历索引视图，用来快速定位到某一天。
把这个视图直接放在项目的 `README` 文件中，这样从仓库主页就能看到。
就像这样：

<figure>
	<picture>
		<img src="/images/github-diary-calendar.png" width="458" />
	</picture>
	<figcaption>
		日历视图
	</figcaption>
</figure>

鼠标悬停在某一天，还能看到当天的日记大纲（即#开头的那些title内容）。

自动化[生成日历视图逻辑](https://github.com/k-l-lambda/diary-one/blob/main/tools/buildCalendar.js)非常简单，用不了100行代码。

然后是同类内容的聚合整理。
比如说每日记录的读书笔记、论文阅读、背单词的生词本、健身记录、乐器练习记录等等，
每种内容都聚合整理到一个单独的文件中，方便查阅。
例如：

<figure>
	<picture>
		<img src="/images/github-diary-vocab.png" width="465" />
	</picture>
	<figcaption>
		生词表
	</figcaption>
</figure>

<figure>
	<picture>
		<img src="/images/github-diary-reading.png" width="482" />
	</picture>
	<figcaption>
		读书笔记汇总
	</figcaption>
</figure>

<figure>
	<picture>
		<img src="/images/github-diary-arxiv.png" width="480" />
	</picture>
	<figcaption>
		arxiv论文列表
	</figcaption>
</figure>

这部分我写了一些脚本插件，小伙伴们可以根据需要自行[开启](https://github.com/k-l-lambda/diary-one/blob/main/tools/buildStatistics.js)，或者自己扩展一些新的脚本。
脚本的原理很简单，就是捕获日记内容中的一些固定模式，比如二级标题`##`后面的内容中带有书名号`《》`的，就认为是读书笔记，然后把标题之后的段落摘取出来，同一本书的笔记就放到一起。
每个脚本会在[memo](https://github.com/k-l-lambda/diary-one/tree/main/memo)目录下创建一个单独的聚合条目，完全自动化维护。

另外，为了方便连续地翻看日记，我加了一个[导航栏功能](https://github.com/k-l-lambda/diary-one/blob/main/tools/cowriter.js#L11)，每天会自动给新日记加上前后链接。
考虑到有人觉得每天手工建一个新文件也很麻烦，[这里](https://github.com/k-l-lambda/diary-one/blob/main/tools/cowriter.js#L5)还有一个每日自动创建日记文件的可选功能，新文件默认内容效果大约是这样的：

> # &#x1f437;
> 我今天犯了个懒，啥也没写……

如果哪天没写日记，这个可爱的“猪猪声明”就会作为当天的系统默认记录。

现在如果你在琢磨这么多脚本要怎么运行，呵呵，不存在的！
它们都是由[Github Actions](https://github.com/k-l-lambda/diary-one/actions)在后台自动触发的。
注意日历视图上方有三个action徽章，只要它们是绿色的就说明一切运转良好。
就是这么轻松。

欢迎小伙伴们Fork我这个[示例仓库](https://github.com/k-l-lambda/diary-one)。
这个仓库有两个用意，其[initial](https://github.com/k-l-lambda/diary-one/tree/initial)分支是一个空白的日记模板，Fork之后可以直接拿来用；
main分支作为示例，同时也当作所有人的涂鸦墙，谁想记点什么都可以提交PR，或直接成为项目成员，欢迎加入。

余生短暂，最后借用《黑暗森林》和帕斯卡的名言，记忆就像一把沙子，自以为抓的很牢，其实早就从指缝间溜走了，
让我们给岁月以文明，给时光以日记。
