
import React from 'react';
import { Vehicle, Stage } from './types.ts';

interface VehicleRowProps {
  vehicle: Vehicle;
}

const getStageColors = (stage: Stage) => {
  const s = stage.toLowerCase();
  if (s.includes('garantia')) return 'bg-red-600 text-white border-red-500';
  if (s.includes('avaliação') && s.includes('aguardando')) return 'bg-zinc-900 text-zinc-400 border-zinc-800';
  if (s.includes('avaliação') || s.includes('aprovação')) return 'bg-yellow-400 text-yellow-950 border-yellow-300';
  if (s.includes('aprovado') || s.includes('serviço')) return 'bg-orange-500 text-white border-orange-400';
  if (s.includes('peças')) return 'bg-blue-600 text-white border-blue-500';
  if (s.includes('teste')) return 'bg-green-600 text-white border-green-500'; // Verde Folha
  if (s.includes('finalizado')) return 'bg-green-800 text-white border-green-700';
  if (s.includes('não aprovado')) return 'bg-violet-700 text-white border-violet-600'; // Violeta
  
  return 'bg-zinc-800 text-white border-zinc-700';
};

const VehicleRow: React.FC<VehicleRowProps> = ({ vehicle }) => {
  const colorClass = getStageColors(vehicle.stage);
  
  const displayStage = vehicle.stage.toLowerCase().includes('não aprovado') ? 'Não Aprovado' : vehicle.stage;
  
  const isAguardando = vehicle.stage.toLowerCase().startsWith('aguardando');
  const isEmServico = vehicle.stage.toLowerCase().includes('serviço');

  const getDeliveryStatus = () => {
    if (!vehicle.rawDueDate) return { label: vehicle.deliveryDate, alert: null, highlight: false };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(vehicle.rawDueDate);
    delivery.setHours(0, 0, 0, 0);

    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        label: "ATRASADO", 
        alert: null,
        highlight: true // Fonte maior solicitada
      };
    }

    if (diffDays === 0) {
      return { 
        label: "HOJE", 
        alert: null,
        highlight: true // Aplicando fonte maior para consistência de status
      };
    }

    if (diffDays === 1) {
      return { 
        label: vehicle.deliveryDate, 
        alert: 'tomorrow',
        highlight: false
      };
    }

    return { label: vehicle.deliveryDate, alert: null, highlight: false };
  };

  const deliveryStatus = getDeliveryStatus();

  const formatMechanicName = (name: string) => {
    if (!name || name === 'Pátio' || name === 'TBD') return name;
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0]} ${parts[1][0]}.`; 
    return name;
  };

  return (
    <div className={`flex items-center w-full h-full rounded-[24px] border px-8 transition-all duration-700 shadow-xl overflow-hidden ${colorClass}`}>
      {/* MODELO / PLACA */}
      <div className="w-[22%] flex flex-col justify-center py-1">
        <h2 className="text-3xl font-black tracking-tighter truncate leading-none uppercase italic pr-2">
          {vehicle.model.replace('Land Rover', '').trim()}
        </h2>
        <span className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-[0.3em]">{vehicle.plate}</span>
      </div>

      {/* CLIENTE */}
      <div className="w-[16%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <p className="text-xl font-bold truncate uppercase leading-tight tracking-tight pr-2">{vehicle.client}</p>
      </div>

      {/* ETAPA ATUAL */}
      <div className="w-[34%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <div className="flex items-center gap-3">
          {/* ÍCONE PULSANTE PARA SERVIÇO */}
          {isEmServico && (
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </div>
          )}

          {/* ÍCONE RELÓGIO PARA AGUARDANDO */}
          {isAguardando && (
            <div className="relative w-5 h-5 flex items-center justify-center border-2 border-current rounded-full shrink-0">
              <div className="absolute w-[1.5px] h-2 bg-current origin-bottom animate-[spin_3s_linear_infinite]" style={{ top: '15%' }}></div>
              <div className="absolute w-[1.5px] h-1.5 bg-current origin-bottom rotate-90" style={{ top: '25%', left: '48%' }}></div>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-hidden">
            {/* SÍMBOLO V VERDE PARA ORÇAMENTO APROVADO */}
            {displayStage === 'Orçamento Aprovado' && (
              <span className="text-green-400 font-black text-2xl drop-shadow-sm shrink-0">✓</span>
            )}
            
            {/* SÍMBOLO X VERMELHO PARA NÃO APROVADO */}
            {displayStage === 'Não Aprovado' && (
              <span className="text-red-500 font-black text-2xl drop-shadow-sm shrink-0">✕</span>
            )}

            <p className={`font-black uppercase italic tracking-tighter leading-none truncate pr-2 ${displayStage.length > 15 ? 'text-2xl' : 'text-3xl'}`}>
              {displayStage}
            </p>
          </div>
        </div>
      </div>

      {/* ENTREGA / DATAS */}
      <div className="w-[14%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <div className="flex items-center gap-2">
          {deliveryStatus.alert === 'tomorrow' && (
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 24 24" className="w-full h-full text-red-600 drop-shadow-md" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                  <text x="12" y="18" textAnchor="middle" fill="black" fontSize="12" fontWeight="bold">!</text>
               </svg>
            </div>
          )}

          <p className={`font-black uppercase leading-none truncate tracking-tighter pr-2 ${deliveryStatus.highlight ? 'text-3xl animate-pulse' : 'text-2xl'}`}>
            {deliveryStatus.label}
          </p>
        </div>
      </div>

      {/* MECÂNICO */}
      <div className="w-[14%] flex flex-col justify-center border-l border-current/10 pl-6 py-1">
        <p className="text-xl font-bold uppercase truncate leading-none tracking-tight pr-2">
          {formatMechanicName(vehicle.mechanic)}
        </p>
      </div>
    </div>
  );
};

export default VehicleRow;
