export default class BadRequest extends Error {
  statusCode = 400;
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.details = details;
  }
}
