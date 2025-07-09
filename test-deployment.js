#!/usr/bin/env node

// Test script to verify claude-code-router deployment

const http = require('http');

const testEndpoint = (host, port, path = '/') => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

const testApiCall = (host, port) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message"
        }
      ],
      max_tokens: 10
    });

    const options = {
      hostname: host,
      port: port,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
};

async function runTests() {
  const host = process.argv[2] || 'localhost';
  const port = parseInt(process.argv[3]) || 3456;

  console.log(`Testing claude-code-router at ${host}:${port}`);
  console.log('=' .repeat(50));

  // Test 1: Basic connectivity
  try {
    console.log('Test 1: Basic connectivity...');
    const response = await testEndpoint(host, port);
    console.log(`✅ Server is responding (Status: ${response.statusCode})`);
  } catch (error) {
    console.log(`❌ Server connectivity failed: ${error.message}`);
    return;
  }

  // Test 2: API endpoint
  try {
    console.log('Test 2: API endpoint test...');
    const response = await testApiCall(host, port);
    console.log(`✅ API endpoint is responding (Status: ${response.statusCode})`);
    
    // Parse response to check if it's a valid error or success
    try {
      const parsed = JSON.parse(response.body);
      if (parsed.error) {
        console.log(`   Response: ${parsed.error.message}`);
        if (parsed.error.message.includes('provider') || parsed.error.message.includes('API')) {
          console.log('   ✅ This is expected with test credentials');
        }
      } else {
        console.log('   ✅ Successful API response');
      }
    } catch (e) {
      console.log('   Response body:', response.body.substring(0, 200));
    }
  } catch (error) {
    console.log(`❌ API endpoint test failed: ${error.message}`);
  }

  console.log('=' .repeat(50));
  console.log('Test completed!');
  console.log('');
  console.log('If the tests pass, your claude-code-router is ready to use with Claude Code:');
  console.log('');
  console.log('export ANTHROPIC_BASE_URL=http://' + host + ':' + port);
  console.log('export ANTHROPIC_API_KEY=any-string');
  console.log('claude-code');
}

runTests().catch(console.error);