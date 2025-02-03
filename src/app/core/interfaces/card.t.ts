export interface Card {
  id: string;
  title: string;
  description: string;
  position: { x: number, y: number };
  connections: string[];
}
