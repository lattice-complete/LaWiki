---
author:
  - name: Yingfei Yan
    affiliation:
    email: yingfeiyan1996@gmail.com 
---

# Greyhound

```{contents}
:local:
:depth: 2
```

**Greyhound**  {cite:p}`Greyhound` is a lattice-based polynomial commitment scheme (PCS). For a polynomial of degree $N$, the size of an evaluation proof is $poly\log(N)$, and the verification time for the proof is $O(\sqrt{N})$.

The main purpose of this article is to help readers understand the methodology of the Greyhound polynomial commitment, the construction of its evaluation proof, and how to use Greyhound to prove the evaluation of a polynomial over $\mathbb{F}_q$.

## 1. Notations and Background

### 1.1 Notations
Before introducing the concepts of Greyhound, let's introduce some notations.

Let $d$ be a power of two, and let $\mathcal{R} = \mathbb{Z}[X]/(X^d + 1)$ be the ring of integers of the $2d$-th cyclotomic field. For an odd prime $q$, we define the ring $\mathcal{R}_q = \mathbb{Z}_q[X]/(X^d + 1)$. Let $\delta = \lfloor \log q \rfloor$. To avoid ambiguity, we will consistently use "vector" to denote a column vector of polynomials over $\mathcal{R}$ or $\mathcal{R}_q$.

For an integer $n \geq 1$, we define a gadget matrix for composing integer values from binary representations: $\mathbf{G}_n = \mathbf{I} \otimes [1 ~2~ 4~ \cdots~ 2^{\delta-1}] \in \mathcal{R}_q^{n \times n\delta}$. Correspondingly, its inverse transformation, the binary decomposition is denoted by the symbol $\mathbf{G}_n^{-1} : \mathcal{R}_q^n \to \mathcal{R}_q^{\delta n}$.

For a vector $\mathbf{t} \in \mathcal{R}_q^n$, the symbol $\mathbf{G}_n^{-1}(\mathbf{t})$ represents the process of decomposing all coefficients of $\mathbf{t}$ into their binary representations and then packing them into a new vector.
The operations $\mathbf{G}_n$ and $\mathbf{G}_n^{-1}$ are inverses of each other, satisfying $\mathbf{G}_n \mathbf{G}_n^{-1}(\mathbf{t}) = \mathbf{t}$.

```{admonition} Example: Binary Decomposition
:class: tip

For example, let $\mathcal{R}_{10} = \mathbb{Z}_{10} [X]/(X^3+1)$, and $\mathbf{t} = (t_1, t_2) = (6+2X+5X^2, 4+9X+2X^2) \in \mathcal{R}_{10}^2$. Define $\delta = \lceil \log 10 \rceil = 4$.

Then, $\mathbf{G}_3^{-1}(\mathbf{t})$ is obtained by first writing all coefficients $(6,2,5)$ and $(4,9,2)$ in binary form $(0110~0010 ~0101~ 0100~ 1001~ 0010)$, and then packing them into a vector over $\mathcal{R}_q$ (3 bits as a group), resulting in:

$$\mathbf{G}_3^{-1}(\mathbf{t}) = \hat{\mathbf{t}} = (0+X+X^2, 0+0X+0X^2, 1+0X+0X^2, 1+0X+1X^2, 0+X+0X^2, 0+X+0X^2, 0+X+0X^2, 0+X+0X^2) \in \mathcal{R}^{2 \delta}$$

Correspondingly, the matrix:

$$\mathbf{G}_3 = \begin{bmatrix} [1 & 2  & 2^3 & 2^4] & 0 &&&&&&\cdots&0\\ 0 & & \cdots &0 & [1 & 2  & 2^3 & 2^4] &0 && \cdots & 0\\ 0 & &\cdots & & & &  &0 & [1 & 2  & 2^3 & 2^4] \end{bmatrix}$$

represents the inverse operation, such that $\mathbf{G}_2 \hat{\mathbf{t}} = \mathbf{t} = (6+2X+5X^2, 4+9X+2X^2) \in \mathcal{R}_{10}^2$.
```

### 1.2 Ajtai Commitment

Next, we introduce the Short Integer Solution (SIS) problem and the Ajtai commitment scheme. For a comprehensive treatment of the Ajtai commitment scheme, see {doc}`ajtai`.

