
import { WorkshopData, Vehicle, Stage } from './types.ts';

const API_KEY = (import.meta as any).env?.VITE_TRELLO_API_KEY || '';
const TOKEN = (import.meta as any).env?.VITE_TRELLO_TOKEN || '';
const BOARD_ID = (import.meta as any).env?.VITE_TRELLO_BOARD_ID || '';

export const fetchWorkshopData = async (): Promise<WorkshopData> => {
  if (!API_KEY || !TOKEN || !BOARD_ID) {
    console.error("Variáveis de ambiente VITE_TRELLO_... não configuradas.");
    return { boardName: "Erro: Configuração Ausente", vehicles: [] };
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
    return { boardName: "Erro de Conexão", vehicles: [] };
  }
};
