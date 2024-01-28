import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { HolterRecordUpdatedData } from '../holter.model';

@Injectable()
export class HolterConnectionService {
  private _connections: Socket[] = [];

  addConnection(connection: Socket) {
    this._connections.push(connection);
  }

  closeConnection(id: string) {
    const disconnectedIdx = this._connections.findIndex(
      (connection) => connection.id === id
    );
    this._connections.splice(disconnectedIdx);
  }

  sendUpdatedHolterData(holterRecords: HolterRecordUpdatedData[]) {
    this._connections.forEach((connection) => {
      connection.send(JSON.stringify(holterRecords));
    });
  }
}
