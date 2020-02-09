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
		StyleGAN generator network architecture & geometry conceptual illustration
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
		Evenly interpolated 96 points on a great circle of unit shpere. <br />
		Sample circles: 1 specified (on the plane of first 2 axes) and 5 random. <br />
		The mapping network is from <em>stylegan2-ffhq-config-f</em>
		<sup><a target="_blank" href="https://github.com/NVlabs/stylegan2/blob/master/pretrained_networks.py#L32">3</a></sup>.
	</figcaption>
</figure>

As you see in the plotting, projected circles entwines in most dimensions. So the mapping from Z to W is more rugged than I expected in the conceptual illustration.
Intervals between neighbor points, though not very even, but high dimensional aspect can't be speculated by low dimensional projections.

When you select very many dimensions (by moving the second slider to right), you will see the overall distribution of points' coordinates.
It may be a significant observation that most points congregate at the first octant (+, +, +), more exactly, the tetrahedron area with vertices about *(0, 0, 0), (1.5, 0, 0), (0, 1.5, 0), (0, 0, 1.5)*.
This phenomenon reminds [ReLU](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) activation's effection.
According to StyleGAN source code<sup>[4]</sup>, *Leaky ReLU* is used in mapping network by default, which coincides the ploting results.
In some sense, the asymmetry may be necessary to disentanglement learning.
But in a further thinking, considering the network is trained on a dataset from nature, why nature need asymmetry and where does it come from?

Space splitting.


[1]: https://arxiv.org/abs/1812.04948
[2]: https://arxiv.org/abs/1912.04958
[3]: https://github.com/NVlabs/stylegan2/blob/master/pretrained_networks.py#L32
[4]: https://github.com/NVlabs/stylegan2/blob/master/training/networks_stylegan2.py#L261
