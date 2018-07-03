import _ from 'lodash';
import {COMMON_METHOD_ADD, COMMON_METHOD_REMOVE, COMMON_METHOD_RESET, COMMON_METHOD_SET} from './common/common.consts';

export class Collection {
    constructor({store, name, actions}) {
        this.name = name;
        this.store = store;
        this.actions = actions;
        this.listeners = {};
    }

    add(item) {
        const action = _.get(this.actions, COMMON_METHOD_ADD, {
            type: `${this.name}_${COMMON_METHOD_ADD}`,
            payload: {
                item
            }
        });
        this.store.dispatch(_.isFunction(action) ? action(item) : action);
    }

    remove(item) {
        const action = _.get(this.actions, COMMON_METHOD_REMOVE, {
            type: `${this.name}_${COMMON_METHOD_REMOVE}`,
            payload: {
                item
            }
        });
        this.store.dispatch(_.isFunction(action) ? action(item) : action);
    }

    set(data) {
        const action = _.get(this.actions, COMMON_METHOD_SET, {
            type: `${this.name}_${COMMON_METHOD_SET}`,
            payload: {
                data
            }
        });
        this.store.dispatch(_.isFunction(action) ? action(data) : action);
    }

    reset(data) {
        const action = _.get(this.actions, COMMON_METHOD_RESET, {
            type: `${this.name}_${COMMON_METHOD_RESET}`,
            payload: {
                data
            }
        });
        this.store.dispatch(_.isFunction(action) ? action(data) : action);
    }

    onUpdate(fn) {
        this.listeners.update.push(fn);
    }
}
