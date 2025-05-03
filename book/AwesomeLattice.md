<!-- filepath: /Users/kurtpan/Documents/GitHub/Awesome-Lattice/book/AwesomeLattice.md -->
# Awesome Lattice-Based Cryptography

A curated list of awesome resources for learning and using lattice-based cryptography.

## Surveys & Books

| Title                                                                 | Time      | Authors/Team        | URL                                                                                                |
| :-------------------------------------------------------------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------- |
| **The LLL Algorithm: Survey and Applications**                            | 2009      | Phong Q. Nguyen, Damien Stehlé | [Link](https://www.normalesup.org/~dstehle/downloads/LLLsurvey.pdf)                                |
| **A Decade of Lattice Cryptography**                                      | 2016      | Chris Peikert       | [Link](https://eprint.iacr.org/2015/939)                                                           |
| **Fundamentals of Lattice Cryptography (Course Notes)**                   | Ongoing   | Daniele Micciancio, Oded Regev | [Link](https://cseweb.ucsd.edu/~daniele/courses/CSE207C/notes.html)                               |
| **Lattice Basis Reduction: An Introduction to the LLL Algorithm and Its Applications** | 2002      | Daniele Micciancio, Shafi Goldwasser | [Publisher Link](https://link.springer.com/book/10.1007/978-1-4615-0715-9) (Book) |
| **Complexity of Lattice Problems: A Cryptographic Perspective**           | 2002      | Daniele Micciancio, Shafi Goldwasser | [Publisher Link](https://link.springer.com/book/10.1007/978-1-4615-0897-2) (Book) |

## Tutorials & Courses

| Title                                                                 | Time      | Authors/Team        | URL                                                                                                |
| :-------------------------------------------------------------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------- |
|**Kyber and Dilithium**|2024|Alfred Menezes|[Link](https://cryptography101.ca/kyber-dilithium/)|
|**The Mathematics of Lattice-Based Cryptography**|2025|Alfred Menezes|[Link](https://cryptography101.ca/lattice-based-cryptography/)|
| **Lattice Cryptography Tutorial (Various Conferences)**                   | Various   | Chris Peikert       | [Example (Crypto 2011)](https://web.eecs.umich.edu/~cpeikert/pubs/lattice-tutorial.pdf)            |
| **Introduction to Lattice-Based Cryptography (Bar-Ilan Winter School)**   | 2015      | Vadim Lyubashevsky  | [Link](https://www.vadim.lyubashevsky.org/files/billectures.pdf)                                   |
| **IACR ePrint Archive (Search for recent tutorials)**                     | Ongoing   | Various             | [Link](https://eprint.iacr.org/)                                                                   |

## Blogs & Talks

| Title                                                                 | Time      | Authors/Team        | URL                                                                                                |
| :-------------------------------------------------------------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------- |
| **Chris Peikert's Blog (Lattice-Based Crypto Posts)**                     | Various   | Chris Peikert       | [Link](https://web.eecs.umich.edu/~cpeikert/pubs/) (Check publications/talks section)              |
| **Vadim Lyubashevsky's Publications/Talks**                               | Various   | Vadim Lyubashevsky  | [Link](https://www.vadim.lyubashevsky.org/publications.html)                                       |
| **Windows on Theory (Blog posts on LWE, etc.)**                           | Various   | Various (e.g., Oded Regev) | [Link](https://windowsontheory.org/tag/lattices/)                                                  |
| **Real World Crypto Symposium Talks (Search for lattice topics)**         | Annual    | Various Speakers    | [Link](https://rwc.iacr.org/archive.html)                                                          |
| **Zama Blog (Focus on FHE)**                                              | Ongoing   | Zama Team           | [Link](https://www.zama.ai/blog)                                                                   |

## Key Papers

### Foundational & Hardness Assumptions

| Title                                                                                                  | Time      | Authors/Team        | Citation |
| :----------------------------------------------------------------------------------------------------- | :-------- | :------------------ | :------- |
| **Generating hard instances of lattice problems**                                                          | 1996      | Miklós Ajtai        | [Ajt96]  |
| **On Lattices, Learning with Errors, Random Linear Codes, and Cryptography**                               | 2005      | Oded Regev          | [Reg05]  |
| **The Learning with Errors Problem**                                                                       | 2010      | Oded Regev          | [Reg10]  |
| **On Ideal Lattices and Learning with Errors over Rings**                                                  | 2010      | Vadim Lyubashevsky, Chris Peikert, Oded Regev | [LPR10]  |

### Public-Key Encryption (PKE) & Key Encapsulation Mechanisms (KEM)

| Title                                                                                                  | Time      | Authors/Team        | Citation |
| :----------------------------------------------------------------------------------------------------- | :-------- | :------------------ | :------- |
| **NTRU: A Ring-Based Public Key Cryptosystem**                                                             | 1998      | Jeffrey Hoffstein, Jill Pipher, Joseph H. Silverman | [HPS98]  |
| **Post-quantum key exchange - a new hope**                                                                 | 2015      | Erdem Alkim, Léo Ducas, Thomas Pöppelmann, Peter Schwabe | [ADPS15] |
| **CRYSTALS-Kyber: Algorithm Specifications and Supporting Documentation**                                  | 2017+     | Kyber Team          | [Kyb17]  |

### Digital Signatures

| Title                                                                                                  | Time      | Authors/Team        | Citation |
| :----------------------------------------------------------------------------------------------------- | :-------- | :------------------ | :------- |
| **Trapdoors for Hard Lattices and New Cryptographic Constructions**                                        | 2008      | Craig Gentry, Chris Peikert, Vinod Vaikuntanathan | [GPV08]  |
| **Falcon: Fast-Fourier Lattice-based Compact Signatures over NTRU**                                        | 2017+     | Falcon Team         | [Fal17]  |
| **CRYSTALS-Dilithium: Algorithm Specifications and Supporting Documentation**                              | 2017+     | Dilithium Team      | [Dil17]  |

### Fully Homomorphic Encryption (FHE)

| Title                                                                                                  | Time      | Authors/Team        | Citation |
| :----------------------------------------------------------------------------------------------------- | :-------- | :------------------ | :------- |
| **Fully homomorphic encryption using ideal lattices**                                                      | 2009      | Craig Gentry        | [Gen09]  |
| **Fully Homomorphic Encryption without Bootstrapping**                                                     | 2011      | Zvika Brakerski, Vinod Vaikuntanathan | [BV11]   |
| **(Leveled) fully homomorphic encryption without modulus switching**                                       | 2012      | Zvika Brakerski     | [Bra12]  |
| **Homomorphic Encryption from Learning with Errors: Conceptually-Simpler, Asymptotically-Faster, Attribute-Based** | 2013      | Craig Gentry, Amit Sahai, Brent Waters | [GSW13]  |
| **TFHE: Fast Fully Homomorphic Encryption over the Torus**                                                 | 2016      | Ilaria Chillotti, Nicolas Gama, Mariya Georgieva, Malika Izabachène | [CGGI16] |

## Software Libraries

| Title                                                                 | Time      | Authors/Team        | URL                                                                                                |
| :-------------------------------------------------------------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------- |
| **PALISADE Homomorphic Encryption Library**                               | Ongoing   | PALISADE Team (NJIT, Duality Technologies, et al.) | [Link](https://palisade-crypto.org/)                                                             |
| **Microsoft SEAL (Simple Encrypted Arithmetic Library)**                  | Ongoing   | Microsoft Research  | [Link](https://github.com/microsoft/SEAL)                                                          |
| **HElib (Homomorphic Encryption Library)**                                | Ongoing   | IBM Research        | [Link](https://github.com/homenc/HElib)                                                            |
| **NFLlib (Number Field Lattice Library)**                                 | Ongoing   | Various Contributors | [Link](https://github.com/quarkslab/NFLlib)                                                        |
| **Open Quantum Safe (liboqs)**                                            | Ongoing   | OQS Project         | [Link](https://openquantumsafe.org/) (Includes implementations of NIST PQC candidates)             |
| **FHEW / TFHE**                                                           | Ongoing   | Various Contributors | [Link](https://github.com/tfhe/tfhe) (Fast FHE libraries based on GSW/torus)                       |
| **Lattigo**                                                               | Ongoing   | Tune Insight        | [Link](https://github.com/tuneinsight/lattigo) (Go library for lattice crypto, including HE)       |

## Standardization Efforts

| Title                                                                 | Time      | Authors/Team        | URL                                                                                                |
| :-------------------------------------------------------------------- | :-------- | :------------------ | :------------------------------------------------------------------------------------------------- |
| **NIST Post-Quantum Cryptography (PQC) Standardization**                  | 2016-Present | NIST & Community    | [Link](https://csrc.nist.gov/projects/post-quantum-cryptography)                                   |
| **HomomorphicEncryption.org Standards**                                   | Ongoing   | Community           | [Link](https://homomorphicencryption.org/standard/)                                                |

---

*Contributions welcome! Please open an issue or pull request to suggest additions or corrections.*
