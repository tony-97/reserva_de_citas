# Guía de Instalación para el Equipo

## Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- Git

## Pasos de Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tony-97/reserva_de_citas.git
cd reserva_de_citas
```

### 2. Configurar el Backend

#### 2.1 Ir a la carpeta del backend
```bash
cd Hospital/Backend
```

#### 2.2 Instalar dependencias
```bash
npm install
```

#### 2.3 Crear archivo .env
Copia `.env.example` a `.env` en la carpeta `Hospital/Backend/` con el siguiente contenido:
```env
DATABASE_URL="file:./dev.db"
PORT=3001
JWT_SECRET="supersecretkey123"
```

#### 2.4 Generar cliente Prisma
```bash
npx prisma generate
```

#### 2.5 Crear la base de datos local y cargar datos de prueba
En este proyecto usamos **SQLite**, que guarda toda la base de datos en un archivo local (`dev.db`). Esto significa que no es necesario instalar un servidor de MySQL, PostgreSQL o SQL Server. Solo se necesita tener Node.js y Prisma.

```bash
npx prisma db push
npx prisma db seed
```

#### 2.6 Iniciar el backend
```bash
npm run dev
```
El backend estará corriendo en `http://localhost:3001`

> Nota: después de ejecutar `npm run seed`, se crea o actualiza el archivo `Hospital/Backend/prisma/dev.db`. Ese archivo es la base de datos local completa y debe estar presente para que el backend funcione correctamente.

### 3. Configurar el Frontend

#### 3.1 Abrir nueva terminal (mantener el backend corriendo)

#### 3.2 Ir a la carpeta del frontend
```bash
cd Hospital/Frontend
```

#### 3.3 Instalar dependencias
```bash
npm install
```

#### 3.4 Iniciar el frontend
```bash
npm run dev
```
El frontend estará corriendo en `http://localhost:5173`

## Credenciales de Prueba

### Paciente
- **DNI:** 12345678
- **Contraseña:** 123456
- **Nombre:** Carlos Mendoza

### Paciente 2
- **DNI:** 87654321
- **Contraseña:** 123456
- **Nombre:** Laura Quispe

### Médico
- **CMP:** 12345
- **Contraseña:** 123456
- **Nombre:** Dr. Juan Pérez

### Admin
- **Usuario:** admin@hospital.com
- **Contraseña:** admin123

## Cambios Recientes (última actualización)

- Admin: ahora el panel de administración incluye una pestaña "Citas" desde la cual se pueden confirmar citas manualmente.
- Médico: el panel médico tiene un selector "Hoy / Próximas" para alternar entre las citas del día y las próximas citas.
- SIS: las reservas de tipo `SIS` se marcan automáticamente como `confirmada` al crear la cita (cuando procede).
- Backend: la respuesta de login incluye el `dni` del usuario para evitar errores en el frontend.
- Nota de seguridad: si no se configura un hash de contraseña para el administrador, existe una contraseña por defecto en la guía: `admin123`. Recomendado cambiarla en producción usando variables de entorno.

## Persistencia de Datos

El sistema usa **SQLite** como base de datos. Los datos se guardan en el archivo:
- `Hospital/Backend/prisma/dev.db`

Este archivo contiene:
- Especialidades médicas
- Médicos registrados
- Pacientes registrados
- Citas médicas
- Pagos realizados

**Importante:** Si quieres compartir los datos con un colaborador, debes enviarle el archivo `dev.db` o ejecutar el comando `npm run seed` para cargar los datos de prueba.

## Funcionalidades del Sistema

### Para Pacientes
- Registro e inicio de sesión
- Reserva de citas médicas
- Selección de tipo de paciente (SIS/Demanda)
- Sistema de pagos para pacientes por demanda (S/ 80.00)
- Gestión de citas (ver, editar, cancelar)
- Descarga de comprobantes en PDF

### Para Médicos
- Ver citas programadas
- Agregar observaciones a citas
- Marcar inasistencias (No-Show)
- Ver historial clínico de pacientes

### Para Administradores
- Gestión de médicos (crear, editar, eliminar)
- Gestión de pacientes (crear, editar, eliminar)
- Gestión de especialidades (crear, eliminar)
- Ver estadísticas del sistema

## Solución de Problemas

### Error: "Database not found"
Ejecutar: `npx prisma db push`

### Error: "Cannot connect to backend"
Verificar que el backend esté corriendo en `http://localhost:3001`

### Error: "Module not found"
Ejecutar: `npm install` en las carpetas Backend y Frontend

## Estructura del Proyecto

```
reserva_de_citas/
├── Hospital/
│   ├── Backend/          # Servidor API (Express + Prisma + SQLite)
│   │   ├── prisma/
│   │   │   ├── dev.db    # Base de datos SQLite
│   │   │   └── seed.ts   # Datos de prueba
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   └── .env          # Configuración (crear manualmente)
│   └── Frontend/         # Aplicación React
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   └── hooks/
│       └── package.json
└── GUIA_EQUIPO.md     # Este documento
```

## Notas Importantes

- El backend debe estar corriendo siempre antes de iniciar el frontend
- Los datos persisten en el archivo `dev.db` (no se pierden al reiniciar el servidor)
- Para reiniciar los datos de prueba, ejecutar `npm run seed` en el backend
- El archivo `.env` NO debe subirse al repositorio (está en .gitignore)
