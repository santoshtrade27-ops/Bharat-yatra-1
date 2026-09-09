import { useSyncExternalStore } from "react";

const CART_KEY = "by-cart";
const ORDERS_KEY = "by-orders";

function load() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

let state = load();
const listeners = new Set();
function emit() {
  localStorage.setItem(CART_KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function addToCart(product) {
  const existing = state.find((i) => i.name === product.name);
  if (existing) {
    state = state.map((i) =>
      i.name === product.name ? { ...i, qty: i.qty + 1 } : i
    );
  } else {
    state = [
      ...state,
      {
        name: product.name,
        image: product.image,
        price: product.price,
        origin: product.origin,
        qty: 1,
      },
    ];
  }
  emit();
  window.dispatchEvent(new CustomEvent("cart-open"));
}

export function removeFromCart(name) {
  state = state.filter((i) => i.name !== name);
  emit();
}

export function setQty(name, qty) {
  state = state.map((i) =>
    i.name === name ? { ...i, qty: Math.max(1, qty) } : i
  );
  emit();
}

export function clearCart() {
  state = [];
  emit();
}

export function checkout(info) {
  const total = state.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: "ORD" + Date.now(),
    items: state,
    total,
    date: new Date().toISOString(),
    ...info,
  };
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  clearCart();
  return order;
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return state;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    checkout,
  };
}