import type {
  CompletionRequest,
  CompletionResponse,
  CreateClientOptions,
  LLMClient,
} from '../types';

const reviewerNotes: Record<string, string> = {
  default: `### Code Review Summary
- ✅ Deployment script now retries failed steps.
- ⚠️ Consider externalising retry count to env config.
- 🧪 Add unit test covering rollback branch when deploy fails twice.
`,
};

export function createReviewerStub(_options: CreateClientOptions): LLMClient {
  return {
    async complete({ prompt }: CompletionRequest): Promise<CompletionResponse> {
      const output = reviewerNotes.default;
      return {
        id: 'stub-reviewer-response',
        output,
        tokensUsed: Math.min(180, prompt.length + output.length),
      };
    },
  };
}
