import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chartContainer!: ElementRef;

  data = [
    { name: 'Case 1', value: 100 },
    { name: 'Case 2', value: 200 },
    { name: 'Case 3', value: 150 },
    { name: 'Case 4', value: 300 },
    { name: 'Case 5', value: 250 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Dados podem ser carregados ou manipulados aqui.
  }

  ngAfterViewInit(): void {
    this.createBarChart();
  }

  createBarChart(): void {
    const svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', 600)
      .attr('height', 400);

    // Definir margens e dimensões
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    // Definir a escala para o eixo X
    const x = d3.scaleBand()
      .domain(this.data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    // Definir a escala para o eixo Y
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value)!])
      .nice()
      .range([height, 0]);

    // Adicionar grupo para o gráfico
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Adicionar barras ao gráfico
    g.selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#2F4F4F');

    // Adicionar eixo X
    g.append('g')
      .selectAll('.x-axis')
      .data(this.data)
      .enter().append('text')
      .attr('class', 'x-axis')
      .attr('x', (d, i) => x(d.name)! + x.bandwidth() / 2)
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .text(d => d.name);

    // Adicionar eixo Y
    g.append('g')
      .selectAll('.y-axis')
      .data(this.data)
      .enter().append('text')
      .attr('class', 'y-axis')
      .attr('x', -10)
      .attr('y', (d, i) => y(d.value)!)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .text(d => d.value);
  }
}
