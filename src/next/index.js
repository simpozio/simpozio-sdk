// @flow

import _ from 'lodash';
import EventEmitter from 'events';
import {Store} from 'redux';

import Logger from '../simpozio/logger';
import Api from '../api';
import {getListenerKey} from '../simpozio/common/common.helpers';
import {nextInvalidate} from './actions';
import {NEXT_EVENT, NEXT_INVALIDATE_EVENT} from './const';

const eventEmitter = new EventEmitter();

const listeners = {};
export type SmpzNextConstructorParamsType = {store: Store};

export default class Next {
    name: string;
    store: Store;
    logger: Logger;
    api: Api;
    mapMiddleware: Function;
    reduceMiddleware: Function;
    lastInvalidate: number;
    lastNext: number;

    constructor({store}: SmpzNextConstructorParamsType) {
        this.name = 'Next';

        this.store = store;
        this.logger = new Logger({store, name: this.name});
        this.api = new Api({store});
        this.lastInvalidate = _.get(this.store.getState(), 'next.lastInvalidate');

        this.store.subscribe(this._handleStoreChange.bind(this));
    }

    _handleStoreChange() {
        const {lastInvalidate, lastNext} = _.get(this.store.getState(), 'next', {});

        if (this.lastInvalidate !== lastInvalidate) {
            this.lastInvalidate = lastInvalidate;
            eventEmitter.emit(NEXT_INVALIDATE_EVENT);
        }

        if (this.lastNext !== lastNext) {
            this.lastNext = lastNext;
            const state = this.store.getState();

            const suggestItem = _.last(_.get(state, 'triggers.suggest.items', []));
            const trigger = _.get(state, ['triggers.items', _.get(suggestItem, 'triggerId')]);
            const interaction = _.get(state, ['interactions.items', _.get(trigger, 'interaction')]);

            eventEmitter.emit(NEXT_EVENT, {
                trigger,
                interaction
            });
        }
    }

    invalidate() {
        this.store.dispatch(
            nextInvalidate({
                mapMiddleware: this.mapMiddleware,
                reduceMiddleware: this.reduceMiddleware
            })
        );
    }

    onNext(cb: () => mixed): string {
        return this.addListener(NEXT_EVENT, cb);
    }

    setMapMiddleware(fn: Function) {
        this.mapMiddleware = fn;
    }

    setReduceMiddleware(fn: Function) {
        this.reduceMiddleware = fn;
    }

    setApplyMiddleware() {}

    onInvalidate(cb: () => mixed): string {
        return this.addListener(NEXT_INVALIDATE_EVENT, cb);
    }

    addListener(event: string, cb: () => mixed): string {
        let key = getListenerKey(cb);

        eventEmitter.addListener(event, cb);
        listeners[key] = {event, cb};

        return key;
    }

    removeSubscription(key: string) {
        if (!listeners[key]) {
            return;
        }

        const {event, cd} = listeners[key];
        eventEmitter.removeListener(event, cd);

        listeners[key] = null;
    }
}
