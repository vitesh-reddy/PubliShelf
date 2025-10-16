//client/src/pages/admin/dashboard/components/PublisherTable.jsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { banPublisher, approvePublisher, rejectPublisher } from "../../../services/admin.services.js";

const PublisherTable = ({ publishers, onUpdate }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const handleBan = async (publisherId) => {
    if (confirm("Are you sure you want to ban this publisher?")) {
      try {
        const response = await banPublisher(publisherId);
        if (response.success) {
          alert("Publisher banned successfully.");
          onUpdate(); // Refresh data
        } else {
          alert(response.message || "Failed to ban publisher.");
        }
      } catch (error) {
        console.error("Error banning publisher:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const openApproveModal = (publisher) => {
    setSelectedPublisher(publisher);
    setShowApproveModal(true);
  };

  const openRejectModal = (publisher) => {
    setSelectedPublisher(publisher);
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    try {
      const response = await approvePublisher(selectedPublisher._id);
      if (response.success) {
        alert("Publisher approved successfully.");
        setShowApproveModal(false);
        onUpdate();
      } else {
        alert(response.message || "Failed to approve publisher.");
      }
    } catch (error) {
      console.error("Error approving publisher:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectPublisher(selectedPublisher._id);
      if (response.success) {
        alert("Publisher rejected successfully.");
        setShowRejectModal(false);
        onUpdate();
      } else {
        alert(response.message || "Failed to reject publisher.");
      }
    } catch (error) {
      console.error("Error rejecting publisher:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (publishers.length === 0) {
    return <p className="text-gray-600 text-sm">No publishers pending approval.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publishing House</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {publishers.map((publisher) => (
            <tr key={publisher._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {publisher.firstname} {publisher.lastname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {publisher.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {publisher.publishingHouse}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Approved
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openApproveModal(publisher)}
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(publisher)}
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleBan(publisher._id)}
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-300 text-red-800 hover:bg-red-400"
                  >
                    Ban {publisher.publishingHouse}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Approve Publisher</h3>
              <button onClick={() => setShowApproveModal(false)} className="text-gray-600 hover:text-gray-900">
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600">
              Are you sure you want to approve <strong>{selectedPublisher?.publishingHouse}</strong>?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Reject Publisher</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-600 hover:text-gray-900">
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600">
              Are you sure you want to reject <strong>{selectedPublisher?.publishingHouse}</strong>?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublisherTable;