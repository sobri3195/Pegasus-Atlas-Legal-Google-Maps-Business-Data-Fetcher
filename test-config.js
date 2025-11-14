// Simple test to verify configuration system

const { getConfig } = require('./dist/main/config/AppConfig');

console.log('=== Pegasus Atlas Configuration Test ===\n');

// Test 1: Default configuration
console.log('Test 1: Default Configuration');
const defaultConfig = getConfig();
console.log('Default Config:', JSON.stringify(defaultConfig, null, 2));
console.log('✓ Default configuration loaded\n');

// Test 2: Custom configuration
console.log('Test 2: Custom Configuration via Environment Variable');
process.env.APP_CONFIG = JSON.stringify({
  automation: 'playwright',
  parser: 'dom-inspector',
  database: 'sqlite'
});
const customConfig = getConfig();
console.log('Custom Config:', JSON.stringify(customConfig, null, 2));
console.log('✓ Custom configuration loaded\n');

// Test 3: Adapter Factory
console.log('Test 3: Adapter Factory');
const { AdapterFactory } = require('./dist/main/config/AdapterFactory');

try {
  const puppeteerAdapter = AdapterFactory.createAutomationAdapter('puppeteer');
  console.log('✓ Puppeteer adapter created:', puppeteerAdapter.constructor.name);
  
  const playwrightAdapter = AdapterFactory.createAutomationAdapter('playwright');
  console.log('✓ Playwright adapter created:', playwrightAdapter.constructor.name);
  
  const seleniumAdapter = AdapterFactory.createAutomationAdapter('selenium');
  console.log('✓ Selenium adapter created:', seleniumAdapter.constructor.name);
  
  const cheerioAdapter = AdapterFactory.createParserAdapter('cheerio');
  console.log('✓ Cheerio adapter created:', cheerioAdapter.constructor.name);
  
  const domAdapter = AdapterFactory.createParserAdapter('dom-inspector');
  console.log('✓ DOM Inspector adapter created:', domAdapter.constructor.name);
  
  console.log('\n=== All Tests Passed ===');
} catch (error) {
  console.error('✗ Test failed:', error.message);
  process.exit(1);
}
