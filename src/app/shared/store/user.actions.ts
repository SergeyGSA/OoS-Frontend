import { Application } from '../models/application.model';
import { Child } from '../models/child.model';
import { Provider } from '../models/provider.model';
import { User } from '../models/user.model';
import { Workshop } from '../models/workshop.model';

export class GetWorkshopsById {
  static readonly type = '[user] get Workshop';
  constructor(public payload: number) { }
}
export class GetApplicationsByUserId {
  static readonly type = '[user] get Applications By User Id';
  constructor(public payload: string) { }
}
export class GetApplications {
  static readonly type = '[user] get Applications';
  constructor() { }
}
export class GetChildren {
  static readonly type = '[user] get Children';
  constructor() { }
}
export class CreateWorkshop {
  static readonly type = '[user] create Workshop';
  constructor(public payload: Workshop) { }
}
export class OnCreateWorkshopFail {
  static readonly type = '[user] create Workshop fail';
  constructor(public payload: Error) { }
}
export class OnCreateWorkshopSuccess {
  static readonly type = '[user] create Workshop success';
  constructor(public payload) { }
}
export class DeleteWorkshopById {
  static readonly type = '[user] delete Workshop';
  constructor(public payload: number) { }
}
export class OnDeleteWorkshopSuccess {
  static readonly type = '[user] delete Workshop success';
  constructor(public payload) { }
}
export class OnDeleteWorkshopFail {
  static readonly type = '[user] delete Workshop fail';
  constructor(public payload) { }
}
export class CreateChildren {
  static readonly type = '[parent] create Children';
  constructor(public payload: Child) { }
}
export class OnCreateChildrenFail {
  static readonly type = '[user] create Children fail';
  constructor(public payload: Error) { }
}
export class OnCreateChildrenSuccess {
  static readonly type = '[user] create Children success';
  constructor(public payload) { }
}
export class DeleteChildById {
  static readonly type = '[user] delete Children';
  constructor(public payload: number) { }
}
export class OnDeleteChildSuccess {
  static readonly type = '[user] delete Children success';
  constructor(public payload) { }
}
export class OnDeleteChildFail {
  static readonly type = '[user] delete Children fail';
  constructor(public payload: Error) { }
}
export class CreateProvider {
  static readonly type = '[parent] create Provider';
  constructor(public payload: Provider) { }
}
export class OnCreateProviderFail {
  static readonly type = '[user] create Provider fail';
  constructor(public payload: Error) { }
}
export class OnCreateProviderSuccess {
  static readonly type = '[user] create Provider success';
  constructor(public payload) { }
}
export class CreateParent {
  static readonly type = '[parent] create Parent';
  constructor(public payload: User) { }
}
export class OnCreateParentFail {
  static readonly type = '[parent] create Parent fail';
  constructor(public payload: Error) { }
}
export class OnCreateParentSuccess {
  static readonly type = '[parent] create Parent success';
  constructor(public payload) { }
}
export class CreateApplication {
  static readonly type = '[user] create Application';
  constructor(public payload: Application) { }
}
export class OnCreateApplicationFail {
  static readonly type = '[user] create Application fail';
  constructor(public payload: Error) { }
}
export class OnCreateApplicationSuccess {
  static readonly type = '[user] create Application success';
  constructor(public payload) { }
}
export class UpdateChild {
  static readonly type = '[user] update Child';
  constructor(public payload: Child) { }
}
export class OnUpdateChildFail {
  static readonly type = '[user] update Child fail';
  constructor(public payload: Error) { }
}
export class OnUpdateChildSuccess {
  static readonly type = '[user] update Child success';
  constructor(public payload) { }
}
export class UpdateProvider {
  static readonly type = '[user] update Provider';
  constructor(public payload: Provider) { }
}
export class OnUpdateProviderFail {
  static readonly type = '[user] update Provider fail';
  constructor(public payload: Error) { }
}
export class OnUpdateProviderSuccess {
  static readonly type = '[user] update Provider success';
  constructor(public payload) { }
}