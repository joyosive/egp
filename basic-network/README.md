# Tendernet Network Config

Note that this basic configuration DOES NOT use pre-generated certificates and
key material, and also DOES NOT have predefined transactions to initialize a 
channel named "transparency".

First, before doing anything else, generate this material. Simply run ``generate.sh``.

In `docker-compose.yml`, under services -> ca.tenders.gov -> environment, replace the variable `FABRIC_CA_SERVER_CA_KEYFILE` with (THIS_ALPHANUMERIC_VALUE)_sk located here: 

```
cd ./crypto-config/peerOrganizations/procurement.tenders.gov/ca
```

Thereafter, you can continue with the instructions below:

1. Next, to start the network, run ``start.sh``.

2. To stop it, run ``stop.sh``.

3. To completely remove all incriminating evidence of the network on your system, run ``teardown.sh``.