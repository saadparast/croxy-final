import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Truck, 
  Package, 
  CheckCircle, 
  ArrowRight,
  MapPin,
  DollarSign,
  Clock,
  Shield
} from 'lucide-react';

const Exports = () => {
  const exportProcess = [
    {
      step: 1,
      title: 'Inquiry',
      description: 'Submit your product requirements and quantity needs through our inquiry form',
      icon: '📝'
    },
    {
      step: 2,
      title: 'Quote',
      description: 'Receive detailed quotation with pricing, specifications, and delivery timeline',
      icon: '💰'
    },
    {
      step: 3,
      title: 'Order',
      description: 'Confirm your order with advance payment and finalize terms & conditions',
      icon: '📋'
    },
    {
      step: 4,
      title: 'Packaging',
      description: 'Professional packaging with export-grade materials and quality certifications',
      icon: '📦'
    },
    {
      step: 5,
      title: 'Shipping',
      description: 'Coordinate with logistics partners for customs clearance and transportation',
      icon: '🚢'
    },
    {
      step: 6,
      title: 'Delivery',
      description: 'Track shipment and ensure timely delivery to your destination port',
      icon: '✅'
    }
  ];

  const destinations = [
    {
      region: 'North America',
      countries: ['USA', 'Canada'],
      volume: '25%',
      specialties: ['Spices', 'Moringa Powder']
    },
    {
      region: 'Europe',
      countries: ['Germany', 'UK', 'Netherlands', 'France'],
      volume: '35%',
      specialties: ['Organic Products', 'Makhana']
    },
    {
      region: 'Middle East',
      countries: ['UAE', 'Saudi Arabia', 'Qatar'],
      volume: '30%',
      specialties: ['Premium Spices', 'Traditional Blends']
    },
    {
      region: 'Asia Pacific',
      countries: ['Singapore', 'Malaysia', 'Australia'],
      volume: '10%',
      specialties: ['Health Products', 'Superfoods']
    }
  ];

  const caseStudies = [
    {
      title: 'Exported 10 tons of Makhana to UAE',
      client: 'Premium Foods Trading LLC',
      location: 'Dubai, UAE',
      description: 'Successfully delivered premium quality Makhana with organic certification, meeting strict UAE food safety standards.',
      results: ['100% Quality Compliance', 'On-time Delivery', 'Repeat Orders Secured'],
      image: '/src/assets/product_makhana.png'
    },
    {
      title: 'Bulk Moringa Powder to European Markets',
      client: 'Natural Health Europe GmbH',
      location: 'Berlin, Germany',
      description: 'Supplied 5 tons of organic Moringa powder with complete documentation and EU compliance certificates.',
      results: ['EU Organic Certified', 'Zero Rejections', 'Long-term Partnership'],
      image: '/src/assets/product_moringa_powder.png'
    },
    {
      title: 'Premium Spice Mix to North America',
      client: 'Global Spice Importers Inc.',
      location: 'New York, USA',
      description: 'Delivered custom spice blends meeting FDA requirements with complete traceability documentation.',
      results: ['FDA Compliant', 'Custom Packaging', 'Market Expansion'],
      image: '/src/assets/product_spice_mix.png'
    }
  ];

  const services = [
    {
      icon: Package,
      title: 'Custom Packaging',
      description: 'Tailored packaging solutions meeting international standards and customer requirements'
    },
    {
      icon: Truck,
      title: 'Logistics Partnerships',
      description: 'Reliable shipping partners ensuring safe and timely delivery to global destinations'
    },
    {
      icon: DollarSign,
      title: 'Flexible Payment Options',
      description: 'Multiple payment methods including LC, TT, and other secure international payment terms'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Comprehensive quality checks and certifications ensuring product integrity'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/src/assets/hero_spices.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-blue-600">Global Export</span><br />
                Services
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Seamless export solutions connecting premium Indian products to international markets with complete compliance and reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Start Export Process
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  View Destinations
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-32 h-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Export Process
            </h2>
            <p className="text-lg text-gray-600">
              Simple, transparent, and efficient process from inquiry to delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exportProcess.map((step, index) => (
              <Card key={step.step} className="relative p-6 hover:shadow-lg transition-shadow">
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
                {index < exportProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Export Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Export Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Exporting to major markets worldwide with customs-cleared and compliant products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{destination.region}</h3>
                    <span className="text-2xl font-bold text-blue-600">{destination.volume}</span>
                  </div>
                  <div className="space-y-2">
                    {destination.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{country}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.specialties.map((specialty, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Real examples of successful export operations and satisfied clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{study.title}</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{study.client}</p>
                    <p>{study.location}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{study.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Results:</p>
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{result}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Export Services
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive services to ensure smooth and successful export operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Exporting?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get in touch with our export specialists for personalized assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Request Export Quote
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              Download Export Guide
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exports;

