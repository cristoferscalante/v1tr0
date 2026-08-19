"use client";

import { useSyncExternalStore } from "react";
import type { Product } from "../products/ProductCard";

/**
 * Estado compartido del buscador de la tienda.
 *
 * El buscador vive en el header (fuera del árbol de la tienda) pero filtra la
 * grilla de productos, así que ambos se sincronizan por este store externo en
 * lugar de un contexto de React.
 */
type ShopSearchState = {
  products: Product[];
  query: string;
};

let state: ShopSearchState = { products: [], query: "" };
const listeners = new Set<() => void>();

const emit = () => { listeners.forEach((listener) => listener()) };

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener) };
};

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export const setShopSearchQuery = (query: string) => {
  if (state.query === query) { return }
  state = { ...state, query };
  emit();
};

export const setShopSearchProducts = (products: Product[]) => {
  if (state.products === products) { return }
  state = { ...state, products };
  emit();
};

/** Limpia el registro al desmontar la tienda para que el header oculte la lupa. */
export const clearShopSearch = () => {
  state = { products: [], query: "" };
  emit();
};

export const useShopSearch = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
