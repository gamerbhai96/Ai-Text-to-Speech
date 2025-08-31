import { useState, useEffect } from 'react'



function App() {


  const [text, setText] = useState("");
  const [voices, setVoices] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [loading, setLoading] = useState(false);



  useEffect
    (() => {
      const chechReady = setInterval(() => {
        if (
          window.puter && window.puter.ai && typeof window.puter.ai.txt2speech === "function"
        ) {
          setAiReady(true);
          clearInterval(chechReady);
        }
      }, 300);
      return () => clearInterval(chechReady);
    }, [])

  const speakText= async () => {
    if (text.length > 3000) {
      setError("Text is too long. Max 3000 characters");
      return;
    }
    setLoading(true);
    setError("");

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      const audio = await window.puter.ai.txt2speech(text, {
        engine: "standard",
        language: "en-US",
      });
      setCurrentAudio(audio);
      audio.play();
      audio.addEventListener("ended", () => setLoading(false));
      audio.addEventListener("error", () => setLoading(false));
    }
    catch (err) {
      setError(err.message || "Failed to generate speech. Please try again.");
      setLoading(false);
    }
  }


  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-950
       via-slate-950 to-purple-900 flex flex-col items-center justify-center p-3">

        <div className="flex flex-col items-center w-full max-w-2xl gap-6">

          <h1 className="text-4xl sm:text-5xl md:text-6xl
           font-light bg-gradient-to-r from-blue-500 via-rose-500 
           to-indigo-500 bg-clip-text text-transparent text-center mb-2">AI Text to Speech</h1>

          <div className={`px-4 py-2 rounded-full text-sm font-medium mb-2
             ${aiReady ? "bg-green-500/20 text-green-300 border border-green-300" :
              "bg-yellow-500/20 text-yellow-300 border border-yellow-300 animate-pulse"}`}>
            {aiReady ? "AI Engine is Ready" : "Loading AI Engine..."}
          </div>
          
          <div className="w-full bg-gradient-to-r from-gray-800/90
           to-gray-700 backdrop-blur-md border-gray-600 
           rounded-3xl p-6 shadow-2xl flex flex-col gap-2">
            <textarea
              className="w-full h-40 p-4 bg-gray-700/80 
              border-gray-600 rounded-2xl text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition
               duration-300 disabled:opacity-50 resize-none shadow-xl 
               focus:shadow-fuchsia-700/70 mb-2"
              placeholder='Enter the text to convert to speech....(max 3000 characters)'
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!aiReady}
              maxLength={3000}
            ></textarea>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-400">{text.length} / 3000</span>
            </div>
            <div className="flex gap-3 mt-4 ">
              <button className='flex-1 px-6 py-3 bg-gradient-to-r from-rose-500
               to-purple-500 hover:opacity-80 text-white font-semibold rounded-2xl transition disables:opacity-50
               disabled:cursor'
                onClick={speakText}
                disabled={!aiReady || loading || !text.trim()}
              >
                {
                  loading ? (
                    <div>
                      <div className="animate-spin w-4 h-4 border-2 
                      border-white/30 border-t-white rounded-full"></div>
                      Speaking.......
                    </div>

                   ) : (
                    <div className="flex- items-center justify-center gap-2 cursor-pointor ">
                      Speak
                    </div>
                  )
                }
              </button>
              {
                currentAudio && (
                  <button className='px-6 py-3 bg-radient-to-r from-gray-600
                  to-gray-700 hover:opacity-80 text-white font-semibold 
                  rounded-2xl border border-neutral-500/30 
                  transition cursor-pointor'
                  
                    onClick={stopAudio}
                  >
                    Stop

                  </button>
                )
              }
            </div>
            <div className=  "mt-6 space-y-4 text-white ">
              {
                error &&(
                  <div className='p-4 bg-red-100 text-red-700 border border-red-400 rounded-2xl'>
                   { error}
                    </div>
                )
              }

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
