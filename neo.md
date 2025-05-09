# Neo: Lattice-Based Folding Scheme for CCS

:::{admonition} Abstract
:class: note
Neo {cite:p}`Neo` is a recent lattice-based folding scheme for the CCS relation (an NP-complete constraint system generalizing R1CS and AIR).  Its core innovation is a **matrix commitment scheme** based on  @ajtai {cite:p}`Ajt96`, which is both linearly homomorphic and “pay-per-bit” (the cost scales with the binary size of the message).  Neo's **folding scheme** can be viewed as adapting the folding scheme in HyperNova {cite:p}`HyperNova` to the lattice setting.
:::

In Neo, a vector of field elements $z\in\mathbb{F}^m$ is first decomposed into a matrix of small coefficients, then committed via a random matrix.  These homomorphic commitments allow the prover to fold many constraint-checks into one, using a single sum-check invocation over a small prime-field extension.  The following explains the commitment scheme and how it enables the folding (sum-check) protocol.

### Lattice-Based Matrix Commitment Scheme
Neo's commitment scheme builds on @ajtai ** {cite:p}`Ajt96`.  In Ajtai's scheme, the $\mathrm{Setup}$ samples a random matrix $M$ over a cyclotomic ring $R_q$, and $\mathrm{Commit}(pp,z)$ outputs $c = M z$ for a low-norm ring-vector $z$.

Neo adapts this to commit field vectors by embedding each scalar into a ring polynomial.

Concretely, fix a small prime field $\mathbb{F}_q$ and a base $b$ such that every field element fits in $d$ digits ($b^d > q$).  We define a decomposition map $\text{Decomp}_b:\mathbb{F}_q^m\to \mathbb{F}^{d\times m}$ as below.


:::{admonition} Decomposition and splitting
:class: note
Let $b,m \in \mathbb{N}$. We define $\text{Decomp}_b : \mathbb{F}^m \to \mathbb{F}^{d \times m}$ as the map which takes a vector $z$ and performs the b-ary decomposition into a matrix $Z := \text{Decomp}_b(z) \in \mathbb{F}^{d \times m}$. For example, if $z \in \mathbb{F}^m$ such that $\|z\|_\infty < b^d$, then we have
$$
\text{Decomp}_b(z) := \begin{bmatrix} Z^{(1)} \\ Z^{(2)} \\ \vdots \\ Z^{(d)} \end{bmatrix} \quad \text{such that } z = \sum_{i=1}^d b^{i-1} \cdot Z^{(i)} \text{ and } \|Z^{(i)}\|_\infty < b
$$
where $Z^{(i)}$ is the i-th row of $Z$.

We define $\text{split}_b : \mathbb{F}^{d \times m} \to (\mathbb{F}^{d \times m})^*$ to be the b-ary decomposition map, which performs the b-ary decomposition of a matrix $Z \in \mathbb{F}^{d \times m}$ into matrices $Z_1, Z_2, \dots, Z_k$. For example, if $Z \in \mathbb{F}^{d \times m}$ such that $\|Z\|_\infty < b^k$, then we have
$$
\text{split}_b(Z) := (Z_1, Z_2, \dots, Z_k) \quad \text{such that } Z = \sum_{i=1}^k b^{i-1} \cdot Z_i \text{ and } \|Z_i\|_\infty < b
$$
:::



The commitment is then:
-   **Setup:** Sample a random matrix $M\in R_q^{\kappa\times (m)}$ and output public parameters $pp=M$.
-   **Commit:** To commit to $Z\in\mathbb{F}^{d\times m}$, convert each column of $Z$ into a ring element $z'_i$ as above, form the ring-vector $z'=(z'_1,\dots,z'_m)$, and output
    $$
    c = M ,z';\in R_q^\kappa.
    $$
Since each $z'_i$ has “low norm” (its coefficients are small), this binding commitment is secure under LWE/MISIS assumptions.

This scheme is formally an $S$-module homomorphic matrix commitment. In particular, if $\rho_1,\rho_2$ are rotation matrices (elements of the commutative ring $S$) and $Z_1,Z_2$ are two message matrices, the commitments satisfy
$$\rho_1,\text{Commit}(Z_1) + \rho_2,\text{Commit}(Z_2) = \text{Commit}(,\rho_1 Z_1 + \rho_2 Z_2,)$$
￼. Intuitively, matrix multiplication in the ring distributes over addition.  Equivalently, the commit map $\text{Commit}(Z)=M,\mathrm{cf}^{-1}(Z)$ is linear over this ring.  We will use this to combine commitments in the folding protocol.

### Homomorphism and Pay-Per-Bit Properties

