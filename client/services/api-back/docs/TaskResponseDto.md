# TaskResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**projectId** | **string** |  | [default to undefined]
**createdById** | **string** |  | [default to undefined]
**responsibleId** | **object** |  | [optional] [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **object** |  | [optional] [default to undefined]
**details** | **object** |  | [optional] [default to undefined]
**day** | **string** |  | [default to undefined]
**deadline** | **object** |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**order** | **number** |  | [default to undefined]
**googleCalendarEventId** | **object** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**project** | [**ProjectResponseDto**](ProjectResponseDto.md) |  | [optional] [default to undefined]
**createdBy** | [**UserResponseDto**](UserResponseDto.md) |  | [optional] [default to undefined]
**responsible** | [**UserResponseDto**](UserResponseDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TaskResponseDto } from './api';

const instance: TaskResponseDto = {
    id,
    projectId,
    createdById,
    responsibleId,
    title,
    description,
    details,
    day,
    deadline,
    status,
    order,
    googleCalendarEventId,
    createdAt,
    updatedAt,
    project,
    createdBy,
    responsible,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
