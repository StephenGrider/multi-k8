# docker pull stephengrider/multi-client:latest
# docker pull stephengrider/multi-api:latest
# docker pull stephengrider/multi-worker:latest
# docker build --cache-from stephengrider/multi-client -t stephengrider/multi-client:latest -f ./client/Dockerfile ./client
# docker build --cache-from stephengrider/multi-api -t stephengrider/multi-api:latest -f ./server/Dockerfile ./server
# docker build --cache-from stephengrider/multi-worker -t stephengrider/multi-worker:latest -f ./worker/Dockerfile ./worker
# docker tag stephengrider/multi-client:latest stephengrider/multi-client:$SHA
# docker tag stephengrider/multi-api:latest stephengrider/multi-api:$SHA
# docker tag stephengrider/multi-worker:latest stephengrider/multi-worker:$SHA
# docker push stephengrider/multi-client:latest
# docker push stephengrider/multi-api:latest
# docker push stephengrider/multi-worker:latest
# docker push stephengrider/multi-client:$SHA
# docker push stephengrider/multi-api:$SHA
# docker push stephengrider/multi-worker:$SHA
kubectl apply -f deployments
# kubectl set image deployments/api-deployment api=stephengrider/multi-api:$SHA --record 
# kubectl set image deployments/client-deployment client=stephengrider/multi-client:$SHA --record 
# kubectl set image deployments/worker-deployment worker=stephengrider/multi-worker:$SHA --record
