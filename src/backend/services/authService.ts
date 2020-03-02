import { Settings } from "./settings";

export interface AuthServiceProvider {
  login: (userName: string, password: string) => Promise<string | Error>,
  validateToken: (token: string) => Promise<boolean | Error>;
}

// Singleton class
export class AuthService {

  private static _instance: AuthService;

  static get Instance(): AuthService {
    if(!AuthService._instance) {
      AuthService._instance = new AuthService();
    }

    return AuthService._instance;
  }

  public async login(provider: AuthServiceProvider, userName: string, password: string): Promise<string | Error> {
    const loginResult = await provider.login(userName, password);
    if(loginResult instanceof Error) {
      return loginResult;
    } else {
      Settings.Instance.setToken(loginResult);
      return loginResult;
    }
  }

  public async validateToken(provider: AuthServiceProvider, token: string): Promise<boolean | Error> {
    const result = await provider.validateToken(token);
    if(result instanceof Error) {
      return result;
    } else {
      return true;
    }
  }

}