import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary-bg flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-gray-900 border border-red-900/50 rounded-2xl p-8 shadow-2xl">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Kuch galat ho gaya</h1>
            <p className="text-muted-text mb-6 text-sm">
              Application mein ek error aaya hai. Please page refresh karein.
            </p>
            <pre className="bg-black/50 p-4 rounded-lg text-left text-[10px] text-red-400 overflow-auto mb-6 max-h-40">
              {this.state.error?.message || JSON.stringify(this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
