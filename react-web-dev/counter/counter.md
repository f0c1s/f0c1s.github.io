<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>/f0c1s/blog/react-web-dev/counter</title>
    <link rel="stylesheet" href="../../index.css"/>
    <link rel="stylesheet" href="../../highlight/styles/monokai.min.css"/>
    <script src="../../setup.js"></script>
    <script src="../../highlight/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>

<body class="aoc 2021 aoc2021" onload="setup()">
<h1>/f0c1s/blog/react-web-dev/counter</h1>
<nav>
    <a href="../../index.html">/blog</a>
    <a href="../../react-web-dev/index.html">react web dev</a>
    <a href="../../react-web-dev/counter/counter.html">+ counter</a>
</nav>

## Plain react

```shell
yarn create react-app counter-1 --template typescript
cd counter-1
yarn start
```

![1.running-app](1.running-app.png)

![2.project](2.project.png)

### Making changes to existing project

#### App.css

```css
h1 {
    margin: 0;
    color: red;
    background-color: #333;
    padding: 1rem;
    font-weight: bold;
    text-shadow: 2px 2px 2px black;
    text-transform: uppercase;
}
```

#### App.tsx

```typescript
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>counter 1</h1>

    </div>
  );
}

export default App;

```

### Introducing components counter and counter-display

![3.first-final](3.first-final.png)

![4.file-structure](4.file-structure.png)

#### App.tsx

```typescript
import React from 'react';
import './App.css';
import Counter from "./components/counter/counter";

function App() {
    return (
        <div className="App">
            <h1>counter 1</h1>
            <Counter/>
        </div>
    );
}

export default App;

```

#### components/counter/counter.tsx

```typescript
import React, {useState} from "react";
import "./counter.css";
import CounterDisplay from "../counter-display/counter-display";

export default function Counter() {
    const [count, setCount] = useState(0);
    return (
        <div className={"counter"}>
            <CounterDisplay count={count}/>
            <div className={"coutner-actions"}>
                <button onClick={() => setCount(count + 1)}>increment</button>
                <button onClick={() => setCount(count - 1)}>decrement</button>
            </div>
        </div>
    );
}

```

#### components/counter/counter.css

```css
.counter {
    margin: 1rem;
    padding: 1rem;
    position: relative;
}

.counter::before {
    content: "counter";
    font-size: 12px;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-7deg);
}

.counter button {
    padding: 1rem;
    margin: 1rem;
    cursor: pointer;
}

```

#### components/counter/counter-display.tsx

```typescript
import React from "react";
import "./counter-display.css";

type CountDisplayPropT = {
    count: number
}

export default function CounterDisplay({count}: CountDisplayPropT) {
    return (<div className={"counter-value"}>{count}</div>);
}

```

#### components/counter/counter-display.css

```css
.counter-value {
    padding: 1rem;
    margin: 1rem;
    font-size: 48px;
}

```

### Moving state outside of components to the main App component

![5.App-component-has-state-now](5.App-component-has-state-now.png)

With same structure, here is the code:

#### App.tsx

```typescript
import React, {useState} from 'react';
import './App.css';
import Counter from "./components/counter/counter";

function App() {
    const [count, setCount] = useState(0);
    return (
        <div className="App">
            <h1>counter 1</h1>
            <Counter count={count} setCount={setCount}/>
        </div>
    );
}

export default App;

```

Notice the state is here now, and so is the function that updates it.

#### components/counter/counter.tsx

```typescript
import React from "react";
import "./counter.css";
import CounterDisplay from "../counter-display/counter-display";

type CounterPropT = {
    count: number;
    setCount: Function;
}

export default function Counter({count, setCount}: CounterPropT) {

    return (
        <div className={"counter"}>
            <CounterDisplay count={count}/>
            <div className={"coutner-actions"}>
                <button onClick={() => setCount(count + 1)}>increment</button>
                <button onClick={() => setCount(count - 1)}>decrement</button>
            </div>
        </div>
    );
}

```

Rest of the code didn't require any change.

## Redux Toolkit example

```shell
yarn add @reduxjs/toolkit react-redux
yarn add -D @types/redux @types/react-redux
```

![6.running-app](6.running-app.png)

![7.project-structure](7.project-structure.png)

### New files added

