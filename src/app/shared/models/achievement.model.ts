
export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs?: string;
  teachers?: string;

  constructor(info, workshopId) {
    this.childrenIDs = info.childrenIDs,
    this.teachers = info.teachers;
    this.title = info.title;
    this.workshopId = workshopId;
  }
}
