const API_URL = "https://api.themoviedb.org/3/"

function fetchData(path, callback, method, body, staticURL) {
    return fetch(!staticURL ? `${API_URL}${path}` : path, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
      .then((data) => data.json())
      .then((dataJson) => callback(dataJson))
      .catch((error) => callback(error))
  }

  function GET(path, callback) {
    return fetchData(path, callback, 'GET', null)
  }

  export const Fetch = {
    // PUT,
    GET,
    // POST,
    // PATCH,
    // DELETE,
    // POSTUNZIPPER,
    // GETUNZIPPER
  }
  