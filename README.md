# Movix Backend

Movix es una aplicación de gestión de listas de películas que permite a los usuarios registrar, iniciar sesión y administrar sus listas de películas favoritas, vistas y por ver.

## FrontEnd

https://github.com/FacuMartinezVidal/movix

## Repositorio GitHub
https://github.com/FacuMartinezVidal/movix-backend.git
## Características

- Registro e inicio de sesión de usuarios.
- Añadir películas a listas de favoritos, vistas y por ver.
- Actualizar y eliminar películas de las listas.
- Editar perfil de usuario.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework web para Node.js.
- **Prisma**: ORM para interactuar con la base de datos.
- **PostgreSQL**: Sistema de gestión de bases de datos.
- **bcrypt**: Biblioteca para el cifrado de contraseñas.
- **jsonwebtoken**: Implementación de JSON Web Tokens.
- **Express-Validator**: Middleware para validaciones en Express.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

* Node.js (v14 o superior)
* npm (v6 o superior) o Yarn (opcional)
* Docker (para ejecutar PostgreSQL)
* PostgreSQL (se ejecutará en un contenedor Docker)

## Instalación

1. **Clonar el repositorio:**

   ```sh
   git clone https://github.com/FacuMartinezVidal/movix-backend.git
   cd movix-backend
   ```
2. **Instalar Dependencias:**
   ```sh
   npm install
   ```
3. **Configurar Variables de Entorno:**
   ```env
      PORT=8000
      POSTGRES_USER=fmartinezvidal
      POSTGRES_PASSWORD=2908
      POSTGRES_DB=movix
      DATABASE_URL="postgresql://fmartinezvidal:2908@localhost/movix?schema=public"
      JWT_SECRET="secret-key"
      JWT_EXPIRES_IN="1d"**
   ```
