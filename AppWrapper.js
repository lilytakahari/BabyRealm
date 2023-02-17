import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {GoalRealmContext} from './models';
import App from './App';

export const AppWrapper = () => {
  const {RealmProvider} = GoalRealmContext;

  // If sync is disabled, setup the app without any sync functionality and return early
  return (
      <RealmProvider>
        <App />
      </RealmProvider>
  );
};