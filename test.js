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
      speak("Thank you, your input has been confirmed.", async () => {
      
      
        console.log("Sending message to background:", { action: "sendHTML", html: collectElementDetails(), prompt: "News and Events" });
        chrome.runtime.sendMessage({
              action: "sendHTML",
              html: collectElementDetails(),
              prompt: "News and Events"
            }, async function(response) {
              const jsonResponse = response;
              const uniqueIds = new Set();
              const uniqueClasses = new Set();
        
              extractIdsAndClasses(elements);
        
              // Convert sets to arrays for easier use/display
              const idsArray = Array.from(uniqueIds);
              const classesArray = Array.from(uniqueClasses);
              


              await focusOnElement(idsArray, classesArray);
              
        
            });

      
       // Main function call

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




btnQurious.addEventListener('click', function () {
  doSomething();
});



body.appendChild(btnQurious);

speechRecognition.continuous = true;
speechRecognition.interimResults = true;

let transcript = '';

speechRecognition.onresult = function (event) {
  transcript = '';
  for (let i = 0; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
};

document.addEventListener('keypress', function (event) {
   if(event.shiftKey && event.ctrlKey && event.code ==='KeyQ'){
      btnQurious.click();
   }
});


async function doSomething() {
  if (!btnQurious.hasAttribute('listening')) {
    btnQurious.setAttribute('listening', true);
    speechRecognition.start();
  } else {
    btnQurious.removeAttribute('listening');
    speechRecognition.stop();
    const myPopup = new Popup({
      id: 'my-popup',
      title: 'Here is what you said',
      content: transcript,
    });    
    
    myPopup.show();

  }
}

function collectElementDetails() {
  const elements = document.querySelectorAll('*'); // Select all elements in the DOM
  const elementsDetails = Array.from(elements).map((element) => ({
      tagName: element.tagName,
      classes: Array.from(element.classList), // Convert classList to an array
      id: element.id,
  }));
  return elementsDetails;
}


function extractIdsAndClasses(elements) {
  elements.forEach(element => {
    if (element.id) {
      uniqueIds.add(element.id);
    }
    if (element.classes.length) {
      element.classes.forEach(className => uniqueClasses.add(className));
    }
  });
}



async function focusOnElement(idsArray, classesArray) { // function to get and hide elements as per Text
  const allElements = document.body.getElementsByTagName('*');

  // Hide all elements initially
  for (const element of allElements) {
    element.style.display = 'none';
  }

  console.log("All elements hidden");

  // We don't actually need a timeout here unless there's a specific reason to delay the execution
  // If you need to wait for something, consider using async/await with a proper async function or Promise

  // Show elements that have matching IDs or classes
  for (const element of allElements) {
    // Check if the element's ID is in idsArray or if any of its classes are in classesArray
    const elementClasses = Array.from(element.classList);
    if (idsArray.includes(element.id) || elementClasses.some(cls => classesArray.includes(cls))) {
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


