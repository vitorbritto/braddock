---
name: implement-task
description: Implements the next eligible task from the board.
---

# Implement Task

## Goal
Select the next task with status `todo` and no pending dependencies.

## Rules
1. Read `.braddock/memory/tasks.json` and `.braddock/board/kanban.json`
2. Choose the next eligible task
3. Identify the owner
4. Use the appropriate agent:
   - backend-senior
   - frontend-senior
   - architect-specialist, if the task is structural
5. Implement only what is needed for the task
6. Update:
   - .braddock/board/kanban.json
   - .braddock/memory/tasks.json
   - .braddock/memory/status.md

## Expected result
- task moves from `todo` to `review`
- implementation consistent with the spec
- observations recorded
