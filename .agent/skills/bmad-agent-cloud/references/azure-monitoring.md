# Azure Monitoring & Observability — Referencia

## Stack de Observabilidad Azure

```
┌─────────────────────────────────────────────────┐
│                Azure Monitor                      │
│  ┌──────────────┐  ┌───────────┐  ┌───────────┐ │
│  │ App Insights  │  │ Log       │  │ Metrics   │ │
│  │ (APM)        │  │ Analytics │  │ Explorer  │ │
│  └──────────────┘  └───────────┘  └───────────┘ │
│  ┌──────────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Alerts       │  │ Dashboards│  │ Workbooks │ │
│  └──────────────┘  └───────────┘  └───────────┘ │
└─────────────────────────────────────────────────┘
          │                    │
     ┌────┴────┐         ┌────┴────┐
     │ Grafana  │         │ Action  │
     │ Managed  │         │ Groups  │
     └─────────┘         └─────────┘
```

## Application Insights

APM (Application Performance Monitoring) para apps web:
- **Distributed tracing** — Seguir requests entre servicios
- **Live metrics** — Dashboard en tiempo real
- **Smart detection** — Alertas automáticas por anomalías
- **Application map** — Visualizar dependencias
- **Failure analysis** — Errores agrupados con stack traces
- **Performance** — Tiempos de respuesta, throughput, dependencias lentas

### Integración por plataforma
| Plataforma | Cómo integrar |
|-----------|--------------|
| **App Service** | Auto-instrumentation (1 click en portal) |
| **Functions** | Auto-instrumentation |
| **Container Apps** | Dapr integration o SDK |
| **AKS** | OpenTelemetry Collector → App Insights |
| **Static Web Apps** | Client-side JS snippet |
| **React SPA** | `@microsoft/applicationinsights-web` npm package |

### Pricing
| Tier | Ingesta | Retención | Precio |
|------|---------|-----------|--------|
| **Gratis** | 5GB/mes | 90 días | 0€ |
| **Pay-as-you-go** | Ilimitado | Configurable | ~2.30€/GB ingesta |
| **Commitment tier** | 100GB+ | Configurable | Descuento por volumen |

## Log Analytics Workspace

Almacén central de logs para todo Azure:
- Logs de recursos Azure (diagnostic settings)
- Custom logs desde apps
- **KQL** (Kusto Query Language) para consultas

### Queries KQL comunes
```kql
// Errores en las últimas 24h
AppExceptions
| where TimeGenerated > ago(24h)
| summarize count() by ExceptionType
| order by count_ desc

// Latencia p95 por endpoint
AppRequests
| where TimeGenerated > ago(1h)
| summarize p95=percentile(DurationMs, 95) by Name
| order by p95 desc

// Requests fallidos
AppRequests
| where Success == false
| summarize FailCount=count() by ResultCode, Name
| order by FailCount desc
```

### Pricing
| Tier | Ingesta | Precio |
|------|---------|--------|
| **Gratis** | 5GB/mes (primeros 31 días) | 0€ |
| **Pay-as-you-go** | Ilimitado | ~2.50€/GB |
| **Commitment 100GB** | 100GB/día | ~190€/día (~30% ahorro) |

## Alerts

### Tipos de alertas
| Tipo | Basado en | Ejemplo |
|------|----------|---------|
| **Metric alert** | Métricas de recurso | CPU > 80% durante 5 min |
| **Log alert** | Query KQL | > 10 errores 5xx en 5 min |
| **Activity log** | Eventos de Azure | Recurso eliminado, role changed |
| **Smart detection** | ML de App Insights | Anomalía en failure rate |

### Action Groups
Destino de las alertas:
- Email / SMS
- Azure Function / Logic App / Webhook
- ITSM connector (ServiceNow, PagerDuty)
- Azure Mobile App push notification

### Pricing
- Metric alerts: ~0.10€/señal/mes
- Log alerts: ~0.50€/evaluación/mes (según frecuencia)
- Notificaciones: email gratis, SMS ~0.05€/SMS

## Azure Managed Grafana

- Grafana fully managed (no instalar nada)
- Integración nativa con Azure Monitor, Log Analytics, App Insights
- Dashboards predefinidos para servicios Azure
- **Pricing:** ~7€/instancia/mes (Essential) o ~14€ (Standard)

## Patrón de Monitoring por Tipo de App

### SPA + Supabase (youtube-indexer)
```
Azure Static Web Apps
    │
    └─ Application Insights (client-side)
         │ - Page views, load time
         │ - JavaScript exceptions
         │ - Custom events (search, favorite)
         │ - User sessions, funnels
         │
    Supabase Dashboard (separado)
         │ - Database metrics
         │ - Auth logs
         │ - Edge Function invocations
```

### Web App + DB en Azure
```
App Service → App Insights (auto-instrumentation)
    │              │ - Request traces
    │              │ - Dependency tracking (DB, APIs)
    │              │ - Exception tracking
    │
PostgreSQL → Diagnostic Settings → Log Analytics
    │              │ - Slow queries
    │              │ - Connection stats
    │
    └──── Azure Monitor Alerts
               │ - CPU/Memory > threshold
               │ - Error rate > threshold
               │ - Response time > SLO
```

## Checklist de Monitoring para Producción

- [ ] Application Insights habilitado con connection string
- [ ] Diagnostic settings en todos los recursos → Log Analytics
- [ ] Alertas configuradas: error rate, latencia, disponibilidad
- [ ] Dashboard con métricas clave (4 golden signals)
- [ ] Action group configurado (email + PagerDuty/Opsgenie)
- [ ] Availability test (ping URL cada 5 min desde múltiples regiones)
- [ ] Budget alert configurada para costes inesperados
