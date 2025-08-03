import { ENV_VARS } from '../utils/constants/index'

export const UserRegister = async (payload) => {
  try {
    const response = await fetch(`${ENV_VARS.URL_PATH}/api/customer`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    if (!response.ok) {
      throw new Error('Network response not ok')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user register:', error)
    return null
  }
}
