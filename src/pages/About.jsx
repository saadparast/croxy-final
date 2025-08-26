import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Award, 
  Globe, 
  Users, 
  CheckCircle, 
  Download,
  MapPin,
  Calendar
} from 'lucide-react';

const About = () => {
  const legalCredentials = [
    { 
      label: 'GSTIN', 
      value: '27GXGPP2119L1Z2',
      description: 'Goods and Services Tax Identification Number - Verified and Active'
    },
    { 
      label: 'Legal Name', 
      value: 'MD Altaf Pravez',
      description: 'Registered legal entity name as per government records'
    },
    { 
      label: 'Trade Name', 
      value: 'Croxy Exim',
      description: 'Official business trading name for export operations'
    },
    { 
      label: 'UDYAM Registration', 
      value: 'UDYAM-MH-18-0434771',
      description: 'Micro, Small and Medium Enterprises registration certificate'
    },
    { 
      label: 'IEC', 
      value: 'GXGPP2119L',
      description: 'Import Export Code for international trade operations'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Croxy Exim established with a vision to export premium Indian products globally'
    },
    {
      year: '2019',
      title: 'First International Export',
      description: 'Successfully exported our first shipment of premium spices to Middle East markets'
    },
    {
      year: '2020',
      title: 'GST Verification',
      description: 'Obtained GST verification and expanded product range to include Makhana and Moringa'
    },
    {
      year: '2021',
      title: 'Quality Certifications',
      description: 'Achieved organic and quality certifications for all product categories'
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Extended export operations to USA, Europe, and Asia-Pacific regions'
    },
    {
      year: '2025',
      title: 'Digital Transformation',
      description: 'Launched comprehensive digital platform for enhanced customer experience'
    }
  ];

  const teamMembers = [
    {
      name: 'MD Altaf Pravez',
      position: 'Founder & Managing Director',
      description: 'Experienced entrepreneur with deep expertise in international trade and export operations. Leads strategic vision and business development.',
      image: '/api/placeholder/200/200'
    }
  ];

  const companyStats = [
    { icon: Globe, label: 'Countries Served', value: '15+' },
    { icon: Award, label: 'Years Experience', value: '7+' },
    { icon: Users, label: 'Happy Clients', value: '100+' },
    { icon: Shield, label: 'Certifications', value: '5+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/src/assets/hero_spices.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-orange-600">Croxy Exim</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Pioneering Indian Exports Since 2018 - Your trusted partner for premium quality products with verified credentials and global reach.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded by <strong>MD Altaf Pravez</strong>, Croxy Exim is a Maharashtra-based enterprise 
                  with no additional places of business, ensuring focused and dedicated operations. We hold 
                  UDYAM Registration <strong>UDYAM-MH-18-0434771</strong> and IEC <strong>GXGPP2119L</strong>, 
                  ensuring fully legal and compliant operations.
                </p>
                <p>
                  Our journey began with a simple vision: to share the authentic flavors and natural goodness 
                  of Indian products with the world. Today, we specialize in exporting premium spices, Makhana, 
                  natural Moringa powder, and other quality goods to international markets.
                </p>
                <p>
                  With GST verification <strong>(27GXGPP2119L1Z2)</strong> and comprehensive legal compliance, 
                  we have built a reputation for reliability, quality, and professional service in the global 
                  export industry.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {companyStats.map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="space-y-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <stat.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To deliver authentic Indian products worldwide while maintaining the highest standards 
                  of quality, sustainability, and customer satisfaction. We are committed to supporting 
                  local farmers and producers while bringing the best of India to global markets.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become a global leader in sustainable exports, recognized for our commitment to 
                  quality, innovation, and ethical business practices. We envision a world where 
                  premium Indian products are accessible to everyone, everywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              Dedicated professionals committed to excellence in every aspect of our business
            </p>
          </div>
          
          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <Card key={index} className="max-w-md">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-16 h-16 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-orange-600 font-medium">{member.position}</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Credentials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Legal Credentials & Verification
            </h2>
            <p className="text-lg text-gray-600">
              Fully verified and compliant with all Indian export regulations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalCredentials.map((credential, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{credential.label}</h3>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-mono text-sm text-gray-900 break-all">{credential.value}</p>
                  </div>
                  <p className="text-sm text-gray-600">{credential.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              All credentials are verified and can be cross-checked with respective government portals
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones in our growth and expansion
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="p-6">
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600 font-semibold">{milestone.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Headquarters</p>
                    <p className="text-gray-600">Maharashtra, India</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Strategically located in Maharashtra, we have access to some of India's finest 
                  agricultural regions, ensuring direct sourcing of premium quality products. 
                  Our location provides excellent connectivity for efficient export operations 
                  to global markets.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.830845,19.138123,72.832045,19.139123&amp;layer=mapnik&amp;marker=19.1386235,72.8314387"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.5rem', minHeight: '16rem' }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location - Citi Mall, Andheri, Mumbai (OpenStreetMap)"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

