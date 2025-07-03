import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function BusinessProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full p-6 bg-white rounded-md shadow-md border border-gray-200 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Business Profile</h2>
      <p><strong>Business Name:</strong> {user?.name}</p>
      <p><strong>Business Category:</strong> {user?.extraSelection || user?.businessCategory || user?.category}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Business Address:</strong> {user?.address}</p>
      <p><strong>Pincode:</strong> {user?.pincode}</p>
      <p><strong>Contact Number:</strong> {user?.mobileNumber}</p>
      {/* Placeholder for profile upload section */}
      <div className="mt-4 border-t pt-2">
        <p className="font-semibold">Profile Upload</p>
        <p className="text-xs text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}

export default BusinessProfile;
