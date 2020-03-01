import request from 'request';
import { IQueryOptions } from './queryOptions';

export class Hub {
  _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;

  }

  public getQueryString(options?: IQueryOptions) {
    let queryString: string = "";
    if (options) {
      queryString = options.filter ? `filter=${options.filter}` : queryString;
      queryString = options.orderBy ? `${queryString ? `${queryString}&` : ""}orderby ${options.orderBy}` : queryString;
      queryString = (options.limit > 0) ? `${queryString ? `${queryString}&` : ""}limit ${options.limit}` : queryString;
    }
    return queryString ? `?${queryString}` : "";
  }

  public async getData(queryString: string): Promise<any | Error> {
    const url = `${this._baseUrl}${queryString}`;
    console.log(url);
    return new Promise((resolve, reject) => {
      request(url, { json: true}, (err, res, body) => {
        if (err) {
          console.log(`Query error: ${err.message}`);
          resolve(err);
        } else {
          // console.log(res);
          resolve(body);
        }
      });
    });
  }
}
