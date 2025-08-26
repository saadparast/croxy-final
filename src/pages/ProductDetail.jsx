import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../data/products';
import { 
  Package, 
  MapPin, 
  Globe,
  Award,
  Truck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  FileText,
  Check,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get product from mock data
      const productData = getProductById(id);
      
      if (productData) {
        setProduct(productData);
        setRelatedProducts(getRelatedProducts(id));
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleEnquiry = () => {
    navigate(`/contact?product=${id}&name=${encodeURIComponent(product.name)}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage = '/images/placeholder.svg';
  const images = product.images && product.images.length > 0 ? product.images : [defaultImage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-4">
              <img 
                src={images[selectedImage]?.url || images[selectedImage] || defaultImage}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image.url || image || defaultImage}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge>{product.category}</Badge>
                {product.subcategory && <Badge variant="outline">{product.subcategory}</Badge>}
                {product.featured && <Badge variant="secondary">Featured</Badge>}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Key Information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Origin:</span>
                  <span className="ml-2 font-medium">
                    {product.origin_country}
                    {product.origin_region && `, ${product.origin_region}`}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Availability:</span>
                  <span className="ml-2 font-medium capitalize">
                    {product.availability || 'In Stock'}
                  </span>
                </div>

                {product.lead_time && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Lead Time:</span>
                    <span className="ml-2 font-medium">{product.lead_time}</span>
                  </div>
                )}

                {product.min_order_quantity && (
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Min Order:</span>
                    <span className="ml-2 font-medium">{product.min_order_quantity}</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {product.price || 'Contact for Quotation'}
                  </div>
                  <p className="text-sm text-gray-600">
                    * Prices may vary based on quantity and specifications
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleEnquiry}>
                  Send Enquiry
                </Button>
                <Button size="lg" variant="outline">
                  <FileText className="mr-2 h-5 w-5" />
                  Download Brochure
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-1 text-green-600" />
                Quality Assured
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-1 text-blue-600" />
                Global Shipping
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 mr-1 text-green-600" />
                Verified Supplier
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="specifications" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Delivery</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications?.hsCode && (
                    <div>
                      <span className="text-gray-600">HS Code:</span>
                      <span className="ml-2 font-medium">{product.specifications.hsCode}</span>
                    </div>
                  )}
                  {product.specifications?.weight && (
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <span className="ml-2 font-medium">{product.specifications.weight}</span>
                    </div>
                  )}
                  {product.specifications?.dimensions && (
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="ml-2 font-medium">{product.specifications.dimensions}</span>
                    </div>
                  )}
                  {product.specifications?.packaging && (
                    <div>
                      <span className="text-gray-600">Packaging:</span>
                      <span className="ml-2 font-medium">{product.specifications.packaging}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      We offer worldwide shipping with multiple carrier options. Delivery times and costs vary based on destination and order quantity.
                    </AlertDescription>
                  </Alert>
                  
                  {product.specifications?.incoterms && (
                    <div>
                      <h4 className="font-semibold mb-2">Available Incoterms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.specifications.incoterms.map((term, index) => (
                          <Badge key={index} variant="secondary">{term}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Shipping Methods:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Sea Freight (20-35 days)</li>
                      <li>Air Freight (5-10 days)</li>
                      <li>Express Courier (3-5 days)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                {product.specifications?.certifications && product.specifications.certifications.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.specifications.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="h-5 w-5 text-green-600 mr-2" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    All our products meet international quality standards. Specific certifications are available upon request.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Payment Terms:</h4>
                    <p>T/T (30% advance, 70% before shipment), L/C at sight, or as agreed</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Assurance:</h4>
                    <p>100% quality inspection before shipment with detailed report</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sample Policy:</h4>
                    <p>Samples available upon request. Sample cost refundable with bulk orders</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Returns & Refunds:</h4>
                    <p>Subject to inspection and agreement. Please contact our customer service for details</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    {relatedProduct.images && relatedProduct.images[0] ? (
                      <img 
                        src={relatedProduct.images[0].url || relatedProduct.images[0]} 
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{relatedProduct.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {relatedProduct.origin_country}
                      </span>
                      <span className="text-sm font-semibold">
                        {relatedProduct.price}
                      </span>
                    </div>
                    <Link to={`/product/${relatedProduct.id}`}>
                      <Button className="w-full" size="sm">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;