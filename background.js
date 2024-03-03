

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === "sendHTML") {
      
     fetchClassesAndIds(request.html, request.prompt).then(response => {
         console.log("Response from fetchClassesAndIds:", response);
         sendResponse(response);
     }).catch(error => {
         console.error("Error fetching classes and IDs:", error);
         sendResponse({error: error.toString()});
     });
     return true; // indicates you intend to reply asynchronously
   }
});



async function fetchClassesAndIds(htmlContent, prompt) {
      
   try{  
         console.log(htmlContent, prompt)
         let myHeaders = new Headers();
         myHeaders.append("Content-Type", "application/json");
         myHeaders.append("api-key", "be9158e9d4ca4be080c4b1a3984edee2");

         let raw = JSON.stringify({"prompt": `You are an assistant and your job is to help a Blind and visually impaired user by reducing clutter on a website. The user will provide you with the html of a page and will give you a prompt specifying what all things he wants to explore on the webpage. You have to go through the html of the webpage and return a set of classes and ids of html elements that are related to the content the user wants to see.\n Here is the HTML content of the page you are currently viewing.\n ${htmlContent}\n Provide your answer in JSON Array form. Reply with only the answer in JSON Array form and include no other commentary\n ${prompt}` })
         let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
         const response  = await fetch("https://openaiglazko.openai.azure.com/openai/deployments/GPT35/completions?api-version=2023-05-15", requestOptions)

         if (!response.ok) {
            console.error('HTTP error', response.status);
            const errorResponse = await response.json(); // Assuming the server sends a JSON response
            console.error(errorResponse);
            throw new Error(`API request failed with status ${response.status}`);
         }
         const responseData = await response.json();
         return responseData;
}
catch(error){
   console.error("Error fetching classes and IDs:", error);
   return {error: error.toString()};
}
   

}
