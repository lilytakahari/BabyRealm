import {createRealmContext} from '@realm/react';
import {Goal} from './Goal';

export const GoalRealmContext = createRealmContext({
  schema: [Goal],
});
