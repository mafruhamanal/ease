import React, { useRef, useEffect, useState } from "react";
import { Camera } from "lucide-react";

const ExerciseMode = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState("arms_up");
  const [score, setScore] = useState(0);
  const [reps, setReps] = useState(0);
  const [isCorrectPose, setIsCorrectPose] = useState(false);
  const [feedback, setFeedback] = useState("Get ready!");

  const poseRef = useRef(null);
  const lastPoseStateRef = useRef(false);
  const prevFrameRef = useRef(null);
  console.log(isCorrectPose);
  const exercises = {
    arms_up: {
      name: "Arms Up",
      description: "Raise both arms straight up above your head",
      icon: "🙌",
    },
    t_pose: {
      name: "T-Pose",
      description: "Extend both arms straight out to the sides",
      icon: "🤸",
    },
    squat: {
      name: "Squat",
      description: "Bend your knees and lower your body",
      icon: "🏋️",
    },
    jumping_jack: {
      name: "Jumping Jack",
      description: "Arms up and legs apart",
      icon: "⭐",
    },
  };

  useEffect(() => {
    const loadMediaPipe = async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js";
      script.crossOrigin = "anonymous";

      script.onload = async () => {
        const pose = new window.Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          },
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults(onResults);
        poseRef.current = pose;

        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
          });
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsLoading(false);
            processFrame();
          };
        }
      };

      document.body.appendChild(script);
    };

    loadMediaPipe();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const processFrame = async () => {
    if (videoRef.current && poseRef.current && canvasRef.current) {
      await poseRef.current.send({ image: videoRef.current });
      requestAnimationFrame(processFrame);
    }
  };

  const checkPose = (landmarks, exercise) => {
    if (!landmarks || landmarks.length < 33) return false;

    // Only body landmarks (no face)
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    switch (exercise) {
      case "arms_up":
        return (
          leftWrist.y < leftShoulder.y - 0.1 &&
          rightWrist.y < rightShoulder.y - 0.1
        );

      case "t_pose":
        const leftArmStraight =
          Math.abs(leftWrist.y - leftShoulder.y) < 0.15 &&
          leftWrist.x < leftShoulder.x - 0.15;
        const rightArmStraight =
          Math.abs(rightWrist.y - rightShoulder.y) < 0.15 &&
          rightWrist.x > rightShoulder.x + 0.15;
        return leftArmStraight && rightArmStraight;

      case "squat":
        const avgKneeY = (leftKnee.y + rightKnee.y) / 2;
        const avgHipY = (leftHip.y + rightHip.y) / 2;
        return avgKneeY > avgHipY + 0.15;

      case "jumping_jack":
        const jackArmsUp =
          leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
        const handsApart = Math.abs(leftWrist.x - rightWrist.x) > 0.4;
        return jackArmsUp && handsApart;

      default:
        return false;
    }
  };

  

  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, -width, 0, width, height);
    ctx.restore();

    

    if (results.poseLandmarks) {
      // Exclude face landmarks (keep only indices >= 11)
      const landmarks = results.poseLandmarks.filter((_, i) => i >= 11);
      const fullLandmarks = results.poseLandmarks;
      const connections = window.POSE_CONNECTIONS;

      if (connections) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 4;

        connections.forEach(([start, end]) => {
          // Skip drawing if either is a face landmark
          if (start < 11 || end < 11) return;

          const s = fullLandmarks[start];
          const e = fullLandmarks[end];
          ctx.beginPath();
          ctx.moveTo((1 - s.x) * width, s.y * height);
          ctx.lineTo((1 - e.x) * width, e.y * height);
          ctx.stroke();
        });
      }

      
        landmarks.forEach((landmark) => {
          const x = (1 - landmark.x) * width;
          const y = landmark.y * height;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = "#173e1aff";
          ctx.fill();
          ctx.strokeStyle = "#abffcbff";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      

      const correct = checkPose(fullLandmarks, currentExercise);
      setIsCorrectPose(correct);

      if (correct && !lastPoseStateRef.current) {
        setReps((prev) => prev + 1);
        setScore((prev) => prev + 10);
        setFeedback("Perfect! 🎉");
      } else if (correct) {
        setFeedback("Hold it! 💪");
      } else {
        setFeedback("Keep trying...");
      }

      lastPoseStateRef.current = correct;

   
        ctx.fillStyle = correct ? "#00ff00" : "#ff6b6b";
        ctx.fillRect(20, 20, 60, 60);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Arial";
        ctx.fillText(correct ? "✓" : "✗", 30, 65);
      
    }
  };

  const resetExercise = () => {
    setReps(0);
    setScore(0);
    setFeedback("Get ready!");
    lastPoseStateRef.current = false;
    prevFrameRef.current = null;
  };

  const changeExercise = (exerciseKey) => {
    setCurrentExercise(exerciseKey);
    resetExercise();
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          💪 Full Body Exercise Mode
        </h2>

        <div className="relative mb-4">
          <video ref={videoRef} className="hidden" width="640" height="480" />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="w-full rounded-lg border-4 border-gray-300"
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
              <div className="text-white text-xl">
                <Camera className="animate-pulse mx-auto mb-2" size={48} />
                Loading camera...
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
            <div className="text-sm">
              Exercise: {exercises[currentExercise].name}
            </div>
            <div className="text-2xl font-bold">{feedback}</div>
          </div>

          
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center">
            <div className="text-sm font-semibold">Reps</div>
            <div className="text-4xl font-bold">{reps}</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-lg text-center">
            <div className="text-sm font-semibold">Score</div>
            <div className="text-4xl font-bold">{score}</div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Choose Exercise:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(exercises).map(([key, ex]) => (
              <button
                key={key}
                onClick={() => changeExercise(key)}
                className={`p-3 rounded-lg font-semibold transition ${
                  currentExercise === key
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
              >
                <div className="text-2xl mb-1">{ex.icon}</div>
                <div className="text-sm">{ex.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-blue-800 font-semibold mb-2">
            {exercises[currentExercise].icon} {exercises[currentExercise].name}
          </p>
          <p className="text-blue-700">
            {exercises[currentExercise].description}
          </p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={resetExercise}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Reset Stats
          </button>
         
        </div>

        <div className="text-gray-600 text-sm text-center mt-4 space-y-1">
          <p>Stand back from the camera so your full body is visible</p>
          <p>Green skeleton = pose detected | Red dots = body landmarks</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseMode;
