import sqlite from 'sqlite3';
// import { serializeW3C } from '@annotorious/formats';

const storage = () => {

  const db = new sqlite.Database('annotations.sqlite');

  db.run('CREATE TABLE IF NOT EXISTS annotation (id STRING PRIMARY KEY, source STRING, json TEXT)');

  const load = (source: string) => {
    console.log('loading data for source ' + source);

    return new Promise(resolve => {
      db.all(`SELECT * FROM annotation WHERE source = '${source}'`, (err, rows) => {
        const annotations = rows.map(row => JSON.parse(row.json));
        resolve(annotations);
      });  
    });
  }

  const onCreate = (shape: { id: string }, source: string) => {
    console.log('creating')
    // Just a hack for now
    const json = JSON.stringify(shape);

    db.run('INSERT INTO annotation(id, source, json) VALUES (?, ?, ?)', [shape.id, source, json]);
  }

  const onUpdate = (shape: { id: string }, previous: Object) => {
    console.log('updating');

    db.run('UPDATE annotation SET json = ? WHERE id = ?', [JSON.stringify(shape), shape.id]);
  }

  const onDelete = (shape: { id: string }) => {
    db.run('DELETE FROM annotation WHERE id = ?', [shape.id]);
  }

  return {
    load, onCreate, onUpdate, onDelete
  }

}

export default storage();