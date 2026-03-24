"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh bg-surface-soft flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-5xl">😵</div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Oups, quelque chose a planté</h1>
          <p className="text-text-secondary text-sm max-w-xs">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-gumroad gradient-primary text-white px-6 py-3 text-sm font-bold"
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
