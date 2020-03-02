import request from 'request';
import { IQueryOptions } from './queryOptions';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class Api {
  _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;

  }

  public async login(userName: string, password: string): Promise<string | ApiError> {
    const url = `${this._baseUrl}login`;
    console.log(url);
    const options = {
      json: true,
      headers : {
        'Authorization': `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`
      }
    }
    return new Promise((resolve, reject) => {
      request(url, options, (err, res, body) => {
        if (err) {
          console.log(`Login error: ${err.message}`);
          resolve(err);
        } else {
          console.log(res.statusCode);
          if(res.statusCode === 200) {
            resolve(body.token);
          } else {
            resolve(new ApiError(res.statusCode, body.message));
          }
        }
      });
    });
  }

  public async validateToken(token: string): Promise<boolean | ApiError> {
    const url = `${this._baseUrl}validatetoken`;
    const options = token ? {json: true, headers: {'Authorization': `Bearer ${token}`}} : { json: true};

    return new Promise((resolve, reject) => {
      request(url, options, (err, res, body) => {
        if (err) {
          console.log(res.statusCode);
          console.log(`Query error: ${err.message}`);
          resolve(new ApiError(res.statusCode, err.message));
        } else {
          // console.log(res);
          resolve(true);
        }
      });
    });
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

  public async get(queryString: string, token?: string): Promise<any | ApiError> {
    const url = `${this._baseUrl}${queryString}`;
    console.log(url);
    const options = token ? {json: true, headers: {'Authorization': `Bearer ${token}`}} : { json: true};

    return new Promise((resolve, reject) => {
      request(url, options, (err, res, body) => {
        if (err) {
          console.log(`Query error: ${err.message}`);
          resolve(new ApiError(res.statusCode, err.message));
        } else if (res.statusCode !== 200) {
          console.log(`Query error: ${res.statusCode}: ${body.message}`)
          resolve(new ApiError(res.statusCode, body.message));
        } else {
          // console.log(res);
          resolve(body);
        }
      });
    });
  }
}
