export default function Contact() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 bg-white rounded-lg shadow mt-8">
      <div className="flex items-center mb-4">
        <img src="/src/assets/albergo-logo.svg" alt="Albergo Logo" className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold text-blue-700">Contact Us</h1>
      </div>
      <p className="text-gray-700 mb-4">
        Need help or have a question? Our team is here for you!
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
        <div className="text-lg font-semibold text-blue-700 mb-1">Support Email</div>
        <a href="mailto:support@albergo.com" className="text-blue-600 underline">support@albergo.com</a>
      </div>
      <p className="text-gray-600">We aim to respond to all inquiries within 24 hours.</p>
    </div>
  );
}
