## Printer Cloud

# Pre-requisites

- AWS CLI
- Docker

# Configure aws cli

```bash
$ aws configure
```

# Log in to Elastic Container Registry

```bash
$ aws ecr get-login-password --region sa-east-1 | docker login --username AWS --password-stdin 698497033648.dkr.ecr.sa-east-1.amazonaws.com
```

# Create a `.env` file from sample file

```bash
$ cp .env.sample .env
```

# Create local docker network with:

```bash
$ docker network create -d bridge end_to_end
```

# Starting the application

```bash
$ docker compose up
```

# Setting up the database

```bash
$ docker ps
$ docker exec -it <CONTAINER_ID> rails db:create
$ docker exec -it <CONTAINER_ID> rails db:migrate
$ docker exec -it <CONTAINER_ID> rails db:seed
```

# Running the tests

```bash
$ docker exec -it <CONTAINER_ID> rspec
```

# Creating a Pull-Request

```bash
$ git checkout main
$ git pull origin main —rebase
$ git checkout -b <INITIALS>-main/<BRANCH_TYPE>/feature-name
$ git add .
$ git commit -m "Add commit message"
$ git push origin <INITIALS>-main/<BRANCH_TYPE>/feature-name
```

# Running backend and frontend locally

- First you have to clone frontend repository:

```bash
$ git clone git@github.com:Printer-Cloud/PrinterCloudFront.git
```

- And then, in your `.env` file, the url for the API is `web:3000` and for the frontend is `apache-srv:80`

# Running solr locally

Solr is our search engine used to index and query for documents using full-text search and other search features.
In order to index and query documents locally, you need to install [Solr v8.11.x](https://solr.apache.org/guide/8_11/) and configure the documents collection.

## Pre requisites

- Java v1.8 or higher (preferably v1.8.0_312)
- [Apache Tika CLI 2.6.0](https://archive.apache.org/dist/tika/2.6.0/tika-app-2.6.0.jar)
  - download the JAR and save it as `tika-app.jar` in the project root

## Installing Solr

Check ou the [Download page](https://solr.apache.org/downloads.html) for solr and download the 8.11.x binary release

After unzipping the downloaded file, you should end up with a directory structure like this:

```
solr-8.11.2/
├─ bin/
├─ contrib/
├─ dist/
├─ docs/
├─ example/
├─ licences/
├─ server/
├─ CHANGES.txt
├─ LICENSE.txt
├─ LUCENE_CHANGES.txt
├─ NOTICE.txt
├─ README.txt
```

For more information, check [Directory Layout](https://solr.apache.org/guide/8_11/installing-solr.html#directory-layout)

## Starting Solr

Enter the `solr-8.11.x` directory and run the start command

```bash
$ cd solr-8.11.2
$ bin/solr start
```

## Checking solr status

Enter the `solr-8.11.x` directory and run the status command

```bash
$ cd solr-8.11.2
$ bin/solr status
```

## Stopping solr

Enter the `solr-8.11.x` directory and run the stop command

```bash
$ cd solr-8.11.2
$ bin/solr stop
```

## The Admin Console

To use the Admin Console, enter the url `http://localhost:8983/solr/#/` in your browser

## Creating the documents core (or collection in SolrCloud)

In order to index our documents we need to create the `documents` core based on a schema.
Our solr configuration are in the directory `solr-8.11.x/server/solr/configsets/`.
We are going to create a new configset called `documents`.
The content of this configset is always updated by version in the github repository [Printer-Cloud/printer-solr](https://github.com/Printer-Cloud/printer-solr).

First, copy the `_default` configset and name it to `documents`

```bash
$ cd 8.11.2/server/solr/configsets
$ cp -r _default documents
$ cd documents
```

Now, change the content of the files `managed-schema` and `solrconfig.xml` to the ones we use in our solr repository.
After the config has been updated, create the core in the [Core Admin](http://localhost:8983/solr/#/~cores/documents) page.
The fields should be filled as follows:

```
name: documents
instanceDir: configsets/documents
dataDir: data
config: solrconfig.xml
schema: schema.xml
```

Then click the button "Add Core" to create the core

Check the API repository to verify that your `.env` is up to date and has the `SOLR_COLLECTION` variable with the latest version.

## Querying for documents

After the `documents` core has been created, you can visit the [Query](http://localhost:8983/solr/#/documents/query) page and query for documents in your core.
You should see an empty collectionf of documents. Try adding a document to the collection via [Documents](http://localhost:8983/solr/#/documents/documents) page or via processing the OCR in Printer Cloud.
