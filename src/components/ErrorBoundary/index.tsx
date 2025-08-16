import React from "react";
import { Button, Card, Collapse, ScrollArea, Stack, Text } from "@mantine/core";
import { useLocation } from "react-router";
import styles from "./styles.module.scss";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

// Wrapper component to get location and pass it to ErrorBoundary
const ErrorBoundaryWithLocation: React.FC<Props> = (props) => {
  const location = useLocation();
  return <ErrorBoundaryClass {...props} pathname={location.pathname} />;
};

interface ErrorBoundaryProps extends Props {
  pathname: string;
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // You can also log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Clear error state when route changes
    if (this.props.pathname !== prevProps.pathname && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
      });
    }
  }

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card shadow="sm" p="xl" radius="md" h="100%">
          <div className={styles.errorContainer}>
            <ScrollArea className={styles.scrollArea}>
              <Stack align="center">
                <Text ta="center" c="red.6" size="lg">
                  We encountered an unexpected error. <br /> Please try
                  refreshing the page or contact support if the problem
                  persists.
                </Text>
                {process.env.NODE_ENV === "development" && (
                  <>
                    <Button
                      variant="subtle"
                      onClick={this.toggleDetails}
                      size="xs"
                      color="gray"
                    >
                      {this.state.showDetails ? "Hide" : "Show"} technical
                      details
                    </Button>
                    <Collapse in={this.state.showDetails}>
                      <Card p="md" withBorder>
                        <Stack>
                          <Text
                            size="sm"
                            ff="monospace"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {this.state.error?.toString()}
                          </Text>
                          {this.state.errorInfo && (
                            <Text
                              size="sm"
                              ff="monospace"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {this.state.errorInfo.componentStack}
                            </Text>
                          )}
                        </Stack>
                      </Card>
                    </Collapse>
                  </>
                )}
              </Stack>
            </ScrollArea>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundaryWithLocation as ErrorBoundary };
