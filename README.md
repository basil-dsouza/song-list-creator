# Song List Creator

A web application for musicians to create, manage, and transpose song lyrics and chords.

## Project Structure
- `songlistcreator-core`: Platform-independent Java library containing domain entities and business logic (e.g., Transposition).
- `songlistcreator-appengine`: Spring Boot application configured for Google App Engine and Cloud Datastore.
- `songlistcreator-ui`: React frontend (Coming soon).

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js (for frontend)
- Google Cloud SDK (optional, for deployment)

## How to Run Locally

### Backend
1. Navigate to the project root.
2. Run `mvn install` to build all modules.
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run -pl songlistcreator-appengine
   ```
   The backend will start on `http://localhost:8080`.

   *Note: For local Datastore, you may need the Datastore Emulator or valid GCP credentials.*

## How to Deploy to Google App Engine
1. Ensure `gcloud` is authenticated and configured for your project.
2. Run `mvn package appengine:deploy -pl songlistcreator-appengine` (requires App Engine Maven plugin configuration, currently standard jar deployment usage).
   Or use the Google Cloud SDK:
   ```bash
   cd songlistcreator-appengine
   gcloud app deploy
   ```

## Documentation
- [Domain Model](DOMAIN.md)
- [Infrastructure & Config](INFRASTRUCTURE.md)
- [Lyrics Format](LYRICS_FORMAT.md)
