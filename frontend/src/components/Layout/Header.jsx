import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight group-hover:scale-105 transition-transform duration-200">
              TinyLink
            </h1>
          </Link>
          <nav>
            <Link
              to="/"
              className="text-gray-800 hover:text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold font-['Inter'] transition-all duration-200 hover:bg-gray-100 backdrop-blur-sm"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}


