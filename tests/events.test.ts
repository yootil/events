import { describe, it, beforeEach } from 'mocha';
import { use as chaiUse, expect } from 'chai';
import * as sinon from 'sinon';
import { Events } from '@yootil/events/index';

chaiUse(require('sinon-chai'));

describe('Events', () => {
  let events: Events;

  beforeEach(() => {
    events = new Events('test');
  });

  describe('constructor()', () => {
    it('sets the initial values', () => {
      // @ts-ignore
      expect(events.name).to.deep.equal('test');
      // @ts-ignore
      expect(events.subscribers).to.deep.equal([]);
      // @ts-ignore
      expect(events.nextID_).to.deep.equal(0);
    });
  });

  describe('subscribe()', () => {
    it('should set all the values on the returned subscriber', () => {
      const callback = () => {};
      const subscriber = events.subscribe('foo', callback);

      expect(subscriber.id).to.deep.equal(0);
      expect(subscriber.event).to.deep.equal('foo');
      // @ts-ignore
      expect(subscriber.callback).to.equal(callback);
      expect(subscriber.unsubscribe).to.be.a('function');
    });

    it('should increment the next ID', () => {
      events.subscribe('foo', () => {});

      // @ts-ignore
      expect(events.nextID_).to.deep.equal(1);

      events.subscribe('foo', () => {});

      // @ts-ignore
      expect(events.nextID_).to.deep.equal(2);
    });

    it('should push the subscriber into the subscribers array', () => {
      const subscriber = events.subscribe('foo', () => {});

      // @ts-ignore
      expect(events.subscribers).to.deep.equal([subscriber]);
    });

    it('on() should be an alias for subscribe()', () => {
      expect(events.on).to.equal(events.subscribe);
    });
  });

  describe('unsubscribe()', () => {
    it('should remove the subscriber from the subscribers array', () => {
      const subscriber = events.subscribe('foo', () => {});

      events.unsubscribe(subscriber);

      // @ts-ignore
      expect(events.subscribers).to.deep.equal([]);
    });

    it('subscriber.unsubscribe() should also remove the subscriber', () => {
      const subscriber = events.subscribe('foo', () => {});

      subscriber.unsubscribe();

      // @ts-ignore
      expect(events.subscribers).to.deep.equal([]);
    });
  });

  describe('trigger()', () => {
    it('should invoke the callbacks from any subscribers with a matching event', () => {
      const subscriber1 = events.subscribe('foo', sinon.fake());
      const subscriber2 = events.subscribe('foo2', sinon.fake());

      events.trigger('foo', {
        bar: 'test',
      });

      expect(subscriber1.callback).to.have.been.calledOnceWithExactly({
        bar: 'test',
      }, 'foo');

      expect(subscriber2.callback).to.have.not.been.called;
    });

    it('should invoke the callbacks from any subscribers with a matching event (testing order)', () => {
      const subscriber1 = events.subscribe('foo', sinon.fake());
      const subscriber2 = events.subscribe('foo2', sinon.fake());

      events.trigger('foo2', {
        bar2: 4,
      });

      expect(subscriber1.callback).to.have.not.been.called;

      expect(subscriber2.callback).to.have.been.calledOnceWithExactly({
        bar2: 4,
      }, 'foo2');
    });
  });
});