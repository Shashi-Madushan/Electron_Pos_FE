import { FaBars, FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/UseAuth';

interface TopBarProps {
    toggleSidebar: () => void;
    className?: string;
}

const UserTopBar = ({ toggleSidebar, className }: TopBarProps) => {
    const { user } = useAuth();

    return (
        <div className={`bg-white/70 backdrop-blur-xl m-2 h-16 flex items-center justify-between px-4 rounded-xl ${className || ''}`}>
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl hover:bg-gray-100/80 lg:hidden"
                >
                    <FaBars className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center bg-gray-50/50 rounded-xl px-3 py-2">
                    <FaSearch className="text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search..."
                        className="bg-transparent border-none focus:outline-none ml-2 w-48 text-sm text-gray-600"
                    />
                </div>

                <button className="p-2 rounded-xl hover:bg-gray-100/80 relative">
                    <FaBell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>
                
                <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/80 cursor-pointer">
                    <FaUserCircle className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                        {user?.firstName} {user?.lastName}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserTopBar;
