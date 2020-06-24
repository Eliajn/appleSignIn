const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const config = fs.readFileSync('./config/config.json');
const AppleAuth = require('apple-auth');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

let auth = new AppleAuth(config, fs.readFileSync('./config/AuthKey.p8').toString(), 'text');


const getClientSecret = () => {
    // sign with RSA SHA256
    const privateKey = `-----BEGIN PRIVATE KEY-----
    -----END PRIVATE KEY-----`;
    const headers = {
     kid: 'KEY_ID',
     alg: "HS256",
     typ: 'JWT' // is there another way to remove type?
    }
    const claims = {
     'iss': 'TEAM_ID',
     'aud': 'https://appleid.apple.com',
     'sub': 'CLIEN_ID',
    }
   token = jwt.sign(claims, privateKey, {
     algorithm: 'ES256',
     header: headers,
     expiresIn: '24h'
    });
   return token
   }

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))


const getUserId = (token) => {
	const parts = token.split('.')
	try {
		return JSON.parse(new Buffer(parts[1], 'base64').toString('ascii'))
	} catch (e) {
		return null
	}
}

app.post('/callback', bodyParser.urlencoded({ extended: false }), (req, res) => {
	const clientSecret = getClientSecret()
	const requestBody = {
		grant_type: 'authorization_code',
		code: req.body.code,
		redirect_uri: 'http://localhost:3000/callback',
		client_id: "CLIENT_ID",
		client_secret: clientSecret,
		scope: 'name email'
	}

	axios.request({
		method: "POST",
		url: "https://appleid.apple.com/auth/token",
		data: querystring.stringify(requestBody),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(response => {
		return res.json({
			success: true,
			data: response.data,
			user: getUserId(response.data.id_token)
		})
	}).catch(error => {
		return res.status(500).json({
			success: false,
			error: error.response.data
		})
	})
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
