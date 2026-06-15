# Checkout Page Verification Task List

- [ ] Navigate to checkout page (or add item to cart first if needed)
- [ ] Verify checkout page layout (address, delivery, payment, calculations)
- [ ] Add new address:
  - Name: Dia Mirza
  - Phone: 9876543210
  - Address: 77, Mughal Garden Estate
  - City: Delhi
  - State: Delhi
  - Pincode: 110001
- [ ] Click 'Add Address' and check if it updates immediately
- [ ] Take screenshot with the new address selected
- [ ] Check price calculations
- [ ] Document what works, what is broken, and UX issues

## Findings & Issues
- **API Port Conflict:** The Kloset Go backend is supposed to run on port `8080`. However, port `8080` is currently occupied by a portfolio website ("Sana Yaswanth Raj Mouli — AI Systems Engineer").
- **Auth Broken:** All registration and login requests to `http://localhost:8080/api/v1/auth/*` fail with status `404` (returned by the portfolio app).
- **Redirection Loop:** Since the user cannot be authenticated, any attempt to navigate to `/booking/checkout` results in an immediate redirect to `/login?redirect=%2Fbooking%2Fcheckout`.
- **Blocked State:** We are unable to proceed with verifying the checkout page until port `8080` is freed and the Kloset Go backend is running there, or the API port configuration is updated.

