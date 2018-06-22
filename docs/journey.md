## Journey

### Methods

#### simpozio.Journey.next(): Promise
Simpozio instance take current Itinerary and make map/reduce/apply steps 

Returns Promise which resolves with `nextStepData`
```
nextStepData : {
    stage: string,
    triggers: array, // Next triggers with weights  which should be triggered next
    interactions: array // Interactions which should be done next 
}

``` 
#### simpozio.Journey.onNext(callback: function): void
Sets callback on every next step of journey

Callback function will be called with `nextStepData`

#### simpozio.Journey.useMapMiddleware(middleware: function): void
Sets custom logic for Map step.

`middleware` function will be called with `{itinerary}` object and must return `promise` which resolves with `{triggers}`

#### simpozio.Journey.useReduceMiddleware(middleware: function): void
Sets custom logic for Reduce step.

`middleware` function will be called with `{itinerary}` object and must return `promise` which resolves with `{triggers}`

#### simpozio.Journey.useApplyMiddleware(middleware: function): void
Sets custom logic for Apply step.

`middleware` function will be called with `{itinerary}` object and must return `promise` which resolves with `{triggers}`


