import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Curriculum', path: '/curriculum' },
    { name: 'Certificates', path: '/certificates' }
  ];

  const resources = [
    { name: 'Why VR Robotics', path: '/why-vr-robotics' },
    { name: 'What Kids Learn', path: '/what-kids-learn' },
    { name: 'How We Build', path: '/how-kids-build' },
    { name: 'Admission Process', path: '/admission-process' }
  ];

  const cta = [
    { name: 'Book Free Demo', path: '/demo-booking' },
    { name: 'View Pricing', path: '/program-fees' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative bg-background mt-16 sm:mt-20 md:mt-24 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-5"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Circuit Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255, 140, 66, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(255, 140, 66, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          className="flex justify-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section - Centered */}
          <motion.div variants={itemVariants} className="text-center max-w-md">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mb-6 flex justify-center"
              >
                <Image
                  src="https://res.cloudinary.com/dicfqwlfq/image/upload/v1764505259/VR_Robotics_Logo_upscaled_1_rrrrn8.png"
                  alt="VR Robotics Academy Logo"
                  width={120}
                  className="h-auto"
                />
              </motion.div>
            </Link>
            <p className="font-paragraph text-sm md:text-base text-foreground/70 mb-6">
              Empowering the next generation of innovators through robotics, coding, and VR education.
            </p>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-foreground/5 border border-foreground/10"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)', y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <social.icon className="w-5 h-5 text-foreground/70" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="font-paragraph text-xs sm:text-sm md:text-base text-foreground/60">
              © {new Date().getFullYear()} VR Robotics Academy. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
