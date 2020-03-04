import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./App.css";

const SlideUp = ({ on, onEnd, children, ...rest }) => {
  const timeout = 500;

  return (
    <CSSTransition
      classNames="slide-up"
      timeout={timeout}
      // timeout={{enter: timeout, exit: 0}} -or- exit={false}
      {...rest}
      exit={false}
    >
      <div className="slide-up" style={{ transitionDuration: `${timeout}ms` }}>
        {children}
      </div>
    </CSSTransition>
  );
};

const Multiple = ({ on, factory }) => {
  const [items, setItems] = React.useState([]);
  const lock = React.useRef(false);
  const id = React.useRef(0);

  if (on) {
    if (!lock.current) {
      const key = id.current++;
      const removeItem = () => {
        lock.current = true;
        setItems(old => old.filter(x => x[0] !== key));
      };
      const Component = factory(removeItem);
      lock.current = true;
      setItems(old => old.concat([[key, Component]]));
    } else {
      lock.current = false;
    }
  }

  return (
    <TransitionGroup>
      {items.map(([key, Component]) => (
        <Component key={key} />
      ))}
    </TransitionGroup>
  );
};

function App() {
  const [count, setCount] = React.useState(0);
  const increment = React.useCallback(
    ev => {
      ev.preventDefault();
      setCount(x => x + 1);
    },
    [setCount]
  );

  return (
    <div className="App">
      <header className="App-header">
        <p>Counter: {count}.</p>
        <a href="/" className="App-link" onClick={increment}>
          Learn React
          <Multiple
            on={count > 0}
            factory={remove => props => (
              <SlideUp {...props} on={count > 0} onEntered={remove}>
                Learn React
              </SlideUp>
            )}
          />
        </a>
      </header>
    </div>
  );
}

export default App;
