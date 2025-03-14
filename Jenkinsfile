pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'elvdevops/ansible-webapp'
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        KUBE_NAMESPACE = 'elvdevops-webapp'
    } 

    stages {
        stage('Checkout Code') {
            steps { 
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    string(credentialsId: 'github-docker-username', variable: 'DOCKER_USERNAME'),
                    string(credentialsId: 'github-docker-password', variable: 'DOCKER_PASSWORD')
                ]) {
                    sh """
                    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    """
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials']) {
                    sh 'docker push $DOCKER_IMAGE:latest'
                }
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                sh 'ansible-playbook -i inventory deploy.yml'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml -n $KUBE_NAMESPACE'
            }
        }
    }
}
