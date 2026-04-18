import { describe, expect, it } from 'vitest';

import { BLANK, EPSILON } from '@/constants/symbols';
import { TmDesigner } from '@/lib/automata/turing-machine/TmDesigner';
import { createBasicTm } from './helpers/fixtures';

describe('TmDesigner', () => {
  it('allows blank symbols in transitions without requiring them in alphabet', () => {
    const designer = new TmDesigner(createBasicTm());

    expect(() => {
      designer.addTransition(0, 1, [{ read: BLANK, write: BLANK, move: 'S' }]);
    }).not.toThrow();
  });

  it('rejects transitions with symbols not in alphabet (excluding blank)', () => {
    const designer = new TmDesigner(createBasicTm());

    expect(() => {
      designer.addTransition(0, 1, [{ read: 'x', write: 'a', move: 'R' }]);
    }).toThrow('Symbols not in alphabet');

    expect(() => {
      designer.addTransition(0, 1, [{ read: 'a', write: 'x', move: 'L' }]);
    }).toThrow('Symbols not in alphabet');
  });

  it('is non-deterministic when epsilon read transitions exist', () => {
    const designer = new TmDesigner(createBasicTm());
    designer.addSymbol(EPSILON);

    designer.addTransition(0, 1, [{ read: EPSILON, write: 'a', move: 'S' }]);
    expect(designer.isDeterministic()).toBe(false);
  });

  it('is non-deterministic when two outgoing transitions share the same read symbol', () => {
    const designer = new TmDesigner(createBasicTm());
    designer.addState('q2', { transitions: {} });

    designer.addTransition(0, 1, [{ read: 'a', write: 'a', move: 'R' }]);
    designer.addTransition(0, 2, [{ read: 'a', write: 'b', move: 'R' }]);

    expect(designer.isDeterministic()).toBe(false);
  });

  it('collects used read symbols from transitions', () => {
    const designer = new TmDesigner(createBasicTm());

    designer.addTransition(0, 1, [
      { read: 'a', write: 'b', move: 'R' },
      { read: BLANK, write: 'a', move: 'S' },
    ]);

    expect(designer.getUsedSymbols()).toEqual(new Set(['a', BLANK]));
  });
});
