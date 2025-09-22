import type React from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { WojakBuilder } from './components/WojakBuilder';
import { WojakDetail } from './components/WojakDetail';
import { WojakGallery } from './components/WojakGallery';
import { useToast } from './hooks/useToast';
import { useWojakStorage } from './hooks/useWojakStorage';
import type { WojakCharacter } from './types/wojak';
import { exportWojakAsPNG } from './utils/wojakExporter';

// Component for individual wojak detail page
interface WojakDetailPageProps {
  getWojakById: (id: string) => WojakCharacter | null;
  onBackToGallery: () => void;
  onShareWojak: (wojak: WojakCharacter) => void;
  onDownloadWojak: (wojak: WojakCharacter) => void;
}

const WojakDetailPage: React.FC<WojakDetailPageProps> = ({
  getWojakById,
  onBackToGallery,
  onShareWojak,
  onDownloadWojak,
}) => {
  const { id } = useParams<{ id: string }>();
  const wojak = id ? getWojakById(id) : null;

  if (!wojak) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-6xl">😢</div>
        <h3 className="stonks-red mb-2 font-bold text-2xl">WOJAK NOT FOUND</h3>
        <p className="mb-6 text-stonks-light/70">THE WOJAK YOU'RE LOOKING FOR DOESN'T EXIST.</p>
        <button type="button" onClick={() => window.history.back()} className="wojak-button">
          BACK TO BUILDER
        </button>
      </div>
    );
  }

  return (
    <WojakDetail
      wojak={wojak}
      onBack={onBackToGallery}
      onShare={onShareWojak}
      onDownload={onDownloadWojak}
    />
  );
};

function App() {
  const navigate = useNavigate();
  const { mintWojak, getWojakById, clearAllWojaks } = useWojakStorage();
  const { toasts, removeToast, success, error } = useToast();

  const handleMintWojak = (wojak: Omit<WojakCharacter, 'id' | 'createdAt'>) => {
    try {
      const mintedWojak = mintWojak(wojak);
      navigate(`/wojak/${mintedWojak.id}`);
      success(
        'Wojak Minted Successfully! 🎉',
        `${mintedWojak.name} has been added to your collection as #${mintedWojak.id.split('_')[1]}`,
        6000
      );
    } catch (_err) {
      error('Minting Failed', 'There was an error minting your wojak. Please try again.');
    }
  };

  const handleViewWojak = (wojak: WojakCharacter) => {
    navigate(`/wojak/${wojak.id}`);
  };

  const handleBackToGallery = () => {
    navigate('/gallery');
  };

  const handleBackToBuilder = () => {
    navigate('/');
  };

  const handleShareWojak = (wojak: WojakCharacter) => {
    const shareData = {
      title: `${wojak.name} - Wojak of All Trades`,
      text: `Check out this awesome wojak I created! #${wojak.id.split('_')[1]}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `${wojak.name} - Wojak #${wojak.id.split('_')[1]}\n${window.location.href}`
      );
      success('Link Copied!', 'Wojak link has been copied to your clipboard.');
    }
  };

  const handleDownloadWojak = async (wojak: WojakCharacter) => {
    try {
      await exportWojakAsPNG(wojak);
      success('Download Started!', `${wojak.name} is being downloaded as PNG.`);
    } catch (err) {
      console.error('Download error:', err);
      error('Download Failed', 'There was an error downloading your wojak. Please try again.');
    }
  };

  const handleClearDatabase = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all wojaks from the database? This action cannot be undone.'
      )
    ) {
      clearAllWojaks();
      navigate('/');
      success('Database Cleared!', 'All wojaks have been removed from the database.');
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Memestonks Background Elements */}
      <div className="stonks-bg-pattern"></div>
      <div className="stonks-grid stonks-pulse"></div>

      <Routes>
        <Route path="/error" element={<ErrorPage />} />
        <Route
          path="/*"
          element={
            <>
              <Header onBackToBuilder={handleBackToBuilder} />
              <main className="relative z-10 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <div className="container mx-auto h-full px-4 py-4">
                    <Routes>
                      <Route path="/" element={<WojakBuilder onMint={handleMintWojak} />} />
                      <Route
                        path="/gallery"
                        element={
                          <WojakGallery
                            onViewWojak={handleViewWojak}
                            onShareWojak={handleShareWojak}
                            onDownloadWojak={handleDownloadWojak}
                            onCreateWojak={() => navigate('/')}
                          />
                        }
                      />
                      <Route
                        path="/wojak/:id"
                        element={
                          <WojakDetailPage
                            getWojakById={getWojakById}
                            onBackToGallery={handleBackToGallery}
                            onShareWojak={handleShareWojak}
                            onDownloadWojak={handleDownloadWojak}
                          />
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </main>
              <Footer onClearDatabase={handleClearDatabase} />
            </>
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;
