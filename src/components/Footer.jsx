import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Exports', href: '/exports' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const productCategories = [
    { name: 'Spices', href: '/products?category=spices' },
    { name: 'Makhana', href: '/products?category=makhana' },
    { name: 'Moringa Powder', href: '/products?category=moringa' },
    { name: 'Other Goods', href: '/products?category=other' }
  ];

  const legalCredentials = [
    { label: 'GSTIN', value: '27GXGPP2119L1Z2' },
    { label: 'Legal Name', value: 'MD Altaf Pravez' },
    { label: 'Trade Name', value: 'Croxy Exim' },
    { label: 'UDYAM Registration', value: 'UDYAM-MH-18-0434771' },
    { label: 'IEC', value: 'GXGPP2119L' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Croxy Exim</span>
                <span className="text-sm text-gray-400">Premium Indian Exports</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner in Indian exports. We specialize in premium spices, Makhana, 
              natural Moringa powder, and other quality products to global markets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Products</h3>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.href} 
                    className="text-gray-300 hover:text-orange-500 transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">info@croxyexim.com</p>
                  <p className="text-sm text-gray-300">sales@croxyexim.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">+91 89760 54993</p>
                  <p className="text-sm text-gray-300">+91 93043 86261</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Shop No. 220, 1st Floor,<br />
                  Citi Mall, Andheri,<br />
                  Mumbai - 400053
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Credentials Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-center">Legal Credentials & Verification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {legalCredentials.map((credential) => (
              <div key={credential.label} className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{credential.label}</p>
                <p className="text-sm font-mono text-white mt-1 break-all">{credential.value}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            All credentials are verified and compliant with Indian export regulations
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Croxy Exim | All Rights Reserved
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
              <Button
                onClick={scrollToTop}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-400 hover:text-white hover:border-orange-500"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

