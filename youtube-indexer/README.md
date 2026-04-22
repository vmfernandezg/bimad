# 📺 YouTube Indexer (MVP)

YouTube Indexer es una Single-Page Application (SPA) que permite a los usuarios **importar listas de reproducción de YouTube**, extraer sus metadatos (título, descripción, canal, miniaturas) y construir una base de datos de consulta ultrarrápida. Los usuarios pueden realizar búsquedas *full-text*, filtrar, gestionar y marcar sus videos favoritos.

Este proyecto ha sido diseñado arquitectónicamente usando metodologías robustas de SDLC, priorizando la seguridad y la rentabilidad de infraestructura en la nube.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Estilos:** Tailwind CSS v4 (con soporte de paleta en modo claro/oscuro)
- **Backend & Database:** Supabase (PostgreSQL autogestionado con API REST vía PostgREST)
- **Autenticación:** Supabase Auth (Email/Password; extensible a Google OAuth)
- **Proxy/Seguridad de Edge:** Supabase Edge Functions (Deno)
- **Despliegue Target:** Azure Static Web Apps (Free Tier) & Azure DNS

---

## 🔒 Postura de Seguridad (OWASP / STRIDE)

Tras nuestra auditoría de seguridad y Threat Modeling, se migró el fetching de la API de YouTube del frontend (*Client-Side*) a un micro-servicio perimetral (*Server-Side Edge Function*):

- **No hay Secretos Expuestos:** La clave de Google YouTube Data API v3 (`YOUTUBE_API_KEY`) no viaja en el bundle público. Reside enigmada en la Edge Function de Supabase.
- **Aislamiento Multi-Tenant (RLS):** Toda la base de datos de PostgreSQL cuenta con reglas puras y estrictas de **Row-Level Security**; un usuario autenticado solo puede crear, leer, actualizar o buscar los videos que le pertenecen. 

---

## ⚙️ Desarrollo Local (Local Setup)

### 1. Clonar e Instalar
```bash
git clone https://github.com/your-username/youtube-indexer.git
cd youtube-indexer
npm install
```

### 2. Variables de Entorno (Supabase)
Crea un fichero `.env.local` en la raíz del proyecto. **No incluyas la clave de Google aquí**, el cliente web asume que la Edge Function la conoce.

```env
VITE_SUPABASE_URL=https://<TU-PROYECTO-ID>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...<TU-ANON-KEY-DE-SUPABASE>
```

### 3. Edge Functions (Para Desarrolladores Backend)
El endpoint `youtube-proxy` está desplegado en la nube de Supabase. Si necesitas editar la función o levantar Supabase de forma local, debes instalar el CLI oficial:
```bash
npx supabase start
npx supabase functions serve youtube-proxy --env-file ./supabase/.env.local
```

### 4. Lanzar Bucle de Desarrollo Front-End
```bash
npm run dev
```

La aplicación quedará servida normalmente en `http://localhost:5173`.

---

## 🏗️ Arquitectura Cloud (Despliegue)
Revisado por nuestro consultor Cloud:
- El Host planeado asienta la carpeta `/dist` sobre **Azure Static Web Apps**.
- Beneficios extraídos de la topología Serverless predefinida en nuestro SDLC: Certificados TSL generados a nivel de Edge, DNS alias integrado, y 0€ de sobrecarga de servidores.

> *Hecho con amor y disciplina arquitectónica por el equipo B-MAD (Brainstorming, PM, Arquitectura, Infraestructura, Dev, QA y Sec).*
