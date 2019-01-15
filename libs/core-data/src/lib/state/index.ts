import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCustomers from './customers/customers.reducer';

// brings everything from ProjectsReducers
import * as fromProjects from './projects/projects.reducer';
import { Project } from '../projects/project.model';

// update the shape of the entire app state
export interface AppState {
  customers: fromCustomers.CustomersState,
  projects: fromProjects.ProjectsState,
}

// add in feature reducer into combined reducer
export const reducers: ActionReducerMap<AppState> = {
  customers: fromCustomers.customersReducer,
  projects: fromProjects.projectsReducers // to satisfied interface we need to export the new reducers
};

// top level reducer exposed for consumtion
// selectors exposed to the rest of the app
// now this should be exposed in the top level of lib (./core-data/src/index.ts)
// -------------------------------------------------------------------
// PROJECTS SELECTORS
// -------------------------------------------------------------------
// this is saying: i want to get or select this feature off of the main state
// which is equivalente to store.pipe(select('projects'))
export const selectProjectState = createFeatureSelector<fromProjects.ProjectsState>('projects');

// createSelector returns a Memoized selector, if nothing has changed returns the last known part
// if something has changed then returns the latest
export const selectProjectIds = createSelector(
  selectProjectState,
  fromProjects.selectProjectIds
)

export const selectProjectEntities = createSelector(
  selectProjectState,
  fromProjects.selectProjectEntities
)

export const selectAllProjects = createSelector(
  selectProjectState,
  fromProjects.selectAllProjects
)

export const selectCurrentProjectId = createSelector(
  selectProjectState,
  fromProjects.getSelectedProjectId
)

const emptyProject: Project = {
  id: null,
  title: '',
  details: '',
  percentComplete: 0,
  approved: false,
  customerId: null
}

export const selectCurrentProject = createSelector(
  selectProjectEntities,
  selectCurrentProjectId,
  (projectEntities, projectId) => {
    console.log('SELECTOR!', projectId);
    return projectId ? projectEntities[projectId] : emptyProject;
  }
)

// -------------------------------------------------------------------
// CUSTOMERS SELECTORS
// -------------------------------------------------------------------
export const selectCustomersState = createFeatureSelector<fromCustomers.CustomersState>('customers');

export const selectAllCustomers = createSelector(
  selectCustomersState,
  fromCustomers.selectAllCustomers
);

export const selectCustomersProjects = createSelector(
  selectAllCustomers,
  selectAllProjects,
  (customers, projects) => {
    return customers.map(customer => {
      return Object.assign({}, {
        ...customer,
        projects: projects.filter(project => project.customerId === project.id)
      })
    })
  }
)

