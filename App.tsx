import { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';

import {Goal} from './models/Goal';
import {GoalRealmContext} from './models';

import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';

const {useRealm, useQuery, useObject} = GoalRealmContext;

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const realm = useRealm();
  const result = useQuery(Goal);
  const courseGoals = useMemo(() => result.sorted('createdAt'), [result]);
  console.log(courseGoals);
  console.log(modalIsVisible);

  function startAddGoalHandler() {
    setModalIsVisible(true);
  }

  function endAddGoalHandler() {
    setModalIsVisible(false);
  }

  const addGoalHandler = useCallback(
      description => {
        if (!description) {
          return;
        }
        endAddGoalHandler();
        // Everything in the function passed to "realm.write" is a transaction and will
        // hence succeed or fail together. A transcation is the smallest unit of transfer
        // in Realm so we want to be mindful of how much we put into one single transaction
        // and split them up if appropriate (more commonly seen server side). Since clients
        // may occasionally be online during short time spans we want to increase the probability
        // of sync participants to successfully sync everything in the transaction, otherwise
        // no changes propagate and the transaction needs to start over when connectivity allows.
        realm.write(() => {
          return new Goal(realm, description);
        });
      },
      [realm],
    );

  const deleteGoalHandler = useCallback(
      goal => {
        realm.write(() => {
          realm.delete(goal);

          // Alternatively if passing the ID as the argument to handleDeleteTask:
          // realm?.delete(realm?.objectForPrimaryKey('Task', id));
        });
      },
      [realm],
    );

  return (
    <>
      <View style={styles.appContainer}>
        <Button
          title="Add New Goal"
          color="#a065ec"
          onPress={startAddGoalHandler}
        />
        <GoalInput
          visible={modalIsVisible}
          onAddGoal={addGoalHandler}
          onCancel={endAddGoalHandler}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            data={[...courseGoals]} // useQuery cannot be used directly
            // since it does not cause a re-render. we unpack the list
            // Follow this issue: https://github.com/realm/realm-js/issues/5404
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
                <GoalItem
                  text={item.description}
                  onDeleteItem={() => deleteGoalHandler(item)}
                />
            )}
            alwaysBounceVertical={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  goalsContainer: {
    flex: 5,
  },
});