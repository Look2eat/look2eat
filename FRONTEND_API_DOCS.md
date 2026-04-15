# Look2Eat Frontend Integration Documentation

This guide provides the exact workflows and API endpoint calls required to power the Look2Eat Web App, specifically tailored for your single "Admin-as-Cashier" unified flow. 

**Postman Testing**: A complete Postman collection (`Look2Eat_Postman_Collection.json`) already exists in the `backend/` folder covering these exact 10 endpoints. You can import it to instantly test payloads.

---

## 🔑 1. Authentication & Base Setup

The system operates on an overarching "Admin Token". The owner logs in once, and that resulting JWT Bearer token is passed into **ALL** subsequent API calls (both Dashboard analytics and Cashier transaction endpoints).

### Admin Login
**Endpoint**: `POST /api/v1/auth/admin/login`
**Payload**:
```json
{
  "phoneNumber": "9876543210",
  "password": "password123",
  "fcmToken": "optional_firebase_token"
}
```
**Response**: Returns the `token` (JWT) and `brandId`. Save both locally (e.g., localStorage) as they are required for everything below.

---

## 📊 2. Admin Dashboard View

When the owner logs in, they land on the Dashboard to see their real-time KPIs and returning-customer analytics graph.

**Endpoint**: `GET /api/v1/admin/brands/:brandId/dashboard`  
**Headers**: `Authorization: Bearer <token>`

**Response Highlights**:
- `kpis.totalSales`: Sum of all revenue mapped to the brand.
- `kpis.totalPointsIssued`: Net internal currency issued.
- `kpis.totalRewardRedeemed`: Total cashback discounts successfully provided.
- `kpis.redemptionRate`: Calculated strictly as `(Count of Redemptions / Count of Sales) * 100`.
- `graph.returnRate`: Segments customers into distinct groups (1 visit, 2 visits, 3-5 visits, 6+ visits).

*(Note: There is no Cashier to separate in the UI anymore. The Dashboard should just have a simple button that says "Switch to Cashier Portal" which routes the app to the Cashier view using the same permissions).*

---

## 🛒 3. Cashier Portal: Core Transaction Flows

The Cashier Portal is where actual sales happen. The UI should prompt the cashier to ask for the customer's mobile number.

### A. Lookup Customer (First Step Always)
**Endpoint**: `POST /api/v1/cashier/customer-info`  
**Headers**: `Authorization: Bearer <token>`  
**Payload**:
```json
{
  "customerPhoneNumber": "7217623488",
  "brandId": "<brand_id_from_login>"
}
```
**Response handling**:
- If `isNewCustomer` is `true`: Show clean "New Customer" UI. 
- If `isNewCustomer` is `false`: UI should render their `walletBalance`, `coinsExpiry`, and a list of `allMilestones` they are eligible for.

*(This determines which of the two workflows below you allow the Cashier to trigger).*

---

### B. Standard Purchase Flow (No Rewards Redeemed)
*Use this when it's a new customer OR when a repeat customer doesn't want to use their coins.*
*Note: This flow requires NO OTP verification to ensure high checkout speed!*

1. Cashier punches in the `purchaseAmount`.
2. Cashier clicks **Submit**.
3. **Endpoint**: `POST /api/v1/cashier/transaction/purchase`
4. **Payload**:
```json
{
  "customerPhoneNumber": "7217623488",
  "brandId": "<brandId>",
  "purchaseAmount": 150.00
}
```
**Result**: The transaction completes immediately. The backend automatically calculates their earned coins securely and texts the customer via WhatsApp (sending template `first_time_points_earned` or `earned_points_only`).

---

### C. The Redemption Flow (Redeem Cashback + Add New Coins)
*Use this when a repeat customer wants to cash in down a specific milestone (e.g., `-200 coins for ₹50 off`). We require an OTP here to prevent fraud.*

**Step 1: Cashier selects Milestone & submits new amount**
- Cashier clicks the eligible milestone (e.g., ₹50 off). 
- Cashier adjusts terminal, then enters the NEW `purchaseAmount` into the Look2Eat UI.
- Cashier clicks **"Redeem & Submit"**.

**Step 2: Frontend silently requests OTP**
- **Endpoint**: `POST /api/v1/cashier/request-customer-otp`
- **Payload**: `{"customerPhoneNumber": "...", "brandId": "..."}`
- *(The backend immediately shoots a 4-digit text to the customer's WhatsApp).*

**Step 3: Frontend Pops OTP Modal**
- A popup appears saying *"OTP sent! Please ask the customer for the code."*

**Step 4: Verify OTP**
- Cashier enters the 4-digits and hits confirm.
- **Endpoint**: `POST /api/v1/cashier/verify-customer-otp`
- **Payload**: `{"customerPhoneNumber": "...", "brandId": "...", "otp": "xxxx"}`

**Step 5: Finalize Transaction**
- Instantly after Step 4 succeeds, fire the final Redemption call!
- **Endpoint**: `POST /api/v1/cashier/transaction/redeem`
- **Payload**:
```json
{
  "customerPhoneNumber": "7217623488",
  "brandId": "<brandId>",
  "milestoneId": "<id_from_customer_info>",
  "purchaseAmount": 100.00
}
```
**Result**: The backend fulfills both the deduction of reward coins and the addition of fresh earned coins atomically. The customer is texted the `earned_and_redeemed` WhatsApp receipt with exact details.

---

## 🚀 WhatsApp Automation & Expiry (Backend Side)

The Frontend Developer does **not** need to handle any of the following; it is fully governed by the server constraints automatically:
- **Button Links**: The WhatsApp receipt templates include a "View Details" button. The backend parses this and attaches a dynamic parameter perfectly (`loyalty/<brand_slug>/<phone_number>`) every single execution. 
- **Point Expirations**: Currently, every single point generated globally hard-expires exactly on **April 20th late evening**.
- **22-Hour Reminders**: The backend runs an internal silent chronoscript every 60 minutes. If 22 hours have passed since a transaction and the customer sits above a reward threshold, it fires the `first_reminder` template to their phone.
