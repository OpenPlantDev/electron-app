import { ItemsRepository } from "./ItemsRepository";
import { Item } from "../../common/models/Item";
import { Api, ApiError } from "../services/api";
import { IQueryOptions } from "../services/queryOptions";
import { AuthServiceProvider } from "../services/authService";

export class ItemsHub implements ItemsRepository, AuthServiceProvider {

  private _resourceName = "items";
  private _api: Api;

  constructor(baseUrl: string) {
    this._api = new Api(baseUrl);
  }

  public async login(userName: string, password: string): Promise<string | ApiError> {
    const result = await this._api.login(userName, password);
    return result;
  }

  public async validateToken(token: string): Promise<boolean | ApiError> {
    const result = await this._api.validateToken(token);
    return result;
  }

  public async getItems(queryOptions?: IQueryOptions, token?: string): Promise<Item[] | ApiError> {
    const query = `${this._resourceName}${this._api.getQueryString(queryOptions)}`;
    console.log(`query = ${query}`);
    try {
      const result = await this._api.get(query, token);
      if (result instanceof ApiError) {
        return result;
      }
      return(result);
    } catch (err) {
      throw err;
    }
  }

  public async getItemById(id: string): Promise<Item | ApiError> {
    const query = `${this._resourceName}/${id}`;
    console.log(`query = ${query}`);
    try {
      const result = await this._api.get(query);
      if (result instanceof ApiError) {
        return result;
      }
      if (result.length <= 0) {
        return new ApiError(404, `No record found for id:[${id}]`);
      }
      return(result[0]);
    } catch (err) {
      throw err;
    }
  }

  public async addItem(comp: Item): Promise<string | ApiError> {
    throw new ApiError(501, 'Not implemented');
  }

  public async updateItem(comp: Item): Promise<Item | Error> {
    throw new ApiError(501, 'Not implemented');
  }

  public async deleteItem(id: string): Promise<boolean | Error> {
    throw new ApiError(501, 'Not implemented');
  }
}
