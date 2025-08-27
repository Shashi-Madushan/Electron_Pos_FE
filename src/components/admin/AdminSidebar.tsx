import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    MdDashboard,
    MdPeople,
    MdInventory,
    MdCategory,
    MdLocalOffer,
    MdReceipt,
    MdAnalytics,
    MdSettings,
    MdLogout,
    MdBusiness
} from 'react-icons/md';

const AdminSidebar = () => {
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/admin', icon: <MdDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/users', icon: <MdPeople size={20} />, label: 'Users' },
        { path: '/admin/inventory', icon: <MdInventory size={20} />, label: 'Inventory' },
        { path: '/admin/categories', icon: <MdCategory size={20} />, label: 'Categories' },
        { path: '/admin/brands', icon: <MdBusiness size={20} />, label: 'Brands' },
        { path: '/admin/products', icon: <MdLocalOffer size={20} />, label: 'Products' },
        { path: '/admin/sales', icon: <MdReceipt size={20} />, label: 'Sales' },
        { path: '/admin/reports', icon: <MdAnalytics size={20} />, label: 'Reports' },
        { path: '/admin/settings', icon: <MdSettings size={20} />, label: 'Settings' },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
            {/* Admin Profile Section */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        {user?.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-medium">{user?.userName}</h3>
                        <p className="text-sm text-indigo-400">Administrator</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="mt-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-sm font-medium text-gray-300 hover:text-white w-full px-4 py-3 hover:bg-gray-800 rounded-md"
                >
                    <MdLogout size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
