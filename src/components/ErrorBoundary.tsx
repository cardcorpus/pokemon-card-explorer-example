import { Component, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

// If anything inside fails, such as a file that didn't load, this shows a
// message in its place and the rest of the page stays up.
export default function ErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();
  return <Boundary page={pathname + search}>{children}</Boundary>;
}

class Boundary extends Component<{ page: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  // Moving to another page clears the message.
  componentDidUpdate(before: { page: string }) {
    if (before.page !== this.props.page && this.state.failed) this.setState({ failed: false });
  }

  render() {
    return this.state.failed ? <p className="mt-10">Couldn't load this.</p> : this.props.children;
  }
}
