import config from '@/config/default'
import axios from 'axios'
export async function verifyAadharWithDigilocker(
  customerId: number,
): Promise<any> {
  const url = config.decentro_api
  try {
    const referenceId: string = customerId.toString() + Date.now()
    const response = await axios.post(
      url,
      {
        reference_id: String(referenceId),
        consent: true,
        consent_purpose: 'For bank account purpose only',
        //redirect_url:`http://localhost:8088/customers/digilocker_redirect_url`,
        redirect_url: `https://preprod.ramfincorp.co.in/new-api/customers/digilocker_redirect_url`,
        redirect_to_signup: true,
      },
      {
        headers: {
          accept: 'application/json',
          client_id: config.decentro_client_id,
          client_secret: config.decentro_client_secret,
          module_secret: config.decentro_module_secret,
          'content-type': 'application/json',
        },
      },
    )
    if (!response.data.data || Object.keys(response.data.data).length === 0) {
      throw new Error('User data not found in Digilocker.')
    }
    const { data } = response
    return data
  } catch (error) {
    console.log('Error', error.message)
    throw new Error('Error while initiating digilocker')
  }
}
export async function getAccessTokenDigilocker(
  state: string,
  code: string,
): Promise<any> {
  const url = config.decentro_access_token_Api
  const referenceId = Date.now().toString()
  const initial_decentro_transaction_id = state

  const Data = JSON.stringify({
    initial_decentro_transaction_id: initial_decentro_transaction_id,
    consent: true,
    consent_purpose: 'For bank account purpose only',
    reference_id: String(referenceId),
    digilocker_code: code,
  })

  try {
    const response = await axios.post(url, Data, {
      headers: {
        client_id: config.decentro_client_id,
        client_secret: config.decentro_client_secret,
        module_secret: config.decentro_module_secret,
        'content-type': 'application/json',
      },
      maxBodyLength: Infinity,
    })

    return response
  } catch (error) {
    console.error('Error fetching access token from Digilocker:', error)
    throw error
  }
}
