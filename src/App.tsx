import { useCallback, useEffect, useState } from 'react';
import { Icon } from './components/Icon';
import { guideById } from './content/guides';
import { haptic, initEitaa, setNavBack } from './lib/eitaa';
import { ModeProvider } from './lib/mode';
import { NavContext } from './lib/nav';
import { navigate, parentOf, parseHash, type Route } from './lib/router';
import { AboutScreen } from './screens/AboutScreen';
import { ChecklistScreen } from './screens/ChecklistScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { GuideDetail } from './screens/GuideDetail';
import { GuidesScreen } from './screens/GuidesScreen';
import { Home } from './screens/Home';
import { NumbersScreen } from './screens/NumbersScreen';
import { QuizScreen } from './screens/QuizScreen';
import { RequestScreen } from './screens/RequestScreen';

function TopBar({ route, onNavigate }: { route: Route; onNavigate: (route: Route) => void }) {
  if (route.name === 'home') {
    return (
      <header className="topbar">
        <div className="brand">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={40} height={40} />
          <div>
            <div className="brand-name">امداد یار</div>
            <div className="brand-sub">هر ایرانی، یک امدادگر</div>
          </div>
        </div>
        <button
          type="button"
          className="sos-btn"
          aria-label="کمک فوری، تماس با ۱۱۵"
          onClick={() => onNavigate({ name: 'emergency' })}
        >
          <Icon name="phone" size={16} /> ۱۱۵
        </button>
      </header>
    );
  }

  let title = '';
  switch (route.name) {
    case 'guides':
      title = 'راهنمای کمک‌های اولیه';
      break;
    case 'guide':
      title = guideById(route.id)?.title ?? 'راهنمای کمک‌های اولیه';
      break;
    case 'emergency':
      title = 'کمک فوری';
      break;
    case 'numbers':
      title = 'شماره‌های اضطراری';
      break;
    case 'request':
      title = 'درخواست امداد';
      break;
    case 'checklist':
      title = 'چک‌لیست اقدامات';
      break;
    case 'quiz':
      title = 'آزمون آموزشی';
      break;
    case 'about':
      title = 'درباره و راهنما';
      break;
    default:
      title = 'امداد یار';
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn"
        aria-label="بازگشت"
        onClick={() => onNavigate(parentOf(route))}
      >
        <Icon name="chevron-right" size={20} />
      </button>
      <div className="top-title">{title}</div>
      <button
        type="button"
        className="sos-btn"
        aria-label="کمک فوری، تماس با ۱۱۵"
        onClick={() => onNavigate({ name: 'emergency' })}
      >
        <Icon name="phone" size={16} /> ۱۱۵
      </button>
    </header>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    initEitaa();
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const go = useCallback((next: Route) => {
    haptic('light');
    navigate(next);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setNavBack(route.name !== 'home', () => {
      haptic('light');
      navigate(parentOf(route));
    });
  }, [route]);

  const renderScreen = () => {
    switch (route.name) {
      case 'home':
        return <Home />;
      case 'guides':
        return <GuidesScreen />;
      case 'guide':
        return <GuideDetail key={route.id} id={route.id} />;
      case 'emergency':
        return <EmergencyScreen />;
      case 'numbers':
        return <NumbersScreen />;
      case 'request':
        return <RequestScreen />;
      case 'checklist':
        return <ChecklistScreen />;
      case 'quiz':
        return <QuizScreen />;
      case 'about':
        return <AboutScreen />;
      default:
        return <Home />;
    }
  };

  return (
    <ModeProvider>
      <NavContext.Provider value={go}>
        <div className="app">
          <TopBar route={route} onNavigate={go} />
          <main className="content">{renderScreen()}</main>
        </div>
      </NavContext.Provider>
    </ModeProvider>
  );
}
