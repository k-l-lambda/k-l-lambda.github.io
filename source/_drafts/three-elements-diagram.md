---
title: 有向图模型的三要素分析法
tags:
  - deep_learning
  - 中文
---


本篇是笔者多年前刚刚接触深度学习时的一些思考，最近刚刚抽空整理出来，
顺便也引用了一些近年新出现的网络结构作为例子。
希望能给同行带来一些有益的启发。


$$
y'=f_\theta(x)
$$

$$
\arg \min_\theta { \mathbb{E}_{(x,y)\sim (X,Y)} [l(f(\theta, x), y)] }
$$

<figure>
	<picture>
		<img src="/images/diagram-simple-classification.drawio.svg" />
	</picture>
	<figcaption>
		简单分类模型图示
	</figcaption>
</figure>


$$
\arg \min_\theta { \mathbb{E}_{x\sim X} [ g(\theta, x) ] }
$$

$$
A = \mathbb{E}_{x\sim X} [ g(\theta, x) ]
$$

$$
\theta \gets  \theta - \gamma  \cdot \frac{\mathrm{d} }{\mathrm{d} \theta} A
$$

有向图模型的范式可以概括为：凭借**目标A**，信息由**数据X**流入**权重&theta;**。


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
