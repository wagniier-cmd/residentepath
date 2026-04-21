'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [authModal, setAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login')
  const [checkoutModal, setCheckoutModal] = useState(false)
  const [checkoutPlan, setCheckoutPlan] = useState({ name: '', price: 0 })
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [paymentType, setPaymentType] = useState<'card' | 'pix' | 'boleto'>('card')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', cpf: '' })

  function openCheckout(name: string, price: number) {
    setCheckoutPlan({ name, price })
    setCheckoutStep(1)
    setCheckoutModal(true)
    setCheckoutError('')
    setFormData({ name: '', email: '', cpf: '' })
  }

  async function handleFinalize() {
    setCheckoutLoading(true)
    setCheckoutError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan: checkoutPlan.name }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Erro ao processar')
      setCheckoutStep(3)
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .lp * { box-sizing: border-box; }
        .lp { font-family: 'DM Sans', sans-serif; color: #0f172a; background: #fff; overflow-x: hidden; }
        :root { --navy:#1E3A5F;--navy-dark:#0f1f35;--accent:#3B82F6;--correct:#22C55E;--gold:#F59E0B;--muted:#64748b;--border:#e2e8f0;--bg2:#f8fafc; }

        /* NAV */
        .lp-nav { position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 5%;height:68px;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(30,58,95,0.08); }
        .lp-logo { display:flex;align-items:center;gap:10px;text-decoration:none; }
        .lp-logo-icon { width:36px;height:36px;background:#1E3A5F;border-radius:10px;display:flex;align-items:center;justify-content:center; }
        .lp-logo-text { font-size:17px;font-weight:600;color:#1E3A5F;letter-spacing:-0.3px; }
        .lp-nav-links { display:flex;align-items:center;gap:8px; }
        .lp-nav-link { padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;color:#64748b;text-decoration:none;transition:all .15s; }
        .lp-nav-link:hover { color:#1E3A5F;background:#f8fafc; }
        .lp-nav-btn { padding:9px 18px;border:1.5px solid #e2e8f0;color:#1E3A5F;border-radius:10px;font-size:14px;font-weight:500;background:none;cursor:pointer;transition:all .15s; }
        .lp-nav-btn:hover { border-color:#1E3A5F;background:#EFF6FF; }
        .lp-nav-cta { padding:9px 20px;background:#1E3A5F;color:#fff;border-radius:10px;font-size:14px;font-weight:500;text-decoration:none;transition:all .15s;border:none;cursor:pointer; }
        .lp-nav-cta:hover { background:#0f1f35; }

        /* HERO */
        .lp-hero { min-height:100vh;background:linear-gradient(160deg,#0f1f35 0%,#1E3A5F 45%,#2a5298 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 5% 80px;position:relative;overflow:hidden; }
        .lp-hero::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(59,130,246,.15) 0%,transparent 70%);pointer-events:none; }
        .lp-badge { display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.9);font-size:13px;font-weight:500;padding:6px 16px;border-radius:100px;margin-bottom:32px; }
        .lp-badge-dot { width:6px;height:6px;background:#22C55E;border-radius:50%; }
        .lp-h1 { font-family:'Instrument Serif',serif;font-size:clamp(42px,6vw,76px);color:#fff;line-height:1.05;letter-spacing:-1px;max-width:800px;margin-bottom:24px; }
        .lp-h1 em { font-style:italic;color:#93c5fd; }
        .lp-hero-p { font-size:clamp(16px,2vw,19px);color:rgba(255,255,255,.7);max-width:560px;line-height:1.7;margin-bottom:48px; }
        .lp-hero-actions { display:flex;gap:12px;flex-wrap:wrap;justify-content:center; }
        .lp-btn-white { padding:16px 32px;background:#fff;color:#1E3A5F;border-radius:12px;font-size:15px;font-weight:600;text-decoration:none;border:none;cursor:pointer;transition:all .2s; }
        .lp-btn-white:hover { transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.25); }
        .lp-btn-ghost { padding:16px 32px;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.25);color:#fff;border-radius:12px;font-size:15px;font-weight:500;text-decoration:none;transition:all .2s; }
        .lp-btn-ghost:hover { background:rgba(255,255,255,.18); }
        .lp-hero-stats { display:flex;gap:48px;margin-top:72px;flex-wrap:wrap;justify-content:center; }
        .lp-stat-num { font-size:32px;font-weight:700;color:#fff;font-family:'Instrument Serif',serif; }
        .lp-stat-label { font-size:13px;color:rgba(255,255,255,.5);margin-top:4px; }

        /* SECTIONS */
        .lp-section { padding:96px 5%; }
        .lp-section-bg { padding:96px 5%;background:#f8fafc; }
        .lp-section-dark { padding:96px 5%;background:#1E3A5F; }
        .lp-label { display:inline-block;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#3B82F6;margin-bottom:12px; }
        .lp-label-light { color:#93c5fd; }
        .lp-title { font-family:'Instrument Serif',serif;font-size:clamp(32px,4vw,52px);color:#1E3A5F;line-height:1.1;letter-spacing:-.5px;margin-bottom:16px; }
        .lp-title-white { color:#fff; }
        .lp-sub { font-size:17px;color:#64748b;line-height:1.7;max-width:560px; }
        .lp-sub-white { color:rgba(255,255,255,.6); }
        .lp-center { text-align:center; }
        .lp-center .lp-sub { margin:0 auto; }

        /* PROBLEM */
        .lp-problem-grid { max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center; }
        .lp-problem-cards { display:flex;flex-direction:column;gap:16px; }
        .lp-problem-card { background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px 24px;display:flex;gap:16px;align-items:flex-start; }
        .lp-problem-icon { font-size:24px;flex-shrink:0;margin-top:2px; }
        .lp-problem-card h4 { font-size:15px;font-weight:600;color:#1E3A5F;margin-bottom:4px; }
        .lp-problem-card p { font-size:13px;color:#64748b;line-height:1.6; }

        /* STEPS */
        .lp-steps { max-width:1100px;margin:0 auto; }
        .lp-steps-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:64px; }
        .lp-step { background:#f8fafc;border:1px solid #e2e8f0;border-radius:20px;padding:32px;position:relative;overflow:hidden; }
        .lp-step-num { position:absolute;top:-10px;right:16px;font-family:'Instrument Serif',serif;font-size:80px;color:rgba(30,58,95,.05);line-height:1; }
        .lp-step-icon { width:48px;height:48px;background:#1E3A5F;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:20px; }
        .lp-step h3 { font-size:18px;font-weight:600;color:#1E3A5F;margin-bottom:8px; }
        .lp-step p { font-size:14px;color:#64748b;line-height:1.7; }

        /* FEATURES */
        .lp-features-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:64px auto 0; }
        .lp-feature { background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:28px;transition:all .2s; }
        .lp-feature:hover { background:rgba(255,255,255,.1);transform:translateY(-2px); }
        .lp-feature-icon { font-size:28px;margin-bottom:16px; }
        .lp-feature h3 { font-size:16px;font-weight:600;color:#fff;margin-bottom:8px; }
        .lp-feature p { font-size:13px;color:rgba(255,255,255,.55);line-height:1.7; }
        .lp-tag { display:inline-block;margin-top:12px;font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;background:rgba(34,197,94,.15);color:#4ade80; }
        .lp-tag-pro { background:rgba(245,158,11,.15);color:#fbbf24; }
        .lp-tag-elite { background:rgba(168,85,247,.15);color:#c084fc; }

        /* TESTIMONIALS */
        .lp-testimonials { display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:56px auto 0; }
        .lp-testimonial { background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:28px; }
        .lp-stars { color:#F59E0B;font-size:14px;margin-bottom:16px; }
        .lp-testimonial p { font-size:14px;color:#0f172a;line-height:1.8;margin-bottom:20px;font-style:italic; }
        .lp-author { display:flex;align-items:center;gap:12px; }
        .lp-avatar { width:40px;height:40px;border-radius:50%;background:#1E3A5F;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff; }
        .lp-author-name { font-size:14px;font-weight:600;color:#1E3A5F; }
        .lp-author-role { font-size:12px;color:#64748b; }

        /* PLANS */
        .lp-plans { display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto;align-items:start; }
        .lp-plan { border:1.5px solid #e2e8f0;border-radius:24px;padding:32px;background:#fff;position:relative;transition:all .2s; }
        .lp-plan:hover { box-shadow:0 16px 48px rgba(30,58,95,.1);transform:translateY(-4px); }
        .lp-plan-popular { border-color:#1E3A5F;background:#1E3A5F;transform:scale(1.03);box-shadow:0 24px 64px rgba(30,58,95,.25); }
        .lp-plan-popular:hover { transform:scale(1.03) translateY(-4px); }
        .lp-plan-badge { position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#F59E0B;color:#fff;font-size:11px;font-weight:700;padding:4px 16px;border-radius:100px;white-space:nowrap; }
        .lp-plan-name { font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:8px; }
        .lp-plan-name-w { color:rgba(255,255,255,.6); }
        .lp-price { display:flex;align-items:baseline;gap:4px;margin-bottom:6px; }
        .lp-price-cur { font-size:20px;font-weight:600;color:#1E3A5F;margin-top:6px; }
        .lp-price-cur-w { color:#fff; }
        .lp-price-amt { font-family:'Instrument Serif',serif;font-size:56px;color:#1E3A5F;line-height:1; }
        .lp-price-amt-w { color:#fff; }
        .lp-price-per { font-size:14px;color:#64748b; }
        .lp-price-per-w { color:rgba(255,255,255,.5); }
        .lp-plan-desc { font-size:13px;color:#64748b;margin-bottom:28px;line-height:1.6; }
        .lp-plan-desc-w { color:rgba(255,255,255,.65); }
        .lp-divider { height:1px;background:#e2e8f0;margin-bottom:24px; }
        .lp-divider-w { background:rgba(255,255,255,.15); }
        .lp-features-list { list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:32px; }
        .lp-features-list li { display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#0f172a; }
        .lp-features-list-w li { color:rgba(255,255,255,.85); }
        .lp-check { color:#22C55E;font-size:16px;flex-shrink:0;margin-top:1px; }
        .lp-x { color:#64748b;font-size:16px;flex-shrink:0;margin-top:1px; }
        .lp-x-w { color:rgba(255,255,255,.25); }
        .lp-plan-btn { display:block;width:100%;padding:14px;border-radius:12px;font-size:15px;font-weight:600;text-align:center;cursor:pointer;border:none;transition:all .2s; }
        .lp-plan-btn-outline { background:transparent;border:1.5px solid #e2e8f0;color:#1E3A5F; }
        .lp-plan-btn-outline:hover { border-color:#1E3A5F;background:#EFF6FF; }
        .lp-plan-btn-white { background:#fff;color:#1E3A5F; }
        .lp-plan-btn-white:hover { background:#f0f9ff; }
        .lp-plan-trial { text-align:center;font-size:12px;color:#64748b;margin-top:10px; }
        .lp-plan-trial-w { color:rgba(255,255,255,.45); }

        /* FAQ */
        .lp-faq-list { display:flex;flex-direction:column;gap:12px;max-width:720px;margin:48px auto 0; }
        .lp-faq-item { background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden; }
        .lp-faq-q { width:100%;text-align:left;padding:20px 24px;background:none;border:none;cursor:pointer;font-size:15px;font-weight:500;color:#1E3A5F;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:'DM Sans',sans-serif; }
        .lp-faq-q:hover { background:#f8fafc; }
        .lp-faq-chevron { font-size:20px;color:#64748b;transition:transform .2s;flex-shrink:0; }
        .lp-faq-a { padding:0 24px 20px;font-size:14px;color:#64748b;line-height:1.8; }

        /* CTA FINAL */
        .lp-cta { background:linear-gradient(135deg,#0f1f35 0%,#1E3A5F 100%);text-align:center;padding:96px 5%; }
        .lp-cta h2 { font-family:'Instrument Serif',serif;font-size:clamp(36px,5vw,60px);color:#fff;line-height:1.1;margin-bottom:16px;letter-spacing:-.5px; }
        .lp-cta h2 em { font-style:italic;color:#93c5fd; }
        .lp-cta p { font-size:17px;color:rgba(255,255,255,.65);margin-bottom:40px; }
        .lp-cta-actions { display:flex;gap:12px;justify-content:center;flex-wrap:wrap; }

        /* FOOTER */
        .lp-footer { background:#0f1f35;padding:48px 5%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px; }
        .lp-footer-links { display:flex;gap:24px; }
        .lp-footer-link { font-size:13px;color:rgba(255,255,255,.4);text-decoration:none;transition:color .15s; }
        .lp-footer-link:hover { color:rgba(255,255,255,.8); }
        .lp-footer-copy { font-size:12px;color:rgba(255,255,255,.3); }

        /* MODAL */
        .lp-overlay { position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px; }
        .lp-modal { background:#fff;border-radius:24px;padding:40px;width:100%;max-width:440px;position:relative; }
        .lp-modal-close { position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:8px;border:none;background:#f8fafc;cursor:pointer;font-size:18px;color:#64748b;display:flex;align-items:center;justify-content:center; }
        .lp-modal-close:hover { background:#e2e8f0; }
        .lp-modal-logo { display:flex;align-items:center;gap:10px;margin-bottom:24px; }
        .lp-modal-logo-icon { width:36px;height:36px;background:#1E3A5F;border-radius:10px;display:flex;align-items:center;justify-content:center; }
        .lp-modal-tabs { display:flex;background:#f8fafc;border-radius:10px;padding:4px;margin-bottom:24px;gap:4px; }
        .lp-modal-tab { flex:1;padding:8px;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;background:none;color:#64748b;transition:all .15s;font-family:'DM Sans',sans-serif; }
        .lp-modal-tab-active { background:#fff;color:#1E3A5F;box-shadow:0 1px 4px rgba(0,0,0,.1); }
        .lp-form-group { margin-bottom:16px; }
        .lp-form-label { display:block;font-size:13px;font-weight:500;color:#0f172a;margin-bottom:6px; }
        .lp-form-input { width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;color:#0f172a;outline:none;transition:border-color .15s; }
        .lp-form-input:focus { border-color:#1E3A5F; }
        .lp-modal-btn { width:100%;padding:13px;background:#1E3A5F;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-top:4px;font-family:'DM Sans',sans-serif;transition:all .15s; }
        .lp-modal-btn:hover { background:#0f1f35; }
        .lp-modal-footer { text-align:center;margin-top:16px;font-size:13px;color:#64748b; }
        .lp-modal-footer a { color:#1E3A5F;font-weight:500;text-decoration:none;cursor:pointer; }

        /* CHECKOUT */
        .lp-co-plan { background:#f8fafc;border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px; }
        .lp-co-plan-name { font-size:14px;font-weight:600;color:#1E3A5F; }
        .lp-co-plan-price { font-size:20px;font-weight:700;color:#1E3A5F; }
        .lp-co-plan-period { font-size:12px;color:#64748b; }
        .lp-co-steps { display:flex;align-items:center;gap:8px;margin-bottom:24px; }
        .lp-co-dot { width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700; }
        .lp-co-dot-active { background:#1E3A5F;color:#fff; }
        .lp-co-dot-done { background:#22C55E;color:#fff; }
        .lp-co-dot-inactive { background:#e2e8f0;color:#64748b; }
        .lp-co-line { flex:1;height:1px;background:#e2e8f0; }
        .lp-co-security { display:flex;align-items:center;gap:6px;font-size:11px;color:#64748b;margin-top:16px;justify-content:center; }
        .lp-payment-opt { display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:10px;cursor:pointer;margin-bottom:10px;transition:border-color .15s; }
        .lp-payment-opt-active { border-color:#1E3A5F; }
        .lp-payment-opt label { font-size:14px;font-weight:500;cursor:pointer; }
        .lp-grid2 { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .lp-success { text-align:center;padding:16px 0; }
        .lp-success-icon { width:64px;height:64px;background:#F0FDF4;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px; }

        @media(max-width:768px){
          .lp-problem-grid{grid-template-columns:1fr;gap:40px;}
          .lp-steps-grid{grid-template-columns:1fr;}
          .lp-features-grid{grid-template-columns:1fr;}
          .lp-testimonials{grid-template-columns:1fr;}
          .lp-plans{grid-template-columns:1fr;}
          .lp-plan-popular{transform:none;}
          .lp-nav-links{display:none;}
          .lp-footer{flex-direction:column;}
        }
      `}</style>

      <div className="lp">
        {/* NAV */}
        <nav className="lp-nav">
          <a href="#" className="lp-logo">
            <div className="lp-logo-icon">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v7c0 6.6 5.1 12.7 12 14.2C23 28.7 28 22.6 28 16V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/><path d="M13 16l2.5 2.5L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="lp-logo-text">ResidentePath</span>
          </a>
          <div className="lp-nav-links">
            <a href="#como-funciona" className="lp-nav-link">Como funciona</a>
            <a href="#planos" className="lp-nav-link">Planos</a>
            <a href="#faq" className="lp-nav-link">FAQ</a>
            <button className="lp-nav-btn" onClick={() => { setAuthTab('login'); setAuthModal(true) }}>Entrar</button>
            <a href="#planos" className="lp-nav-cta">Começar grátis</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-badge"><span className="lp-badge-dot"></span> Plataforma USMLE feita para médicos brasileiros</div>
          <h1 className="lp-h1">Sua aprovação no<br/><em>Match começa aqui</em></h1>
          <p className="lp-hero-p">O banco de questões USMLE mais completo em português. Estude com eficiência real e chegue preparado para o dia da prova.</p>
          <div className="lp-hero-actions">
            <a href="#planos" className="lp-btn-white">Começar 14 dias grátis</a>
            <a href="#como-funciona" className="lp-btn-ghost">Ver como funciona →</a>
          </div>
          <div className="lp-hero-stats">
            {[['10.000+','Questões USMLE'],['5.000+','Flashcards'],['3 Steps','Cobertos'],['100%','Em português']].map(([n,l]) => (
              <div key={l} style={{textAlign:'center'}}>
                <div className="lp-stat-num">{n}</div>
                <div className="lp-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEMA */}
        <section className="lp-section-bg">
          <div className="lp-problem-grid">
            <div>
              <span className="lp-label">O problema</span>
              <h2 className="lp-title">Estudar USMLE no Brasil é difícil demais</h2>
              <p className="lp-sub">As plataformas existentes são em inglês, caras em dólar e não entendem a realidade do médico brasileiro.</p>
            </div>
            <div className="lp-problem-cards">
              {[
                ['💸','UWorld custa R$2.000+ por ano','Pagar em dólar com o câmbio atual é proibitivo para a maioria dos residentes.'],
                ['🌐','Tudo em inglês, sem contexto brasileiro','Explicações complexas em inglês aumentam o tempo de estudo.'],
                ['📊','Sem acompanhamento real do progresso','Você não sabe onde está falhando nem como otimizar suas horas.'],
              ].map(([icon,title,desc]) => (
                <div key={title} className="lp-problem-card">
                  <div className="lp-problem-icon">{icon}</div>
                  <div><h4>{title}</h4><p>{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="lp-section" id="como-funciona">
          <div className="lp-steps">
            <div className="lp-center">
              <span className="lp-label">Como funciona</span>
              <h2 className="lp-title">Do cadastro ao Match em 3 passos</h2>
              <p className="lp-sub" style={{margin:'0 auto'}}>Um método de estudo estruturado e adaptado ao seu ritmo.</p>
            </div>
            <div className="lp-steps-grid">
              {[
                ['📝','Pratique questões USMLE','Mais de 10.000 questões com explicações completas em português após cada resposta.','1'],
                ['🃏','Revise com Flashcards SM-2','O algoritmo SM-2 agenda suas revisões no momento ideal — memorize mais em menos tempo.','2'],
                ['📈','Acompanhe seu progresso','Dashboard com estatísticas por especialidade e sequência de dias estudados.','3'],
              ].map(([icon,title,desc,num]) => (
                <div key={title} className="lp-step">
                  <div className="lp-step-num">{num}</div>
                  <div className="lp-step-icon">{icon}</div>
                  <h3>{title}</h3><p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-section-dark" id="funcionalidades">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div className="lp-center">
              <span className="lp-label lp-label-light">Funcionalidades</span>
              <h2 className="lp-title lp-title-white">Tudo que você precisa para passar</h2>
              <p className="lp-sub lp-sub-white" style={{margin:'0 auto'}}>Desenvolvido especificamente para médicos brasileiros.</p>
            </div>
            <div className="lp-features-grid">
              {[
                ['📚','Banco de Questões USMLE','Step 1, 2CK e 3 com filtros por especialidade e dificuldade.','Todos os planos',''],
                ['🧠','Repetição Espaçada SM-2','Algoritmo científico que agenda revisões automaticamente.','Todos os planos',''],
                ['🇧🇷','100% em Português','Questões, explicações e interface inteiramente em português.','Todos os planos',''],
                ['📊','Analytics Avançados','Progresso por especialidade e identificação de pontos fracos.','Pro e Elite','pro'],
                ['🎯','Simulados Completos','Simule o ambiente real com blocos cronometrados.','Em breve — Elite','elite'],
                ['🤖','Plano de Estudos com IA','Plano personalizado baseado no seu Match target e pontos fracos.','Em breve — Elite','elite'],
              ].map(([icon,title,desc,tag,tagClass]) => (
                <div key={title} className="lp-feature">
                  <div className="lp-feature-icon">{icon}</div>
                  <h3>{title}</h3><p>{desc}</p>
                  <span className={`lp-tag ${tagClass === 'pro' ? 'lp-tag-pro' : tagClass === 'elite' ? 'lp-tag-elite' : ''}`}>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="lp-section-bg">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div className="lp-center">
              <span className="lp-label">Depoimentos</span>
              <h2 className="lp-title">O que dizem nossos alunos</h2>
            </div>
            <div className="lp-testimonials">
              {[
                ['AM','Ana Martins','Médica pela USP · Match 2025','"Finalmente uma plataforma USMLE que entende o médico brasileiro. As explicações em português poupam horas de estudo."'],
                ['RL','Rafael Lima','R2 em São Paulo · Alvo Match 2026','"Os flashcards com repetição espaçada são game-changer. Consigo manter o conteúdo fresco mesmo estudando poucas horas por dia."'],
                ['CS','Carla Souza','Médica pela UNICAMP','"O preço em reais faz toda diferença. Mesma qualidade do UWorld pagando muito menos. Vale cada centavo."'],
              ].map(([initials,name,role,quote]) => (
                <div key={name} className="lp-testimonial">
                  <div className="lp-stars">★★★★★</div>
                  <p>{quote}</p>
                  <div className="lp-author">
                    <div className="lp-avatar">{initials}</div>
                    <div><div className="lp-author-name">{name}</div><div className="lp-author-role">{role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section className="lp-section" id="planos">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div className="lp-center">
              <span className="lp-label">Planos</span>
              <h2 className="lp-title">Invista no seu Match</h2>
              <p className="lp-sub" style={{margin:'0 auto 16px'}}>Todos os planos incluem <strong style={{color:'#22C55E'}}>14 dias grátis</strong> — sem cartão de crédito.</p>
            </div>
            <div className="lp-plans" style={{marginTop:'48px'}}>
              {/* Starter */}
              <div className="lp-plan">
                <div className="lp-plan-name">Starter</div>
                <div className="lp-price"><span className="lp-price-cur">R$</span><span className="lp-price-amt">37</span><span className="lp-price-per">/mês</span></div>
                <p className="lp-plan-desc">Perfeito para começar com conteúdo real.</p>
                <div className="lp-divider"></div>
                <ul className="lp-features-list">
                  {['30 questões por dia','20 flashcards por dia','Step 1, 2CK e 3','Explicações em português','Dashboard básico'].map(f => <li key={f}><span className="lp-check">✓</span>{f}</li>)}
                  {['Analytics avançados','Simulados','Plano de estudos IA'].map(f => <li key={f}><span className="lp-x">✕</span><span style={{color:'#94a3b8'}}>{f}</span></li>)}
                </ul>
                <button className="lp-plan-btn lp-plan-btn-outline" onClick={() => openCheckout('Starter', 37)}>Começar grátis</button>
                <p className="lp-plan-trial">14 dias grátis, cancele quando quiser</p>
              </div>

              {/* Pro */}
              <div className="lp-plan lp-plan-popular">
                <div className="lp-plan-badge">⚡ Mais popular</div>
                <div className={`lp-plan-name lp-plan-name-w`}>Pro</div>
                <div className="lp-price"><span className="lp-price-cur lp-price-cur-w">R$</span><span className="lp-price-amt lp-price-amt-w">97</span><span className="lp-price-per lp-price-per-w">/mês</span></div>
                <p className="lp-plan-desc lp-plan-desc-w">Acesso ilimitado para quem leva o Match a sério.</p>
                <div className="lp-divider lp-divider-w"></div>
                <ul className={`lp-features-list lp-features-list-w`}>
                  {['Questões ilimitadas','Flashcards ilimitados','Step 1, 2CK e 3','Explicações em português','Analytics avançados','Progresso por especialidade'].map(f => <li key={f}><span className="lp-check">✓</span>{f}</li>)}
                  {['Simulados completos','Plano de estudos IA'].map(f => <li key={f}><span className="lp-x lp-x-w">✕</span><span style={{color:'rgba(255,255,255,0.3)'}}>{f}</span></li>)}
                </ul>
                <button className="lp-plan-btn lp-plan-btn-white" onClick={() => openCheckout('Pro', 97)}>Começar grátis</button>
                <p className="lp-plan-trial lp-plan-trial-w">14 dias grátis, cancele quando quiser</p>
              </div>

              {/* Elite */}
              <div className="lp-plan">
                <div className="lp-plan-name">Elite</div>
                <div className="lp-price"><span className="lp-price-cur">R$</span><span className="lp-price-amt">187</span><span className="lp-price-per">/mês</span></div>
                <p className="lp-plan-desc">O pacote completo para maximizar suas chances.</p>
                <div className="lp-divider"></div>
                <ul className="lp-features-list">
                  {['Tudo do Pro','Simulados completos','Plano de estudos com IA','Análise pós-simulado','Suporte prioritário','Acesso antecipado a novidades','Comunidade exclusiva','Mentoria em grupo mensal'].map(f => <li key={f}><span className="lp-check">✓</span>{f}</li>)}
                </ul>
                <button className="lp-plan-btn lp-plan-btn-outline" onClick={() => openCheckout('Elite', 187)}>Começar grátis</button>
                <p className="lp-plan-trial">14 dias grátis, cancele quando quiser</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section-bg" id="faq">
          <div style={{maxWidth:'720px',margin:'0 auto'}}>
            <div className="lp-center">
              <span className="lp-label">FAQ</span>
              <h2 className="lp-title">Perguntas frequentes</h2>
            </div>
            <div className="lp-faq-list">
              {[
                ['Preciso de cartão de crédito para o período gratuito?','Não. Os 14 dias grátis não exigem cartão. Você só informa o pagamento quando decidir continuar após o trial.'],
                ['Posso cancelar a qualquer momento?','Sim, sem multa. Você cancela pelo painel da sua conta. O acesso continua até o fim do período pago.'],
                ['As questões são realmente no formato USMLE?','Sim. Todas seguem o formato oficial com vinheta clínica e 5 alternativas (A–E), cobrindo Step 1, 2CK e 3. Explicações em português.'],
                ['Como funciona o pagamento?','Aceitamos cartão, boleto e Pix em reais, processados com segurança pela Asaas. Sem variação cambial.'],
                ['O conteúdo é atualizado?','Sim. Adicionamos novas questões e flashcards regularmente, alinhados com as diretrizes mais recentes do USMLE.'],
              ].map(([q,a],i) => (
                <div key={i} className="lp-faq-item">
                  <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {q}<span className="lp-faq-chevron" style={{transform: openFaq === i ? 'rotate(180deg)' : 'none'}}>⌄</span>
                  </button>
                  {openFaq === i && <div className="lp-faq-a">{a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="lp-cta">
          <h2>Pronto para começar sua<br/><em>jornada ao Match?</em></h2>
          <p>14 dias grátis. Sem cartão de crédito. Cancele quando quiser.</p>
          <div className="lp-cta-actions">
            <a href="#planos" className="lp-btn-white">Criar conta grátis agora</a>
            <button className="lp-btn-ghost" onClick={() => { setAuthTab('login'); setAuthModal(true) }}>Já tenho conta →</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <a href="#" className="lp-logo">
            <div className="lp-logo-icon" style={{width:'28px',height:'28px'}}>
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v7c0 6.6 5.1 12.7 12 14.2C23 28.7 28 22.6 28 16V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/><path d="M13 16l2.5 2.5L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontSize:'16px',fontWeight:600,color:'#fff'}}>ResidentePath</span>
          </a>
          <div className="lp-footer-links">
            <a href="#" className="lp-footer-link">Termos de uso</a>
            <a href="#" className="lp-footer-link">Privacidade</a>
            <a href="#" className="lp-footer-link">Contato</a>
          </div>
          <span className="lp-footer-copy">© 2025 ResidentePath. Todos os direitos reservados.</span>
        </footer>

        {/* MODAL AUTH */}
        {authModal && (
          <div className="lp-overlay" onClick={e => { if (e.target === e.currentTarget) setAuthModal(false) }}>
            <div className="lp-modal">
              <button className="lp-modal-close" onClick={() => setAuthModal(false)}>✕</button>
              <div className="lp-modal-logo">
                <div className="lp-modal-logo-icon"><svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v7c0 6.6 5.1 12.7 12 14.2C23 28.7 28 22.6 28 16V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/><path d="M13 16l2.5 2.5L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <span style={{fontSize:'17px',fontWeight:600,color:'#1E3A5F'}}>ResidentePath</span>
              </div>
              <div className="lp-modal-tabs">
                <button className={`lp-modal-tab ${authTab==='login'?'lp-modal-tab-active':''}`} onClick={() => setAuthTab('login')}>Entrar</button>
                <button className={`lp-modal-tab ${authTab==='signup'?'lp-modal-tab-active':''}`} onClick={() => setAuthTab('signup')}>Criar conta</button>
              </div>
              {authTab === 'login' ? (
                <>
                  <div className="lp-form-group"><label className="lp-form-label">Email</label><input className="lp-form-input" type="email" placeholder="seu@email.com"/></div>
                  <div className="lp-form-group"><label className="lp-form-label">Senha</label><input className="lp-form-input" type="password" placeholder="••••••••"/></div>
                  <button className="lp-modal-btn" onClick={() => router.push('/auth/login')}>Entrar na plataforma</button>
                  <p className="lp-modal-footer">Não tem conta? <a onClick={() => setAuthTab('signup')}>Criar gratuitamente</a></p>
                </>
              ) : (
                <>
                  <div className="lp-form-group"><label className="lp-form-label">Nome completo</label><input className="lp-form-input" type="text" placeholder="Dr. João Silva"/></div>
                  <div className="lp-form-group"><label className="lp-form-label">Email</label><input className="lp-form-input" type="email" placeholder="seu@email.com"/></div>
                  <div className="lp-form-group"><label className="lp-form-label">Senha</label><input className="lp-form-input" type="password" placeholder="Mínimo 8 caracteres"/></div>
                  <button className="lp-modal-btn" onClick={() => router.push('/auth/signup')}>Criar conta grátis</button>
                  <p className="lp-modal-footer">Já tem conta? <a onClick={() => setAuthTab('login')}>Entrar</a></p>
                </>
              )}
            </div>
          </div>
        )}

        {/* MODAL CHECKOUT */}
        {checkoutModal && (
          <div className="lp-overlay" onClick={e => { if (e.target === e.currentTarget) setCheckoutModal(false) }}>
            <div className="lp-modal" style={{maxWidth:'480px'}}>
              <button className="lp-modal-close" onClick={() => setCheckoutModal(false)}>✕</button>
              <div className="lp-modal-logo">
                <div className="lp-modal-logo-icon"><svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v7c0 6.6 5.1 12.7 12 14.2C23 28.7 28 22.6 28 16V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/><path d="M13 16l2.5 2.5L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <span style={{fontSize:'17px',fontWeight:600,color:'#1E3A5F'}}>ResidentePath</span>
              </div>
              <div className="lp-co-plan">
                <div><div className="lp-co-plan-name">Plano {checkoutPlan.name}</div><div className="lp-co-plan-period">Assinatura mensal · 14 dias grátis</div></div>
                <div className="lp-co-plan-price">R${checkoutPlan.price}/mês</div>
              </div>
              <div className="lp-co-steps">
                <div className={`lp-co-dot ${checkoutStep>=1?'lp-co-dot-active':'lp-co-dot-inactive'}`}>1</div>
                <div className="lp-co-line"></div>
                <div className={`lp-co-dot ${checkoutStep>2?'lp-co-dot-done':checkoutStep===2?'lp-co-dot-active':'lp-co-dot-inactive'}`}>2</div>
                <div className="lp-co-line"></div>
                <div className={`lp-co-dot ${checkoutStep===3?'lp-co-dot-done':'lp-co-dot-inactive'}`}>3</div>
              </div>

              {checkoutStep === 1 && (
                <>
                  <h2 style={{fontSize:'18px',marginBottom:'4px',color:'#1E3A5F'}}>Seus dados</h2>
                  <p style={{fontSize:'13px',color:'#64748b',marginBottom:'20px'}}>Crie sua conta para começar os 14 dias grátis.</p>
                  <div className="lp-form-group"><label className="lp-form-label">Nome completo</label><input className="lp-form-input" type="text" placeholder="Dr. João Silva" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))}/></div>
                  <div className="lp-form-group"><label className="lp-form-label">Email</label><input className="lp-form-input" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))}/></div>
                  <div className="lp-form-group"><label className="lp-form-label">CPF</label><input className="lp-form-input" type="text" placeholder="000.000.000-00" value={formData.cpf} onChange={e => setFormData(p => ({...p, cpf: e.target.value}))}/></div>
                  <button className="lp-modal-btn" onClick={() => setCheckoutStep(2)}>Continuar →</button>
                  <div className="lp-co-security">🔒 Dados protegidos com criptografia SSL</div>
                </>
              )}

              {checkoutStep === 2 && (
                <>
                  <h2 style={{fontSize:'18px',marginBottom:'4px',color:'#1E3A5F'}}>Forma de pagamento</h2>
                  <p style={{fontSize:'13px',color:'#64748b',marginBottom:'20px'}}>Você só será cobrado após os 14 dias grátis.</p>
                  {[['card','💳 Cartão de crédito'],['pix','⚡ Pix'],['boleto','🏦 Boleto bancário']].map(([type,label]) => (
                    <div key={type} className={`lp-payment-opt ${paymentType===type?'lp-payment-opt-active':''}`} onClick={() => setPaymentType(type as any)}>
                      <input type="radio" readOnly checked={paymentType===type} style={{accentColor:'#1E3A5F'}}/><label>{label}</label>
                    </div>
                  ))}
                  {paymentType === 'card' && (
                    <>
                      <div className="lp-form-group" style={{marginTop:'12px'}}><label className="lp-form-label">Número do cartão</label><input className="lp-form-input" type="text" placeholder="0000 0000 0000 0000"/></div>
                      <div className="lp-grid2"><div className="lp-form-group"><label className="lp-form-label">Validade</label><input className="lp-form-input" type="text" placeholder="MM/AA"/></div><div className="lp-form-group"><label className="lp-form-label">CVV</label><input className="lp-form-input" type="text" placeholder="123"/></div></div>
                      <div className="lp-form-group"><label className="lp-form-label">Nome no cartão</label><input className="lp-form-input" type="text" placeholder="JOÃO SILVA"/></div>
                    </>
                  )}
                  {checkoutError && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'8px'}}>{checkoutError}</p>}
                  <button className="lp-modal-btn" onClick={handleFinalize} disabled={checkoutLoading}>
                    {checkoutLoading ? 'Processando...' : 'Finalizar assinatura →'}
                  </button>
                  <div className="lp-co-security">🔒 Pagamento processado com segurança pela Asaas</div>
                </>
              )}

              {checkoutStep === 3 && (
                <div className="lp-success">
                  <div className="lp-success-icon">✅</div>
                  <h2 style={{fontSize:'20px',color:'#1E3A5F',marginBottom:'8px'}}>Tudo certo!</h2>
                  <p style={{fontSize:'14px',color:'#64748b',lineHeight:1.7,marginBottom:'24px'}}>Sua assinatura foi criada. Você tem <strong>14 dias grátis</strong>. Enviamos um email de confirmação.</p>
                  <button className="lp-modal-btn" onClick={() => router.push('/auth/signup')}>Acessar a plataforma →</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
