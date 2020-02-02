---
title: Perpendicular Algebra in 3D Space
tags:
---

## Quaternion space half reduction

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

In the quaternion 4-d space, this function reflect (by centrosymmetric) a half 4-d space to the other side. And right on the reflection interface 3-d subspace, do the same thing, and also for 2-d interface, 1-d interface recursively.

Then we define a shorthand representation

$$q \cong p$$

to stand for:

$$abs_{h}(q) = abs_{h}(p),$$

which means *q = p* or *q = -p*. Like plain equal, this *half-reduction equal* also has transitivity.

Now we have these obvious facts:

$$i^{2} \cong j^{2} \cong k^{2} \cong 1$$

means 360&deg; rotation returns to origin.

$$
i \cong i^{-1} \\\\
j \cong j^{-1} \\\\
k \cong k^{-1}
$$

means &pm;180&deg; rotation arrives the same orientation.

$$
i^{\frac{3}{2}} \cong i^{-\frac{1}{2}} \\\\
j^{\frac{3}{2}} \cong j^{-\frac{1}{2}} \\\\
k^{\frac{3}{2}} \cong k^{-\frac{1}{2}}
$$

means 270&deg; rotation equal -90&deg; rotation.

Not very obvious, but we can get by computaion:

$$
i^{+\frac{1}{2}}j^{+\frac{1}{2}} = j^{+\frac{1}{2}}k^{+\frac{1}{2}} = k^{+\frac{1}{2}}i^{+\frac{1}{2}} \\\\
i^{+\frac{1}{2}}j^{-\frac{1}{2}} = j^{-\frac{1}{2}}k^{-\frac{1}{2}} = k^{-\frac{1}{2}}i^{+\frac{1}{2}} \\\\
i^{-\frac{1}{2}}j^{+\frac{1}{2}} = j^{+\frac{1}{2}}k^{-\frac{1}{2}} = k^{-\frac{1}{2}}i^{+\frac{1}{2}} \\\\
i^{-\frac{1}{2}}j^{-\frac{1}{2}} = j^{-\frac{1}{2}}k^{+\frac{1}{2}} = k^{+\frac{1}{2}}i^{-\frac{1}{2}} \\\\
$$

$$
j^{+\frac{1}{2}}i^{+\frac{1}{2}} = k^{-\frac{1}{2}}j^{+\frac{1}{2}} = i^{+\frac{1}{2}}k^{-\frac{1}{2}} \\\\
j^{-\frac{1}{2}}i^{+\frac{1}{2}} = k^{+\frac{1}{2}}j^{-\frac{1}{2}} = i^{+\frac{1}{2}}k^{+\frac{1}{2}} \\\\
j^{+\frac{1}{2}}i^{-\frac{1}{2}} = k^{+\frac{1}{2}}j^{+\frac{1}{2}} = i^{-\frac{1}{2}}k^{+\frac{1}{2}} \\\\
j^{-\frac{1}{2}}i^{-\frac{1}{2}} = k^{-\frac{1}{2}}j^{-\frac{1}{2}} = i^{-\frac{1}{2}}k^{-\frac{1}{2}}
$$

These 8 lines don't equal each other. In fact they are values of all the permutations among *0.5&pm;0.5i&pm;0.5j&pm;0.5k*.
