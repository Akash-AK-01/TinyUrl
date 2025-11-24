import prisma from '../db/connection.js';
import { randomBytes } from 'crypto';
      
/**
 * Generate a random short code (6-8 characters)
 */
export function generateShortCode() {
  const length = 6;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}    

/**
 * Create a new link
 * @param {string} targetUrl - The target URL to shorten
 * @param {string|null} customCode - Optional custom code (6-8 alphanumeric)
 * @returns {Promise<Object>} The created link
 * @throws {Error} If code already exists (unique constraint violation)
 */
export async function createLink(targetUrl, customCode = null) {
  const code = customCode || generateShortCode();
  
  try {
    const link = await prisma.link.create({
      data: {
        code,
        url: targetUrl,
        total_clicks: 0,
        last_clicked: null,
      },
    });
    
    return {
      id: link.id,
      code: link.code,
      target_url: link.url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at,
    };
  } catch (error) {
    // Handle unique constraint violation (duplicate code)
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      const duplicateError = new Error('Code already exists');
      duplicateError.code = 'DUPLICATE_CODE';
      throw duplicateError;
    }
    throw error;
  }
}

/**
 * Get link by code
 * @param {string} code - The short code
 * @returns {Promise<Object|null>} The link or null if not found
 */
export async function getLinkByCode(code) {
  const link = await prisma.link.findUnique({
    where: { code },
  });
  
  if (!link) {
    return null;
  }
  
  return {
    id: link.id,
    code: link.code,
    target_url: link.url,
    total_clicks: link.total_clicks,
    last_clicked: link.last_clicked,
    created_at: link.created_at,
  };
}

/**
 * Get all links
 * @returns {Promise<Array>} Array of all links, sorted by created_at descending
 */
export async function getAllLinks() {
  const links = await prisma.link.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });
  
  return links.map(link => ({
    id: link.id,
    code: link.code,
    target_url: link.url,
    total_clicks: link.total_clicks,
    last_clicked: link.last_clicked,
    created_at: link.created_at,
  }));
}

/**
 * Increment click count and update last clicked timestamp
 * @param {string} code - The short code
 * @returns {Promise<Object|null>} The updated link or null if not found
 */
export async function incrementClickCount(code) {
  try {
    const link = await prisma.link.update({
      where: { code },
      data: {
        total_clicks: {
          increment: 1,
        },
        last_clicked: new Date(),
      },
    });
    
    return {
      id: link.id,
      code: link.code,
      target_url: link.url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at,
    };
  } catch (error) {
    // If link doesn't exist, Prisma throws P2025
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

/**
 * Delete link by code
 * @param {string} code - The short code
 * @returns {Promise<Object|null>} The deleted link or null if not found
 */
export async function deleteLinkByCode(code) {
  try {
    const link = await prisma.link.delete({
      where: { code },
    });
    
    return {
      id: link.id,
      code: link.code,
      target_url: link.url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at,
    };
  } catch (error) {
    // If link doesn't exist, Prisma throws P2025
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

/**
 * Check if code exists
 * @param {string} code - The short code to check
 * @returns {Promise<boolean>} True if code exists, false otherwise
 */
export async function codeExists(code) {
  const count = await prisma.link.count({
    where: { code },
  });
  
  return count > 0;
}
