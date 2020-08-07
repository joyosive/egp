# e-GP REST API 
This is the REST API for the e-GP System with Hyperledger Fabric.

It acts as a middleware between the [basic-network](https://bitbucket.org/marekiakiringu/e-gp-basic-network/src) and the [client application](https://bitbucket.org/marekiakiringu/e-gp/src).

Use the client application to interact with the deployed e-GP [smart contract](https://bitbucket.org/marekiakiringu/e-gp-chaincode/src).

Get the network started by running:

```
./startFabric.sh javascript
```

Enter the CA server:

```
docker exec -it ca.tenders.gov bash
```

Install nano:

```
apt install nano
```

Navigate to the /etc/hyperledger/fabric-ca-server/ directory:

```
cd /etc/hyperledger/fabric-ca-server/
```

Edit the fabric-ca-server-config.yaml file:

```
nano fabric-ca-server-config.yaml
```

Edit affiliations to:

```
affiliations:
   procurement:
      - staff
```

Exit, the CA server:

```
exit
```

Restart it:

```
docker restart container_id
```

Next, change into the "javascript" directory:

```
cd javascript
```

Next, install all required packages:

```
npm install
```

Then run the following applications to enroll the admin user, and register a new user called test which will be used by the other applications to interact with the deployed e-GP contract:

```
node enrollAdmin
node registerUser
```