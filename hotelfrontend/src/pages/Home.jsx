export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 bg-gradient-to-br from-blue-50 to-white">
      <img src="/src/assets/albergo-logo.svg" alt="Albergo Logo" className="w-16 h-16 mb-4" />
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">Welcome to Albergo Hotel</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-6 text-center max-w-xl">Your all-in-one, modern hotel management platform for seamless guest experiences and efficient operations.</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow">Get Started</a>
        <a href="/about" className="bg-white border border-blue-600 text-blue-700 font-semibold px-6 py-2 rounded hover:bg-blue-50">Learn More</a>
      </div>
    </div>
  );
}
