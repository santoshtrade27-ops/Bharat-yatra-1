import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-3xl bg-card border border-border text-center space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-lg text-foreground font-heading">Something went wrong</h2>
              <p className="text-xs text-muted-foreground">
                An unexpected interface error occurred. You can reload this view to continue exploring safely.
              </p>
            </div>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-muted-foreground bg-muted/60 p-2.5 rounded-xl break-all">
                {this.state.error.message}
              </p>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-2 hover:opacity-90 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reload View
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
