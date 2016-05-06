'use strict';

const cluster = require('cluster');

if ( cluster.isMaster ) {
    
    // create a worker proocess for each CPU
    let workers = 0;
    const cpuCount = require('os').cpus().forEach(next => {
        cluster.fork();
        workers += 1;
    });
    
    console.log(`Workers created: ${workers}`);
    
} else {
    const express = require('express');
    const nunjucks = require('nunjucks');

    const app = express();
    // express error handling middleware: http://expressjs.com/en/guide/error-handling.html
    app.use((err, req, res, next) => {
        console.log(err.stack);
        res.status(500).send('Something broke!');
    });
    
    const primeDivisors = [2, 3, 5, 7];

    let nextPrime = 1;
    let primes = new Set();

 
    nunjucks.configure('app/views', {
        autoescape: true,
        express: app
    });



    app.get('/', (req, res) => {
        
        // console.log('get main route');    
        const limit = 100000;
        let counter = 0;
        let foundPrime = false;
        
        while ( !foundPrime && counter < limit ) {
            nextPrime += 1;
            counter += 1;
            foundPrime = true;
            if ( nextPrime !== 1 && primeDivisors.indexOf(nextPrime) === -1 ) {        
                for ( let item of primes ) {
                    if ( nextPrime % item === 0 ) {
                        foundPrime = false;
                        break;
                    }
                }  
            }
        }
        
        
        
        let counterExceeded = counter >= limit;
        if ( !counterExceeded ) {
            //console.log(`next prime found was ${nextPrime} by worker ${cluster.worker.id}`);
            primes.add(nextPrime);
            // Docker Node doesn't like the Spread Operator :(
            //res.render('index.html', { primes: [...primes] });
            res.render('index.html', { primes: Array.from(primes) });
        } else {
            //console.log('counter exceeded');
            res.status(201).render('index.html');
        }
        
    
    
    });

    app.listen(3001, () => {
        console.log(`Worker ${cluster.worker.id} started on port 3001, with error handling and graceful exit!`);
    });
    
    process.on('uncaughtxception', err => {
        console.log('Uncaught exception: ', err);
    });
    
    process.on('exit', () => {
        console.log(`Worker ${cluster.worker.id} exiting, highest prime: ${nextPrime}`);
    });
    process.on('SIGINT', () => {
        console.log(`Worker ${cluster.worker.id} received SIGINT, highest prime: ${nextPrime}`);
    });
}

