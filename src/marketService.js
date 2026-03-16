import seedServices from './services';
import { getCurrentUser, getUsers } from './authService';

const SERVICES_KEY = 'q6_services';
const ORDERS_KEY = 'q6_orders';

function readJson(key, fallbackValue) {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function parseAmount(price) {
  if (typeof price === 'number') {
    return Number(price.toFixed(2));
  }

  const firstAmount = String(price).match(/[0-9,]+(\.[0-9]{1,2})?/);
  if (!firstAmount) {
    return 0;
  }

  return Number(firstAmount[0].replace(/,/g, ''));
}

export function ensureSeedServices() {
  const existing = readJson(SERVICES_KEY, []);
  if (existing.length > 0) {
    return;
  }

  const mapped = seedServices.map((service) => ({
    ...service,
    id: service.id,
    price_value: service.price_value || parseAmount(service.price),
    seller_id: service.seller_id || 'seed-seller',
    seller_name: service.name_of_the_expert,
    seller_merchant_id: service.seller_merchant_id || 'DEMO-MERCHANT-001',
    created_at: new Date().toISOString(),
  }));

  writeJson(SERVICES_KEY, mapped);
}

export function getServices() {
  ensureSeedServices();
  return readJson(SERVICES_KEY, []);
}

function saveServices(services) {
  writeJson(SERVICES_KEY, services);
}

export function getServiceById(serviceId) {
  return getServices().find((service) => service.id === serviceId);
}

export function getSellerServices(sellerId) {
  return getServices().filter((service) => service.seller_id === sellerId);
}

export function createService(payload) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Sign in required.' };
  }

  const allUsers = getUsers();
  const fullUser = allUsers.find((user) => user.id === currentUser.id);

  if (!fullUser || (fullUser.role !== 'Seller' && fullUser.role !== 'Admin')) {
    return { success: false, message: 'Only approved sellers can create services.' };
  }

  const services = getServices();
  const newService = {
    id: `service-${Date.now()}`,
    service_name: payload.service_name.trim(),
    description: payload.description.trim(),
    rating: 5,
    price: `PHP ${Number(payload.price).toLocaleString()}`,
    price_value: Number(payload.price),
    duration_of_service: payload.duration_of_service.trim(),
    sample_image: payload.sample_image.trim(),
    name_of_the_expert: `${fullUser.first_name} ${fullUser.last_name}`,
    seller_id: fullUser.id,
    seller_name: `${fullUser.first_name} ${fullUser.last_name}`,
    seller_merchant_id: fullUser.merchant_id || '',
    created_at: new Date().toISOString(),
  };

  services.unshift(newService);
  saveServices(services);

  return { success: true, service: newService };
}

export function updateService(serviceId, updates) {
  const currentUser = getCurrentUser();
  const services = getServices();
  const targetService = services.find((service) => service.id === serviceId);

  if (!targetService || !currentUser) {
    return { success: false, message: 'Service not found.' };
  }

  if (currentUser.role !== 'Admin' && targetService.seller_id !== currentUser.id) {
    return { success: false, message: 'Unauthorized action.' };
  }

  targetService.service_name = updates.service_name.trim();
  targetService.description = updates.description.trim();
  targetService.duration_of_service = updates.duration_of_service.trim();
  targetService.sample_image = updates.sample_image.trim();
  targetService.price_value = Number(updates.price);
  targetService.price = `PHP ${Number(updates.price).toLocaleString()}`;

  saveServices(services);
  return { success: true };
}

export function removeService(serviceId) {
  const currentUser = getCurrentUser();
  const services = getServices();
  const targetService = services.find((service) => service.id === serviceId);

  if (!targetService || !currentUser) {
    return { success: false, message: 'Service not found.' };
  }

  if (currentUser.role !== 'Admin' && targetService.seller_id !== currentUser.id) {
    return { success: false, message: 'Unauthorized action.' };
  }

  const filtered = services.filter((service) => service.id !== serviceId);
  saveServices(filtered);
  return { success: true };
}

export function getOrders() {
  return readJson(ORDERS_KEY, []);
}

function saveOrders(orders) {
  writeJson(ORDERS_KEY, orders);
}

export function createOrder(payload) {
  const currentUser = getCurrentUser();
  const service = getServiceById(payload.service_id);

  if (!currentUser || !service) {
    return { success: false, message: 'Unable to create order.' };
  }

  const orders = getOrders();
  const order = {
    id: `order-${Date.now()}`,
    buyer_id: currentUser.id,
    buyer_name: `${currentUser.first_name} ${currentUser.last_name}`,
    service_id: service.id,
    service_name: service.service_name,
    price_paid: payload.price_paid,
    paypal_transaction_id: payload.paypal_transaction_id,
    seller_id: service.seller_id,
    seller_name: service.seller_name,
    created_at: new Date().toISOString(),
  };

  orders.unshift(order);
  saveOrders(orders);

  return { success: true, order };
}

export function getUserOrders(userId) {
  return getOrders().filter((order) => order.buyer_id === userId);
}
