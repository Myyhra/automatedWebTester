const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Checkout, Cart, TIMEOUT, TEST_USER } = require("./config");

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

async function ensureCartHasItems(driver) {
  console.log("  Checking cart...");

  await driver.get(BASE_URL + "/cart");

  try {
    await driver.wait(
      until.elementLocated(By.name(Cart.proceedToCheckoutButton)),
      TIMEOUT
    );
  } catch (e) {
    await driver.sleep(2000);
  }

  await driver.sleep(1000);

  const emptyCartMessage = await driver.findElements(
    By.xpath("//h2[contains(text(), 'Your cart is empty')]")
  );
  const items = await driver.findElements(By.css('[class*="cartItem"]'));

  if (items.length === 0 && emptyCartMessage.length === 0) {
    await driver.sleep(2000);
    const itemsAfterWait = await driver.findElements(
      By.css('[class*="cartItem"]')
    );

    if (itemsAfterWait.length === 0) {
      console.log("  Cart is empty, adding item first...");
      // Go to home page
      await driver.get(BASE_URL + "/");
      // Wait for page to load
      await driver.wait(until.urlContains("/"), TIMEOUT);
      // Wait for add to cart button
      await driver.wait(
        until.elementLocated(By.css('button[name^="addToCartButton"]')),
        TIMEOUT
      );
      // Add item to cart
      const addButton = await driver.findElement(
        By.css('button[name^="addToCartButton"]')
      );
      await addButton.click();
      await driver.sleep(1000);
      console.log("  Item added to cart");
    }
  } else {
    console.log("  Cart already has items");
  }
}

async function testDisplayOrderSummary() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CHK-01: Display order summary");

    await login(driver);

    await ensureCartHasItems(driver);

    await driver.findElement(By.name(Cart.proceedToCheckoutButton)).click();

    await driver.wait(until.urlContains("/checkout"), TIMEOUT);

    await driver.wait(
      until.elementLocated(By.name(Checkout.placeOrderButton)),
      TIMEOUT
    );

    const items = await driver.findElements(By.css('[class*="summaryItem"]'));
    console.log("  Order has " + items.length + " item(s)");

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

async function testPlaceOrder() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-CHK-02: Place order function");

    await login(driver);

    await ensureCartHasItems(driver);

    await driver.findElement(By.name(Cart.proceedToCheckoutButton)).click();

    await driver.wait(until.urlContains("/checkout"), TIMEOUT);

    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[contains(text(), 'Shipping Address')]")
      ),
      TIMEOUT
    );

    await driver.sleep(1000);

    const fullNameInput = await driver.wait(
      until.elementLocated(By.css('input[name="fullNameInput"]')),
      TIMEOUT
    );
    await fullNameInput.clear();
    await fullNameInput.sendKeys(Checkout.testFullName);

    const addressInput = await driver.wait(
      until.elementLocated(By.css('input[name="addressInput"]')),
      TIMEOUT
    );
    await addressInput.clear();
    await addressInput.sendKeys(Checkout.testAddress);

    const cityInput = await driver.wait(
      until.elementLocated(By.css('input[name="cityInput"]')),
      TIMEOUT
    );
    await cityInput.clear();
    await cityInput.sendKeys(Checkout.testCity);

    const postalCodeInput = await driver.wait(
      until.elementLocated(By.css('input[name="postalCodeInput"]')),
      TIMEOUT
    );
    await postalCodeInput.clear();
    await postalCodeInput.sendKeys(Checkout.testPostalCode);

    const countryInput = await driver.wait(
      until.elementLocated(By.css('input[name="countryInput"]')),
      TIMEOUT
    );
    await countryInput.clear();
    await countryInput.sendKeys(Checkout.testCountry);

    await driver.findElement(By.name(Checkout.placeOrderButton)).click();

    try {
      await driver.wait(until.urlContains("/order-success"), TIMEOUT);
      console.log("  Order placed successfully");
      console.log("  ✅ Test Place order function: Success");
    } catch (e) {
      try {
        const error = await driver.findElement(
          By.css('[class*="errorMessage"]')
        );
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