The commitment is linearly homomorphic, meaning you can add or scale commitments and it corresponds to adding or scaling the underlying vectors. For example, if $z_1,z_2\in\mathbb{F}_q^m$ and $c_i=\mathrm{Commit}(Z_i)$ are their commitments, then for any scalars $\alpha,\beta\in\mathbb{F}_q$ we have
$$\alpha,c_1 + \beta,c_2 = \mathrm{Commit}(,\alpha Z_1 + \beta Z_2,),. $$
In plain terms, $\mathrm{Commit}(z_1)+\mathrm{Commit}(z_2)=\mathrm{Commit}(z_1+z_2)$, etc.  As a concrete toy example in $\mathbb{F}_7^2$: let $z_1=[5,3]$ and $z_2=[2,4]$. Then $z_1+z_2=[7,7]\equiv [0,0]\pmod 7$.  Homomorphism guarantees
$$\mathrm{Commit}(z_1)+\mathrm{Commit}(z_2) = \mathrm{Commit}([0,0]).$$
The same combination holds after embedding into matrices and ring elements. This linearity is crucial for folding many constraints into one check.

Another key feature is pay-per-bit cost. The cost of computing $c=Mz'$ scales roughly with the number of nonzero bits in $z'$, i.e. the bit-size of $z$.  In effect, committing small integers is much cheaper than committing large ones.  As the paper notes, “committing to a vector of bits is $32\times$ cheaper than committing to a vector of 32-bit values”.  Intuitively, a ring multiplication $a\cdot b$ only “pays” for the nonzero coefficients of $b$.  For example, consider $z=[1,1]\in\mathbb{F}_7^2$ versus $z=[5,3]$ (which have 1-bit vs 3-bit entries).  The decomp matrix for $[1,1]$ has very few ones, so computing $Mz'$ involves fewer rotations/additions than for $[5,3]$.  This pay-per-bit property can greatly speed up committing sparse or small witnesses.

:::{admonition} Example (small field, base 2)
:class: note

-   Field $\mathbb{F}_7$, base $b=2$, witness $z = [5,3] \in \mathbb{F}_7^2$.
    (This implies $d=3$ digits, as $b^d > q \Rightarrow 2^3 > 7$).
-   Binary expansions (digits $(c_0, c_1, c_2)$ corresponding to $c_0 b^0 + c_1 b^1 + c_2 b^2$):
    -   $5 \Rightarrow (1,0,1)_2$
    -   $3 \Rightarrow (1,1,0)_2$
-   Thus, the decomposed matrix $Z = \text{Decomp}_b(z)$ is:
    $$
    Z = \begin{pmatrix} 1 & 1 \\ 0 & 1 \\ 1 & 0 \end{pmatrix}
    $$
    (Each column lists the digits for an element of $z$: first column for $5$, second for $3$).
-   The corresponding ring elements are $z'_1 = 1 + X^2$ and $z'_2 = 1 + X$.
    (Coefficients are from the columns of $Z$. These are elements of $R_q = \mathbb{F}_7[X]/(X^3-2)$).
-   Pick a random matrix $M \in (R_q)^{2 \times 2}$.
-   Then, the commitment is $\text{Commit}(z) = M \begin{pmatrix} z'_1 \\ z'_2 \end{pmatrix}$.

