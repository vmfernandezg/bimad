# Azure Cost Management — Referencia

## Estimación de Costes por Servicio (precios West Europe, abril 2026)

### Compute

| Servicio | Tier | Precio aprox/mes |
|----------|------|-----------------|
| Static Web Apps | Free | 0€ |
| Static Web Apps | Standard | ~8€ |
| App Service | Free (F1) | 0€ |
| App Service | Basic (B1) | ~13€ |
| App Service | Standard (S1) | ~65€ |
| App Service | Premium (P1v3) | ~100€ |
| Functions | Consumption | Pago por uso (~0.17€/M ejecuciones) |
| Functions | Flex Consumption | Desde ~10€ |
| Container Apps | Consumption | Pago por uso (vCPU/s + GiB/s) |
| AKS | Control plane | Gratis (Free) / ~70€ (Standard SLA) |

### Datos

| Servicio | Tier | Precio aprox/mes |
|----------|------|-----------------|
| Azure SQL | Basic (5 DTU) | ~5€ |
| Azure SQL | Standard (S0) | ~15€ |
| PostgreSQL Flexible | Burstable B1ms | ~15€ |
| Cosmos DB | Serverless | Pago por RU |
| Storage Account | Hot (LRS) | ~0.02€/GB |
| Redis Cache | Basic C0 | ~15€ |

### Networking

| Servicio | Precio aprox/mes |
|----------|-----------------|
| DNS Zone | ~0.50€/zona |
| Application Gateway (v2) | ~180€ |
| Front Door Standard | ~30€ + tráfico |
| Front Door Premium (WAF) | ~300€ + tráfico |
| VPN Gateway (VpnGw1) | ~120€ |
| Load Balancer Standard | ~20€ + reglas |

### Seguridad y Monitoring

| Servicio | Precio aprox/mes |
|----------|-----------------|
| Key Vault | ~0.03€/10K ops |
| Application Insights | Gratis hasta 5GB/mes |
| Log Analytics | ~2.50€/GB ingesta |
| Microsoft Defender for Cloud | Gratis (básico) / ~13€/server |

## Patrones de Ahorro

1. **Dev/Test pricing** — Hasta 55% descuento en VMs con Visual Studio subscription
2. **Reserved Instances** — 1 año: ~30% ahorro, 3 años: ~50% ahorro
3. **Spot VMs** — Hasta 90% ahorro para workloads tolerantes a interrupción
4. **Auto-shutdown** — Apagar VMs dev/test fuera de horario
5. **Rightsizing** — Monitorizar utilización y bajar tier si < 30% uso
6. **Free tier stacking** — Static Web Apps Free + Functions Consumption + Cosmos Serverless

## Template de Estimación

| Servicio | SKU | Cantidad | €/mes | Notas |
|----------|-----|----------|-------|-------|
| ... | ... | ... | ... | ... |
| **TOTAL** | | | **X €** | |
| **TOTAL anual** | | | **Y €** | |
| **Con Reserved (1y)** | | | **Z €** | Ahorro: W% |
