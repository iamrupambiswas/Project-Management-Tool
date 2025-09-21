export default function DashboardWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 font-sans">
      <div className="bg-background-light text-text-base p-4 md:p-6 rounded-lg shadow-md border border-background-dark hover:border-accent-blue transition-colors duration-300">
        <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2">Projects Summary</h3>
        <p className="text-xs md:text-sm text-text-muted">Active projects: 12</p>
        <p className="text-xs md:text-sm text-text-muted">Completed this month: 3</p>
      </div>
      <div className="bg-background-light text-text-base p-4 md:p-6 rounded-lg shadow-md border border-background-dark hover:border-accent-blue transition-colors duration-300">
        <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2">Team Performance</h3>
        <p className="text-xs md:text-sm text-text-muted">Tasks assigned: 45</p>
        <p className="text-xs md:text-sm text-text-muted">On time completion: 95%</p>
      </div>
      <div className="bg-background-light text-text-base p-4 md:p-6 rounded-lg shadow-md border border-background-dark hover:border-accent-blue transition-colors duration-300">
        <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2">Upcoming Deadlines</h3>
        <p className="text-xs md:text-sm text-text-muted">Design review: Feb 28</p>
        <p className="text-xs md:text-sm text-text-muted">Code freeze: Mar 15</p>
      </div>
    </div>
  );
}