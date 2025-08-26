import { useState } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageUpload = ({ productId, productName, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format. Please use JPEG, PNG, or WebP.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading images...');

    try {
      // In production, this would upload to your backend
      // For now, we'll simulate the upload
      const uploadPromises = selectedFiles.map(async (file, index) => {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production:
        // const formData = new FormData();
        // formData.append('image', file);
        // formData.append('productId', productId);
        // formData.append('productName', productName);
        // 
        // const response = await fetch('/api/upload-product-image', {
        //   method: 'POST',
        //   body: formData
        // });
        // return response.json();

        // For development, return mock response
        return {
          success: true,
          url: URL.createObjectURL(file),
          filename: file.name
        };
      });

      const results = await Promise.all(uploadPromises);
      
      setUploadStatus(`Successfully uploaded ${results.length} image(s)`);
      
      // Call parent callback
      if (onUploadComplete) {
        onUploadComplete(results);
      }

      // Clear after success
      setTimeout(() => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        setUploadStatus('');
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Product Images
      </h3>
      
      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">
              Click to upload product images
            </p>
            <p className="text-sm text-gray-500">
              JPEG, PNG, WebP up to 5MB each
            </p>
            <Button variant="outline" className="mt-3" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              Select Images
            </Button>
          </label>
        </div>

        {/* Preview Grid */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {selectedFiles[index].name.substring(0, 15)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus && (
          <div className={`p-3 rounded-lg flex items-center space-x-2 ${
            uploadStatus.includes('Success') 
              ? 'bg-green-50 text-green-700' 
              : uploadStatus.includes('failed')
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {uploadStatus.includes('Success') ? (
              <Check className="w-5 h-5" />
            ) : uploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : null}
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && !uploading && (
          <Button 
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Image Guidelines:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Use high-quality images with good lighting</li>
          <li>• Show product from multiple angles</li>
          <li>• Include packaging and certification images</li>
          <li>• Minimum resolution: 800x600 pixels</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;