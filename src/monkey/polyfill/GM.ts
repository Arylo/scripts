/// <reference path="../../../types/monkey.d.ts" />

const thisGlobal = window

if (typeof thisGlobal.GM === 'undefined') {
  thisGlobal.GM = {} as any
}

export function getGMWindow () { return thisGlobal }

