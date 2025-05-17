FROM node:18

ARG UID=1000
ARG GID=1000



RUN mkdir -p /tmp && chmod 1777 /tmp
RUN touch /tmp/.test

ENV TMPDIR=/var/tmp
RUN mkdir -p /var/tmp

# Install dependencies
RUN apt update && apt install -y curl tini unzip
ENTRYPOINT ["/usr/bin/tini", "--"]

RUN mkdir -p /.npm && chown -R $UID:$GID /.npm


ARG APP_DIR=/app/app/
RUN mkdir -p $APP_DIR
RUN chown -R $UID:$GID $APP_DIR
# Create .bun directory for bun installation
RUN mkdir -p /.bun
RUN chown -R $UID:$GID /.bun

USER $UID:$GID
WORKDIR $APP_DIR

# Install Bun (same pattern as other Dockerfiles)
RUN curl -fsSL https://bun.sh/install | bash

CMD ./start-docker-dev.sh
