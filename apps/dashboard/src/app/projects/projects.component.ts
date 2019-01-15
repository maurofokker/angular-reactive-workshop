import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Customer, Project, ProjectsService, NotificationsService, CustomersService, ProjectsState,
  AddProject, UpdateProject, DeleteProject, LoadProjects, initialProjects, selectAllProjects, selectCurrentProject, SelectProject } from '@workshop/core-data';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<Project[]>; // 02
  customers$: Observable<Customer[]>;

  currentProject$: Observable<Project>;

  // currentProject: Project;

  constructor(
    private customerService: CustomersService,
    private store: Store<ProjectsState>, // 01
    private ns: NotificationsService) {
      this.projects$ = store.pipe(
        select(selectAllProjects)
      );
      this.currentProject$ = store.pipe(
        select(selectCurrentProject)
      );
    }

  ngOnInit() {
    this.getProjects();
    this.getCustomers();
    this.resetCurrentProject();
  }

  resetCurrentProject() {
    this.store.dispatch(new SelectProject(null));
  }

  selectProject(project) {
    this.store.dispatch(new SelectProject(project.id));
  }

  cancel(project) {
    this.resetCurrentProject();
  }

  getCustomers() {
    this.customers$ = this.customerService.all();
  }

  getProjects() {
    // this.projects$ = this.projectsService.all();
    this.store.dispatch(new LoadProjects());
  }

  saveProject(project) {
    if (!project.id) {
      this.createProject(project);
    } else {
      this.updateProject(project);
    }
  }

  createProject(project) {
    this.store.dispatch(new AddProject(project));

    // to be deleted eventually
    this.ns.emit('Project created!'); // this will emit an event to display this msg
    this.resetCurrentProject();       // reset current project

    // this.projectsService.create(project)
    //   .subscribe(response => {
    //     this.ns.emit('Project created!');
    //     this.getProjects();
    //     this.resetCurrentProject();
    //   });
  }

  updateProject(project) {
    this.store.dispatch(new  UpdateProject(project));

    // to be deleted eventually
    this.ns.emit('Project updated!');
    this.resetCurrentProject();

    // this.projectsService.update(project)
    //   .subscribe(response => {
    //     this.ns.emit('Project saved!');
    //     this.getProjects();
    //     this.resetCurrentProject();
    //   });
  }

  deleteProject(project) {
    this.store.dispatch(new DeleteProject(project));

    // to be deleted eventually
    this.ns.emit('Project deleted!');
    this.resetCurrentProject();

    // this.projectsService.delete(project)
    //   .subscribe(response => {
    //     this.ns.emit('Project deleted!');
    //     this.getProjects();
    //     this.resetCurrentProject();
    //   });
  }
}

