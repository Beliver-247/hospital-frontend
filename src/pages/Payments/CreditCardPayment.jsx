import React from 'react';
import { useLocation } from 'react-router-dom';

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      {children}
    </div>
  );
}

function SmallIconButton({ children }) {
  return (
    <button className="p-2 border rounded bg-white mr-2 shadow-sm flex items-center justify-center w-12 h-10">{children}</button>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5 inline-block align-middle text-emerald-700 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7h6l-1 6h-6z" fill="#003087" />
      <path d="M13 7h4l-1 6h-4z" fill="#009cde" />
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6 7.4c0 1.1-.4 2-1.1 2.7-.7.7-1.7 1.1-2.8 1.1-.1-1.2.4-2.2 1.1-2.9.7-.6 1.6-1 2.8-0.9z" fill="#111" />
      <path d="M12.5 3c.3 0 .7 0 1 .1.4.1.8.2 1.2.4.4.2.7.5 1 1 .2.5.3 1 .3 1.5 0 .6-.1 1.1-.3 1.6-.2.4-.5.8-.9 1.2-.4.3-.9.6-1.4.9-.5.3-1 .5-1.6.7-.6.1-1.1.2-1.6.2-.2 0-.4 0-.5-.1-.6-.1-1.3-.4-1.9-.7-.6-.4-1.2-.8-1.6-1.3-.5-.5-.9-1.1-1.2-1.8-.3-.7-.4-1.4-.4-2.2 0-1 .3-1.9.9-2.7.6-.8 1.5-1.4 2.6-1.6.4-.1.8-.1 1.2-.1.6 0 1.1.1 1.6.2.6.1 1.1.3 1.6.4z" fill="#111" />
    </svg>
  );
}

function GPayIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7v10" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 7l4 3" stroke="#0F9D58" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 17l4-3" stroke="#F4B400" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="12" r="3" fill="#DB4437" />
    </svg>
  );
}

function CardBrandIcons() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-4 bg-slate-100 rounded-sm border" />
      <div className="w-6 h-4 bg-slate-100 rounded-sm border" />
      <div className="w-6 h-4 bg-slate-100 rounded-sm border" />
    </div>
  );
}

export default function CreditCardPayment() {
  const location = useLocation();
  const total = location.state?.total ?? 253.5;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold">Credit Card Payment</h2>
          <p className="text-sm text-gray-500">Process secure payment transactions</p>

          <div className="mt-6">
            <Field label="Card Number">
              <div className="flex items-center gap-2">
                <input className="flex-1 border rounded px-3 py-2" placeholder="1234 5678 9012 3456" />
                <div className="flex items-center">
                  <CardBrandIcons />
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry Date">
                <input className="w-full border rounded px-3 py-2" placeholder="MM/YY" />
              </Field>
              <Field label="CVV">
                <input className="w-full border rounded px-3 py-2" placeholder="123" />
              </Field>
            </div>

            <Field label="Cardholder Name">
              <input className="w-full border rounded px-3 py-2" placeholder="John Doe" />
            </Field>

            <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded flex items-center">
              <LockIcon />
              <div>Your payment information is encrypted and secure. We never store your card details.</div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="text-sm font-medium">Emergency Visit</div>
                    <div className="text-xs text-gray-500">Dec 15, 2023 • **** 4532</div>
                  </div>
                  <div className="font-medium">$320.00</div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="text-sm font-medium">Routine Checkup</div>
                    <div className="text-xs text-gray-500">Dec 10, 2023 • **** 4532</div>
                  </div>
                  <div className="font-medium">$180.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium">Payment Summary</h3>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600"><div>Consultation Fee</div><div>$150.00</div></div>
            <div className="flex justify-between text-sm text-gray-600 mt-1"><div>Lab Tests</div><div>$75.00</div></div>
            <div className="flex justify-between text-sm text-gray-600 mt-1"><div>Prescription</div><div>$25.00</div></div>
            <div className="flex justify-between text-sm text-gray-600 mt-1"><div>Processing Fee</div><div>$3.50</div></div>

            <div className="mt-4 border-t pt-3 font-semibold flex justify-between"> 
              <div>Total Amount</div>
              <div className="text-emerald-600">${total.toFixed(2)}</div>
            </div>

            <button className="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded">Process Payment</button>

            <div className="mt-3 text-xs text-gray-500">Or pay with</div>
            <div className="mt-2 flex items-center">
              <SmallIconButton><PayPalIcon /></SmallIconButton>
              <SmallIconButton><ApplePayIcon /></SmallIconButton>
              <SmallIconButton><GPayIcon /></SmallIconButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
