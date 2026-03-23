const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Login } = require("./config");

async function launchBrowser() {
  let driver = await new Builder().forBrowser("chrome").build();
  return driver;
}

async function Test_LoginUser() {
  const driver = await launchBrowser();
  console.log("Test: LoginUser");
  try {
    await driver.get(`${BASE_URL}/login`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Login.emailElement)),
      10000
    );
    await emailInput.sendKeys(Login.email);
    const passwordInput = await driver.wait(
      until.elementLocated(By.id(Login.passwordElement)),
      10000
    );
    await passwordInput.sendKeys(Login.password);
    await driver.findElement(By.name("loginButton")).click();

    const welcomeElement = await driver.wait(
      until.elementLocated(By.id(Login.welcomeMessageElement)),
      10000
    );

    const welcomeText = await welcomeElement.getText();
    assert.strictEqual(
      welcomeText,
      Login.welcomeMessage,
      "Welcome message mismatch"
    );
    // assert.ok(title.includes("Home"), "Title does not include 'Home'");

    console.log("✅Test Login User: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Login User: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_LoginCredentialsInvalid() {
  const driver = await launchBrowser();
  console.log("Test: Invalid Login Credentials");
  try {
    await driver.get(`${BASE_URL}/login`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Login.emailElement)),
      10000
    );
    await emailInput.sendKeys("FakeUser@email.com");
    const passwordInput = await driver.wait(
      until.elementLocated(By.id(Login.passwordElement)),
      10000
    );
    await passwordInput.sendKeys("FakePassword");
    await driver.findElement(By.name(Login.buttonName)).click();

    const element = await driver.wait(
      until.elementLocated(By.name(Login.FormErrorElement)),
      10000
    );

    const message = await element.getText();

    assert.strictEqual(message, Login.invalidUserErrorMessage, "Text mismatch");

    console.log("✅Test Invalid Login Credentials: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Invalid Login Credentials: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_LoginUserWithInvalidEmail() {
  const driver = await launchBrowser();
  console.log("Test: Invalid Login Email");
  try {
    await driver.get(`${BASE_URL}/login`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Login.emailElement)),
      10000
    );
    await emailInput.sendKeys("FakeUser@email.com");

    const passwordInput = await driver.wait(
      until.elementLocated(By.id(Login.passwordElement)),
      10000
    );
    await passwordInput.sendKeys(Login.password);

    await driver.findElement(By.name(Login.buttonName)).click();

    const element = await driver.wait(
      until.elementLocated(By.name(Login.FormErrorElement)),
      10000
    );

    const message = await element.getText();

    assert.strictEqual(message, Login.invalidUserErrorMessage, "Text mismatch");

    console.log("✅Test Invalid Login Email: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Invalid Login Email: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_LoginUserWithInvalidPassword() {
  const driver = await launchBrowser();
  console.log("Test: Invalid Password Login User");
  try {
    await driver.get(`${BASE_URL}/login`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Login.emailElement)),
      10000
    );
    await emailInput.sendKeys(Login.email);
    const passwordInput = await driver.wait(
      until.elementLocated(By.id(Login.passwordElement)),
      10000
    );
    await passwordInput.sendKeys("FakePassword");
    await driver.findElement(By.name(Login.buttonName)).click();

    const element = await driver.wait(
      until.elementLocated(By.name(Login.FormErrorElement)),
      10000
    );

    const message = await element.getText();

    assert.strictEqual(message, Login.invalidUserErrorMessage, "Text mismatch");

    console.log("✅Test Invalid Password Login User: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Invalid Password Login User: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_MissingUsernameError() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Missing Username Error");
    await driver.get(`${BASE_URL}/login`);
    // await emailInput.sendKeys(Login.email);
    const passwordInput = await driver.wait(
      until.elementLocated(By.id(Login.passwordElement)),
      10000
    );
    await passwordInput.sendKeys(Login.password);
    await driver.findElement(By.name(Login.buttonName)).click();

    const emailInput = await driver.findElement(By.id(Login.emailElement));
    // Wait until validation message appears
    await driver.wait(async () => {
      const msg = await emailInput.getAttribute("validationMessage");
      return msg && msg.length > 0;
    }, 10000);

    const validationMessage = await emailInput.getAttribute(
      "validationMessage"
    );
    assert.ok(
      validationMessage.length > 0,
      "Expected validation message for missing username"
    );

    console.log("✅Test Missing Username Error: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Missing Username Error: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_MissingPasswordError() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Missing Password Error");
    await driver.get(`${BASE_URL}/login`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Login.emailElement)),
      10000
    );
    await emailInput.sendKeys(Login.email);
    await driver.findElement(By.name(Login.buttonName)).click();

    const passwordInput = await driver.findElement(
      By.id(Login.passwordElement)
    );
    // Wait until validation message appears
    await driver.wait(async () => {
      const msg = await passwordInput.getAttribute("validationMessage");
      return msg && msg.length > 0;
    }, 2000);

    const validationMessage = await passwordInput.getAttribute(
      "validationMessage"
    );
    assert.ok(
      validationMessage.length > 0,
      "Expected validation message for missing password"
    );

    console.log("✅Test Missing Password Error: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Missing Password Error: Failed");
  } finally {
    await driver.quit();
  }
}

async function runLoginTest() {
  await Test_LoginUser();
  await Test_LoginCredentialsInvalid();
  await Test_LoginUserWithInvalidEmail();
  await Test_LoginUserWithInvalidPassword();
  await Test_MissingUsernameError();
  await Test_MissingPasswordError();
}

runLoginTest();

/* async function Test_MissingUsernameError() {
    const driver = await launchBrowser();
    try
    {

    }
    catch(e)
    {
        console.log("Error: " + e);
        console.log("❌Test Missing Username Error: Failed");
    }
    finally
    {
        await driver.quit();
    }
} */
