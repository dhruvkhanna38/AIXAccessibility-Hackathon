chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendHTML') {
    let html = request.html;
    let prompt = request.prompt;

    fetchTextsArray(html, prompt)
      .then((response) => {
        console.log('Response from fetchClassesAndIds:', response);
        sendResponse(response);
      })
      .catch((error) => {
        console.error('Error fetching classes and IDs:', error);
        sendResponse({ error: error.toString() });
      });
    return true; // indicates you intend to reply asynchronously
  }
});

async function fetchTextsArray(html, prompt) {
  try {
    const response = await fetch('http://localhost:3000/sendHTML', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html, prompt }),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('Error fetching classes and IDs:', error);
    return { error: error.toString() };
  }
}
