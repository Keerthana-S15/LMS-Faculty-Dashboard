import { Component } from "react";
import { Card, ErrorState } from "./ui";

/**
 * Catches render errors inside a page so a single broken view shows a clean
 * error card instead of blanking the whole dashboard. Layout keys it on the
 * route, so navigating elsewhere remounts it and clears the error.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Card className="max-w-xl mx-auto mt-6">
          <ErrorState
            title="This page ran into a problem"
            description={
              import.meta.env.DEV && this.state.error?.message
                ? this.state.error.message
                : "Something unexpected happened while rendering this page. Reloading usually fixes it."
            }
            onRetry={() => this.setState({ error: null })}
            retryLabel="Reload page"
          />
        </Card>
      );
    }
    return this.props.children;
  }
}
