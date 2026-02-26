import { input, select, confirm } from '@inquirer/prompts';
import { execSync, execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const TYPES = ['bug', 'feature', 'task', 'epic', 'chore'];

const PRIORITIES = [
  { name: '0 - Critical', value: '0' },
  { name: '1 - High', value: '1' },
  { name: '2 - Medium', value: '2' },
  { name: '3 - Low', value: '3' },
  { name: '4 - Backlog', value: '4' },
];

function gitUserName() {
  try {
    return execSync('git config user.name', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

async function textarea(message) {
  console.log(`\x1b[1m${message}\x1b[0m \x1b[2m(enter an empty line to finish)\x1b[0m`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines = [];
  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (line === '' && lines.length > 0) {
        rl.close();
        resolve(lines.join('\n'));
      } else {
        lines.push(line);
      }
    });
    rl.on('close', () => resolve(lines.join('\n')));
  });
}

export async function runWizard() {
  console.log('\n🎫 Ticket Creation Wizard\n');

  const title = await input({
    message: 'Title:',
    validate: (v) => v.trim().length > 0 || 'Title is required',
  });

  const type = await select({
    message: 'Type:',
    choices: TYPES.map((t) => ({ name: t, value: t })),
    default: 'task',
  });

  const priority = await select({
    message: 'Priority:',
    choices: PRIORITIES,
    default: '2',
  });

  const description = await textarea('Description:');
  const design = await textarea('Design:');
  const acceptance = await textarea('Acceptance criteria:');

  const assignee = await input({
    message: 'Assignee:',
    default: gitUserName(),
  });

  const tags = await input({ message: 'Tags (comma-separated):' });
  const externalRef = await input({ message: 'External ref:' });
  const parent = await input({ message: 'Parent ticket ID:' });

  // Summary
  console.log('\n--- Ticket Summary ---');
  console.log(`  Title:        ${title}`);
  console.log(`  Type:         ${type}`);
  console.log(`  Priority:     ${PRIORITIES.find((p) => p.value === priority).name}`);
  if (description) console.log(`  Description:  ${description.split('\n')[0]}...`);
  if (design) console.log(`  Design:       ${design.split('\n')[0]}...`);
  if (acceptance) console.log(`  Acceptance:   ${acceptance.split('\n')[0]}...`);
  if (assignee) console.log(`  Assignee:     ${assignee}`);
  if (tags) console.log(`  Tags:         ${tags}`);
  if (externalRef) console.log(`  External Ref: ${externalRef}`);
  if (parent) console.log(`  Parent:       ${parent}`);
  console.log('---------------------\n');

  const proceed = await confirm({ message: 'Create this ticket?' });
  if (!proceed) {
    console.log('Aborted.');
    return;
  }

  const tkScript = process.env.TK_SCRIPT || 'tk';
  const args = ['super', 'create', title];

  if (type) args.push('-t', type);
  if (priority) args.push('-p', priority);
  if (description) args.push('-d', description);
  if (design) args.push('--design', design);
  if (acceptance) args.push('--acceptance', acceptance);
  if (assignee) args.push('-a', assignee);
  if (tags) args.push('--tags', tags);
  if (externalRef) args.push('--external-ref', externalRef);
  if (parent) args.push('--parent', parent);

  const result = execFileSync(tkScript, args, { encoding: 'utf8' }).trim();
  console.log(`\nCreated ticket: ${result}`);
}
