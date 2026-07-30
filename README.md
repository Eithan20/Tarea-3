# Gestor de Tareas — Proyecto CRUD (Tarea 3, Programación III)

API REST + panel web sencillo para gestionar tareas y categorías, construida con
Node.js y Express, almacenando los datos en memoria (sin base de datos) para
simplificar la ejecución del proyecto.

Este repositorio fue desarrollado aplicando la metodología **Git Flow**, con
ramas `main`, `dev`, `qa`, ramas `feature/*` para nuevas funcionalidades y una
rama `hotfix/*` para la corrección de un error detectado en producción.

## Cómo ejecutar el proyecto

```bash
npm install
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## Endpoints principales

| Método | Ruta              | Descripción                         |
|--------|-------------------|--------------------------------------|
| GET    | /api/health       | Estado del servicio                  |
| POST   | /api/login        | Autenticación simulada               |
| GET    | /api/tasks        | Listar tareas                        |
| POST   | /api/tasks        | Crear tarea                          |
| PUT    | /api/tasks/:id    | Actualizar tarea                     |
| DELETE | /api/tasks/:id    | Eliminar tarea                       |
| GET    | /api/categories   | Listar categorías                    |
| POST   | /api/categories   | Crear categoría (con validación)     |

## Ramas del proyecto (Git Flow)

- `main` — código estable/producción
- `dev` — integración de nuevas funcionalidades
- `qa` — control de calidad previo a producción
- `feature/task-api-integration` — CRUD de tareas
- `feature/login-form` — autenticación simulada
- `feature/validate-user-input` — validación de datos de entrada
- `feature/user-dashboard` — panel web (frontend)
- `hotfix/fix-date-format` — corrección de formato de fecha en `/api/health`
