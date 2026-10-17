'use client';

import Image from "next/image";
import React, { useState } from 'react';

type Product = {
  id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
};

export default function ProductModal({ open, product, onClose }: { open: boolean; product?: Product | null; onClose: () => void; }) {
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1');

  if (!open || !product) return null;

  const total = (product.price * quantity).toFixed(2);
  const parsedQuantity = Number(quantityInput);
  const isQuantityValid =
    quantityInput.trim() !== '' && !Number.isNaN(parsedQuantity) && parsedQuantity >= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
          <div className="relative h-64 bg-gray-100 flex items-center justify-center rounded">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover h-full w-full"
                sizes="100vw"
              />
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>

          <div>
            <h2 className="text-2xl text-gray-700 font-bold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <label className="font-semibold text-gray-700">Quantity</label>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={quantityInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantityInput(value);

                  if (value === '') {
                    return;
                  }

                  const parsed = Number(value);
                  if (!Number.isNaN(parsed) && parsed >= 1) {
                    setQuantity(parsed);
                  } else {
                    setQuantity(1);
                  }
                }}
                onBlur={() => {
                  const parsed = Number(quantityInput);
                  if (quantityInput.trim() === '' || Number.isNaN(parsed) || parsed < 1) {
                    setQuantity(1);
                    setQuantityInput('1');
                  } else {
                    const normalized = Math.floor(parsed);
                    setQuantity(normalized);
                    setQuantityInput(String(normalized));
                  }
                }}
                className="w-20 border rounded px-2 py-1 text-gray-700"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-lg text-gray-700">Total: <span className="font-bold">${total}</span></div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-gray-700 cursor-pointer">Cancel</button>
                <button
                  type="button"
                  onClick={(e) => {
                    if (!isQuantityValid) {
                      e.preventDefault();
                      alert('Please enter a quantity of 1 or more.');
                      return;
                    }

                    const purchaseQuantity = Math.floor(parsedQuantity);
                    setQuantity(purchaseQuantity);
                    setQuantityInput(String(purchaseQuantity));

                    const purchaseTotal = (product.price * purchaseQuantity).toFixed(2);
                    console.log('Purchasing', { product, quantity: purchaseQuantity });
                    alert(`Thank you! Purchased ${purchaseQuantity} × ${product.title} — $${purchaseTotal}`);
                    onClose();
                  }}
                  disabled={!isQuantityValid}
                  className={`bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg ${!isQuantityValid ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                >
                  Buy ${total}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
