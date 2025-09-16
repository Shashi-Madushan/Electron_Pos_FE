import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../services/CategoryService';
import { getAllBrands } from '../services/BrandService';
import { getActiveProducts } from '../services/ProductService';

interface Product {
    productId: string;
    productName: string;
    categoryId: number;
    brandId: number;
    cost: number;
    salePrice: number;
    qty: number;
    isActive: boolean;
    trackInventory: boolean;
    image?: string;
}

interface Category {
    categoryId: number;
    name: string;
}

interface Brand {
    brandId: number;
    brandName: string;
}

const InventoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const fetchCategories = async () => {
        const response = await getAllCategories();
        setCategories(response.categoryDTOList);
    };

    const fetchBrands = async () => {
        const response = await getAllBrands();
        setBrands(response.brandDTOList);
    };

    const fetchProducts = async () => {
        const response = await getActiveProducts();
        setProducts(response.productDTOList);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.categoryId === categoryId);
        return category ? category.name : 'Unknown';
    };

    const getBrandName = (brandId: number) => {
        const brand = brands.find(br => br.brandId === brandId);
        return brand ? brand.brandName : 'Unknown';
    };

    const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

    const getStatus = (stock: number): string => {
        if (stock === 0) return 'Out of Stock';
        if (stock < 10) return 'Low Stock';
        return 'In Stock';
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Out of Stock': return 'text-red-700 bg-red-50 border-red-100';
            case 'Low Stock': return 'text-yellow-700 bg-yellow-50 border-yellow-100';
            case 'In Stock': return 'text-green-700 bg-green-50 border-green-100';
            default: return 'text-gray-700 bg-gray-50 border-gray-100';
        }
    };

    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || getCategoryName(product.categoryId) === selectedCategory;
            const matchesStatus = statusFilter === 'All' || getStatus(product.qty) === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'name':
                    aValue = a.productName.toLowerCase();
                    bValue = b.productName.toLowerCase();
                    break;
                case 'price':
                    aValue = a.salePrice;
                    bValue = b.salePrice;
                    break;
                case 'stock':
                    aValue = a.qty;
                    bValue = b.qty;
                    break;
                default:
                    return 0;
            }

            return sortOrder === 'asc' ? 
                (aValue < bValue ? -1 : 1) : 
                (aValue > bValue ? -1 : 1);
        });

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-8xl mx-auto">
                {/* Controls Section */}
                <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            </span>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 flex-wrap">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                            >
                                <option value="All">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field as any);
                                    setSortOrder(order as any);
                                }}
                                className="px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                            >
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="price-asc">Price Low-High</option>
                                <option value="price-desc">Price High-Low</option>
                                <option value="stock-desc">Stock High-Low</option>
                            </select>
                            
                            {/* View Toggle */}
                            <div className="bg-gray-100 rounded p-1 flex border border-gray-200">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-4 py-2 rounded transition-all duration-300 text-sm font-medium ${
                                        viewMode === 'table'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-black hover:bg-gray-200'
                                    }`}
                                >
                                    Table
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-2 rounded transition-all duration-300 text-sm font-medium ${
                                        viewMode === 'grid'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-black hover:bg-gray-200'
                                    }`}
                                >
                                    Cards
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    {viewMode === 'table' ? (
                        <div className="overflow-x-auto max-h-[calc(100vh-20rem)] overflow-y-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 z-10 bg-blue-50 text-black border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">Product</th>
                                        <th className="p-4 text-left font-semibold">Category</th>
                                        <th className="p-4 text-left font-semibold">Brand</th>
                                        <th className="p-4 text-left font-semibold">Price</th>
                                        <th className="p-4 text-left font-semibold">Stock</th>
                                        <th className="p-4 text-left font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedProducts.map((product, index) => (
                                        <tr
                                            key={product.productId}
                                            className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image || `https://ui-avatars.com/api/?name=${product.productName}&background=fff&color=000`}
                                                        alt={product.productName}
                                                        className="w-10 h-10 rounded object-cover border border-gray-200"
                                                    />
                                                    <span className="font-medium text-black">{product.productName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                                    {getCategoryName(product.categoryId)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                                    {getBrandName(product.brandId)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-black">LKR {product.salePrice}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-medium text-black">{product.qty}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(getStatus(product.qty))}`}>
                                                    {getStatus(product.qty)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredAndSortedProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAndSortedProducts.map((product) => (
                                    <div key={product.productId} className="bg-white rounded border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="relative">
                                            <img
                                                src={product.image || `https://ui-avatars.com/api/?name=${product.productName}&background=fff&color=000`}
                                                alt={product.productName}
                                                className="w-full h-40 object-cover border-b border-gray-100"
                                            />
                                            <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(getStatus(product.qty))}`}>
                                                {getStatus(product.qty)}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                                    {getCategoryName(product.categoryId)}
                                                </span>
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                                    {getBrandName(product.brandId)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-black mb-2">{product.productName}</h3>
                                            <div className="flex justify-between items-center">
                                                <span className="text-black text-sm">Stock: {product.qty}</span>
                                                <span className="font-semibold text-blue-700">${product.salePrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {filteredAndSortedProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;