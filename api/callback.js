export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    res.status(400).send('Missing code');
    return;
  }
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });
    const data = await response.json();
    const token = data.access_token;
    const html = `<!DOCTYPE html>
<html>
<body>
<script>
(function() {
  function sendMsg(msg) {
    window.opener.postMessage(msg, '*');
  }
  const receiveMsg = (e) => {
    window.removeEventListener('message', receiveMsg, false);
    sendMsg('authorization:github:success:' + JSON.stringify({token: '${token}', provider: 'github'}));
  };
  window.addEventListener('message', receiveMsg, false);
  sendMsg('authorizing:github');
})();
</script>
<p>인증 완료. 창이 닫히지 않으면 직접 닫아주세요.</p>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send('OAuth error: ' + err.message);
  }
}
