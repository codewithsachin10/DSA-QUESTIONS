import { useState } from 'react';
import { Grid3X3, Scissors } from 'lucide-react';

export default function NumpyVisualizer() {
  const [sliceStartRow, setSliceStartRow] = useState(0);
  const [sliceEndRow, setSliceEndRow] = useState(4);
  const [sliceStartCol, setSliceStartCol] = useState(0);
  const [sliceEndCol, setSliceEndCol] = useState(4);

  const matrix = [
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120],
    [130, 140, 150, 160]
  ];

  const isSliced = (r: number, c: number) => {
    return r >= sliceStartRow && r < sliceEndRow && c >= sliceStartCol && c < sliceEndCol;
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4 md:p-6 bg-white rounded-[12px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 border-b-2 border-black pb-4">
        <div className="w-10 h-10 bg-blue-100 border-2 border-black rounded-[8px] flex items-center justify-center">
          <Grid3X3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Array Slicing Visualizer</h2>
          <p className="text-sm font-medium text-gray-500">Adjust the slicing indices to extract sub-matrices.</p>
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-[#f8f9fa] border-2 border-black rounded-[8px]">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 block">Row Slice [start:end]</label>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="4" value={sliceStartRow} onChange={e => setSliceStartRow(Number(e.target.value))} className="w-full accent-blue-600" />
            <input type="range" min="0" max="4" value={sliceEndRow} onChange={e => setSliceEndRow(Math.max(sliceStartRow, Number(e.target.value)))} className="w-full accent-blue-600" />
          </div>
          <div className="text-xs font-mono font-bold text-black text-center">[{sliceStartRow} : {sliceEndRow}]</div>
        </div>
        <div className="w-[2px] bg-black"></div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 block">Col Slice [start:end]</label>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="4" value={sliceStartCol} onChange={e => setSliceStartCol(Number(e.target.value))} className="w-full accent-blue-600" />
            <input type="range" min="0" max="4" value={sliceEndCol} onChange={e => setSliceEndCol(Math.max(sliceStartCol, Number(e.target.value)))} className="w-full accent-blue-600" />
          </div>
          <div className="text-xs font-mono font-bold text-black text-center">[{sliceStartCol} : {sliceEndCol}]</div>
        </div>
      </div>

      <div className="flex-1 bg-white border-2 border-black rounded-[8px] p-8 flex flex-col items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
        
        <div className="mb-6 font-mono text-lg font-bold text-black bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-[8px] flex items-center gap-3">
          <Scissors className="w-5 h-5 text-blue-600" />
          <span>matrix[{sliceStartRow}:{sliceEndRow}, {sliceStartCol}:{sliceEndCol}]</span>
        </div>

        <div className="grid grid-cols-4 gap-2 bg-black p-2 rounded-[8px] shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
          {matrix.map((row, rIdx) => (
            row.map((val, cIdx) => (
              <div 
                key={`${rIdx}-${cIdx}`} 
                className={`w-16 h-16 flex items-center justify-center font-mono font-black text-lg border-2 transition-all duration-300 ${isSliced(rIdx, cIdx) ? 'bg-[#3b82f6] border-white text-white scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10' : 'bg-gray-800 border-gray-700 text-gray-500 scale-100 z-0'}`}
              >
                {val}
              </div>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}
