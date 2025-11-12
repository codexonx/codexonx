export type ProviderName = 'stub' | 'emergent' | 'openai';

export type CompletionRequest = {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
};

export type CompletionResponse = {
  id: string;
  output: string;
  tokensUsed: number;
};

export type LLMClientConfig = {
  provider: ProviderName;
};

export type StubOptions = {
  variant?: 'architect' | 'reviewer';
};

export type CreateClientOptions = LLMClientConfig & {
  stub?: StubOptions;
};

export interface LLMClient {
  complete(request: CompletionRequest): Promise<CompletionResponse>;
}

export type ProviderFactory = (options: CreateClientOptions) => LLMClient;
