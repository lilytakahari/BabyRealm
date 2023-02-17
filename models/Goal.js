import {Realm} from '@realm/react';

export class Goal extends Realm.Object {
  constructor(realm, description) {
    super(realm, {description});
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Goal',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      description: 'string',
      createdAt: {type: 'date', default: () => new Date()},
    },
  };
}