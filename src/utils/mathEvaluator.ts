// Robust Mathematical Expression Evaluator with Degree/Radian support

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial input');
  if (n > 170) return Infinity; // JS max float limit
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function evaluateExpression(expr: string, angleMode: 'DEG' | 'RAD' = 'DEG'): number {
  if (!expr || expr.trim() === '') return 0;

  // Clean and prepare the expression
  let clean = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');

  // Handle factorial n!
  // Replace patterns like (expr)! or number! with fact(number)
  clean = clean.replace(/(\d+(\.\d+)?|\([^()]+\))!/g, (_, match) => {
    return `factorial(${match})`;
  });

  // Handle percent %
  // E.g., "100 + 10%" -> "100 + (100 * 0.10)"
  clean = clean.replace(/([0-9.]+)\s*([\+\-])\s*([0-9.]+)%/g, '($1 $2 ($1 * $3 / 100))');
  // E.g. "200 * 15%" -> "200 * 0.15"
  clean = clean.replace(/([0-9.]+)%/g, '($1 / 100)');

  // Handle powers: x^y -> Math.pow(x, y)
  // Simple regex for binary power
  while (clean.includes('^')) {
    const powerRegex = /([0-9.eE]+|\([^()]+\))\^([0-9.eE]+|\([^()]+\))/;
    const match = clean.match(powerRegex);
    if (!match) break;
    clean = clean.replace(match[0], `Math.pow(${match[1]},${match[2]})`);
  }

  // Handle trigonometric functions considering DEG/RAD
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;

  const sinFn = (x: number) => Math.sin(angleMode === 'DEG' ? degToRad(x) : x);
  const cosFn = (x: number) => {
    if (angleMode === 'DEG' && (Math.abs(x % 360) === 90 || Math.abs(x % 360) === 270)) return 0;
    return Math.cos(angleMode === 'DEG' ? degToRad(x) : x);
  };
  const tanFn = (x: number) => {
    if (angleMode === 'DEG' && (Math.abs(x % 180) === 90)) throw new Error('Undefined');
    return Math.tan(angleMode === 'DEG' ? degToRad(x) : x);
  };
  const asinFn = (x: number) => {
    const rad = Math.asin(x);
    return angleMode === 'DEG' ? radToDeg(rad) : rad;
  };
  const acosFn = (x: number) => {
    const rad = Math.acos(x);
    return angleMode === 'DEG' ? radToDeg(rad) : rad;
  };
  const atanFn = (x: number) => {
    const rad = Math.atan(x);
    return angleMode === 'DEG' ? radToDeg(rad) : rad;
  };

  const lnFn = (x: number) => {
    if (x <= 0) throw new Error('Log domain error');
    return Math.log(x);
  };
  const log10Fn = (x: number) => {
    if (x <= 0) throw new Error('Log domain error');
    return Math.log10(x);
  };
  const sqrtFn = (x: number) => {
    if (x < 0) throw new Error('Negative root error');
    return Math.sqrt(x);
  };
  const cbrtFn = (x: number) => Math.cbrt(x);

  // Substitute function tokens
  clean = clean
    .replace(/\basin\b/g, 'asinFn')
    .replace(/\bacos\b/g, 'acosFn')
    .replace(/\batan\b/g, 'atanFn')
    .replace(/\bsin\b/g, 'sinFn')
    .replace(/\bcos\b/g, 'cosFn')
    .replace(/\btan\b/g, 'tanFn')
    .replace(/\bln\b/g, 'lnFn')
    .replace(/\blog\b/g, 'log10Fn')
    .replace(/√/g, 'sqrtFn')
    .replace(/\bsqrt\b/g, 'sqrtFn')
    .replace(/∛/g, 'cbrtFn')
    .replace(/\bcbrt\b/g, 'cbrtFn')
    .replace(/\babs\b/g, 'Math.abs');

  // Validate allowed characters to prevent arbitrary code injection
  const allowedChars = /^[0-9+\-*/()., eEMathPIfactorialdegToRadradToDegsinFncosFntanFnasinFnacosFnat anFnlnFnlog10FnsqrtFncbrtFn_]+$/;
  // Test sanitized
  if (!/^[0-9+\-*/()., eEMathPIfactorialsinFncosFntanFnasinFnacosFnatanFnlnFnlog10FnsqrtFncbrtFn]+$/.test(clean)) {
    // Check if it's safe
    const sanitizedCheck = clean.replace(/Math\.(PI|E|abs|pow)|factorial|sinFn|cosFn|tanFn|asinFn|acosFn|atanFn|lnFn|log10Fn|sqrtFn|cbrtFn/g, '');
    if (!/^[0-9+\-*/().,\s]+$/.test(sanitizedCheck)) {
      throw new Error('Invalid characters in expression');
    }
  }

  // Safe evaluation using Function with isolated scope
  const evalFunc = new Function(
    'factorial',
    'sinFn',
    'cosFn',
    'tanFn',
    'asinFn',
    'acosFn',
    'atanFn',
    'lnFn',
    'log10Fn',
    'sqrtFn',
    'cbrtFn',
    `"use strict"; return (${clean});`
  );

  const result = evalFunc(
    factorial,
    sinFn,
    cosFn,
    tanFn,
    asinFn,
    acosFn,
    atanFn,
    lnFn,
    log10Fn,
    sqrtFn,
    cbrtFn
  );

  if (typeof result !== 'number' || isNaN(result)) {
    throw new Error('Math error');
  }

  return result;
}
