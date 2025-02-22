pipeline {
    agent any

    environment {
        PROJECT_ID = "your-gcp-project-id"
        GKE_CLUSTER = "microservices-cluster"
        GKE_ZONE = "us-central1-a"
        REGISTRY = "gcr.io/${PROJECT_ID}"
        K8S_MANIFESTS = "k8s-manifests"
        CREDENTIALS_ID = "Jenkins"
        HELM_RELEASE = 'e-commerce'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/nvrakesh17/e-commerce.git'
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

stage('Deploy to GKE using Helm') {
            steps {
                sh "helm upgrade --install $HELM_RELEASE ./helm-chart --set image.repository=$GCR_HOSTNAME/$PROJECT_ID/"
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed! Check the logs for errors.'
        }
    }
}