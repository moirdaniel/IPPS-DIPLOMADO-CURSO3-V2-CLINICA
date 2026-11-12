# Evaluación 2 · API de clínica

Proyecto del Módulo 3 con Node.js, Express y MongoDB. Están completadas las **Partes 0, 1, 2 y 3**: arranque, modelos, autenticación, consultas de médicos y CRUD de pacientes con la regla del médico tratante.

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
- La respuesta del registro no se enviaba al cliente y el login quedaba sin responder. En la Parte 0 evitamos dejar las solicitudes esperando; en la Parte 2 completamos ambas rutas.
- Quitamos el secreto JWT del código y corregimos `.gitignore` para excluir `.env` e incluir `yarn.lock`.
- Windows rechazó el puerto 3001 con `EACCES`. Usamos el puerto libre 4100 y lo dejamos configurable con `PORT` en `.env`.

Comprobamos la conexión real a MongoDB, las respuestas HTTP indicadas abajo y el reinicio automático al guardar `server.js`. La revisión de dependencias con `yarn audit` no encontró vulnerabilidades.

Las respuestas de práctica de pacientes se reemplazaron por el CRUD en la Parte 3. `GET /pacientes` sin token responde 401.

## Parte 1: modelo Paciente

El modelo está en `models/paciente.model.js` y guarda los documentos en la colección `pacientes`:

| Campo | Regla |
| --- | --- |
| nombre | Obligatorio, sin espacios al principio ni al final |
| rut | Obligatorio y único en toda la colección |
| fechaNacimiento | Fecha obligatoria |
| prevision | Fonasa, Isapre o Particular; Fonasa por defecto |
| telefono | Opcional |
| email | Opcional, se guarda en minúsculas |
| medico | Id obligatorio que hace referencia al modelo Medico |

`timestamps` agrega `createdAt` y `updatedAt`. El paciente no tiene contraseña ni especialidad. Guarda el `_id` de su médico, sin copiar todos los datos del médico.

Comprobamos las validaciones y la relación en MongoDB con datos ficticios temporales, que se eliminaron al terminar. El RUT único se aplica mediante un índice de MongoDB; un duplicado produce el código 11000, que el servidor traduce a HTTP 409.

Las rutas de la Parte 3 asignan el médico desde el token. Al crear un paciente también comprobamos que el médico exista: definir `ref` en el modelo no hace esa comprobación por sí solo.

## Parte 2: registro, login y consultas de médicos

En Postman usa **Body → raw → JSON** para los POST. Las rutas de autenticación son públicas.

### Registrar un médico

**POST** `http://localhost:4100/auth/registro`:

```json
{
  "nombre": "Ana de Ejemplo",
  "especialidad": "Pediatría",
  "email": "ana@example.com",
  "password": "PracticaSegura123"
}
```

Responde **201** con `{ medico, token }`. No incluye password. Un email repetido responde **409** y datos faltantes o inválidos responden **400**. La contraseña debe tener al menos 6 caracteres (como indica el modelo original) y máximo 72 bytes.

### Iniciar sesión

**POST** `http://localhost:4100/auth/login`:

```json
{
  "email": "ana@example.com",
  "password": "PracticaSegura123"
}
```

Responde **200** con `{ medico, token }`. Si falta email o password responde **400**. Si el email no existe o la contraseña es incorrecta responde **401**. El token vence en dos horas.

### Consultar médicos con token

Copia el token y selecciona **Authorization → Bearer Token** en Postman. Pégalo sin comillas. Todas estas consultas usan GET y no llevan Body:

| URL | Respuesta |
| --- | --- |
| `http://localhost:4100/medicos` | 200, todos los médicos |
| `http://localhost:4100/medicos?especialidad=Pediatría` | 200, médicos de esa especialidad |
| `http://localhost:4100/medicos/perfil` | 200, el médico del token |
| `http://localhost:4100/medicos/ID_MEDICO` | 200, un médico por su `_id` |
| `http://localhost:4100/medicos/ID_MEDICO/pacientes` | 200, pacientes de ese médico |

Reemplaza `ID_MEDICO` por el `_id` recibido al registrar al médico. El filtro de especialidad usa el texto guardado, por ejemplo `Pediatría`.

