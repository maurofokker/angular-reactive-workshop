import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';

import { reducers } from '.';
import { CustomersEffects } from './customers/customers.effects';
import { ProjectsEffects } from './projects/projects.effects';

@NgModule({
  imports: [
    CommonModule,
    NxModule.forRoot(),
    StoreModule.forRoot(reducers), // take all the combined reducers and make it available
    StoreDevtoolsModule.instrument({ maxAge: 10 }), // hooks in redux devtools in chrome
    EffectsModule.forRoot([ // as you create effects, then u need to add them in here
      CustomersEffects,
      ProjectsEffects // register here
    ]),
  ],
  declarations: []
})
export class StateModule { }
