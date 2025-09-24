import { ArrowLeft, Grid3X3, Home, Palette } from 'lucide-react';
import type React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WalletButton } from './WalletButton';

interface HeaderProps {
  onBackToBuilder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToBuilder }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentView =
    location.pathname === '/'
      ? 'builder'
      : location.pathname === '/gallery'
        ? 'gallery'
        : location.pathname.startsWith('/wojak/')
          ? 'detail'
          : 'builder';
  return (
    <header className="sticky top-0 z-50 border-stonks-green/40 border-b bg-stonks-darker/95 shadow-2xl backdrop-blur-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-stonks-green to-stonks-accent shadow-lg shadow-stonks-green/20">
              <Palette className="h-7 w-7 text-stonks-dark" />
            </div>
            <div>
              <h1 className="stonks-text font-bold font-orbitron text-3xl">WOJAK OF ALL TRADES</h1>
              <p className="font-medium font-rajdhani text-sm text-stonks-light/80">
                {currentView === 'builder' && 'BUILD YOUR UNIQUE WOJAK CHARACTER'}
                {currentView === 'gallery' && 'BROWSE THE WOJAK COLLECTION'}
                {currentView === 'detail' && 'WOJAK DETAILS'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation */}
            {currentView !== 'detail' && (
              <nav className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`flex items-center space-x-2 rounded-xl px-5 py-3 font-rajdhani font-semibold transition-all duration-300 ${
                    currentView === 'builder'
                      ? 'bg-gradient-to-r from-stonks-green to-stonks-accent text-stonks-dark shadow-lg shadow-stonks-green/20'
                      : 'text-stonks-light/70 hover:bg-stonks-gray/30 hover:text-stonks-light'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>BUILDER</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className={`flex items-center space-x-2 rounded-xl px-5 py-3 font-rajdhani font-semibold transition-all duration-300 ${
                    currentView === 'gallery'
                      ? 'bg-gradient-to-r from-stonks-green to-stonks-accent text-stonks-dark shadow-lg shadow-stonks-green/20'
                      : 'text-stonks-light/70 hover:bg-stonks-gray/30 hover:text-stonks-light'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>GALLERY</span>
                </button>
                
                {/* Wallet Connection Button */}
                <WalletButton />
              </nav>
            )}

            {currentView === 'detail' && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onBackToBuilder}
                  className="flex items-center space-x-2 rounded-xl border border-stonks-green/40 bg-gradient-to-r from-stonks-gray/20 to-stonks-gray/10 px-5 py-3 font-rajdhani font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:border-stonks-green/60 hover:from-stonks-gray/30 hover:to-stonks-gray/20 hover:shadow-xl active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Builder</span>
                </button>
                
                {/* Wallet Connection Button */}
                <WalletButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
