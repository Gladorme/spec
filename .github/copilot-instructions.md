# Perses specification repository instructions

Follow [`AGENTS.md`](../AGENTS.md) for cross-language architecture, compatibility, generation, validation, and
completion requirements.

- Treat Go, CUE, TypeScript/Zod, and Java models as representations of one public resource contract.
- Preserve field names, optionality, defaults, enum values, discriminators, serialization, and stored-resource
  compatibility unless a breaking change is explicitly requested.
- Assess every model change across all language layers; do not let types and runtime validation diverge silently.
- Never hand-edit `_go_gen.cue` or another generated file. Change its source, run the documented generator, and inspect
  the diff. Put CUE-only constraints in the matching `_patch.cue` file.
- In `ts/`, retain strict types, align interfaces with Zod schemas, and use intended public barrel exports.
- Add focused positive and negative validation tests and Apache headers on new source files.
- Do not add dependencies, change published versions, raise lint ceilings, or use broad suppressions without a specific
  reason.
