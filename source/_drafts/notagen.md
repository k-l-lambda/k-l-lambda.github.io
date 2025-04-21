---
title: 打造音乐创作AI（二）
tags:
  - music_algorithm
  - deep_learning
  - 中文
subtitle: NotaGen
---

<figure>
	<picture>
		<img src="/images/symbolic-music-models2025.drawio.svg" />
	</picture>
	<figcaption>
		截至2025年4月，主要的符号音乐算法作曲工作
	</figcaption>
</figure>

距离上一篇[打造音乐创作AI（一）](/2023/11/29/vae-based-music-encoder/)已经过去一年多了，
一直忙于工作和家庭，音乐算法研究进展甚微。
最近看到了NotaGen[^15]的发表，堪称符号算法作曲领域的里程碑式工作。
不得不承认，自己还在半山腰磨蹭，别人已经把旗子插上山顶了。
索性直接写一篇博客介绍一下NotaGen。

这篇由中央音乐学院与多所大学联合团队发表的工作，无论从算法路线和数据来源都做得非常完备。
不仅发表了[论文](https://arxiv.org/pdf/2502.18008)，也开放了[源代码](https://github.com/ElectricAlexis/NotaGen)和[Demo](https://electricalexis.github.io/notagen-demo/)。
当然最宝贵的数据集并没有放出（可能是考虑版权问题）。

除了官方Demo，这里给出一些我自己使用NotaGen生成的键盘作品：


依据paper和源代码这些可观察到的内容，笔者以下从三个要点来简要介绍一下NotaGen的工作。

## Interleaved ABC Notation

## 2 levels decoder

## CLaMP-DPO


除了以上三点，想必还有大量工作隐藏在数据集的制备中，包括清洗、格式转换工具开发等。
尤其是其中数据来源表格中的*Internal Sources*一项，想必是中央音乐学院得天独厚的资源。

| Data Sources                      | Amount |
|-----------------------------------|-------:|
| *DCML Corpora*                    | 560    |
| *OpenScore String Quartet Corpus* | 342    |
| *OpenScore Lieder Corpus*         | 1,334  |
| *ATEPP*                           | 55     |
| *KernScores*                      | 221    |
| *Internal Sources*                | 6,436  |
| **Total**                         | **8,948** |
Table 1 from *arxiv2502.18008*: Data sources and the respective amounts for fine-tuning

不过，有朝一日，把[IMSLP](https://imslp.org)上7万多部名家名作的PDF曲谱数字化，可用的数据量至少还能上升一到两个数量级。


---
References:
[^1]: Transformer: [arxiv1706.03762](https://arxiv.org/abs/1706.03762)
[^2]: Music Transformer: [arxiv1809.04281](https://arxiv.org/abs/1809.04281)
[^3]: MusicBERT: [arxiv2106.05630](https://arxiv.org/abs/2106.05630)
[^4]: Deep Choir: [arxiv2202.08423](https://arxiv.org/abs/2202.08423)
[^5]: TunesFormer: [arxiv2301.02884](https://arxiv.org/abs/2301.02884)
[^6]: CLaMP: [arxiv2304.11029](https://arxiv.org/abs/2304.11029)
[^7]: MegaByte: [arxiv2305.07185](https://arxiv.org/abs/2305.07185)
[^8]: Mamba: [arxiv2312.00752](https://arxiv.org/abs/2312.00752)
[^9]: MambaByte: [arxiv2401.13660](https://arxiv.org/abs/2401.13660)
[^10]: ByteGPT: [arxiv2402.19155](https://arxiv.org/abs/2402.19155)
[^11]: MuPT: [arxiv2404.06393](https://arxiv.org/abs/2404.06393)
[^12]: CLaMP 2: [arxiv2410.13267](https://arxiv.org/abs/2410.13267)
[^13]: Music Event Transformer (MET): https://github.com/SkyTNT/midi-model
[^14]: CLaMP 3: [arxiv2502.10362](https://arxiv.org/abs/2502.10362)
[^15]: NotaGen: [arxiv2502.18008](https://arxiv.org/abs/2502.18008)
