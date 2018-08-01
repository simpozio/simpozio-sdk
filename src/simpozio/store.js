// @flow

import thunk from 'redux-thunk';
import {offline} from '@redux-offline/redux-offline';
import {applyMiddleware, createStore, Store} from 'redux';
import reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistReducer} from 'redux-persist';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import {requestHelper} from '../_api/requestHelper';
import {AxiosInstance} from 'axios/index';
import storage from 'redux-persist/lib/storage';

import type {SmpzApiRequestParamsType} from '../_api';

const effect = (effect: SmpzApiRequestParamsType): AxiosInstance => requestHelper(effect);

//$FlowFixMe
export function initStore(storage: Storage = storage): Store {
    const persistConfig = {
        key: 'primary',
        storage: storage
    };

    const persistedReducer = persistReducer(persistConfig, reducers);

    return createStore(
        persistedReducer,
        {},
        composeWithDevTools(applyMiddleware(thunk), offline({...offlineConfig, effect}))
    );
}
