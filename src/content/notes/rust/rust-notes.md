---
author: "Alex Bustos"
class: "Rust"
pubDate: 2025-3-2
title: "Rust Notes"
---

Rust notes, mostly from _The Rust Programming Language_.

## Variables and Mutability

### Shadowing

Shadowing is basically just redeclaring a variable, allowing you to reuse the
same name. For example,

```rust
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}"); // 12
    }

    println!("The value of x is: {x}"); // 6
}
```

### Data Types

Rust has the following four primary scalar data types.

- integers
- floating point numbers
- Booleans
- characters (which are specified with single quotes, as opposed to string
  literals, which use double quotes)

Rust also has two primitive compound types, tuples and arrays.

#### Tuples

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

A tuple without any elements, `()`, is called **unit**, and represents an empty
value or empty return type. Expressions implicitly return the unit value if they
don't return any other value.

#### Arrays

```rust
fn main() {
    let a: [i32; 5] = [1, 2, 3, 4, 5];

    // initializes an array with the same value for each element
    let a = [3; 5]; // [3, 3, 3, 3, 3]
}
```

- Arrays have a fixed length and are allocated on the stack.

## Ownership

### Ownership Rules

- Each value in Rust has an _owner_.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

### Memory and Allocation

In Rust, memory is automatically returned to the allocator once the variable
that owns it goes out of scope. This pattern of deallocating resources at the
end of an item's lifetime is called **Resource Acquisition is Initialization
(RAII)**.

You can't really do shallow copies in Rust (based on my understanding of the
book at least). Instead of having two variables with pointers to the same
location in memory, if you do something like the following:

```rust
fn main() {
    let a = String::from("hello");
    let b = a;
}
```

`a` will just become invalid, and you can no longer reference it after
`let b = a`. So this is called a **move** instead of a shallow copy.

## References and Borrowing

**References** differ from pointers in that references are guaranteed to point
to a valid value of a particular type for the life of that reference. This also
means that it's impossible to have dangling references.

Creating a reference is called **borrowing**.

## Slices

**Slices** let you reference a contiguous sequence of elements in a collection
rather than the whole collection. A slice is a kind of reference, so it does not
have ownership.

### String Slices

String slices look like the following, and are annotated as `&str`. Apparently
string literals are also just... string slices? Since they point to a particular
location in a compiled Rust binary.

```rust
fn main() {
    let s = String::from("hello world");

    let hello = &s[0..5];
    let world = &s[6..11];
}
```

### Other Slices

You can slice arrays too. In the example below, `slice` has type `&[i32]`.

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let slice = &a[1..3];
```

## Packages, Crates, and Modules

Rust's module system includes the following:

- **Packages**, which contain crates.
- **Crates**, which contain modules.
- **Modules**, which let you control organization, scope, and privacy of paths.
- **Paths**, which are a way of naming things like structs, functions, and
  modules.
