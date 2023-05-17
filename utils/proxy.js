import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

// SET SOCKS5_PROXY=socks5h://127.0.0.1:7080
let socksProxy
if (process.env.SOCKS5_PROXY) {
  console.log('SOCKS5_PROXY:', process.env.SOCKS5_PROXY)
  if (!socksProxy && !axios._proxy_installed) {
    socksProxy = new SocksProxyAgent(process.env.SOCKS5_PROXY)

    axios._proxy_installed = true
    axios.interceptors.request.use(function (config) {
      console.log('request through SOCKS5_PROXY:', process.env.SOCKS5_PROXY)
      // Do something before request is sent
      if (socksProxy) {
        config = {
          ...config,
          httpsAgent: socksProxy
        }
      }
      return config
    }, function (error) {
      // Do something with request error
      console.log('axios.interceptors:', error)
      return Promise.reject(error)
    })
  }
}

export default socksProxy
