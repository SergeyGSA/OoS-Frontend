import { Child } from "./child.model";
import { Parent } from "./parent.model";
import { Workshop, WorkshopCard } from "./workshop.model";

export class Application {
  id: number;
  status: string;
  creationTime: Date;
  workshopId: number;
  childId: number;
  parentId: number;
  workshop: WorkshopCard;
  child: Child;
  parent: Parent;

  constructor(child: Child, workshop: Workshop, parent: Parent) {
    this.childId = child.id;
    this.workshopId = workshop.id;
    this.parentId = parent.id;
  }
}

export class ApplicationUpdate {
  id: number;
  status: string;

  constructor(id, status) {
    this.id = id;
    this.status = status;
  }
}