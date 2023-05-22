export class Event {
    // eslint-disable-next-line @typescript-eslint/ban-types
    events: any;
  
    eventNames: any;
  
    constructor(eventNames?:any) {
      this.events = {};
      this.eventNames = eventNames || {};
    }
  
    subscribe(event:any, fn:any) {
      this.events[event] = fn;
    }
  
    emit(event:any, ...rest: any[]) {
      if (typeof this.events[event] === 'function') {
        this.events[event](...rest);
      }
    }
  }
  
  class AuthEvent extends Event {
    subscribe(event: string | number, fn: any) {
      if (this.eventNames[event]) {
        this.events[event] = fn;
      } else {
        window.console.log('非法的event', event);
      }
    }
  
    subscribeCasJumpAuth(fn: any) {
      this.subscribe(this.eventNames.CAS_JUMP_AUTH, fn);
    }
  
    subscribeCasLogout(fn: any) {
      this.subscribe(this.eventNames.CAS_LOGOUT, fn);
    }
  
    subscribeRefreshToken(fn: any) {
      this.subscribe(this.eventNames.REFRESH_TOKEN, fn);
    }
  
    subscribeVisitor(fn: any) {
      this.subscribe(this.eventNames.VISITOR, fn);
    }
  
    subscribeCasCallback(fn: any) {
      this.subscribe(this.eventNames.CAS_CALLBACK, fn);
    }
  
    subscribeTokenNamePrefix(prefix: any) {
      this.subscribe(this.eventNames.TOKEN_NAME_PREFIX, prefix);
    }
  
    // eslint-disable-next-line consistent-return
    getVisitor() {
      if (this.events[this.eventNames.VISITOR]) {
        return this.events[this.eventNames.VISITOR];
      }
  
      window.console.log('visitor 暂未注册对应的函数，请先注册');
    }
  
    // eslint-disable-next-line consistent-return
    getRefreshToken() {
      if (this.events[this.eventNames.REFRESH_TOKEN]) {
        return this.events[this.eventNames.REFRESH_TOKEN];
      }
  
      window.console.log('refresh_token 暂未注册对应的函数，请先注册');
    }
  }
  
  export default new AuthEvent({
    CAS_JUMP_AUTH: 'CAS_JUMP_AUTH',
    CAS_LOGOUT: 'CAS_LOGOUT',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    VISITOR: 'VISITOR',
    CAS_CALLBACK: 'CAS_CALLBACK',
  });
  