/**
 * Copyright (C) 2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package controllers;

import ninja.Result;
import ninja.Results;

import com.google.inject.Singleton;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import java.math.BigInteger;

@Singleton
public class ApplicationController {

    protected int nextPrime = 1;
    //protected HashSet<Long> primes = new HashSet<Long>(50);
    protected Set<Integer> primes = ConcurrentHashMap.newKeySet();
    private static final int LOOP_LIMIT = 100000;
    private static final int[] PRIME_DIVISORS = { 2, 3, 5, 7 };


    public int indexOf(int[] array, int value) {
        int index = -1;

        for ( int i=0; i < array.length; i++ ) {
            if ( array[i] == value ) {
                index = i;
                break;
            }
        }

        return index;
    }

    public Result index() {

        int counter = 0;
        boolean foundPrime = false;

        while ( !foundPrime && counter < LOOP_LIMIT ) {
            nextPrime += 1;
            counter += 1;
            foundPrime = true;

            if ( nextPrime != 1 && indexOf(PRIME_DIVISORS, nextPrime) == -1 ) {
                for ( int l : primes ) {
                    if ( nextPrime % l == 0 ) {
                        foundPrime = false;
                        break;
                    }
                }
            }
        }

        if ( counter < LOOP_LIMIT ) {
            primes.add(nextPrime);
        }


        Result result = Results.html();

        //result.render("name", "Darren");
        result.render("nextPrime", nextPrime);
        result.render("primes", primes);


        return result;

    }
    
    public Result helloWorldJson() {
        
        SimplePojo simplePojo = new SimplePojo();
        simplePojo.content = "Hello World! Hello Json!";

        return Results.json().render(simplePojo);

    }
    
    public static class SimplePojo {

        public String content;
        
    }
}
