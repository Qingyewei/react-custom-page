/// <reference types="vite/client" />

declare module "*.svg";

declare interface ViteEnv {
  VITE_TITLE: string;
  VITE_VERSION: string;
  VITE_PUBLIC_PATH: string;
}

declare interface ImportMetaEnv extends ViteEnv {
  __: undefined;
}

declare interface Window {
  storeState: any;
  CONST_DICT: any;
  User: any;
  Csrf: any;
  antd: any;
  PUBLICKEY: string;
  PRIVATEKEY: string;
  ace: any;
  Store:any;
}
