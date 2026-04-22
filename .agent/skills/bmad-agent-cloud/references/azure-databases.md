# Azure Database Services — Referencia

## Decision Tree

```
¿Relacional con SQL estándar?
  └─ SÍ → ¿SQL Server (T-SQL, SSMS)?
  │          └─ SÍ → Azure SQL Database
  │          └─ NO → ¿PostgreSQL?
  │                      └─ SÍ → Azure Database for PostgreSQL Flexible
  │                      └─ NO → Azure Database for MySQL Flexible
  └─ NO → ¿Key-value / document con distribución global?
              └─ SÍ → Azure Cosmos DB
              └─ NO → ¿Cache en memoria?
                          └─ SÍ → Azure Cache for Redis
                          └─ NO → ¿Usa Supabase?
                                      └─ SÍ → No provisionar DB Azure — Supabase es el backend
```

## Comparación

| Servicio | Motor | Tier mínimo | Precio aprox/mes | Ideal para |
|----------|-------|------------|-----------------|-----------|
| **Azure SQL** | SQL Server | Basic (5 DTU) | ~5€ | Apps .NET, SSMS, T-SQL |
| **PostgreSQL Flexible** | PostgreSQL 16 | Burstable B1ms | ~15€ | Apps con PostgreSQL, migración desde Supabase |
| **MySQL Flexible** | MySQL 8 | Burstable B1ms | ~15€ | WordPress, PHP, legacy |
| **Cosmos DB** | Multi-model | Serverless | Pago por RU | Distribución global, < 10ms latencia |
| **Redis Cache** | Redis 6 | Basic C0 (250MB) | ~15€ | Cache, sesiones, pub/sub |

## Azure SQL Database

### Modelos de compra
| Modelo | Cuándo usar | Precio |
|--------|-----------|--------|
| **DTU** (Database Transaction Unit) | Simple, predecible | Basic 5DTU: ~5€, S0: ~15€ |
| **vCore** | Control fino de CPU/RAM | 2 vCores GP: ~200€ |
| **Serverless** | Uso intermitente, auto-pause | Pago por vCore/s |

### Features clave
- Automatic tuning, intelligent insights
- Geo-replication (read replicas)
- Point-in-time restore (hasta 35 días)
- TDE (Transparent Data Encryption) por defecto
- Entra-only auth (recomendado, sin passwords)

## Azure Database for PostgreSQL Flexible

### Tiers
| Tier | vCores | RAM | Storage | Precio aprox |
|------|--------|-----|---------|-------------|
| **Burstable B1ms** | 1 | 2GB | 32GB | ~15€/mes |
| **Burstable B2s** | 2 | 4GB | 64GB | ~30€/mes |
| **GP D2ds_v5** | 2 | 8GB | 128GB | ~130€/mes |
| **GP D4ds_v5** | 4 | 16GB | 256GB | ~260€/mes |

### Features clave
- PostgreSQL 13-16
- Alta disponibilidad con zone redundancy
- Read replicas
- Intelligent performance (query insights)
- Extensions: pgvector, PostGIS, pg_trgm, **tsvector (full-text search)**
- **Private access** via VNet integration o Private Endpoint

### Full-Text Search en PostgreSQL Azure
```sql
-- Crear índice GIN para full-text search
CREATE INDEX idx_videos_search ON videos
USING GIN (to_tsvector('spanish', title || ' ' || description));

-- Query
SELECT * FROM videos
WHERE to_tsvector('spanish', title || ' ' || description)
   @@ plainto_tsquery('spanish', 'tutorial react');
```
Mismo approach que Supabase (que usa PostgreSQL por debajo).

## Azure Cosmos DB

### APIs disponibles
| API | Compatible con | Ideal para |
|-----|---------------|-----------|
| **NoSQL** | JSON documents | Apps nuevas, serverless |
| **MongoDB** | MongoDB wire protocol | Migración desde MongoDB |
| **PostgreSQL** | PostgreSQL (Citus) | Distribución horizontal de PostgreSQL |
| **Table** | Azure Table Storage | Migración desde Table Storage |
| **Gremlin** | Apache TinkerPop | Grafos |

### Modelos de capacidad
| Modelo | Precio | Ideal para |
|--------|--------|-----------|
| **Serverless** | Pago por RU consumida | Dev/test, tráfico intermitente |
| **Provisioned** | RU/s reservadas | Producción predecible |
| **Autoscale** | Escala automática hasta max RU/s | Tráfico variable |

## Azure Cache for Redis

| Tier | Tamaño | SLA | Precio aprox |
|------|--------|-----|-------------|
| **Basic C0** | 250MB | No SLA | ~15€ |
| **Standard C0** | 250MB | 99.9% | ~40€ |
| **Premium P1** | 6GB | 99.9% | ~180€ |
| **Enterprise E10** | 12GB | 99.999% | ~700€ |

Casos de uso: session cache, API response cache, rate limiting, pub/sub, leaderboards.

## Patrón: Migrar de Supabase a Azure

Si en futuro se necesita migrar de Supabase a Azure PostgreSQL:
1. **Auth:** Supabase Auth → Entra ID B2C o implementación propia
2. **Database:** Supabase PostgreSQL → Azure PostgreSQL Flexible (pg_dump/pg_restore)
3. **Storage:** Supabase Storage → Azure Blob Storage
4. **Edge Functions:** Supabase Functions → Azure Functions
5. **RLS:** Se mantiene igual (es PostgreSQL nativo)
6. **Realtime:** Supabase Realtime → Azure SignalR Service
