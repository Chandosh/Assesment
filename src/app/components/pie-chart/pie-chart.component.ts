import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @Input() data: [];
  private ctx: CanvasRenderingContext2D;
  lastend = 0;
  myTotal = 0;
  myColor = ['#deded4', '#5A5A71'];
  width = 24;
  height = 24;
  constructor() { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (changes.data) {
      this.myTotal = 0;
      this.drawPie();
    }
  }
  drawPie() {
    for (let e = 0; e < this.data.length; e++) {
      this.myTotal += this.data[e];
    }
    for (let i = 0; i < this.data.length; i++) {

    this.ctx.fillStyle = this.myColor[i];
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, this.height / 2);
    this.ctx.arc(this.width / 2, this.height / 2, this.height / 2, this.lastend, this.lastend +
       (Math.PI * 2 * ( this.data[i] / this.myTotal)), false);
    this.ctx.lineTo(this.width / 2, this.height / 2);
    this.ctx.fill();
    this.lastend += Math.PI * 2 * (this.data[i] / this.myTotal);
    }
  }
}
