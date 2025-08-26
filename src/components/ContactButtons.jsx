import { useState, useEffect } from 'react';
import { MessageCircle, Mail, X, Phone } from 'lucide-react';

const ContactButtons = () => {
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  
  // Updated phone numbers as per requirement
  const whatsappNumber = '918976054993'; // Format for WhatsApp API (country code without +)
  const displayNumber = '+91 89760 54993';
  const secondaryNumber = '+91 93043 86261';
  const emailAddress = 'info@croxyexim.com';

  useEffect(() => {
    // Show WhatsApp popup after 5 seconds
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('whatsappPopupShown')) {
        setShowWhatsAppPopup(true);
        sessionStorage.setItem('whatsappPopupShown', 'true');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I am interested in importing agricultural products from India. Please provide more information.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Inquiry about Import/Export Services');
    const body = encodeURIComponent('Hello,\n\nI am interested in your import/export services and would like to learn more about your products.\n\nPlease provide me with more information.\n\nThank you.');
    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const closeWhatsAppPopup = () => {
    setShowWhatsAppPopup(false);
  };

  const closeEmailPopup = () => {
    setShowEmailPopup(false);
  };

  return (
    <>
      {/* Email Button - Left Side */}
      <div className="fixed bottom-6 left-6 z-50">
        {/* Email Popup Message */}
        {showEmailPopup && (
          <div className="absolute bottom-20 left-0 bg-white rounded-lg shadow-2xl p-4 w-80 animate-slide-up">
            <button
              onClick={closeEmailPopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Send us an Email</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Get detailed information and quotes via email!
                </p>
                <p className="text-sm font-semibold text-blue-600">{emailAddress}</p>
              </div>
            </div>
            <button
              onClick={handleEmailClick}
              className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Send Email
            </button>
          </div>
        )}

        {/* Main Email Button */}
        <button
          onClick={handleEmailClick}
          onMouseEnter={() => setShowEmailPopup(true)}
          onMouseLeave={() => setShowEmailPopup(false)}
          className="group relative bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110"
          aria-label="Send Email"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          
          {/* Icon */}
          <Mail className="w-7 h-7 relative z-10" />
          
          {/* Hover Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Send Email
              <div className="text-xs mt-1">{emailAddress}</div>
            </div>
          </div>
        </button>
      </div>

      {/* WhatsApp Button - Right Side */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* WhatsApp Popup Message */}
        {showWhatsAppPopup && (
          <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-4 w-80 animate-slide-up">
            <button
              onClick={closeWhatsAppPopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Chat with us on WhatsApp for instant support and quotes!
                </p>
                <p className="text-sm font-semibold text-green-600">{displayNumber}</p>
                <p className="text-xs text-gray-500">Also: {secondaryNumber}</p>
              </div>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Start Chat
            </button>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="group relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          
          {/* Icon */}
          <MessageCircle className="w-7 h-7 relative z-10" fill="white" />
          
          {/* Hover Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Chat on WhatsApp
              <div className="text-xs mt-1">{displayNumber}</div>
            </div>
          </div>
        </button>

        {/* Click to Call Button (Mobile) */}
        <button
          onClick={() => window.location.href = `tel:${displayNumber.replace(/\s/g, '')}`}
          className="mt-3 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 lg:hidden"
          aria-label="Call Now"
        >
          <Phone className="w-5 h-5" />
        </button>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ContactButtons;