4. **Ejecución:**
   ```sh
   # Asegúrate de que Docker esté en funcionamiento en tu sistema
   # En la mayoría de los sistemas, puedes iniciar Docker con:
   # En Windows: Inicia Docker Desktop
   # En macOS: Inicia Docker Desktop
   # En Linux: sudo systemctl start docker

   # Una vez que Docker esté en funcionamiento, procede con los siguientes comandos:

   docker compose up -d  # Levantar la base de datos
   npx prisma migrate dev --name init  # Crear las tablas
   npm run dev  # Ejecutar la API
## Endpoints Disponibles

### Autenticación

#### Registro de Usuario
- **POST /api/v1/auth/register**
    - Body:
      ```json
      {
        "username": "string",
        "email": "string",
        "password": "string"
      }
      ```
    - Response (201 Created):
      ```json
      {
        "status": 201,
        "message": "Successfully Created",
        "user": {
          "id": "string",
          "username": "string",
          "email": "string"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "Username is required", "Email must be valid", "Password must be at least 6 characters long"
        - 400 Bad Request: "User or email already exists!"
        - 500 Internal Server Error: "Error registering user"

#### Inicio de Sesión
- **POST /api/v1/auth/login**
    - Body:
      ```json
      {
        "email": "string",
        "password": "string"
      }
      ```
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Successfully login!",
        "user": {
          "id": "string",
          "username": "string",
          "email": "string",
          "token": "string"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "Email must be valid", "Password is required"
        - 401 Unauthorized: "Invalid Credentials"
        - 500 Internal Server Error: "Internal Server Error"

### Usuarios

#### Obtener Todos los Usuarios
- **GET /api/v1/users** (Requiere autenticación)
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Successfully fetched users",
        "users": [
          {
            "id": "string",
            "username": "string",
            "email": "string"
          }
        ],
        "success": true
      }
      ```
    - Errores posibles:
        - 401 Unauthorized: "Not authorized, token failed"
        - 500 Internal Server Error: "Internal Server Error"

#### Obtener Usuario por ID
- **GET /api/v1/users/:id** (Requiere autenticación)
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Successfully fetched user",
        "user": {
          "id": "string",
          "username": "string",
          "email": "string"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 401 Unauthorized: "Not authorized, token failed"
        - 404 Not Found: "User not found"
        - 500 Internal Server Error: "Internal Server Error"

#### Actualizar Usuario
- **PUT /api/v1/users/email/:email** (Requiere autenticación)
    - Body (opcional, puede incluir uno o más de los siguientes campos):
      ```json
      {
        "username": "string",
        "email": "string"
      }
      ```
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "User updated successfully",
        "user": {
          "id": "string",
          "username": "string",
          "email": "string"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "Invalid fields: [field1, field2, ...]"
        - 401 Unauthorized: "Not authorized, token failed"
        - 404 Not Found: "User not found"
        - 500 Internal Server Error: "Internal Server Error"

#### Solicitar Token para Cambio de Contraseña
- **POST /api/v1/user/send-token-password**
    - Body:
      ```json
      {
        "email": "string",
        "username": "string"
      }
      ```
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Password reset token sent to email",
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "Email is required"
        - 404 Not Found: "User not found"
        - 500 Internal Server Error: "Error sending email"

#### Cambiar Contraseña
- **POST /api/v1/user/change-password**
    - Body:
      ```json
      {
        "token": "string",
        "password": "string"
      }
      ```
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Password updated successfully",
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "Invalid token", "Password must be at least 6 characters long"
        - 500 Internal Server Error: "Error updating password"

### Películas

#### Añadir Película
- **POST /api/v1/movies** (Requiere autenticación)
    - Body:
      ```json
      {
        "api_id": "number",
        "title": "string",
        "original_title": "string",
        "overview": "string",
        "poster_path": "string",
        "backdrop_path": "string",
        "genre_ids": ["number"],
        "vote_average": "number",
        "vote_count": "number",
        "release_date": "string",
        "popularity": "number",
        "adult": "boolean",
        "original_language": "string",
        "video": "boolean"
      }
      ```
    - Response (201 Created):
      ```json
      {
        "status": 201,
        "message": "Movie added successfully",
        "movie": {
          "id": "number",
          "api_id": "number",
          "title": "string",
          "original_title": "string",
          "overview": "string",
          "poster_path": "string",
          "backdrop_path": "string",
          "genre_ids": ["number"],
          "vote_average": "number",
          "vote_count": "number",
          "release_date": "string",
          "popularity": "number",
          "adult": "boolean",
          "original_language": "string",
          "video": "boolean"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "Title is required", "Movie ID must be an integer", etc.
        - 401 Unauthorized: "Not authorized, token failed"
        - 500 Internal Server Error: "Internal Server Error"

#### Obtener Película por ID
- **GET /api/v1/movies/:id**
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "movie": {
          "id": "number",
          "api_id": "number",
          "title": "string",
          "original_title": "string",
          "overview": "string",
          "poster_path": "string",
          "backdrop_path": "string",
          "genre_ids": ["number"],
          "vote_average": "number",
          "vote_count": "number",
          "release_date": "string",
          "popularity": "number",
          "adult": "boolean",
          "original_language": "string",
          "video": "boolean"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 404 Not Found: "Movie not found"
        - 500 Internal Server Error: "Internal Server Error"

### Listas de Películas

#### Añadir a Favoritos
- **POST /api/v1/favorites**
    - Body:
      ```json
      {
        "userId": "string",
        "id": "number"
      }
      ```
    - Response (201 Created):
      ```json
      {
        "status": 201,
        "message": "Movie added to favorites",
        "favorite": {
          "id": "number",
          "userId": "string",
          "api_id": "number",
          "createdAt": "string (ISO date)"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "User ID must be a string", "Movie ID must be an integer"
        - 400 Bad Request: "Movie already in favorites"
        - 500 Internal Server Error: "Internal Server Error"

#### Eliminar de Favoritos
- **DELETE /api/v1/favorites/:userId/:id**
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Movie removed from favorites",
        "success": true
      }
      ```
    - Errores posibles:
        - 404 Not Found: "Favorite not found"
        - 500 Internal Server Error: "Internal Server Error"

#### Añadir a Watchlist
- **POST /api/v1/watchlist**
    - Body:
      ```json
      {
        "userId": "string",
        "id": "number"
      }
      ```
    - Response (201 Created):
      ```json
      {
        "status": 201,
        "message": "Movie added to watchlist",
        "watchlist": {
          "id": "number",
          "userId": "string",
          "api_id": "number",
          "createdAt": "string (ISO date)"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "User ID must be a string", "Movie ID must be an integer"
        - 400 Bad Request: "Movie already in watchlist"
        - 500 Internal Server Error: "Internal Server Error"

#### Eliminar de Watchlist
- **DELETE /api/v1/watchlist/:userId/:id**
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Movie removed from watchlist",
        "success": true
      }
      ```
    - Errores posibles:
        - 404 Not Found: "Watchlist item not found"
        - 500 Internal Server Error: "Internal Server Error"

#### Añadir a Watched
- **POST /api/v1/watched**
    - Body:
      ```json
      {
        "userId": "string",
        "id": "number"
      }
      ```
    - Response (201 Created):
      ```json
      {
        "status": 201,
        "message": "Movie added to watched",
        "watched": {
          "id": "number",
          "userId": "string",
          "api_id": "number",
          "createdAt": "string (ISO date)"
        },
        "success": true
      }
      ```
    - Errores posibles:
        - 400 Bad Request: "User ID must be a string", "Movie ID must be an integer"
        - 400 Bad Request: "Movie already in watched list"
        - 500 Internal Server Error: "Internal Server Error"

#### Eliminar de Watched
- **DELETE /api/v1/watched/:userId/:id**
    - Response (200 OK):
      ```json
      {
        "status": 200,
        "message": "Movie removed from watched",
        "success": true
      }
      ```
    - Errores posibles:
        - 404 Not Found: "Watched item not found"
        - 500 Internal Server Error: "Internal Server Error"
## Tabla DER Base de Datos

![image](https://github.com/FacuMartinezVidal/movix-backend/assets/90455496/8925ca1f-631e-48a5-9176-6b6e9aec9ef8)

