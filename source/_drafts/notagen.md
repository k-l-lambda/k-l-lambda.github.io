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
索性第二篇就介绍一下NotaGen，自己这边的思路以后再说吧。

这篇由中央音乐学院与多所大学联合团队发表的工作，无论从算法路线和数据来源都做得非常完备。
不仅发表了[论文](https://arxiv.org/pdf/2502.18008)，也开放了[源代码](https://github.com/ElectricAlexis/NotaGen)和[Demo](https://electricalexis.github.io/notagen-demo/)。
当然最宝贵的数据集并没有放出（可能是考虑版权问题）。

除了官方Demo，这里给出一些我自己使用NotaGen生成的键盘作品：

TODO:


依据paper和源代码这些可观察到的内容，以下从三个要点来简要介绍一下NotaGen的工作。


<!-- more -->


## Interleaved ABC Notation

音乐作为一种时序的模态，用自回归模型来生成始终是首选。
这种方法本质上就是训练一个文字接龙的语言模型，只要构造一种语言来描述想要生成的模态（术语叫做tokenize），
剩下的就交给transformer等主干模型就可以了。
如今连图像生成都有向自回归模型靠拢的趋势，不过也确实看到反其道而行之，[用扩散模型来搞语言模型](https://arxiv.org/pdf/2502.05171)的。

常见的五线谱数字化语言有MusicXML、MEI、ABC Notation、Lilypond、Humdrum这么几种。
其中MusicXML，MEI基于XML，文本冗余太高。ABC Notation和Lilypond是专用语言，
其中Lilypond语法有点像Latex，灵活度较大，描述能力强但表达方式多变，不利于模型学习。
笔者在[上一篇](/2023/11/29/vae-based-music-encoder/)中介绍了自己基于Lilypond发明的变种语言[Paraff](https://github.com/findlab-org/paraff)，这里不赘述。
剩下的ABC Notation和Humdrum两种语言都有人用来做符号音乐算法的数据表示。

NotaGen使用的是[ABC Notation](https://notabc.app/abc/basics/)的一个变种Interleaved ABC Notation。
Interleaved ABC Notation最早可能是MuPT[^11]的作者提出的，
不过也可能是CLaMP 2[^12]的作者独立作出的，毕竟思路很清晰，就是相当于把曲谱从part-wise变成了time-wise。
笔者的[Paraff]也遵循同样的设计。
见下图：

<figure>
	<picture>
		<img src="/images/arxiv2410.13267-figure6.png" />
	</picture>
	<figcaption>
		Figure 6 from CLaMP 2
		图中以Chopin Op.9 No.2 前两小节为例
	</figcaption>
</figure>

笔者之前没有采用ABC Notation的原因是，其自带的曲谱渲染器太过于简陋。
而笔者之前的一个主要工作领域是OMR，需要高质量的曲谱图像数据，从生成数据的角度，Lilypond显著优于ABC Notation。
不过NotaGen和CLaMP的团队解决了ABC Notation to MusicXML的转换问题，并使用了MuseScore作为曲谱渲染器及各种媒体格式的转换工具。
这使得ABC Notation的确成为一个不错的选择，不过对于复杂曲谱，如复调的键盘作品，ABC Notation的表达能力还有待观察。

MuseScore是商业级曲谱软件中唯一开源的，类似的方案还有[Verovio](https://www.verovio.org/)。
不过MuseScore开源的时候笔者已经有了自己的[Lotus](https://github.com/k-l-lambda/lotus)项目了，一旦转型需要做大量额外的前端工作，所以没有深入使用。


## 2 levels decoder

使用ABC Notation来做符号音乐生成，可能最早的是MuPT[^11]。
去看他的paper，除了数据表示就没有太多音乐方面的内容了，主要在探讨数据集相关的Scaling Law。
给我类似印象的还有Music Transformer[^2]，实现了MIDI数据的tokenization之外，其他主要是提出了一种transformer二次方计算复杂度的优化方案。
不过NotaGen的团队在模型架构方面是有追求的。
确切地说，是第二作者（或者应该叫同等贡献作者之一）*Shangda Wu*再次应用了他之前提出的一种2级解码架构。

<figure>
	<picture>
		<img src="/images/arxiv2301.02884-figure1.png" />
	</picture>
	<figcaption>
		Figure 1 from TunesFormer
		最早提出2 levels decoder的工作
	</figcaption>
</figure>[^5]

<figure>
	<picture>
		<img src="/images/arxiv2502.18008-figure2.png" />
	</picture>
	<figcaption>
		Figure 2 from NotaGen
	</figcaption>
</figure>[^15]

笔者第一次看到这里马上联想到之前的一篇MegaByte[^7]:

<figure>
	<picture>
		<img src="/images/arxiv2305.07185-figure1.png" />
	</picture>
	<figcaption>
		Figure 1 from MegaByte
	</figcaption>
</figure>[^7]

不过查看发表日期，*WU*的*TunesFormer*[^5]还是在MegaByte[^7]之前的。
但是在bGPT[^10]的paper中，作者又亲自提到是受了MegaByte的启发。
所以究竟是独立提出的想法还是来自更早工作的借鉴笔者还下不了定论。

不过两级解码器的思路起源是清晰的，就是为了缓解注意力机制中的序列长度问题。
当然即使按照*MuPT*[^11]的路线，有了目前推理加速领域的技术支持（诸如FlashAttetion），一首音乐的长度感觉也不成大问题了。
但是在符号音乐领域，有一个先成可以利用的结构，就是音乐中周期性的强弱节奏构成的小节————
使得音乐先天就具有了二级结构，不加以利用就浪费了。

笔者[前一篇](/2023/11/29/vae-based-music-encoder/)中构造的单小节曲谱编/解码器也是这么一种思路。
不过这里的区别在于，笔者之前还是把网络参数的重头放在token这级（对应NotaGen的byte level），
bar-level在最终解码时只作为前情提要式的信息辅助，训练时其只关注单个小节，token level训练时bar-level的小节编码器作为预训练模块加载。
而在NotaGen这里，bar-level解码器才是作曲的主角，byte-level解码器只关注单个小节信息，而完全不看上下文。

这里的一个重点还在于，并不是说两级结合起来训练的思路想不到，而是这样做其实有代价，往往权衡各种解法利弊的时候就直接忽略了。
就好像下棋的时候，最优的一步有时候是在看似不可能的地方出现。
这里的代价指的是，为了高效率地同时训练两级解码器，byte-level的输入数据长度需要强制对齐，会牺牲一部分很长的小节（比如很长一串的快速短音符，或是连续多组复杂和弦）。
从结果来看，NotaGen的设计很可能是做出了正确的取舍。

顺便一提，这个两级解码器结构在*WU*的工作中更多是用在音乐信息检索(MIR)领域，见于*CLaMP*1-3[^6][^12][^14]。
并且在*bGPT*[^10]中，还尝试了使用该架构生成图像音频，以及CPU状态预测。


## CLaMP-DPO

在模型训练方面，NotaGen也沿袭了目前LLM主流的pretrain-finetune-RL的路线范式。

从源代码来看，每个阶段都是全量参数的训练，也没有使用LoRA等其他附加参数的方法，除了数据集和损失函数，只是在不同阶段使用了不同的学习率。

值得说一下的是强化学习阶段，作者再次复用了自己之前的工作CLaMP 2[^12]作为评估模型。
CLaMP 2本来是用来做MIR的，提取了每首曲子的音乐特征。
在这里相当于RLHF中的打分模型，用来比较finetune之后模型生成作品，与相同提示下的参考作品之间在语义特征上的相似度。
最优相似度排序中的前10%进入接受集，末尾10%进入拒绝集。
训练时从接受集和拒绝集中各采样一个样本组成正负样本对$\{pw, pl\}$，然后计算DPO-Positive损失函数：

$$
\mathcal{L}_{\text{DPOP}}(\pi_\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(p, x_{pw}, x_{pl}) \sim \mathcal{D}} \left[ \log \sigma \left( \underbrace{ \beta \log \frac{\pi_\theta(x_{pw} | p)}{\pi_{\text{ref}}(x_{pw} | p)} - \beta \log \frac{\pi_\theta(x_{pl} | p)}{\pi_{\text{ref}}(x_{pl} | p)} }_{\text{DPO items}} - \underbrace{ \beta \lambda \cdot \max \left( 0, \log \frac{\pi_{\text{ref}}(x_{pw} | p)}{\pi_\theta(x_{pw} | p)} \right) }_{\text{DPOP item}} \right) \right]
$$

补充说两句，笔者很早就有一种体会，分析模型和生成模型的训练是相辅相成的。
这里分析模型指输入数据的熵高于输出数据，生成模型则反过来。
分析模型在于排除噪声干扰，识别数据中存在的某种潜在模式，而生成模型则在于不断混入噪声，并把噪声引向符合目标分布内的多样性维度。
笔者最初训练曲谱生成模型其实是用来做OMR的数据来源，获得符合真实分布的曲谱数据以用来合成有标注的曲谱图像。
反之，更好地识别曲谱中的各种模式则有利于条件化地控制音乐生成。


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
<figcaption>
Table 1 from *arxiv2502.18008*: Data sources and the respective amounts for fine-tuning
</figcaption>

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
[^10]: bGPT: [arxiv2402.19155](https://arxiv.org/abs/2402.19155)
[^11]: MuPT: [arxiv2404.06393](https://arxiv.org/abs/2404.06393)
[^12]: CLaMP 2: [arxiv2410.13267](https://arxiv.org/abs/2410.13267)
[^13]: Music Event Transformer (MET): https://github.com/SkyTNT/midi-model
[^14]: CLaMP 3: [arxiv2502.10362](https://arxiv.org/abs/2502.10362)
[^15]: NotaGen: [arxiv2502.18008](https://arxiv.org/abs/2502.18008)
