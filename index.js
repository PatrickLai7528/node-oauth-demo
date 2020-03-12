// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = "Iv1.61514a0dc0e75d1e";
const clientSecret = "5684cf24b2dc1613c82e1c1c11fb3a9ac6abcf3c";

const Koa = require("koa");
const path = require("path");
const serve = require("koa-static");
const route = require("koa-route");
const axios = require("axios");

const app = new Koa();

const main = serve(path.join(__dirname + "/public"));

const oauth = async ctx => {
	const requestToken = ctx.request.query.code;
	console.log("authorization code:", requestToken);

	const tokenResponse = await axios({
		method: "post",
		url:
			"https://github.com/login/oauth/access_token?" +
			`client_id=${clientID}&` +
			`client_secret=${clientSecret}&` +
			`code=${requestToken}`,
		headers: {
			accept: "application/json"
		}
	});

	const accessToken = tokenResponse.data.access_token;
	console.log(`access token: ${accessToken}`);

	const result = await axios({
		method: "get",
		url: `https://api.github.com/user`,
		headers: {
			accept: "application/json",
			Authorization: `token ${accessToken}`
		}
	});
	console.log(result.data);
	const name = result.data.name;

	ctx.response.redirect(`/welcome.html?name=${name}`);
};

const webhook = async ctx => {
	console.log(ctx.request.body);
};

app.use(main);
app.use(route.get("/oauth/redirect", oauth));
app.use(route.post("/github/webhooks", webhook));

app.listen(3000);
