import { ItemsRepository } from "./ItemsRepository";
import { Item } from "../../common/models/Item";
import { Hub } from "../services/hub";
import { IQueryOptions } from "../services/queryOptions";

export class ItemsHub implements ItemsRepository {

  private _resourceName = "items";
  private _hub: Hub;

  constructor(baseUrl: string) {
    this._hub = new Hub(baseUrl);
  }

  public async getItems(queryOptions?: IQueryOptions): Promise<Item[] | Error> {
    const query = `${this._resourceName}${this._hub.getQueryString(queryOptions)}`;
    console.log(`query = ${query}`);
    try {
      const result = await this._hub.getData(query);
      if (result instanceof Error) {
        return result;
      }
      return(result);
    } catch (err) {
      throw err;
    }
  }

  public async getItemById(id: string): Promise<Item | Error> {
    const query = `${this._resourceName}/${id}`;
    console.log(`query = ${query}`);
    try {
      const result = await this._hub.getData(query);
      if (result instanceof Error) {
        return result;
      }
      if (result.length <= 0) {
        return new Error(`No record found for id:[${id}]`);
      }
      return(result[0]);
    } catch (err) {
      throw err;
    }
  }

  public async addItem(comp: Item): Promise<string | Error> {
    throw new Error('Not implemented');
  }

  public async updateItem(comp: Item): Promise<Item | Error> {
    throw new Error('Not implemented');
  }

  public async deleteItem(id: string): Promise<boolean | Error> {
    throw new Error('Not implemented');
  }
}
