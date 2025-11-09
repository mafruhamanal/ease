import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import VoiceAvatar from "./VoiceAvatar";

const ArthritisChatbot = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const [isListening, setIsListening] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const conversationRef = useRef(null);
  const messagesEndRef = useRef(null);

  // const audioChunksRef = useRef([]);
  const [aiTalking, setAiTalking] = useState(false);
  const startConversation = async () => {
    try {
      setStatus("connecting");

      const { Conversation } = await import("@elevenlabs/client");
    

      const conversation = await Conversation.startSession({
        agentId: process.env.REACT_APP_ELEVENLABS_AGENT_ID,
        micMuted: true, // start with mic muted

        onConnect: () => {
          setIsConnected(true);
          setStatus("connected");
          console.log("Connected to ElevenLabs");
        },

        onDisconnect: () => {
          setIsConnected(false);
          setStatus("disconnected");
          console.log("Disconnected");
        },

        onMessage: (message) => {
          const role = message.source === "user" ? "user" : "assistant";

          if (role === "assistant") {
            setAiTalking(true);
          if (message.isFinal){
            setAiTalking(false);
          }
          }
          
          setMessages((prev) => [
            ...prev,
            {
              role: message.source === "user" ? "user" : "assistant",
              content: message.message,
              timestamp: new Date(),
            },
          ]);
        },

        onError: (error) => {
          console.error("Error:", error);
          setStatus("error");
        },
      });

      conversationRef.current = conversation;
    } catch (error) {
      console.error("Failed to start:", error);
      setStatus("error");
    }
  };

  const endConversation = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
      setIsConnected(false);
      setStatus("disconnected");
      setMessages([]);
      setIsListening(false);
      setIsMicMuted(true);
    }
  };

  const toggleMicrophone = async () => {
    if (!conversationRef.current) return;

    if (!isListening) {
      setIsListening(true);
      setIsMicMuted(false);
      await conversationRef.current.setVolume({ volume: 0 });
    } else {
      // sstop listening , mute microphone and restore agent audio
      setIsListening(false);
      setIsMicMuted(true);
      await conversationRef.current.setVolume({ volume: 1 });
    }
  };

  useEffect(() => {
    if (conversationRef.current && isConnected) {
      conversationRef.current.setMicMuted?.(isMicMuted);
    }
  }, [isMicMuted, isConnected]);

  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">

          <h1 className="text-3xl font-bold text-violet-400 mb-2">
            Arthritis Information Assistant
          </h1>
          <p className="text-gray-600">
            Ask me anything about arthritis, symptoms, treatments, management,
            and use me as a guide for the exercise!
          </p>
        </div>    
          <div className="mt-4 p-4 bg-purple-50 border border-purple-300 rounded-lg mb-4">
          <p className="text-s text-yellow-900">
            <strong> Medical Disclaimer:</strong> This chatbot provides
            general educational information and advice only. Always consult
            healthcare professionals for medical advice, diagnosis, or
            treatment.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className= "grid grid-cols-1 md:grid-cols-3 gap-6">
            {/*left side*/}
            <div className="flex flex-col items-center gap-6 pt-10">
              <VoiceAvatar isTalking={aiTalking} />
              <div className= "flex flex-col gap-4"></div>
                    {!isConnected ? (
                <button
                  onClick={startConversation}
                  disabled={status === "connecting"}
                  className="inline flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg 
                  hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-5 h-5" />
                  Start Conversation
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMicrophone}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                      isListening
                        ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Press to Speak
                      </>
                    )}
                  </button>
                  <button
                    onClick={endConversation}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    End Conversation
                  </button>
                </>
              )}
             <div className="flex items-center gap-2">
             <div
                className={`w-3 h-3 rounded-full ${
                  status === "connected"
                    ? "bg-green-500 animate-pulse"
                    : status === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-gray-700 text-sm">
                {status === "connected"
                  ? isListening
                    ? "🎤 Recording... Release to send"
                    : "Ready - Press mic to speak"
                  : status === "connecting"
                  ? "Connecting..."
                  : status === "error"
                  ? "Connection Error"
                  : "Ready to Start"}
              </span>
            </div>  
            </div>
      
            
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3"></div>
                <div className="h-[500px] overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <div className="flex justify-center text-gray-500 pr-4">
              <div className="text-center max-w-md mt-[180px]">
                <Volume2 className="w-10 h-10 mb-2 opacity-40 mx-auto" />
                <p className="text-lg mb-1">
                  {isConnected
                    ? "Press the microphone button to speak"
                    : "Start the conversation to begin"}
                </p>
                <p className="text-sm">
                  Try asking: "What should I do to help with my wrist pain?"
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> 
            </div>
          )}
          </div>
          </div>
        </div>
     </div>
      </div>
       </div>
  )
}
export default ArthritisChatbot;