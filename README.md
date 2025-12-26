# Weddings & Events Luxembourg

Un sitio web profesional y elegante para servicios de fotografía y videografía de bodas y eventos en Luxemburgo.

## 🌟 Características

- **Diseño Elegante**: Paleta de colores sofisticada con tonos burgundy, champagne y dorado
- **Portafolio Dinámico**: Galería filtrable por categorías (bodas, eventos corporativos, celebraciones)
- **Paquetes de Servicios**: Presentación detallada de servicios de fotografía y video
- **Sistema de Consultas**: Formulario completo con notificaciones automáticas al propietario
- **Integración de Mapas**: Google Maps mostrando áreas de servicio en Luxemburgo
- **Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **Backend Robusto**: tRPC con TypeScript para APIs type-safe

## 🚀 Tecnologías

- **Frontend**: React 19, Tailwind CSS 4, Wouter (routing)
- **Backend**: Express, tRPC 11, Node.js
- **Base de Datos**: MySQL/TiDB con Drizzle ORM
- **Autenticación**: Manus OAuth
- **Testing**: Vitest
- **Tipografía**: Playfair Display (serif) + Inter (sans-serif)

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar base de datos
pnpm db:push

# Poblar datos de ejemplo (opcional)
npx tsx seed-db.mjs

# Iniciar servidor de desarrollo
pnpm dev
```

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Verificar tipos
pnpm check
```

## 📁 Estructura del Proyecto

```
├── client/               # Frontend React
│   ├── src/
│   │   ├── pages/       # Páginas principales
│   │   ├── components/  # Componentes reutilizables
│   │   └── lib/         # Utilidades y configuración
├── server/              # Backend Express + tRPC
│   ├── routers.ts       # Definición de APIs
│   ├── db.ts            # Consultas de base de datos
│   └── *.test.ts        # Tests unitarios
├── drizzle/             # Esquemas y migraciones
└── shared/              # Código compartido
```

## 🎨 Páginas

1. **Home**: Hero section con servicios destacados y portafolio featured
2. **Portfolio**: Galería filtrable con visualizador de imágenes
3. **Services**: Paquetes de servicios con precios y características
4. **About**: Información del equipo y valores de la empresa
5. **Contact**: Formulario de consulta con integración de Google Maps

## 🔧 Configuración

Las variables de entorno son gestionadas automáticamente por la plataforma Manus. Para desarrollo local, asegúrate de tener configurado `DATABASE_URL`.

## 📝 Base de Datos

El esquema incluye:
- `portfolio_categories`: Categorías del portafolio
- `portfolio_projects`: Proyectos con imágenes
- `service_packages`: Paquetes de servicios
- `client_inquiries`: Consultas de clientes
- `team_members`: Miembros del equipo

## 🚀 Deployment

El sitio está alojado en Manus con hosting integrado. Para publicar:

1. Crear un checkpoint desde la interfaz de Manus
2. Hacer clic en el botón "Publish" en el panel de gestión
3. Configurar dominio personalizado si es necesario

## 📧 Notificaciones

El sistema envía notificaciones automáticas al propietario cuando se recibe una nueva consulta de cliente, incluyendo todos los detalles del evento.

## 🗺️ Integración de Mapas

Google Maps está integrado en la página de contacto mostrando las áreas de servicio principales en Luxemburgo.

## 📄 Licencia

MIT

## 🔗 Enlaces

- **Repositorio**: https://github.com/yoyocubano/weddings-events-luxembourg
- **Demo**: [URL del sitio desplegado]

## 🎨 Identidad de Marca y Colores

El proyecto utiliza dos esquemas de color principales para distinguir la experiencia web general de la experiencia premium del chat.

### 1. Web General (Modern Elegant)
*Utilizada en Hero, Servicios y Formularios.*

| Color | Hex | Uso Principal |
| :--- | :--- | :--- |
| **Soft Black** | `#1E1E1E` | Texto Principal, Títulos |
| **Light Champagne** | `#FAF8F6` | Fondo Principal |
| **Soft Gold** | `#9F8F6A` | Acentos, Bordes Sutiles |
| **Pure White** | `#FFFFFF` | Tarjetas, Fondos de Contenido |

### 2. Chat Widget (Dark Luxury)
*Diseño exclusivo para "Rebeca AI" con estética OLED.*

| Color | Hex | Uso Principal |
| :--- | :--- | :--- |
| **Luxembourg Gold** | `#D4AF37` | **Botones, Burbujas Usuario** |
| **Deep Black** | `#0F0F0F` | Fondo del Chat |
| **Surface Black** | `#141414` | Header, Inputs |
| **Dark Graphite** | `#2A2A2A` | Burbujas AI |
| **Platinum Grey** | `#E5E5E5` | Texto de Contraste |

---

Desarrollado con ❤️ para capturar momentos perfectos en Luxemburgo
