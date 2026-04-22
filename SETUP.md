# BMAD Method — Setup Remoto

## Qué es esto

Suite de agentes IA para desarrollo de aplicaciones usando [BMAD Method](https://docs.bmad-method.org/) con base de conocimiento SDLC almacenada en un vault de Obsidian. Los agentes se ejecutan en [Antigravity](https://antigravity.google/) (IDE de Google) y consultan/escriben en el vault vía MCP (Model Context Protocol).

## Arquitectura

```
Tu equipo (Portátil 2)                   Equipo servidor (Portátil 1)
┌──────────────────────┐                ┌──────────────────────┐
│ Antigravity           │  HTTP          │ MCP server.py        │
│ ├─ .agent/skills/ (57)│──────────────▶│ Vault Obsidian       │
│ ├─ .agent/workflows/  │  Streamable   │ (52 notas, 261 edges)│
│ └─ _bmad/             │               │                      │
└──────────────────────┘                └──────────────────────┘
```

- **Este repo** contiene los agentes BMAD (skills, workflows, config) — se clonan a tu equipo
- **El vault de Obsidian** (base de conocimiento SDLC + artefactos de proyectos) está en el equipo servidor
- **La conexión** entre ambos es un MCP server Streamable HTTP corriendo en el equipo servidor

## Prerrequisitos en tu equipo

- [Antigravity](https://antigravity.google/) instalado
- Git instalado
- Conectividad de red con el equipo servidor (misma LAN)

**NO necesitas:** Python, Node.js, Obsidian, ni ejecutar `npx bmad-method install`.

## Setup paso a paso

### 1. Clonar este repo

```bash
git clone https://github.com/vmfernandezg/bimad.git
cd bimad
```

### 2. Configurar la conexión al MCP remoto

Copia el template incluido en el repo al config global de Antigravity:

**Windows:**
```cmd
copy mcp_config.remote.example.json %USERPROFILE%\.gemini\antigravity\mcp_config.json
```

**macOS/Linux:**
```bash
cp mcp_config.remote.example.json ~/.gemini/antigravity/mcp_config.json
```

Edita el archivo copiado y cambia `192.168.X.X` por la **IP real** del equipo servidor.
El **puerto** lo verás en la consola del equipo servidor cuando arranque el MCP.

Ejemplo:
```json
{
  "mcpServers": {
    "obsidian-graph-bimad": {
      "url": "http://192.168.1.138:8080/mcp"
    }
  }
}
```

> **NOTA:** Si ya tienes otros MCP servers configurados en Antigravity, no sobreescribas el archivo completo — añade `"obsidian-graph-bimad"` al objeto `mcpServers` existente.

### 3. Abrir Antigravity

Abre Antigravity en la carpeta `bimad/`. Los agentes se cargan automáticamente desde `.agent/skills/` y `.agent/workflows/`.

### 4. Verificar

Escribe `/help` en el chat de Antigravity. Debería responder `bmad-help` con el estado del proyecto y recomendaciones.

## Agentes disponibles (slash commands)

| Comando | Agente | Nombre | Función |
|---------|--------|--------|---------|
| `/pm` | Product Manager | John | PRD, requisitos, épicas, user stories |
| `/architect` | System Architect | Winston | Arquitectura técnica, C4 diagrams, ADRs |
| `/dev` | Senior Developer | Amelia | Implementación, code review, TDD |
| `/sec` | Security Engineer | Dmitri | Threat modeling STRIDE, security review, OWASP |
| `/cloud` | Cloud Infra Engineer | Viktor | Arquitectura Azure, DNS, TLS, IaC, costes |
| `/qa` | Test Architect | Murat | Testing strategy, QA gates, ATDD |
| `/analyst` | Business Analyst | Mary | Investigación, competitive analysis |
| `/ux` | UX Designer | Sally | Wireframes, UX flows, accesibilidad |

## Workflows disponibles

| Comando | Función |
|---------|---------|
| `/help` | Analiza estado del proyecto y recomienda el siguiente paso |
| `/create-prd` | Crear Product Requirements Document |
| `/create-architecture` | Diseñar arquitectura técnica |
| `/create-epics` | Crear épicas y user stories |
| `/dev-story` | Implementar una story |
| `/sprint-planning` | Planificar sprint |
| `/code-review` | Code review adversarial multi-capa |
| `/quick-dev` | Fix rápido o cambio pequeño |
| `/brainstorming` | Sesión de ideación con técnicas creativas |
| `/retrospective` | Retrospectiva post-épica |
| `/party-mode` | Mesa redonda multi-agente |

## El vault de Obsidian (MCP remoto)

Los agentes consultan y escriben en un vault de Obsidian vía MCP. El vault contiene:

### Base de conocimiento SDLC (32 notas)

| Área | Notas |
|------|-------|
| Fundamentos | SDLC Overview, Fases del SDLC, Glosario (70+ términos) |
| Requisitos | Ingeniería de Requisitos, User Stories, Estimación |
| Arquitectura | C4 Model, Arc42, Microservicios, API Design, DB Design, Clean Code/SOLID/DDD, Deuda Técnica |
| Decision Frameworks | Monolito vs Micro, SQL vs NoSQL, REST vs GraphQL vs gRPC, SSR vs SPA vs MPA |
| UX | Proceso UX (4 fases), Design Thinking, WCAG |
| Metodologías | Scrum Guide, Kanban, SAFe (10 principios) |
| DevOps | DORA Metrics, CI/CD Pipelines, Containers/K8s, Observabilidad (4 Golden Signals), Incident Management |
| Testing | Fundamentos (pirámide, tipos, técnicas) |
| Seguridad | Secure SDLC, OWASP Top 10, OWASP ASVS |
| Git | Git Workflows (5 modelos), Trunk-Based Development |
| Principios | 12-Factor App |

### Espacio de proyectos BMAD

Los artefactos generados por los agentes (PRD, épicas, arquitectura, ADRs, sprints, reviews) se guardan en `BMAD/Projects/{nombre-proyecto}/` dentro del vault.

### Herramientas MCP disponibles para los agentes

| Tool | Descripción |
|------|------------|
| `list_notes` | Listar todas las notas del vault |
| `get_note(name)` | Leer contenido completo de una nota |
| `search_notes(query, by)` | Buscar por texto libre o por tag |
| `create_note(path, content)` | Crear nota nueva en el vault |
| `update_note(path, content)` | Actualizar nota existente |
| `delete_note(path)` | Eliminar nota |
| `append_to_note(path, content)` | Añadir contenido al final de una nota |
| `get_backlinks(name)` | Ver qué notas enlazan a esta |
| `graph_neighbors(name, depth)` | Explorar vecindad en el grafo |
| `shortest_path(source, target)` | Camino más corto entre dos notas |
| `vault_stats` | Estadísticas globales del vault |

## Equipo servidor — Cómo iniciar el MCP

En el equipo que tiene el vault de Obsidian, ejecutar:

```bash
python -u server.py http
```

El server auto-detecta un puerto libre (8080-8099) y muestra:

```
MCP Streamable HTTP en http://0.0.0.0:8080/mcp
Vault: C:\Users\...\Obsidian\bimad\bimad
Para conectar desde otro equipo: http://<TU-IP-LOCAL>:8080/mcp
```

Dejar corriendo mientras se usen los agentes desde el otro equipo.

## Troubleshooting

### "No se conecta al MCP"
- Verificar que el MCP server está corriendo en el equipo servidor
- Verificar la IP y puerto en `~/.gemini/antigravity/mcp_config.json`
- Comprobar que no hay firewall bloqueando el puerto (Windows Defender puede bloquearlo la primera vez)
- Probar conectividad: `curl http://<IP>:<PUERTO>/mcp`

### "Los slash commands no aparecen"
- Verificar que `.agent/skills/` y `.agent/workflows/` existen tras el clone
- Reiniciar Antigravity después del clone
- Verificar escribiendo el nombre completo del skill: `bmad-agent-pm`

### "El agente no puede leer/escribir en el vault"
- Verificar que Obsidian está abierto en el equipo servidor (el plugin REST necesita que esté activo)
- Verificar con: `curl http://<IP>:<PUERTO>/mcp`
- Revisar la consola del server por errores

### "El agente sobreescribe notas SDLC"
- Los agentes deben prefijar sus notas de proyecto (ej: `YTI-C4-Model.md` para youtube-indexer)
- Nunca usar nombres genéricos como `C4-Model.md` que colisionan con la base de conocimiento
- Consultar la ontología en la nota `SDLC-BMAD-Bridge` del vault
