---
title: Orthogonal Algebra in 3D Space
tags:
---

<figure>
	<span class="max600">
		<span class="fixed-ratio" style="width: 100%; padding-top: 100%">
			<iframe src="/klstudio/embed.html#/documents/mesh-viewer-demo:quarter-array-4x6"></iframe>
		</span>
	</span>
	<figcaption>In 3D space, an object has 6 &times; 4 = 24 orthogonal orientations in total, without symmetric consider.</figcaption>
</figure>

## Motivation

Canonical Rubik's Cube solver algorithm<sup>[1]</sup> constructs cube state from face colors and a lot of permutation rules. That may waste too many coding :)
Since Rubik's Cube seems already been used as the avatar of group theory (check this [wikipedia entry](https://en.wikipedia.org/wiki/Group_theory)),
it's better to clarify all details of the cube rotation group structure, and constrct the whole Rubik's Cube representations based on cubies' orientation.

Regardless of Rubik's Cube, orthogonal rotation in 3D space is usual and connected with interesting problems. e.g. how to quickly tell if 2 orthogonal [Euler angles](https://en.wikipedia.org/wiki/Euler_angles) are the same rotation, purely by algebra without experiment?
[Quaternion calculus](https://en.wikipedia.org/wiki/Quaternion) may be the short answer, but when you do that, irrational numbers are inevitable, and that seems wasting and precise problematic.

All you need is a multiplication table, and the table is highly symmetric, so let's analyze the group structure.

## Quaternion space half reduction

In fact, we can invent a new symbol system to represent every element, but it may be a better choice to keep compatible with quaternion.
However, by quaternion we should solve an ambiguity issue firstly. Because in **R**<sup>3</sup> geometry, a pair of quaternion *&pm;q* represent a same rotation.
We need a assistant function to reduce redundancy.

We define a space half reduction sign function **sgn<sub>h</sub>**:

$$sgn_{h}(a+bi+cj+dk) = \begin{cases}
1 & \text{ if } a>0, \\\\
 & \text{ or } a=0, b>0, \\\\
 & \text{ or } a=b=0, c>0, \\\\
 & \text{ or } a=b=c=0, d>0, \\\\
 \\\\
0 & \text{ if } a=b=c=d=0, \\\\
 \\\\
-1 & \text{ otherwise. }
\end{cases}$$

Then define the space half reduction absolute function **abs<sub>h</sub>**:

$$abs_{h}(q) = sgn_{h}(q) \cdot q$$

In the quaternion **R**<sup>4</sup> space, this function reflect (by centrosymmetric) a half **R**<sup>4</sup> space to the other side.
And right on the reflection interface **R**<sup>3</sup> subspace, do the same thing, and also for **R**<sup>2</sup> interface, **R**<sup>1</sup> interface recursively.

Then we define a shorthand representation

$$q \cong p$$

to stand for:

$$abs_{h}(q) = abs_{h}(p),$$

which means *q = p* or *q = -p*, i.e. they represent the same **R**<sup>3</sup> orientation/rotation. Obviously, this *half-reduction equal* also has transitivity as plain equal.

## Calculus

Now we have these obvious facts:

$$i^{2} \cong j^{2} \cong k^{2} \cong 1$$

means 360&deg; rotation returns to origin.

$$
i \cong i^{-1} \\\\
j \cong j^{-1} \\\\
k \cong k^{-1}
$$

means &pm;180&deg; rotation (along a same axis) arrives the same orientation.

$$
i^{\frac{3}{2}} \cong i^{-\frac{1}{2}} \\\\
j^{\frac{3}{2}} \cong j^{-\frac{1}{2}} \\\\
k^{\frac{3}{2}} \cong k^{-\frac{1}{2}}
$$

means 270&deg; rotation equal -90&deg; rotation (along a same axis).

Not very obvious, but we can get by computaion:

$$
\sqrt{i}\sqrt{j} = \sqrt{j}\sqrt{k} = \sqrt{k}\sqrt{i} \\\\
\sqrt{i}\sqrt[-]{j} = \sqrt[-]{j}\sqrt[-]{k} = \sqrt[-]{k}\sqrt{i} \\\\
\sqrt[-]{i}\sqrt{j} = \sqrt{j}\sqrt[-]{k} = \sqrt[-]{k}\sqrt[-]{i} \\\\
\sqrt[-]{i}\sqrt[-]{j} = \sqrt[-]{j}\sqrt{k} = \sqrt[-]{i}\sqrt{k}
$$

$$
\sqrt{j}\sqrt{i} = \sqrt[-]{k}\sqrt{j} = \sqrt{i}\sqrt[-]{k} \\\\
\sqrt[-]{j}\sqrt{i} = \sqrt{k}\sqrt[-]{j} = \sqrt{i}\sqrt{k} \\\\
\sqrt{j}\sqrt[-]{i} = \sqrt{k}\sqrt{j} = \sqrt[-]{i}\sqrt{k} \\\\
\sqrt[-]{j}\sqrt[-]{i} = \sqrt[-]{k}\sqrt[-]{j} = \sqrt[-]{i}\sqrt[-]{k}
$$

Which $\sqrt[-]{x}$ stand for $x^{-\frac{1}{2}}$.

These 8 lines don't equal each other (notice that quaternion multiplication is not exchangable, so $\sqrt{i}\sqrt{j} \neq \sqrt{j}\sqrt{i}$).
In fact, in additonal form, they are values of all the permutations among *0.5&pm;0.5i&pm;0.5j&pm;0.5k*.

And these:

$$
\sqrt{i}j = \sqrt[-]{i}k = j\sqrt[-]{i} = k\sqrt[]{i} \\\\
\sqrt[-]{i}j = \sqrt[]{i}k = j\sqrt[]{i} = k\sqrt[-]{i} \\\\
\sqrt{j}k = \sqrt[-]{j}i = k\sqrt[-]{j} = i\sqrt[]{j} \\\\
\sqrt[-]{j}k = \sqrt[]{j}i = k\sqrt[]{j} = i\sqrt[-]{j} \\\\
\sqrt{k}i = \sqrt[-]{k}j = i\sqrt[-]{k} = j\sqrt[]{k} \\\\
\sqrt[-]{k}i = \sqrt[]{k}j = i\sqrt[]{k} = j\sqrt[-]{k}
$$

These 6 lines, plus basic $&pm;\sqrt{i}$, $&pm;\sqrt{j}$, $&pm;\sqrt{k}$, these 12 items are values of all reposition permutations of $(\frac{\sqrt{2}}{2}, &pm;\frac{\sqrt{2}}{2}, 0, 0)$ multipy by $(1, i, j, k)^{T}$,
which $\frac{\sqrt{2}}{2}$ should be prior than $&pm;\frac{\sqrt{2}}{2}$ to satisfy space half-reduction.
Because these items' order number is $\frac{1}{2}$ or $\frac{3}{2}$, we call them *odds* items, correspondingly, items with order number 0 or 1, called *even* items.

## Elements and group

Enumerated all possible combinations, we have all 24 individual elements of group. In additional form, they can be listed as:

|   |   |   |
|---|---|---|
|1, 0, 0, 0| 4 items | *even* |
|$\frac{\sqrt{2}}{2}$, $&pm;\frac{\sqrt{2}}{2}$, 0, 0| 12 items | *odds* |
|0.5, &pm;0.5, &pm;0.5, &pm;0.5| 8 items | *even* |

Which 0s' position in tuples are arbitrary.

<div class="fixed-ratio" style="width: 100%; padding-top: 67%">
	<iframe src="/klstudio/embed.html#/documents/mesh-viewer-demo:quarter-categories"></iframe>
</div>


[1]: https://github.com/hkociemba/RubiksCube-TwophaseSolver
