# Dockerfiles

Distributions with preinstalled Qt.

## Building images

Newer Dockerfiles from this repository can be used by invoking `docker build` from project root directory. A typical command looks
like this:

```
docker build --build-arg QT_USER=<user> --build-arg QT_PASSWORD=<password> . -f <Distro-Version_Qt-Version>/Dockerfile -t <docker-tag>
```

Use Docker Hub tag format `<hub-user>/<repo-name>[:<tag>]` for `<docker-tag>` to be able to push images to Docker Hub by it.

```
docker push <docker-tag>
```
