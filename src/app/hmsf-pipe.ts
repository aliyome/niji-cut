import { Pipe, PipeTransform } from '@angular/core';
import { convertSecondsToHMSF } from './utils';

@Pipe({
  name: 'hmsf',
})
export class HmsfPipe implements PipeTransform {
  transform(seconds: number): string {
    return convertSecondsToHMSF(seconds);
  }
}
