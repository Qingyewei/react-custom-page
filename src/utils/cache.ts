interface ProxyStorage {
    key(arg0: number): any;
    getItem(key: string): any;
    setItem(Key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
    length: number;
  }
  
  const loadEnv = (): ViteEnv => import.meta.env;
  
  // sessionStorage operate
  class sessionStorageProxy implements ProxyStorage {
    protected storage: ProxyStorage;
  
    protected static env = loadEnv();
  
    constructor(storageModel: ProxyStorage) {
      this.storage = storageModel;
    }
  
    get length() {
      return this.storage.length;
    }
  
    // 存
    public setItem(key: string, value: any): void {
      this.storage.setItem(
        `${sessionStorageProxy.env.VITE_TITLE}-${sessionStorageProxy.env.VITE_VERSION}-${key}`,
        JSON.stringify(value),
      );
    }
  
    // 取
    public getItem(key: string): any {
      try {
        return JSON.parse(
          this.storage.getItem(
            `${sessionStorageProxy.env.VITE_TITLE}-${sessionStorageProxy.env.VITE_VERSION}-${key}`,
          ),
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`getItem${key}失败`);
        return false;
      }
    }
  
    public key(index: number): any {
      const key = this.storage.key(index);
      const reg = new RegExp(`${sessionStorageProxy.env.VITE_TITLE}-${sessionStorageProxy.env.VITE_VERSION}-`, 'g');
      return key.replace(reg, '');
    }
  
    // 删
    public removeItem(key: string): void {
      this.storage.removeItem(
        `${sessionStorageProxy.env.VITE_TITLE}-${sessionStorageProxy.env.VITE_VERSION}-${key}`,
      );
    }
  
    // 清空
    public clear(): void {
      this.storage.clear();
    }
  }
  
  // localStorage operate
  class localStorageProxy extends sessionStorageProxy implements ProxyStorage {
    // eslint-disable-next-line no-useless-constructor
    constructor(localStorage: ProxyStorage) {
      super(localStorage);
    }
  }
  
  // eslint-disable-next-line new-cap, no-undef
  export const storageSession = new sessionStorageProxy(sessionStorage);
  
  // eslint-disable-next-line new-cap, no-undef
  export const storageLocal = new localStorageProxy(localStorage);
  