import { storage } from './firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

// ===============================================================
// File Upload Configuration
// ===============================================================

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
  ALLOWED_PDF_EXTENSIONS: ['.pdf'],
};

export interface FileUploadResult {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

export interface FileUploadError {
  code: string;
  message: string;
}

// ===============================================================
// Validation Utilities
// ===============================================================

export function getFileExtension(fileName: string): string {
  return fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
}

export function validateImageFile(file: File): FileUploadError | null {
  // Check file size
  if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `File size exceeds ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB limit.`,
    };
  }

  // Check MIME type
  if (!FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      code: 'INVALID_FILE_TYPE',
      message: 'Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // Check file extension
  const ext = getFileExtension(file.name);
  if (!FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return {
      code: 'INVALID_FILE_EXTENSION',
      message: `Invalid file extension: ${ext}`,
    };
  }

  return null;
}

export function validatePdfFile(file: File): FileUploadError | null {
  // Check file size
  if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `File size exceeds ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB limit.`,
    };
  }

  // Check MIME type
  if (!FILE_UPLOAD_CONFIG.ALLOWED_PDF_TYPES.includes(file.type)) {
    return {
      code: 'INVALID_FILE_TYPE',
      message: 'Only PDF files are allowed.',
    };
  }

  // Check file extension
  const ext = getFileExtension(file.name);
  if (!FILE_UPLOAD_CONFIG.ALLOWED_PDF_EXTENSIONS.includes(ext)) {
    return {
      code: 'INVALID_FILE_EXTENSION',
      message: 'File must have .pdf extension.',
    };
  }

  return null;
}

// ===============================================================
// File Upload Utilities
// ===============================================================

/**
 * Upload profile picture to Firebase Storage
 * Path: users/{userId}/profile-pic/{filename}
 */
export async function uploadProfilePicture(
  userId: string,
  file: File
): Promise<FileUploadResult> {
  // Validate
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  try {
    const fileName = `profile-pic-${Date.now()}${getFileExtension(file.name)}`;
    const storageRef = ref(storage, `users/${userId}/profile-pic/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      url: downloadURL,
      fileName: fileName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

/**
 * Upload CV (PDF) to Firebase Storage
 * Path: users/{userId}/cv/{filename}
 */
export async function uploadCV(
  userId: string,
  file: File
): Promise<FileUploadResult> {
  // Validate
  const validationError = validatePdfFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  try {
    const fileName = `cv-${Date.now()}${getFileExtension(file.name)}`;
    const storageRef = ref(storage, `users/${userId}/cv/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      url: downloadURL,
      fileName: fileName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
}

/**
 * Upload project image to Firebase Storage
 * Path: projects/{projectId}/{filename}
 */
export async function uploadProjectImage(
  projectId: string,
  file: File
): Promise<FileUploadResult> {
  // Validate
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  try {
    const fileName = `project-${Date.now()}${getFileExtension(file.name)}`;
    const storageRef = ref(storage, `projects/${projectId}/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      url: downloadURL,
      fileName: fileName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading project image:', error);
    throw error;
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteStorageFile(fileUrl: string): Promise<void> {
  try {
    // Extract the reference path from the download URL
    // Firebase URLs follow format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token=...
    const decodedUrl = decodeURIComponent(fileUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const filePath = decodedUrl.substring(startIndex, endIndex);

    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw - silently fail as file might not exist
  }
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
