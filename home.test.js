const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Home, TIMEOUT, TEST_USER } = require("./config");

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

async function testSearchByName() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-01: Search products by name");

    await login(driver);

    await driver.get(BASE_URL + "/");

    await driver.wait(until.elementLocated(By.name(Home.searchInput)), TIMEOUT);

    await driver
      .findElement(By.name(Home.searchInput))
      .sendKeys(Home.searchKeyword, "\n");

    await driver.sleep(1000);

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

async function testSearchByCategory() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-02: Search products by category");

    await login(driver);

    await driver.get(BASE_URL + "/");

    await driver.wait(until.elementLocated(By.name(Home.searchInput)), TIMEOUT);

    await driver
      .findElement(By.name(Home.searchInput))
      .sendKeys(Home.searchCategory, "\n");

    await driver.sleep(1000);

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

async function testCategoryFilter() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-03: Category filter functionality");

    await login(driver);

    await driver.get(BASE_URL + "/");

    await driver.wait(
      until.elementLocated(By.name(Home.categorySelect)),
      TIMEOUT
    );

    const productsBefore = await driver.findElements(
      By.css('[class*="productCard"]')
    );
    const countBefore = productsBefore.length;

    let dropdown = await driver.findElement(By.name(Home.categorySelect));
    await dropdown.sendKeys(Home.searchCategory);

    await driver.sleep(1000);

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

async function testAddToCart() {
  const driver = await launchBrowser();
  try {
    console.log("Test: TC-HOME-04: Add to Cart button");

    await login(driver);

    await driver.get(BASE_URL + "/");

    await driver.wait(until.elementLocated(By.name(Home.searchInput)), TIMEOUT);

    const addButton = await driver.findElement(
      By.css('button[name^="addToCartButton"]')
    );

    const isDisabled = await addButton.getAttribute("disabled");

    if (!isDisabled) {
      await addButton.click();

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
