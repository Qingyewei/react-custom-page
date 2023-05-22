import { notification } from 'antd';

function formErrorMessageShow(rej: any, options = {}) {
  rej.msg && notification.error({
    message: rej.msg,
    duration: null,
    description: rej.error,
  });
}

export default formErrorMessageShow;
