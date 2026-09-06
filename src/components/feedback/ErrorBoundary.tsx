import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React lifecycle:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/home';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950 text-surface-50 text-center">
          <div className="max-w-md p-6 bg-surface-900 border border-rose-900/50 rounded-2xl space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-surface-100">Application Subsystem Interruption</h2>
            <p className="text-xs text-surface-400 leading-relaxed">
              An unexpected client render state was encountered. Your routing sessions and authoritative QIGA jobs remain secure.
            </p>
            {this.state.error && (
              <code className="block text-[11px] font-mono text-rose-300 bg-surface-950 p-2.5 rounded-lg border border-rose-950 break-all text-left">
                {this.state.error.message}
              </code>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={this.handleReset}
              leftIcon={<RotateCw className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Recover Application State
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
