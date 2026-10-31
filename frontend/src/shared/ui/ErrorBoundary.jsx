import { Component } from "react";
import { ErrorState } from "./StateViews";

/** Catches render errors in a route so one broken page does not blank the app. */
export class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <ErrorState message="Something went wrong on this page." onRetry={() => this.setState({ failed: false })} />;
    }

    return this.props.children;
  }
}
