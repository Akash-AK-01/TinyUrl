/**
 * Global error handler middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Prisma unique constraint violation (duplicate code)
  if (err.code === 'P2002' || err.code === 'DUPLICATE_CODE') {
    return res.status(409).json({ error: 'Code already exists' });
  }
  
  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Link not found' });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}


