package com.store.catalog.service;

import com.store.catalog.model.Product;
import com.store.catalog.repo.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private final ProductRepository repo;

    public RecommendationService(ProductRepository repo) { this.repo = repo; }

    public List<Product> related(Long productId, int limit){
        List<Product> all = repo.findAll();
        Optional<Product> baseOpt = repo.findById(productId);
        if (all.isEmpty() || baseOpt.isEmpty()) return List.of();
        Product base = baseOpt.get();
        Map<String, Integer> baseVec = vectorize(base);
        return all.stream()
                .filter(p -> !Objects.equals(p.getId(), productId))
                .sorted(Comparator.comparing((Product p) -> -similarity(baseVec, vectorize(p))))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private Map<String,Integer> vectorize(Product p){
        String text = String.join(" ",
                safe(p.getName()), safe(p.getDescription())
        ).toLowerCase(Locale.ROOT);
        String[] tokens = text.replaceAll("[^a-z0-9 ]", " ").split("\\s+");
        Map<String,Integer> freq = new HashMap<>();
        for (String t : tokens){ if (t.isBlank()) continue; freq.put(t, freq.getOrDefault(t, 0)+1);} 
        return freq;
    }

    private String safe(String s){ return s == null ? "" : s; }

    private double similarity(Map<String,Integer> a, Map<String,Integer> b){
        Set<String> vocab = new HashSet<>(a.keySet());
        vocab.addAll(b.keySet());
        double dot=0, na=0, nb=0;
        for (String t : vocab){
            int va = a.getOrDefault(t,0); int vb = b.getOrDefault(t,0);
            dot += va*vb; na += va*va; nb += vb*vb;
        }
        if (na == 0 || nb == 0) return 0.0;
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }
}

