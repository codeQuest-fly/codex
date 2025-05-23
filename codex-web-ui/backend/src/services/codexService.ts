import { spawn, ChildProcess } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

// Path to Codex CLI executable
const CODEX_CLI_PATH = process.env.CODEX_CLI_PATH || '/workspace/codex/target/release/codex';

interface ExecuteOptions {
  onOutput: (output: string) => void;
  onInteraction: (interaction: any) => void;
  onComplete: (success: boolean, result: any) => void;
}

// Execute a Codex CLI command
export function executeCodexCommand(
  prompt: string,
  options: ExecuteOptions
): ChildProcess {
  // Create a process to run Codex CLI
  const process = spawn(CODEX_CLI_PATH, ['--prompt', prompt, '--json-output']);
  
  let outputBuffer = '';
  let errorBuffer = '';
  
  // Handle process output
  process.stdout.on('data', (data) => {
    const output = data.toString();
    outputBuffer += output;
    options.onOutput(output);
    
    // Check for interaction requests in the output
    checkForInteractions(output, options);
  });
  
  // Handle process errors
  process.stderr.on('data', (data) => {
    const error = data.toString();
    errorBuffer += error;
    options.onOutput(`ERROR: ${error}`);
  });
  
  // Handle process completion
  process.on('close', (code) => {
    const success = code === 0;
    
    // Parse the output to extract results
    const result = parseCodexOutput(outputBuffer);
    
    options.onComplete(success, result);
  });
  
  return process;
}

// Check for interaction requests in the output
function checkForInteractions(output: string, options: ExecuteOptions) {
  // This is a simplified implementation
  // In a real implementation, you would parse the output to detect when Codex is asking for input
  
  // Example: Look for patterns like "[INTERACTION_REQUEST]" in the output
  if (output.includes('[INTERACTION_REQUEST]')) {
    const match = output.match(/\[INTERACTION_REQUEST\](.*?)\[\/INTERACTION_REQUEST\]/s);
    
    if (match && match[1]) {
      try {
        const interaction = JSON.parse(match[1]);
        interaction.id = uuidv4(); // Add a unique ID for the interaction
        options.onInteraction(interaction);
      } catch (error) {
        console.error('Error parsing interaction request:', error);
      }
    }
  }
}

// Parse Codex output to extract results
function parseCodexOutput(output: string): any {
  // This is a simplified implementation
  // In a real implementation, you would parse the JSON output from Codex CLI
  
  // Look for JSON output
  const jsonMatch = output.match(/\{.*\}/s);
  
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error parsing Codex output:', error);
    }
  }
  
  // If no JSON found, return a basic result
  return {
    success: true,
    changes: []
  };
}