import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "./SocialIcons";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Ahmedabad, Gujarat, India",
  },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "support@forgefit.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-black/40 to-black/80 backdrop-blur-xl overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 pb-16 border-b border-white/10"
          >
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  className="p-2 bg-gradient-to-br from-indigo-500 to-orange-400 rounded-lg shadow-glow"
                >
                  <Dumbbell className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white tracking-tight">ForgeFit</h3>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Transform your body, elevate your mind. Join our community of
                fitness enthusiasts and achieve your goals with expert guidance.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.div 
                    key={item.label} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 group cursor-default"
                  >
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20 group-hover:text-white">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-slate-300 text-sm">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-indigo-500/5 to-orange-400/5 rounded-2xl border border-white/10 p-8 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <h4 className="text-lg font-semibold text-white mb-2 relative z-10">
                Stay Updated
              </h4>
              <p className="text-slate-400 mb-6 text-sm relative z-10">
                Subscribe to get the latest fitness tips and exclusive offers.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-4 relative z-10">
                <div className="relative group/input">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-orange-400 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-glow hover:shadow-indigo-500/40 transition-all duration-300"
                >
                  <span>Subscribe Now</span>
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>

              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm text-center"
                >
                  ✓ Thank you for subscribing!
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-16">
            {footerSections.map((section, sIdx) => (
              <div key={section.title}>
                <motion.h4 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: sIdx * 0.1 }}
                  className="text-xs font-bold uppercase tracking-widest text-white mb-6 border-l-2 border-orange-500 pl-3"
                >
                  {section.title}
                </motion.h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <motion.li 
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (sIdx * 0.1) + (lIdx * 0.05) }}
                    >
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-[1px] bg-orange-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-5 mb-16 pb-16 border-b border-white/10">
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.2, rotate: 10, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-white/5 hover:bg-orange-500/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all duration-300 shadow-sm hover:shadow-glow"
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-medium tracking-wide"
          >
            <p>&copy; {new Date().getFullYear()} ForgeFit. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-indigo-400 transition-colors uppercase">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors uppercase">
                Terms of Service
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors uppercase">
                Cookies
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
