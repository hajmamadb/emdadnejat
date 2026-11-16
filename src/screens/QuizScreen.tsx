import { useState } from 'react';
import { Icon } from '../components/Icon';
import { pickQuestions, type QuizQuestion } from '../content/quiz';
import { toFa } from '../lib/fa';
import { haptic } from '../lib/eitaa';
import { useNav } from '../lib/nav';
import { readJSON, writeJSON } from '../lib/storage';

const LETTERS = ['الف', 'ب', 'پ', 'ت'];
const BEST_KEY = 'emdad.quiz.best';

interface Answer {
  qid: string;
  chosen: number;
}

const computeScore = (questions: QuizQuestion[], answers: Answer[]): number =>
  answers.reduce((total, answer) => {
    const question = questions.find((q) => q.id === answer.qid);
    return total + (question && answer.chosen === question.correct ? 1 : 0);
  }, 0);

export function QuizScreen() {
  const go = useNav();
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => pickQuestions(10));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number>(() => readJSON<number>(BEST_KEY, 0));

  const question = questions[index];
  const score = computeScore(questions, answers);

  const choose = (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    setAnswers((prev) => [...prev, { qid: question.id, chosen: choice }]);
    haptic(choice === question.correct ? 'success' : 'error');
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const finalScore = computeScore(questions, answers);
      if (finalScore > best) {
        setBest(finalScore);
        writeJSON(BEST_KEY, finalScore);
      }
      setFinished(true);
      haptic('success');
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    haptic('light');
  };

  const restart = () => {
    setQuestions(pickQuestions(10));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    haptic('light');
  };

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    const wrong = answers
      .map((answer) => ({
        question: questions.find((q) => q.id === answer.qid),
        chosen: answer.chosen,
      }))
      .filter((entry): entry is { question: QuizQuestion; chosen: number } => Boolean(entry.question))
      .filter((entry) => entry.chosen !== entry.question.correct);

    const verdict =
      percent >= 80
        ? 'آمادگی خوبی دارید؛ اطلاعات کلیدی را می‌شناسید.'
        : percent >= 50
          ? 'پایه خوبی دارید؛ با مرور راهنماها نتیجه بهتر می‌شود.'
          : 'پیشنهاد می‌کنیم راهنماهای کمک‌های اولیه را مرور کنید و دوباره آزمون بدهید.';

    return (
      <>
        <div>
          <h1 className="page-title">نتیجه آزمون</h1>
          <p className="page-sub">این آزمون جنبه آموزشی دارد و جایگزین دوره رسمی نیست.</p>
        </div>

        <section className="card center">
          <div
            className="result-ring"
            style={{ background: `conic-gradient(var(--red) ${percent}%, #e9eef4 0)` }}
          >
            <div className="result-ring-inner">
              <div>
                <strong>{toFa(score)}</strong>
                <br />
                <span>از {toFa(questions.length)}</span>
              </div>
            </div>
          </div>
          <p style={{ margin: '8px 0 2px', fontWeight: 700 }}>{verdict}</p>
          <p className="small muted" style={{ margin: 0 }}>
            بهترین نتیجه شما: {toFa(best)} از {toFa(questions.length)}
          </p>
        </section>

        {wrong.length > 0 && (
          <section className="card">
            <h2 className="section-title" style={{ marginBottom: 10 }}>
              مرور پاسخ‌های نادرست
            </h2>
            {wrong.map(({ question: q, chosen }) => (
              <div className="review-item" key={q.id}>
                <strong>{q.question}</strong>
                <div>پاسخ شما: {q.options[chosen]}</div>
                <div className="correct-line">پاسخ درست: {q.options[q.correct]}</div>
                <div className="muted">{q.why}</div>
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={restart}>
            <Icon name="quiz" size={17} /> آزمون دوباره
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => go({ name: 'guides' })}>
            <Icon name="book" size={17} /> مرور راهنماها
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <h1 className="page-title">آزمون آموزشی</h1>
        <p className="page-sub">۱۰ سؤال کوتاه از مبانی کمک‌های اولیه؛ پاسخ درست همراه توضیح نمایش داده می‌شود.</p>
      </div>

      <div className="quiz-head">
        <span>
          سؤال {toFa(index + 1)} از {toFa(questions.length)}
        </span>
        <span>بهترین: {toFa(best)}</span>
      </div>
      <div className="progress-bar" aria-hidden="true">
        <span style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <section className="card">
        <p className="quiz-question">{question.question}</p>
        <div className="quiz-options" role="group" aria-label="گزینه‌ها">
          {question.options.map((option, i) => {
            const state =
              selected === null ? '' : i === question.correct ? 'correct' : i === selected ? 'wrong' : '';
            return (
              <button
                key={option}
                type="button"
                className={`quiz-option ${state}`}
                onClick={() => choose(i)}
                disabled={selected !== null}
              >
                <span className="letter">{LETTERS[i]}</span>
                <span>{option}</span>
                {state === 'correct' && <Icon name="check" size={17} style={{ marginInlineStart: 'auto' }} />}
                {state === 'wrong' && <Icon name="close" size={17} style={{ marginInlineStart: 'auto' }} />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <>
            <div className="explain" style={{ marginTop: 10 }}>
              <strong>{selected === question.correct ? 'پاسخ درست است. ' : 'پاسخ درست: '}</strong>
              {selected !== question.correct && <>{question.options[question.correct]}. </>}
              {question.why}
            </div>
            <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 10 }} onClick={next}>
              {index + 1 >= questions.length ? 'دیدن نتیجه' : 'سؤال بعد'}
              <Icon name="chevron-left" size={16} />
            </button>
          </>
        )}
      </section>
    </>
  );
}
