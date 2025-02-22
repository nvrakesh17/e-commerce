pipeline {
    agent any

    environment {
        PROJECT_ID = "your-gcp-project-id"
        GKE_CLUSTER = "microservices-cluster"
        GKE_ZONE = "us-central1-a"
        REGISTRY = "gcr.io/${PROJECT_ID}"
        K8S_MANIFESTS = "k8s-manifests"
        CREDENTIALS_ID = "Jenkins"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/your-repo/microservices-app.git'
            }
        }

        stage('Authenticate with GCP') {
            steps {
                script {
                    withCredentials([file(credentialsId: CREDENTIALS_ID, variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh 'gcloud config set project $PROJECT_ID'
                        sh 'gcloud container clusters get-credentials $GKE_CLUSTER --zone $GKE_ZONE'
                    }
                }
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    def services = ['frontend', 'user-service', 'order-service']
                    for (service in services) {
                        sh """
                            docker build -t $REGISTRY/${service}:latest ${service}/
                            docker push $REGISTRY/${service}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                script {
                    sh "kubectl apply -f $K8S_MANIFESTS/"
                }
            }
        }
    }
}
