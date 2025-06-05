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

export interface AddConnectionRequest {
  /** @format int32 */
  tenantId?: number;
  /** @format int32 */
  databaseId?: number;
}

export interface AddDatabaseRequest {
  databaseName: string | null;
  /** @format int32 */
  databaseServerId?: number;
  /** @format int32 */
  databaseTypeId?: number;
  databaseStatus?: Status;
}

export interface AddDatabaseServerRequest {
  databaseServerName: string | null;
  databaseServerIpAddress: string | null;
  databaseServerHostName: string | null;
  databaseServerFullyQualifiedDomainName: string | null;
  isLinkedServer?: boolean;
}

export interface AddDatabaseTypeRequest {
  databaseTypeName: string | null;
}

export interface AddDatabaseUser {
  databaseIds: number[] | null;
  userName: string | null;
  userPassword: string | null;
}

export interface AddDatabaseUserRoleRequest {
  /** @format int32 */
  databaseUserId?: number;
  databaseRoleId?: DatabaseRole;
}

export interface AddTenantRequest {
  tenantName: string | null;
  tenantCode: string | null;
  tenantStatus?: Status;
}

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
  databases?: Database[] | null;
  roles?: DatabaseRole[] | null;
}

export interface DeleteDatabaseUserRoleRequest {
  /** @format int32 */
  databaseUserId?: number;
  databaseRoleId?: DatabaseRole;
}

export interface SqlRequest {
  /** @format int32 */
  tenantId?: number;
  /** @format int32 */
  databaseTypeId?: number;
  databaseRoles: DatabaseRole[] | null;
  sql: string | null;
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

export interface UpdateDatabaseRequest {
  /** @format int32 */
  databaseId?: number;
  databaseName: string | null;
  /** @format int32 */
  databaseServerId?: number;
  /** @format int32 */
  databaseTypeId?: number;
  databaseStatus?: Status;
}

export interface UpdateDatabaseServerRequest {
  /** @format int32 */
  databaseServerId?: number;
  databaseServerName: string | null;
  databaseServerIpAddress: string | null;
  databaseServerHostName: string | null;
  databaseServerFullyQualifiedDomainName: string | null;
  isLinkedServer?: boolean;
}

export interface UpdateDatabaseTypeRequest {
  /** @format int32 */
  databaseTypeId?: number;
  databaseTypeName: string | null;
}

export interface UpdateDatabaseUserRequest {
  /** @format int32 */
  databaseUserId?: number;
  databaseIds: number[] | null;
  userName: string | null;
  userPassword: string | null;
}

export interface UpdateTenantRequest {
  /** @format int32 */
  tenantId?: number;
  tenantName: string | null;
  tenantCode: string | null;
  tenantStatus?: Status;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title DbLocatorExample, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  connection = {
    /**
     * No description
     *
     * @tags Connection
     * @name AddConnectionCreate
     * @request POST:/Connection/addConnection
     */
    addConnectionCreate: (data: AddConnectionRequest, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/Connection/addConnection`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    addDatabaseCreate: (data: AddDatabaseRequest, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/Database/addDatabase`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    updateDatabaseUpdate: (data: UpdateDatabaseRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Database/updateDatabase`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
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
    addDatabaseServerCreate: (data: AddDatabaseServerRequest, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/DatabaseServer/addDatabaseServer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    updateDatabaseServerUpdate: (data: UpdateDatabaseServerRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/DatabaseServer/updateDatabaseServer`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
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
    addDatabaseTypeCreate: (data: AddDatabaseTypeRequest, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/DatabaseType/addDatabaseType`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    updateDatabaseTypeUpdate: (data: UpdateDatabaseTypeRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/DatabaseType/updateDatabaseType`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
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
    addDatabaseUserCreate: (data: AddDatabaseUser, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/DatabaseUser/addDatabaseUser`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    updateDatabaseUserUpdate: (data: UpdateDatabaseUserRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/DatabaseUser/updateDatabaseUser`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
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
    addDatabaseUserRoleCreate: (data: AddDatabaseUserRoleRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/DatabaseUserRole/addDatabaseUserRole`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatabaseUserRole
     * @name DeleteDatabaseUserRoleDelete
     * @request DELETE:/DatabaseUserRole/deleteDatabaseUserRole
     */
    deleteDatabaseUserRoleDelete: (data: DeleteDatabaseUserRoleRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/DatabaseUserRole/deleteDatabaseUserRole`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  sql = {
    /**
     * No description
     *
     * @tags Sql
     * @name QueryCreate
     * @request POST:/Sql/query
     */
    queryCreate: (data: SqlRequest, params: RequestParams = {}) =>
      this.request<any[], any>({
        path: `/Sql/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sql
     * @name CommandCreate
     * @request POST:/Sql/command
     */
    commandCreate: (data: SqlRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Sql/command`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    addTenantCreate: (data: AddTenantRequest, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/Tenant/addTenant`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
    updateTenantUpdate: (data: UpdateTenantRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Tenant/updateTenant`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
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
