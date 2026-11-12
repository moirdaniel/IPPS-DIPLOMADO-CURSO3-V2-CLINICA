# Evaluación 2 · API de clínica

Proyecto del Módulo 3 con Node.js, Express y MongoDB. Está completada la **Parte 0: arranque y configuración**. El modelo Paciente y las APIs completas de médicos y pacientes se completarán en las partes siguientes.

## Iniciar

Requiere Node.js 20.13 o superior, Yarn Classic y una conexión a MongoDB.

1. Abre una terminal en la carpeta del proyecto y ejecuta `yarn`.
2. Copia `.env.example` a `.env` y coloca tu conexión en `MONGODB_URI`.
3. Reemplaza `JWT_SECRET` por una clave aleatoria privada de al menos 32 caracteres.
4. Ejecuta `yarn dev`.

La API queda en **http://localhost:4100**. La terminal muestra `Conectado a la bd` y la dirección del servidor. Al guardar un cambio, `--watch` reinicia el programa. Para detenerlo, presiona Ctrl + C.

Para MongoDB local puedes usar en `.env`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/evaluacion2_clinica
```

Si Yarn no está disponible, usa `npx.cmd --yes yarn@1.22.22 install` y `npx.cmd --yes yarn@1.22.22 dev`.

`.env` y `node_modules` no se suben a GitHub. `.env.example` y `yarn.lock` sí se incluyen.

## Correcciones de la Parte 0

- `yarn dev` fallaba porque no existía el script: agregamos `dev`, `--watch`, `--env-file` y `type: module`.
- El import de la conexión no empezaba por `./` y el del router de autenticación apuntaba a un nombre incorrecto.
- Faltaba `.js` en el import del middleware y faltaba exportar `authRoutes`.
- La conexión tenía una dirección vacía y `consolelog` estaba mal escrito: ahora lee `.env` y usa `console.log`.
- Faltaba importar bcrypt en el modelo de médico. Los borradores de paciente y ficha no importaban Mongoose ni exportaban sus modelos; ficha tenía una línea suelta que no era código válido.
- La respuesta del registro no se enviaba al cliente y el login quedaba sin responder. Ahora el registro responde y el login avisa con 501 que se completará en la Parte 2.
- Quitamos el secreto JWT del código y corregimos `.gitignore` para excluir `.env` e incluir `yarn.lock`.
- Windows rechazó el puerto 3001 con `EACCES`. Usamos el puerto libre 4100 y lo dejamos configurable con `PORT` en `.env`.

Comprobamos la conexión real a MongoDB, las respuestas HTTP indicadas abajo y el reinicio automático al guardar `server.js`. La revisión de dependencias con `yarn audit` no encontró vulnerabilidades.

Las rutas de pacientes conservan las respuestas de práctica del repositorio original. No son todavía el CRUD de la Parte 3. `GET /pacientes` sin token debe responder 401: sirve para comprobar que el servidor responde y la protección sigue activa.

## Video

Pendiente de grabar al completar la evaluación.
