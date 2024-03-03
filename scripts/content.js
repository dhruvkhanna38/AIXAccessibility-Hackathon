let body = document.querySelector('body');
 
// Create the button and set its ID
let btnQurious = document.createElement('button');
btnQurious.setAttribute('id', 'btnQurious');
btnQurious.textContent = 'Click to Speak'; // Make it clear what the button is for
 
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
      speak("Thank you, your input has been confirmed.");
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