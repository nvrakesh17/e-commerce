pipeline {
    agent any

    environment {
        PROJECT_ID = "automatic-bond-451709-k3"
        GKE_CLUSTER = "microservices-cluster"
        GKE_ZONE = "us-central1-a"
        REGISTRY = "gcr.io/${PROJECT_ID}"
        K8S_MANIFESTS = "k8s-manifests"
        GCR_HOSTNAME = "us-docker.pkg.dev" 
        CREDENTIALS_ID = "github-credentials"
        HELM_RELEASE = 'e-commerce'
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-service-account')
        JENKINS_SA_CREDENTIALS = credentials('Jenkins-Credentials')
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
                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh 'gcloud config set project $PROJECT_ID'
                        sh 'gcloud container clusters get-credentials $GKE_CLUSTER --zone $GKE_ZONE'
                    }
                }
            }
        }

        stage('Authenticate with Google Artifact Registry') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'Jenkins-Credentials', variable: 'JENKINS-SA-CREDENTIALS')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                        sh 'gcloud auth configure-docker us-docker.pkg.dev'
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
                    docker build -t ${REGISTRY}/${service}:latest ${service}/
                    docker push ${REGISTRY}/${service}:latest
                """
                //     // docker build -t us-docker.pkg.dev/automatic-bond-451709-k3/gcr.io/${service}:latest ${service}/
                //     // docker push us-docker.pkg.dev/automatic-bond-451709-k3/gcr.io/${service}:latest
                // """
            }
        }
    }
}

stage('Deploy to GKE using Helm') {
            steps {
                sh "helm upgrade --install $HELM_RELEASE ./helm --set image.repository=$GCR_HOSTNAME/$PROJECT_ID/"
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
