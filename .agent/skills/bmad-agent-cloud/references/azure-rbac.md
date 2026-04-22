# Azure RBAC — Referencia

## Principio: Least Privilege

Siempre asignar el rol mínimo necesario. Nunca Owner a menos que sea imprescindible.

## Roles Built-in Más Comunes

| Rol | Scope | Permisos |
|-----|-------|---------|
| **Reader** | Cualquiera | Solo lectura |
| **Contributor** | Cualquiera | CRUD, no RBAC |
| **Owner** | Cualquiera | Todo, incluido RBAC |
| **User Access Administrator** | Cualquiera | Solo gestión de roles |
| **Storage Blob Data Reader** | Storage | Leer blobs |
| **Storage Blob Data Contributor** | Storage | CRUD blobs |
| **Key Vault Secrets User** | Key Vault | Leer secrets |
| **Key Vault Administrator** | Key Vault | CRUD secrets |
| **AcrPull** | Container Registry | Pull images |
| **AcrPush** | Container Registry | Push/Pull images |
| **Website Contributor** | App Service | Gestionar web apps |
| **Cosmos DB Account Reader** | Cosmos DB | Leer datos |

## Managed Identity + RBAC (patrón recomendado)

```bicep
// 1. System-assigned managed identity (automática en App Service)
resource app 'Microsoft.Web/sites@2023-12-01' = {
  identity: { type: 'SystemAssigned' }
}

// 2. Role assignment (least privilege)
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  properties: {
    roleDefinitionId: storageBlobDataReaderRoleId
    principalId: app.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
```

**Nunca** usar connection strings con claves cuando Managed Identity es posible.

## Prerequisitos para asignar roles
- Necesitas `Microsoft.Authorization/roleAssignments/write`
- Roles que lo incluyen: **User Access Administrator** (mínimo) u **Owner**
