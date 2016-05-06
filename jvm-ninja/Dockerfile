from java:8

ENV APP_DIR /opt/primes/jvm-ninja
ENV JAR_FILE jvmNinja-1.0-SNAPSHOT.jar

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

ADD ./target/$JAR_FILE $APP_DIR

CMD java -Dninja.port=8080 -jar $JAR_FILE

EXPOSE 8080


