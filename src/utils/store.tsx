import { WidgetForm } from "@/components/DesignForm/config/element";
import { element } from "../components/DesignForm/config";
import React from "react";
import _ from "lodash";

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

// const notCoverStrs = ["options.defaultValue"];

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
      data["list"] = data["list"].map((item) => {
        if (item.id === _.get(action, "payload.id")) {
          item = { ...item, ...action.payload };
          if (
            _.get(action, "options.defaultValue") &&
            Array.isArray(_.get(action, "options.defaultValue"))
          ) {
            _.set(
              item,
              "options.defaultValue",
              _.get(action, "options.defaultValue", [])
            );
          }
          if (
            _.get(action, "widgetProperties.dataSource") &&
            Array.isArray(_.get(action, "widgetProperties.dataSource"))
          ) {
            _.set(
              item,
              "widgetProperties.dataSource",
              _.get(action, "widgetProperties.dataSource", [])
            );
          }
          // eslint-disable-next-line no-prototype-builtins
          // if (action.payload.hasOwnProperty("widgetProperties")) {
          //   item["widgetProperties"] = action.payload["widgetProperties"];
          // }
          // item = _.defaultsDeep(action.payload,item)
          // debugger
          // console.log("替换前",item)
          // item = _.merge(action.payload,item) // 不能全部替换，会出现无法修改的情况
          // console.log("替换后", {
          //   item,
          //   payload: action.payload,
          //   after_1:_.defaultsDeep(action.payload,item),
          //   after: _.defaultsDeep(
          //     _.cloneDeep(action.payload),
          //     _.cloneDeep(item)
          //   ),
          //   aftermerge: _.merge(_.cloneDeep(item),_.cloneDeep(action.payload)),
          // });
          data["widgetFormCurrentSelect"] = item;
        }
        return item;
      });
      if (!action.payload) {
        data["widgetFormCurrentSelect"] = null;
      }
      return data;
    }
    case "listItemCopy": {
      const data = { ...state };
      const currentIndex = data["list"].findIndex(
        (item) => item.id === data["widgetFormCurrentSelect"].id
      );
      data["list"].splice(currentIndex + 1, 0, action.payload);
      // data["widgetFormCurrentSelect"] = { ...action.payload };
      return data;
    }
    case "listItemDelete": {
      const data = { ...state };
      const currentIndex = data["list"].findIndex(
        (item) => item.id === data["widgetFormCurrentSelect"].id
      );
      data["list"] = data["list"].filter((item) => item.id !== action.payload);
      if (data["widgetFormCurrentSelect"].id === action.payload) {
        const widgetFormCurrentSelect = data["list"][currentIndex - 1];
        if (!widgetFormCurrentSelect) {
          data["widgetFormCurrentSelect"] = null;
        } else {
          data["widgetFormCurrentSelect"] = widgetFormCurrentSelect;
        }
      }
      return data;
    }
    default:
      return state;
  }
}
const Store = createStore(reducer);
export const connect = (mapStateToProps: any, mapDispatchToProps?: any) => {
  return (WrapedComponent: any) => {
    class ConnectedComponent extends React.Component<any> {
      unsubscribe: () => void;
      constructor(props: any) {
        super(props);
        this.state = Store.getStateAll();
        this.unsubscribe = Store.subscribe(() => this.forceUpdate());
      }

      forceUpdate = () => {
        this.setState(Store.getStateAll());
      };

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        let props = {
          ...this.props,
          ...mapStateToProps(this.state),
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
