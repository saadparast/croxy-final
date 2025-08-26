import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Tag,
  Search,
  Clock
} from 'lucide-react';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'export-tips', name: 'Export Tips', count: 4 },
    { id: 'product-spotlights', name: 'Product Spotlights', count: 5 },
    { id: 'industry-news', name: 'Industry News', count: 3 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Benefits of Moringa Powder: The Ultimate Superfood Export',
      excerpt: 'Discover why Moringa powder is becoming one of the most sought-after superfoods in international markets and how to ensure quality exports.',
      content: 'Moringa powder has gained tremendous popularity in global health food markets...',
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
      content: 'Exporting spices from India requires careful attention to documentation...',
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
      content: 'Makhana, also known as fox nuts, has a rich history in Bihar...',
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

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Insights from <span className="text-purple-600">Croxy Exim</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert insights, industry trends, and practical tips for successful exports and premium Indian products.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Article
            </h2>
          </div>
          
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="h-64 lg:h-auto">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {categories.find(c => c.id === featuredPost.category)?.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{featuredPost.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">By {featuredPost.author}</span>
                  </div>
                  <Link to={`/blog/${featuredPost.id}`}>
                    <Button className="w-fit bg-purple-600 hover:bg-purple-700">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredPosts.length} articles
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </Link>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs">
                        <Tag className="w-3 h-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
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

export default Blog;

