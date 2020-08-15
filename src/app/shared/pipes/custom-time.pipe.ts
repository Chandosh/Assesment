import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customTime'
})
export class CustomTimePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    const hour = Math.floor(value / 60);
    const min = (value % 60);
    return hour + ':' + min;
  }

}
