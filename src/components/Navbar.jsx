import React from 'react';
import { Link } from 'react-router-dom';
import { Film, PlusCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Film />
            <span>Movie Reviews</span>
          </Link>
          <Link
            to="/post"
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <PlusCircle size={20} />
            <span>Post Review</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;