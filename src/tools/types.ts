/**
 * Return type for all MCP tool handlers.
 * isError: true signals that the tool failed to execute (invalid input, network error, etc.)
 * as opposed to returning empty results, which is a successful execution.
 */
export type ToolResult = {
  text: string;
  isError?: boolean;
};
