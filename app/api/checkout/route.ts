import { NextRequest, NextResponse } from 'next/server'

const ASAAS_BASE = 'https://sandbox.asaas.com/api/v3'

const PLAN_PRICES: Record<string, number> = {
  Starter: 37,
  Pro: 97,
  Elite: 187,
}

async function asaasPost(path: string, body: object) {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      access_token: process.env.ASAAS_API_KEY!,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.errors?.[0]?.description ?? 'Asaas error')
  return data
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, cpf, plan } = await req.json()

    const price = PLAN_PRICES[plan]
    if (!price) {
      return NextResponse.json({ success: false, error: 'Plano inválido' }, { status: 400 })
    }

    const customer = await asaasPost('/customers', {
      name,
      email,
      cpfCnpj: cpf.replace(/\D/g, ''),
    })

    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14)
    const nextDueDate = trialEnd.toISOString().split('T')[0]

    const subscription = await asaasPost('/subscriptions', {
      customer: customer.id,
      billingType: 'CREDIT_CARD',
      value: price,
      nextDueDate,
      cycle: 'MONTHLY',
      description: `ResidentePath — Plano ${plan}`,
    })

    return NextResponse.json({ success: true, subscriptionId: subscription.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
