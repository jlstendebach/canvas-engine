## Encapsulation of Internal State

### Description:

Managed internal states must not be exposed as live references through public APIs. This includes objects, arrays, collections, and any other mutable data whose integrity is maintained by the object exposing it.

Exposing mutable internal state allows external code to bypass invariants, invalidate caches, introduce hidden side effects, and make object behavior difficult to reason about.

Whenever practical, public APIs should expose state using one of the following mechanisms instead:
- Copies
- Immutable snapshots or frozen objects
- Read-only views
- Iterators or query results
- Dedicated service objects

### Exceptions:

#### Explicit Unsafe Escape Hatch

Direct references to internally managed states may be exposed when doing so provides a significant performance or interoperability benefit. 

The method must:
- Be clearly identified as unsafe (for example, `unsafeGetPoints()`).
- Intentionally return a live reference.
- Include a JSDoc explicitly warning that:
    - The returned object is owned and internally managed.
    - Mutating the returned object directly affects the object owner.
    - The caller becomes responsible for preserving any documented invariants.

#### Service or Abstraction-Based Access

State intentionally exposed through a stable abstraction or service is exempt from this rule because the abstraction, rather than the caller, owns the underlying state. 

Examples include:
- Services objects such as `EventEmitter`
- Read-only wrapper types such as `ReadonlyBounds`

#### Unmanaged Data Objects

Data objects whose values do not participate in invariants, caching, ownership, or lifecycle management may expose their mutable state directly when doing so improves usability.

Examples include:
- A `Vec2` exposing mutable `x` and `y` properties.
- A simple configuration or parameter object whose values influence behavior but are not internally cached or managed.
- Value types that represent data rather than owned resources.



## Fluent Interface Pattern

### Description:

Methods whose primary purpose is to mutate the state of an object should return `this` to support method chaining and provide a consistent, expressive API.

Returning `this` enables multiple operations to be composed into a single fluent expression while avoiding unnecessary temporary variables. Fluent methods should perform a single logical mutation and should not obscure control flow or object state.

### Exceptions:

#### Meaningful Return Values

A method should not return `this` when it naturally produces a meaningful result that is more valuable to the caller.

Examples include methods that:
- Compute or retrieve a value.
- Create and return a new object.
- Return a success or failure status.
- Return data that would otherwise require repeating an expensive operation.

#### Ambiguous or Non-Mutating Operations

Methods that do not modify the object's state should not return `this` solely for the sake of chaining.

Examples include:
- Getters and property accessors.
- Query or search methods.
- Validation methods.
- Calculation or conversion methods.

#### Asynchronous or Deferred Operations

Methods that initiate asynchronous work or whose completion occurs at a later time should return an appropriate asynchronous type (such as a `Promise`) rather than `this`, unless the fluent API is specifically designed around asynchronous chaining.



## Member Visibility

### Description:

Visibility is expressed through naming, not through the `public` keyword. Three levels are used:

| Form | Visibility | Mechanism |
| --- | --- | --- |
| `#myVar` | Private | ECMAScript private field, enforced at runtime |
| `protected _myVar` | Protected | TypeScript modifier, enforced at compile time |
| `myVar` | Public | No modifier |

Private members use native `#` fields rather than TypeScript's `private` modifier. `private` is erased on emit, so it offers no protection to JavaScript consumers of the compiled library. `#` survives compilation and is enforced by the runtime.

Protected members have no native equivalent, so they use TypeScript's `protected` modifier together with an underscore-prefixed name. The underscore carries the same signal into the emitted JavaScript, where the modifier no longer exists.

The `public` keyword is never written. It adds no information that the absence of `#` or `protected` does not already convey.

### Notes:

#### Underscore Prefix on Parameters

An underscore prefix on a *parameter* means the parameter is intentionally unused, not that it is protected. The two uses do not conflict: protected members are always accessed through `this.` or `super.`, so a bare underscore-prefixed identifier never refers to a protected member.

