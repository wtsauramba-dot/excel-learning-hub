import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-950 text-slate-300 pt-16 pb-8 border-t border-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-indigo-950 shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-poppins">
                Excel Learning Hub
              </span>
            </Link>
            <p className="text-sm text-indigo-200/80 leading-relaxed max-w-sm">
              Shaping brighter futures, one lesson at a time. Empowering learners with 1-on-1 live expert instruction and self-paced video lessons.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-indigo-200/70">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:+27842287589" className="hover:text-amber-400 transition-colors">+27 84 228 7589</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="mailto:admin@excel-learninghub.com" className="hover:text-amber-400 transition-colors">admin@excel-learninghub.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-indigo-900/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-indigo-300/60 gap-4">
          <p>© 2026 Excel Learning Hub Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
