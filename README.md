# events

A lightweight, typed event emitter implementation.

## Installation

Install using npm/yarn

    npm i @yootil/events
    
## Usage

```typescript
import { Events } from '@yootil/events';

const events = new Events('my-feature');

// or events.on();
events.subscribe('my-event', (data, event) => {
  // do something with the data
});

// Trigger the event
events.trigger('my-event', {
  foo: 'my super special data',
});

// Can be given types
const typedEvents = new Events<{
  'my-event': {
    foo: string,
  },
}>('typed-emitter');

typedEvents.subscribe('my-event', (data /* { foo: string } */, events /* 'my-event' */) => {
  // do something with the data, safely knowing that data.foo is a string
});

// This would raise a warning, as the data does not match the event type
typedEvents.trigger('my-event', 55)
```

If no type is given in the constructor type params `new Event<YourType>()`, then the type will be a generic string record (`Record<string, any>`).
