import { Cookies as tsCookies } from 'typescript-cookie';

const loadEnv = (): ViteEnv => import.meta.env;

class Cookies {
  private static env = loadEnv();

  // eslint-disable-next-line @typescript-eslint/no-empty-function, no-useless-constructor, no-empty-function
  constructor() {}

  /**
   *  存储 cookie 值
   * @param name
   * @param value
   * @param cookieSetting
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(name = 'default', value = '', cookieSetting = {}) {
    const currentCookieSetting = {
      expires: 1,
      ...cookieSetting,
    };
    tsCookies.set(
      `${Cookies.env.VITE_TITLE}-${Cookies.env.VITE_VERSION}-${name}`,
      value,
      currentCookieSetting,
    );
  }

  /**
   * 拿到 cookie 值
   * @param name
   * @returns
   */
  get(name = 'default') {
    return tsCookies.get(`${Cookies.env.VITE_TITLE}-${Cookies.env.VITE_VERSION}-${name}`);
  }

  /**
   * 拿到 cookie 全部的值
   * @returns
   */
  getAll() {
    return tsCookies.get();
  }

  /**
   * 删除 cookie
   * @param name
   */
  remove(name = 'default', cookieSetting = {}) {
    tsCookies.remove(`${Cookies.env.VITE_TITLE}-${Cookies.env.VITE_VERSION}-${name}`, cookieSetting);
  }

  removeAll() {
    const all = this.getAll();
    // eslint-disable-next-line no-restricted-syntax
    for (const i in all as object) {
      tsCookies.remove(i);
    }
  }
}

export default new Cookies();

export function getCookie(cookieName:string) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i += 1) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}
