
import React from 'react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductDetailClient } from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  
  const product = await api.product(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient key={product.id} product={product} />;
}
