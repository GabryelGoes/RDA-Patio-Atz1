
import { WorkshopData } from '../types';

export const fetchWorkshopData = async (): Promise<WorkshopData> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    boardName: "Gestão de Pátio • Oficina Premium",
    vehicles: [
      { id: "v1", model: "BMW X5 M-Sport", plate: "ABC-1234", client: "Ricardo Almeida", stage: "Em Serviço", deliveryDate: "15/10 - 17:00", mechanic: "Marcos Silva", lastActivity: "10 min" },
      { id: "v2", model: "Audi A4 Quattro", plate: "XYZ-9876", client: "Fernanda Costa", stage: "Aguardando Peças", deliveryDate: "18/10 - 10:00", mechanic: "Julio N.", lastActivity: "1h" },
      { id: "v3", model: "Porsche Macan GTS", plate: "PRC-1010", client: "Carlos Eduardo", stage: "Fase de Teste", deliveryDate: "HOJE - 16:30", mechanic: "André L.", lastActivity: "Just now" },
      { id: "v4", model: "VW Golf GTI", plate: "GTI-2024", client: "Juliana Paes", stage: "Aguardando Avaliação", deliveryDate: "16/10 - 14:00", mechanic: "TBD", lastActivity: "5 min" },
      { id: "v5", model: "Mercedes C180", plate: "MER-2222", client: "Bruno G.", stage: "Finalizado", deliveryDate: "ENTREGUE", mechanic: "Marcos Silva", lastActivity: "2h" },
      { id: "v6", model: "Toyota Hilux SW4", plate: "HIL-0000", client: "Sérgio M.", stage: "Garantia", deliveryDate: "URGENTE", mechanic: "André L.", lastActivity: "15 min" },
      // Carros da "Segunda Tela"
      { id: "v7", model: "Volvo XC60", plate: "VOL-6060", client: "Marcia R.", stage: "Em Avaliação", deliveryDate: "17/10 - 09:00", mechanic: "Julio N.", lastActivity: "30 min" },
      { id: "v8", model: "Land Rover Evoque", plate: "EVO-8888", client: "Luciano H.", stage: "Orçamento Não Aprovado", deliveryDate: "AG. RETIRADA", mechanic: "TBD", lastActivity: "4h" },
      { id: "v9", model: "Honda Civic Type R", plate: "CTR-2025", client: "Felipe M.", stage: "Aprovado", deliveryDate: "19/10 - 14:00", mechanic: "Marcos Silva", lastActivity: "5 min" },
    ]
  };
};
