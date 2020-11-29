---
title: How to represent a Rubik's cube state in a calculable form?
tags:
- rubiks_cube
- algebra
---


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
