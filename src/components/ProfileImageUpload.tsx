import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import profileService from '../lib/profile-service';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImage, onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(() => {
    // If we have a local image URL, resolve it
    if (currentImage?.startsWith('local://')) {
      return profileService.getProfileImageUrl(currentImage);
    }
    return currentImage;
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    // Reset states
    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Save image using profile service
      const imageUrl = await profileService.saveProfileImage(file);
      
      // Call the callback with the image URL
      onImageUpload(imageUrl);
      
      // Show success state
      setUploadSuccess(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    setPreviewUrl(currentImage?.startsWith('local://') 
      ? profileService.getProfileImageUrl(currentImage) 
      : currentImage);
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center"
        onClick={handleUploadClick}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center">
            <Upload className="w-8 h-8" />
            <span className="text-xs mt-1">Upload</span>
          </div>
        )}
        
        {/* Overlay during upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        
        {/* Success indicator */}
        {uploadSuccess && (
          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        aria-label="Upload profile image"
        title="Upload profile image"
      />
      
      {uploadError && (
        <div className="text-red-500 text-sm flex items-center">
          <X className="w-4 h-4 mr-1" /> {uploadError}
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleUploadClick}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={isUploading}
        >
          {previewUrl ? 'Change Photo' : 'Upload Photo'}
        </button>
        
        {previewUrl && previewUrl !== (currentImage?.startsWith('local://') 
            ? profileService.getProfileImageUrl(currentImage) 
            : currentImage) && (
          <button
            type="button"
            onClick={handleCancelUpload}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            disabled={isUploading}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload; 