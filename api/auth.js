export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: `https://cancer.it.kr/api/callback`,
    scope: 'repo,user',
    state: req.query.state || '',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
