import { Link } from 'react-router-dom';
import Logo from '../assets/NARRATA__LOGO.png'; // Import the logo

function Footer() {
  return (
    <footer className="bg-white border-t border-teal-100 text-gray-500">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Narrata Logo" className="h-14 w-auto opacity-90" />
            </div>
            <p className="text-gray-500 font-serif italic text-lg leading-relaxed">Every Story Deserves a Spotlight</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-premium-gold tracking-[0.2em] uppercase font-serif mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/stories" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  Browse Stories
                </Link>
              </li>
              <li>
                <Link to="/write" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  Write a Story
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-premium-gold tracking-[0.2em] uppercase font-serif mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-premium-gold tracking-[0.2em] uppercase font-serif mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-premium-gold transition-colors tracking-wide">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-teal-50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="font-serif">
            © {new Date().getFullYear()} NARRATA. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="hover:text-premium-gold cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-premium-gold cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-premium-gold cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
