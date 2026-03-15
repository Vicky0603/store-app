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

<img width="1913" height="787" alt="image" src="https://github.com/user-attachments/assets/8c32a636-429d-499f-9a14-822d5226b559" />
<img width="1490" height="877" alt="image" src="https://github.com/user-attachments/assets/92f4bf3c-1080-4962-bc34-e4916e7c3145" />



