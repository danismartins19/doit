# Doit services

`api-back` is reserved for the TypeScript Axios client generated from the Nest Swagger document:

```bash
openapi-generator-cli generate -i http://localhost:3333/api-json -g typescript-axios -o services/api-back --skip-validate-spec
```

`hooks` contains module-oriented React hooks used by the UI. They currently call the REST API through `api-client.ts` and can be migrated to the generated Axios classes when the OpenAPI client is generated.
