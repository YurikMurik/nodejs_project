import es from 'event-stream';

process.stdin
    .pipe(es.split())
    // eslint-disable-next-line no-sync
    .pipe(es.mapSync((data: string) => data.split('').reverse().join('').trim()))
    .pipe(process.stdout);
