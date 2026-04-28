import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-between font-sans overflow-hidden relative selection:bg-cyan-500/30 w-full">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="pt-8 pb-4 text-center z-10 w-full max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-left flex flex-col items-center sm:items-start">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            NEON SERPENT
          </h1>
          <p className="text-cyan-400/70 mt-1 font-mono text-xs uppercase tracking-[0.2em] sm:ml-1">
            v1.0.0 Online
          </p>
        </div>
        <div className="mt-4 sm:mt-0 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full flex items-center gap-2 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
           <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"></span>
           <span className="text-xs font-mono tracking-widest text-gray-400">STATUS: NOMINAL</span>
        </div>
      </header>
      
      {/* Main Game Area */}
      <main className="flex-1 w-full flex items-center justify-center z-10 p-4">
        <SnakeGame />
      </main>

      {/* Footer / Music Player Area */}
      <footer className="w-full max-w-4xl p-4 sm:mb-6 z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
