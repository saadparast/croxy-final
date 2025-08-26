import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsData } from '../data/products';
import { 
  Package, 
  Filter,
  Search,
  MapPin,
  ChevronRight,
  Grid,
  List,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Skeleton } from '../components/ui/skeleton';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    country: '',
    sort: 'created_at',
    order: 'DESC'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);

  const categories = [
    { value: 'import', label: 'Import Products' },
    { value: 'export', label: 'Export Products' },
    { value: 'services', label: 'Services' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'documentation', label: 'Documentation' }
  ];

  const countries = [
    'USA', 'China', 'India', 'Germany', 'Japan', 'UK', 'France', 
    'Brazil', 'Canada', 'Australia', 'UAE', 'Singapore'
  ];

  const sortOptions = [
    { value: 'created_at-DESC', label: 'Newest First' },
    { value: 'created_at-ASC', label: 'Oldest First' },
    { value: 'name-ASC', label: 'Name (A-Z)' },
    { value: 'name-DESC', label: 'Name (Z-A)' },
    { value: 'views-DESC', label: 'Most Viewed' },
    { value: 'enquiry_count-DESC', label: 'Most Enquired' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.offset]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter products based on search and filters
      let filteredProducts = [...productsData];
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.subcategory.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filters.category
        );
      }
      
      // Apply country filter
      if (filters.country && filters.country !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
          product.origin_country === filters.country
        );
      }
      
      // Sort products
      filteredProducts.sort((a, b) => {
        if (filters.sort === 'name') {
          return filters.order === 'ASC' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        // Default to featured products first
        return b.featured - a.featured;
      });
      
      // Apply pagination
      const paginatedProducts = filteredProducts.slice(
        pagination.offset,
        pagination.offset + pagination.limit
      );
      
      setProducts(paginatedProducts);
      setPagination(prev => ({ ...prev, total: filteredProducts.length }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handleSortChange = (value) => {
    const [sort, order] = value.split('-');
    setFilters(prev => ({ ...prev, sort, order }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      country: '',
      sort: 'created_at',
      order: 'DESC'
    });
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-gray-200">
            Browse our extensive catalog of import and export products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger id="category" className="mt-2">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Filter */}
                <div>
                  <Label htmlFor="country">Country of Origin</Label>
                  <Select
                    value={filters.country}
                    onValueChange={(value) => handleFilterChange('country', value)}
                  >
                    <SelectTrigger id="country" className="mt-2">
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <span className="text-gray-600">
                  {pagination.total} products found
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={`${filters.sort}-${filters.order}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0].url || product.images[0]} 
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {product.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {product.origin_country}
                            </span>
                            <span className="text-sm font-semibold">
                              {product.price}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/product/${product.id}`} className="flex-1">
                              <Button className="w-full" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Link to={`/contact?product=${product.id}`}>
                              <Button variant="outline" size="sm">
                                Enquire
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <div className="flex gap-4 p-4">
                        <div className="w-32 h-32 flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0].url || product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <Badge>{product.category}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {product.origin_country}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {product.price}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/product/${product.id}`}>
                              <Button size="sm">View Details</Button>
                            </Link>
                            <Link to={`/contact?product=${product.id}`}>
                              <Button variant="outline" size="sm">Send Enquiry</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange((currentPage - 2) * pagination.limit)}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange((pageNum - 1) * pagination.limit)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={currentPage === totalPages ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange((totalPages - 1) * pagination.limit)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage * pagination.limit)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;