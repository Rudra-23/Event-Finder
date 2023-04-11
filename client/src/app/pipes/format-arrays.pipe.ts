import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatArrays'
})
export class FormatArraysPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return value.join(' | ')
  }

}
