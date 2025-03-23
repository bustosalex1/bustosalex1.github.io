---
author: "Alex Bustos"
class: "Kalman Filtering"
pubDate: 2022-1-17
title: "Statistics Review"
draft: true
---

## Set Theory

A **set** is a collection of things, for example, $\set{ 1, 2, 3}$ or
$\set{\text{heads}, \text{tails}}$. Sets are comprised of **elements**, as shown
below.

$$
    \underbrace{2 \in \set{1, 2, 3}}_{\text{``2 is an element of } \set{1, 2, 3} \text{.''}}
$$

Sets can be defined mathematically. An example is shown below. Additionally,
sets are commonly notated using upper case characters, and elements within a set
are notated using lower case characters.

$$
    B = \set{x^2 | x = 2, 4, 6, \ldots }
$$

$A$ can be considered a **subset** of $B$ if and only if every element of A is
also an element of B. An example is shown below.

$$
    \underbrace{\set{1} \subset \set{1, 2, 3}}_{\text{``}\set{1} \text{ is a subset of } \set{1, 2,
3} \text{.''}}
$$

As an aside, the term "if and only if", represented by $\iff$, implies a two-way
argument. For example,

$$
    \text{You are younger than me if and only if I am older than you.}
$$

Comparatively, the term "if", represented by $\implies$, implies a one way
argument. For example,

$$
\begin{align*}
    &\text{If I am a Georgia Tech student, then I am a university student,} \\
    &\text{but the inverse is not necessarily true.}
\end{align*}
$$

The **Universal Set**, $\mathbb{U}$, contains everything. All sets are a subset
of $\mathbb{U}$. The **Null Set**, $\emptyset$, contains no elements.

![jk](../../../assets/notes/kalman-filtering/statistics/drawing.svg)
