# Aplicacion SIGPRA

Aplicacion web funcional tipo MVP para el producto final de SIGPRA.
Incluye frontend web y backend API REST con Node.js, Express, TypeScript y organizacion MVC.

## Como abrir

### Opcion recomendada con API

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://localhost:3000
```

### Opcion local de respaldo

Ejecutar `npm install` una vez y abrir `index.html` en el navegador. En este modo la aplicacion funciona con `localStorage`, sin servidor.

## Bootstrap y Tailwind CSS

### Bootstrap 5.3.8
La base visual principal utiliza Bootstrap 5.3.8, cargado desde `node_modules/bootstrap/dist`. Los botones, campos de formulario, modales, tablas y componentes estructurales aprovechan las clases nativas de Bootstrap.

### Tailwind CSS (Modo convivencia con prefijo `tw-`)
Para enriquecer la interfaz y permitir diseño moderno sin interferir con las clases de Bootstrap, se integra Tailwind CSS mediante CDN con configuración adaptada:
- **Prefijo `tw-`**: todas las utilidades de Tailwind se usan con `tw-` (ej. `tw-shadow-xl`, `tw-rounded-2xl`, `tw-transition-all`, `tw-flex`, `tw-gap-4`, `hover:tw-scale-105`).
- **`preflight: false`**: desactiva el reseteo de estilos base de Tailwind para garantizar que Bootstrap y `styles.css` mantengan su apariencia intacta.

## Backend MVC

La capa backend se encuentra en `src/`:

| Carpeta | Responsabilidad |
| --- | --- |
| `src/controllers` | Recibe peticiones HTTP y responde JSON. |
| `src/services` | Ejecuta reglas de negocio de autenticacion, periodos, convenios, asignaciones y reportes. |
| `src/models` | Define tipos TypeScript, datos demo y persistencia JSON local. |
| `src/routes` | Agrupa las rutas REST expuestas por Express. |

## APIs implementadas

| API | Metodo | Uso en la aplicacion |
| --- | --- | --- |
| `/api/health` | GET | Verifica conexion del frontend con Express. |
| `/api/state` | GET | Carga el estado inicial desde el backend. |
| `/api/state` | PUT | Sincroniza cambios realizados en la interfaz. |
| `/api/auth/login` | POST | Valida inicio de sesion por rol. |
| `/api/periods` | GET/POST | Expone periodos de practica. |
| `/api/agreements` | GET/POST | Expone instituciones, convenios y plazas. |
| `/api/assignments` | GET/POST | Expone asignaciones de practicantes. |
| `/api/reports/consolidated` | GET | Entrega consolidado de practicas. |

## Usuarios de prueba

| Rol | Correo | Clave |
| --- | --- | --- |
| Coordinador | coordinador@udi.edu.co | 123456 |
| Estudiante | estudiante@udi.edu.co | 123456 |
| Estudiante | sofia@udi.edu.co | 123456 |
| Estudiante | daniel@udi.edu.co | 123456 |
| Estudiante | valentina@udi.edu.co | 123456 |
| Docente asesor | docente@udi.edu.co | 123456 |
| Director | director@udi.edu.co | 123456 |

## Funcionalidades incluidas

- Inicio de sesion por rol.
- Navegacion agrupada por etapa y accesos directos a los modulos disponibles para cada rol, con resumen de tareas y registros.
- Formularios operativos organizados en etapas guiadas que se habilitan al completar la etapa anterior.
- **Programacion de periodos:** crear periodos como borrador o publicarlos tras validar fechas, horas minimas y pesos de evaluacion.
- **Gestion de convenios y plazas:** registrar instituciones, convenios y plazas; convenios sin documento o fuera de vigencia quedan inactivos.
- **Asignacion de practicantes:** asignar estudiantes a plazas vigentes y docentes con disponibilidad mediante un flujo guiado de cuatro pasos, con control de cupos, resumen previo y reasignacion con historial.
- Datos de demostracion: cinco estudiantes y cinco plazas disponibles para practicar el flujo de asignacion.
- **Registro de actividades:** registrar, guardar como borrador, corregir y reenviar actividades; valida fechas, horas y referencias de soportes.
- **Validacion de actividades:** aprobar, devolver o rechazar actividades; la aprobacion exige confirmar la revision de soportes.
- **Visitas de seguimiento:** registrar visitas, asistencia y puntajes para todos los criterios de la rubrica del periodo.
- **Consolidado y reportes:** consultar consolidado con filtros por periodo, programa, institucion y docente; exportar CSV o imprimir/guardar como PDF desde el navegador.
- Registro de evidencias como metadatos.
- Exportacion de datos en JSON.
- Consumo de APIs Express para carga, login, periodos, convenios, asignaciones y sincronizacion.
- Persistencia local en navegador con `localStorage` como respaldo.

## Alcance tecnico

Esta version funciona con un backend API REST en Node.js/Express/TypeScript y tambien conserva modo local de respaldo para demostracion inmediata. Los datos se sincronizan contra una persistencia JSON local del servidor; los archivos binarios y las notificaciones no se envian a terceros. Por seguridad, el selector "Ver como" fue retirado del panel lateral para que cada sesion mantenga estrictamente la identidad y permisos del usuario autenticado; para cambiar de rol o usuario se debe cerrar sesion e ingresar desde el menu de inicio. Para produccion, el siguiente paso es reemplazar la persistencia JSON por PostgreSQL, MongoDB y almacenamiento de archivos, usando los scripts incluidos en `Base_de_datos_SIGPRA`.

## Novedades de Interfaz y Acceso
- **Diseño split de 2 columnas en el inicio**: Tarjeta amplia con imagen institucional en el lateral izquierdo (`login-photo.jpg`) y formulario en el lateral derecho.
- **Selector de usuario en lista (`<select>`)**: Sustitución de los botones de acceso por una lista desplegable agrupada por roles (Coordinación, Dirección de Programa, Docentes Asesores y Estudiantes) para seleccionar con qué usuario ingresar. Al seleccionar un usuario se actualizan automáticamente sus credenciales y previsualización.
- **Tamaño de tipografía optimizado a 12px**: Interfaz compacta y estilizada en el menú de inicio.
- **Mayor seguridad**: Eliminación del cambio arbitrario de roles en caliente desde la barra lateral.
