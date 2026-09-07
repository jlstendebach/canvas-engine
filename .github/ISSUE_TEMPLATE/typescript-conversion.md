---
name: TypeScript Conversion
about: Convert a single source file from JavaScript to TypeScript
title: 'Refactor - {ClassName} - Convert to TypeScript'
labels: 'refactor, typescript'
assignees: ''

---

## Summary
Convert `src/{path}/{ClassName}.js` to TypeScript as part of the incremental JavaScript → TypeScript migration.

This is a typing change only. Runtime behavior and the public API surface must be unchanged, with no renames, no signature changes, and no reordering of parameters. Type information moves out of the JSDoc and into the signature, while the descriptive prose in the docblocks stays.

Consumers of `{ClassName}` may still be plain JavaScript at this point and should continue to build without modification. If the conversion surfaces genuine type errors in already-converted consumers, note them here and split them into follow-up stories.

## Tasks
- [ ] Rename the file, committing the rename on its own so history is preserved:
```
git mv src/{path}/{ClassName}.js src/{path}/{ClassName}.ts
git commit -m "refactor({ClassName}): rename to .ts"
```
- [ ] Type the state: module constants, static variables, instance variables, private (`#`) fields
- [ ] Type the behavior: constructor parameters, method parameters, explicit return types
- [ ] Annotate self-returning methods as `: this` and instance-constructing methods as `: {ClassName}`
- [ ] Export supporting types (unions, callback signatures, and other shapes) that consumers need
- [ ] Strip type annotations from JSDoc, keeping descriptions and non-type tags
- [ ] Mark type-only imports as `import type` and type-only re-exports as `export type`
- [ ] Verify imports still resolve in referencing files
- [ ] Run `npm run lint`, `npm test`, and `npm run build` with no new errors

## Acceptance Criteria
- [ ] Compiles under `strict: true` with no `any`, `@ts-ignore`, or `@ts-expect-error`
- [ ] Public API is unchanged, with the same names, signatures, and return values
- [ ] Method chaining still type-checks without casts, including from subclasses
- [ ] Existing tests pass with no changes to the test files
- [ ] No new type errors introduced in already-converted consumers
- [ ] Conforms to project coding conventions
- [ ] `git log --follow` shows the file's pre-rename history