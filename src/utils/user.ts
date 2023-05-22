import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { storageLocal } from './cache';

const TokenName = 'access_token';

const TOKEN_SET_TIME_TOKEN_KEY = 'token_set_time_token_key';
const TOKEN_REMOVE_TOKEN_KEY = 'token_remove_token_key';

class UserService{
  get token() {
    // if (this.tokenCache) {
    //   return this.tokenCache;
    // }
    return this.getToken(true);
  }

  set token(token) {
    if (token === null) {
      this.unsetToken();
    } else {
      this.setToken(token);
    }
  }

  getToken(force = false) {
    const token = storageLocal.getItem(TokenName) || null;
    if (force === true) {
      return token;
    }

    if (this.validToken(token)) {
      return token;
    }

    return null;
  }

  setToken(token: string | { [property: string]: string; } | null | undefined) {
    if (typeof token === 'string' && token && this.validToken(token) === true) {
      // this.tokenCache = token;
      storageLocal.setItem(TokenName, token);
      storageLocal.setItem(TOKEN_SET_TIME_TOKEN_KEY, moment().format('YYYY-MM-DD HH:mm:ss'));
      storageLocal.removeItem(TOKEN_REMOVE_TOKEN_KEY);
      return true;
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  unsetToken() {
    // this.tokenCache = null;
    storageLocal.removeItem(TokenName);
    storageLocal.setItem(TOKEN_REMOVE_TOKEN_KEY, moment().format('YYYY-MM-DD HH:mm:ss'));
    return true;
  }

  validToken(token = this.token, options?: { offset: number; } | undefined) {
    // offset 是提前了多久，默认提前 60 秒
    const offset = options?.offset || 60;
    if (!token) {
      return false;
    }

    try {
      const { exp } = jwtDecode(token as string) as any;
      const flag = moment().unix() < exp - offset;
      if (window.console && window.console.log && !flag) {
        window.console.log('try validToken flag', flag);
      }
      return flag;
    } catch (error) {
      if (window.console && window.console.log) {
        window.console.log('validToken false', error);
      }
      return false;
    }
  }
}
const User = new UserService();

window.User = User;

export default User;