- /src/state/hooks.ts
- /src/state/slice/counterSlice.ts
- /src/state/store.ts

#### /src/state/hooks.ts

```typescript
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

```

#### /src/state/slice/counterSlice.ts

```typescript
import {createSlice} from "@reduxjs/toolkit";

import type {RootState} from "../store";

interface CounterState {
    counter: {
        value: number;
    };
}

const initialState: CounterState = {counter: {value: 0}} as CounterState;

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state: CounterState) => {
            state.counter.value += 1;
            return state;
        },
        decrement: (state: CounterState) => {
            state.counter.value -= 1;
            return state
        }
    }
});

export const {increment, decrement} = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;

```

#### /src/state/store.ts

```typescript
import {configureStore} from "@reduxjs/toolkit";
import {counterSlice} from "./slice/counterSlice";

const store = configureStore({
    reducer: counterSlice.reducer
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export {store};
```

### Files updated

- /src/App.tsx
- /src/components/counter/counter.tsx

#### /src/App.tsx

```typescript
import React from 'react';
import {Provider} from "react-redux";
import {store} from "./state/store";

import './App.css';

import Counter from "./components/counter/counter";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <h1>counter 1</h1>
                <Counter/>
            </div>
        </Provider>
    );
}

export default App;

```

#### /src/components/counter/counter.tsx

```typescript
import React from "react";
import "./counter.css";
import CounterDisplay from "../counter-display/counter-display";

import {useAppSelector, useAppDispatch} from "../../state/hooks";
import {increment, decrement, selectCount} from "../../state/slice/counterSlice";

export default function Counter() {
    const dispatch = useAppDispatch();

    const count = useAppSelector(selectCount);
    return (
        <div className={"counter"}>
            <CounterDisplay count={count}/>
            <div className={"coutner-actions"}>
                <button onClick={() => dispatch(increment())}>increment</button>
                <button onClick={() => dispatch(decrement())}>decrement</button>
            </div>
        </div>
    );
}

```

## I don't understand a word of it.

So let me just figure these out.

### The Slice

```typescript
/**
 * The return value of `createSlice`
 *
 * @public
 */
export interface Slice<
  State = any,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string
> {
  /**
   * The slice name.
   */
  name: Name

  /**
   * The slice's reducer.
   */
  reducer: Reducer<State>

  /**
   * Action creators for the types of actions that are handled by the slice
   * reducer.
   */
  actions: CaseReducerActions<CaseReducers>

  /**
   * The individual case reducer functions that were passed in the `reducers` parameter.
   * This enables reuse and testing if they were defined inline when calling `createSlice`.
   */
  caseReducers: SliceDefinedCaseReducers<CaseReducers>

  /**
   * Provides access to the initial state value given to the slice.
   * If a lazy state initializer was provided, it will be called and a fresh value returned.
   */
  getInitialState: () => State
}
```

Ok, so Slice Interface is defined as having members: name, reducer, actions, caseReducers and getInitialState.

![8.logging-counterSlice-after-creation](8.logging-counterSlice-after-creation.png)

I can see actions, caseReducers, getInitialState, name and reducer.

I can also see that on invocation of actions.increment with the proper state varialbles, an object is returned. This
returned object looks like plain old redux dispatch input. We are telling rootReducer to fire action for "
counter/increment" with values `{ counter: { value: 0} }`.

I need to maintain my own state for the component and pass it to the dispatched function call.

![9.getInitialState](9.getInitialState.png)

This does return the initial value of the state.

![10.reducer-function](10.reducer-function.png)

I tried to get source of the reducer function.

![11.executing-reducer-function](11.executing-reducer-function.png)

In the first attempt, I just passed state object and action name. It doesn't work. There is a given structure that redux
understands, when I remembered it, and passed `{type: action}`, it worked!

Let's figure out other functions and "words".

### createSlice

```typescript
/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "slice name", and automatically generates
 * action creators and action types that correspond to the
 * reducers and state.
 *
 * The `reducer` argument is passed to `createReducer()`.
 *
 * @public
 */
export declare function createSlice
    <State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>
    (options: CreateSliceOptions<State, CaseReducers, Name>)
    : Slice<State, CaseReducers, Name>;

```

