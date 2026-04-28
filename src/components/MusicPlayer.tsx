import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams (AI Gen)', duration: '2:40', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse (AI Gen)', duration: '3:15', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon (AI Gen)', duration: '2:55', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full bg-gray-900 border border-fuchsia-500/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(217,70,239,0.15)] flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/2 overflow-hidden">
          <div className="min-w-10 h-10 rounded-full bg-gray-800 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <Music className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-white truncate">{currentTrack.title}</span>
            <span className="text-xs text-fuchsia-400 font-mono tracking-wider truncate">AI SYNTHESIZER • TRACK 0{currentTrack.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrev} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-transparent hover:border-fuchsia-500/50"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-transparent hover:border-cyan-500/50"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 w-1/4 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-cyan-400 transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
          />
        </div>
      </div>
      
      {/* Animated Sound Wave Graphic */}
      <div className="flex items-center justify-center gap-1 h-6 w-full">
        {[...Array(24)].map((_, i) => (
          <div 
            key={i} 
            className="w-1.5 bg-gradient-to-t from-fuchsia-500 to-cyan-400 rounded-full"
            style={{
              height: isPlaying 
                ? `${Math.max(20, Math.random() * 100)}%` 
                : '20%',
              transition: isPlaying ? 'height 0.2s ease-in-out' : 'height 0.5s ease',
              animation: isPlaying ? `pulse 1s infinite alternate ${i * 0.1}s` : 'none',
              opacity: isPlaying ? 0.8 : 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}
