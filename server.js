#!/usr/bin/env node

// Cloud deployment entry point for claude-code-router
// This file starts the server directly without CLI wrapper

const { run } = require('./dist/cli.js');

// Override some constants for cloud deployment
process.env.HOME = process.env.HOME || '/tmp';
process.env.SERVICE_PORT = process.env.PORT || process.env.SERVICE_PORT || '3456';

// Start the server
run({ port: parseInt(process.env.SERVICE_PORT) }).catch(console.error);