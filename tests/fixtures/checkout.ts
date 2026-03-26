export const checkoutCustomer = {
  firstName: "Philani",
  lastName: "Ncube",
  email: "playwright-checkout@example.com",
  phone: "0712345678",
  addressLine1: "42 Test Street",
  addressLine2: "Suite 7",
  city: "Johannesburg",
  province: "Gauteng",
  postalCode: "2196",
};

export function getCheckoutInputEntries() {
  return Object.entries(checkoutCustomer);
}