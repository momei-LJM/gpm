/**
 * Simple test runner that uses actual source code functions
 */

import {
  withHttp,
  withHttps,
  escapeShellArg,
  isHttpOrHttps,
  processProxyUrl,
  NPM_REGISTRIES
} from '../src/config.js';

// Test results tracking
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

// Simple assertion functions
const assert = {
  equal: (actual: any, expected: any, message?: string) => {
    if (actual === expected) {
      console.log(`✓ ${message || 'Test passed'}`);
      testsPassed++;
    } else {
      console.log(`✗ ${message || 'Test failed'}: expected ${expected}, got ${actual}`);
      testsFailed++;
    }
    testsRun++;
  },

  true: (value: any, message?: string) => {
    assert.equal(value, true, message);
  },

  false: (value: any, message?: string) => {
    assert.equal(value, false, message);
  }
};

// Test suites using actual source code functions
function testUrlValidation() {
  console.log('\n=== URL Validation Tests (using src/config.ts) ===');

  assert.true(
    isHttpOrHttps('http://proxy.example.com:8080'),
    'Should detect HTTP URLs'
  );

  assert.true(
    isHttpOrHttps('https://proxy.example.com:8080'),
    'Should detect HTTPS URLs'
  );

  assert.false(
    isHttpOrHttps('proxy.example.com:8080'),
    'Should not detect plain URLs as HTTP/HTTPS'
  );

  assert.false(
    isHttpOrHttps('ftp://proxy.example.com:8080'),
    'Should not detect FTP URLs as HTTP/HTTPS'
  );

  assert.false(
    isHttpOrHttps(''),
    'Should handle empty strings'
  );
}

function testProxyUrlProcessing() {
  console.log('\n=== Proxy URL Processing Tests (using src/config.ts) ===');

  assert.equal(
    processProxyUrl('http://proxy.example.com:8080'),
    'proxy.example.com:8080',
    'Should strip HTTP prefix'
  );

  assert.equal(
    processProxyUrl('https://proxy.example.com:8080'),
    'proxy.example.com:8080',
    'Should strip HTTPS prefix'
  );

  assert.equal(
    processProxyUrl('proxy.example.com:8080'),
    'proxy.example.com:8080',
    'Should leave plain URLs unchanged'
  );
}

function testUrlPrefixing() {
  console.log('\n=== URL Prefixing Tests (using src/config.ts) ===');

  assert.equal(
    withHttp('proxy.example.com:8080'),
    'http://proxy.example.com:8080',
    'Should add HTTP prefix'
  );

  assert.equal(
    withHttps('proxy.example.com:8080'),
    'https://proxy.example.com:8080',
    'Should add HTTPS prefix'
  );
}

function testShellEscaping() {
  console.log('\n=== Shell Escaping Tests (using src/config.ts) ===');

  assert.equal(
    escapeShellArg('proxy.example.com:8080'),
    '"proxy.example.com:8080"',
    'Should quote normal strings'
  );

  assert.equal(
    escapeShellArg('proxy"with"quotes:8080'),
    '"proxy\\"with\\"quotes:8080"',
    'Should escape double quotes'
  );

  assert.equal(
    escapeShellArg(''),
    '""',
    'Should handle empty strings'
  );
}

function testNpmRegistries() {
  console.log('\n=== NPM Registries Tests (using src/config.ts) ===');

  assert.true(
    typeof NPM_REGISTRIES === 'object',
    'NPM_REGISTRIES should be an object'
  );

  assert.true(
    NPM_REGISTRIES.npm === 'https://registry.npmjs.org/',
    'Should have npm registry'
  );

  assert.true(
    NPM_REGISTRIES.taobao === 'https://registry.npmmirror.com/',
    'Should have taobao registry'
  );

  assert.true(
    Object.keys(NPM_REGISTRIES).length > 0,
    'Should have multiple registry presets'
  );
}

// Run all tests
function runTests() {
  console.log('🧪 Running GPM Tests (using actual source code)...\n');

  testUrlValidation();
  testProxyUrlProcessing();
  testUrlPrefixing();
  testShellEscaping();
  testNpmRegistries();

  console.log('\n=== Test Results ===');
  console.log(`Total tests: ${testsRun}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log(`Success rate: ${((testsPassed / testsRun) * 100).toFixed(2)}%`);

  if (testsFailed > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

// Run the tests
runTests();
