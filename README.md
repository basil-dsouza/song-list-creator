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

# Song List Creator

A web application for musicians to create, manage, and transpose song lyrics and chords.

## Project Structure
- `songlistcreator-core`: Platform-independent Java library containing domain entities and business logic (e.g., Transposition).
- `songlistcreator-appengine`: Spring Boot application configured for Google App Engine and Cloud Datastore.
- `songlistcreator-ui`: React frontend.

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- Google Cloud SDK (for GAE deployment and local emulation)

## Runtime Modes

### 1. Fully Local (`local`)
Run everything locally using the Datastore Emulator. No GCP costs/connection needed.

1.  **Start Datastore Emulator**:
    ```bash
    gcloud beta emulators datastore start --host-port=localhost:8081
    ```
2.  **Run Backend** (in a new terminal):
    ```bash
    mvn spring-boot:run -pl songlistcreator-appengine -Dspring-boot.run.profiles=local
    ```
3.  **Run Frontend** (in a new terminal):
    ```bash
    cd songlistcreator-ui
    npm run dev
    ```
    Access at `http://localhost:5173` (Frontend) or `http://localhost:8080` (Backend).

### 2. Local App + Remote Datastore (`remote`)
Run the app locally but connect to the real Google Cloud Datastore.

1.  **Authenticate**:
    ```bash
    gcloud auth application-default login
    ```
2.  **Run Backend**:
    ```bash
    # Replace [YOUR_PROJECT_ID] with your actual GCP Project ID
    mvn spring-boot:run -pl songlistcreator-appengine -Dspring-boot.run.profiles=remote -Dspring.cloud.gcp.datastore.project-id=[YOUR_PROJECT_ID]
    ```
3.  **Run Frontend**:
    ```bash
    cd songlistcreator-ui
    npm run dev
    ```

### 3. Production (`prod`) - Deployed to App Engine
The app runs entirely on Google Cloud Platform.

#### Manual Deployment
1.  **Build Frontend** (Packaged into Backend):
    ```bash
    cd songlistcreator-ui
    npm install && npm run build
    cd ..
    ```
2.  **Deploy Backend**:
    ```bash
    mvn appengine:deploy -pl songlistcreator-appengine
    ```

#### GitHub Actions (CI/CD)
The project includes a GitHub Actions workflow `.github/workflows/deploy.yaml`.
**Required Secrets:**
- `GCP_PROJECT_ID`: Your Google Cloud Project ID.
- `GCP_SA_KEY`: JSON Key of a Service Account with **App Engine Deployer** and **Service Account User** roles.

## Documentation
- [Domain Model](DOMAIN.md)
- [Infrastructure & Config](INFRASTRUCTURE.md)
- [Lyrics Format](LYRICS_FORMAT.md)
