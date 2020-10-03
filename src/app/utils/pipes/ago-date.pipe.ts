import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'agoDate'
})
export class AgoDatePipe implements PipeTransform {

  transform(value: any): string {
    moment.locale('en-ca');
    return moment(value).fromNow();
  }

}
