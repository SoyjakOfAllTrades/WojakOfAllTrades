import { Check, Copy } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Helper component for error display with copy functionality
const ErrorDisplay: React.FC<{ error: Error }> = ({ error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(error.toString());
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
              value={error.toString()}
              readOnly
              className="h-32 w-full resize-none border-none bg-transparent font-mono text-stonks-light/80 text-xs outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="wojak-button px-8 py-3 text-lg"
        >
          RELOAD PAGE
        </button>
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}
