---
title: 有向图模型的三要素分析法
tags:
  - deep_learning
  - 中文
---

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
		生成式对抗网络图示，训练中(a) (b)两个阶段交替进行
	</figcaption>
</figure>
