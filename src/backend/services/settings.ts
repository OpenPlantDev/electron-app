import {LocalStorage} from "node-localstorage";

// Singleton class
export class Settings {

  private static _instance: Settings;
  settingsLocalStorage: LocalStorage;

  private _tokenKey = "token";

  constructor() {
    this.settingsLocalStorage = new LocalStorage("./settings");
  }

  static get Instance(): Settings {
    if(!Settings._instance) {
      Settings._instance = new Settings();
    }

    return Settings._instance;
  }

  public getItem = (key: string): string | null => {
    return this.settingsLocalStorage.getItem(key);
  }

  public setItem = (key: string, value: string): void => {
    this.settingsLocalStorage.setItem(key, value);
  }

  public getToken(): string | null {
    return this.getItem(this._tokenKey);
  }

  public setToken(token: string) : void {
    this.setItem(this._tokenKey, token);
  }

}
