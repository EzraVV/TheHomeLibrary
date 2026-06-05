import request from 'superagent'
import { supabase } from './supabase'

export async function withAccessToken(
  requestBuilder: request.SuperAgentRequest,
) {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    throw new Error('Authentication required')
  }

  return requestBuilder.set(
    'Authorization',
    `Bearer ${data.session.access_token}`,
  )
}