```{admonition} Short Integer Solution (SIS) Problem
:class: important

Given a public matrix $\mathbf{A} \in \mathcal{R}_q^{n \times m}$, find a non-zero short vector $\mathbf{z} \in \mathcal{R}^m$ such that $\mathbf{A}\mathbf{z}=\mathbf{0}$ and $\|\mathbf{z}\| \leq B$.

For more details on the SIS problem, see {doc}`../Math&Assumption/sis`.
```

For a binary message, which is packed into a vector $\mathbf{m} \in \mathcal{R}^m$ via its coefficients, the Ajtai commitment process is as follows:
- **KeyGen**: Given the security parameter $\lambda$, generate a commitment key $\mathbf{A} \in \mathcal{R}_q^{n\times m}$.
- **Com**: Given the commitment key $\mathbf{A} \in \mathcal{R}_q^{n\times m}$ and a binary message $\mathbf{m} \in \mathcal{R}^m$, compute the commitment $\mathbf{t} = \mathbf{Am}$.

There are three key points to discuss regarding the Ajtai commitment: 1. The security of the commitment, 2. The norm of the committed message, and 3. The compression property of the commitment.

1.  The **binding** property of the commitment is based on the SIS problem. If a malicious attacker wants to open a commitment $\mathbf{t}$ to a different message $\mathbf{m}'$ such that $\mathbf{t} = \mathbf{Am}'$, this is equivalent to finding a solution $\mathbf{m-m'}$ to the SIS problem, satisfying $\mathbf{A(m-m')}=\mathbf{0}$ with $\|\mathbf{m-m'}\|_\infty \leq 1$.

2.  Note that we can find a solution to the SIS problem satisfying $\|\mathbf{m-m'}\|_\infty \leq 1$ because we require the committed messages to be binary. This requirement constrains the (infinity) norm of $\mathbf{m}$ to be small. In other scenarios, if $\mathbf{m}$'s norm is bounded by some value $B$, the binding property would be reduced to finding a solution with a bound of $2B$: $\|\mathbf{m-m'}\|_\infty \leq 2B$.

3.  The **compression** property of the commitment is evident in that the commitment value $\mathbf{t} \in \mathcal{R}_q^n$ is an $n$-dimensional vector over $\mathcal{R}_q$, independent of the message length (an $m$-dimensional vector over $\mathcal{R}_q$). Under the security assumptions of the SIS problem, the length of the commitment $n$ is less than $m$.


## 2. Greyhound's Commitment Scheme

The Greyhound commitment can be understood as a two-layer (inner and outer) Ajtai commitment.

Suppose we want to commit to a set of $r$ arbitrary vectors $\mathbf{f}_1, \dots, \mathbf{f}_r \in \mathcal{R}_q^m$. Note that each $\mathbf{f}_i$ is an $m$-dimensional vector over $\mathcal{R}_q$, where each component is an element of $\mathcal{R}_q$.

```{admonition} Commitment Key Structure
:class: info

The commitment key consists of:
- **Inner public matrix**: $\mathbf{A}\in \mathcal{R}_q^{n\times m\delta}$
- **Outer public matrix**: $\mathbf{B} \in \mathcal{R}_q^{n \times r n \delta}$
```

-   **Inner Commitment**: As mentioned in the previous section, the message for an Ajtai commitment is a binary string. Therefore, to commit to $\mathbf{f}_1, \dots, \mathbf{f}_r$ using Ajtai, we first need to convert these vectors into binary vectors $\mathbf{s}_i \in \mathcal{R}_q^{m \delta}$ using the gadget matrix $\mathbf{G}^{-1}$, i.e., $\mathbf{s}_i = \mathbf{G}_m^{-1}(\mathbf{f}_i)$. Now, we can perform an Ajtai commitment on the message $\mathbf{s}_i$:
$$\mathbf{t}_i := \mathbf{As}_i = \mathbf{AG}^{-1}_m(\mathbf{f}_i)$$
    This gives us $r$ commitment vectors $\mathbf{t}_1, ..., \mathbf{t}_r \in \mathcal{R}_q^n$ for the messages $\mathbf{f}_1, ...,\mathbf{f}_r$.

-   **Outer Commitment**: After the inner commitment, we have $r$ vectors $\mathbf{t}_1, ..., \mathbf{t}_r \in \mathcal{R}_q^n$. The size of the current commitment is sub-linear in the message size ($r$ vectors of length $m$), i.e., $\mathcal{O}(rn)$. To achieve a more compressed commitment value, i.e., $\mathcal{O}(1)$, we want to perform another Ajtai commitment on the inner commitment values $\mathbf{t}_1, ..., \mathbf{t}_r$. This can be done by treating $\mathbf{t}_1, ..., \mathbf{t}_r$ as the new messages and repeating the process. First, we use $\mathbf{G}^{-1}$ to convert $\mathbf{t}_1, ..., \mathbf{t}_r$ into binary coefficient vectors $\hat{\mathbf{t}}_i = \mathbf{G}_n^{-1}(\mathbf{t}_i)$, and then compute the outer commitment:
$$\mathbf{u} := \mathbf{B}\begin{bmatrix} \hat{\mathbf{t}}_1 \\ \vdots \\ \hat{\mathbf{t}}_r \end{bmatrix} \in \mathcal{R}_q^n$$
    Finally, the commitment to vectors $\mathbf{f}_1, \dots, \mathbf{f}_r \in \mathcal{R}_q^m$ is the single vector $\mathbf{u} \in \mathcal{R}_q^n$.


## 3. Polynomial Evaluation

In the previous section, we discussed how to commit to a set of vectors $\mathbf{f}_1, \dots, \mathbf{f}_r \in \mathcal{R}_q^m$. However, our goal is to construct a PCS, so we need to discuss the relationship between this set of vectors and the polynomial $f(\mathsf{X}) = \sum_{i=0}^{N-1} f_i \mathsf{X}^i \in \mathcal{R}_q[\mathsf{X}]$ that we want to do evaluation at some point (for example, a point $x \in \mathcal{R}_q$).

It is important to note that here $\mathsf{X}$ is the variant of the polynomial $f$, and it is not related to the $X$ in $\mathcal{R} = \mathbb{Z}[X]/(X^d + 1)$.

Assume $N=m \cdot r$. We want to prove that the polynomial $f$ evaluated at a point $x \in \mathcal{R}_q$ is $y$, i.e., $f(x) = \sum_{i=0}^{N-1} f_i x^i = y$.

Similar to Mercury (Breakdown), we can represent the evaluation process using matrix and vector multiplication:
$$f(x) = [1~x~x^2~\cdots~x^{m-1}] \begin{bmatrix} f_0 & f_m & \cdots & f_{(r-1)m} \\ f_{1} & f_{m+1} &\cdots & f_{(r-1)m+1} \\ f_{2} & f_{m+2} &\cdots & f_{(r-1)m+2} \\ \vdots & \vdots & \ddots & \vdots \\ f_{m-1} & f_{2m-1} &\cdots & f_{N-1} \end{bmatrix} \begin{bmatrix} 1 \\ x^m \\ (x^m)^2\\ \vdots \\ (x^m)^{r-1} \end{bmatrix}$$

 Therefore, if we define vectors $\mathbf{f}_i = [ f_{(i-1)m}, f_{(i-1)m+1}, \dots , f_{im-1}]^\top \in \mathcal{R}_q^m$ for $i=1, \dots, r$, which are formed by the coefficients of the polynomial $f$, then the commitment to $\mathbf{f}_1, \dots, \mathbf{f}_r \in \mathcal{R}_q^m$ is a commitment to the polynomial $f$.

Now, let's define the vectors $\mathbf{a}(x)^\top = [1~x~x^2~\cdots~x^{m-1}]$ and $\mathbf{b}(x^m)^\top = \begin{bmatrix} 1 ~ x^m ~\dots ~ (x^m)^{r-1} \end{bmatrix}$. The evaluation of polynomial $f$ can be expressed as:
$$f(x) = \mathbf{a}(x)^\top [\mathbf{f}_1 ~ \cdots ~\mathbf{f}_r] \mathbf{b}(x^m)$$
 This is a quadratic relation over $\mathbf{a}(x)$ and $\mathbf{b}(x^m)$.  
## 4. Proof of Polynomial Evaluation

The proof of a polynomial evaluation consists of two parts: 1. The commitment is well-formed; 2. The polynomial evaluation was computed correctly.

1.  First, a prover needs to commit to the polynomial $f$ as described in Section 2. Proving the correctness of the commitment calculation means proving:
$$\begin{align*} 
\mathbf{s}_i &= \mathbf{G}^{-1}_m(\mathbf{f}_i), \\ 
\mathbf{t}_i &= \mathbf{As}_i, \\ 
\mathbf{u} &= \mathbf{B}\begin{bmatrix} \hat{\mathbf{t}}_1 \\ \vdots \\ \hat{\mathbf{t}}_r \end{bmatrix}, \text{where } \hat{\mathbf{t}}_i = \mathbf{G}_n^{-1}(\mathbf{t}_i)
\end{align*}$$
    Since the transform $\mathbf{G}$ is 'invertible', the first equation can also be written as $\mathbf{f}_i = \mathbf{G}_m \mathbf{s}_i$. 
    Then the second equation implies $\mathbf{G}_n(\hat{\mathbf{t}}_i) = \mathbf{As}_i$.

2.  Proving the correctness of the polynomial evaluation means proving:
$$y = \mathbf{a}(x)^\top [\mathbf{f}_1 ~ \cdots ~\mathbf{f}_r] \mathbf{b}(x^m)$$

Greyhound's approach is, let the prover compute the parts directly related to the polynomial coefficients $\mathbf{f}_i$, and let the verifier compute the rest. 
Let's first present the protocol and then discuss the reasoning behind it.

Assume the public parameters of the protocol are the commitment keys $\mathbf{A, B}$, the commitment $\mathbf{u}$, the evaluation point $x$, and the claimed value $y$. The entire protocol consists of a 2-round interaction:

1.  The prover computes the first part of the evaluation, sending $\mathbf{w}$ to the verifier:
$$\mathbf{w}^\top := \mathbf{a}(x)^\top[\mathbf{f}_1 ~ \cdots ~\mathbf{f}_r]$$

2.  The verifier selects a random challenge vector $\mathbf{c} = (c_1, \dots, c_r)^\top \in \mathcal{R}_q^r$ and sends it to the prover.

3.  The prover sends the intermediate commitment values $(\hat{\mathbf{t}}_1, \dots, \hat{\mathbf{t}}_r)$ and uses $\mathbf{c}$ to compute a linear combination of the $\mathbf{s}_i$: $\mathbf{z} := \sum_{i=1}^r \mathbf{s}_i c_i = [\mathbf{s}_1 ~ \cdots~ \mathbf{s}_r] \mathbf{c} \in \mathcal{R}_q^{m\delta}$.

Finally, the verifier uses all the information sent by the prover, $\mathbf{w}, \hat{\mathbf{t}}_i, \mathbf{z}$, to check if the following equations hold:

$$\begin{align}
\mathbf{w}^\top \mathbf{b}(x^m) &= y, \\
\mathbf{w}^\top \mathbf{c} &= \mathbf{a}(x)^\top \mathbf{G}_m \mathbf{z},\\
\mathbf{Az} & = c_1\mathbf{G}_n \hat{\mathbf{t}}_1 + \cdots + c_r \mathbf{G}_n \hat{\mathbf{t}}_r,\\
\mathbf{u} &= \mathbf{B}\begin{bmatrix} \hat{\mathbf{t}}_1 \\ \vdots \\ \hat{\mathbf{t}}_r \end{bmatrix}
\end{align}$$

The first equation essentially verifies the second half of the polynomial evaluation. If $\mathbf{w}$ is correct (which is guaranteed by the second equation), then:

$$f(x) = \mathbf{a}(x)^\top[\mathbf{f}_1 ~ \cdots ~\mathbf{f}_r] \mathbf{b}(x^m) = \mathbf{w}^\top \mathbf{b}(x^m) = y$$

The second equation, with the participation of the challenge vector $\mathbf{c}$, verifies the correctness of the first half of the evaluation:

$$\begin{align*} 
\mathbf{w}^\top \mathbf{c} &= \mathbf{a}(x)^\top [\mathbf{f}_1 ~ \cdots ~\mathbf{f}_r] \mathbf{c} \\ 
& = \mathbf{a}(x)^\top [\mathbf{G}_m\mathbf{s}_1~ \cdots ~\mathbf{G}_m\mathbf{s}_r] \mathbf{c} \\
& = \mathbf{a}(x)^\top \mathbf{G}_m \sum_{i=1}^r \mathbf{s}_i c_i \\
& = \mathbf{a}(x)^\top \mathbf{G}_m \mathbf{z}
\end{align*}$$

The third equation verifies the correctness of the inner commitment:

$$\begin{align*} 
\mathbf{Az} & = \mathbf{A} \sum_{i=1}^r \mathbf{s}_i c_i = \sum_{i=1}^r c_i (\mathbf{A s}_i) \\ 
&= \sum_{i=1}^r c_i \mathbf{t}_i = \sum_{i=1}^r c_i\mathbf{G}_n(\hat{\mathbf{t}}_i)
\end{align*}$$

The fourth equation verifies the outer commitment.

```{note}
This proof can be further optimized in terms of proof size using the recursive proof system from Labrador by rewriting the equations into the standard form required by Labrador. Refer to the Greyhound paper for specific details.
```

## 5. Proving Evaluations of Polynomials over $\mathbb{F}_q$ using $\mathcal{R}_q$

```{important}
In the previous discussion, we overlooked an issue: all operations and proofs in Greyhound are performed over $\mathcal{R}_q$, whereas most practical applications use polynomials over $\mathbb{F}_q$. 

This section discusses how to equivalently represent a polynomial over $\mathbb{F}_q$ as a polynomial over $\mathcal{R}_q$ to use the proof methods from the preceding sections. Note that this is not the contribution of Greyhound; we include it here to provide a more complete understanding of the underlying methodology.
```

The transformation from $\mathbb{F}_q$ to $\mathcal{R}_q$ is packing vectors over $\mathbb{F}_q$ into elements of $\mathcal{R}_q$ via coefficient embedding, and then performing operations over $\mathbb{F}_q$ using operations over $\mathcal{R}_q$.

Define an automorphism $\sigma: \mathcal{R}_q \to \mathcal{R}_q$ that maps an element of $\mathcal{R}_q$ to its negative powers, $\sigma(X) = X^{-1}$. 
For example, for $a = a_0 + \sum_{i=1}^{d-1} a_i X^i \in \mathcal{R}_q$, we have $\sigma(a) = a_0 +\sum_{i=1}^{d-1} a_i X^{-i} \in \mathcal{R}_q$.
In $\mathcal{R}_q$, the constant term of $a \cdot \sigma(a)$ is $a_0 a_0 + \sum_{i=1}^{d-1} a_i a_i = \sum_{i=0}^{d-1} a_i a_i$. 
More generally, the constant term of $a \cdot \sigma(b)$ is $\sum a_i b_i$.

Let's clarify the following notations: a polynomial over $\mathbb{F}_q$ is denoted by $F(U) = \sum_{i=0}^{N'-1} F_i U^i = V \in \mathbb{F}_q$. 
A polynomial over $\mathcal{R}_q$ is denoted by $f(x) = \sum_{i=0}^{N-1} f_i x^i = y \in \mathcal{R}_q$. 
We use $f$ to represent the polynomial $F$ after being packed into $\mathcal{R}_q$. 
To distinguish them, we use $N-1$ for the degree of $f$ and $N'-1$ for the degree of $F$. 
After coefficient packing, $N$ and $N'$ are not equal.

-   **Case 1: $N' \leq d$**. Without loss of generality, we can assume $N'=d$ by padding $F$ with zero coefficients. In this case, all coefficients of $F$ can be stored in a single element of $\mathcal{R}_q$, so we have a "polynomial" $f$ of degree $N-1=0$.

    We define the evaluation of the packed polynomial as $y = f_0 \cdot \sigma(x)$. Here, $f_0 = \sum_{i=0}^{d-1} F_i X^i \in \mathcal{R}_q$ is obtained by packing all coefficients of $F$. The evaluation "point" $x$ is formed by packing the powers of the original evaluation point $U$, i.e., $x = \sum_{i=0}^{d-1} U^i X^i \in \mathcal{R}_q$. And $\sigma(x) = 1+ \sum_{i=1}^{d-1} U^i X^{-i} \in \mathcal{R}_q$ is the automorphism of $x$.
    
    Then, using the property of the $\sigma$ map discussed earlier, the constant term of the product $f_0 \cdot \sigma(x)$ is precisely:
    
    $$\text{const}(f_0 \cdot \sigma(x)) = \sum_{i=0}^{d-1} F_i U^{i} = V$$
    
    This means a Greyhound verifier can check if $F(U) = V$ holds by checking if the constant term of the $\mathcal{R}_q$-evaluation $y$ is equal to $V$.

-   **Case 2: $N' > d$**. Let's assume $N' = k \cdot d$ for some integer $k$. The coefficients of $F$, $(F_0, \dots, F_{N'-1})$, will be packed into $k$ elements of $\mathcal{R}_q$, $f_0, f_1, \dots, f_{k-1} \in \mathcal{R}_q$. Let's say $N=k$. The evaluation method for the polynomial $f(x)$ is similar to the case when $N' < d$.

    We pack the coefficients of $F$ into $(f_0, f_1, \dots, f_{N-1})$ and the powers of $U$ into evaluation points $(x_0, x_1, \dots, x_{N-1})$ as follows:
    $$f_i = \sum_{j=0}^{d-1} F_{id+j}X^j \quad \text{and} \quad x_i = \sum_{j=0}^{d-1} (U^{id+j}) X^j$$
    Then we define the evaluation in $\mathcal{R}_q$ as the sum of products:
    $$y = \sum_{i=0}^{N-1} f_i \cdot \sigma(x_i)$$
    The multiplication $f_i \cdot \sigma(x_i)$ will store the partial sum $\sum_{j=0}^{d-1} F_{id+j}U^{id+j}$ in its constant term, similar to the previous discussion.
    Since addition in $\mathcal{R}_q$ is coefficient-wise, the outer summation $\sum_{i=0}^{N-1} f_i \cdot \sigma(x_i)$ will sum up the constant terms. The constant term of the final result $y$ will be:
    $$\text{const}(y) = \sum_{i=0}^{N-1} \text{const}(f_i \cdot \sigma(x_i)) = \sum_{i=0}^{N-1} \sum_{j=0}^{d-1} F_{id+j}U^{id+j} = \sum_{k=0}^{N'-1} F_k U^k = V$$

Now, we can use Greyhound to commit to any polynomial over $\mathbb{F}_q$ and prove its evaluations. 

## 6. Conclusion
Greyhound is a polynomial commitment scheme based on lattice assumptions, featuring a transparent setup and sublinear verification time. 
It applies the inner and outer Ajtai commitment technique (as in Labrador) to achieve an O(1) polynomial commitment. 
The authors proposes a method of using quadratic relations to prove polynomial evaluations, which achieves sublinear verification complexity. 

Furthermore, by applying Labrador's recursive proof techniques, the proof size can be further reduced, resulting in a final proof size of approximately 50KB. Compared to hash-based PCS, Greyhound demonstrates a significant advantage in commitment generation time, as can be seen in the table below.

```{list-table} Performance Comparison of Polynomial Commitment Schemes
:header-rows: 2
:widths: 15 10 10 10 10 10 10 10 10 10

* - Scheme
  - N = 2²⁶
  - 
  - 
  - N = 2²⁸
  - 
  - 
  - N = 2³⁰
  - 
  - 
* - 
  - Commit
  - Prove
  - Verify
  - Commit
  - Prove
  - Verify
  - Commit
  - Prove
  - Verify
* - Brakedown
  - 36
  - 3.21
  - 0.703
  - 150
  - 13
  - 2.56
  - 605
  - 48.6
  - 2.96
* - Ligero
  - 39.9
  - 3.11
  - 0.196
  - 169
  - 12.4
  - 0.402
  - 717
  - 50
  - 0.846
* - FRI
  - 168
  - 185
  - 0.041
  - –
  - –
  - –
  - –
  - –
  - –
* - Greyhound
  - 4.37
  - 2.03
  - 0.492
  - 21.2
  - 8.21
  - 1.15
  - 132
  - 41.2
  - 2.80
```

```{note}
Time measurements are in seconds. The table shows performance metrics for different polynomial degrees $N$.
```
