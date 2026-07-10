import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(url));

  useEffect(() => {
    audioRef.current.onended = () => setIsPlaying(false);
  }, [url]);

  const togglePlay = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="vn-container">
      <button onClick={togglePlay} className="vn-btn">
        {isPlaying ? <Pause size={12} fill="currentColor" strokeWidth={3} /> : <Play size={12} fill="currentColor" strokeWidth={3} />}
      </button>
      
      <div className="vn-waveform">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="vn-bar" style={{ height: `${Math.random() * 10 + 4}px` }}></div>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;