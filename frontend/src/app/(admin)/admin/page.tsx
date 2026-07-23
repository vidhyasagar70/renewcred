import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const stats = [
  { label: 'Total Articles', value: '—', color: 'text-primary-600' },
  { label: 'Published', value: '—', color: 'text-green-600' },
  { label: 'Drafts', value: '—', color: 'text-yellow-600' },
  { label: 'Users', value: '—', color: 'text-purple-600' },
];

export default function AdminDashboardPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back. Here's an overview of your CMS.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent Content
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Content will appear here once the backend is connected and data is fetched
          from the Redux store.
        </p>
      </div>
    </div>
  );
}
