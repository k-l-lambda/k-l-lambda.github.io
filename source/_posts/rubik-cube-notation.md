---
title: How to represent a Rubik's cube state in a calculable form?
tags:
  - rubiks_cube
  - algebra
date: 2020-12-14 21:37:33
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

Let's begin with a simple case, the *1-order Rubik's cube*, i.e. a single cube.
How to restore a rotated cube to the original orientation, in a shorttest way?
That's just [my preivous blog](2020/02/05/cube-algebra/#Motivation)'s topic.
Now let's symbolize them in a new way.

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
\begin{aligned}
& \alpha = 1 \\\\
& \beta = i \\\\
& \gamma = j \\\\
& \delta = k \\\\
& \epsilon = \sqrt{i} = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2} i \\\\
& ... \\\\
& \omega = i\sqrt[-]{k} = \frac{\sqrt{2}}{2} i - \frac{\sqrt{2}}{2} j
\end{aligned}
$$

These 24 elements make up a group [$O_{h}$](https://en.wikipedia.org/wiki/Octahedral_symmetry#Full_octahedral_symmetry),
that means they are closed for multiplication, and the multiplication satisfys the associative law.

And this is the group multiplication table:

<!-- md cube-rotation-table-greek.md -->

This is the multiplication visualization:

<figure>
	<iframe src="/klstudio/embed.html#/documents/cube-multiplication-demo" width="600" height="280"></iframe>
</figure>


## Cubies' position representation

In 3-order Rubik's cube, we have $3^3-1=26$ cubies.
And this is the second lucky thing: there are 26 Latin letters in total.
So we can labeled 26 cubie positions by A-Z. It looks like this:

<figure>
	<span class="max600">
		<span class="fixed-ratio" style="width: 100%; padding-top: 100%">
			<iframe src="/klstudio/embed.html#/documents/static-labeled-cube3-demo"></iframe>
		</span>
	</span>
	<figcaption>Rubik's cube with labels on cubies</figcaption>
</figure>

Mathematically, we define 26 one-hot vectors:

$$
\boldsymbol{A} = (\mathbf{1}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) \\\\
\boldsymbol{B} = (0, \mathbf{1}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) \\\\
\boldsymbol{C} = (0, 0, \mathbf{1}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0) \\\\
... \\\\
\boldsymbol{Z} = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, \mathbf{1})
$$

This form is convenient for constructing matrices, e.g. a 26&times;26 identity matrix can be represented as:

$$
\begin{bmatrix}
\boldsymbol{A}^T & \boldsymbol{B}^T & \boldsymbol{C}^T & ... & \boldsymbol{X}^T & \boldsymbol{Y}^T & \boldsymbol{Z}^T
\end{bmatrix}^T
$$


## Cube rotation and position permutation

Rotation causes displacement, it's a kind of linear transformation. We can see this clearly in matrix.
Take this simple example firstly:

<figure>
	<picture>
		<img src="/images/rect2x2-permutation.drawio.svg" />
	</picture>
</figure>

<style>
	.red
	{
		color: red;
	}
</style>

We have 4 (2&times;2) boxes labeled by red <em class="red">A</em> <em class="red">B</em> <em class="red">C</em> <em class="red">D</em>,
and we have 4 fixed cells labeled by black <em>A</em> <em>B</em> <em>C</em> <em>D</em>.

Before and after a 90&deg; rotation, we record boxes' position in a 4&times;4 table:

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

So this is the matrix's meaning, every row tells us which cell the box is at.

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

And plused an orientation scalar in Greek letters.
(Why *&eta;*? Try to look up what *&eta;* stands for in the 24 knights figure.)

Now let's extend 2&times;2 into 26&times;26:

<figure>
	<iframe src="/klstudio/embed.html#/documents/dynamic-labeled-cube3-demo" width="960" height="600"></iframe>
</figure>

For the matrix you see above, I arranged the cubies' order as this:

<figure>
	<picture>
		<img src="/images/cube3-matrix-illustration.drawio.svg" style="max-width: 600px" />
	</picture>
</figure>