If we had another vector $z' = [2,4]$, it would be decomposed and committed similarly. Let its commitment be $\text{Commit}(z')$. Then, by homomorphism:
$$
\text{Commit}(z) + \text{Commit}(z') = \text{Commit}(z+z' \pmod 7)
$$
(In this case, $z+z' = [5+2, 3+4] = [7,7] \equiv [0,0] \pmod 7$).
:::

### Folding in the CCS Relation

In the CCS relation, the public instance includes constraint matrices ${M_j}$ and a polynomial $f$, and the prover's witness is a vector $z=[x|w]$ whose entries satisfy $f(M_1 z,\dots,M_t z)=0$.  Using Neo's commitment, the prover first commits to $z$: it computes $Z=\mathrm{Decomp}_b(z)$ and sends $c = \mathrm{Commit}(Z)$, revealing the committed version of the input part $x$ and hiding the private witness $w$. The goal is to prove that the committed $z$ indeed satisfies all constraints $M_j z$ in one folded proof.

Because the commit is homomorphic, we can combine multiple checks into one.  Specifically, Neo follows HyperNova's approach of encoding all constraints into a single polynomial and using a sum-check protocol. The key ideas are:

1.  **Partial Evaluations:** For each constraint matrix $M_j$, the prover computes the multilinear extension evaluation.  Concretely, pick a random challenge $r\in\mathbb{F}_q^{\log n}$.  Using the decomposed $Z$, compute the partial evaluation vectors $y_j = Z,M_j^T,r \in \mathbb{F}_q^d$.  By the decomposition lemma, the weighted sum of these (according to powers of $b$) reconstructs the evaluation $M_j z$ at $r$.  The prover sends $(r,{y_j})$ as evaluation claims along with $c$.
2.  **Polynomial Encoding & Sum-Check:** The prover constructs a multivariate polynomial $Q(X)$ that encodes the constraint $f$ and the evaluations $y_j$.  Roughly, $Q$ is designed so that
    $$
    \sum_{X\in{0,1}^d} Q(X) = f\bigl(M_1 z,\dots,M_t z\bigr),
    $$
    by summing over the hypercube of binary vectors.  The verifier and prover engage in the classic sum-check protocol to check this equality.  The sum-check iteratively checks sums over slices of $Q$, and its final output is a claim that
    $$
    v = Q(r'),
    $$
    at a fresh random point $r'\in\mathbb{F}_q^d$.  Intuitively, this single claim replaces the many original checks. (Neo's innovation is that this sum-check is done over a small prime-field extension, unlike prior lattice schemes over cyclotomic rings.)
3.  **Random Linear Combination:** After sum-check, the prover has a single evaluation claim $v=Q(r')$ and also the original $y_j$ claims (now at point $r'$). These are all linear statements about the committed $Z$.  The prover and verifier then take a random linear combination of all evaluation claims (and of the commitments $c$ themselves).  By Lemma 2 of the paper, this preserves validity: if each individual claim was consistent with some $Z_i$, then a random combination is consistent with $Z = \sum \rho_i Z_i$.  Crucially, the commitment scheme being an $S$-module homomorphism means the combined commitment $c' = \sum \rho_i c_i$ equals $\mathrm{Commit}(Z)$ for the combined witness matrix $Z$.  In other words, many checks on different $Z_i$ are folded into one check on $Z$.
4.  **Final Check (Decomposition):** The result is a single instance of the Matrix Evaluation relation: the prover has one commitment $c'=\mathrm{Commit}(z')$ and one evaluation $v=Q(r')$ to verify.  At this point, the verifier checks that $z'$ is consistent with $c'$ (via the commitment opening) and that $Q(r')=v$.  A final decomposition step ensures that $z'$ has small coefficients (necessary for security) by splitting $z'$ into base-$b$ form, which the prover can do using the split_b map. After this, one obtains a single folded CCS instance which the verifier checks directly.

Putting it all together, Neo's folding protocol uses one sum-check over the hypercube and linear combinations of commitments to collapse many constraint-checks into one. The matrix commitment's linearity makes the combination step simple and secure. In practice, this yields succinct proofs: the prover only pays homomorphic commitment and sum-check costs, and committing bits is especially cheap thanks to the pay-per-bit design. This achieves a lattice-based, post-quantum secure folding scheme for CCS that supports small prime fields (e.g. Goldilocks) and a single sum-check invocation.

:::{admonition} Steps of the folding protocol (high-level)
:class: note

1.  **Commit Witness:** Decompose the full witness $z=[x|w]$ into a low-norm matrix $Z$ and send $c=\mathrm{Commit}(Z)$. Reveal the first columns (input $x$) as needed.
2.  **Evaluate Constraints:** For each constraint matrix $M_j$, pick a random challenge vector $r$ and compute $y_j = Z M_j^T r$.  These $y_j$ encode the multilinear evaluations $M_j z$.
3.  **Build & Sum-Check $Q$:** Form a polynomial $Q(X)$ so that $\sum_{X\in{0,1}^d}Q(X)$ equals the constraint check (typically $f(M_1z,\dots,M_tz)$). Run the interactive sum-check protocol on $Q$. The verifier ends up with a single claim $Q(r')=v$ at random $r'$.
4.  **Combine Claims:** Apply a random linear combination to all evaluation claims and the commitment.  Thanks to homomorphism, the combined commitment $c'=\sum \rho_i c_i$ still opens to the combined witness.  The verifier reduces all checks to verifying one commitment and one evaluation at $r'$.
5.  **Finalize:** Ensure the combined witness $z'$ is decomposed and small enough (by splitting its entries) so that $\mathrm{Commit}(z')$ is binding.  The verifier checks the final opening of $c'$ and that $Q(r')=v$.
:::

Each step leverages the matrix commitment's structure: the homomorphism makes step 4 valid, and pay-per-bit keeps commitment costs low in step 1.  The sum-check step 3 uses standard multilinear sum-check arguments to fold many checks into one.  Altogether, Neo provides a practical folding-friendly protocol: small-field-friendly, post-quantum secure, and efficient when witnesses have low bit-size.
