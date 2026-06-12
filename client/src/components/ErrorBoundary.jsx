import { Component } from "react";
import * as Sentry from "@sentry/react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center space-y-5">
            <div className="text-4xl">&#9888;</div>
            <h1 className="text-2xl font-semibold text-[#E5E7EB]">Something went wrong</h1>
            <p className="text-sm text-[#94A3B8] max-w-sm mx-auto">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-2xl bg-[#2F80ED] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1D64C1]"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
