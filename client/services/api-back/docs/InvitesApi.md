# InvitesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**invitesControllerAccept**](#invitescontrolleraccept) | **POST** /invites/{token}/accept | Accept invite|
|[**invitesControllerCreate**](#invitescontrollercreate) | **POST** /projects/{projectId}/invites | Create project invite. Owner only.|
|[**invitesControllerDecline**](#invitescontrollerdecline) | **POST** /invites/{token}/decline | Decline invite|
|[**invitesControllerGet**](#invitescontrollerget) | **GET** /invites/{token} | Get invite by token|

# **invitesControllerAccept**
> ProjectResponseDto invitesControllerAccept(acceptInviteDto)


### Example

```typescript
import {
    InvitesApi,
    Configuration,
    AcceptInviteDto
} from './api';

const configuration = new Configuration();
const apiInstance = new InvitesApi(configuration);

let token: string; // (default to undefined)
let acceptInviteDto: AcceptInviteDto; //

const { status, data } = await apiInstance.invitesControllerAccept(
    token,
    acceptInviteDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **acceptInviteDto** | **AcceptInviteDto**|  | |
| **token** | [**string**] |  | defaults to undefined|


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

# **invitesControllerCreate**
> InviteResponseDto invitesControllerCreate(createInviteDto)


### Example

```typescript
import {
    InvitesApi,
    Configuration,
    CreateInviteDto
} from './api';

const configuration = new Configuration();
const apiInstance = new InvitesApi(configuration);

let projectId: string; // (default to undefined)
let createInviteDto: CreateInviteDto; //

const { status, data } = await apiInstance.invitesControllerCreate(
    projectId,
    createInviteDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createInviteDto** | **CreateInviteDto**|  | |
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**InviteResponseDto**

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

# **invitesControllerDecline**
> OkResponseDto invitesControllerDecline()


### Example

```typescript
import {
    InvitesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvitesApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.invitesControllerDecline(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


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

# **invitesControllerGet**
> InviteResponseDto invitesControllerGet()


### Example

```typescript
import {
    InvitesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InvitesApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.invitesControllerGet(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


### Return type

**InviteResponseDto**

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

