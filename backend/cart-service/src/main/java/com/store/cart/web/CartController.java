package com.store.cart.web;

import com.store.cart.model.Cart;
import com.store.cart.model.CartItem;
import com.store.cart.repo.CartRepository;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartRepository repo;
    public CartController(CartRepository repo) { this.repo = repo; }

    private Cart getOrCreate(String email) {
        return repo.findByUserEmail(email).orElseGet(() -> {
            Cart c = new Cart(); c.setUserEmail(email); return repo.save(c);
        });
    }

    @GetMapping
    public Cart getCart(@AuthenticationPrincipal(expression = "subject") String email) {
        return getOrCreate(email);
    }

    public record AddItemRequest(Long productId, String productName, String imageUrl, BigDecimal price, @Min(1) Integer quantity){}

    @PostMapping("/items")
    public Cart addItem(@AuthenticationPrincipal(expression = "subject") String email, @RequestBody AddItemRequest req) {
        Cart cart = getOrCreate(email);
        // si ya existe el producto en el carrito, sumar cantidad
        var existing = cart.getItems().stream().filter(i -> i.getProductId().equals(req.productId())).findFirst();
        if (existing.isPresent()) {
            var it = existing.get();
            it.setQuantity(Math.max(1, it.getQuantity() + req.quantity()));
        } else {
            var item = new CartItem();
            item.setCart(cart);
            item.setProductId(req.productId());
            item.setProductName(req.productName());
            item.setImageUrl(req.imageUrl());
            item.setPrice(req.price());
            item.setQuantity(Math.max(1, req.quantity()));
            cart.getItems().add(item);
        }
        return repo.save(cart);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Cart> updateQty(@AuthenticationPrincipal(expression = "subject") String email, @PathVariable Long itemId, @RequestBody Map<String, Integer> body) {
        Cart cart = getOrCreate(email);
        var opt = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst();
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        var item = opt.get();
        int q = body.getOrDefault("quantity", item.getQuantity());
        item.setQuantity(Math.max(1, q));
        return ResponseEntity.ok(repo.save(cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> remove(@AuthenticationPrincipal(expression = "subject") String email, @PathVariable Long itemId) {
        Cart cart = getOrCreate(email);
        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(itemId));
        if (!removed) return ResponseEntity.notFound().build();
        repo.save(cart);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<?> clear(@AuthenticationPrincipal(expression = "subject") String email) {
        Cart cart = getOrCreate(email);
        cart.getItems().clear();
        repo.save(cart);
        return ResponseEntity.noContent().build();
    }
}
