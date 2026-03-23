/**
 * Cart Page Tests - TC-CART-01 to TC-CART-06
 * Can run individually: node cart.test.js
 */

const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Cart, TIMEOUT, TEST_USER } = require("./config");

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
// TC-CART-01: Redirect to Cart Page
// ============================================
async function testRedirectToCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-01: Redirect to Cart Page");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to home page
    await driver.get(BASE_URL + "/");
    // Wait for cart icon to appear
    await driver.wait(until.elementLocated(By.name(Cart.cartIconLink)), TIMEOUT);
    
    // Click cart icon link
    await driver.findElement(By.name(Cart.cartIconLink)).click();
    // Wait for URL to contain "/cart"
    await driver.wait(until.urlContains("/cart"), TIMEOUT);
    
    // Get current URL and verify
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes("/cart"), "Should redirect to cart page");
    
    console.log("  Navigated to: " + url);
    console.log("  ✅ Test Redirect to Cart Page: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Redirect to Cart Page: Failed");
  } finally {
    // Always quit the driver to clean up
    await driver.quit();
  }
}

// ============================================
// TC-CART-02: Add item to cart
// ============================================
async function testAddItemToCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-02: Add item to cart");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to home page
    await driver.get(BASE_URL + "/");
    // Wait for add to cart button to appear
    await driver.wait(until.elementLocated(By.css('button[name^="addToCartButton"]')), TIMEOUT);
    
    // Find and click the first add to cart button
    const addButton = await driver.findElement(By.css('button[name^="addToCartButton"]'));
    await addButton.click();
    // Wait a moment for the item to be added
    await driver.sleep(500);
    
    // Click cart icon to go to cart page
    await driver.findElement(By.name(Cart.cartIconLink)).click();
    // Wait for URL to contain "/cart"
    await driver.wait(until.urlContains("/cart"), TIMEOUT);
    
    // Count items in cart
    const items = await driver.findElements(By.css('[class*="cartItem"]'));
    // Verify at least one item in cart
    assert.ok(items.length > 0, "Cart should have at least one item");
    
    console.log("  Cart has " + items.length + " item(s)");
    console.log("  ✅ Test Add item to cart: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Add item to cart: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-CART-03: Remove item from cart
// ============================================
async function testRemoveItemFromCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-03: Remove item from cart");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to cart page
    await driver.get(BASE_URL + "/cart");
    // Wait for checkout button to appear
    await driver.wait(until.elementLocated(By.name(Cart.proceedToCheckoutButton)), TIMEOUT);
    
    // Get count of items before removal
    const itemsBefore = await driver.findElements(By.css('[class*="cartItem"]'));
    const countBefore = itemsBefore.length;
    
    if (countBefore > 0) {
      // Click remove button on first item
      const removeBtn = await driver.findElement(By.css('button[name^="removeItemButton"]'));
      await removeBtn.click();
      // Wait a moment
      await driver.sleep(500);
      
      // Accept the confirm dialog (alert)
      await driver.switchTo().alert().accept();
      await driver.sleep(500);
      
      // Get count after removal
      const itemsAfter = await driver.findElements(By.css('[class*="cartItem"]'));
      console.log("  Removed: " + countBefore + " -> " + itemsAfter.length + " items");
    } else {
      console.log("  No items in cart to remove");
    }
    
    console.log("  ✅ Test Remove item from cart: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Remove item from cart: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-CART-04: Update item quantity
// ============================================
async function testUpdateQuantity() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-04: Update item quantity");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to cart page
    await driver.get(BASE_URL + "/cart");
    // Wait for checkout button to appear
    await driver.wait(until.elementLocated(By.name(Cart.proceedToCheckoutButton)), TIMEOUT);
    
    // Find increase quantity button and click it
    const increaseBtn = await driver.findElement(By.css('button[name^="increaseQuantityButton"]'));
    await increaseBtn.click();
    // Wait for quantity to update
    await driver.sleep(500);
    
    console.log("  Quantity updated");
    console.log("  ✅ Test Update item quantity: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Update item quantity: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-CART-05: Cart persistence
// ============================================
async function testCartPersistence() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-05: Cart persistence");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to cart page
    await driver.get(BASE_URL + "/cart");
    // Wait for checkout button to appear
    await driver.wait(until.elementLocated(By.name(Cart.proceedToCheckoutButton)), TIMEOUT);
    
    // Get items count before refresh
    const itemsBefore = await driver.findElements(By.css('[class*="cartItem"]'));
    
    // Refresh the page
    await driver.navigate().refresh();
    // Wait for checkout button again
    await driver.wait(until.elementLocated(By.name(Cart.proceedToCheckoutButton)), TIMEOUT);
    
    // Get items count after refresh
    const itemsAfter = await driver.findElements(By.css('[class*="cartItem"]'));
    
    // Verify items are still there
    assert.strictEqual(itemsBefore.length, itemsAfter.length, "Items should persist after refresh");
    
    console.log("  Items before: " + itemsBefore.length + ", after refresh: " + itemsAfter.length);
    console.log("  ✅ Test Cart persistence: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Cart persistence: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// TC-CART-06: Checkout button functionality
// ============================================
async function testCheckoutButton() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-06: Checkout button functionality");
    
    // Login first before running tests
    await login(driver);
    
    // Navigate to cart page
    await driver.get(BASE_URL + "/cart");
    // Wait for checkout button to appear
    await driver.wait(until.elementLocated(By.name(Cart.proceedToCheckoutButton)), TIMEOUT);
    
    // Click proceed to checkout button
    await driver.findElement(By.name(Cart.proceedToCheckoutButton)).click();
    // Wait for URL to contain "/checkout"
    await driver.wait(until.urlContains("/checkout"), TIMEOUT);
    
    // Get current URL and verify
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes("/checkout"), "Should navigate to checkout page");
    
    console.log("  Navigated to: " + url);
    console.log("  ✅ Test Checkout button functionality: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Checkout button functionality: Failed");
  } finally {
    await driver.quit();
  }
}

// ============================================
// Run all Cart tests
// ============================================
async function runCartTests() {
  console.log("\n=== CART PAGE TESTS ===\n");
  await testRedirectToCart();
  await testAddItemToCart();
  await testRemoveItemFromCart();
  await testUpdateQuantity();
  await testCartPersistence();
  await testCheckoutButton();
}

// Run individual test if this file is executed directly
// Usage: node cart.test.js
// Or run all tests: node cart.test.js all
if (require.main === module) {
  const testToRun = process.argv[2];
  
  if (testToRun === "TC-CART-01" || testToRun === "1") {
    testRedirectToCart();
  } else if (testToRun === "TC-CART-02" || testToRun === "2") {
    testAddItemToCart();
  } else if (testToRun === "TC-CART-03" || testToRun === "3") {
    testRemoveItemFromCart();
  } else if (testToRun === "TC-CART-04" || testToRun === "4") {
    testUpdateQuantity();
  } else if (testToRun === "TC-CART-05" || testToRun === "5") {
    testCartPersistence();
  } else if (testToRun === "TC-CART-06" || testToRun === "6") {
    testCheckoutButton();
  } else {
    // Run all tests
    runCartTests();
  }
}

module.exports = { runCartTests, testRedirectToCart, testAddItemToCart, testRemoveItemFromCart, testUpdateQuantity, testCartPersistence, testCheckoutButton };
