/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocketGateway } from '@nestjs/websockets';
import { HolterConnectionService } from './services/holter-connection.service';
import { randomUUID } from 'node:crypto';
import { HolterRecordService } from './services/holter-record.service';

export const SOCKET_PORT = process.env['SOCKET_PORT']
  ? Number(process.env['SOCKET_PORT'])
  : 8383;

@WebSocketGateway(SOCKET_PORT, { path: 'holter-update' })
export class HolterUpdateGateway {
  constructor(
    private holterConnectionService: HolterConnectionService,
    private holterRecordService: HolterRecordService
  ) {}

  afterInit() {
    console.log('WebSocket server holter record initialized');
  }

  handleConnection(client: any) {
    if (!client.id) {
      client.id = randomUUID();
    }
    console.log(`A new ECG monitor Client ${client.id} connected`);
    this.holterConnectionService.addConnection(client);
    this.holterRecordService.notifyNewData();
  }

  handleDisconnect(client: any) {
    console.log(`ECG monitor Client ${client.id} disconnected`);
    this.holterConnectionService.closeConnection(client.id);
  }
}
