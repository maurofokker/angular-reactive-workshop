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
5. Cargar el estado desde un componente (ver `projects.component.ts`)
6. Se debe importar el módulo `StateModule` para poder usar la herramienta de estado ver `core-data.module.ts`
7. Leer los datos desde el estado
  ```typescript
    import { Observable } from 'rxjs';
    import { Component, OnInit } from '@angular/core';
    import { Customer, Project, ProjectsService, NotificationsService, CustomersService, ProjectsState } from '@workshop/core-data';
    import { Store, select } from '@ngrx/store';
    import { map } from 'rxjs/operators';

    const emptyProject: Project = {
      id: null,
      title: '',
      details: '',
      percentComplete: 0,
      approved: false,
      customerId: null
    }

    @Component({
      selector: 'app-projects',
      templateUrl: './projects.component.html',
      styleUrls: ['./projects.component.scss']
    })
    export class ProjectsComponent implements OnInit {
      projects$: Observable<Project[]>; // 02
      customers$: Observable<Customer[]>;
      currentProject: Project;

      constructor(
        private projectsService: ProjectsService,
        private customerService: CustomersService,
        private store: Store<ProjectsState>, // 01
        private ns: NotificationsService) {
          this.projects$ = store.pipe(  // returns an observable stream which then we put into a pipe operator
            select('projects'), // give the entire project state
            map((projectsState: ProjectsState) => projectsState.projects)
          )
        }

      // code...

      getProjects() {
        // this.projects$ = this.projectsService.all();
      }

      // some methods...

    }
  ```
8. Despliegue de datos en template
  ```html
    <div class="col-50">
      <app-projects-list
        [projects]="projects$ | async"
        (selected)="selectProject($event)"
        (deleted)="deleteProject($event)">
      </app-projects-list>
    </div>
  ``` 

### Reducers

* Cada operación que realice un reducer debe ser inmutable
* La creación de un reducer depende del `estado inicial` y de un `action` (que es un objeto)
* El `action` se compone de un `type` que indica qué acción se debe tomar y un `payload` que indica lo que pasó o pasará
  ```typescript
    export function projectsReducers(state = initialState, action): ProjectsState {
      switch(action.type) {
        case 'create':
          // performing some logic delegating to a stand alone function (bc it is testable)
          return {
            selectedProjectId: state.selectedProjectId,
            projects: createProject(state.projects, action.payload)
          }
        case 'update':
          return {
            selectedProjectId: state.selectedProjectId,
            projects: updateProject(state.projects, action.payload)
          }
        case 'delete':
          return {
            selectedProjectId: state.selectedProjectId,
            projects: deleteProject(state.projects, action.payload)
          }
        default:
          return state;
      }
    }
  ```

## Selectors

Tomado desde [NgRx Docs](https://ngrx.io/guide/store/selectors)
- Es parte de `@ngrx/store`
- Permiten abstraer la manipulación de datos en queries compuestas
- Son funciones puras [Kyle Simpson - Functional Light JS](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch5.md)
- Los selectores son funciones puras que se utilizan para obtener porciones del estado del store, reciben alguna información y retornan algo mas
- Características cuando seleccionan porciones del State:
  - Portable
  - Memoization (cache)
  - Composición
  - Testeable
  - Type-safe
- Al usar las funciones `createSelector` y `createFeatureSelector` el `@ngrx/store` mantiene un seguimiento de los últimos argumentos en donde la función selector fue invocada.
- Al ser los selectores funciones puras, el último resultado puede ser retornado cuando los argumentos coinciden sin tener que reinvocar la función selectora (mejoras en rendimientos gracias al `memoization`)

## Effects -> Side Effects

- Proporciona una API para modelar orígenes de eventos como acciones
  - Escucha acciones enviadas desde Store
  - Aisla efectos secundarios de los componentes, permitiendo componentes más puros que seleccionen State y envien acciones
  - Proporciona nuevos orígenes de acciones para reducir state basado en interacciones externas como peticiones de red, mensajes web socket y eventos time-based
- Se dividen acciones, entre las que entran y las que salen... pro ejemplo `LoadProjects` ahora tiene `ProjectsLoaded`
  - `LoadProjects` will get captured by the effect
  - `ProjectsLoaded` when the operation is completed dispatched this one
- En lugar de ir enseguida al Reducer, se está yendo a una capa intermedia (middleware) que recibe el objeto entrante, realiza algo con él... y luego saca algo más para terminar
