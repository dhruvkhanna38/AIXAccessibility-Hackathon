// Function to log all elements in the document
function logAllElements() {
   const allElements = document.querySelectorAll('*'); // Selects all elements in the document
   console.log('Logging all elements in the document:');
   allElements.forEach((element, index) => {
     console.log(`${index}: <${element.tagName.toLowerCase()}>`);
   });
 }
 
 // Call the function to log all elements
 logAllElements();
 