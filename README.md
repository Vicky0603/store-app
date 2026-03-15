# store-app

Aplicación tipo carrito de compras con frontend React y backend de microservicios en Spring Boot. Incluye servicios de Usuarios (JWT), Catálogo, Carrito y Órdenes, con base de datos MySQL/MariaDB.

Estructura del repo:
- `frontend/`: ReactJS responsive (React Router, Axios)
- `backend/user-service/`: Registro, login, perfil, recuperación de password (JWT)
- `backend/catalog-service/`: Catálogo fijo con CRUD y búsqueda
- `backend/cart-service/`: Gestión de carritos por usuario
- `backend/order-service/`: Confirmación de pedidos y consulta de órdenes

Requisitos funcionales cubiertos:
- Registro/login, validación email y mayoría de edad
- Perfil y actualización de datos
- Recuperación de contraseña (token de reset)
- Búsqueda de artículos e imágenes
- Carrito por usuario con resumen y eliminación
- Confirmación de pedido mostrando dirección de envío y opción de editar
- Número de orden generado y consulta de órdenes con estado

Autenticación y seguridad:
- JWT emitido por `user-service` y validado por los demás microservicios con una clave compartida.

Base de datos:
- MySQL/MariaDB (variables de entorno y `application.properties` por servicio)

Cómo ejecutar (resumen):
1) Configurar una BD por servicio (o una única BD con distintos esquemas) y variables en cada `application.properties`.
   - Puede usar `db/create_dbs.sql` para crear las BDs.
   - Establecer la misma `security.jwt.secret` en todos los servicios.
2) Construir cada microservicio con Maven y levantar en puertos distintos:
   - `cd backend/user-service && mvn spring-boot:run`
   - `cd backend/catalog-service && mvn spring-boot:run`
   - `cd backend/cart-service && mvn spring-boot:run`
   - `cd backend/order-service && mvn spring-boot:run`
3) Frontend:
   - `cd frontend`
   - Copiar `.env.example` a `.env` y ajustar URLs si es necesario
   - `npm install`
   - `npm run dev` y abrir `http://localhost:5173`

Ramas:
- Cree la rama `APP-{Nombre}` y empuje el código a un repositorio GitLab público para la demo.

**Mejoras y Detalles Implementados**
- Backend robusto
  - Seguridad JWT: `user-service` emite tokens; `catalog/cart/order` validan con OAuth2 Resource Server (NimbusJwtDecoder) y CORS habilitado.
  - Java 17: configuración del compilador y plugin de Spring Boot fijados en todos los servicios.
  - Manejo de errores: `@ControllerAdvice` con respuestas 400 legibles y validaciones por `jakarta.validation`.
  - Cart/Order leen el sujeto del JWT (email) de forma nativa (`@AuthenticationPrincipal Jwt`).
  - Catálogo con imágenes deportivas reales (Unsplash) y datos semilla ampliados.
- Pruebas unitarias
  - Lógica de registro/validaciones, búsqueda de catálogo, carrito (agregar/actualizar/eliminar) y confirmación de orden.
  - Ubicación: `backend/*-service/src/test/...`
- Frontend profesional y responsive
  - Design system ligero: `Button`, `FormField`, `Spinner` y variables CSS.
  - Toaster global (`ToastProvider`) con tipos: success/error/info/warn.
  - Validaciones en cliente: registro (email, contraseña, 18+), login (email requerido), perfil (requeridos), checkout (dirección requerida).
  - Carga agradable: skeleton loaders en Catálogo y Órdenes.
  - Experiencia de carrito
    - `CartContext`: estado centralizado del carrito con métodos `load/addItem/updateQty/removeItem/clear`.
    - Conteo en Navbar con badge; feedback "Agregado" y toasts.
    - Carrito invitado (guest): persiste en `localStorage` sin autenticación y se fusiona al iniciar sesión.
    - Auto-sync en login/logout (evento `auth-changed`).
  - Catálogo
    - Búsqueda con debounce y botón limpiar (X).
    - Botón deshabilitado cuando el producto está agotado.
  - Modo oscuro: toggle en Navbar con persistencia.

**Endpoints principales (resumen)**
- User: `/api/auth/register|login|password/reset/*`, `/api/profile` (GET/PUT)
- Catalog: `/api/products[?q=]`, CRUD protegido para administración
- Cart: `/api/cart`, `/api/cart/items` (POST/PUT/DELETE)
- Order: `/api/orders/confirm`, `/api/orders`, `/api/orders/{id}`

**Notas de ejecución (Windows PowerShell)**
- Si usa MySQL local: cree BDs con `db/create_dbs.sql` (ver instrucciones en secciones anteriores). Ajuste `spring.datasource.*` y `security.jwt.secret`.
- Si aparece error CORS: verifique que el origen sea `http://localhost:5173` y reinicie servicios tras cambios.
