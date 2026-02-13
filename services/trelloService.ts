
import { WorkshopData, Vehicle, Stage } from '../types.ts';

const getEnv = (key: string): string => {
  return (import.meta as any).env?.[key] || '';
};

const API_KEY = getEnv('VITE_TRELLO_API_KEY');
const TOKEN = getEnv('VITE_TRELLO_TOKEN');
const BOARD_ID = getEnv('VITE_TRELLO_BOARD_ID');

export const fetchWorkshopData = async (): Promise<WorkshopData> => {
  if (!API_KEY || !TOKEN || !BOARD_ID) {
    console.warn("Trello API Key, Token or Board ID not found.");
    return { boardName: "Configurar Variáveis no Vercel", vehicles: [] };
  }

  try {
    const listsRes = await fetch(`https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${TOKEN}`);
    if (!listsRes.ok) throw new Error("Trello List fetch failed");
    const lists = await listsRes.json();

    const cardsRes = await fetch(`https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${TOKEN}`);
    if (!cardsRes.ok) throw new Error("Trello Card fetch failed");
    const cards = await cardsRes.json();

    const listMap = lists.reduce((acc: any, list: any) => {
      acc[list.id] = list.name;
      return acc;
    }, {});

    const vehicles: Vehicle[] = cards.map((card: any) => {
      const parts = card.name.split('-').map((p: string) => p.trim());
      
      return {
        id: card.id,
        model: parts[0] || 'Veículo',
        plate: parts[1] || '---',
        client: parts[2] || 'Cliente',
        stage: (listMap[card.idList] || 'Aguardando Avaliação') as Stage,
        deliveryDate: card.due ? new Date(card.due).toLocaleDateString('pt-BR') : 'Sem data',
        mechanic: card.labels?.[0]?.name || 'TBD',
        lastActivity: new Date(card.dateLastActivity).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
    });

    return {
      boardName: "Rei do ABS • Gestão de Pátio",
      vehicles
    };
  } catch (error) {
    console.error("Integration error:", error);
    return { boardName: "Erro de Conexão", vehicles: [] };
  }
};
