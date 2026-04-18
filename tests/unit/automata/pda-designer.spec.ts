import { describe, expect, it } from 'vitest';

import { BOTTOM, EPSILON } from '@/constants/symbols';
import { PdaDesigner } from '@/lib/automata/pushdown-automaton/PdaDesigner';
import { createBasicPda } from './helpers/fixtures';

describe('PdaDesigner', () => {
  it('keeps bottom at the front of sorted stack alphabet', () => {
    const designer = new PdaDesigner(createBasicPda());

    designer.addStackSymbol('Z');
    expect(designer.getStackAlphabet()[0]).toBe(BOTTOM);
  });

  it('does not remove the bottom stack symbol', () => {
    const designer = new PdaDesigner(createBasicPda());

    designer.removeStackSymbol(BOTTOM);
    expect(designer.getStackAlphabet()).toContain(BOTTOM);
  });

  it('validates input and stack symbols when adding transitions', () => {
    const designer = new PdaDesigner(createBasicPda());

    expect(() => {
      designer.addTransition(0, 1, [{ input: 'x', pop: BOTTOM, push: [BOTTOM] }]);
    }).toThrow('Symbols not in alphabet');

    expect(() => {
      designer.addTransition(0, 1, [{ input: 'a', pop: 'X', push: [BOTTOM] }]);
    }).toThrow('Stack symbols not in stack alphabet');
  });

  it('is non-deterministic when epsilon and consuming transitions coexist for the same pop symbol', () => {
    const designer = new PdaDesigner(createBasicPda());
    designer.addSymbol(EPSILON);

    designer.addTransition(0, 1, [
      { input: EPSILON, pop: BOTTOM, push: [BOTTOM] },
      { input: 'a', pop: BOTTOM, push: [BOTTOM] },
    ]);

    expect(designer.isDeterministic()).toBe(false);
  });

  it('is non-deterministic when duplicate input-pop pairs exist', () => {
    const designer = new PdaDesigner(createBasicPda());
    designer.addState('q2', { transitions: {} });

    designer.addTransition(0, 1, [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }]);
    designer.addTransition(0, 2, [{ input: 'a', pop: BOTTOM, push: [BOTTOM] }]);

    expect(designer.isDeterministic()).toBe(false);
  });

  it('collects used input symbols from transitions', () => {
    const designer = new PdaDesigner(createBasicPda());

    designer.addTransition(0, 1, [
      { input: 'a', pop: BOTTOM, push: [BOTTOM, 'A'] },
      { input: 'b', pop: 'A', push: [BOTTOM] },
    ]);

    expect(designer.getUsedSymbols()).toEqual(new Set(['a', 'b']));
  });
});
