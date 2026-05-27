import { useState } from 'react';
import { TableProperties, ArrowDownUp } from 'lucide-react';

export default function PandasVisualizer() {
  const [grouped, setGrouped] = useState(false);

  const rawData = [
    { id: 1, name: "Alice", dept: "Engineering", salary: 90000 },
    { id: 2, name: "Bob", dept: "HR", salary: 60000 },
    { id: 3, name: "Charlie", dept: "Engineering", salary: 85000 },
    { id: 4, name: "Diana", dept: "Sales", salary: 75000 },
    { id: 5, name: "Eve", dept: "HR", salary: 62000 },
    { id: 6, name: "Frank", dept: "Sales", salary: 70000 },
  ];

  // Simulated GroupBy Operation
  const getDisplayData = () => {
    if (!grouped) return rawData;
    
    // Sort by dept to simulate grouping visually
    return [...rawData].sort((a, b) => a.dept.localeCompare(b.dept));
  };

  const displayData = getDisplayData();

  const getRowColor = (dept: string) => {
    if(!grouped) return 'bg-white';
    switch(dept) {
      case 'Engineering': return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'HR': return 'bg-green-50 border-l-4 border-l-green-500';
      case 'Sales': return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      default: return 'bg-white';
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4 md:p-6 bg-white rounded-[12px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 border-b-2 border-black pb-4">
        <div className="w-10 h-10 bg-green-100 border-2 border-black rounded-[8px] flex items-center justify-center">
          <TableProperties className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">DataFrame GroupBy Visualizer</h2>
          <p className="text-sm font-medium text-gray-500">See how Pandas groups and aggregates data rows.</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#f8f9fa] border-2 border-black p-4 rounded-[8px]">
        <code className="bg-black text-green-400 font-mono font-bold px-4 py-2 rounded-[6px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
          {grouped ? "df.groupby('dept').mean()" : "df.head(6)"}
        </code>
        <button 
          onClick={() => setGrouped(!grouped)}
          className={`flex items-center gap-2 px-6 py-2.5 border-2 border-black rounded-[6px] font-black uppercase tracking-widest text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${grouped ? 'bg-black text-white hover:bg-gray-800' : 'bg-[#22c55e] text-black hover:bg-[#16a34a]'}`}
        >
          <ArrowDownUp className="w-4 h-4" /> {grouped ? 'Reset Table' : 'Run GroupBy(Dept)'}
        </button>
      </div>

      <div className="flex-1 border-2 border-black rounded-[8px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-black text-xs font-black uppercase tracking-widest text-gray-500">
              <th className="p-3 border-r-2 border-black">ID</th>
              <th className="p-3 border-r-2 border-black">Name</th>
              <th className="p-3 border-r-2 border-black">Department</th>
              <th className="p-3 text-right">Salary ($)</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => (
              <tr key={row.id} className={`${getRowColor(row.dept)} border-b-2 border-black last:border-b-0 transition-colors duration-500`}>
                <td className="p-3 border-r-2 border-black font-mono font-bold text-gray-600">{row.id}</td>
                <td className="p-3 border-r-2 border-black font-bold">{row.name}</td>
                <td className="p-3 border-r-2 border-black font-bold">
                  {grouped ? <span className="px-2 py-1 bg-white border-2 border-black rounded-[4px] text-xs">{row.dept}</span> : row.dept}
                </td>
                <td className="p-3 font-mono font-bold text-right text-black">{row.salary.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {grouped && (
          <div className="bg-black p-4 flex justify-around border-t-2 border-black text-white font-mono text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-400">Engineering Avg</span>
              <span className="text-blue-400 font-bold text-lg">$87,500</span>
            </div>
            <div className="flex flex-col items-center border-l-2 border-gray-700 pl-8">
              <span className="text-gray-400">HR Avg</span>
              <span className="text-green-400 font-bold text-lg">$61,000</span>
            </div>
            <div className="flex flex-col items-center border-l-2 border-gray-700 pl-8">
              <span className="text-gray-400">Sales Avg</span>
              <span className="text-yellow-400 font-bold text-lg">$72,500</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
