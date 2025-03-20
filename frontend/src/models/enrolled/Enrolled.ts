export interface Enrolled {
  enrolled: EnrolledStatus;
}

export enum EnrolledStatus {
  NeverEnrolled = 'never_enrolled',
  Enrolled = 'enrolled',
  Unenrolled = 'unenrolled',
}
