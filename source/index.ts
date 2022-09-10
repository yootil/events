type StringRecord = Record<string, any>;

type EventCallback<ER extends StringRecord, E extends keyof ER = keyof ER> = (data: ER[E], event: E) => void;

type Subscriber<ER extends StringRecord> = {
  id: number,
  event: keyof ER,
  callback: EventCallback<ER>,
  unsubscribe: () => void,
}

export class Events<ER extends StringRecord = StringRecord> {
  name: string;

  private subscribers: Subscriber<ER>[] = [];

  private nextID_ = 0;

  constructor(name: string) {
    this.name = name;
  }

  subscribe<E extends keyof ER>(event: E, callback: EventCallback<ER>): Subscriber<ER> {
    const unsubscribe = this.unsubscribe.bind(this);

    const subscriber: Subscriber<ER> = {
      id: this.getNextID_(),
      event,
      callback,
      unsubscribe() {
        unsubscribe(this);
      },
    };

    this.subscribers.push(subscriber);

    return subscriber;
  }

  on = this.subscribe;

  unsubscribe(subscriber: Subscriber<ER>) {
    this.subscribers = this.subscribers.filter(s => s.id !== subscriber.id);
  }

  trigger<E extends keyof ER>(event: E, data: ER[E]) {
    this.subscribers.forEach(subscriber => {
      if (subscriber.event === event) {
        subscriber.callback(data, event);
      }
    });
  }

  private getNextID_() {
    return this.nextID_++;
  }
}