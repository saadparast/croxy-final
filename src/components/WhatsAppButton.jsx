import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const whatsappNumber = '918976054993'; // Format for WhatsApp API (country code without +)
  const displayNumber = '+91 89760 54993';

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('whatsappPopupShown')) {
        setShowPopup(true);
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

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Popup Message */}
        {showPopup && (
          <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-4 w-80 animate-slide-up">
            <button
              onClick={closePopup}
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


    </>
  );
};

export default WhatsAppButton;