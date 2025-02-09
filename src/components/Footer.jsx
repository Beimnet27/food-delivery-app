const Footer = () => {
    return (
      <footer className="mt-16 py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-semibold">BlackMax Restaurant</h2>
              <p className="text-gray-400 text-sm mt-2">
                The best food delivery service in town. Fresh, fast, and delicious!
              </p>
            </div>
  
            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-medium mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-300 hover:text-white">About Us</a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
                </li>
              </ul>
            </div>
  
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Contact Us</h3>
              <p className="text-gray-300">📞 <a href="tel:+123456789" className="hover:text-white">+251 9 10 13 87 84</a></p>
              <p className="text-gray-300">📧 <a href="mailto:info@blackmax.com" className="hover:text-white">info@blackmax.com</a></p>
              <div className="flex justify-center md:justify-start space-x-4 mt-3">
                <a href="#" className="text-gray-300 hover:text-white">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
  
          {/* Copyright Section */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BlackMax Restaurant. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  