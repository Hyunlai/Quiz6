const USERS_KEY = 'q6_users';
const CURRENT_USER_KEY = 'q6_current_user';
const SELLER_APPLICATIONS_KEY = 'q6_seller_applications';
const ACCESS_TOKEN_KEY = 'q6_access_token';
const REFRESH_TOKEN_KEY = 'q6_refresh_token';

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

export function storeSession(user, access, refresh) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearSession() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function ensureSeedAdmin() {
  const users = readJson(USERS_KEY, []);
  const hasAdmin = users.some((user) => user.role === 'Admin');

  if (hasAdmin) {
    return;
  }

  users.push({
    id: 'admin-seed-1',
    first_name: 'Platform',
    last_name: 'Admin',
    email: 'admin@platform.local',
    username: 'admin',
    phone_number: '0000000000',
    location: 'HQ',
    gender: 'prefer-not-to-say',
    password: 'admin12345',
    role: 'Admin',
  });

  writeJson(USERS_KEY, users);
}

export function getUsers() {
  ensureSeedAdmin();
  return readJson(USERS_KEY, []);
}

function saveUsers(users) {
  writeJson(USERS_KEY, users);
}

export function getCurrentUser() {
  return readJson(CURRENT_USER_KEY, null);
}

export function registerUser(formData) {
  ensureSeedAdmin();
  const users = getUsers();
  const email = normalizeEmail(formData.email);

  const emailExists = users.some((user) => normalizeEmail(user.email) === email);

  if (emailExists) {
    return { success: false, message: 'Email is already registered.' };
  }

  const usernameExists = users.some(
    (user) => user.username.trim().toLowerCase() === formData.username.trim().toLowerCase()
  );

  if (usernameExists) {
    return { success: false, message: 'Username is already taken.' };
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    username: formData.username.trim(),
    phone_number: formData.phone_number.trim(),
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    location: formData.location.trim(),
    gender: formData.gender.trim(),
    password: formData.password,
    role: 'User',
    merchant_id: '',
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: 'Registration successful. Your account was created as User.',
  };
}

export function loginUser(email, password) {
  ensureSeedAdmin();
  const users = getUsers();
  const normalizedEmail = normalizeEmail(email);

  const matchedUser = users.find(
    (user) => normalizeEmail(user.email) === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const sessionUser = {
    id: matchedUser.id,
    email: matchedUser.email,
    first_name: matchedUser.first_name,
    last_name: matchedUser.last_name,
    role: matchedUser.role,
  };

  writeJson(CURRENT_USER_KEY, sessionUser);
  return { success: true, user: sessionUser };
}

export function logoutUser() {
  clearSession();
}

export function getSellerApplications() {
  return readJson(SELLER_APPLICATIONS_KEY, []);
}

function saveSellerApplications(applications) {
  writeJson(SELLER_APPLICATIONS_KEY, applications);
}

export function applyForSeller(userId) {
  const applications = getSellerApplications();

  const existingActiveApplication = applications.find(
    (item) => item.user_id === userId && item.status === 'Pending'
  );

  if (existingActiveApplication) {
    return { success: false, message: 'You already have a pending seller application.' };
  }

  const users = getUsers();
  const user = users.find((item) => item.id === userId);

  if (!user) {
    return { success: false, message: 'User not found.' };
  }

  if (user.role === 'Seller') {
    return { success: false, message: 'Your account is already a Seller.' };
  }

  applications.push({
    id: `seller-app-${Date.now()}`,
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    status: 'Pending',
    merchant_id: '',
    decline_reason: '',
  });

  saveSellerApplications(applications);
  return { success: true, message: 'Seller application submitted. Waiting for admin approval.' };
}

export function approveSellerApplication(applicationId, merchantId) {
  const applications = getSellerApplications();
  const targetApplication = applications.find((item) => item.id === applicationId);

  if (!targetApplication) {
    return { success: false, message: 'Application not found.' };
  }

  if (!merchantId || !merchantId.trim()) {
    return { success: false, message: 'Merchant ID is required.' };
  }

  targetApplication.status = 'Approved';
  targetApplication.merchant_id = merchantId.trim();
  targetApplication.decline_reason = '';
  saveSellerApplications(applications);

  const users = getUsers();
  const targetUser = users.find((user) => user.id === targetApplication.user_id);

  if (targetUser) {
    targetUser.role = 'Seller';
    targetUser.merchant_id = merchantId.trim();
    saveUsers(users);
  }

  const currentUser = getCurrentUser();
  if (currentUser && targetUser && currentUser.id === targetUser.id) {
    writeJson(CURRENT_USER_KEY, {
      ...currentUser,
      role: 'Seller',
    });
  }

  return { success: true };
}

export function rejectSellerApplication(applicationId, declineReason) {
  const applications = getSellerApplications();
  const targetApplication = applications.find((item) => item.id === applicationId);

  if (!targetApplication) {
    return { success: false, message: 'Application not found.' };
  }

  if (!declineReason || !declineReason.trim()) {
    return { success: false, message: 'Decline reason is required.' };
  }

  targetApplication.status = 'Rejected';
  targetApplication.decline_reason = declineReason.trim();
  targetApplication.merchant_id = '';
  saveSellerApplications(applications);
  return { success: true };
}

export function getUserById(userId) {
  const currentUser = getCurrentUser();
  if (currentUser && String(currentUser.id) === String(userId)) {
    return currentUser;
  }
  return null;
}

export function updateUser(userId, updates) {
  const users = getUsers();
  const targetUser = users.find((user) => user.id === userId);

  if (!targetUser) {
    return { success: false, message: 'User not found.' };
  }

  targetUser.first_name = updates.first_name.trim();
  targetUser.last_name = updates.last_name.trim();
  targetUser.email = normalizeEmail(updates.email);
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === targetUser.id) {
    writeJson(CURRENT_USER_KEY, {
      ...currentUser,
      first_name: targetUser.first_name,
      last_name: targetUser.last_name,
      email: targetUser.email,
    });
  }

  return { success: true };
}

export function deleteUser(userId) {
  const users = getUsers();
  const filteredUsers = users.filter((user) => user.id !== userId);
  saveUsers(filteredUsers);

  const applications = getSellerApplications().filter((item) => item.user_id !== userId);
  saveSellerApplications(applications);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    logoutUser();
  }
}