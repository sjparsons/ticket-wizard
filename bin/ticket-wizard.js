#!/usr/bin/env node
// tk-plugin: Interactive ticket creation wizard

import { runWizard } from '../lib/wizard.js';

runWizard().catch((err) => {
  if (err.name === 'ExitPromptError') {
    process.exit(130);
  }
  console.error(err.message);
  process.exit(1);
});
