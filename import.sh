echo "Importing docker images"

IMPORT_DIR="./exports"

FRONTEND_IMAGE="sound-app-docker-frontend.tar"
BACKEND_IMAGE="sound-app-docker-backend.tar"

if [ ! -f "$IMPORT_DIR/$FRONTEND_IMAGE" ]; then
  echo "Missing $IMPORT_DIR/$FRONTEND_IMAGE"
  exit 1
fi

if [ ! -f "$IMPORT_DIR/$BACKEND_IMAGE" ]; then
  echo "Missing $IMPORT_DIR/$BACKEND_IMAGE"
  exit 1
fi

docker load -i $IMPORT_DIR/$FRONTEND_IMAGE
docker load -i $IMPORT_DIR/$BACKEND_IMAGE

echo "Images imported successfully"