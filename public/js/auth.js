function auth() {
  fetch('/session/jwt/localStorage')
    .then(response => response.json())
    .then(responseJson => {
      window.localStorage.setItem('token', responseJson.token)
  })
  return true;
}