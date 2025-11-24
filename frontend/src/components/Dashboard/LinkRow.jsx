import { Link } from 'react-router-dom';
import Button from '../Common/Button';
import { truncateUrl, formatDate, copyToClipboard, getShortUrl } from '../../utils/helpers';
import { useState } from 'react';

export default function LinkRow({ link, onDelete, baseUrl }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = getShortUrl(link.code);

  const handleCopy = async () => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      onDelete(link.code);
    }
  };

  const handleTestLink = () => {
    // Open the short URL in a new tab to test the redirect
    window.open(shortUrl, '_blank');
  };

  return (
    <tr className="border-b hover:bg-indigo-50/50 transition-colors duration-200">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/code/${link.code}`}
            className="text-primary-600 hover:text-primary-800 font-mono font-medium"
          >
            {link.code}
          </Link>
          <button
            onClick={handleTestLink}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
            title="Test redirect"
          >
            (test)
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <a
          href={link.target_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          title={link.target_url}
        >
          {truncateUrl(link.target_url, 60)}
        </a>
      </td>
      <td className="px-4 py-3 text-center font-semibold">
        {link.total_clicks || 0}
      </td>
      <td className="px-4 py-3 text-gray-600">
        {formatDate(link.last_clicked)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="text-sm px-3 py-1"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="text-sm px-3 py-1"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}


