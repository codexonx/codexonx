import { describe, expect, it } from 'vitest';

import { createLLMClient } from '../src';

describe('createLLMClient', () => {
  it('returns architect stub by default', async () => {
    const client = createLLMClient({ provider: 'stub' });

    const response = await client.complete({ prompt: 'test architect flow' });

    expect(response.id).toBe('stub-architect-response');
    expect(response.output).toContain('Suggested deployment pipeline');
  });

  it('returns reviewer stub when requested', async () => {
    const client = createLLMClient({ provider: 'stub', stub: { variant: 'reviewer' } });

    const response = await client.complete({ prompt: 'test reviewer flow' });

    expect(response.id).toBe('stub-reviewer-response');
    expect(response.output).toContain('Code Review Summary');
  });
});
