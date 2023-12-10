---
title: 有向图模型的三要素分析法
tags:
  - deep_learning
  - 中文
date: 2023-12-10 15:58:57
---



本篇是笔者多年前刚刚接触深度学习时的一些思考，最近才抽空整理出来，
顺便也引用了一些近年新出现的网络结构作为例子。
希望能给同行带来一些有益的启发。


早些年读深度学习论文的时候经常有一种感觉，作者已经在深入描述网络结构的细节，但笔者自己连其应用环境的大致图景还没有清晰概念。
固然有对其前置工作了解不足的因素，但笔者认为还有一个重要原因是深度学习领域还缺少一种成熟的建模图示标准，类似UML。
一个统一直观的图示系统应该有力地体现出神经网络的一些通用的基本要素，并对建模问题分析有辅助作用。
本文可以视为笔者针对有向图模型通用图示的一个尝试性的提议。

首先我们尝试从一个简单模型结构入手。


## 简单分类模型

考虑一个拍照识物应用[^1]，我们可以将其建模为一个简单的分类模型，
用数学语言描述，我们的目标是想获得这样一个函数：

$$
y'=f_\theta(x)
$$

其中x代表输入的图像，y'是模型输出的类别概率向量。
函数f是我们建模的一套计算图（譬如CNN网络），其下标&theta;代表模型权重，可以理解为计算图中待填入的知识。
下文中笔者将计算图函数均写作二元函数，即接受权重和输入数据两个参数。

模型的训练是一个数值优化问题，通常记作如下表达式的求解：

$$
\arg \min_\theta { \mathbb{E}_{(x,y)\sim (X,Y)} [l(f(\theta, x), y)] }
$$

其中(X, Y)是一个有标注数据集，即特征-标签（图像-类别）集合。
小写的x,y是来自数据集中的 (特征, 标签) 采样。
$l$是损失函数，是某种度量*模型输出值与标签的距离*的函数，针对不同模态的数据可以有不同的选择。
argmin代表求解某个&theta;的取值，使得右侧的期望表达式达成最小化。

数学表达式晦涩难读，但却是理解很多论文的最佳途径，因为其精确给出了问题的全景。
有没有更直观的表达方式？针对上式笔者脑补了如下的图形：

<figure>
	<picture>
		<img src="/images/diagram-simple-classification.drawio.svg" />
	</picture>
	<figcaption>
		简单分类模型图示
	</figcaption>
</figure>

其中竖着写的~是数学中的服从分布符号，可以理解为从数据集（或某种先验分布）中采集一个样本。

f上的*代表其中具有**可训练参数**[^2]，即权重&theta;。
这里其实笔者可以使用颜色来标注，但为了与平时在草纸上手写时的记号习惯保持一致，仍保留了星号。

圆圈中的ce即损失函数$l$，这里采用分类任务常用的交叉熵(Cross Entropy)。

*loss*左侧的尖朝下三角形▽代表**优化目标**[^2]为最小化loss的值。

整个计算图的方向为由上至下，与很多paper作者采纳的习惯相反。
这是出于以下考虑：**数据**是绝大多数深度学习任务的基础，因此分析建模问题时我们可以先列出可资利用的各种数据资源。
（按自然的方式）在草稿上把所有数据项列在最上一行，然后从上至下画出可能的模型结构。

关于模块的形状，笔者考虑把数值模块和纯解析模块区分开来，纯解析模块用圆圈表示，提示其中不含权重（不论是当前训练中的还是来自预训练）。
在笔者想象中，纯解析计算像是一种柏拉图实在（不似尘世之物），而数据集和权重则来自物理实在，充满各种细节和随机性。

如果是由我们自己来搭建一个针对某个任务的模型计算图，我们只要掌握其中的要点就可以确保做出一个实际可行的方案。[^3]
为了看出这其中的要点在哪里（同时也为了不失一般性），下面笔者简化了刚才的数学表达式。
由于X, Y都是数据，可以合并为一个符号X来表示；而$f$, $l$都是计算图中的函数，可以合并为函数$g$，于是上式改写成：


$$
\arg \min_\theta { \mathbb{E}_{x\sim X} [ g(\theta, x) ] }
$$

我们把右侧的期望表达式记为优化目标A：

$$
A = \mathbb{E}_{x\sim X} [ g(\theta, x) ]
$$

刚才说了，模型训练是一个数值优化过程。
具体说是把计算图中每个环节对训练权重&theta;求导，然后反向传播梯度，这个过程可以（略为粗糙地）记作下式：

$$
\theta \gets  \theta - \gamma  \cdot \frac{\mathrm{d} }{\mathrm{d} \theta} A
$$

其中$\gamma$是学习率，对我们的讨论不重要。

这里$g$就是我们想要搭建的计算图，它的组成部分我们暂时可以当作黑箱。
现在我们可以看出，**约束计算图g的三个要素是数据集X、训练权重&theta;和优化目标A**。
这是因为X和&theta;都是$g$的参数，而A决定了&theta;怎样得到更新。

这里还有一个重要的观察是，虽然计算图是从上至下的，但优化过程里只有&theta;是变量，所以信息的流动方向其实是从X流向&theta;。
因此，有向图模型的范式可以概括为：凭借**目标A**，信息由**数据X**注入**权重&theta;**，以此获得智能。
这里的“智能”指的是某种信息编码/解码能力，类似于人类处理问题的快速反应能力，或者叫直觉。

以下我们使用三要素分析方法，来考察一下各种常见的有向图模型结构。
这里我们仍把计算图中各模块的细节当作黑箱，只关注大框架上各种模型与数据之间的作用方式。

<!-- more -->


## 生成式对抗网络 GAN

