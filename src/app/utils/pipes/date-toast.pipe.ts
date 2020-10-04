import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateToast'
})
export class DateToastPipe implements PipeTransform {

  transform(value: any): string {
    moment.locale('en-ca');
    return moment(value).format('LTS');
  }

}
