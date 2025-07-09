#!/usr/bin/env node

// Simple cloud deployment entry point for claude-code-router
// This bypasses the CLI and directly starts the server

const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const { homedir } = require('os');

// Setup environment for cloud deployment
const setupCloudEnvironment = () => {
  // Use /tmp for writable directory in cloud environments
  const homeDir = process.env.HOME || '/tmp';
  const configDir = join(homeDir, '.claude-code-router');
  
  // Create config directory if it doesn't exist
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  
  // Create default config if it doesn't exist
  const configFile = join(configDir, 'config.json');
  if (!existsSync(configFile)) {
    const defaultConfig = {
      "LOG": true,
      "Providers": [
        {
          "name": "default",
          "api_base_url": process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions",
          "api_key": process.env.OPENAI_API_KEY || "",
          "models": [process.env.OPENAI_MODEL || "gpt-3.5-turbo"]
        }
      ],
      "Router": {
        "default": `default,${process.env.OPENAI_MODEL || "gpt-3.5-turbo"}`
      }
    };
    
    writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
  }
  
  // Create .claude.json for Claude Code compatibility
  const claudeConfigPath = join(homeDir, '.claude.json');
  if (!existsSync(claudeConfigPath)) {
    const userID = Array.from(
      { length: 64 },
      () => Math.random().toString(16)[2]
    ).join("");
    
    const claudeConfig = {
      numStartups: 184,
      autoUpdaterStatus: "enabled",
      userID,
      hasCompletedOnboarding: true,
      lastOnboardingVersion: "1.0.17",
      projects: {},
    };
    
    writeFileSync(claudeConfigPath, JSON.stringify(claudeConfig, null, 2));
  }
};

// Start the server by simulating the CLI start command
const startServer = async () => {
  setupCloudEnvironment();
  
  const port = parseInt(process.env.PORT || process.env.SERVICE_PORT || '3456');
  
  console.log(`Starting claude-code-router on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Config directory: ${join(process.env.HOME || '/tmp', '.claude-code-router')}`);
  
  // Set environment variable for the service port
  process.env.SERVICE_PORT = port.toString();
  
  // Override process.argv to simulate 'ccr start' command
  process.argv = ['node', 'ccr', 'start'];
  
  // Import and run the CLI
  require('./dist/cli.js');
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});