A state matrix can be decomposed into 2 parts: orientations and position permutation.
And position permutation is determined by orientations, so to present a Rubik's cube state we only need to record a vector of orientation symbols.
Mathematically, we have a state vector:

$$
S=o_i | _{i=1,...,26}
$$

while

$$
o_i \in \left \\{ \alpha, \beta, \gamma, ..., \omega \right \\}
$$

then the state matrix is:

$$
mat(S)=diag(S) \cdot displace(o_i, P_i)^T|_{i=1,...,26}
$$

$$
P_i = \boldsymbol{A}, \boldsymbol{B}, \boldsymbol{C}, ..., \boldsymbol{Z} |_{\text{when } i=1,...,26}
$$

while *diag* stands for diagonal matrix, *displace* is a position mapping by a specific orientation, from a one-hot position vector to another.
This is the dispacement table:

$$
\begin{matrix}
\text{displace} & \alpha & \beta & \gamma & ... \\\\
\color{red} A & \boldsymbol{A} & \boldsymbol{G} & \boldsymbol{F} & ... \\\\
\color{red} B & \boldsymbol{B} & \boldsymbol{H} & \boldsymbol{E} & ... \\\\
\color{red} C & \boldsymbol{C} & \boldsymbol{E} & \boldsymbol{H} & ... \\\\
... & & & &
\end{matrix}
$$

The whole table is 26&times;24, what shows here is a part, and you can imagine the rest.

Let's take the top matrix in this blog ([the tetris pattern](/klstudio/embed.html#/documents/dynamic-labeled-cube3#LKONLKONLOKNLKONKLNOGCAAFD)) as an example:

<!-- md cube3-matrix-deduce-tetris.md -->

For short, I will refer it as:

$$
\left \langle \omicron \lambda \pi \mu \omicron \lambda \pi \mu \lambda \omicron \omicron \lambda \pi \mu \pi \mu \omicron \mu \lambda \pi \eta \kappa \iota \zeta \alpha \alpha \right \rangle
$$

### State space capacity

3D object has 3 degrees of freedom in rotation, but the most convenient method to represent it is using 4 fields, i.e. quaternion.
So a proper state space redundancy is necessary for the sake of calculation.

A valid 3-order Rubik's cube's total variation is:

$$
\frac{8! \times 3^8 \times 12! \times 2^{12}}{2 \times 2 \times 3} = 43252003274489856000 \approx 4.33 \times 10^{19}
$$

If allowing disassembly, the number becomes twelve times larger:

$$
8! \times 3^8 \times 12! \times 2^{12} = 519024039293878272000 \approx 5.19 \times 10^{20}
$$

Besides that, representing a Rubik's cube state in orientation vector ignores cubies' position conflicting. The total variation is:

$$
24^{20} = 4019988717840603673710821376 \approx 4.02 \times 10^{28}
$$

(For equality, I ignored 6 axes cubies here.)

And above all these, the facet color scheme allow painting abitrary color in 6 kinds for every facet. Its total variation is:

$$
6^{48} = 22452257707354557240087211123792674816 \approx 2.25 \times 10^{38}
$$

As a Rubik's cube computer implementation, I'm afraid the redundancy of this scheme is beyond necessary, and is waste and misleading.

## Calculation of Rubik's cube

Once we represent a Rubik's cube state by a matrix, we can calculate it purely by algebra.
This is an example to show what the Rubik's cube multiplication looks like:

<figure>
	<iframe src="/klstudio/embed.html#/documents/cube3-multiplication-demo" width="800" height="400"></iframe>
</figure>

As all groups, Rubik's cube multiplication obeys associative law, but is not exchangeable.


## Rubik's cube solver

Now, we known this significant fact: **the Rubik's cube solver problem is a matrix decomposition problem**!

Specifically, we have 12 unit quarter twists in matrix form:

