import type React from 'react';
import { useEffect, useState } from 'react';
import type { WojakCharacter } from '../types/wojak';
import { WojakRenderer } from './WojakRenderer';

interface WojakCanvasProps {
  wojak: WojakCharacter;
  onUpdate: (updates: Partial<WojakCharacter>) => void;
}

export const WojakCanvas: React.FC<WojakCanvasProps> = ({ wojak, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(wojak.name || '');

  // Update tempName when wojak.name changes
  useEffect(() => {
    setTempName(wojak.name || '');
  }, [wojak.name]);

  const handleNameSubmit = () => {
    const trimmedName = tempName.trim();
    onUpdate({ name: trimmedName || 'Unnamed Wojak' });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setTempName(wojak.name || '');
      setIsEditing(false);
    }
  };

  const handleStartEdit = () => {
    setTempName(wojak.name || '');
    setIsEditing(true);
  };
  return (
    <div className="wojak-card flex h-full flex-col p-3">
      {/* Digital TCG Card Design */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

        {/* Card Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-widest">
            DIID CARD
          </div>
          <div className="rounded-full bg-stonks-accent/10 px-2 py-1 font-mono font-semibold text-stonks-accent text-xs uppercase tracking-wider">
            #001
          </div>
        </div>

        {/* Card Title - Editable Name */}
        <div className="relative z-10 mb-6 text-center">
          <div className="mb-2 font-medium font-mono text-stonks-light/60 text-xs uppercase tracking-widest">
            WOJAK IDENTITY
          </div>
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyPress}
              className="w-full rounded-xl border border-stonks-accent/50 bg-stonks-darker/60 px-4 py-3 text-center font-bold font-orbitron text-2xl text-stonks-light backdrop-blur-sm transition-all duration-200 focus:border-stonks-accent focus:outline-none focus:ring-2 focus:ring-stonks-accent/30"
              placeholder="Enter wojak name..."
            />
          ) : (
            <button
              type="button"
              className="group w-full cursor-pointer rounded-xl p-4 transition-all duration-300 hover:bg-stonks-gray/20"
              onClick={handleStartEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStartEdit();
                }
              }}
              title="Click to edit name"
            >
              <div className="stonks-text mb-2 font-bold font-orbitron text-2xl">
                {wojak.name || 'UNNAMED WOJAK'}
              </div>
              <div className="font-medium font-mono text-stonks-light/60 text-xs uppercase tracking-widest transition-colors group-hover:text-stonks-accent">
                CLICK TO EDIT
              </div>
            </button>
          )}
        </div>

        {/* Card Art - Wojak Image */}
        <div className="relative z-10 mb-6 flex min-h-0 flex-1 items-center justify-center">
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-stonks-green/30 bg-gradient-to-br from-stonks-darker/40 to-stonks-gray/20 shadow-inner">
            <WojakRenderer wojak={wojak} />

            {/* Subtle inner glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stonks-darker/20 via-transparent to-transparent"></div>

            {/* Interactive overlay for future drag-and-drop */}
            <div className="pointer-events-none absolute inset-0">
              {/* This will be used for interactive features later */}
            </div>
          </div>
        </div>

        {/* Card Footer - Digital Identity Badge */}
        <div className="relative z-10 text-center">
          <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-r from-stonks-darker/60 to-stonks-gray/40 p-4 shadow-lg backdrop-blur-sm">
            <div className="mb-1 font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-widest">
              DIGITAL IDENTITY
            </div>
            <div className="font-rajdhani font-semibold text-sm text-stonks-green uppercase">
              READY TO MINT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
