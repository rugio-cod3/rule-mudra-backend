import axios from 'axios'

export const getAccessToken = async (data) => {
  try {
    const url = 'https://oauth-account-noneu.truecaller.com/v1/token'

    let response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.status == 200) {
      return response.data.access_token
    } else {
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getUserInfo = async (token) => {
  try {
    const url = 'https://oauth-account-noneu.truecaller.com/v1/userinfo'
    let response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.log(error)
    return null
  }
}
