---
title: How to represent a Rubik's cube state in a calculable form?
tags:
- rubiks_cube
- algebra
---


<figure>
	<picture>
		<img src="/images/cube3-matrix-tetris.svg" alt="a cube3 matrix samle #LKONLKONLOKNLKONKLNOGCAAFD" />
	</picture>
	<figcaption>
		Guess what this is? <a href="/klstudio/embed.html#/documents/dynamic-labeled-cube3#LKONLKONLOKNLKONKLNOGCAAFD">See the answer here.</a>
	</figcaption>
</figure>

To describe a chess game state, you don't need to mention every chess piece's details.
Essentially, a chess piece is just a symbol. Ignoring appearance detail helps us to grab the game gist.
Till now, the popular way to represent a Rubik's cube state is the facelets expanding graph, like this:

![a cube3 expanding graph sample](/images/cube3-expand-graph-original.png)

By this way, you can't tell which facelets are adjacent each other straightway, also it's hard to imagine what the cube will change into after a twist applied.
That because it comes from the appearance, but not the essential.
Furtherly, as [my preivous blog](2020/02/05/cube-algebra/#Motivation) wrote, Rubik’s Cube solver programs who construct cube state from facelet color is clumsy.
Rubik’s Cube is a game about cubes's **rotation** and **permutation** (but not painting color), **matrix** is the most proper math tool here.

However, the fact revealed by this method is not easy to see through, and that is just what I will tell you in this blog.

<!-- more -->

## Cube orientation representation

Recently, I found 2 lucky things, this is the first:

<figure>
	<span class="max600">
		<span class="fixed-ratio" style="width: 100%; padding-top: 100%">
			<iframe src="/klstudio/embed.html#/documents/mesh-viewer-demo:quarter-array-4x6-greek"></iframe>
		</span>
	</span>
	<figcaption>Representing 24 orthogonal orientations by lowercase Greek letters.</figcaption>
</figure>

You will be familiar with this figure if you have read [my preivous blog](2020/02/05/cube-algebra/#Motivation).
The lucky is that we have exact 24 modern Greek letters in total coincidentally.

I have explained cube rotation algebra in [the preivous blog](2020/02/05/cube-algebra/#Motivation) in details,
now I just show you what the relationship looks like between Greek letters and colored cubes.

<figure>
	<span style="display: inline-block; width: 400px;">
		<span class="fixed-ratio" style="width: 100%; padding-top: 100%">
			<iframe src="/klstudio/embed.html#/documents/flipping-cube-demo"></iframe>
		</span>
	</span>
</figure>

In quaternion, we can define them as:

$$
\alpha = 1 \\\\
\beta = i \\\\
\gamma = j \\\\
\delta = k \\\\
\epsilon = \sqrt{i} \\\\
... \\\\
\omega = i\sqrt[-]{k}
$$

table: multiplication table of Oh in greek letters

figure: interactive cube * cube = cube


## Rubik's cube position representation

A = (1, 0, 0, ...)
B = (0, 1, 0, ...)
C = (0, 0, 1, ...)
...

figure: cube3 with position labels


## Cube rotation and position permutation

#figure: interactive cube3 with position & cubie labels

mat(state-vector) = diag(state-vector) * permutation-matrix

cube3 matrix


## Rubik's cube multiplication

figure: interactive cube3 * cube3 = cube3

matrix multiplication


## Rubik's cube solver

U = <&alpha; &alpha; &gamma; &gamma; ...>
...
