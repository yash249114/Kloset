const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'kloset_uploads';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload an image to Cloudinary using unsigned upload preset.
 * In development / demo mode, falls back to returning a mock URL after delay.
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
  folder = 'kloset/outfits'
): Promise<CloudinaryUploadResult> {
  
  if (CLOUD_NAME === 'demo' || CLOUD_NAME === 'your_cloud_name') {
    // Simulate network latency for dev environment
    await new Promise((resolve) => setTimeout(resolve, 1200));
    onProgress?.({ loaded: 100, total: 100, percentage: 100 });

    const objectUrl = URL.createObjectURL(file);
    return {
      public_id: `dev_${Date.now()}_${file.name.replace(/\s/g, '_')}`,
      secure_url: objectUrl,
      url: objectUrl,
      width: 800,
      height: 1000,
      format: file.type.split('/')[1] || 'jpg',
      bytes: file.size,
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_URL);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve(result as CloudinaryUploadResult);
        } catch {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });
}

/**
 * Generate an optimized Cloudinary URL with transformations.
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  } = {}
): string {
  if (CLOUD_NAME === 'demo' || CLOUD_NAME === 'your_cloud_name') {
    return publicId; // In dev mode, publicId is a local Object URL
  }

  const { width = 800, height, quality = 80, format = 'auto', crop = 'fill' } = options;
  const transforms = [
    `w_${width}`,
    height ? `h_${height}` : '',
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/**
 * Validate image files before uploading.
 */
export function validateImageFile(file: File): string | null {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, WebP, and HEIC images are allowed.';
  }

  if (file.size > MAX_SIZE) {
    return 'Image must be smaller than 10MB.';
  }

  return null;
}
