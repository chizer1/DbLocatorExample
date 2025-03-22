/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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

/** @format int32 */
export enum DatabaseRole {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
}

export interface DatabaseServer {
  /** @format int32 */
  id?: number;
  name?: string | null;
  ipAddress?: string | null;
  hostName?: string | null;
  fullyQualifiedDomainName?: string | null;
  isLinkedServer?: boolean;
}

export interface DatabaseType {
  /** @format int32 */
  id?: number;
  name?: string | null;
}

export interface DatabaseUser {
  /** @format int32 */
  id?: number;
  name?: string | null;
  /** @format int32 */
  databaseId?: number;
  roles?: DatabaseRole[] | null;
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
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
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

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
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
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
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
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

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
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

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
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

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title DbLocatorExample, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  accounts = {
    /**
     * No description
     *
     * @tags Accounts
     * @name GetAccountsList
     * @request GET:/Accounts/getAccounts
     */
    getAccountsList: (
      query?: {
        /** @format int32 */
        tenantId?: number;
        /** @format int32 */
        databaseTypeId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any[], any>({
        path: `/Accounts/getAccounts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  connection = {
    /**
     * No description
     *
     * @tags Connection
     * @name AddConnectionCreate
     * @request POST:/Connection/addConnection
     */
    addConnectionCreate: (
      query?: {
        /** @format int32 */
        tenantId?: number;
        /** @format int32 */
        databaseId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/Connection/addConnection`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Connection
     * @name GetConnectionsList
     * @request GET:/Connection/getConnections
     */
    getConnectionsList: (params: RequestParams = {}) =>
      this.request<Connection[], any>({
        path: `/Connection/getConnections`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Connection
     * @name DeleteConnectionDelete
     * @request DELETE:/Connection/deleteConnection
     */
    deleteConnectionDelete: (
      query?: {
        /** @format int32 */
        connectionId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Connection/deleteConnection`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  database = {
    /**
     * No description
     *
     * @tags Database
     * @name AddDatabaseCreate
     * @request POST:/Database/addDatabase
     */
    addDatabaseCreate: (
      query?: {
        databaseName?: string;
        /** @format int32 */
        databaseServerId?: number;
        /** @format int32 */
        databaseTypeId?: number;
        databaseStatus?: Status;
        createDatabase?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/Database/addDatabase`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database
     * @name GetDatabasesList
     * @request GET:/Database/getDatabases
     */
    getDatabasesList: (params: RequestParams = {}) =>
      this.request<Database[], any>({
        path: `/Database/getDatabases`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database
     * @name UpdateDatabaseUpdate
     * @request PUT:/Database/updateDatabase
     */
    updateDatabaseUpdate: (
      query?: {
        /** @format int32 */
        databaseId?: number;
        databaseName?: string;
        /** @format int32 */
        databaseServerId?: number;
        /** @format int32 */
        databaseTypeId?: number;
        databaseStatus?: Status;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Database/updateDatabase`,
        method: "PUT",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database
     * @name DeleteDatabaseDelete
     * @request DELETE:/Database/deleteDatabase
     */
    deleteDatabaseDelete: (
      query?: {
        /** @format int32 */
        databaseId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Database/deleteDatabase`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  databaseServer = {
    /**
     * No description
     *
     * @tags DatabaseServer
     * @name AddDatabaseServerCreate
     * @request POST:/DatabaseServer/addDatabaseServer
     */
    addDatabaseServerCreate: (
      query?: {
        databaseServerName?: string;
        databaseServerIpAddress?: string;
        databaseServerHostName?: string;
        databaseServerFullyQualifiedDomainName?: string;
        isLinkedServer?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/DatabaseServer/addDatabaseServer`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseServer
     * @name GetDatabaseServersList
     * @request GET:/DatabaseServer/getDatabaseServers
     */
    getDatabaseServersList: (params: RequestParams = {}) =>
      this.request<DatabaseServer[], any>({
        path: `/DatabaseServer/getDatabaseServers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseServer
     * @name UpdateDatabaseServerUpdate
     * @request PUT:/DatabaseServer/updateDatabaseServer
     */
    updateDatabaseServerUpdate: (
      query?: {
        /** @format int32 */
        databaseServerId?: number;
        databaseServerName?: string;
        databaseServerIpAddress?: string;
        databaseServerHostName?: string;
        databaseServerFullyQualifiedDomainName?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseServer/updateDatabaseServer`,
        method: "PUT",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseServer
     * @name DeleteDatabaseServerDelete
     * @request DELETE:/DatabaseServer/deleteDatabaseServer
     */
    deleteDatabaseServerDelete: (
      query?: {
        /** @format int32 */
        serverId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseServer/deleteDatabaseServer`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  databaseType = {
    /**
     * No description
     *
     * @tags DatabaseType
     * @name AddDatabaseTypeCreate
     * @request POST:/DatabaseType/addDatabaseType
     */
    addDatabaseTypeCreate: (
      query?: {
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/DatabaseType/addDatabaseType`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseType
     * @name GetDatabaseTypesList
     * @request GET:/DatabaseType/getDatabaseTypes
     */
    getDatabaseTypesList: (params: RequestParams = {}) =>
      this.request<DatabaseType[], any>({
        path: `/DatabaseType/getDatabaseTypes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseType
     * @name UpdateDatabaseTypeUpdate
     * @request PUT:/DatabaseType/updateDatabaseType
     */
    updateDatabaseTypeUpdate: (
      query?: {
        /** @format int32 */
        databaseTypeId?: number;
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseType/updateDatabaseType`,
        method: "PUT",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseType
     * @name DeleteDatabaseTypeDelete
     * @request DELETE:/DatabaseType/deleteDatabaseType
     */
    deleteDatabaseTypeDelete: (
      query?: {
        /** @format int32 */
        databaseTypeId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseType/deleteDatabaseType`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  databaseUser = {
    /**
     * No description
     *
     * @tags DatabaseUser
     * @name AddDatabaseUserCreate
     * @request POST:/DatabaseUser/addDatabaseUser
     */
    addDatabaseUserCreate: (
      query?: {
        /** @format int32 */
        databaseId?: number;
        userName?: string;
        userPassword?: string;
        createUser?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/DatabaseUser/addDatabaseUser`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseUser
     * @name UpdateDatabaseUserUpdate
     * @request PUT:/DatabaseUser/updateDatabaseUser
     */
    updateDatabaseUserUpdate: (
      query?: {
        /** @format int32 */
        databaseUserId?: number;
        userName?: string;
        userPassword?: string;
        updateUser?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/DatabaseUser/updateDatabaseUser`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseUser
     * @name GetDatabaseUsersList
     * @request GET:/DatabaseUser/getDatabaseUsers
     */
    getDatabaseUsersList: (params: RequestParams = {}) =>
      this.request<DatabaseUser[], any>({
        path: `/DatabaseUser/getDatabaseUsers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseUser
     * @name DeleteDatabaseUserDelete
     * @request DELETE:/DatabaseUser/deleteDatabaseUser
     */
    deleteDatabaseUserDelete: (
      query?: {
        /** @format int32 */
        databaseUserId?: number;
        deleteUser?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseUser/deleteDatabaseUser`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  databaseUserRole = {
    /**
     * No description
     *
     * @tags DatabaseUserRole
     * @name AddDatabaseUserRoleCreate
     * @request POST:/DatabaseUserRole/addDatabaseUserRole
     */
    addDatabaseUserRoleCreate: (
      query?: {
        /** @format int32 */
        databaseUserId?: number;
        databaseRoleId?: DatabaseRole;
        addRole?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseUserRole/addDatabaseUserRole`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseUserRole
     * @name DeleteDatabaseUserRoleDelete
     * @request DELETE:/DatabaseUserRole/deleteDatabaseUserRole
     */
    deleteDatabaseUserRoleDelete: (
      query?: {
        /** @format int32 */
        databaseUserId?: number;
        databaseRoleId?: DatabaseRole;
        removeRole?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/DatabaseUserRole/deleteDatabaseUserRole`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
  tenant = {
    /**
     * No description
     *
     * @tags Tenant
     * @name AddTenantCreate
     * @request POST:/Tenant/addTenant
     */
    addTenantCreate: (
      query?: {
        tenantName?: string;
        tenantCode?: string;
        tenantStatus?: Status;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, any>({
        path: `/Tenant/addTenant`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tenant
     * @name GetTenantsList
     * @request GET:/Tenant/getTenants
     */
    getTenantsList: (params: RequestParams = {}) =>
      this.request<Tenant[], any>({
        path: `/Tenant/getTenants`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tenant
     * @name UpdateTenantUpdate
     * @request PUT:/Tenant/updateTenant
     */
    updateTenantUpdate: (
      query?: {
        /** @format int32 */
        tenantId?: number;
        tenantName?: string;
        tenantCode?: string;
        tenantStatus?: Status;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Tenant/updateTenant`,
        method: "PUT",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tenant
     * @name DeleteTenantDelete
     * @request DELETE:/Tenant/deleteTenant
     */
    deleteTenantDelete: (
      query?: {
        /** @format int32 */
        tenantId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Tenant/deleteTenant`,
        method: "DELETE",
        query: query,
        ...params,
      }),
  };
}
