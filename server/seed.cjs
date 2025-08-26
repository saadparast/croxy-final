const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./croxy_exim.db');

// Sample products data
const sampleProducts = [
  {
    name: 'Premium Basmati Rice',
    description: 'High-quality long-grain basmati rice from the foothills of the Himalayas. Perfect aroma and taste for authentic dishes.',
    category: 'export',
    subcategory: 'Agricultural Products',
    price: '$450 per MT',
    min_order_quantity: '25 MT',
    origin_country: 'India',
    origin_region: 'Punjab',
    availability: 'in-stock',
    lead_time: '15-20 days',
    featured: 1,
    hsCode: '1006.30',
    weight: '25kg/50kg bags',
    packaging: 'PP/Jute bags'
  },
  {
    name: 'Industrial Machinery Parts',
    description: 'High-precision machinery parts and components for various industrial applications. ISO certified manufacturing.',
    category: 'import',
    subcategory: 'Machinery',
    price: 'Contact for Quotation',
    min_order_quantity: '100 units',
    origin_country: 'Germany',
    origin_region: 'Bavaria',
    availability: 'made-to-order',
    lead_time: '30-45 days',
    featured: 1,
    hsCode: '8479.90',
    weight: 'Varies',
    packaging: 'Wooden crates'
  },
  {
    name: 'Organic Cotton Textiles',
    description: 'Premium quality organic cotton fabrics and textiles. GOTS certified, suitable for fashion and home furnishing.',
    category: 'export',
    subcategory: 'Textiles',
    price: '$12 per meter',
    min_order_quantity: '5000 meters',
    origin_country: 'India',
    origin_region: 'Gujarat',
    availability: 'in-stock',
    lead_time: '20-25 days',
    featured: 1,
    hsCode: '5209.11',
    weight: '250 GSM',
    packaging: 'Rolls/Bales'
  },
  {
    name: 'Electronic Components',
    description: 'Wide range of electronic components including semiconductors, capacitors, and circuit boards for electronics manufacturing.',
    category: 'import',
    subcategory: 'Electronics',
    price: 'Varies by component',
    min_order_quantity: '1000 pieces',
    origin_country: 'China',
    origin_region: 'Shenzhen',
    availability: 'in-stock',
    lead_time: '10-15 days',
    featured: 0,
    hsCode: '8542.31',
    weight: 'Varies',
    packaging: 'Anti-static packaging'
  },
  {
    name: 'Fresh Mangoes',
    description: 'Premium Alphonso and Kesar mangoes, known for their sweetness and rich flavor. Export quality with proper certifications.',
    category: 'export',
    subcategory: 'Fresh Fruits',
    price: '$800 per MT',
    min_order_quantity: '5 MT',
    origin_country: 'India',
    origin_region: 'Maharashtra',
    availability: 'seasonal',
    lead_time: '5-7 days',
    featured: 1,
    hsCode: '0804.50',
    weight: '5kg/10kg boxes',
    packaging: 'Corrugated boxes'
  },
  {
    name: 'Stainless Steel Products',
    description: 'High-grade stainless steel sheets, pipes, and fittings for industrial and construction applications.',
    category: 'import',
    subcategory: 'Metals',
    price: '$1200 per MT',
    min_order_quantity: '10 MT',
    origin_country: 'Japan',
    origin_region: 'Osaka',
    availability: 'in-stock',
    lead_time: '25-30 days',
    featured: 0,
    hsCode: '7219.33',
    weight: 'Standard sizes',
    packaging: 'Bundle/Pallet'
  },
  {
    name: 'Pharmaceutical Raw Materials',
    description: 'GMP certified pharmaceutical raw materials and APIs for drug manufacturing. All necessary documentation provided.',
    category: 'export',
    subcategory: 'Pharmaceuticals',
    price: 'Contact for Quotation',
    min_order_quantity: '100 kg',
    origin_country: 'India',
    origin_region: 'Hyderabad',
    availability: 'made-to-order',
    lead_time: '30-40 days',
    featured: 1,
    hsCode: '2941.90',
    weight: '25kg drums',
    packaging: 'HDPE drums'
  },
  {
    name: 'Solar Panels',
    description: 'High-efficiency monocrystalline solar panels for residential and commercial installations. 25-year warranty.',
    category: 'import',
    subcategory: 'Renewable Energy',
    price: '$0.35 per watt',
    min_order_quantity: '100 panels',
    origin_country: 'China',
    origin_region: 'Jiangsu',
    availability: 'in-stock',
    lead_time: '20-25 days',
    featured: 1,
    hsCode: '8541.40',
    weight: '20kg per panel',
    packaging: 'Wooden pallets'
  }
];

