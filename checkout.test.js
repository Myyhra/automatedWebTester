/**
 * Checkout Page Tests - TC-CHK-01 to TC-CHK-02
 * Can run individually: node checkout.test.js
 */

const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Checkout, TIMEOUT, TEST_USER } = require("./config");

// ============================================
// Helper: Launch Browser
// ============================================
async function launchBrowser() {
  // Build a new Chrome driver for each test
  let driver = await new Builder().forBrowser("chrome").build();
  return driver;
}

// ============================================
// Helper: Login before tests
// ============================================
async function login(driver) {
  console.log("  Logging in...");
  // Navigate to login page
  await driver.get(BASE_URL + "/login");
  // Wait for email input to appear
  await driver.wait(until.elementLocated(By.css('input[type="email"]')), TIMEOUT);
  
  // Fill in login credentials from TEST_USER config
  await driver.findElement(By.css('input[type="email"]')).sendKeys(TEST_USER.email);
  await driver.findElement(By.css('input[type="password"]')).sendKeys(TEST_USER.password);
  // Click submit button
  await driver.findElement(By.css('button[type="submit"]')).click();
  
  // Wait for redirect to home page
  await driver.wait(until.urlContains("/"), TIMEOUT);
  console.log("  Logged in successfully\n");
}

// ============================================
// TC-CHK-01: Display order summary
// ============================================
async function testDisplayOrderSummary() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CHK-01: Display order summary");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to checkout page
    await driver.get(BASE_URL + "/checkout");
    // Wait for place order button to appear
    await driver.wait(until.elementLocated(By.name(Checkout.placeOrderButton)), TIMEOUT);
    
    // Check order items are displayed
    const items = await driver.findElements(By.css('[class*="summaryItem"]'));
    console.log("  Order has " + items.length + " item(s)");
    
    // Check total is displayed
    const total = await driver.findElement(By.css('[class*="summaryTotal"]'));
    const totalText = await total.getText();
    console.log("  Total: " + totalText);
    
    console.log("  ✅ Test Display order summary: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Display order summary: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-CHK-02: Place order function
// ============================================
async function testPlaceOrder() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CHK-02: Place order function");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to checkout page
    await driver.get(BASE_URL + "/checkout");
    // Wait for place order button to appear
    await driver.wait(until.elementLocated(By.name(Checkout.placeOrderButton)), TIMEOUT);
    
    // Fill shipping form with test data from config
    await driver.findElement(By.name(Checkout.fullNameInput)).sendKeys(Checkout.testFullName);
    await driver.findElement(By.name(Checkout.addressInput)).sendKeys(Checkout.testAddress);
    await driver.findElement(By.name(Checkout.cityInput)).sendKeys(Checkout.testCity);
    await driver.findElement(By.name(Checkout.postalCodeInput)).sendKeys(Checkout.testPostalCode);
    await driver.findElement(By.name(Checkout.countryInput)).sendKeys(Checkout.testCountry);
    
    // Click Place Order button
    await driver.findElement(By.name(Checkout.placeOrderButton)).click();
    
    // Wait for success page (order-success URL)
    try {
      await driver.wait(until.urlContains("/order-success"), TIMEOUT);
      console.log("  Order placed successfully");
      console.log("  ✅ Test Place order function: Success");
    } catch (e) {
      // If not redirected, check for error message
      try {
        const error = await driver.findElement(By.css('[class*="errorMessage"]'));
        const errorText = await error.getText();
        console.log("  Error: " + errorText);
      } catch (e2) {
        console.log("  Could not verify order placement");
      }
      console.log("  ❌ Test Place order function: Failed");
    }
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Place order function: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// Run all Checkout tests
// ============================================
async function runCheckoutTests() {
  console.log("\n=== CHECKOUT PAGE TESTS ===\n");
  await testDisplayOrderSummary();
  await testPlaceOrder();
}

// Run individual test if this file is executed directly
// Usage: node checkout.test.js
// Or run specific test: node checkout.test.js TC-CHK-01
if (require.main === module) {
  const testToRun = process.argv[2];
  
  if (testToRun === "TC-CHK-01" || testToRun === "1") {
    testDisplayOrderSummary();
  } else if (testToRun === "TC-CHK-02" || testToRun === "2") {
    testPlaceOrder();
  } else {
    // Run all tests
    runCheckoutTests();
  }
}

module.exports = { runCheckoutTests, testDisplayOrderSummary, testPlaceOrder };