Class fields and local variables use the bare name `_` for the same purpose, so a descriptive underscore-prefixed name in those positions is still reported as unused.



## Explicit Type Annotations

### Description:

Types are written explicitly where they form part of a contract, and inferred where they are local implementation detail.

Annotations are required on:
- Function and method parameters
- Function and method return types
- Class fields

Annotations are not required on:
- Local variables
- Arrow function parameters in inline callbacks

The reasoning differs by position. Return types are the strongest case: an inferred return type changes silently when an implementation changes, turning an internal edit into an unannounced API change. Class fields are the second strongest, since they describe the shape of an object's state and are read by anyone trying to understand the class. Local variables have neither property and may infer freely.

### Exceptions:

#### Inner Functions of Higher-Order Functions

When a function's declared return type is itself a function type, the returned function does not need its own annotations. The outer signature already declares them, and repeating them adds no information.



## Return Types for Self-Returning Methods

### Description:

A method that returns the receiver is annotated `: this`, not with the concrete class name.

The polymorphic `this` type tracks the actual receiver, so chaining continues to work from a subclass. Annotating the concrete class instead would narrow the chain to the base type and break any subclass-specific call that follows.

```ts
setPosition(x: number, y: number): this {
    // ...
    return this;
}
```

A method that constructs and returns a *new* instance is annotated with the concrete class. This includes `clone()`, static factories, and operations that produce a new value rather than mutating the receiver.

```ts
clone(): Bounds {
    return new Bounds(this.minX, this.minY, this.maxX, this.maxY);
}
```

The two cases are not interchangeable. A method annotated `: this` can only return the receiver, because no other expression is assignable to the polymorphic `this` type.

### Notes:

#### Overriding a Constructing Method

A subclass overriding a method such as `clone()` narrows the return type to its own class:

```ts
override clone(): Sprite {
    return new Sprite(/* ... */);
}
```

This is legal because return types are covariant. A subclass that fails to override such a method inherits the base implementation, which returns a base instance and silently loses subclass state. The compiler cannot detect this, so it is a review concern.



## Module Specifiers

### Description:

Relative import and export specifiers always use the `.js` extension, including in TypeScript files and including when the file on disk is `.ts`.

```ts
import type { Vec2 } from "./Vec2.js";     // resolves Vec2.ts
export * from "./Bounds.js";               // re-exports Bounds.ts
```

TypeScript does not rewrite specifiers on emit. Under `NodeNext` module resolution the specifier names the *emitted* file, which is always `.js`, regardless of the source extension.

Type-only imports and exports are marked explicitly, as a separate statement rather than an inline `type` keyword:

```ts
import type { Vec2 } from "./Vec2.js";
import { Bounds } from "./Bounds.js";
```

Marking is mandatory: `verbatimModuleSyntax` emits imports exactly as written, so an unmarked type-only import becomes a runtime import of something that does not exist, and a wrongly marked value import is erased and fails at runtime.

The distinction is whether the name survives compilation. A name used only in type positions is a type import. A name that is constructed, extended, or used with `instanceof` is a value import.



## Documentation Comments

### Description:

Docblocks keep their descriptive prose and all non-type tags. Type information lives in the signature, not in the comment.

```ts
/**
 * Projects this vector onto another.
 *
 * @param target - The vector to project onto
 * @returns A new vector representing the projection
 */
project(target: Vec2): Vec2 {
```

Braced types in `@param` and `@returns` are removed, since they duplicate a fact the compiler can check and the comment cannot. Descriptions, `@example`, `@throws`, `@deprecated`, and warnings on unsafe methods all stay — editors render the signature and the prose together, so nothing is lost.

`@type` and `@typedef` are not documentation and are not stripped. They are converted into real type declarations.



## Prohibited Constructs

### Description:

The following are not used in TypeScript source:

- `any`, whether written directly or introduced through an unchecked cast
- `@ts-ignore`, `@ts-expect-error`, and `@ts-nocheck`