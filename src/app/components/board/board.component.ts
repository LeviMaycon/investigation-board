import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {
  cards = [
    { id: '1', title: 'Daniel', position: { x: 150, y: 150 }, connections: ['2', '3'] },
    { id: '2', title: 'Levi', position: { x: 400, y: 400 }, connections: ['1'] },
    { id: '3', title: 'Rossado', position: { x: 650, y: 150 }, connections: ['1'] },
    { id: '4', title: 'Drew', position: { x: 900, y: 340 }, connections: ['1'] },
  ];

  private dragData: { card: any, offsetX: number, offsetY: number } | null = null;

  constructor() { }

  ngOnInit(): void {
    console.log('BoardComponent ngOnInit');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawConnections();
    });
  }

  drawConnections() {
    const svg = d3.select('#boardSvg');

    if (svg.empty()) {
      console.error('SVG element not found!');
      return;
    }

    svg.selectAll('line').remove();

    const cardWidth = 100;
    const cardHeight = 100;

    this.cards.forEach(card => {
      card.connections.forEach(connectionId => {
        const targetCard = this.cards.find(c => c.id === connectionId);

        if (targetCard) {
          console.log(`Drawing line from ${card.id} to ${targetCard.id}`);

          const x1 = card.position.x + cardWidth / 2  / cardHeight;
          const y1 = card.position.y + cardHeight / 2 / cardHeight;
          const x2 = targetCard.position.x + cardWidth / 2 / cardHeight;
          const y2 = targetCard.position.y + cardHeight / 2 / cardHeight;

          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

          console.log(`Distance from ${card.id} to ${targetCard.id}: ${distance}`);

          svg.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-width', `${distance / 10} ${distance / 5}`);
        }
      });
    });
  }

  trackByCardId(index: number, card: any): string {
    return card.id;
  }

  startDrag(event: MouseEvent | TouchEvent, card: any) {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }

    const offsetX = event instanceof MouseEvent ? event.clientX - card.position.x : 0;
    const offsetY = event instanceof MouseEvent ? event.clientY - card.position.y : 0;

    this.dragData = { card, offsetX, offsetY };

    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchmove', this.onDragMove);
    document.addEventListener('touchend', this.endDrag);
  }

  onDragMove = (event: MouseEvent | TouchEvent) => {
    if (!this.dragData) return;

    const card = this.dragData.card;
    const offsetX = this.dragData.offsetX;
    const offsetY = this.dragData.offsetY;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    card.position.x = clientX - offsetX;
    card.position.y = clientY - offsetY;

    this.drawConnections();
  };
  endDrag = () => {
    if (this.dragData) {
      document.removeEventListener('mousemove', this.onDragMove);
      document.removeEventListener('mouseup', this.endDrag);
      document.removeEventListener('touchmove', this.onDragMove);
      document.removeEventListener('touchend', this.endDrag);
      this.dragData = null;
    }
  };
}
