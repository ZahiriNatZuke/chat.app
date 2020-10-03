import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateChat'
})
export class DateChatPipe implements PipeTransform {
  transform(value: any): string {
    moment.locale('en-ca');
    return moment(value).format('MM/DD/YYYY LTS');
  }
}
