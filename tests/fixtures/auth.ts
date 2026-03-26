export type E2EUser = {
  email: string;
  password: string;
};

function readValue(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function readUser(emailEnv: string, passwordEnv: string): E2EUser | null {
  const email = readValue(emailEnv);
  const password = readValue(passwordEnv);

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export function getVerifiedUser() {
  return readUser("E2E_USER_EMAIL", "E2E_USER_PASSWORD");
}

export function getAdminUser() {
  return readUser("E2E_ADMIN_EMAIL", "E2E_ADMIN_PASSWORD");
}

export function getNonAdminUser() {
  return readUser("E2E_NON_ADMIN_EMAIL", "E2E_NON_ADMIN_PASSWORD");
}