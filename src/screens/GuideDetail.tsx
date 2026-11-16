import { useState } from 'react';
import { CprTimer } from '../components/CprTimer';
import { Icon } from '../components/Icon';
import { MotionGraphic } from '../components/MotionGraphic';
import { guideById, type GuideStep } from '../content/guides';
import { haptic } from '../lib/eitaa';
import { useMode } from '../lib/mode';
import { useNav } from '../lib/nav';
import { toFa } from '../lib/fa';

function StepCard({ step, index }: { step: GuideStep; index: number }) {
  const { mode } = useMode();
  return (
    <li className="step">
      <span className="step-num">{toFa(index + 1)}</span>
      <div className="step-body">
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        {step.motion && <MotionGraphic scene={step.motion} />}
        {mode === 'pro' && step.pro && (
          <div className="pro-note">
            <Icon name="shield" size={14} />
            <span>{step.pro}</span>
          </div>
        )}
        {step.timer && <CprTimer />}
      </div>
    </li>
  );
}

export function GuideDetail({ id }: { id: string }) {
  const guide = guideById(id);
  const go = useNav();
  const { mode, setMode } = useMode();
  const [variantId, setVariantId] = useState(guide?.variants?.[0]?.id ?? '');

  if (!guide) {
    return (
      <div className="card center">
        <p>این راهنما پیدا نشد.</p>
        <button type="button" className="btn btn-primary" onClick={() => go({ name: 'guides' })}>
          بازگشت به فهرست
        </button>
      </div>
    );
  }

  const variant = guide.variants?.find((v) => v.id === variantId) ?? guide.variants?.[0];
  const steps = guide.variants ? variant?.steps ?? [] : guide.steps ?? [];

  return (
    <>
      <section className={`guide-hero tone-${guide.tone}`}>
        <div className="guide-hero-icon">
          <Icon name={guide.icon} size={27} />
        </div>
        <h1>{guide.title}</h1>
        <p>{guide.short}</p>
        <div className="tag-row">
          {guide.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          <span className="tag">
            <Icon name={mode === 'pro' ? 'shield' : 'user'} size={11} />
            حالت {mode === 'pro' ? 'امدادگر' : 'عمومی'}
          </span>
        </div>
      </section>

      {guide.warning && (
        <div className="callout callout-red">
          <Icon name="alert" size={18} />
          <div>{guide.warning}</div>
        </div>
      )}

      {guide.callNote && (
        <div className="callout callout-blue">
          <Icon name="phone" size={17} />
          <div>{guide.callNote}</div>
        </div>
      )}

      {guide.variants && (
        <div className="tabs" role="tablist" aria-label="انتخاب سن مصدوم">
          {guide.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={variant?.id === v.id}
              className={`tab ${variant?.id === v.id ? 'active' : ''}`}
              onClick={() => {
                setVariantId(v.id);
                haptic('select');
              }}
            >
              {v.label}
              {v.hint && <small>{v.hint}</small>}
            </button>
          ))}
        </div>
      )}

      <section className="section" aria-labelledby="steps-title">
        <div className="section-head">
          <h2 className="section-title" id="steps-title">
            مراحل اقدام
          </h2>
          {variant?.hint && <span className="small muted">{variant.hint}</span>}
        </div>
        <ol className="steps">
          {steps.map((step, i) => (
            <StepCard key={`${variant?.id ?? 'base'}-${step.title}`} step={step} index={i} />
          ))}
        </ol>
      </section>

      <section className="card">
        <h2 className="section-title" style={{ marginBottom: 10 }}>
          این کارها را نکنید
        </h2>
        <ul className="donts">
          {guide.donts.map((item) => (
            <li key={item}>
              <Icon name="close" size={15} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {mode === 'pro' ? (
        <section className="card">
          <h2 className="section-title" style={{ marginBottom: 10 }}>
            نکات ویژه امدادگر
          </h2>
          <ul className="tips">
            {guide.proTips.map((tip) => (
              <li key={tip}>
                <Icon name="check" size={15} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="pro-gate">
          <span className="q-icon">
            <Icon name="shield" size={20} />
          </span>
          <p>
            جزئیات تخصصی، نکات بالینی و اقدامات پیشرفته در «حالت امدادگر» نمایش داده می‌شود.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setMode('pro');
              haptic('success');
            }}
          >
            فعال‌سازی
          </button>
        </div>
      )}

      <div className="bottom-cta">
        <a className="btn btn-primary" href="tel:115" onClick={() => haptic('heavy')}>
          <Icon name="phone" size={18} /> تماس با ۱۱۵
        </a>
        <button type="button" className="btn btn-ghost" onClick={() => go({ name: 'numbers' })}>
          شماره‌های اضطراری
        </button>
      </div>
    </>
  );
}
