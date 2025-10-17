import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Icon({ type }) {
  if (type === 'building')
    return (
      <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="5" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="7" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  if (type === 'hospital')
    return (
      <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  return null;
}

function Badge({ children, color = 'green' }) {
  const colorMap = {
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-sky-100 text-sky-700',
    orange: 'bg-amber-100 text-amber-700',
    purple: 'bg-violet-100 text-violet-700',
    red: 'bg-rose-100 text-rose-700',
  };
  return <span className={"inline-block text-xs px-2 py-1 rounded-full mr-2 " + (colorMap[color] || colorMap.green)}>{children}</span>;
}

export default function HospitalSelection({ onChoose }) {
  const [selected, setSelected] = useState('government');

  function handleContinue() {
    if (onChoose) {
      // pass the selection back to parent (Payments) which will advance the flow
      onChoose(selected);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-emerald-50 rounded-full">
            <Icon type="hospital" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center">Select Hospital Type</h2>
        <p className="text-center text-gray-500 mt-1">Choose the type of hospital that best suits your needs and preferences.</p>

        <div className="mt-6 space-y-4">
          <div
            onClick={() => setSelected('government')}
            className={
              'border rounded-lg p-4 cursor-pointer ' + (selected === 'government' ? 'border-emerald-300 bg-emerald-50' : '')
            }
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-md">
                <Icon type="building" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Government Hospital</div>
                <div className="text-sm text-gray-500">Access to free medical treatment and healthcare services provided by government institutions.</div>
                <div className="mt-3">
                  <Badge color="green">Free Treatment</Badge>
                  <Badge color="blue">Government Backed</Badge>
                  <Badge color="orange">May have waiting times</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600">{selected === 'government' ? '●' : ''}</div>
            </div>
          </div>

          <div
            onClick={() => setSelected('private')}
            className={
              'border rounded-lg p-4 cursor-pointer ' + (selected === 'private' ? 'border-emerald-300 bg-emerald-50' : '')
            }
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-md">
                <Icon type="building" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Private Hospital</div>
                <div className="text-sm text-gray-500">Premium healthcare services with shorter wait times and enhanced amenities. Payment required for services.</div>
                <div className="mt-3">
                  <Badge color="purple">Premium Service</Badge>
                  <Badge color="green">Faster Access</Badge>
                  <Badge color="red">Payment Required</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600">{selected === 'private' ? '●' : ''}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button className="px-4 py-2 border rounded">← Back</button>
          <button onClick={handleContinue} className="px-4 py-2 bg-emerald-600 text-white rounded">Continue →</button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border rounded p-4 text-sm text-blue-800">
        <strong>Important Information</strong>
        <ul className="mt-2 list-disc list-inside">
          <li>Government hospitals may require valid ID and insurance documentation.</li>
          <li>Private hospitals accept various payment methods including insurance.</li>
          <li>Emergency services are available at both hospital types.</li>
        </ul>
      </div>
    </div>
  );
}
