# Protocolo de Despliegue

Este documento describe el proceso paso a paso para desplegar la aplicación en producción. Seguir este protocolo es obligatorio para evitar errores.

## 1. Requisitos Previos

- **Gestor de Paquetes:** El proyecto utiliza `pnpm`. No use `npm` o `yarn`.
- **CLI de Firebase:** Asegúrese de tener la CLI de Firebase instalada y de haber iniciado sesión (`firebase login`).

## 2. Proceso de Despliegue

Todas las órdenes deben ejecutarse desde la **raíz del proyecto**.

### Paso 1: Instalar Dependencias

Este comando instala las dependencias exactas definidas en el archivo de bloqueo.

```bash
pnpm install
```

### Paso 2: Compilar la Aplicación

Este comando compila el código de la aplicación (React, TypeScript) en archivos estáticos optimizados para producción.

```bash
pnpm run build
```

**Verificación:** Antes de continuar, confirme que se ha creado una carpeta `dist` en el directorio raíz. Si esta carpeta no existe, el proceso de compilación falló y no se debe continuar.

### Paso 3: Desplegar en Firebase

Este comando sube el contenido de la carpeta `dist` a Firebase Hosting.

```bash
firebase deploy
```

**Resultado:** Al finalizar, la terminal mostrará un mensaje de éxito y la `Hosting URL`. Esta es la URL pública de la aplicación.
