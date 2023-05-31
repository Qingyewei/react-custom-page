import { Button } from "antd";
import _ from "lodash";
import {
  Component,
  ComponentType,
  ForwardRefExoticComponent,
  ForwardedRef,
  PropsWithoutRef,
  RefAttributes,
  createElement,
  forwardRef,
} from "react";

// 借鉴react-error-boundary
// https://www.jianshu.com/p/93827f3f2277

function ErrorFallback({ error, info, resetErrorBoundary }: any) {
  function handleReload() {
    resetErrorBoundary?.();
  }

  return (
    <div style={{ margin: "2em", padding: "1em", border: "1px solid red" }}>
      <Button onClick={handleReload} type="primary">
        <strong>重新加载</strong>
      </Button>
      <div>系统发生错误，请联系管理员</div>
      <pre>
        error:
        {error.toString()}
      </pre>
      <pre>
        info:
        {JSON.stringify(info, null, 2).replace(/\\n/g, "\n")}
      </pre>
    </div>
  );
}

interface ErrorBoundary {
  state: any;
  props: any;
}

const initialState = { error: null, pathname: null, info: null };

// eslint-disable-next-line no-redeclare
class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError(error: any) {
    return {
      error,
    };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({
      pathname: _.get(window, "location.pathname", ""),
      error,
      info,
    });
    this.props.onError?.(error, info);
    window.console.log(
      "\n\n\n\n\ncomponentDidCatch\n",
      "\nerror\n",
      error,
      "\ninfo\n",
      info
    );
  }

  resetErrorBoundary = (...args: any[]) => {
    this.props.onReset?.(...args);
    this.reset();
  };

  reset() {
    this.setState(initialState);
  }

  render() {
    const { error, info } = this.state;
    const props = {
      error,
      info,
      resetErrorBoundary: this.resetErrorBoundary,
    };
    if (error !== null) {
      const FallbackComponent = this.props.FallbackComponent || ErrorFallback;
      return <FallbackComponent {...props} />;
    }
    return this.props.children;
  }
}

function withErrorBoundary<Props extends object>(
  component: ComponentType<Props>,
  errorBoundaryProps: any
): ForwardRefExoticComponent<PropsWithoutRef<Props> & RefAttributes<any>> {
  const Wrapped = forwardRef<ComponentType<Props>, Props>(
    (props: Props, ref: ForwardedRef<ComponentType<Props>>) =>
      createElement(
        ErrorBoundary,
        errorBoundaryProps,
        createElement(component, { ...props, ref })
      )
  );

  // Format for display in DevTools
  const name = component.displayName || component.name || "Unknown";
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}
export { ErrorBoundary, withErrorBoundary };