- name is required
- initialState can be a function, if it is not, then a function will be created by calling `createNextState`.
- reducers is initialized as empty object if not passed
- createSlice returns names, reducer, actions, caseReducers, getInitialState as we have seen earlier.

> Curried producer that infers the recipe from the curried output function (e.g. when passing to setState)

![12.createNextState-is-curried-producer-what](12.createNextState-is-curried-producer-what.png)

![13.reducers-being-setup](13.reducers-being-setup.png)

#### Return from createSlice

```typescript
return {
    name,
    reducer(state, action) {
      if (!_reducer) _reducer = buildReducer()

      return _reducer(state, action)
    },
    actions: actionCreators as any,
    caseReducers: sliceCaseReducersByName as any,
    getInitialState() {
      if (!_reducer) _reducer = buildReducer()

      return _reducer.getInitialState()
    },
  }
```

The returned `counterSlice.reducer` is being used in store.ts. Let me figure out what is a `configureStore`.

### `configureStore`

```typescript
/**
 * A friendly abstraction over the standard Redux `createStore()` function.
 *
 * @param config The store configuration.
 * @returns A configured Redux store.
 *
 * @public
 */
export function configureStore<
  S = any,
  A extends Action = AnyAction,
  M extends Middlewares<S> = [ThunkMiddlewareFor<S>]
>(options: ConfigureStoreOptions<S, A, M>): EnhancedStore<S, A, M> {
  const curriedGetDefaultMiddleware = curryGetDefaultMiddleware<S>()

  const {
    reducer = undefined,
    middleware = curriedGetDefaultMiddleware(),
    devTools = true,
    preloadedState = undefined,
    enhancers = undefined,
  } = options || {}

  let rootReducer: Reducer<S, A>

  if (typeof reducer === 'function') {
    rootReducer = reducer
  } else if (isPlainObject(reducer)) {
    rootReducer = combineReducers(reducer)
  } else {
    throw new Error(
      '"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers'
    )
  }

  let finalMiddleware = middleware
  if (typeof finalMiddleware === 'function') {
    finalMiddleware = finalMiddleware(curriedGetDefaultMiddleware)

    if (!IS_PRODUCTION && !Array.isArray(finalMiddleware)) {
      throw new Error(
        'when using a middleware builder function, an array of middleware must be returned'
      )
    }
  }
  if (
    !IS_PRODUCTION &&
    finalMiddleware.some((item) => typeof item !== 'function')
  ) {
    throw new Error(
      'each middleware provided to configureStore must be a function'
    )
  }

  const middlewareEnhancer = applyMiddleware(...finalMiddleware)

  let finalCompose = compose

  if (devTools) {
    finalCompose = composeWithDevTools({
      // Enable capture of stack traces for dispatched Redux actions
      trace: !IS_PRODUCTION,
      ...(typeof devTools === 'object' && devTools),
    })
  }

  let storeEnhancers: StoreEnhancer[] = [middlewareEnhancer]

  if (Array.isArray(enhancers)) {
    storeEnhancers = [middlewareEnhancer, ...enhancers]
  } else if (typeof enhancers === 'function') {
    storeEnhancers = enhancers(storeEnhancers)
  }

  const composedEnhancer = finalCompose(...storeEnhancers) as any

  return createStore(rootReducer, preloadedState, composedEnhancer)
}
```

This basically calls `createStore` and returns the output of that function.

After creating store via `createStore` we are getting this object:

![14.returned-store](14.returned-store.png)

It has the state of our application, and a dispatch function that we can use to update state.

![15.firing-disatch](15.firing-disatch.png)

Notice how on firing dispatch three times, the value is updated.

This is because the app state is same as the one being manipulated via redux store's dispatch call.

### `createStore`

This comes from reduxjs/redux/src/createStore.js

```javascript
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
export default function createStore(reducer, preloadedState, enhancer) {
// ...a lot of code...
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable,
  }
}
```

The return is what we have seen earlier. I cannot, ATM, go into the function for a deep dive.

## Adding another counter.

Basically replicating it. This ideally should be very easy.

```typescript
<h2>counter 1</h2>
<Counter/>
<h2>counter 2</h2>
<Counter/>
```

The code above should generate two counters that have different state. But that doesn't happen. Both the counters are
using same state.

![16.two-counters](16.two-counters.png)

