export interface ProfileModel {
  name: string,
  phone: string,
  documents: {document_id: number, expired_date: string}[],
}
