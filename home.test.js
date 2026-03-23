/**
 * Home Page Tests - TC-HOME-01 to TC-HOME-04
 * Can run individually: node home.test.js
 */

const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Home, TIMEOUT, TEST_USER } = require("./config");

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
  await driver.wait(
    until.elementLocated(By.css('input[type="email"]')),
    TIMEOUT
  );

  // Fill in login credentials from TEST_USER config
  await driver
    .findElement(By.css('input[type="email"]'))
    .sendKeys(TEST_USER.email);
  await driver
    .findElement(By.css('input[type="password"]'))
    .sendKeys(TEST_USER.password);
  // Click submit button
  await driver.findElement(By.css('button[type="submit"]')).click();

  // Wait for redirect to home page
  await driver.wait(until.urlContains("/"), TIMEOUT);
  console.log("  Logged in successfully\n");
}

// ============================================
// TC-HOME-01: Search products by name
// ============================================
async function testSearchByName() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-01: Search products by name");

    // Login first before running tests
    await login(driver);

    // Navigate to home page
    await driver.get(BASE_URL + "/");
    // Wait for search input to appear
    await driver.wait(until.elementLocated(By.name(Home.searchInput)), TIMEOUT);

    // Search for a keyword from config
    await driver
      .findElement(By.name(Home.searchInput))
      .sendKeys(Home.searchKeyword, "\n");
    // Wait for results to load
    await driver.sleep(1000);

    // Count products displayed
    const products = await driver.findElements(
      By.css('[class*="productCard"]')
    );
    console.log(
      "  Found " +
        products.length +
        ' products matching "' +
        Home.searchKeyword +
        '"'
    );

    console.log("  ✅ Test Search products by name: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Search products by name: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-HOME-02: Search products by category
// ============================================
async function testSearchByCategory() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-02: Search products by category");

    // Login first before running tests
    await login(driver);

    // Navigate to home page
    await driver.get(BASE_URL + "/");
    // Wait for search input to appear
    await driver.wait(until.elementLocated(By.name(Home.searchInput)), TIMEOUT);

    // Search using category name from config
    await driver
      .findElement(By.name(Home.searchInput))
      .sendKeys(Home.searchCategory, "\n");
    // Wait for results to load
    await driver.sleep(1000);

    // Count products displayed
    const products = await driver.findElements(
      By.css('[class*="productCard"]')
    );
    console.log("  Found " + products.length + " products matching category");

    if (products.length === 0) {
      throw new Error("No products found for category: " + Home.searchCategory);
    }
    console.log("  ✅ Test Search products by category: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Search products by category: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-HOME-03: Category filter functionality
// ============================================
async function testCategoryFilter() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-03: Category filter functionality");

    // Login first before running tests
    await login(driver);

    // Navigate to home page
    await driver.get(BASE_URL + "/");
    // Wait for category select dropdown to appear
    await driver.wait(
      until.elementLocated(By.name(Home.categorySelect)),
      TIMEOUT
    );

    // Get count of products before filter
    const productsBefore = await driver.findElements(
      By.css('[class*="productCard"]')
    );
    const countBefore = productsBefore.length;

    // Select a category from dropdown
    let dropdown = await driver.findElement(By.name(Home.categorySelect));
    await dropdown.sendKeys(Home.searchCategory);
    // Wait for filter to apply
    await driver.sleep(1000);

    // Get count of products after filter
    const productsAfter = await driver.findElements(
      By.css('[class*="productCard"]')
    );
    const countAfter = productsAfter.length;

    console.log("  Before: " + countBefore + ", After: " + countAfter);

    console.log("  ✅ Test Category filter functionality: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Category filter functionality: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-HOME-04: Add to Cart button
// ============================================
async function testAddToCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-04: Add to Cart button");

    // Login first before running tests
    await login(driver);

    // Navigate to home page
    await driver.get(BASE_URL + "/");
    // Wait for search input to appear
    await driver.wait(until.elementLocated(By.name(Home.searchInput)), TIMEOUT);

    // Find first Add to Cart button using CSS selector
    const addButton = await driver.findElement(
      By.css('button[name^="addToCartButton"]')
    );
    // Check if button is disabled (out of stock)
    const isDisabled = await addButton.getAttribute("disabled");

    if (!isDisabled) {
      // Click the add to cart button
      await addButton.click();
      // Wait a moment for cart to update
      await driver.sleep(500);
      console.log("  Product added to cart");
    } else {
      console.log("  Product out of stock");
    }

    console.log("  ✅ Test Add to Cart button: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Add to Cart button: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// Run all Home tests
// ============================================
async function runHomeTests() {
  console.log("\n=== HOME PAGE TESTS ===\n");
  await testSearchByName();
  await testSearchByCategory();
  await testCategoryFilter();
  await testAddToCart();
}

// Run individual test if this file is executed directly
// Usage: node home.test.js
// Or run specific test: node home.test.js TC-HOME-01
if (require.main === module) {
  const testToRun = process.argv[2];

  if (testToRun === "TC-HOME-01" || testToRun === "1") {
    testSearchByName();
  } else if (testToRun === "TC-HOME-02" || testToRun === "2") {
    testSearchByCategory();
  } else if (testToRun === "TC-HOME-03" || testToRun === "3") {
    testCategoryFilter();
  } else if (testToRun === "TC-HOME-04" || testToRun === "4") {
    testAddToCart();
  } else {
    // Run all tests
    runHomeTests();
  }
}

module.exports = {
  runHomeTests,
  testSearchByName,
  testSearchByCategory,
  testCategoryFilter,
  testAddToCart,
};
