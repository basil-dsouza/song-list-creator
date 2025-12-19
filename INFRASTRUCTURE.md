# Infrastructure & Configuration

## Google App Engine (Standard Environment)
The application runs on the Java 17 Runtime.

### Modules
- **songlistcreator-appengine**: The web service entry point.

### Datastore
We use Google Cloud Datastore (NoSQL) for persistence.

#### Configuration
- `application.properties`: Contains Spring Cloud GCP settings.
  ```properties
  spring.cloud.gcp.datastore.enabled=true
  spring.cloud.gcp.datastore.namespace=songlistcreator
  ```

#### Repositories
We use Spring Data Datastore.
- `SpringDataSongRepository`: Extends `DatastoreRepository`.
- `DatastoreSong`: Maps the `songs` Kind in Datastore.

### Dependencies
- `spring-cloud-gcp-starter-data-datastore`: For Datastore access.
- `spring-boot-starter-web`: For REST API.
