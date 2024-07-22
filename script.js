const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", async () => { // Mark the callback function as async
    let inpWord = document.getElementById("inp-word").value;

    try {
      const response = await fetch("http://35.196.33.32:8000/saveWord", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: inpWord }),
    });
    
      if (response.ok) {
          console.log("Word saved successfully");
      } else {
          console.error("Failed to save word");
      }
  } catch (error) {
      console.error("Error saving word:", error);
  }

    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            result.innerHTML = `
            <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>/${data[0].phonetic}/</p>
                </div>
                <p class="word-meaning">
                   ${data[0].meanings[0].definitions[0].definition}
                </p>
                <p class="word-example">
                    ${data[0].meanings[0].definitions[0].example || ""}
                </p>`;
                sound.setAttribute("src",`${data[0].phonetics[0].audio}`)
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});
function playSound() {
    sound.play();
}
