import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Customer, Project, NotificationsService, CustomersService, ProjectsFacade } from '@workshop/core-data';
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
    private facade: ProjectsFacade,
    private ns: NotificationsService) {
      this.projects$ = facade.projects$;
      this.currentProject$ = facade.currentProject$;
    }

  ngOnInit() {
    this.getProjects();
    this.getCustomers();
    this.resetCurrentProject();
  }

  resetCurrentProject() {
    this.facade.resetCurrentProject();
  }

  selectProject(project) {
    this.facade.selectProject(project);
  }

  cancel(project) {
    this.resetCurrentProject();
  }

  getCustomers() {
    this.customers$ = this.customerService.all();
  }

  getProjects() {
    // this.projects$ = this.projectsService.all();
    this.facade.getProjects();
  }

  saveProject(project) {
    if (!project.id) {
      this.createProject(project);
    } else {
      this.updateProject(project);
    }
  }

  createProject(project) {
    this.facade.createProject(project);

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
    this.facade.updateProject(project);

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
    this.facade.deleteProject(project);

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

