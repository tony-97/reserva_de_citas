-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "colegiatura" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '123456',
    "especialidadId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Medico_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Especialidad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Medico" ("colegiatura", "createdAt", "especialidadId", "estado", "id", "nombre") SELECT "colegiatura", "createdAt", "especialidadId", "estado", "id", "nombre" FROM "Medico";
DROP TABLE "Medico";
ALTER TABLE "new_Medico" RENAME TO "Medico";
CREATE UNIQUE INDEX "Medico_colegiatura_key" ON "Medico"("colegiatura");
CREATE TABLE "new_Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '123456',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Paciente" ("apellidos", "correo", "createdAt", "dni", "id", "nombres", "telefono") SELECT "apellidos", "correo", "createdAt", "dni", "id", "nombres", "telefono" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_dni_key" ON "Paciente"("dni");
CREATE UNIQUE INDEX "Paciente_correo_key" ON "Paciente"("correo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
