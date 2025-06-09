const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
uri = "ws://localhost:9000/ws"

if (!SpeechRecognition) {
  console.log("Speech Recognition not supported in this browser.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("You said:", transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
}
