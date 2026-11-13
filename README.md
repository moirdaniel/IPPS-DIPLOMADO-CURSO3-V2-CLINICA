# Evaluación 2 · API de clínica

Daniel Moir · Diplomado, Módulo 3: Backend y APIs REST.

API desarrollada con Node.js, Express y MongoDB. Incluye registro y login de médicos con JWT, consultas de médicos y CRUD de pacientes. Solo el médico tratante puede editar o eliminar a su paciente.

## Cómo ejecutar

Requisitos: Node.js 20.19 o superior, Yarn Classic y MongoDB local o Atlas.

1. Desde la carpeta del proyecto, instala las dependencias:

```bash
yarn
```

2. Copia `.env.example` a `.env`. En PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Edita `.env`: coloca tu conexión en `MONGODB_URI`, reemplaza `JWT_SECRET` por una clave aleatoria privada de al menos 32 caracteres y conserva `PORT=4100`.

Para MongoDB local, puedes usar esta conexión:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/evaluacion2_clinica
```

4. Con MongoDB disponible, inicia el servidor:

```bash
yarn dev
```

La API queda en **http://localhost:4100**. El servidor se reinicia al guardar cambios. Para detenerlo, presiona **Ctrl + C**.

`.env` y `node_modules` no se incluyen en el repositorio. `.env.example` y `yarn.lock` sí se incluyen.

## Video de presentación

[![Evaluación 2 · API de clínica — Daniel Moir](https://img.youtube.com/vi/H3VgA4raEYg/hqdefault.jpg)](https://www.youtube.com/watch?v=H3VgA4raEYg)

[Ver demostración en YouTube](https://www.youtube.com/watch?v=H3VgA4raEYg)
