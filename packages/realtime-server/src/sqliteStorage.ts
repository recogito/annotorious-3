import sqlite from 'sqlite3';
import { serializeW3C } from '@annotorious/formats';

const storage = () => {

  const db = new sqlite.Database('annotations.db');

  db.run('CREATE TABLE IF NOT EXISTS annotation (id STRING PRIMARY KEY, source STRING, json TEXT)');

  const load = (source: string) => {
    console.log('loading data for source ' + source);

    db.all(`SELECT * FROM annotation WHERE source = '${source}'`, (err, rows) => {
      rows.forEach(row => console.log(row));
    });
  }

  const onCreate = (shape: Object, source: string) => {
    // @ts-ignore
    const annotation = serializeW3C(shape, source);
    console.log('creating', annotation);
  }

  const onUpdate = (annotation: Object, previous: Object) => {
    console.log('updating', annotation);
  }

  const onDelete = (annotation: Object) => {
    console.log('deleting', annotation);
  }

  return {
    load, onCreate, onUpdate, onDelete
  }

}

export default storage();