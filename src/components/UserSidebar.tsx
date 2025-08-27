import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    MdDashboard, 
    MdPointOfSale, 
    MdShoppingBag, 
    MdPerson, 
    MdSettings,
    MdInventory,
    MdSearch,
    MdLogout 
} from 'react-icons/md';

const UserSidebar = () => {
    const { logout, user } = useAuth();
    
    const menuItems = [
        { path: '/dashboard', icon: <MdDashboard size={20} />, label: 'Dashboard' },
        { path: '/dashboard/pos', icon: <MdPointOfSale size={20} />, label: 'POS' },
        { path: '/dashboard/my-orders', icon: <MdShoppingBag size={20} />, label: 'My Orders' },
        { path: '/dashboard/inventory', icon: <MdInventory size={20} />, label: 'Inventory' },
        { path: '/dashboard/search', icon: <MdSearch size={20} />, label: 'Search Products' },
        { path: '/dashboard/profile', icon: <MdPerson size={20} />, label: 'Profile' },
        { path: '/dashboard/settings', icon: <MdSettings size={20} />, label: 'Settings' },
    ];

    return (
        <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 overflow-y-auto">
            {/* User Profile Section */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        {user?.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-medium">{user?.userName}</h3>
                        <p className="text-sm text-gray-400">Cashier</p>
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
                                            : 'text-gray-300 hover:bg-gray-700'
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
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 text-sm font-medium text-gray-300 hover:text-white w-full px-4 py-3 hover:bg-gray-700 rounded-md"
                >
                    <MdLogout size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default UserSidebar;