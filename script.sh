#!/bin/bash

repo_name="jacek010"
app_name="budgetapp"

version_tag="latest"

# Get the list of services from docker-compose.yml
IMAGES=$(docker-compose config --images)

# Loop over each service
for IMAGE in $IMAGES; do

  # Push the image to Docker Hub
  docker push $IMAGE
done
