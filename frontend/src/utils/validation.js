/**
 * Validate URL format
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { valid: false, error: 'URL is required' };
  }

  const trimmedUrl = url.trim();
  
  // Try to create a URL object to validate
  try {
    // Add protocol if missing
    let urlToTest = trimmedUrl;
    if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
      urlToTest = 'https://' + urlToTest;
    }
    
    // Use URL constructor to validate
    new URL(urlToTest);
    return { valid: true, url: urlToTest };
  } catch (error) {
    // If URL constructor fails, try a more lenient check
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+\.?[a-z]{2,6}|localhost|127\.0\.0\.1)(:\d+)?([\/\w \.-]*)*\/?$/i;
    if (urlPattern.test(trimmedUrl)) {
      // Add protocol if missing
      let urlToReturn = trimmedUrl;
      if (!urlToReturn.startsWith('http://') && !urlToReturn.startsWith('https://')) {
        urlToReturn = 'https://' + urlToReturn;
      }
      return { valid: true, url: urlToReturn };
    }
    return { valid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Validate custom code format (6-8 alphanumeric characters)
 */
export function validateCode(code) {
  if (!code || code.trim() === '') {
    return { valid: true }; // Code is optional
  }

  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  const trimmedCode = code.trim();

  if (!codeRegex.test(trimmedCode)) {
    return {
      valid: false,
      error: 'Code must be 6-8 alphanumeric characters',
    };
  }

  return { valid: true };
}


