# InviteResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**projectId** | **string** |  | [default to undefined]
**email** | **object** |  | [optional] [default to undefined]
**token** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**createdById** | **string** |  | [default to undefined]
**expiresAt** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**acceptedAt** | **object** |  | [optional] [default to undefined]
**project** | [**ProjectResponseDto**](ProjectResponseDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InviteResponseDto } from './api';

const instance: InviteResponseDto = {
    id,
    projectId,
    email,
    token,
    status,
    createdById,
    expiresAt,
    createdAt,
    acceptedAt,
    project,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
