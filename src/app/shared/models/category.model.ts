import { PaginationParameters } from './queryParameters.model';

export class Direction {
  id: number;
  title: string;
  description: string;
  workshopsCount?: number;

  constructor(info) {
    if (info.id) {
      this.id = info.id;
    }
    this.title = info.title;
    this.description = info.title;
    this.workshopsCount = info.workshopsCount;
  }
}

export interface DirectionParameters extends PaginationParameters {
  searchString: string;
}
