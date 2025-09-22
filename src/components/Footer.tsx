import { AlertTriangle, Github, Trash2, Twitter } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  onClearDatabase?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onClearDatabase }) => {
  const navigate = useNavigate();

  return (
    <footer className="mt-auto border-stonks-green/40 border-t bg-stonks-darker/95 shadow-2xl backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Brand + Social */}
          <div className="flex items-center space-x-6">
            {/* Brand */}
            <div className="font-rajdhani text-sm text-stonks-light/70">
              <span className="font-bold font-orbitron text-stonks-green">WOJAK OF ALL TRADES</span>
              <span className="mx-3 text-stonks-light/40">•</span>
              <span className="font-medium">First Mint, First Served</span>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-stonks-gray/40"></div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/wojakoftrades"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-stonks-light/60 transition-all duration-300 hover:scale-110 hover:bg-stonks-green/10 hover:text-stonks-green"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/wojakoftrades"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-stonks-light/60 transition-all duration-300 hover:scale-110 hover:bg-stonks-green/10 hover:text-stonks-green"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right Section: Dev Tools */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/error')}
              className="flex items-center space-x-2 rounded-lg bg-stonks-orange/20 px-3 py-2 font-rajdhani font-semibold text-stonks-orange text-xs transition-all duration-300 hover:scale-105 hover:bg-stonks-orange/30"
              title="View error page"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>ERROR</span>
            </button>
            {onClearDatabase && (
              <button
                type="button"
                onClick={onClearDatabase}
                className="flex items-center space-x-2 rounded-lg bg-stonks-red/20 px-3 py-2 font-rajdhani font-semibold text-stonks-red text-xs transition-all duration-300 hover:scale-105 hover:bg-stonks-red/30"
                title="Clear all wojaks from database"
              >
                <Trash2 className="h-3 w-3" />
                <span>CLEAR DB</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
