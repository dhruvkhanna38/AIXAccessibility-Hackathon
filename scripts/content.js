document.querySelectorAll('*').forEach(element => {
   element.addEventListener('mouseover', (event) => {
     highlightElement(event.target);
     event.stopPropagation(); // Stop the mouseover event from bubbling up
   }, true); // Use capture to ensure this runs before other handlers
 
   element.addEventListener('mouseout', (event) => {
     restoreOriginalStyle(event.target);
     event.stopPropagation(); // Stop the mouseout event from bubbling up
   }, true); // Use capture for consistency with mouseover
 
   element.addEventListener('click', (event) => {
     hideElement(event);
     event.preventDefault(); // Prevent any default action triggered by clicking
     event.stopPropagation(); // Stop the click event from bubbling up
   }, true); // Use capture to ensure this runs before other handlers
 });
 
 function highlightElement(element) {
   element.setAttribute('data-original-style', element.style.cssText);
   element.style.border = '2px solid red';
   element.style.cursor = 'pointer';
 }
 
 function restoreOriginalStyle(element) {
   const originalStyle = element.getAttribute('data-original-style');
   element.style.cssText = originalStyle;
 }
 
 function hideElement(event) {
   event.target.style.display = 'none';
   console.log(event.target.style.display);
 }
 
 