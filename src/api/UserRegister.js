import { ENV_VARS } from '../utils/constants/index'

export const UserRegister = async (payload) => {
  try {
    console.log('Payload enviado al API:', payload)

    const response = await fetch(`${ENV_VARS.URL_PATH}/api/coloriza`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    // Retornar tanto el status como los datos
    const result = {
      status: response.status,
      data: null,
      ok: response.ok
    }

    // Intentar parsear los datos solo si hay contenido
    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        result.data = await response.json()
      } catch (parseError) {
        console.warn('Error parsing JSON response:', parseError)
      }
    }

    return result
  } catch (error) {
    console.error('Error fetching user register:', error)
    return {
      status: 0,
      data: null,
      ok: false,
      error: error.message
    }
  }
}
