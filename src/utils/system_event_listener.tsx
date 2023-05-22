import CONSTANTS from './constants';
import { storageLocal, storageSession } from './cache';
import formErrorMessageShow from './form_error_message_show';
import AuthEvent, { Event } from './system_event';
import Cookies from '@/utils/cookies';
import { Modal } from 'antd';
import _ from "lodash";

export const SystemEvent = new Event();

// 监听全局提示请求状态 401 的事件，此时直接提醒是否重新授权
let modal401: { destroy: () => void; };
SystemEvent.subscribe(CONSTANTS.EVENT.CAS_AUTH_401, (data: any) => {
  formErrorMessageShow(data);
  const closeModel = () => {
    if (modal401 && modal401.destroy) {
      modal401.destroy();
    }
  };

  closeModel();

  const onOk = () => {
    AuthEvent.emit(AuthEvent.eventNames.CAS_LOGOUT);
  };

  const onCancel = () => {
    closeModel();
  };

  const refreshAuth = () => {
    AuthEvent.emit(AuthEvent.eventNames.CAS_JUMP_AUTH);
  };

  modal401 = Modal.confirm({
    title: '登录失效',
    content: (<div>
      <div>当前登录状态已经失效，请重新登录。</div>
      <div className="ant-form-extra ant-hide">
        或者
        {
            // eslint-disable-next-line
            <a onClick={refreshAuth}>重新授权</a>
          }
      </div>
    </div>),
    footer: null,
    okText: '重新登录',
    cancelText: '关闭',
    onOk,
    onCancel,
  });
});

// 清空本域下面的所有存储的信息
export function cleanStorage() {
  // 前缀为important_的storage，将不会被此代码清除
  const cacheForImportant = [];
  if (window.localStorage && storageLocal.clear) {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = storageLocal.key(i);
      if (/important_/.test(key)) {
        cacheForImportant.push({
          key,
          value: storageLocal.getItem(key),
        });
      }
    }
    storageLocal.clear();
    // 执行恢复
    _.each(cacheForImportant, (item) => {
      storageLocal.setItem(item.key, item.value);
    });
  }

  if (window.sessionStorage && storageSession.clear) {
    storageSession.clear();
  }

  Cookies.removeAll();
  // Cookies.set(TOKEN_REMOVE_TOKEN_KEY, moment().format('YYYY-MM-DD HH:mm:ss'), cookieOption);
}

// 监听全局退出的事件
export const casLogout = () => {
  cleanStorage();
  const url = window.location.href.split('#ctrl_d');
  const jumpUrl = `/cas?redirect_url=${encodeURIComponent(url[0])}`;
  return window.location.replace(jumpUrl);
};
