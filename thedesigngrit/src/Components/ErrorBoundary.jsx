import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to analytics or monitoring service if available
    if (window.gtag) {
      window.gtag('event', 'error', {
        'event_category': 'Error',
        'event_label': error.toString(),
        'value': window.location.pathname
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.state.errorInfo, this.resetError)
      ) : (
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" paragraph>
            We're sorry, but there was an error loading this page.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                window.location.reload();
              }}
              sx={{ mr: 2 }}
            >
              Reload Page
            </Button>
            <Button 
              variant="outlined"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Go to Homepage
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }
}

// Hook wrapper for class component
const ErrorBoundary = ({ children, fallback }) => {
  const navigate = useNavigate();
  
  const defaultFallback = (error, errorInfo, resetError) => (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" paragraph>
        We're sorry, but there was an error loading this page.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            resetError();
            window.location.reload();
          }}
          sx={{ mr: 2 }}
        >
          Reload Page
        </Button>
        <Button 
          variant="outlined"
          onClick={() => {
            resetError();
            navigate('/');
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );

  return (
    <ErrorBoundaryClass fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundaryClass>
  );
};

export default ErrorBoundary;