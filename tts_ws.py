from fastapi import FastAPI, WebSocket
from TTS.api import TTS
from scipy.io.wavfile import write as write_wav
import numpy as np
import io

app = FastAPI()

# Load TTS model once
tts = TTS(model_name="tts_models/en/ljspeech/glow-tts")
sample_rate = tts.synthesizer.output_sample_rate  # Get sample rate once

@app.websocket("/ws")
async def websocket_tts(ws: WebSocket):
    await ws.accept()
    print("WebSocket connected.")
    
    while True:
        try:
            # Receive text from browser
            text = await ws.receive_text()
            print("Text received:", text)

            # Generate speech
            wav_array = tts.tts(text)

            # Convert to WAV buffer
            audio_buffer = io.BytesIO()
            write_wav(audio_buffer, sample_rate, np.array(wav_array, dtype=np.float32))
            audio_buffer.seek(0)
            
            print("audio_buffer",audio_buffer)

            # Send back .wav bytes
            await ws.send_bytes(audio_buffer.read())

        except Exception as e:
            print("Error:", e)
            break


# cmd : uvicorn app.tts_ws:app --port 9000
