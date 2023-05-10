import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetryBackoffConfig, retryBackoff } from 'backoff-rxjs';
import * as jp from 'jsonpath';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  private retryConfig: RetryBackoffConfig = {
    initialInterval: 1000,
    maxRetries: 3,
    resetOnSuccess: true,
  };

  constructor(private http: HttpClient) {}

  private mapToPath(list: any[], path: string) {
    return list
      .map((entry) => jp.query(entry, path))
      .map((entry) => ({ display: entry, value: entry }));
  }

  private sortObjectList(list: any[], sortOrder: string) {
    switch (sortOrder) {
      case 'asc':
        return list
          .sort((a, b) =>
            a.display > b.display ? 1 : b.display > a.display ? -1 : 0
          )
          .reverse();

      case 'desc':
        return list.sort((a, b) =>
          a.display > b.display ? 1 : b.display > a.display ? -1 : 0
        );

      default:
        return list;
    }
  }

  private sort(list: any[], sortOrder: string) {
    switch (sortOrder) {
      case 'asc':
        return list.sort().reverse();

      case 'desc':
        return list.sort();

      default:
        return list;
    }
  }

  /**
   * This function fetches data from a given URL and returns it, optionally filtering it by a specified
   * path.
   * @param {string} url - The URL from which data needs to be fetched.
   * @param {string} [path] - The `path` parameter is an optional string that represents the path to a
   * specific property or nested property in the response object. If provided, the `map` operator will
   * be used to extract the value of the property at the specified path for each entry in the response
   * array.
   * @returns Observable that emits an array of type `any[]`.
   */
  fetchDataList(url: string, path?: string, sortOrder?: string | undefined) {
    return this.http.get<any[]>(url).pipe(
      retryBackoff(this.retryConfig),
      map((value) => (path ? this.mapToPath(value, path) : value)),
      map((value) => {
        if (sortOrder && path) {
          this.sortObjectList(value, sortOrder);
        }
        if (sortOrder && !path) {
          this.sort(value, sortOrder);
        }
        return value;
      })
    );
  }

  /**
   * This function fetches generic data from a given URL using HTTP GET method with retry backoff
   * mechanism.
   * @param {string} url - The URL is a string that represents the address of the resource that needs
   * to be fetched.
   * @returns The function is returning an Observable that emits the result of an
   * HTTP GET request to the specified URL, with retry and backoff logic applied.
   */
  fetchGenericData(url: string) {
    return this.http.get(url).pipe(retryBackoff(this.retryConfig));
  }
}
