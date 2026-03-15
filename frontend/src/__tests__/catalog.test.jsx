import { describe, it, expect } from 'vitest'

describe('catalog basic', () => {
  it('money formatting sanity', () => {
    const n = Number(12.5)
    expect(n.toFixed(2)).toBe('12.50')
  })
})

