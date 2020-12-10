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
Till now, a popular way to represent a Rubik's cube state is the facelets expanding graph, like this:

![a cube3 expanding graph sample](/images/cube3-expand-graph-original.png)

By this way, you can't tell which facelets are adjacent each other straightway, also it's hard to imagine what the cube will change into after a twist applied.
That because it comes from the appearance, but not the essential.
Furtherly, as [my preivous blog](2020/02/05/cube-algebra/#Motivation) wrote, Rubik’s Cube solver programs who construct cube state from facelet color is clumsy.
Rubik’s Cube is a game about cubes's **rotation** and **permutation** (but not painting color), **matrix** is the most proper math tool here.

However, the fact revealed by this method is not easy to see through, and that is just what I will tell you in this blog.

<!-- more -->

## Cube orientation representation

Let's begin with the 1-order Rubik's cube.

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

Mathematically, they can be defined in quaternions:

$$
\alpha = 1 \\\\
\beta = i \\\\
\gamma = j \\\\
\delta = k \\\\
\epsilon = \sqrt{i} \\\\
... \\\\
\omega = i\sqrt[-]{k}
$$

These 24 elements make up a group [$O_{h}$](https://en.wikipedia.org/wiki/Octahedral_symmetry#Full_octahedral_symmetry),
that means they are closed for multiplication, and the multiplication satisfys the associative law.

And this is the group multiplication table:

<!-- md cube-rotation-table-greek.md -->

This is the multiplication visualization:

<figure>
	<iframe src="/klstudio/embed.html#/documents/cube-multiplication-demo" width="600" height="280"></iframe>
</figure>


## Rubik's cube position representation

A = (1, 0, 0, ...)
B = (0, 1, 0, ...)
C = (0, 0, 1, ...)
...

figure: cube3 with position labels


## Cube rotation and position permutation

<figure>
	<picture>
		<img src="/images/rect2x2-permutation.drawio.svg" />
	</picture>
</figure>

<style>
	table td
	{
		text-align: center;
	}

	table.no-border
	{
		border: 0;
	}

	table.no-border > tbody > tr > td
	{
		border: 0;
	}

	table strong
	{
		color: red;
	}
</style>

<table class="no-border">
<tr><td>

|	| A | B | C | D |
|:-:|:-:|:-:|:-:|:-:|
| <strong>A</strong> | 1 |	|	|	|
| <strong>B</strong> |	| 1 |	|	|
| <strong>C</strong> |	|	| 1 |	|
| <strong>D</strong> |	|	|	| 1 |

</td>
<td style="font-size: 400%">&#x21e8;</td>
<td>

|	| A | B | C | D |
|:-:|:-:|:-:|:-:|:-:|
| <strong>A</strong> |	| 1 |	|	|
| <strong>B</strong> |	|	|	| 1 |
| <strong>C</strong> | 1 |	|	|	|
| <strong>D</strong> |	|	| 1 |	|

</td>
</table>

$$
\alpha
\begin{bmatrix}
1 &  &  & \\\\
& 1 &  & \\\\
&  & 1 & \\\\
&  &  &1
\end{bmatrix} \to \eta \begin{bmatrix}
& 1 &  & \\\\
&  &  & 1 \\\\
1 &  &  & \\\\
&  & 1 &
\end{bmatrix} = \begin{bmatrix}
& \eta &  & \\\\
&  &  & \eta \\\\
\eta &  &  & \\\\
&  & \eta &
\end{bmatrix}
$$

<figure>
	<iframe src="/klstudio/embed.html#/documents/dynamic-labeled-cube3-demo" width="960" height="600"></iframe>
</figure>

mat(state-vector) = diag(state-vector) * permutation-matrix

cube3 matrix


## Rubik's cube multiplication

<figure>
	<iframe src="/klstudio/embed.html#/documents/cube3-multiplication-demo" width="800" height="400"></iframe>
</figure>

matrix multiplication


## Rubik's cube solver

U = <&alpha; &alpha; &gamma; &gamma; ...>
...
