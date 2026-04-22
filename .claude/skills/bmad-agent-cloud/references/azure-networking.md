# Azure Networking — Referencia

## Decision Tree: Exponer una App

```
¿App pública en internet?
  └─ SÍ → ¿SPA estática?
  │          └─ SÍ → Azure Static Web Apps (CDN + TLS gratis integrado)
  │          └─ NO → ¿Necesitas WAF + CDN global?
  │                      └─ SÍ → Azure Front Door (Standard o Premium)
  │                      └─ NO → ¿Necesitas routing L7 (path-based)?
  │                                  └─ SÍ → Application Gateway v2
  │                                  └─ NO → Azure Load Balancer Standard
  └─ NO → ¿Acceso solo desde VNet?
              └─ SÍ → Private Endpoints + NSG
```

## Servicios de Red

### Virtual Network (VNet)
- Red privada aislada en Azure
- Subnets para segmentar workloads
- **Sizing:** /16 para la VNet, /24 por subnet (251 IPs útiles)
- **Regla:** No se puede cambiar el address space fácilmente — planificar bien

### Network Security Groups (NSG)
- Firewall L4 (IP + puerto + protocolo) por subnet o NIC
- Deny by default para inbound, allow by default para outbound
- Reglas con prioridad (100-4096, menor número = mayor prioridad)

### Azure DNS
- Hosting de zonas DNS (~0.50€/zona + ~0.40€/M queries)
- Soporte para public y private DNS zones
- Integración nativa con todos los servicios Azure
- **Private DNS Zones** para resolución interna (ej: `privatelink.database.windows.net`)

### TLS/SSL Certificates

| Servicio | Certificate management |
|----------|----------------------|
| **Static Web Apps** | TLS gratis automático para custom domains |
| **App Service** | Managed certificate gratis (custom domain) |
| **Front Door** | TLS gratis automático |
| **Application Gateway** | Traer propio cert o Key Vault integration |
| **Let's Encrypt** | Vía App Service extension o certbot manual |

### Azure Front Door

| Tier | Precio aprox/mes | Incluye |
|------|-----------------|---------|
| **Standard** | ~30€ + tráfico | CDN global, TLS, routing, basic analytics |
| **Premium** | ~300€ + tráfico | + WAF managed rules, bot protection, Private Link |

Features:
- CDN global con POP en 100+ ubicaciones
- SSL/TLS offloading
- Path-based routing
- Health probes + failover automático
- Compresión, caching
- Custom domains ilimitados

### Application Gateway v2

- Load balancer L7 (HTTP/HTTPS) regional
- WAF v2 integrado (OWASP CRS 3.2)
- SSL termination, cookie-based affinity
- URL-based routing, multi-site hosting
- Autoscaling (0-125 unidades)
- Precio: ~180€/mes (fijo) + capacidad

**Cuándo usar App Gateway vs Front Door:**
| Criterio | App Gateway | Front Door |
|----------|------------|-----------|
| Scope | Regional | Global |
| Latencia | Baja en región | Baja en todo el mundo |
| WAF | Sí (regional) | Sí (edge) |
| Precio | Más caro | Más barato para tráfico bajo |
| Ideal para | Apps en 1 región con WAF | Apps globales, multi-región |

### Private Endpoints
- Acceso privado a servicios PaaS (SQL, Storage, Key Vault, Cosmos DB) desde VNet
- Sin exposición a internet público
- DNS privado automático via Private DNS Zones
- Precio: ~7€/mes por endpoint + tráfico

### Azure CDN
- Alternativa a Front Door para solo CDN (sin WAF/routing)
- Tiers: Microsoft (Classic), Verizon, Akamai
- **Recomendación:** Usar Front Door Standard en vez de CDN standalone (mejor integración)

## Patrones de Red Comunes

### SPA + BaaS (Supabase) — Sin VNet necesaria
```
Internet → Azure Static Web Apps (CDN+TLS) → Client-side JS
                                                    │
                                              HTTPS (público)
                                                    │
                                        Supabase Cloud (externo)
```
No necesita VNet, NSG ni Private Endpoints. La SPA corre en el browser.

### Web App + DB en Azure — Con VNet
```
Internet → Front Door (WAF) → App Service → Private Endpoint → PostgreSQL
                                    │
                               VNet integration
                                    │
                           Subnet: app-subnet
```

### Microservicios en AKS
```
Internet → Front Door → AKS Ingress (Gateway API)
                              │
                    ┌─────────┼──────────┐
                    │         │          │
                 svc-a     svc-b     svc-c
                    │         │          │
               PE: SQL   PE: Redis  PE: Storage
```

## Custom Domain Setup (paso a paso)

1. **Comprar dominio** (Namecheap, Cloudflare, GoDaddy, o Azure App Service Domains)
2. **Crear Azure DNS Zone** para el dominio
3. **Actualizar NS records** en el registrar → apuntar a Azure DNS
4. **Añadir custom domain** al servicio (Static Web Apps, App Service, Front Door)
5. **TLS certificate** → automático en SWA/Front Door, managed cert en App Service
6. **Verificación** → CNAME o TXT record según servicio

```
Registrar (Namecheap)          Azure DNS Zone          Azure Service
┌──────────────────┐     ┌──────────────────┐    ┌──────────────────┐
│ NS → Azure DNS   │────▶│ A/CNAME → SWA IP │───▶│ Custom domain    │
│                  │     │ TXT → verify     │    │ + TLS cert       │
└──────────────────┘     └──────────────────┘    └──────────────────┘
```
