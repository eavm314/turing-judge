import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { validateCode } from '@/lib/schemas/automaton-code';

const readDoc = (page: string) =>
  readFileSync(join(process.cwd(), 'src/app/(platform)/docs', page, 'page.mdx'), 'utf8');

const fencedBlocks = (markdown: string, language: string) =>
  [...markdown.matchAll(new RegExp('```' + language + '\\n([\\s\\S]*?)```', 'g'))].map(
    match => match[1],
  );

const firstJsonObject = (block: string) => {
  const start = block.indexOf('{');
  let depth = 0;
  for (let index = start; index < block.length; index++) {
    if (block[index] === '{') depth++;
    if (block[index] === '}' && --depth === 0) return block.slice(start, index + 1);
  }
  throw new Error('Prompt template without a JSON example');
};

describe('AI prompt templates', () => {
  const templates = fencedBlocks(readDoc('ai-prompts'), 'text');
  const examples = templates.map(firstJsonObject);

  it('offers one template per automaton type', () => {
    expect(examples.map(example => JSON.parse(example).type)).toEqual(['FSM', 'PDA', 'TM']);
  });

  it.each(['FSM', 'PDA', 'TM'])('embeds an importable %s example', type => {
    const example = examples.find(candidate => JSON.parse(candidate).type === type)!;

    expect(validateCode(example)).toBe('');
  });

  it('instructs without filler courtesy', () => {
    for (const template of templates) {
      expect(template.toLowerCase()).not.toContain('please');
    }
  });
});

describe('JSON format examples', () => {
  const examples = [
    ...readDoc('json-formats').matchAll(/## .*\((FSM|PDA|TM)\)[\s\S]*?```json\n([\s\S]*?)```/g),
  ].map(match => ({ type: match[1], automaton: JSON.parse(match[2]) }));

  it('documents one schema per automaton type', () => {
    expect(examples.map(example => example.type)).toEqual(['FSM', 'PDA', 'TM']);
  });

  it.each(['FSM', 'PDA', 'TM'])('shows an importable %s schema', type => {
    const example = examples.find(candidate => candidate.type === type)!;

    expect(validateCode(JSON.stringify(example))).toBe('');
  });
});
