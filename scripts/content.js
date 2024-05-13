let body = document.querySelector('body');

// Create the button and set its ID
let btnQurious = document.createElement('button');
btnQurious.setAttribute('id', 'btnQurious');
btnQurious.textContent = ''; // Make it clear what the button is for

// Initialize speech recognition
let speechRecognition = new (webkitSpeechRecognition || SpeechRecognition)();
speechRecognition.lang = 'en-US';
speechRecognition.interimResults = false; // We only want final results

let initialSpeechText = '';
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
  const elementsDetails = Array.from(elements)
    .filter((element) => {
      const text = element.innerText;
      return (
        !['SCRIPT', 'META', 'STYLE', 'SVG'].includes(element.tagName) && // Exclude specified tags
        text &&
        text.trim() !== ''
      ); // Check if text exists and is not just empty or spaces
    })
    .map(
      (element) => element.innerText.trim().substring(0, 50) // Trim and limit the text to 50 characters
    )
    .reduce((acc, text) => {
      acc.add(text); // Add the text to the set
      return acc;
    }, new Set());
  const uniqueTextsArray = Array.from(elementsDetails);

  return uniqueTextsArray;
}

speechRecognition.onresult = function (event) {
  let speechText = event.results[0][0].transcript.trim();

  if (currentState === 'initial') {
    initialSpeechText = speechText;
    speak(
      `Is this what you said: ${speechText}? Please confirm, say yes or no`,
      () => {
        currentState = 'confirming';
        startSpeechRecognition(); // Restart recognition for confirmation
      }
    );
  } else if (currentState === 'confirming') {
    if (speechText.toLowerCase() === 'yes') {
      console.log('Script is running');
      confirmedText = initialSpeechText;
      console.log('Confirmed text:', confirmedText);
      let html = collectElementDetails();

      speak('Thank you, your input has been confirmed.', () => {
        console.log('Sending message to background:');

        chrome.runtime.sendMessage(
          {
            action: 'sendHTML',
            html: html,
            prompt: confirmedText,
          },
          async function (response) {
            const jsonResponse = response;
            const uniqueTextsArray = parseFirstArray(jsonResponse);

            await focusOnElement(uniqueTextsArray);
          }
        );
      });

      currentState = 'initial'; // Reset for next input
    } else if (speechText.toLowerCase() === 'no') {
      speak(
        "Let's try again. What do you want to see?",
        startSpeechRecognition
      );
      currentState = 'initial'; // Go back to capturing input
    } else {
      // If the response is neither "yes" nor "no", ask for confirmation again
      speak(
        "I didn't catch that. Please confirm, say yes or no",
        startSpeechRecognition
      );
    }
  }
};

btnQurious.addEventListener('click', function () {
  chrome.runtime.sendMessage(
    {
      action: 'sendHTML',
      html: collectElementDetails(),
      prompt: 'Embeddings',
    },
    async function (response) {
      const jsonResponse = response;
      console.log('Response from background:', jsonResponse);
      const uniqueTextsArray = parseFirstArray(jsonResponse);

      // Convert sets to arrays for easier use/display
      await focusOnElement(uniqueTextsArray);
    }
  );

  // if (currentState === 'initial') {
  //   speak('What do you want to see?', startSpeechRecognition);
  // }
});

body.appendChild(btnQurious);

document.addEventListener('keypress', function (event) {
  if (event.shiftKey && event.ctrlKey && event.code === 'KeyQ') {
    btnQurious.click();
  }
});

// ----- do not change above this ---- old working code---

async function focusOnElement(uniqueTextsArray) {
  console.log('Initiating focus adjustment with texts:', uniqueTextsArray);
  const allElements = document.querySelectorAll('*');

  // Consider first hiding only non-matching elements
  allElements.forEach((element) => {
    const text = element.textContent.trim().toLowerCase();
    const isVisible = uniqueTextsArray.some((textEntry) =>
      text.includes(textEntry.toLowerCase())
    );
    element.style.display = isVisible ? '' : 'none';
  });

  // Ensure visibility of parent elements for visible children
  document
    .querySelectorAll('*:not([style="display: none;"])')
    .forEach((element) => {
      let current = element;
      while (current !== document.body) {
        current.style.display = '';
        current = current.parentElement;
      }
    });

  console.log('Focus adjustment complete');
}

function parseFirstArray(json) {
  // Get all keys from the JSON object
  const keys = Object.keys(json);

  // Find the first key that corresponds to an array
  for (let key of keys) {
    if (Array.isArray(json[key])) {
      return json[key]; // Return the array
    }
  }

  // Return null if no array is found
  return null;
}

async function hideFromTextInput(confirmedText) {
  chrome.runtime.sendMessage(
    {
      action: 'sendHTML',
      html: html,
      prompt: confirmedText,
    },
    async function (response) {
      const jsonResponse = response;
      const uniqueTextsArray = parseFirstArray(jsonResponse);

      await focusOnElement(uniqueTextsArray);
    }
  );
}

// chrome.runtime.sendMessage(
//   {
//     action: 'sendHTML',
//     html: collectElementDetails(),
//     prompt: 'Join',
//   },
//   async function (response) {
//     const jsonResponse = response;
//     console.log('Response from background:', jsonResponse);
//     const uniqueTextsArray = parseFirstArray(jsonResponse);

//     // Convert sets to arrays for easier use/display
//     await focusOnElement(uniqueTextsArray);
//   }
// );
