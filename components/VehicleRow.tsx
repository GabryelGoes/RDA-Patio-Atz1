
import React from 'react';
import { Vehicle, Stage } from '../types.ts';

interface VehicleRowProps {
  vehicle: Vehicle;
}

const getStageColors = (stage: Stage) => {
  const s = stage.toLowerCase();

  // PRIORIDADE MÁXIMA: Lilás para Não Aprovado
  if (s.includes('não aprovado') || s.includes('nao aprovado')) {
    return 'bg-purple-400 text-white border-purple-300';
  }

  if (s.includes('garantia')) return 'bg-red-600 text-white border-red-500';
  if (s.includes('avaliação') && s.includes('aguardando')) return 'bg-zinc-900 text-zinc-400 border-zinc-800';
  if (s.includes('avaliação') || s.includes('aprovação')) return 'bg-yellow-400 text-yellow-950 border-yellow-300';
  
  // Azul para Em Serviço
  if (s.includes('serviço')) return 'bg-blue-600 text-white border-blue-500';
  
  // Laranja para Aprovado
  if (s.includes('aprovado')) return 'bg-orange-500 text-white border-orange-400';
  
  // Azul Turquesa para Peças
  if (s.includes('peças')) return 'bg-cyan-500 text-white border-cyan-400';
  
  if (s.includes('teste')) return 'bg-green-600 text-white border-green-500'; 
  if (s.includes('finalizado')) return 'bg-green-800 text-white border-green-700';
  
  return 'bg-zinc-800 text-white border-zinc-700';
};

const VehicleRow: React.FC<VehicleRowProps> = ({ vehicle }) => {
  const colorClass = getStageColors(vehicle.stage);
  
  const s = vehicle.stage.toLowerCase();
  const isNaoAprovado = s.includes('não aprovado') || s.includes('nao aprovado');
  const isFaseDeTeste = s.includes('teste');
  const isAprovado = s.includes('aprovado');
  const displayStage = isNaoAprovado ? 'Não Aprovado' : vehicle.stage;
  
  const isEmServico = s.includes('serviço');

  const formatMechanicName = (name: string) => {
    if (!name || name === 'Pátio' || name === 'TBD') return name;
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0]} ${parts[1][0]}.`; 
    return name;
  };

  return (
    <div className={`flex items-center w-full h-full rounded-[24px] border px-8 transition-all duration-700 shadow-xl overflow-hidden ${colorClass}`}>
      <div className="w-[22%] flex flex-col justify-center py-1">
        <h2 className="text-3xl font-black tracking-tighter truncate leading-none uppercase italic pr-2">
          {vehicle.model.replace('Land Rover', '').trim()}
        </h2>
        <span className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-[0.3em]">{vehicle.plate}</span>
      </div>

      <div className="w-[16%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <p className="text-xl font-bold truncate uppercase leading-tight tracking-tight pr-2">{vehicle.client}</p>
      </div>

      <div className="w-[34%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <div className="flex items-center gap-3">
          {isEmServico && (
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </div>
          )}
          <div className="flex items-center gap-2 overflow-hidden">
            {isNaoAprovado && <span className="text-red-500 font-black text-2xl shrink-0 animate-pulse">✕</span>}
            
            {isAprovado && !isNaoAprovado && (
              <span className="text-green-400 font-black text-2xl shrink-0 animate-bounce">✓</span>
            )}

            {isFaseDeTeste && (
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md shrink-0 mr-1 animate-drive" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            )}

            <p className={`font-black uppercase italic tracking-tighter leading-none truncate pr-2 ${displayStage.length > 15 ? 'text-2xl' : 'text-3xl'}`}>
              {displayStage}
            </p>
          </div>
        </div>
      </div>

      <div className="w-[14%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <p className={`font-black uppercase leading-none truncate tracking-tighter pr-2 ${
          vehicle.deliveryDate.includes('ATRASADO') ? 'text-xl' : 'text-2xl'
        }`}>
          {vehicle.deliveryDate}
        </p>
      </div>

      <div className="w-[14%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <p className="text-xl font-bold uppercase truncate leading-none tracking-tight pr-2">
          {formatMechanicName(vehicle.mechanic)}
        </p>
      </div>
    </div>
  );
};

export default VehicleRow;
