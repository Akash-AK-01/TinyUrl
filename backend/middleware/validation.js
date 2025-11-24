import validator from 'validator';

/**
 * Validate URL format
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  
  // Add protocol if missing
  let urlToValidate = url.trim();
  if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
    urlToValidate = 'https://' + urlToValidate;
  }
  
  // Allow localhost and IP addresses
  const localhostPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;
  const isLocalhost = localhostPattern.test(urlToValidate);
  
  // Use validator with options that allow localhost
  const validatorOptions = {
    require_protocol: true,
    allow_protocol_relative_urls: false,
    require_valid_protocol: true,
    protocols: ['http', 'https']
  };
  
  // For localhost, use a more lenient check
  if (isLocalhost) {
    try {
      new URL(urlToValidate);
      return { valid: true, url: urlToValidate };
    } catch (error) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }
  
  if (!validator.isURL(urlToValidate, validatorOptions)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  
  return { valid: true, url: urlToValidate };
}

/**
 * Validate short code format (6-8 alphanumeric characters)
 */
export function validateCode(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Code is required' };
  }
  
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  
  if (!codeRegex.test(code)) {
    return { valid: false, error: 'Code must be 6-8 alphanumeric characters' };
  }
  
  return { valid: true };
}

/**
 * Middleware to validate create link request
 */
export function validateCreateLink(req, res, next) {
  const { target_url, code } = req.body;
  
  // Validate URL
  const urlValidation = validateUrl(target_url);
  if (!urlValidation.valid) {
    return res.status(400).json({ error: urlValidation.error });
  }
  
  // Validate custom code if provided
  if (code) {
    const codeValidation = validateCode(code);
    if (!codeValidation.valid) {
      return res.status(400).json({ error: codeValidation.error });
    }
  }
  
  // Attach validated URL to request
  req.body.target_url = urlValidation.url;
  
  next();
}


