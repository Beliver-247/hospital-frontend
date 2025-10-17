import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HospitalSelection from '../HospitalSelection.jsx';

function Icon({ name }) {
  if (name === 'card')
    return (
      <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="9" width="6" height="2" fill="currentColor" opacity="0.15" />
      </svg>
    );
  if (name === 'cash')
    return (
      <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  return (
    <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PaymentCard({ id, title, desc, icon, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={
        'cursor-pointer border rounded-lg p-6 flex flex-col items-center text-center transition-shadow ' +
        (selected ? 'shadow-lg border-emerald-300 bg-emerald-50' : 'hover:shadow')
      }
    >
      <div className="mb-3">
        <Icon name={icon} />
      </div>
      <div className="font-medium text-lg">{title}</div>
      <div className="text-sm text-gray-500 mt-2">{desc}</div>
      <div className="mt-4">
        <input type="radio" readOnly checked={selected} />
      </div>
    </div>
  );
}

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultMethod = location.state?.defaultMethod;

  const [selected, setSelected] = useState(defaultMethod || null);
  const [showHospitalStep, setShowHospitalStep] = useState(Boolean(!defaultMethod));

  useEffect(() => {
    if (defaultMethod) setSelected(defaultMethod);
  }, [defaultMethod]);

  const summary = [
    { label: 'Consultation Fee', amount: 150 },
    { label: 'Lab Tests', amount: 75 },
    { label: 'Processing Fee', amount: 5 },
  ];
  const total = summary.reduce((s, it) => s + it.amount, 0);

  function handleContinue() {
    if (!selected) return alert('Please select a payment method');
    if (selected === 'card') {
      navigate('/billing/credit-card', { state: { total } });
    } else {
      navigate('/billing/confirm', { state: { method: selected, total } });
    }
  }

  function handleHospitalChoose(choice) {
    // If private, default to cash and proceed to payment selection
    if (choice === 'private') {
      setSelected('cash');
    }
    setShowHospitalStep(false);
  }

  return (
    <div className="p-6">
      {showHospitalStep ? (
        <div className="bg-white rounded-lg shadow p-6">
          <HospitalSelection onChoose={handleHospitalChoose} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-center">Choose Payment Method</h1>
        <p className="text-center text-gray-500 mt-1">Select your preferred payment method to complete the transaction</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <PaymentCard
            id="card"
            title="Credit Card"
            desc="Pay securely with your credit or debit card"
            icon="card"
            selected={selected === 'card'}
            onSelect={(id) => {
              setSelected(id);
              if (id === 'card') navigate('/billing/credit-card', { state: { total } });
            }}
          />
          <PaymentCard id="cash" title="Cash" desc="Pay with cash at the reception desk" icon="cash" selected={selected === 'cash'} onSelect={(id) => setSelected(id)} />
          <PaymentCard id="insurance" title="Insurance" desc="Use your health insurance coverage" icon="insurance" selected={selected === 'insurance'} onSelect={(id) => { setSelected(id); navigate('/billing/insurance', { state: { total } }); }} />
        </div>

        <div className="mt-6 flex items-start gap-6">
          <button className="px-4 py-2 border rounded">← Back</button>
          <button onClick={handleContinue} className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded">Select Payment Method →</button>
        </div>
      </div>
  )}
      <div className="mt-6 bg-white rounded-lg shadow p-4 max-w-2xl">
        <div className="font-medium mb-2">Payment Summary</div>
        <div className="divide-y">
          {summary.map((s) => (
            <div key={s.label} className="flex justify-between py-2 text-sm">
              <div className="text-gray-600">{s.label}</div>
              <div className="font-medium">${s.amount.toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between py-3 font-semibold">
            <div>Total Amount</div>
            <div className="text-emerald-600">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
