# TasksApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tasksControllerCreate**](#taskscontrollercreate) | **POST** /projects/{projectId}/tasks | Create task|
|[**tasksControllerDelete**](#taskscontrollerdelete) | **DELETE** /tasks/{taskId} | Delete task|
|[**tasksControllerGet**](#taskscontrollerget) | **GET** /tasks/{taskId} | Get task|
|[**tasksControllerList**](#taskscontrollerlist) | **GET** /projects/{projectId}/tasks | List tasks by project|
|[**tasksControllerMove**](#taskscontrollermove) | **PATCH** /tasks/{taskId}/move | Move task to another day or order|
|[**tasksControllerResponsible**](#taskscontrollerresponsible) | **PATCH** /tasks/{taskId}/responsible | Update task responsible user|
|[**tasksControllerStatus**](#taskscontrollerstatus) | **PATCH** /tasks/{taskId}/status | Update task status|
|[**tasksControllerUpdate**](#taskscontrollerupdate) | **PATCH** /tasks/{taskId} | Update task|

# **tasksControllerCreate**
> TaskResponseDto tasksControllerCreate(createTaskDto)


### Example

```typescript
import {
    TasksApi,
    Configuration,
    CreateTaskDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let projectId: string; // (default to undefined)
let createTaskDto: CreateTaskDto; //

const { status, data } = await apiInstance.tasksControllerCreate(
    projectId,
    createTaskDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTaskDto** | **CreateTaskDto**|  | |
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**TaskResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerDelete**
> OkResponseDto tasksControllerDelete()


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)

const { status, data } = await apiInstance.tasksControllerDelete(
    taskId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**OkResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerGet**
> TaskResponseDto tasksControllerGet()


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)

const { status, data } = await apiInstance.tasksControllerGet(
    taskId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**TaskResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerList**
> Array<TaskResponseDto> tasksControllerList()


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let projectId: string; // (default to undefined)
let status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'; // (optional) (default to undefined)

const { status, data } = await apiInstance.tasksControllerList(
    projectId,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|
| **status** | [**&#39;PENDING&#39; | &#39;IN_PROGRESS&#39; | &#39;DONE&#39; | &#39;CANCELED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;IN_PROGRESS&#39; &#124; &#39;DONE&#39; &#124; &#39;CANCELED&#39;>** |  | (optional) defaults to undefined|


### Return type

**Array<TaskResponseDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerMove**
> TaskResponseDto tasksControllerMove(moveTaskDto)


### Example

```typescript
import {
    TasksApi,
    Configuration,
    MoveTaskDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)
let moveTaskDto: MoveTaskDto; //

const { status, data } = await apiInstance.tasksControllerMove(
    taskId,
    moveTaskDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **moveTaskDto** | **MoveTaskDto**|  | |
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**TaskResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerResponsible**
> TaskResponseDto tasksControllerResponsible(updateTaskResponsibleDto)


### Example

```typescript
import {
    TasksApi,
    Configuration,
    UpdateTaskResponsibleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)
let updateTaskResponsibleDto: UpdateTaskResponsibleDto; //

const { status, data } = await apiInstance.tasksControllerResponsible(
    taskId,
    updateTaskResponsibleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTaskResponsibleDto** | **UpdateTaskResponsibleDto**|  | |
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**TaskResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerStatus**
> TaskResponseDto tasksControllerStatus(updateTaskStatusDto)


### Example

```typescript
import {
    TasksApi,
    Configuration,
    UpdateTaskStatusDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)
let updateTaskStatusDto: UpdateTaskStatusDto; //

const { status, data } = await apiInstance.tasksControllerStatus(
    taskId,
    updateTaskStatusDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTaskStatusDto** | **UpdateTaskStatusDto**|  | |
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**TaskResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tasksControllerUpdate**
> TaskResponseDto tasksControllerUpdate(body)


### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.tasksControllerUpdate(
    taskId,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**TaskResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

