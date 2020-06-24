const key =`-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQguphnbvdmswC3bpsc
upQhsJOGu/uJoGfNtUmtQVYXfRygCgYIKoZIzj0DAQehRANCAARI7FOIE7IcKkiI
y5PacmhquAzFf8J4ZlKQBCYzh41ZrrhmjHJu4DWUk4MVDHjZusyu1shG9fe/cDom
kPqm49rI
-----END PRIVATE KEY-----` 

const teamId = 'KVHAJ28WQB';
const keyId = '7Q5J5UAHJK';
const webClientId = "com.eurisko.ohbakehouse.nslclient"; // the Services ID
const appClientId = 'https://apple-auth.example.com/auth'; // the App ID

const jsonwebtoken = require('jsonwebtoken');

// for web use
jsonwebtoken.sign({}, key, {
  algorithm: 'ES256',
  expiresIn: '1d',
  audience: 'https://appleid.apple.com',
  subject: webClientId,
  issuer: teamId,
  keyid: keyId,
});

// for native use
jsonwebtoken.sign({}, key, {
  algorithm: 'ES256',
  expiresIn: '1d',
  audience: 'https://appleid.apple.com',
  subject: appClientId,
  issuer: teamId,
  keyid: keyId,
});