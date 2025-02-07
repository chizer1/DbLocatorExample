/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Connection {
  /** @format int32 */
  id?: number;
  database?: Database;
  tenant?: Tenant;
}

export interface Database {
  /** @format int32 */
  id?: number;
  name?: string | null;
  type?: DatabaseType;
  server?: DatabaseServer;
  status?: Status;
  useTrustedConnection?: boolean;
}

export interface DatabaseServer {
  /** @format int32 */
  id?: number;
  name?: string | null;
  ipAddress?: string | null;
}

export interface DatabaseType {
  /** @format int32 */
  id?: number;
  name?: string | null;
}

/** @format int32 */
export enum Status {
  Value1 = 1,
  Value2 = 2,
}

export interface Tenant {
  /** @format int32 */
  id?: number;
  name?: string | null;
  code?: string | null;
  status?: Status;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (response.status === 500) {
        const errorBody = await response.text();
        const match = errorBody.match(
          /System\.InvalidOperationException: (.*?)(\r?\n|$)/
        );
        if (match) {
          throw new Error(match[1]);
        } else {
          throw new Error(`${errorBody}`);
        }
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title DbLocatorExample
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  getAccounts = {
    /**
     * No description
     *
     * @tags Accounts
     * @name GetAccountsList
     * @request GET:/getAccounts
     */
    getAccountsList: (
      query: {
        /** @format int32 */
        tenantId: number;
        /** @format int32 */
        databaseTypeId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<any[], any>({
        path: `/getAccounts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  addConnection = {
    /**
     * No description
     *
     * @tags Connection
     * @name AddConnectionCreate
     * @request POST:/addConnection
     */
    addConnectionCreate: (
      query: {
        /** @format int32 */
        tenantId: number;
        /** @format int32 */
        databaseId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<number, any>({
        path: `/addConnection`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getConnections = {
    /**
     * No description
     *
     * @tags Connection
     * @name GetConnectionsList
     * @request GET:/getConnections
     */
    getConnectionsList: (params: RequestParams = {}) =>
      this.request<Connection[], any>({
        path: `/getConnections`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  deleteConnection = {
    /**
     * No description
     *
     * @tags Connection
     * @name DeleteConnectionDelete
     * @request DELETE:/deleteConnection
     */
    deleteConnectionDelete: (
      query: {
        /** @format int32 */
        connectionId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/deleteConnection`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  addDatabase = {
    /**
     * No description
     *
     * @tags Database
     * @name AddDatabaseCreate
     * @request POST:/addDatabase
     */
    addDatabaseCreate: (
      query: {
        databaseName: string;
        databaseUser: string;
        /** @format int32 */
        databaseServerId: number;
        /** @format int32 */
        databaseTypeId: number;
        databaseStatus: Status;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/addDatabase`,
        method: "POST",
        query: query,
        ...params,
      }),
  };
  getDatabases = {
    /**
     * No description
     *
     * @tags Database
     * @name GetDatabasesList
     * @request GET:/getDatabases
     */
    getDatabasesList: (params: RequestParams = {}) =>
      this.request<Database[], any>({
        path: `/getDatabases`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  updateDatabase = {
    /**
     * No description
     *
     * @tags Database
     * @name UpdateDatabaseUpdate
     * @request PUT:/updateDatabase
     */
    updateDatabaseUpdate: (
      query: {
        /** @format int32 */
        databaseId: number;
        databaseName: string;
        databaseUser: string;
        /** @format int32 */
        databaseServerId: number;
        /** @format int32 */
        databaseTypeId: number;
        databaseStatus: Status;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/updateDatabase`,
        method: "PUT",
        query: query,
        ...params,
      }),
  };
  deleteDatabase = {
    /**
     * No description
     *
     * @tags Database
     * @name DeleteDatabaseDelete
     * @request DELETE:/deleteDatabase
     */
    deleteDatabaseDelete: (
      query: {
        /** @format int32 */
        databaseId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/deleteDatabase`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  addDatabaseServer = {
    /**
     * No description
     *
     * @tags DatabaseServer
     * @name AddDatabaseServerCreate
     * @request POST:/addDatabaseServer
     */
    addDatabaseServerCreate: (
      query: {
        databaseServerName: string;
        databaseServerIpAddress: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<number, any>({
        path: `/addDatabaseServer`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getDatabaseServers = {
    /**
     * No description
     *
     * @tags DatabaseServer
     * @name GetDatabaseServersList
     * @request GET:/getDatabaseServers
     */
    getDatabaseServersList: (params: RequestParams = {}) =>
      this.request<DatabaseServer[], any>({
        path: `/getDatabaseServers`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  updateDatabaseServer = {
    /**
     * No description
     *
     * @tags DatabaseServer
     * @name UpdateDatabaseServerUpdate
     * @request PUT:/updateDatabaseServer
     */
    updateDatabaseServerUpdate: (
      query: {
        /** @format int32 */
        databaseServerId: number;
        databaseServerName: string;
        databaseServerIpAddress: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/updateDatabaseServer`,
        method: "PUT",
        query: query,
        ...params,
      }),
  };
  deleteDatabaseServer = {
    /**
     * No description
     *
     * @tags DatabaseServer
     * @name DeleteDatabaseServerDelete
     * @request DELETE:/deleteDatabaseServer
     */
    deleteDatabaseServerDelete: (
      query: {
        /** @format int32 */
        serverId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/deleteDatabaseServer`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  addDatabaseType = {
    /**
     * No description
     *
     * @tags DatabaseType
     * @name AddDatabaseTypeCreate
     * @request POST:/addDatabaseType
     */
    addDatabaseTypeCreate: (
      query: {
        name: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<number, any>({
        path: `/addDatabaseType`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getDatabaseTypes = {
    /**
     * No description
     *
     * @tags DatabaseType
     * @name GetDatabaseTypesList
     * @request GET:/getDatabaseTypes
     */
    getDatabaseTypesList: (params: RequestParams = {}) =>
      this.request<DatabaseType[], any>({
        path: `/getDatabaseTypes`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  updateDatabaseType = {
    /**
     * No description
     *
     * @tags DatabaseType
     * @name UpdateDatabaseTypeUpdate
     * @request PUT:/updateDatabaseType
     */
    updateDatabaseTypeUpdate: (
      query: {
        /** @format int32 */
        databaseTypeId: number;
        name: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/updateDatabaseType`,
        method: "PUT",
        query: query,
        ...params,
      }),
  };
  deleteDatabaseType = {
    /**
     * No description
     *
     * @tags DatabaseType
     * @name DeleteDatabaseTypeDelete
     * @request DELETE:/deleteDatabaseType
     */
    deleteDatabaseTypeDelete: (
      query: {
        /** @format int32 */
        databaseTypeId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/deleteDatabaseType`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  addTenant = {
    /**
     * No description
     *
     * @tags Tenant
     * @name AddTenantCreate
     * @request POST:/addTenant
     */
    addTenantCreate: (
      query: {
        tenantName: string;
        tenantCode: string;
        tenantStatus: Status;
      },
      params: RequestParams = {}
    ) =>
      this.request<number, any>({
        path: `/addTenant`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  getTenants = {
    /**
     * No description
     *
     * @tags Tenant
     * @name GetTenantsList
     * @request GET:/getTenants
     */
    getTenantsList: (params: RequestParams = {}) =>
      this.request<Tenant[], any>({
        path: `/getTenants`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  updateTenant = {
    /**
     * No description
     *
     * @tags Tenant
     * @name UpdateTenantUpdate
     * @request PUT:/updateTenant
     */
    updateTenantUpdate: (
      query: {
        /** @format int32 */
        tenantId: number;
        tenantName: string;
        tenantCode: string;
        tenantStatus: Status;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/updateTenant`,
        method: "PUT",
        query: query,
        ...params,
      }),
  };
  deleteTenant = {
    /**
     * No description
     *
     * @tags Tenant
     * @name DeleteTenantDelete
     * @request DELETE:/deleteTenant
     */
    deleteTenantDelete: (
      query: {
        /** @format int32 */
        tenantId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/deleteTenant`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
}
