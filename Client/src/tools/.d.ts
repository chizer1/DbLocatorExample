declare module 'swagger-typescript-api' {
    export interface SwaggerTypescriptApiOptions {
        name: string;
        url: string;
        output: string;
    }

    export function generateApi(options: SwaggerTypescriptApiOptions): Promise<void>;
}
// This module declaration extends the 'swagger-typescript-api' module to include