Sin token o con un token inválido o vencido, responde **401**. Un id mal escrito, como `123`, responde **400**. Un id válido que no existe responde **404**. Un médico existente sin pacientes devuelve **200 con []**. Un filtro de especialidad sin resultados también devuelve **200 con []**.

`/perfil` se declara antes que `/:id` para que Express no interprete la palabra perfil como un identificador. Las rutas de médicos están protegidas juntas con `medicoRoutes.use(proteger)`.

El controlador recibe la solicitud y decide el estado HTTP; el servicio consulta los modelos. El modelo Medico conserva sus campos originales, transforma la contraseña antes de guardar y la quita de todas las respuestas mediante `toJSON`.

Verificamos 31 consultas HTTP con MongoDB local, incluidos duplicados, filtros, ids inválidos, listas vacías y tokens incorrectos o vencidos. También comprobamos que la contraseña se guarda como hash y no se vuelve a transformar al editar otro campo. Los datos ficticios de esas pruebas se eliminaron al terminar.

## Parte 3: CRUD de pacientes y médico tratante

Todas las rutas de pacientes necesitan **Authorization → Bearer Token**. Usa el token obtenido al registrar al médico o iniciar sesión.

### 1. Crear

**POST** `http://localhost:4100/pacientes`, Body → raw → JSON:

```json
{
  "nombre": "Paciente de ejemplo",
  "rut": "PACIENTE-PRUEBA-01",
  "fechaNacimiento": "2000-01-15",
  "prevision": "Fonasa",
  "telefono": "900000000",
  "email": "paciente@example.com"
}
```

Usa datos ficticios para practicar. El ejemplo de RUT es una etiqueta de prueba: el modelo exige texto obligatorio y único, no valida su dígito verificador.

Responde **201**. Copia su `_id` como `ID_PACIENTE`. El médico se toma del token: si envías `medico` en el body, se ignora. Sin previsión se guarda Fonasa. Un RUT repetido responde **409**, aunque el otro paciente pertenezca a otro médico. Campos requeridos ausentes o datos inválidos responden **400**.

### 2. Consultar

| Método | URL | Resultado |
| --- | --- | --- |
| GET | `http://localhost:4100/pacientes` | Solo los pacientes del médico conectado |
| GET | `http://localhost:4100/pacientes?prevision=Isapre` | Mis pacientes de Isapre |
| GET | `http://localhost:4100/pacientes/ID_PACIENTE` | Un paciente por su id, aunque su tratante sea otro médico |

Responden **200**. Una lista sin resultados devuelve **[]**. Un id mal escrito devuelve **400** y un paciente inexistente devuelve **404**.

### 3. Editar

**PUT** `http://localhost:4100/pacientes/ID_PACIENTE`, con el token del médico tratante:

```json
{
  "nombre": "Paciente actualizado",
  "prevision": "Isapre"
}
```

Responde **200** con el paciente actualizado. Puedes enviar solo los campos que quieres cambiar. Se vuelven a validar los datos con el modelo. No puedes cambiar el médico ni el `_id` mediante el body.

### 4. Probar la regla con otro médico

Registra un segundo médico con otro email y copia su token. Con ese token puedes consultar al paciente por id, pero **PUT** y **DELETE** sobre el paciente del primer médico devuelven **403**. El paciente queda intacto.

La comprobación está en `services/paciente.service.js`, en `comprobarTratante`: compara `paciente.medico.toString()` con el id del token. La misma regla se usa al editar y al eliminar. **401** significa token ausente o inválido; **403** significa que tienes token pero no eres el tratante.

### 5. Eliminar

**DELETE** `http://localhost:4100/pacientes/ID_PACIENTE`, con el token del tratante y sin Body. Elimina realmente el paciente de MongoDB. Responde **204 sin cuerpo**. Si luego lo consultas, responde **404**.

Probamos 45 consultas HTTP con dos médicos y pacientes ficticios. Comprobamos el CRUD, los filtros, las listas separadas por médico, la lectura compartida, los 403, la asignación del médico desde el token y que un intento de modificarlo mediante el body no tenga efecto. Los datos de prueba se eliminaron al terminar.

## Video

Pendiente de grabar al completar la evaluación.
