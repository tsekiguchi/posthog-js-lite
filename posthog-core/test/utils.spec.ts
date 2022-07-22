import { assert, removeTrailingSlash, generateUUID, currentISOTime, currentTimestamp, isUndefined } from '../src/utils'

describe('utils', () => {
  describe('assert', () => {
    it('should throw on falsey values', () => {
      ;[false, '', null, undefined, 0].forEach((x) => {
        expect(() => assert(x, 'error')).toThrow('error')
      })
    })
    it('should not throw on truthy values', () => {
      ;[true, 'string', 1, {}].forEach((x) => {
        expect(() => assert(x, 'error')).not.toThrow('error')
      })
    })
  })
  describe('removeTrailingSlash', () => {
    it('should removeSlashes', () => {
      expect(removeTrailingSlash('me////')).toEqual('me')
      expect(removeTrailingSlash('me/wat///')).toEqual('me/wat')
      expect(removeTrailingSlash('me/')).toEqual('me')
      expect(removeTrailingSlash('/me')).toEqual('/me')
    })
  })
  describe.skip('retriable', () => {
    it('should do something', () => {})
  })
  describe('generateUUID', () => {
    it('should generate something that looks like a UUID', () => {
      const REGEX = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

      for (let i = 0; i < 1000; i++) {
        expect(generateUUID(globalThis)).toMatch(REGEX)
      }
    })
  })
  describe('currentTimestamp', () => {
    it('should get the timestamp', () => {
      expect(currentTimestamp()).toEqual(Date.now())
    })
  })
  describe('currentISOTime', () => {
    it('should get the iso time', () => {
      jest.setSystemTime(new Date('2022-01-01'))
      expect(currentISOTime()).toEqual('2022-01-01T00:00:00.000Z')
    })
  })
  describe('isUndefined', () => {
    it('should do something', () => {
      let t: any
      expect(isUndefined(undefined)).toEqual(true)
      expect(isUndefined(t)).toEqual(true)

      expect(isUndefined(false)).toEqual(false)
      expect(isUndefined(null)).toEqual(false)
      expect(isUndefined('undefined')).toEqual(false)
      expect(isUndefined(0)).toEqual(false)
      expect(isUndefined([])).toEqual(false)
    })
  })
})
