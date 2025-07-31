import React, { useState, useRef, useCallback } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import '../App.css';

const ImageDropZone = ({ onImagesChange, maxImages = 4 }) => {
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (images.length + validFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const newImages = validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
    onImagesChange([...images, ...newImages]);
  }, [images, maxImages, onImagesChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    handleFiles(files);
  }, [handleFiles]);

  const removeImage = useCallback((imageId) => {
    setImages(prev => {
      const newImages = prev.filter(img => img.id !== imageId);
      onImagesChange(newImages);
      return newImages;
    });
    // Also remove from failed images set
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  }, [onImagesChange]);

  const handleImageError = useCallback((imageId) => {
    setFailedImages(prev => new Set(prev).add(imageId));
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-dropzone-container">
      {/* Drop Zone */}
      <div
        className={`image-dropzone ${isDragOver ? 'drag-over' : ''} ${images.length >= maxImages ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={images.length >= maxImages}
        />
        
        <div className="dropzone-content">
          <FaCloudUploadAlt className="dropzone-icon" />
          <h3 className="dropzone-title">
            {images.length >= maxImages ? 'Maximum images reached' : 'Drop images here or click to upload'}
          </h3>
          <p className="dropzone-subtitle">
            {images.length >= maxImages 
              ? `You've uploaded ${maxImages} images`
              : `Upload up to ${maxImages} images (max 5MB each)`
            }
          </p>
          {images.length < maxImages && (
            <button type="button" className="dropzone-button">
              Choose Files
            </button>
          )}
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="image-previews">
          <h4 className="previews-title">
            <FaImage /> Image Previews ({images.length}/{maxImages})
          </h4>
          <div className="previews-grid">
            {images.map((image) => (
              <div key={image.id} className="image-preview-item">
                {!failedImages.has(image.id) ? (
                  <img 
                    src={image.preview} 
                    alt="Preview" 
                    className="preview-image"
                    onError={() => handleImageError(image.id)}
                  />
                ) : (
                  <div className="preview-fallback">
                    <FaImage />
                  </div>
                )}
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  title="Remove image"
                >
                  <FaTimes />
                </button>
                <div className="image-info">
                  <span className="image-name">{image.file.name}</span>
                  <span className="image-size">
                    {(image.file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropZone; 