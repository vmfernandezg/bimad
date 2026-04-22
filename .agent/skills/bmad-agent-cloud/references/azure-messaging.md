# Azure Messaging — Referencia

## Decision Tree

```
¿Mensajería punto a punto (1 productor → 1 consumidor)?
  └─ SÍ → ¿Necesitas transacciones, dead-letter, sesiones?
  │          └─ SÍ → Azure Service Bus Queue
  │          └─ NO → Azure Queue Storage (más barato)
  └─ NO → ¿Pub/Sub (1 productor → N consumidores)?
              └─ SÍ → ¿Alto throughput (>1M msg/s)?
              │          └─ SÍ → Azure Event Hubs (Kafka compatible)
              │          └─ NO → Azure Service Bus Topics
              └─ NO → ¿Eventos reactivos (cloud events)?
                          └─ SÍ → Azure Event Grid
```

## Comparación

| Servicio | Tipo | Throughput | Orden | Dead-Letter | Precio |
|----------|------|-----------|-------|-------------|--------|
| **Queue Storage** | Queue | Bajo | No | No | ~0.0004€/10K ops |
| **Service Bus Queue** | Queue | Medio | Sí (FIFO) | Sí | ~0.05€/M ops |
| **Service Bus Topic** | Pub/Sub | Medio | Sí | Sí | ~0.05€/M ops |
| **Event Hubs** | Stream | Muy alto | Por partición | No | Desde ~10€/mes |
| **Event Grid** | Eventos | Alto | No | Sí (retry) | ~0.50€/M ops |

## Cuándo usar cada uno

| Escenario | Servicio |
|-----------|---------|
| Background jobs, tareas async | Queue Storage o Service Bus Queue |
| Notificaciones a múltiples suscriptores | Service Bus Topics |
| Telemetría, IoT, logs en tiempo real | Event Hubs |
| Reaccionar a cambios en Azure (blob creado, etc.) | Event Grid |
| Integración con Apache Kafka | Event Hubs (Kafka endpoint) |
