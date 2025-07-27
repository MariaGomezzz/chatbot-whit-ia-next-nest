
# Chatbot con IA usando Next.js y NestJS


Este proyecto es de carácter **educativo** y fue desarrollado con el objetivo de aprender el flujo completo (fullstack) de una aplicación moderna y la integración de una inteligencia artificial en un entorno real. Por ello, tanto el backend como el frontend se encuentran en el mismo repositorio, lo que facilita su localización y referencia para futuras consultas, además de simplificar la comprensión y gestión del ciclo de vida completo de la aplicación.

La aplicación consiste en un sistema de recomendación de libros mediante un chatbot con IA. El frontend está construido en Next.js y el backend en NestJS.

## Estructura del Proyecto

- **frontend/**: Aplicación web construida con Next.js.
- **backend/**: API REST construida con NestJS.


## Características

- Chatbot que recomienda libros usando IA (Gemini).
- Conversación persistente: el usuario puede mantener un historial de mensajes gracias a la integración de una **base de datos PostgreSQL** en el backend.
- API RESTful para enviar y recibir mensajes.
- Arquitectura desacoplada frontend-backend.


## Instalación

### Requisitos
- Node.js >= 18
- npm o yarn

### Backend
1. Instala dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Inicia el servidor:
   ```bash
   npm run start:dev
   ```

### Frontend
1. Instala dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Inicia la aplicación:
   ```bash
   npm run dev
   ```

## Endpoints principales (Backend)

- `GET /books/conversation` — Obtiene el historial de mensajes.
- `POST /books/only` — Envía un mensaje y recibe una recomendación única.
- `POST /books/conversation` — Envía un mensaje y continúa la conversación.


## Estructura de carpetas relevante

```
backend/
  src/
    books/           # Lógica de negocio y controladores de libros
    database/        # Configuración de la base de datos
    dto/             # Definición de DTOs
frontend/
  src/
    app/             # Páginas y componentes principales
    components/      # Componentes reutilizables
    services/        # Servicios para consumir la API
    types/           # Definición de interfaces y tipos
```



## Notas de desarrollo
- El backend sigue buenas prácticas de manejo de errores para que NestJS gestione correctamente las excepciones.
- El frontend consume la API del backend para mostrar recomendaciones y mantener la conversación.
- La persistencia de la conversación se realiza mediante **PostgreSQL**, una base de datos robusta y ampliamente utilizada en entornos profesionales, lo que permite practicar integraciones reales.
- Para la inteligencia artificial, se utiliza **Gemini** (modelo: Gemini 2.5 Flash), elegida por su generoso límite de consultas gratuitas y su facilidad de integración en proyectos de aprendizaje.

## Licencia

Este proyecto está bajo la licencia MIT.
