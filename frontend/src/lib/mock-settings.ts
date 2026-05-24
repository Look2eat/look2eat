export const mockData = {
  profile: {
    name: "Avneet Singh",
    email: "avneet@zuplin.in",
    emailVerified: false,
    mobile: "+91 98765 43210",
    mobileVerified: true,
    role: "Owner",
  },
  business: {
    name: "Zuplin Loyalty",
    logo: null as string | null,
    gst: "07AABCU9603R1ZX",
    addressLine1: "Plot 12, Industrial Area Phase 1",
    addressLine2: "Sector 56",
    city: "Ludhiana",
    state: "Punjab",
    pincode: "141001",
  },
  team: {
    cashiers: [
      { id: "c1", name: "Rahul Sharma", username: "rahul_s", password: "Cash@1234" },
      { id: "c2", name: "Priya Verma", username: "priya_v", password: "Priya@5678" },
    ],
  },
  security: {
    twoFA: true,
  },
  billing: {
    plan: "Pro",
    amount: "₹2,499 / month",
    renewalDate: "July 4, 2026",
    history: [
      { id: "inv001", date: "Jun 4, 2026", amount: "₹2,499", status: "Paid" },
      { id: "inv002", date: "May 4, 2026", amount: "₹2,499", status: "Paid" },
      { id: "inv003", date: "Apr 4, 2026", amount: "₹2,499", status: "Paid" },
    ],
  },
};

// Types
export type Cashier = { id: string; name: string; username: string; password: string };
export type BillingRow = { id: string; date: string; amount: string; status: string };