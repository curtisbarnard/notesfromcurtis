import fs from 'node:fs/promises';
import path from 'node:path';

const booksDirectory = path.join(process.cwd(), 'src/content/books');
const checkOnly = process.argv.includes('--check');

function sortFrontmatter(source, file) {
  const match = /^---(\r?\n)([\s\S]*?)\r?\n---(?=\r?\n|$)/.exec(source);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);

  const lineEnding = match[1];
  const blocks = [];
  let currentBlock;

  for (const line of match[2].split(/\r?\n/)) {
    const field = /^([A-Za-z][A-Za-z0-9_-]*):/.exec(line);
    if (field) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { key: field[1], lines: [line] };
    } else if (currentBlock && (!line.trim() || /^\s/.test(line))) {
      currentBlock.lines.push(line);
    } else {
      throw new Error(`Unsupported frontmatter line in ${file}: ${line}`);
    }
  }
  if (currentBlock) blocks.push(currentBlock);
  if (!blocks.length) throw new Error(`No frontmatter fields found in ${file}`);

  const sortedBlocks = [...blocks].sort((left, right) => (
    left.key < right.key ? -1 : left.key > right.key ? 1 : 0
  ));
  const sortedFrontmatter = `---${lineEnding}${sortedBlocks
    .flatMap((block) => block.lines)
    .join(lineEnding)}${lineEnding}---`;
  const sortedSource = source.replace(match[0], sortedFrontmatter);

  return {
    source: sortedSource,
    changed: sortedSource !== source,
  };
}

async function main() {
  const files = (await fs.readdir(booksDirectory))
    .filter((file) => file.endsWith('.mdx'))
    .sort();
  const changedFiles = [];

  for (const file of files) {
    const filePath = path.join(booksDirectory, file);
    const original = await fs.readFile(filePath, 'utf8');
    const result = sortFrontmatter(original, file);
    if (!result.changed) continue;

    changedFiles.push(file);
    if (!checkOnly) await fs.writeFile(filePath, result.source);
  }

  if (changedFiles.length) {
    console.log(`${checkOnly ? 'Unsorted' : 'Sorted'} book frontmatter in ${changedFiles.length} file(s):`);
    for (const file of changedFiles) console.log(`  ${file}`);
    if (checkOnly) process.exitCode = 1;
  } else {
    console.log(`All ${files.length} book frontmatter blocks are alphabetized.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});