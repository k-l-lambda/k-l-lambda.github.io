---
title: 有向图模型的三要素分析法
tags:
  - deep_learning
  - 中文
---


本篇是笔者多年前刚刚接触深度学习时的一些思考，最近刚刚有空整理出来，
也加入了一些近年刚出现的网络结构作为例子。
希望给同行带来一些有益的启发。


$$
y'=f(\theta, x)
$$

$$
\arg \min_\theta { \mathbb{E}_{(x,y)\sim (X,Y)} [l(f(\theta, x), y)] }
$$

$$
\arg \min_\theta { \mathbb{E}_{x\sim X} [ g(\theta, x) ] }
$$

<figure>
	<picture>
		<img src="/images/diagram-simple-classification.drawio.svg" />
	</picture>
	<figcaption>
		简单分类模型图示
	</figcaption>
</figure>


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
