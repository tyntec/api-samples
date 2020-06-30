exports.handleError = (error) => {
  if (error.request) { // This is a request error
    console.log('Request failed')
  }
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log('Response status: ', error.response.status, error.response.statusText)
    console.log('Response data: ', error.response.data)
  } else if (error.request) {
    // The request was made but no response was received
    console.log('No response for the request:', error.request)
  } else {
    // Something happened in setting up the request that triggered the Error
    // Or another error
    console.error('ERROR:', error.message)
  }
  if (error.config) {
    console.log('Request config: ', error.config)
  }
}
