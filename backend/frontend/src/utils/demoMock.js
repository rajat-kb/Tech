/**
 * Demo mode: when enabled, all /api/v1 requests return dummy data so the app
 * works without a backend (e.g. for demos when MongoDB/backend is down).
 * Enable by setting REACT_APP_DEMO_MODE=true in .env or .env.local
 */

import headphoneImg from "../assets/headphone.png";
import watchImg from "../assets/watch.png";
import powerBankImg from "../assets/power-bank.png";
import keyboardImg from "../assets/black-keyboard.png";
import profileImg from "../assets/profile.png";

export const isDemoMode = () =>
  process.env.REACT_APP_DEMO_MODE === "true" || process.env.REACT_APP_DEMO_MODE === "1";

const DEMO_USER = {
  _id: "demo-user-1",
  name: "Demo User",
  email: "demo@example.com",
  avatar: { url: profileImg },
  role: "admin",
};

const DEMO_PRODUCTS = [
  {
    _id: "demo-product-1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality sound, 20hr battery, comfortable fit.",
    price: 2499,
    ratings: 4.5,
    images: [{ url: headphoneImg }],
    category: "Electronics",
    Stock: 50,
    numOfReviews: 24,
  },
  {
    _id: "demo-product-2",
    name: "Smart Watch Pro",
    description: "Fitness tracking, heart rate, 7-day battery.",
    price: 4999,
    ratings: 4.8,
    images: [{ url: watchImg }],
    category: "Electronics",
    Stock: 30,
    numOfReviews: 18,
  },
  {
    _id: "demo-product-3",
    name: "Portable Power Bank 20000mAh",
    description: "Fast charging, dual USB, compact design.",
    price: 1299,
    ratings: 4.2,
    images: [{ url: powerBankImg }],
    category: "Accessories",
    Stock: 100,
    numOfReviews: 42,
  },
  {
    _id: "demo-product-4",
    name: "Mechanical Keyboard RGB",
    description: "Cherry MX switches, programmable keys.",
    price: 5999,
    ratings: 4.7,
    images: [{ url: keyboardImg }],
    category: "Electronics",
    Stock: 25,
    numOfReviews: 31,
  },
];

const DEMO_ORDERS = [
  {
    _id: "demo-order-1",
    orderItems: [
      { name: DEMO_PRODUCTS[0].name, quantity: 1, price: DEMO_PRODUCTS[0].price, image: DEMO_PRODUCTS[0].images[0].url },
    ],
    shippingInfo: {
      address: "123 Demo Street",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      country: "India",
      phoneNo: "9876543210",
    },
    paymentInfo: { id: "demo_pi_1", status: "succeeded" },
    itemsPrice: 2499,
    taxPrice: 450,
    shippingPrice: 50,
    totalPrice: 2999,
    orderStatus: "Delivered",
    user: { _id: DEMO_USER._id, name: DEMO_USER.name },
    paidAt: "2024-01-15T10:00:00.000Z",
    deliveredAt: "2024-01-20T14:00:00.000Z",
    createdAt: "2024-01-15T09:00:00.000Z",
  },
  {
    _id: "demo-order-2",
    orderItems: [
      { name: DEMO_PRODUCTS[1].name, quantity: 1, price: DEMO_PRODUCTS[1].price, image: DEMO_PRODUCTS[1].images[0].url },
    ],
    shippingInfo: {
      address: "456 Sample Ave",
      city: "Delhi",
      state: "Delhi",
      pinCode: "110001",
      country: "India",
      phoneNo: "9876543211",
    },
    paymentInfo: { id: "demo_pi_2", status: "succeeded" },
    itemsPrice: 4999,
    taxPrice: 900,
    shippingPrice: 50,
    totalPrice: 5949,
    orderStatus: "Shipped",
    user: { _id: DEMO_USER._id, name: DEMO_USER.name },
    paidAt: "2024-02-01T11:00:00.000Z",
    createdAt: "2024-02-01T10:00:00.000Z",
  },
];

const DEMO_REVIEWS = [
  { _id: "r1", name: "Demo User", rating: 5, comment: "Great product for demo!", user: DEMO_USER._id, createdAt: "2024-01-10T12:00:00.000Z" },
  { _id: "r2", name: "Jane Doe", rating: 4, comment: "Good value.", user: "u2", createdAt: "2024-01-12T12:00:00.000Z" },
];

/** Strip query string and get path for matching */
function pathOf(url) {
  try {
    const path = url.split("?")[0];
    return path.replace(/^\/api\/v1/, "");
  } catch {
    return url;
  }
}

/** Match route pattern (e.g. /product/123 -> /product/:id) */
function matchRoute(path, pattern) {
  const pathParts = path.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (pathParts[i] !== patternParts[i]) {
      return null;
    }
  }
  return params;
}

