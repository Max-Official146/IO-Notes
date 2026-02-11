import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected app error." };
  }

  componentDidCatch(error) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="auth-page">
          <section className="auth-card">
            <h1>Something went wrong</h1>
            <p className="warning">{this.state.message}</p>
            <p className="muted">Please check Firebase env variables and refresh.</p>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
