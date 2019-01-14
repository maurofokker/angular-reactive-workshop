# Angular Reactive Workshop

For this workshop, we are going to build Redux state around the `projects` feature with NGRX.

## The Stack

### NRWL Workspace
A NRWL workspace contains one or all of you Angular projects and libraries. It creates a monorepo for your applications domains. Nx helps add extra layer of tooling that can help manage your enterprise applications.

### Angular Material
Angular Material is a UI library for Angular that gives you access to a modern material UI that works across web, mobile, and desktop applications with minimal custom CSS and setup.

### JSON Server
Creates a quick and simple way to mock out a backend REST service. We can then deliver some mocked out data in JSON format to make sure everything is working as expected once our real backend is connected.

## Getting Started

```
npm install
npm start
```

This will both boot up a data server on localhost:3000 and serve the frontend on localhost:4200.

## Introducción

- Lo mejor es tener centralizado en un lugar el estado de la aplicación y que esta fluyda desde y hacia ella.
- Lo anterior reducirá cantidad de código.
- El directorio `state` contiene estado de los features de la app, existe también el archivo `index.ts` que es:
  - Un reducer a nivel superior
  - Basado en este `reducer`, crear el `application state` que es definido en una `interfaz (AppState en el archivo)`
  - Posteriormente se define un `reducer` que toma una acción, realiza algún cálculo y produce nuevo estado que será agregado al `app state`
    ```typescript
      import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

      import * as fromCustomers from './customers/customers.reducer';

      export interface AppState {
        customers: fromCustomers.CustomersState
      }

      export const reducers: ActionReducerMap<AppState> = {
        customers: fromCustomers.customersReducer
      };

      // -------------------------------------------------------------------
      // CUSTOMERS SELECTORS
      // -------------------------------------------------------------------
      export const selectCustomersState = createFeatureSelector<fromCustomers.CustomersState>('customers');

      export const selectAllCustomers = createSelector(
        selectCustomersState,
        fromCustomers.selectAllCustomers
      );
    ```
  - NgRx es un fmwk para construir aplicaciones reactivas en angular.
  - NgRx provee lo siguiente:
    - administración de estado
    - aislamiento de efectos secundarios
    - administración de colección de entidades
    - router binding
    - generación de código
    - herramientas de desarrollador que permiten realzar la experiencia cuando se construye diferentes tipos de apps
  - Principios básicos:
    - State (Estado) es una estructura de datos simple e inmutable
    - Componentes delegan responsabilidades a efectos secundarios, los que se manejan de forma aislada
    - La seguridad de tipo se promueve en la arquitectura y se basa en TypeScript
    - Actions y state son serializables para asegurar que state es almacenado de forma predecible, rehidratado y repetido
    - Promueve el uso de programación funcional al construir apps reacitvas
    - Proporcionar estrategias de prueba directas para la validación de la funcionalidad.

## NgRx Store

Conceptos Redux
  - El estado entero de la aplicación es un sólo árbol de estado
  - El estado fluye hacia abajo en la aplicación desde ese árbol
  - Eventos se capturan y envían los objetos de acción en un reducer

El `reducer` es el único lugar donde se puede mutar el estado de la aplicación, entonces los métodos que se encuentran presente en los `reducer` realizan operaciones de mutación. En realidad realizan calculos y retornan un nuevo estado.

Beneficios en rendimiento:
1. Cuando se tiene un nuevo objeto, el puntero de memoria cambia de tal forma que de inmediato se sabe que es algo nuevo y se debe actualizar. La ventaja es porque anteriormente se hacia una comparación profunda para saber qué había cambiado.
2. Permite realizar una transacción atómica dentro de la aplicación, y como se van guardando los estados se pueden ir navegando hacia atrás o adelante

### Integrar un feature nuevo en NgRx

1. Definir la forma de mi estado (shape of the state)
  ```typescript
    export interface ProjectsState {
      projects: Project[];
      selectedProjectId: string | null;
    }
   ```
2. Definir el estado inicial implementando la interfaz con la forma del estado
  ```typescript
    export const initialState: ProjectsState = {
      projects: initialProjects,
      selectedProjectId: null
    }
  ```
3. Construir un reducer (partir por lo más simple)
  ```typescript
    // receive two parameters, the initial state of the app and the action object
    // with a payload (usually saying this needs to happen or this is what happened)
    export function projectsReducers(state = initialState, action): ProjectsState {
      switch(action.type) {
        default:
          return state;
      }
    }
  ```
4. Combinar los reducers en uno de nivel superior, generalmente archivo `../libs/core-data/src/lib/state/index.ts` 
   con la información del estado
  ```typescript
    import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

    import * as fromCustomers from './customers/customers.reducer';

    // brings everything from ProjectsReducers
    import * as fromProjects from './projects/projects.reducer';

    // update the shape of the entire app state
    export interface AppState {
      customers: fromCustomers.CustomersState,
      projects: fromProjects.ProjectsState, // here
    }

    // add in feature reducer into combined reducer
    export const reducers: ActionReducerMap<AppState> = {
      customers: fromCustomers.customersReducer,
      projects: fromProjects.projectsReducers // here ... to satisfied the interface
    };

    // -------------------------------------------------------------------
    // CUSTOMERS SELECTORS
    // -------------------------------------------------------------------
    export const selectCustomersState = createFeatureSelector<fromCustomers.CustomersState>('customers');

    export const selectAllCustomers = createSelector(
      selectCustomersState,
      fromCustomers.selectAllCustomers
    );
   ```
