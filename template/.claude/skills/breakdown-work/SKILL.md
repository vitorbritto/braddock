---
name: breakdown-work
description: Breaks work into actionable epics, stories, and small bets.
---

# Breakdown Work

Use the `planner` agent.

## Goal
Break `.braddock/memory/spec.md` into traceable execution units.

## Outputs

### .braddock/memory/tasks.json
Each task must contain:
- id
- title
- epic
- story
- owner
- status
- dependencies
- definition_of_done

### .braddock/board/kanban.json
Structure columns:
- backlog
- todo
- doing
- review
- done

Update `.braddock/memory/status.md`.
Indicate the next skill: `/implement-task`.