$$
\begin{aligned}
& U = \left \langle  \alpha \alpha \zeta \zeta \alpha \alpha \zeta \zeta  \alpha \alpha \alpha \alpha \zeta \zeta \zeta \zeta \alpha \alpha \alpha \alpha  \alpha \alpha \zeta \alpha \alpha \alpha  \right \rangle \\\\
& U' = \left \langle  \alpha \alpha \iota \iota \alpha \alpha \iota \iota  \alpha \alpha \alpha \alpha \iota \iota \iota \iota \alpha \alpha \alpha \alpha  \alpha \alpha \iota \alpha \alpha \alpha  \right \rangle \\\\
& D = \left \langle  \iota \iota \alpha \alpha \iota \iota \alpha \alpha  \iota \iota \iota \iota \alpha \alpha \alpha \alpha \alpha \alpha \alpha \alpha  \alpha \alpha \alpha \iota \alpha \alpha  \right \rangle \\\\
& D' = \left \langle  \zeta \zeta \alpha \alpha \zeta \zeta \alpha \alpha  \zeta \zeta \zeta \zeta \alpha \alpha \alpha \alpha \alpha \alpha \alpha \alpha  \alpha \alpha \alpha \zeta \alpha \alpha  \right \rangle \\\\
& L = \left \langle  \theta \alpha \theta \alpha \theta \alpha \theta \alpha  \alpha \alpha \theta \alpha \alpha \alpha \theta \alpha \theta \alpha \alpha \theta  \alpha \alpha \alpha \alpha \theta \alpha  \right \rangle \\\\
& L' = \left \langle  \epsilon \alpha \epsilon \alpha \epsilon \alpha \epsilon \alpha  \alpha \alpha \epsilon \alpha \alpha \alpha \epsilon \alpha \epsilon \alpha \alpha \epsilon  \alpha \alpha \alpha \alpha \epsilon \alpha  \right \rangle \\\\
& R = \left \langle  \alpha \epsilon \alpha \epsilon \alpha \epsilon \alpha \epsilon  \alpha \alpha \alpha \epsilon \alpha \alpha \alpha \epsilon \alpha \epsilon \alpha \epsilon  \alpha \alpha \alpha \alpha \alpha \epsilon  \right \rangle \\\\
& R' = \left \langle  \alpha \theta \alpha \theta \alpha \theta \alpha \theta  \alpha \alpha \alpha \theta \alpha \alpha \alpha \theta \alpha \theta \alpha \theta  \alpha \alpha \alpha \alpha \alpha \theta  \right \rangle \\\\
& F = \left \langle  \eta \eta \eta \eta \alpha \alpha \alpha \alpha  \eta \alpha \alpha \alpha \eta \alpha \alpha \alpha \eta \eta \alpha \alpha  \eta \alpha \alpha \alpha \alpha \alpha  \right \rangle \\\\
& F' = \left \langle  \kappa \kappa \kappa \kappa \alpha \alpha \alpha \alpha  \kappa \alpha \alpha \alpha \kappa \alpha \alpha \alpha \kappa \kappa \alpha \alpha  \kappa \alpha \alpha \alpha \alpha \alpha  \right \rangle \\\\
& B = \left \langle  \alpha \alpha \alpha \alpha \kappa \kappa \kappa \kappa  \alpha \kappa \alpha \alpha \alpha \kappa \alpha \alpha \alpha \alpha \kappa \kappa  \alpha \kappa \alpha \alpha \alpha \alpha  \right \rangle \\\\
& B' = \left \langle  \alpha \alpha \alpha \alpha \eta \eta \eta \eta  \alpha \eta \alpha \alpha \alpha \eta \alpha \alpha \alpha \alpha \eta \eta  \alpha \eta \alpha \alpha \alpha \alpha  \right \rangle \\\\
\end{aligned}
$$

To find a path from the solved state to an arbitrary state, is just finding a multiplication decomposition in unit twists for the specific state matrix.

We known that any 3-order Rubik's cube state can be solved in 26 quarter twists in most[^1].
But finding the shortest solution is still a pending problem.
I hope the matrix representation can provide some new approaches for this problem. After all, linear algebra is a highly developed domain already.

Here is the link of [Rubik's cube & matrix interactive demo](/klstudio/#/documents/dynamic-labeled-cube3).


[^1]: [God's Number is 26 in the Quarter-Turn Metric](http://www.cube20.org/qtm/)
