import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  Download, 
  ExternalLink,
  Award,
  FileText,
  Globe,
  Leaf
} from 'lucide-react';

const Certifications = () => {
  const legalCredentials = [
    {
      title: 'GST Verification',
      number: '27GXGPP2119L1Z2',
      description: 'Goods and Services Tax Identification Number - Active and verified with Indian tax authorities',
      issuer: 'Government of India',
      status: 'Active',
      icon: Shield,
      color: 'green'
    },
    {
      title: 'UDYAM Registration',
      number: 'UDYAM-MH-18-0434771',
      description: 'Micro, Small and Medium Enterprises registration certificate for business operations',
      issuer: 'Ministry of MSME, India',
      status: 'Valid',
      icon: Award,
      color: 'blue'
    },
    {
      title: 'Import Export Code (IEC)',
      number: 'GXGPP2119L',
      description: 'Mandatory code for international trade operations issued by DGFT',
      issuer: 'Directorate General of Foreign Trade',
      status: 'Active',
      icon: Globe,
      color: 'orange'
    }
  ];

  const qualityCertifications = [
    {
      title: 'FSSAI License',
      description: 'Food Safety and Standards Authority of India certification for food products',
      scope: 'All food products including spices and health supplements',
      validity: '2025-2028',
      icon: Shield
    },
    {
      title: 'Organic Certification',
      description: 'Certified organic products meeting international organic standards',
      scope: 'Moringa powder, selected spices, and Makhana',
      validity: '2024-2027',
      icon: Leaf
    },
    {
      title: 'ISO 22000',
      description: 'Food Safety Management System certification',
      scope: 'Complete food safety management across all operations',
      validity: '2023-2026',
      icon: Award
    },
    {
      title: 'Spices Board Certification',
      description: 'Quality certification from Spices Board of India',
      scope: 'All spice products and spice blends',
      validity: '2024-2027',
      icon: FileText
    }
  ];

  const verificationLinks = [
    {
      title: 'GST Portal Verification',
      description: 'Verify our GST status directly on government portal',
      url: 'https://services.gst.gov.in/services/searchtp',
      icon: ExternalLink
    },
    {
      title: 'UDYAM Registration Portal',
      description: 'Check UDYAM registration details',
      url: 'https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm',
      icon: ExternalLink
    },
    {
      title: 'IEC Verification',
      description: 'Verify Import Export Code status',
      url: 'https://dgft.gov.in/',
      icon: ExternalLink
    }
  ];

  const faqItems = [
    {
      question: 'Is Croxy Exim GST Verified?',
      answer: 'Yes, Croxy Exim is GST verified with GSTIN: 27GXGPP2119L1Z2. You can verify this directly on the GST portal.'
    },
    {
      question: 'What certifications do your products have?',
      answer: 'Our products are certified by FSSAI, Spices Board of India, and many have organic certifications. Specific certifications vary by product category.'
    },
    {
      question: 'Are your export operations legally compliant?',
      answer: 'Yes, we hold all necessary licenses including IEC (GXGPP2119L) and UDYAM registration (UDYAM-MH-18-0434771) for legal export operations.'
    },
    {
      question: 'How can I verify your credentials?',
      answer: 'All our credentials can be verified through official government portals. We provide direct links and certificate copies for verification.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">Verified & Compliant</span><br />
            Trust Croxy Exim for Legitimate Exports
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Complete transparency with all legal credentials, quality certifications, and verification links for your peace of mind.
          </p>
        </div>
      </section>

      {/* Legal Credentials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Legal Credentials
            </h2>
            <p className="text-lg text-gray-600">
              All government-issued licenses and registrations for legal business operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {legalCredentials.map((credential, index) => (
              <Card key={index} className="p-6 border-l-4 border-l-green-500">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <credential.icon className={`w-8 h-8 text-${credential.color}-600`} />
                    <span className={`bg-${credential.color}-100 text-${credential.color}-700 px-3 py-1 rounded-full text-sm font-medium`}>
                      {credential.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{credential.title}</h3>
                    <div className="bg-gray-100 rounded-lg p-3 mb-3">
                      <p className="font-mono text-sm text-gray-900 break-all">{credential.number}</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{credential.description}</p>
                    <p className="text-sm text-gray-500">Issued by: {credential.issuer}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Verification Links
            </h2>
            <p className="text-lg text-gray-600">
              Verify our credentials directly through official government portals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verificationLinks.map((link, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <link.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                  <p className="text-gray-600 text-sm">{link.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Verify Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Quality Certifications
            </h2>
            <p className="text-lg text-gray-600">
              International quality standards and certifications for our products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {qualityCertifications.map((cert, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <cert.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cert.title}</h3>
                      <p className="text-sm text-green-600">Valid until {cert.validity}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{cert.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Scope:</span> {cert.scope}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about our certifications and compliance
            </p>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed pl-7">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Verified. Compliant. Trustworthy.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Partner with a fully certified and legally compliant export company
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Download All Certificates
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600">
              Contact for Verification
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Certifications;

