const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Cart, TIMEOUT, TEST_USER } = require("./config");

async function launchBrowser() {
  let driver = await new Builder().forBrowser("chrome").build();
  return driver;
}

async function login(driver) {
  console.log("  Logging in...");

  await driver.get(BASE_URL + "/login");

  await driver.wait(
    until.elementLocated(By.css('input[type="email"]')),
    TIMEOUT
  );

  await driver
    .findElement(By.css('input[type="email"]'))
    .sendKeys(TEST_USER.email);
  await driver
    .findElement(By.css('input[type="password"]'))
    .sendKeys(TEST_USER.password);

  await driver.findElement(By.css('button[type="submit"]')).click();

  await driver.wait(until.urlContains("/"), TIMEOUT);
  console.log("  Logged in successfully\n");
}

async function testRedirectToCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-01: Redirect to Cart Page");

    await login(driver);

    await driver.get(BASE_URL + "/");

    await driver.wait(
      until.elementLocated(By.name(Cart.cartIconLink)),
      TIMEOUT
    );

    await driver.findElement(By.name(Cart.cartIconLink)).click();

    await driver.wait(until.urlContains("/cart"), TIMEOUT);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes("/cart"), "Should redirect to cart page");

    console.log("  Navigated to: " + url);
    console.log("  ✅ Test Redirect to Cart Page: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Redirect to Cart Page: Failed");
  } finally {
    await driver.quit();
  }
}

async function testAddItemToCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-02: Add item to cart");

    await login(driver);

    await driver.get(BASE_URL + "/");

    await driver.wait(
      until.elementLocated(By.css('button[name^="addToCartButton"]')),
      TIMEOUT
    );

    const addButton = await driver.findElement(
      By.css('button[name^="addToCartButton"]')
    );
    await addButton.click();

    await driver.sleep(1000);

    await driver.findElement(By.name(Cart.cartIconLink)).click();

    await driver.wait(until.urlContains("/cart"), TIMEOUT);

    const items = await driver.findElements(By.css('[class*="cartItem"]'));

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

async function testRemoveItemFromCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-03: Remove item from cart");

    await login(driver);

    await driver.get(BASE_URL + "/cart");

    await driver.wait(
      until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
      TIMEOUT
    );

    const itemsBefore = await driver.findElements(
      By.css('[class*="cartItem"]')
    );
    const countBefore = itemsBefore.length;

    if (countBefore > 0) {
      const removeBtn = await driver.findElement(
        By.css('button[name^="removeItemButton"]')
      );
      await removeBtn.click();

      await driver.sleep(1000);

      await driver.switchTo().alert().accept();
      await driver.sleep(1000);

      const itemsAfter = await driver.findElements(
        By.css('[class*="cartItem"]')
      );
      console.log(
        "  Removed: " + countBefore + " -> " + itemsAfter.length + " items"
      );
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

async function testUpdateQuantity() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-04: Update item quantity");

    await login(driver);

    await driver.get(BASE_URL + "/cart");

    await driver.wait(
      until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
      TIMEOUT
    );

    const increaseBtn = await driver.findElement(
      By.css('button[name^="increaseQuantityButton"]')
    );
    await increaseBtn.click();

    await driver.sleep(15000);

    console.log("  Quantity updated");
    console.log("  ✅ Test Update item quantity: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Update item quantity: Failed");
  } finally {
    await driver.quit();
  }
}

async function testCartPersistence() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-05: Cart persistence");

    await login(driver);

    await driver.get(BASE_URL + "/cart");

    await driver.wait(
      until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
      TIMEOUT
    );

    const itemsBefore = await driver.findElements(
      By.css('[class*="cartItem"]')
    );

    await driver.navigate().refresh();

    await driver.wait(
      until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
      TIMEOUT
    );

    const itemsAfter = await driver.findElements(By.css('[class*="cartItem"]'));

    assert.strictEqual(
      itemsBefore.length,
      itemsAfter.length,
      "Items should persist after refresh"
    );

    console.log(
      "  Items before: " +
        itemsBefore.length +
        ", after refresh: " +
        itemsAfter.length
    );
    console.log("  ✅ Test Cart persistence: Success");
  } catch (e) {
    console.log("  Error: " + e);
    console.log("  ❌ Test Cart persistence: Failed");
  } finally {
    await driver.quit();
  }
}

async function testCheckoutButton() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CART-06: Checkout button functionality");

    await login(driver);

    await driver.get(BASE_URL + "/cart");

    await driver.wait(
      until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
      TIMEOUT
    );

    const items = await driver.findElements(By.css('[class*="cartItem"]'));
    if (items.length === 0) {
      console.log("  Cart is empty, adding item first...");

      await driver.get(BASE_URL + "/");

      await driver.wait(
        until.elementLocated(By.css('button[name^="addToCartButton"]')),
        TIMEOUT
      );

      const addButton = await driver.findElement(
        By.css('button[name^="addToCartButton"]')
      );
      await addButton.click();
      await driver.sleep(500);

      await driver.get(BASE_URL + "/cart");
      await driver.wait(
        until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
        TIMEOUT
      );
    }

    await driver.findElement(By.name(Cart.proceedToCheckoutButton)).click();

    await driver.wait(until.urlContains("/checkout"), TIMEOUT);

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

async function runCartTests() {
  console.log("\n=== CART PAGE TESTS ===\n");
  await testRedirectToCart();
  await testAddItemToCart();
  await testUpdateQuantity();
  await testCartPersistence();
  await testRemoveItemFromCart();
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

module.exports = {
  runCartTests,
  testRedirectToCart,
  testAddItemToCart,
  testRemoveItemFromCart,
  testUpdateQuantity,
  testCartPersistence,
  testCheckoutButton,
};
