import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Toast } from '../components/Toast';
import { checklistItems, checklistPhases } from '../content/checklist';
import { haptic } from '../lib/eitaa';
import { useMode } from '../lib/mode';
import { readJSON, writeJSON } from '../lib/storage';
import { useToast } from '../lib/useToast';
import { toFa } from '../lib/fa';

const STORAGE_KEY = 'emdad.checklist';

export function ChecklistScreen() {
  const { mode } = useMode();
  const { message, show } = useToast();
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    readJSON<Record<string, boolean>>(STORAGE_KEY, {}),
  );

  const items = checklistItems.filter((item) => mode === 'pro' || !item.proOnly);
  const doneCount = items.filter((item) => checked[item.id]).length;
  const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJSON(STORAGE_KEY, next);
      return next;
    });
    haptic('select');
  };

  const reset = () => {
    setChecked({});
    writeJSON(STORAGE_KEY, {});
    show('چک‌لیست بازنشانی شد');
    haptic('success');
  };

  return (
    <>
      <div>
        <h1 className="page-title">چک‌لیست اقدامات</h1>
        <p className="page-sub">
          اقدامات صحنه را به ترتیب اولویت انجام دهید و موارد انجام‌شده را علامت بزنید.
        </p>
      </div>

      <div className="progress-card">
        <div className="progress-top">
          <div>
            {toFa(doneCount)} از {toFa(items.length)} مورد انجام شد
          </div>
          <span>{toFa(percent)}٪</span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span className="small muted">
            {mode === 'pro' ? 'چک‌لیست کامل امدادگر فعال است.' : '۵ مورد تخصصی در حالت امدادگر اضافه می‌شود.'}
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            بازنشانی
          </button>
        </div>
      </div>

      <div className="callout callout-blue">
        <Icon name="info" size={18} />
        <div>
          اگر مصدوم هوشیار نیست و تنفس طبیعی ندارد، این چک‌لیست را رها کنید و فوراً CPR را شروع کنید؛ همان لحظه
          باید ۱۱۵ خبر شود.
        </div>
      </div>

      {checklistPhases.map((phase) => {
        const phaseItems = items.filter((item) => item.phase === phase);
        if (!phaseItems.length) return null;
        return (
          <section key={phase} className="section">
            <div className="section-head">
              <h2 className="section-title phase-title">{phase}</h2>
              <span className="small muted">
                {toFa(phaseItems.filter((i) => checked[i.id]).length)} از {toFa(phaseItems.length)}
              </span>
            </div>
            <div className="list">
              {phaseItems.map((item) => {
                const done = Boolean(checked[item.id]);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`check-item ${done ? 'done' : ''}`}
                    aria-pressed={done}
                    onClick={() => toggle(item.id)}
                  >
                    <span className="check-box" aria-hidden="true">
                      <Icon name="check" size={14} />
                    </span>
                    <span className="check-text">
                      {item.text}
                      {item.proOnly && <span className="check-tag">ویژه امدادگر</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <Toast message={message} />
    </>
  );
}
