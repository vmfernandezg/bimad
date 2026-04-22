# Azure Prepare — Referencia

## Proceso de Preparación para Azure

### Workflow Obligatorio
```
1. Crear .azure/deployment-plan.md (ANTES de cualquier código)
2. Phase 1: Análisis (5 pasos de investigación)
3. Presentar plan al usuario para aprobación
4. Phase 2: Ejecución (solo tras aprobación)
5. Hand-off obligatorio a validación
```

### Phase 1: Planning Steps

| Paso | Acción |
|------|--------|
| 1 | Analizar modo workspace (NEW/MODIFY/MODERNIZE) |
| 2 | Recoger requisitos (clasificación, escala, presupuesto) |
| 3 | Escanear codebase para componentes y dependencias |
| 4 | Seleccionar receta (AZD, AZCLI, Bicep, o Terraform) |
| 5 | Planificar arquitectura y mapeo de servicios Azure |
| 6 | Finalizar documento de plan con todas las decisiones |

### Recetas de IaC

| Receta | Cuándo usar |
|--------|-----------|
| **Azure Developer CLI (azd)** | Proyectos nuevos, templates disponibles |
| **Bicep** | IaC nativa de Azure, ARM templates modernas |
| **Terraform** | Multi-cloud, equipo ya usa Terraform |
| **Azure CLI** | Scripting rápido, prototipos |

### Outputs Producidos
- `.azure/deployment-plan.md` (source of truth)
- Infrastructure code en `./infra/`
- `azure.yaml` (para recetas AZD)
- Dockerfiles en `src/<component>/`

### Reglas Críticas
- NUNCA generar `administratorLogin` en SQL Server Bicep — usar Entra-only auth
- NUNCA borrar directorios del proyecto del usuario
- Acciones destructivas requieren aprobación explícita
- No ejecutar deployment — solo preparar
