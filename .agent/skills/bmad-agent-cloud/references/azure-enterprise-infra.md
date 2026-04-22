# Azure Enterprise Infrastructure Planner — Referencia

## Cuándo Usar
- Planificar infraestructura Azure enterprise desde descripción de workload
- Diseñar landing zones, hub-spoke networks, topologías multi-región
- Planificar networking: VNets, subnets, firewalls, private endpoints, VPN gateways
- Diseñar identidad, RBAC y compliance
- Generar Bicep o Terraform para deployments multi-resource-group

## Workflow de 6 Fases

| Fase | Acción | Gate |
|------|--------|------|
| 1 | Research — WAF (Well-Architected Framework) | Tools MCP completados |
| 2 | Research — Refinar y lookup | Lista de recursos aprobada |
| 3 | Generación del Plan | Plan JSON escrito a disco |
| 4 | Verificación | Checks pasan, usuario aprueba |
| 5 | Generación de IaC | `meta.status` = `approved` |
| 6 | Deployment | Usuario confirma acciones destructivas |

## Azure Well-Architected Framework (5 pilares)

| Pilar | Foco |
|-------|------|
| **Reliability** | Resiliencia, recuperación, availability zones |
| **Security** | Zero trust, encryption, identity |
| **Cost Optimization** | Rightsizing, reserved instances, spot |
| **Operational Excellence** | IaC, CI/CD, monitoring, automation |
| **Performance Efficiency** | Scaling, caching, CDN, proximity |

## Patrones de Red Comunes

### Hub-Spoke
```
                    ┌──────────┐
                    │   Hub    │
                    │ VNet     │
                    │ Firewall │
                    │ VPN GW   │
                    └────┬─────┘
              ┌──────────┼──────────┐
         ┌────┴────┐ ┌───┴────┐ ┌──┴──────┐
         │ Spoke 1 │ │ Spoke 2│ │ Spoke 3 │
         │ App     │ │ Data   │ │ Shared  │
         └─────────┘ └────────┘ └─────────┘
```

### Aislamiento por Resource Groups
```
rg-{app}-{env}-{region}
├── rg-myapp-prod-westeu     (App + API)
├── rg-myapp-data-westeu     (DB + Storage)
├── rg-myapp-network-westeu  (VNet + NSG)
└── rg-myapp-shared-westeu   (Key Vault + Log Analytics)
```
