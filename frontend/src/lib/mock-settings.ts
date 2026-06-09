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
  wallet: {
    creditBalance: 3400,         // in ₹ — covers 1700 customers @ ₹2 each
    customerRate: 2,             // ₹ per customer
    recharges: [
      { id: "rch001", date: "Jun 1, 2026",  amount: 1000, customers: 500,  status: "Success" },
      { id: "rch002", date: "May 10, 2026", amount: 2000, customers: 1000, status: "Success" },
      { id: "rch003", date: "Apr 18, 2026", amount: 500,  customers: 250,  status: "Success" },
      { id: "rch004", date: "Mar 5, 2026",  amount: 1000, customers: 500,  status: "Success" },
      { id: "rch005", date: "Feb 12, 2026", amount: 500,  customers: 250,  status: "Failed"  },
    ],
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

export type RechargeRow = { id: string; date: string; amount: number; customers: number; status: string };