GAN有两个模块：生成器g和辨别器d，训练时需要交替训练两个模块。
这个过程可以简明地由下图概括：

<figure>
	<picture>
		<img src="/images/diagram-gan.drawio.svg" />
	</picture>
	<figcaption>
		经典生成式对抗网络图示，训练中(a) (b)两个阶段交替进行
	</figcaption>
</figure>

星号标在哪里，可训练权重就在哪，除此以外计算图里其他的地方都是冻结的。

注意图中三角形的方向，可见两个阶段交替时除了训练的权重位置发生了变化，优化目标也发生了反转。
这正是“对抗”的含义。

值得注意的是，这里只有X是数据集，没有标注（因此GAN属于无监督学习）。
除此之外出现了一个来自正态分布的隐变量z，这是因为GAN假定数据中存在某种隐含的规律，
但我们不知道它是什么，所以采用最大熵原则将其建模为𝒩(0, 1)。


## 生成网络的反向投影

如果你认为星号只能出现在某个方块前，那么你错了。

这是一个有意思的反例。
假定我们现在已经有了一个无条件生成模型g（譬如就是来自刚才GAN里面的那个g），
g把任意一个噪声编码z转换成符合原始数据集X分布的样本x'。
然而现在我们想通过一个给定样本x，去反向得到它对应的编码z。
这就是生成网络的反向投影，其图示如下：

<figure>
	<picture>
		<img src="/images/diagram-gen-projector.drawio.svg" />
	</picture>
	<figcaption>
		生成网络的反向投影
	</figcaption>
</figure>

[^4]

梯度反向传播可以直接作用到输入数据z'上。由此可以看出，
当我们写出二元函数$g(\theta, x)$时，两个参数权重$\theta$和数据$x$的地位是真正平等的。
而我们平时思考中往往会忽视这一点。

另外早期的[风格迁移](https://github.com/xunhuang1995/AdaIN-style)模型也是利用了类似的方法。


## 变分自动编码器 VAE

<figure>
	<picture>
		<img src="/images/diagram-vae.drawio.svg" />
	</picture>
	<figcaption>
		变分自动编码器VAE图示
	</figcaption>
</figure>

其中*rp*代表[reparameterization](https://en.wikipedia.org/wiki/Variational_autoencoder#Reparameterization)，
*KL*处是计算$\mathcal N(\mu, \sigma^2)$与正态分布之间的KL散度：

$$
KL (\mathcal N(\mu, \sigma^2) \left | \right | \mathcal N(0, 1)) = \frac{1}{2} (-\log \sigma^2 + \mu^2 + \sigma ^2 - 1)
$$


## 自回归模型 Autoregression

[自回归模型](https://zh.wikipedia.org/zh-cn/%E8%87%AA%E6%88%91%E8%BF%B4%E6%AD%B8%E6%A8%A1%E5%9E%8B)用来迭代地生成一个序列。

<figure>
	<picture>
		<img src="/images/diagram-autoregression.drawio.svg" />
	</picture>
	<figcaption>
		自回归模型图示
	</figcaption>
</figure>

可见自回归模型的训练跟一个普通的分类模型没有太大区别。
巧妙之处在于，利用了序列元素之间的转移概率，输入和输出的数据都从同一个序列上截取获得。

然后是条件化自回归模型：

<figure>
	<picture>
		<img src="/images/diagram-autoregression-conditional.drawio.svg" />
	</picture>
	<figcaption>
		条件化自回归模型图示
	</figcaption>
</figure>

通常用作两种语言之间的翻译模型，也可以是其他模态转换成序列，如[captioning](https://paperswithcode.com/task/image-captioning)任务。
无论是[seq2seq](https://dataxujing.github.io/seq2seqlearn/chapter1/)还是transformer encoder+decoder都可以概括为这种结构。


## 扩散模型 Diffusion

扩散模型的直观理解可以参考笔者之前的[post](/2023/04/22/diffusion-model-illustration/)。
其复杂更多在于推测阶段的迭代过程，模型训练本身反倒是比较容易说明，如图：

<figure>
	<picture>
		<img src="/images/diagram-diffusion.drawio.svg" />
	</picture>
	<figcaption>
		扩散模型图示
	</figcaption>
</figure>

直白地说，模型是用来从一个被噪声污染样本里鉴别出噪声信号。

我们平时常见的文生图、文生视频模型是条件化的扩散模型，结构也差不多：

<figure>
	<picture>
		<img src="/images/diagram-diffusion-conditional.drawio.svg" />
	</picture>
	<figcaption>
		条件化扩散模型图示
	</figcaption>
</figure>

这里C是生成样本X对应的一个提示，C和X共享部分相同的信息内容，但模态或编码形式不同。


## Transformer的单层结构分析

三要素分析更多是描述计算图的大框架，通常在分析某一模块的微观细节上帮助不大。
不过我们不妨来分析一下当前热门的大语言模型的基础模块，以下图示描述transformer单层编码器结构：

<figure>
	<picture>
		<img src="/images/diagrom-transformer-layer.drawio.svg" />
	</picture>
	<figcaption>
		Transformer Encoder Layer图示
	</figcaption>
</figure>

这里有个重要的观察是，transformer的核心机制“多头注意力”和“缩放点乘注意力”其实是纯解析模块，
其中并没有任何可训练权重。[^5]
这种分析会提醒我们思考模型的能力源泉来自哪里。

未完待续。


[^1]: 打开微信扫码即可见。
[^2]: 记住，一会要考:）
[^3]: 当然这里说的“确保”只是计算图层面的，而方案是否可行，数据集的质量和规模往往更重要。
[^4]: 关于 [LPIPS](https://richzhang.github.io/PerceptualSimilarity)。
[^5]: 意外不意外？
