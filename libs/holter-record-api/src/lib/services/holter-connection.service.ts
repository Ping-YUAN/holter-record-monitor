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
    console.log(
      `length of connection ${
        this._connections.length
      } data to send ${JSON.stringify(holterRecords)}`
    );
    this._connections.forEach((connection) => {
      connection.send(JSON.stringify(holterRecords));
    });
  }
}
