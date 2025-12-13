/**
 * Application Enums
 */

// Church roles
export enum ChurchRole {
  STAFF = 'STAFF',
  MEMBER = 'MEMBER',
  PASTOR = 'PASTOR',
  SENIOR_PASTOR = 'SENIOR_PASTOR',
  PRIMARY = 'PRIMARY',
}

// Gender
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// Civil status
export enum CivilStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
}

// Church campus type
export enum ChurchCampusType {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH',
}

// Affiliation
export enum Affiliation {
  STUDENT = 'STUDENT',
  YOUNG_PRO = 'YOUNG_PRO',
  BUSINESS = 'BUSINESS',
}

// Contact info type
export enum ContactInfoType {
  PHONE = 'PHONE',
  MOBILE = 'MOBILE',
}

// Contact priority type
export enum ContactInfoPriorityType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

// Social media type
export enum SocialMediaType {
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  TIKTOK = 'TIKTOK',
}

// Generic status
export enum GenericStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

// Form select item for dropdowns
export interface FormSelectItem<T = string> {
  label: string;
  value: T;
  icon?: string;
}

// Gender options for select
export const GENDER_OPTIONS: FormSelectItem<Gender>[] = [
  { label: 'Male', value: Gender.MALE },
  { label: 'Female', value: Gender.FEMALE },
];

// Civil status options for select
export const CIVIL_STATUS_OPTIONS: FormSelectItem<CivilStatus>[] = [
  { label: 'Single', value: CivilStatus.SINGLE },
  { label: 'Married', value: CivilStatus.MARRIED },
];

// Affiliation options for select
export const AFFILIATION_OPTIONS: FormSelectItem<Affiliation>[] = [
  { label: 'Student', value: Affiliation.STUDENT },
  { label: 'Young Professional', value: Affiliation.YOUNG_PRO },
  { label: 'Business', value: Affiliation.BUSINESS },
];

// Contact type options for select
export const CONTACT_TYPE_OPTIONS: FormSelectItem<ContactInfoType>[] = [
  { label: 'Phone', value: ContactInfoType.PHONE },
  { label: 'Mobile', value: ContactInfoType.MOBILE },
];

// Social media options for select
export const SOCIAL_MEDIA_OPTIONS: FormSelectItem<SocialMediaType>[] = [
  { label: 'Facebook', value: SocialMediaType.FACEBOOK, icon: 'pi pi-facebook' },
  { label: 'Twitter', value: SocialMediaType.TWITTER, icon: 'pi pi-twitter' },
  { label: 'LinkedIn', value: SocialMediaType.LINKEDIN, icon: 'pi pi-linkedin' },
  { label: 'Instagram', value: SocialMediaType.INSTAGRAM, icon: 'pi pi-instagram' },
  { label: 'YouTube', value: SocialMediaType.YOUTUBE, icon: 'pi pi-youtube' },
  { label: 'TikTok', value: SocialMediaType.TIKTOK },
];

// Church role options for select
export const CHURCH_ROLE_OPTIONS: FormSelectItem<ChurchRole>[] = [
  { label: 'Staff', value: ChurchRole.STAFF },
  { label: 'Member', value: ChurchRole.MEMBER },
  { label: 'Pastor', value: ChurchRole.PASTOR },
  { label: 'Senior Pastor', value: ChurchRole.SENIOR_PASTOR },
];
