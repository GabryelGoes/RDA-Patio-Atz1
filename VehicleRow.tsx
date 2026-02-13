
import React from 'react';
import { Vehicle, Stage } from './types.ts';

interface VehicleRowProps {
  vehicle: Vehicle;
}

const getStageColors = (stage: Stage) => {
  const s = stage.toLowerCase();
  
  if (s.includes('não aprovado') || s.includes('nao aprovado')) {
    return 'bg-purple-600 text-white border-purple-500';
  }

  if (s.includes('garantia')) return 'bg-red-700 text-white border-red-600';
  if (s.includes('avaliação') && s.includes('aguardando')) return 'bg-zinc-900 text-zinc-500 border-zinc-800';
  if (s.includes('avaliação') || s.includes('aprovação')) return 'bg-yellow-400 text-yellow-950 border-yellow-300';
  
  if (s.includes('serviço')) return 'bg-blue-600 text-white border-blue-500';
  if (s.includes('aprovado')) return 'bg-orange-600 text-white border-orange-500';
  if (s.includes('peças')) return 'bg-cyan-500 text-white border-cyan-400';
  if (s.includes('teste')) return 'bg-green-600 text-white border-green-500'; 
  if (s.includes('finalizado')) return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  
  return 'bg-zinc-800 text-white border-zinc-700';
};

const VehicleRow: React.FC<VehicleRowProps> = ({ vehicle }) => {
  const colorClass = getStageColors(vehicle.stage);
  const s = vehicle.stage.toLowerCase();
  
  const isNaoAprovado = s.includes('não aprovado') || s.includes('nao aprovado');
  const isFaseDeTeste = s.includes('teste');
  const isAprovado = s.includes('aprovado');
  const isEmServico = s.includes('serviço');
  const isAguardando = s.startsWith('aguardando');
  
  const displayStage = isNaoAprovado ? 'Não Aprovado' : vehicle.stage;

  const getDeliveryStatus = () => {
    if (!vehicle.rawDueDate) return { label: vehicle.deliveryDate, highlight: false, isDelayed: false };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(vehicle.rawDueDate);
    delivery.setHours(0, 0, 0, 0);

    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "ATRASADO", highlight: true, isDelayed: true };
    if (diffDays === 0) return { label: "HOJE", highlight: true, isDelayed: false };
    return { label: vehicle.deliveryDate, highlight: false, isDelayed: false };
  };

  const status = getDeliveryStatus();

  return (
    <div className={`flex items-center w-full h-full rounded-[24px] border px-8 transition-all duration-700 shadow-xl overflow-hidden ${colorClass}`}>
      {/* MODELO */}
      <div className="w-[22%] flex flex-col justify-center">
        <h2 className="text-3xl font-black tracking-tighter truncate uppercase italic leading-none">
          {vehicle.model.replace('Land Rover', '').trim()}
        </h2>
        <span className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-[0.3em]">{vehicle.plate}</span>
      </div>

      {/* CLIENTE */}
      <div className="w-[16%] border-l border-current/10 pl-6">
        <p className="text-xl font-bold truncate uppercase tracking-tight">{vehicle.client}</p>
      </div>

      {/* ETAPA */}
      <div className="w-[34%] border-l border-current/10 pl-6">
        <div className="flex items-center gap-3">
          {isEmServico && (
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </div>
          )}

          {isAguardando && !isFaseDeTeste && !isNaoAprovado && (
            <div className="w-5 h-5 flex items-center justify-center border-2 border-current rounded-full shrink-0">
               <div className="w-[1.5px] h-2 bg-current origin-bottom animate-[spin_3s_linear_infinite]"></div>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-hidden">
            {isAprovado && !isNaoAprovado && (
              <span className="text-green-300 font-black text-3xl animate-bounce shrink-0">✓</span>
            )}
            
            {isNaoAprovado && (
              <span className="text-red-500 font-black text-3xl animate-pulse shrink-0">✕</span>
            )}

            {isFaseDeTeste && (
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white animate-drive shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            )}

            <p className={`font-black uppercase italic tracking-tighter leading-none truncate ${displayStage.length > 15 ? 'text-2xl' : 'text-3xl'}`}>
              {displayStage}
            </p>
          </div>
        </div>
      </div>

      {/* ENTREGA / ATRASADO */}
      <div className="w-[14%] border-l border-current/10 pl-6">
        <p className={`font-black uppercase leading-none tracking-tighter truncate ${
          status.isDelayed 
            ? 'text-4xl text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] animate-pulse' 
            : status.highlight ? 'text-3xl animate-pulse' : 'text-2xl opacity-80'
        }`}>
          {status.label}
        </p>
      </div>

      {/* MECÂNICO */}
      <div className="w-[14%] border-l border-current/10 pl-6">
        <p className="text-xl font-bold uppercase truncate tracking-tight opacity-90">
          {vehicle.mechanic}
        </p>
      </div>
    </div>
  );
};

export default VehicleRow;
