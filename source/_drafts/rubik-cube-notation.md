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

By this way, you can't tell which facelets are adjacent each other straightway, also it's hard to tell what the cube will change into after a twist applied.
That because it comes from the appearance, but not the essential.
Furtherly, as [my preivous blog](2020/02/05/cube-algebra/#Motivation) wrote, Rubik’s Cube solver programs who construct cube state from facelet color is clumsy.
Rubik’s Cube is a game about cubes's **rotation** and **permutation** (but not painting color), **matrix** is the most proper math tool here.

However, the fact revealed by this method is not easy to see through, and that is just what I will tell you in this blog.

## Cube orientation representation

figure: 24 orientation knights

figure: random rotation cube

&alpha; = 1
&beta; = i^1/2
&gamma; = j^1/2
&delta; = k^1/2
...

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
