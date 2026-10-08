// This function takes a price, a taxRate (e.g., 0.13 for 13%) and
// a discountRate (e.g., 10 for 10%) and returns a final price
function calculateTotal(price, taxRate, discountRate) {
    let discountedPrice = price * (1 - discountRate/100); // Apply discount
    let tax = discountedPrice * taxRate; // Apply tax
    return discountedPrice + tax;
}

console.log(calculateTotal(29.99, 0.13, 10));

