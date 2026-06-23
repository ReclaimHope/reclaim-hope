'use client';

import React from 'react';

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
};

export default function ProductCard({ product, onBuy }: { product: Product; onBuy: (p: Product) => void; }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="h-48 bg-gray-800 flex items-center justify-center">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.title} className="object-cover h-full w-full" />
        ) : (
          <div className="text-gray-800">No image</div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
        <p className="text-sm text-gray-800 flex-1 mt-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="font-bold text-lg text-2xl text-gray-800">${product.price.toFixed(2)}</div>
          <button
            onClick={() => onBuy(product)}
            className="bg-[#001f3f] hover:bg-[#003366] cursor-pointer text-white px-4 py-2 rounded-lg font-semibold"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
