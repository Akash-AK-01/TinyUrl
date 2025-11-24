import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddLinkForm from '../components/Dashboard/AddLinkForm';
import LinkTable from '../components/Dashboard/LinkTable';
import SearchFilter from '../components/Dashboard/SearchFilter';
import ErrorMessage from '../components/Common/ErrorMessage';
import SuccessMessage from '../components/Common/SuccessMessage';
import { createLink, getAllLinks, deleteLink } from '../services/api';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    setError('');
    const result = await getAllLinks();
    
    if (result.success) {
      setLinks(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCreateLink = async (url, customCode) => {
    if (submitting) return false; // Prevent multiple submissions
    
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await createLink(url, customCode);

      if (result.success) {
        setSuccess('Link created successfully!');
        setSearchTerm(''); // Clear search
        await fetchLinks();
        setSubmitting(false);
        return true; // Return success to reset form
      } else {
        setError(result.error || 'Failed to create link');
        setSubmitting(false);
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
      return false;
    }
  };

  const handleDeleteLink = async (code) => {
    setError('');
    const result = await deleteLink(code);

    if (result.success) {
      setSuccess('Link deleted successfully!');
      await fetchLinks();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 font-['Poppins']">
          Dashboard
        </h1>

        {error && (
          <ErrorMessage
            message={error}
            className="mb-4"
          />
        )}

        {success && (
          <SuccessMessage
            message={success}
            onClose={() => setSuccess('')}
            className="mb-4"
          />
        )}

        <div className="mb-8">
          <AddLinkForm onSubmit={handleCreateLink} loading={submitting} />
        </div>

        <div className="mb-4">
          <SearchFilter value={searchTerm} onChange={setSearchTerm} />
        </div>

        <LinkTable
          links={links}
          loading={loading}
          onDelete={handleDeleteLink}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

