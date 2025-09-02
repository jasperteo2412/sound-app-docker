echo "Export docker images"

FRONTEND_IMAGE="sound-app-docker-frontend"
BACKEND_IMAGE="sound-app-docker-backend"

EXPORT_DIR="./exports"
mkdir -p $EXPORT_DIR

docker save -o $EXPORT_DIR/${FRONTEND_IMAGE}.tar $FRONTEND_IMAGE
docker save -o $EXPORT_DIR/${BACKEND_IMAGE}.tar $BACKEND_IMAGE

echo "Exported images to $EXPORT_DIR/"
ls -lh $EXPORT_DIR