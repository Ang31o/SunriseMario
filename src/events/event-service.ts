import Phaser from 'phaser';
import { Events } from './events';

class eventService extends Phaser.Events.EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
    let fullName = event;
    for (const i in Events) {
      if (Events[i] === event) {
        fullName = i;
      }
    }
    console.log(
      `%c${fullName.toString()}`,
      `background: #007acc; color: #FFFFFF; padding: 5px`,
      args[0]
    );
    return super.emit(event, args[0]);
  }
}

export default new eventService();
