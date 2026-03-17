# coperex-interfer-api

API REST para la gestión de empresas participantes en la Feria Interfer de COPEREX. Desarrollada con Node.js, Express y PostgreSQL.

## Requisitos Previos

- Node.js (v16+)
- PostgreSQL (v12+)
- pnpm o npm

## Instalación

### 1. Crear la Base de Datos en PostgreSQL

```sql
CREATE DATABASE coperex_interfer;
```

O usando la línea de comandos:

```bash
createdb coperex_interfer
```

### 2. Configurar Variables de Entorno

Copiar el archivo `.env.example` a `.env` y completar los valores:

```bash
cp .env.example .env
```

Actualizar los valores en `.env`:
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `JWT_SECRET`: Generar una clave segura
- Otros parámetros según sea necesario

### 3. Instalar Dependencias

```bash
pnpm install
```

### 5. Ejecutar la Aplicación

**Desarrollo:**
```bash
pnpm run dev
```

**Producción:**
```bash
pnpm start
```

La API estará disponible en `http://localhost:3006`

## Documentación API

La documentación Swagger está disponible en: `http://localhost:3006/api-docs`

## Estructura del Proyecto

```
├── src/              # Código fuente (routes, controllers, models)
├── configs/          # Configuraciones (BD, CORS, Helmet, etc.)
├── middlewares/      # Middlewares personalizados
├── helpers/          # Funciones auxiliares
├── utils/            # Utilidades
├── data/             # Seeder y datos iniciales
├── index.js          # Punto de entrada
└── package.json      # Dependencias del proyecto
```
