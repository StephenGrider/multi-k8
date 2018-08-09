docker build -t stephengrider/multi-client -f ./client/Dockerfile ./client
docker build -t stephengrider/multi-api -f ./server/Dockerfile ./server
docker build -t stephengrider/multi-worker -f ./worker/Dockerfile ./worker
docker tag stephengrider/multi-client:latest stephengrider/multi-client:$SHA
docker tag stephengrider/multi-server:latest stephengrider/multi-server:$SHA
docker tag stephengrider/multi-worker:latest stephengrider/multi-worker:$SHA
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push stephengrider/multi-client:latest
docker push stephengrider/multi-api:latest
docker push stephengrider/multi-worker:latest
docker push stephengrider/multi-client:$SHA
docker push stephengrider/multi-api:$SHA
docker push stephengrider/multi-worker:$SHA
kubectl apply -f deployments
kubectl set image deployments/api-deployment api=stephengrider/multi-api:$SHA
kubectl set image deployments/client-deployment client=stephengrider/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=stephengrider/multi-worker:$SHA
