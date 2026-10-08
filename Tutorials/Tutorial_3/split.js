//----------------------------------------------------------
// Test split(" ")
//----------------------------------------------------------
let fullName = "Mark Lanthier";
let nameParts = fullName.split(" ");
console.log(nameParts); 

//----------------------------------------------------------
// Test split("")
//----------------------------------------------------------
let postalCode = "K1A0B1";
let letters = postalCode.split("");
console.log(letters); 

//----------------------------------------------------------
// Test split(", ")
//----------------------------------------------------------
let address1 = "123 Main St., Ottawa, ON, K1A0B1";
let parts1 = address1.split(", ");
console.log(parts1); 

//----------------------------------------------------------
// Test split(/[,\s]+/)
// where anything between 
//  - starting / and closing / are used to describe a regular expression
//  - anything between [ ] is the list of separator characters
//  - the + means one or more of these characters in a row
//  - the ,\s means a comma or any whitespace (space, tab, newline) is used as a separator
//----------------------------------------------------------
let address2 = "123 Main St.\n" + "Ottawa, ON \n" + "K1A0B1";
let parts2 = address2.split(/[,\s]+/);
console.log(address2); 
console.log("The string was split into " + parts2.length + " items as follows:"); 
console.log(parts2); 


