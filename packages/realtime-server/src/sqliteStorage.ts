import sqlite from 'sqlite3';
// import { serializeW3C } from '@annotorious/formats';

const storage = () => {

  const db = new sqlite.Database('annotations.sqlite');

  db.run('CREATE TABLE IF NOT EXISTS annotation (id STRING PRIMARY KEY, source STRING, json TEXT)');

  const load = (source: string) => {
    console.log('loading data for source ' + source);

    return new Promise(resolve => {
      db.all(`SELECT * FROM annotation WHERE source = '${source}'`, (err, rows) => {
        const annotations = rows.map(row => ({ ...JSON.parse(row.json), state: {} }));
        resolve(annotations);
      });  
    });
  }

  const onCreate = (shape: { id: string, state: object }, source: string) => {
    const { state, ...rest } = shape;
    const json = JSON.stringify(rest);
    db.run('INSERT INTO annotation(id, source, json) VALUES (?, ?, ?)', [shape.id, source, json]);
  }

  const onUpdate = (shape: { id: string, state: object }, previous: Object) => {
    const { state, ...rest } = shape
    db.run('UPDATE annotation SET json = ? WHERE id = ?', [JSON.stringify(rest), shape.id]);
  }

  const onDelete = (shape: { id: string }) => {
    db.run('DELETE FROM annotation WHERE id = ?', [shape.id]);
  }

  return {
    load, onCreate, onUpdate, onDelete
  }

}

export default storage();