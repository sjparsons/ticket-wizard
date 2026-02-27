# ticket-wizard

Interactive ticket creation wizard plugin for [tk](https://github.com/wedow/ticket).

Provides a prompt-driven CLI experience for creating tickets, with appropriate input types for each field.

## Install

```bash
npm i -g .
```

This puts both `ticket-wizard` and `ticket-wiz` in your PATH, so `tk wizard` and `tk wiz` both work.

## Usage

```bash
tk wizard
```

The wizard walks you through each field:

| Field | Input Type | Required | Details |
|-------|-----------|----------|---------|
| Title | text | Yes | Single line, validated non-empty |
| Type | select | Yes | bug, feature, task, epic, chore (default: task) |
| Priority | select | Yes | 0 Critical, 1 High, 2 Medium, 3 Low, 4 Backlog (default: 2) |
| Description | multiline | No | Type lines, enter empty line to finish |
| Design | multiline | No | Type lines, enter empty line to finish |
| Acceptance | multiline | No | Type lines, enter empty line to finish |
| Assignee | text | No | Defaults to `git config user.name` |
| Tags | text | No | Comma-separated |
| External Ref | text | No | e.g. gh-123, JIRA-456 |
| Parent | text | No | Existing ticket ID |

After all prompts, a summary is shown and you confirm before the ticket is created.

## How it works

The wizard collects input interactively, then calls `$TK_SCRIPT super create` with the collected arguments. The `TK_SCRIPT` and `TICKETS_DIR` environment variables are provided automatically by `tk` when invoking plugins.

## Project structure

```
ticket-wiz/
├── package.json           # npm package config
├── bin/
│   └── ticket-wizard.js   # Entry point (both bin aliases point here)
└── lib/
    └── wizard.js           # Core wizard logic
```

## Dependencies

- [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) — `input`, `select`, and `confirm` prompts

## License

MIT
