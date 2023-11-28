---
title: 打造音乐创作AI（一）
subtitle: 基于VAE的音乐编码器
tags:
---


<figure>
	<picture>
		<iframe width="900" height="240" src="/klstudio/embed.html#/lotus#/images/mix-score1123_1176-m16-67.json?controls=1"></iframe>
	</picture>
	<figcaption>
		基于五线谱的AI音乐作品示例
	</figcaption>
</figure>

以本篇作为起始，计划写一个算法作曲相关的系列，记录一些音乐算法研发中的想法。

2018年Google发布的[Music Transformer](https://magenta.tensorflow.org/music-transformer)是算法作曲中具有里程碑意义的工作。
它证明了自回归模型在音乐领域中的巨大潜力。
阅读其[paper](https://arxiv.org/abs/1809.04281)，你会发现它的作者主要贡献是优化了性能。
（缓解了Transformer二次方复杂度问题）
不过我觉得paper正文描述的内容只是最后的临门一脚，
真正值得重视的基础性工作在其附录中，关于如何把MIDI格式编码成易于自回归模型训练和生成的token序列。

<figure>
	<picture>
		<img src="/images/paraff-whole-c.svg" />
	</picture>
	<figcaption>
		简单五线谱示例，对应Paraff代码：<em>BOM K0 TN4 TD4 S1 Cg c D1 EOM</em>
	</figcaption>
</figure>

<figure>
	<picture>
		<img src="/images/reparameterized-vae.png" width="480px" />
	</picture>
	<figcaption>
		VAE基础结构
	</figcaption>
</figure>

<figure>
	<picture>
		<img src="/images/shared-vae.drawio.svg" />
	</picture>
	<figcaption>
		基于Transformer的shared VAE结构
	</figcaption>
</figure>
