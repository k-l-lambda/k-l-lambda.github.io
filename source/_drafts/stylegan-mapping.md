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
The design of `mapping` is intended to disentangle the manifold mapping from latent space to feature variation space.
I'm interested at how the shape of learned mapping in network warps exactly, so this is my experiment.

By normalization at begin of mapping network, input z vectors are on the regular 512-d unit spherical surface.
Supposing `mapping` is a continuous function, all possible w points from Z will distribute on a irregular closed 512-d surface.
To show a 512-d manifold is difficult, for human only capable with 2-d vision. But we can show some local characteristics by slicing.

Here is my way. Pick a geodesic line on sphere, i.e. a circle, map it into W space, then show the warped result circle.
To get a section circle of 512-d sphere, for generility, random sample 2 points (standard normal random then normalize),
then slerp between, and beyond them until a cycle on shpere.
To show the 512-d result, I simply project the high dimensional line into multiple low dimensional lines.
I.e. for every point *w* in circle:

$$ \textbf{w}: [w_{1}, w_{2}, w_{3}, ..., w_{512}] \rightarrow \\{[w_{1}, w_{2}, w_{3}], [w_{4}, w_{5}, w_{6}], ...\\} $$

Then plot the projections in a 3D coordinate system, as you see blow.

<figure>
	<span class="fixed-ratio" style="width: 100%; padding-top: min(66%, 586px); max-width: 1025px">
		<iframe src="/klstudio/embed.html#/documents/stylegan-mapping"></iframe>
	</span>
	<figcaption>
		Evenly interpolated 96 points on a great circle of unit shpere.
		Sample circles: 1 specified (on the plane of first 2 axes) and 5 random. <wbr />
		The mapping network is from <em>stylegan2-ffhq-config-f</em>
		<sup><a target="_blank" href="https://github.com/NVlabs/stylegan2/blob/master/pretrained_networks.py#L32">3</a></sup>.
	</figcaption>
</figure>

As you see in the plotting, projected circles don't look like circle at all in most dimensions. So the mapping from Z to W is highly unsmoothed.
Notice the intervals between neighbor points, that seems uneven in global, but roughly even in segments locally.
When you select very many dimensions (by moving the second slider to right), you will see the overall distribution of points' coordinates.


[1]: https://arxiv.org/abs/1812.04948
[2]: https://arxiv.org/abs/1912.04958
[3]: https://github.com/NVlabs/stylegan2/blob/master/pretrained_networks.py#L32
