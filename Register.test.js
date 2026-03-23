const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { BASE_URL, Register } = require("./config");
// const { register } = require("module");

async function launchBrowser() {
  let driver = await new Builder().forBrowser("chrome").build();
  return driver;
}
async function Test_RegisterUser() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Register User");
    await driver.get(`${BASE_URL}/register`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Register.emailElement)),
      5000
    );
    await emailInput.sendKeys(Register.email);
    await driver
      .findElement(By.id(Register.passwordElement))
      .sendKeys(Register.password);
    await driver
      .findElement(By.id(Register.confirmpasswordID))
      .sendKeys(Register.password);
    await driver.findElement(By.name(Register.registerButtonElement)).click();
    await driver.wait(until.urlContains("login"), 5000);
    // assert.ok(url.includes("Login"), "Title does not include 'Login'");
    console.log("✅Test Register User: Success");
    console.log(
      "Check the database to confirm the user was registered successfully"
    );
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Register User: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_UserAlreadyExists() {
  const driver = await launchBrowser();
  try {
    console.log("Test: User Already Exists");
    await driver.get(`${BASE_URL}/register`);
    await driver
      .findElement(By.id(Register.emailElement))
      .sendKeys(Register.registeredEmail);
    await driver
      .findElement(By.id(Register.passwordElement))
      .sendKeys(Register.password);
    await driver
      .findElement(By.id(Register.confirmpasswordID))
      .sendKeys(Register.password);
    await driver.findElement(By.name(Register.registerButtonElement)).click();

    const element = await driver.wait(
      until.elementLocated(By.name(Register.FormErrorElement)),
      5000
    );

    const message = await element.getText();

    assert.strictEqual(
      message,
      Register.userExistsErrorMessage,
      "Text mismatch"
    );

    console.log("✅Test User Already Exists: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test User Already Exists: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_UsernameMissingError() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Username Missing Error");
    await driver.get(`${BASE_URL}/register`);
    const passwordInput = await driver.wait(
      until.elementLocated(By.id(Register.passwordElement)),
      5000
    );
    await passwordInput.sendKeys(Register.password);

    await driver
      .findElement(By.id(Register.confirmpasswordID))
      .sendKeys(Register.password);
    await driver.findElement(By.name(Register.registerButtonElement)).click();

    const emailInput = await driver.findElement(By.id(Register.emailElement));
    // Wait until validation message appears
    await driver.wait(async () => {
      const msg = await emailInput.getAttribute("validationMessage");
      return msg && msg.length > 0;
    }, 2000);

    const validationMessage = await emailInput.getAttribute(
      "validationMessage"
    );
    assert.ok(
      validationMessage.length > 0,
      "Expected validation message for missing email"
    );

    /* 

    // Check HTML5 validation state
    const isInvalid = await emailInput.getAttribute("aria-invalid");

    assert.strictEqual(isInvalid, "true", "Email field should be invalid"); */

    /* // Alternatively, check for custom error message
    // This would work if HTML5 validation is bypassed
    let message = await driver.wait(
      until.elementLocated(By.name("UserAlreadyExistsMessage")).getText(),
      5000
    );
    assert.strictEqual(message, "Username is required", "Text mismatch"); */

    console.log("✅Test Username Missing Error: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Username Missing Error: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_PasswordRequirementError() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Password Requirement Error");
    await driver.get(`${BASE_URL}/register`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Register.emailElement)),
      5000
    );
    await emailInput.sendKeys(Register.email);
    await driver.findElement(By.id(Register.passwordElement)).sendKeys("123");
    await driver.findElement(By.id(Register.confirmpasswordID)).sendKeys("123");
    await driver.findElement(By.name(Register.registerButtonElement)).click();

    const element = await driver.wait(
      until.elementLocated(By.name(Register.FormErrorElement)),
      5000
    );

    const message = await element.getText();

    assert.strictEqual(
      message,
      Register.insufficientPasswordErrorMessage,
      "Text mismatch"
    );

    console.log("✅Test Password Requirement Error: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Password Requirement Error: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_PasswordMissingError() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Password Missing Error");
    await driver.get(`${BASE_URL}/register`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Register.emailElement)),
      5000
    );
    await emailInput.sendKeys(Register.email);
    await driver
      .findElement(By.id(Register.confirmpasswordID))
      .sendKeys(Register.password);
    await driver.findElement(By.name(Register.registerButtonElement)).click();

    const passwordInput = await driver.findElement(
      By.id(Register.passwordElement)
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

    console.log("✅Test Password Missing Error: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Password Missing Error: Failed");
  } finally {
    await driver.quit();
  }
}

async function Test_PasswordMismatchError() {
  const driver = await launchBrowser();
  try {
    console.log("Test: Password Mismatch Error");
    await driver.get(`${BASE_URL}/register`);
    const emailInput = await driver.wait(
      until.elementLocated(By.id(Register.emailElement)),
      5000
    );
    await emailInput.sendKeys(Register.email);
    await driver
      .findElement(By.id(Register.passwordElement))
      .sendKeys("password1");
    await driver
      .findElement(By.id(Register.confirmpasswordID))
      .sendKeys("password2");
    await driver.findElement(By.name(Register.registerButtonElement)).click();

    const element = await driver.wait(
      until.elementLocated(By.name(Register.FormErrorElement)),
      5000
    );

    const message = await element.getText();

    assert.strictEqual(
      message,
      Register.passwordDoesNotMatchErrorMessage,
      "Text mismatch"
    );

    console.log("✅Test Password Mismatch Error: Success");
  } catch (e) {
    console.log("Error: " + e);
    console.log("❌Test Password Mismatch Error: Failed");
  } finally {
    await driver.quit();
  }
}

async function runRegisterTest() {
  await Test_RegisterUser();

  await Test_UserAlreadyExists();

  await Test_UsernameMissingError();

  await Test_PasswordRequirementError();

  await Test_PasswordMissingError();

  await Test_PasswordMismatchError();
}

runRegisterTest();

/* Test_RegisterUser();
Test_UserAlreadyExists();
Test_UsernameMissingError(); */
