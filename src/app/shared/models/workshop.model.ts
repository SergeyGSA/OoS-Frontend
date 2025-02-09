import { WorkshopOpenStatus } from '../enum/workshop';
import { Address } from './address.model';
import { Provider } from './provider.model';
import { PaginationParameters } from './queryParameters.model';
import { SectionItem } from './sectionItem.model';
import { Teacher } from './teacher.model';
import { DateTimeRanges } from './workingHours.model';

export interface WorkshopTruncated {
  id?: string;
  title: string;
  providerTitle?: string;
  providerId: string;
}
export class Workshop implements WorkshopTruncated {
  id?: string;
  title: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  minAge: number;
  maxAge: number;
  price: number;
  withDisabilityOptions?: boolean;
  disabilityOptionsDesc?: string;
  keywords?: string[];
  address: Address;
  teachers: Teacher[];
  rating?: number;
  numberOfRatings?: number;
  directionIds: number[];
  providerId: string;
  providerTitle?: string;
  payRate?: string;
  isCompetitiveSelection: boolean;
  competitiveSelectionDescription: string;
  logo: string;
  dateTimeRanges: DateTimeRanges[];
  imageFiles?: File[];
  imageIds?: string[];
  coverImage?: File[];
  coverImageId?: string[];
  institutionHierarchyId: string;
  institutionId: string;
  workshopDescriptionItems: WorkshopSectionItem[];
  availableSeats: number;
  takenSeats: number;
  status?: string;

  constructor(about, description, address: Address, teachers: Teacher[], provider: Provider, id?: string) {
    this.title = about.title;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.minAge;
    this.maxAge = about.maxAge;
    this.address = address;
    this.teachers = teachers;
    this.withDisabilityOptions = Boolean(description.disabilityOptionsDesc);
    this.providerId = provider.id;
    this.providerTitle = provider.fullTitle;
    this.workshopDescriptionItems = description.workshopDescriptionItems;
    this.keywords = description.keyWords;
    this.dateTimeRanges = about.workingHours;
    this.institutionHierarchyId = description.institutionHierarchyId;
    this.institutionId = description.institutionId;
    this.workshopDescriptionItems = description.workshopDescriptionItems;
    if (id) {
      this.id = id;
    }
    if (about.facebook) {
      this.facebook = about.facebook;
    }
    if (about.website) {
      this.website = about.website;
    }
    if (about.instagram) {
      this.instagram = about.instagram;
    }
    if (description.disabilityOptionsDesc) {
      this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    }
    if (description.imageFiles?.length) {
      this.imageFiles = description.imageFiles;
    }
    if (description.imageIds?.length) {
      this.imageIds = description.imageIds;
    }
    if (about.coverImage?.length) {
      this.coverImage = about.coverImage;
    }
    if (about.coverImageId?.length) {
      this.coverImageId = about.coverImageId[0];
    }
    if (about.availableSeats) {
      this.availableSeats = about.availableSeats;
    }
    if (about.payRate) {
      this.payRate = about.payRate;
    }
    if (about.price) {
      this.price = about.price;
    }
    if (about.availableSeats) {
      this.availableSeats = about.availableSeats;
    }
  }
}

export class WorkshopSectionItem extends SectionItem {
  workshopId?: string;

  constructor(info) {
    super(info);

    if (info.workshopId) {
      this.workshopId = info.workshopId;
    }
  }
}
export interface WorkshopBaseCard {
  workshopId: string;
  title: string;
  directionIds: number[];
  coverImageId?: string;
}

export interface ProviderWorkshopCard extends WorkshopBaseCard {
  providerTitle: string;
  providerOwnership: string;
  providerId: string;
  payRate: string;
  maxAge: number;
  minAge: number;
  price: number;
  address: Address;
  availableSeats: number;
  takenSeats: number;
  amountOfPendingApplications: number;
  status: WorkshopOpenStatus;
}

export interface WorkshopCard extends WorkshopBaseCard {
  workshopId: string;
  providerTitle: string;
  providerOwnership: string;
  providerId: string;
  title: string;
  payRate: string;
  coverImageId?: string;
  maxAge: number;
  minAge: number;
  price: number;
  address: Address;
}

export interface WorkshopStatus {
  workshopId: string;
  status: string;
}

export interface WorkshopCardParameters extends PaginationParameters {
  providerId: string;
}