export function getMockResponse(config) {
  const url = config.url || "";
  if (!url.includes("/api/v1")) return null;
  const path = pathOf(url);
  const method = (config.method || "get").toLowerCase();

  // Stripe key (use a test key placeholder; real payment won't work in demo)
  if (path === "/stripeapikey" && method === "get") {
    return { data: { stripeApiKey: "pk_test_51DemoKeyForDemoModeOnly" }, status: 200 };
  }

  // Auth: current user (demo user so UI shows logged-in state)
  if (path === "/me" && method === "get") {
    return { data: { user: DEMO_USER }, status: 200 };
  }
  if (path === "/login" && method === "post") {
    return { data: { user: DEMO_USER }, status: 200 };
  }
  if (path === "/register" && method === "post") {
    return { data: { user: { ...DEMO_USER, _id: "demo-user-new" } }, status: 201 };
  }
  if (path === "/logout" && method === "get") {
    return { data: {}, status: 200 };
  }
  if (path === "/me/update" && method === "put") {
    return { data: { success: true }, status: 200 };
  }
  if (path === "/password/update" && method === "put") {
    return { data: { success: true }, status: 200 };
  }
  if (path === "/password/forgot" && method === "post") {
    return { data: { message: "Password reset email sent (demo)" }, status: 200 };
  }
  const resetMatch = matchRoute(path, "/password/reset/:token");
  if (resetMatch && method === "put") {
    return { data: { success: true }, status: 200 };
  }

  // Admin users
  if (path === "/admin/users" && method === "get") {
    return { data: { users: [DEMO_USER, { ...DEMO_USER, _id: "u2", name: "Other User", email: "other@example.com" }] }, status: 200 };
  }
  const adminUserMatch = matchRoute(path, "/admin/user/:id");
  if (adminUserMatch) {
    if (method === "get") {
      return { data: { user: { ...DEMO_USER, _id: adminUserMatch.id } }, status: 200 };
    }
    if (method === "put") return { data: { success: true }, status: 200 };
    if (method === "delete") return { data: { success: true }, status: 200 };
  }

  // Products list (with query params)
  if (path === "/products" && method === "get") {
    return {
      data: {
        products: DEMO_PRODUCTS,
        productsCount: DEMO_PRODUCTS.length,
        resultPerPage: 10,
        filteredProductsCount: DEMO_PRODUCTS.length,
      },
      status: 200,
    };
  }
  if (path === "/admin/products" && method === "get") {
    return { data: { products: DEMO_PRODUCTS }, status: 200 };
  }
  if (path === "/admin/product/new" && method === "post") {
    return { data: { success: true, product: { ...DEMO_PRODUCTS[0], _id: "demo-new-product" } }, status: 201 };
  }
  const adminProductMatch = matchRoute(path, "/admin/product/:id");
  if (adminProductMatch) {
    if (method === "get") {
      const product = DEMO_PRODUCTS.find((p) => p._id === adminProductMatch.id) || { ...DEMO_PRODUCTS[0], _id: adminProductMatch.id };
      return { data: { product }, status: 200 };
    }
    if (method === "put") return { data: { success: true }, status: 200 };
    if (method === "delete") return { data: { success: true }, status: 200 };
  }

  // Single product (public)
  const productMatch = matchRoute(path, "/product/:id");
  if (productMatch && method === "get") {
    const product = DEMO_PRODUCTS.find((p) => p._id === productMatch.id) || { ...DEMO_PRODUCTS[0], _id: productMatch.id };
    return { data: { product }, status: 200 };
  }

  // Reviews
  if (path.startsWith("/reviews") && method === "get") {
    return { data: { reviews: DEMO_REVIEWS }, status: 200 };
  }
  if (path === "/review" && method === "put") {
    return { data: { success: true }, status: 200 };
  }
  if (path.startsWith("/reviews") && method === "delete") {
    return { data: { success: true }, status: 200 };
  }

  // Orders
  if (path === "/order/new" && method === "post") {
    return { data: { success: true, order: { ...DEMO_ORDERS[0], _id: "demo-order-new" } }, status: 201 };
  }
  if (path === "/orders/me" && method === "get") {
    return { data: { orders: DEMO_ORDERS }, status: 200 };
  }
  if (path === "/admin/orders" && method === "get") {
    return { data: { orders: DEMO_ORDERS }, status: 200 };
  }
  const orderMatch = matchRoute(path, "/order/:id");
  if (orderMatch) {
    if (method === "get") {
      const order = DEMO_ORDERS.find((o) => o._id === orderMatch.id) || { ...DEMO_ORDERS[0], _id: orderMatch.id };
      return { data: { order }, status: 200 };
    }
  }
  const adminOrderMatch = matchRoute(path, "/admin/order/:id");
  if (adminOrderMatch) {
    if (method === "put") return { data: { success: true }, status: 200 };
    if (method === "delete") return { data: { success: true }, status: 200 };
  }

  // Payment (demo: return a fake client_secret so UI doesn't break; Stripe confirm will fail without real key)
  if (path === "/payment/process" && method === "post") {
    return { data: { client_secret: "pi_demo_secret_for_demo_mode" }, status: 200 };
  }

  return null;
}
