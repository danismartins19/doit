# ProjectsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**projectsControllerCreate**](#projectscontrollercreate) | **POST** /projects | Create project|
|[**projectsControllerDelete**](#projectscontrollerdelete) | **DELETE** /projects/{projectId} | Delete project|
|[**projectsControllerGet**](#projectscontrollerget) | **GET** /projects/{projectId} | Get project|
|[**projectsControllerList**](#projectscontrollerlist) | **GET** /projects | List projects for current user|
|[**projectsControllerMembers**](#projectscontrollermembers) | **GET** /projects/{projectId}/members | List project members|
|[**projectsControllerRemoveMember**](#projectscontrollerremovemember) | **DELETE** /projects/{projectId}/members/{memberId} | Remove project member. Owner only.|
|[**projectsControllerUpdate**](#projectscontrollerupdate) | **PATCH** /projects/{projectId} | Update project|
|[**projectsControllerUpdateMember**](#projectscontrollerupdatemember) | **PATCH** /projects/{projectId}/members/{memberId} | Update project member preferences|

# **projectsControllerCreate**
> ProjectResponseDto projectsControllerCreate(createProjectDto)


### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    CreateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let createProjectDto: CreateProjectDto; //

const { status, data } = await apiInstance.projectsControllerCreate(
    createProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProjectDto** | **CreateProjectDto**|  | |


### Return type

**ProjectResponseDto**

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

# **projectsControllerDelete**
> OkResponseDto projectsControllerDelete()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.projectsControllerDelete(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


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

# **projectsControllerGet**
> ProjectResponseDto projectsControllerGet()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.projectsControllerGet(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**ProjectResponseDto**

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

# **projectsControllerList**
> Array<ProjectResponseDto> projectsControllerList()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.projectsControllerList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ProjectResponseDto>**

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

# **projectsControllerMembers**
> Array<ProjectMemberResponseDto> projectsControllerMembers()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.projectsControllerMembers(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ProjectMemberResponseDto>**

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

# **projectsControllerRemoveMember**
> OkResponseDto projectsControllerRemoveMember()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectId: string; // (default to undefined)
let memberId: string; // (default to undefined)

const { status, data } = await apiInstance.projectsControllerRemoveMember(
    projectId,
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|
| **memberId** | [**string**] |  | defaults to undefined|


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

# **projectsControllerUpdate**
> ProjectResponseDto projectsControllerUpdate(body)


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectId: string; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.projectsControllerUpdate(
    projectId,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**ProjectResponseDto**

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

# **projectsControllerUpdateMember**
> ProjectMemberResponseDto projectsControllerUpdateMember(updateProjectMemberDto)


### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    UpdateProjectMemberDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let projectId: string; // (default to undefined)
let memberId: string; // (default to undefined)
let updateProjectMemberDto: UpdateProjectMemberDto; //

const { status, data } = await apiInstance.projectsControllerUpdateMember(
    projectId,
    memberId,
    updateProjectMemberDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProjectMemberDto** | **UpdateProjectMemberDto**|  | |
| **projectId** | [**string**] |  | defaults to undefined|
| **memberId** | [**string**] |  | defaults to undefined|


### Return type

**ProjectMemberResponseDto**

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

