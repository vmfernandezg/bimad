# Azure Compute — Referencia

## Servicios de Compute

### Decision Tree: Selección de Compute
```
¿App containerizada?
  └─ SÍ → ¿Necesita orquestación K8s completa?
  │          └─ SÍ → AKS (Azure Kubernetes Service)
  │          └─ NO → Azure Container Apps (serverless containers)
  └─ NO → ¿Código serverless (funciones)?
              └─ SÍ → Azure Functions (Consumption/Flex/Premium)
              └─ NO → ¿Web app con runtime gestionado?
                          └─ SÍ → Azure App Service (B1/S1/P1)
                          └─ NO → ¿SPA estática?
                                      └─ SÍ → Azure Static Web Apps (Free/Standard)
                                      └─ NO → Azure VM (solo si necesitas control total)
```

### Comparación de Servicios

| Servicio | Tipo | Escala | Precio mínimo | Ideal para |
|----------|------|--------|---------------|-----------|
| **Static Web Apps** | Estático + API | Global CDN | Gratis | SPAs, JAMstack |
| **App Service** | PaaS | Manual/Auto | ~13€/mes (B1) | Web apps, APIs |
| **Functions** | FaaS | Auto | Pago por uso | Event-driven, APIs ligeras |
| **Container Apps** | CaaS serverless | Auto (KEDA) | Pago por uso | Microservicios, APIs |
| **AKS** | K8s managed | Manual/HPA | ~70€/mes (B2s×2) | Workloads complejos |
| **VM** | IaaS | Manual/VMSS | ~15€/mes (B1s) | Legacy, control total |

### SKUs de VM más comunes

| Serie | Uso | vCPUs | RAM | Precio aprox/mes |
|-------|-----|-------|-----|-----------------|
| **B1s** | Dev/Test | 1 | 1GB | ~8€ |
| **B2s** | Dev/Test | 2 | 4GB | ~30€ |
| **D2s_v5** | General | 2 | 8GB | ~70€ |
| **D4s_v5** | General | 4 | 16GB | ~140€ |
| **E2s_v5** | Memory | 2 | 16GB | ~90€ |
| **F2s_v2** | CPU | 2 | 4GB | ~60€ |
