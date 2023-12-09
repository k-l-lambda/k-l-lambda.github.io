---
title: 有向图模型的三要素分析法
tags:
  - deep_learning
  - 中文
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

考虑一个拍照识物应用（打开微信扫码即可见），我们可以将其建模为一个简单的分类模型，
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
小写的x,y是来自数据集中的（特征,标签）采样。
$l$是损失函数，是某种度量*模型输出值与采样标签的距离*的函数，针对不同模态的数据可以有不同的选择。
argmin代表求解某个&theta;的取值，使得右侧的期望表达式达成最小化。

数学表达式晦涩难读，但却是理解很多论文的最佳途径，因为其精确给出了问题的全景。
有没有更好的表达方式？针对上式笔者脑补了如下的图形：

<figure>
	<picture>
		<img src="/images/diagram-simple-classification.drawio.svg" />
	</picture>
	<figcaption>
		简单分类模型图示
	</figcaption>
</figure>

其中竖着写的~是数学中的服从分布符号，可以理解为从数据集（或某种先验分布）中采集一个样本。

f上的*代表其中具有可训练参数，即权重&theta;。
这里其实笔者可以使用颜色来标注，但为了与平时在草纸上手写时的记号习惯保持一致，仍保留了星号。

圆圈中的ce即损失函数$l$，这里采用分类任务常用的交叉熵(Cross Entropy)。

*loss*左侧的尖朝下三角形**▽**代表优化目标为最小化loss的值。

整个计算图的方向为由上至下，与很多paper作者采纳的习惯相反。
这是出于以下考虑：数据是绝大多数深度学习任务的基础，因此分析建模问题时我们可以先列出可资利用的各种数据资源。
按照一种自然的方式，在草稿上把所有数据项列在最上一行，然后从上至下画出可能的模型结构。

如果是由我们自己来搭建一个针对某个任务的模型计算图，我们只要掌握其中的要点就可以确保做出一个实际可行的方案。
为了看出这其中的要点在哪里（同时也为了不失一般性），下面笔者简化了刚才的数学表达式。
由于X, Y都是数据，可以简化为一个符号X来表示；而f, l都是计算图中的函数，可以简化为函数g，于是上式改写成：


$$
\arg \min_\theta { \mathbb{E}_{x\sim X} [ g(\theta, x) ] }
$$

我们把右侧的期望表达式记为优化目标A：

$$
A = \mathbb{E}_{x\sim X} [ g(\theta, x) ]
$$

刚才说了，模型训练是一个数值优化过程。
具体说是把计算图中每个环节对训练权重&theta;求导，然后反向传播梯度，这个过程可以略为粗糙地记作下式：

$$
\theta \gets  \theta - \gamma  \cdot \frac{\mathrm{d} }{\mathrm{d} \theta} A
$$

其中$\gamma$是学习率，对我们的讨论不重要。

这里g就是我们想要搭建的计算图，它的组成部分我们暂时可以当作黑箱。
现在我们可以看出，**约束计算图g的三个要素是数据集X、训练权重&theta;和优化目标A**。
这是因为X和&theta;都是g的参数，而A决定了&theta;怎样得到更新。

这里还有一个重要的观察是，虽然计算图是从上至下的，但优化过程里只有&theta;是变量，所以信息的流动方向其实是从X流向&theta;。
因此，有向图模型的范式可以概括为：凭借**目标A**，信息由**数据X**注入**权重&theta;**，以此获得智能。
这里的“智能”指的是某种信息编码/解码能力，类似于人类处理问题的快速反应能力，或者直觉。

以下我们使用三要素分析方法，来考察一下各种常见的有向图结构。
这里我们仍把计算图各模块的细节当作黑箱，只关注大框架上各种模型与数据之间的作用方式。

<!-- more -->


<figure>
	<picture>
		<img src="/images/diagram-gan.drawio.svg" />
	</picture>
	<figcaption>
		生成式对抗网络GAN图示，训练中(a) (b)两个阶段交替进行
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagram-gen-projector.drawio.svg" />
	</picture>
	<figcaption>
		生成网络的反向投影 (<a href="https://richzhang.github.io/PerceptualSimilarity" target="_blank">关于 LPIPS</a>)
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagram-vae.drawio.svg" />
	</picture>
	<figcaption>
		变分自动编码器VAE图示
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagram-autoregression.drawio.svg" />
	</picture>
	<figcaption>
		自回归模型图示
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagram-autoregression-conditional.drawio.svg" />
	</picture>
	<figcaption>
		条件化自回归模型图示
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagram-diffusion.drawio.svg" />
	</picture>
	<figcaption>
		扩散模型图示
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagram-diffusion-conditional.drawio.svg" />
	</picture>
	<figcaption>
		条件化扩散模型图示
	</figcaption>
</figure>


<figure>
	<picture>
		<img src="/images/diagrom-transformer-layer.drawio.svg" />
	</picture>
	<figcaption>
		Transformer Encoder Layer图示
	</figcaption>
</figure>
