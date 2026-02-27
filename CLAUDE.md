# CLAUDE.md

## Project overview

`ticket-wizard` is an npm package that provides an interactive CLI wizard for creating tickets. It is a plugin for the [tk](https://github.com/wedow/ticket) ticket management CLI.

## Architecture

- **`bin/ticket-wizard.js`** — Entry point. Contains the `# tk-plugin:` comment used by `tk help` for plugin discovery. Both `ticket-wizard` and `ticket-wiz` bin aliases point here.
- **`lib/wizard.js`** — All wizard logic. Exports `runWizard()` which runs the interactive prompt sequence and calls `tk create`.

The package uses ESM (`"type": "module"` in package.json).

## tk plugin convention

- Executables named `ticket-<cmd>` or `tk-<cmd>` in PATH are auto-discovered by `tk`.
- The comment `// tk-plugin: Interactive ticket creation wizard` in the first 10 lines of the entry point is read by `tk help`.
- `tk` exports `TICKETS_DIR` and `TK_SCRIPT` env vars to plugins before invoking them.
- Plugins call `$TK_SCRIPT super create` (not `tk create`) to invoke the built-in create command without recursion.

## tk create arguments

```
tk create [title] [options]
  -t, --type           bug|feature|task|epic|chore (default: task)
  -p, --priority       0-4 (default: 2)
  -d, --description    Description text
  --design             Design notes
  --acceptance         Acceptance criteria
  -a, --assignee       Assignee (default: git user.name)
  --tags               Comma-separated tags
  --external-ref       External reference
  --parent             Parent ticket ID
```

## Key implementation details

- Multiline fields (description, design, acceptance) use a custom `textarea()` helper built on Node's `readline`. The user types lines and enters an empty line to finish. This keeps input in the CLI without dropping to an external editor.
- The `@inquirer/prompts` package provides `input`, `select`, and `confirm` prompts.
- Assignee defaults to `git config user.name`.
- Ctrl+C during prompts exits cleanly (catches `ExitPromptError`).

## Development

```bash
npm install          # install dependencies
npm i -g .           # install globally to make tk wizard available
tk wizard            # run the wizard
```

## Common tasks

- To add a new field: add the prompt in `lib/wizard.js` in the `runWizard()` function, add it to the summary output, and add the corresponding CLI flag to the args array.
- To change field order: reorder the prompt calls in `runWizard()`.
- To modify choices for type/priority: edit the `TYPES` and `PRIORITIES` constants at the top of `lib/wizard.js`.
