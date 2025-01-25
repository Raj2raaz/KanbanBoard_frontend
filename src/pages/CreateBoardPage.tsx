import React, { useState } from 'react';
import Layout from '../components/Layout';
import { createBoard } from '../services/userApiServices';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

function CreateBoardPage() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    // Get the user ID and accessToken from Redux state
    const user = useSelector((state: RootState) => state.auth.user);
    const token = localStorage.getItem("accessToken");

    const handleCreateBoard = async () => {
        if (!user || !token) {
            alert("User not authenticated");
            return;
        }

        setLoading(true);
        try {
            const newBoard = await createBoard("Project Management Board", user.id, token);
            console.log("Created Board:", newBoard);
            toast.success('Board Created Successfully!')
            navigate(`/boards/${newBoard.board._id}`)
        } catch (error) {
            console.error("Board creation failed:", error);
            alert("Failed to create board. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold mb-4">Create a New Board</h2>
                <button
                    type="button"
                    onClick={handleCreateBoard}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition-all"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Get Started'}
                </button>
            </div>
        </Layout>
    );
}

export default CreateBoardPage;
