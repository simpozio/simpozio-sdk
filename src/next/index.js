// @flow

import _ from 'lodash';
import EventEmitter from 'events';
import {Store} from 'redux';

import Logger from '../simpozio/logger';
import Api from '../_api';
import {getListenerKey} from '../simpozio/common/common.helpers';
import {nextDoInvalidate, nextDoNext} from './actions';
import {NEXT_EVENT, NEXT_INVALIDATE_EVENT} from './const';
import type {SmpzInteractionModelType} from '../journey/interactions/reducer';

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
    lastDoInvalidate: number;
    lastActivityUpdate: number;
    lastTriggerSuggetUpdate: number;
    lastDoNext: number;

    constructor({store}: SmpzNextConstructorParamsType) {
        const state = store.getState();
        this.name = 'Next';

        this.store = store;
        this.logger = new Logger({store, name: this.name});
        this.api = new Api({store});
        this.lastDoInvalidate = _.get(state, 'next.lastDoInvalidate');
        this.lastActivityUpdate = _.get(state, 'activities.lastUpdate');
        this.lastTriggerSuggetUpdate = _.get(state, 'triggers.suggest.lastUpdate');

        this.store.subscribe(this._handleStoreChange.bind(this));
    }

    _checkNext() {
        const {lastDoNext} = _.get(this.store.getState(), 'next', {});
        if (this.lastDoNext !== lastDoNext) {
            this.lastDoNext = lastDoNext;

            const suggestItem = _.head(_.get(this.store.getState(), 'triggers.suggest.items', []));
            const trigger = _.get(this.store.getState(), ['triggers', 'items', _.get(suggestItem, 'triggerId')]);
            const interactions = _.map(
                _.get(trigger, 'do'),
                ({interaction: interactionId}: {interaction: string}): SmpzInteractionModelType =>
                    _.get(this.store.getState(), ['interactions', 'items', interactionId])
            );

            eventEmitter.emit(NEXT_EVENT, {
                trigger,
                interactions
            });
        }
    }

    _checkInvalidate() {
        const lastActivityUpdate = _.get(this.store.getState(), 'activities.lastUpdate', {});
        if (this.lastActivityUpdate !== lastActivityUpdate) {
            this.lastActivityUpdate = lastActivityUpdate;
            this.invalidate();
        }
    }

    _doInvalide() {
        const {lastDoInvalidate} = _.get(this.store.getState(), 'next', {});

        if (this.lastDoInvalidate !== lastDoInvalidate) {
            this.lastDoInvalidate = lastDoInvalidate;
            eventEmitter.emit(NEXT_INVALIDATE_EVENT, {});
        }
    }

    _handleStoreChange() {
        this._checkInvalidate();
        this._checkNext();
        this._doNext();
        this._doInvalide();
    }

    _doNext() {
        const lastTriggerSuggetUpdate = _.get(this.store.getState(), 'triggers.suggest.lastUpdate', {});
        if (this.lastTriggerSuggetUpdate !== lastTriggerSuggetUpdate) {
            this.lastTriggerSuggetUpdate = lastTriggerSuggetUpdate;
            this.store.dispatch(nextDoNext());
        }
    }

    invalidate() {
        this.store.dispatch(
            nextDoInvalidate({
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

    destroy() {
        eventEmitter.removeAllListeners();
    }
}
