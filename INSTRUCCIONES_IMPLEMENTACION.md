# Guía de Despliegue en Producción

Este documento proporciona los pasos necesarios para desplegar el proyecto "Weddings & Events Luxembourg" en un entorno de producción.

---

## 1. Prerrequisitos

Antes de comenzar, asegúrate de tener lo siguiente:

*   Una cuenta en una plataforma de hosting **Jamstack** (ej. [Vercel](https://vercel.com) o [Netlify](https://www.netlify.com)).
*   Una base de datos **MySQL-compatible** (ej. [PlanetScale](https://planetscale.com), [TiDB Cloud](https://tidb.cloud), etc.).
*   Las claves de API para los servicios de terceros:
    *   **DeepSeek API Key** para el "Rebeca AI" Chatbot.
    *   **Google reCAPTCHA v3 keys** (Site Key y Secret Key) para la protección anti-spam del formulario.
*   El código fuente del proyecto subido a un repositorio de Git (GitHub, GitLab, etc.).

---

## 2. Variables de Entorno

Deberás configurar las siguientes variables de entorno en el panel de control de tu plataforma de hosting (Vercel o Netlify). **Nunca las guardes directamente en el código.**

```env
# Conexión a la base de datos (obtenida de tu proveedor de BD)
DATABASE_URL="mysql://user:password@host/database?sslaccept=strict"

# Clave secreta de la API de DeepSeek para el Chatbot AI
DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# Claves de Google reCAPTCHA v3
# La VITE_RECAPTCHA_SITE_KEY es pública y será usada en el frontend
VITE_RECAPTCHA_SITE_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
# La RECAPTCHA_SECRET_KEY es privada para la validación en el backend
RECAPTCHA_SECRET_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Opcional: Para analíticas web con Umami
VITE_ANALYTICS_ENDPOINT="https://your-umami-instance.com"
VITE_ANALYTICS_WEBSITE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## 3. Pasos de Despliegue

El proceso es similar tanto para Vercel como para Netlify, ya que ambos detectan automáticamente la configuración de Vite.

### a. Despliegue en Vercel

1.  **Crear un Nuevo Proyecto**: En tu dashboard de Vercel, haz clic en "Add New..." -> "Project".
2.  **Importar Repositorio**: Conecta tu cuenta de Git e importa el repositorio del proyecto.
3.  **Configurar el Proyecto**:
    *   Vercel detectará que estás usando **Vite** y configurará los comandos de build y el directorio de salida (`dist`) automáticamente. No necesitas cambiar nada en la sección "Build & Development Settings".
    *   Ve a la pestaña "Variables" y añade todas las variables de entorno listadas en el paso 2.
4.  **Desplegar**: Haz clic en el botón "Deploy". Vercel construirá y desplegará tu aplicación.

### b. Despliegue en Netlify

1.  **Crear un Nuevo Sitio**: En tu dashboard de Netlify, ve a "Sites" y haz clic en "Add new site" -> "Import an existing project".
2.  **Conectar Repositorio**: Conecta tu proveedor de Git y elige el repositorio.
3.  **Configurar el Despliegue**:
    *   Netlify también detectará la configuración de **Vite**.
    *   **Comando de Build**: `pnpm build` (o `vite build`)
    *   **Directorio de Publicación**: `dist`
    *   Haz clic en "Show advanced" y luego en "New variable" para añadir todas las variables de entorno del paso 2.
4.  **Desplegar Sitio**: Haz clic en el botón "Deploy site".

---

## 4. Pasos Post-Despliegue

### Migración de la Base de Datos

Después del primer despliegue, la base de datos estará vacía. Debes ejecutar las migraciones para crear las tablas necesarias.

1.  **Conéctate a la base de datos de producción**: Modifica tu archivo `.env` local temporalmente para apuntar a la `DATABASE_URL` de producción.
2.  **Ejecuta el comando de `push` de Drizzle**:
    ```bash
    pnpm db:push
    ```
3.  **Siembra de datos (opcional)**: Si tienes un script para añadir datos iniciales (como `seed-db.mjs`), puedes ejecutarlo:
    ```bash
    node seed-db.mjs
    ```
4.  **¡Importante!**: revierte los cambios en tu archivo `.env` local para volver a apuntar a tu base de datos de desarrollo.

---

## 5. Verificación

Una vez desplegado, verifica que todo funcione correctamente:

*   El sitio carga sin errores.
*   El Chatbot "Rebeca AI" se abre y responde a los mensajes.
*   El formulario de contacto puede ser enviado y muestra el mensaje de éxito.
*   Las diferentes páginas y la navegación funcionan como se espera.
