import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">

        {/* Left - Branding */}
        <div className="mb-4 md:mb-0">
          <span className="font-semibold text-white">SecuroServ</span> © {new Date().getFullYear()}
        </div>

        {/* Center - Navigation Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="/features" className="hover:text-white transition">
            Features
          </Link>
          {/* ⚠️ Removed 'Pricing' since there's no /pricing route yet */}
          <Link to="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </div>

        {/* Right - Social Links */}
        <div className="flex space-x-5">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
