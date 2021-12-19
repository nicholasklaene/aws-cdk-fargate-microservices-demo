#!/bin/bash
# Get AWS Credentials
read -p "AWS Account ID: " ACCOUNT_NUMBER
read -p "AWS Region: " REGION
read -p "AWS ECR Repository Name: " REPOSITORY

# Authenticate with ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_NUMBER.dkr.ecr.$REGION.amazonaws.com

# Find the ID of the image you want to push
printf "\n"
docker images
printf "\n"

read -p "Image Id: " IMAGE_ID
read -p "Image Name: " IMAGE_NAME
printf "\n"

# Delete previous version of image if wanted (for dev purposes, prevents unwanted costs)
read -p "Delete previous image to prevent unwanted AWS costs (y/n)? " DELETE_PREVIOUS
if [ "$DELETE_PREVIOUS" == "y" ] || [ "$DELETE_PREVIOUS" == "Y" ];
then
    printf "Deleting image: \n"
    aws ecr batch-delete-image --repository-name $REPOSITORY --image-ids imageTag=$IMAGE_NAME
fi

# Tag the image
docker tag $IMAGE_ID $ACCOUNT_NUMBER.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY:$IMAGE_NAME

# Push the image
docker push $ACCOUNT_NUMBER.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY:$IMAGE_NAME
