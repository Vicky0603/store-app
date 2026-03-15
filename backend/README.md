# Backend microservices

Puertos por servicio:
- user-service: 8081
- catalog-service: 8082
- cart-service: 8083
- order-service: 8084

Variables de entorno/`application.properties` relevantes:
- `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`
- `security.jwt.secret` (usar una clave fuerte y la misma en todos los servicios)

Comandos Maven por servicio:
- `mvn spring-boot:run`

Endpoints principales
- User Service
  - POST `/api/auth/register` (firstName, lastName, shippingAddress, email, dateOfBirth, password)
  - POST `/api/auth/login` (email, password) -> `{ token }`
  - POST `/api/auth/password/reset/init` (email) -> `{ resetToken }`
  - POST `/api/auth/password/reset/complete` (token, newPassword)
  - GET `/api/profile` (JWT)
  - PUT `/api/profile` (JWT)
- Catalog Service
  - GET `/api/products?q=texto`
  - GET `/api/products/{id}`
  - POST `/api/products` (JWT)
  - PUT `/api/products/{id}` (JWT)
  - DELETE `/api/products/{id}` (JWT)
- Cart Service (JWT)
  - GET `/api/cart`
  - POST `/api/cart/items` ({ productId, productName, imageUrl, price, quantity })
  - PUT `/api/cart/items/{itemId}` ({ quantity })
  - DELETE `/api/cart/items/{itemId}`
  - DELETE `/api/cart` (limpiar)
- Order Service (JWT)
  - POST `/api/orders/confirm` ({ overrideShippingAddress?, items[] }) -> `{ orderId, orderNumber, total }`
  - GET `/api/orders`
  - GET `/api/orders/{id}`

Notas
- Catálogo inicial poblado con `data.sql` en `catalog-service`.
- Los servicios (excepto user GETs públicos) requieren JWT en `Authorization: Bearer <token>`.
