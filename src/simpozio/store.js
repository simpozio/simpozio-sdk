// @flow

import thunk from 'redux-thunk';
import {offline} from '@redux-offline/redux-offline';
import {applyMiddleware, createStore, Store} from 'redux';
import reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import {requestHelper} from '../_api/requestHelper';
import {AxiosInstance} from 'axios/index';

import type {SmpzApiRequestParamsType} from '../_api';

const effect = (effect: SmpzApiRequestParamsType): AxiosInstance => requestHelper(effect);

//$FlowFixMe
export function initStore(storage?: Storage): Store {
    let persistedReducer;
    const persistConfig = {
        key: 'primary',
        storage,
        blacklist: ['next', 'heartbeat']
    };

    if (storage) {
        persistedReducer = persistReducer(persistConfig, reducers);
    }

    const store = createStore(
        storage ? persistedReducer : reducers,
        {},
        composeWithDevTools(
            applyMiddleware(thunk),
            offline({
                ...offlineConfig,
                effect,
                persistOptions: {
                    whitelist: ['offline']
                }
            })
        )
    );

    if (storage) {
        persistStore(store, null);
    }

    return store;
}
