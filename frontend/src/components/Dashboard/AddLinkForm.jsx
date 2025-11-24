import { useState } from 'react';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { validateUrl, validateCode } from '../../utils/validation';

export default function AddLinkForm({ onSubmit, loading, onSuccess }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset form when success callback is triggered
  const resetForm = () => {
    setUrl('');
    setCustomCode('');
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const urlValidation = validateUrl(url);
    const codeValidation = validateCode(customCode);
    
    const newErrors = {};
    if (!urlValidation.valid) {
      newErrors.url = urlValidation.error;
    }
    if (!codeValidation.valid) {
      newErrors.code = codeValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Use normalized URL if available
    const urlToSubmit = urlValidation.url || url.trim();
    
    // Submit
    const success = await onSubmit(urlToSubmit, customCode.trim() || null);
    if (success) {
      resetForm();
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    if (touched.url) {
      const validation = validateUrl(e.target.value);
      setErrors((prev) => ({
        ...prev,
        url: validation.valid ? null : validation.error,
      }));
    }
  };

  const handleCodeChange = (e) => {
    setCustomCode(e.target.value);
    if (touched.code) {
      const validation = validateCode(e.target.value);
      setErrors((prev) => ({
        ...prev,
        code: validation.valid ? null : validation.error,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 font-['Poppins']">Create Short Link</h2>
      
      <div className="space-y-4">
        <Input
          label="Target URL"
          type="url"
          value={url}
          onChange={handleUrlChange}
          onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
          placeholder="https://example.com"
          error={errors.url}
          required
        />
        
        <Input
          label="Custom Code (Optional)"
          type="text"
          value={customCode}
          onChange={handleCodeChange}
          onBlur={() => setTouched((prev) => ({ ...prev, code: true }))}
          placeholder="6-8 alphanumeric characters"
          error={errors.code}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Link'}
        </Button>
      </div>
    </form>
  );
}

