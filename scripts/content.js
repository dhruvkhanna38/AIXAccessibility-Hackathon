let body = document.querySelector('body');
 
// Create the button and set its ID
let btnQurious = document.createElement('button');
btnQurious.setAttribute('id', 'btnQurious');
btnQurious.textContent = ''; // Make it clear what the button is for
 
// Initialize speech recognition
let speechRecognition = new (webkitSpeechRecognition || SpeechRecognition)();
speechRecognition.lang = 'en-US';
speechRecognition.interimResults = false; // We only want final results
 
let initialSpeechText='';
let confirmedText = ''; // Variable to store the confirmed text
 
// Initialize speech synthesis for speaking out messages
let speechSynthesis = window.speechSynthesis;
 
function speak(text, callback = () => {}) {
  let utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = callback;
  speechSynthesis.speak(utterance);
}
 
let currentState = 'initial'; // Could be 'initial', 'confirming'
 
function startSpeechRecognition() {
  speechRecognition.start();
}

function collectElementDetails() {
  const elements = document.querySelectorAll('*'); // Select all elements in the DOM
  const elementsDetails = Array.from(elements).map((element) => ({
      // tagName: element.tagName,
      // classes: Array.from(element.classList), // Convert classList to an array
      // id: element.id,
      // name: element.name,
      text: element.innerText
  }));
  return elementsDetails;
}

function extractInnerTexts(elements, uniqueInnertexts) {
  elements.forEach(element => {
    if (element.innerText) {
      uniqueInnertexts.add(element.innerText);
    }
  });
  console.log(uniqueInnertexts)
}

 
speechRecognition.onresult = function(event) {
  let speechText = event.results[0][0].transcript.trim();
 
  if (currentState === 'initial') {
    initialSpeechText = speechText;
    speak(`Is this what you said: ${speechText}? Please confirm, say yes or no`, () => {
      currentState = 'confirming';
      startSpeechRecognition(); // Restart recognition for confirmation
    });
  } else if (currentState === 'confirming') {
    if (speechText.toLowerCase() === 'yes') {
      console.log("Script is running");
      confirmedText = initialSpeechText;
      console.log('Confirmed text:', confirmedText);

      let uniqueInnertexts = new Set();
      //let uniqueClasses = new Set();

      let idsArray = [];
      let classesArray = [];

      speak("Thank you, your input has been confirmed.", () => {

          console.log("Sending message to background:", { action: "sendHTML", html: collectElementDetails(), prompt: confirmedText });
          

          chrome.runtime.sendMessage({
            action: "sendHTML",
            html: collectElementDetails(),
            prompt: confirmedText
          }, async function(response) {
            const jsonResponse = await response;
            console.log(jsonResponse)

            await extractInnerTexts(jsonResponse, uniqueInnertexts);
      
            // Convert sets to arrays for easier use/display
            innerTextsArray = Array.from(uniqueInnertexts);
            // idsArray.push("primary", "A8SBwf" , "A8SBwf emcav", "o3j99 ikrT4e om7nvf", "custom-container");
          
            // classesArray = Array.from(uniqueClasses);
            // classesArray.push("primary", "A8SBwf", "A8SBwf emcav", "o3j99 ikrT4e om7nvf", "custom-container")
            focusOnElement(innerTextsArray); 
      });
       
      });

      currentState = 'initial'; // Reset for next input
    } else if (speechText.toLowerCase() === 'no') {
      speak("Let's try again. What do you want to see?", startSpeechRecognition);
      currentState = 'initial'; // Go back to capturing input
    } else {
      // If the response is neither "yes" nor "no", ask for confirmation again
      speak("I didn't catch that. Please confirm, say yes or no", startSpeechRecognition);
    }
  }
};
 
btnQurious.addEventListener('click', function() {
  if (currentState === 'initial') {
    speak("What do you want to see?", startSpeechRecognition);
  }
});
 
body.appendChild(btnQurious);
 
document.addEventListener('keypress', function(event) {
  if (event.shiftKey && event.ctrlKey && event.code === 'KeyQ') {
    btnQurious.click();
  }
});

// ----- do not change above this ---- old working code---




async function focusOnElement(innerTextsArray) { // function to get and hide elements as per Text
  const allElements = document.body.getElementsByTagName('*');
  // Hide all elements initially
  for (const element of allElements) {
    element.style.display = 'none';
  }

  console.log("All elements hidden");

  console.log("innerTextsArray" ,innerTextsArray)
  //console.log("classesArray" ,classesArray)
    //  new code

  // Show elements that have matching inner texts
  for (const element of allElements) {
  const elementInnerText = element.innerText.trim();

  // Check if the element's inner text is in innerTextsArray
  const isInInnerTextsArray = innerTextsArray.includes(elementInnerText); 

  if (isInInnerTextsArray) {
    //console.log("Element with inner text:", elementInnerText, "is in innerTextsArray", innerTextsArray);
    let current = element;
    // Make sure all parents of the matching element are visible
    while (current !== document.body) {
      current.style.display = '';
      current = current.parentElement;
    }
  }
}

 console.log("Focus adjustment complete");
}


async function callBackgroundApi(confimedText, uniqueIds, uniqueClasses) {
  
}


// Test Code Do Not Remove

// console.log("Sending message to background:", { action: "sendHTML", html: collectElementDetails(), prompt: "News and Events" });
      
// chrome.runtime.sendMessage({
//   action: "sendHTML",
//   html: collectElementDetails(),
//   prompt: "check-in"
// }, async function(response) {
//   const jsonResponse = response;
//   const uniqueIds = new Set();
//   const uniqueClasses = new Set();

//   console.log(jsonResponse)

//   extractIdsAndClasses(response, uniqueIds, uniqueClasses);

//   // Convert sets to arrays for easier use/display
//   const idsArray = Array.from(uniqueIds);
//   const classesArray = Array.from(uniqueClasses);
  
//   await focusOnElement(classesArray, idsArray);
  
// });