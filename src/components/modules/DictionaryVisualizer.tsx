import { useState } from 'react';
import { Plus, Trash2, Key, Database } from 'lucide-react';

export default function DictionaryVisualizer() {
  const [dict, setDict] = useState<Record<string, string>>({
    name: "Python",
    version: "3.10",
    paradigm: "Object-Oriented"
  });
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  const handleAdd = () => {
    if(newKey.trim() !== "") {
      setDict({...dict, [newKey]: newVal});
      setNewKey("");
      setNewVal("");
    }
  }

  const handleDelete = (k: string) => {
    const newD = {...dict};
    delete newD[k];
    setDict(newD);
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4 md:p-6 bg-white rounded-[12px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 border-b-2 border-black pb-4">
        <div className="w-10 h-10 bg-[#ffebee] border-2 border-black rounded-[8px] flex items-center justify-center">
          <Database className="w-5 h-5 text-[#e53935]" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Interactive Dictionary Mapper</h2>
          <p className="text-sm font-medium text-gray-500">Add, update, or remove key-value pairs dynamically.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-end bg-[#f8f9fa] p-4 border-2 border-black rounded-[8px]">
        <div className="flex-1">
          <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Key (String)</label>
          <input value={newKey} onChange={e => setNewKey(e.target.value)} className="w-full border-2 border-black rounded-[6px] p-2.5 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:border-[#e53935]" placeholder="e.g. 'age'" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Value (Any)</label>
          <input value={newVal} onChange={e => setNewVal(e.target.value)} className="w-full border-2 border-black rounded-[6px] p-2.5 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:border-[#e53935]" placeholder="e.g. 25" />
        </div>
        <button onClick={handleAdd} className="bg-black text-white px-5 py-2.5 border-2 border-black rounded-[6px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] hover:bg-[#e53935] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Insert
        </button>
      </div>

      {/* Visualizer Grid */}
      <div className="flex-1 bg-gray-50 border-2 border-black rounded-[8px] p-6 flex flex-col gap-6 overflow-y-auto">
        {Object.entries(dict).map(([k, v]) => (
          <div key={k} className="flex items-center group w-full max-w-lg mx-auto">
            {/* Key Box */}
            <div className="bg-white border-2 border-black p-3 rounded-[6px] flex items-center gap-2 w-[140px] justify-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 shrink-0">
              <Key className="w-4 h-4 text-[#e53935]" />
              <span className="font-mono font-bold text-black truncate">"{k}"</span>
              {/* Connector line */}
              <div className="absolute top-1/2 left-full w-8 h-[2px] bg-black -translate-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-[calc(100%+24px)] w-2 h-2 border-t-2 border-r-2 border-black rotate-45 -translate-y-1/2 z-0"></div>
            </div>
            
            {/* Value Box */}
            <div className="bg-[#fff9fa] border-2 border-black p-3 rounded-[6px] flex items-center gap-2 ml-8 justify-center relative shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] z-10 flex-1">
              <span className="font-mono font-bold text-black truncate">{v}</span>
            </div>

            <button onClick={() => handleDelete(k)} className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border-2 border-transparent hover:border-red-200 rounded-[6px] transition-all opacity-0 group-hover:opacity-100 shrink-0">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {Object.keys(dict).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-400 font-bold py-12">
            <Database className="w-12 h-12 mb-3 text-gray-300" />
            Dictionary is empty. Add a Key-Value pair!
          </div>
        )}
      </div>
    </div>
  );
}
