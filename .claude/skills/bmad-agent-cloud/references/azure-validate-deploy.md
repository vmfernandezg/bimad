# Azure Validate & Deploy — Referencia

## Pipeline Obligatorio

```
azure-prepare → azure-validate → azure-deploy
     │                │                │
     ▼                ▼                ▼
  Plan (.md)     Verificación    Ejecución
  IaC (Bicep)    RBAC check     azd up / terraform apply
  Dockerfiles    Config check   Post-deploy config
```

## Validate: Checks

| Check | Qué verifica |
|-------|-------------|
| **IaC syntax** | `bicep build` o `terraform validate` pasan |
| **RBAC** | Roles asignados en IaC son correctos y mínimos |
| **Managed Identity** | Permisos de identidades gestionadas |
| **Config** | Variables de entorno, connection strings, secrets |
| **Networking** | NSG rules, private endpoints, ingress |
| **Plan status** | `.azure/deployment-plan.md` está `Approved` |

**Solo azure-validate puede marcar el plan como `Validated`.** Ningún otro skill puede hacerlo.

## Deploy: Estrategias

| Estrategia | Comando | Cuándo |
|-----------|---------|--------|
| **AZD** | `azd up` / `azd deploy` | Proyectos con azure.yaml |
| **Bicep** | `az deployment group create` | IaC nativa Azure |
| **Terraform** | `terraform apply` | Multi-cloud |

## Deploy: 9 Pasos

1. Verificar plan existe con status `Validated`
2. Pre-deployment checklist
3. Cargar receta según tipo de deployment
4. RBAC health check (Container Apps + ACR)
5. Ejecutar deployment
6. Post-deploy config (SQL identity, EF migrations)
7. Error handling por receta
8. Verificar éxito y endpoints accesibles
9. Confirmar RBAC roles correctos

## Reglas
- Acciones destructivas requieren confirmación del usuario
- URLs como `https://` fully-qualified
- Scope limitado a ejecución de deployment
