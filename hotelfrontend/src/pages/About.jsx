export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 bg-white rounded-lg shadow mt-8">
      <div className="flex items-center mb-4">
        <img src="/src/assets/albergo-logo.svg" alt="Albergo Logo" className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold text-blue-700">About Albergo</h1>
      </div>
      <p className="text-gray-700 mb-4">
        Albergo is a modern hotel management platform designed to streamline operations, enhance guest experiences, and empower hotel staff with powerful tools.
      </p>
      <ul className="list-disc pl-6 text-gray-600 space-y-1">
        <li>Role-based dashboards for Admins, Managers, Receptionists, and Customers</li>
        <li>Easy guest registration and booking management</li>
        <li>Integrated payments and review system</li>
        <li>Secure authentication and user management</li>
        <li>Beautiful, responsive UI for all devices</li>
      </ul>
    </div>
  );
}
