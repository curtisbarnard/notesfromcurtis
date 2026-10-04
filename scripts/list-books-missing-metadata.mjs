import fs from 'node:fs/promises';
import path from 'node:path';

const booksDirectory = path.join(process.cwd(), 'src/content/books');
const fields = ['author', 'type', 'isbn13', 'genres', 'publishYear'];

function readFrontmatter(source, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);
  const lines = match[1].split(/\r?\n/);
  const values = new Map();

  for (let index = 0; index < lines.length; index++) {
    const field = /^([A-Za-z][A-Za-z0-9_]*):(?:\s*(.*))?$/.exec(lines[index]);
    if (!field) continue;
    const [, name, rawValue = ''] = field;
    if (!fields.includes(name)) continue;

    let value = rawValue.trim();
    if (!value) {
      const listItems = [];
      for (let next = index + 1; next < lines.length; next++) {
        const line = lines[next];
        if (line.trim() && !/^\s/.test(line)) break;
        const item = /^\s+-\s*(.*)$/.exec(line);
        if (item) listItems.push(item[1].trim());
      }
      value = listItems.join(',');
    }
    values.set(name, value);
  }

  const titleLine = lines.find((line) => /^title:\s*/.test(line));
  const rawTitle = titleLine?.replace(/^title:\s*/, '').trim();
  let title = rawTitle;
  if (rawTitle?.startsWith('"') && rawTitle.endsWith('"')) {
    try {
      title = JSON.parse(rawTitle);
    } catch {
      title = rawTitle.slice(1, -1);
    }
  } else if (rawTitle?.startsWith("'") && rawTitle.endsWith("'")) {
    title = rawTitle.slice(1, -1).replace(/''/g, "'");
  }

  return { title, values };
}

function isMissing(value) {
  if (value === undefined) return true;
  const normalized = value.trim();
  if (!normalized || /^(?:null|~|''|"")$/i.test(normalized)) return true;
  if (/^\[.*\]$/.test(normalized)) {
    return normalized.slice(1, -1).replace(/[\s,'"]+/g, '').length === 0;
  }
  return false;
}

async function main() {
  const files = (await fs.readdir(booksDirectory)).filter((file) => file.endsWith('.mdx')).sort();
  const books = [];

  for (const file of files) {
    const source = await fs.readFile(path.join(booksDirectory, file), 'utf8');
    const { title, values } = readFrontmatter(source, file);
    const missing = fields.filter((field) => isMissing(values.get(field)));
    if (missing.length) books.push({ file: `src/content/books/${file}`, title: title ?? path.basename(file, '.mdx'), missing });
  }

  const totals = Object.fromEntries(fields.map((field) => [field, 0]));
  for (const book of books) {
    for (const field of book.missing) totals[field]++;
  }

  console.log(`Books missing metadata: ${books.length} of ${files.length}`);
  console.log('Missing by field:');
  for (const field of fields) console.log(`  ${field}: ${totals[field]}`);
  console.log('Books:');
  if (books.length === 0) console.log('  None');
  for (const book of books) console.log(`  ${book.title} [${book.file}] - ${book.missing.join(', ')}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});