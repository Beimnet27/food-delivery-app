import { Link } from "react-router-dom";
import heroImage from "../assets/digitalRestaurant.png";
import pricingIcon from "../assets/fairPrice.webp";
import webAppIcon from "../assets/BlackFood.webp";
import customizationIcon from "../assets/customization.avif";
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.jpg";
import step3 from "../assets/step3.webp";

const LandingPage = () => {
  return (
    <div className="font-poppins">
      {/* ✅ Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-red-500 to-pink-500 text-white p-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold">
            Start Your Own Digital Restaurant with{" "}
            <span className="text-yellow-400">Black Food</span>
          </h1>
          <p className="mt-4 text-lg">
            Fair pricing, reliable web apps, and full customization for your restaurant business.
          </p>
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <Link to="/register" className="bg-green-500 px-6 py-3 rounded-lg text-white font-bold hover:bg-green-600">
              Register Now
            </Link>
            <Link to="/login" className="bg-blue-500 px-6 py-3 rounded-lg text-white font-bold hover:bg-blue-600">
              Login
            </Link>
          </div>
        </div>
        <img src={heroImage} alt="Digital Restaurant" className="w-full md:w-1/2 mt-6 md:mt-0" />
      </section>

      {/* ✅ Features Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold">Why Choose Black Food?</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {[
            { img: pricingIcon, title: "Fair Pricing", desc: "No hidden fees! Transparent pricing that helps your business grow." },
            { img: webAppIcon, title: "Reliable Web Apps", desc: "Manage orders, payments, and customers smoothly." },
            { img: customizationIcon, title: "Full Customization", desc: "Personalize your restaurant page, menu, and branding." },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md w-80 text-center">
              <img src={feature.img} alt={feature.title} className="w-16 mx-auto" />
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ How It Works */}
      <section className="bg-red-500 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {[
            { img: step1, title: "Step 1: Sign Up", desc: "Create your restaurant profile in just a few clicks." },
            { img: step2, title: "Step 2: Customize", desc: "Contact As through our Provided email Form" },
            { img: step3, title: "Step 3: Start Selling", desc: "Receive your own Customized App." },
          ].map((step, index) => (
            <div key={index} className="text-center max-w-xs">
              <img src={step.img} alt={step.title} className="w-20 mx-auto" />
              <h3 className="text-xl font-bold mt-4">{step.title}</h3>
              <p className="mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Call to Action */}
      <section className="bg-green-500 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Join the Future of Digital Restaurants</h2>
        <Link to="/register" className="bg-yellow-400 px-6 py-3 rounded-lg text-white font-bold hover:bg-yellow-500 mt-6 inline-block">
          Get Started Now
        </Link>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 Black Food Digital Restaurant | All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
