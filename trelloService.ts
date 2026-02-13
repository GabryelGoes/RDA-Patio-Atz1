
import { WorkshopData, Vehicle, Stage } from './types.ts';

// Tenta obter de import.meta.env (Vite) ou process.env (outros ambientes)
const getEnv = (key: string): string => {
  return (import.meta as any).env?.[key] || (process as any).env?.[key] || '';
};

const API_KEY = getEnv('VITE_TRELLO_API_KEY');
const TOKEN = getEnv('VITE_TRELLO_TOKEN');
const BOARD_ID = getEnv('VITE_TRELLO_BOARD_ID');

// Dados de fallback para quando o Trello não estiver configurado ou falhar
const MOCK_VEHICLES: Vehicle[] = [
  { 
    id: "m1", 
    model: "BMW X5 M-Sport", 
    plate: "ABC-1234", 
    client: "Ricardo Almeida", 
    stage: "Em Serviço", 
    deliveryDate: "15/05", 
    rawDueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Atrasado
    mechanic: "Marcos Silva", 
    lastActivity: "10 min" 
  },
  { 
    id: "m2", 
    model: "Audi A4 Quattro", 
    plate: "XYZ-9876", 
    client: "Fernanda Costa", 
    stage: "Aguardando Peças", 
    deliveryDate: "18/05", 
    rawDueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    mechanic: "Julio N.", 
    lastActivity: "1h" 
  },
  { 
    id: "m3", 
    model: "Porsche Macan GTS", 
    plate: "PRC-1010", 
    client: "Carlos Eduardo", 
    stage: "Fase de Teste", 
    deliveryDate: "HOJE", 
    rawDueDate: new Date(), // Hoje
    mechanic: "André L.", 
    lastActivity: "Agora" 
  },
  { 
    id: "m4", 
    model: "VW Golf GTI", 
    plate: "GTI-2024", 
    client: "Juliana Paes", 
    stage: "Orçamento Aprovado", 
    deliveryDate: "20/05", 
    rawDueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    mechanic: "Marcos Silva", 
    lastActivity: "5 min" 
  },
  { 
    id: "m5", 
    model: "Mercedes C180", 
    plate: "MER-2222", 
    client: "Bruno G.", 
    stage: "Finalizado", 
    deliveryDate: "22/05", 
    rawDueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    mechanic: "Julio N.", 
    lastActivity: "2h" 
  },
  { 
    id: "m6", 
    model: "Toyota Hilux SW4", 
    plate: "HIL-0000", 
    client: "Sérgio M.", 
    stage: "Garantia", 
    deliveryDate: "URGENTE", 
    rawDueDate: new Date(new Date().setHours(new Date().getHours() - 5)), // Atrasado HOJE
    mechanic: "André L.", 
    lastActivity: "15 min" 
  },
  { 
    id: "m7", 
    model: "Land Rover Evoque", 
    plate: "EVO-8888", 
    client: "Luciano H.", 
    stage: "Orçamento Não Aprovado", 
    deliveryDate: "AG. RETIRADA", 
    rawDueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    mechanic: "Pátio", 
    lastActivity: "4h" 
  }
];

export const fetchWorkshopData = async (): Promise<WorkshopData> => {
  // Se as chaves não estiverem configuradas, retorna dados Mock para que o dashboard funcione
  if (!API_KEY || !TOKEN || !BOARD_ID) {
    console.warn("Variáveis de ambiente Trello não configuradas. Exibindo modo de demonstração.");
    return {
      boardName: "Rei do ABS • Modo Demonstração",
      vehicles: MOCK_VEHICLES
    };
  }

  try {
    const [listsRes, cardsRes] = await Promise.all([
      fetch(`https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${TOKEN}`),
      fetch(`https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${TOKEN}&members=true`)
    ]);

    if (!listsRes.ok || !cardsRes.ok) throw new Error("Erro ao acessar API do Trello");

    const lists = await listsRes.json();
    const cards = await cardsRes.json();

    const listMap = lists.reduce((acc: any, list: any) => {
      acc[list.id] = list.name;
      return acc;
    }, {});

    const vehicles: Vehicle[] = cards.map((card: any) => {
      const nameParts = card.name.split('-').map((p: string) => p.trim());
      const dueDate = card.due ? new Date(card.due) : undefined;
      
      return {
        id: card.id,
        model: nameParts[0] || 'Veículo',
        plate: nameParts[1] || '---',
        client: nameParts[2] || 'Cliente',
        stage: (listMap[card.idList] || 'Aguardando Avaliação') as Stage,
        deliveryDate: dueDate ? dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '---',
        rawDueDate: dueDate,
        mechanic: card.members?.[0]?.fullName || 'Pátio',
        lastActivity: new Date(card.dateLastActivity).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
    });

    return {
      boardName: "Rei do ABS • Gestão de Pátio",
      vehicles
    };
  } catch (error) {
    console.error("Trello Integration Error:", error);
    return { 
      boardName: "Rei do ABS • Modo Offline", 
      vehicles: MOCK_VEHICLES 
    };
  }
};
