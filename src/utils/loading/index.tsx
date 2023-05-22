import { Spin } from "antd";
import ReactDOM from "react-dom/client";
import "./index.less";

const Loading = ({ tip = "Loading" }: { tip?: string }) => {
  return <Spin tip={tip} size="large" className="request-loading" />;
};

class FullScreenLoading {
  static needLoadingRequestCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static service(options?: any) {
    if (this.needLoadingRequestCount === 0) {
      const dom = document.createElement("div");
      dom.setAttribute("id", "loading");
      document.body.appendChild(dom);
      ReactDOM.createRoot(dom).render(<Loading />);
    }
    this.needLoadingRequestCount++;
    return this;
  }

  static close() {
    if (this.needLoadingRequestCount <= 0) return;
    this.needLoadingRequestCount--;
    if (this.needLoadingRequestCount === 0) {
      document.body.removeChild(
        document.getElementById("loading") as HTMLElement
      );
    }
  }
}

export default FullScreenLoading;
