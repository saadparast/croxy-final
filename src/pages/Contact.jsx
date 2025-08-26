import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Globe,
  MessageSquare,
  Building,
  User,
  FileText,
  Package,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { API_ENDPOINTS } from '../config/api';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const productName = searchParams.get('name');

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userCompany: '',
    userDesignation: '',
    userCountry: '',
    userCity: '',
    enquiryType: 'product',
    subject: '',
    message: '',
    quantity: '',
    targetPrice: '',
    deliveryPort: '',
    deliveryTerms: '',
    paymentTerms: '',
    productId: productId || '',
    productName: productName || '',
    newsletter: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const enquiryTypes = [
    { value: 'product', label: 'Product Enquiry' },
    { value: 'service', label: 'Service Enquiry' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'general', label: 'General Enquiry' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'bulk', label: 'Bulk Order' }
  ];

  const countries = [
    'USA', 'China', 'India', 'Germany', 'Japan', 'UK', 'France', 
    'Brazil', 'Canada', 'Australia', 'UAE', 'Singapore', 'South Korea',
    'Italy', 'Spain', 'Mexico', 'Indonesia', 'Turkey', 'Saudi Arabia'
  ].sort();

  useEffect(() => {
    if (productId && productName) {
      setFormData(prev => ({
        ...prev,
        productId,
        productName,
        subject: `Enquiry for ${productName}`,
        enquiryType: 'product'
      }));
    }
  }, [productId, productName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Map form data to match PHP backend expectations
      const inquiryData = {
        name: formData.userName,
        email: formData.userEmail,
        phone: formData.userPhone,
        company: formData.userCompany,
        country: formData.userCountry,
        productInterest: formData.productName || formData.subject,
        customProduct: '',
        quantity: formData.quantity,
        deliveryPort: formData.deliveryPort,
        targetPrice: formData.targetPrice,
        certifications: [],
        message: formData.message,
        inquiryType: formData.enquiryType
      };

      const response = await fetch(API_ENDPOINTS.inquiries, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inquiryData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setReferenceNumber(data.referenceNumber);
        // Reset form
        setFormData({
          userName: '',
          userEmail: '',
          userPhone: '',
          userCompany: '',
          userDesignation: '',
          userCountry: '',
          userCity: '',
          enquiryType: 'product',
          subject: '',
          message: '',
          quantity: '',
          targetPrice: '',
          deliveryPort: '',
          deliveryTerms: '',
          paymentTerms: '',
          productId: '',
          productName: '',
          newsletter: false
        });
      } else {
        setError(data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200">
            Get in touch with our team for any enquiries or business opportunities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  We're here to help with your import/export needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Head Office</p>
                    <p className="text-sm text-gray-600">
                      Shop No. 220, 1st Floor,<br />
                      Citi Mall, Building No.3,<br />
                      New Link Road, Andheri,<br />
                      MUMBAI (M. CORP),<br />
                      MUMBAI - 400053
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">
                      +91 89760 54993<br />
                      +91 93043 86261
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">
                      info@croxyexim.com<br />
                      sales@croxyexim.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Global Presence</p>
                    <p className="text-sm text-gray-600">
                      Offices in 7+ countries worldwide
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">15+ Years of Experience</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">Global Network of Partners</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">24/7 Customer Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">Competitive Pricing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm">Quality Assured Products</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send Enquiry
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Thank you for your enquiry!</strong><br />
                      We have received your message and will respond within 24 hours.<br />
                      Your reference number is: <strong>{referenceNumber}</strong>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Product Info (if from product page) */}
                    {productName && (
                      <Alert className="mb-6">
                        <Package className="h-4 w-4" />
                        <AlertDescription>
                          Enquiring about: <strong>{productName}</strong>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userName">Full Name *</Label>
                        <Input
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <Label htmlFor="userEmail">Email Address *</Label>
                        <Input
                          id="userEmail"
                          name="userEmail"
                          type="email"
                          value={formData.userEmail}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="userPhone">Phone Number *</Label>
                        <Input
                          id="userPhone"
                          name="userPhone"
                          type="tel"
                          value={formData.userPhone}
                          onChange={handleChange}
                          required
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div>
                        <Label htmlFor="userCompany">Company Name</Label>
                        <Input
                          id="userCompany"
                          name="userCompany"
                          value={formData.userCompany}
                          onChange={handleChange}
                          placeholder="ABC Trading Co."
                        />
                      </div>

                      <div>
                        <Label htmlFor="userDesignation">Designation</Label>
                        <Input
                          id="userDesignation"
                          name="userDesignation"
                          value={formData.userDesignation}
                          onChange={handleChange}
                          placeholder="Purchase Manager"
                        />
                      </div>

                      <div>
                        <Label htmlFor="userCountry">Country</Label>
                        <Select
                          value={formData.userCountry}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, userCountry: value }))}
                        >
                          <SelectTrigger id="userCountry">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="userCity">City</Label>
                        <Input
                          id="userCity"
                          name="userCity"
                          value={formData.userCity}
                          onChange={handleChange}
                          placeholder="New York"
                        />
                      </div>

                      <div>
                        <Label htmlFor="enquiryType">Enquiry Type</Label>
                        <Select
                          value={formData.enquiryType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, enquiryType: value }))}
                        >
                          <SelectTrigger id="enquiryType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {enquiryTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Enquiry Details */}
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief subject of your enquiry"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Please provide details about your requirements..."
                      />
                    </div>

                    {/* Additional Details for Product/Bulk Enquiries */}
                    {(formData.enquiryType === 'product' || formData.enquiryType === 'bulk' || formData.enquiryType === 'quote') && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quantity">Quantity Required</Label>
                            <Input
                              id="quantity"
                              name="quantity"
                              value={formData.quantity}
                              onChange={handleChange}
                              placeholder="e.g., 1000 units"
                            />
                          </div>

                          <div>
                            <Label htmlFor="targetPrice">Target Price</Label>
                            <Input
                              id="targetPrice"
                              name="targetPrice"
                              value={formData.targetPrice}
                              onChange={handleChange}
                              placeholder="e.g., $50 per unit"
                            />
                          </div>

                          <div>
                            <Label htmlFor="deliveryPort">Delivery Port</Label>
                            <Input
                              id="deliveryPort"
                              name="deliveryPort"
                              value={formData.deliveryPort}
                              onChange={handleChange}
                              placeholder="e.g., New York Port"
                            />
                          </div>

                          <div>
                            <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                            <Select
                              value={formData.deliveryTerms}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTerms: value }))}
                            >
                              <SelectTrigger id="deliveryTerms">
                                <SelectValue placeholder="Select Terms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FOB">FOB</SelectItem>
                                <SelectItem value="CIF">CIF</SelectItem>
                                <SelectItem value="EXW">EXW</SelectItem>
                                <SelectItem value="DDP">DDP</SelectItem>
                                <SelectItem value="FCA">FCA</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor="paymentTerms">Payment Terms</Label>
                            <Input
                              id="paymentTerms"
                              name="paymentTerms"
                              value={formData.paymentTerms}
                              onChange={handleChange}
                              placeholder="e.g., T/T 30% advance, 70% before shipment"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Newsletter Subscription */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        name="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
                      />
                      <Label 
                        htmlFor="newsletter" 
                        className="text-sm font-normal cursor-pointer"
                      >
                        Subscribe to our newsletter for latest products and offers
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Enquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-200 h-96">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=72.830845,19.138123,72.832045,19.139123&amp;layer=mapnik&amp;marker=19.1386235,72.8314387"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Office Location - Citi Mall, Andheri, Mumbai (OpenStreetMap)"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;