import { useState, useEffect, useRef } from 'react';  // Add useRef import
import ProductCard from '../components/ProductCard';
import CategoryScroll from '../components/CategoryScroll';
import OrderSummary from '../components/OrderSummary';
import { getAllCategories, type Category } from '../services/CategoryService';
import { getAllBrands } from '../services/BrandService';
import { getAllProducts  } from '../services/ProductService';
import AddToCartModal from '../components/AddToCartModal';
import type { Product } from '../types/Product';
import type { SaleDTO, SaleItemDTO } from '../types/Sale';
import { saveSale } from '../services/SaleService';
import BarcodeScanner from '../components/BarcodeScanner';

interface Brand {
  brandId: string | number;
  brandName: string;  // Changed from 'name' to 'brandName'
}

const PosPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [orderItems, setOrderItems] = useState<SaleItemDTO[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [customerId, _setCustomerId] = useState<number | null>(null);
  const [userId] = useState<number>(1); // Replace with actual user logic
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null!); // Changed from null to null!

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

  const handleUpdateQuantity = (productId: string, change: number) => {
    setOrderItems(items =>
      items
        .map(item =>
          item.productId === Number(productId)
            ? { ...item, qty: Math.max(0, item.qty + change) }
            : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const handleAddToOrder = (product: Product, quantity: number, discount: number) => {
    setOrderItems(items => {
      const existingItem = items.find(item => item.productId === Number(product.productId));
      if (existingItem) {
        return items.map(item =>
          item.productId === Number(product.productId)
            ? {
                ...item,
                qty: item.qty + quantity,
                discount: discount,
                price: product.salePrice * (1 - discount / 100),
              }
            : item
        );
      }
      return [
        ...items,
        {
          productId: Number(product.productId),
          qty: quantity,
          price: product.salePrice * (1 - discount / 100),
          discount: discount,
        },
      ];
    });
    setIsQuantityModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsQuantityModalOpen(true);
  };

  const handleBarcodeScan = async (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setSelectedProduct(product);
      setIsQuantityModalOpen(true);
    } else {
      // Show error notification or alert
      alert('Product not found');
    }
  };

  // Helper to calculate totals
  const getTotals = () => {
    let totalAmount = 0;
    let totalDiscount = 0;
    orderItems.forEach(item => {
      const originalPrice = products.find(p => Number(p.productId) === item.productId)?.salePrice || 0;
      totalAmount += item.price * item.qty;
      totalDiscount += (originalPrice - item.price) * item.qty;
    });
    return { totalAmount, totalDiscount };
  };

  // Prepare SaleDTO for sending
  const prepareSaleDTO = (): SaleDTO => {
    const { totalAmount, totalDiscount } = getTotals();
    return {
      saleId: null,
      saleDate: null,
      totalAmount,
      totalDiscount,
      paymentMethod,
      userId,
      customerId,
      saleItems: orderItems.map(item => ({
        saleItemId: null,
        saleId: null,
        productId: item.productId,
        qty: item.qty,
        price: item.price,
        discount: item.discount,
      })),
    };
  };

  // Updated handleCheckout function with detailed logging
  const handleCheckout = async () => {
    const saleDTO = prepareSaleDTO();
    try {
      const response = await saveSale(saleDTO);
      if (response.statusCode === 201) {
        setOrderItems([]); // Clear the order items
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setOrderItems(items => items.filter(item => item.productId !== Number(productId)));
  };

  const focusBarcodeInput = () => {
    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white flex gap-4 p-4 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full gap-4 overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg px-4 py-2 border border-gray-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            {/* Simplified Barcode Scanner Button */}
            <button
              onClick={() => setIsBarcodeModalOpen(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
            >
              Scan Barcode
            </button>

            {/* Existing view mode toggle */}
            <div className="bg-gray-100 rounded p-1 flex border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded transition-all duration-300 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-black hover:bg-gray-200'
                }`}
              >
                <span className="inline-block mr-1 align-middle">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/><rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/></svg>
                </span>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded transition-all duration-300 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-black hover:bg-gray-200'
                }`}
              >
                <span className="inline-block mr-1 align-middle">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="4" rx="2" fill="currentColor"/><rect x="3" y="15" width="18" height="4" rx="2" fill="currentColor"/></svg>
                </span>
                List
              </button>
            </div>
          </div>
          
          {/* Search input - always visible now */}
          <div className="flex items-center ml-4 flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-gray-50"
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
        <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-100 flex-1 overflow-hidden">
          <div className={`h-full overflow-y-auto p-2 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
          }`}>
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-lg font-medium">No products found</span>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
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
      <div className="w-96 h-full flex flex-col">
        <OrderSummary
          items={orderItems}
          products={products}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
        {/* Checkout Section */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 text-red-600 border border-red-100 rounded font-medium hover:bg-red-50 transition-colors"
              onClick={() => setOrderItems([])}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700"
              onClick={handleCheckout}
              disabled={orderItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isQuantityModalOpen && selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={() => {
            setIsQuantityModalOpen(false);
            setSelectedProduct(null);
            setIsBarcodeModalOpen(true);
            focusBarcodeInput();
          }}
          onAdd={(product, quantity, discount) => {
            handleAddToOrder(product, quantity, discount);
            setIsBarcodeModalOpen(true);
            focusBarcodeInput();
          }}
        />
      )}

      <BarcodeScanner
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onScan={handleBarcodeScan}
        inputRef={barcodeInputRef}
      />
    </div>
  );
};

export default PosPage;