I click increment five times, and both the counters get the same updated value.

![17.unintentionally-shared-state](17.unintentionally-shared-state.png)

What is happening?

Well, we are using single state `{counter: {value: N} }` in redux, so that's one.

Also, the whole functionality is encapsulated in `Counter` component, the display, the increment and the decrement
functions.

This is great example of component-reuse. Let me add a class variable so that we can see the Counter in black too, but
with same value.

After a while, I will update code in such a way that two counters work independently.

![18.same-component-different-design](18.same-component-different-design.png)

### Changes

#### App.tsx

```typescript
import React from 'react';
import {Provider} from "react-redux";
import {store} from "./state/store";

import './App.css';

import Counter from "./components/counter/counter";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <h2>counter 1</h2>
                <Counter klass={"light"}/>
                <h2>counter 2</h2>
                <Counter klass={"dark"}/>
            </div>
        </Provider>
    );
}

export default App;

```

#### counter.tsx

```typescript
import React from "react";
import "./counter.css";
import CounterDisplay from "../counter-display/counter-display";

import {useAppSelector, useAppDispatch} from "../../state/hooks";
import {increment, decrement, selectCount} from "../../state/slice/counterSlice";

interface CounterProps {
    klass?: string;
}

export default function Counter({klass}: CounterProps = {klass: "light"}) {
    const dispatch = useAppDispatch();

    const count = useAppSelector(selectCount);
    return (
        <div className={`counter ${klass}`}>
            <CounterDisplay count={count}/>
            <div className={"coutner-actions"}>
                <button onClick={() => dispatch(increment())}>increment</button>
                <button onClick={() => dispatch(decrement())}>decrement</button>
            </div>
        </div>
    );
}

```

#### counter.css

```css
.counter.dark {
    background-color: #333333;
    color: #eeeeee;
    border: medium solid silver;
}
```

#### counter-display.css

```css
.counter.dark .counter-value {
    min-width: 100px;
    font-weight: bold;
    font-family: monospace;
    text-shadow: 2px 2px 2px black;
    display: inline-block;
    border-bottom: thin solid silver;
}

```

### Creating two different counters.

To be continued...

## References

- [https://egghead.io/lessons/react-create-a-reducer-with-redux-toolkit-and-dispatch-its-action-with-the-useappdispatch-hook](https://egghead.io/lessons/react-create-a-reducer-with-redux-toolkit-and-dispatch-its-action-with-the-useappdispatch-hook)
- [https://redux-toolkit.js.org/tutorials/overview](https://redux-toolkit.js.org/tutorials/overview)
- [https://redux-toolkit.js.org/usage/usage-guide](https://redux-toolkit.js.org/usage/usage-guide)
- [https://redux-toolkit.js.org/usage/usage-with-typescript](https://redux-toolkit.js.org/usage/usage-with-typescript)
- [https://github.com/reduxjs/cra-template-redux-typescript](https://github.com/reduxjs/cra-template-redux-typescript)
- [https://redux-toolkit.js.org/tutorials/overview](https://redux-toolkit.js.org/tutorials/overview)
- [https://stackoverflow.com/questions/68768408/react-redux-toolkit-type-is-not-assignable-to-type-casereducertype-payload](https://stackoverflow.com/questions/68768408/react-redux-toolkit-type-is-not-assignable-to-type-casereducertype-payload)
- [https://levelup.gitconnected.com/redux-toolkit-an-easier-way-to-set-up-redux-6782b4857f8](https://levelup.gitconnected.com/redux-toolkit-an-easier-way-to-set-up-redux-6782b4857f8)
- [https://www.bezkoder.com/redux-toolkit-example-crud/](https://www.bezkoder.com/redux-toolkit-example-crud/)
- [https://redux.js.org/tutorials/fundamentals/part-8-modern-redux](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux)
- [https://stackoverflow.com/questions/42906358/having-multiple-instance-of-same-reusable-redux-react-components-on-the-same-pag](https://stackoverflow.com/questions/42906358/having-multiple-instance-of-same-reusable-redux-react-components-on-the-same-pag)
- [https://redux.js.org/usage/structuring-reducers/reusing-reducer-logic](https://redux.js.org/usage/structuring-reducers/reusing-reducer-logic)

</body>
</html>
