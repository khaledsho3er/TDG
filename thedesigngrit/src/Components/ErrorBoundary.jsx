import React from "react";
import LoadingScreen from "../Pages/loadingScreen";

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRefreshing: false,
    };
    this.refreshTimeoutId = null;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, isRefreshing: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });

    // Log to analytics or monitoring service if available
    if (window.gtag) {
      window.gtag("event", "error", {
        event_category: "Error",
        event_label: error.toString(),
        value: window.location.pathname,
      });
    }

    // Set up automatic refresh
    this.refreshTimeoutId = setTimeout(() => {
      window.location.reload();
    }, 5000); // Refresh after 5 seconds
  }

  componentWillUnmount() {
    // Clear timeout if component unmounts before refresh
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Show loading screen instead of error UI
      return <LoadingScreen />;
    }

    return this.props.children;
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRefreshing: false,
    });
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
  };
}

// Hook wrapper for class component
const ErrorBoundary = ({ children }) => {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};

export default ErrorBoundary;
