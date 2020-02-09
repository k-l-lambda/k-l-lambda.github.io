---
title: StyleGAN Mapping Network Geometry Visualization
tags:
- deep_learning
- stylegan
---

<figure>
	<img src="/images/stylegan-network.webp" width="240" />
	<img src="/images/stylegan-geometry.webp" width="600" />
	<figcaption>
		StyleGAN generator network architecture & geometry concept illustration
	</figcaption>
</figure>

[StyleGAN](https://github.com/NVlabs/stylegan2)<sup>[1], [2]</sup> generator network has two parts: full-connected mapping network (named *`mapping`*), and pyramid CNN synthesis network (named *`g`*).
`Mapping` is a transformation from dimension 512 to 512, and `g` is a transformation from dimension 512 to 1024&times;1024&times;3.


<figure class="fixed-ratio" style="width: 100%; padding-top: 67%">
	<iframe src="/klstudio/embed.html#/documents/stylegan-mapping"></iframe>
</figure>

[1]: https://arxiv.org/abs/1812.04948
[2]: https://arxiv.org/abs/1912.04958
