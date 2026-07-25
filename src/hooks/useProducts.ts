'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import { api } from '@/lib/api';

let cachedProducts: Product[] | null = null;
let cachedError: string | null = null;
let fetchPromise: Promise<void> | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);
  const [isLoading, setIsLoading] = useState(!cachedProducts && !cachedError);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    if (cachedProducts || cachedError) return;
    let active = true;

    if (!fetchPromise) {
      fetchPromise = api.products()
        .then(data => { cachedProducts = data; })
        .catch(err => { cachedError = err instanceof Error ? err.message : 'Không tải được sản phẩm'; });
    }

    fetchPromise.then(() => {
      if (active) {
        if (cachedProducts) setProducts(cachedProducts);
        if (cachedError) setError(cachedError);
        setIsLoading(false);
      }
    });

    return () => { active = false; };
  }, []);

  return { products, isLoading, error };
}
