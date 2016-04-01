FROM node:latest

MAINTAINER Brian Chapman <brian.chapman@utah.edu>

RUN apt-get update && apt-get install -y \
    python-dev\
    python-pip\
    mongodb\
    redis-server

RUN git clone --recursive https://github.com/chapmanbe/keep.git

WORKDIR /keep

RUN pip install -r deps.txt

RUN mkdir -p /data/db

RUN mongod
RUN redis-server
RUN python manage.py celeryd worker -E && \
    python keep_backend/manage.py syncdb

RUN git submodule init && \
    git submodule update && \
    npm install &&\
    npm install grunt-cli
