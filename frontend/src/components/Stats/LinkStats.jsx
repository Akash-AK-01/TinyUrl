import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLinkStats, deleteLink, getShortUrl } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import Button from '../Common/Button';
import { formatDate, copyToClipboard } from '../../utils/helpers';

export default function LinkStats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [code]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    const result = await getLinkStats(code);

    if (result.success) {
      setLink(result.data);
    } else {
      setError(result.notFound ? 'Link not found' : result.error);
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    const shortUrl = getShortUrl(code);
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setDeleting(true);
    const result = await deleteLink(code);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={error} />
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!link) return null;

  const shortUrl = getShortUrl(code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 font-['Poppins']">
            Link Statistics
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Short Code
              </label>
              <div className="flex items-center gap-2">
                <code className="text-xl font-mono font-semibold text-primary-600">
                  {link.code}
                </code>
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  className="text-sm px-3 py-1"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Short URL
              </label>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {shortUrl}
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Target URL
              </label>
              <a
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {link.target_url}
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Total Clicks
                </label>
                <p className="text-3xl font-bold text-primary-600">
                  {link.total_clicks || 0}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Last Clicked
                </label>
                <p className="text-lg text-gray-900">
                  {formatDate(link.last_clicked)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created At
                </label>
                <p className="text-lg text-gray-900">
                  {formatDate(link.created_at)}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Link'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


