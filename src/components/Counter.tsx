'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-x-2">
      <Button onClick={() => setCount(count > 0 ? count - 1 : count)}>-</Button>
      <span className="font-mono">{count}</span>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </div>
  );
}

export { Counter };
