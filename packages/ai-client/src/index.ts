import { createArchitectStub } from './stubs/architect';
import { createReviewerStub } from './stubs/reviewer';
import type { CreateClientOptions, LLMClient, ProviderFactory } from './types';

export type {
  CompletionRequest,
  CompletionResponse,
  CreateClientOptions,
  LLMClientConfig,
  LLMClient,
  ProviderFactory,
} from './types';

const registry: Record<string, ProviderFactory> = {};

function ensureProviders() {
  if (!registry.stub) {
    registry.stub = options => {
      const variant = options.stub?.variant ?? 'architect';
      return variant === 'reviewer' ? createReviewerStub(options) : createArchitectStub(options);
    };
  }
}

export function registerProvider(name: string, factory: ProviderFactory) {
  registry[name] = factory;
}

export function createLLMClient(options: CreateClientOptions): LLMClient {
  ensureProviders();
  const factory = registry[options.provider];
  if (!factory) {
    throw new Error(`Provider not registered: ${options.provider}`);
  }
  return factory(options);
}
