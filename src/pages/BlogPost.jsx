import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Tag,
  Clock,
  Share2
} from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  
  // This would typically come from an API or database
  // For now, we'll use the same data structure as in Blog.jsx
  const blogPosts = [
    {
      id: 1,
      title: 'Benefits of Moringa Powder: The Ultimate Superfood Export',
      excerpt: 'Discover why Moringa powder is becoming one of the most sought-after superfoods in international markets and how to ensure quality exports.',
      content: `
        <p>Moringa powder has gained tremendous popularity in global health food markets due to its exceptional nutritional profile and numerous health benefits. As an export product, it represents a significant opportunity for Indian producers and exporters.</p>
        
        <h2>What Makes Moringa a Superfood?</h2>
        <p>Moringa oleifera, commonly known as the "miracle tree," is native to India and has been used in traditional medicine for centuries. The leaves are dried and ground into a fine powder, which contains:</p>
        <ul>
          <li>7 times more vitamin C than oranges</li>
          <li>4 times more vitamin A than carrots</li>
          <li>4 times more calcium than milk</li>
          <li>3 times more potassium than bananas</li>
          <li>2 times more protein than yogurt</li>
        </ul>
        
        <p>Additionally, moringa contains all nine essential amino acids, making it a complete protein source - a rare quality in plant-based foods.</p>
        
        <h2>Export Market Potential</h2>
        <p>The global moringa products market is projected to reach $10 billion by 2025, with powder being the most in-demand form. Key export markets include:</p>
        <ul>
          <li>North America (particularly the US and Canada)</li>
          <li>Europe (Germany, UK, France)</li>
          <li>Asia Pacific (Japan, South Korea, Australia)</li>
        </ul>
        
        <h2>Quality Standards for Export</h2>
        <p>To ensure successful exports, Indian moringa powder producers must meet stringent quality standards:</p>
        <ul>
          <li>Organic certification (USDA, EU Organic)</li>
          <li>Good Manufacturing Practices (GMP)</li>
          <li>HACCP certification</li>
          <li>ISO 22000 food safety management</li>
          <li>Testing for heavy metals, pesticides, and microbial contamination</li>
        </ul>
        
        <h2>Packaging and Shelf Life</h2>
        <p>Proper packaging is crucial for maintaining the nutritional integrity of moringa powder during export:</p>
        <ul>
          <li>Vacuum-sealed, food-grade packaging</li>
          <li>Protection from light, moisture, and heat</li>
          <li>Clear labeling with nutritional information</li>
          <li>Shelf life of 18-24 months when properly stored</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>As a premium export product, moringa powder offers significant opportunities for Indian producers. By ensuring consistent quality, proper certification, and effective marketing, exporters can capitalize on the growing global demand for this remarkable superfood.</p>
      `,
      category: 'product-spotlights',
      author: 'MD Altaf Pravez',
      date: '2025-01-15',
      readTime: '5 min read',
      image: '/src/assets/product_moringa_powder.png',
      tags: ['Moringa', 'Superfood', 'Health', 'Export']
    },
    {
      id: 2,
      title: 'Export Documentation: Complete Guide for Indian Spice Exporters',
      excerpt: 'A comprehensive guide to all the documentation required for exporting Indian spices to international markets.',
      content: `
        <p>Exporting spices from India requires careful attention to documentation and compliance with both Indian and international regulations. This guide covers the essential documents needed for successful spice exports.</p>
        
        <h2>Registration and Licensing</h2>
        <p>Before beginning the export process, ensure you have these foundational documents:</p>
        <ul>
          <li>Import Export Code (IEC) from the DGFT</li>
          <li>Registration cum Membership Certificate (RCMC) from Spices Board</li>
          <li>GST registration</li>
          <li>Business entity registration (company, partnership, etc.)</li>
        </ul>
        
        <h2>Quality Certification Documents</h2>
        <p>Indian spices must meet quality standards for international acceptance:</p>
        <ul>
          <li>Certificate of Analysis (COA)</li>
          <li>Spices Board Quality Certificate</li>
          <li>FSSAI certification</li>
          <li>Organic certification (if applicable)</li>
          <li>ISO certification</li>
        </ul>
        
        <h2>Shipping and Customs Documents</h2>
        <p>These documents facilitate the physical movement of goods:</p>
        <ul>
          <li>Commercial Invoice</li>
          <li>Packing List</li>
          <li>Bill of Lading or Airway Bill</li>
          <li>Shipping Bill/Bill of Export</li>
          <li>Certificate of Origin</li>
          <li>Phytosanitary Certificate</li>
        </ul>
        
        <h2>Payment and Financial Documents</h2>
        <p>To ensure proper payment and financial compliance:</p>
        <ul>
          <li>Letter of Credit (L/C) or other payment terms documentation</li>
          <li>Foreign Exchange Declaration Forms</li>
          <li>Bank Realization Certificate (BRC)</li>
          <li>Insurance Certificate</li>
        </ul>
        
        <h2>Market-Specific Requirements</h2>
        <p>Different markets may require additional documentation:</p>
        <ul>
          <li>EU: Health Certificate, TRACES registration</li>
          <li>USA: FDA registration, FSMA compliance</li>
          <li>Japan: JAS certification</li>
          <li>Middle East: Halal certification</li>
        </ul>
        
        <h2>Digital Documentation Systems</h2>
        <p>India has implemented several digital platforms to streamline export documentation:</p>
        <ul>
          <li>ICEGATE portal for customs clearance</li>
          <li>E-Sanchit for document upload</li>
          <li>Spices Board online services</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Proper documentation is the foundation of successful spice exports. By maintaining organized and compliant paperwork, Indian exporters can ensure smooth customs clearance and build trust with international buyers.</p>
      `,
      category: 'export-tips',
      author: 'Export Team',
      date: '2025-01-10',
      readTime: '8 min read',
      image: '/src/assets/hero_spices.png',
      tags: ['Documentation', 'Export', 'Spices', 'Compliance']
    },
    {
      id: 3,
      title: 'Makhana: From Bihar Farms to Global Markets',
      excerpt: 'Learn about the journey of premium Makhana from traditional Bihar farms to international health food markets.',
      content: `
        <p>Makhana, also known as fox nuts or lotus seeds, has a rich history in Bihar, India, where traditional cultivation methods have been passed down through generations. Today, this humble crop is making waves in international health food markets.</p>
        
        <h2>The Traditional Cultivation Process</h2>
        <p>Makhana cultivation is primarily concentrated in the Mithila region of Bihar, particularly in districts like Darbhanga, Madhubani, and Purnia. The cultivation process involves:</p>
        <ul>
          <li>Growing in shallow ponds and wetlands</li>
          <li>Hand-harvesting of seeds from beneath the water</li>
          <li>Traditional processing by skilled artisans</li>
          <li>Roasting over fire to create the puffed texture</li>
        </ul>
        
        <h2>Nutritional Profile and Health Benefits</h2>
        <p>Makhana has gained international popularity due to its impressive nutritional profile:</p>
        <ul>
          <li>Low in calories, high in protein</li>
          <li>Rich in antioxidants and flavonoids</li>
          <li>Good source of magnesium, potassium, and phosphorus</li>
          <li>Low glycemic index, making it suitable for diabetics</li>
          <li>Gluten-free and easily digestible</li>
        </ul>
        
        <h2>Value Addition and Processing</h2>
        <p>Modern processing has expanded the market potential for makhana:</p>
        <ul>
          <li>Flavored varieties (chocolate, cheese, spicy)</li>
          <li>Makhana flour for baking</li>
          <li>Ready-to-eat snack packs</li>
          <li>Premium gift packaging</li>
        </ul>
        
        <h2>Export Challenges and Solutions</h2>
        <p>Despite growing demand, makhana exporters face several challenges:</p>
        <ul>
          <li>Maintaining consistent quality across harvests</li>
          <li>Establishing cold chain logistics</li>
          <li>Meeting international food safety standards</li>
          <li>Competing with cheaper alternatives</li>
        </ul>
        <p>Solutions include farmer cooperatives, modern processing facilities, and geographical indication protection.</p>
        
        <h2>Target Export Markets</h2>
        <p>Key markets for Indian makhana exports include:</p>
        <ul>
          <li>United States and Canada (health food sector)</li>
          <li>Middle East (premium snack market)</li>
          <li>Southeast Asia (traditional medicine and snacks)</li>
          <li>Europe (organic and natural food segment)</li>
        </ul>
        
        <h2>Future Prospects</h2>
        <p>The global market for makhana is projected to grow at 7% annually through 2030, with particular growth in ready-to-eat formats and organic varieties. As international consumers increasingly seek nutritious, sustainable snack options, Bihar's traditional crop is positioned for continued export success.</p>
      `,
      category: 'product-spotlights',
      author: 'Product Team',
      date: '2025-01-05',
      readTime: '6 min read',
      image: '/src/assets/product_makhana.png',
      tags: ['Makhana', 'Bihar', 'Traditional', 'Health Food']
    },
    {
      id: 4,
      title: 'Quality Standards for Organic Spice Exports',
      excerpt: 'Understanding international quality standards and certifications required for organic spice exports.',
      content: 'Organic spice exports require adherence to strict quality standards...',
      category: 'export-tips',
      author: 'Quality Team',
      date: '2024-12-28',
      readTime: '7 min read',
      image: '/src/assets/product_spice_mix.png',
      tags: ['Organic', 'Quality', 'Standards', 'Certification']
    },
    {
      id: 5,
      title: 'Indian Spice Market Trends 2025',
      excerpt: 'Latest trends and opportunities in the global Indian spice market for exporters.',
      content: 'The global spice market continues to show strong growth...',
      category: 'industry-news',
      author: 'Market Research',
      date: '2024-12-20',
      readTime: '10 min read',
      image: '/src/assets/hero_spices.png',
      tags: ['Market Trends', 'Industry', '2025', 'Opportunities']
    },
    {
      id: 6,
      title: 'Packaging Solutions for Export-Quality Products',
      excerpt: 'Best practices for packaging Indian food products to meet international export standards.',
      content: 'Proper packaging is crucial for maintaining product quality during export...',
      category: 'export-tips',
      author: 'Packaging Team',
      date: '2024-12-15',
      readTime: '5 min read',
      image: '/src/assets/product_turmeric_powder.png',
      tags: ['Packaging', 'Export', 'Quality', 'Standards']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'export-tips', name: 'Export Tips', count: 4 },
    { id: 'product-spotlights', name: 'Product Spotlights', count: 5 },
    { id: 'industry-news', name: 'Industry News', count: 3 }
  ];

  // Find the blog post with the matching ID
  const post = blogPosts.find(post => post.id === parseInt(id));

  // If no post is found, show a message
  if (!post) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Blog Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              {categories.find(c => c.id === post.category)?.name}
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 my-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">By {post.author}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
                
                <Link to="/blog">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Related Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 3)
              .map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{relatedPost.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                      </div>
                      <Link to={`/blog/${relatedPost.id}`}>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Export Insights
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest export tips, industry trends, and product updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Button size="lg" variant="secondary" className="px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;