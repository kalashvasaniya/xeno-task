import Image from 'next/image';
import SignIn from './components/signin/page';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <a href="/Home" className="flex items-center">
            <Image
              src="https://cdn.prod.website-files.com/620353a026ae70e21288308a/6536204e44d00a50cb63e6a4_Vector.svg"
              alt="Xeno"
              width={120}
              height={40}
              className="h-8"
            />
          </a>
          <div className="hidden md:flex space-x-6">
            <a href="#platform" className="text-gray-600 hover:text-blue-600 transition">
              Platform
            </a>
            <a href="#success" className="text-gray-600 hover:text-blue-600 transition">
              Success
            </a>
            <a href="#resources" className="text-gray-600 hover:text-blue-600 transition">
              Resources
            </a>
            <a href="#careers" className="text-gray-600 hover:text-blue-600 transition">
              Careers
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <SignIn />
            <a
              href="#get-started"
              className="hidden md:block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="min-h-screen flex items-center bg-gradient-to-b from-white to-blue-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content Section */}
              <div className="flex flex-col order-2 lg:order-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  Maximise Repeat Revenue with{' '}
                  <span className="text-blue-600">10x Easier Personalisation</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600">
                  Unify customer data, generate insights, and personalise marketing communications across SMS, Email,
                  WhatsApp & Instagram to delight your loyal customers.
                </p>

                {/* Email Form */}
                <form className="mt-12 max-w-md">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="flex-1 min-w-0 px-4 py-3 text-base text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Get Started
                    </button>
                  </div>
                </form>
              </div>

              {/* Image Section */}
              <div className="order-1 lg:order-2">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <Image
                    src="/download.png"
                    alt="Smiling woman"
                    fill
                    priority
                    className="object-top object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}