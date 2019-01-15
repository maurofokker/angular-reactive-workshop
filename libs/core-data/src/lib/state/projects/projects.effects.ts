import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';

import { ProjectsActionTypes, LoadProjects, ProjectsLoaded, AddProject, ProjectAdded } from './projects.actions';
import { ProjectsState } from './projects.reducer';
import { ProjectsService } from '../../projects/projects.service';
import { Project } from '../../projects/project.model';

@Injectable({providedIn: 'root'})
export class ProjectsEffects {

  // below is a variation of effects (from docs) but is a good utility when doing
  // server communication

  // this is a leadProjects$ effect that is listening for ProjectsActionTypes.LoadProjects
  // then it will run the code below that want to return the result of calling projectsService.all()
  // but the result will be mapped it to a new action object ProjectsLoaded
  // trigger object (command action): ProjectsActionTypes.LoadProjects
  // completed action: new ProjectsLoaded(result)
  // now reducer (projects.reducer.ts) must be updated to listen for ProjectsLoaded instead of LoadProjects
  @Effect() loadProjects$ = this.dataPersistence.fetch(ProjectsActionTypes.LoadProjects, {
    run: (action: LoadProjects, state: ProjectsState) => {
      return this.projectsService.all()
        .pipe(
          map((result: Project[]) => new ProjectsLoaded(result)) // result is an Project[] we would then want to put it into the reducer
        )
    },
    onError: () => {}
  })

  @Effect() addProject$ = this.dataPersistence.pessimisticUpdate(ProjectsActionTypes.AddProject, {
    run: (action: AddProject, state: ProjectsState) => {
      return this.projectsService.create(action.payload)
        .pipe(
          map((result: Project) => new ProjectAdded(result)) // result is an Project[] we would then want to put it into the reducer
        )
    },
    onError: () => {}
  })

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<ProjectsState>,
    private projectsService: ProjectsService
  ) {}
}
