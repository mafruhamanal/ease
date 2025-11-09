import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

const ArthritisChatbot = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const [isListening, setIsListening] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const conversationRef = useRef(null);
  // const audioChunksRef = useRef([]);

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

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  status === "connected"
                    ? "bg-green-500 animate-pulse"
                    : status === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="font-medium text-gray-700">
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

            <div className="flex gap-3">
              {!isConnected ? (
                <button
                  onClick={startConversation}
                  disabled={status === "connecting"}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-5 h-5" />
                  Start Conversation
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMicrophone}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
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
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    End Conversation
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-xl mb-3">
                  {isConnected
                    ? "Press the microphone button to speak"
                    : "Start the conversation to begin"}
                </p>
                <p className="text-base">
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
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-purple-50 border border-purple-300 rounded-lg">
          <p className="text-s text-yellow-900">
            <strong> Medical Disclaimer:</strong> This chatbot provides
            general educational information and advice only. Always consult
            healthcare professionals for medical advice, diagnosis, or
            treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArthritisChatbot;