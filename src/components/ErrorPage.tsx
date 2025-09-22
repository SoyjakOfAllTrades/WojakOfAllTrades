import { AlertTriangle, Check, Copy, Home, RefreshCw } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const errorMessage = `Error: no element is specified to initialize PerfectScrollbar
at new PerfectScrollbar (perfect-scrollbar.js:123:15)
at useEffect (WojakGallery.tsx:120:25)
at commitHookEffectList (react-dom.development.js:19731:25)
at commitPassiveHookEffects (react-dom.development.js:19769:11)
at flushPassiveEffectsImpl (react-dom.development.js:22615:9)
at flushPassiveEffects (react-dom.development.js:22584:10)
at performSyncWorkOnRoot (react-dom.development.js:22447:3)
at workLoopSync (react-dom.development.js:22342:5)
at flushWork (react-dom.development.js:22299:5)
at performWorkUntilDeadline (react-dom.development.js:22074:5)`;

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(errorMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error message:', err);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-stonks-dark">
      {/* Stonks Background Elements */}
      <div className="stonks-bg-pattern"></div>
      <div className="stonks-grid stonks-pulse"></div>

      <div
        className="relative z-10 max-w-lg rounded-lg border-2 border-stonks-green/30 bg-transparent p-8 text-center shadow-2xl backdrop-blur-sm"
        style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.1), 0 0 40px rgba(0, 255, 0, 0.05)' }}
      >
        <div className="mb-4 text-6xl">😢</div>
        <h1 className="stonks-text mb-4 font-bold font-orbitron text-3xl">
          OOPS! SOMETHING WENT WRONG
        </h1>
        <p className="mb-6 font-bold text-stonks-light/70">
          THERE WAS AN ERROR LOADING THE WOJAK BUILDER.
        </p>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-stonks-accent" />
              <span className="font-bold text-stonks-accent">ERROR DETAILS</span>
            </div>
            <button
              type="button"
              onClick={handleCopyError}
              className="flex items-center space-x-2 rounded-lg bg-stonks-accent/20 px-3 py-1 font-bold text-sm text-stonks-accent transition-all duration-200 hover:bg-stonks-accent/30"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>COPY ERROR</span>
                </>
              )}
            </button>
          </div>
          <div className="rounded-lg border border-stonks-gray/50 bg-stonks-gray/20 p-4">
            <textarea
              value={errorMessage}
              readOnly
              className="h-32 w-full resize-none border-none bg-transparent font-mono text-stonks-light/80 text-xs outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleReload}
            className="wojak-button flex items-center justify-center space-x-2 px-8 py-3 text-lg"
          >
            <RefreshCw className="h-5 w-5" />
            <span>RELOAD PAGE</span>
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="wojak-button-secondary flex items-center justify-center space-x-2 px-8 py-3 text-lg"
          >
            <Home className="h-5 w-5" />
            <span>GO HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