// Insert sample products
db.serialize(() => {
  console.log('Seeding database with sample products...');
  
  const stmt = db.prepare(`
    INSERT INTO products (
      name, description, category, subcategory, price, min_order_quantity,
      origin_country, origin_region, images, specifications, availability,
      lead_time, featured, tags, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleProducts.forEach((product, index) => {
    const specifications = JSON.stringify({
      hsCode: product.hsCode,
      weight: product.weight,
      packaging: product.packaging,
      certifications: ['ISO 9001', 'CE Mark', 'FDA Approved'],
      incoterms: ['FOB', 'CIF', 'EXW']
    });

    const images = JSON.stringify([
      { url: `https://picsum.photos/seed/${index + 1}/600/400`, alt: product.name }
    ]);

    const tags = JSON.stringify([
      product.category,
      product.subcategory,
      product.origin_country,
      'wholesale',
      'b2b'
    ]);

    stmt.run(
      product.name,
      product.description,
      product.category,
      product.subcategory || '',
      product.price,
      product.min_order_quantity || '',
      product.origin_country,
      product.origin_region || '',
      images,
      specifications,
      product.availability,
      product.lead_time || '',
      product.featured,
      tags,
      'active',
      (err) => {
        if (err) {
          console.error('Error inserting product:', err);
        } else {
          console.log(`✓ Added: ${product.name}`);
        }
      }
    );
  });

  stmt.finalize();

  // Add sample enquiries
  const enquiries = [
    {
      product_name: 'Premium Basmati Rice',
      user_name: 'John Smith',
      user_email: 'john.smith@example.com',
      user_phone: '+1-234-567-8900',
      user_company: 'Global Imports LLC',
      user_country: 'USA',
      message: 'We are interested in importing 100 MT of basmati rice. Please send quotation.',
      quantity: '100 MT',
      target_price: '$400 per MT',
      status: 'new'
    },
    {
      product_name: 'Solar Panels',
      user_name: 'Maria Garcia',
      user_email: 'maria@greenenergyco.com',
      user_phone: '+34-123-456-789',
      user_company: 'Green Energy Solutions',
      user_country: 'Spain',
      message: 'Looking for 500 solar panels for a commercial project. Need technical specifications.',
      quantity: '500 panels',
      status: 'in-progress'
    }
  ];

  const enquiryStmt = db.prepare(`
    INSERT INTO enquiries (
      product_name, user_name, user_email, user_phone, user_company,
      user_country, message, quantity, target_price, status, reference_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  enquiries.forEach((enquiry, index) => {
    const refNumber = `ENQ2024${(1000 + index).toString()}`;
    enquiryStmt.run(
      enquiry.product_name,
      enquiry.user_name,
      enquiry.user_email,
      enquiry.user_phone,
      enquiry.user_company,
      enquiry.user_country,
      enquiry.message,
      enquiry.quantity,
      enquiry.target_price || '',
      enquiry.status,
      refNumber,
      (err) => {
        if (err) {
          console.error('Error inserting enquiry:', err);
        } else {
          console.log(`✓ Added enquiry from: ${enquiry.user_name}`);
        }
      }
    );
  });

  enquiryStmt.finalize();

  console.log('\nDatabase seeding completed!');
  console.log('Admin credentials:');
  console.log('Email: admin@croxy-exim.com');
  console.log('Password: 707089081@MDsaad');
});

db.close();