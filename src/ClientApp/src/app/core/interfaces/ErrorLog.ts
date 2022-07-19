export interface ErrorLog {
  id: number;
  level: number;
  message: string;
  stackTrace: string;
  exception: string;
  logger: string;
  url: string;
  hostName: string;
  createdOn: string;
}

