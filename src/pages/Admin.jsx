import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
  AlertCircle,
  Shield,
  Settings,
  BarChart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login state
  const [loginData, setLoginData] = useState({
    username: 'admin',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  // Dashboard stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalUsers: 0,
    enquiriesByStatus: [],
    productsByCategory: [],
    recentEnquiries: [],
    topProducts: []
  });

  // Products state
  const [products, setProducts] = useState([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Enquiries state
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
      fetchProducts();
      fetchEnquiries();
      fetchUsers();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // For PHP backend, we'll validate token on API calls
      // Token presence is enough for initial auth check
      setIsAuthenticated(true);
      setUser({ username: 'admin' });
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(API_ENDPOINTS.adminLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.adminInquiries, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEnquiries(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEnquiryStatusUpdate = async (enquiryId, newStatus) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.adminInquiries}/${enquiryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchEnquiries();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          fetchProducts();
          fetchDashboardStats();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'responded': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  placeholder="Enter admin password"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Login
              </Button>
              
              <p className="text-sm text-center text-gray-600">
                Admin Password: 707089081@MDsaad
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || user?.username || 'Admin'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Active products in catalog</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEnquiries}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">+{stats.newEnquiries}</span> this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProducts > 0 
                      ? Math.round((stats.totalEnquiries / stats.totalProducts) * 100) 
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Enquiry to product ratio</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Enquiries */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Enquiries</CardTitle>
                <CardDescription>Latest customer enquiries requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentEnquiries?.slice(0, 5).map((enquiry) => (
                    <div key={enquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{enquiry.user_name}</span>
                          <Badge className={getStatusColor(enquiry.status)}>
                            {enquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{enquiry.user_email}</p>
                        {enquiry.product_name && (
                          <p className="text-sm text-gray-500">Product: {enquiry.product_name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{enquiry.reference_number}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topProducts?.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <Badge variant="secondary">
                          {product.enquiry_count} enquiries
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.productsByCategory?.map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between">
                        <span className="capitalize">{cat.category}</span>
                        <Badge variant="outline">{cat.count} products</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <Button onClick={() => navigate('/admin/product/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Enquiries</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.origin_country}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.views}</TableCell>
                        <TableCell>{product.enquiry_count}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/product/${product.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Enquiries Management</h2>
              <Button variant="outline" onClick={fetchEnquiries}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell className="font-medium">{enquiry.reference_number}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{enquiry.user_name}</p>
                            <p className="text-sm text-gray-500">{enquiry.user_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{enquiry.product_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{enquiry.enquiry_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={enquiry.status}
                            onValueChange={(value) => handleEnquiryStatusUpdate(enquiry.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="responded">Responded</SelectItem>
                              <SelectItem value="quoted">Quoted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEnquiry(enquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Users Management</h2>
              <Button variant="outline" onClick={fetchUsers}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.company || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      System settings are currently managed through environment variables.
                      Contact your system administrator for changes.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className="font-medium mb-2">Export Data</h3>
                    <div className="flex gap-4">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Products
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Enquiries
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Users
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enquiry Details - {selectedEnquiry.reference_number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedEnquiry.user_name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedEnquiry.user_email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{selectedEnquiry.user_phone}</p>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="font-medium">{selectedEnquiry.user_company || '-'}</p>
                </div>
              </div>
              
              <div>
                <Label>Message</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded">{selectedEnquiry.message}</p>
              </div>

              {selectedEnquiry.quantity && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <p className="font-medium">{selectedEnquiry.quantity}</p>
                  </div>
                  <div>
                    <Label>Target Price</Label>
                    <p className="font-medium">{selectedEnquiry.target_price || '-'}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Admin;