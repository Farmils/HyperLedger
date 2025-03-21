/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';

// MSP Id's of Organizations
export const mspIdOrg1 = 'Users';
export const mspIdOrg2 = 'Bank';

// Path to org1 crypto materials.
export const cryptoPathOrg1 = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'test-network',
    'organizations',
    'peerOrganizations',
    'org1.example.com',
);

// Path to user private key directory.
export const keyDirectoryPathOrg1 = path.resolve(
    cryptoPathOrg1,
    'users',
    'User1@org1.example.com',
    'msp',
    'keystore',
);

// Path to user certificate.
export const certDirectoryPathOrg1 = path.resolve(
    cryptoPathOrg1,
    'users',
    'User1@org1.example.com',
    'msp',
    'signcerts',
);

// Path to peer tls certificate.
export const tlsCertPathOrg1 = path.resolve(
    cryptoPathOrg1,
    'peers',
    'peer0.org1.example.com',
    'tls',
    'ca.crt',
);

// Path to org2 crypto materials.
export const cryptoPathOrg2 = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'test-network',
    'organizations',
    'peerOrganizations',
    'org2.example.com',
);

// Path to org2 user private key directory.
export const keyDirectoryPathOrg2 = path.resolve(
    cryptoPathOrg2,
    'users',
    'User1@org2.example.com',
    'msp',
    'keystore',
);

// Path to org2 user certificate.
export const certDirectoryPathOrg2 = path.resolve(
    cryptoPathOrg2,
    'users',
    'User1@org2.example.com',
    'msp',
    'signcerts',
);

// Path to org2 peer tls certificate.
export const tlsCertPathOrg2 = path.resolve(
    cryptoPathOrg2,
    'peers',
    'peer0.org2.example.com',
    'tls',
    'ca.crt',
);
// Gateway peer endpoint.
export const peerEndpointOrg1 = 'localhost:7051';
export const peerEndpointOrg2 = 'localhost:9051';

// Gateway peer container name.
export const peerNameOrg1 = 'peer0.org1.example.com';
export const peerNameOrg2 = 'peer0.org2.example.com';

// Collection Names
export const org1PrivateCollectionName = 'UsersPrivateCollection';
export const org2PrivateCollectionName = 'BankPrivateCollection';

export async function newGrpcConnection(
    tlsCertPath: string,
    peerEndpoint: string,
    peerName: string,
): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerName,
    });
}

export async function newIdentity(
    certDirectoryPath: string,
    mspId: string,
): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

export async function newSigner(keyDirectoryPath: string): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    const file = files[0];
    if (!file) {
        throw new Error(`No files in directory: ${dirPath}`);
    }
    return path.join(dirPath, file);
}
