package com.store.order.web;

import com.store.order.model.Order;
import com.store.order.model.OrderItem;
import com.store.order.repo.OrderRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository repo;
    public OrderController(OrderRepository repo) { this.repo = repo; }

    public static class ConfirmRequest {
        public String overrideShippingAddress; // opcional
        @NotNull public List<Item> items;
    }
    public static class Item {
        @NotNull public Long productId;
        @NotBlank public String productName;
        public String imageUrl;
        @NotNull public BigDecimal price;
        @NotNull public Integer quantity;
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ConfirmRequest req) {
        var o = new Order();
        o.setOrderNumber(UUID.randomUUID().toString().substring(0,8).toUpperCase());
        o.setUserEmail(jwt.getSubject());
        o.setShippingAddress(req.overrideShippingAddress); // si null, frontend debe enviar dirección del perfil
        BigDecimal total = BigDecimal.ZERO;
        for (var it : req.items) {
            var oi = new OrderItem();
            oi.setOrder(o);
            oi.setProductId(it.productId);
            oi.setProductName(it.productName);
            oi.setImageUrl(it.imageUrl);
            oi.setPrice(it.price);
            oi.setQuantity(it.quantity);
            o.getItems().add(oi);
            total = total.add(it.price.multiply(BigDecimal.valueOf(it.quantity)));
        }
        o.setTotal(total);
        var saved = repo.save(o);
        return ResponseEntity.ok(Map.of("orderId", saved.getId(), "orderNumber", saved.getOrderNumber(), "total", saved.getTotal()));
    }

    @GetMapping
    public List<Order> list(@AuthenticationPrincipal Jwt jwt) {
        return repo.findByUserEmailOrderByCreatedAtDesc(jwt.getSubject());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> get(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return repo.findById(id).filter(o -> o.getUserEmail().equals(jwt.getSubject()))
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
