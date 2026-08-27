export interface ProviderPaths {
  instructions: string;
  skills: string;
  agents: string;
  mcp: string;
  invocationPrefix: string;
}

export interface Manifest {
  schemaVersion: number;
  canonical: {
    instructions: string;
    skills: string;
    agents: string;
    mcp: string;
  };
  providers: Record<string, ProviderPaths>;
}

export interface McpServer {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface McpDocument {
  mcpServers: Record<string, McpServer>;
}

export interface CanonicalAgent {
  name: string;
  description: string;
  tools: string[];
  body: string;
}
