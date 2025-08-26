import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Globe, 
  Shield, 
  TrendingUp, 
  Award,
  Ship,
  FileText,
  Users,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    products: 0,
    countries: 0,
    clients: 0,
    experience: 0
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchServices();
    animateStats();
  }, []);

  const fetchFeaturedProducts = async () => {
    // Featured Products (Mock Data)
    setFeaturedProducts([
      {
        id: 100,
        name: "Makhana Spices",
        category: "Spices",
        description: "Premium quality Makhana spices sourced from India.",
        origin_country: "India",
        images: ["/images/makhana.avif"]
      },
      {
        id: 2,
        name: "Green Cardamom",
        category: "Spices",
        description: "Fresh aromatic cardamom pods for global trade.",
        origin_country: "India",
        images: ["/images/Green Cardamom.jpeg"]
      },
      {
        id: 3,
        name: "Premium Turmeric Powder",
        category: "Spices",
        description: "Pure and high-curcumin content turmeric powder, processed from finest quality turmeric fingers.",
        origin_country: "India",
        images: ["/images/Premium Turmeric Powder.webp"]
      },
      {
        id: 1,
        name: "Premium Basmati Rice (1121)",
        category: "Grains",
        description: "Premium quality 1121 Basmati Rice with extra long grain, aromatic fragrance, and excellent cooking properties. Ideal for biryani and pulao.",
        origin_country: "India",
        images: ["/images/Basmati Rice (1121).webp"]
      },
      {
        id: 5,
        name: "Cashew Nuts (W320)",
        category: "Dry Fruits",
        description: "Premium grade W320 cashew nuts, white whole cashews with 320 counts per pound.",
        origin_country: "India",
        images: ["/images/Cashew Nuts (W320).jpg"]
      },
      {
        id: 6,
        name: "Red Chili Powder",
        category: "Spices",
        description: "Premium quality red chili powder with vibrant color and optimal heat level.",
        origin_country: "India",
        images: ["/images/Red Chili Powder 4.jpg"]
      }
    ]);
  };

  const fetchServices = async () => {
    setServices([]);
  };

  const animateStats = () => {
    const targets = {
      products: 500,
      countries: 45,
      clients: 200,
      experience: 7
    };

    Object.keys(targets).forEach(key => {
      let current = 0;
      const increment = targets[key] / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targets[key]) {
          current = targets[key];
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 20);
    });
  };

  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      company: "Global Trade Co.",
      rating: 5,
      text: "Excellent service and quality products. Their export documentation support made international trade seamless for us."
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "Import Solutions Ltd.",
      rating: 5,
      text: "Professional team with deep knowledge of import/export regulations. Highly recommended for anyone in international trade."
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      company: "Middle East Trading",
      rating: 5,
      text: "Reliable partner for our import needs. They handle everything from sourcing to delivery with utmost professionalism."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Gateway to Global Trade Excellence
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Connecting businesses worldwide with premium import and export solutions. 
              Experience seamless international trade with our comprehensive services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Browse Products <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.products}+</div>
              <div className="text-gray-600 mt-2">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.countries}+</div>
              <div className="text-gray-600 mt-2">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.clients}+</div>
              <div className="text-gray-600 mt-2">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.experience}+</div>
              <div className="text-gray-600 mt-2">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully selected range of high-quality products for import and export
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {product.origin_country}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg">
                View All Products <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive trade solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={service.id || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {service.category === 'logistics' && <Ship className="h-6 w-6 text-blue-600" />}
                    {service.category === 'documentation' && <FileText className="h-6 w-6 text-blue-600" />}
                    {service.category === 'compliance' && <Shield className="h-6 w-6 text-blue-600" />}
                    {service.category === 'finance' && <TrendingUp className="h-6 w-6 text-blue-600" />}
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features && service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <ChevronRight className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About Croxy Export Import
              </h2>
              <p className="text-gray-600 mb-4">
                With over 7 years of experience in international trade, we've established ourselves 
                as a trusted partner for businesses looking to expand their global reach. Our expertise 
                spans across multiple industries and continents.
              </p>
              <p className="text-gray-600 mb-6">
                We specialize in connecting buyers and sellers worldwide, providing end-to-end solutions 
                that include sourcing, logistics, documentation, and compliance. Our commitment to quality 
                and customer satisfaction has made us a leader in the import-export industry.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">ISO Certified</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">Global Network</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">Secure Trade</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm">Expert Team</span>
                </div>
              </div>
              <Link to="/about">
                <Button>Learn More About Us</Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600" 
                alt="Global Trade"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg">
                <div className="text-3xl font-bold">7+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Expand Your Business Globally?
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Get in touch with our experts today and discover how we can help you succeed in international trade
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Send Enquiry
              </Button>
            </Link>
            <a href="tel:+918976054993">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>123 Trade Street, Business District</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>+918976054993</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <span>info@croxy-exim.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
