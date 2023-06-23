#!/bin/sh

sed -i '/OPENAI_API_KEY/d' ~/.bashrc
sed -i '/PINECONE_API_KEY/d' ~/.bashrc
sed -i '/PINECONE_ENVIRONMENT/d' ~/.bashrc
sed -i '/PINECONE_INDEX_NAME/d' ~/.bashrc
echo export OPENAI_API_KEY=$OPENAI_API_KEY >> ~/.bashrc
echo export PINECONE_API_KEY=$PINECONE_API_KEY >> ~/.bashrc
echo export PINECONE_ENVIRONMENT=$PINECONE_ENVIRONMENT >> ~/.bashrc
echo export PINECONE_INDEX_NAME=$PINECONE_INDEX_NAME >> ~/.bashrc
