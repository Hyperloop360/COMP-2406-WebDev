// Constants cannot be changed after they are set
const TAX_RATE = 0.13;

/* These are values that we would typically get from a text 
   field or some other kind of input field on our webpage. 
   Variables are typically declared with let. */
let price = "49.99";
let payment = 60.00;
let applyDiscount = true; // camelCase variable names

// The ?: does the same as: if (applyDiscount) newPrice = price*0.9; else newPrice = price;
let newPrice = applyDiscount ? price * 0.9 : price;
 console.log('price is ' + price);
let tax = newPrice * TAX_RATE; 
let total = newPrice + tax;
let change = payment - total;

// Here is the output
console.log('Product Price: $' + price.toFixed(2));
if (applyDiscount)
    console.log('Discounted Price: $' + newPrice.toFixed(2));
console.log('Tax: $' + tax.toFixed(2));
console.log('-------------------------');
console.log("Subtotal: $" + total.toFixed(2));
console.log("Amount Tendered: $" + payment.toFixed(2));
console.log("=========================");
console.log("Change Due: $" + change.toFixed(2));