import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryScroll from '../components/CategoryScroll';
import OrderSummary from '../components/OrderSummary';
import { getAllCategories, type Category } from '../services/CategoryService';
import { getAllBrands } from '../services/BrandService';
import { getAllProducts  } from '../services/ProductService';
import AddToCartModal from '../components/AddToCartModal';
import type { Product } from '../types/Product';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  originalPrice: number;
}

interface Brand {
  brandId: string | number;
  brandName: string;  // Changed from 'name' to 'brandName'
}



const PosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData, productsData] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
          getAllProducts()
        ]);
        
        setCategories([
          { categoryId: 'all', name: 'All Categories' },
          ...categoriesData.categoryDTOList
        ]);
        
        setBrands([
          { brandId: 'all', brandName: 'All Brands' },
          ...brandsData.brandDTOList
        ]);

        setProducts(productsData.productDTOList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category, brand, and search
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.categoryId.toString() === selectedCategory;
    const brandMatch = selectedBrand === 'all' || product.brandId.toString() === selectedBrand;
    const searchMatch = product.productName.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && brandMatch && searchMatch;
  });

  const handleUpdateQuantity = (id: string, change: number) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleAddToOrder = (product: Product, quantity: number, discount: number) => {
    setOrderItems(items => {
      const existingItem = items.find(item => item.id === product.productId);
      if (existingItem) {
        return items.map(item =>
          item.id === existingItem.id
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                discount: discount,
                originalPrice: product.salePrice,
                price: product.salePrice * (1 - discount/100)
              }
            : item
        );
      }
      return [...items, {
        id: product.productId,
        name: product.productName,
        originalPrice: product.salePrice,
        price: product.salePrice * (1 - discount/100),
        quantity: quantity,
        discount: discount
      }];
    });
    setIsQuantityModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsQuantityModalOpen(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white flex gap-4 p-4 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full gap-4 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Point of Sale</h1>
            <div className="bg-gray-100 rounded p-1 flex border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded transition-all duration-300 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-black hover:bg-gray-200'
                }`}
              >
                <span className="inline-block mr-1 align-middle">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/></svg>
                </span>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition-all duration-300 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-black hover:bg-gray-200'
                }`}
              >
                <span className="inline-block mr-1 align-middle">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="4" rx="2" fill="currentColor"/><rect x="3" y="15" width="18" height="4" rx="2" fill="currentColor"/></svg>
                </span>
                List
              </button>
            </div>
          </div>
          {/* Search Bar */}
          <div className="flex items-center mt-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-gray-50"
            />
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <CategoryScroll
            items={categories.map(cat => ({
              id: cat.categoryId?.toString() || 'all',
              name: cat.name
            }))}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Brands Scroll */}
        <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <CategoryScroll
            items={brands.map(brand => ({
              id: brand.brandId.toString(),
              name: brand.brandName
            }))}
            selected={selectedBrand}
            onSelect={setSelectedBrand}
          />
        </div>

        {/* Products Grid/List */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 flex-1 overflow-hidden">
          <div className={`h-full overflow-y-auto transition-all ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-fr'
              : 'flex flex-col gap-4'
          }`}>
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-48 text-gray-400 text-lg font-semibold">
                No products found.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  name={product.productName}
                  price={product.salePrice}
                  image={product.image || "/placeholder.jpg"}
                  onAdd={() => handleProductSelect(product)}
                  view={viewMode}
                  stock={product.qty}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-96 h-full">
        <OrderSummary
          items={orderItems}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>

      {isQuantityModalOpen && selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={() => {
            setIsQuantityModalOpen(false);
            setSelectedProduct(null);
          }}
          onAdd={handleAddToOrder}
        />
      )}
    </div>
  );
};

export default PosPage;