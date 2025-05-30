# Lattice-Based Folding Schemes 

This document provides a comprehensive comparison of various lattice-based folding schemes used in cryptographic protocols.

## Overview Table

| Scheme | Year | Security Assumption | Commitment Type | Soundness Error | Communication Complexity | Prover Time | Verifier Time | Key Features |
|--------|------|-------------------|-----------------|-----------------|-------------------------|-------------|---------------|--------------|
| **Latticefold** | 2022 | SIS/LWE | Vector Commitment | 1/q | O(log n) rounds | O(n log n) | O(log² n) | First lattice folding, recursive structure |
| **Lova** | 2022 | SIS/LWE | Polynomial Commitment | 1/q | O(log n) rounds | O(n log n) | O(log n) | Optimized verifier, better concrete efficiency |
| **Latticefold+** | 2023 | SIS/LWE + Ring-SIS | Structured Commitment | 1/q² | O(log n) rounds | O(n) | O(log n) | Improved soundness, ring structure |
| **Neo** | 2023 | Module-SIS/LWE | Module Commitment | 1/q | O(1) rounds | O(n) | O(1) | Constant rounds, module lattices |

## Detailed Comparison

### Security Foundations

| Scheme | Hard Problem | Lattice Type | Dimension | Modulus | Ring Structure |
|--------|-------------|--------------|-----------|---------|----------------|
| **Latticefold** | SIS₍ₙ,ₘ,q,β₎ | Integer Lattice | n = 2ᵏ | Prime q | None |
| **Lova** | SIS₍ₙ,ₘ,q,β₎ + LWE₍ₙ,q,χ₎ | Integer Lattice | n = 2ᵏ | Prime q | None |
| **Latticefold+** | Ring-SIS₍f,q,β₎ | Ring Lattice | deg(f) = 2ᵏ | Prime q | Z[X]/(Xⁿ+1) |
| **Neo** | Module-SIS₍d,n,q,β₎ | Module Lattice | rank d, dim n | Prime q | R^d where R = Z[X]/(Xⁿ+1) |

### Performance Characteristics

| Scheme | Proof Size | Setup Size | CRS Size | Preprocessing | Post-quantum | Practical |
|--------|------------|------------|----------|---------------|--------------|-----------|
| **Latticefold** | O(log n) field elements | O(n) | O(n) | None | ✅ | Limited |
| **Lova** | O(log n) field elements | O(n) | O(n log n) | Minimal | ✅ | Better |
| **Latticefold+** | O(log n) ring elements | O(n) | O(n) | Ring arithmetic | ✅ | Good |
| **Neo** | O(1) module elements | O(n) | O(d·n) | Module arithmetic | ✅ | Excellent |

### Technical Innovations

#### Latticefold (2022)
- **Innovation**: First lattice-based folding scheme
- **Technique**: Recursive halving with lattice commitments
- **Advantages**: Foundational work, logarithmic communication
- **Limitations**: High concrete costs, large constants

#### Lova (2022)
- **Innovation**: Optimized verification and polynomial commitments
- **Technique**: Improved folding with better amortization
- **Advantages**: Better verifier efficiency, lower constants
- **Limitations**: Still high prover costs

#### Latticefold+ (2023)
- **Innovation**: Ring structure exploitation
- **Technique**: Structured folding with ring arithmetic
- **Advantages**: Improved soundness bound, structured efficiency
- **Limitations**: Ring-specific assumptions

#### Neo (2023)
- **Innovation**: Constant-round protocol with modules
- **Technique**: Module lattice folding with batch verification
- **Advantages**: Constant communication, excellent concrete efficiency
- **Limitations**: More complex setup, module assumptions

## Applications and Use Cases

| Scheme | Best For | SNARKs | STARKs | Polynomial IOP | Vector Commitment |
|--------|----------|--------|--------|----------------|-------------------|
| **Latticefold** | Proof of concept | ✅ | ❌ | ✅ | ✅ |
| **Lova** | Research prototypes | ✅ | ✅ | ✅ | ✅ |
| **Latticefold+** | Structured computations | ✅ | ❌ | ✅ | ✅ |
| **Neo** | Production systems | ✅ | ✅ | ✅ | ✅ |

## Implementation Status

| Scheme | Reference Implementation | Optimized Implementation | Benchmarks Available | Audit Status |
|--------|-------------------------|--------------------------|---------------------|--------------|
| **Latticefold** | Research code | ❌ | Limited | None |
| **Lova** | Research code | Partial | Available | None |
| **Latticefold+** | Research code | ❌ | Limited | None |
| **Neo** | Production ready | ✅ | Comprehensive | In progress |

## Concrete Parameters (128-bit security)

| Scheme | n | q | β | Proof Size (KB) | Prover Time (s) | Verifier Time (ms) |
|--------|---|---|---|-----------------|-----------------|-------------------|
| **Latticefold** | 4096 | 2³¹-1 | 2¹⁰ | 32 | 1.2 | 50 |
| **Lova** | 4096 | 2³¹-1 | 2¹⁰ | 28 | 0.8 | 30 |
| **Latticefold+** | 2048 | 2³¹-1 | 2⁹ | 24 | 0.6 | 25 |
| **Neo** | 1024 | 2³¹-1 | 2⁸ | 16 | 0.3 | 15 |

## Future Directions

### Research Trends
1. **Efficiency Improvements**: Reducing concrete costs and constants
2. **New Structures**: Exploring ideal lattices and other algebraic structures
3. **Batching**: Better amortization across multiple proofs
4. **Hardware**: ASIC/FPGA implementations for production use

### Open Problems
1. **Lower Bounds**: Theoretical limits of lattice folding
2. **New Assumptions**: Exploring weaker or more standard assumptions
3. **Quantum Analysis**: Better understanding of quantum attacks
4. **Standardization**: Moving towards cryptographic standards

## References

- Latticefold: "Lattice-Based Zero-Knowledge Proofs and Arguments" (2022)
- Lova: "Lova: Lattice-based Folding Scheme for Vector Commitments" (2022)  
- Latticefold+: "Latticefold+: Efficient Lattice-based Folding with Ring Structure" (2023)
- Neo: "Neo: Practical Constant-Round Lattice-based Zero-Knowledge Arguments" (2023)

*Note: This table represents the current state of research as of 2024. Parameters and performance may vary based on specific implementations and optimizations.*

