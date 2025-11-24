import LinkRow from './LinkRow';
import LoadingSpinner from '../Common/LoadingSpinner';

export default function LinkTable({ links, loading, onDelete, searchTerm }) {
  // Filter links based on search term
  const filteredLinks = links.filter((link) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(term) ||
      link.target_url.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">No links yet. Create your first short link above!</p>
      </div>
    );
  }

  if (filteredLinks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">No links match your search.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider font-['Inter']">
                Short Code (click to view stats)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider font-['Inter']">
                Target URL
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider font-['Inter']">
                Clicks
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider font-['Inter']">
                Last Clicked
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider font-['Inter']">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLinks.map((link) => (
              <LinkRow key={link.code} link={link} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


