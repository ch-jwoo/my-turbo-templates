'use client';

/**
 * Test page for validating internal packages:
 * - @repo/react-jit (React components - just-in-time)
 * - @repo/node-compiled (utility functions - compiled)
 * - @repo/node-jit (Node.js utilities - just-in-time)
 */

import { Button } from '@repo/react-jit/button';
import { Card } from '@repo/react-jit/card';
import { add, multiply, sum } from '@repo/node-compiled';
import { logger } from '@repo/node-jit/logger';
import { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

  // Test node-jit package
  logger.info('test-nextjs page loaded');

  // Test node-compiled package
  const mathResults = {
    addition: add(5, 3),
    multiplication: multiply(4, 7),
    sum: sum([1, 2, 3, 4, 5]),
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>
        Turborepo Package Testing
      </h1>

      {/* Test @repo/react-jit components */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>@repo/react-jit Components</h2>

        <Card>
          <h3>Button Component Test</h3>
          <p style={{ marginBottom: '1rem' }}>
            Counter: <strong>{count}</strong>
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => setCount(count + 1)}
            >
              Primary Button
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCount(count + 1)}
            >
              Secondary Button
            </Button>
            <Button
              variant="outline"
              onClick={() => setCount(0)}
            >
              Reset
            </Button>
          </div>
        </Card>
      </section>

      {/* Test @repo/node-compiled utilities */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>@repo/node-compiled Utilities</h2>

        <Card>
          <h3>Math Operations</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <code>add(5, 3)</code> = <strong>{mathResults.addition}</strong>
            </li>
            <li>
              <code>multiply(4, 7)</code> = <strong>{mathResults.multiplication}</strong>
            </li>
            <li>
              <code>sum([1,2,3,4,5])</code> = <strong>{mathResults.sum}</strong>
            </li>
          </ul>
        </Card>
      </section>

      {/* Test status */}
      <section>
        <Card>
          <h3>✅ Package Import Test Results</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>@repo/react-jit/button - <strong>Working</strong></li>
            <li>@repo/react-jit/card - <strong>Working</strong></li>
            <li>@repo/node-compiled - <strong>Working</strong></li>
            <li>@repo/node-jit/logger - <strong>Working</strong></li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
