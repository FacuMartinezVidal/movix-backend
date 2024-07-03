# Movix Backend

Movix es una aplicación de gestión de listas de películas que permite a los usuarios registrar, iniciar sesión y administrar sus listas de películas favoritas, vistas y por ver.

## FrontEnd

https://github.com/FacuMartinezVidal/movix


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

- Node.js (v14 o superior)
- npm (v6 o superior) o Yarn (opcional)
- PostgreSQL

## Instalación

1. **Clonar el repositorio:**

   ```sh
   git clone https://github.com/tu-usuario/movix-backend.git
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
4. **Ejecucion:**
   ```sh
     docker compose up -d #levantar la base de datos
     npx prisma migrate dev --name final tables #crear las tablas
     npm run dev  #ejecutar la api
   ```
## Endpoints Disponibles

### Autenticación

- **POST /api/v1/auth/register**: Registro de un nuevo usuario.
  - Body:
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

- **POST /api/v1/auth/login**: Inicio de sesión de usuario.
  - Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Usuarios

- **GET /api/v1/users**: Obtener todos los usuarios. (Requiere autenticación)
- **GET /api/v1/users/:id**: Obtener un usuario por ID. (Requiere autenticación)
- **PUT /api/v1/users/email/:email**: Actualizar un usuario por email. (Requiere autenticación)
  - Body (opcional, puede incluir uno o más de los siguientes campos):
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```

### Películas

- **GET /api/v1/movies/:id**: Obtener una película por ID.
- **POST /api/v1/movies**: Añadir una nueva película. (Requiere autenticación)
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

### Listas de Películas

- **POST /api/v1/watchlist**: Añadir una película a la lista de "por ver". (Requiere autenticación)
  - Body:
    ```json
    {
      "userId": "string",
      "id": "number"
    }
    ```

- **GET /api/v1/watchlist/:userId**: Obtener todas las películas de la lista de "por ver" de un usuario. (Requiere autenticación)

- **DELETE /api/v1/watchlist/:userId/:id**: Eliminar una película de la lista de "por ver". (Requiere autenticación)

- **POST /api/v1/watched**: Añadir una película a la lista de "vistas". (Requiere autenticación)
  - Body:
    ```json
    {
      "userId": "string",
      "id": "number"
    }
    ```

- **GET /api/v1/watched/:userId**: Obtener todas las películas de la lista de "vistas" de un usuario. (Requiere autenticación)

- **DELETE /api/v1/watched/:userId/:id**: Eliminar una película de la lista de "vistas". (Requiere autenticación)

- **POST /api/v1/favorites**: Añadir una película a la lista de "favoritos". (Requiere autenticación)
  - Body:
    ```json
    {
      "userId": "string",
      "id": "number"
    }
    ```

- **GET /api/v1/favorites/:userId**: Obtener todas las películas de la lista de "favoritos" de un usuario. (Requiere autenticación)

- **DELETE /api/v1/favorites/:userId/:id**: Eliminar una película de la lista de "favoritos". (Requiere autenticación)

## Tabla DER Base de Datos

![image](https://github.com/FacuMartinezVidal/movix-backend/assets/90455496/8925ca1f-631e-48a5-9176-6b6e9aec9ef8)

## Endpoints Disponibles en Postman
https://www.postman.com/find-your-guide/workspace/tpo-api

