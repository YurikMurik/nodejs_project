import es from 'event-stream';

process.stdin
  .pipe(es.split())
  .pipe(es.mapSync((data: string) => data.split('').reverse().join('').trim()))
  .pipe(process.stdout);
