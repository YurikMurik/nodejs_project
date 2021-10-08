import es from 'event-stream';

// TASK 1
process.stdin
  .pipe(es.split())
  .pipe(es.mapSync((data: string) => data.split('').reverse().join('').trim()))
  .pipe(process.stdout);
