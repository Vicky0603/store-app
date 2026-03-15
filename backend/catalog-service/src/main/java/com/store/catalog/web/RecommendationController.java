package com.store.catalog.web;

import com.store.catalog.model.Product;
import com.store.catalog.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class RecommendationController {
    private final RecommendationService service;
    public RecommendationController(RecommendationService service){ this.service = service; }

    @GetMapping("/{id}/related")
    public List<Product> related(@PathVariable Long id, @RequestParam(defaultValue = "3") int limit){
        return service.related(id, Math.max(1, Math.min(limit, 10)));
    }
}

