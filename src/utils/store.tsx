import { WidgetForm } from "@/components/DesignForm/config/element";
import { element } from "../components/DesignForm/config";
import React from "react";

function createStore(reducer: (arg0: any, arg1: any) => any) {
  let state: any; // state记录所有状态
  let listeners: any[] = []; // 保存所有注册的回调

  function subscribe(listener: any) {
    listeners.push(listener); // subscribe就是将回调保存下来
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  // dispatch就是先执行reducer修改state
  // 然后将所有的回调拿出来依次执行就行
  function dispatch(action: any) {
    state = reducer(state, action);

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // getState直接返回state
  function getState(type: string) {
    return state[type];
  }

  function getStateAll(): WidgetForm {
    return state;
  }
  dispatch({ type: "@@redux/INIT" });
  // store包装一下前面的方法直接返回
  const store = {
    subscribe,
    dispatch,
    getState,
    getStateAll,
  };

  return store;
}

function reducer(
  state = element.widgetForm,
  action: { type: any; payload: any }
) {
  switch (action.type) {
    case "change":
      return action.payload;
    case "dataSource": {
      const data = { ...state };
      data["dataSource"] = action.payload;
      return data;
    }
    case "page": {
      const data = { ...state };
      data["page"] = action.payload;
      return data;
    }
    case "list": {
      const data = { ...state };
      data["list"] = action.payload;
      return data;
    }
    case "listItem": {
      const data = { ...state };
      data["list"] = [...data["list"], action.payload];
      return data;
    }
    case "widgetFormCurrentSelect": {
      const data = { ...state };
      data["widgetFormCurrentSelect"] = action.payload;
      return data;
    }
    default:
      return state;
  }
}
const Store = createStore(reducer);
export const connect = (mapStateToProps: any, mapDispatchToProps?: any) => {
  return (WrapedComponent: any) => {
    class ConnectedComponent extends React.Component {
      unsubscribe: () => void;
      constructor(props: any) {
        super(props);
        this.unsubscribe = Store.subscribe(() => this.forceUpdate());
      }

      forceUpdate = () => {
        console.log("发生变化");
      };

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        const state = Store.getStateAll();
        let props = {
          ...this.props,
          ...mapStateToProps(state),
        };
        if (mapDispatchToProps) {
          props = { ...props, ...mapDispatchToProps(Store.dispatch) };
        }

        return <WrapedComponent {...props} />;
      }
    }
    return ConnectedComponent;
  };
};
// Store.dispatch({});
// Store.subscribe(() => {
//   console.log("数据发送了变化", Store.getStateAll());
// });
window.Store = Store;
export default Store;
