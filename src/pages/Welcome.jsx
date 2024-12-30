import Navbar from "../components/Navbar";
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="relative bg-white lg:w-full">
      <Navbar />
    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
       <div className="flex flex-col justify-center px-4 py-12 md:py-16 lg:col-span-7 lg:gap-x-6 lg:px-6 lg:py-24 xl:col-span-6">
          <div className="flex items-center p-1 space-x-2 bg-gray-100 rounded-full max-w-max">
             <div className="bg-white rounded-full ">
                <p className="text-sm font-medium">Let&apos;s eat</p>
             </div>
             <p className="text-sm font-medium">
                Join our Black Food &rarr;
             </p>
          </div>
          <h1 className="mt-8 text-3xl font-normal tracking-tight text-black md:text-4xl lg:text-6xl">
             Order Your
             <div className="font-serif text-4xl font-bold text-yellow md:text-6xl">
                {" "}
                Favourite Food
             </div>
          </h1>
          <p className="mt-8 text-lg text-gray-700">
             "Satisfy your cravings, elevate your taste. Welcome to{" "}
             <span className="font-semibold text-yellow">Black Food</span>,
             where every bite is a delight!"
          </p>
          <form action="" className="flex items-start mt-8 space-x-2">
             <div>
                <input
                   className="flex w-full px-3 py-2 text-sm bg-transparent border rounded-md border-black/30 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                   type="search"
                   placeholder="Search food"
                   id="search"></input>
                <p className="mt-2 text-sm text-gray-500">
                   We care about your food
                </p>
             </div>
             <div>
                <button
                   type="button"
                   className="rounded-md bg-yellow px-3 py-2.5 text-sm font-semibold hover:text-white text-black shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                   Search
                </button>
             </div>
          </form>
       </div>

       <div className="relative px-2 lg:col-span-5 xl:col-span-6 lg:mb-9">
          <img
             className="aspect-[3/2] bg-gray-50 object-cover lg:aspect-[4/3] lg:h-[530px] xl:aspect-[1/1] lg:mt-14 rounded-3xl shadow-2xl "
             src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
             alt=""
          />
       </div>
      </div>
    </div>
  );
};

export default Welcome;
