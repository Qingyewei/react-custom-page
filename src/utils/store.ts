import { WidgetForm } from "@/components/DesignForm/config/element";
import { element } from "../components/DesignForm/config";

function createStore(reducer: (arg0: any, arg1: any) => any) {
  let state: any; // state记录所有状态
  const listeners: any[] = []; // 保存所有注册的回调

  function subscribe(callback: any) {
    listeners.push(callback); // subscribe就是将回调保存下来
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
      data["list"] = [...data["list"], action.payload];
      return data;
    }
    default:
      return state;
  }
}
const Stroe = createStore(reducer);
Stroe.dispatch({});
Stroe.subscribe(() => {
  console.log("数据发送了变化", Stroe.getStateAll());
});
window.Store = Stroe
export default Stroe;
