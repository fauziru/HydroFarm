export default function({ store }) {
  this.axios.onRequest(config => {
    // check if the user is authenticated
    if (store.state.auth.access_token) {
      // set the Authorization header using the access token
      config.headers.Authorization = 'Bearer ' + store.state.auth.access_token
      console.log('user authenticated', store.state.auth.access_token)
    }
    console.log('user not authenticated')
    return config
  })
}
