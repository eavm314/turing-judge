import { describe, expect, it } from 'vitest';

import { EPSILON } from '@/constants/symbols';
import { FsmDesigner } from '@/lib/automata/finite-state-machine/FsmDesigner';
import { createBasicFsm } from './helpers/fixtures';

describe('FsmDesigner', () => {
  it('adds states and prevents duplicate names', () => {
    const designer = new FsmDesigner(createBasicFsm());

    designer.addState('q2', { transitions: {} });
    expect(designer.stateToIndex.get('q2')).toBeDefined();

    expect(() => designer.addState('q2', { transitions: {} })).toThrow('State already exists');
  });

  it('does not remove the initial state', () => {
    const designer = new FsmDesigner(createBasicFsm());

    expect(() => designer.removeState(0)).toThrow('Cannot remove initial state');
  });

  it('renames a state and rejects conflicting names', () => {
    const designer = new FsmDesigner(createBasicFsm());
    designer.addState('q2', { transitions: {} });

    designer.renameState(1, 'qf');
    expect(designer.getState(1).name).toBe('qf');

    expect(() => designer.renameState(1, 'q2')).toThrow('State already exists');
  });

  it('validates transition symbols against the alphabet', () => {
    const designer = new FsmDesigner(createBasicFsm());

    expect(() => {
      designer.addTransition(0, 1, [{ input: 'x' }]);
    }).toThrow('Symbols not in alphabet');

    designer.addSymbol('x');
    expect(() => designer.addTransition(0, 1, [{ input: 'x' }])).not.toThrow();
  });

  it('is non-deterministic when epsilon transitions exist', () => {
    const designer = new FsmDesigner(createBasicFsm());
    designer.addSymbol(EPSILON);
    designer.addTransition(0, 1, [{ input: EPSILON }]);

    expect(designer.isDeterministic()).toBe(false);
  });

  it('is non-deterministic when two outgoing transitions share an input symbol', () => {
    const designer = new FsmDesigner(createBasicFsm());
    designer.addState('q2', { transitions: {} });

    designer.addTransition(0, 1, [{ input: 'a' }]);
    designer.addTransition(0, 2, [{ input: 'a' }]);

    expect(designer.isDeterministic()).toBe(false);
  });

  it('collects used symbols from transitions', () => {
    const designer = new FsmDesigner(createBasicFsm());

    designer.addTransition(0, 1, [{ input: 'a' }, { input: 'b' }]);

    expect(designer.getUsedSymbols()).toEqual(new Set(['a', 'b']));
  });
});
