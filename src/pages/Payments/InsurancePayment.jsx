import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Field({ label, children, optional }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">{label}{optional ? ' (Optional)' : ''}</div>
      </div>
      {children}
    </div>
  );
}

export default function InsurancePayment() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState('');
  const [policy, setPolicy] = useState('');
  const [memberId, setMemberId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');

  function submitClaim() {
    if (!provider || !policy) return alert('Please fill required fields (Provider and Policy Number)');
    // For now, just navigate to a confirmation page or show success
    navigate('/billing/confirm', { state: { method: 'insurance', provider, policy, memberId, groupNumber } });
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold">Insurance Payment</h2>
        <p className="text-sm text-gray-500 mt-1">Enter your insurance details to process your claim</p>

        <div className="mt-6">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded">Ready to Submit — Please complete the form below to submit your insurance claim</div>

          <div className="mt-4">
            <Field label="Insurance Provider *">
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">Select your insurance provider</option>
                <option value="Provider A">Provider A</option>
                <option value="Provider B">Provider B</option>
                <option value="Provider C">Provider C</option>
              </select>
            </Field>

            <Field label="Policy Number *">
              <input value={policy} onChange={(e) => setPolicy(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter your policy number" />
            </Field>

            <Field label="Member ID">
              <input value={memberId} onChange={(e) => setMemberId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter your member ID" />
            </Field>

            <Field label="Group Number" optional>
              <input value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter group number if applicable" />
            </Field>

            <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-gray-700">
              <strong>Important Information</strong>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                <li>Please ensure all information matches your insurance card exactly.</li>
                <li>Processing typically takes 1-3 business days.</li>
                <li>You will receive email updates on your claim status.</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">← Back</button>
              <button className="px-4 py-2 border rounded bg-gray-100">Save as Draft</button>
              <button onClick={submitClaim} className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded">Submit Insurance Claim</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
