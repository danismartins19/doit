# ProjectResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**color** | **string** |  | [default to undefined]
**ownerId** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**owner** | [**UserResponseDto**](UserResponseDto.md) |  | [optional] [default to undefined]
**members** | [**Array&lt;ProjectMemberResponseDto&gt;**](ProjectMemberResponseDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ProjectResponseDto } from './api';

const instance: ProjectResponseDto = {
    id,
    name,
    color,
    ownerId,
    createdAt,
    updatedAt,
    owner,
    members,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
