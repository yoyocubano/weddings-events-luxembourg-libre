# Documentación de la API

Este documento describe los endpoints de la API del backend para el proyecto "Weddings & Events Luxembourg".

---

## General

*   **Ubicación del Código**: Las funciones serverless se encuentran en el directorio `/api`.
*   **Entorno**: Node.js.
*   **Autenticación**: Los endpoints están protegidos por las reglas de la plataforma de despliegue (Vercel/Netlify) y, en el caso del formulario, por reCAPTCHA.

---

## 1. Endpoint: Chat con IA

**Ruta**: `POST /api/chat`

**Descripción**: Este endpoint es el núcleo del chatbot "Rebeca AI". Recibe el historial de una conversación y devuelve la siguiente respuesta generada por la inteligencia artificial. Incorpora un prompt de sistema que define la personalidad del bot, sus objetivos y sus reglas de seguridad.

### Solicitud (Request)

*   **Método**: `POST`
*   **Cuerpo (Body)**: `application/json`

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hola, ¿qué servicios ofreces?"
    },
    {
      "role": "assistant",
      "content": "¡Hola! Ofrecemos servicios premium de fotografía y videografía para bodas y eventos de lujo."
    },
    {
      "role": "user",
      "content": "Genial, me gustaría saber más sobre los paquetes de bodas."
    }
  ]
}
```

### Respuestas (Responses)

#### ✅ **200 OK - Éxito**

*   **Cuerpo (Body)**: `application/json`

Devuelve la respuesta del asistente en un formato de texto plano.

```json
{
  "response": "Por supuesto. Tenemos varios paquetes para bodas, desde cobertura completa del día hasta sesiones más íntimas. ¿Podrías darme una idea del tamaño y estilo de tu boda para poder recomendarte el mejor paquete?"
}
```

#### ❌ **400 Bad Request**

Se devuelve si el cuerpo de la solicitud es inválido o el array `messages` está vacío.

#### ❌ **500 Internal Server Error**

Se devuelve si hay un problema al comunicarse con la API de DeepSeek o si ocurre un error inesperado en el servidor.

---

## 2. Endpoint: Envío de Formulario de Contacto

**Ruta**: `POST /api/submit-inquiry`

**Descripción**: Procesa los datos enviados desde el formulario de contacto, realiza una validación anti-spam con reCAPTCHA y guarda la información en la base de datos.

### Solicitud (Request)

*   **Método**: `POST`
*   **Cuerpo (Body)**: `application/json`

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1-555-123-4567",
  "service": "Fotografía de Boda",
  "eventDate": "2025-09-20",
  "message": "Estamos planeando nuestra boda y nos encanta vuestro trabajo. Nos gustaría recibir más información.",
  "recaptchaToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### Respuestas (Responses)

#### ✅ **200 OK - Éxito**

*   **Cuerpo (Body)**: `application/json`

```json
{
  "success": true,
  "message": "Inquiry submitted successfully."
}
```

#### ❌ **400 Bad Request**

Se devuelve si los datos del formulario no pasan la validación (ej. email inválido, campos obligatorios vacíos).

```json
{
  "success": false,
  "message": "Invalid input data.",
  "errors": { /* Detalles de los errores de validación */ }
}
```

#### ❌ **403 Forbidden**

Se devuelve si la validación de reCAPTCHA falla, indicando un posible envío de spam.

```json
{
  "success": false,
  "message": "reCAPTCHA validation failed."
}
```

#### ❌ **500 Internal Server Error**

Se devuelve si hay un problema al insertar los datos en la base de datos o si ocurre otro error del lado del servidor.
