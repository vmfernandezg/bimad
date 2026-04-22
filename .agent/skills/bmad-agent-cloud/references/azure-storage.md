# Azure Storage — Referencia

## Servicios de Almacenamiento

| Servicio | Tipo | Ideal para |
|----------|------|-----------|
| **Blob Storage** | Objetos | Archivos, backups, media, data lake |
| **File Shares** | SMB/NFS | Shares compartidos, legacy apps |
| **Queue Storage** | Colas | Mensajería asíncrona simple |
| **Table Storage** | NoSQL KV | Key-value barato y masivo |
| **Data Lake Gen2** | Analytics | Big data, hierarchical namespace |

## Tiers de Acceso (Blob)

| Tier | Acceso | Storage/GB | Lectura/10K ops | Ideal para |
|------|--------|-----------|-----------------|-----------|
| **Hot** | Frecuente | ~0.02€ | ~0.004€ | Datos activos |
| **Cool** | Infrecuente | ~0.01€ | ~0.01€ | Backups recientes |
| **Cold** | Raro | ~0.005€ | ~0.01€ | Archivos 90+ días |
| **Archive** | Muy raro | ~0.001€ | ~5€ | Compliance, legal hold |

## Redundancia

| Tipo | Durabilidad | Regiones | Precio relativo |
|------|------------|----------|----------------|
| **LRS** | 11 nines | 1 | Bajo |
| **ZRS** | 12 nines | 1 (3 zonas) | Medio |
| **GRS** | 16 nines | 2 | Alto |
| **GZRS** | 16 nines | 2 (3 zonas primarias) | Muy alto |

## Decision Tree

```
¿Archivos estáticos de web app (JS, CSS, imágenes)?
  └─ SÍ → Static Web Apps (hosting integrado) o Blob + CDN
¿Uploads de usuario (avatares, documentos)?
  └─ SÍ → Blob Storage Hot + SAS tokens
¿Backups de BD?
  └─ SÍ → Blob Storage Cool/Cold + lifecycle management
¿Archivos compartidos entre VMs?
  └─ SÍ → Azure Files (SMB/NFS)
¿Data lake para analytics?
  └─ SÍ → Data Lake Gen2 (hierarchical namespace)
```
