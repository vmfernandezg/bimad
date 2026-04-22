# Azure Identity & Authentication — Referencia

## Decision Tree: Auth para tu App

```
¿Usuarios son empleados de la organización?
  └─ SÍ → Microsoft Entra ID (Azure AD)
           - SSO con Microsoft 365
           - Conditional Access
           - MFA integrado
  └─ NO → ¿Usuarios consumidores (público general)?
              └─ SÍ → ¿Usas un BaaS externo (Supabase, Firebase)?
              │          └─ SÍ → Auth del BaaS (Supabase Auth, Firebase Auth)
              │          └─ NO → Azure AD B2C
              │                   - Social login (Google, Facebook, Apple)
              │                   - Email/password
              │                   - Custom policies
              └─ NO → ¿Service-to-service (APIs, microservicios)?
                          └─ SÍ → Managed Identity + RBAC (sin credenciales)
```

## Microsoft Entra ID (Azure AD)

### Tiers
| Tier | Precio/usuario/mes | Features |
|------|-------------------|---------|
| **Free** | 0€ | SSO, MFA básico, 50K objetos |
| **P1** | ~5.30€ | Conditional Access, grupos dinámicos, self-service reset |
| **P2** | ~8€ | Identity Protection, PIM, access reviews |

### App Registration
Registrar tu app en Entra ID para obtener:
- **Application (client) ID** — Identifica tu app
- **Directory (tenant) ID** — Tu organización
- **Client secret o certificate** — Para auth server-side
- **Redirect URIs** — URLs permitidas para OAuth callback

```
App Registration → API Permissions → Token Configuration → Certificates & Secrets
```

### OAuth 2.0 Flows

| Flow | Cuándo usar |
|------|-----------|
| **Authorization Code + PKCE** | SPAs, mobile apps (recomendado) |
| **Client Credentials** | Service-to-service, daemons |
| **On-Behalf-Of** | API que llama a otra API en nombre del usuario |
| **Device Code** | CLIs, dispositivos sin browser |

## Azure AD B2C

Para apps consumer-facing con self-service signup:
- Social identity providers (Google, Facebook, Apple, Twitter)
- Email/password local accounts
- Custom UI (branding completo)
- Custom policies (flows complejos)
- MFA (SMS, TOTP)
- **Precio:** Primeros 50K auth/mes gratis, luego ~0.003€/auth

### Cuándo B2C vs Supabase Auth

| Criterio | Supabase Auth | Azure AD B2C |
|----------|--------------|-------------|
| Setup | 5 min | 30-60 min |
| Social providers | Google, GitHub, Apple, etc. | Google, Facebook, Apple, etc. |
| Custom UI | Limitado | Completo (HTML/CSS/JS) |
| MFA | TOTP | SMS + TOTP |
| Pricing | Gratis hasta 50K MAU | Gratis hasta 50K auth/mes |
| Lock-in | Bajo (estándar JWT) | Medio (Microsoft ecosystem) |
| Enterprise features | No | Conditional Access, audit logs |

## Managed Identity

### Tipos
| Tipo | Asignación | Lifecycle |
|------|-----------|-----------|
| **System-assigned** | 1:1 con recurso Azure | Se borra con el recurso |
| **User-assigned** | Reutilizable entre recursos | Lifecycle independiente |

### Servicios que soportan Managed Identity
App Service, Functions, Container Apps, AKS, VMs, Logic Apps, Data Factory, API Management...

### Patrón: Managed Identity → Key Vault → App Config
```
App Service (System MI)
    │
    │ RBAC: "Key Vault Secrets User"
    ▼
Key Vault
    │
    │ Secret reference en App Settings
    ▼
App lee secrets como env vars (sin connection strings en código)
```

**Regla de oro:** Si el servicio soporta Managed Identity, NUNCA usar connection strings con claves.

## Integración con Supabase (externo)

Supabase no es un servicio Azure, así que la auth funciona así:
```
Browser → Supabase Auth (Google OAuth) → JWT token
Browser → Azure Static Web Apps → Sirve la SPA
SPA (client-side) → Supabase API (con JWT) → PostgreSQL (RLS)
```

Azure no participa en el auth flow si Supabase maneja la autenticación. Los secrets de Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) se guardan en:
- **Static Web Apps:** Environment variables (portal o CLI)
- **App Service:** App Settings → Key Vault reference
- **Functions:** App Settings → Key Vault reference
