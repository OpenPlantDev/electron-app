import { Settings } from "./settings";
import { AuthService, AuthServiceProvider } from "./authService";
import { ItemsHub } from "../repositories/ItemsHub";
import { Item } from "../../common/models/Item";
import { IQueryOptions } from "./queryOptions";
import { ApiError } from "./api";

export interface ItemsHubCredentials {
  userName: string;
  password: string;
}

export class ItemsHubConnection {

  private _itemsHub: ItemsHub;
  private _loginCallback: (authService: AuthServiceProvider) => Promise<string | Error>;

  constructor(baseUrl: string, loginCallback: (authService: AuthServiceProvider) => Promise<string | Error>) {
    this._loginCallback = loginCallback;
    this._itemsHub = new ItemsHub(baseUrl);
  }

  private async intializeConnection() {
    const token = Settings.Instance.getToken();

    if(!token || !(AuthService.Instance.validateToken(this._itemsHub, token) instanceof Error)) {
      const loginResult = await this._loginCallback(this._itemsHub);
      if(loginResult instanceof Error) {
        console.log(`Login Error: ${loginResult.message}`);
      } else {
        console.log(`token = ${loginResult}`);
      }
    }
  }

  public async getItems(queryOptions: IQueryOptions): Promise<Item[] | ApiError> {
    let result: Item[] | ApiError = new ApiError(401, "Not authorized");
    let token = Settings.Instance.getToken();
    result = await this._itemsHub.getItems(queryOptions, token ? token : undefined);
    // console.log(result);
    if(result instanceof ApiError && result.status === 401) {
      // token missing or expired, login and try again
      await this.intializeConnection();
      token = Settings.Instance.getToken();
      result = await this._itemsHub.getItems(queryOptions, token ? token : undefined);
    }
    return result;
  }
}