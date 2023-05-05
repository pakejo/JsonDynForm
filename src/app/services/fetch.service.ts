import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RetryBackoffConfig, retryBackoff } from 'backoff-rxjs';
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
  fetchDataList(url: string, path?: string) {
    return this.http.get<any[]>(url).pipe(
      retryBackoff(this.retryConfig),
      map((value) => {
        if (path)
          return value.map((entry) =>
            path.split('.').reduce((acc, cur) => acc[cur], entry)
          );
        return value;
      })
    );
  }
}
