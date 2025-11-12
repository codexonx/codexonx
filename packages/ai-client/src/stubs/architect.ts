import type {
  CompletionRequest,
  CompletionResponse,
  CreateClientOptions,
  LLMClient,
} from '../types';

const cannedResponses: Record<string, string> = {
  default: `// Suggested deployment pipeline refactor
const pipeline = createPipeline();
pipeline.step('build', withCaching());
pipeline.step('test', runIntegrationSuite({ retries: 2 }));
pipeline.step('deploy', deployWithRollback());
export default pipeline;`,
};

export function createArchitectStub(_options: CreateClientOptions): LLMClient {
  return {
    async complete({ prompt }: CompletionRequest): Promise<CompletionResponse> {
      const output = cannedResponses.default;
      return {
        id: 'stub-architect-response',
        output,
        tokensUsed: Math.min(256, prompt.length + output.length),
      };
    },
  };
}
