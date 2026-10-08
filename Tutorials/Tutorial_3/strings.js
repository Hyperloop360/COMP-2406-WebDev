//----------------------------------------------------------
// Test a password length by using the .length attribute
//----------------------------------------------------------
let password = "fluffy3"; 
if (password.length < 8) 
    console.log("Password too short");

//----------------------------------------------------------
// Make comparison simpler by using 
// toLowerCase() and toUpperCase()
//----------------------------------------------------------
let answer = "YES";
let provinceCode = "qc";
if (answer.toLowerCase() === "yes") 
    console.log("Confirmed");
if (provinceCode.toUpperCase() === 'ON') 
    console.log("Ontario resident");

//----------------------------------------------------------
// Check beginning and end of a web address 
// using startsWith() and endsWith()
//----------------------------------------------------------
let url = "https://myWebsite.com";
if (url.startsWith("https://")) 
    console.log("This is a secure site");
if (url.endsWith(".com")) 
    console.log("This is a commercial site");

//----------------------------------------------------------
// Confirm an Ontario postal code by using charAt(i)
//----------------------------------------------------------
let postalCode = "K1S5B6";
if (postalCode.charAt(0) === "K") 
    console.log("This postal code is in Ontario.");
else 
    console.log("This postal code is not in Ontario.");

//----------------------------------------------------------
// Insert user information into a standard 
// message string by using replace()
//----------------------------------------------------------
let template = "Hello {name}, your order #{orderId} is confirmed!";
let userName = "Chen";
let orderId = 769234;
let message = template.replace("{name}", userName).replace("{orderId}", orderId);
console.log(message);

//----------------------------------------------------------
// Check that an email address has valid structure 
// by using includes() and split(). It divides the string up 
// into tokens separated by '@' characters and then ensures 
// that there is exactly one '@' character in the address.
//----------------------------------------------------------
let email = "user@example.com";
if (!email.includes("@")) {
    let parts = email.split("@");
    if (parts.length !== 2)
        console.log("Invalid email address");
}

//----------------------------------------------------------
// Get the domain of an email address 
// by using indexOf() and slice()
//----------------------------------------------------------
let atPos = email.indexOf("@");
if (atPos !== -1) {
    let domain = email.slice(atPos + 1);
    console.log(domain); // "example.com"
}

//----------------------------------------------------------
// Re-format a set of digits into a proper format for 
// phone numbers by using slice()
//----------------------------------------------------------
let phone = "6135202600";
let areaCode = phone.slice(0, 3);    // Extract area code
let exchange = phone.slice(3, 6);    // Extract exchange code
let lineNumber = phone.slice(6, 10); // Extract line number
phone = `(${areaCode}) ${exchange}-${lineNumber}`;
console.log(phone); // (613) 520-2600
