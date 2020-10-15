import { Pipe, PipeTransform } from '@angular/core';
import { convertSecondsToHMSF, convertHMSFtoSeconds } from './utils';

@Pipe({
  name: 'seconds',
})
export class SecondsPipe implements PipeTransform {
  transform(hmsf: string): number {
    return convertHMSFtoSeconds(hmsf);
  }
}
