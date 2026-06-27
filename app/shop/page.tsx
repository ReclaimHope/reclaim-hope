'use client';

import React, { useState } from 'react';
import ShopHero from '../../components/ShopHero';
import ShopCategoriesFilters from '../../components/ShopCategoriesFilters';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
};

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Handwoven Basket',
    category: 'Home Decor & Living',
    price: 18.0,
    image: '/basket.jpg',
    description: 'A beautiful handmade basket woven by a parent in our program.'
  },
  {
    id: 'p2',
    title: 'Beaded Bracelet',
    category: 'Fashion & Accessories',
    price: 12.0,
    image: '/bracelet.jpg',
    description: 'Colorful beaded bracelet crafted with care.'
  },
  {
    id: 'p3',
    title: 'Hand-stitched Tote',
    category: 'Apparel & Clothing',
    price: 25.0,
    image: '/tote.jpg',
    description: 'Durable tote bag sewn by a local artisan parent.'
  },
  {
    id: 'p4',
    title: 'Scented Soap Set',
    category: 'Bath, Body & Wellness',
    price: 14.0,
    image: '/soap.jpg',
    description: 'Naturally scented soap bars made with gentle, nourishing ingredients.'
  },
  {
    id: 'p5',
    title: 'Made in Rwanda white dress',
    category: 'Apparel & Clothing',
    price: 22.0,
    image: '/white-dress.JPG',
    description: 'Elegant white dress made in Rwanda with traditional craftsmanship.'
  },
  {
    id: 'p6',
    title: 'Umugongo patterns dress',
    category: 'Apparel & Clothing',
    price: 22.0,
    image: '/umugongo.JPG',
    description: 'Colorful dress featuring traditional Umugongo patterns made in Rwanda.'
  },
];

export default function ShopPage() {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const filteredProducts =
    activeCategory === 'All Categories'
      ? products
      : products.filter((product) => product.category === activeCategory);

  function handleBuy(p: Product) {
    setSelected(p);
    setOpen(true);
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <ShopHero />
      <ShopCategoriesFilters activeCategory={activeCategory} onChange={setActiveCategory} />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-500">Our Products</h2>
        <p className="mb-8 text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} for “{activeCategory}”.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onBuy={handleBuy} />
          ))}
        </div>
      </section>

      <ProductModal open={open} product={selected} onClose={() => setOpen(false)} />
    </main>
  );
}
