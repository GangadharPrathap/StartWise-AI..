import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './index.jsx'

/**
 * Global Error Boundary for graceful UI recovery
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical UI Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-red-500/5 border border-red-500/10 rounded-[2.5rem]">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">Something went <span className="text-red-500">wrong.</span></h2>
          <p className="text-gray-500 text-xs font-medium max-w-xs mb-8">The AI engine encountered an unexpected state. Don't worry, your data is safe.</p>
          <Button 
            variant="secondary" 
            icon={RotateCcw}
            onClick={() => window.location.reload()}
          >
            Restart Engine
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
