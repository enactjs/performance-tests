const reportWebVitals = onPerfEntry => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      import('web-vitals').then(({ onINP, onFCP, onLCP }) => {
        onINP(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
      });
    }
  };

export default reportWebVitals;
