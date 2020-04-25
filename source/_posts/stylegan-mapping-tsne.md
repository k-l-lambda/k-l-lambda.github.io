---
title: A Postscript for StyleGAN Mapping Network Geometry Visualization
tags:
  - deep_learning
  - stylegan
date: 2020-04-25 11:52:06
---



<figure>
	<picture>
		{% img figure /images/stylegan-mapping-sampling-pca.png 400 '"" "StyleGAN mapping sampling points visualization by embedding projector"' %}
	</picture>
	<figcaption>
		<p>StyleGAN mapping sampling points visualization by embedding projector</p>
		<p><a href="https://projector.tensorflow.org/?config=https://gist.githubusercontent.com/k-l-lambda/ec91b00e74a62b6435ec098138f9ab0d/raw/df0e1a3f7a8e29476e30c723038f425f71bba0bd/embedding-projector-config.json">click here to see 3D visulization</a></p>
	</figcaption>
</figure>


Some days after the former post of [StyleGAN Mapping Network Geometry Visualization](/2020/02/10/stylegan-mapping/),
I realized that there are some canonical dimension reduction methods for data visualization, such as [PCA](https://en.wikipedia.org/wiki/Principal_component_analysis), [t-SNE](https://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding).
These ways may be more intuitive to show data characteristics. So I did some attempts on this.

<!-- more -->

Firstly I tried a [t-SNE implementation by tensorflow.js](https://github.com/tensorflow/tfjs-tsne),
disappointedly, after a moment struggling against release version compatibility problem,
I found that the upper limit of data dimensions is merely 40 on a browser WebGL backend, while SytleGAN W space is 512-d.

Finally, I give up the attempt of a more sophisticated t-SNE implementation,
I found the [tensorflow embedding projector](https://projector.tensorflow.org/) is a not bad option.
Its integration with github gist is handy.

This is the [**live 3D visualization**](https://projector.tensorflow.org/?config=https://gist.githubusercontent.com/k-l-lambda/ec91b00e74a62b6435ec098138f9ab0d/raw/df0e1a3f7a8e29476e30c723038f425f71bba0bd/embedding-projector-config.json).
It seems t-SNE result is more smooth, but a bit unstable.
For t-SNE, the result to the experiment of one random circle, points will convergence to a nearly regular round.
That seems mainly caused by lack of adjacencies on a circle sampling. Then I made a configuration of 3 random circles, as shown in the top illustration.
Most dimension reduction algorithm normalized original data, therefore the bias information is lost. That is a disadvantage.
