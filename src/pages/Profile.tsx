import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../services/userApiServices';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [user, setUser] = useState({
    username: '',
    email: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<{ field: string | null }>({ field: null });
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId || !token) {
          toast.error("Missing user ID or token");
          return;
        }
        const userData = await getUserProfile(userId, token);
        setUser(userData);
        console.log(userData)
      } catch (error) {
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, token]);

  // Handle field update
  const handleFieldChange = (field: string, value: string) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
    setShowApplyButton(true);
  };

  const handleFieldBlur = async () => {
    setIsEditing({ field: null });
    if (showApplyButton) {
      await handleUpdateProfile();
    }
  };

  const handleEditField = (field: string) => {
    setIsEditing({ field });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFieldBlur();
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
        //  @ts-ignore
      await updateUserProfile(user, token);
      setShowApplyButton(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      //  @ts-ignore
      await deleteUserProfile(token);
      toast.success('Profile deleted successfully.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete profile.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl mt-10 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-8">
          User Profile
        </h2>

        <div className="space-y-6">
          {['username', 'email', 'bio'].map((field) => (
            <div key={field} className="relative group">
              <label className="text-gray-600 dark:text-gray-400 block mb-1 font-semibold capitalize">
                {field}
              </label>
              {isEditing.field === field ? (
                <motion.input
                //  @ts-ignore
                  ref={inputRef}
                  type={field === 'email' ? 'email' : 'text'}
                  value={user[field as keyof typeof user]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-lg shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              ) : (
                <motion.div
                  onDoubleClick={() => handleEditField(field)}
                  className="w-full p-4 bg-opacity-50 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-all"
                >
                  {user[field as keyof typeof user] || `Click to add ${field}`}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {showApplyButton && (
          <button
            onClick={handleUpdateProfile}
            className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            Apply Changes
          </button>
        )}

        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all"
        >
          Delete Profile
        </button>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleDeleteProfile}
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
