## Encapsulate of Internal State

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
- Be clearly identified as unsafe (for example, `unsafeGetRawPoints()`).
- Intentionally return a live reference.
- Include a JSDoc explicitly warning that:
    - The returned object is owned and internally mananged.
    - Mutating the returned object directly affects the object owner.
    - The caller becomes responsible for preserving any documented invariants.

#### Service or Abstraction-Based Access

State intentionally exposed through a stable abstraction or service is exempt from this rule because the abstraction, rather than the caller, owns the underlying state. 

Examples include:
- Services objects such as `EventEmitter`
- Read-only wrapper types such as `ReadonlyBounds`

#### Unmanaged Data Objects

Data objects whose values do no participate in invariants, caching, ownership, or lifecycle management may expose their mutable state directly when doing so improves usability.

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
