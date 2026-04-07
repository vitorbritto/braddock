# AI Squad Operating System

## Goal

This repository implements a virtual squad system with specialized agents to transform a product idea into:

- PRD
- architecture
- technical spec
- tasks
- implementation
- final review

## Global rules

1. Always start by reading:
   - .braddock/memory/vision.md
   - .braddock/memory/prd.md
   - .braddock/memory/spec.md
   - .braddock/memory/decisions.md
   - .braddock/board/kanban.json

2. Never skip steps.
3. Never implement before a PRD and spec exist.
4. Never assume a business rule without recording it in `.braddock/memory/decisions.md`.
5. Always maintain traceability between:
   - vision
   - PRD
   - spec
   - task
   - code

## Default execution order

1. Refine vision
2. Create PRD
3. Define architecture
4. Create spec
5. Break down into epics, stories, and small bets
6. Implement task by task
7. Review delivery

## Conventions

- All artifacts must be saved in `.braddock/memory`
- The operational board must be saved in `.braddock/board/kanban.json`
- Every important decision must be recorded in `.braddock/memory/decisions.md`
- Execution status must always be updated in `.braddock/memory/status.md`

## Quality rule

Before closing any step:

- validate consistency with previous artifacts
- flag risks
- flag dependencies
- flag open gaps
