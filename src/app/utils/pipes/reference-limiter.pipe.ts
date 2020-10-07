import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'referenceLimiter'
})
export class ReferenceLimiterPipe implements PipeTransform {

  transform(value: string): string {
    if (value.length > 85) {
      const arrayValue: string[] = value.split(' ');
      let length = 0;
      let newValue = '';
      arrayValue.map((word: string) => {
        if (length + word.length <= 87) {
          newValue += word + ' ';
          length += word.length + 1;
        }
      });
      return newValue.trim() + '...';
    } else {
      return value;
    }
  }

}
