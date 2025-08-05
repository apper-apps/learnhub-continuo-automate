import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Programs", href: "/program" },
    { name: "Insights", href: "/insight" },
    { name: "Reviews", href: "/reviews" },
  ];

  const programLinks = [
    { name: "Web Development", href: "/program/web-development-mastery" },
    { name: "Data Science", href: "/program/data-science-fundamentals" },
    { name: "Mobile Development", href: "/program/mobile-app-development" },
    { name: "AI & Machine Learning", href: "/program/ai-machine-learning" },
  ];

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "LinkedIn", icon: "Linkedin", href: "#" },
    { name: "GitHub", icon: "Github", href: "#" },
    { name: "Discord", icon: "MessageSquare", href: "#" },
  ];

  return (
    <footer className="bg-secondary border-t border-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-400 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">LearnHub</span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering learners worldwide with cutting-edge technology education. 
              Master the skills that matter in today's digital economy.
            </p>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-surface hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <ApperIcon name={social.icon} size={18} className="text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-accent transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Programs</h3>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-accent transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <ApperIcon name="Mail" size={16} className="text-accent" />
                hello@learnhub.com
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <ApperIcon name="MessageSquare" size={16} className="text-accent" />
                Join our Discord
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <ApperIcon name="Globe" size={16} className="text-accent" />
                Learn from anywhere
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface/20 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} LearnHub. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;