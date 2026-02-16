"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  /** Child components to protect from crashes */
  children: ReactNode;
  /** Optional fallback UI to show when an error occurs */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches JavaScript errors in its child component tree,
 * prevents the entire app from crashing, and displays a recoverable fallback UI.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[Chronos ErrorBoundary]", error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--chronos-void, #050510)",
            color: "var(--text-primary, #e8e6f0)",
            fontFamily: "var(--font-body, sans-serif)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>⚡</div>
          <h1 style={{ fontFamily: "var(--font-display, monospace)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--neon-cyan, #00f0ff)" }}>
            Temporal Disruption Detected
          </h1>
          <p style={{ color: "var(--text-secondary, #a5a3b3)", maxWidth: "400px", marginBottom: "1.5rem" }}>
            A critical error has fractured this timeline branch. The Chronos Engine is attempting recovery.
          </p>
          <button
            onClick={this.handleRetry}
            aria-label="Retry loading the application"
            style={{
              padding: "10px 24px",
              background: "transparent",
              border: "1px solid var(--neon-cyan, #00f0ff)",
              color: "var(--neon-cyan, #00f0ff)",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: "14px",
            }}
          >
            ⟳ Restore Timeline
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
