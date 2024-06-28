# Robotics Company Software Deployment and Observability

## Table of Contents
- [Introduction](#introduction)
- [Dockerfile](#dockerfile)
- [Kubernetes Deployment YAML](#kubernetes-deployment-yaml)
- [Azure DevOps Pipeline](#azure-devops-pipeline)
- [Cloudflare Worker for Image Resizing and Caching](#cloudflare-worker-for-image-resizing-and-caching)
- [Observability Stack Diagram](#observability-stack-diagram)
- [Summary](#summary)

## Introduction
Este proyecto describe el despliegue de un microservicio desarrollado en Python en Kubernetes, la creación de un pipeline en Azure DevOps para construir, validar y crear artefactos, la configuración de un Cloudflare Worker para redimensionar y cachear imágenes, y una configuración detallada para mejorar la observabilidad utilizando varias herramientas en Azure Cloud.

## Dockerfile
El `Dockerfile` define la imagen para el microservicio Python.

```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```
## Cloudflare-worker-for-image-resizing-and-caching

Go to the Cloudflare dashboard.
Select your domain.
Go to the Workers section and create a new Worker.
Copy and paste the above code into the Worker editor.
Assigns a path to the Worker, for example example.com/resize.

### Using the Worker
To resize and cache an image, you can make a request to the Worker URL with the image, width, and height parameters. For example:

```bash
https://example.com/resize?image=https://example.com/image.jpg&width=400&height=300
```
### observability-stack-diagram
                    +---------------------+
                    |     End Users       |
                    +---------------------+
                            |
                            |
                      [Cloudflare]
                            |
                            v
+-----------------------------------------------------+
|                    Azure Cloud                      |
|                                                     |
|  +--------------------+  +-----------------------+  |
|  |  Azure DevOps      |  |   Azure K8s (AKS)     |  |
|  +--------------------+  +-----------------------+  |
|                                                     |
|  +-----------------------------------------------+  |
|  |               K8s Cluster                     |  |
|  |  +--------------------+   +----------------+  |  |
|  |  |    Microservices   |   |    Databases   |  |  |
|  |  |                    |   |                |  |  |
|  |  |   Python, .Net,    |   |  SQL Server    |  |  |
|  |  |   NodeJs           |   |  MongoDB       |  |  |
|  |  |                    |   |  Cassandra     |  |  |
|  |  +--------------------+   +----------------+  |  |
|  |                                               |  |
|  |  +--------------------+   +----------------+  |  |
|  |  |   Kafka Cluster    |   |  LinkerD       |  |  |
|  |  +--------------------+   +----------------+  |  |
|  |                                               |  |
|  |  +--------------------+   +----------------+  |  |
|  |  |      Nginx         |   |  Prometheus    |  |  |
|  |  +--------------------+   +----------------+  |  |
|  |                                               |  |
|  |  +--------------------+   +----------------+  |  |
|  |  |       Loki         |   |  Grafana       |  |  |
|  |  +--------------------+   +----------------+  |  |
|  |                                               |  |
|  |  +-----------------------------------------+  |  |
|  |  |                ELK Stack                |  |  |
|  |  |  +-----------------------------------+  |  |  |
|  |  |  |  Fluentd (Log Collect)            |  |  |  |
|  |  |  |  Elasticsearch (Store)            |  |  |  |
|  |  |  |  Kibana (Visualize)               |  |  |  |
|  |  |  +-----------------------------------+  |  |  |
|  |  +-----------------------------------------+  |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+

### Summary
Worker Creation: A new Worker is created in Cloudflare.
Worker Code: JavaScript is used to resize and cache images.
Configuration and deployment: The Worker is configured and deployed through the Cloudflare panel.
Use of the Worker: Requests are made to the Worker with the necessary parameters to resize the images.