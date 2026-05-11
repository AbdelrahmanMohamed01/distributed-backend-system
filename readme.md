# Distributed Backend with Kubernetes

This project demonstrates a high-availability, auto-scaling backend service deployed on a cloud provider (GCP) using Kubernetes. It includes a containerized CRUD API and a resilient MongoDB replica set.

## Architecture Overview
* **Backend API:** A simple CRUD service managing "Posts".
* **Database:** A 3-node MongoDB Replica Set deployed via a `StatefulSet` to ensure data persistence and high availability.
* **Orchestration:** Managed by Kubernetes with:
    * **Deployment:** Handles backend scaling with a minimum of 1 and maximum of 5 replicas.
    * **HPA:** Horizontal Pod Autoscaler that triggers scaling when CPU usage reaches 70%.
    * **Networking:** The API is exposed internally via a `ClusterIP` Service and externally via an `Ingress` controller.
## Explanation Video
[Explanation Walkthrough Video on Youtube](https://youtu.be/Ffsqf8_XQPw)

## Setup & Deployment

### 1. Prerequisites
* A Docker Hub account.
* Access to a cloud provider (GCP).
* `kubectl` and `docker` installed locally.

### 2. Deployment Steps
1. **Containerize the App:**
    ```bash
    docker build -t abdelrahmanmohamed01/distributed-backend:latest .
    docker push abdelrahmanmohamed01/distributed-backend:latest
    ```
2. **Deploy Manifests:**
    Apply the Kubernetes configurations in this order:
    ```bash
    kubectl apply -f k8s/backend/configmap.yaml
    kubectl apply -f k8s/mongodb/
    kubectl apply -f k8s/backend/
    kubectl apply -f k8s/ingress/
    ```
    ReplicaSet setup:
    ```bash
   rs.initiate()
   rs.add("mongodb-1.mongodb-service:27017")
   rs.add("mongodb-2.mongodb-service:27017")
    ```
4. **Update the Image:**
    ```bash
    kubectl set image deployment/backend-deploy \
    backend=abdelrahmanmohamed01/distributed-backend:<NEW_TAG>
    ```
5. **Monitoring the Update:**
    ```bash
   kubectl rollout status deployment/backend-deploy
    ```

## API Endpoints
The following endpoints are accessible externally via the Ingress IP/Host:

| Method | Endpoint     | Description           |
| :--- |:-------------|:----------------------|
| `GET` | `/`          | Home page             |
| `GET` | `/health`    | Get the health of app |
| `GET` | `/posts`     | Get all posts         |
| `POST` | `/posts`     | Create a new post     |
| `PUT` | `/posts/:id` | Update a post         |
| `DELETE` | `/posts/:id` | Delete a post         |

## Validation & Testing
To verify the system meets the acceptance criteria:

* **External Access:** Verify the API is reachable through the Ingress URL (via http://34.18.129.150).
* **Auto-scaling:** Use a load-testing tool to increase CPU usage. Observe pods increasing from 1 to 5 as CPU hits 70%.
  * ```bash
    kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://34.18.129.150; done"
    ``` 
* **High Availability (Failover):**
    * Delete a backend pod; the system should remain functional.
      * ```bash
        kubectl delete pod <backend-pod-name>
         ```
    * Delete a MongoDB pod; verify that no data is lost and the replica set recovers.
      * ```bash
        kubectl delete pod mongo-0
         ```
## Repository Contents
* `server.js`: Backend API source code.
* `Dockerfile`: Containerization instructions.
* `k8s/`: All Kubernetes manifests (Deployment, HPA, StatefulSet, Ingress, Service).
* `.github/workflows/`: CI/CD configuration.
