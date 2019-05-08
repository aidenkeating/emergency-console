import { Responder } from './responder';
export class ResponderUpdateEvent {
  timestamp: number;
  messageType: string;
  invokingService: string;
  id: string;
  header: {
    incidentId: string
  };
  body: {
    responder: Responder;
    status: string;
    statusMessage: string;
  };
}
