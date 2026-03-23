module.exports = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",

  //You may proceed with this if you want, You just have to rewrite the redirects in the test files
  /* LOGIN_URL: process.env.LOGIN_URL || "http://localhost:3000/login",
  REGISTER_URL: process.env.REGISTER_URL || "http://localhost:3000/register",
  CART_URL: process.env.CART_URL || "http://localhost:3000/cart",
  CHECKOUT_URL: process.env.CHECKOUT_URL || "http://localhost:3000/checkout", */

  TEST_USER: {
    email: "TestUser10@email.com",
    password: "TestUser",
  },

  // Timeouts in milliseconds
  TIMEOUT: 10000,

  // Run browser in headless mode
  HEADLESS: process.env.HEADLESS !== "false",

  //note can substitute email with username if your application uses that for login and registration. Just make sure to update the element IDs and error messages accordingly in the tests.
  Register: {
    emailElement: "email",
    email: `example_${Date.now()}@email.com`, //Change Every test
    registeredEmail: "TestUser10@email.com", //modify or add in your account database
    passwordElement: "password",
    password: "password",
    confirmpasswordID: "confirmPassword",
    registerButtonElement: "registerButton",

    FormErrorElement: "FormError",
    userExistsErrorMessage: "User already exists",
    insufficientPasswordErrorMessage: "Password must be at least 8 characters",
    passwordDoesNotMatchErrorMessage: "Passwords do not match",
  },

  Login: {
    //Check your mongodb database and use an existing account
    emailElement: "email",
    email: "TestUser10@email.com",
    passwordElement: "password",
    password: "TestUser",
    buttonName: "loginButton",

    FormErrorElement: "FormError",
    invalidUserErrorMessage: "Invalid credentials",
    welcomeMessageElement: "welcomeMessage",
    welcomeMessage: "Welcome To My Shop!",
  },

  /* Homepage: {
    ItemSearch: "",
    searchInputID: "searchInput",
    searchButtonName: "searchButton",
    productItemClass: "product-item",
  }, */
  Home: {
    // Element names used in home page
    searchInput: "searchInput",
    categorySelect: "categorySelect",
    addToCartButton: "addToCartButton",

    // Test search data
    searchKeyword: "product",
    searchCategory: "Device",
  },

  Cart: {
    // Element names used in cart page
    cartIconLink: "cartIconLink",
    proceedToCheckoutButton: "proceedToCheckoutButton",
    removeItemButton: "removeItemButton",
    increaseQuantityButton: "increaseQuantityButton",
    decreaseQuantityButton: "decreaseQuantityButton",
  },

  Checkout: {
    // Element names used in checkout page
    placeOrderButton: "placeOrderButton",
    fullNameInput: "fullName",
    addressInput: "address",
    cityInput: "city",
    postalCodeInput: "postalCode",
    countryInput: "country",
    paymentMethodInput: "paymentMethod",

    // Test data
    testFullName: "John Doe",
    testAddress: "123 Main St",
    testCity: "New York",
    testPostalCode: "10001",
    testCountry: "USA",
  },
};
