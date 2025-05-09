
# Ajtai's Hash Functions and Commitment Schemes
Ajtai's work in the mid-1990s introduced a family of hash functions {cite:p}`Ajt96` that are provably collision-resistant, assuming the hardness of certain worst-case lattice problems. These functions are fundamental to many lattice-based cryptographic constructions, including commitment schemes.

## Overview

The core idea is to use a randomly chosen matrix $A \\in \\mathbb{Z}_q^{n \\times m}$ (where $q$ is a prime modulus, and $m > n \log q$) as the public key or description of the hash function.

The function $h_A: \\{0,1\\}^m \\to \\mathbb{Z}_q^n$ is defined as:
$$ h_A(x) = Ax \pmod q $$
where $x$ is a binary vector of length $m$.

**Properties:**

*   **Collision Resistance:** Finding two distinct inputs $x_1, x_2$ such that $h_A(x_1) = h_A(x_2)$ (i.e., $A(x_1 - x_2) = 0 \pmod q$) is as hard as solving the Short Integer Solution (SIS) problem on average. The SIS problem, in turn, is related to worst-case lattice problems like approximating the Shortest Vector Problem (SVP) or the Shortest Independent Vectors Problem (SIVP) within certain factors.
*   **Efficiency:** The function is very efficient to compute, involving a matrix-vector multiplication over $\mathbb{Z}_q$.
*   **Shrinking:** The output space ($\mathbb{Z}_q^n$) is smaller than the input space ($\\{0,1\\}^m$), which is a necessary property for a hash function.

## Commitment Scheme from Ajtai's Hash Functions

Ajtai's hash functions can be directly used to build statistically hiding and computationally binding commitment schemes.

**Scheme:**

1.  **Setup:**
    *   Choose a prime $q$.
    *   Choose dimensions $n, m$ such that $m > n \log q$.
    *   Generate a random matrix $A \in \mathbb{Z}_q^{n \times m}$ as the public parameter.

2.  **Commit:** To commit to a bit $b \in \\{0,1\\}$:
    *   If $b=0$: Choose a random short vector $r \in \\{0,1\\}^m$ (e.g., with Hamming weight $k \ll m$). The commitment is $c = Ar \pmod q$.
    *   If $b=1$: Choose a random vector $s \in \mathbb{Z}_q^n$. The commitment is $c = s$.
    *(A more common way to commit to a message $M$ is to choose a random short vector $r$ and compute $c = Ar + M' \pmod q$, where $M'$ is an encoding of $M$. For simplicity, we'll stick to the bit commitment idea for illustration.)*

    A more standard approach for committing to a message $x \in \{0,1\}^k$ (where $k$ is the message length) is:
    *   Choose a random "blinding" vector $r \in \{0,1\}^m$ with a small Hamming weight.
    *   The commitment is $c = A \begin{pmatrix} x \\ r' \end{pmatrix} \pmod q$, where $r'$ is a portion of $r$ or $r$ is structured appropriately to hide $x$.
    Alternatively, and more directly related to the hash function:
    *   To commit to a short vector $x \in \{-1, 0, 1\}^m$ (or a vector with small integer entries):
        *   The commitment is $c = Ax \pmod q$.

3.  **Open:** To open the commitment, the committer reveals $x$ (and $r$ if used for blinding). The verifier checks if $x$ is short (has small coefficients) and if $c = Ax \pmod q$.

**Properties:**

*   **Statistically Hiding:** If $x$ is chosen from a distribution of short vectors (e.g., uniform over $\\{-1,0,1\\}^m$), the distribution of $Ax \pmod q$ is statistically close to uniform over $\mathbb{Z}_q^n$. This means the commitment $c$ reveals statistically negligible information about $x$. This relies on the Leftover Hash Lemma properties of $A$ when applied to short inputs.
*   **Computationally Binding:** It is computationally hard to find $x_1 \neq x_2$ (both short) such that $Ax_1 = Ax_2 \pmod q$. This is because finding such a pair $(x_1, x_2)$ would mean finding a short non-zero vector $x' = x_1 - x_2$ such that $Ax' = 0 \pmod q$. This is an instance of the SIS problem, which is believed to be hard. If an adversary could open a commitment to two different values, they would break the SIS assumption.

## Significance

Ajtai's constructions were groundbreaking because they provided the first cryptographic primitives whose security could be based on the *worst-case* hardness of lattice problems. This is a stronger type of security guarantee than relying on average-case hardness or specific number-theoretic assumptions.

These commitment schemes are a building block for more complex lattice-based cryptographic protocols, including:
*   Zero-knowledge proofs
*   Digital signatures (e.g., via the Fiat-Shamir heuristic)
*   More advanced homomorphic commitment schemes, as seen in constructions like Neo {cite:p}`Neo`.

The efficiency and provable security of Ajtai's hash functions and commitment schemes have made them a cornerstone of modern lattice-based cryptography.
