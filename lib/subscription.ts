import { createClient } from '@/lib/supabase/server'

export type Plan = 'free' | 'starter' | 'pro' | 'elite'
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired'

export interface UserPlan {
  plan: Plan
  status: SubscriptionStatus
  isActive: boolean
  canAccessUnlimited: boolean
  dailyLimit: number
}

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const supabase = createClient()

  const { data } = await supabase
    .from('user_subscriptions')
    .select('plan, status, trial_ends_at')
    .eq('user_id', userId)
    .single()

  const plan: Plan = (data?.plan as Plan) ?? 'free'
  const status: SubscriptionStatus = (data?.status as SubscriptionStatus) ?? 'trial'

  const isActive =
    status === 'active' ||
    (status === 'trial' && data?.trial_ends_at
      ? new Date(data.trial_ends_at) > new Date()
      : false)

  const canAccessUnlimited = isActive && (plan === 'pro' || plan === 'elite')

  const dailyLimit = plan === 'starter' ? 30 : 5

  return { plan, status, isActive, canAccessUnlimited, dailyLimit }
}
