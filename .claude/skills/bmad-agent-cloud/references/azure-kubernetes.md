# Azure Kubernetes Service (AKS) — Referencia

## Decision: ¿Necesitas AKS?

```
¿Tienes > 10 microservicios?
  └─ NO → Azure Container Apps (más simple)
  └─ SÍ → ¿Necesitas customización de networking/policies?
              └─ NO → AKS Automatic (recomendado por defecto)
              └─ SÍ → AKS Standard
```

## SKU Selection

| SKU | Descripción | SLA | Precio control plane |
|-----|------------|-----|---------------------|
| **Free** | Dev/Test | No SLA | 0€ |
| **Standard** | Producción | 99.95% | ~70€/mes |
| **Premium** | Mission-critical | 99.99% | ~140€/mes |

**Default: AKS Automatic** — gestión curada de best practices.

## Decisiones Day-0 (difíciles de cambiar)

### Networking
- **Azure CNI Overlay** — Recomendado para pod IP management
- **Cilium dataplane** — eBPF para rendimiento
- **App Routing con Gateway API** — Ingress por defecto

### Seguridad
- **Microsoft Entra ID** — Toda autenticación
- **Key Vault + Secrets Store CSI Driver** — Secrets
- **Azure Policy + Deployment Safeguards** — Compliance
- **Encryption** — etcd y tráfico en tránsito

### Requisitos Producción
- 3 Availability Zones
- Dedicated system node pools (mínimo 2 nodos)
- Node Auto Provisioning habilitado
- PodDisruptionBudgets
- Topology spread constraints

## Optimización de Costes AKS
- **Spot node pools** — Hasta 90% ahorro para batch
- **Ephemeral OS disks** — Startup más rápido
- **Azure Linux** — Node OS ligero
- **Reserved Instances** o Savings Plans
