
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const uri = "ws://localhost:9000/ws";
let socket = null;

if (!SpeechRecognition) {
  console.log("Speech Recognition not supported in this browser.");
} else {
  // 1. Open WebSocket connection
  socket = new WebSocket(uri);

  socket.onopen = () => {
    console.log("WebSocket connected.");

    // 2. Start speech recognition only after socket is ready
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("You said:", transcript);

      // 3. Send to WebSocket
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  socket.onerror = (e) => {
    console.error("WebSocket error:", e);
  };

  socket.onclose = () => {
    console.log("WebSocket closed.");
  };
}
