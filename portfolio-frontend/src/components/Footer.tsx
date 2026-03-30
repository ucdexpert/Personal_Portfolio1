"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp, Instagram, Facebook } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/ucdexpert", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/muhammad-uzair-9255433a0/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/UzairKhilj60869", label: "X (Twitter)" },
  { icon: Instagram, href: "https://www.instagram.com/uzairkhilji.uzairkhilji/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/uzairkhilji.uzairkhilji/", label: "Facebook" },
  { icon: Mail, href: "mailto:hk202504@gmial.com", label: "Email" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <motion.a
              href="#home"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Portfolio
            </motion.a>
            <p className="text-gray-400 text-sm mb-4">
              Building digital experiences that matter. Let&apos;s create something amazing
              together.
            </p>
            {/* Social Links */}
            <div className="flex flex-row flex-wrap justify-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Karachi, Pakistan</li>
              <li>
                <a href="mailto:hk202504@gmial.com" className="hover:text-white transition-colors">
                  hk202504@gmial.com
                </a>
              </li>
              <li>
                <a href="tel:+923170219387" className="hover:text-white transition-colors">
                  +92 317 0219387
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Muhammad Uzair. All rights reserved.
          </p>

          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> using Next.js
          </p>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
