import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acerca'
})
export class AcercaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
